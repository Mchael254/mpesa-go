import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SystemReportModule, SystemReportSubModule, SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {Logger} from "../../../../../shared/services";
import {ReusableInputComponent} from "../../../../../shared/components/reusable-input/reusable-input.component";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";
import {SystemReportDto} from "../../../../../shared/data/common/reports-dto";
import {NgxSpinnerService} from "ngx-spinner";

const log = new Logger('ReportDefinitionComponent');

@Component({
  selector: 'app-report-definition',
  templateUrl: './report-definition.component.html',
  styleUrls: ['./report-definition.component.css']
})
export class ReportDefinitionComponent implements OnInit {
  sortingForm: FormGroup;
  modulesData: SystemReportModule[];
  selectedModule: SystemReportModule;
  subModuleData: SystemReportSubModule[];
  selectedSubModule: SystemReportSubModule;
  pageSize: 5;
  editMode: boolean = false;
  systems: SystemsDto[];
  defineModuleForm: FormGroup;
  defineSubModuleForm: FormGroup;

  visibleStatus: any = {
    moduleName: 'Y',
    moduleDescription: 'Y',
    system: 'Y',
    subModuleName: 'Y',
    subModuleDescription: 'Y'
  }
  groupId: string = 'reportDefinitionTab';
  allReportsData: SystemReportDto[];
  selectedReport: SystemReportDto[] =[];
  assignedReportsData: SystemReportDto[];
  selectedAssignedReport: SystemReportDto[] =[];
  shouldShowSystems: boolean = false;
  selectedSystem: SystemsDto;

  showInputForReport: any;

  @ViewChild('moduleConfirmationModal')
  moduleConfirmationModal!: ReusableInputComponent;

