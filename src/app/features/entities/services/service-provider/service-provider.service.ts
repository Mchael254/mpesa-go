import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { Observable } from 'rxjs';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ServiceProviderDTO } from '../../data/ServiceProviderDTO';


@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getServiceProviders(
    page: number = 0,
    size: number = 5,
    sortFields: string = 'createdDate',
    sortOrder: string = 'desc'
  ): Observable<Pagination<ServiceProviderDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('organizationId', 2) //TODO:Find proper way to fetch organization Id
      .set('sortListFields', `${sortFields}`)
      .set('order', `${sortOrder}`)

    return this.http.get<Pagination<ServiceProviderDTO>>(`/${this.baseUrl}/accounts/service-providers`,
      {
        headers: headers,
        params: params,
      });
  }
}
