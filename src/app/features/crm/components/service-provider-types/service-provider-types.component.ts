import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ServiceProviderTypeDTO } from '../../data/service-provider-type';
import { ServiceProviderTypesService } from '../../services/service-provider-types.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';

const log = new Logger('ServiceProviderTypesComponent');

/* The `ServiceProviderTypesComponent` class in TypeScript is responsible for managing service provider
types, handling form data, fetching statuses, and performing CRUD operations with error handling and
success messages. */
@Component({
  selector: 'app-service-provider-types',
  templateUrl: './service-provider-types.component.html',
  styleUrls: ['./service-provider-types.component.css'],
})
export class ServiceProviderTypesComponent implements OnInit {
  @ViewChild('serviceProviderTypeTable') serviceProviderTypeTable: Table;
  @ViewChild('serviceProviderTypeConfirmationModal')
  serviceProviderTypeConfirmationModal!: ReusableInputComponent;

  public createServiceProviderTypeForm: FormGroup;
  public serviceProviderTypesData: ServiceProviderTypeDTO[];
  public selectedServiceProviderType: ServiceProviderTypeDTO;
  public statusesData: StatusDTO[];

  public serviceProviderActivitiesData: any;

  public groupId: string = 'serviceProviderTypeTab';
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Account Management',
      url: 'home/crm/dashboard',
    },

    {
      label: 'Service Providers',
      url: 'home/crm/service-provider-types',
    },
  ];

  public statusData = [
    { name: 'Active', value: 'A' },
    { name: 'Inactive', value: 'I' },
  ];

  constructor(
    private fb: FormBuilder,
    private serviceProviderTypeService: ServiceProviderTypesService,
    private statusService: StatusService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  /**
   * The ngOnInit function initializes the form, fetches service provider types, and fetches statuses.
   */
  ngOnInit(): void {
    this.ServiceProviderTypeForm();
    this.fetchServiceProviderTypes();
    this.fetchStatuses();
  }

  ngOnDestroy(): void {}

  /**
   * The function updates the value of a form control by adding a specified change value, ensuring the
   * new value is not less than zero.
   * @param {number} change - The change parameter is a number that represents the amount by which the
   * value should be changed. It can be positive or negative.
   * @param {FormGroup} form - The "form" parameter is a FormGroup object, which represents a group of
   * FormControl objects. It is used to manage the form controls and their values.
   * @param {string} formControlName - The `formControlName` parameter is the name of the form control
   * in the `form` FormGroup that you want to update.
   */
  updateRound(change: number, form: FormGroup, formControlName: string) {
    const newValue = Math.max(form.get(formControlName).value + change, 0);
    form.get(formControlName).setValue(newValue);
  }

  ServiceProviderTypeForm() {
    this.createServiceProviderTypeForm = this.fb.group({
      shortDescription: [''],
      name: [''],
      status: [''],
      withHoldingTaxRate: [''],
      vatTaxRate: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createServiceProviderTypeForm.controls[key].setValidators(
              Validators.required
            );
            this.createServiceProviderTypeForm.controls[
              key
            ].updateValueAndValidity();
            const label = document.querySelector(`label[for=${key}]`);
            if (label) {
              const asterisk = document.createElement('span');
              asterisk.innerHTML = ' *';
              asterisk.style.color = 'red';
              label.appendChild(asterisk);
            }
          }
        });
      });
  }

  get f() {
    return this.createServiceProviderTypeForm.controls;
  }

  onSort(event: Event, dataArray: any[], sortKey: string): void {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;

    switch (selectedValue) {
      case 'asc':
        this.sortArrayAsc(dataArray, sortKey);
        break;
      case 'desc':
        this.sortArrayDesc(dataArray, sortKey);
        break;
      default:
        // Handle default case or no sorting
        break;
    }
  }

  sortArrayAsc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }

  sortArrayDesc(dataArray: any[], sortKey: string): void {
    dataArray.sort((a, b) => b[sortKey].localeCompare(a[sortKey]));
  }

  /**
   * This function fetches service provider types based on optional parameters and logs the retrieved
   * data.
   * @param {string} [name] - The `name` parameter in the `fetchServiceProviderTypes` function is used
   * to filter service provider types based on their name. It is an optional parameter, meaning it can
   * be provided to narrow down the search results to service provider types with a specific name.
   * @param {string} [shortDescription] - The `shortDescription` parameter in the
   * `fetchServiceProviderTypes` function is used to filter service provider types based on a short
   * description. This parameter allows you to search for service provider types that have a specific
   * short description provided as a string value.
   * @param {string} [status] - The `status` parameter in the `fetchServiceProviderTypes` function is
   * used to filter the service provider types based on their status. This parameter allows you to
   * specify a status value to retrieve only the service provider types that match that status. For
   * example, you could use values like "active", "inactive
   */
  fetchServiceProviderTypes(
    name?: string,
    shortDescription?: string,
    status?: string
  ) {
    this.serviceProviderTypeService
      .getServiceProviderTypes(name, shortDescription, status)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.serviceProviderTypesData = data;
        log.info(
          'Fetched Service Provider Types',
          this.serviceProviderTypesData
        );
      });
  }

  /**
   * The fetchStatuses function retrieves status data using a service, stores it in the statusesData
   * variable, and logs the fetched data.
   */
  fetchStatuses() {
    this.statusService
      .getStatus()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.statusesData = data;
        log.info('Fetched Statuses', this.statusesData);
      });
  }

  /**
   * The function `filterServiceProviderTypes` filters a table based on the input value from an HTML
   * input element.
   * @param {Event} event - The `event` parameter in your `filterServiceProviderTypes` function is an
   * Event object that represents an event being handled, such as a user input event. It is typically
   * passed to event handler functions in JavaScript to provide information about the event that
   * occurred. In this case, you are using it to get
   */
  filterServiceProviderTypes(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.serviceProviderTypeTable.filterGlobal(filterValue, 'contains');
  }

  filterServiceProviderTypeActivity(event: Event) {}

  /**
   * The function `onServiceProviderTypeRowSelect` assigns the selected `ServiceProviderTypeDTO` to the
   * `selectedServiceProviderType` variable.
   * @param {ServiceProviderTypeDTO} provider - The parameter `provider` in the
   * `onServiceProviderTypeRowSelect` function is of type `ServiceProviderTypeDTO`. This parameter
   * represents the selected service provider type that is being passed to the function when a row is
   * selected.
   */
  onServiceProviderTypeRowSelect(provider: ServiceProviderTypeDTO) {
    this.selectedServiceProviderType = provider;
  }

  /**
   * The function `openServiceProviderTypeModal` displays a modal by adding a 'show' class and setting
   * its display property to 'block'.
   */
  openServiceProviderTypeModal() {
    const modal = document.getElementById('serviceProviderTypeModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeServiceProviderTypeModal` hides the modal with the id
   * 'serviceProviderTypeModal'.
   */
  closeServiceProviderTypeModal() {
    const modal = document.getElementById('serviceProviderTypeModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openServiceProviderTypeActivityModal() {}

  closeServiceProviderTypeActivityModal() {}

  /**
   * The `saveServiceProviderType` function handles the saving and updating of service provider types,
   * displaying success or error messages accordingly.
   * @returns The `saveServiceProviderType()` function returns nothing (`undefined`) in the case where
   * the form is invalid and certain actions are taken to handle the invalid form fields. If the form
   * is valid and the data is successfully saved or updated, the function does not explicitly return
   * anything as it performs the necessary operations within the function itself.
   */
  saveServiceProviderType() {
    this.submitted = true;
    this.createServiceProviderTypeForm.markAllAsTouched();

    if (this.createServiceProviderTypeForm.invalid) {
      const invalidControls = Array.from(
        document.querySelectorAll('.is-invalid')
      ) as Array<HTMLInputElement | HTMLSelectElement>;

      let firstInvalidUnfilledControl:
        | HTMLInputElement
        | HTMLSelectElement
        | null = null;

      for (const control of invalidControls) {
        if (!control.value) {
          firstInvalidUnfilledControl = control;
          break;
        }
      }

      if (firstInvalidUnfilledControl) {
        firstInvalidUnfilledControl.focus();
        const scrollContainer = this.utilService.findScrollContainer(
          firstInvalidUnfilledControl
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop;
        }
      } else {
        const firstInvalidControl = invalidControls[0];
        if (firstInvalidControl) {
          firstInvalidControl.focus();
          const scrollContainer =
            this.utilService.findScrollContainer(firstInvalidControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidControl.offsetTop;
          }
        }
      }
      return;
    }

    this.closeServiceProviderTypeModal();

    if (!this.selectedServiceProviderType) {
      const serviceProviderTypeFormValues =
        this.createServiceProviderTypeForm.getRawValue();

      const saveServiceProviderType: ServiceProviderTypeDTO = {
        code: null,
        name: serviceProviderTypeFormValues.name,
        providerTypeSuffixes: null,
        shortDescription: serviceProviderTypeFormValues.shortDescription,
        shortDescriptionNextNo: null,
        shortDescriptionSerialFormat: null,
        status: serviceProviderTypeFormValues.status,
        vatTaxRate: serviceProviderTypeFormValues.vatTaxRate,
        witholdingTaxRate: serviceProviderTypeFormValues.withHoldingTaxRate,
      };
      this.serviceProviderTypeService
        .createServiceProviderType(saveServiceProviderType)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Service Provider Type'
              );
              this.createServiceProviderTypeForm.reset();
              this.fetchServiceProviderTypes();
            } else {
              this.errorOccurred = true;
              this.errorMessage = 'Something went wrong. Please try Again';
              this.globalMessagingService.displayErrorMessage(
                'Error',
                'Something went wrong. Please try Again'
              );
            }
          },
          error: (err) => {
            this.errorOccurred = true;
            this.errorMessage = err?.error?.errors[0];
            this.globalMessagingService.displayErrorMessage(
              'Error',
              this.errorMessage
            );
            log.info(`error >>>`, err);
          },
        });
    } else {
      const serviceProviderTypeFormValues =
        this.createServiceProviderTypeForm.getRawValue();
      const serviceProviderTypeId = this.selectedServiceProviderType.code;

      const saveServiceProviderType: ServiceProviderTypeDTO = {
        code: serviceProviderTypeId,
        name: serviceProviderTypeFormValues.name,
        providerTypeSuffixes:
          this.selectedServiceProviderType.providerTypeSuffixes,
        shortDescription: serviceProviderTypeFormValues.shortDescription,
        shortDescriptionNextNo:
          this.selectedServiceProviderType.shortDescriptionNextNo,
        shortDescriptionSerialFormat:
          this.selectedServiceProviderType.shortDescriptionSerialFormat,
        status: serviceProviderTypeFormValues.status,
        vatTaxRate: serviceProviderTypeFormValues.vatTaxRate,
        witholdingTaxRate: serviceProviderTypeFormValues.withHoldingTaxRate,
      };
      this.serviceProviderTypeService
        .updateServiceProviderType(
          serviceProviderTypeId,
          saveServiceProviderType
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Service Provider Type'
              );
              this.createServiceProviderTypeForm.reset();
              this.fetchServiceProviderTypes();
            } else {
              this.errorOccurred = true;
              this.errorMessage = 'Something went wrong. Please try Again';
              this.globalMessagingService.displayErrorMessage(
                'Error',
                'Something went wrong. Please try Again'
              );
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
    }
  }

  /**
   * The `editServiceProviderType` function opens a modal to edit a selected service provider type and
   * populates the form fields with the selected type's data.
   */
  editServiceProviderType() {
    if (this.selectedServiceProviderType) {
      this.openServiceProviderTypeModal();
      this.createServiceProviderTypeForm.patchValue({
        shortDescription: this.selectedServiceProviderType.shortDescription,
        name: this.selectedServiceProviderType.name,
        status: this.selectedServiceProviderType.status,
        withHoldingTaxRate: this.selectedServiceProviderType.witholdingTaxRate,
        vatTaxRate: this.selectedServiceProviderType.vatTaxRate,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Service Provider Type is selected!.'
      );
    }
  }

  /**
   * The function `deleteServiceProviderType` displays a confirmation modal for deleting a service
   * provider type.
   */
  deleteServiceProviderType() {
    this.serviceProviderTypeConfirmationModal.show();
  }

  /**
   * The function `confirmServiceProviderTypeDelete` deletes a selected service provider type and
   * displays success or error messages accordingly.
   */
  confirmServiceProviderTypeDelete() {
    if (this.selectedServiceProviderType) {
      const serviceProviderTypeId = this.selectedServiceProviderType.code;
      this.serviceProviderTypeService
        .deleteServiceProviderType(serviceProviderTypeId)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deleted a Service Provider Type'
              );
              this.selectedServiceProviderType = null;
              this.fetchServiceProviderTypes();
            } else {
              this.errorOccurred = true;
              this.errorMessage = 'Something went wrong. Please try Again';
              this.globalMessagingService.displayErrorMessage(
                'Error',
                'Something went wrong. Please try Again'
              );
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
        'No Service Provider Type is selected!.'
      );
    }
  }

  editServiceProviderTypeActivity() {}

  deleteServiceProviderTypeActivity() {}
}
