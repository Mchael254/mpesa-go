import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  constructor(private api:ApiService) {}


  getAllBeneficiaryTypes(){
    return this.api.GET('parties/beneficiary-types', API_CONFIG.MARKETING_SERVICE_BASE_URL);
  }

  getLmsInsHistList(prpCode = null, cover_status = null){
    return this.api.GET(`client-history/insurance?prpCode=${prpCode}&cover_status=${cover_status}`);
  }

}
