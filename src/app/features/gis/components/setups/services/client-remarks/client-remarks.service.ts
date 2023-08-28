import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ClientRemarks, Clients, Agents } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class ClientRemarksService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
  setupsbaseurl = "setups/api/v1"
  
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService
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
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/client-remarks`,{
      headers:headers
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }

  getClientRemarks(code: any): Observable<ClientRemarks[]>{
  
    return this.http.get<ClientRemarks[]>(`/${this.baseurl}/${this.setupsbaseurl}/client-remarks/${code}`).pipe(
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
    return this.http.get<any>(`/${this.crmurl}/accounts/clients`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }

  getClient(code: any): Observable<Clients[]>{
  
    return this.http.get<Clients[]>(`/${this.crmurl}/accounts/clients/${code}`).pipe(
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
    return this.http.get<any>(`/${this.crmurl}/accounts/agents`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
  getAgent(code: any): Observable<Agents[]>{
  
    return this.http.get<Agents[]>(`/${this.crmurl}/accounts/clients/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createRemark(data:ClientRemarks[]) {
    console.log(JSON.stringify(data))
    return this.http.post<ClientRemarks[]>(`/${this.baseurl}/${this.setupsbaseurl}/client-remarks`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 

    updateRemark(data:ClientRemarks,id:any): Observable<ClientRemarks> {
      console.log(JSON.stringify(data))
      return this.http.put<ClientRemarks>(`/${this.baseurl}/${this.setupsbaseurl}/client-remarks/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

    deleteRemark(id:any){
      return this.http.delete<ClientRemarks>(`/${this.baseurl}/${this.setupsbaseurl}/client-remarks/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

}
