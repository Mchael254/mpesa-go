import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { Options } from '../data/options';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class OptionsService {
  constructor(private api: ApiService) {}

  getRepeatOptions(): Observable<Options[]> {
    return this.api.GET<Options[]>(
      `options/repeat-options`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }

  getThresholdType(): Observable<Options[]> {
    return this.api.GET<Options[]>(
      `options/threshold-types`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }
}
