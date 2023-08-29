import { Injectable } from '@angular/core';
import {coverType} from "../../data/gisDTO";
import {Observable, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SubClassCoverTypesService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public appConfig : AppConfigService) { }

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
   * Create a subclass cover type record
   * @param data of type coverType
   * @returns Observable of type coverType
   */
  createSubCovertype(data: coverType): Observable<coverType>{

    return this.http.post<coverType>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types`, JSON.stringify(data),this.httpOptions)
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
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/?pageNo=0&pageSize=100000&subClassCode=${subClassCode}`).pipe(
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
    return this.http.get<coverType>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${subClassCoverTypeCode}`).pipe(
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
    return this.http.delete<coverType>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${subClassCoverTypeCode}`).pipe(
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
    return this.http.put<coverType>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${subClassCoverTypeCode}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }


}
