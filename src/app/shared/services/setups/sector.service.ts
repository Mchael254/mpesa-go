import { Injectable } from '@angular/core';
import { AppConfigService } from "../../../core/config/app-config-service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Logger } from "../logger.service";
import { SectorDTO } from '../../data/common/sector-dto';

const log = new Logger('SectorService');

@Injectable({
  providedIn: 'root'
})
export class SectorService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  getSectors(organizationId: number): Observable<SectorDTO[]> {
    log.info('Fetching Sectors');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
    .set('organizationId', `${organizationId}`);

    return this.http.get<SectorDTO[]>(`/${this.baseUrl}/setups/sectors`, {headers:header, params:params})
  }
}
