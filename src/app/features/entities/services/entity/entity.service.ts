import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";

import {Pagination} from '../../../../shared/data/common/pagination';
import {
  AccountReqPartyId,
  EntityDto,
  EntityResDTO,
  IdentityModeDTO,
  PoliciesDTO,
  ReqPartyById
} from '../../data/entityDto';
import {PartyTypeDto} from '../../data/partyTypeDto';
import {PartyAccountsDetails} from '../../data/accountDTO';
import {UtilService} from "../../../../shared/services/util/util.service";
import {ApiService} from 'src/app/shared/services/api/api.service';
import {API_CONFIG} from 'src/environments/api_service_config';
import {ClaimsDTO} from 'src/app/features/gis/data/claims-dto';
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import {Bank} from "../../data/BankDto";

@Injectable({
  providedIn: 'root',
})
export class EntityService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  private entity$ = new BehaviorSubject<EntityDto>({
    partyTypeId: 0,
    profilePicture: '',
    categoryName: '',
    modeOfIdentityName: '',
    countryId: 0,
    dateOfBirth: '',
    effectiveDateFrom: '',
    effectiveDateTo: '',
    id: 0,
    modeOfIdentity: undefined,
    identityNumber: 0,
    name: '',
    organizationId: 0,
    pinNumber: '',
    profileImage: '',
  });
  currentEntity$ = this.entity$.asObservable();

  private accountDetails$ = new BehaviorSubject<AccountReqPartyId>({
    accountCode: 0,
    accountTypeId: 0,
    category: '',
    effectiveDateFrom: '',
    effectiveDateTo: '',
    id: 0,
    partyId: 0,
    partyType: {
      id: 0,
      organizationId: 0,
      partyTypeLevel: 0,
      partyTypeName: '',
      partyTypeShtDesc: '',
      partyTypeVisible: '',
    },
    kycInfo: {
      id: 0,
      name: '',
      shortDesc: '',
      emailAddress: '',
      phoneNumber: '',
    },
    organizationId: 0,
    organizationGroupId: 0,
  });
  currentAccount$ = this.accountDetails$.asObservable();

  private entityAccounts$ = new BehaviorSubject<AccountReqPartyId[]>([]);
  private partyAccounts$ = new BehaviorSubject<PartyAccountsDetails[]>([]);
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
    private utilService: UtilService,
    private api: ApiService,
    private session_storage: SessionStorageService,
  ) { }

  setSearchTerm(searchTerm: string) {
    this.searchTermSource.next(searchTerm);
  }

  setEntities(entities: Pagination<EntityDto>) {
    this.entitiesSource.next(entities);
  }

  setCurrentEntity(entity: EntityDto) {
    this.entity$.next(entity);
  }

  setCurrentAccount(accountDetails: AccountReqPartyId) {
    this.accountDetails$.next(accountDetails);
  }

  setCurrentEntityAccounts(entityAccountsDetails: AccountReqPartyId[]) {
    this.entityAccounts$.next(entityAccountsDetails);
  }

  setCurrentPartyAcounts(partyAccountsDetails: PartyAccountsDetails[]) {
    this.partyAccounts$.next(partyAccountsDetails);
  }

  getEntities(
    page: number | null = 0,
    size: number | null = 5,
    sortList: string,
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
      .set(
        'organizationId',
        2
      ); /*TODO: Find proper way to fetch organizationId*/

    // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({
      fromObject: this.utilService.removeNullValuesFromQueryParams(params),
    });

    return this.api.GET<Pagination<EntityDto>>(
      `parties/all-parties`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  searchEntities(
    page: number,
    size: number = 5,
    columnName: string,
    columnValue: string
  ): Observable<Pagination<EntityDto>> {
    let params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`);

    // Call the removeNullValuesFromQueryParams method from the UtilsService
    params = new HttpParams({
      fromObject: this.utilService.removeNullValuesFromQueryParams(params),
    });

    return this.api.GET<Pagination<EntityDto>>(
      `parties/all-parties`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getEntityById(partyId: number): Observable<EntityDto> {
    return this.api.GET<EntityDto>(
      `parties/${partyId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getEntityByPartyId(id: number): Observable<ReqPartyById> {
    return this.api.GET<ReqPartyById>(
      `parties/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getIdentityType(): Observable<IdentityModeDTO[]> {
    const params = new HttpParams().set('organizationId', 2);

    return this.api.GET<IdentityModeDTO[]>(
      `identity-modes`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getPartiesType(organizationId: number = 2): Observable<PartyTypeDto[]> {
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.api.GET<PartyTypeDto[]>(
      `party-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  saveEntityDetails(data: EntityResDTO): Observable<EntityDto> {
    return this.api.POST<EntityDto>(
      `parties`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  uploadProfileImage(partyId: number, file: File) {
    let form = new FormData();
    form.append('file', file, file.name);
    return this.api.POST<any>(
      `parties/${partyId}/upload-profile-image`,
      form,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getAccountById(id: number): Observable<AccountReqPartyId[]> {
    return this.api.GET<AccountReqPartyId[]>(
      `parties/${id}/accounts`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  fetchGisQuotationsByClientId(id: number): Observable<any[]> {
    return this.api.GET<any[]>(
      `api/v2/quotation/view/clientCode?clientId=${id}`,
      API_CONFIG.GIS_QUOTATIONS_BASE_URL
    );
  }

  fetchGisPoliciesByClientId(id: number) {
    return this.api.GET<Pagination<PoliciesDTO>>(
      `api/v2/policies/client/${id}`,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  fetchGisClaimsByClientId(id: number): Observable<Pagination<ClaimsDTO>> {
    return this.api.GET<Pagination<ClaimsDTO>>(
      `api/v2/claims/client/${id}`,
      API_CONFIG.GIS_CLAIMS_BASE_URL
    );
  }

  fetchBankDetailsByBranchId(id: number): Observable<Bank> {
    return this.api.GET<Bank>(`bank-branches/${id}`, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL);
  }

}
