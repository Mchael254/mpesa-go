import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientBranchesDto, ClientDTO, ClientTypeDTO } from '../../data/ClientDTO';
import {Pagination} from '../../../../shared/data/common/pagination'
import {AppConfigService} from "../../../../core/config/app-config-service";
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';
import {UtilService} from "../../../../shared/services";
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;
  baseUrlSetups= this.appConfig.config.contextPath.setup_services;
  headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json','X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),});

  constructor(private http: HttpClient,
    private appConfig: AppConfigService, private api: ApiService, private utilService: UtilService, private session_storage: SessionStorageService) { }
    
  getClients(
      page: number | null = 0,
      size: number | null = 5,
      sortField: string = 'createdDate',
      order: string = 'desc'
    ): Observable<Pagination<ClientDTO>> {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
      const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`)
        .set('organizationId', 2)
        .set('sortListFields', `${sortField}`)
        .set('order', `${order}`);

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/clients`,
        {
          headers: headers,
          params: params,
        });
    }

  getAgents(
      page: number | null = 0,
      size: number | null = 10,
      sortField: string = 'createdDate',
      order: string = 'desc'
    ): Observable<Pagination<any>> {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      })
      const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`)
        .set('organizationId', 2)
        .set('sortListFields', `${sortField}`)
        .set('order', `${order}`);

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/agents`,

        {
          headers: headers,
          params: params,
        });
  }
  searchClients(
      page: number,
      size: number = 5,
      name: string,
      modeOfIdentity: string = null,
      idNumber: string = null,
      clientTypeName: string = null
    ): Observable<Pagination<ClientDTO>> {
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
      });

      const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`)
        .set('name', `${name}`)
        .set('organizationId', 2)
        .set('modeOfIdentity', `${modeOfIdentity}`)
        .set('idNumber', `${idNumber}`)
        .set('clientTypeName', `${clientTypeName}`);
      let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/clients`, {
        headers: header,
        params: paramObject,
      });
  }
  getIdentityType(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<any[]>(`/${this.baseUrl}/identity-modes`,
      {
        headers:headers,
        params:params
      });
  }
  getClientType(organizationId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<ClientTypeDTO[]>(`/${this.baseUrl}/client-types`,
      {
        headers:headers,
        params:params
      });
  }

  saveClientDetails(clientData: ClientDTO): Observable<ClientDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<ClientDTO[]>(`/${this.baseUrl}/accounts`, JSON.stringify(clientData), {headers:headers})

  }

   createClient(client: {}): Observable<ClientDTO> {
    console.log('CREATE CLIENT:'+client);
    return ;

    // return this.http.post<ClientDTO>(`/${this.baseUrl}/clients`, JSON.stringify(client), {headers:this.headers});
  }

  updateClient(client_id: number, client: {}): Observable<ClientDTO> {
    console.log('UPDATE CLIENT:'+client);
    return this.http.put<ClientDTO>(`/${this.baseUrl}/clients/${client_id}`, JSON.stringify(client), {headers:this.headers});
  }

  getClientById(id: number): Observable<ClientDTO> {
    return this.http.get<ClientDTO>(`/${this.baseUrl}/clients/` + id, {headers:this.headers});
  }

  getclientRequiredDocuments(){
    return this.api.GET('required-documents?accountType=C', API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }

  // getAccountByCode(code: number): Observable<ClientDTO> {
  //   let params = new HttpParams().set('accountCode', code)
  //   // return this.http.get<ClientDTO>(`http://10.176.18.211:1031/accounts/details?accountCode=178565`);
  //   return this.http.get<ClientDTO>(`/${this.baseUrl}/details`, {params: params});
  // }

  getAccountByCode(code: number): Observable<ClientDTO> {
    // return this.http.get<ClientDTO>(`http://10.176.18.211:1031/accounts/details?accountCode=178565`);
    return this.api.GET<ClientDTO>(`details?accountCode=${code}`, API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL);
  }



  getCLientBranches(): Observable<ClientBranchesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<ClientBranchesDto[]>(`/${this.baseUrlSetups}/setups/branches`,
      {
        headers:headers,
        params:params
      });
  }

  getClientTitles(organizationId: number): Observable<any[]> {

    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<ClientTypeDTO[]>(`/${this.baseUrl}/client-titles`,
      {
        headers:this.headers,
        params:params
      });
  }

  save(clientData: any): Observable<any> {
    return this.api.POST<any>(`clients`, clientData, API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL);

  }


}
