import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private api: ApiService) { }

  initiatePayment(paymentPayload): Observable<any> {
    return this.api.POST<any[]>(`v1/mpesa/initiate-payment-request`, JSON.stringify(paymentPayload), API_CONFIG.GIS_PAYMENT_BASE_URL)

  }
}
