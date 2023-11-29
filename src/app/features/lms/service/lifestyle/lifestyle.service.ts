import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class LifestyleService {
  LIFESTYLE_BASE_URL = 'client-lifestyle';

  constructor(private api:ApiService) {}

  getClientLifeStyleById(code: number){
    return this.api.GET(`${this.LIFESTYLE_BASE_URL}?clientCode=${code}`, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL);
  }

  saveLifeStyle(lifestyle_data: any){
    return this.api.POST(`${this.LIFESTYLE_BASE_URL}`, lifestyle_data, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }

  updateLifeStyle(lifestyle_data: any){
    return this.api.PUT(`${this.LIFESTYLE_BASE_URL}/${lifestyle_data['code']}`, lifestyle_data, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }

  getClientMedicalHistoryById(code: number){
    return this.api.GET(`${this.LIFESTYLE_BASE_URL}/medical/${code}`, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL);
  }

  saveMedicalHistory(medical_data: any){
    return this.api.POST(`${this.LIFESTYLE_BASE_URL}/medicals`, medical_data, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }
}