import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import { subclassSection } from '../../data/gisDTO';
import { environment } from '../../../../../../../environments/environment';
import {SessionStorageService} from "../../../../../../shared/services/session-storage/session-storage.service";
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../environments/api_service_config";
import {StringManipulation} from "../../../../../lms/util/string_manipulation";
import {SESSION_KEY} from "../../../../../lms/util/session_storage_enum";

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public appConfig : AppConfigService,
              private session_storage: SessionStorageService,
              private api:ApiService
              ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }

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


  /**
   * Get all sections
   */
  getAllSections(): Observable<any>{
    let page = 0;
    let size = 10000;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<any>(`api/v1/sections`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSectionByCode(code:number): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),


    })
    const params = new HttpParams()

    return this.api.GET<any>(`api/v1/sections/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassSections(subClassCode:number): Observable<subclassSection[]>{
    let page = 0;
    let size = 10000;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<subclassSection[]>(`api/v1/subclass-sections?subClassCode=${subClassCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

}
