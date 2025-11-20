import { BatchesDTO, DeAssignDTO, ReAssignUserDTO } from './../data/banking-process-dto';
import { Params } from './../../gis/components/setups/data/gisDTO';
import { Injectable, Type } from '@angular/core';
import {ApiService} from '../../../shared/services/api/api.service';
import { map, Observable } from 'rxjs';
import {API_CONFIG} from '../../../../environments/api_service_config';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { PaymentModesDTO } from '../data/auth-requisition-dto';
import { HttpParams } from '@angular/common/http';
import { GenericResponse } from '../data/receipting-dto';
import {
  assignUserRctsDTO,
  ReceiptDTO,
  ReceiptsToBankRequest,
} from '../data/banking-process-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';

@Injectable({
  providedIn: 'root',
})
export class BankingProcessService {
  constructor(private api: ApiService) {}
  getPaymentMethods(): Observable<{ data: PaymentModesDTO[] }> {
    const type = 'Y';
    return this.api.GET<{ data: PaymentModesDTO[] }>(
      `payment-methods?type=${type}`,
      API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL
    );
  }
  getReceipts(request: ReceiptsToBankRequest): Observable<ReceiptDTO[]> {
    let params = new HttpParams()
      .set('dateFrom', request.dateFrom)
      .set('dateTo', request.dateTo)
      .set('orgCode', request.orgCode.toString())
      .set('payMode', request.payMode)
      .set('page', 0)
      .set('size', 10)
      .set('sort', 'ASC');

    if (request.includeBatched) {
      params = params.set('includeBatched', request.includeBatched);
    }
    if (request.bctCode) {
      params = params.set('bctCode', request.bctCode.toString());
    }
    if (request.brhCode) {
      params = params.set('brhCode', request.brhCode.toString());
    }
    return this.api
      .GET<GenericResponse<Pagination<ReceiptDTO>>>( `receipts/receipts-to-bank`, API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL, params)
      .pipe(
        map((response) => {
          // Check if the response and its nested properties exist before returning
          if (
            response &&
            response.success &&
            response.data &&
            response.data.content
          ) {
            return response.data.content;
          }
          // If the structure is not as expected, return an empty array to prevent errors
          return [];
        })
      );
  }
  assignUser(requestBody: assignUserRctsDTO): Observable<any> {
    return this.api.POST<any>(`receipts/assign`, requestBody, API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL);
  }
  deAssign(requestBody:DeAssignDTO):Observable<any>{
    return this.api.POST<any>(`receipts/de-assign`,requestBody,API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL)

  }
  reAssignUser(requestBody:ReAssignUserDTO):Observable<any>{
    return this.api.POST<any>(`receipts/re-assign`,requestBody,API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL);
  }
  getBatches():Observable<BatchesDTO[]>{
    return this.api.GET<BatchesDTO[]>(
      `receipts/batches`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    )
  }
}
