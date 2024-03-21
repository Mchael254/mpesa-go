import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DepartmentDto } from '../../../data/common/departmentDto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

/**
 * This service is used to manage staff departments
 */

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private api: ApiService) {}

  /**
   * This method is used to get all departments in an organization
   * @param organizationId Organization ID
   * @returns {Observable<DepartmentDto[]>} List of departments
   */
  getDepartments(organizationId: number): Observable<DepartmentDto[]> {
    const params = new HttpParams().set('organizationId', organizationId);

    return this.api.GET<DepartmentDto[]>(
      `departments`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get department by ID
   * @param departmentId Department ID
   * @returns {Observable<DepartmentDto>} Department
   */
  getDepartmentById(departmentId: number): Observable<DepartmentDto> {
    return this.api.GET<DepartmentDto>(
      `departments/${departmentId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Create a new Department
   * @param department Department
   * @returns {Observable<DepartmentDto>} Department
   */
  saveDepartment(department: DepartmentDto): Observable<DepartmentDto> {
    return this.api.POST<DepartmentDto>(
      `departments`,
      JSON.stringify(department),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Update a department
   * @param department Department
   * @returns {Observable<DepartmentDto>} Updated Department
   */
  updateDepartment(
    department: DepartmentDto,
    departmentId: number
  ): Observable<DepartmentDto> {
    return this.api.PUT<DepartmentDto>(
      `departments/${departmentId}`,
      JSON.stringify(department),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
