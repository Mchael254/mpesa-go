import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class UnderwritingService {

  constructor(
    private api:ApiService,
  ) { }

  convertQuoteToPolicy(quotation_code) {
    return this.api.POST(`quotations/${quotation_code}/convert`, null, API_CONFIG.GRP_QUOTATIONS_SERVICE_BASE_URL);
  }
}
