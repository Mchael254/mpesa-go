import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { StatusDTO } from '../../data/common/systemsDto';
import { ApiService } from '../api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  constructor(private api: ApiService) {}

  getStatus(): Observable<StatusDTO[]> {
    return this.api.GET<StatusDTO[]>(
      `system-definitions/active-inactive-status`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getDivisionStatus(): Observable<StatusDTO[]> {
    return this.api.GET<StatusDTO[]>(
      `division-statuses`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
