import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class MedicalsService {
  private MEDICALS_BASE_URL = 'individual/medicals';

  constructor(private api:ApiService) {}

  getListOfPolicyMedicalTests(pol_code=2024462214){
    return this.api.GET<any>(`${this.MEDICALS_BASE_URL}/policy-medical-tests/${pol_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getListOfTests(cmi_code: any){
    return this.api.GET<any>(`${this.MEDICALS_BASE_URL}/tests`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getListOfClientMedicalTests(pol_code=2024462214){
    return this.api.GET<any>(`${this.MEDICALS_BASE_URL}/clients-medicals?pol_code=${pol_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  deleteClientMedicalTest(cml_code=2024462214){
    return this.api.DELETE<any>(`${this.MEDICALS_BASE_URL}/client-medical-test/${cml_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  saveClientMedicalTest(test:{}){
    return this.api.POST<any>(`${this.MEDICALS_BASE_URL}/client-medical-tests`, test, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }
}
