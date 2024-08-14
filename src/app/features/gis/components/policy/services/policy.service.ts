import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../app/core/config/app-config-service';
import { ApiService } from '../../../../../../app/shared/services/api/api.service';
import { SessionStorageService } from '../../../../../../app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../environments/api_service_config';
import { CoinsuranceDetail, Policy, PremiumFinanciers, RiskInformation, RiskSection,CoinsuranceEdit, InsuredApiResponse, editInsured } from '../data/policy-dto';
import { StringManipulation } from '../../../../../../app/features/lms/util/string_manipulation';
import { SESSION_KEY } from '../../../../../features/lms/util/session_storage_enum';
import { Remarks } from '../../../data/policies-dto';

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
  computationUrl = this.appConfig.config.contextPath.computation_service;
  reportsUrl = this.appConfig.config.contextPath.reports;
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
  updatePolicy(data: Policy, user){
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`v1/policies?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
   getPolicy(batchNo: number) {
    return this.api.GET(`/v2/policies?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getAllPolicy() {
    return this.api.GET(`/v2/policies`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

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
    return this.api.POST(`v1/policy-Risks-Controller?policyBatchNo=${batchNo}&user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicyRisks(policyNo:String){
    return this.api.GET(`/v2/policy-risks?policyNo=${policyNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
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
  editCoinsurance(data:CoinsuranceEdit){
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
 policyUtils(transactionCode){
    const params = new HttpParams()
    .set('transactionCode', transactionCode)
    .set('transactionsType','UNDERWRITING')
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
  
    return this.http.get(`/${this.computationUrl}/api/v1/utils/payload`,{
      headers: headers,
      params:params
    })
  }
  computePremium(computationDetails){
    return this.http.post(`/${this.computationUrl}/api/v1/premium-computation`,computationDetails)
  }
  getbypolicyNo(policyNo){
    return this.api.GET(`v1/policies/filter-policies?policyNo=${policyNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getbyRiskId(riskId){
    return this.api.GET(`v2/policies/filter-risks?riskId=${riskId}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRisk(ipuCode:number,batchNo:number,productCode :number){
    return this.api.DELETE(`v1/policies/delete-risks?ipuCode=${ipuCode}&polBatchNo=${batchNo}&proCode=${productCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addInsured(batchNo:number,endorsementNo:string,policyNo :string,clientCode:number){
    return this.api.POST(`v1/policies/add-insured?polBatchNo=${batchNo}&polEndosNo=${endorsementNo}&polNo=${policyNo}&prpCode=${clientCode}`,"placeholder data", API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
 
  deleteInsured(policyInsuredCode :number){
    return this.api.DELETE(`v1/policies/delete-insured?polinCode=${policyInsuredCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  generateCoverNote(data){
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // It should be 'application/json' for JSON data
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
  
    // Include responseType: 'text' in the options
    const options = {
      headers: headers,
      responseType: 'text' as 'json' // Cast 'json' is required for Angular's HttpClient
    };
    return this.http.post(`${this.reportsUrl}`,JSON.stringify(data),options)
  }


  getInsureds(batchNo: number): Observable<InsuredApiResponse> {
    return this.api.GET(`v2/policies/get-insureds?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL) as Observable<InsuredApiResponse>;
  }
  editInsureds(data:editInsured){
    return this.api.PUT(`v1/policies/edit-insured?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  reassignTicket(data){
    return this.api.POST(`api/v1/tickets`,JSON.stringify(data),API_CONFIG.MNGT_WORKFLOW_BASE_URL)
  }
  getRiskClauses(){
    return this.api.GET(`v2/risk-clauses`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
    
  }
  addRemarks(data: Remarks){
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`v1/remarks?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  editRemarks(data:Remarks){
    return this.api.PUT(`v1/remarks?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRemarks(data:Remarks){
    return this.api.DELETE(`v1/remarks?`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deletePremiumItem(batchNo:any,sectionCode:any){
    return this.api.DELETE(`v1/risk-section/delete?batchNo=${batchNo}&pilCode=${sectionCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getSubsclassPerils(subclassCode){
    return this.api.GET(`api/v1/subperils?subclassCode=${subclassCode}`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }
  
  getRiskPerils(){
    return this.api.GET(`v2/risk-perils`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  generateRiskClaimReport(data){
   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // It should be 'application/json' for JSON data
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
  
    // Include responseType: 'text' in the options
    const options = {
      headers: headers,
      responseType: 'text' as 'json' // Cast 'json' is required for Angular's HttpClient
    };
    return this.http.post(`${this.reportsUrl}`,JSON.stringify(data),options)
  }
  deleteRiskPeril(code){
    return this.api.DELETE(`v2/risk-perils?code=${code}`,API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getRiskClause(riskCode){
    return this.api.GET(`v2/risk-clauses/${riskCode}?code=${riskCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRiskClause(riskCode,polClauseCode){
    return this.api.DELETE(`v1/delete-risk-clause?ipuCode=${riskCode}&polClauseCode=${polClauseCode}`,API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
}
