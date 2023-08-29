import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SectionsService {
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
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/sections`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

}
