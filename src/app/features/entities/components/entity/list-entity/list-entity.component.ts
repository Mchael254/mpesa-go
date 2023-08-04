import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { EntityDto } from '../../../data/entityDto';
import { LazyLoadEvent } from 'primeng/api';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { tap } from 'rxjs';
import { EntityService } from '../../../services/entity/entity.service';
import { Logger } from 'src/app/shared/services/logger.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';

const log = new Logger('ListEntityComponent');

type CustomLazyLoadEvent = LazyLoadEvent & { sortField: string | string[] };


@Component({
  selector: 'app-list-entity',
  templateUrl: './list-entity.component.html',
  styleUrls: ['./list-entity.component.css']
})
export class ListEntityComponent implements OnInit, OnDestroy {

  entities: Pagination<EntityDto> = <Pagination<EntityDto>>{};
  
  tableDetails: TableDetail;
  pageSize = 5;
  
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'modeOfIdentityName', header: 'Primary ID type' },
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
  ) {}

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
  }

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
    // const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'asc' : 'desc';
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
            this.tableDetails.rows = this.entities.content;
            this.tableDetails.totalElements = this.entities?.totalElements;
            this.cdr.detectChanges();
          }
          else {
            // this.searchEntity(searchTerm);
          }
        }
    );
  }

  getEntities(pageIndex: number,
              sortField: string = 'effectiveDateFrom',
              sortOrder: string = 'desc') {
    return this.entityService
              .getEntities(pageIndex, this.pageSize, sortField, sortOrder)
              .pipe(untilDestroyed(this));
  }

  createEntity() {
    this.router.navigate(['/home/entity/new'])
  }


  ngOnDestroy(): void {
  }

}
