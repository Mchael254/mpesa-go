import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { Policy } from '../data/policy-dto';
@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    private api: ApiService
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
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  createPolicy(data: Policy, user) {
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`/v1/policies?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicy(batchNo: number) {
      return this.api.GET(`/v2/policies?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
    
  }

}
