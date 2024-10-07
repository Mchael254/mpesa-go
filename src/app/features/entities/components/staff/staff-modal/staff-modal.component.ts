import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { StaffDto } from '../../../data/StaffDto';
import { StaffService } from '../../../services/staff/staff.service';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { Logger, untilDestroyed } from '../../../../../shared/shared.module';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { ClientService } from '../../../services/client/client.service';
import { ClientDTO } from '../../../data/ClientDTO';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import { ServiceProviderDTO } from '../../../data/ServiceProviderDTO';

/**
 * Component to display staff data in a modal
 */

const log = new Logger(`StaffModalComponent`);

@Component({
  selector: 'app-staff-modal',
  templateUrl: './staff-modal.component.html',
  styleUrls: ['./staff-modal.component.css'],
})
export class StaffModalComponent implements OnInit, OnDestroy {
  @ViewChild('cancelUserSelection', { read: ElementRef })
  cancelSupervisorSelect: ElementRef;
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('dt2') dt2: Table | undefined;

  @Input() showButtons: boolean = false;
  @Input() isLazyLoaded: boolean = true;
  @Input() staffList: StaffDto[];

  @Output() userSelected: EventEmitter<StaffDto> = new EventEmitter<StaffDto>();
  @Output() actionEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Input() accountType: string;

  lazyLoadedUsers:
    | Pagination<StaffDto>
    | Pagination<ClientDTO>
    | Pagination<ServiceProviderDTO>;
  selectedUser: StaffDto;
  staffData: StaffDto[];
  // The flag that indicates if the modal is open or not
  staffSize = 5;

  private _listFilter: string;
  private _usernameFilter: string;
  set usernameFilter(value: string) {
    this._usernameFilter = value;
    this.searchUsers(value);
  }

  get usernameFilter(): string {
    return this._usernameFilter;
  }

  get listFilter(): string {
    return this._listFilter;
  }

  set listFilter(value: string) {
    this._listFilter = value;
    this.searchUsers(value);
  }

  userTypes = [
    { code: 1, name: 'USER' },
    { code: 2, name: 'AGENT' },
    { code: 3, name: 'CLIENT' },
    { code: 4, name: 'SERVICE_PROVIDER' },
    { code: 5, name: 'GROUP' },
  ];

  selectedAccountType: string;
  shouldShowwUsers: boolean = false;

