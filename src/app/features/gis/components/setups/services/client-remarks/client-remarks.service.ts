import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { ClientRemarks, Clients, Agents } from '../../data/gisDTO';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ClientRemarksService {
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
  /********Client Remark ******/
  getAllClientRemarks(): Observable<any>{
    let page = 0;
    let size = 10
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<any>(`client-remarks`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getClientRemarks(code: any): Observable<ClientRemarks[]>{

    return this.api.GET<ClientRemarks[]>(`client-remarks/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  /*******All Clients ******/
  getAllClients(): Observable<any>{
    let page = 0;
    let size = 10;
    let org = 2;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
      .set('organizationId',`${org}`)
    return this.api.GET<any>(`clients`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getClient(code: any): Observable<Clients[]>{

    return this.api.GET<Clients[]>(`clients/${code}`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

   /*******All Agents ******/
   getAllAgents(): Observable<any>{
    let page = 0;
    let size = 10;
    let org = 2;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
      .set('organizationId',`${org}`)
    return this.api.GET<any>(`agents`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getAgent(code: any): Observable<Agents[]>{

    return this.api.GET<Agents[]>(`clients/${code}`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createRemark(data:ClientRemarks[]) {
    console.log(JSON.stringify(data))
    return this.api.POST<ClientRemarks[]>(`/client-remarks`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    updateRemark(data:ClientRemarks,id:any): Observable<ClientRemarks> {
      console.log(JSON.stringify(data))
      return this.api.PUT<ClientRemarks>(`client-remarks/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    deleteRemark(id:any){
      return this.api.DELETE<ClientRemarks>(`client-remarks/${id}`,API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
     /*******All Claims ******/
     getAllClaims(): Observable<any>{
      let page = 0;
      let size = 10;
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',

      })
      const params = new HttpParams()
      .set('page', `${page}`)
        .set('pageSize', `${size}`)
      return this.api.GET<any>(`agents?page=${page}&pageSize=${size}`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

}
