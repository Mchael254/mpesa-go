import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ContractNamesService {
  constructor(
    private http: HttpClient,
    private appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    private api:ApiService
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
  getContractNames(agentCode:any,binderType:any,productCode:any): Observable<any[]>{
    let page = 0;
    let size = 100
   
    const params = new HttpParams()
    .set('page', `${page}`)
      .set('pageSize', `${size}`)
    return this.api.GET<any[]>(
      `contract-names?agentCode=${agentCode}&binderType=${binderType}&prodCode=${productCode}`,
     API_CONFIG.GIS_UNDERWRITING_BASE_URL,
     params
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
}
