import { Injectable } from '@angular/core';
import {ApiService} from "../../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(
    private api:ApiService,
  ) { }

  quotationSummaryDetails(quotationCode: number) {
    return this.api.GET(`quotations?quotationCode=${quotationCode}`, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
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
