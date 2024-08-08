import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

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
  

}
