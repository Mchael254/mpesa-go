import { Injectable } from '@angular/core';
import { shortPeriod } from '../../data/gisDTO';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
@Injectable({
  providedIn: 'root'
})
export class ShortPeriodService {
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

  

  getAllSPRates():Observable<any>{
    return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/short-period-rates`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSPRates(code:number):Observable<shortPeriod>{
    return this.http.get<shortPeriod>(`/${this.baseurl}/${this.setupsbaseurl}/short-period-rates/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createSPRates(data:shortPeriod[]) {
    console.log(JSON.stringify(data))
    return this.http.post<shortPeriod[]>(`/${this.baseurl}/${this.setupsbaseurl}/short-period-rates`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateSPRates(data:shortPeriod,id:any){
      console.log(JSON.stringify(data))
      return this.http.put<shortPeriod>(`/${this.baseurl}/${this.setupsbaseurl}/short-period-rates/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteSPRates(id:number){
      return this.http.delete<shortPeriod>(`/${this.baseurl}/${this.setupsbaseurl}/short-period-rates/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
