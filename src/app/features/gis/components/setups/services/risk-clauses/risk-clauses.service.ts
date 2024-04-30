import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { riskClauses } from '../../data/gisDTO';
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class RiskClausesService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    public api:ApiService
  ) { }
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }
  // Error handling
errorHandl(error: HttpErrorResponse) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
    // Get client-side error
    errorMessage = error.error.message;
  } else {
    // Get server-side error
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }
  console.log(errorMessage);
  return throwError(errorMessage);
  }
  getRiskClauses(code:number): Observable<riskClauses[]>{
    let page = 0;
    let size = 1000
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<riskClauses[]>(`excesses/?riskCode=${code}&page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
}
