import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DepartmentDto} from "../../data/common/departmentDto";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  constructor(private appConfig: AppConfigService,
              private http: HttpClient)
  { }

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

  getDepartmentById(departmentId: number):Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.get<DepartmentDto>(`/${this.baseUrl}/setups/departments/${departmentId}`);
  }

  saveDepartment(department: DepartmentDto):Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post<DepartmentDto>(`/${this.baseUrl}/setups/departments`, JSON.stringify(department), {headers:headers});
  }

  updateDepartment(department: DepartmentDto): Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    let departmentId: number = department?.id;
    return this.http.put<DepartmentDto>(`/${this.baseUrl}/setups/departments/{departmentId}`, JSON.stringify(department), {headers:headers});
  }
}
