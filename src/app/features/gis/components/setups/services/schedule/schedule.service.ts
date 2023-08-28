import { Injectable } from '@angular/core';
import {Observable, retry} from "rxjs";
import {ScreenCode, ScreenCodes} from "../../data/gisDTO";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";

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
    private appConfig: AppConfigService
  ) { }

  getAllScreenCodes(): Observable<ScreenCodes> {
    return this.http.get<ScreenCodes>(`/${this.baseUrl}/setups/api/v1/screens?pageNo=0&pageSize=1000`)
  }

  updateScreenCode(screenCode: ScreenCode): Observable<ScreenCode>{
    return this.http.put<ScreenCode>(
      `/${this.baseUrl}/setups/api/v1/screens/${screenCode.code}`, JSON.stringify(screenCode),
      {headers: this.headers}
    )
  }
  createScreenCode(screenCode: ScreenCode) : Observable<ScreenCode> {
    return this.http.post<ScreenCode>(
      `/${this.baseUrl}/setups/api/v1/screens`,
      JSON.stringify(screenCode), {headers: this.headers}
    )
  }
}
