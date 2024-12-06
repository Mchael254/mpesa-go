import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, retry, catchError, Observable } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Binder, Binders } from '../../data/gisDTO';
import { SESSION_KEY } from '../../../../../../features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class BinderService {

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

getAllBinders(){
  // return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/binders`).pipe(
  //   retry(1),
  //   catchError(this.errorHandl)
  // )
    return this.api.GET(`api/v1/binders`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  
  
}

 

getAllBindersQuotation(
  page: number,
  size: number,
  
): Observable<Binder[]> {
  // Create an object to hold parameters only if they are provided
  const paramsObj: { [param: string]: string } = {};
  // Add the mandatory parameter
  paramsObj['page'] = page.toString();
  paramsObj['size'] = size.toString();

  const params = new HttpParams({ fromObject: paramsObj });

  return this.api.GET<Binder[]>(`api/v1/binders`, API_CONFIG.GIS_SETUPS_BASE_URL, params);

}
// getAllBindersQuick(subclassCode):Observable<Binder>{
//   let page = 0;
//   let size = 1000;
//  const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
  
//   })
//   const params = new HttpParams()
//   .set('page', `${page}`)
//     .set('pageSize', `${size}`)
//   return this.http.get<Binder>(`/${this.baseurl}/${this.setupsbaseurl}/binders?subclassCode=${subclassCode}`,{
//     headers:headers,
//     params:params
//   }).pipe(
//     retry(1),
//     catchError(this.errorHandl)
//   )
// } 
getAllBindersQuick(
  subclassCode:any,
  page?: number,
  size?: number,
  
): Observable<Binder[]> {
  // Create an object to hold parameters only if they are provided
  const paramsObj: { [param: string]: string } = {};
      // Add optional parameters if provided
      if (page) {
        paramsObj['page'] = page.toString();
        
      }
      if (size) {
        paramsObj['size'] = size.toString();
      
      }
  // Add the mandatory parameter
  paramsObj['subclassCode'] = subclassCode.toString();

  const params = new HttpParams({ fromObject: paramsObj });

  return this.api.GET<Binder[]>(`api/v1/binders?`, API_CONFIG.GIS_SETUPS_BASE_URL, params);

}

getBinders(
code: any,  
): Observable<Binder[]> {
    // return this.http.get<Binders[]>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${code}`).pipe(
  //   retry(1),
  //   catchError(this.errorHandl)
  // )
  // Create an object to hold parameters only if they are provided

  const paramsObj: { [param: string]: string } = {};
  // Add the mandatory parameter
  paramsObj['code'] = code.toString();
 

  const params = new HttpParams({ fromObject: paramsObj });

  return this.api.GET<Binder[]>(`api/v1/binders?`, API_CONFIG.GIS_SETUPS_BASE_URL, params);
}
createBinders(data:Binders[]) {
  console.log(JSON.stringify(data))
  // return this.http.post<Binders[]>(`/${this.baseurl}/${this.setupsbaseurl}/binders`, JSON.stringify(data),this.httpOptions)
  //   .pipe(
  //     retry(1),
  //     catchError(this.errorHandl)
  //   )
    return this.api.POST<Binders[]>(`api/v1/binders`,JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  } 
updateBinders(data:Binders,id:any): Observable<Binders> {
  console.log(JSON.stringify(data))
  // return this.http.put<Binders>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${id}`, JSON.stringify(data), this.httpOptions)
  // .pipe(
    return this.api.PUT<Binders>(`api/v1/binders/${id}`,JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL).pipe(

    retry(1),
    catchError(this.errorHandl)
  )
}
deleteBinders(id:any){
  // return this.http.delete<Binders>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${id}`)
  // .pipe(
    return this.api.PUT<Binders>(`api/v1/binders/${id}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(

    retry(1),
    catchError(this.errorHandl)
  )
}
}
