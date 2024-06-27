import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import {
  ClaimsPaymentModesDto,
  PaymentModesDto,
} from '../../../data/common/payment-modes-dto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class PaymentModesService {
  constructor(private api: ApiService) {}

  getPaymentModes(): Observable<PaymentModesDto[]> {
    const params = new HttpParams().set('organizationId', null);

    return this.api.GET<PaymentModesDto[]>(
      `payment-modes`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createPaymentMode(data: PaymentModesDto): Observable<PaymentModesDto> {
    return this.api.POST<PaymentModesDto>(
      `payment-modes`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updatePaymentMode(
    id: number,
    data: PaymentModesDto
  ): Observable<PaymentModesDto> {
    return this.api.PUT<PaymentModesDto>(
      `payment-modes/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deletePaymentMode(id: number) {
    return this.api.DELETE<PaymentModesDto>(
      `payment-modes/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getClaimsPaymentModes(): Observable<ClaimsPaymentModesDto[]> {
    const params = new HttpParams()
      // .set('organizationId', 2);

    return this.api.GET<ClaimsPaymentModesDto[]>(
      `claim-payment-modes`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createClaimsPaymentMode(
    data: ClaimsPaymentModesDto
  ): Observable<ClaimsPaymentModesDto> {
    return this.api.POST<ClaimsPaymentModesDto>(
      `claim-payment-modes`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateClaimsPaymentMode(
    id: number,
    data: ClaimsPaymentModesDto
  ): Observable<ClaimsPaymentModesDto> {
    return this.api.PUT<ClaimsPaymentModesDto>(
      `claim-payment-modes/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteClaimsPaymentMode(id: number) {
    return this.api.DELETE<ClaimsPaymentModesDto>(
      `claim-payment-modes/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