  reportDescription: string;

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private systemsService: SystemsService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private reportService: ReportsService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.createDefineModuleForm();
    this.createDefineSubModuleForm();
    this.getAllSystems();
  }

  /**
   * Creates the form group for defining a module.
   *
   * Retrieves the mandatory fields for the given group ID and adds validators
   * to the form controls as needed.
   *
   * Additionally, it appends an asterisk to the labels of the controls that are
   * marked as mandatory.
   */
  createDefineModuleForm() {
    this.defineModuleForm = this.fb.group({
      moduleName: '',
      moduleDescription: '',
      system: new FormControl({value: '', disabled: true})
      ,
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.defineModuleForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.defineModuleForm.controls[key].addValidators(Validators.required);
                this.defineModuleForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * Creates the form group for defining a sub-module.
   *
   * Retrieves the mandatory fields for the given group ID and adds validators
   * to the form controls as needed.
   */
  createDefineSubModuleForm() {
    this.defineSubModuleForm = this.fb.group({
      subModuleName: '',
      subModuleDescription: '',
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.defineSubModuleForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.defineSubModuleForm.controls[key].addValidators(Validators.required);
                this.defineSubModuleForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        })
        this.cdr.detectChanges();
      });
  }

  /**
   * Opens the "Define Module" modal. If a system is selected, shows the modal;
   * otherwise, displays an error message.
   */
  openDefineModuleModal() {
    const modal = document.getElementById('moduleDefinitionModal');
    if (modal && this.selectedSystem) {
      modal.classList.add('show');
      modal.style.display = 'block';
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No system is selected!'
      );
    }
  }

  /**
   * Closes the "Define Module" modal.
   */
  closeDefineModuleModal() {
    this.editMode = false;
    const modal = document.getElementById('moduleDefinitionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the sub-module definition modal.
   */
  openSubModuleModal() {
    const modal = document.getElementById('subModuleDefinitionModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Hides the sub-module definition modal.
   */
  closeSubModuleModal() {
    this.editMode = false;
    const modal = document.getElementById('subModuleDefinitionModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Saves the module details. If the form is invalid, the function returns early.
   * The function constructs a payload from the form values and determines whether
   * to create a new module or update an existing one based on the editMode flag.
   * Displays a success message on successful save or an error message on failure.
   */
  saveModuleDetails() {
    this.defineModuleForm.markAllAsTouched();
    if (this.defineModuleForm.invalid) return;

    const moduleFormValues = this.defineModuleForm.getRawValue();
    const moduleCode = !this.editMode ? null : this.selectedModule?.id;

    const saveModulePayload: SystemReportModule = {
      id: moduleCode,
      name: moduleFormValues?.moduleName,
      description: moduleFormValues?.moduleDescription,
      systemCode: this.selectedSystem?.id,
      system: undefined,
    };

    log.info(saveModulePayload);

    const systemsServiceCall = this.selectedModule
      ? this.systemsService.updateSystemReportModule(this.selectedModule.id, saveModulePayload)
      : this.systemsService.createSystemReportModule(saveModulePayload);

    return systemsServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedModule ? 'Successfully updated module' : 'Successfully created module');
        this.defineModuleForm.reset();
        this.closeDefineModuleModal();
        this.getAllSystemReportModules();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving module');
        throw error;
      });
  }

  /**
   * Edit the selected module, and open the define module modal. If no module is selected, display an error message.
   */
  editModule() {
    this.editMode = !this.editMode;
    if (this.selectedModule) {
      this.openDefineModuleModal();
      this.defineModuleForm.patchValue({
        moduleName: this.selectedModule?.name,
        moduleDescription: this.selectedModule?.description,
        system: this.selectedSystem?.systemName
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No module is selected!'
      );
    }
  }

  /**
   * Displays the confirmation modal when attempting to delete a module.
   */
  deleteModule() {
    this.moduleConfirmationModal.show();
  }

  /**
   * The function `confirmBankDelete()` checks if a module is selected, and if so,
   * deletes it and displays a success message, otherwise it displays an error message.
   */
  confirmModuleDelete() {
    if (this.selectedModule) {
      const moduleId = this.selectedModule.id;
      this.systemsService.deleteSystemReportModule(moduleId).subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a module'
          );
          this.selectedModule = null;
          this.getAllSystemReportModules();
        },
        error => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No module is selected!'
      );
    }
  }

  /**
   * Saves the submodule details. If the form is invalid, the function returns early.
   * The function constructs a payload from the form values and determines whether
   * to create a new submodule or update an existing one based on the editMode flag.
   * Displays a success message on successful save or an error message on failure.
   */
  saveSubModuleDetails() {
    this.defineSubModuleForm.markAllAsTouched();
    if (this.defineSubModuleForm.invalid) return;

    const subModuleFormValues = this.defineSubModuleForm.getRawValue();
    const subModuleCode = !this.editMode ? null : this.selectedSubModule?.id;

    const saveSubModulePayload: SystemReportSubModule = {
      id: subModuleCode,
      name: subModuleFormValues?.subModuleName,
      description: subModuleFormValues?.subModuleDescription,
      moduleId: this.selectedModule?.id,
    };

    log.info(saveSubModulePayload);

    const systemsServiceCall = this.selectedSubModule
      ? this.systemsService.updateSystemReportSubModule(this.selectedSubModule.id, saveSubModulePayload)
      : this.systemsService.createSystemReportSubModule(saveSubModulePayload);

    return systemsServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedSubModule ? 'Successfully updated sub module' : 'Successfully created sub module');
        this.defineSubModuleForm.reset();
        this.closeSubModuleModal();
        this.getAllSystemReportSubModules(this.selectedModule?.id);
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving sub module');
        throw error;
      });
  }

  /**
   * Edits the selected submodule, and opens the define submodule modal. If no submodule is selected, display an error message.
   */
  editSubModule() {
    this.editMode = !this.editMode;
    if (this.selectedSubModule) {
      this.openSubModuleModal();
      this.defineSubModuleForm.patchValue({
        subModuleName: this.selectedSubModule?.name,
        subModuleDescription: this.selectedSubModule?.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No sub module is selected!'
      );
    }
  }

  /**
   * Retrieves all available systems from the server and updates the component state.
   * This function sets the `systems` property with the fetched data and toggles
   * the `shouldShowSystems` flag to true. If an error occurs during fetching,
   * an error message is displayed.
   */
  getAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systems = data;
          this.shouldShowSystems = true;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
          this.shouldShowSystems = true;
        }
      })
  }

  /**
   * Retrieves all systems from the server.
   */
  getAllSystemReportModules(systemId?: number) {
    this.systemsService.getSystemReportModules(systemId || this.selectedSystem?.id)
      .subscribe({
        next: (data) => {
          this.modulesData = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * Retrieves all system report submodules for a given module.
   * @param moduleId The ID of the module to retrieve submodules for. If not provided,
   * the ID of the currently selected module is used.
   */
  getAllSystemReportSubModules(moduleId?: number) {
    this.systemsService.getSystemReportSubModules(moduleId || this.selectedModule?.id)
      .subscribe({
        next: (data) => {
          this.subModuleData = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * Retrieve all system report modules for a given system.
   * @param systemId The ID of the system to retrieve modules for. If not provided,
   * the ID of the currently selected system is used.
   */
  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
    this.getAllSystemReportModules();
  }

  /**
   * Handle the selection of a module.
   * @param module The module that was selected.
   */
  onSelectModule(module: SystemReportModule): void {
    this.selectedModule = module;
    this.getAllSystemReportSubModules(this.selectedModule?.id);
  }

  /**
   * Handles the selection of a submodule.
   * Updates the selected submodule, fetches reports that are not assigned,
   * and fetches reports assigned to the selected submodule.
   *
   * @param {SystemReportSubModule} submodule - The submodule that was selected.
   */
  onSelectSubModule(submodule: SystemReportSubModule): void {
    this.selectedSubModule = submodule;
    this.fetchAllUnAssignedReports(null);
    this.fetchAssignedReports(this.selectedSubModule?.id);
  }

  /**
   * Fetches all unassigned reports for the given submodule ID.
   * This function shows a loading spinner, makes an API call to retrieve the reports,
   * and updates the component state with the fetched data. If an error occurs,
   * an error message is displayed using the global messaging service.
   *
   * @param {number} subModuleId - The ID of the submodule to fetch unassigned reports for.
   */
  fetchAllUnAssignedReports(subModuleId: number) {
    this.spinner.show();
    this.reportService.getAssignedOrUnassignedReports(subModuleId)
      .subscribe({
        next: (data) => {
          this.allReportsData = data;
          log.info("AllUnAssigned reports", data);
          this.spinner.hide();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
          this.spinner.hide();
        }
      });
    this.cdr.detectChanges();
  }

  /**
   * Fetches all assigned reports for the given submodule ID.
   * This function shows a loading spinner, makes an API call to retrieve the reports,
   * and updates the component state with the fetched data. If an error occurs,
   * an error message is displayed using the global messaging service.
   *
   * @param {number} subModuleId - The ID of the submodule to fetch assigned reports for.
   */
  fetchAssignedReports(subModuleId: number) {
    this.spinner.show();
    this.reportService.getAssignedOrUnassignedReports(subModuleId)
      .subscribe({
        next: (data) => {
          this.assignedReportsData = data;
          log.info("Assigned reports", data);
          this.spinner.hide();

        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
          this.spinner.hide();
        }
      });
    this.cdr.detectChanges();
  }

  /**
   * Assigns or unassigns a report from a submodule.
   *
   * This function makes an API call to assign or unassign a report from a submodule.
   * If the call is successful, it displays a success message using the global messaging service
   * and refreshes the list of assigned and unassigned reports.
   *
   * @param {string} status - The status to assign/unassign the report. 'A' for assign and 'U' for unassign.
   * @returns {Promise<any>} - A promise that resolves on success and rejects on error.
   */
  assignOrUnassignReport(status: string) {
    log.info('unassign clicked', status);
    const unassignReportPayload: any = {
      code: status === 'A' ? this.selectedReport.map(report => report.code) : this.selectedAssignedReport.map(report => report.code),
      subModuleCode: status === 'A' ? this.selectedSubModule?.id : null,
    };

    log.info(unassignReportPayload);

    const reportsServiceCall = this.reportService.assignOrUnassignReport(unassignReportPayload);

    return reportsServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage(
          'Success', status === 'A' ?
            'Successfully assigned reports to sub module' :
            'Successfully unassigned report(s) from sub module');
          this.fetchAllUnAssignedReports(null);
          this.fetchAssignedReports(this.selectedSubModule?.id);
          this.selectedReport = [];
          this.selectedAssignedReport = [];
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Try Again later');
        throw error;
      });
  }

  /**
   * Toggle the dropdown for a specific report. If the dropdown is already shown,
   * hide it. Otherwise, show the dropdown for the clicked report.
   * @param report The report to toggle the dropdown for.
   */
  toggleDropdown(report: any) {
    if (this.showInputForReport === report) {
      this.showInputForReport = null; // Hide the dropdown if already shown
    } else {
      this.showInputForReport = report; // Show the dropdown for the clicked exception
    }
  }

  /**
   * Toggle the dropdown for a specific report. If the dropdown is already shown,
   * hide it. Otherwise, show the dropdown for the clicked report.
   * @param report The report to toggle the dropdown for.
   */
  get g() {
    return this.defineModuleForm.controls;
  }

  ngOnDestroy(): void {}

  /**
   * Updates the report description.
   * @param {$event} $event - The input event.
   * @param {any} report - The report object.
   */
  updateReportDescription($event: Event, report: any) {
    const reportCode = report.code;
    const reportDescription = ($event.target as HTMLInputElement).value;
    log.info(reportCode, reportDescription);
    this.reportDescription = reportDescription;
  }

  /**
   * Save the report description for a given report.
   * @param {string} status - The status of the report. 'U' for unassigned reports and 'A' for assigned reports.
   * If the status is 'U', the description for the first selected unassigned report is updated.
   * If the status is 'A', the description for the first selected assigned report is updated.
   * If no report is selected, an error message is displayed.
   */
  saveReportDescription(status: string) {
    if (status == 'U' && !this.selectedReport.length) {
      this.globalMessagingService.displayErrorMessage('Error', 'No report is selected');
      return;
    } else if (status == 'A' && !this.selectedAssignedReport.length) {
      this.globalMessagingService.displayErrorMessage('Error', 'No assigned report is selected');
      return;
    }
    const reportCode = status == "U" ? this.selectedReport[0]?.code : this.selectedAssignedReport[0]?.code;

    log.info(reportCode, this.reportDescription);

    this.reportService.updateReportDetails(reportCode, this.reportDescription)
      .subscribe({
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Report description updated successfully');
          this.fetchAllUnAssignedReports(null);
          this.fetchAssignedReports(this.selectedSubModule?.id);
          this.selectedReport = [];
          this.selectedAssignedReport = [];
          this.reportDescription = '';
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.status);
        }
      });
  }
}
