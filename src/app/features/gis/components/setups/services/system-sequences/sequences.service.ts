import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { Sequence } from '../../data/gisDTO';
import { allocateform,changeForm } from '../../data/gisDTO';
@Injectable({
  providedIn: 'root'
})
export class SequenceService {

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

    getSequenceList (): Observable<Sequence>{

      return this.http.get<Sequence>(`/${this.baseurl}/${this.setupsbaseurl}/system-sequences`).pipe(
  
        retry(1),
        catchError(this.errorHandl)
      );
    }
    getSequenceByCode(code: number){
      return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/system-sequences/${code}`);
    }
    createSequence(data: Sequence): Observable<Sequence> {
      console.log(JSON.stringify(data))
      return this.http.post<Sequence>(`/${this.baseurl}/${this.setupsbaseurl}/system-sequences`, JSON.stringify(data), this.httpOptions)
        .pipe(
      )
    }
    allocate(code: any, data:any) {
  
      return this.http.post(`/${this.baseurl}/${this.setupsbaseurl}/system-sequences/${code}/allocate`, JSON.stringify(data), this.httpOptions)
        .pipe(
      )
    }
    change (code: any,data:changeForm): Observable<changeForm> {
      
      return this.http.put<changeForm>(`/${this.baseurl}/${this.setupsbaseurl}/system-sequences/${code}/change-next-number`, JSON.stringify(data), this.httpOptions)
        .pipe(
      )
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

}
