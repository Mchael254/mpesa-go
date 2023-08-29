import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {subSections} from "../../data/gisDTO";

@Injectable({
  providedIn: 'root'
})
export class SubClassSectionsService {

  // private subSecArray = new BehaviorSubject<any[]>([]);
  private filteredArray = new BehaviorSubject<any[]>([]);
  private subSecArray = new BehaviorSubject<any[]>([]);

  baseurl = this.appConfig.config.contextPath.gis_services;
  setupsbaseurl = "setups/api/v1"

  constructor(private http: HttpClient,
              public appConfig : AppConfigService) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }

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

  /**
   * Get all subclass sections by subclass section code
   * @param subClassCode Subclass code
   */
  getSubclassSectionBySCode(subClassCode: any): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections?pageNo=0&pageSize=1000000&subclassCode=${subClassCode}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Get a single subclass section
   * @param subClassSectionCode of type number
   */
  getSingleSubSection(subClassSectionCode: number): Observable<any>{
    return this.http.get<any>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections/${subClassSectionCode}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Create a subclass sections
   * @param data of type subSections
   * @returns Observable of type subSections
   */
  createSubSections(data: subSections): Observable<subSections>{
    return this.http.post<subSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }


  /**
   * Update a subclass section
   * @param data of type subSections
   * @param subClassSectionCode of type number
   */
  updatesubSection(data: subSections, subClassSectionCode:number): Observable<subSections> {
    console.log(JSON.stringify(data))
    return this.http.put<subSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections/${subClassSectionCode}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }


  /**
   * Delete a subclass section
   * @param subClassSectionCode of type number
   */
  deleteSubclassSection(subClassSectionCode: any): Observable<subSections>{
    return this.http.delete<subSections>(`/${this.baseurl}/${this.setupsbaseurl}/subclass-sections/${subClassSectionCode}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Set the filtered array value
   * @param value
   */
  setFilteredArray(value: any[]) {
    this.filteredArray.next(value);
  }

  /**
   * Get the filtered array value
   */
  getFilteredArray(){
    return this.filteredArray.asObservable();
  }

  /**
   * Set the subSecArray value
   * @param value
   */
  setsubSecArray(value: any[]) {
    this.subSecArray.next(value);
  }

  /**
   * Get the subSecArray value
   */
  getsubSecArray(){
    return this.subSecArray.asObservable();
  }

}
