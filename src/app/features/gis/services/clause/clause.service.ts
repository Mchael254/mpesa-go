import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, retry, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {
  Clause,
  Clauses,
  coverType,
  subclassClauses, SubclassCoverTypeClause, subClassCoverTypeDto,
  subclassCoverTypeToClauses,
  Subclasses
} from "../../components/setups/data/gisDTO";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
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
    return this.http.get<Clauses>(`/${this.baseurl}/${this.setupsbaseurl}/clauses?pageNo=0&pageSize=1000`).pipe(
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

  /* SUBCLASSES SETUPS */

  getAllSubclasses(): Observable<Subclasses[]>{
    let page = 0;
    let size = 100;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.http.get<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`,{
      params:params,
      headers:headers
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getSubclasses(code: any): Observable<Subclasses>{
    return this.http.get<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createSubClass(data:Subclasses[]) {
    console.log(JSON.stringify(data))
    return this.http.post<Subclasses[]>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  updateSubClass(data:Subclasses,id:any){
    console.log(JSON.stringify(data))
    return this.http.put<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  deleteSubClass(id:any){
    return this.http.delete<Subclasses>(`/${this.baseurl}/${this.setupsbaseurl}/sub-classes/${id}`, this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  getAllSubclassClauses(){
    return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassClause(code, subCode):Observable<subclassClauses[]>{
    return this.http.get<subclassClauses[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses/${code}/${subCode}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  updateSubclassClause(data:subclassClauses,id:any, subClassCode:number): Observable<subclassClauses> {
    console.log(JSON.stringify(data))
    return this.http.put<subclassClauses>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses/${id}/${subClassCode}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  deleteSubclassClause(clauseCode:number, subClassCode:number): Observable<subclassClauses> {
    return this.http
      .delete<subclassClauses>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses/${clauseCode}/${subClassCode}`,
      this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  addSubclassClause(data:subclassClauses): Observable<subclassClauses> {
    console.log(JSON.stringify(data))
    return this.http.post<subclassClauses>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-clauses/`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
  getSingleSubclassCovertype(code: any){
    return this.http.get<coverType>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSubclassCovertypeBySCode(code: any): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/?pageNo=0&pageSize=100000&subClassCode=${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getCovertypeToClauses():Observable<subclassCoverTypeToClauses>{
    return this.http.get<subclassCoverTypeToClauses>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-clauses/`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createSubClassCoverTypeClause(data:SubclassCoverTypeClause[]) {
    return this.http.post<SubclassCoverTypeClause[]>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-clauses`,
      JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  deleteCovertypeToClauses(id:number):Observable<subclassCoverTypeToClauses>{
    return this.http.delete<subclassCoverTypeToClauses>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-covertype-to-clauses/${id}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  updateSubclassCoverType(data:subClassCoverTypeDto,id:any): Observable<subClassCoverTypeDto> {
    console.log(JSON.stringify(data))
    return this.http.put<subClassCoverTypeDto>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${id}`,
      JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  deleteSingleSubclassCovertype(id:any): Observable<subClassCoverTypeDto> {
    return this.http.put<subClassCoverTypeDto>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-cover-types/${id}`,
      this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }
}
