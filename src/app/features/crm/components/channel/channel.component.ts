import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { UtilService } from '../../../../shared/services/util/util.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';
import { Logger } from '../../../../shared/services/logger/logger.service';
import { ChannelService } from '../../services/channel.service';
import { ChannelsDTO } from '../../data/channels';

const log = new Logger('ChannelComponent');

/* The ChannelComponent class is a TypeScript component that handles the creation, editing, and
deletion of channels in a CRM system. */
@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
})
export class ChannelComponent implements OnInit {
  @ViewChild('channelTable') channelTable: Table;
  @ViewChild('channelConfirmationModal')
  channelConfirmationModal!: ReusableInputComponent;

  public createChannelForm: FormGroup;
  public channelsData: ChannelsDTO[];
  public selectedChannel: ChannelsDTO;

  public groupId: string = 'channelTab';
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
      label: 'Business Sources',
      url: 'home/crm/channel',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private channelService: ChannelService,
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.ChannelsForm();
    this.fetchChannels();
  }

  ngOnDestroy(): void {}

  ChannelsForm() {
    this.createChannelForm = this.fb.group({
      name: [''],
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
            this.createChannelForm.controls[key].setValidators(
              Validators.required
            );
            this.createChannelForm.controls[key].updateValueAndValidity();
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
    return this.createChannelForm.controls;
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
   * The `fetchChannels` function retrieves channel data from a service, assigns it to a variable, and
   * handles any errors that occur during the process.
   */
  fetchChannels() {
    this.channelService
      .getChannels()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          if (data) {
            this.channelsData = data;
            log.info('Fetch channelData', this.channelsData);
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
   * The function assigns the selected channel to the "selectedChannel" variable.
   * @param {ChannelsDTO} channel - The parameter "channel" is of type ChannelsDTO, which is likely a
   * data transfer object representing a channel in your application.
   */
  onChannelRowSelect(channel: ChannelsDTO) {
    this.selectedChannel = channel;
  }

  /**
   * The function filters the channels in a table based on a user input value.
   * @param {Event} event - The event parameter is an object that represents the event that triggered
   * the function. It could be an event like a button click, input change, or form submission.
   */
  filterChannels(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.channelTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function "openChannelModal" opens a modal by adding the "show" class and setting the display
   * property to "block".
   */
  openChannelModal() {
    const modal = document.getElementById('channelModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  /**
   * The function "closeChannelModal" hides and removes the "channelModal" element from the DOM.
   */
  closeChannelModal() {
    const modal = document.getElementById('channelModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  /**
   * The `saveChannel()` function is responsible for saving a channel by either creating a new channel
   * or updating an existing channel.
   * @returns The function does not explicitly return a value.
   */
  saveChannel() {
    this.submitted = true;
    this.createChannelForm.markAllAsTouched();

    if (this.createChannelForm.invalid) {
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

    this.closeChannelModal();

    if (!this.selectedChannel) {
      const channelFormValues = this.createChannelForm.getRawValue();

      const saveChannel: ChannelsDTO = {
        channelDesc: channelFormValues.description,
        channelName: channelFormValues.name,
        id: null,
      };
      this.channelService.createChannel(saveChannel).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Created a Channel'
            );
            this.createChannelForm.reset();
            this.fetchChannels();
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
      const channelFormValues = this.createChannelForm.getRawValue();

      const channelId = this.selectedChannel.id;

      const saveChannel: ChannelsDTO = {
        channelDesc: channelFormValues.description,
        channelName: channelFormValues.name,
        id: channelId,
      };
      this.channelService.updateChannel(channelId, saveChannel).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'Success',
              'Successfully Updated a Channel'
            );
            this.createChannelForm.reset();
            this.fetchChannels();
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
   * The function `editChannel()` checks if a channel is selected and opens a modal to edit the
   * channel's name and description, or displays an error message if no channel is selected.
   */
  editChannel() {
    if (this.selectedChannel) {
      this.openChannelModal();
      this.createChannelForm.patchValue({
        name: this.selectedChannel.channelName,
        description: this.selectedChannel.channelDesc,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Channel is selected!.'
      );
    }
  }

  /**
   * The deleteChannel function displays a confirmation modal.
   */
  deleteChannel() {
    this.channelConfirmationModal.show();
  }

  /**
   * The `confirmChannelDelete()` function deletes a selected channel and displays success or error
   * messages accordingly.
   */
  confirmChannelDelete() {
    if (this.selectedChannel) {
      const channelId = this.selectedChannel.id;
      this.channelService.deleteChannel(channelId).subscribe({
        next: (data) => {
          if (data) {
            this.globalMessagingService.displaySuccessMessage(
              'success',
              'Successfully deleted a channel'
            );
            this.selectedChannel = null;
            this.fetchChannels();
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
        'No Channel is selected!.'
      );
    }
  }
}
