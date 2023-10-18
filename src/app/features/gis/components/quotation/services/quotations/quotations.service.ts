import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { QuotationsDTO } from 'src/app/features/gis/data/quotations-dto';
import { quotationDTO } from '../../data/quotationsDTO';
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
}
