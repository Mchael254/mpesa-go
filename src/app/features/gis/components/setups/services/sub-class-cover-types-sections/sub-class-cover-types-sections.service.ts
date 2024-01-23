import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {subclassCoverSections, subclassCoverTypes} from "../../data/gisDTO";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubClassCoverTypesSectionsService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public appConfig : AppConfigService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': environment.TENANT_ID


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
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-sections?pageNo=0&pageSize=1000000`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclassCovertypeSections(): Observable<subclassCoverTypes[]>{
    return this.http.get<subclassCoverTypes[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-sections?pageNo=0&pageSize=10000`,this.httpOptions).pipe(
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

    return this.http.post<subclassCoverSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-sections`, JSON.stringify(data),this.httpOptions)
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
    return this.http.delete<subclassCoverSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-sections/${subClassCoverTypeSetionCode}`).pipe(
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

    return this.http.post<subclassCoverSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-sections`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

}
