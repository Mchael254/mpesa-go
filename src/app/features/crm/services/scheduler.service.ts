import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { ScheduledJobsDto } from '../data/scheduler';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class SchedulerService {
  constructor(private api: ApiService) {}

  getScheduledJobs(
    sysCode: number,
    description?: string,
    jobName?: string
  ): Observable<ScheduledJobsDto[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};

    // Add optional parameters if provided
    if (description) {
      paramsObj['description'] = description;
    }
    if (jobName) {
      paramsObj['jobName'] = jobName;
    }

    // Add the mandatory parameter
    paramsObj['sysCode'] = sysCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.GET<ScheduledJobsDto[]>(
      'scheduledJobs',
      API_CONFIG.NOTIFICATION_BASE_URL,
      params
    );
  }
}
