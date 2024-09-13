import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { Pagination } from '../../../shared/data/common/pagination';
import { HttpParams } from '@angular/common/http';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { UtilService } from '../../../shared/services';
import {
  ApprovedChequeMandatesDTO,
  eftDTO,
  EftPaymentTypesDTO,
  EligibleAuthorizersDTO,
  PaymentBankAccountsDTO,
  TransactionalDetailsDTO,
} from '../data/auth-requisition-dto';
import { GenericResponseFMS } from '../../../shared/data/common/genericResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class FmsService {
  constructor(private api: ApiService, private utilService: UtilService) {}

  getEftPaymentTypes(
    userCode: number,
    branchCode: number,
    sysCode: number
  ): Observable<GenericResponseFMS<EftPaymentTypesDTO>> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('sysCode', `${sysCode}`);
    return this.api.GET<GenericResponseFMS<EftPaymentTypesDTO>>(
      `eft-payment-types?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
    );
  }

  getBankAccounts(
    userCode: number,
    orgCode: number,
    branchCode: number
  ): Observable<GenericResponseFMS<PaymentBankAccountsDTO>> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('orgCode', `${orgCode}`)
      .set('branchCode', `${branchCode}`);

    return this.api.GET<GenericResponseFMS<PaymentBankAccountsDTO>>(
      `payment-bank-accounts?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  getEligibleAuthorizers(
    userCode: number,
    branchCode: number,
    chequeNumber: number,
    chequeAmount: number
  ): Observable<GenericResponseFMS<EligibleAuthorizersDTO>> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('chequeNumber', `${chequeNumber}`)
      .set('chequeAmount', `${chequeAmount}`);

    return this.api.GET<GenericResponseFMS<EligibleAuthorizersDTO>>(
      `eft-eligible-mandate-signers?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  getSignedBy(
    chequeNumber: number
  ): Observable<GenericResponseFMS<ApprovedChequeMandatesDTO>> {
    const params = new HttpParams().set('chequeNo', `${chequeNumber}`);

    return this.api.GET<GenericResponseFMS<ApprovedChequeMandatesDTO>>(
      `approved-cheque-mandates?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  getTransactionDetails(
    chequeNumber: number,
    userCode: number,
    paymentCategory: string
  ): Observable<GenericResponseFMS<TransactionalDetailsDTO>> {
    const params = new HttpParams()
      .set('chequeNo', `${chequeNumber}`)
      .set('userCode', `${userCode}`)
      .set('paymentCategory', `${paymentCategory}`);

    return this.api.GET<GenericResponseFMS<TransactionalDetailsDTO>>(
      `view-transactional-details?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
    );
  }

  getEftMandateRequisitions(
    bankCode: number,
    userCode: number,
    paymentType: string,
    fromDate: string,
    toDate: string,
    pageNo: number,
    pageSize: number,
    refNoFilter: string,
    narrativeFilter: string,
    accountNumberFilter: string,
    statusFilter: string,
    sortBy: string,
    sortDirection: string
  ): Observable<Pagination<eftDTO>> {
    let params = new HttpParams()
      .set('bankCode', `${bankCode}`)
      .set('userCode', `${userCode}`)
      .set('paymentType', `${paymentType}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)
      .set('refNoFilter', `${refNoFilter}`)
      .set('narrativeFilter', `${narrativeFilter}`)
      .set('accountNumberFilter', `${accountNumberFilter}`)
      .set('statusFilter', `${statusFilter}`)
      .set('sortBy', `${sortBy}`)
      .set('sortDirection', `${sortDirection}`);

    params = new HttpParams({
      fromObject: this.utilService.removeNullValuesFromQueryParams(params),
    });

    return this.api.GET<Pagination<eftDTO>>(
      `eft-mandate-requisitions?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  getChequeMandateRequisitions(
    bankCode: number,
    userCode: number,
    branchCode: number,
    paymentType: string,
    fromDate: string,
    toDate: string
  ): Observable<Pagination<any>> {
    let params = new HttpParams()
      .set('bankCode', `${bankCode}`)
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('paymentType', `${paymentType}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`);

    params = new HttpParams({
      fromObject: this.utilService.removeNullValuesFromQueryParams(params),
    });

    return this.api.GET<Pagination<any>>(
      `cheque-mandate-requisitions?${params}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  generateOtp(userCode: number, organizationCode: number): Observable<any> {
    return this.api.POST<any>(
      `generate-otp?userCode=${userCode}&organizationCode=${organizationCode}`,
      null,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  validateOtp(userCode: number, tokenId: string): Observable<any> {
    return this.api.POST<any>(
      `validate-otp?userCode=${userCode}&tokenId=${tokenId}`,
      null,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }

  signChequeMandate(data: any): Observable<any> {
    return this.api.POST<any>(
      `sign-cheque-mandate`,
      JSON.stringify(data),
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL2
    );
  }
}
