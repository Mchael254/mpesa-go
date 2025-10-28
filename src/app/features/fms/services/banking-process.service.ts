import { Params } from './../../gis/components/setups/data/gisDTO';
import { Injectable, Type } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from 'src/environments/api_service_config';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { PaymentModesDTO } from '../data/auth-requisition-dto';
import { HttpParams } from '@angular/common/http';
import { ApiResponse, assignedUsersDTO, PageableResponse, ReceiptDTO, ReceiptsToBankRequest, UsersDTO } from '../data/receipting-dto';

@Injectable({
  providedIn: 'root',
})
export class BankingProcessService {
  constructor(private api: ApiService) {}
  getPaymentMethods(): Observable<{data:PaymentModesDTO[]}> {
    const type = 'Y';
    return this.api.GET<{data:PaymentModesDTO[]}>(
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
      .set('page', request.pageable.page.toString())
      .set('size', request.pageable.size.toString())
      .set('sort', request.pageable.sort);

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
    return this.api.GET<ApiResponse<PageableResponse<ReceiptDTO>>>(endpoint, baseUrl, params)
      .pipe(
        map(response => {
          // Check if the response and its nested properties exist before returning
          if (response && response.success && response.data && response.data.content) {
            return response.data.content;
          }
          // If the structure is not as expected, return an empty array to prevent errors
          return [];
        })
      );
  }
  getUsers(currentUserCode:number):Observable<assignedUsersDTO[]>{
    const params =  new HttpParams().set('currentUserCode',currentUserCode);
    return this.api.GET<assignedUsersDTO[]>(
      `users/assignable`,
      API_CONFIG.FMS_SETUPS_SERVICE_BASE_URL,
      params
    )

  }
}
