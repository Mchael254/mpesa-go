import { Injectable } from '@angular/core';
import {coverType} from "../../data/gisDTO";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {catchError, retry} from "rxjs/operators";
import { environment } from '../../../../../../../environments/environment';

import { SESSION_KEY } from '../../../../../../../app/features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../../app/features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../../app/shared/services/api/api.service';
@Injectable({
  providedIn: 'root'
})
export class SubClassCoverTypesService {
  // baseurl = this.appConfig.config.contextPath.gis_services;
  // crmurl = this.appConfig.config.contextPath.setup_services;
  // setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public appConfig : AppConfigService,
              private session_storage: SessionStorageService,
              public api:ApiService
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
   * Create a subclass cover type record
   * @param data of type coverType
   * @returns Observable of type coverType
   */
  createSubCovertype(data: coverType): Observable<coverType>{

    return this.api.POST<coverType>(`subclass-cover-types`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  /**
   * Get all subclass cover types by subclass code
   * @param subClassCode Subclass code
   */
  getSubclassCovertypeBySCode(subClassCode: any): Observable<any>{
    return this.api.GET<any>(`api/v1/subclass-cover-types/?pageNo=0&pageSize=100000&subClassCode=${subClassCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }


  /**
   * Get all subclass cover types by subclass code
   * @param subClassCode Subclass cover type code
   * @returns Observable of type coverType
   */
  getSingleSubclassCovertype(subClassCoverTypeCode: any){
    return this.api.GET<coverType>(`subclass-cover-types/${subClassCoverTypeCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Delete a subclass cover type record
   * @param subClassCoverTypeCode Subclass cover type code
   * @returns Observable of type coverType
   */
  deleteSubclassCovertype(subClassCoverTypeCode: any): Observable<coverType>{
    return this.api.DELETE<coverType>(`subclass-cover-types/${subClassCoverTypeCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Update a subclass cover type record
   * @param data of type coverType
   * @param subClassCoverTypeCode of type number
   * @returns Observable of type coverType
   */
  updateSubCovertype(data: coverType, subClassCoverTypeCode: number): Observable<coverType> {
    console.log(JSON.stringify(data))
    return this.api.PUT<coverType>(`subclass-cover-types/${subClassCoverTypeCode}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }


}
