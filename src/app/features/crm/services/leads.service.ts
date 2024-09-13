import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../environments/api_service_config';
import { LeadSourceDto, LeadStatusDto } from '../data/leads';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  constructor(private api: ApiService) {}

  getLeadSources(): Observable<LeadSourceDto[]> {
    return this.api.GET<LeadSourceDto[]>(
      `lead-sources`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createLeadSources(data: LeadSourceDto): Observable<LeadSourceDto> {
    return this.api.POST<LeadSourceDto>(
      `lead-sources`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateLeadSources(
    leadSourceId: number,
    data: LeadSourceDto
  ): Observable<LeadSourceDto> {
    return this.api.PUT<LeadSourceDto>(
      `lead-sources/${leadSourceId}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteLeadSources(leadSourceId: number) {
    return this.api.DELETE<LeadSourceDto>(
      `lead-sources/${leadSourceId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getLeadStatuses(): Observable<LeadStatusDto[]> {
    return this.api.GET<LeadStatusDto[]>(
      `lead-statuses`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createLeadStatuses(data: LeadStatusDto): Observable<LeadStatusDto> {
    return this.api.POST<LeadStatusDto>(
      `lead-statuses`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateLeadStatuses(
    leadStatusId: number,
    data: LeadStatusDto
  ): Observable<LeadStatusDto> {
    return this.api.PUT<LeadStatusDto>(
      `lead-statuses/${leadStatusId}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteLeadStatuses(leadStatusId: number) {
    return this.api.DELETE<LeadStatusDto>(
      `lead-statuses/${leadStatusId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
