import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PayFrequencyService {

  constructor( private api: ApiService) { }

  getPayFrequencies() {
    return this.api.GET('pay-frequencies');
  }

  bmi(height, weight){
    return this.api.POST(`calculate-bmi?height=${height}&weight=${weight}`,null, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }
}
