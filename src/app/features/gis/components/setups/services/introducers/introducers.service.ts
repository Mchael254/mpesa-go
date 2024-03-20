import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { introducers } from '../../data/gisDTO';
import { SESSION_KEY } from '../../../../../../features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class IntroducersService {

  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  constructor(
    private http: HttpClient,
    private appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    private api:ApiService
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
  getAllIntroducers(): Observable<introducers[]>{
    let page = 0;
    let size = 100
   
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<introducers[]>(
      `introducers`,
     API_CONFIG.GIS_SETUPS_BASE_URL,
     params
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
}
