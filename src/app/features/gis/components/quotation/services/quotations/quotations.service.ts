import {Injectable} from '@angular/core';
import {AppConfigService} from '../../../../../../core/config/app-config-service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {
  CreateLimitsOfLiability,
  EditRisk,
  PremiumComputationRequest,
  premiumPayloadData,
  quotationDTO,
  QuotationPayload,
  quotationRisk,
  RegexPattern,
  riskSection,
  scheduleDetails,
  Sources
} from '../../data/quotationsDTO';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {introducersDTO} from '../../data/introducersDTO';
import {AgentDTO} from '../../../../../entities/data/AgentDTO';
import {Pagination} from '../../../../../../shared/data/common/pagination';
import {riskClauses} from '../../../setups/data/gisDTO';
import {SESSION_KEY} from '../../../../../../features/lms/util/session_storage_enum';
import {StringManipulation} from '../../../../../../features/lms/util/string_manipulation';
import {SessionStorageService} from '../../../../../../shared/services/session-storage/session-storage.service';
import {API_CONFIG} from '../../../../../../../environments/api_service_config';
import {ApiService} from '../../../../../../shared/services/api/api.service';
import {ExternalClaimExp} from '../../../policy/data/policy-dto';
import {ClientDTO} from '../../../../../entities/data/ClientDTO';
import {UtilService} from '../../../../../../shared/services/util/util.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class for interacting with quotation-related APIs.
 * @class QuotationService
 */
