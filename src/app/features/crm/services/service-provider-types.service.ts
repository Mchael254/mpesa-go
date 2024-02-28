import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { Observable } from 'rxjs';
import { ServiceProviderTypeDTO } from '../data/service-provider-type';

@Injectable({
  providedIn: 'root',
})
export class ServiceProviderTypesService {
  baseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getServiceProviderTypes(
    name?: string,
    shortDescription?: string,
    status?: string
  ): Observable<ServiceProviderTypeDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

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

    return this.http.get<ServiceProviderTypeDTO[]>(
      `/${this.baseUrl}/service-provider-types`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createServiceProviderType(
    data: ServiceProviderTypeDTO
  ): Observable<ServiceProviderTypeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<ServiceProviderTypeDTO>(
      `/${this.baseUrl}/service-provider-types`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateServiceProviderType(
    serviceProviderTypeId: number,
    data: ServiceProviderTypeDTO
  ): Observable<ServiceProviderTypeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<ServiceProviderTypeDTO>(
      `/${this.baseUrl}/service-provider-types/${serviceProviderTypeId}`,
      data,
      { headers: headers }
    );
  }

  deleteServiceProviderType(serviceProviderTypeId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<ServiceProviderTypeDTO>(
      `/${this.baseUrl}/service-provider-types/${serviceProviderTypeId}`,
      { headers: headers }
    );
  }
}
