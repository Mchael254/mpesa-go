import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private QUOTATION_BASE_URL: string = 'quotations'

  constructor(private api: ApiService) { }

  getLmsIndividualQuotationWebQuoteListByDraft(page:number=0, size:number=10, client_code=2323235976681){
    return this.api.GET(`${this.QUOTATION_BASE_URL}/web-quote?page=${page}&size=${size}&client_code=${client_code}&client_type=C`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsIndividualQuotationWebQuoteList(page:number, size:number){
    return this.api.GET(`${this.QUOTATION_BASE_URL}/web-quote?page=${page}&size=${size}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsIndividualQuotationWebQuoteByCode(code:number){
    return this.api.GET(`${this.QUOTATION_BASE_URL}/web-quote/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsIndividualQuotationTelQuoteByCode(code:number){
    return this.api.GET(`${this.QUOTATION_BASE_URL}/tel-quote/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  saveWebQuote(data:any){
    return this.api.POST(`${this.QUOTATION_BASE_URL}/web-quote`, data,  API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  convert_quotation_to_proposal(code: number){
    return this.api.POST(`${this.QUOTATION_BASE_URL}/generate-proposal-no/${code}`, null, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
  }

}
