import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent, SortEvent} from "primeng/api";
import {ReplaySubject} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {Router} from "@angular/router";
import {untilDestroyed} from "../../../../../shared/shared.module";
import {takeUntil, tap} from "rxjs/operators";
import {AggregatedEmployeeData} from "../../../data/ticketsDTO";
import {TicketsService} from "../../../services/tickets.service";

const log = new Logger('ViewEmployeeComponent');

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent  implements OnInit {

  // viewEmployees: Pagination<StaffDto> = <Pagination<StaffDto>>{};
  aggregatedEmployeeData : Pagination<AggregatedEmployeeData> = <Pagination<AggregatedEmployeeData>>{};
  selectedEmployee: any[] = [];
  page = 1;

  pageSize = 5;
  event: LazyLoadEvent;
  totalRecords: number;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  sortingForm: FormGroup;
  cols: any[] = [];

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year-2}-${this.month}-${this.day}`;

  constructor(
    private cdr: ChangeDetectorRef,
    private staffService: StaffService,
    private ticketsService: TicketsService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.getGrpEmployeeData();
    this.createSortForm();
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      fromDate: '',
      toDate: ''
    });
  }

  //get all employees under a supervisor
  getAllEmployees(pageIndex: number, sortList: string = 'dateCreated',
                  order: string = 'desc' ) {

    /*return this.staffService.getStaffWithSupervisor(pageIndex, this.pageSize, null, sortList, order)
      .pipe(
        takeUntil(this.destroyed$),
        tap((data) => log.info('Fetch transactions data>> ', data))
      );*/
  }
  lazyLoadEmployees(event:LazyLoadEvent) {
    /*const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

    log.info('Page index: ', pageIndex);

    this.getAllEmployees(pageIndex, sortField, sortOrder)
      .pipe(untilDestroyed(this))
      .subscribe((data:Pagination<StaffDto>) => {
        this.viewEmployees = data;
        this.cdr.detectChanges();
      })*/
  }

  /*
  * This method aggregates staff, transactions, & department data into an array
  * The array is used to populate employees under a manager/supervisor table*/
  getGrpEmployeeData() {
    /*forkJoin(([
      this.staffService.getStaffWithSupervisor(0, null, null, 'dateCreated', 'desc'),
      this.ticketsService.getAllTransactionsPerModule(this.dateFrom, this.dateToday),
      this.ticketsService.getAllDepartments(2)
    ])).subscribe(([staff,transactions,departments])=>{
      if (staff.totalElements > 0){
        const result: AggregatedEmployeeData[] = [];
        for(const staffData of staff.content){
          const transaction = transactions.find(value => value.authorizedBy === staffData.username);
          const department = departments.find(value => value.id === staffData.departmentCode)

          if (transactions.length != 0 ) {
            result.push({
              staffs: staffData,
              transaction: transaction,
              department: department
            })
          }

        }
        console.log('aggregated data', result);
        this.aggregatedEmployeeData.content = result;
        this.aggregatedEmployeeData.totalElements = staff?.totalElements;
        this.cdr.detectChanges();
      }
    })*/
  }

  ngOnDestroy(): void {

  }

  goToViewEmployeeTransactions(username: string, module: string, name:string) {
    // this.ticketsService.transactionRouting = {username: username, module: module, name: name};

    // this.ticketsService.setTransactionsRoutingData({username: username, module: module, name: name})
    // this.router.navigate([ `/home/view-employee-transactions/${username}`]);

    this.router.navigate(['/home/view-employee-transactions'],
      {queryParams: {username, module, name }}).then(r => {
    })
  }

  dateSortEmployees() {
    const sortValues = this.sortingForm.getRawValue();
    log.info('form value', sortValues);
    const payload: any = {
      fromDate: sortValues.fromDate ? sortValues.fromDate : this.dateFrom,
      toDate: sortValues.toDate ? sortValues.toDate : this.dateToday
    }
    // assigns the date selected by the manager
    this.dateFrom = payload.fromDate;
    this.dateToday = payload.toDate;

    if (this.dateFrom && this.dateToday){
      this.getGrpEmployeeData();
      this.cdr.detectChanges();
    }

  }

  //this sorts the aggregated data in the view employees table in asc/desc
  customSortEmployees(event: SortEvent) {
    log.info("data", event);
    event.data.sort((data1, data2) => {
      let value1: any;
      let value2: any;
      let result: any = null;
      if (event.field === 'name') {
        value1 = data1.staffs?.name;
        value2 = data2.staffs?.name;
      }
      if (event.field === 'departmentName') {
        value1 = data1.department?.departmentName;
        value2 = data2.department?.departmentName;
      }
      if (event.field === 'module') {
        value1 = data1.transaction?.module;
        value2 = data2.transaction?.module;
      }
      if (event.field === 'emailAddress') {
        value1 = data1.staffs?.emailAddress;
        value2 = data2.staffs?.emailAddress;
      }
      if (event.field === 'totalCount') {
        value1 = data1.transaction?.totalCount;
        value2 = data2.transaction?.totalCount;
      }
      if (event.field === 'totalAmount') {
        value1 = data1.transaction?.totalAmount;
        value2 = data2.transaction?.totalAmount;
      }

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
}
