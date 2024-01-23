import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {SystemsDto} from "../../../data/common/systemsDto";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";

@Injectable({
  providedIn: 'root'
})
export class SystemsService {

  baseUrlSetup = this.appConfig.config.contextPath.setup_services;

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
  ) { }

  getSystems(): Observable<SystemsDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    const params = new HttpParams()
      .set('organizationId', 2);

    return this.http.get<SystemsDto[]>(`/${this.baseUrlSetup}/setups/systems`,
      {
        headers:headers,
        params: params
      });
  }
}
