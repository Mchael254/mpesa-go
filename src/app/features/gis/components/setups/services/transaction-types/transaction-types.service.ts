import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { TransactionType } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class TransactionTypesService {
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
    

  getAllTransactionTypes(): Observable<any>{
    let page = 0;
    let size = 10000
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/transaction-types`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
  getTransactionType(code: any): Observable<TransactionType[]>{
        
    return this.http.get<TransactionType[]>(`/${this.baseurl}/${this.setupsbaseurl}/transaction-types/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createTransactionType(data:TransactionType[]) {
    console.log(JSON.stringify(data))
    return this.http.post<TransactionType[]>(`/${this.baseurl}/${this.setupsbaseurl}/transaction-types`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateTransactionType(data:TransactionType,id:any): Observable<TransactionType> {
      console.log(JSON.stringify(data))
      return this.http.put<TransactionType>(`/${this.baseurl}/${this.setupsbaseurl}/transaction-types/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deleteTransactionType(id:any){
      return this.http.delete<TransactionType>(`/${this.baseurl}/${this.setupsbaseurl}/transaction-types/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
