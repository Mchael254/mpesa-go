import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Sequence } from '../../data/gisDTO';
import { allocateform,changeForm } from '../../data/gisDTO';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class SequenceService {

  setupsbaseurl = "setups/api/v1"
  baseurl = this.appConfig.config.contextPath.gis_services;

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

    getSequenceList (): Observable<Sequence>{

      return this.api.GET<Sequence>(`system-sequences`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
  
        retry(1),
        catchError(this.errorHandl)
      );
    }
    getSequenceByCode(code: number){
      return this.api.GET(`system-sequences/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL);
    }
    createSequence(data: Sequence): Observable<Sequence> {
      console.log(JSON.stringify(data))
      return this.api.POST<Sequence>(`system-sequences`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
      )
    }
    allocate(code: any, data:any) {
  
      return this.api.POST(`system-sequences/${code}/allocate`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
      )
    }
    change (code: any,data:changeForm): Observable<changeForm> {
      
      return this.api.PUT<changeForm>(`system-sequences/${code}/change-next-number`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
      )
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

}
