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

}
