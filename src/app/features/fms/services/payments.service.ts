import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { BanksDto } from '../data/payments-dto';
import {ApiService} from '../../../shared/services/api/api.service';
import { API_CONFIG} from '../../../../environments/api_service_config';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(
    private apiService:ApiService
  ) { }
  getPaymentsBankActs(userCode:number,orgCode:number,branchCode:number):Observable<GenericResponseFMS<BanksDto>>{
    const params =  new HttpParams().set('userCode',`${userCode}`).set('orgCode',`${orgCode}`).set('branchCode',`${branchCode}`);
return this.apiService.GET<GenericResponseFMS<BanksDto>>(
  `payments/payment-bank-accounts`,
  API_CONFIG.FMS_PAYMENTS_SERVICE_BASE_URL,
  params
)
  }
}
