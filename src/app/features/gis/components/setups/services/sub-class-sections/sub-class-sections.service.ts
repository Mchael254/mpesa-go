import {Injectable, signal} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {subSections} from "../../data/gisDTO";
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

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
              public appConfig : AppConfigService,
              public api:ApiService
              ) { }

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
    return this.api.GET<any>(`subclass-sections?pageNo=0&pageSize=1000000&subclassCode=${subClassCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Get a single subclass section
   * @param subClassSectionCode of type number
   */
  getSingleSubSection(subClassSectionCode: number): Observable<any>{
    return this.api.GET<any>(`subclass-sections/${subClassSectionCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
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
    return this.api.POST<subSections>(`subclass-sections`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
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
    return this.api.PUT<subSections>(`subclass-sections/${subClassSectionCode}`, JSON.stringify(data),API_CONFIG.GIS_SETUPS_BASE_URL)
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
    return this.api.DELETE<subSections>(`subclass-sections/${subClassSectionCode}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
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
