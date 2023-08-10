import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ClientTitlesDto, CountryDto, CurrenciesDto, IdentityModeDto, MandatoryFieldsDTO, OccupationDto, ProviderTypeDto, SectorDto, ServiceProviderDTO, TownDto } from '../../data/ServiceProviderDTO';
import { BankBranchDTO, BankDTO } from 'src/app/shared/data/common/bank-dto';
import { StateDto } from 'src/app/shared/data/common/countryDto';


@Injectable({
  providedIn: 'root'
})
export class ServiceProviderService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;
  private entity$ = new BehaviorSubject({
    partyTypeId: 0,
    profilePicture: "",
    categoryName: "",
    countryId: 0,
    dateOfBirth: "",
    effectiveDateFrom: "",
    effectiveDateTo: "",
    id: 0,
    modeOfIdentity: undefined,
    identityNumber: 0,
    name: "",
    organizationId: 0,
    pinNumber: "",
    profileImage: ""
  });
  currentEntity$ = this.entity$.asObservable();

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

  getMandatoryFieldsByGroupId(groupId: string): Observable<MandatoryFieldsDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<MandatoryFieldsDTO[]>(`/${this.baseUrl}/setups/form-fields/group/${groupId}` ,{headers:headers});
  }

  getBanks(countryId: number): Observable<BankDTO[]> {
    console.log('Fetching Banks');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
    .set('countryId', `${countryId}`);

    return this.http.get<BankDTO[]>(`/${this.baseUrl}/setups/banks`, {headers:header, params:params})
  }
  getMainCityStatesByCountry(id: number): Observable<StateDto[]>{
    console.log('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/countries/${id}/states`);
  }
  getTownsByMainCityState(id: number): Observable<TownDto[]>{
    return this.http.get<TownDto[]>(`/${this.baseUrl}/setups/states/${id}/towns`);
  }
  getBankBranchesByBankId(bankId: number): Observable<BankBranchDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<BankBranchDTO[]>(`/${this.baseUrl}/setups/bank-branches/${bankId}/bank-branches`, { headers: header });
  }
  saveServiceProvider(serviceProviderData: ServiceProviderDTO): Observable<ServiceProviderDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<ServiceProviderDTO[]>(`/${this.baseUrl}/accounts/accounts`, JSON.stringify(serviceProviderData), {headers:headers})

  }
  getCountries(): Observable<CountryDto[]> {
    return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`);
  }
  getSectors(): Observable<SectorDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<SectorDto[]>(`/${this.baseUrl}/setups/sectors`,
      {
        headers:headers,
        params:params,
      });
  }
  getCurrencies(): Observable<CurrenciesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<CurrenciesDto[]>(`/${this.baseUrl}/setups/currencies`,{headers:headers});
  }
  getClientTitles(): Observable<ClientTitlesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<ClientTitlesDto[]>(`/${this.baseUrl}/accounts/client-titles`,
      {
        headers:headers,
        params:params,
      });
  }
  getIdentityType(): Observable<IdentityModeDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<IdentityModeDto[]>(`/${this.baseUrl}/accounts/identity-modes`,
      {
        headers:headers,
        params:params,
      });
  }
  getOccupation(): Observable<OccupationDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<OccupationDto[]>(`/${this.baseUrl}/setups/occupations`,
      {
        headers:headers,
        params:params,
      });
  }
  getServiceProviderType(): Observable<ProviderTypeDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.get<ProviderTypeDto[]>(`/${this.baseUrl}/accounts/service-provider-types`,{headers:headers});
  }
}
