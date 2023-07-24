import { Injectable } from '@angular/core';
import { AppConfigService } from "../../../core/config/app-config-service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Logger } from "../logger.service";
import { OccupationDTO } from '../../data/common/occupation-dto';

const log = new Logger('OccupationService');

@Injectable({
  providedIn: 'root'
})
export class OccupationService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  getOccupations(organizationId: number): Observable<OccupationDTO[]> {
    log.info('Fetching Occupations');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
    .set('organizationId', `${organizationId}`);

    return this.http.get<OccupationDTO[]>(`/${this.baseUrl}/setups/occupations`, {headers:header, params:params})
  }
}
