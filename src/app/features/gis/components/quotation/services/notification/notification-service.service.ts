import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { EmailDto } from 'src/app/shared/data/common/email-dto';
import { UtilService } from 'src/app/shared/services';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class NotificationServiceService {

  /**
   * Constructor for QuotationService.
   * @constructor
   * @param {AppConfigService} appConfig - Service for retrieving application configuration.
   * @param {HttpClient} http - HTTP client for making requests.
   */
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private session_storage: SessionStorageService,
    private api: ApiService,
    private utilService: UtilService
  ) {
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
  
    sendEmail(data: EmailDto): Observable<any> {
      return this.api.POST<any>(`email/send`, JSON.stringify(data), API_CONFIG.NOTIFICATION_BASE_URL).pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  
  
    }
}
