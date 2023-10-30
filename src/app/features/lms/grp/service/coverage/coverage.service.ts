import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class CoverageService {

  constructor(
    private api:ApiService,
  ) { }

  getCategoryDetails(quotation_code: number) {
    return this.api.GET(`quotations/${quotation_code}/categories`, API_CONFIG.QUOTATIONS_SERVICE_BASE_URL);
  }
}
