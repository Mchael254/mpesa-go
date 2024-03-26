import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { Peril } from '../../../data/gisDTO';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class PerilsService {

 
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

    /* PERILS */
    getAllPerils(): Observable<Peril[]>{
      return this.api.GET<Peril[]>(`perils?pageNo=0&pageSize=100`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getPeril(code: any): Observable<Peril>{
      return this.api.GET<Peril>(`perils/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createPeril(data:Peril[]) {
      console.log(JSON.stringify(data))
      return this.api.POST<Peril[]>(`perils`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      } 
      updatePeril(data:Peril,id:any){
        console.log(JSON.stringify(data))
        return this.api.PUT<Peril>(`perils/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deletePeril(id:any){
        return this.api.DELETE<Peril>(`perils/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
}
