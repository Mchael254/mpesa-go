import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  CurrencyDTO,
  CurrencyDenominationDTO,
  CurrencyRateDTO,
} from '../../../../shared/data/common/currency-dto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

/**
 * This service is used to handle currency related operations
 */
@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private api: ApiService) {}

  /**
   * Get all currencies
   * @returns all currencies
   */
  getAllCurrencies() {
    return this.api
      .GET<any>(`currencies`, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
      .pipe(retry(1));
  }

  getCurrencies(): Observable<CurrencyDTO[]> {
    return this.api.GET<CurrencyDTO[]>(
      `currencies`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getCurrencybyId(currencyId): Observable<CurrencyDTO>{
    return this.api.GET<CurrencyDTO>(`currencies/${currencyId}`,API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }
  createCurrency(data: CurrencyDTO): Observable<CurrencyDTO> {
    return this.api.POST<CurrencyDTO>(
      `currencies`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateCurrency(
    currencyId: number,
    data: CurrencyDTO
  ): Observable<CurrencyDTO> {
    return this.api.PUT<CurrencyDTO>(
      `currencies/${currencyId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteCurrency(currencyId: number) {
    return this.api.DELETE<CurrencyDTO>(
      `currencies/${currencyId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getCurrenciesRate(
    baseCurrencyId: number,
    organizationId?: number
  ): Observable<CurrencyRateDTO[]> {
    let params = new HttpParams().set('baseCurrencyId', `${baseCurrencyId}`);

    // Add organizationId to params if provided
    if (organizationId !== undefined && organizationId !== null) {
      params = params.set('organizationId', `${organizationId}`);
    }

    return this.api.GET<CurrencyRateDTO[]>(
      `currency-rates`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createCurrencyRate(data: CurrencyRateDTO): Observable<CurrencyRateDTO> {
    return this.api.POST<CurrencyRateDTO>(
      `currency-rates`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateCurrencyRate(
    currencyRateId: number,
    data: CurrencyRateDTO
  ): Observable<CurrencyRateDTO> {
    return this.api.PUT<CurrencyRateDTO>(
      `currency-rates/${currencyRateId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteCurrencyRate(currencyRateId: number) {
    return this.api.DELETE<CurrencyRateDTO>(
      `currency-rates/${currencyRateId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getCurrenciesDenomination(
    currencyId: number
  ): Observable<CurrencyDenominationDTO[]> {
    const params = new HttpParams().set('currencyId', `${currencyId}`);

    return this.api.GET<CurrencyDenominationDTO[]>(
      `currency-denominations`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createCurrencyDenomination(
    data: CurrencyDenominationDTO
  ): Observable<CurrencyDenominationDTO> {
    return this.api.POST<CurrencyDenominationDTO>(
      `currency-denominations`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateCurrencyDenomination(
    currencyDenominationId: number,
    data: CurrencyDenominationDTO
  ): Observable<CurrencyDenominationDTO> {
    return this.api.PUT<CurrencyDenominationDTO>(
      `currency-denominations/${currencyDenominationId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteCurrencyDenomination(currencyDenominationId: number) {
    return this.api.DELETE<CurrencyDenominationDTO>(
      `currency-denominations/${currencyDenominationId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
