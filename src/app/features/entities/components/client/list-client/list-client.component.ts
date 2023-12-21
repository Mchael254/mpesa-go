import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TableDetail} from "../../../../../shared/data/table-detail";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ClientService} from "../../../services/client/client.service";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {ClientDTO} from "../../../data/ClientDTO";
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {map, tap} from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../../services/account/account.service';
import { PartyAccountsDetails } from '../../../data/accountDTO';
import { SortFilterService } from 'src/app/shared/services/sort-filter.service';

const log = new Logger('ListClientComponent');

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})

export class ListClientComponent implements OnInit {

  public clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  tableDetails: TableDetail;
  public pageSize: 5;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'clientFullName', header: 'Name' },
    { field: 'modeOfIdentity', header: 'Primary ID Type' },
    { field: 'idNumber', header: 'ID Number' },
    { field: 'clientTypeName', header: 'Client Type' }
  ];

  globalFilterFields = ['firstName', 'modeOfIdentity', 'idNumber', 'clientTypeName'];
  clientBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Client',
      url: '/home/entity/client/list'
    }
  ];
  filterObject: {
    name:string, modeOfIdentity:string, idNumber:string, clientTypeName:string
  } = {
    name:'', modeOfIdentity:'', idNumber:'', clientTypeName:''
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    // private sortFilterService: SortFilterService,
    private sortFilterService: SortFilterService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef,
    private spinner:NgxSpinnerService
  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false
    }
  }


  /**
   * The ngOnInit function initializes the tableDetails object with various properties and shows a spinner.
   */
  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
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
   * The function `getClients` retrieves a list of clients with pagination, sorting, and ordering options.
   * @param {number} pageIndex - The pageIndex parameter is used to specify the index of the page to retrieve. It is
   * typically a number that represents the page number or index in a paginated list of clients.
   * @param {any} [sortField=createdDate] - The `sortField` parameter is used to specify the field by which the clients
   * should be sorted. It can be any value, but it is typically a string representing the name of a field in the client
   * data that you want to sort by. For example, it could be 'name', 'created
   * @param {string} [sortOrder=desc] - The sortOrder parameter is used to specify the order in which the clients should be
   * sorted. It can have two possible values: 'asc' for ascending order and 'desc' for descending order. By default, the
   * sortOrder is set to 'desc'.
   * @returns The `getClients` function is returning an Observable.
   */

  getClients(pageIndex: number,
             pageSize: number,
             sortField: any = 'createdDate',
             sortOrder: string = 'desc') {
    return this.clientService
      .getClients(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
      );
  }

  /**
   * The function "lazyLoadClients" is used to fetch clients data with pagination, sorting, and filtering options.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is used to determine the pagination, sorting, and filtering options for fetching clients.
   */
  lazyLoadClients(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;


    if (this.isSearching) {
      const searchEvent = {
        target: {value: this.searchTerm}
      };
      this.filter(searchEvent, pageIndex, pageSize);
    }
    else {
      this.getClients(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Clients>>>`, data))
        )
        .subscribe(
          (data: Pagination<ClientDTO>) => {
            data.content.forEach( client => {
              client.clientTypeName = client.clientType.clientTypeName;
              client.clientFullName = client.firstName + ' ' + (client.lastName || ''); //the client.clientFullName will be set to just firstName,
              // as the null value for lastName is handled  using the logical OR (||) operator
            });
            this.clientsData = data;
            this.tableDetails.rows = this.clientsData?.content;
            this.tableDetails.totalElements = this.clientsData?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
    }
  }

  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {
  }

  /**
   * The function navigates to a new entity page with the entity type set to 'Client'.
   */
  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Client'}}).then(r => {
    })
  }
  // Filter function triggered on input change
  /*filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.clientsData = null;


    let value = event.target.value.toLowerCase();

    this.searchTerm = value;

    log.info('value>>', value, pageIndex);

    if (value) {
      this.isSearching = true;
      this.spinner.show();
      this.clientService.searchClients(pageIndex, pageSize, value)
        .subscribe((data)=> {
          this.clientsData = data;
          log.info('filtered data>>', data);
          this.spinner.hide();

        });
    }
    else {
      this.searchTerm = '';
      this.isSearching = false;
      this.getClients(pageIndex, pageSize, 'createdDate', 'desc');
    }

  }*/
  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.clientsData = null; // Initialize with an empty array or appropriate structure

    /*const value = (event.target as HTMLInputElement).value.toLowerCase();

    log.info('myvalue>>>', value)

      this.searchTerm = value;*/
      this.isSearching = true;
      this.spinner.show();
      this.clientService
        .searchClients(
          pageIndex, pageSize,
          this.filterObject?.name,
          this.filterObject?.modeOfIdentity,
          this.filterObject?.idNumber,
          this.filterObject?.clientTypeName)
        .subscribe((data) => {
          this.clientsData = data;
          this.spinner.hide();
        },
          error => {
            this.spinner.hide();
          });
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
    this.filterObject['idNumber'] = value;
  }

  inputClientTypeName(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['clientTypeName'] = value;
  }
}
