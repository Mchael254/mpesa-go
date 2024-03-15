import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "../../../../../environments/environment";
import {ClaimsPaymentModesDto, PaymentModesDto} from "../../../data/common/payment-modes-dto";
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { SessionStorageService } from '../../session-storage/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentModesService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient, private session_storage: SessionStorageService) {}

  getPaymentModes(): Observable<PaymentModesDto[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    const params = new HttpParams().set('organizationId', 2);

    return this.http.get<PaymentModesDto[]>(`/${this.baseUrl}/setups/payment-modes`, {
      headers: header,
      params: params,
    });
  }

  createPaymentMode(data: PaymentModesDto): Observable<PaymentModesDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PaymentModesDto>(
      `/${this.baseUrl}/setups/payment-modes`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updatePaymentMode(id: number, data: PaymentModesDto): Observable<PaymentModesDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PaymentModesDto>(
      `/${this.baseUrl}/setups/payment-modes/${id}`,
      data,
      { headers: headers }
    );
  }

  deletePaymentMode(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<PaymentModesDto>(
      `/${this.baseUrl}/setups/payment-modes/${id}`,
      { headers: headers }
    );
  }

  getClaimsPaymentModes(): Observable<ClaimsPaymentModesDto[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    const params = new HttpParams().set('organizationId', 2);

    return this.http.get<ClaimsPaymentModesDto[]>(`/${this.baseUrl}/setups/claim-payment-modes`, {
      headers: header,
      params: params,
    });
  }

  createClaimsPaymentMode(data: ClaimsPaymentModesDto): Observable<ClaimsPaymentModesDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<ClaimsPaymentModesDto>(
      `/${this.baseUrl}/setups/claim-payment-modes`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateClaimsPaymentMode(id: number, data: ClaimsPaymentModesDto): Observable<ClaimsPaymentModesDto> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<ClaimsPaymentModesDto>(
      `/${this.baseUrl}/setups/claim-payment-modes/${id}`,
      data,
      { headers: headers }
    );
  }

  deleteClaimsPaymentMode(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<ClaimsPaymentModesDto>(
      `/${this.baseUrl}/setups/claim-payment-modes/${id}`,
      { headers: headers }
    );
  }
}
