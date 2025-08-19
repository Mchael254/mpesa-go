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
  basicInfo: any;
  language: string = 'en'
  selectedRole: PartyTypeDto;
  clientStatuses: StatusDTO[];
  selectedClientStatus: StatusDTO;
  applicableStatuses: StatusDTO[] = [];
  actionableStatuses: StatusDTO[] = [];

  constructor(
    private utilService: UtilService,
    private statusService: StatusService,
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
  ) {
    this.utilService.currentLanguage.subscribe(lang => {
      this.language = lang;
    });

    setTimeout(() => {
      this.basicInfo = this.overviewConfig?.basic_info;
      this.fetchClientStatuses();
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
    const activeStatus = (this.partyAccountDetails.status).toUpperCase();
    // const activeStatus = 'D'.toUpperCase();
    // this.partyAccountDetails.status = 'D'

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
        // do nothing
    }

    this.filterApplicableStatuses();
  }

  filterApplicableStatuses(): void {
    const filteredStatuses = [];
    this.actionableStatuses = [];
    const currentStatus: string = (this.selectedClientStatus.value).toLowerCase();
    const applicableStatuses: string[] = this.overviewConfig.applicable_status[currentStatus];

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


}
