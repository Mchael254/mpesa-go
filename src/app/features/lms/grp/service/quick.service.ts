import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { map } from 'rxjs/internal/operators/map';
import { API_CONFIG } from 'src/environments/api_service_config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuickService {

  constructor(
    private api:ApiService,
    private http: HttpClient
    ) { }

  getAllCurrencies() {
    return this.api.GET('currencies');
  }

  getDurationTypes() {
    return this.api.GET(`quotations/duration-types`, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }

  getQuotationCovers() {
    return this.api.GET('quotations/dependant-types', API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }

  getUnitRate() {
    return this.api.GET(`quotations/unit-rate`, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }

  getFacultativeTypes() {
    return this.api.GET(`quotations/facultative-types`, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }

  postQuoteDetails(apiRequest) {
    return this.api.POST('quotations', apiRequest, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }

  updateQuoteDetails(quotation_code: number, apiRequest) {
    return this.api.PUT(`quotations/${quotation_code}`, apiRequest, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }
}
