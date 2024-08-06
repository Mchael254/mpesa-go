import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { Alerts, JobType, Reports, Routine } from '../data/job-type';

@Injectable({
  providedIn: 'root',
})
export class JobTypesService {
  constructor(private api: ApiService) {}

  getJobTypes(): Observable<JobType[]> {
    return this.api.GET<JobType[]>(
      `job-types`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }

  getAllRoutines(): Observable<Routine[]> {
    return this.api.GET<Routine[]>(
      `job-types/all-routines`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }

  getAllReports(): Observable<Reports[]> {
    return this.api.GET<Reports[]>(
      `job-types/all-reports`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }

  getAlerts(): Observable<Alerts[]> {
    return this.api.GET<Alerts[]>(
      `job-types/alerts`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }
}
