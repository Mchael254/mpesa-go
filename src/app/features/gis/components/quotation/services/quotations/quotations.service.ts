import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/core/config/app-config-service';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {
  
  constructor(private appConfig: AppConfigService, private http: HttpClient) { }
  baseUrl = this.appConfig.config.contextPath.gis_services;

  getQuotationSources(){
    return this.http.get(`/${this.baseUrl}/gis-quotation-service/api/v2/quotation-sources`)
  }
}
