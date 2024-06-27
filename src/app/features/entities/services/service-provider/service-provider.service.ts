import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pagination } from '../../../../shared/data/common/pagination';
import {
  ProviderTypeDto,
  ServiceProviderDTO,
} from '../../data/ServiceProviderDTO';
import { ClientTitlesDto } from '../../data/ClientDTO';
import { UtilService } from '../../../../shared/services';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderService {
  constructor(private utilService: UtilService, private api: ApiService) {}

  getServiceProviders(
    page: number | null = 0,
    size: number | null = 5,
    sortFields: string = 'createdDate',
    sortOrder: string = 'desc'
  ): Observable<Pagination<ServiceProviderDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      /*.set('organizationId', null)*/ //TODO:Find proper way to fetch organization Id
      .set('sortListFields', `${sortFields}`)
      .set('order', `${sortOrder}`);

    return this.api.GET<Pagination<ServiceProviderDTO>>(
      `service-providers`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  searchServiceProviders(
    page: number,
    size: number = 5,
    columnName: string,
    columnValue: string
  ): Observable<Pagination<ServiceProviderDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('organizationId', null)
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<Pagination<ServiceProviderDTO>>(
      `service-providers`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  saveServiceProvider(
    serviceProviderData: ServiceProviderDTO
  ): Observable<ServiceProviderDTO[]> {
    return this.api.POST<ServiceProviderDTO[]>(
      `accounts`,
      JSON.stringify(serviceProviderData),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getClientTitles(): Observable<ClientTitlesDto[]> {
    const params = new HttpParams().set('organizationId', null);
    return this.api.GET<ClientTitlesDto[]>(
      `client-titles`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getServiceProviderType(): Observable<ProviderTypeDto[]> {
    return this.api.GET<ProviderTypeDto[]>(
      `service-provider-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  /*Get a Service Provider by Id*/
  getServiceProviderById(id: number) {
    return this.api.GET(
      `service-providers/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
