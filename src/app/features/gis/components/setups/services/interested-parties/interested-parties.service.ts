import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import {AppConfigService} from '../../../../../../core/config/app-config-service'
import { InterestedParties } from '../../data/gisDTO';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class InterestedPartiesService {
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

    /********INTERESTED PARTIES ******/
    getAllInterestedParties(): Observable<any>{
      let page = 0;
      let size = 10
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      
      })
      const params = new HttpParams()
      .set('page', `${page}`)
        .set('pageSize', `${size}`)
      return this.api.GET<any>(`interested-parties?page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      ) 
    }
    getInterestedParties(code: any): Observable<InterestedParties[]>{
      
      return this.api.GET<InterestedParties[]>(`interested-parties/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createParty(data:InterestedParties[]) {
      console.log(JSON.stringify(data))
      return this.api.POST<InterestedParties[]>(`interested-parties`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      } 
      updateParty(data:InterestedParties,id:any): Observable<InterestedParties> {
        console.log(JSON.stringify(data))
        return this.api.PUT<InterestedParties>(`interested-parties/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deleteParty(id:any){
        return this.api.DELETE<InterestedParties>(`interested-parties/${id}`,API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
}
