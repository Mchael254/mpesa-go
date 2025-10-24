import { Params } from './../../gis/components/setups/data/gisDTO';
import { Injectable, Type } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from 'src/environments/api_service_config';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { PaymentModesDTO } from '../data/auth-requisition-dto';
import { HttpParams } from '@angular/common/http';
import { ApiResponse, PageableResponse, ReceiptDTO, ReceiptsToBankRequest } from '../data/receipting-dto';

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
//   getReceipts(request:ReceiptsToBankRequest):Observable<ApiResponse<ReceiptDTO[]>>{
// let params = new HttpParams()
//       .set('dateFrom', request.dateFrom)
//       .set('dateTo', request.dateTo)
//       .set('orgCode', request.orgCode.toString())
//       .set('payMode', request.payMode)
//       .set('page', request.pageable.page.toString())
//       .set('size', request.pageable.size.toString())
//       .set('sort', JSON.stringify(request.pageable.sort));

//     if (request.includeBatched) {
//       params = params.set('includeBatched', request.includeBatched);
//     }
//     if (request.bctCode) {
//       params = params.set('bctCode', request.bctCode.toString());
//     }
//     if (request.brhCode) {
//       params = params.set('brhCode', request.brhCode.toString());
//     }

//       return this.api.GET<ApiResponse<ReceiptDTO>>[]>(
//           `receipts/receipts-to-bank`,
//             API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
//             params
        
//       ).pipe(
//         map(response => response.data.content) // Extract the array you need
//     );
//   }

  getReceipts(request: ReceiptsToBankRequest): Observable<ReceiptDTO[]> {

    // Start with the mandatory parameters
    let params = new HttpParams()
      .set('dateFrom', request.dateFrom)
      .set('dateTo', request.dateTo)
      .set('orgCode', request.orgCode.toString())
      .set('payMode', request.payMode)
      .set('page', request.pageable.page.toString())
      .set('size', request.pageable.size.toString())
      .set('sort', request.pageable.sort); // Sorting might need adjustment, see note below

    // *** FIX 1: Add the previously missing optional parameters ***
    // HttpParams is immutable, so we must reassign the result of .set()
    if (request.includeBatched) {
      params = params.set('includeBatched', request.includeBatched);
    }
    if (request.bctCode) {
      params = params.set('bctCode', request.bctCode.toString());
    }
    if (request.brhCode) {
      params = params.set('brhCode', request.brhCode.toString());
    }

    // Define the full, expected API response structure
    const endpoint = `receipts/receipts-to-bank`;
    const baseUrl = API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL;

    // *** FIX 2: Define the full response type and use `pipe(map(...))` to extract the content array ***
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
}
