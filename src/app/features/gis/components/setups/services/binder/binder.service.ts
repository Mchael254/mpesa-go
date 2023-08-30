import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, retry, catchError, Observable } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { Binders } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class BinderService {

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
getAllBinders(){
  return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/binders`).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
getBinders(code:any):Observable<Binders[]>{
  return this.http.get<Binders[]>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${code}`).pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
createBinders(data:Binders[]) {
  console.log(JSON.stringify(data))
  return this.http.post<Binders[]>(`/${this.baseurl}/${this.setupsbaseurl}/binders`, JSON.stringify(data),this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  } 
updateBinders(data:Binders,id:any): Observable<Binders> {
  console.log(JSON.stringify(data))
  return this.http.put<Binders>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${id}`, JSON.stringify(data), this.httpOptions)
  .pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
deleteBinders(id:any){
  return this.http.delete<Binders>(`/${this.baseurl}/${this.setupsbaseurl}/binders/${id}`)
  .pipe(
    retry(1),
    catchError(this.errorHandl)
  )
}
}