export class QuotationsService {
  /**
   * Constructor for QuotationService.
   * @constructor
   * @param {AppConfigService} appConfig - Service for retrieving application configuration.
   * @param {HttpClient} http - HTTP client for making requests.
   */
  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private session_storage: SessionStorageService,
    private api: ApiService,
    private utilService: UtilService
  ) {
  }

  /**
   * Base URL for quotation services obtained from application configuration.
   * @type {string}
   */
  baseUrl = this.appConfig.config.contextPath.gis_services;
  computationUrl = this.appConfig.config.contextPath.computation_service;
  notificationUrl = this.appConfig.config.contextPath.notification_service;
  crmUrl = this.appConfig.config.contextPath.setup_services;

  /**
   * HTTP options for making requests with JSON content type.
   * @type {any}
   */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),

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

  /**
   * Retrieves quotation sources using an HTTP GET request.
   * @method getQuotationSources
   * @return {Observable<any>} - An observable of the response containing quotation sources.
   */
  getAllQuotationSources(): Observable<any> {
    let page = 0;
    let size = 100;

    return this.api.GET<any>(`v2/quotation-sources?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Adds quotation sources using an HTTP POST request.
   * @method addQuotationSources
   */
  addQuotationSources(data: Sources): Observable<any> {

    return this.api.POST<any>(`v2/quotation-sources`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }


  /**
   * Deleted quotation sources using an HTTP DELETE request.
   * @method deleteQuotationSource
   * @return {Observable<any>} - An observable of the response containing quotation sources.
   */
  deleteQuotationSource(code: number): Observable<any> {
    return this.api.DELETE(`v2/quotation-sources?code=${code}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  /**
   * Deleted quotation sources using an HTTP PUT request.
   * @method editQuotationSource
   * @return {Observable<any>} - An observable of the response containing quotation sources.
   */
  editQuotationSource(data: Sources): Observable<any> {
    return this.api.PUT<any>(`v2/quotation-sources`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  /**
   * Creates a new quotation using an HTTP POST request.
   * @method createQuotation
   * @param {quotationDTO} data - The data for creating the quotation.
   * @param {string} user - The user associated with the quotation.
   * @return {Observable<any>} - An observable of the response containing created quotation data.
   */
  createQuotation(data: quotationDTO, user) {
    console.log("Data", JSON.stringify(data))
    return this.api.POST(`v1/quotation?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Retrieves quotations based on specified parameters using an HTTP GET request.
   * @method getQuotations
   * @param {string} clientId - The client ID associated with the quotations.
   * @param {string} dateFrom - The starting date for the quotations.
   * @param {string} dateTo - The ending date for the quotations.
   * @return {Observable<any>} - An observable of the response containing quotation data.
   */
  getQuotations(clientId, dateFrom, dateTo) {
    return this.api.GET(`v2/quotation?dateFrom=${dateFrom}&dateTo=${dateTo}&clientId=${clientId}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Creates a new quotation risk using an HTTP POST request.
   * @method createQuotationRisk
   * @param {string} quotationCode - The quotation code associated with the risk.
   * @param {quotationRisk[]} data - The data representing the quotation risk.
   * @return {Observable<any>} - An observable of the response containing the created quotation risk data.
   */
  // createQuotationRisk(quotationCode, data: quotationRisk[]) {
  //   console.log(JSON.stringify(data), "Data from the service")
  //   return this.api.POST(`v1/quotation-risks?quotationCode=${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  // }
  /**
   * Retrieves risk sections for a given quotation risk code using an HTTP GET request.
   * @method getRiskSection
   * @param {string} quotationRiskCode - The quotation risk code for which to retrieve risk sections.
   * @return {Observable<riskSection[]>} - An observable of the response containing risk sections.
   */
  getRiskSection(quotationRiskCode): Observable<riskSection[]> {
    return this.api.GET<riskSection[]>(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  /**
   * Creates new risk sections for a given quotation risk code using an HTTP POST request.
   * @method createRiskSection
   * @param {string} quotationRiskCode - The quotation risk code associated with the risk sections.
   * @param {riskSection[]} data - The data representing the risk sections.
   * @return {Observable<any>} - An observable of the response containing the created risk sections data.
   */
  createRiskSection(quotationRiskCode, data: riskSection[]) {
    console.log(data, "QUOTATION RISK SECTION")
    return this.api.POST(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }


  createRiskLimits(data: any): Observable<any>{
    return this.api.POST(`v2/risk-limits`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Updates existing risk sections for a given quotation risk code using an HTTP PUT request.
   * @method updateRiskSection
   * @param {string} quotationRiskCode - The quotation risk code associated with the risk sections.
   * @param {riskSection[]} data - The data representing the updated risk sections.
   * @return {Observable<any>} - An observable of the response containing the updated risk sections data.
   */
  updateRiskSection(quotationRiskCode, data: riskSection[]) {
    return this.api.PUT(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  deleteRiskSections(riskSectionCode: number) {
    return this.api.PUT(`v1/risk-sections?riskSectionCode=${riskSectionCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  /**
   * Retrieves details of a quotation using an HTTP GET request.
   * @method getQuotationDetails
   * @param {string} quotationNo - The quotation number for which to retrieve details.
   * @return {Observable<any>} - An observable of the response containing quotation details.
   */
  getQuotationDetails(quotationNo) {
    return this.api.GET(`v2/quotation/view?quotationNo=${quotationNo}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Retrieves introducers using an HTTP GET request.
   * @method getIntroducers
   * @return {Observable<introducersDTO>} - An observable of the response containing introducers data.
   */
  getIntroducers(): Observable<introducersDTO> {
    let page = 0;
    let size = 10

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    return this.api.GET<introducersDTO>(`api/v1/introducers?page=${page}&size=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL);
  }

  /**
   * Computes the premium for a given quotation code using an HTTP POST request.
   * @method computePremium
   * @param {string} quotationCode - The quotation code for which to compute the premium.
   * @return {Observable<any>} - An observable of the response containing the computed premium data.
   */
  // computePremium(quotationCode){
  //   return this.api.POST(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium/${quotationCode}`,this.httpOptions)
  // }
  computePremium(computationDetails) {
    return this.http.post(`/${this.computationUrl}/api/v1/premium-computation`, computationDetails)
  }

  /**

   * Creates new schedule details using an HTTP POST request.
   * @method createSchedule
   * @param {scheduleDetails[]} data - The data representing the schedule details to be created.
   * @return {Observable<any>} - An observable of the response containing the created schedule details data.
   */
  createSchedule(data: scheduleDetails[]) {
    return this.api.POST(`v2/schedule-details`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Updates existing schedule details using an HTTP PUT request.
   * @method updateSchedule
   * @param {scheduleDetails[]} data - The data representing the updated schedule details.
   * @return {Observable<any>} - An observable of the response containing the updated schedule details data.
   */
  updateSchedule(data: scheduleDetails[]) {
    return this.api.PUT(`v2/schedule-details`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
    // return this.api.PUT(`/${this.baseUrl}/quotation//api/v2/schedule-details`, JSON.stringify(data),this.httpOptions)
  }

  /**
   * Retrieves product clauses for a given product code using an HTTP GET request.
   * @method getProductClauses
   * @param {string} productCode - The product code for which to retrieve clauses.
   * @return {Observable<any>} - An observable of the response containing product clauses.
   */
  getProductClauses(productCode) {
    return this.api.GET(`api/v1/products/${productCode}/clauses`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }

  deleteSchedule(level: any, riskCode: any, code: any) {
    return this.api.DELETE<scheduleDetails>(`v2/schedule-details/?level=${level}&riskCode=${riskCode}&scheduleCode=${code}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  makeReady(quotationCode, user) {
    return this.api.POST(`v1/quotation/make-ready/${quotationCode}?user=${user}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  confirmQuotation(quotationCode, user) {
    return this.api.POST(`v1/quotation/confirm/${quotationCode}?user=${user}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  authoriseQuotation(quotationCode, user) {
    return this.api.POST(`v1/quotation/authorise/${quotationCode}?user=${user}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  getExternalClaimsExperience(
    clientCode: number,
    page: number | null = 0,
    size: number | null = 10
  ) {
    return this.api.GET(`api/v2/external-claims-experience?clientCode=${clientCode}&pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_CLAIMS_BASE_URL);
  }

  addExternalClaimExp(data: ExternalClaimExp) {
    return this.api.POST(`api/v2/external-claims-experience`, JSON.stringify(data), API_CONFIG.GIS_CLAIMS_BASE_URL);
  }

  deleteExternalClaimExp(code: number) {
    return this.api.DELETE(`api/v2/external-claims-experience?code=${code}`, API_CONFIG.GIS_CLAIMS_BASE_URL);
  }

  getInternalClaimsExperience(
    clientCode: number,
    page: number | null = 0,
    size: number | null = 10
  ) {
    return this.api.GET(`api/v2/internal-claims-experience?clientCode=${clientCode}&pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_CLAIMS_BASE_URL);
  }


  getAgents(
    page: number | null = 0,
    size: number | null = 10,
    sortList: string = 'createdDate',
  ): Observable<Pagination<AgentDTO>> {
    //  const baseUrl = this.appConfig.config.contextPath.accounts_services;
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Accept': 'application/json',
    //   'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    // });
    // const params = new HttpParams()
    //   .set('page', `${page}`)
    //   .set('size', `${size}`)
    //   .set('organizationId', 2)
    //   .set('sortListFields', `${sortList}`)


    return this.api.GET<Pagination<AgentDTO>>(`agents?page=${page}&size=${size}&organizationId=2&sortListFields=${sortList}`, API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL)
  }

  quotationUtils(transactionCode) {
    const params = new HttpParams()
      .set('transactionCode', transactionCode)
      .set('transactionsType', 'QUOTATION')

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

  sendEmail(data) {
    return this.http.post(`/${this.notificationUrl}/email/send`, JSON.stringify(data), this.httpOptions)
  }

  sendSms(data) {
    return this.http.post(`/${this.notificationUrl}/api/sms/send`, JSON.stringify(data), this.httpOptions)
  }

  getUserProfile() {
    const baseUrl = this.appConfig.config.contextPath.users_services;
    return this.http.get(`/${baseUrl}/administration/users/profile`)
  }

  getLimits(productCode, type, quotRiskCode?) {
    let url = `v1/quotation/scheduleValues?pageSize=100&pageNo=0&quotationProductCode=${productCode}&scheduleValueType=${type}`;

    if (quotRiskCode) {
      url += `&quotRiskCode=${quotRiskCode}`;
    }

    return this.api.GET(url, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  assignProductLimits(productCode) {

    return this.api.POST(`v1/quotation/scheduleValues/auto-populate?quotationProductCode=${productCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  documentTypes(accountType) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });

    return this.api.GET(`required-documents?accountType=${accountType}`, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }

  getRiskClauses(code: number): Observable<riskClauses[]> {
    let page = 0;
    let size = 1000
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })

    return this.api.GET<riskClauses[]>(`v1/riskClauses?riskCode=${code}&page=${page}&pageSize=${size}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  captureRiskClauses(riskCode: number,quoteCode: number,clauseCode: number, productCode: number,subclassCode:number) {
    return this.api.POST(`v2/risk-clauses?riskCode=${riskCode}&quoteCode=${quoteCode}&clauseCode=${clauseCode}&productCode=${productCode}&subclassCode=${subclassCode}`,null, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }


  addProductClause(clauseCode, productCode, quotationCode) {
    const params = new HttpParams()
      .set('clauseCode', clauseCode)
      .set('productCode', productCode)
      .set('quotationCode', quotationCode)

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });

    return this.api.POST(`v1/quotation-product-clause/post-product-clauses?clauseCode=${clauseCode}&productCode=${productCode}&quotationCode=${quotationCode}`, null,API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  postDocuments(data) {
    return this.api.POST(`uploadClientDocument`, JSON.stringify(data), API_CONFIG.DMS_SERVICE)
  }

  getCampaigns() {
    return this.api.GET(`campaigns`, API_CONFIG.CRM_CAMPAIGNS_SERVICE_BASE_URL)

  }

  getRegexPatterns(
    subclassCode: number): Observable<RegexPattern[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode.toString();

    const params = new HttpParams({fromObject: paramsObj});

    return this.api.GET<RegexPattern[]>(`v2/regex/risk-id-format?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }

  /**
   * Fetches a paginated list of insurers with optional sorting.
   *
   * @param page - The page number for pagination (default is 0).
   * @param size - The number of records per page (default is 10).
   * @param sortList - The field used for sorting the results (default is 'createdDate').
   * @returns An observable containing paginated insurer data.
   */
  getInsurers(
    page: number | null = 0,
    size: number | null = 10,
    sortList: string = 'createdDate',
  ): Observable<Pagination<AgentDTO>> {

    // Sends a GET request to retrieve insurers based on pagination and sorting criteria.
    return this.api.GET<Pagination<AgentDTO>>(
      `agents?accountTypeId=5&order=desc&page=${page}&size=${size}&sortListFields=${sortList}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  /**
   * Retrieves the limits of liability based on subclass code and schedule type.
   *
   * @param subclassCode - The subclass code (mandatory).
   * @param scheduleType - The schedule type (default is 'L').
   * @returns An observable containing the liability limits data.
   */
  getLimitsOfLiability(
    subclassCode: number,
    scheduleType: string = 'L'
  ): Observable<any> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};

    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    // Convert the object into URL parameters
    const params = new HttpParams({fromObject: paramsObj});

    // Sends a GET request to fetch limits of liability
    return this.api.GET<Observable<any>>(
      `v2/limits-of-liability/subclass?`,
      API_CONFIG.GIS_QUOTATION_BASE_URL,
      params
    );
  }

  /**
   * Merges a quotation into an existing policy.
   *
   * @param quotProductCode - The product code of the quotation.
   * @param batchNo - The batch number of the quotation.
   * @returns An observable confirming the merge action.
   */
  mergeToPolicy(
    quotProductCode: number,
    batchNo: number
  ) {
    // Sends a POST request to merge a quotation into an existing policy
    return this.api.POST(
      `v1/quotation/merge-to-existing-policy?batchNo=${batchNo}&quotationProductCode=${quotProductCode}`, null,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }

  /**
   * Retrieves mergeable policies for a given quotation and product code.
   *
   * @param quotationCode - The unique code of the quotation.
   * @param productCode - The product code associated with the quotation.
   * @returns An observable containing the list of mergeable policies.
   */
  getPolicies(
    quotationCode: number,
    productCode: number
  ) {
    // Sends a GET request to fetch mergeable policies based on quotation and product code
    return this.api.GET(
      `v2/quotation-policy/mergeable?quotationCode=${quotationCode}&productCode=${productCode}`,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }

  processQuotation(data: QuotationPayload):Observable<any> {
    return this.api.POST<any>(`v2/quotation/process-quotation`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  getFormFields(shortDescription: any): Observable<any> {

    return this.api.GET<any>(`api/v1/forms?shortDescription=${shortDescription}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  premiumComputationEngine(payload: PremiumComputationRequest): Observable<any> {
    return this.api.POST<any[]>(`api/v1/premium-computation`, JSON.stringify(payload), API_CONFIG.PREMIUM_COMPUTATION,);

    console.log("Premium Payload after", payload)

  }

  searchClients(
    columnName: string = null,
    columnValue: string = null,
    page: number,
    size: number = 5,
    name: string,
    idNumber: string = null,
  ): Observable<Pagination<ClientDTO>> {
    const params = new HttpParams()
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`)
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('idNumber', `${idNumber}`);

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<ClientDTO>>(
      `clients`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getTaxes(
    productCode: number,
    subClassCode: number,
  ): Observable<any> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['productCode'] = productCode.toString();
    paramsObj['subClassCode'] = subClassCode.toString();

    const params = new HttpParams({fromObject: paramsObj});

    return this.api.GET(`v2/taxes?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  getClauses(
    covertypeCode: number,
    subclassCode: number,): Observable<any> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['coverTypeCode'] = covertypeCode?.toString();
    paramsObj['subclassCode'] = subclassCode?.toString();

    const params = new HttpParams({fromObject: paramsObj});

    return this.api.GET<any>(`v2/clauses?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }

  getExcesses(
    subclassCode: number,
    scheduleType: string = 'E'
  ): Observable<any> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    const params = new HttpParams({fromObject: paramsObj});

    return this.api.GET<Observable<any>>(`v2/limits-of-liability/subclass?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  addLimitsOfLiability(data: CreateLimitsOfLiability[]): Observable<any> {
    return this.api.POST<any>(`v2/limits-of-liability`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  addClauses(
    clauseCodes: number[], // Accept an array of clause codes
    productCode: number,
    quotCode: number,
    riskCode: number
  ):Observable<any> {
    // Construct the payload
    const payload = {
      clauseCodes, // Send all clause codes in a single object
    };

    // Construct query parameters for the other mandatory parameters
    const params = new HttpParams()
      .set('productCode', productCode.toString())
      .set('quotCode', quotCode.toString())
      .set('riskCode', riskCode.toString());

    // Call the API with the payload and query parameters
    return this.api.POST<any>(`v2/clauses?${params.toString()}`, payload, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  updateQuotationRisk(data: EditRisk) {
    return this.api.PUT(`v2/quotationRisks`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  deleteRisk(quotRiskCode: number,) {
    return this.api.DELETE(`v2/quotationRisks?quotRiskCode=${quotRiskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  getClientQuotations(quotationNo) {
    return this.api.GET(`v2/quotation/view?quotationNo=${quotationNo}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  updatePremium(quotationCode: any, data: premiumPayloadData) {

    return this.api.POST(`v2/quotation/update-premium/${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL,);
  }

  createQuotationRisk(quotationCode, data: quotationRisk[]):Observable<any> {
    return this.api.POST<any>(`v2/quotationRisks?quotationCode=${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }


  getUserOrgId(userId: number): Observable<any> {
    return this.api.GET<Observable<any>>(`users/${userId}`, API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL)
  }

  getExchangeRates(quotCurrencyId: number, orgId: number): Observable<any> {
    return this.api.GET<Observable<any>>(`v2/exchange-rates?quotCurrencyId=${quotCurrencyId}&orgId=${orgId}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  convertQuoteToPolicy(
    quotCode: number,
  ): Observable<any> {
    return this.api.POST(`v2/quotation/convert-to-policy?quotCode=${quotCode}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL);

  }

  convertToNormalQuote(
    quotCode: number,
  ) {
    const paramsObj: { [param: string]: string | number } = {};

    // Add mandatory parameters with default values
    paramsObj['quotCode'] = quotCode.toString();

    // Create HttpParams from the paramsObj
    const params = new HttpParams({fromObject: paramsObj});
    return this.api.GET(`v2/quotation/convert-to-normal-quot?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  updateQuotationDetails(user: string, quotationCode: number, quotationNumber: string, data: quotationDTO) {
    return this.api.PUT(`v1/quotation?user=${user}&quotationCode=${quotationCode}&quotationNumber=${quotationNumber}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  getSimilarQuotes(
    quotationProductCode: number
  ) {

    return this.api.GET(`v2/quotation/similar-quotes?quotationProductCode=${quotationProductCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  updateQuotationStatus(quotationCode: number, status: string, reasonCancelled: string) {

    return this.api.PUT(`v2/quotation/status?quotationCode=${quotationCode}&status=${status}&reasonCancelled=${reasonCancelled}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL);

  }

  savePremiumComputationPayload(data: PremiumComputationRequest): Observable<any> {
    return this.api.POST<any[]>(`api/v1/computation-payload?`, JSON.stringify(data), API_CONFIG.PREMIUM_COMPUTATION,);
  }

  getPremiumComputationPayload(code: number): Observable<any> {
    return this.api.GET<any[]>(`api/v1/computation-payload?code=${code}`, API_CONFIG.PREMIUM_COMPUTATION,);
  }

  updatePremiumComputationPayload(code: number, payload: any): Observable<any> {
    return this.api.PUT<any[]>(`api/v1/computation-payload/${code}`, JSON.stringify(payload), API_CONFIG.PREMIUM_COMPUTATION)
  }
}

