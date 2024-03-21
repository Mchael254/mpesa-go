import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpParams } from '@angular/common/http';

import { SystemsDto } from '../../../data/common/systemsDto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class SystemsService {
  constructor(private api: ApiService) {}

  getSystems(): Observable<SystemsDto[]> {
    const params = new HttpParams().set('organizationId', 2);

    return this.api.GET<SystemsDto[]>(
      `systems`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }
}
