import { ChangeDetectorRef, Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { ServiceProviderDTO } from '../../../data/ServiceProviderDTO';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import { map, tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountService } from '../../../services/account/account.service';
import { PartyAccountsDetails } from '../../../data/accountDTO';

@Component({
  selector: 'app-list-service-provider',
  templateUrl: './list-service-provider.component.html',
  styleUrls: ['./list-service-provider.component.css']
})
export class ListServiceProviderComponent {
  serviceProviderBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Service Providers',
      url: '/home/entity/service-provider/list'
    }
  ];

  public ServiceProviderDetails: Pagination<ServiceProviderDTO> = <Pagination<ServiceProviderDTO>>{};
  tableDetails: TableDetail;
  pageSize: 5;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'spEntityType', header: 'Entity Type' },
    { field: 'modeOfIdentity', header: 'Primary ID Type' },
    { field: 'pinNumber', header: 'ID Number' }
  ];

  globalFilterFields = ['name', 'category', 'modeOfIdentity', 'pinNumber'];
  filterObject: {
    name:string, category: string, providerType: string, modeOfIdentity:string, pinNumber: string
  } = {
    name:'',category:'', providerType:'', modeOfIdentity:'', pinNumber: ''
  };
  constructor(
    private service: ServiceProviderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
     private accountService: AccountService
  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.ServiceProviderDetails?.content,
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
      rows: this.ServiceProviderDetails?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      // url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true,
      viewDetailsOnView: true,
      viewMethod: this.viewDetailsWithId.bind(this),
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
 * Retrieves a list of service providers with pagination and sorting options.
 *
 * @param {number} pageIndex - The index of the page to retrieve.
 * @param {string} sortField - The field by which to sort the results (default: 'createdDate').
 * @param {string} sortOrder - The sorting order, either 'asc' or 'desc' (default: 'desc').
 * @returns {Observable<Pagination<ServiceProviderDTO>>} An observable that emits a paginated list of service providers.
 * @remarks
 * This method makes an HTTP request to fetch a list of service providers with pagination and sorting options.
 * The retrieved data is encapsulated in a Pagination object and emitted as an observable.
 *
 */


  getServiceProviders(pageIndex: number,
                      pageSize: number,
    sortField: any = 'createdDate',
    sortOrder: string = 'desc') {
    return this.service
    .getServiceProviders(pageIndex, pageSize, sortField, sortOrder)
    .pipe(
    untilDestroyed(this),
    );
  }
/**
 * Handles lazy loading of service providers based on table events.
 *
 * @param {LazyLoadEvent | TableLazyLoadEvent} event - The event containing table loading information.
 * @remarks
 * This method is triggered when a table component requests lazy loading of service provider data.
 * It extracts pagination and sorting information from the event and calls the 'getServiceProviders' method.
 * The retrieved data is processed and updated in the component.
 *

 */
lazyLoadServiceProviders(event:LazyLoadEvent | TableLazyLoadEvent){
  const pageIndex = event.first / event.rows;
  const sortField = event.sortField;
  const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
  const pageSize = event.rows;

  if (this.isSearching) {
    const searchEvent = {
      target: {value: this.searchTerm}
    };
    this.filter(searchEvent, pageIndex, pageSize, null);
  }
  else {
    this.getServiceProviders(pageIndex, pageSize, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
        tap((data) => console.log(`Service Providers`, data))
      )
      .subscribe(
        (data: Pagination<ServiceProviderDTO>) => {
          data.content.forEach(entity => {
            entity.spEntityType = entity?.providerType?.name
          });
          this.ServiceProviderDetails = data;
          this.tableDetails.rows = this.ServiceProviderDetails?.content;
          this.tableDetails.totalElements = this.ServiceProviderDetails?.totalElements;
          this.cdr.detectChanges();
          this.spinner.hide();
        },
        error => {this.spinner.hide();}
      );
  }

  }
/**
 * Navigates to the entity creation page for a new service provider.
 * @remarks
 * This method is used to navigate to the entity creation page for a new service provider.
 * It sets the query parameter 'entityType' to 'Service Provider' for the route.
 */
  gotoEntityPage() {
    this.router.navigate(['/home/entity/new'],
      {queryParams: {entityType: 'Service Provider'}}).then(r => {
    })
  }

  ngOnDestroy(): void {
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {
    this.ServiceProviderDetails = null; // Initialize with an empty array or appropriate structure

   /* const value = (event.target as HTMLInputElement).value.toLowerCase();


    this.searchTerm = value;*/
    let data = this.filterObject[keyData];
    console.log('datalog>>',data, keyData)
    this.isSearching = true;
    this.spinner.show();

    if (data.trim().length > 0 || data === undefined || data === null) {
      this.service
        .searchServiceProviders(
          pageIndex, pageSize,
          keyData, data)
        .subscribe((data) => {
            this.ServiceProviderDetails = data;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
    else {
      this.getServiceProviders(pageIndex, pageSize)
        .pipe(
          untilDestroyed(this),
          tap((data) => console.log(`Service Providers`, data))
        )
        .subscribe(
          (data: Pagination<ServiceProviderDTO>) => {
            data.content.forEach(entity => {
              entity.spEntityType = entity.providerType.name
            });
            this.ServiceProviderDetails = data;
            this.tableDetails.rows = this.ServiceProviderDetails?.content;
            this.tableDetails.totalElements = this.ServiceProviderDetails?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => {this.spinner.hide();}
        );
    }
  }

  inputName(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }

  inputCategory(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['category'] = value;
  }

  inputEntityType(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['spEntityType'] = value;
  }

  inputModeOfIdentity(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['modeOfIdentity'] = value;
  }

  inputIdentityNumber(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['pinNumber'] = value;
  }
}
