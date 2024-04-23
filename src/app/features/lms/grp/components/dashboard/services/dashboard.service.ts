import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private api:ApiService,
  ) { }

  getMemberPolicies(id) {
    return this.api.GET(`group/portal/member-policies?identityNumber=${id}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getMemberAllPensionDepositReceipts(policyCode: number, memberCode: number) {
    return this.api.GET(`group/portal/${policyCode}/member-pension-deposits?policyMemberCode=${memberCode}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }
}
