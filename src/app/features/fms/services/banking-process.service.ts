import { Params } from './../../gis/components/setups/data/gisDTO';
import { Injectable, Type } from '@angular/core';
import {ApiService} from '../../../shared/services/api/api.service';
import { map, Observable } from 'rxjs';
import {API_CONFIG} from '../../../../environments/api_service_config';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { PaymentModesDTO } from '../data/auth-requisition-dto';
import { HttpParams } from '@angular/common/http';
import { GenericResponse, UsersDTO } from '../data/receipting-dto';
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
      .set('size', 5)
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
    const endpoint = `receipts/receipts-to-bank`;
    const baseUrl = API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL;
    return this.api
      .GET<GenericResponse<Pagination<ReceiptDTO>>>(endpoint, baseUrl, params)
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
  getActiveUsers(): Observable<Pagination<UsersDTO>> {
    const baseUrl = API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL;
    const endpoint = '/users';
    let params = new HttpParams()
      .set('page', 0)
      .set('size', 6)
      .set('sort', 'desc')
      .set('sortList', 'dateCreated')
      .set('status', 'A');
    return this.api.GET<Pagination<UsersDTO>>(endpoint, baseUrl, params);
  }
  assignUser(requestBody: assignUserRctsDTO): Observable<any> {
    const baseUrl = API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL;
    const endpoint = `receipts/assign`;
    return this.api.POST<any>(endpoint, requestBody, baseUrl);
  }
}
