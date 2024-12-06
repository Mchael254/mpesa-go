import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  DrawersBankDTO,NarrationDTO,CurrencyDTO, ReceiptingPointsDTO,PaymentModesDTO, ManualExchangeRateDTO, AccountTypeDTO, ReceiptNumberDTO, BankDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ManualExchangeRateResponseDTO, GenericResponse, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO } from '../data/receipting-dto';

import { ApiService } from '../../../shared/services/api/api.service';

import {API_CONFIG} from '../../../../environments/api_service_config';
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
    getReceiptNumber(branchCode:number,userCode:number):Observable<ReceiptNumberDTO[]>{
      const params = new HttpParams().set('branchCode',`${branchCode}`).set('userCode',`${userCode}`);
      return this.api.GET<ReceiptNumberDTO[]>(
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
  
    getManualExchangeRateParameter(paramName:string): Observable<GenericResponse<string>> {
      const params=new HttpParams().set('paramName',`${paramName}`);
      return this.api.GET<GenericResponse<string>>(
        `parameters/get-param-status`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
    }
    

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


postManualExchangeRate( selectedCurrency: number,
  branchCode: number,
  userName: string,
  newCurrencyExchangeRateAmount: number): Observable<ManualExchangeRateResponseDTO> {
  return this.api.POST<ManualExchangeRateResponseDTO>(
    `currencies/set-manual-rate`,
    {  selectedCurrency,branchCode, userName,newCurrencyExchangeRateAmount },
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL // Ensure this is properly set
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

getExistingCharges(receiptNo: number): Observable<{data:ExistingChargesResponseDTO[]}> {
  const params = new HttpParams().set('receiptNo', receiptNo);
  return this.api.GET<{data:ExistingChargesResponseDTO[]}>(
    `charges/expenses`,
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    params
  );
}


    postChargeManagement(data: ChargeManagementDTO): Observable<any> {
      return this.api.POST<any>(
        'charges/manage',
         data,
          API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL);
    }

    // uploadReceiptDocs(
    //   originalFilename: string,
    //   docDescription: string,
    //   username: string,
    //   receiptNumber: number,
    //   userCode: number,
    //   uploadedFiles: string[]
    // ): Observable<{ message: string }> {
    //   const params = new HttpParams()
    //     .set('originalFilename', originalFilename)
    //     .set('docDescription', docDescription)
    //     .set('username', username)
    //     .set('receiptNumber', `${receiptNumber}`)
    //     .set('userCode', `${userCode}`);
  
    //   const requestBody = { uploadedFiles };
  
    //   return this.api.POST<{ message: string }>(
    //     `dms/upload-receipt-docs`,
    //     API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    //      params,
    //     requestBody
    //   );
    // }
    
    
    getAccountTypes(orgCode:number,userCode:number,branchCode:number):Observable<{data:AccountTypeDTO[]}>{
      const params = new HttpParams().set('orgCode',`${orgCode}`).set('usrCode',`${userCode}`).set('branchCode',`${branchCode}`)
     return this.api.GET<{data:AccountTypeDTO[]}>(
        `account-types`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      )

    }
   
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
    postAllocation(userCode: number, data: AllocationDTO): Observable<any> {
      const endpoint = `allocations/save?userCode=${userCode}`;
      return this.api.POST<any>(endpoint, data, API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL);
    }
    
     }
      