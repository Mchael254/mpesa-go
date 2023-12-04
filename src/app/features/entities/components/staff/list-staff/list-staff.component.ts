import {ChangeDetectorRef, Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Pagination} from "../../../../../shared/data/common/pagination";
import {StaffDto} from "../../../data/StaffDto";
import {MainElements} from "../../../data/TabElements";
import {TableDetail} from "../../../../../shared/data/table-detail";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import {StaffService} from "../../../services/staff/staff.service";
import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../../services/account/account.service';
import { map } from 'rxjs';
import { PartyAccountsDetails } from '../../../data/accountDTO';

const log = new Logger('ListStaffComponent');

@Component({
  selector: 'app-list-staff',
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.css']
})
export class ListStaffComponent implements OnInit, OnDestroy {
  public indivData: Pagination<StaffDto> = <Pagination<StaffDto>>{};
  public groupData: Pagination<StaffDto> = <Pagination<StaffDto>>{};

  tableDetails: TableDetail;

  activeTab2: string = 'Individual';
  userType: 'user' | 'group' = 'user';
  staffPageSize = 5;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'name', header: 'User' },
    { field: 'userType', header: 'User type' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'status', header: 'Status' },
  ];

  elements: MainElements[] = [
    {
      activeTab: 'Individual',
      subElements: {
        name: 'user',
        tabLinkId: 'nav-ind-tab',
        ariaControlId: 'nav-ind',
        ariaSelected: 'true',
        tabPaneId: 'nav-ind',
        lazyLoadMethod: 'lazyLoadIndivStaff',
        dataContainer: this.indivData,
        ellipsisDropdownId: 'dropdownMenuButton'
      }
    },
    {
      activeTab: 'Group',
      subElements: {
        name: 'group',
        tabLinkId: 'nav-group-tab',
        ariaControlId: 'nav-group',
        ariaSelected: 'false',
        tabPaneId: 'nav-group',
        lazyLoadMethod: 'lazyLoadGroups',
        dataContainer: this.groupData,
        ellipsisDropdownId: 'dropdownMenuButton1'
      }
    }
  ];

  globalFilterFields = ['name', 'userType', 'emailAddress', 'status'];
  staffBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Users',
      url: '/home/entity/staff'
    }
  ];

  groupStaff: StaffDto[];

  constructor(private staffService: StaffService,
              private sortFilterService: SortFilterService,
              private fb: FormBuilder,
              private router: Router,
              private cdr: ChangeDetectorRef,
               private accountService: AccountService,
              private spinner:NgxSpinnerService
              ) {
    this.groupStaff = [];
    this.tableDetails = {
      globalFilterFields: this.globalFilterFields, paginator: false, showFilter: false, showSorting: false,
      cols: this.cols,
      rows: this.indivData?.content,
      isLazyLoaded: true,
    }
  }

  /**
   * Initialize the component by retrieving the list of staffs, and displaying them in the table
   */
  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: this.indivData?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      // url: '/home/entity/view',
      urlIdentifier: 'id',
      viewDetailsOnView: true,
      viewMethod: this.viewDetailsWithId.bind(this),
      isLazyLoaded: true
    }

    this.spinner.show();

    this.getStaffData(0, this.staffPageSize)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
      (data: Pagination<StaffDto>) => {
        this.refreshStaffData(data);
      }
    );
  }

  viewDetailsWithId(rowId: number) {
    let partyId: number;

    // fetch account details to fetch party id before routing to 360 view
    this.accountService
      .getAccountDetailsByAccountCode(rowId)
      .pipe(
        map((data: PartyAccountsDetails) => {
            this.accountService.setCurrentAccounts(data); // set this current as current account.
            return data?.partyId;
          },
          untilDestroyed(this)
        ))
          .subscribe( (_x) => {
            partyId = _x;
            this.router.navigate([ `/home/entity/view/${partyId}`]);
          });
  }

  /**
   * Lazy load staff data when triggered by primeng table event
   * @param event - the event object of type TableLazyLoadEvent
   */

  loadStaff(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    this.getStaffData(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data: Pagination<StaffDto>) => {
          this.refreshStaffData(data);
          this.cdr.detectChanges();
          this.spinner.hide();

        },
        error => {
          this.spinner.hide();
        }

      );

  }


  /**
   * Get the list of staffs from the backend
   * @param [pageIndex=0] - the page index of the data to retrieve
   * @param [sortList=dateCreated] - the field to sort the data by
   * @param [order=desc] -  the order to sort the data by
   */
  getStaffData(pageIndex: number,
               pageSize: number,
               sortList: any = 'dateCreated',
               order: string = 'desc'){
    return this.staffService
      .getStaff(pageIndex,
                pageSize,
                 this.activeTab2 ===  'Group' ? 'G':  'U',
                 sortList,
                order, null);
  }

  /**
   * Refresh the staff data in the dynamic table
   * @param data
   */
  refreshStaffData(data: Pagination<StaffDto>){
      this.indivData = data;
      this.indivData?.content.forEach( staff => {
        staff.userType = staff.userType === 'U' ? 'User' : 'Group';
        staff.status = staff.status === 'A' ? 'Active' : 'Inactive';
      });

      this.tableDetails.rows = this.indivData?.content;
      this.tableDetails.totalElements = this.indivData?.totalElements;
  }

  /**
   * Select the active tab and refresh the staff data
   * @param activeTab
   */
  selectTab(activeTab: string): void {
    this.activeTab2 = activeTab;
    this.userType = (this.activeTab2 === 'Individual') ? 'user' : 'group';

    this.spinner.show();
    this.getStaffData(0, this.staffPageSize)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data: Pagination<StaffDto>) => {
          this.refreshStaffData(data);
          this.spinner.hide();
        }
      );
    this.cdr.detectChanges();
  }

  /**
   * Navigate to New Entity Page when creating a new staff
   */
  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Staff'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }
  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.indivData = null; // Initialize with an empty array or appropriate structure

    const value = (event.target as HTMLInputElement).value.toLowerCase();

    this.searchTerm = value;
    this.isSearching = true;
    this.spinner.show();
    this.staffService
      .searchStaff(pageIndex, pageSize, this.activeTab2 ===  'Group' ? 'G':  'U', this.searchTerm, null, null)
      .subscribe((data) => {
        this.indivData = data;
        this.spinner.hide();
      });
  }
}

