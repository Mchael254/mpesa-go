import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../app/core/config/app-config-service';
import { ApiService } from '../../../../../../app/shared/services/api/api.service';
import { SessionStorageService } from '../../../../../../app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../environments/api_service_config';
import { CoinsuranceDetail, Policy, PremiumFinanciers, RiskInformation, RiskSection } from '../data/policy-dto';
import { StringManipulation } from '../../../../../../app/features/lms/util/string_manipulation';
import { SESSION_KEY } from '../../../../../features/lms/util/session_storage_enum';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    private api: ApiService
  ) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }
  // Error handling
  errorHandl(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
  createPolicy(data: Policy, user) {
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`v1/policies?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicy(batchNo: number) {
    return this.api.GET(`/v2/policies?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPaymentModes() {
    let page = 0;
    let size = 100;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

    })
    return this.api.GET(`/v2/policies/payment-modes?pageNo=0&pageSize=100`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addPolicyRisk(batchNo: number, data: RiskInformation, user) {
    return this.api.POST(`/v1/policy-Risks-Controller?policyBatchNo=${batchNo}&user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  generatePolicyNumber(data: Policy) {
    return this.api.POST(`v1/policies/generatePolicyNumber`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  createRiskSection(data:RiskSection){
    return this.api.POST(`v1/risk-section`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getCoinsurance(batchNo:number){
    return this.api.GET(`v1/policies/coInsurance?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  addCoinsurance(batchNo:number, data:CoinsuranceDetail){
    return this.api.POST(`v1/policies/add-coinsurance?polBatchNo=${batchNo}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editCoinsurance(data:CoinsuranceDetail){
    return this.api.PUT(`v1/policies/edit-coinsurance?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteCoinsurance(agentCode:number,batchNo:number){
    return this.api.DELETE(`v1/policies/delete-coinsurance?agnCode=${agentCode}&polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  // getPremiumFinanciers(partyType:string){
  //   let page = 0;
  //   let size = 100;
  //   return this.api.GET(`v2/policies/coInsurance?pageNo=${page}&pageSize=${size}&partyType=${partyType}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  // }
  getPremiumFinanciers(): Observable<PremiumFinanciers[]>{
    let page = 0;
    let size = 1000;
    return this.api.GET<PremiumFinanciers[]>(`v2/financiers?pageNo=${page}&pageSize=${size}`,API_CONFIG.GIS_UNDERWRITING_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
}
