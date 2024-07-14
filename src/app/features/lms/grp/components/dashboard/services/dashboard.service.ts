import { Injectable } from '@angular/core';
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api:ApiService,
  ) { }

  getMemberPolicies(id) {
    return this.api.GET(`group/portal/member-policies?identityNumber=${id}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberDetails(policyCode, memberCode) {
    return this.api.GET(`group/portal/${policyCode}/member-details?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }
  
  getMemberAllPensionDepositReceipts(policyCode: number, memberCode: number) {
    return this.api.GET(`group/portal/${policyCode}/member-pension-deposits?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberBalances (policyCode, memberCode) {
    return this.api.GET(`group/portal/${policyCode}/member-valuations?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberCovers(policyCode, endorsementCode) {
    return this.api.GET(`group/portal/member-covers?policyMemberCode=${policyCode}&endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getDetMemDepConReceipts(pensDepCode: number, memberCode: number) {
    return this.api.GET(`group/portal/${pensDepCode}/receipt-info?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberWithdrawals (policyCode, memberCode) {
    return this.api.GET(`group/portal/${policyCode}/member-withdrawals?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getAdminPolicies(clientCode: number) {
    return this.api.GET(`admin/policies-listing?clientCode=${clientCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getClaimsSummary(clientCode: number) {
    return this.api.GET(`admin/claims-summary?clientCode=${clientCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getClaimsListing(clientCode: number) {
    return this.api.GET(`admin/claims-listing?clientCode=${clientCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getAdminPensionListing(clientCode: number) {
    return this.api.GET(`admin/pensions?clientCode=${clientCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getAdminPolicyDetails(endorsementCode: number) {
    return this.api.GET(`admin/policy-details?endorsementCode=${endorsementCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getEndorsements(policyCode: number) {
    return this.api.GET(`admin/${policyCode}/endorsements`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  } 

  getCategorySummary(endorsement_code: number) {
    return this.api.GET(`group/category/${endorsement_code}/categories`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getDependentLimits(endorsement_code: number, categoryCode: number) {
    return this.api.GET(`group/category/${endorsement_code}/limits?policyCategoryCode=${categoryCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getCoverTypes(endorsement_code: number) {
    return this.api.GET(`group/policy-covers/${endorsement_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPolicyMemberDetails(endorsement_code: number) {
    return this.api.GET(`admin/${endorsement_code}/fcl`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberDetailsList(policyCode: number, endorsement_code: number) {
    return this.api.GET(`group/policies/${policyCode}/policy-members?endorsementCode=${endorsement_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  } 

  getMemberDetsSummary(endorsement_code: number, memberUniqueCode: number) {
    return this.api.GET(`admin/${endorsement_code}/member-covers?policyMemberUniqueCode=${memberUniqueCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPolicyValuations(policy_code: number) {
    return this.api.GET(`group/policies/annual-valuations?policy_code=${policy_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getReceipts(policy_code: number) {
    return this.api.GET(`group/receipts/${policy_code}?allocated=Y`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getPartialWithdrawals(policy_code: number) {
    return this.api.GET(`group/policies/partial-withdrawals?policy_code=${policy_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

}
