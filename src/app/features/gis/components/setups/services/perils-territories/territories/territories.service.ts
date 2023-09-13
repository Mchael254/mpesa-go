import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, concatMap } from 'rxjs/operators';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
import { territories } from '../../../data/gisDTO';
@Injectable({
  providedIn: 'root'
})
export class TerritoriesService {

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
   /*TERRITORIES*/

   getAllTerritories():Observable<any>{
    return this.http.get(`/${this.baseurl}/${this.setupsbaseurl}/territories`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getTerritory(code:number):Observable<territories>{
    return this.http.get<territories>(`/${this.baseurl}/${this.setupsbaseurl}/territories/${code}`).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  createTerritory(data:territories[]) {
    console.log(JSON.stringify(data))
    return this.http.post<territories[]>(`/${this.baseurl}/${this.setupsbaseurl}/territories`, JSON.stringify(data),this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    } 
    updateTerritory(data:territories,id:any){
      console.log(JSON.stringify(data))
      return this.http.put<territories>(`/${this.baseurl}/${this.setupsbaseurl}/territories/${id}`, JSON.stringify(data), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
    }

}
