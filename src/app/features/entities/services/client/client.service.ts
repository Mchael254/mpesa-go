import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientBranchesDto, ClientDTO, ClientTypeDTO } from '../../data/ClientDTO';
import {Pagination} from '../../../../shared/data/common/pagination'
import {AppConfigService} from "../../../../core/config/app-config-service";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl = this.appConfig.config.contextPath.accounts_services;
  headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json'});

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

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/clients`,
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

      return this.http.get<Pagination<ClientDTO>>(`/${this.baseUrl}/clients`, {
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
    return this.http.get<any[]>(`/${this.baseUrl}/identity-modes`,
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
    return this.http.get<ClientDTO>(`/${this.baseUrl}/clients/` + id);
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


  getClientTitles(organizationId: number): Observable<any[]> {

    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);
    return this.http.get<ClientTypeDTO[]>(`/${this.baseUrl}/client-titles`,
      {
        headers:this.headers,
        params:params
      });
  }


}
