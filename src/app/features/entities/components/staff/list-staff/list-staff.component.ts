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

  activeTab = signal('Individual');
  userType: 'user' | 'group' = 'user';
  staffPageSize = 5;

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

  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: this.indivData?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true
    }

    this.spinner.show();

    this.getStaffData(0)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
      (data: Pagination<StaffDto>) => {
        this.refreshStaffData(data);
      }
    );
  }

  loadStaff(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    this.getStaffData(pageIndex, sortField, sortOrder)
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


  getStaffData(pageIndex: number = 0,
               sortList: any = 'dateCreated',
               order: string = 'desc'){
    return this.staffService
      .getStaff(pageIndex,
                this.staffPageSize,
        this.activeTab() === 'Group' ? 'G':  'U',
                 sortList,
                order, null)
      .pipe(untilDestroyed(this));
  }

  refreshStaffData(data: Pagination<StaffDto>){
      this.indivData = data;
      this.indivData?.content.forEach( staff => {
        staff.userType = staff.userType === 'U' ? 'User' : 'Group';
        staff.status = staff.status === 'A' ? 'Active' : 'Inactive';
      });

      this.tableDetails.rows = this.indivData?.content;
      this.tableDetails.totalElements = this.indivData?.totalElements;
  }

  selectTab(activeTab: string): void {
    this.activeTab.set(activeTab);
    this.userType = (this.activeTab() === 'Individual') ? 'user' : 'group';
    this.getStaffData(0)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data: Pagination<StaffDto>) => {
          this.refreshStaffData(data);
        }
      );
    this.cdr.detectChanges();
  }

  // To be modified
  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Staff'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }

}

