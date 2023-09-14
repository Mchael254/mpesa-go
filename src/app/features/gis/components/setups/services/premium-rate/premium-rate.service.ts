import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Premiums } from '../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class PremiumRateService {
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


  getAllPremiums(sectionCode: number,binderCode:number,subClassCode:number):Observable<any>{
    let page = 0;
    let size = 20;
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
      var url = `/${this.baseurl}/${this.setupsbaseurl}/premium-rates`
      if ( sectionCode != undefined && binderCode !=undefined && subClassCode !=undefined) {
        url = url + "?sectionCode=" + sectionCode+"&binderCode="+binderCode+"&subClassCode="+subClassCode;
      }
    return this.http.get(url,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  
  getPremiums(code:any):Observable<Premiums[]>{
    return this.http.get<Premiums[]>(`/${this.baseurl}/${this.setupsbaseurl}/premium-rates/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createPremium(data:Premiums[]) {
    console.log(JSON.stringify(data))
    return this.http.post<Premiums[]>(`/${this.baseurl}/${this.setupsbaseurl}/premium-rates`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updatePremium(data:Premiums,id:any): Observable<Premiums> {
      console.log(JSON.stringify(data))
      return this.http.put<Premiums>(`/${this.baseurl}/${this.setupsbaseurl}/premium-rates/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
    deletePremium(id:any){
      return this.http.delete<Premiums>(`/${this.baseurl}/${this.setupsbaseurl}/premium-rates/${id}`)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }
}
