import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {environment} from "../../../../../environments/environment";
import {PaymentModesDto} from "../../../data/common/payment-modes-dto";
import {BankDTO, BankRegionDTO} from "../../../data/common/bank-dto";

@Injectable({
  providedIn: 'root'
})
export class PaymentModesService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  getPaymentModes(): Observable<PaymentModesDto[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-TenantId': environment.TENANT_ID,
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
}
