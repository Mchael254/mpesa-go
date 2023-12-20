import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {
  private POLICY_BASE_URL = 'individual/policies';
  private ENDORSEMENT_BASE_URL = 'individual/endorsements'

  constructor(private api:ApiService) {}

  getListOfExceptionsByPolCode(pol_code=2023618139){
    return this.api.GET(`${this.ENDORSEMENT_BASE_URL}/${pol_code}/exceptions`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

  deleteExceptionsByPolCode(endr_code: number){
    return this.api.DELETE(`${this.ENDORSEMENT_BASE_URL}/${endr_code}/exceptions/${endr_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }
}
