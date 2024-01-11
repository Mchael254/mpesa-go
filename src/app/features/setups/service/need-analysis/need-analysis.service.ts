import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class NeedAnalysisService {

  private NEED_ANALYSIS_BASE_URL='new-business'

  constructor(private api: ApiService) { }


  getNeedAnalysisBySystemNameAndProcessTypeAndTenantID( tenantId, processType, systemName){
    return this.api.GET(`${this.NEED_ANALYSIS_BASE_URL}/search-by-criteria?tenant_id=${tenantId}&process_type=${processType}&system_name=${systemName}`, API_CONFIG.JSON_SERVICE_BASE_URL)
  }
  

  updateNeedAnalysisData(data){
    return this.api.PUT(`${this.NEED_ANALYSIS_BASE_URL}`, data, API_CONFIG.JSON_SERVICE_BASE_URL)
  }
}