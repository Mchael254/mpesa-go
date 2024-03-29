import {Injectable, signal} from '@angular/core';
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {HttpParams} from "@angular/common/http";
import { ClaimsDTO } from '../../data/claims-dto';
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {ApiService} from "../../../../shared/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class ViewClaimService {
  public claimTransactionObject = signal({});
  constructor(
    private api:ApiService,
  ) { }

  getClaims(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<ClaimsDTO>> {

    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.api.GET<Pagination<ClaimsDTO>>(`api/v2/claims/client/${id}?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL);
  }

  getClaimByClaimNo(claimNo: string): Observable<Pagination<ClaimsDTO>> {
    return this.api.GET<Pagination<ClaimsDTO>>(`api/v2/claims/view?claimNo=${claimNo}`, API_CONFIG.GIS_CLAIMS_BASE_URL);
  }

  getListOfExceptionsByClaimNo(claimNo: string, transactionNo: number, transactionType: string):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
      .set('transactionNo', `${transactionNo}`)
      .set('transactionType', `${transactionType}`)
    return this.api.GET<any>(`api/v1/claims/exceptions?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getListOfPerilsLRV(claimNo: string):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
    return this.api.GET<any>(`api/v1/claims/peril-details?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getTreatyCedingLRV(claimNo: string, transactionNo: number):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
      .set('transactionNo', `${transactionNo}`)
    return this.api.GET<any>(`api/v1/claims/treaty-ceding?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getFacultativeCedingLRV(claimNo: string, transactionNo: number):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
      .set('transactionNo', `${transactionNo}`)
    return this.api.GET<any>(`api/v1/claims/facultative-ceding?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getNonPropTreatyLRV(claimNo: string, transactionNo: number):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
      .set('transactionNo', `${transactionNo}`)
    return this.api.GET<any>(`api/v1/claims/treaty-details?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getPenaltiesLRV(claimNo: string):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
    return this.api.GET<any>(`api/v1/claims/penalty-details?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getClaimsTransactionsDetails(claimNo: string):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
    return this.api.GET<any>(`api/v1/claims/claims-transaction-details?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }

  getClaimsPaymentTransactionsDetails(claimNo: string, claimVoucherNo: number):
    Observable<any> {
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`)
      .set('claimVoucherNo', `${claimVoucherNo}`)
    // claimVoucherNo=2022204967
    return this.api.GET<any>(`api/v1/claims/payments?${params}`, API_CONFIG.GIS_CLAIMS_BASE_URL)
  }
}
