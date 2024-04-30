import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { territories } from '../../../data/gisDTO';
import {ApiService} from "../../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../../environments/api_service_config";
@Injectable({
  providedIn: 'root'
})
export class TerritoriesService {

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
   /*TERRITORIES*/

   getAllTerritories():Observable<any>{
    return this.api.GET(`territories`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getTerritory(code:number):Observable<territories>{
    return this.api.GET<territories>(`territories/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createTerritory(data:territories[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<territories[]>(`territories`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    updateTerritory(data:territories,id:any){
      console.log(JSON.stringify(data))
      return this.api.PUT<territories>(`territories/${id}`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

}
