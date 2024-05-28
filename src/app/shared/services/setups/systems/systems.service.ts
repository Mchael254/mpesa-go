import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpParams } from '@angular/common/http';

import { SystemModule, SystemsDto } from '../../../data/common/systemsDto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

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
}
