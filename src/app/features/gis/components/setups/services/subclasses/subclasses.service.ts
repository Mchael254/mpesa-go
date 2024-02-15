import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Clauses, Subclasses, subclassClauses } from '../../data/gisDTO';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubclassesService {

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
        'X-TenantId': environment.TENANT_ID

      
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

getAllSubclasses(): Observable<Subclasses[]>{
  let page = 0;
  let size = 100;
const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': environment.TENANT_ID,
  
  })
  const params = new HttpParams()
  .set('page', `${page}`)
  .set('pageSize', `${size}`)
  return this.http.get<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`,{
    params:params,
    headers:headers
  }).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}

getSubclasses(code: any): Observable<Subclasses>{
  return this.http.get<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${code}`).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
createSubClass(data:Subclasses[]) {
  console.log(JSON.stringify(data))
  return this.http.post<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`, JSON.stringify(data),this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  } 
  updateSubClass(data:Subclasses,id:any){
    console.log(JSON.stringify(data))
    return this.http.put<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  deleteSubClass(id:any){
    return this.http.delete<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassSectionBySCode(code: any): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections?pageNo=0&pageSize=1000000&subclassCode=${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassClauses():Observable<subclassClauses[]>{
    let page = 0;
    let size = 1000;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.http.get<subclassClauses[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses`, {
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )  }
    getAllClauses():Observable<Clauses>{
      let page = 0;
      let size = 1000;
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantId': environment.TENANT_ID

      
      })
      const params = new HttpParams()
      .set('page', `${page}`)
        .set('pageSize', `${size}`)
      return this.http.get<Clauses>(`/${this.baseurl}/${this.setupsbaseurl}/clauses`, {
        headers:headers,
        params:params
      }).pipe(
        retry(1),
        catchError(this.errorHandl)
      )  }
}
