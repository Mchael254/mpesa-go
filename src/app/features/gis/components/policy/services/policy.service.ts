import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { AppConfigService } from '../../../../../../app/core/config/app-config-service';
import { ApiService } from '../../../../../../app/shared/services/api/api.service';
import { SessionStorageService } from '../../../../../../app/shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../environments/api_service_config';
import { CoinsuranceDetail, Policy, PremiumFinanciers, RiskInformation, RiskSection, CoinsuranceEdit, InsuredApiResponse, editInsured, RequiredDocuments, commission, PolicyTaxes, populatePolicyTaxes, PolicyScheduleDetails, Certificates, AddCertificates, EditPolicyClause, EditRequiredDocuments, SubclassesClauses, RiskPeril, ClientDDdetails, ExternalClaimExp, AddPolicyClauses, InternalClaimExp } from '../data/policy-dto';
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
  updatePolicy(data: Policy, user) {
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
    return this.api.POST(`v1/policy-risks?policyBatchNo=${batchNo}&user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicyRisks(policyNo: String) {
    return this.api.GET(`/v2/policy-risks?policyNo=${policyNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  generatePolicyNumber(data: Policy) {
    return this.api.POST(`v1/policies/generatePolicyNumber`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  createRiskSection(data: RiskSection) {
    return this.api.POST(`v1/risk-section`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getCoinsurance(batchNo: number) {
    return this.api.GET(`v1/policies/coInsurance?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  addCoinsurance(batchNo: number, data: CoinsuranceDetail) {
    return this.api.POST(`v1/policies/add-coinsurance?polBatchNo=${batchNo}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editCoinsurance(data: CoinsuranceEdit) {
    return this.api.PUT(`v1/policies/edit-coinsurance?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteCoinsurance(agentCode: number, batchNo: number) {
    return this.api.DELETE(`v1/policies/delete-coinsurance?agnCode=${agentCode}&polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  // getPremiumFinanciers(partyType:string){
  //   let page = 0;
  //   let size = 100;
  //   return this.api.GET(`v2/policies/coInsurance?pageNo=${page}&pageSize=${size}&partyType=${partyType}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  // }
  getPremiumFinanciers(): Observable<PremiumFinanciers[]> {
    let page = 0;
    let size = 1000;
    return this.api.GET<PremiumFinanciers[]>(`v2/financiers?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  policyUtils(transactionCode) {
    const params = new HttpParams()
      .set('transactionCode', transactionCode)
      .set('transactionsType', 'UNDERWRITING')

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });

    return this.http.get(`/${this.computationUrl}/api/v1/utils/payload`, {
      headers: headers,
      params: params
    })
  }
  computePremium(computationDetails) {
    return this.http.post(`/${this.computationUrl}/api/v1/premium-computation`, computationDetails)
  }
  getbypolicyNo(policyNo) {
    return this.api.GET(`v1/policies/filter-policies?policyNo=${policyNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getbyRiskId(riskId) {
    return this.api.GET(`v2/policies/filter-risks?riskId=${riskId}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRisk(ipuCode: number, batchNo: number, productCode: number) {
    return this.api.DELETE(`v1/policies/delete-risks?ipuCode=${ipuCode}&polBatchNo=${batchNo}&proCode=${productCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addInsured(batchNo: number, endorsementNo: string, policyNo: string, clientCode: number) {
    return this.api.POST(`v1/policies/add-insured?polBatchNo=${batchNo}&polEndosNo=${endorsementNo}&polNo=${policyNo}&prpCode=${clientCode}`, "placeholder data", API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }

  deleteInsured(policyInsuredCode: number) {
    return this.api.DELETE(`v1/policies/delete-insured?polinCode=${policyInsuredCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  generateCoverNote(data) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // It should be 'application/json' for JSON data
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });

    // Include responseType: 'text' in the options
    const options = {
      headers: headers,
      responseType: 'text' as 'json' // Cast 'json' is required for Angular's HttpClient
    };
    return this.http.post(`${this.reportsUrl}`, JSON.stringify(data), options)
  }


  getInsureds(batchNo: number): Observable<InsuredApiResponse> {
    return this.api.GET(`v2/policies/get-insureds?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL) as Observable<InsuredApiResponse>;
  }
  editInsureds(data: editInsured) {
    return this.api.PUT(`v1/policies/edit-insured?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  reassignTicket(data) {
    return this.api.POST(`api/v1/tickets`, JSON.stringify(data), API_CONFIG.MNGT_WORKFLOW_BASE_URL)
  }
  getRiskClauses() {
    return this.api.GET(`v2/risk-clauses`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addRemarks(data: Remarks) {
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`v1/remarks?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  editRemarks(data: Remarks) {
    return this.api.PUT(`v1/remarks?`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRemarks(code: any) {
    return this.api.DELETE(`v1/remarks/${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deletePremiumItem(batchNo: any, sectionCode: any) {
    return this.api.DELETE(`v1/risk-section/delete?batchNo=${batchNo}&pilCode=${sectionCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getSubsclassPerils(subclassCode) {
    return this.api.GET(`api/v1/subperils?subclassCode=${subclassCode}`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }
  getRiskPerils(batchNo: any, riskCode: any, subclassCode: any) {
    return this.api.GET(`v1?batchNo=${batchNo}&ipuCode=${riskCode}&subClassCode=${subclassCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }

  // getRiskPerils(){
  //   return this.api.GET(`v2/risk-perils`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  // }
  generateRiskClaimReport(data) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // It should be 'application/json' for JSON data
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });

    // Include responseType: 'text' in the options
    const options = {
      headers: headers,
      responseType: 'text' as 'json' // Cast 'json' is required for Angular's HttpClient
    };
    return this.http.post(`${this.reportsUrl}`, JSON.stringify(data), options)
  }
  deleteRiskPeril(code) {
    return this.api.DELETE(`v2/risk-perils?code=${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getRiskClause(riskCode) {
    return this.api.GET(`v2/risk-clauses/${riskCode}?code=${riskCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRiskClause(riskCode, polClauseCode) {
    return this.api.DELETE(`v1/delete-risk-clause?ipuCode=${riskCode}&polClauseCode=${polClauseCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getRequiredDocuments(showALL: any, subClassCode: any, transLevel: any) {
    return this.api.GET(`v1/submitted-required-documents?showAll=${showALL}&subClassCode=${subClassCode}&transLevel=${transLevel}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  addRequiredDocuments(data: RequiredDocuments, user) {
    return this.api.POST(`v2/submitted-required-documents?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteRequiredDocument(code: any) {
    return this.api.DELETE(`v2/submitted-required-documents/${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getRemarks() {
    return this.api.GET(`v2/remarks`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  populateRequiredDoc(riskCode: any, transType: any, user) {
    return this.api.POST(`v1/submitted-required-documents?ipuCode=${riskCode}&transType=${transType}&user=${user}`, "placeholder data", API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addCommission(data: commission) {
    return this.api.POST(`v1/commissions`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  deleteCommission(code: any) {
    return this.api.DELETE(`v1/commissions/${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicyTaxes(subclassCode: any) {
    return this.api.GET(`v1/policy-taxes?subClassCode=${subclassCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addPolicyTaxes(data: PolicyTaxes) {
    return this.api.POST(`v1/policy-taxes`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  populatePolicyTaxes(data: populatePolicyTaxes) {
    return this.api.POST(`v1/policy-taxes/populate`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deletePolicyTaxes(polCode: any, TransactionCode: any) {
    return this.api.DELETE(`v1/policy-taxes?polCode=${polCode}&trntCode=${TransactionCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getRelatedRisks(riskCode: any, propertId: any) {
    return this.api.GET(`v1/related-risks?ipuCode=${riskCode}&propertyId=${propertId}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  createSchedules(data: PolicyScheduleDetails[]) {
    return this.api.POST(`v2/schedules`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getSchedules() {
    return this.api.GET(`v2/schedules`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  updateSchedules(data: PolicyScheduleDetails[]) {
    return this.api.PUT(`v2/schedules`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getCommissions(binderCode: any, riskCode: any, subclassCode: any) {
    return this.api.GET(`v1/commissions?bindCode=${binderCode}&ipuCode=${riskCode}&subClassCode=${subclassCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getRelationalGroups(subclassCode: any) {
    return this.api.GET(`v1/relation-groups?subClassCode=${subclassCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicyCertificates(riskCode: any, riskId: any) {
    return this.api.GET(`v1/certificates?riskCode=${riskCode}&riskId=${riskId}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getAllCertificates(data: Certificates) {
    return this.api.GET(`v1/certificates/existing`, API_CONFIG.GIS_UNDERWRITING_BASE_URL, data)

  }
  addCertificate(data: AddCertificates) {
    return this.api.POST(`v1/certificates`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  updateCertificate(data: AddCertificates) {
    return this.api.PUT(`v1/certificates`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deleteCertificates(code: any) {
    return this.api.DELETE(`v1/certificates/${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getRiskClass(subclassCode: any, underwritingYear: any) {
    return this.api.GET(`v1/risk-class?subClassCode=${subclassCode}&uwYear=${underwritingYear}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getRequiredDocumentsByCode(code: any) {
    return this.api.GET(`v2/submitted-required-documents/code/${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editRequiredDocuments(data: EditRequiredDocuments) {
    return this.api.PUT(`v1/submitted-required-documents`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getBodyTypes() {
    return this.api.GET(`v2/schedules/body-type`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getMotorColors() {
    return this.api.GET(`v2/schedules/motor-colour`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getSecurityDevices() {
    return this.api.GET(`v2/schedules/security-devices`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }

  editRiskClause(data) {
    return this.api.PUT(`v1/edit-risk-clause`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  getPolicyClauses(batchNo: any, productCode: any, transType: any) {
    return this.api.GET(`v1/policy-clause?polBatchNo=${batchNo}&proCode=${productCode}&transType=${transType}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addPolicyClause(data: AddPolicyClauses) {
    return this.api.POST(`v1/policy-clause`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editPolicyClause(data: EditPolicyClause) {
    return this.api.PUT(`v1/policy-clause`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getMotorAccessories() {
    return this.api.GET(`v2/schedules/motor-accessories`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getApplicableTaxes(subclassCode: any, transactionCategory: any) {
    return this.api.GET(`v1/policy-taxes/applicable-taxes?subclassCode=${subclassCode}&transactionCategory=${transactionCategory}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editPolicyTaxes(data: PolicyTaxes) {
    return this.api.PUT(`v1/policy-taxes`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getClientPolicies(clientCode: any, productCode: any) {
    return this.api.GET(`v1/policies/client-policies?clientCode=${clientCode}&proCode=${productCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  createPolicySubclassesClause(data: SubclassesClauses) {
    return this.api.POST(`v2/policySubclassClauses`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  updatePolicySubclassesClause(data: SubclassesClauses) {
    return this.api.PUT(`v2/policySubclassClauses`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deletePolicySubclassesClause(code: number, batchNo: number, clausecode: number, policyNo: any, subclassCode: number) {
    return this.api.DELETE(`v2/policySubclassClauses?%20code=${code}&batch%20number=${batchNo}&clause%20code=${clausecode}&policy%20Number=${policyNo}&sub%20class%20code=${subclassCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getPolicySubclassClauses(batchNo: any, policyNo: any, proCode: any) {
    return this.api.GET(`v1/sub-class-clauses?batchNo=${batchNo}&policyNo=${policyNo}&proCode=${proCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getClientDDdetails(clientCode: any) {
    return this.api.GET(`v2/client-dd?clientCode=${clientCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  updateClientDDdetails(data: ClientDDdetails) {
    return this.api.PUT(`v1/client-details`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  fetchAddedPolicySubclassClauses(batchNo: any, policyNo: any) {
    return this.api.GET(`v2/policySubclassClauses?batchNo=${batchNo}&policyNo=${policyNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  addRiskPeril(data: RiskPeril) {
    return this.api.POST(`v1/peril`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  addExternalClaimExp(data: ExternalClaimExp) {
    return this.api.POST(`v2/external-claims-experience`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  fetchExternalClaimExp(clientCode: number) {
    return this.api.GET(`v2/external-claims-experience?clientCode=${clientCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  editExternalClaimExp(data: ExternalClaimExp) {
    return this.api.PUT(`v2/external-claims-experience`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  deleteExternalClaimExp(code: number) {
    return this.api.DELETE(`v2/external-claims-experience?code=${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)

  }
  getRiskService(subClassCode: any, coverTypeCode) {
    return this.api.GET(`v1/risk-services?subclassCode=${subClassCode}&coverTypeCode=${coverTypeCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
  fetchInternalClaimExp(
    clientCode: number): Observable<InternalClaimExp[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['clientCode'] = clientCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<InternalClaimExp[]>(`v2/internal-claims-experiences?`, API_CONFIG.GIS_UNDERWRITING_BASE_URL, params);

  }


}

