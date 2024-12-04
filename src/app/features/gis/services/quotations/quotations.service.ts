import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {APP_CONFIG, AppConfigService} from '../../../../core/config/app-config-service'
import {Observable, catchError, retry, throwError} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { QuotationsDTO } from '../../data/quotations-dto';
import { Clause, Excesses, LimitsOfLiability, PremiumComputationRequest, quotationDTO, quotationRisk, RegexPattern, riskSection } from '../../components/quotation/data/quotationsDTO';
import { environment } from '../../../../../environments/environment';
import {SessionStorageService} from "../../../../shared/services/session-storage/session-storage.service";
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {SESSION_KEY} from "../../../lms/util/session_storage_enum";
import {StringManipulation} from "../../../lms/util/string_manipulation";

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
      'X-tenantid':'v6test'

    })
  }

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService,
    private session_storage: SessionStorageService,
    private api:ApiService
  ) { }

 // Error handling
 errorHandl(error: HttpErrorResponse) {
  let errorMessage = '';
  if(error.error instanceof ErrorEvent) {
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

    return this.api.GET<Pagination<QuotationsDTO>>(`v1/quotations/client/` + id, API_CONFIG.GIS_QUOTATION_BASE_URL );
  }
  getAllQuotationSources(): Observable<any>{
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
  getFormFields(shortDescription:any): Observable<any>{

    return this.api.GET<any>(`api/v1/forms?shortDescription=${shortDescription}`,API_CONFIG.GIS_SETUPS_BASE_URL).pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
   createQuotation(data:quotationDTO,user){
    return this.api.POST(`v1/quotation?user=${user}`, JSON.stringify(data),API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  createQuotationRisk(quotationCode ,data:quotationRisk[]){
    // console.log(JSON.stringify(data),"Data from the service")
    return this.api.POST(`v1/quotation-risks?quotationCode=${quotationCode}`, JSON.stringify(data),API_CONFIG.GIS_QUOTATION_BASE_URL)
  }
  getRiskSection(quotationRiskCode):Observable<riskSection[]>{
    return this.api.GET<riskSection[]>(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`,API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  createRiskSection(quotationRiskCode ,data:riskSection[]){
    return this.api.POST(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  updateRiskSection(quotationRiskCode ,data:riskSection[]){
    return this.api.PUT(`v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),API_CONFIG.GIS_QUOTATION_BASE_URL)

  }
  getClientQuotations(quotationNo){
    return this.api.GET(`v2/quotation/view?quotationNo=${quotationNo}`,API_CONFIG.GIS_QUOTATION_BASE_URL)
  }
  // computePremium(quotationCode) {
  //   return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium?quotationCode=${quotationCode}`, {});
  // }
  computePremium(quotationCode) {
    const params = new HttpParams().set('quotationCode', quotationCode);
    return this.api.POST(`api/v1/premium-computation/${quotationCode}`, null,API_CONFIG.PREMIUM_COMPUTATION);
  }
  quotationUtils(
    transactionCode: number,
    transactionsType: string = 'QUOTATION'
    ){
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['transactionCode'] = transactionCode.toString();
    paramsObj['transactionsType'] = transactionsType;

    const params = new HttpParams({ fromObject: paramsObj });
  
    return this.api.GET(`/api/v1/utils/payload`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  
  }
  // quotationUtils(transactionCode){
  //   const params = new HttpParams()
  //   .set('transactionCode', transactionCode)
  //   .set('transactionsType','QUOTATION')

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //     'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  //   });

  //   return this.http.get(`/${this.computationBaseUrl}/api/v1/utils/payload`,{
  //     headers: headers,
  //     params:params
  //   })
  // }
  premiumComputationEngine(payload:PremiumComputationRequest):Observable<any>{
  //  return  this.http.post<any>(`/${this.computationBaseUrl}/api/v1/premium-computation`,JSON.stringify(payload),this.httpOptions)
   return this.api.POST<any[]>(`api/v1/premium-computation`,JSON.stringify(payload),API_CONFIG.PREMIUM_COMPUTATION, );

     console.log("Premium Payload after",payload)

  }


  // sendEmail(data){
  //   return this.http.post(`/${this.notificationUrl}/email/send`, JSON.stringify(data),this.httpOptions)
  // }
  // sendSms(data){
  //   return this.http.post(`/${this.notificationUrl}/api/sms/send`, JSON.stringify(data),this.httpOptions)
  // }
  getRegexPatterns(
    subclassCode: number): Observable<RegexPattern[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['subclassCode'] = subclassCode.toString();
  
    const params = new HttpParams({ fromObject: paramsObj });
  
    return this.api.GET<RegexPattern[]>(`v1/regex/risk-id-format?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);
  
  }
  getClauses(
    covertypeCode: number,
    subclassCode: number,): Observable<Clause[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['coverTypeCode'] = covertypeCode.toString();
    paramsObj['subclassCode'] = subclassCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Clause[]>(`v2/clauses?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }
  getLimitsOfLiability(
    quotationProductCode: number,
    subclassCode: number,): Observable<LimitsOfLiability[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['quotationProductCode'] = quotationProductCode.toString();
    paramsObj['subclassCode'] = subclassCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<LimitsOfLiability[]>(`v2/limits-of-liability?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }
  getExcesses(
    covertypeCode: number,
    subclassCode: number,): Observable<Excesses[]> {
    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    // Add the mandatory parameter
    paramsObj['coverTypeCode'] = covertypeCode.toString();
    paramsObj['subclassCode'] = subclassCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<Excesses[]>(`/v2/excesses?`, API_CONFIG.GIS_QUOTATION_BASE_URL, params);

  }

}
