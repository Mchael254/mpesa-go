import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ProviderTypeDto, ServiceProviderDTO, ServiceProviderRes} from '../../data/ServiceProviderDTO';
import { BankBranchDTO, BankDTO, CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
import { CountryDto, StateDto, TownDto } from 'src/app/shared/data/common/countryDto';
import { MandatoryFieldsDTO } from 'src/app/shared/data/common/mandatory-fields-dto';
import { ClientTitlesDto } from '../../data/ClientDTO';
import { OccupationDTO } from 'src/app/shared/data/common/occupation-dto';
import { IdentityModeDTO } from '../../data/entityDto';
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';


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
    page: number | null = 0,
    size: number | null = 5,
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

    return this.http.get<Pagination<ServiceProviderDTO>>(`/${this.baseUrl}/service-providers`,
      {
        headers: headers,
        params: params,
      });
  }

  searchServiceProviders(
    page: number,
    size: number = 5,
    name: string
  ): Observable<Pagination<ServiceProviderDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('organizationId', 2)
      .set('name', `${name}`)

    return this.http.get<Pagination<ServiceProviderDTO>>(`/${this.baseUrl}/service-providers`,
      {
        headers: headers,
        params: params,
      });
  }

  saveServiceProvider(serviceProviderData: ServiceProviderDTO): Observable<ServiceProviderDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<ServiceProviderDTO[]>(`/${this.baseUrl}/accounts`, JSON.stringify(serviceProviderData), {headers:headers})

  }


  getClientTitles(): Observable<ClientTitlesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<ClientTitlesDto[]>(`/${this.baseUrl}/client-titles`,
      {
        headers:headers,
        params:params,
      });
  }
  // getIdentityType(): Observable<IdentityModeDTO[]> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   });
  //   const params = new HttpParams()
  //     .set('organizationId', 2);
  //   return this.http.get<IdentityModeDTO[]>(`/${this.baseUrl}/identity-modes`,
  //     {
  //       headers:headers,
  //       params:params,
  //     });
  // }

  getServiceProviderType(): Observable<ProviderTypeDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<ProviderTypeDto[]>(`/${this.baseUrl}/service-provider-types`,{headers:headers});
  }

    /*Get a Service Provider by Id*/
  getServiceProviderById(id: number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    return this.http.get(`/${this.baseUrl}/service-providers/${id}`,
      {
        headers: headers,
      });
  }
}
