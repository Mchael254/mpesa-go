import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BankChargeRateTypesDto } from '../../data/common/bank-charge-rate-types-dto';
import { ApiService } from '../api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class BankChargeRateTypesService {
  constructor(private api: ApiService) {}

  getBankChargeRateTypes(): Observable<BankChargeRateTypesDto[]> {
    return this.api.GET<BankChargeRateTypesDto[]>(
      `system-definitions/bank-charge-rate-types`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
