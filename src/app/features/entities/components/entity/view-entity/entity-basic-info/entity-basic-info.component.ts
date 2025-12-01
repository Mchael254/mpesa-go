import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AccountReqPartyId,
  ReqPartyById,
} from 'src/app/features/entities/data/entityDto';
import { PartyAccountsDetails } from '../../../../data/accountDTO';
import {Logger, UtilService} from '../../../../../../shared/services';
import { PartyTypeDto } from '../../../../data/partyTypeDto';
import {StatusService} from "../../../../../../shared/services/system-definitions/status.service";
import {StatusDTO} from "../../../../../../shared/data/common/systemsDto";
import {ClientService} from "../../../../services/client/client.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {EntityService} from "../../../../services/entity/entity.service";
import {
  DynamicScreensSetupService
} from "../../../../../../shared/services/setups/dynamic-screen-config/dynamic-screens-setup.service";
import {ConfigFormFieldsDto} from "../../../../../../shared/data/common/dynamic-screens-dto";

const log = new Logger('EntityBasicInfoComponent');

@Component({
  selector: 'app-entity-basic-info',
  templateUrl: './entity-basic-info.component.html',
  styleUrls: ['./entity-basic-info.component.css'],
})
export class EntityBasicInfoComponent {
  @ViewChild('closebutton') closebutton: ElementRef;
  @ViewChild('statusModalButton') statusModalButton: ElementRef;
  @ViewChild('commentInput') commentInput!: ElementRef<HTMLTextAreaElement>;

  @Output('assignRole') assignRole: EventEmitter<any> = new EventEmitter();
  @Output('partyTypeRole') partyTypeRole: EventEmitter<any> =
    new EventEmitter<any>();

  @Input() entityPartyIdDetails: ReqPartyById;
  @Input() entityAccountIdDetails: AccountReqPartyId[];
  @Input() partyAccountDetails: PartyAccountsDetails;
  @Input() unAssignedPartyTypes: PartyTypeDto[];
  @Input() overviewConfig: any;
  // @Input() clientDetails: any;
  @Input() entityDetails: any;
  @Input() formGroupsAndFieldConfig: any;
  @Input() overviewFormFields: ConfigFormFieldsDto[];

  language: string = 'en'
  selectedRole: PartyTypeDto;
  clientStatuses: StatusDTO[];
  selectedClientStatus: StatusDTO;
  applicableStatuses: StatusDTO[] = [];
  actionableStatuses: StatusDTO[] = [];

  isEditingWefWet: boolean = false;
  wetDateForm:FormGroup;
  photoPreviewUrl: string = '../../../../../../../assets/images/profile_picture_placeholder.png';

  applicable_status = {
    "active": ["active", "suspended", "inactive", "blacklisted"],
    "inactive": ["active", "suspended", "inactive", "blacklisted"],
    "blacklisted": ["active", "suspended", "inactive", "blacklisted"],
    "ready": ["ready", "active", "blacklisted"],
    "suspended": ["active", "suspended", "inactive", "blacklisted"],
    "draft": ["draft", "ready"]
  };

  constructor(
    private utilService: UtilService,
    private statusService: StatusService,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
    private fb: FormBuilder,
    private entityService: EntityService,
    private dynamicScreenSetupService: DynamicScreensSetupService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    this.wetDateForm = this.fb.group({
      wetDate: []
    })

    setTimeout(() => {
      this.fetchClientStatuses();
      log.info('party account details ', this.partyAccountDetails)
    }, 1000);
  }

  fetchClientStatuses(): void {
    this.statusService.getClientStatus().subscribe({
      next: data => {
        this.clientStatuses = data;
        this.setCurrentStatus(data);
      },
      error: err => {}
    });
  }

