import { Component, OnInit, ViewChild } from '@angular/core';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { RequiredDocumentsService } from '../../services/required-documents.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import {
  AssignedToDTO,
  RequiredDocumentDTO,
} from '../../data/required-document';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { Table } from 'primeng/table';
import { EntityService } from '../../../../features/entities/services/entity/entity.service';
import { PartyTypeDto } from '../../../../features/entities/data/partyTypeDto';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';

const log = new Logger('RequiredDocumentsComponent');

/* The `RequiredDocumentsComponent` class is a TypeScript component that handles the management of
required documents and their assignment to different accounts. */
@Component({
  selector: 'app-required-documents',
  templateUrl: './required-documents.component.html',
  styleUrls: ['./required-documents.component.css'],
})
export class RequiredDocumentsComponent implements OnInit {
  @ViewChild('documentTable') documentTable: Table;
  @ViewChild('assignDocumentTable') assignDocumentTable: Table;
  @ViewChild('documentConfirmationModal')
  documentConfirmationModal!: ReusableInputComponent;
  @ViewChild('documentAssignConfirmationModal')
  documentAssignConfirmationModal!: ReusableInputComponent;

  public createDocumentForm: FormGroup;
  public createAssignDocumentForm: FormGroup;
  public documentsData: RequiredDocumentDTO[];
  public AssignDocumentData: AssignedToDTO[];
  public selectedDocument: RequiredDocumentDTO;
  public selectedAssignDocument: AssignedToDTO;
  public accountType: any[] = [];
  public accounts: PartyTypeDto[] = [];

