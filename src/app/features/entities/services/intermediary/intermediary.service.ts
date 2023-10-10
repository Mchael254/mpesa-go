import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {AccountTypeDTO, AgentDTO, AgentPostDTO, IntermediaryDTO} from "../../data/AgentDTO";
import {IdentityModeDTO} from "../../data/entityDto";

@Injectable({
  providedIn: 'root'
})
export class IntermediaryService {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getAgents(
    page: number = 0,
    size: number = 5,
    sortList: string = 'createdDate',
    order: string = 'desc'
  ): Observable<Pagination<AgentDTO>> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('organizationId', 2)
      .set('sortListFields', `${sortList}`)
      .set('order', `${order}`);

    return this.http.get<Pagination<AgentDTO>>(`/${baseUrl}/agents`,{
      headers:headers,
      params: params,
    })
  }

  getAgentById(id: number): Observable<AgentDTO> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    return this.http.get<AgentDTO>(`/${baseUrl}/agents/${id}`,{
      headers:headers,
    })
  }

  searchAgent(
    page: number = 0,
    size: number = 5,
    name: string
  ): Observable<Pagination<AgentDTO>> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('organizationId', 2);

    return this.http.get<Pagination<AgentDTO>>(`/${baseUrl}/agents`, {
      headers: header,
      params: params,
    });
  }

  getIdentityType(): Observable<IdentityModeDTO[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<IdentityModeDTO[]>(`/${baseUrl}/identity-modes`,
      {
        headers:headers,
        params:params
      })
  }

  getAccountType(): Observable<AccountTypeDTO[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    const params = new HttpParams()
      .set('organizationId', 2);
    return this.http.get<AccountTypeDTO[]>(`/${baseUrl}/account-types`,
      {
        headers:headers,
        params:params
      })
  }

  saveAgentDetails(data: AgentPostDTO): Observable<IntermediaryDTO> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<IntermediaryDTO>(`/${baseUrl}/accounts`, JSON.stringify(data), {headers:headers})

  }
}
