import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {

  constructor(private api: ApiService) { }

  getLmsIndividualQuotationWebQuoteList(page:number, size:number){
    return this.api.GET(`quotations/web-quote?page=${page}&size=${size}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsIndividualQuotationWebQuoteByCode(code:number){
    return this.api.GET(`quotations/web-quote/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsIndividualQuotationTelQuoteByCode(code:number){
    return this.api.GET(`quotations/tel-quote/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }
}
