import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { unPrintedReceiptsDTO } from '../data/receipt-management-dto';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ReceiptManagementService {

  constructor(
   private api:ApiService
  ) { }
  getUnprintedReceipts(branchCode:number):Observable<unPrintedReceiptsDTO>{
    const params = new  HttpParams().set('branchCode',`${branchCode}`);
    return this.api.GET<unPrintedReceiptsDTO>(
        `receipts/unprinted`,
        
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      )
    
  }
}
