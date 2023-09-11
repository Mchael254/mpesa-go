import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {DepartmentDto} from "../../../data/common/departmentDto";

/**
 * This service is used to manage staff departments
 */

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  baseUrl = this.appConfig.config.contextPath.setup_services;
  constructor(private appConfig: AppConfigService,
              private http: HttpClient)
  { }

  /**
   * This method is used to get all departments in an organization
   * @param organizationId Organization ID
   * @returns {Observable<DepartmentDto[]>} List of departments
   */
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

  /**
   * Get department by ID
   * @param departmentId Department ID
   * @returns {Observable<DepartmentDto>} Department
   */
  getDepartmentById(departmentId: number):Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.get<DepartmentDto>(`/${this.baseUrl}/setups/departments/${departmentId}`);
  }

  /**
   * Create a new Department
   * @param department Department
   * @returns {Observable<DepartmentDto>} Department
   */
  saveDepartment(department: DepartmentDto):Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    return this.http.post<DepartmentDto>(`/${this.baseUrl}/setups/departments`, JSON.stringify(department), {headers:headers});
  }

  /**
   * Update a department
   * @param department Department
   * @returns {Observable<DepartmentDto>} Updated Department
   */
  updateDepartment(department: DepartmentDto): Observable<DepartmentDto>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    let departmentId: number = department?.id;
    return this.http.put<DepartmentDto>(`/${this.baseUrl}/setups/departments/{departmentId}`, JSON.stringify(department), {headers:headers});
  }
}
