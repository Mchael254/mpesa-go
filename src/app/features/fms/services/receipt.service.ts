import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  DrawersBankDTO,NarrationDTO,CurrencyDTO, ReceiptingPointsDTO,PaymentModesDTO, ManualExchangeRateDTO, AccountTypeDTO, ReceiptNumberDTO, BankDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ManualExchangeRateResponseDTO, GenericResponse } from '../data/receipting-dto';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { HttpParams } from '@angular/common/http';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
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
 
   
  getCurrencies(branchCode:number): Observable<{data:CurrencyDTO[]}> {
    const params = new HttpParams().set('branchCode',`${branchCode}`);
    return this.api.GET<{data:CurrencyDTO[]}>(
      `currencies`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      params
    );
    }
    getReceiptNumber(branchCode:number,userCode:number):Observable<{data:ReceiptNumberDTO[]}>{
      const params = new HttpParams().set('branchCode',`${branchCode}`).set('userCode',`${userCode}`);
      return this.api.GET<{data:ReceiptNumberDTO[]}>(
        `receipts/get-receipt-no`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      ) ;

    }
  getReceiptingPoints(branchCode:number):Observable<{data: ReceiptingPointsDTO[]}> {
      const params = new HttpParams().set('branchCode', `${branchCode}`);
      return this.api.GET<{data:ReceiptingPointsDTO[]}>(
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
    getBanks(branchCode:number,currCode:number):Observable<{data:BankDTO[]}>{
      const params = new HttpParams().set('branchCode',`${branchCode}`).set('currCode',`${currCode}`);
      return this.api.GET<{data:BankDTO[]}>(
      `banks`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
    }
    // getManualExchangeRate(): Observable<GenericResponse<ManualExchangeRateDTO[]>> {
    //   return this.api.GET<GenericResponse<ManualExchangeRateDTO[]>>(
    //     `parameters/manual-exchange-rate-setup`,
    //     API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    //   );
    // }
    getManualExchangeRate(): Observable<GenericResponse<string>> {
      return this.api.GET<GenericResponse<string>>(
        `parameters/manual-exchange-rate-setup`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    }
    
//     getExchangeRate(selectedCurrency:number,orgCode:number):Observable<GenericResponseFMS<ExchangeRateDTO[]>>{
// const params = new HttpParams().set( 'selectedCurrency',`${selectedCurrency}`).set('orgCode',`${orgCode}`);
// return this.api.GET<GenericResponseFMS<ExchangeRateDTO[]>>(
//   'currencies/get-exchange-rate',
//   API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
//   params
// );

//     }
getExchangeRate(selectedCurrency: number, orgCode: number): Observable<GenericResponse<string>> {
  const params = new HttpParams()
    .set('selectedCurrency', `${selectedCurrency}`)
    .set('orgCode', `${orgCode}`);
    
  return this.api.GET<GenericResponse<string>>(
    'currencies/get-exchange-rate',
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    params
  );
}


     // New method for posting manual exchange rate
     postManualExchangeRate(exchangeRate: number): Observable<ManualExchangeRateResponseDTO> {
      return this.api.POST<ManualExchangeRateResponseDTO>(
        `currencies/set-manual-rate`,
        { exchangeRate },
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    }
    

    getCharges(orgCode:number,brhCode:number):Observable<{data:ChargesDTO[]}>{
      const params = new HttpParams().set('orgCode',`${orgCode}`).set('brhCode',`${brhCode}`);
      return  this.api.GET<{data:ChargesDTO[]}>(
        
        `charges`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
        
      );

    }
    getAccountTypes(orgCode:number,userCode:number,branchCode:number):Observable<{data:AccountTypeDTO[]}>{
      const params = new HttpParams().set('orgCode',`${orgCode}`).set('usrCode',`${userCode}`).set('branchCode',`${branchCode}`)
     return this.api.GET<{data:AccountTypeDTO[]}>(
        `account-types`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      )

    }
    // getClients(systemCode:number,acctCode:number,searchCriteria?:string):Observable<{data:ClientsDTO[]}>{
    //   const params = new HttpParams().set('systemCode',`${systemCode}`).set('acctCode',`${acctCode}`).set('searchCriteria',`${searchCriteria}`);
    //   return this.api.GET<{data:ClientsDTO[]}>(
    //     `clients`,
    //     API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    //     params
    //   )

    // }
    getClients(
      systemCode: number,
      acctCode: number,
      searchCriteria: string,
      searchValue: string
    ): Observable<{ data: ClientsDTO[] }> {
      const params = new HttpParams()
        .set('systemCode', `${systemCode}`)
        .set('acctCode', `${acctCode}`)
        .set('searchCriteria', `${searchCriteria}`)
        .set('searchValue', `${searchValue}`);
    
      return this.api.GET<{ data: ClientsDTO[] }>(
        'clients',
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
    }
    getTransactions(
      systemShortDesc:string,
      clientCode:number,
      accountCode:number,
      receiptType:string,
      clientShtDesc:string)
      :Observable<{data:TransactionDTO[]}>{
      const params = new HttpParams()
      .set('systemShortDesc',`${systemShortDesc}`)
      .set('clientCode',`${clientCode}`)
      .set('accountCode',`${accountCode}`)
      .set('receiptType',`${receiptType}`)
      .set('clientShtDesc',`${clientShtDesc }`);
      return this.api.GET<{data:TransactionDTO[]}>(
        `clients/transactions`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      )
    }
    
     }
      