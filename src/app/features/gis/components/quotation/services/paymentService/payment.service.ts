import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private api: ApiService, private appConfig: AppConfigService, private http:HttpClient) { }
   paymentUrl = this.appConfig.config.contextPath.fms_payments_service;

  initiatePayment(paymentPayload): Observable<any> {
    return this.http.post<any[]>(`/${this.paymentUrl}/api/v1/mpesa/initiate-payment-request`, paymentPayload)
  }
}
