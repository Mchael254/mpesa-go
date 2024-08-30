import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { ClaimPoliciesDTO, PayeeDTO } from '../models/claim-models';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor(
    private api:ApiService,
  ) { }

  getCausationTypes(productCode: number) {
    return this.api.GET(`group/claims/causations?productCode=${productCode}`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  getActualCauses() {
    return this.api.GET('group/claims/causation-causes',  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  addActualCause(cause) {
    //to add type
    return this.api.POST('group/claims/causation-causes', cause,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  getPolicyMembers(policyCode: number) {
    return this.api.GET(`group/claims/${policyCode}/members`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  createNewClaim(claimDets, policyCode: number) {
    return this.api.POST(`group/claims/create-claim?policyCode=${policyCode}`, claimDets,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  // getClaimDetails(clm_no: string, memberCode: number = null) {
  //   return this.api.GET(`group/claims/claim-booking-dtls?${clm_no}4&memCode=${memberCode}`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  // }
  getClaimDetails(clm_no: string, memberCode: number | null = null) {
    // Create the base URL
    let url = `group/claims/claim-booking-dtls?clm_no=${encodeURIComponent(clm_no)}`;
    
    if (memberCode !== null && memberCode !== undefined) {
      url += `&memCode=${memberCode}`;
    }
  
    return this.api.GET(url, API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  getDocumetsToUpload(claimNo: string) {
    return this.api.GET(`group/claims/documents?clm_no=${claimNo}`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }  

  getClaimPolicies(
    productCode: number,
    policyCode?: number,
    status?: string,
    endorsementCode?: number
  ): Observable<ClaimPoliciesDTO[]> {
    let params = new HttpParams();
  
    if (policyCode !== undefined && policyCode !== null) {
      params = params.set('policyCode', policyCode.toString());
    }
    if (status !== undefined && status !== null) {
      params = params.set('status', status);
    }
    if (endorsementCode !== undefined && endorsementCode !== null) {
      params = params.set('endorsementCode', endorsementCode.toString());
    }
  
    return this.api.GET<ClaimPoliciesDTO[]>(
      `group/claims/${productCode}/policies`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }
  
  getClaimCoverTypes(clmaiNo: string) {
    return this.api.GET(`group/claims/claim-cover-types?claimCode=${clmaiNo}&coverTypeCode`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

  updateClaimCovers(cover_type_code, payload) {
    return this.api.PUT(`group/claims/${cover_type_code}/update-cover-details`, payload,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  } 

  getClaimPolicyDetails(policyCode: number, product_code: number) {
    return this.api.GET(`group/claims/claim-policy-details?policyCode=${policyCode}&productCode=${product_code}&status=&endorsementCode`,  API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }
  
  getPayee(): Observable<PayeeDTO[]> {
    return this.api.GET(`group/claims/payee`,API_CONFIG.CLAIMS_SERVICE_BASE_URL);
  }

}
