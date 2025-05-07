import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cancelReceiptDTO, glAccountDTO, ReceiptToCancelDTO, unPrintedReceiptsDTO } from '../data/receipt-management-dto';

import { ApiService } from '../../../shared/services/api/api.service';

import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ReceiptManagementService {
  constructor(private api: ApiService) {}
  getUnprintedReceipts(branchCode: number): Observable<unPrintedReceiptsDTO> {
    const params = new HttpParams().set('branchCode', `${branchCode}`);
    return this.api.GET<unPrintedReceiptsDTO>(
      `receipts/unprinted`,

      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      params
    );
  }
  getReceiptsToCancel(branchCode:number):Observable<ReceiptToCancelDTO>{
    const params = new HttpParams().set('branchCode',`${branchCode}`);
   return this.api.GET<ReceiptToCancelDTO>(
    `receipts/receipts-to-cancel`,
    
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    params


   )

    

  }
  cancelReceipt(body:cancelReceiptDTO):Observable<any>{
    
    return this.api.POST<any>(
      `receipts/cancel`,
      body,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      

    );

  }
  getGlAccount(branchCode:number):Observable<glAccountDTO>{
    const params = new HttpParams().set('branchCode',`${branchCode}`);
    return this.api.GET<glAccountDTO>(
        `gl-accounts/branch/${params}`,
        API_CONFIG.FMS_GENERAL_LEDGER_SERVICE_BASE_URL


      );
    

  }
}
