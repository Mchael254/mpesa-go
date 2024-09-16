import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { LeadSourceDto, LeadStatusDto } from '../../data/leads';
import { LeadsService } from '../../services/leads.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';

const log = new Logger('LeadSourcesStatusesComponent');

/* This TypeScript class represents a component for managing lead sources and statuses in a CRM system. */
@Component({
  selector: 'app-lead-sources-statuses',
  templateUrl: './lead-sources-statuses.component.html',
  styleUrls: ['./lead-sources-statuses.component.css'],
})
export class LeadSourcesStatusesComponent implements OnInit {
  @ViewChild('sourceTable') sourceTable: Table;
  @ViewChild('statusTable') statusTable: Table;
  @ViewChild('leadSourceConfirmationModal')
  leadSourceConfirmationModal!: ReusableInputComponent;
  @ViewChild('leadStatusConfirmationModal')
  leadStatusConfirmationModal!: ReusableInputComponent;

  public createLeadSourceForm: FormGroup;
  public createLeadStatusForm: FormGroup;

  public leadSourcesData: LeadSourceDto[] = [];
  public leadStatusesData: LeadStatusDto[] = [];
  public selectedLeadSource: LeadSourceDto | null = null;
  public selectedLeadStatus: LeadStatusDto | null = null;

  public groupId: string = 'leadSourceTab';
  public ggroupId: string = 'leadStatusTab';
  public response: any;
  public submitted = false;
  public visibleStatus: any = {};
  public errorOccurred = false;
  public errorMessage: string = '';

  leadsBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Leads and Potentials',
      url: 'home/crm/organization',
    },

    {
      label: 'Lead Sources and Statuses',
      url: 'home/crm/lead-sources-statuses',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private utilService: UtilService,
    private leadService: LeadsService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.SourcesForm();
    this.StatusesForm();
    this.fetchLeadSources();
    this.fetchLeadStatuses();
  }

  ngOnDestroy(): void {}

  SourcesForm() {
    this.createLeadSourceForm = this.fb.group({
      description: ['', [Validators.maxLength(25)]],
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
            this.createLeadSourceForm.controls[key].setValidators(
              Validators.required
            );
            this.createLeadSourceForm.controls[key].updateValueAndValidity();
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
    return this.createLeadSourceForm.controls;
  }

  StatusesForm() {
    this.createLeadStatusForm = this.fb.group({
      statusDescription: [''],
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
            this.createLeadStatusForm.controls[key].setValidators(
              Validators.required
            );
            this.createLeadStatusForm.controls[key].updateValueAndValidity();
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

  get g() {
    return this.createLeadStatusForm.controls;
  }

  /**
   * The function `filterLeadSources` filters the data in a table based on the input value provided by
   * the user.
   * @param {Event} event - The `event` parameter in the `filterLeadSources` function is an Event object
   * that is passed as an argument when the function is called. It is used to capture the event that
   * triggered the function, such as a user input event like typing in an input field.
   */
  filterLeadSources(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sourceTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function `filterLeadStatuses` filters the global status table based on the input value from an
   * HTML input element.
   * @param {Event} event - The `event` parameter is an object that represents an event that has
   * occurred, such as a user interaction like clicking a button or entering text into an input field.
   * In this context, it seems to be related to an input event, as it is used to get the value of an
   * HTML input element
   */
  filterLeadStatuses(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.statusTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function toggles the selected lead source between null and the provided source.
   * @param {LeadSourceDto} source - The `source` parameter in the `onLeadSourcesRowSelect` function is
   * of type `LeadSourceDto`. It represents the lead source object that is being selected or deselected
   * in the function.
   */
  onLeadSourcesRowSelect(source: LeadSourceDto) {
    if (this.selectedLeadSource === source) {
      this.selectedLeadSource = null;
    } else {
      this.selectedLeadSource = source;
    }
  }

  /**
   * The function toggles the selectedLeadStatus between null and the provided status.
   * @param {LeadStatusDto} status - The `status` parameter in the `onLeadStatusesRowSelect` function
   * is of type `LeadStatusDto`. This function is used to handle the selection of a lead status row. If
   * the currently selected lead status is the same as the one passed in as `status`, it will be dese
   */
  onLeadStatusesRowSelect(status: LeadStatusDto) {
    if (this.selectedLeadStatus === status) {
      this.selectedLeadStatus = null;
    } else {
      this.selectedLeadStatus = status;
    }
  }

  /**
   * The function `createLeadSource` checks if a lead status is selected and opens a modal if not.
   */
  createLeadSource() {
    if (!this.selectedLeadStatus) {
      this.openLeadSourceModal();
    }
  }

  /**
   * The function `createLeadStatus` checks if a lead status is selected and opens a modal if not.
   */
  createLeadStatus() {
    if (!this.selectedLeadStatus) {
      this.openLeadStatusModal();
    }
  }

  /**
   * The function `openLeadSourceModal` displays a modal by adding a 'show' class and setting its
   * display style to 'block'.
   */
  openLeadSourceModal() {
    const modal = document.getElementById('sourceModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeLeadSourceModal` hides and removes the 'show' class from the element with the
   * id 'sourceModal'.
   */
  closeLeadSourceModal() {
    const modal = document.getElementById('sourceModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The function "openLeadStatusModal" displays a modal with the id 'statusModal' by adding a 'show'
   * class and setting its display property to 'block'.
   */
  openLeadStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function `closeLeadStatusModal` hides the status modal by removing the 'show' class and
   * setting the display style to 'none'.
   */
  closeLeadStatusModal() {
    const modal = document.getElementById('statusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `fetchLeadSources` function fetches lead sources data and handles success and error responses
   * accordingly.
   */
  fetchLeadSources() {
    this.leadService
      .getLeadSources()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadSourcesData = data;
            log.info('Fetch Lead Sources', this.leadSourcesData);
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

  /**
   * The fetchLeadStatuses function fetches lead statuses from a service and handles success and error
   * responses accordingly.
   */
  fetchLeadStatuses() {
    this.leadService
      .getLeadStatuses()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.leadStatusesData = data;
            log.info('Fetch Lead Statuses', this.leadStatusesData);
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

  /**
   * The `saveLeadSource` function handles the submission of a lead source form, performs validation,
   * and either creates a new lead source or updates an existing one based on the form data.
   * @returns The `saveLeadSource()` function returns either nothing (undefined) or exits early with a
   * `return` statement if the form is invalid and there are unfilled controls. If the form is valid
   * and all necessary data is filled, the function proceeds to create or update a lead source and then
   * resets the form and fetches the lead sources accordingly.
   */
  saveLeadSource() {
    this.submitted = true;
    this.createLeadSourceForm.markAllAsTouched();

    if (this.createLeadSourceForm.invalid) {
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

    this.closeLeadSourceModal();

    if (!this.selectedLeadSource) {
      const leadSourceFormValues = this.createLeadSourceForm.getRawValue();

      const saveLeadSource: LeadSourceDto = {
        code: null,
        description: leadSourceFormValues.description,
      };
      this.leadService.createLeadSources(saveLeadSource).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a Lead Source'
            );
            this.createLeadSourceForm.reset();
            this.fetchLeadSources();
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
      const leadSourceFormValues = this.createLeadSourceForm.getRawValue();
      const leadSourceId = this.selectedLeadSource.code;

      const updateLeadSource: LeadSourceDto = {
        code: leadSourceId,
        description: leadSourceFormValues.description,
      };

      this.leadService
        .updateLeadSources(leadSourceId, updateLeadSource)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Lead Source'
              );
              this.createLeadSourceForm.reset();
              this.fetchLeadSources();
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
   * The `editLeadSource` function checks if a lead source is selected, opens a modal, and updates the
   * form with the selected lead source's description; otherwise, it displays an error message.
   */
  editLeadSource() {
    if (this.selectedLeadSource) {
      this.openLeadSourceModal();
      this.createLeadSourceForm.patchValue({
        description: this.selectedLeadSource.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Lead Source is selected!.'
      );
    }
  }

  /**
   * The function `deleteLeadSource` displays a confirmation modal for deleting a lead source.
   */
  deleteLeadSource() {
    this.leadSourceConfirmationModal.show();
  }

  /**
   * The function `confirmLeadSourceDelete` deletes a selected lead source and displays success or
   * error messages accordingly.
   */
  confirmLeadSourceDelete() {
    if (this.selectedLeadSource) {
      const leadSourceId = this.selectedLeadSource.code;
      this.leadService.deleteLeadSources(leadSourceId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Lead Source'
            );
            this.selectedLeadSource = null;
            this.fetchLeadSources();
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
        'No Lead Source is selected!.'
      );
    }
  }

  /**
   * The `saveLeadStatus` function handles the submission of a lead status form, performs validation,
   * and either creates a new lead status or updates an existing one based on user input.
   * @returns The `saveLeadStatus()` function returns nothing (`undefined`) in the case where the form
   * is invalid and certain conditions are met. If the form is valid and the lead status is either
   * created or updated successfully, the function does not explicitly return anything as it continues
   * to execute the success logic for creating or updating the lead status.
   */
  saveLeadStatus() {
    this.submitted = true;
    this.createLeadStatusForm.markAllAsTouched();

    if (this.createLeadStatusForm.invalid) {
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

    this.closeLeadStatusModal();

    if (!this.selectedLeadStatus) {
      const leadStatusFormValues = this.createLeadStatusForm.getRawValue();

      const saveLeadStatus: LeadStatusDto = {
        code: null,
        description: leadStatusFormValues.statusDescription,
      };
      this.leadService.createLeadStatuses(saveLeadStatus).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a Lead Status'
            );
            this.createLeadStatusForm.reset();
            this.fetchLeadStatuses();
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
      const leadStatusFormValues = this.createLeadStatusForm.getRawValue();
      const leadStatusId = this.selectedLeadStatus.code;

      const updateLeadStatus: LeadStatusDto = {
        code: leadStatusId,
        description: leadStatusFormValues.statusDescription,
      };

      this.leadService
        .updateLeadStatuses(leadStatusId, updateLeadStatus)
        .subscribe({
          next: (data) => {
            if (data) {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                'Successfully Updated a Lead Status'
              );
              this.createLeadStatusForm.reset();
              this.fetchLeadStatuses();
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
   * The `editLeadStatus` function checks if a lead status is selected and opens a modal to edit the
   * status description, displaying an error message if no status is selected.
   */
  editLeadStatus() {
    if (this.selectedLeadStatus) {
      this.openLeadStatusModal();
      this.createLeadStatusForm.patchValue({
        statusDescription: this.selectedLeadStatus.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Lead Status is selected!.'
      );
    }
  }

  /**
   * The function `deleteLeadStatus` displays a confirmation modal for deleting a lead status.
   */
  deleteLeadStatus() {
    this.leadStatusConfirmationModal.show();
  }

  /**
   * The function `confirmLeadStatusDelete` deletes a selected lead status and displays success or
   * error messages accordingly.
   */
  confirmLeadStatusDelete() {
    if (this.selectedLeadStatus) {
      const leadStatusId = this.selectedLeadStatus.code;
      this.leadService.deleteLeadStatuses(leadStatusId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a Lead Status'
            );
            this.selectedLeadStatus = null;
            this.fetchLeadStatuses();
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
        'No Lead Status is selected!.'
      );
    }
  }
}
