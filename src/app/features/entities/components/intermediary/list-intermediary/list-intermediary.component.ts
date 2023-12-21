import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Pagination} from "../../../../../shared/data/common/pagination";
import {AgentDTO} from "../../../data/AgentDTO";
import {Observable} from "rxjs";
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {map, tap} from "rxjs/operators";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {FormBuilder} from "@angular/forms";
import {Router} from "@angular/router";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {TableDetail} from "../../../../../shared/data/table-detail";
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../../services/account/account.service';
import { PartyAccountsDetails } from '../../../data/accountDTO';
import { SortFilterService } from 'src/app/shared/services/sort-filter.service';

const log = new Logger('ListIntermediaryComponent');

@Component({
  selector: 'app-list-intermediary',
  templateUrl: './list-intermediary.component.html',
  styleUrls: ['./list-intermediary.component.css']
})
export class ListIntermediaryComponent implements OnInit, OnDestroy {

  public intermediaries: Pagination<AgentDTO> = <Pagination<AgentDTO>>{};
  tableDetails: TableDetail;

  pageSize = 5;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'modeOfIdentity', header: 'Primary ID Type' },
    { field: 'agentIdNo', header: 'ID Number' },
    { field: 'primaryType', header: 'Account Type' },
    { field: 'accountType', header: 'Business Unit' }
  ];

  globalFilterFields = ['name','modeOfIdentity', 'agentIdNo', 'accountType'];
  intermediaryBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Business Accounts',
      url: '/home/entity/intermediary/list'
    }
  ];
  filterObject: {
    name:string, agentIdNo:string, modeOfIdentity:string, primaryType:string, accountType:string
  } = {
    name:'', agentIdNo:'', modeOfIdentity:'', primaryType:'' , accountType:''
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    // private sortFilterService: SortFilterService,
    // private accountService: AccountService,
    private sortFilterService: SortFilterService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false
    }
  }

  /**
   * The ngOnInit function initializes the tableDetails object and shows a spinner.
   */
  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: this.intermediaries?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      // url: '/home/entity/view',
      urlIdentifier: 'id',
      isLazyLoaded: true,
      viewDetailsOnView: true,
      viewMethod: this.viewDetailsWithId.bind(this),
    },
    this.spinner.show();
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
   * The function `getAgents` retrieves a paginated list of agents, with optional sorting parameters, from an intermediary
   * service.
   * @param {number} pageIndex - The pageIndex parameter is used to specify the index of the page to retrieve. It is a
   * number that represents the page number.
   * @param {any} [sortField=createdDate] - The `sortField` parameter is used to specify the field by which the agents
   * should be sorted. It can be any value, but it is typically a string representing the name of a field in the `AgentDTO`
   * object.
   * @param {string} [sortOrder=desc] - The `sortOrder` parameter is a string that specifies the order in which the agents
   * should be sorted. It can have two possible values: "asc" for ascending order and "desc" for descending order. By
   * default, the sort order is set to "desc".
   * @returns an Observable of type Pagination<AgentDTO>.
   */

  getAgents(pageIndex: number,
            pageSize: number,
            sortField: any = 'createdDate',
            sortOrder: string = 'desc'): Observable<Pagination<AgentDTO>> {
    return this.intermediaryService
      .getAgents(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  /**
   * The function "lazyLoadAgents" is used to fetch agents with pagination and sorting, and update the UI with the fetched
   * data.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is an object that contains information about the lazy loading event triggered by the user.
   */
  lazyLoadAgents(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: {value: this.searchTerm}
      };
      this.filter(searchEvent,pageIndex, pageSize, null);
    }
    else {
      this.getAgents(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Agents>>>`, data))
        )
        .subscribe(
          (data: Pagination<AgentDTO>) => {
            data.content.forEach( intermediary => {
              intermediary.primaryType = 'I' ? 'Individual' : 'Corporate';
            });
            this.intermediaries = data;
            this.tableDetails.rows = this.intermediaries?.content;
            this.tableDetails.totalElements = this.intermediaries?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => { this.spinner.hide(); }
        );
    }

  }

  /**
   * The function `searchIntermediary` searches for an intermediary agent by name and assigns the search results to the
   * `intermediaries` variable.
   * @param {string} name - The "name" parameter is a string that represents the name of the intermediary or agent you want
   * to search for.
   */
  /*searchIntermediary(name: string) {
    this.intermediaryService.searchAgent(
      0,
      5,
      name
    )
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.intermediaries =  data;
      });
  }
  viewDetailsById(rowId: any) {
    // Implement your logic here using the rowId
    log.info(`Viewing details for row with ID: ${rowId}`);
  }


  /**
   * The function navigates to a new entity page with the entity type set to 'Agent'.
   */
  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Agent'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }

  /*sortIntermediary() {
    const sortValues = this.sortingForm.getRawValue();
    const payload: any = { // todo: create DTO for payload
      sortListFields: sortValues.dateCreated ? 'dateCreated' : null,
      order: sortValues.sortOrder
    }
    this.sortFilterService.dateSortIntermerdiary(payload.sortListFields, payload.order)
      .subscribe(data => {
        this.intermediaries = data;
        this.cdr.detectChanges();
      })
  }*/

  /*intermediarySummary(id: number){
    let partyId: number;

    // fetch account details to fetch party id before routing to 360 view
    this.accountService
      .getAccountDetailsByAccountCode(id)
      .pipe(
        map((data: PartyAccountsDetails) => {
            this.accountService.setCurrentAccounts(data); // set this current as current account.
            return data?.partyId;
          },
          untilDestroyed(this)
        ))
      .subscribe( (_x) => {
        partyId = _x;
        this.router.navigate([ `/home/view-entity/${partyId}`]);
      });
  }*/

  filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {

   this.intermediaries = null; // Initialize with an empty array or appropriate structure

   /* const value = (event.target as HTMLInputElement).value;

    log.info('myvalue>>>', value)*/

    // this.searchTerm = value;
    let data = this.filterObject[keyData];
    console.log('datalog>>',data, keyData)

    this.isSearching = true;
    this.spinner.show();

    if (data.trim().length > 0 || data === undefined || data === null) {
      this.intermediaryService
        .searchAgent(
          pageIndex, pageSize,
          keyData, data)
        .subscribe((data) => {
            this.intermediaries = data;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
    else {
      this.getAgents(pageIndex, pageSize)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Agents>>>`, data))
        )
        .subscribe(
          (data: Pagination<AgentDTO>) => {
            data.content.forEach( intermediary => {
              intermediary.primaryType = 'I' ? 'Individual' : 'Corporate';
            });
            this.intermediaries = data;
            this.tableDetails.rows = this.intermediaries?.content;
            this.tableDetails.totalElements = this.intermediaries?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => { this.spinner.hide(); }
        );
    }

  }

  inputName(event) {

    const value = (event.target as HTMLInputElement).value;
      this.filterObject['name'] = value;
  }

  inputModeOfIdentity(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['modeOfIdentity'] = value;
  }

  inputIdNumber(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['agentIdNo'] = value;
  }

  inputPrimaryType(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['primaryType'] = value;
  }

  inputAccountType(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['accountType'] = value;
  }

}
