import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {LazyLoadEvent} from "primeng/api";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";
import {ReplaySubject} from "rxjs/internal/ReplaySubject";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Logger} from "../../../../../shared/services";
import {tap} from "rxjs/internal/operators/tap";
import {take} from "rxjs/internal/operators/take";
import {untilDestroyed} from "../../../../../shared/shared.module";
import {BusinessTransactionsDTO, TicketModuleDTO, TransactionsDTO} from "../../../data/ticketsDTO";
import {TicketsService} from "../../../services/tickets.service";

const log = new Logger('ViewEmployeeTransactionsComponent');
@Component({
  selector: 'app-view-employee-transactions',
  templateUrl: './view-employee-transactions.component.html',
  styleUrls: ['./view-employee-transactions.component.css']
})
export class ViewEmployeeTransactionsComponent implements OnInit {
  @ViewChild(Table) transactionsTable: Table;

  // transactions: Pagination<TransactionsDTO> = <Pagination<TransactionsDTO>>{};
  transactions: TransactionsDTO[] =[];
  ticketModules: TicketModuleDTO[];
  businessTransactions: BusinessTransactionsDTO[];
  page = 0;

  pageSize = 5;
  event: LazyLoadEvent;
  totalRecords: number;
  systemsData : SystemsDto[];

  // aggregatedRoutingData: TransactionsRoutingDTO;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  sortingForm: FormGroup;
  selectedModule: string;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;
  dateFrom = `${this.year-2}-${this.month}-${this.day}`;

  module: string;
  queryColumn: string;
  public name: string;
  username: string;
  constructor(
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.name = params['name'];
      this.module = params['module'];
      this.username = params['username'];
      this.getAllTransactions(this.page, this.queryColumn, params['username'], params['module']);
    });

    // this.getTransactionsData();
    this.getAllSystems();
    this.createSortForm();
    this.getAllTicketModules();
    this.getAllBusinessTransactions();
  }

  createSortForm() {
    this.sortingForm = this.fb.group({
      fromDate: '',
      toDate: '',
      amount: '',
      module: '',
      system: '',
      transactionType: ''
    });
  }

  ngOnDestroy(): void {
  }

  searchModule(event) {

    this.module = this.selectedModule;
    // this.module = 'module';
    log.info('Selected valu', this.selectedModule);
    this.transactionsTable.reset();
    this.cdr.detectChanges();

  }

  //gets the employee data(username, module & name) from the previous screen
  /*getTransactionsData() {
    this.ticketsService.transanctionsRoutingData$
      .pipe(
        takeUntil(this.destroyed$)
      )
      .subscribe(
        transactionRouting => {
          this.aggregatedRoutingData = transactionRouting;
          this.getAllTransactions(this.page, this.queryColumn);
          this.cdr.detectChanges();
        }
      )
  }*/
  //get all tickets for the logged in user
  getAllTransactions(pageIndex: number, queryColumn: string, username: string, module: string ) {
    if(module) { // checks if the module is not empty
      this.ticketsService.getAllTransactions(pageIndex, null, this.dateFrom, this.dateToday, username, module, queryColumn)
        .pipe(
          take(1),
          tap((data) => log.info('Fetch transactions data>> ', data))
        )
        .subscribe((data) =>{
          this.transactions = data;
          this.cdr.detectChanges();
        });
    }

  }
  /*lazyLoadTransactions(event:LazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    this.getAllTransactions(pageIndex)
      .pipe(untilDestroyed(this))
      .subscribe((data:Pagination<TransactionsDTO>) => {
        this.transactions = data;
        this.cdr.detectChanges();
      })
  }*/
  getAllSystems() {
    this.ticketsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.systemsData = data;
        }
      )
  }

  sortEmployeeTransactions() {
    const sortValues = this.sortingForm.getRawValue();
    log.info('form value', sortValues);
    const payload: any = {
      fromDate: sortValues.fromDate ? sortValues.fromDate : this.dateFrom,
      toDate: sortValues.toDate ? sortValues.toDate : this.dateToday,
      amount: sortValues.amount,
      module: sortValues.module ? sortValues.module : 'A',
      system: sortValues.system,
      transactionType: sortValues.transactionType,
      filterColumn: sortValues.transactionType ? 'TRANSACTIONTYPE': ''
    }

    this.ticketsService.dateSortEmployeesTransactions(
      this.page,
      this.pageSize,
      payload.fromDate,
      payload.toDate,
      this.username,
      payload.module,
      payload.amount,
      payload.filterColumn,
      payload.transactionType)
      .subscribe(data => {
        this.transactions = data;
        this.cdr.detectChanges();
      })
  }

  getAllTicketModules(){
    this.ticketsService.getTicketModules()
      .pipe(untilDestroyed(this),
        tap((data) => log.info('Fetch Ticket modules', data))
      )
      .subscribe(
        (data) => {
          this.ticketModules = data;
        }
      );
  }

  getAllBusinessTransactions(){
    this.ticketsService.getBusinessTransactions()
      .pipe(untilDestroyed(this),
        tap((data) => log.info('Fetch business transactions', data))
      )
      .subscribe(
        (data) => {
          this.businessTransactions = data;
        }
      );
  }

  goBack() {
    this.router.navigate([ `/home/administration/employees/`]);
  }
}
