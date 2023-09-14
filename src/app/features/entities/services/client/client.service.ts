import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientBranchesDto, ClientDTO, ClientTypeDTO } from '../../data/ClientDTO';
import {Pagination} from '../../../../shared/data/common/pagination'
import {AppConfigService} from "../../../../core/config/app-config-service";

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(private http: HttpClient,
    private appConfig: AppConfigService) { }
    getClients(
      page: number = 0,
      size: number = 5,
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

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/accounts/clients`,
        {
          headers: headers,
          params: params,
        });
    }
    searchClients(
      page: number = 0,
      size: number = 5,
      name: string,
    ): Observable<Pagination<ClientDTO>> {
      const header = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });

      const params = new HttpParams()
        .set('page', `${page}`)
        .set('size', `${size}`)
        .set('name', `${name}`)
        .set('organizationId', 2);

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/accounts/clients`, {
        headers: header,
        params: params,
      });
    }
  getIdentityType(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<any[]>(`/${this.baseUrl}/accounts/identity-modes`,
      {
        headers:headers,
        params:params
      });
  }
  getClientType(organizationId: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<ClientTypeDTO[]>(`/${this.baseUrl}/accounts/client-types`,
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

    return this.http.post<ClientDTO[]>(`/${this.baseUrl}/accounts/accounts`, JSON.stringify(clientData), {headers:headers})

  }

  getClientById(id: number): Observable<ClientDTO> {
    return this.http.get<ClientDTO>(`/${this.baseUrl}/accounts/clients/` + id);
  }

  getCLientBranches(): Observable<ClientBranchesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<ClientBranchesDto[]>(`/${this.baseUrl}/setups/organization-branches`,
      {
        headers:headers,
        params:params
      });
  }
}
