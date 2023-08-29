import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { Peril } from '../../../data/gisDTO';
@Injectable({
  providedIn: 'root'
})
export class PerilsService {

 
  setupsbaseurl = "setups/api/v1"
  baseurl = this.appConfig.config.contextPath.gis_services;

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

    /* PERILS */
    getAllPerils(): Observable<Peril[]>{
      return this.http.get<Peril[]>(`/${this.baseurl}/${this.setupsbaseurl}/perils?pageNo=0&pageSize=100`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    getPeril(code: any): Observable<Peril>{
      return this.http.get<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${code}`).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    createPeril(data:Peril[]) {
      console.log(JSON.stringify(data))
      return this.http.post<Peril[]>(`/${this.baseurl}/${this.setupsbaseurl}/perils`, JSON.stringify(data),this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      } 
      updatePeril(data:Peril,id:any){
        console.log(JSON.stringify(data))
        return this.http.put<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${id}`, JSON.stringify(data), this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
      deletePeril(id:any){
        return this.http.delete<Peril>(`/${this.baseurl}/${this.setupsbaseurl}/perils/${id}`, this.httpOptions)
        .pipe(
          retry(1),
          catchError(this.errorHandl)
        )
      }
}
