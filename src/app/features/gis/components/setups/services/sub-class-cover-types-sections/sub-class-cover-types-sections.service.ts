import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {subclassCoverSections, subclassCoverTypes} from "../../data/gisDTO";
import { environment } from '../../../../../../../environments/environment';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { ApiService } from 'src/app/shared/services/api/api.service';
@Injectable({
  providedIn: 'root'
})
export class SubClassCoverTypesSectionsService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public  appConfig : AppConfigService, 
              private session_storage: SessionStorageService,
              private api:ApiService
              ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),


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
   * Get all subclass cover types sections
   */
  getAllSubCovSection(): Observable<any>{
    return this.api.GET<any>(`subclass-covertype-to-sections?pageNo=0&pageSize=1000000`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclassCovertypeSections(): Observable<subclassCoverTypes[]>{
    return this.api.GET<subclassCoverTypes[]>(`api/v1/subclass-covertype-to-sections?pageNo=0&pageSize=10000`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }


  /**
   * Create a subclass cover type section
   * @param data of type subclassCoverSections
   * @returns Observable of type subclassCoverSections
   */
  createSubCoverTypeSection(data: subclassCoverSections): Observable<subclassCoverSections>{

    return this.api.POST<subclassCoverSections>(`subclass-covertype-to-sections`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  /**
   * Delete a subclass cover type section
   * @param subClassCoverTypeSetionCode of type number
   * @returns Observable of type subclassCoverSections
   */
  deleteSubCovSec(subClassCoverTypeSetionCode: number): Observable<subclassCoverSections>{
    return this.api.DELETE<subclassCoverSections>(`subclass-covertype-to-sections/${subClassCoverTypeSetionCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Create a subclass cover type section
   * @param data of type subclassCoverSections
   * @returns Observable of type subclassCoverSections
   */
  createSub(data: subclassCoverSections): Observable<subclassCoverSections>{

    return this.api.POST<subclassCoverSections>(`subclass-covertype-to-sections`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

}
