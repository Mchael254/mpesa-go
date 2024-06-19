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

  getCategorySummary(policyCode: number) {
    return this.api.GET(`group/category/${policyCode}/categories`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

}
