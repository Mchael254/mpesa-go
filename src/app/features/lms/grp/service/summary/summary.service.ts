import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
    private api:ApiService,
  ) { }

  quotationSummaryDetails(quotationNumber: string) {
    return this.api.GET(`quotations?quotationNumber=${quotationNumber}`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  membersSummaryDetails(productCode, quotationCode) {
    return this.api.GET(`quotations/${productCode}/${quotationCode}/fcl`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  memberCoverSummary(quotationCode, memberCode) {
    return this.api.GET(`members/${quotationCode}/${memberCode}/summary`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getDependantLimits(quotation_code) {
    return this.api.GET(`category/${quotation_code}/categories/dependent-limits`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }
}
