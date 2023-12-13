import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PolicySummaryService {

  constructor(
    private api:ApiService,
  ) { }

  getPolicyDetails(policyCode: number, productCode: number, endorsementCode: number) {
    return this.api.GET(`group/policies/policydetails?policy_code=${policyCode}&product_code=${productCode}&endorsement_code=${endorsementCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMembers(policyCode) {
    return this.api.GET(`group/policies/policy-members/${policyCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getAnnualvaluations(policyCode: number) {
    return this.api.GET(`group/policies/annual-valuations?policy_code=${policyCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPartialWithdrawals(policyCode: number) {
    return this.api.GET(`group/policies/partial-withdrawals?policy_code=${policyCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPolicyClaims(policyCode: number) {
    return this.api.GET(`group/policies/claims?policyCode=${policyCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMembersClaims(claimNo: string, memberCode: number) {
    return this.api.GET(`group/policies/claims/details?clmNo=${claimNo}&memberCode=${memberCode}`,  API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }
}
