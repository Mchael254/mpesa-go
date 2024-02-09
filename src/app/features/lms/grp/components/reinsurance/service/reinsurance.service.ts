import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceService {

  constructor( 
    private api:ApiService,
  ) { }

  getPolicySummary(policy_code, product_code, endorsement_code) {
    return this.api.GET(`group/policies/policydetails?policy_code=${20231454213}&product_code=${2021675}&endorsement_code=${20231683127}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);

  }

  getTreatySelection() {
    return this.api.GET(`group/reinsurance/treaties-listing?currencySymbol=${'MWK'}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);

  }

}
