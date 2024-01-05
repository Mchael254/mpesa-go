import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Logger } from '../../logger/logger.service';
import {
  CurrencyDTO,
  CurrencyDenominationDTO,
  CurrencyRateDTO,
} from '../../../../shared/data/common/currency-dto';

const log = new Logger('CurrencyService');

/**
 * This service is used to handle currency related operations
 */
@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Get all currencies
   * @returns all currencies
   */
  getAllCurrencies() {
    const headers = new HttpHeaders({
      'X-TenantId': environment.TENANT_ID,
    });
    return this.http
      .get<any>(`/${this.baseUrl}/setups/currencies`, { headers })
      .pipe(retry(1));
  }

  getCurrencies(): Observable<CurrencyDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<CurrencyDTO[]>(`/${this.baseUrl}/setups/currencies`, {
      headers: header,
    });
  }

  createCurrency(data: CurrencyDTO): Observable<CurrencyDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<CurrencyDTO>(
      `/${this.baseUrl}/setups/currencies`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateCurrency(
    currencyId: number,
    data: CurrencyDTO
  ): Observable<CurrencyDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<CurrencyDTO>(
      `/${this.baseUrl}/setups/currencies/${currencyId}`,
      data,
      { headers: headers }
    );
  }

  deleteCurrency(currencyId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<CurrencyDTO>(
      `/${this.baseUrl}/setups/currencies/${currencyId}`,
      { headers: headers }
    );
  }

  // getCurrenciesRate(baseCurrencyId: number): Observable<CurrencyRateDTO[]> {
  //   const header = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   });
  //   const params = new HttpParams().set('baseCurrencyId', `${baseCurrencyId}`);

  //   return this.http.get<CurrencyRateDTO[]>(
  //     `/${this.baseUrl}/setups/currency-rates`,
  //     { headers: header, params: params }
  //   );
  // }

  getCurrenciesRate(
    baseCurrencyId: number,
    organizationId?: number
  ): Observable<CurrencyRateDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    let params = new HttpParams().set('baseCurrencyId', `${baseCurrencyId}`);

    // Add organizationId to params if provided
    if (organizationId !== undefined && organizationId !== null) {
      params = params.set('organizationId', `${organizationId}`);
    }

    return this.http.get<CurrencyRateDTO[]>(
      `/${this.baseUrl}/setups/currency-rates`,
      { headers: header, params: params }
    );
  }

  createCurrencyRate(data: CurrencyRateDTO): Observable<CurrencyRateDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<CurrencyRateDTO>(
      `/${this.baseUrl}/setups/currency-rates`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateCurrencyRate(
    currencyRateId: number,
    data: CurrencyRateDTO
  ): Observable<CurrencyRateDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<CurrencyRateDTO>(
      `/${this.baseUrl}/setups/currency-rates/${currencyRateId}`,
      data,
      { headers: headers }
    );
  }

  deleteCurrencyRate(currencyRateId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<CurrencyRateDTO>(
      `/${this.baseUrl}/setups/currency-rates/${currencyRateId}`,
      { headers: headers }
    );
  }

  getCurrenciesDenomination(
    currencyId: number
  ): Observable<CurrencyDenominationDTO[]> {
    log.info('Fetching Source of Funds');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('currencyId', `${currencyId}`);

    return this.http.get<CurrencyDenominationDTO[]>(
      `/${this.baseUrl}/setups/currency-denominations`,
      { headers: header, params: params }
    );
  }

  createCurrencyDenomination(
    data: CurrencyDenominationDTO
  ): Observable<CurrencyDenominationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<CurrencyDenominationDTO>(
      `/${this.baseUrl}/setups/currency-denominations`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateCurrencyDenomination(
    currencyDenominationId: number,
    data: CurrencyDenominationDTO
  ): Observable<CurrencyDenominationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<CurrencyDenominationDTO>(
      `/${this.baseUrl}/setups/currency-rates/${currencyDenominationId}`,
      data,
      { headers: headers }
    );
  }

  deleteCurrencyDenomination(currencyDenominationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<CurrencyDenominationDTO>(
      `/${this.baseUrl}/setups/currency-rates/${currencyDenominationId}`,
      { headers: headers }
    );
  }
}
