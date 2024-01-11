import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  BankBranchDTO,
  BankDTO,
  BankRegionDTO,
  CurrencyDTO,
  FundSourceDTO,
} from '../../../data/common/bank-dto';
import { Logger } from '../../logger/logger.service';

const log = new Logger('BankService');

/**
 * This service is used to handle bank related operations
 */
@Injectable({
  providedIn: 'root',
})
export class BankService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Get all banks
   * @param countryId country id
   * @returns {Observable<BankDTO[]>} all banks for a given country
   */
  getBanks(countryId: number): Observable<BankDTO[]> {
    log.info('Fetching Banks');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('countryId', `${countryId}`);

    return this.http.get<BankDTO[]>(`/${this.baseUrl}/setups/banks`, {
      headers: header,
      params: params,
    });
  }

  /**
   * Get all bank branches
   * @returns {Observable<BankBranchDTO[]>} all bank branches
   */
  getBankBranch(): Observable<BankBranchDTO[]> {
    log.info('Fetching Bank Branches');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<BankBranchDTO[]>(
      `/${this.baseUrl}/setups/bank-branches`,
      { headers: header }
    );
  }

  getBankBranchById(id: any): Observable<BankBranchDTO[]> {
    log.info('Fetching Bank Branches');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('bankId', `${id}`);

    return this.http.get<BankBranchDTO[]>(
      `/${this.baseUrl}/setups/bank-branches`,
      { headers: header, params: params }
    );
  }

  /**
   * Get all bank branches by bank id
   * @param bankId Bank Id
   * @returns {Observable<BankBranchDTO[]>} all bank branches for a given bank id
   */
  getBankBranchesByBankId(bankId: number): Observable<BankBranchDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<BankBranchDTO[]>(
      `/${this.baseUrl}/setups/banks/${bankId}/branches`,
      { headers: header }
    );
  }

  /**
   * Get all bank branches by bank id
   * @param bankId Bank Id
   * @returns {Observable<BankBranchDTO[]>} all bank branches for a given bank id
   */
  getBankBranchListByBankId(bankId: number): Observable<BankBranchDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('bankId', `${bankId}`);

    return this.http.get<BankBranchDTO[]>(
      `/${this.baseUrl}/setups/bank-branches`,
      { headers: header, params: params }
    );
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

  /**
   * Get all source of funds
   * @returns {Observable<FundSourceDTO[]>} all source of funds
   */
  getFundSource(): Observable<FundSourceDTO[]> {
    log.info('Fetching Source of Funds');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<FundSourceDTO[]>(
      `/${this.baseUrl}/setups/source-of-funds`,
      { headers: header }
    );
  }

  getBankRegion(regionCode: number): Observable<BankRegionDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('regionCode', `${regionCode}`);
    return this.http.get<BankRegionDTO[]>(
      `/${this.baseUrl}/setups/bank-regions`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createBankRegion(data: BankRegionDTO): Observable<BankRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BankRegionDTO>(
      `/${this.baseUrl}/setups/bank-regions`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateBankRegion(id: number, data: BankRegionDTO): Observable<BankRegionDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<BankRegionDTO>(
      `/${this.baseUrl}/setups/bank-regions/${id}`,
      data,
      { headers: headers }
    );
  }

  deleteBankRegion(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BankRegionDTO>(
      `/${this.baseUrl}/setups/bank-regions/${id}`,
      { headers: headers }
    );
  }

  createBank(
    data: BankDTO
  ): Observable<BankDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BankDTO>(
      `/${this.baseUrl}/setups/banks`,
      JSON.stringify(data),
      { headers: headers }
    );
  }
}
