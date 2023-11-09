import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../../../../core/config/app-config-service';

const log = new Logger('ClientTypeService');

@Injectable({
  providedIn: 'root'
})
export class ClientTypeService {
  baseUrl = this.appConfig.config.contextPath.accounts_services;


  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  getClientypeList(): {id: number; description:string}[] {
    log.info('Fetching Client Type');
    // return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`);
    return [{ id: 1, description: 'Corporate' }, { id: 2, description: 'Individual' }];
  }
  getClientTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.http.get<any[]>(`/${this.baseUrl}/client-types?organizationId=2`);
  }
  getIdentifierTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.http.get<any[]>(`/${this.baseUrl}/identity-modes?organizationId=2`);
  }


}
