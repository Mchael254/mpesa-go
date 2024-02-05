import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from '../../../../core/config/app-config-service'
import {Observable, catchError, retry, throwError} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { QuotationsDTO } from '../../data/quotations-dto';
import { PremiumComputationRequest, quotationDTO, quotationRisk, riskSection } from '../../components/quotation/data/quotationsDTO';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {

  baseUrl = this.appConfig.config.contextPath.gis_services;
  setupsbaseurl = "setups/api/v1";
  notificationUrl = this.appConfig.config.contextPath.notification_service;

  computationBaseUrl = this.appConfig.config.contextPath.computation_service;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-tenantid':'v6test'

    })
  }

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
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

    return this.http.get<Pagination<QuotationsDTO>>(`/${this.baseUrl}/quotation/api/v1/quotations/client/` + id,
      {
        headers: headers,
        params: params,
      });
  }
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
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
  getFormFields(shortDescription:any): Observable<any>{
   
   const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    
    })
    const params = new HttpParams()
    return this.http.get<any>(`/${this.baseUrl}/${this.setupsbaseurl}/forms/${shortDescription}`,{
      headers:headers,
      params:params
    }).pipe(
      retry(1),
      catchError(this.errorHandl)
    ) 
  }
   createQuotation(data:quotationDTO,user){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation?user=${user}`, JSON.stringify(data),this.httpOptions)
      
  }
  createQuotationRisk(quotationCode ,data:quotationRisk[]){
    console.log(JSON.stringify(data),"Data from the service")
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation-risks?quotationCode=${quotationCode}`, JSON.stringify(data),this.httpOptions)
  }
  getRiskSection(quotationRiskCode):Observable<riskSection[]>{
    return this.http.get<riskSection[]>(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`)

  }
  createRiskSection(quotationRiskCode ,data:riskSection[]){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),this.httpOptions)

  }
  updateRiskSection(quotationRiskCode ,data:riskSection[]){
    return this.http.put(`/${this.baseUrl}/quotation/api/v1/risk-sections?quotationRiskCode=${quotationRiskCode}`, JSON.stringify(data),this.httpOptions)

  }
  getClientQuotations(quotationNo){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation/view?quotationNo=${quotationNo}`)
  }
  // computePremium(quotationCode) {
  //   return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium?quotationCode=${quotationCode}`, {});
  // }
  computePremium(quotationCode) {
    const params = new HttpParams().set('quotationCode', quotationCode);
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium/${quotationCode}`, null);
  }
  quotationUtils(transactionCode){
    const params = new HttpParams()
    .set('transactionCode', transactionCode)
    .set('transactionsType','QUOTATION')

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-TenantId': environment.TENANT_ID,
    });

    return this.http.get(`/${this.computationBaseUrl}/api/v1/utils/payload`,{
      headers: headers,
      params:params
    })
  }
  premiumComputationEngine(payload:PremiumComputationRequest):Observable<any>{
    console.log("Premium Payload",JSON.stringify(payload))
    console.log("Premium Payload",payload)
    payload.risks.forEach(risk =>{
      risk.limits.forEach(limit =>{
        console.log("Limit",limit)

      })
    })
   return  this.http.post<any>(`/${this.computationBaseUrl}/api/v1/premium-computation`,JSON.stringify(payload),this.httpOptions)
     console.log("Premium Payload after",payload)

  }
  sendEmail(data){
    return this.http.post(`/${this.notificationUrl}/email/send`, JSON.stringify(data),this.httpOptions)
  }

 

}
