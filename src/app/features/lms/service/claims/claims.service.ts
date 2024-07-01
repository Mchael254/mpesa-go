import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {

  constructor(private api:ApiService) { }

  getClaimModules(){
    return this.api.GET(`individual/claims/enums/claim-modules`, API_CONFIG.CLAIMS_SERVICE_BASE_URL)
  }

  getClaimDetails(clm_no:string){
    return this.api.GET(`individual/claims?clm_no=${clm_no}`, API_CONFIG.CLAIMS_SERVICE_BASE_URL)
  }

  getCausationTypes() {
    return this.api.GET(`individual/claims/enums/causation-types`, API_CONFIG.CLAIMS_SERVICE_BASE_URL)
}
}
