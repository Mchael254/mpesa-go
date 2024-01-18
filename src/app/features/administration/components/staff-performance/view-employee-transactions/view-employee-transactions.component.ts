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
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";

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
  size: number;
  constructor(
    private ticketsService: TicketsService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private globalMessagingService: GlobalMessagingService,
    private systemsService: SystemsService,
  ) {}

  /**
   * The ngOnInit function initializes various variables and calls several functions to retrieve data and set up the
   * component.
   */
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      log.info(`query Params >>>`, params);
      this.name = params['name'];
      this.module = params['module'];
      this.username = params['username'];
      this.size = params['size'];
      this.getAllTransactions(this.page, this.size, this.queryColumn, params['username'], params['module']);
    });

    // this.getTransactionsData();
    this.getAllSystems();
    this.createSortForm();
    this.getAllTicketModules();
    this.getAllBusinessTransactions();
  }

  /**
   * The function creates a form for sorting data with fields for fromDate, toDate, amount, module, system, and
   * transactionType.
   */
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

  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {
  }

  /**
   * The searchModule function sets the module property to the selectedModule value, logs the selectedModule value, resets
   * the transactionsTable, and detects changes.
   * @param event - The event parameter is an object that represents the event that triggered the searchModule function. It
   * could be an event object from a user interaction.
   */
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
  /**
   * The function `getAllTransactions` retrieves transactions based on the provided parameters and updates the
   * `transactions` variable.
   * @param {number} pageIndex - The pageIndex parameter is used to specify the page index of the transactions to retrieve.
   * It is typically a number that represents the page number.
   * @param {string} queryColumn - The queryColumn parameter is a string that represents the column name to be used for
   * querying the transactions. It is used as a filter to retrieve specific transactions based on a particular column in
   * the database table.
   * @param {string} username - The `username` parameter is a string that represents the username of the user for whom the
   * transactions are being fetched.
   * @param {string} module - The "module" parameter is a string that represents the module or category of the
   * transactions. It is used to filter the transactions based on the specified module.
   */
  getAllTransactions(pageIndex: number, size: number, queryColumn: string, username: string, module: string ) {
    if(module) { // checks if the module is not empty
      this.ticketsService.getAllTransactions(pageIndex, size, this.dateFrom, this.dateToday, username, module, queryColumn)
        .pipe(
          take(1),
          tap((data) => log.info('Fetch transactions data>> ', data))
        )
        .subscribe({
          next: (data) => {
            this.transactions = data;
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
          }
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
  /**
   * The function `getAllSystems()` retrieves systems data from the tickets service and assigns it to the `systemsData`
   * variable.
   */
  getAllSystems() {
    this.systemsService.getSystems()
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.systemsData = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `sortEmployeeTransactions()` sorts employee transactions based on fromDate, toDate
   * amount, module, system, transactionType, transactionType.
   */
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
      .subscribe({
        next: (data) => {
          this.transactions = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getAllTicketModules()` retrieves all ticket modules from the tickets service and assigns the data to the
   * `ticketModules` variable.
   */
  getAllTicketModules(){
    this.ticketsService.getTicketModules()
      .pipe(untilDestroyed(this),
        tap((data) => log.info('Fetch Ticket modules', data))
      )
      .subscribe({
        next: (data) => {
          this.ticketModules = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      });
  }

  /**
   * The function `getAllBusinessTransactions` retrieves business transactions using the `ticketsService` and assigns the
   * result to the `businessTransactions` variable.
   */
  getAllBusinessTransactions(){
    this.ticketsService.getBusinessTransactions()
      .pipe(untilDestroyed(this),
        tap((data) => log.info('Fetch business transactions', data))
      )
      .subscribe({
        next: (data) => {
          this.businessTransactions = data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      });
  }

  /**
   * The `goBack()` function navigates the user back to the employees page in the administration section of the home page.
   */
  goBack() {
    this.router.navigate([ `/home/administration/employees/`]);
  }
}
