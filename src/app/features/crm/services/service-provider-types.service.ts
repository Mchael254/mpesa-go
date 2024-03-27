import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceProviderTypeDTO } from '../data/service-provider-type';
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
}
