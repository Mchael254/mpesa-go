import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { APP_CONFIG, AppConfigService } from '../../../../core/config/app-config-service'
import { Observable, catchError, retry, throwError } from "rxjs";
import { Pagination } from "../../../../shared/data/common/pagination";
import { QuotationsDTO } from '../../data/quotations-dto';
import { Clause, CreateLimitsOfLiability, EditRisk, Excesses, LimitsOfLiability, PremiumComputationRequest, quotationDTO, quotationRisk, RegexPattern, riskSection, premiumPayloadData } from '../../components/quotation/data/quotationsDTO';
import { environment } from '../../../../../environments/environment';
import { SessionStorageService } from "../../../../shared/services/session-storage/session-storage.service";
import { ApiService } from "../../../../shared/services/api/api.service";
import { API_CONFIG } from "../../../../../environments/api_service_config";
import { SESSION_KEY } from "../../../lms/util/session_storage_enum";
import { StringManipulation } from "../../../lms/util/string_manipulation";
import { ClientDTO } from '../../../../features/entities/data/ClientDTO';
import { UtilService } from '../../../../shared/services';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {

  // baseUrl = this.appConfig.config.contextPath.gis_services;
  // setupsbaseurl = "setups/api/v1";
  // notificationUrl = this.appConfig.config.contextPath.notification_service;

  // computationBaseUrl = this.appConfig.config.contextPath.computation_service;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-tenantid': 'v6test'

    })
  }

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    private api: ApiService,
    private utilService: UtilService
  ) { }

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
  getQuotations(
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
  getAllQuotationSources(): Observable<any> {
    let page = 0;
    let size = 10;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })

    return this.api.GET<any>(`v2/quotation-sources?pageNo=${page}&pageSize=${size}`, API_CONFIG.GIS_QUOTATION_BASE_URL).pipe(
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
  createQuotation(data: quotationDTO, user) {
    return this.api.POST(`v1/quotation?user=${user}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  getRiskSection(quotationRiskCode): Observable<riskSection[]> {
    return this.api.GET<riskSection[]>(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  createRiskSection(quotationRiskCode, data: riskSection[]) {
    return this.api.POST(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  updateRiskSection(quotationRiskCode, data: riskSection[]) {
    return this.api.PUT(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  getClientQuotations(quotationNo) {
    return this.api.GET(`v2/quotation/view?quotationNo=${quotationNo}`, API_CONFIG.GIS_QUOTATION_BASE_URL)
  }
  // computePremium(quotationCode) {
  //   return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium?quotationCode=${quotationCode}`, {});
  // }
  computePremium(quotationCode) {
    const params = new HttpParams().set('quotationCode', quotationCode);
    return this.api.POST(`api/v1/premium-computation/${quotationCode}`, null, API_CONFIG.PREMIUM_COMPUTATION);
  }
  quotationUtils(
    transactionCode: number,
    transactionsType: string = 'QUOTATION'
  ) {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['transactionCode'] = transactionCode.toString();
    paramsObj['transactionsType'] = transactionsType;

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET(`api/v1/utils/payload`, API_CONFIG.PREMIUM_COMPUTATION, params);

  }

  premiumComputationEngine(payload: PremiumComputationRequest): Observable<any> {
    return this.api.POST<any[]>(`api/v1/premium-computation`, JSON.stringify(payload), API_CONFIG.PREMIUM_COMPUTATION,);

    console.log("Premium Payload after", payload)

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
  getClauses(
    covertypeCode: number,
    subclassCode: number,): Observable<Clause[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['coverTypeCode'] = covertypeCode?.toString();
    paramsObj['subclassCode'] = subclassCode?.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Clause[]>(`v2/clauses?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }
  getLimitsOfLiability(

    subclassCode: number,
    scheduleType: string = 'L'
  ) {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET(`v2/limits-of-liability/subclass?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }
  getExcesses(
    subclassCode: number,
    scheduleType: string = 'E'
  ) {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode?.toString();
    paramsObj['scheduleType'] = scheduleType;

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET(`v2/limits-of-liability/subclass?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  addLimitsOfLiability(data: CreateLimitsOfLiability[]) {
    return this.api.POST(`v2/limits-of-liability`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)

  }

  addClauses(
    clauseCodes: number[], // Accept an array of clause codes
    productCode: number,
    quotCode: number,
    riskCode: number
  ) {
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
    return this.api.POST(`/v2/clauses?${params.toString()}`, payload, API_CONFIG.GIS_QUOTATION_BASE_URL);
  }

  updateQuotationRisk(data: EditRisk) {
    return this.api.PUT(`v2/quotationRisks`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL);
  }
  deleteRisk(quotRiskCode: number,) {
    return this.api.DELETE(`v2/quotationRisks?quotRiskCode=${quotRiskCode}`, API_CONFIG.GIS_QUOTATION_BASE_URL);
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
    productCode : number,
    subClassCode: number,
  ) {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['productCode'] = productCode.toString();
    paramsObj['subClassCode'] = subClassCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET(`v2/taxes?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  }

  createQuotationDetails(quotationCode:any, data: premiumPayloadData ) {

    return this.api.POST(`v2/quotation/update-premium/${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL,);
  }

  createQuotationRisk(quotationCode, data: quotationRisk[]) {
    // console.log(JSON.stringify(data),"Data from the service")
    return this.api.POST(`v2/quotationRisks?quotationCode=${quotationCode}`, JSON.stringify(data), API_CONFIG.GIS_QUOTATION_BASE_URL)
  }

  updateQuotationStatus(quotationCode: number, status: string, reasonCancelled: string) {

    return this.api.PUT(`v2/quotation/status?quotationCode=${quotationCode}&status=${status}&reasonCancelled=${reasonCancelled}`, null, API_CONFIG.GIS_QUOTATION_BASE_URL);

  }
}
