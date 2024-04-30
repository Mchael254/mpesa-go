import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ServiceProviderTypeActivityDTO,
  ServiceProviderTypeDTO,
} from '../data/service-provider-type';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTypesService {
  constructor(private api: ApiService) {}

  getServiceProviderTypes(
    name?: string,
    shortDescription?: string,
    status?: string
  ): Observable<ServiceProviderTypeDTO[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (name) {
      paramsObj['name'] = name;
    }
    if (shortDescription) {
      paramsObj['shortDescription'] = shortDescription;
    }
    if (status) {
      paramsObj['status'] = status;
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<ServiceProviderTypeDTO[]>(
      `service-provider-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  createServiceProviderType(
    data: ServiceProviderTypeDTO
  ): Observable<ServiceProviderTypeDTO> {
    return this.api.POST<ServiceProviderTypeDTO>(
      `service-provider-types`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateServiceProviderType(
    serviceProviderTypeId: number,
    data: ServiceProviderTypeDTO
  ): Observable<ServiceProviderTypeDTO> {
    return this.api.PUT<ServiceProviderTypeDTO>(
      `service-provider-types/${serviceProviderTypeId}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteServiceProviderType(serviceProviderTypeId: number) {
    return this.api.DELETE<ServiceProviderTypeDTO>(
      `service-provider-types/${serviceProviderTypeId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getServiceProviderTypeActivity(): Observable<
    ServiceProviderTypeActivityDTO[]
  > {
    return this.api.GET<ServiceProviderTypeActivityDTO[]>(
      `service-provider-types/activities`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getServiceProviderTypeActivityByCode(
    code: number
  ): Observable<ServiceProviderTypeActivityDTO[]> {
    return this.api.GET<ServiceProviderTypeActivityDTO[]>(
      `service-provider-types/${code}/activities`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createServiceProviderTypeActivity(
    id: number,
    data: ServiceProviderTypeActivityDTO
  ): Observable<ServiceProviderTypeActivityDTO> {
    return this.api.POST<ServiceProviderTypeActivityDTO>(
      `service-provider-types/${id}/activities`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateServiceProviderTypeActivity(
    code: number,
    id: number,
    data: ServiceProviderTypeActivityDTO
  ): Observable<ServiceProviderTypeActivityDTO> {
    return this.api.PUT<ServiceProviderTypeActivityDTO>(
      `service-provider-types/${id}/activities/${code}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteServiceProviderTypeActivity(
    code: number,
    id: number
  ): Observable<ServiceProviderTypeActivityDTO> {
    return this.api.DELETE<ServiceProviderTypeActivityDTO>(
      `service-provider-types/${id}/activities/${code}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
