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
import {tap} from "rxjs/operators";
import { NgxSpinnerService } from 'ngx-spinner';

const log = new Logger('ListClientComponent');

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})

export class ListClientComponent implements OnInit {

  public clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  tableDetails: TableDetail;
  pageSize: 5;

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


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService,
    // private sortFilterService: SortFilterService,
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
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true
    }
    this.spinner.show();

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
             sortField: any = 'createdDate',
             sortOrder: string = 'desc') {
    return this.clientService
      .getClients(pageIndex, this.pageSize, sortField, sortOrder)
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

    this.getClients(pageIndex, sortField, sortOrder)
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
}
