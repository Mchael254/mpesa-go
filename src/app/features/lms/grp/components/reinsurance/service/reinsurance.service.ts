import { Injectable } from '@angular/core';
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceService {

  constructor(
    private api:ApiService,
  ) { }

  getPolicySummary(policy_code, product_code, endorsement_code) {
    return this.api.GET(`group/policies/policydetails?policy_code=${policy_code}&product_code=${product_code}&endorsement_code=${endorsement_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);

  }

  getTreatySelection() {
    return this.api.GET(`group/reinsurance/treaties-listing?currencySymbol=${'MWK'}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);

  }

  getReinsuranceParameters(product_code, year) {
    return this.api.GET(`group/reinsurance/reinsurance-parameters?productCode=${product_code}&year=${year}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  postTreaties(populateTreatiesData) {
    return this.api.POST('group/reinsurance/populate-and-reinsure', populateTreatiesData, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getSurplusParticipantsSummary(endorsementCode) {
    return this.api.GET(`group/reinsurance/surplus-treaty?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getFacultativeParticipantsSummary(endorsementCode) {
    return this.api.GET(`group/reinsurance/facultative-summary?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemDetailedSummary(endorsementCode, policyMemUniqueCode) {
    return this.api.GET(`group/reinsurance/member-summary?endorsementCode=${endorsementCode}&policyMemberUniqueCode=${policyMemUniqueCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getReinsuranceMembers(policy_code, endorsementCode) {
    return this.api.GET(`group/reinsurance/${policy_code}/members?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getReinsuranceTotals(endorsementCode) {
    return this.api.GET(`group/reinsurance/summary-totals?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }


}
