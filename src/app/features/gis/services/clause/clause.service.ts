import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Clause, Clauses} from "../../components/setups/data/gisDTO";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../core/config/app-config-service";

@Injectable({
  providedIn: 'root'
})
export class ClauseService {

  baseurl = this.appConfig.config.contextPath.gis_services;
  setupsbaseurl = "setups/api/v1";
  private clauseCode = new BehaviorSubject<any>("");

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

  getClauses(): Observable<Clauses> {
    return this.http.get<Clauses>(`/${this.baseurl}/${this.setupsbaseurl}/clauses?pageNo=0&pageSize=294`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSingleClause(code: any): Observable<Clauses>{
    return this.http.get<Clauses>(`/${this.baseurl}/${this.setupsbaseurl}/clauses/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createClause(data: Clause): Observable<Clause>{

    return this.http.post<Clause>(`/${this.baseurl}/${this.setupsbaseurl}/clauses`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  updateClause(data: Clause, code:any): Observable<Clause> {
    console.log(JSON.stringify(data))
    return this.http.put<Clause>(`/${this.baseurl}/${this.setupsbaseurl}/clauses/${code}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  reviseClause(data: Clause, code:any): Observable<Clause> {
    console.log(JSON.stringify(data))
    return this.http.post<Clause>(`/${this.baseurl}/${this.setupsbaseurl}/clauses/${code}/revise`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  deleteClause(code: any): Observable<Clause>{
    return this.http.delete<Clause>(`/${this.baseurl}/${this.setupsbaseurl}/clauses/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  /**SHARED METHODS UNDER CLAUSE SETUP */
  setClauseCode(code: any){
    this.clauseCode.next(code);
  }
  getClauseCode(){
    return this.clauseCode.asObservable();
  }
}
