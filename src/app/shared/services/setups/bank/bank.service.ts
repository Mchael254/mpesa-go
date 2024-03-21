import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import {
  BankBranchDTO,
  BankChargeDTO,
  BankDTO,
  BankRegionDTO,
  CurrencyDTO,
  FundSourceDTO,
  POSTBankBranchDTO,
} from '../../../data/common/bank-dto';
import { Logger } from '../../logger/logger.service';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

const log = new Logger('BankService');

/**
 * This service is used to handle bank related operations
 */
@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(private api: ApiService) {}

  /**
   * Get all banks
   * @param countryId country id
   * @returns {Observable<BankDTO[]>} all banks for a given country
   */
  getBanks(countryId: number): Observable<BankDTO[]> {
    log.info('Fetching Banks');
    const params = new HttpParams().set('countryId', `${countryId}`);

    return this.api.GET<BankDTO[]>(
      `banks`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get all bank branches
   * @returns {Observable<BankBranchDTO[]>} all bank branches
   */
  getBankBranch(): Observable<BankBranchDTO[]> {
    log.info('Fetching Bank Branches');

    return this.api.GET<BankBranchDTO[]>(
      `bank-branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getBankBranchById(id: any): Observable<BankBranchDTO[]> {
    log.info('Fetching Bank Branches');
    const params = new HttpParams().set('bankId', `${id}`);

    return this.api.GET<BankBranchDTO[]>(
      `bank-branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get all bank branches by bank id
   * @param bankId Bank Id
   * @returns {Observable<BankBranchDTO[]>} all bank branches for a given bank id
   */
  getBankBranchesByBankId(bankId: number): Observable<BankBranchDTO[]> {
    return this.api.GET<BankBranchDTO[]>(
      `banks/${bankId}/branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Get all bank branches by bank id
   * @param bankId Bank Id
   * @returns {Observable<BankBranchDTO[]>} all bank branches for a given bank id
   */
  getBankBranchListByBankId(bankId: number): Observable<BankBranchDTO[]> {
    const params = new HttpParams().set('bankId', `${bankId}`);

    return this.api.GET<BankBranchDTO[]>(
      `bank-branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getCurrencies(): Observable<CurrencyDTO[]> {
    return this.api.GET<CurrencyDTO[]>(
      `currencies`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Get all source of funds
   * @returns {Observable<FundSourceDTO[]>} all source of funds
   */
  getFundSource(): Observable<FundSourceDTO[]> {
    log.info('Fetching Source of Funds');

    return this.api.GET<FundSourceDTO[]>(
      `source-of-funds`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getBankRegion(regionCode: number): Observable<BankRegionDTO[]> {
    const params = new HttpParams().set('regionCode', `${regionCode}`);
    return this.api.GET<BankRegionDTO[]>(
      `bank-regions`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createBankRegion(data: BankRegionDTO): Observable<BankRegionDTO> {
    return this.api.POST<BankRegionDTO>(
      `bank-regions`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateBankRegion(id: number, data: BankRegionDTO): Observable<BankRegionDTO> {
    return this.api.PUT<BankRegionDTO>(
      `bank-regions/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteBankRegion(id: number) {
    return this.api.DELETE<BankRegionDTO>(
      `bank-regions/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * The function `createBank` sends a POST request to create a new bank using the provided data.
   * @param {BankDTO} data - The `data` parameter is of type `BankDTO`, which is an object containing the information
   * needed to create a bank.
   * @returns an Observable of type BankDTO.
   */
  createBank(data: BankDTO): Observable<BankDTO> {
    return this.api.POST<BankDTO>(
      `banks`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
    return this.api.PUT<BankDTO>(
      `banks/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
    return this.api.DELETE<BankDTO>(
      `banks/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * The function `createBankBranch` sends a POST request to create a new bank branch using the provided data.
   * @param {POSTBankBranchDTO} data - The `data` parameter is of type `POSTBankBranchDTO`, which is an object containing
   * the information needed to create a bank branch.
   * @returns an Observable of type POSTBankBranchDTO.
   */
  createBankBranch(data: POSTBankBranchDTO): Observable<POSTBankBranchDTO> {
    return this.api.POST<POSTBankBranchDTO>(
      `bank-branches`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
  updateBankBranch(
    id: number,
    data: POSTBankBranchDTO
  ): Observable<POSTBankBranchDTO> {
    return this.api.PUT<POSTBankBranchDTO>(
      `bank-branches/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
    return this.api.DELETE<POSTBankBranchDTO>(
      `bank-branches/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * The function `getBankChargesByBankId` retrieves bank charges based on a given bank ID.
   * @param {number} bankId - The `bankId` parameter is a number that represents the ID of a bank. It is used to retrieve
   * bank charges associated with a specific bank.
   * @returns an Observable of type BankChargeDTO[].
   */
  getBankChargesByBankId(bankId: number): Observable<BankChargeDTO[]> {
    const params = new HttpParams().set('bankId', `${bankId}`);
    return this.api.GET<BankChargeDTO[]>(
      `bank-charges`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * The function `createBankCharge` sends a POST request to a specific endpoint with the provided data and returns an
   * Observable of the response.
   * @param {BankChargeDTO} data - The `data` parameter is of type `BankChargeDTO`, which is an object containing the
   * necessary information to create a bank charge.
   * @returns an Observable of type BankChargeDTO.
   */
  createBankCharge(data: BankChargeDTO): Observable<BankChargeDTO> {
    return this.api.POST<BankChargeDTO>(
      `bank-charges`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
    return this.api.PUT<BankChargeDTO>(
      `bank-charges/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
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
    return this.api.DELETE<BankChargeDTO>(
      `bank-charges/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
