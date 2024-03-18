import { Injectable } from '@angular/core';
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
}