  constructor(
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private clientService: ClientService,
    private serviceProviderService: ServiceProviderService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Lazy load staff data
   * @param event
   */
  lazyLoadAllUsers(event: TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    this.getIndividualUsers(pageIndex, sortField, sortOrder)
      .pipe(untilDestroyed(this))
      .subscribe((data: Pagination<StaffDto>) => {
        this.lazyLoadedUsers = data;
        this.shouldShowwUsers = true;
      });
  }

  fetchAccounts($event): void {
    const accountType = $event?.target?.value;
    this.fetchAccountByAccountType(accountType);
  }

  fetchAccountByAccountType(
    accountType: string,
    $event?: TableLazyLoadEvent
  ): void {
    this.selectedAccountType = accountType;
    this.shouldShowwUsers = false;
    this.lazyLoadedUsers = null;

    let first: number,
      rows: number,
      pageNumber: number,
      sortField: string | string[],
      sortOrder: string;
    if ($event) {
      first = $event.first;
      rows = $event.rows;
      pageNumber = first / rows;
      sortField = $event.sortField;
      sortOrder = $event.sortOrder == 1 ? 'desc' : 'asc';
    } else {
      first = 0;
      rows = 10;
      pageNumber = 0;
    }
    switch (accountType) {
      case UserType.USER:
        this.fetchUsers(pageNumber, sortField, null, sortOrder);
        break;
      case UserType.AGENT:
        this.fetchAgents(pageNumber);
        break;
      case UserType.CLIENT:
        this.fetchClients(pageNumber);
        break;
      case UserType.SERVICE_PROVIDER:
        this.fetchServiceProviders(pageNumber, sortField, sortOrder);
        break;
      case UserType.GROUP:
        this.fetchUsers(pageNumber, sortField, 'G', sortOrder);
        break;
      default:
        log.info(`${accountType} does not match any userType`);
    }
  }

  fetchAgents(pageNumber: number): void {
    this.clientService.getAgents(pageNumber).subscribe({
      next: (res: Pagination<ClientDTO>) => {
        this.lazyLoadedUsers = res;
        this.shouldShowwUsers = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.shouldShowwUsers = true;
      },
    });
  }

  fetchClients(pageNumber: number): void {
    this.clientService.getClients(pageNumber).subscribe({
      next: (res: Pagination<ClientDTO>) => {
        this.lazyLoadedUsers = res;
        this.shouldShowwUsers = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.shouldShowwUsers = true;
      },
    });
  }

  fetchServiceProviders(
    pageNumber: number,
    sortField: string | string[],
    sortOrder: string
  ): void {
    this.serviceProviderService.getServiceProviders(pageNumber).subscribe({
      next: (res) => {
        this.lazyLoadedUsers = res;
        this.shouldShowwUsers = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.shouldShowwUsers = true;
      },
    });
  }

  fetchUsers(
    pageNumber: number,
    sortField: string | string[],
    userType: string,
    sortOrder: string
  ): void {
    this.getIndividualUsers(
      pageNumber,
      sortField,
      userType,
      sortOrder
    ).subscribe({
      next: (res) => {
        this.lazyLoadedUsers = res;
        this.shouldShowwUsers = true;
      },
      error: (err) => {
        let errorMessage = err?.error?.message ?? err.message;
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
        this.shouldShowwUsers = true;
      },
    });
  }

  /**
   * Fetch individual users from backend
   * @param pageIndex
   * @param sortList
   * @param order
   */
  getIndividualUsers(
    pageIndex: number,
    sortList: any = 'dateCreated',
    accountType: string = null,
    order: string = 'desc'
  ) {
    return this.staffService
      .getStaff(pageIndex, this.staffSize, accountType, sortList, order, null)
      .pipe(untilDestroyed(this));
  }

  /**
   * Select staff/user from the table and emit the selected user
   * @param event
   */
  onUserRowSelect(event) {
    this.globalMessagingService.displayInfoMessage(
      'User Selected',
      event.data.name
    );
    this.userSelected.emit(event.data);
  }

  /**
   * Search users by name
   * @param name
   */
  searchUsers(name: string) {
    if (this.isLazyLoaded) {
      this.staffService
        .searchStaff(0, 5, null, name)
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.lazyLoadedUsers = data;
        });
    } else {
      if (!name) {
        return;
      }
      // otherwise, loop through the array and remove the elements that do not have a matching name property
      for (let i = this.staffList.length - 1; i >= 0; i--) {
        if (
          !this.staffList[i]?.name.toLowerCase().includes(name.toLowerCase())
        ) {
          this.staffList.splice(i, 1); // remove the element at index i
        }
      }
    }
  }

  /**
   * Save selected user and close modal
   */
  saveSelectedUser() {
    const cancelBtn = this.cancelSupervisorSelect.nativeElement;
    if (this.selectedUser) {
      this.userSelected.emit(this.selectedUser);
    }
    this.actionEmitter.emit();
    cancelBtn.click();
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.staffData = this.staffList;
  }

  /**
   * Trigger user search when enter key is pressed
   * @param event - the keyboard event
   * @param value - the entered value
   */
  handleEnteredValue(event: KeyboardEvent, value: string) {
    if (event.key === 'Enter') {
      this.searchUsers(value);
    }
  }
}

enum UserType {
  AGENT = 'AGENT',
  CLIENT = 'CLIENT',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  USER = 'USER',
  GROUP = 'GROUP',
}
