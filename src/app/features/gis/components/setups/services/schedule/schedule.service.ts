import { Injectable } from '@angular/core';
import {Observable, retry} from "rxjs";
import {ScreenCode, ScreenCodes} from "../../data/gisDTO";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private baseUrl = this.appConfig.config.contextPath.gis_services;
  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    public api:ApiService
  ) { }

  getAllScreenCodes(): Observable<ScreenCodes> {
    return this.api.GET<ScreenCodes>(`screens?pageNo=0&pageSize=1000`,API_CONFIG.GIS_SETUPS_BASE_URL)
  }

  updateScreenCode(screenCode: ScreenCode): Observable<ScreenCode>{
    return this.api.PUT<ScreenCode>(
      `screens/${screenCode.code}`, JSON.stringify(screenCode),
      API_CONFIG.GIS_SETUPS_BASE_URL
    )
  }
  createScreenCode(screenCode: ScreenCode) : Observable<ScreenCode> {
    return this.api.POST<ScreenCode>(
      `screens`,
      JSON.stringify(screenCode), API_CONFIG.GIS_SETUPS_BASE_URL
    )
  }
}
