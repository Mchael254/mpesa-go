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

  filterClientType(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.clientTypeTable.filterGlobal(filterValue, 'contains');
  }

  onClientTypeRowSelect(client: ClientTypeDTO) {
    this.selectedClientType = client;
  }

  openClientTypeModal() {
    const modal = document.getElementById('clientTypeModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeClientTypeModal() {
    const modal = document.getElementById('clientTypeModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

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

  deleteClientType() {
    this.clientTypeConfirmationModal.show();
  }

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
