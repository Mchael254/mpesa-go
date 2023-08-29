import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {CoverTypes} from "../../data/gisDTO";

@Injectable({
  providedIn: 'root'
})
export class CoverTypesService {
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

  /***
   * Get all cover types
   */
  getAllCovertypes1(): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types?pageNo=0&pageSize=10`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Get cover types by code
   * @param code
   */
  getCoverType(code: any): Observable<CoverTypes>{

    return this.http.get<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Create a cover type
   * @param data
   */
  createCover(data:CoverTypes) {
    console.log(JSON.stringify(data))
    return this.http.post<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  /**
   * Update a cover type
   * @param data of type CoverTypes
   * @param id of the cover type
   */
  updateCover(data:CoverTypes,id:any): Observable<CoverTypes> {
    console.log(JSON.stringify(data))
    return this.http.put<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  /**
   * Delete a cover type
   * @param id of the cover type
   */
  deleteCover(id:any){
    return this.http.delete<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

}
