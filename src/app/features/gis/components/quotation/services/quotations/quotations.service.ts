import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../../../core/config/app-config-service';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import { QuotationsDTO } from 'src/app/features/gis/data/quotations-dto';
import { quotationDTO, quotationRisk, riskSection, scheduleDetails } from '../../data/quotationsDTO';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { introducersDTO } from '../../data/introducersDTO';
import { environment } from '../../../../../../../environments/environment';
import { AgentDTO } from '../../../../../entities/data/AgentDTO';
import { Pagination } from '../../../../../../shared/data/common/pagination';
import { riskClauses } from '../../../setups/data/gisDTO';
import { SESSION_KEY } from '../../../../../../features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../../../features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../../../shared/services/session-storage/session-storage.service';

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
  constructor(private appConfig: AppConfigService, private http: HttpClient, private session_storage: SessionStorageService) { }
   /**
   * Base URL for quotation services obtained from application configuration.
   * @type {string}
   */ 
  baseUrl = this.appConfig.config.contextPath.gis_services;
  computationUrl = this.appConfig.config.contextPath.computation_service;
  notificationUrl = this.appConfig.config.contextPath.notification_service;
  crmUrl = this.appConfig.config.contextPath.setup_services
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
    /**
   * Retrieves quotation sources using an HTTP GET request.
   * @method getQuotationSources
   * @return {Observable<any>} - An observable of the response containing quotation sources.
   */
    getAllQuotationSources(): Observable<any>{
      let page = 0;
      let size = 10;
     const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      
      })
      const params = new HttpParams()
      .set('pageNo', `${page}`)
        .set('pageSize', `${size}`)
      return this.http.get<any>(`/${this.baseUrl}/quotation/api/v2/quotation-sources`,{
        headers:headers,
        params:params
      })
    }
 /**
   * Creates a new quotation using an HTTP POST request.
   * @method createQuotation
   * @param {quotationDTO} data - The data for creating the quotation.
   * @param {string} user - The user associated with the quotation.
   * @return {Observable<any>} - An observable of the response containing created quotation data.
   */
  createQuotation(data:quotationDTO,user){
    console.log("Data",JSON.stringify(data))
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation?user=${user}`, JSON.stringify(data),this.httpOptions)
      
  }
  /**
   * Retrieves quotations based on specified parameters using an HTTP GET request.
   * @method getQuotations
   * @param {string} clientId - The client ID associated with the quotations.
   * @param {string} dateFrom - The starting date for the quotations.
   * @param {string} dateTo - The ending date for the quotations.
   * @return {Observable<any>} - An observable of the response containing quotation data.
   */
  getQuotations(clientId, dateFrom, dateTo){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation?dateFrom=${dateFrom}&dateTo=${dateTo}&clientId=${clientId}`)
  }
  /**
   * Creates a new quotation risk using an HTTP POST request.
   * @method createQuotationRisk
   * @param {string} quotationCode - The quotation code associated with the risk.
   * @param {quotationRisk[]} data - The data representing the quotation risk.
   * @return {Observable<any>} - An observable of the response containing the created quotation risk data.
   */
  createQuotationRisk(quotationCode ,data:quotationRisk[]){
    console.log(JSON.stringify(data),"Data from the service")
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation-risks?quotationCode=${quotationCode}`, JSON.stringify(data),this.httpOptions)

  }
   /**
   * Retrieves risk sections for a given quotation risk code using an HTTP GET request.
   * @method getRiskSection
   * @param {string} quotationRiskCode - The quotation risk code for which to retrieve risk sections.
   * @return {Observable<riskSection[]>} - An observable of the response containing risk sections.
   */
  getRiskSection(quotationRiskCode):Observable<riskSection[]>{
    return this.http.get<riskSection[]>(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`)

  }
   /**
   * Creates new risk sections for a given quotation risk code using an HTTP POST request.
   * @method createRiskSection
   * @param {string} quotationRiskCode - The quotation risk code associated with the risk sections.
   * @param {riskSection[]} data - The data representing the risk sections.
   * @return {Observable<any>} - An observable of the response containing the created risk sections data.
   */
  createRiskSection(quotationRiskCode ,data:riskSection[]){
    console.log(data , "QUOTATION RISK SECTION")
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),this.httpOptions)

  }
    /**
   * Updates existing risk sections for a given quotation risk code using an HTTP PUT request.
   * @method updateRiskSection
   * @param {string} quotationRiskCode - The quotation risk code associated with the risk sections.
   * @param {riskSection[]} data - The data representing the updated risk sections.
   * @return {Observable<any>} - An observable of the response containing the updated risk sections data.
   */
  updateRiskSection(quotationRiskCode ,data:riskSection[]){
    return this.http.put(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),this.httpOptions)

  }
   /**
   * Retrieves details of a quotation using an HTTP GET request.
   * @method getQuotationDetails
   * @param {string} quotationNo - The quotation number for which to retrieve details.
   * @return {Observable<any>} - An observable of the response containing quotation details.
   */
  getQuotationDetails(quotationNo){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation/view?quotationNo=${quotationNo}`)
  }
    /**
   * Retrieves introducers using an HTTP GET request.
   * @method getIntroducers
   * @return {Observable<introducersDTO>} - An observable of the response containing introducers data.
   */   
  getIntroducers(): Observable<introducersDTO>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
      });
      return this.http.get<introducersDTO>(`/${this.baseUrl}/setups/api/v1/introducers`, {headers:headers}); 
  }

  /**
   * Computes the premium for a given quotation code using an HTTP POST request.
   * @method computePremium
   * @param {string} quotationCode - The quotation code for which to compute the premium.
   * @return {Observable<any>} - An observable of the response containing the computed premium data.
   */
  // computePremium(quotationCode){
  //   return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium/${quotationCode}`,this.httpOptions)
  // }
  computePremium(computationDetails){
    return this.http.post(`/${this.computationUrl}/api/v1/premium-computation`,computationDetails)
  }
   /**

   * Creates new schedule details using an HTTP POST request.
   * @method createSchedule
   * @param {scheduleDetails[]} data - The data representing the schedule details to be created.
   * @return {Observable<any>} - An observable of the response containing the created schedule details data.
   */
  createSchedule(data:scheduleDetails[]){
    return this.http.post(`/${this.baseUrl}/quotation//api/v2/schedule-details`, JSON.stringify(data),this.httpOptions)
  }
  
  /**
   * Updates existing schedule details using an HTTP PUT request.
   * @method updateSchedule
   * @param {scheduleDetails[]} data - The data representing the updated schedule details.
   * @return {Observable<any>} - An observable of the response containing the updated schedule details data.
   */
  updateSchedule(data:scheduleDetails[]){
    return this.http.put(`/${this.baseUrl}/quotation//api/v2/schedule-details`, JSON.stringify(data),this.httpOptions)
  }
    /**
   * Retrieves product clauses for a given product code using an HTTP GET request.
   * @method getProductClauses
   * @param {string} productCode - The product code for which to retrieve clauses.
   * @return {Observable<any>} - An observable of the response containing product clauses.
   */
 getProductClauses(productCode){
    return this.http.get(`/${this.baseUrl}/setups/api/v1/products/${productCode}/clauses`,this.httpOptions)
 }
 deleteSchedule(level:any,riskCode:any,code:any){
    return this.http.delete<scheduleDetails>(`/${this.baseUrl}/quotation/api/v2/schedule-details/?level=${level}&riskCode=${riskCode}&scheduleCode=${code}`) 
 }
 makeReady(quotationCode,user){
  return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/make-ready/${quotationCode}?user=${user}`,this.httpOptions)
 }
 confirmQuotation(quotationCode,user){
  return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/confirm/${quotationCode}?user=${user}`,this.httpOptions)
 }
 authoriseQuotation(quotationCode,user){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/authorise/${quotationCode}?user=${user}`,this.httpOptions)
 }
 getExternalClaimsExperience(clientCode){
  return this.http.get(`/${this.baseUrl}/setups/api/v1/external-claims-experiences?clientCode=${clientCode}`)
 }
 getInternalClaimsExperience(clientCode){
  return this.http.get(`/${this.baseUrl}/setups/api/v1/internal-claims-experience?clientCode=${clientCode}`)
 }


 getAgents(
  page: number | null = 0,
  size: number | null = 10,
  sortList: string = 'createdDate',

): Observable<Pagination<AgentDTO>> {
  const baseUrl = this.appConfig.config.contextPath.accounts_services;
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  });
  const params = new HttpParams()
    .set('page', `${page}`)
    .set('size', `${size}`)
    .set('organizationId', 2)
    .set('sortListFields', `${sortList}`)
  

  return this.http.get<Pagination<AgentDTO>>(`/${baseUrl}/agents`,{
    headers:headers,
    params: params,
  })
}
quotationUtils(transactionCode){
  const params = new HttpParams()
  .set('transactionCode', transactionCode)
  .set('transactionsType','QUOTATION')

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
sendEmail(data){
  return this.http.post(`/${this.notificationUrl}/email/send`, JSON.stringify(data),this.httpOptions)
}
sendSms(data){
  return this.http.post(`/${this.notificationUrl}/api/sms/send`, JSON.stringify(data),this.httpOptions)
}
getUserProfile(){
  const baseUrl = this.appConfig.config.contextPath.users_services;
  return this.http.get(`/${baseUrl}/administration/users/profile`)
}
getLimits(productCode,type,quotRiskCode?){
  let url = `/${this.baseUrl}/quotation/api/v1/quotation/scheduleValues?pageSize=100&pageNo=0&quotationProductCode=${productCode}&scheduleValueType=${type}`;

  if (quotRiskCode) {
    url += `&quotRiskCode=${quotRiskCode}`;
  }

  return this.http.get(url);
}
assignProductLimits(productCode){

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  });



  return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/scheduleValues/auto-populate?quotationProductCode=${productCode}`,
  {headers:headers})

}
documentTypes(accountType){
  const params = new HttpParams()
  .set('accountType', accountType)

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  });

  return this.http.get(`/${this.crmUrl}/setups/required-documents`,{
    headers: headers,
    params:params
  })
}
getRiskClauses(code:number): Observable<riskClauses[]>{
  let page = 0;
  let size = 1000
 const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  
  })
  const params = new HttpParams()
  .set('page', `${page}`)
    .set('pageSize', `${size}`)
  return this.http.get<riskClauses[]>(`/${this.baseUrl}/quotation/api/v1/riskClauses/?riskCode=${code}`,{
    headers:headers,
    params:params
  }).pipe(
    retry(1),
    catchError(this.errorHandl)
  ) 
}
captureRiskClauses(clauseCode:number, productCode:number,quoteCode:number,riskCode :number){
  return this.http.post(`/${this.baseUrl}/quotation/api/v1/riskClauses?clauseCode=${clauseCode}&productCode=${productCode}&quoteCode=${quoteCode}&riskCode=${riskCode}`,this.httpOptions)
  
}
 

addProductClause(clauseCode,productCode,quotationCode){
  const params = new HttpParams()
  .set('clauseCode', clauseCode)
  .set('productCode', productCode)
  .set('quotationCode', quotationCode)

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-TenantId': StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.API_TENANT_ID)),
  });

  return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation-product-clause/post-product-clauses?clauseCode=${clauseCode}&productCode=${productCode}&quotationCode=${quotationCode}`,{
    headers: headers,
    params:params
  })
}

}

  
 



