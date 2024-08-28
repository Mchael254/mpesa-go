import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ClientBranchesDto,
  ClientDTO,
  ClientTitlesDto,
  ClientTypeDTO,
} from '../../data/ClientDTO';
import { Pagination } from '../../../../shared/data/common/pagination';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';
import { UtilService } from '../../../../shared/services';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private api: ApiService, private utilService: UtilService) {}

  getClients(
    page: number | null = 0,
    size: number | null = 5,
    sortField: string = 'createdDate',
    order: string = 'desc',
    columnName: string = null,
    columnValue: string = null
  ): Observable<Pagination<ClientDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`)
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`);

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<Pagination<ClientDTO>>(
      `clients`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getAgents(
    page: number | null = 0,
    size: number | null = 10,
    sortField: string = 'createdDate',
    order: string = 'desc'
  ): Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`);

    /*if (organizationId !== undefined && organizationId !== null) { todo: add organizationId to parameters
      params['organizationId'] = organizationId.toString();
    }*/

    return this.api.GET<Pagination<ClientDTO>>(
      `agents`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getAgentById(agent_code: any): Observable<Pagination<any>> {
    return this.api.GET<Pagination<ClientDTO>>(
      `agents/${agent_code}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  searchClients(
    page: number,
    size: number = 5,
    name: string,
    modeOfIdentity: string = null,
    idNumber: string = null,
    clientTypeName: string = null
  ): Observable<Pagination<ClientDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('modeOfIdentity', `${modeOfIdentity}`)
      .set('idNumber', `${idNumber}`)
      .set('clientTypeName', `${clientTypeName}`);

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<ClientDTO>>(
      `clients`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getIdentityType(): Observable<any[]> {
    const params = new HttpParams();

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    return this.api.GET<any[]>(
      `identity-modes`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  // getClientType(organizationId: number): Observable<any[]> {
  //   const params = new HttpParams().set('organizationId', `${organizationId}`);
  //   return this.api.GET<ClientTypeDTO[]>(
  //     `client-types`,
  //     API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
  //     params
  //   );
  // }

  getClientType(organizationId: number | null = null): Observable<any[]> {
    let params = new HttpParams();
    console.log("OrgIdPassed", organizationId)
    if (organizationId !== null) {
      params = params.set('organizationId', organizationId.toString());
    }
    return this.api.GET<ClientTypeDTO[]>(
      `client-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  saveClientDetails(clientData: ClientDTO): Observable<ClientDTO[]> {
    return this.api.POST<ClientDTO[]>(
      `accounts`,
      JSON.stringify(clientData),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createClient(client: {}): Observable<ClientDTO> {
    console.log('CREATE CLIENT:' + client);
    return;

    // return this.http.post<ClientDTO>(`/${this.baseUrl}/clients`, JSON.stringify(client), {headers:this.headers});
  }

  updateClient(client_id: number, client: {}): Observable<ClientDTO> {
    return this.api.PUT<ClientDTO>(
      `clients/${client_id}`,
      JSON.stringify(client),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getClientById(id: number): Observable<ClientDTO> {
    return this.api.GET<ClientDTO>(
      `clients/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getclientRequiredDocuments() {
    return this.api.GET(
      'required-documents?accountType=C',
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  // getAccountByCode(code: number): Observable<ClientDTO> {
  //   let params = new HttpParams().set('accountCode', code)
  //   // return this.http.get<ClientDTO>(`http://10.176.18.211:1031/accounts/details?accountCode=178565`);
  //   return this.http.get<ClientDTO>(`/${this.baseUrl}/details`, {params: params});
  // }

  getAccountByCode(code: number): Observable<ClientDTO> {
    return this.api.GET<ClientDTO>(
      `details?accountCode=${code}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getCLientBranches(): Observable<ClientBranchesDto[]> {
    return this.api.GET<ClientBranchesDto[]>(
      `branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getClientTitles(organizationId?:number):Observable<ClientTitlesDto[]>{
    const paramObj: { [param: string] : string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramObj['organizationId'] = organizationId.toString();
    }
    const params = new HttpParams({ fromObject: paramObj });
    return this.api.GET<ClientTitlesDto[]>(
      `client-titles`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  save(clientData: any): Observable<any> {
    return this.api.POST<any>(
      `clients`,
      clientData,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
