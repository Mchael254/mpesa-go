import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SystemsDto } from '../../../../shared/data/common/systemsDto';
import { SystemsService } from '../../../../shared/services/setups/systems/systems.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { OrganizationService } from '../../services/organization.service';
import { AccountService } from '../../../entities/services/account/account.service';
import { AccountTypeDTO, AgentDTO } from '../../../entities/data/AgentDTO';
import {
  OrgDivisionLevelsDTO,
  OrgDivisionLevelTypesDTO,
  OrgPreviousSubDivHeadsDTO,
  SubDivisionDto,
  ReqSubDivisionDto,
} from '../../data/organization-dto';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import {Table} from "primeng/table";

const log = new Logger('HierarchyComponent');

interface SubDivisionUI extends ReqSubDivisionDto {
  expanded?: boolean;
  selected?: boolean;
  hasChildren?: boolean;
}

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css'],
})
export class HierarchyComponent implements OnInit {
  @ViewChild('subDivisionConfirmationModal')
  subDivisionConfirmationModal!: ReusableInputComponent;
  pageSize: 5;
  systems: SystemsDto[] = [];
  selectedSystem: SystemsDto = {
    id: undefined,
    shortDesc: undefined,
    systemName: undefined,
  };
  shouldShowSystems: boolean = false;
  hierarchyTypeData: OrgDivisionLevelTypesDTO[] = [];
  selectedHierarchyType: OrgDivisionLevelTypesDTO;
  editMode: boolean = false;

  hierarchyLevelData: OrgDivisionLevelsDTO[] = [];
  selectedHierarchyLevel: OrgDivisionLevelsDTO;
  previousSubDivHeadsData: OrgPreviousSubDivHeadsDTO[] = [];
  selectedPreviousSubDivHeads: OrgPreviousSubDivHeadsDTO;
  orgSubDivForm: FormGroup;
  hierarchyTypeForm: FormGroup;
  hierarchyLevelsForm: FormGroup;
  hierarchyHeadHistoryForm: FormGroup;

  public subDivisionData: SubDivisionUI[] = [];
  public selectedDivision: SubDivisionUI | null = null;
  public isEditMode: boolean = false;

  public errorOccurred = false;
  public errorMessage: string = '';
  public submitted = false;

  visibleStatus: any = {
    parentDivision: 'Y',
    divisionLevelType: 'Y',
    divisionLevel: 'Y',
    name: 'Y',
    divisionHead: 'Y',
    location: 'Y',
    managerAllowed: 'Y',
    overrideCommAllowed: 'Y',
    wef: 'Y',
    wet: 'Y',
    description: 'Y',
    accType: 'Y',
    headAccType: 'Y',
    type: 'Y',
    intermediary: 'Y',
    payIntermediary: 'Y',
    //
    ranking: 'Y',
    agentName: 'Y',
    desc: 'Y',
  };

  groupId: string = 'hierarchyLevelTab';
  groupIdHierarchyType: string = 'hierarchyTypeTab';
  accountTypeData: AccountTypeDTO[];
  allUsersModalVisible: boolean = false;
  zIndex = 1;
  selectedMainUser: AgentDTO;
  hierarchyTypeEnumData: any;
  hierarchyLevelsEnumData: any;
  patchHierarchyTypeUser: boolean = false;

  @ViewChild('hierarchyTypeConfirmationModal') hierarchyTypeConfirmationModal: ReusableInputComponent;
  @ViewChild('hierarchyLevelConfirmationModal') hierarchyLevelConfirmationModal: ReusableInputComponent;
  @ViewChild('hierarchyPrevHeadsConfirmationModal') hierarchyPrevHeadsConfirmationModal: ReusableInputComponent;
  @ViewChild('previousSubDivHeadsTable') previousSubDivHeadsTable: Table;

