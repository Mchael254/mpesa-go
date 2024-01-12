import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  private IND_POLICY_BASE_URL = 'individual/policies'

  constructor(private api:ApiService) {}

  listPolicyMaturities(pol_code=2023461522){
    return this.api.GET<any>(`${this.IND_POLICY_BASE_URL}/${pol_code}/maturities`,API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  listPolicyReceipts(pol_code=2023237447){
    return this.api.GET<any>(`${this.IND_POLICY_BASE_URL}/${pol_code}/receipts`,API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  listPolicySummaryByPolCodeAndEndrCode(pol_code=2023237447, endr_code=2023200011){
    return this.api.GET<any>(`${this.IND_POLICY_BASE_URL}/${pol_code}?endorsement_code=${endr_code}`,API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }


}