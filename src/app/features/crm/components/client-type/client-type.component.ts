import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { ClientTypeDTO } from '../../../../shared/data/common/client-type';
import { ClientTypeService } from '../../../../shared/services/setups/client-type/client-type.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { Logger } from '../../../../shared/services/logger/logger.service';

const log = new Logger('ClientTypeComponent');

/* The `ClientTypeComponent` class in TypeScript manages client type data, form submission, modal
interactions, and error handling within an Angular application. */
@Component({
  selector: 'app-client-type',
  templateUrl: './client-type.component.html',
  styleUrls: ['./client-type.component.css'],
})
export class ClientTypeComponent implements OnInit {
  @ViewChild('clientTypeTable') clientTypeTable: Table;
  @ViewChild('clientTypeConfirmationModal')
  clientTypeConfirmationModal!: ReusableInputComponent;

  public createClientTypeForm: FormGroup;

  public clientTypeData: ClientTypeDTO[];
  public selectedClientType: ClientTypeDTO;

  public groupId: string = 'clientTypeTab';
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
      label: 'Client Type',
      url: 'home/crm/client-type',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private clientTypeService: ClientTypeService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.ClientTypeForm();
    this.fetchClientTypes();
  }

  ngOnDestroy(): void {}

  ClientTypeForm() {
    this.createClientTypeForm = this.fb.group({
      category: [''],
      clientTypeName: [''],
      description: [''],
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
            this.createClientTypeForm.controls[key].setValidators(
              Validators.required
            );
            this.createClientTypeForm.controls[key].updateValueAndValidity();
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
    return this.createClientTypeForm.controls;
  }

  /**
   * The fetchClientTypes function in TypeScript fetches client type data based on specified parameters
   * and handles success and error responses accordingly.
   * @param {string} [name] - The `name` parameter is used to filter client types by their name. If you
   * provide a value for this parameter, the function will fetch client types that match the specified
   * name. If you don't provide a value, all client types will be fetched without filtering by name.
   * @param {string} [shortDescription] - The `shortDescription` parameter in the `fetchClientTypes`
   * function is used to filter client types based on a brief description or summary of the client
   * type. This parameter allows you to search for client types that have a specific short description
   * associated with them.
   * @param {string} [status] - The `status` parameter in the `fetchClientTypes` function is used to
   * filter client types based on their status. This could be used to retrieve client types that are
   * active, inactive, pending, etc. The `status` parameter allows you to specify the status of the
   * client types you want to
   * @param {string} [category] - The `category` parameter in the `fetchClientTypes` function is used
   * to filter client types based on a specific category. When calling the `getClientType` method from
   * the `clientTypeService`, you can pass the `category` parameter to retrieve client types belonging
   * to that particular category. This helps
   * @param {string} [clientTypeName] - The `clientTypeName` parameter in the `fetchClientTypes`
   * function is used to filter the client types based on a specific name or identifier assigned to
   * each client type. This parameter allows you to retrieve client types that match the specified
   * `clientTypeName`.
   * @param {string} [description] - The `description` parameter in the `fetchClientTypes` function is
   * used to filter client types based on a description provided as a search criteria. This parameter
   * allows you to search for client types that have a specific description associated with them.
   * @param {number} [organizationId] - The `organizationId` parameter in the `fetchClientTypes`
   * function is used to specify the ID of the organization for which you want to fetch client types.
   * This parameter helps in filtering the client types based on the organization to which they belong.
   * @param {string} [type] - The `type` parameter in the `fetchClientTypes` function is used to
   * specify the type of client. It is one of the parameters that can be passed to the `getClientType`
   * method of the `clientTypeService`. This parameter helps in filtering and fetching client types
   * based on a specific type
   */
  fetchClientTypes(
    name?: string,
    shortDescription?: string,
    status?: string,
    category?: string,
    clientTypeName?: string,
    description?: string,
    organizationId?: number,
    type?: string
  ) {
    this.clientTypeService
      .getClientType(
        name,
        shortDescription,
        status,
        category,
        clientTypeName,
        description,
        organizationId,
        type
      )
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.clientTypeData = data;
            log.info(`Fetched Client Type Data`, this.clientTypeData);
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
  }

  /**
   * The function `filterClientType` filters a table based on the input value from an HTML input
   * element.
   * @param {Event} event - The `event` parameter is an object that represents an event that occurs in
   * the browser, such as a click, keypress, or input event. In this context, it is used to capture the
   * event triggered by an HTML input element, allowing you to access the value entered by the user in
   * the
   */
  filterClientType(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientTypeTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function `onClientTypeRowSelect` sets the selected client type based on the provided client
   * object.
   * @param {ClientTypeDTO} client - ClientTypeDTO
   */
  onClientTypeRowSelect(client: ClientTypeDTO) {
    this.selectedClientType = client;
  }

  /**
   * The function `openClientTypeModal` displays a modal by adding a 'show' class and setting its
   * display property to 'block'.
   */
  openClientTypeModal() {
    const modal = document.getElementById('clientTypeModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeClientTypeModal` hides the client type modal by removing the 'show' class and
   * setting the display style to 'none'.
   */
  closeClientTypeModal() {
    const modal = document.getElementById('clientTypeModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `saveClientType` function in TypeScript handles the submission of a form for creating or
   * updating a client type, displaying success or error messages accordingly.
   * @returns The function `saveClientType()` returns either nothing (undefined) or exits early if the
   * form is invalid and there are unfilled controls. If the form is valid and all controls are filled,
   * the function proceeds to create or update a client type based on the conditions provided.
   */
  saveClientType() {
    this.submitted = true;
    this.createClientTypeForm.markAllAsTouched();

    if (this.createClientTypeForm.invalid) {
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
    this.closeClientTypeModal();

    if (!this.selectedClientType) {
      const clientTypeFormValues = this.createClientTypeForm.getRawValue();

      const saveClientType: ClientTypeDTO = {
        category: clientTypeFormValues.category,
        clientTypeName: clientTypeFormValues.clientTypeName,
        code: null,
        description: clientTypeFormValues.description,
        organizationId: 2,
        person: null,
        type: null,
      };
      this.clientTypeService.createClientType(saveClientType).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a Client Type'
            );
            this.createClientTypeForm.reset();
            this.fetchClientTypes();
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
      const clientTypeFormValues = this.createClientTypeForm.getRawValue();

      const clientCode = this.selectedClientType.code;

      const updateClientType: ClientTypeDTO = {
        category: clientTypeFormValues.category,
        clientTypeName: clientTypeFormValues.clientTypeName,
        code: clientCode,
        description: clientTypeFormValues.description,
        organizationId: this.selectedClientType.organizationId,
        person: this.selectedClientType.person,
        type: this.selectedClientType.type,
      };
      this.clientTypeService
        .updateClientType(clientCode, updateClientType)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Client Type'
              );
              this.createClientTypeForm.reset();
              this.fetchClientTypes();
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
    }
  }

  /**
   * The `editClientType` function opens a modal and populates a form with the details of a selected
   * client type for editing.
   */
  editClientType() {
    if (this.selectedClientType) {
      this.openClientTypeModal();
      this.createClientTypeForm.patchValue({
        category: this.selectedClientType.category,
        clientTypeName: this.selectedClientType.clientTypeName,
        description: this.selectedClientType.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Client Type is selected!.'
      );
    }
  }

  /**
   * The `deleteClientType` function displays a confirmation modal for deleting a client type.
   */
  deleteClientType() {
    this.clientTypeConfirmationModal.show();
  }

  /**
   * The function `confirmClientTypeDelete` deletes a selected client type and displays success or
   * error messages accordingly.
   */
  confirmClientTypeDelete() {
    if (this.selectedClientType) {
      const clientCode = this.selectedClientType.code;
      this.clientTypeService.deleteClientType(clientCode).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Client Type'
            );
            this.selectedClientType = null;
            this.fetchClientTypes();
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
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Client Type is selected!.'
      );
    }
  }
}
