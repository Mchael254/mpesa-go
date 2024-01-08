import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { TableDetail } from '../../../../../shared/data/table-detail';
import { EntityDto } from '../../../data/entityDto';
import { LazyLoadEvent } from 'primeng/api';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import {Subscription, tap} from 'rxjs';
import { EntityService } from '../../../services/entity/entity.service';
import { Logger } from '../../../../../shared/services/logger/logger.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutoUnsubscribe } from '../../../../../shared/services/AutoUnsubscribe';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('ListEntityComponent');

type CustomLazyLoadEvent = LazyLoadEvent & { sortField: string | string[] };


@Component({
  selector: 'app-list-entity',
  templateUrl: './list-entity.component.html',
  styleUrls: ['./list-entity.component.css']
})
@AutoUnsubscribe
export class ListEntityComponent implements OnInit, OnDestroy {

  entities: Pagination<EntityDto> = <Pagination<EntityDto>>{};

  tableDetails: TableDetail;
  pageSize = 5;

  isSearching = false;
  searchTerm = '';
  private subscription: Subscription;
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'modeOfIdentityName', header: 'ID Type' },
    { field: 'identityNumber', header: 'ID Number' },
    { field: 'pinNumber', header: 'Pin Number' },
    { field: 'categoryName', header: 'Entity Type' },
  ];

  globalFilterFields = ['name', 'modeOfIdentity.name', 'identityNumber', 'pinNumber', 'categoryName'];

  entityBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Entities',
      url: '/home/entity/list'
    }
  ];
  filterObject: { identityNumber: string; name: string; pinNumber: string; categoryName: string; modeOfIdentity: { name: string } } = {
    name:'', identityNumber:'', modeOfIdentity: {name: ''}, pinNumber:'', categoryName:''
  };

  constructor(
    private entityService: EntityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private globalMessagingService: GlobalMessagingService
  ) {

  }

/**
 * The ngOnInit function initializes the tableDetails object with specific properties and shows a
 * spinner.
 */
  ngOnInit(): void {
    this.tableDetails = {
      cols: this.cols,
      rows: [],
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      url: '/home/entity/view',
      urlIdentifier: 'id',
      isLazyLoaded: true
    }
    this.spinner.show();
    log.info(this.entityService.searchTermObject());
    const nameSearch:any = this.entityService.searchTermObject();

    if(nameSearch?.fromSearchScreen) {
      this.entityService
        .searchEntities(0, 5, nameSearch?.searchNameInput || null, nameSearch?.searchIdInput || null)
        .subscribe({
          next: (data) => {
            this.entities = data;
            this.spinner.hide();
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
          }
        });
    }
  this.spinner.hide();
  }

/**
 * The `lazyLoadEntity` function is used to fetch entities with pagination, sorting, and search
 * functionality.
 * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent`
 * or `TableLazyLoadEvent`.
 */
  lazyLoadEntity(event: LazyLoadEvent | TableLazyLoadEvent) {
    // let sortField: string = '';
    // if ('sortField' in event) {
    //   if (Array.isArray(event.sortField)) {
    //     sortField = event.sortField[0];
    //   } else {
    //     sortField = event.sortField;
    //   }
    // }
 const search:any = this.entityService.searchTermObject();
  if(!search?.fromSearchScreen) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const searchTerm = localStorage.getItem('searchTerm');
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: {value: this.searchTerm}
      };
      this.filter(searchEvent, pageIndex, pageSize, null);
    }
    else {
      this.getEntities(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching entities>>>`, data))
        )
        .subscribe({
          next: (data: Pagination<EntityDto>) => {
            data.content.forEach(entity => {
              entity.modeOfIdentityName = entity.modeOfIdentity.name
            });
            this.entities = data;
            this.tableDetails.rows = this.entities?.content;
            this.tableDetails.totalElements = this.entities?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
            this.spinner.hide();
          }
        });
    }
  }


  }

/**
 * The `getEntities` function retrieves entities from the entity service, with optional parameters for
 * pagination, sorting field, and sorting order.
 * @param {number} pageIndex - The pageIndex parameter is a number that represents the index of the
 * page to retrieve. It is used to determine which page of entities to fetch from the entity service.
 * @param {string} [sortField=effectiveDateFrom] - The `sortField` parameter is used to specify the
 * field by which the entities should be sorted. It is a string that represents the name of the field.
 * By default, it is set to 'effectiveDateFrom'.
 * @param {string} [sortOrder=desc] - The sortOrder parameter determines the order in which the
 * entities should be sorted. It can have two possible values: "asc" for ascending order and "desc" for
 * descending order. By default, the sortOrder is set to "desc".
 * @returns The `getEntities` function is returning an Observable.
 */
  getEntities(pageIndex: number,
              pageSize: number,
              sortField: any = 'effectiveDateFrom',
              sortOrder: string = 'desc') {
    return this.entityService
              .getEntities(pageIndex, pageSize, sortField, sortOrder)
              .pipe(untilDestroyed(this));
  }

/**
 * The createEntity function navigates to the '/home/entity/new' route.
 */
  createEntity() {
    this.router.navigate(['/home/entity/new'])
  }


  ngOnDestroy(): void {
  }

  viewDetailsWithId(rowId: number) {
    // let partyId: number;

    this.router.navigate([ `/home/entity/view/${rowId}`]);
    // fetch account details to fetch party id before routing to 360 view
    /*this.accountService
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
      });*/
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows, keyData: string) {
    this.entities = null; // Initialize with an empty array or appropriate structure

    this.subscription = this.entityService.searchTerm$
      .subscribe(searchTerm => {
        this.searchTerm = searchTerm.toString();
      })
    // const searchTerm = localStorage.getItem('searchTerm');
    /*const value = (event.target as HTMLInputElement).value.toLowerCase() || this.searchTerm;

    log.info('myvalue>>>', value)

    this.searchTerm = value;*/

    let data = this.filterObject[keyData];
    console.log('datalog>>',data, keyData)

    this.isSearching = true;
    this.spinner.show();

    if (data.trim().length > 0 || data === undefined || data === null) {
      this.entityService
        .searchEntities(
          pageIndex, pageSize,
          keyData, data)
        .subscribe((data) => {
            this.entities = data;
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          });
    }
    else {
      this.getEntities(pageIndex, pageSize)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching entities>>>`, data))
        )
        .subscribe(
          (data: Pagination<EntityDto>) => {
            // if (searchTerm === null) {
            data.content.forEach(entity => {
              entity.modeOfIdentityName = entity.modeOfIdentity.name
            });
            this.entities = data;
            this.tableDetails.rows = this.entities?.content;
            this.tableDetails.totalElements = this.entities?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();

          },
          error => {
            this.spinner.hide();
          }

        );
    }

  }
  inputName(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }

  inputIdNumber(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['identityNumber'] = value;
  }
  inputModeOfIdentityName(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['modeOfIdentity.name'] = value;
  }
  inputPinNumber(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['pinNumber'] = value;
  }
  inputCategoryName(event) {

    const value = (event.target as HTMLInputElement).value;
    this.filterObject['categoryName'] = value;
  }

}