  public groupId: string = 'requiredDocumentTab';
  public ggroupId: string = 'assignDocumentTab';
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
      label: 'Org Parameters',
      url: 'home/crm/organization',
    },

    {
      label: 'Required Documents',
      url: 'home/crm/required-documents',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private documentService: RequiredDocumentsService,
    private entityService: EntityService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.RequiredDocumentsForm();
    this.AssignRequiredDocumentsForm();
    this.fetchRequiredDocuments();
    this.getAccountType();
  }

  ngOnDestroy(): void {}

  RequiredDocumentsForm() {
    this.createDocumentForm = this.fb.group({
      shortDescription: [''],
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
            this.createDocumentForm.controls[key].setValidators(
              Validators.required
            );
            this.createDocumentForm.controls[key].updateValueAndValidity();
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
    return this.createDocumentForm.controls;
  }

  AssignRequiredDocumentsForm() {
    this.createAssignDocumentForm = this.fb.group({
      account: [''],
      accountType: [''],
      default: [''],
    });
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.ggroupId)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          this.visibleStatus[field.frontedId] = field.visibleStatus;
          if (field.visibleStatus === 'Y' && field.mandatoryStatus === 'Y') {
            const key = field.frontedId;
            this.createAssignDocumentForm.controls[key].setValidators(
              Validators.required
            );
            this.createAssignDocumentForm.controls[
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

  /**
   * The function "onAccountChange" is triggered when the account selection changes, and it retrieves
   * account data based on the selected account type.
   * @param {Event} event - The event parameter is an object that represents the event that triggered
   * the function. In this case, it is of type Event, which is a generic event interface that
   * represents any event in the DOM. It contains information about the event, such as the target
   * element that triggered the event.
   */
  onAccountChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const accountType = target.value;
    this.getAccountDataByAccountType(accountType);
  }

  /**
   * The function `getAccountDataByAccountType` retrieves account data based on the specified account
   * type and handles any errors that occur.
   * @param {string} [accountType] - The `accountType` parameter is a string that represents the type
   * of account for which you want to retrieve data.
   */
  getAccountDataByAccountType(accountType?: string) {
    this.documentService
      .getAllDataByClientType(accountType)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.accountType = data;
            log.info('Fetch AccountType for DropdownData', this.accountType);
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
            err?.message
          );
          log.info(`error >>>`, err);
        },
      });
  }

  /**
   * The function `getAccountType()` retrieves account types from an entity service and handles success
   * and error cases.
   */
  getAccountType() {
    this.entityService
      .getPartiesType()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.accounts = data;
            log.info('Fetched Accounts', this.accounts);
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
            err?.message
          );
          log.info(`error >>>`, err);
        },
      });
  }

  /**
   * The function fetches required documents for an organization and handles success and error cases.
   * @param {number} [organizationId] - The organizationId parameter is an optional parameter of type
   * number. It is used to specify the ID of the organization for which the required documents need to
   * be fetched. If no organizationId is provided, the function will fetch the required documents for
   * all organizations.
   */
  fetchRequiredDocuments(organizationId?: number) {
    this.documentService
      .getRequiredDocuments(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.documentsData = data;
            log.info('Fetched Required Documents', this.documentsData);
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

  fetchRequiredDocumentAssignments(documentId: number) {
    this.documentService
      .getRequiredDocumentAssignments(documentId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.AssignDocumentData = data;
            log.info(
              'Fetched Required Documents Assignments',
              this.AssignDocumentData
            );
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

  /**
   * The function "onDocumentsRowSelect" selects a document and retrieves account data based on the
   * selected document's account type.
   * @param {RequiredDocumentDTO} document - The parameter "document" is of type RequiredDocumentDTO,
   * which is a data transfer object representing a required document.
   */
  onDocumentsRowSelect(document: RequiredDocumentDTO) {
    this.selectedDocument = document;
    this.fetchRequiredDocumentAssignments(this.selectedDocument.id);
    this.getAccountDataByAccountType(this.selectedDocument.accountType);
  }

  onDocumentAssignmentRowSelect(assignedDocument: AssignedToDTO) {
    this.selectedAssignDocument = assignedDocument;
    this.getAccountDataByAccountType(this.selectedAssignDocument.accountType);
  }

  /**
   * The function filters documents in a table based on a user input value.
   * @param {Event} event - The event parameter is an object that represents an event that has
   * occurred, such as a user input event or a button click event. It contains information about the
   * event, such as the target element that triggered the event. In this case, the event is expected to
   * be a user input event, such as
   */
  filterDocuments(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.documentTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function filters the assignDocumentTable based on the value entered in the HTMLInputElement.
   * @param {Event} event - The event parameter is an object that represents the event that triggered
   * the function. It could be an input event, such as when a user types into an input field, or a
   * button click event, among others.
   */
  filterAssignDocuments(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignDocumentTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function opens a document modal by adding a 'show' class and setting the display property to
   * 'block'.
   */
  openDocumentModal() {
    const modal = document.getElementById('documentModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeDocumentModal" hides and removes the "documentModal" element from the DOM.
   */
  closeDocumentModal() {
    const modal = document.getElementById('documentModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function opens a modal by adding a 'show' class and setting the display property to 'block'.
   */
  openAssignDocumentModal() {
    const modal = document.getElementById('assignDocumentModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function closes a modal by removing the 'show' class and hiding it.
   */
  closeAssignDocumentModal() {
    const modal = document.getElementById('assignDocumentModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `saveDocument()` function is responsible for saving a document, either by creating a new
   * document or updating an existing one, and displaying success or error messages accordingly.
   * @returns The function does not explicitly return a value.
   */
  saveDocument() {
    this.submitted = true;
    this.createDocumentForm.markAllAsTouched();

    if (this.createDocumentForm.invalid) {
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

    this.closeDocumentModal();

    if (!this.selectedDocument) {
      const requiredDocumentFormValues = this.createDocumentForm.getRawValue();

      const saveRequiredDocuments: RequiredDocumentDTO = {
        accountType: null,
        dateSubmitted: null,
        description: requiredDocumentFormValues.description,
        id: null,
        isMandatory: null,
        organizationId: null,
        organizationName: null,
        shortDescription: requiredDocumentFormValues.shortDescription,
      };
      this.documentService
        .createRequiredDocument(saveRequiredDocuments)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Required Document'
              );
              this.createDocumentForm.reset();
              this.fetchRequiredDocuments();
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
      const requiredDocumentFormValues = this.createDocumentForm.getRawValue();
      const documentId = this.selectedDocument.id;

      const saveRequiredDocuments: RequiredDocumentDTO = {
        accountType: this.selectedDocument.accountType,
        dateSubmitted: this.selectedDocument.dateSubmitted,
        description: requiredDocumentFormValues.description,
        id: documentId,
        isMandatory: this.selectedDocument.isMandatory,
        organizationId: this.selectedDocument.organizationId,
        organizationName: this.selectedDocument.organizationName,
        shortDescription: requiredDocumentFormValues.shortDescription,
      };
      this.documentService
        .updateRequiredDocument(documentId, saveRequiredDocuments)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Required Document'
              );
              this.createDocumentForm.reset();
              this.fetchRequiredDocuments();
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
   * The function `editDocument()` opens a modal and populates it with the details of the selected
   * document, or displays an error message if no document is selected.
   */
  editDocument() {
    if (this.selectedDocument) {
      this.openDocumentModal();
      this.createDocumentForm.patchValue({
        shortDescription: this.selectedDocument.shortDescription,
        description: this.selectedDocument.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Required Document is selected!.'
      );
    }
  }

  /**
   * The function "deleteDocument" displays a confirmation modal for deleting a document.
   */
  deleteDocument() {
    this.documentConfirmationModal.show();
  }

  /**
   * The `confirmDocumentDelete()` function deletes a selected document and displays success or error
   * messages accordingly.
   */
  confirmDocumentDelete() {
    if (this.selectedDocument) {
      const documentId = this.selectedDocument.id;
      this.documentService.deleteRequiredDocument(documentId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted Required Documents'
            );
            this.selectedDocument = null;
            this.fetchRequiredDocuments();
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

  saveAssignDocument() {
    this.submitted = true;
    this.createAssignDocumentForm.markAllAsTouched();

    if (this.createAssignDocumentForm.invalid) {
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
    this.closeAssignDocumentModal();

    if (!this.selectedAssignDocument) {
      const requiredDocumentAssignFormValues =
        this.createAssignDocumentForm.getRawValue();

      const requiredDocumentId = this.selectedDocument.id;

      const saveRequiredDocumentAssign: AssignedToDTO = {
        id: null,
        isMandatory: requiredDocumentAssignFormValues.default,
        requiredDocumentCode: this.selectedDocument.id,
        requiredDocumentName: this.selectedDocument.description,
        accountType: requiredDocumentAssignFormValues.account,
        accountSubTypeCode: null,
        accountSubType: requiredDocumentAssignFormValues.accountType,
      };
      this.documentService
        .createRequiredDocumentAssignment(
          saveRequiredDocumentAssign,
          requiredDocumentId
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Created a Required Document Assignment'
              );
              this.createAssignDocumentForm.reset();
              this.fetchRequiredDocumentAssignments(requiredDocumentId);
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
      const requiredDocumentId = this.selectedDocument.id;
      const requiredDocAssignmentId = this.selectedAssignDocument.id;

      const requiredDocumentAssignFormValues =
        this.createAssignDocumentForm.getRawValue();

      const saveRequiredDocumentAssign: AssignedToDTO = {
        id: requiredDocAssignmentId,
        isMandatory: requiredDocumentAssignFormValues.default,
        requiredDocumentCode: requiredDocumentId,
        requiredDocumentName: this.selectedAssignDocument.requiredDocumentName,
        accountType: requiredDocumentAssignFormValues.account,
        accountSubTypeCode: this.selectedAssignDocument.accountSubTypeCode,
        accountSubType: requiredDocumentAssignFormValues.accountType,
      };
      this.documentService
        .updateRequiredDocumentAssignment(
          requiredDocAssignmentId,
          saveRequiredDocumentAssign,
          requiredDocumentId
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Required Document Assignment'
              );
              this.createAssignDocumentForm.reset();
              this.fetchRequiredDocumentAssignments(requiredDocumentId);
              this.selectedAssignDocument = null;
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

  editAssignDocument() {
    if (this.selectedAssignDocument) {
      this.openAssignDocumentModal();
      this.createAssignDocumentForm.patchValue({
        account: this.selectedAssignDocument.accountType,
        accountType: this.selectedAssignDocument.accountSubType,
        default: this.selectedAssignDocument.isMandatory,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Required Document Assignment is selected!.'
      );
    }
  }

  deleteAssignDocument() {
    this.documentAssignConfirmationModal.show();
  }

  confirmDocumentAssignDelete() {
    if (this.selectedAssignDocument) {
      const requiredDocumentId = this.selectedDocument.id;
      const requiredDocAssignmentId = this.selectedAssignDocument.id;
      this.documentService
        .deleteRequiredDocumentAssignment(
          requiredDocAssignmentId,
          requiredDocumentId
        )
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'success',
                'Successfully deleted Required Documents'
              );
              this.fetchRequiredDocumentAssignments(requiredDocumentId);
              this.selectedAssignDocument = null;
              this.selectedDocument = null;
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
}
