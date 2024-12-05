import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Clauses, Subclasses, subclassClauses } from '../../data/gisDTO';
import { environment } from '../../../../../../../environments/environment';
import { SESSION_KEY } from '../../../../../../../app/features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../../app/features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../../app/shared/services/api/api.service';
@Injectable({
  providedIn: 'root'
})
export class SubclassesService {

  // baseurl = this.appConfig.config.contextPath.gis_services;
  // crmurl = this.appConfig.config.contextPath.setup_services;
  // setupsbaseurl = "setups/api/v1"
  
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    public api:ApiService
    ) { }

    httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

      
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
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  
  })
  // const params = new HttpParams()
  // .set('page', `${page}`)
  // .set('pageSize', `${size}`)
  return this.api.GET<Subclasses[]>(`api/v1/sub-classes?page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}

getSubclasses(code: any): Observable<Subclasses>{
  return this.api.GET<Subclasses>(`api/v1/sub-classes/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
createSubClass(data:Subclasses[]) {
  console.log(JSON.stringify(data))
  return this.api.POST<Subclasses[]>(`api/v1/sub-classes`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  } 
  updateSubClass(data:Subclasses,id:any){
    console.log(JSON.stringify(data))
    return this.api.PUT<Subclasses>(`api/v1/sub-classes/${id}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  deleteSubClass(id:any){
    return this.api.DELETE<Subclasses>(`api/v1/sub-classes/${id}`, API_CONFIG.GIS_SETUPS_BASE_URL)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassSectionBySCode(code: any): Observable<any>{
    return this.api.GET<any>(`api/v1/subclass-sections?pageNo=0&pageSize=1000000&subclassCode=${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassClauses(code:any):Observable<subclassClauses[]>{
    let page = 0;
    let size = 1000;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<subclassClauses[]>(`api/v1/subclass-clauses?subclassCode=${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )  }
    getAllClauses():Observable<Clauses>{
      let page = 0;
      let size = 1000;
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

      
      })
      const params = new HttpParams()
      .set('page', `${page}`)
        .set('pageSize', `${size}`)
      return this.api.GET<Clauses>(`api/v1/clauses?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )  }
}
