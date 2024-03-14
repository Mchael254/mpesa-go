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
    return this.api.DELETE<any>(`${this.MEDICALS_BASE_URL}/client-medical-tests/${cml_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }



  saveClientMedicalTest(test:{}){
    return this.api.POST<any>(`${this.MEDICALS_BASE_URL}/client-medical-tests`, test, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  updateClientMedicalTest(test: any, cml_code:number){
    return this.api.PUT<any>(`${this.MEDICALS_BASE_URL}/client-medical-tests/${cml_code}`,test, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  serviceProvider(){
    return this.api.GET<any>(`service-provider-types`, API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL);
  }

  downloadMedicalTestFile(rpt_code: number){
    let payload = {
      "rpt_code": 329560,
      "system": "ORD",
      "report_format": "PDF",
      "encode_format": "RAW",
      "params": [
          {
              "name": "V_USER",
              "value": "LMSADMIN"
          },
          {
              "name": "V_ENDR_CODE",
              "value": "2024618146"
          },
          {
              "name": "V_PRP_CODE",
              "value": "2023317740"
          }
      ]
  }
    return this.api.POSTBYTE(null, payload, API_CONFIG.REPORT_SERVICE_BASE_URL);
  }
}
