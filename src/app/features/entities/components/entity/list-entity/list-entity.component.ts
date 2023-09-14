import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { Pagination } from '../../../../../shared/data/common/pagination';
import { TableDetail } from '../../../../../shared/data/table-detail';
import { EntityDto } from '../../../data/entityDto';
import { LazyLoadEvent } from 'primeng/api';
import { untilDestroyed } from '../../../../../shared/services/until-destroyed';
import { tap } from 'rxjs';
import { EntityService } from '../../../services/entity/entity.service';
import { Logger } from '../../../../../shared/services/logger/logger.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AutoUnsubscribe } from '../../../../../shared/services/AutoUnsubscribe';

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
      url: '/home/dahsboard'
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

  constructor(
    private entityService: EntityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService
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
  }

/**
 * The `lazyLoadEntity` function is used to fetch entities with pagination, sorting, and search
 * functionality.
 * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent`
 * or `TableLazyLoadEvent`.
 */
  lazyLoadEntity(event: LazyLoadEvent | TableLazyLoadEvent) {
    let sortField: string = '';
    if ('sortField' in event) {
      if (Array.isArray(event.sortField)) {
        sortField = event.sortField[0];
      } else {
        sortField = event.sortField;
      }
    }

    const pageIndex = event.first / event.rows;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const searchTerm = localStorage.getItem('searchTerm');

    this.getEntities(pageIndex, sortField, sortOrder)
      .pipe(
        untilDestroyed(this),
        tap((data) => log.info(`Fetching entities>>>`, data))
      )
      .subscribe(
        (data: Pagination<EntityDto>) => {
          if (searchTerm === null) {
            data.content.forEach(entity => {
              entity.modeOfIdentityName = entity.modeOfIdentity.name
            });
            this.entities = data;
            this.tableDetails.rows = this.entities?.content;
            this.tableDetails.totalElements = this.entities?.totalElements;
            this.cdr.detectChanges();
          }
          else {
            // this.searchEntity(searchTerm);
          }
          this.spinner.hide();

        },
        error => {
          this.spinner.hide();
        }

    );
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
              sortField: string = 'effectiveDateFrom',
              sortOrder: string = 'desc') {
    return this.entityService
              .getEntities(pageIndex, this.pageSize, sortField, sortOrder)
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

}
