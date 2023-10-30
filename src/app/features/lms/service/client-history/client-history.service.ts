import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ClientHistoryService {
  constructor(private api:ApiService) {}

  getAllCoverStatusTypes(){
    return this.api.GET('client-history/cover-status-types', API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  getLmsInsHistList(clientCode = null){
    return this.api.GET(`client-history/insurance?clnt_code=${clientCode}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }
}
