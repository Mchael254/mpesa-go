import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class EndorsementService {
  private IND_ENDORSEMENT_BASE_URL = 'individual/endorsements'

  constructor(private api:ApiService) {}

  getListOfExceptionsByPolCode(pol_code=2023618139){
    return this.api.GET(`${this.IND_ENDORSEMENT_BASE_URL}/${pol_code}/exceptions`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  deleteExceptionsByPolCode(pol_code =2023618139, endr_code=2023315){
    return this.api.DELETE(`${this.IND_ENDORSEMENT_BASE_URL}/${pol_code}/exceptions/${endr_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  authorizePolicy(endr_code:number){
    return this.api.POST(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/authorize-policy?reins_tot_prem_computed=true&medical_done=true&reins_done=true`, null, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }
}
