import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class ReinsuranceService {

  constructor(private api:ApiService) { }

  getTreatyTypes(endorsement_code:number){
    return this.api.GET(`individual/reinsurance/ri-cover-types?endr_code=${endorsement_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL)
  }

}