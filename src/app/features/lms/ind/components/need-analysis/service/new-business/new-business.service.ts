import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class NewBusinessService {

  constructor(private api: ApiService) { }

  getNeedAnalysis(){
  return this.api.GET('new-business/process_type/NEW_BUSINESS', API_CONFIG.JSON_SERVICE_BASE_URL)
  }
}
