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

const log = new Logger('ChannelComponent');

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
  public channelsData: any;
  public selectedChannel: any;

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
    private utilService: UtilService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private globalMessagingService: GlobalMessagingService
  ) {}

  ngOnInit(): void {
    this.ChannelsForm();
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

  fetchChannels() {}

  onChannelRowSelect(channel: any) {
    this.selectedChannel = channel;
  }

  filterChannels(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.channelTable.filterGlobal(filterValue, 'contains');
  }

  openChannelModal() {
    const modal = document.getElementById('channelModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeChannelModal() {
    const modal = document.getElementById('channelModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

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
  }

  editChannel() {
    if (this.selectedChannel) {
      this.openChannelModal();
      this.createChannelForm.patchValue({
        name: this.selectedChannel.name,
        description: this.selectedChannel.description,
      });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No Channel is selected!.'
      );
    }
  }

  deleteChannel() {
    this.channelConfirmationModal.show();
  }

  confirmChannelDelete() {
    // if (this.selectedChannel) {
    //   const channelId = this.selectedChannel.code;
    //   this.channelService.deleteRequiredChannels(channelId).subscribe({
    //     next: (data) => {
    //       if (data) {
    //         this.globalMessagingService.displaySuccessMessage(
    //           'success',
    //           'Successfully deleted a channel'
    //         );
    //         this.selectedChannel = null;
    //         this.fetchChannels();
    //       } else {
    //         this.errorOccurred = true;
    //         this.errorMessage = 'Something went wrong. Please try Again';
    //         this.globalMessagingService.displayErrorMessage(
    //           'Error',
    //           'Something went wrong. Please try Again'
    //         );
    //       }
    //     },
    //     error: (err) => {
    //       this.globalMessagingService.displayErrorMessage(
    //         'Error',
    //         err?.error?.errors[0]
    //       );
    //       log.info(`error >>>`, err);
    //     },
    //   });
    // }else {
    // this.globalMessagingService.displayErrorMessage(
    //     'Error',
    //     'No Channel is selected!.'
    //   );
    // }
  }
}