  constructor(
    private systemsService: SystemsService,
    private organizationService: OrganizationService,
    private globalMessagingService: GlobalMessagingService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private mandatoryFieldsService: MandatoryFieldsService,
    private cdr: ChangeDetectorRef,
    private accountService: AccountService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.fetchSystems();
    this.orgSubDivCreateForm();
    this.hierarchyTypeCreateForm();
    this.hierarchyLevelsCreateForm();
    this.hierarchyHeadHistoryCreateForm();
    this.fetchHierarchyTypeEnum();
    this.fetchAccountTypes();
    this.fetchHierarchyLevelEnum();
  }

  orgSubDivCreateForm() {
    this.orgSubDivForm = this.fb.group({
      parentDivision: [''],
      code: [''],
      divisionLevelType: [''],
      divisionLevel: [''],
      name: [''],
      divisionHead: [''],
      location: [''],
      managerAllowed: [''],
      overrideCommAllowed: [''],
      wef: [''],
      wet: [''],
    });
  }

  /**
   * Initializes the form for creating a new hierarchy type
   * Calls the API to fetch the mandatory fields for the hierarchy type form
   * Adds validators to the form controls based on the mandatory fields
   * Adds an asterisk to the label of the mandatory fields
   */
  hierarchyTypeCreateForm() {
    this.hierarchyTypeForm = this.fb.group({
      description: [''],
      accType: [''],
      headAccType: [''],
      type: [''],
      intermediary: [''],
      payIntermediary: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupIdHierarchyType)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.hierarchyTypeForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.hierarchyTypeForm.controls[key].addValidators(
                  Validators.required
                );
                this.hierarchyTypeForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  /**
   * Initializes the hierarchy levels form and sets up form controls with validation.
   * Subscribes to the mandatory fields service to dynamically apply validators
   * based on the visibility and mandatory status of fields.
   */
  hierarchyLevelsCreateForm() {
    this.hierarchyLevelsForm = this.fb.group({
      desc: [''],
      ranking: [''],
      type: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        response.forEach((field) => {
          for (const key of Object.keys(this.hierarchyLevelsForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.hierarchyLevelsForm.controls[key].addValidators(
                  Validators.required
                );
                this.hierarchyLevelsForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  /**
   * Initializes the hierarchy head history form and sets up form controls with validation.
   */
  hierarchyHeadHistoryCreateForm() {
    this.hierarchyHeadHistoryForm = this.fb.group({
      agentName: [''],
      wef: [''],
      wet: [''],
    });
  }

  /**
   * Retrieves the mandatory fields for the hierarchy head history form and adds validators to the form controls.
   */
  get f() {
    return this.hierarchyTypeForm.controls;
  }

  /**
   * Returns the form controls of the hierarchy type form.
   */
  get g() {
    return this.hierarchyLevelsForm.controls;
  }

  /**
   * Opens the modal for defining a new hierarchy type.
   * Checks if a system is selected before displaying the modal.
   * If no system is selected, an error message is displayed.
   */
  openDefineHierarchyTypeModal() {
    const modal = document.getElementById('newHierarchyType');
    if (modal && this.selectedSystem?.id !== undefined) {
      this.patchHierarchyTypeUser = !this.patchHierarchyTypeUser;
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
   * Closes the modal for defining a hierarchy type.
   * Sets the edit mode to false and hides the modal element
   * by removing the 'show' class and setting its display to 'none'.
   */
  closeDefineHierarchyTypeModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyType');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Edits a hierarchy type.
   * Toggles the edit mode and if the edit mode is on and a hierarchy type is selected,
   * opens the modal for defining a hierarchy type with the selected hierarchy type's details.
   */
  editHierarchyType() {
    this.editMode = !this.editMode;
    log.info('select>>', this.selectedHierarchyType);

    if (this.selectedHierarchyType) {
      this.openDefineHierarchyTypeModal();
      this.hierarchyTypeForm.patchValue({
        description: this.selectedHierarchyType.description,
        accType: this.selectedHierarchyType.accountTypeCode,
        headAccType: this.selectedHierarchyType.managerCode,
        type: this.selectedHierarchyType.type === 'Other Hierarchy' ? 'O' : 'C',
        intermediary: this.selectedHierarchyType.intermediaryCode,
        payIntermediary: this.selectedHierarchyType.payIntermediary,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy type is selected.'
      );
    }
  }

  /**
   * Opens the modal for defining a hierarchy level.
   * Checks if a system is selected before displaying the modal.
   * If no system is selected, an error message is displayed.
   */
  openDefineHierarchyLevelsModal() {
    const modal = document.getElementById('newHierarchyLevel');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the modal for defining a hierarchy level.
   * Sets the edit mode to false and hides the modal element
   * by removing the 'show' class and setting its display to 'none'.
   */
  closeDefineHierarchyLevelsModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyLevel');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Toggles the edit mode for hierarchy levels.
   * If a hierarchy level is selected, it opens the modal for defining a hierarchy level
   * and populates the form with the selected hierarchy level's details.
   * Otherwise, an error message is displayed indicating no hierarchy level is selected.
   */
  editHierarchyLevels() {
    this.editMode = !this.editMode;
    log.info('select>>', this.selectedHierarchyLevel);

    const filterLevel = this.hierarchyLevelsEnumData.find(
      (product) => product.name === this.selectedHierarchyLevel.type
    );

    if (this.selectedHierarchyLevel) {
      this.openDefineHierarchyLevelsModal();
      this.hierarchyLevelsForm.patchValue({
        desc: this.selectedHierarchyLevel.description,
        ranking: this.selectedHierarchyLevel.ranking,
        type: filterLevel?.value,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy level is selected.'
      );
    }
  }

  /**
   * Opens the modal for defining a hierarchy head history.
   */
  openDefinePreviousSubDivHeadsModal() {
    const modal = document.getElementById('newHierarchyHeadHistory');
    if (modal && this.selectedDivision) {
      this.patchHierarchyTypeUser = false;
      modal.classList.add('show');
      modal.style.display = 'block';
    }else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No organization subdivision is selected.'
      );
    }
  }

  /**
   * Closes the modal for defining a previous subdivision head history.
   * Sets the edit mode to false and hides the modal element
   * by removing the 'show' class and setting its display to 'none'.
   */
  closeDefinePreviousSubDivHeadsModal() {
    this.editMode = false;
    const modal = document.getElementById('newHierarchyHeadHistory');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Edits a hierarchy head history.
   * Toggles the edit mode and if the edit mode is on and a hierarchy level is selected,
   * opens the modal for defining a hierarchy level with the selected hierarchy level's details.
   */
  editPreviousSubDivHeads() {
    this.editMode = !this.editMode;

    if (this.selectedPreviousSubDivHeads) {
      this.openDefinePreviousSubDivHeadsModal();
      this.hierarchyHeadHistoryForm.patchValue({
        agentName: this.selectedPreviousSubDivHeads.agentCode,
        wef: this.selectedPreviousSubDivHeads.wef,
        wet: this.selectedPreviousSubDivHeads.wet

      })
    }
    else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy type is selected.'
      )
    }
  }

  /**
   * Fetches all systems.
   * Sets the shouldShowSystems property to false, shows a spinner, fetches the systems
   * and hides the spinner when the fetching is done.
   */
  fetchSystems(): void {
    this.shouldShowSystems = false;
    this.spinner.show();
    this.systemsService.getSystems().subscribe({
      next: (res: SystemsDto[]) => {
        this.systems = res;
        this.spinner.hide();
        this.shouldShowSystems = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.spinner.hide();
        this.shouldShowSystems = true;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * Selects a system module.
   * Assigns the selected system to the selectedSystem property and
   * fetches the hierarchy levels for the selected system.
   * @param system the selected system module
   */
  selectSystem(system: SystemsDto): void {
    this.selectedSystem = system;
    this.fetchHierarchyLevelType();
  }

  /**
   * Saves a hierarchy type.
   * Checks if the form is valid. If valid, creates or updates the hierarchy type
   * based on whether the selected hierarchy type is null or not. It then resets the form,
   * closes the define hierarchy type modal, fetches the hierarchy levels for the selected
   * system and sets the selected hierarchy type to null.
   */
  saveHierarchyType() {
    this.hierarchyTypeForm.markAllAsTouched();
    if (this.hierarchyTypeForm.invalid) return;

    const hierarchyTypeFormValues = this.hierarchyTypeForm.getRawValue();
    const hierarchyTypeCode = this.selectedHierarchyType?.code
      ? this.selectedHierarchyType?.code
      : null;

    const saveHierarchyTypePayload: OrgDivisionLevelTypesDTO = {
      accountTypeCode: hierarchyTypeFormValues.accType,
      code: hierarchyTypeCode,
      description: hierarchyTypeFormValues.description,
      intermediaryCode: hierarchyTypeFormValues.intermediary,
      managerCode: hierarchyTypeFormValues.headAccType,
      payIntermediary: hierarchyTypeFormValues.payIntermediary,
      systemCode: this.selectedSystem?.id,
      type: hierarchyTypeFormValues.type,
    };
    log.info('save hierarchy type>>>', saveHierarchyTypePayload);

    const orgServiceCall = this.selectedHierarchyType
      ? this.organizationService.updateOrgDivisionLevelType(
          hierarchyTypeCode,
          saveHierarchyTypePayload
        )
      : this.organizationService.createOrgDivisionLevelType(
          saveHierarchyTypePayload
        );

    return orgServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          `Successfully ${
            this.selectedHierarchyType ? 'updated' : 'created'
          } a hierarchy type`
        );

        this.hierarchyTypeForm.reset();
        this.closeDefineHierarchyTypeModal();
        this.fetchHierarchyLevelType();
        this.selectedHierarchyType = null;
        this.selectedMainUser = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.message
        );
      },
    });
  }

  /**
   * Deletes a hierarchy type.
   * If a hierarchy type is selected, sends a request to the server to delete it.
   * If the request is successful, displays a success message, resets the selected hierarchy type to null and fetches the hierarchy level types.
   * If the request fails, displays an error message.
   * If no hierarchy type is selected, displays an error message.
   */
  deleteHierarchyLevelType() {
    this.hierarchyTypeConfirmationModal.show();
  }

  /**
   * Saves a hierarchy level.
   * If a hierarchy level is selected, sends a request to the server to update it.
   * If no hierarchy level is selected, sends a request to the server to create a new hierarchy level.
   * If the request is successful, displays a success message, resets the hierarchy levels form, closes the modal, fetches the hierarchy levels and resets the selected hierarchy level to null.
   * If the request fails, displays an error message.
   */
  saveHierarchyLevel() {
    this.hierarchyLevelsForm.markAllAsTouched();
    if (this.hierarchyLevelsForm.invalid) return;

    const hierarchyLevelFormValues = this.hierarchyLevelsForm.getRawValue();
    const hierarchyLevelCode = this.selectedHierarchyLevel?.code
      ? this.selectedHierarchyLevel?.code
      : null;

    const saveHierarchyLevelPayload: OrgDivisionLevelsDTO = {
      description: hierarchyLevelFormValues.desc,
      ranking: hierarchyLevelFormValues.ranking,
      type: hierarchyLevelFormValues.type,
      code: hierarchyLevelCode,
      divisionLevelTypeCode: this.selectedHierarchyType?.code,
    };
    log.info('save hierarchy level>>>', saveHierarchyLevelPayload);

    const orgServiceCall = this.selectedHierarchyLevel
      ? this.organizationService.updateOrgDivisionLevel(
          hierarchyLevelCode,
          saveHierarchyLevelPayload
        )
      : this.organizationService.createOrgDivisionLevel(
          saveHierarchyLevelPayload
        );

    return orgServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          `Successfully ${
            this.selectedHierarchyLevel ? 'updated' : 'created'
          } a hierarchy level`
        );

        this.hierarchyLevelsForm.reset();
        this.closeDefineHierarchyLevelsModal();
        this.fetchHierarchyLevels(this.selectedHierarchyType?.code);
        this.selectedHierarchyLevel = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.message
        );
      },
    });
  }

  /**
   * Deletes a hierarchy level.
   * If a hierarchy level is selected, sends a request to the server to delete it.
   * If the request is successful, displays a success message, resets the selected hierarchy type to null and fetches the hierarchy levels.
   * If the request fails, displays an error message.
   * If no hierarchy level is selected, displays an error message.
   */
  deleteHierarchyLevel() {
    this.hierarchyLevelConfirmationModal.show();
  }

  fetchOrganizationSubDivision(divisionLevelTypeCode) {
    this.organizationService
      .getOrganizationSubDivision(divisionLevelTypeCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.subDivisionData = data;
            log.info('Fetch Sub Division Data', this.subDivisionData);

            this.subDivisionData = this.addExpansionState(data);
          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
          }
        },
        error: (err) => {
          this.errorOccurred = true;
          this.errorMessage = err?.message || 'An error occurred';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }

  addExpansionState(data): SubDivisionUI[] {
    return data.map((division) => ({
      ...division,
      expanded: false,
      hasChildren: division.children?.length > 0,
      children: division.children
        ? this.addExpansionState(division.children)
        : [],
    }));
  }

  toggleExpand(division: SubDivisionUI) {
    if (division.expanded) {
      division.expanded = false;
    } else {
      division.expanded = true;

      if (division.children?.length === 0) {
        division.hasChildren = false;
      }
    }
  }

  deleteHierarchyHeadHistory() {
    this.hierarchyPrevHeadsConfirmationModal.show();
  }

  /**
   * Fetches the hierarchy levels for the selected system.
   * If the request is successful, sets the hierarchyTypeData property to the response data and hides the spinner.
   * If the request fails, displays an error message and hides the spinner.
   */
  fetchHierarchyLevelType() {
    this.spinner.show();
    this.organizationService
      .getOrgDivisionLevelTypes(this.selectedSystem?.id)
      .subscribe({
        next: (data) => {
          this.hierarchyTypeData = data;
          this.spinner.hide();
          log.info('hierarchy level type>>', data);
        },
        error: (err) => {
          let errorMessage = err?.error?.message ?? err.message;
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage(
            'Error',
            errorMessage
          );
        },
      });
  }

  onHierachyTypeRowSelect(hierarchyType) {
    const hierarchyTypeCode = hierarchyType.code;
    this.fetchHierarchyLevels(hierarchyTypeCode);
    this.fetchOrganizationSubDivision(hierarchyTypeCode);
  }

  /**
   * Fetches the hierarchy levels for the selected hierarchy type.
   * If the request is successful, sets the hierarchyLevelData property to the response data and hides the spinner.
   * If the request fails, displays an error message and hides the spinner.
   * @param hierarchyTypeCode The hierarchy type code.
   */
  fetchHierarchyLevels(hierarchyTypeCode) {
    this.spinner.show();
    this.organizationService.getOrgDivisionLevels(hierarchyTypeCode).subscribe({
      next: (data) => {
        this.hierarchyLevelData = data;
        this.spinner.hide();

        log.info('hierarchy level>>', data);
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.spinner.hide();
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * Fetches all account types.
   * If the request is successful, sets the accountTypeData property to the response data and hides the spinner.
   * If the request fails, displays an error message and hides the spinner.
   */
  fetchAccountTypes(): void {
    this.spinner.show();
    this.accountService.getAccountType().subscribe({
      next: (res: AccountTypeDTO[]) => {
        this.accountTypeData = res;
        this.spinner.hide();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.spinner.hide();
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * Fetches the hierarchy types enum.
   * If the request is successful, sets the hierarchyTypeEnumData property to the response data.
   * Logs the hierarchy type enum data for debugging purposes.
   */
  fetchHierarchyTypeEnum() {
    this.organizationService.getHierarchiesType().subscribe((data) => {
      this.hierarchyTypeEnumData = data;

      log.info('hierarchy type enum>>', data);
    });
  }

  /**
   * Fetches the hierarchy levels enum.
   * If the request is successful, sets the hierarchyLevelsEnumData property to the response data.
   * Logs the hierarchy level enum data for debugging purposes.
   */
  fetchHierarchyLevelEnum() {
    this.organizationService.getHierarchiesLevels().subscribe((data) => {
      this.hierarchyLevelsEnumData = data;

      log.info('hierarchy level enum>>', data);
    });
  }

  /**
   * Fetches the previous subdivision heads data.
   * If the request is successful, sets the previousSubDivHeadsData property to the response data and hides the spinner.
   * If the request fails, displays an error message and hides the spinner.
   */
  fetchPreviousSubDivisionHeads(selectedDivision: any): void {
    this.spinner.show();
    this.organizationService.getOrgPrevSubDivisionHeads(selectedDivision?.code).subscribe({
      next: (res: OrgPreviousSubDivHeadsDTO[]) => {
        this.previousSubDivHeadsData = res;
        this.spinner.hide();
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.spinner.hide();
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      },
    });
  }

  /**
   * Toggles the visibility of the all users modal based on the provided display parameter.
   * @param display A boolean indicating whether the modal should be visible or not.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }

  /**
   * Toggles the all users modal and sets the zIndex property to 1.
   * @param $event - An event indicating whether to toggle the modal.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  /**
   * Gets the selected user and patches the create hierarchy type form with the user's id.
   * @param event - The selected user.
   */
  getSelectedUser(event: any) {
    this.selectedMainUser = event;
    log.info(this.selectedMainUser);
    if (this.patchHierarchyTypeUser === false) {
      this.patchPreviousSubDivFormValues(this.selectedMainUser);
    } else {
      this.patchHierarchyTypeFormValues(this.selectedMainUser);
    }
  }

  /**
   * Patches the hierarchy type form with the selected user's id.
   * @param user - The selected user.
   */
  patchHierarchyTypeFormValues(agent: any) {
    this.hierarchyTypeForm.patchValue({
      intermediary: agent?.id,
    });
  }

  patchPreviousSubDivFormValues(agent: any) {
    this.hierarchyHeadHistoryForm.patchValue({
      agentName: agent?.id,
    });
  }

  /**
   * Patches the hierarchy type form with the selected agent's id.
   * @param agent - The selected agent.
   */
  openAllUsersModal() {
    this.zIndex = -1;
    this.toggleAllUsersModal(true);
  }

  selectDivision(division: SubDivisionUI) {
    if (division.selected) {
      division.selected = false;
      this.selectedDivision = null;
    } else {
      if (this.selectedDivision) {
        this.selectedDivision.selected = false;
      }
      division.selected = true;
      this.selectedDivision = division;
    }

    log.info('Selected Division:', this.selectedDivision);
    this.isEditMode = true;
    this.editSubDivision(this.selectedDivision);
    this.fetchPreviousSubDivisionHeads(this.selectedDivision);
  }

  createSubDivision() {
    this.isEditMode = false;
    this.orgSubDivForm.reset();
    this.orgSubDivForm.patchValue({
      parentDivision: this.selectedDivision?.code || '',
    });
    log.info(
      'Creating new SubDivision under:',
      this.selectedDivision?.name || 'Root Division'
    );
  }

  saveSubDivision() {
    this.submitted = true;
    this.orgSubDivForm.markAllAsTouched();

    // Validate the form
    if (this.orgSubDivForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl =
        invalidControls.find((control) => !control.value) || invalidControls[0];

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      }
      return;
    }

    const formValues = this.orgSubDivForm.getRawValue();
    const systemCode = this.selectedSystem.id;

    const parentCode = this.isEditMode
      ? this.selectedDivision?.parentCode || null
      : this.selectedDivision?.code || null;

    const parentId = this.isEditMode
      ? this.selectedDivision?.parentId || null
      : this.selectedDivision?.id || null;

    const subDivisionDto: SubDivisionDto = {
      agentSequenceNumber: null,
      branchCode: null,
      code: formValues.code,
      divisionHeadAgentCode: formValues.divisionHead
        ? Number(formValues.divisionHead)
        : null,
      divisionLevelTypeCode: String(formValues.divisionLevelType || ''),
      id: this.isEditMode ? this.selectedDivision!.id : null,
      locationCode: formValues.location,
      managerAllowed: formValues.managerAllowed,
      name: formValues.name,
      organizationDivisionLevelCode: String(formValues.divisionLevel || ''),
      overCommissionEarn: formValues.overrideCommAllowed,
      parentCode: parentCode,
      parentId: parentId,
      postLevel: null,
      regionCode: null,
      status: null,
      systemCode: systemCode,
      unitPrefix: null,
      urbanArea: null,
      wef: formValues.wef,
      wet: formValues.wet,
    };

    // Call the appropriate service based on mode
    const serviceCall = this.isEditMode
      ? this.organizationService.updateOrganizationSubDivision(
          subDivisionDto.id!,
          subDivisionDto
        )
      : this.organizationService.createOrganizationSubDivision(subDivisionDto);

    serviceCall.subscribe({
      next: (data) => {
        if (data) {
          const successMessage = this.isEditMode
            ? 'Successfully Updated a SubDivision'
            : 'Successfully Created a SubDivision';
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            successMessage
          );
          this.fetchOrganizationSubDivision(this.selectedHierarchyType.code);
        } else {
          this.handleError();
        }
      },
      error: (err) => {
        this.handleError();
      },
    });
  }

  handleError() {
    this.errorOccurred = true;
    this.errorMessage = 'Something went wrong. Please try Again';
    this.globalMessagingService.displayErrorMessage('Error', this.errorMessage);
  }

  editSubDivision(selectedDivision: SubDivisionDto) {
    const divisionLevelTypeCode = this.hierarchyTypeData.find(
      (item) => item.code.toString() === selectedDivision.divisionLevelTypeCode
    )?.code;

    const divisionLevelCode = this.hierarchyLevelData.find(
      (item) =>
        item.code.toString() === selectedDivision.organizationDivisionLevelCode
    )?.code;

    this.orgSubDivForm.patchValue({
      parentDivision: selectedDivision.parentCode || '',
      code: selectedDivision.code || '',
      divisionLevelType: divisionLevelTypeCode || null,
      divisionLevel: divisionLevelCode || null,
      name: selectedDivision.name || '',
      divisionHead: selectedDivision.divisionHeadAgentCode || '',
      location: selectedDivision.locationCode || '',
      managerAllowed: selectedDivision.managerAllowed || '',
      overrideCommAllowed: selectedDivision.overCommissionEarn || '',
      wef: selectedDivision.wef || '',
      wet: selectedDivision.wet || '',
    });
  }

  deleteSubDivision() {
    this.subDivisionConfirmationModal.show();
  }

  confirmSubDivisionDelete() {
    if (this.selectedDivision) {
      const subDivisionId = this.selectedDivision.id;
      this.organizationService
        .deleteOrganizationSubDivision(subDivisionId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deleted a subDivision'
              );
              this.selectedDivision = null;
              this.fetchOrganizationSubDivision(
                this.selectedHierarchyType.code
              );
              this.orgSubDivForm.reset();
            } else {
              this.handleError();
            }
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              err?.error?.errors[0]
            );
            log.info(`error >>>`, err);
          },
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No subdivision is selected!.'
      );
    }
  }

  saveHierarchyHeadHistory() {
    const hierarchyHeadHistoryFormValues = this.hierarchyHeadHistoryForm.getRawValue();
    const hierarchyHeadHistoryCode = this.selectedPreviousSubDivHeads?.code ? this.selectedPreviousSubDivHeads?.code : null;

    const saveHierarchyHeadHistoryPayload: OrgPreviousSubDivHeadsDTO = {
      agentCode: hierarchyHeadHistoryFormValues.agentName,
      code: hierarchyHeadHistoryCode,
      subdivisionCode: this.selectedDivision?.code,
      wef: hierarchyHeadHistoryFormValues.wef,
      wet: hierarchyHeadHistoryFormValues.wet
    }
    log.info("save previous subdiv heads>>>", saveHierarchyHeadHistoryPayload);

    const orgServiceCall = this.selectedPreviousSubDivHeads
      ? this.organizationService.updateOrgPrevSubDivisionHead(hierarchyHeadHistoryCode, saveHierarchyHeadHistoryPayload)
      : this.organizationService.createOrgPrevSubDivisionHead(saveHierarchyHeadHistoryPayload);

    return orgServiceCall.subscribe({
      next: (data) => {
        this.globalMessagingService.displaySuccessMessage('Success',
          `Successfully ${this.selectedPreviousSubDivHeads ? 'updated' : 'created'} a hierarchy previous subdivision head`);

        this.hierarchyHeadHistoryForm.reset();
        this.closeDefinePreviousSubDivHeadsModal();
        this.fetchPreviousSubDivisionHeads(this.selectedDivision);
        this.selectedPreviousSubDivHeads = null;
        this.selectedMainUser = null;
      },
      error: (err) => {
        log.info('>>>>>>>>>', err.error.message)
        this.globalMessagingService.displayErrorMessage('Error', err.error.message);
      }
    });
  }

  ngOnDestroy(): void {}

  confirmHierarchyTypeDelete() {
    if (this.selectedHierarchyType) {
      const hierarchyLevelTypeId = this.selectedHierarchyType?.code;
      this.organizationService.deleteOrgDivisionLevelType(hierarchyLevelTypeId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a hierarchy type'
          );
          this.selectedHierarchyType = null;
          this.fetchHierarchyLevelType();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy type is selected.'
      );
    }
  }

  confirmHierarchyLevelDelete() {
    if (this.selectedHierarchyLevel) {
      const hierarchyLevelId = this.selectedHierarchyLevel?.code;
      this.organizationService.deleteOrgDivisionLevel(hierarchyLevelId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a hierarchy level'
          );
          this.fetchHierarchyLevels(this.selectedHierarchyType);
          this.selectedHierarchyType = null;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy level is selected.'
      );
    }
  }

  /**
   * Confirms deletion of a hierarchy previous subdivision head.
   * If a hierarchy previous subdivision head is selected, sends a request to the server to delete it.
   * If the request is successful, displays a success message, fetches the hierarchy previous subdivision heads and resets the selected hierarchy previous subdivision head to null.
   * If the request fails, displays an error message.
   * If no hierarchy previous subdivision head is selected, displays an error message.
   */
  confirmHierarchyPrevHeadsDelete() {
    if (this.selectedPreviousSubDivHeads) {
      const hierarchyPreviousSubDivId = this.selectedPreviousSubDivHeads?.code;
      this.organizationService.deleteOrgPrevSubDivisionHead(hierarchyPreviousSubDivId).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted a hierarchy previous subdivision head'
          );
          this.fetchPreviousSubDivisionHeads(this.selectedDivision);
          this.selectedPreviousSubDivHeads = null;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No hierarchy previous sub division head is selected.'
      );
    }
  }

  filterPreviousHeads(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.previousSubDivHeadsTable.filterGlobal(filterValue, 'contains');
  }
}
