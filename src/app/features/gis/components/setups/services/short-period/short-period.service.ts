import { Injectable } from '@angular/core';
import { shortPeriod } from '../../data/gisDTO';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { ApiService } from 'src/app/shared/services/api/api.service';
@Injectable({
  providedIn: 'root'
})
export class ShortPeriodService {
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

  

  getAllSPRates():Observable<any>{
    return this.api.GET(`short-period-rates`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSPRates(code:number):Observable<shortPeriod>{
    return this.api.GET<shortPeriod>(`short-period-rates/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createSPRates(data:shortPeriod[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<shortPeriod[]>(`short-period-rates`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateSPRates(data:shortPeriod,id:any){
      console.log(JSON.stringify(data))
      return this.api.PUT<shortPeriod>(`short-period-rates/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteSPRates(id:number){
      return this.api.DELETE<shortPeriod>(`short-period-rates/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
