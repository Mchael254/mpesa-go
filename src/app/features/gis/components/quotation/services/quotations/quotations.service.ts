import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  CreateLimitsOfLiability,
  CreateRiskCommission,
  EditRisk,
  OtpPayload,
  premiumPayloadData,
  QuotationComment,
  quotationDTO, QuotationReportDto,
  quotationRisk,
  QuotationUpdate,
  RegexPattern,
  ReportPayload,
  RiskCommissionDto,
  riskSection, RiskValidationDto,
  scheduleDetails,
  Sources,
  TaxPayload
} from '../../data/quotationsDTO';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { Introducer } from '../../data/introducersDTO';
import { AgentDTO } from '../../../../../entities/data/AgentDTO';
import { Pagination } from '../../../../../../shared/data/common/pagination';
import { riskClauses } from '../../../setups/data/gisDTO';
import { SESSION_KEY } from '../../../../../lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { ExternalClaimExp } from '../../../policy/data/policy-dto';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { UtilService } from '../../../../../../shared/services';
import { map } from "rxjs/operators";
import { QuotationsDTO, riskClause, riskPeril, UpdatePremiumDto } from 'src/app/features/gis/data/quotations-dto';
import { ComputationPayloadDto, PremiumComputationRequest, ProductLevelPremium } from "../../data/premium-computation";
import { QuotationDetailsRequestDto } from "../../data/quotation-details";
import { EmailDto } from "../../../../../../shared/data/common/email-dto";

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
  //remember


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

  generateQuotationReport(data: QuotationReportDto): Observable<any> {
    return this.api.POST<any>(`api/v1/reports/quotation-report`, JSON.stringify(data), API_CONFIG.REPORT_SERVICE_BASE_URL);
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

  getQuotationsClient(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<QuotationsDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.api.GET<Pagination<QuotationsDTO>>(`v1/quotations/client/` + id, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  /**
   * Retrieves risk sections for a given quotation risk code using an HTTP GET request.
   * @method getRiskSection
   * @param {string} quotationRiskCode - The quotation risk code for which to retrieve risk sections.
   * @return {Observable<riskSection[]>} - An observable of the response containing risk sections.
   */
  getRiskSection(quotationCode: number): Observable<riskSection[]> {
    return this.api.GET<riskSection[]>(`v2/risk-limits?quotationCode=${quotationCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)

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
    return this.api.POST<any>(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }


  createRiskLimits(data: any): Observable<any> {
    return this.api.POST<any>(`v2/risk-limits`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
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

  deleteRiskSections(limitCode: number) {
    return this.api.DELETE(`v2/risk-limits?limitCode=${limitCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }

  /**
   * Retrieves details of a quotation using an HTTP GET request.
   * @method getQuotationDetails
   * @param {string} quotationNo - The quotation number for which to retrieve details.
   * @return {Observable<any>} - An observable of the response containing quotation details.
   */
  getQuotationDetails(quotationCode: number) {
    return this.api.GET(`v2/quotation/view?quotationCode=${quotationCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Retrieves introducers using an HTTP GET request.
   * @method getIntroducers
   * @return {Observable<Introducer>} - An observable of the response containing introducers data.
   */
  getIntroducers(): Observable<Introducer[]> {
    let page = 0;
    let size = 10000

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
    });
    return this.api.GET<Introducer[]>(`api/v1/introducers?page=${page}&size=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL);
  }

  /**
   * Computes the premium for a given quotation code using an HTTP POST request.
   * @method computePremium
   * @param {string} quotationCode - The quotation code for which to compute the premium.
   * @return {Observable<any>} - An observable of the response containing the computed premium data.
   */
  computePremium(computationDetails): Observable<any> {
    return this.http.post<any>(`/${this.computationUrl}/api/v1/premium-computation`, computationDetails)
  }

  /**

   * Creates new schedule details using an HTTP POST request.
   * @method createSchedule
   * @param {scheduleDetails[]} data - The data representing the schedule details to be created.
   * @return {Observable<any>} - An observable of the response containing the created schedule details data.
   */
  createSchedule(data: scheduleDetails) {
    return this.api.POST(`v2/schedule-details`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  /**
   * Updates existing schedule details using an HTTP PUT request.
   * @method updateSchedule
   * @param {scheduleDetails[]} data - The data representing the updated schedule details.
   * @return {Observable<any>} - An observable of the response containing the updated schedule details data.
   */
  updateSchedule(data: scheduleDetails) {
    return this.api.PUT(`v2/schedule-details`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
    // return this.api.PUT(`/${this.baseUrl}/quotation//api/v2/schedule-details`, JSON.stringify(data),this.httpOptions)
  }

  /**
   * Retrieves product clauses for a given product code using an HTTP GET request.
   * @method getProductClauses
   * @param {string} productCode - The product code for which to retrieve clauses.
   * @return {Observable<any>} - An observable of the response containing product clauses.
   */
  createQuotationProductClauses(productClauses: any) {
    return this.api.POST(`v2/quotation-product-clauses`, JSON.stringify(productClauses), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  getProductClauses(productCode): Observable<any> {
    return this.api.GET<any>(`api/v1/products/${productCode}/clauses`, API_CONFIG.GIS_SETUPS_BASE_URL)
  }

  getQuotationProductClauses(quotationProductCode: number) {
    return this.api.GET(`v2/quotation-product-clauses?quotationProductCode=${quotationProductCode}`,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }


  deleteSchedule(level: any, riskCode: any, code: any) {
    return this.api.DELETE<scheduleDetails>(`v2/schedule-details?level=${level}&riskCode=${riskCode}&scheduleCode=${code}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
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
    clientCode: number
  ) {
    return this.api.GET(`v2/external-claims-experience?clientCode=${clientCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  addExternalClaimExp(data: ExternalClaimExp) {
    return this.api.POST(`v2/external-claims-experience`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  editExternalClaimExp(data: ExternalClaimExp) {
    return this.api.PUT(`v2/external-claims-experience`, JSON.stringify(data), API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  deleteExternalClaimExp(code: number) {
    return this.api.DELETE(`v2/external-claims-experience?code=${code}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  getInternalClaimsExperience(
    clientCode: number
  ) {
    return this.api.GET(`v2/internal-claims-experiences?clientCode=${clientCode}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }


  getAgents(
    page: number | null = 0,
    size: number | null = 2000,
    sortList: string = 'createdDate',
  ): Observable<Pagination<AgentDTO>> {
    return this.api.GET<Pagination<AgentDTO>>(`agents?page=${page}&size=${size}&sortListFields=${sortList}`, API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL)
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

  sendEmail(data: EmailDto): Observable<any> {
    return this.http.post<any>(`/${this.notificationUrl}/email/send`, JSON.stringify(data), this.httpOptions)
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

  captureRiskClauses(riskCode: number, subClassCode: number, quoteCode: number, clauseCode: number, productCode: number) {
    return this.api.POST(`v2/risk-clauses?riskCode=${riskCode}&subClassCode=${subClassCode}&quoteCode=${quoteCode}&clauseCode=${clauseCode}&productCode=${productCode}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }


  addProductClause(data: any) {

    return this.api.POST(`v2/quotation-product-clauses`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
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

    const params = new HttpParams({ fromObject: paramsObj });

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

  processQuotation(data: QuotationDetailsRequestDto): Observable<any> {
    return this.api.POST<any>(`v2/quotation/process-quotation`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )

  }

  processQuickQuotation(data: QuotationDetailsRequestDto): Observable<any> {
    return this.api.POST<any>(`v2/quotation/process-quick-quotation`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )


  }

  getFormFields(shortDescription: any): Observable<any> {

    return this.api.GET<any>(`api/v1/forms?shortDescription=${shortDescription}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  premiumComputationEngine(payload: PremiumComputationRequest): Observable<ProductLevelPremium> {
    return this.api.POST<ProductLevelPremium>(`api/v1/premium-computation`, JSON.stringify(payload), API_CONFIG.PREMIUM_COMPUTATION);

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
    const paramsObj: { [param: string]: string } = {};
    paramsObj['productCode'] = productCode.toString();
    paramsObj['subClassCode'] = subClassCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET(`v2/taxes?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }



  addTaxes(
    generatedQuotCode: number,
    newQpCode: number,
    payload: TaxPayload[]
  ): Observable<any> {
    const params = new HttpParams()
      .set('generatedQuotCode', generatedQuotCode)
      .set('newQpCode', newQpCode);

    return this.api.POST<any>(
      `v2/taxes?${params.toString()}`,
      payload,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }

  updateTaxes(payload: TaxPayload): Observable<any> {
    return this.api.PUT<any>(
      'v2/taxes',
      payload,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }



  //  getExceptions(quotationCode: number, user: string): Observable<any> {
  //     return this.api.POST<any>(`v2/authorise/manage-exceptions?quotationCode=${quotationCode}&def=QUOTE&user=${user}`, null,API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
  //       retry(1),
  //       catchError(this.errorHandl)
  //     )
  // }
  getExceptions(quotationCode: number): Observable<any> {
    const params = new HttpParams()
      .set('batchNumber', quotationCode.toString())
      .set('level', 'Q');

    return this.api.GET(
      `v2/uw-exceptions?${params.toString()}`,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  authorizeQuote(quotationCode: number, user: string): Observable<any> {
    const params = new HttpParams()
      .set('quotationCode', quotationCode.toString())
      .set('user', user);

    return this.api.POST(
      `v2/authorise?${params.toString()}`,
      null,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }





  AuthoriseExceptions(quotationCode: number, user: string): Observable<any> {
    const params = new HttpParams()
      .set('quotationCode', quotationCode.toString())
      .set('user', user);

    return this.api.POST(
      `v2/authorise?${params.toString()}`,
      null,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }

  getRiskLimitsOfLiability(
    subClassCode: number,
    quotationProductCode: number,
    scheduleType: 'L' | 'E'
  ): Observable<any> {
    const paramsObj: { [param: string]: string } = {
      subclassCode: subClassCode.toString(),
      quotationProductCode: quotationProductCode.toString(),
      scheduleType: scheduleType
    };

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<any>(
      `v2/limits-of-liability`,
      API_CONFIG.GIS_QUOTATION_BASE_URL,
      params
    );
  }


  deleteProductTaxes(taxCode: number): Observable<any> {
    return this.api.DELETE<any>(
      `v2/taxes?qptCode=${taxCode}`,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
  }




  // getExcessAndComments(
  //   subClassCode: number,
  //   quotationProductCode: number
  // ): Observable<any> {
  //   const paramsObj: { [param: string]: string } = {
  //     subclassCode: subClassCode.toString(),
  //     quotationProductCode: quotationProductCode.toString(),
  //     scheduleType: 'E'
  //   };

  //   const params = new HttpParams({ fromObject: paramsObj });

  //   return this.api.GET<any>(
  //     `v2/limits-of-liability`,
  //     API_CONFIG.GIS_QUOTATION_BASE_URL,
  //     params
  //   );
  // }



  getClauses(
    covertypeCode: number,
    subclassCode: number,): Observable<any> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['coverTypeCode'] = covertypeCode?.toString();
    paramsObj['subclassCode'] = subclassCode?.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<any>(`v2/clauses?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }

  //excesses
  getExcesses(
    subclassCode: number,
    scheduleType: string = 'E'
  ): Observable<any> {
    const paramsObj: { [param: string]: string } = {};
    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Observable<any>>(`v2/limits-of-liability/subclass?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  addExcesses(newQpCode: number, excessesPayload: CreateLimitsOfLiability[]): Observable<any> {
    const queryParam = `?newQpCode=${newQpCode}`;
    return this.api.POST<any>(`v2/limits-of-liability${queryParam}`, JSON.stringify(excessesPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  getAddedExcesses(subclassCode: number, quotationProductCode: number, scheduleType: string = 'E'): Observable<any> {
    const params = new HttpParams()
      .set('subclassCode', subclassCode.toString())
      .set('quotationProductCode', quotationProductCode.toString())
      .set('scheduleType', scheduleType);
    return this.api.GET<any>(`v2/limits-of-liability?${params.toString()}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  editExcesses(newQpCode: number, excessesPayload: CreateLimitsOfLiability[]): Observable<any> {
    const queryParam = `?newQpCode=${newQpCode}`;
    return this.api.POST<any>(`v2/limits-of-liability${queryParam}`, JSON.stringify(excessesPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  deleteExcesses(scheduleValueCode: number): Observable<any> {
    return this.api.DELETE<any>(`v2/limits-of-liability?scheduleValueCode=${scheduleValueCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  //limits of liability
  getLimitsOfLiability(subclassCode: number, scheduleType: string = 'L'): Observable<any> {
    const paramsObj: { [param: string]: string } = {};

    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Observable<any>>(`v2/limits-of-liability/subclass?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  addLimitsOfLiability(newQpCode: number, limitPayload: CreateLimitsOfLiability[]): Observable<any> {
    const queryParam = `?newQpCode=${newQpCode}`;
    return this.api.POST<any>(`v2/limits-of-liability${queryParam}`, JSON.stringify(limitPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  getAddedLimitsOfLiability(subclassCode: number, quotationProductCode: number, scheduleType: 'L'): Observable<any> {
    const params = new HttpParams()
      .set('subclassCode', subclassCode.toString())
      .set('quotationProductCode', quotationProductCode.toString())
      .set('scheduleType', scheduleType);

    return this.api.GET<any>(`v2/limits-of-liability?${params.toString()}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  editLimitsOfLiability(newQpCode: number, limitPayload: CreateLimitsOfLiability[]): Observable<any> {
    const queryParam = `?newQpCode=${newQpCode}`;
    return this.api.POST<any>(`v2/limits-of-liability${queryParam}`, JSON.stringify(limitPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  deleteLimit(scheduleValueCode: number): Observable<any> {
    return this.api.DELETE<any>(`v2/limits-of-liability?scheduleValueCode=${scheduleValueCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  //risk clauses
  addClauses(
    clauseCodes: number[], // Accept an array of clause codes
    productCode: number,
    quotCode: number,
    riskCode: number
  ): Observable<any> {
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

  getClientQuotations(quotationNo): Observable<any> {
    return this.api.GET<any>(`v2/quotation/view?quotationNo=${quotationNo}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      map((details) => {
        const mappedProductsData = details.quotationProducts.map((product) => {
          const totalTax = product.taxInformation.reduce((sum, tax) => sum + tax.taxAmount, 0);
          return {
            ...product,
            totalTax: totalTax,
            premiumAmount: product.premium - totalTax
          }
        })
        return {
          ...details,
          quotationProducts: mappedProductsData
        }
      })
    )
  }

  updatePremium(quotationCode: any, data: premiumPayloadData) {

    return this.api.POST(`v2/quotation/update-premium/${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL,).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  createQuotationRisk(quotationCode, data: quotationRisk[]): Observable<any> {
    return this.api.POST<any>(`v2/quotationRisks?quotationCode=${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }


  getUserOrgId(userId: number): Observable<any> {
    return this.api.GET<Observable<any>>(`users/${userId}`, API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL)
  }

  getExchangeRates(quotCurrencyId: number, orgId: number): Observable<any> {
    return this.api.GET<Observable<any>>(`v2/exchange-rates?quotCurrencyId=${quotCurrencyId}&orgId=${orgId}`, API_CONFIG.GIS_QUOTATION_BASE_URL,).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  convertQuoteToPolicy(
    quotCode: number,
    quotationProductCode: number
  ): Observable<any> {
    return this.api.POST(`v2/quotation/convert-to-policy?quotCode=${quotCode}&quotationProductCode=${quotationProductCode}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL);

  }

  convertToNormalQuote(
    quotCode: number,
  ) {
    const paramsObj: { [param: string]: string | number } = {};

    // Add mandatory parameters with default values
    paramsObj['quotCode'] = quotCode.toString();

    // Create HttpParams from the paramsObj
    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.GET(`v2/quotation/convert-to-normal-quot?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  updateQuotePremium(quotationCode: number, payload: UpdatePremiumDto) {
    return this.api.POST(
      `v2/quotation/update-premium/${quotationCode}`,
      payload,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    );
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

  savePremiumComputationPayload(data: ComputationPayloadDto): Observable<any> {
    return this.api.POST<any[]>(`api/v1/computation-payload`, JSON.stringify(data), API_CONFIG.PREMIUM_COMPUTATION,);
  }

  getPremiumComputationPayload(code: number): Observable<any> {
    return this.api.GET<any[]>(`api/v1/computation-payload?code=${code}`, API_CONFIG.PREMIUM_COMPUTATION,);
  }

  updatePremiumComputationPayload(code: number, payload: any): Observable<any> {
    return this.api.PUT<any[]>(`api/v1/computation-payload/${code}`, JSON.stringify(payload), API_CONFIG.PREMIUM_COMPUTATION)
  }

  validateRiskExistence(payload: RiskValidationDto): Observable<any> {
    return this.api.POST<any>(`v2/risks/validate`, JSON.stringify(payload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  deleteQuotationProduct(quotationCode: number, quotationProductCode: number) {
    return this.api.DELETE(`/v2/quotation-products?quotationCode=${quotationCode}&quotationProductCode=${quotationProductCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  searchQuotations(

    pageNo: number = 0,        // Default value is 0
    pageSize: number = 10,     // Default value is 10
    clientType?: string,
    clientCode?: number,
    productCode?: number,
    dateFrom?: string,
    dateTo?: string,
    agentCode?: number,
    quotationNumber?: string,
    status?: string,
    source?: string,
    clientName?: string

  ) {
    const paramsObj: { [param: string]: string | number } = {};

    // Format today's date as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Use today's date as default for dateFrom if not provided
    // paramsObj['dateFrom'] = dateFrom;

    // Add mandatory parameters with default values
    paramsObj['pageNo'] = pageNo.toString();
    paramsObj['pageSize'] = pageSize.toString();

    // Add optional parameters if provided
    if (clientType) {
      paramsObj['clientType'] = clientType;
    }
    if (clientCode) {
      paramsObj['clientCode'] = clientCode;
    }
    if (productCode) {
      paramsObj['productCode'] = productCode;
    }
    if (dateFrom) {
      paramsObj['dateFrom'] = dateFrom
    }
    if (dateTo) {
      paramsObj['dateTo'] = dateTo;
    }
    if (agentCode) {
      paramsObj['agentCode'] = agentCode;
    }
    if (quotationNumber) {
      paramsObj['quotationNumber'] = quotationNumber;
    }
    if (status) {
      paramsObj['status'] = status;
    }
    if (source) {
      paramsObj['source'] = source;
    }
    if (clientName) {
      paramsObj['clientName'] = clientName;
    }

    // Create HttpParams from the paramsObj
    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.GET(`v2/quotation/search`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  //perils
  getSubclassSectionPeril(subclassCode: number, pageNumber: number = 0, pageSize: number = 20): Observable<any> {

    return this.api.GET<any[]>(`/v2/subclass-section-perils?subclassCode=${subclassCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`, API_CONFIG.GIS_QUOTATION_BASE_URL);

  }

  addSubclassSectionPeril(perilsPayload: riskPeril): Observable<any> {
    return this.api.POST<any>(`v2/quotation-risk-excesses`, perilsPayload, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getQuotationPerils(riskCode: string | number): Observable<any> {
    return this.api.GET<any>(`v2/quotation-excesses?riskCode=${riskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }


  updateSubclassSectionPeril(id: string | number, perilPayload: riskPeril): Observable<any> {
    return this.api.PUT<any>(`v2/quotation-risk-excesses/${id}`, JSON.stringify(perilPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  deleteSubclassSectionPeril(id: string | number): Observable<any> {
    return this.api.DELETE<any>(`v2/quotation-risk-excesses/${id}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }



  // reviseQuotation(quotCode: number, newQuote: string = "N"): Observable<any> {
  //   return this.api.POST<any[]>(`v2/revise?quotCode=${quotCode}&newQuote=${newQuote}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL,);
  // }

  updateQuotationComment(payload: QuotationComment): Observable<any> {
    return this.api.PUT<any>(`v2/quotation/comment`, JSON.stringify(payload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  updateQuotation(payload: QuotationUpdate): Observable<any> {
    return this.api.POST<any[]>(`v2/quotation/update`, JSON.stringify(payload), API_CONFIG.GIS_QUOTATION_BASE_URL,).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  //risk clauses
  addRiskClause(payload: riskClause): Observable<any> {
    return this.api.POST<any>(`v2/quotation-risk-clauses`, payload, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getAddedRiskClauses(riskCode: string | number): Observable<any> {
    return this.api.GET<any>(`v2/quotation-risk-clauses?riskCode=${riskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  editRiskClause(payload: riskClause): Observable<any> {
    return this.api.PUT<any>(`v2/quotation-risk-clauses`, payload, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  deleteRiskClause(clauseCode: number, riskCode: number): Observable<any> {
    return this.api.DELETE(
      `/v2/quotation-risk-clauses?clauseCodes=${clauseCode}&quotRiskCode=${riskCode}`,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  //revisions
  getQuotationRevision(quotationCode: number): Observable<any> {
    const url = `/v1/quotation/revisions?parentQuotationCode=${quotationCode}`;
    return this.api.GET<any[]>(url, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  //comments
  getQuotationComments(clientCode: number): Observable<any> {
    const url = `/v2/quotation/comments?clientCode=${clientCode}`;
    return this.api.GET<any[]>(url, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  getTransactionTypes(): Observable<any> {
    let page = 0;
    let size = 1000
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })

    return this.api.GET<any>(`api/v1/transaction-types?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  getScheduleLevels(screenCode: string): Observable<any> {
    return this.api.GET<any>(`v1/schedule-screen-levels?screenCode=${screenCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }

  getUserBranches(userCode: string): Observable<any> {
    return this.api.GET<any>(`user-branches?userCode=${userCode}`, API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  deleteDetailedQuotationRisk(quotationRiskCode: number) {
    return this.api.DELETE(`v2/quotation/detailed-quot-risk?quotationRiskCode=${quotationRiskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );

  }
  fetchLimitationOfUse() {
    return this.api.GET(`v2/limitation-of-use`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  getGroupedUserDetails(groupid: number) {
    return this.api.GET(`user-groups/${groupid}/users`, API_CONFIG.USER_ADMINISTRATION_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  readScannedDocuments(payload: any /*AiDocumentHubRequest*/): Observable<any> {
    return this.api.AI_DOC_UPLOAD(
      'ai-helper/document-extract',
      payload,
      API_CONFIG.AI_DOCUMENT_SERVICE
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }


  generateOTP(payload: OtpPayload) {
    return this.api.POST<any>(`v2/otp/generate-and-send`, payload, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  verifyOTP(user: string, otp: number) {
    return this.api.POST<any>(`v2/otp/verify?userIdentifier=${user}&otp=${otp}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1),
      // catchError(this.errorHandl)
    );
  }
  fetchReports(system: number, applicationLevel: string) {
    return this.api.GET(`reports?system=${system}&applicationLevel=${applicationLevel}`, API_CONFIG.REPORT_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  // generateReports(reportPayload: ReportPayload) {
  //   return this.api.POST<any>(
  //     `reports`,
  //     reportPayload,
  //     API_CONFIG.REPORT_SERVICE_BASE_URL
  //   ).pipe(
  //     retry(1),
  //     catchError(this.errorHandl)
  //   );
  // }
  generateReports(data: any) {

    return this.api.POSTBYTE('reports', data, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }


  fetchReportParams(reportCode: number) {
    return this.api.GET(`reports/${reportCode}`, API_CONFIG.REPORT_SERVICE_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

  //risk commissions
  getCommissions(subclassCode: number, accountCode: number, binderCode: number): Observable<any> {
    const paramsObj: { [param: string]: string } = {
      sclCode: subclassCode.toString(),
      actCode: accountCode.toString(),
      bindCode: binderCode.toString()
    };

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<any>(`api/v1/applicable-commission`, API_CONFIG.GIS_SETUPS_BASE_URL, params);
  }

  addRiskCommission(commissionPayload: CreateRiskCommission): Observable<any> {
    return this.api.POST<any>('v2/risk-commission', JSON.stringify(commissionPayload), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  getAddedCommissions(quoteCode: number) {
    return this.api.GET(`v2/risk-commission?quoteCode=${quoteCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
      retry(1), catchError(this.errorHandl)
    );
  }



  updateRiskCommission(payload: RiskCommissionDto): Observable<any> {
    return this.api.POST(
      'v2/risk-commission',
      payload,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    ).pipe(retry(1), catchError(this.errorHandl));
  }
  deleteRiskCommission(code: number): Observable<any> {
    return this.api.DELETE<any>(
      `v2/risk-commission?code=${code}`,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }
  reviseQuote(quotationCode: number, createNewQuotation: 'Y' | 'N' = 'N'): Observable<any> {
    return this.api.POST<any>(
      `v1/quotation/revise/${quotationCode}?createNewQuotation=${createNewQuotation}`,
      null,
      API_CONFIG.GIS_QUOTATION_BASE_URL
    ).pipe(
      retry(1),
      catchError(this.errorHandl)
    );
  }

searchQuotation(
  quotationNumber: string,
  pageNo: number = 0,
  pageSize: number = 10
): Observable<any> {
  const params = new HttpParams()
    .set('quotationNumber', quotationNumber)
    .set('pageNo', pageNo.toString())
    .set('pageSize', pageSize.toString());

  return this.api.GET<any>(
    `v2/quotation/search`,
    API_CONFIG.GIS_QUOTATION_BASE_URL,  
    params
  ).pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}

getRiskCommissions(quoteCode: string): Observable<any> {
  const params = new HttpParams().set('quoteCode', quoteCode);

  return this.api.GET<any>(
    `v2/risk-commission`,
    API_CONFIG.GIS_QUOTATION_BASE_URL,
    params
  ).pipe(
    retry(1),
    catchError(this.errorHandl)
  );
}






}



