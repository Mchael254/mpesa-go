import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Premiums } from '../../data/gisDTO';
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class PremiumRateService {
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


  getAllPremiums(sectionCode: number,binderCode:number,subClassCode:number):Observable<any>{
    let page = 0;
    let size = 20;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
      var url = `api/v1/premium-rates?`
      if ( sectionCode != undefined && binderCode !=undefined && subClassCode !=undefined) {
        url = url + "?sectionCode=" + sectionCode+"&binderCode="+binderCode+"&subClassCode="+subClassCode;
      }
    return this.api.GET(url,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getPremiums(code:any):Observable<Premiums[]>{
    return this.api.GET<Premiums[]>(`api/v1/premium-rates/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createPremium(data:Premiums[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<Premiums[]>(`api/v1/premium-rates`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    updatePremium(data:Premiums,id:any): Observable<Premiums> {
      console.log(JSON.stringify(data))
      return this.api.PUT<Premiums>(`api/v1/premium-rates/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deletePremium(id:any){
      return this.api.DELETE<Premiums>(`api/v1/premium-rates/${id}`,API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
