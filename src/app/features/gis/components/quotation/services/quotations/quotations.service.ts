import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { QuotationsDTO } from 'src/app/features/gis/data/quotations-dto';
import { quotationDTO, quotationRisk, riskSection, scheduleDetails } from '../../data/quotationsDTO';
import { Observable } from 'rxjs';
import { introducersDTO } from '../../data/introducersDTO';
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
  constructor(private appConfig: AppConfigService, private http: HttpClient) { }
   /**
   * Base URL for quotation services obtained from application configuration.
   * @type {string}
   */ 
  baseUrl = this.appConfig.config.contextPath.gis_services;
  /**
   * HTTP options for making requests with JSON content type.
   * @type {any}
   */
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }
    /**
   * Retrieves quotation sources using an HTTP GET request.
   * @method getQuotationSources
   * @return {Observable<any>} - An observable of the response containing quotation sources.
   */
  getQuotationSources(){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation-sources`)
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
      });
      return this.http.get<introducersDTO>(`/${this.baseUrl}/setups/api/v1/introducers`, {headers:headers}); 
  }

  /**
   * Computes the premium for a given quotation code using an HTTP POST request.
   * @method computePremium
   * @param {string} quotationCode - The quotation code for which to compute the premium.
   * @return {Observable<any>} - An observable of the response containing the computed premium data.
   */
  computePremium(quotationCode){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium/${quotationCode}`,this.httpOptions)
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
    return this.http.get(`/${this.baseUrl}/setups/api/v1/products/${productCode}/clauses`)

  }
 
}

