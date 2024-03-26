import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {Observable, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {Subclass, SubclassesDTO} from "../../data/gisDTO";
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
@Injectable({
  providedIn: 'root'
})
export class ProductSubclassService {
  baseurl = this.appConfig.config.contextPath.gis_services;
  crmurl = this.appConfig.config.contextPath.setup_services;
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
   * Update a subclass
   * @param data
   * @param code of type number
   * @return of type Observable<SubclassesDTO>
   */
  updateSubclass(data:any,code:number): Observable<SubclassesDTO> {
    console.log(JSON.stringify(data))
    return this.api.PUT<SubclassesDTO>(`product-subclasses/${code}`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  /**
   * Delete a subclass
   * @param code of type number which is the product subclass code
   */
  deleteSubclass(code: any): Observable<SubclassesDTO>{
    return this.api.DELETE<SubclassesDTO>(`product-subclasses/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  /**
   * Create a subclass
   * @param data of type Subclass
   * @returns Observable of type Subclass
   */
  createSubclasses(data: Subclass): Observable<Subclass> {
    console.log(JSON.stringify(data))
    return this.api.POST<Subclass>(`product-subclasses`, JSON.stringify(data), API_CONFIG.GIS_SETUPS_BASE_URL)
      .pipe(
      )
  }
}
