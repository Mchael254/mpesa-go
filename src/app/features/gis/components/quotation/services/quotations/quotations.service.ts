import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { QuotationsDTO } from 'src/app/features/gis/data/quotations-dto';
import { quotationDTO, quotationRisk, riskSection } from '../../data/quotationsDTO';
import { Observable } from 'rxjs';
import { introducersDTO } from '../../data/introducersDTO';
@Injectable({
  providedIn: 'root'
})
export class QuotationsService {
  
  constructor(private appConfig: AppConfigService, private http: HttpClient) { }
  baseUrl = this.appConfig.config.contextPath.gis_services;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }
  getQuotationSources(){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation-sources`)
  }

  createQuotation(data:quotationDTO,user){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation?user=${user}`, JSON.stringify(data),this.httpOptions)
      
  }

  getQuotations(clientId, dateFrom, dateTo){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation?dateFrom=${dateFrom}&dateTo=${dateTo}&clientId=${clientId}`)
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
  getQuotationDetails(quotationNo){
    return this.http.get(`/${this.baseUrl}/quotation/api/v2/quotation/view?quotationNo=${quotationNo}`)
  }
  
  getIntroducers(): Observable<introducersDTO>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
      return this.http.get<introducersDTO>(`/${this.baseUrl}/setups/api/v1/introducers`, {headers:headers});
    
  }

  computePremium(quotationCode){
    return this.http.post(`/${this.baseUrl}/quotation/api/v1/quotation/compute-premium/${quotationCode}`,this.httpOptions)
  }
 
}

