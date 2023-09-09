import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { CoverType, CoverTypes, Sections } from '../../data/gisDTO';
import {AppConfigService} from "../../../../../../core/config/app-config-service";

@Injectable({
  providedIn: 'root'
})
export class CoverTypeService {

  baseurl = this.appConfig.config.contextPath.gis_services;
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


  getAllCovertypes(): Observable<CoverType>{
    let page = 0;
    let size = 1000
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',

      })
      const params = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${size}`)
      return this.http.get<CoverType>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types`,{
        headers:headers,
        params:params
      }).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  getCoverType(code: any): Observable<CoverTypes[]>{
    return this.http.get<CoverTypes[]>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createCover(data:CoverTypes[]) {
  console.log(JSON.stringify(data))
  return this.http.post<CoverTypes[]>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types`, JSON.stringify(data),this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  updateCover(data:CoverTypes,id:any): Observable<CoverTypes> {
    console.log(JSON.stringify(data))
    return this.http.put<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${id}`, JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  deleteCover(id:any){
    return this.http.delete<CoverTypes>(`/${this.baseurl}/${this.setupsbaseurl}/cover-types/${id}`)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getAllSections(
    page: number = 0,
    size: number = 1000
  ): Observable<Sections[]>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('pageSize', `${size}`)

    return this.http.get<Sections[]>(`/${this.baseurl}/${this.setupsbaseurl}/sections`,{
          headers:headers,
          params:params
        }).pipe(
          retry(1),
          catchError(this.errorHandl)
        )
  }

  getSections(): Observable<Sections[]> {
    return this.http.get<Sections[]>(`/${this.baseurl}/${this.setupsbaseurl}/sections1?pageNo=0&pageSize=10000`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getSectionId(code: any): Observable<Sections>{
    return this.http.get<Sections>(`/${this.baseurl}/${this.setupsbaseurl}/sections/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  saveSection(data: Sections, code:any): Observable<Sections> {
    return this.http.put<Sections>(`/${this.baseurl}/${this.setupsbaseurl}/sections/${code}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
    )
  }
  createSection(data: Sections): Observable<Sections>{
    return this.http.post<Sections>(`/${this.baseurl}/${this.setupsbaseurl}/sections`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
    )
  }
  deleteSection(code: any): Observable<Sections>{
    return this.http.delete<Sections>(`/${this.baseurl}/${this.setupsbaseurl}/sections/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
}
