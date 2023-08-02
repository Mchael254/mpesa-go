import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";
import {ClientTitleDTO} from "../../../../shared/data/common/client-title-dto";
import {OccupationDTO} from "../../../../shared/data/common/occupation-dto";
import {DepartmentDto} from "../../../../shared/data/common/departmentDto";

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
  ) { }

  getClientTitles(organizationId: number): Observable<ClientTitleDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);

    return this.http.get<ClientTitleDTO[]>(`/${this.baseUrl}/accounts/client-titles`, {headers:header, params:params})
  }

  getOccupations(organizationId: number): Observable<OccupationDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`);

    return this.http.get<OccupationDTO[]>(`/${this.baseUrl}/setups/occupations`, {headers:header, params:params})
  }

  getDepartments(organizationId: number) :Observable<DepartmentDto[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('organizationId', organizationId);

    return this.http.get<DepartmentDto[]>(`/${this.baseUrl}/setups/departments`, {
      headers: headers,
      params: params,
    });
  }
}
