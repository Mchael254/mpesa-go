import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {TableDetail} from "../../../../../shared/data/table-detail";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {ClientService} from "../../../services/client/client.service";
import {SortFilterService} from "../../../../../shared/services/sort-filter.service";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {ClientDTO} from "../../../data/ClientDTO";
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import {LazyLoadEvent} from "primeng/api";
import {TableLazyLoadEvent} from "primeng/table";
import {tap} from "rxjs/operators";

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
    private sortFilterService: SortFilterService,
    // private accountService: AccountService,
    private cdr: ChangeDetectorRef
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
  }

  getClients(pageIndex: number,
             sortField: any = 'createdDate',
             sortOrder: string = 'desc') {
    return this.clientService
      .getClients(pageIndex, this.pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
      );
  }

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
        }
      );
  }

  ngOnDestroy(): void {
  }
}
