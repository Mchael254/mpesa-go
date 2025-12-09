import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from '../api/api.service';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { UtilService } from '../util/util.service';
import { throwError } from 'rxjs';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class TicketingService {

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private session_storage: SessionStorageService,
    private api: ApiService,
    private utilService: UtilService
  ) { }

  errorHandl(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client Error:', error.error.message);
    } else {
      // Server-side error
      console.error('Server Error:', error);
    }

    // ✅ Re-throw the original error object
    return throwError(() => error);
  }

  fetchTicketSummary(ticketAssignee: string, dateFrom?: string, dateTo?: string) {
    let params = new HttpParams().set('ticketAssignee', ticketAssignee);

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }

    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.api.GET<any>(
      `/v1/tickets/summary?${params.toString()}`,
      API_CONFIG.GIS_TICKETING_SERVICE
    );
  }

}
