import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { StatusDTO } from '../../data/common/systemsDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getStatus(): Observable<StatusDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<StatusDTO[]>(
      `/${this.baseUrl}/setups/system-definitions/active-inactive-status`,
      {
        headers: headers,
      }
    );
  }

  getDivisionStatus(): Observable<StatusDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<StatusDTO[]>(
      `/${this.baseUrl}/setups/division-statuses`,
      {
        headers: headers,
      }
    );
  }
}
