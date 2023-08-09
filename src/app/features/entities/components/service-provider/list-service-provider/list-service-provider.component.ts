import { ChangeDetectorRef, Component } from '@angular/core';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { ServiceProviderDTO } from '../../../data/ServiceProviderDTO';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import {Logger, untilDestroyed} from "../../../../../shared/shared.module";
import { tap } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { Router } from '@angular/router';

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

  cols = [
    { field: 'name', header: 'Name' },
    { field: 'category', header: 'Category' },
    { field: 'spEntityType', header: 'Entity Type' },
    { field: 'modeOfIdentity', header: 'Primary ID Type' },
    { field: 'pinNumber', header: 'ID Number' }
  ];

  globalFilterFields = ['name', 'category', 'modeOfIdentity', 'pinNumber'];
  constructor(
    private service: ServiceProviderService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
      url: '/home/entity/edit',
      urlIdentifier: 'id',
      isLazyLoaded: true
    }
  }


  getServiceProviders(pageIndex: number,
    sortField: any = 'createdDate',
    sortOrder: string = 'desc') {
    return this.service
    .getServiceProviders(pageIndex, this.pageSize, sortField, sortOrder)
    .pipe(
    untilDestroyed(this),
    );
  }

lazyLoadServiceProviders(event:LazyLoadEvent | TableLazyLoadEvent){
  const pageIndex = event.first / event.rows;
  const sortField = event.sortField;
  const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';

  this.getServiceProviders(pageIndex, sortField, sortOrder)
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
      }
    );
  }

  gotoEntityPage() {
    this.router.navigate(['/home/entity/service-provider/new'],
      {queryParams: {entityType: 'Service Provider'}}).then(r => {
    })
  }
  
  ngOnDestroy(): void {
  }
}
