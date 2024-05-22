import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { QuakeZone } from '../../../data/gisDTO';

@Injectable({
  providedIn: 'root'
})
export class QuakeZonesService {

  constructor(private http: HttpClient,
    public appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    public api: ApiService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

    })
  }

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
  getQuakeZone(): Observable<QuakeZone[]> {
    let page = 0;
    let size = 1000;
    return this.api.GET<QuakeZone[]>(`api/v1/quake-zones?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
}
