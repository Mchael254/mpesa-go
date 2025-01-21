import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NarrationDTO,CurrencyDTO, ReceiptingPointsDTO,PaymentModesDTO, ManualExchangeRateDTO, AccountTypeDTO, ReceiptNumberDTO, BanksDTO, ClientsDTO, ChargesDTO, TransactionDTO, ExchangeRateDTO, ManualExchangeRateResponseDTO, GenericResponse, ChargeManagementDTO, AllocationDTO, ExistingChargesResponseDTO, UploadReceiptDocsDTO, ReceiptSaveDTO, GetAllocationDTO, DeleteAllocationResponseDTO, BranchDTO, UsersDTO, printDTO, ReceiptUploadRequest } from '../data/receipting-dto';

import { ApiService } from '../../../shared/services/api/api.service';

import {API_CONFIG} from '../../../../environments/api_service_config';
import { HttpParams } from '@angular/common/http';
import { GenericResponseFMS } from 'src/app/shared/data/common/genericResponseDTO';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { PaymentMethod } from '../../lms/grp/components/claims/models/claim-models';
@Injectable({
  providedIn: 'root'
})
export class ReceiptService {

  constructor(private api:ApiService) { }

getUsers(userId:number):Observable<UsersDTO[]>{
 
  return this.api.GET<UsersDTO[]>(
    `users/${userId}`,
    API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL,
 
  );

}
  getBranches(
    organizationId: number
   
  ): Observable<BranchDTO[]> {
    const params = new HttpParams()
      .set('organizationId', `${organizationId}`)
      
    return this.api.GET<BranchDTO[]>(
      `branches?${params}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  // getDrawersBanks(): Observable<DrawersBankDTO[]> {
  //   return this.api.GET<DrawersBankDTO[]>(
  //     `drawer-banks`,
  //     API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
  //   );
  //   }

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
    getReceiptNumber(branchCode:number,userCode:number):Observable<ReceiptNumberDTO>{
      const params = new HttpParams().set('branchCode',`${branchCode}`).set('userCode',`${userCode}`);
      return this.api.GET<ReceiptNumberDTO>(
        `receipts/get-receipt-no`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      ) ;

    }
  getReceiptingPoints(branchCode:number,userCode:number):Observable<{data: ReceiptingPointsDTO[]}> {
      const params = new HttpParams().set('branchCode', `${branchCode}`).set('userCode',`${userCode}`);
      return this.api.GET<{data:ReceiptingPointsDTO[]}>(
        `points`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
      }
      
getPaymentModes(orgCode:number):Observable< {data: PaymentModesDTO[]}> {
        const params =  new HttpParams().set('orgCode',`${orgCode}`);
        return this.api.GET<{data: PaymentModesDTO[]}>(
          `payment-methods`, 
          API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
          params
        );
        }
    getBanks(branchCode:number,currCode:number):Observable<{data:BanksDTO[]}>{
      const params = new HttpParams().set('branchCode',`${branchCode}`).set('currCode',`${currCode}`);
      return this.api.GET<{data:BanksDTO[]}>(
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

   
    
    getAccountTypes(orgCode:number,branchCode:number,userCode:number):Observable<{data:AccountTypeDTO[]}>{
      const params = new HttpParams().set('orgCode',`${orgCode}`).set('branchCode',`${branchCode}`).set('usrCode',`${userCode}`)
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
        'receipting-clients',
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
        `receipting-clients/transactions`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      )
    }
    
// ... existing code ...
uploadFiles(requests: ReceiptUploadRequest[]): Observable<any> {
  // Map requests to simple objects
  const formattedRequests = requests
    .map(request => JSON.stringify({
      docType: request.docType,
      docData: request.docData,
      module: request.module,
      originalFileName: request.originalFileName,
      filename: request.filename,
      referenceNo: request.referenceNo,
      description: request.docDescription,
      amount: request.amount,
      paymentMethod: request.paymentMethod,
      policyNumber: request.policyNumber
    }));

  // Join the JSON strings with commas to remove array brackets
  const payload = formattedRequests.join(',');

  // Send the payload as a raw string
  return this.api.POST<any>(
    `uploadAllFinanceDocument`,
    payload,
    API_CONFIG.DMS_SERVICE
  );
}

    saveClientDocs(data: any): Observable<any> {
      return this.api.POST<any>(
        `uploadAllFinanceDocument
`,
        JSON.stringify(data), API_CONFIG.DMS_SERVICE
      );
    }
    postAllocation(userCode: number, data: AllocationDTO): Observable<any> {
      const endpoint = `allocations/save?userCode=${userCode}`;
      return this.api.POST<any>(endpoint, data, API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL);
    }
    
    saveReceipt( data: ReceiptSaveDTO): Observable<any> {
      const endpoint = `receipts/save`;
      const fullUrl=`${API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL}${endpoint}`
      return this.api.POST<any>(
        endpoint, 
        data,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
      );
    }
    getAllocations(receiptNumber: number, userCode: number): Observable<{ data: GetAllocationDTO[] }> {
      const params = new HttpParams()
        .set('receiptNumber', receiptNumber.toString())
        .set('userCode', userCode.toString());
    
      return this.api.GET<{ data: GetAllocationDTO[] }>(
        `allocations`,
        API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
        params
      );
    }
    
  // deleteAllocation(receiptDetailCode: number): Observable<DeleteAllocationResponseDTO> {
    
  //   const params = new HttpParams().set('receiptDetailCode', `${receiptDetailCode}`);
  //   return this.api.DELETE<DeleteAllocationResponseDTO>(
  //    `allocations/delete`,
  //     API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
  //     params
  //   );
  // }
  deleteAllocation(receiptDetailCode: number): Observable<DeleteAllocationResponseDTO> {
    // Remove the params since we're using path parameter
    return this.api.DELETE<DeleteAllocationResponseDTO>(
      `allocations/delete/${receiptDetailCode}`, // Include receiptDetailCode in the path
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL
    )
  }
  getParamStatus(paramName:string):Observable<GenericResponse<string>>{
const params=new HttpParams().set('paramName',`${paramName}`);
return(
  this.api.GET<GenericResponse<string>>(
    `parameters/get-param-status`,
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    params
  )
)
  }
  getReceiptDetails(receiptNo:number):Observable<{data:printDTO[] }>{
    const params = new HttpParams().set('receiptNo',`${receiptNo}`);
    return(
       this.api.GET<{data:printDTO[]}>(
      `receipts/get-receipt`,
      API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
      params
    )
    )

  }
validateReceipt(receiptNumber:number,userCode:number):Observable<GenericResponse<string>>{
  const params= new HttpParams().set('receiptNumber',`${receiptNumber}`).set('userCode',`${userCode}`);
  return(
  this.api.GET<GenericResponse<string>>(
    `receipt-validation/validate`,
    API_CONFIG.FMS_RECEIPTING_SERVICE_BASE_URL,
    params
  )
  )
}
     }
      