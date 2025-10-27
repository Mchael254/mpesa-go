import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  cancelReceiptDTO, GLAccountDTO,
  glAccountDTO,
  glContentDTO,
  ReceiptsToCancelContentDTO,
  ReceiptToCancelDTO,
  shareReceiptDTO,
  unPrintedReceiptContentDTO,
  unPrintedReceiptsDTO,
} from '../data/receipt-management-dto';

import { ApiService } from '../../../shared/services/api/api.service';

import { API_CONFIG } from '../../../../environments/api_service_config';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { GenericResponse } from '../data/receipting-dto';
import {UtilService} from "../../../shared/services";

@Injectable({
  providedIn: 'root',
})
export class ReceiptManagementService {
  constructor(
    private api: ApiService,
    private utilService: UtilService) {}
  getUnprintedReceipts(branchCode: number): Observable<GenericResponse<Pagination<unPrintedReceiptContentDTO>>> {
    const params = new HttpParams().set('branchCode', `${branchCode}`);
    return this.api.GET<GenericResponse<Pagination<unPrintedReceiptContentDTO>>>(
      `receipts/unprinted`,

      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      params
    );
  }
  getReceiptsToCancel(branchCode: number): Observable<GenericResponse<Pagination<ReceiptsToCancelContentDTO>>> {
    const params = new HttpParams().set('branchCode', `${branchCode}`);
    return this.api.GET<GenericResponse<Pagination<ReceiptsToCancelContentDTO>>>(
      `receipts/receipts-to-cancel`,

      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      params
    );
  }
  cancelReceipt(body: cancelReceiptDTO): Observable<any> {
    return this.api.POST<any>(
      `receipts/cancel`,
      body,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    );
  }
  getGlAccount(
    branchCode: number
  ): Observable<GenericResponse<Pagination<glContentDTO>>> {
    return this.api.GET<GenericResponse<Pagination<glContentDTO>>>(
      `gl-accounts/branch/${branchCode}`,
      API_CONFIG.FMS_GENERAL_LEDGER_SERVICE_BASE_URL
    );
  }
  shareReceipt(body:shareReceiptDTO):Observable<any>{


  return this.api.POST<any>(
    `receipts/share`,
    body,
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
  )
}

  getGlAccounts(
    page: number,
    size: number,
    sortBy: any,
    direction: string
  ): Observable<GenericResponse<Pagination<GLAccountDTO>>> {
    let params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortBy', `${sortBy}`)
      .set('direction', `${direction}`)

    params = new HttpParams({
      fromObject: this.utilService.removeNullValuesFromQueryParams(params),
    });
    return this.api.GET<GenericResponse<Pagination<GLAccountDTO>>>(
      `gl-accounts`,
      API_CONFIG.FMS_GENERAL_LEDGER_SERVICE_BASE_URL,
      params
    );
  }

}
