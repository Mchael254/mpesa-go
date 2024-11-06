import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {Logger} from "../../../../../shared/services";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {ServiceRequestService} from "../../../services/service-request.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ServiceRequestCategoryDTO} from "../../../data/service-request-dto";

const log = new Logger('RequestCategoriesComponent');
@Component({
  selector: 'app-request-categories',
  templateUrl: './request-categories.component.html',
  styleUrls: ['./request-categories.component.css']
})
export class RequestCategoriesComponent implements OnInit {
  pageSize: 5;
  incidentsData: any;
  requestCategoriesData: ServiceRequestCategoryDTO[];
  selectedRequestCategory: ServiceRequestCategoryDTO;

  editMode: boolean = false;
  serviceRequestCategoryForm: FormGroup;
  requestEscalationForm: FormGroup;

  allUsersModalVisible: boolean = false;
  zIndex= 1;
  selectedMainUser: StaffDto;

  systems: SystemsDto[];

  visibleStatus: any = {
    name: 'Y',
    shtDesc: 'Y',
    assignee: 'Y',
    //
    system: 'Y',
    requestCategory: 'Y',
    levelOneDuration: 'Y',
    levelOneEscalatedTo: 'Y',
    levelTwoDuration: 'Y',
    levelTwoEscalatedTo: 'Y',
    assignTo: 'Y',
    messageTemplate: 'Y',
  }

  groupId: string = 'serviceDeskTab';

  constructor(
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private mandatoryFieldsService: MandatoryFieldsService,
    private systemsService: SystemsService,
    private spinner: NgxSpinnerService,
    private serviceRequestService: ServiceRequestService,
  ) { }

  ngOnInit(): void {
    this.serviceRequestCategoryCreateForm();
    this.requestEscalationCreateForm();
    this.getAllSystems();
    this.fetchServiceCategory();
  }

