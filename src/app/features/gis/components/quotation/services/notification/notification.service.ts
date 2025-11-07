import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, retry, catchError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { EmailDto, SmsDto, WhatsappDto } from 'src/app/shared/data/common/email-dto';
import { UtilService } from 'src/app/shared/services';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


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


  sendEmail(data: EmailDto): Observable<any> {
    return this.api.POST<any>(`email/send`, JSON.stringify(data), API_CONFIG.NOTIFICATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  sendWhatsapp(data: WhatsappDto): Observable<any> {
    return this.api.POST<any>(`whatsapp/messages`, JSON.stringify(data), API_CONFIG.NOTIFICATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  sendSms(data: SmsDto): Observable<any> {
  return this.api.POST<any>(
    `api/v2/sms/send`,
    JSON.stringify(data),
    API_CONFIG.NOTIFICATION_BASE_URL
  ).pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}

}
