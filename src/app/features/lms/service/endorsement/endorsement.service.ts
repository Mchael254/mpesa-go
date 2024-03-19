import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class EndorsementService {
  private IND_ENDORSEMENT_BASE_URL = 'individual/endorsements';
  private IND_POLICY_BASE_URL = 'individual/policies'

  constructor(private api:ApiService) {}

  getListOfExceptionsByEndrCode(endr_code=2023618139){
    return this.api.GET(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/exceptions`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  listCoverTypesByEndrCode(endr_code=2023200011){
    return this.api.GET<any>(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/cover-types`,API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  listExceptionTypesByPolCode(pol_code=2023200011){
    return this.api.GET<any>(`${this.IND_POLICY_BASE_URL}/${pol_code}/exception-types`,API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  deleteExceptionsByPolCode(ex_code =2023618139, endr_code=2023315){
    return this.api.DELETE(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/exceptions/${ex_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  authorizePolicy(endr_code:number){
    return this.api.POST(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/authorize-policy?reins_tot_prem_computed=true&medical_done=true&reins_done=true`, null, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  rejectPolicy(endr_code=202360705){
    return this.api.POST(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/reject`, null, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  createEndorsementException(exception:any, endr_code: number){
    return this.api.POST(`${this.IND_ENDORSEMENT_BASE_URL}/${endr_code}/exceptions`, exception, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  approveEndorsementException(exception:any, id: number){
    return this.api.POST(`${this.IND_ENDORSEMENT_BASE_URL}/${id}/exceptions`, exception, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }
}
