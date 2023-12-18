import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {ClientTitleDTO} from "../../../../shared/data/common/client-title-dto";

import { Pagination } from '../../../../shared/data/common/pagination';
import { AccountReqPartyId, EntityDto, EntityResDTO, IdentityModeDTO, ReqPartyById } from '../../data/entityDto';
import { PartyTypeDto } from '../../data/partyTypeDto';
import { PartyAccountsDetails } from '../../data/accountDTO';
import {UtilService} from "../../../../shared/services/util/util.service";

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  private entity$ = new BehaviorSubject<EntityDto>({
    partyTypeId: 0,
    profilePicture: "",
    categoryName: "",
    modeOfIdentityName: "",
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

  private accountDetails$ = new BehaviorSubject<AccountReqPartyId>({
    accountCode: 0,
    accountTypeId: 0,
    category: "",
    effectiveDateFrom: "",
    effectiveDateTo: "",
    id: 0,
    partyId: 0,
    partyType: {
      id: 0,
      organizationId: 0,
      partyTypeLevel: 0,
      partyTypeName: "",
      partyTypeShtDesc: "",
      partyTypeVisible: ""
    },
    kycInfo: {
      id: 0,
      name: "",
      shortDesc: "",
      emailAddress: "",
      phoneNumber: "",
    },
    organizationId: 0,
    organizationGroupId: 0

  })
  currentAccount$ = this.accountDetails$.asObservable();

  private entityAccounts$ = new BehaviorSubject<AccountReqPartyId[]>([]);
  private partyAccounts$ = new BehaviorSubject<PartyAccountsDetails[]>([])
  currentEntityAccount$ = this.entityAccounts$.asObservable();
  currentPartyAccounts$ = this.partyAccounts$.asObservable();

  private searchTermSource = new Subject<string>();
  searchTerm$ = this.searchTermSource.asObservable();

  private entitiesSource = new Subject<Pagination<EntityDto>>();
  entities$ = this.entitiesSource.asObservable();

  public searchTermObject = signal({});

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private utilService: UtilService
  ) { }

  setSearchTerm(searchTerm: string) {
    this.searchTermSource.next(searchTerm);
  }

  setEntities(entities: Pagination<EntityDto>) {
    this.entitiesSource.next(entities);
  }

  setCurrentEntity(entity: EntityDto){
    this.entity$.next(entity);
  }

  setCurrentAccount(accountDetails: AccountReqPartyId){
    this.accountDetails$.next(accountDetails);
  }

  setCurrentEntityAccounts(entityAccountsDetails: AccountReqPartyId[]){
    this.entityAccounts$.next(entityAccountsDetails);
  }

  setCurrentPartyAcounts(partyAccountsDetails: PartyAccountsDetails[]){
    this.partyAccounts$.next(partyAccountsDetails);
  }

  getEntities(
    page: number | null = 0,
    size: number | null = 5,
    sortList: string = 'effectiveDateFrom',
    order: string = 'desc'
  ): Observable<Pagination<EntityDto>> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    let params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortList}`)
      .set('order', `${order}`)
      .set('organizationId', 2) /*TODO: Find proper way to fetch organizationId*/

      // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.http.get<Pagination<EntityDto>>(`/${baseUrl}/parties/all-parties`,
      {
        headers:headers,
        params: params
      });

  }

  searchEntities(
    page: number,
    size: number = 5,
    name: string
  ): Observable<Pagination<EntityDto>> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    let params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('organizationId', 2)

    // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.http.get<Pagination<EntityDto>>(`/${baseUrl}/parties/all-parties`,
      {
        headers:headers,
        params: params
      });

  }
   getEntityById(partyId: number): Observable<EntityDto>{
    const baseUrl = this.appConfig.config.contextPath.accounts_services;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.get<EntityDto>(`/${baseUrl}/parties/${partyId}`,{headers:headers});
  }
  getEntityByPartyId(id: number): Observable<ReqPartyById > {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<ReqPartyById >(`/${baseUrl}/parties/` + id, {headers:headers});
  }

  getIdentityType(): Observable<IdentityModeDTO []> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const params = new HttpParams()
      .set('organizationId', 2);

    return this.http.get<IdentityModeDTO []>(`/${baseUrl}/identity-modes`,
      {
        headers:headers,
        params:params,
      })

  }

  getPartiesType(organizationId: number = 2): Observable<PartyTypeDto[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const params = new HttpParams()
    .set('organizationId', `${organizationId}`);

    return this.http.get<PartyTypeDto[]>(`/${baseUrl}/party-types`, {headers:headers,params:params});
  }

  saveEntityDetails(data: EntityResDTO): Observable<EntityDto> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<EntityDto>(`/${baseUrl}/parties`, JSON.stringify(data), {headers:headers})
  }

  uploadProfileImage(partyId: number, file: File) {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    let form = new FormData;
    form.append('file', file, file.name);
    return this.http.post<any>(`/${baseUrl}/parties/${partyId}/upload-profile-image`, form );
  }

  getAccountById(id: number): Observable<AccountReqPartyId[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<AccountReqPartyId[]>(`/${baseUrl}/parties/`+ id +`/accounts`, {headers:headers});
  }

  getClientTitles(organizationId: number): Observable<ClientTitleDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);

    return this.http.get<ClientTitleDTO[]>(`/${this.baseUrl}/client-titles`, {headers:header, params:params})
  }
}