  /**
   * Initializes the form for creating service request categories.
   */
  serviceRequestCategoryCreateForm() {
    this.serviceRequestCategoryForm = this.fb.group({
      name: [''],
      shtDesc: [''],
      assignee: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.serviceRequestCategoryForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.serviceRequestCategoryForm.controls[key].addValidators(Validators.required);
                this.serviceRequestCategoryForm.controls[key].updateValueAndValidity();
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
   * Initialize the form for request escalation details.
   */
  requestEscalationCreateForm() {
    this.requestEscalationForm = this.fb.group({
      system: [''],
      requestCategory: [''],
      levelOneDuration: [''],
      levelOneEscalatedTo: [''],
      levelTwoDuration: [''],
      levelTwoEscalatedTo: [''],
      assignTo: [''],
      messageTemplate: ['']
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      untilDestroyed(this)
    )
      .subscribe((response) =>{
        response.forEach((field) =>{
          for (const key of Object.keys(this.requestEscalationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.requestEscalationForm.controls[key].addValidators(Validators.required);
                this.requestEscalationForm.controls[key].updateValueAndValidity();
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
   * @returns The controls of the `serviceRequestCategoryForm`.
   */
  get f() {
    return this.serviceRequestCategoryForm.controls;
  }

  /**
   * The controls of the `requestEscalationForm`.
   */
  get g() {
    return this.requestEscalationForm.controls;
  }

  /**
   * Opens the "Service Request Category" modal.
   */
  openServiceRequestCategoryModal() {
    const modal = document.getElementById('serviceRequestCategoryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Service Request Category" modal.
   */
  closeServiceRequestCategoryModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceRequestCategoryModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Opens the "Service Request Escalation" modal.
   */
  openRequestEscalationModal() {
    const modal = document.getElementById('requestEscalationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * Closes the "Service Request Escalation" modal.
   */
  closeRequestEscalationModal() {
    this.editMode = false;
    const modal = document.getElementById('requestEscalationModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * Toggles the visibility of the all users modal based on the provided display parameter.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }
  /**
   * Closes the "Select User" modal after a user has been selected.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  /**
   * Opens the "Select User" modal for selecting the assignee of a Service Request Category.
   */
  openAllUsersModal() {
    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  /**
   * Called when a user is selected in the "Select User" modal.
   */
  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    log.info(this.selectedMainUser)
    this.serviceRequestCategoryForm.patchValue({
      assignee: event?.id
    });
  }

  /*getSelectedUser(event: StaffDto, formGroup: FormGroup, controlName: string) {
    this.selectedMainUser = event;
    console.log(this.selectedMainUser);
    formGroup.patchValue({
      [controlName]: event?.id
    });
  }*/

  /**
   * Retrieves the list of systems.
   */
  getAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systems = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * Fetches the list of service request categories.
   */
  fetchServiceCategory() {
    this.spinner.show();
    this.serviceRequestService.getRequestCategory()
      .subscribe({
        next: (data) => {
          this.requestCategoriesData = data;
          this.spinner.hide();

          log.info("requests>>", data);
        },
        error: (err) => {
          this.spinner.hide();
          this.globalMessagingService.displayErrorMessage('Error', err.error.error);
        }
      });
  }

  /**
   * Save the service request category.
   */
  saveServiceRequestCategory() {
    this.serviceRequestCategoryForm.markAllAsTouched();
    if (this.serviceRequestCategoryForm.invalid) return;
    const serviceRequestCategoryFormValues = this.serviceRequestCategoryForm.getRawValue();
    const serviceRequestCategoryCode = !this.editMode ? null : this.selectedRequestCategory?.id;

    const saveRequestStatusPayload: ServiceRequestCategoryDTO = {
      id: serviceRequestCategoryCode,
      desc:serviceRequestCategoryFormValues?.name,
      shtDesc:serviceRequestCategoryFormValues?.shtDesc,
      usrCode:serviceRequestCategoryFormValues?.assignee,
      sysCode: 0
    };

    console.log(saveRequestStatusPayload)
    const serviceRequestServiceCall = this.selectedRequestCategory
      ? this.serviceRequestService.updateRequestCategory(this.selectedRequestCategory.id, saveRequestStatusPayload)
      : this.serviceRequestService.createRequestCategory(saveRequestStatusPayload);

    return serviceRequestServiceCall.toPromise()
      .then(data => {
        this.globalMessagingService.displaySuccessMessage('Success', this.selectedRequestCategory ? 'Successfully updated request category' : 'Successfully created request category');
        this.serviceRequestCategoryForm.reset();
        this.closeServiceRequestCategoryModal();
        this.fetchServiceCategory();
      })
      .catch(error => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message || 'Error saving request category');
        throw error;
      });
  }

  /**
   * Toggles the edit mode for the service request category on and off.
   */
  editRequestCategory() {
    this.editMode = !this.editMode;
    if (this.selectedRequestCategory) {
      this.openServiceRequestCategoryModal();
      this.serviceRequestCategoryForm.patchValue({
        name: this.selectedRequestCategory?.desc,
        shtDesc: this.selectedRequestCategory?.shtDesc,
        assignee: this.selectedRequestCategory?.user?.id
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request category is selected!'
      );
    }
  }

  /**
   * Delete the selected service request category.
   * If no request category is selected, display an error message.
   * Otherwise, make a call to the service to delete the request category,
   * and then display a success message and fetch the list of service categories again.
   */
  deleteRequestCategory() {
    if (this.selectedRequestCategory) {
      const serviceRequestCategoryCode = this.selectedRequestCategory?.id;
      this.serviceRequestService.deleteRequestCategory(serviceRequestCategoryCode).subscribe( {
        next: (data) => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully deleted request category'
          );
          this.selectedRequestCategory = null;
          this.fetchServiceCategory();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        },
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No request category is selected.'
      );
    }
  }

  saveRequestEscalation() {

  }

  ngOnDestroy(): void {}
}
