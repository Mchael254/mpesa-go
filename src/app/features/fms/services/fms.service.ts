import { Injectable } from '@angular/core';
import {ApiService} from "../../../shared/services/api/api.service";
import {Observable} from "rxjs";
import {Pagination} from "../../../shared/data/common/pagination";
import {HttpParams} from "@angular/common/http";
import {API_CONFIG} from "../../../../environments/api_service_config";
import {UtilService} from "../../../shared/services";


@Injectable({
  providedIn: 'root'
})
export class FmsService {

  constructor(
    private api:ApiService,
    private utilService: UtilService,
  ) { }

  getEftPaymentTypes(userCode: number, branchCode: number, sysCode: number):
    Observable<any> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('sysCode', `${sysCode}`)
    return this.api.GET<any>(`v1/eft-payment-types?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getBankAccounts(userCode: number, orgCode: number, branchCode: number, sysCode: number):
    Observable<any> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('orgCode', `${orgCode}`)
      .set('branchCode', `${branchCode}`)
      .set('sysCode', `${sysCode}`)

    return this.api.GET<any>(`v1/payment-bank-accounts?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getEligibleAuthorizers(userCode: number, branchCode: number, sysCode: number, chequeNumber: number, chequeAmount: number):
    Observable<any> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('sysCode', `${sysCode}`)
      .set('chequeNumber', `${chequeNumber}`)
      .set('chequeAmount', `${chequeAmount}`)

    return this.api.GET<any>(`v1/eft-eligible-mandate-signers?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getSignedBy(userCode: number, chequeNumber: number, branchCode: number):
    Observable<any> {
    const params = new HttpParams()
      .set('userCode', `${userCode}`)
      .set('chequeNumber', `${chequeNumber}`)
      .set('branchCode', `${branchCode}`)


    return this.api.GET<any>(`v1/approved-cheque-mandates?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getTransactionDetails(chequeNumber: number, userCode: number, paymentCategory: string):
    Observable<any> {
    const params = new HttpParams()
      .set('chequeNo', `${chequeNumber}`)
      .set('userCode', `${userCode}`)
      .set('paymentCategory', `${paymentCategory}`)

    return this.api.GET<any>(`v1/view-transactional-details?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getEftMandateRequisitions(bankCode: number, userCode: number, paymentType: string,
                            fromDate: string, toDate: string, pageNo: number, pageSize: number):
    Observable<Pagination<any>> {
    let params = new HttpParams()
      .set('bankCode', `${bankCode}`)
      .set('userCode', `${userCode}`)
      .set('paymentType', `${paymentType}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)
      .set('pageNo', `${pageNo}`)
      .set('pageSize', `${pageSize}`)

    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.api.GET<Pagination<any>>(`v1/eft-mandate-requisitions?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  getChequeMandateRequisitions(bankCode: number, userCode: number, branchCode: number, paymentType: string,
                               fromDate: string, toDate: string):
    Observable<Pagination<any>> {
    let params = new HttpParams()
      .set('bankCode', `${bankCode}`)
      .set('userCode', `${userCode}`)
      .set('branchCode', `${branchCode}`)
      .set('paymentType', `${paymentType}`)
      .set('fromDate', `${fromDate}`)
      .set('toDate', `${toDate}`)

    params = new HttpParams({ fromObject: this.utilService.removeNullValuesFromQueryParams(params) });

    return this.api.GET<Pagination<any>>(`v1/cheque-mandate-requisitions?${params}`, API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL)
  }

  generateOtp(
    userCode: number,
    organizationCode: number,
  ): Observable<any> {

    return this.api.POST<any>(
      `v1/generate-otp?user_code=${userCode}&organization_code=${organizationCode}`, null,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
    );
  }

  validateOtp(
    userCode: number,
    tokenId: string,
  ): Observable<any> {

    return this.api.POST<any>(
      `v1/validate-otp?user_code=${userCode}&token_id=${tokenId}`, null,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL);
  }

  signChequeMandate(data: any): Observable<any> {
    return this.api.POST<any>(
      `v1/sign-cheque-mandate`, JSON.stringify(data),
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
    );
  }
}
