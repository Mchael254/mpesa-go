import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../../app/core/config/app-config-service';
import { vehicleMake } from '../../data/gisDTO';
import { environment } from 'src/environments/environment';

import { SESSION_KEY } from '../../../../../../../app/features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../../app/features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../../app/shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleMakeService {
  // baseurl = this.appConfig.config.contextPath.gis_services;
  // crmurl = this.appConfig.config.contextPath.setup_services;
  // setupsbaseurl = "setups/api/v1"
  
  constructor(
    private http: HttpClient,
    public appConfig : AppConfigService,
    private session_storage: SessionStorageService,
    public api:ApiService
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
getAllVehicleMake(): Observable<vehicleMake[]>{
  let page = 0;
  let size = 1000
 const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),   
  })
  const params = new HttpParams()
  .set('page', `${page}`)
    .set('pageSize', `${size}`)
  return this.api.GET<vehicleMake[]>(`api/v1/vehicle-makes?page=${page}&pageSize=${size}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
    retry(1),
    catchError(this.errorHandl)
  ) 
}
}
