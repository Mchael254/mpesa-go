import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class UnderwritingService {

  constructor(
    private api:ApiService,
  ) { }

  convertQuoteToPolicy(quotation_code) {
    return this.api.POST(`quotations/${quotation_code}/convert`, null, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }

  getEndorsementDetails(endorsement_code) {
    return this.api.GET(`group/policies/endorsements/${endorsement_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  updateEndorsementDetails(endorsement_code, endorsementDetails) {
    return this.api.PUT(`group/policies/${endorsement_code}`,  endorsementDetails, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPolicyDocuments(endorsementCode) {
    return this.api.GET(`group/policies/policy-documents?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getCoverTypes(endorsementCode) {
    return this.api.GET(`group/policy-covers/${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  saveCoverType(policy_code, endorsementCode, coverDetails) {
    return this.api.POST(`group/policy-covers/${policy_code}/${endorsementCode}`, coverDetails,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  updateCoverType(policy_code, endorsementCode, coverTypeCode, coverDetails) {
    return this.api.PUT(`group/policy-covers/${policy_code}/${endorsementCode}/cover-type?policy_cover_type_code=${coverTypeCode}`, coverDetails,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getCoinsurersDetails(endorsementCode) {
    return this.api.GET(`group/coinsurance/${endorsementCode}?endrCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getCoinsurersList(endorsementCode) {
    return this.api.GET(`group/coinsurance/coinsurer-list?endrCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  saveCoinsurer(endorsementCode, coinsurerDets) {
    return this.api.POST(`group/coinsurance/${endorsementCode}/coinsurer`, coinsurerDets,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  DeletCoinsurer(pol_coin_code, endorsementCode) {
    return this.api.DELETE(`group/coinsurance/${pol_coin_code}?endrCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getCategories(endorsementCode) {
    return this.api.GET(`group/category/${endorsementCode}/categories`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  saveCategory(categoryDetails) {
    return this.api.POST('group/category', categoryDetails,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  updateCategory(policy_category_code, categoryDetails) {
    return this.api.PUT(`group/category/${policy_category_code}`, categoryDetails,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  deletCategory(categoryCode) {
    return this.api.DELETE(`group/category/${categoryCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }
  
}
