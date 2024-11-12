import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  DrawersBankDTO,NarrationDTO,CurrencyDTO, ReceiptingPointsDTO,PaymentModesDTO } from '../data/receipting-dto';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(private api:ApiService) { }
  getDrawersBanks(): Observable<DrawersBankDTO[]> {
    return this.api.GET<DrawersBankDTO[]>(
      `drawer-banks`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    );
    }

  getNarrations(): Observable<{ data: NarrationDTO[] }> {
    return this.api.GET<{ data: NarrationDTO[] }>(
      `narrations`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    );
  }
 
  getCurrencies(): Observable<CurrencyDTO[]> {
    return this.api.GET<CurrencyDTO[]>(
      `currencies`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    );
    }
  getReceiptingPoints(branchCode:number):Observable<ReceiptingPointsDTO[]> {
      const params = new HttpParams().set('branchCode', `${branchCode}`);
      return this.api.GET<ReceiptingPointsDTO[]>(
        `points`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
      }
      
getPaymentModes():Observable< {data: PaymentModesDTO[]}> {
        
        return this.api.GET<{data: PaymentModesDTO[]}>(
          `payment-methods`, 
          API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
         
        );
        }
     }
      