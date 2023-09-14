import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, catchError, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { TaxRates } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class TaxRatesService {
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
    
   /********Tax Rates ******/
  
   getAllTaxRates(): Observable<any>{
    let page = 0;
    let size = 1000
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/tax-rates`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
  getTaxRates(code: any): Observable<TaxRates[]>{

    return this.http.get<TaxRates[]>(`/${this.baseurl}/${this.setupsbaseurl}/tax-rates/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createTaxRate(data:TaxRates[]) {
    console.log(JSON.stringify(data))
    return this.http.post<TaxRates[]>(`/${this.baseurl}/${this.setupsbaseurl}/tax-rates`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateTaxRate(data:TaxRates,id:any): Observable<TaxRates> {
      console.log(JSON.stringify(data))
      return this.http.put<TaxRates>(`/${this.baseurl}/${this.setupsbaseurl}/tax-rates/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteTaxRate(id:any){
      return this.http.delete<TaxRates>(`/${this.baseurl}/${this.setupsbaseurl}/tax-rates/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
