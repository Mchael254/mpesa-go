import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpParams} from '@angular/common/http';

import {SystemModule, SystemsDto} from '../../../data/common/systemsDto';
import {ApiService} from '../../api/api.service';
import {API_CONFIG} from '../../../../../environments/api_service_config';
import {SystemRole} from "../../../data/common/system-role";
import {ProcessArea} from "../../../data/common/process-area";
import {ProcessSubArea} from "../../../data/common/process-sub-area";
import {RoleArea} from "../../../data/common/role-area";
import {of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SystemsService {
  constructor(private api: ApiService) {}

  getSystems(organizationId?: number): Observable<SystemsDto[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<SystemsDto[]>(
      `systems`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getSystemModules(): Observable<SystemModule[]> {
    return this.api.GET<SystemModule[]>(
      `system-modules`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getSystemRoles(systemCode: number, organizationId?: number): Observable<SystemRole[]> {
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }
    paramsObj['systemCode'] = systemCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<SystemRole[]>(
      `roles`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      params
    );
  }

  createRole(role: SystemRole): Observable<SystemRole> {
    return this.api.POST<SystemRole>(
      `roles`,
      JSON.stringify(role),
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
    )
  }

  editRole(role: SystemRole): Observable<SystemRole> {
    return this.api.PUT<SystemRole>(
      `roles/${role.id}`,
      JSON.stringify(role),
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
    )
  }

  deleteRole(id: number) {
    return this.api.DELETE(
      `roles/${id}`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL
    )
  }

  getRolesAreas(roleId: number): Observable<RoleArea[]> {
    const paramsObj: { [param: string]: string } = {};

    paramsObj['systemCode'] = roleId.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<RoleArea[]>(
      `role-area`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      params
    );
  }

  getProcessAreas(roleAreaId: number): Observable<ProcessArea[]> {
    const paramsObj: { [param: string]: string } = {};

    paramsObj['roleAreaCode'] = roleAreaId.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<ProcessArea[]>(
      `process-area`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      params
    );
  }

  getProcessSubAreas(processAreaId: number): Observable<ProcessSubArea[]> {
    const paramsObj: { [param: string]: string } = {};

    paramsObj['processAreaCode'] = processAreaId.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<ProcessSubArea[]>(
      `process-sub-area`,
      API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
      params
    );
  }

  getSystemById(systemID: number) {
    return this.api.GET<SystemsDto>(
      `systems/${systemID}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    )
  }

}
