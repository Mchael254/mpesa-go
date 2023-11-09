import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class NewBusinessService {

  constructor(private api: ApiService) { }

  getNeedAnalysis(){
  return this.api.GET('need-analysis/new-business/6542bdd96ab7402d60e2a912', API_CONFIG.JSON_SERVICE_BASE_URL)
  }
}