  setCurrentStatus(statuses: StatusDTO[]): void {
    const activeStatus = (this.partyAccountDetails?.status)?.toUpperCase();

    switch (activeStatus) {
      case 'A':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'ACTIVE');
        break;
      case 'I':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'INACTIVE');
        break;
      case 'D':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'DRAFT');
        break;
      case 'R':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'READY');
        break;
      case 'B':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'BLACKLISTED');
        break;
      case 'S':
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'SUSPENDED');
        break;
      default:
        this.selectedClientStatus = statuses.find(status => (status.value).toUpperCase() === 'INACTIVE');
        break;
    }

    this.filterApplicableStatuses();
  }

  filterApplicableStatuses(): void {
    const filteredStatuses = [];
    this.actionableStatuses = [];
    const currentStatus: string = (this.selectedClientStatus?.value)?.toLowerCase();
    const applicableStatuses: string[] = this.applicable_status[currentStatus];

    this.clientStatuses.forEach((status: StatusDTO) => {
      if (applicableStatuses &&
        applicableStatuses.length > 0 &&
        applicableStatuses?.includes((status.value).toLowerCase())
      ) {
        filteredStatuses.push(status);
        this.applicableStatuses = filteredStatuses;
      } else { }
      this.actionableStatuses = filteredStatuses;
    });
  }

  processSelectedStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.selectedClientStatus = this.clientStatuses.find(status => (status.value).toUpperCase() === selectedValue.toUpperCase());
    this.statusModalButton.nativeElement.click();
  }

  initiateReassignStatus(task: string): void {
    this.statusModalButton.nativeElement.click();
    // set global variable called action
    // if action is re-assign, adjust modal display
    //  call second modal to select client
    // call first modal after selecting client
    //saved rea-assign status
    log.info(`task: ${task}`);
  }

  changeClientStatus(): void {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const comment = this.commentInput?.nativeElement.value;
    const status = this.selectedClientStatus.value.charAt(0)
    const accountCode = this.partyAccountDetails.accountCode;

    // update status
    this.clientService.updateClientSection(accountCode, { status, comment }).subscribe({
      next: data => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Client status updated successfully');
        this.partyAccountDetails.status = data.status;
        // this.setCurrentStatus(this.clientStatuses);
        this.filterApplicableStatuses();
        log.info('partyAccountDetails >>> ', data);
      },
      error: err => {
        log.info(`status not updated >>> `, err)
      }
    })
  }


  selectRole(role: PartyTypeDto): void {
    this.selectedRole = role;
  }

  onAssignRole(): void {
    this.closebutton.nativeElement.click();
    this.assignRole.emit(this.selectedRole);
  }

  selectPartyTypeRole(role: PartyTypeDto) {
    // this.entityAccountIdDetails = [];
    this.partyTypeRole.emit(role);
  }

  toggleWefWetEdit() {
    this.isEditingWefWet = !this.isEditingWefWet;
    if (this.isEditingWefWet) {
      // patch current wet date
      this.wetDateForm.patchValue({
        wetDate: (this.entityDetails.withEffectToDate)?.split('T')[0]
      })
    } else {
      // update client details
      const withEffectToDate = this.wetDateForm.getRawValue().wetDate;
      const withEffectFromDate = this.entityDetails.withEffectFromDate;

      log.info(withEffectFromDate, withEffectToDate, new Date(withEffectFromDate) > new Date(withEffectToDate));

      if (new Date(withEffectFromDate) > new Date(withEffectToDate)) {
        this.globalMessagingService.displayErrorMessage('Error', 'WEF date cannot be greater than WET date');
        return;
      }

      const entityCode = this.entityDetails.clientCode; //todo: set code for other entities
      this.updateEntitySection(entityCode, withEffectToDate);

    }
  }

  updateEntitySection(entityCode: number, withEffectToDate: string) {
    log.info('party account details ', this.partyAccountDetails);
    const partyType = (this.partyAccountDetails?.partyType?.partyTypeName).toUpperCase();

    switch (partyType) {
      case 'CLIENT':
        this.updateClientSection(entityCode, withEffectToDate);
        break;
      case 'INTERMEDIARIES':
        // UPDATE INTERMEDIARIES
        break;
        default:
          // do something else
    }
  }

  updateClientSection(clientCode: number, withEffectToDate: string): void {
    this.clientService.updateClientSection(clientCode, { withEffectToDate }).subscribe({
      next: data => {
        this.entityDetails = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'WET date updated successfully');
      },
      error: err => {
        this.globalMessagingService.displayErrorMessage('Error', 'could not update WET date');
      }
    });
  }

  uploadProfileImage(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.photoPreviewUrl = event.target.result;
      }

      this.entityService.uploadProfileImage(this.partyAccountDetails.partyId, file).subscribe({
        next: data => {
          this.globalMessagingService.displaySuccessMessage('success', 'successfully uploaded profile picture');
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('error', 'image upload failed!');
          this.photoPreviewUrl = '../../../../../../../assets/images/profile_picture_placeholder.png';
        }
      })
    }
  }

  getFieldLabel(fieldName: string): ConfigFormFieldsDto {
    return this.overviewConfig?.fields.filter(el => el.originalLabel.toLowerCase() === fieldName.toLowerCase())[0]
  }

}
