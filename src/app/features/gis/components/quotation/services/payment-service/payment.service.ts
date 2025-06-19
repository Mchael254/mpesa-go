import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private api: ApiService) { }

  // Error handling
    errorHandle(error: HttpErrorResponse) {
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

  initiatePayment(paymentPayload): Observable<any> {
    return this.api.POST<any>('v1/mpesa/initiate-payment-request',
      JSON.stringify(paymentPayload), API_CONFIG.PAYMENT_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandle)
    )
  }
}
