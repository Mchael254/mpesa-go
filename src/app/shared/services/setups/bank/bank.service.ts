import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import {
  BankBranchDTO, BankChargeDTO,
  BankDTO,
  BankRegionDTO,
  CurrencyDTO,
  FundSourceDTO, POSTBankBranchDTO,
} from '../../../data/common/bank-dto';
import { Logger } from '../../logger/logger.service';
import {environment} from "../../../../../environments/environment";
// import { environment } from 'src/environments/environment';

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
      'X-TenantId': environment.TENANT_ID,
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
      'X-TenantId': environment.TENANT_ID,

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

  /**
   * The function `createBank` sends a POST request to create a new bank using the provided data.
   * @param {BankDTO} data - The `data` parameter is of type `BankDTO`, which is an object containing the information
   * needed to create a bank.
   * @returns an Observable of type BankDTO.
   */
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

  /**
   * The function `updateBank` sends a PUT request to update a bank record with the specified ID using the provided data.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank you want to
   * update in the system.
   * @param {BankDTO} data - The `data` parameter is of type `BankDTO`, which is an object containing the updated
   * information for a bank.
   * @returns an Observable of type BankDTO.
   */
  updateBank(id: number, data: BankDTO): Observable<BankDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<BankDTO>(
      `/${this.baseUrl}/setups/banks/${id}`,
      data,
      { headers: headers }
    );
  }

  /**
   * The `deleteBank` function sends an HTTP DELETE request to delete a bank with the specified ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank that you want to
   * delete.
   * @returns an HTTP DELETE request to delete a bank with the specified ID. The response is expected to be of type
   * `BankDTO`.
   */
  deleteBank(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BankDTO>(
      `/${this.baseUrl}/setups/banks/${id}`,
      { headers: headers }
    );
  }

  /**
   * The function `createBankBranch` sends a POST request to create a new bank branch using the provided data.
   * @param {POSTBankBranchDTO} data - The `data` parameter is of type `POSTBankBranchDTO`, which is an object containing
   * the information needed to create a bank branch.
   * @returns an Observable of type POSTBankBranchDTO.
   */
  createBankBranch(
    data: POSTBankBranchDTO
  ): Observable<POSTBankBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<POSTBankBranchDTO>(
      `/${this.baseUrl}/setups/bank-branches`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  /**
   * The function `updateBankBranch` sends a PUT request to update a bank branch with the specified ID using the provided
   * data.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank branch that
   * needs to be updated. It is used to identify the specific bank branch in the database.
   * @param {POSTBankBranchDTO} data - The `data` parameter is of type `POSTBankBranchDTO`, which is an object containing
   * the data to be updated for a bank branch.
   * @returns an Observable of type POSTBankBranchDTO.
   */
  updateBankBranch(id: number, data: POSTBankBranchDTO): Observable<POSTBankBranchDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<POSTBankBranchDTO>(
      `/${this.baseUrl}/setups/bank-branches/${id}`,
      data,
      { headers: headers }
    );
  }

  /**
   * The function `deleteBankBranch` sends a DELETE request to the server to delete a bank branch with the specified ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank branch that you
   * want to delete.
   * @returns an HTTP DELETE request to delete a bank branch with the specified ID. The response is expected to be of type
   * `POSTBankBranchDTO`.
   */
  deleteBankBranch(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<POSTBankBranchDTO>(
      `/${this.baseUrl}/setups/bank-branches/${id}`,
      { headers: headers }
    );
  }

  /**
   * The function `getBankChargesByBankId` retrieves bank charges based on a given bank ID.
   * @param {number} bankId - The `bankId` parameter is a number that represents the ID of a bank. It is used to retrieve
   * bank charges associated with a specific bank.
   * @returns an Observable of type BankChargeDTO[].
   */
  getBankChargesByBankId(bankId: number): Observable<BankChargeDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('bankId', `${bankId}`);
    return this.http.get<BankChargeDTO[]>(
      `/${this.baseUrl}/setups/bank-charges`,
      {
        headers: header,
        params: params
      }
    );
  }

  /**
   * The function `createBankCharge` sends a POST request to a specific endpoint with the provided data and returns an
   * Observable of the response.
   * @param {BankChargeDTO} data - The `data` parameter is of type `BankChargeDTO`, which is an object containing the
   * necessary information to create a bank charge.
   * @returns an Observable of type BankChargeDTO.
   */
  createBankCharge(
    data: BankChargeDTO
  ): Observable<BankChargeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<BankChargeDTO>(
      `/${this.baseUrl}/setups/bank-charges`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  /**
   * The function `updateBankCharge` sends a PUT request to update a bank charge with the specified ID using the provided
   * data.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank charge you want
   * to update. It is used to specify which bank charge should be updated.
   * @param {BankChargeDTO} data - The `data` parameter is of type `BankChargeDTO`, which is an object containing the
   * updated bank charge information.
   * @returns an Observable of type BankChargeDTO.
   */
  updateBankCharge(id: number, data: BankChargeDTO): Observable<BankChargeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<BankChargeDTO>(
      `/${this.baseUrl}/setups/bank-charges/${id}`,
      data,
      { headers: headers }
    );
  }

  /**
   * The function `deleteBankCharge` sends a DELETE request to the server to delete a bank charge with the specified ID.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of the bank charge that
   * needs to be deleted.
   * @returns an HTTP DELETE request to delete a bank charge with the specified ID. The response is expected to be of type
   * `BankChargeDTO`.
   */
  deleteBankCharge(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<BankChargeDTO>(
      `/${this.baseUrl}/setups/bank-charges/${id}`,
      { headers: headers }
    );
  }
}
