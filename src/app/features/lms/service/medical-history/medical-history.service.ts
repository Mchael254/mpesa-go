import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicalHistoryService {
  MEDICAL_HISTORY_BASE_URL = 'json/medical-history';

  constructor(private api:ApiService, private http: HttpClient) {}

  getMedicalHistoryByCode(){
    return this.api.GET(`${this.MEDICAL_HISTORY_BASE_URL}`, API_CONFIG.JSON_SERVICE_BASE_URL);
  }

  getMedicalHistoryByClientCode(client_code:number){
    return this.api.GET(`${this.MEDICAL_HISTORY_BASE_URL}/client/${client_code}`, API_CONFIG.JSON_SERVICE_BASE_URL);
  }

  getMedicalHistoryByTenantIdAndClientCode(tenant_id:string, client_code:string): Observable<any>{
    return this.api.GET(`${this.MEDICAL_HISTORY_BASE_URL}/${tenant_id}/${client_code}`, API_CONFIG.JSON_SERVICE_BASE_URL);
    // return this.http.get('http://localhost:1020/json/new-business/6565c3cc8692857e6e02e32e');
  }

  saveMedicalHistory(medical_data:any){
    return this.api.POST(`${this.MEDICAL_HISTORY_BASE_URL}/save`, medical_data,  API_CONFIG.JSON_SERVICE_BASE_URL);
  }
}
