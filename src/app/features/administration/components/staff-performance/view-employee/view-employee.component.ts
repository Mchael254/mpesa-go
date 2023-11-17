import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {LazyLoadEvent, SortEvent} from "primeng/api";
import {forkJoin, ReplaySubject} from "rxjs";
import {FormBuilder, FormGroup} from "@angular/forms";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {Router} from "@angular/router";
import {takeUntil, tap} from "rxjs/operators";
import {AggregatedEmployeeData} from "../../../data/ticketsDTO";
import {TicketsService} from "../../../services/tickets.service";
import {Table} from "primeng/table";

const log = new Logger('ViewEmployeeComponent');

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent  implements OnInit {
  @ViewChild('managerReportTable') managerReportTable: Table;
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
    public router: Router,
    private fb: FormBuilder,
  ) { }

  /**
   * The ngOnInit function is used to initialize the component by calling the getGrpEmployeeData and createSortForm
   * functions.
   */
  ngOnInit(): void {

    this.getGrpEmployeeData();
    this.createSortForm();
  }

  /**
   * The function creates a form for sorting data with two fields: fromDate and toDate.
   */
  createSortForm() {
    this.sortingForm = this.fb.group({
      fromDate: '',
      toDate: ''
    });
  }

  //get all employees under a supervisor
  /**
   * The function `getAllEmployees` retrieves a list of employees with their supervisors, based on the specified page
   * index, sorting criteria, and order.
   * @param {number} pageIndex - The pageIndex parameter is used to specify the page number of the data to retrieve. It is
   * a number that indicates the index of the page to fetch.
   * @param {string} [sortList=dateCreated] - The `sortList` parameter is used to specify the field by which the list of
   * employees should be sorted. It accepts a string value representing the field name. For example, if you pass
   * `'dateCreated'` as the value, the list will be sorted based on the date the employees were created
   * @param {string} [order=desc] - The "order" parameter determines the order in which the data should be sorted. It can
   * have two possible values: "asc" for ascending order and "desc" for descending order. By default, the value is set to
   * "desc".
   * @returns an Observable that emits the data fetched from the staffService.
   */
  getAllEmployees(pageIndex: number, sortList: string = 'dateCreated',
                  order: string = 'desc' ) {

    return this.staffService.getStaffWithSupervisor(pageIndex, this.pageSize, null, sortList, order)
      .pipe(
        takeUntil(this.destroyed$),
        tap((data) => log.info('Fetch transactions data>> ', data))
      );
  }
  /**
   * The function `lazyLoadEmployees` is a TypeScript function that is used to load employees lazily based on the provided
   * event parameters.
   * @param {LazyLoadEvent} event - The event parameter is of type LazyLoadEvent. It contains information about the lazy
   * loading event triggered by the user. The properties of the LazyLoadEvent object are:
   */
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

  /**
   * The function `getGrpEmployeeData()` retrieves data for staff, transactions, and departments, aggregates the data based
   * on certain conditions, and updates the `aggregatedEmployeeData` property.
   */
  /*getGrpEmployeeData() {
    forkJoin(([
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
    })
  }*/

  getGrpEmployeeData() {
    forkJoin([
      this.staffService.getStaffWithSupervisor(0, null, null, 'dateCreated', 'desc'),
      this.ticketsService.getAllTransactionsPerModule(this.dateFrom, this.dateToday),
      this.ticketsService.getAllDepartments(2)
    ]).subscribe(([staff, transactions, departments]) => {
      if (transactions.length > 0) {
        const result: AggregatedEmployeeData[] = [];
        for (const transactionData of transactions) {
          const staffData = staff.content.find(staffItem => staffItem.username === transactionData.authorizedBy);
          const department = departments.find(departmentItem => departmentItem.id === staffData.departmentCode);

          if (staffData) {
            result.push({
              staffs: staffData,
              transaction: transactionData,
              department: department
            });
          }
        }
        console.log('aggregated data', result);
        this.aggregatedEmployeeData.content = result;
        this.aggregatedEmployeeData.totalElements = staff?.totalElements;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {

  }

  /**
   * The function `goToViewEmployeeTransactions` navigates to the employee transactions view with the specified username,
   * module, and name as query parameters.
   * @param {string} username - The username parameter is a string that represents the username of the employee whose
   * transactions you want to view.
   * @param {string} module - The "module" parameter is a string that represents the module or section of the application
   * that the user is currently in. It could be something like "sales", "inventory", or "finance".
   * @param {string} name - The "name" parameter is a string that represents the name of the employee.
   */
  goToViewEmployeeTransactions(username: string, module: string, name:string, size: number) {
    // this.ticketsService.transactionRouting = {username: username, module: module, name: name};

    // this.ticketsService.setTransactionsRoutingData({username: username, module: module, name: name})
    // this.router.navigate([ `/home/view-employee/transactions/${username}`]);

    this.router.navigate(['/home/administration/employee/transactions'],
      {queryParams: {username, module, name, size }}).then(r => {
    })
  }

  /**
   * The function `dateSortEmployees()` sorts employees based on the selected date range and retrieves the corresponding
   * employee data.
   */
  dateSortEmployees() {
    this.managerReportTable.reset();
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

  /**
   * The function `customSortEmployees` sorts an array of employee data based on the field specified in the `SortEvent`
   * object.
   * @param {SortEvent} event - The event parameter is an object that contains information about the sorting event.
   */
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
