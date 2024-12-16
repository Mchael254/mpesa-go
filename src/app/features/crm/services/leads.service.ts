import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../../environments/api_service_config';
import {
  LeadActivityDto,
  LeadCommentDto,
  LeadSourceDto,
  LeadStatusDto,
  Leads,
} from '../data/leads';
import { HttpParams } from '@angular/common/http';
import { UtilService } from '../../../shared/services/util/util.service';
import { Pagination } from 'src/app/shared/data/common/pagination';

@Injectable({
  providedIn: 'root',
})
export class LeadsService {
  constructor(private api: ApiService, private utilService: UtilService) {}

  getAllLeads(
    page: number,
    size: number = 10,
    sortField: string = 'leadDate',
    order: string = 'desc'
  ): Observable<Pagination<Leads>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<Leads>>(
      `leads`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  searchLeads(
    page: number,
    size: number = 5,
    name: string,
    modeOfIdentity: string = null,
    idNumber: string = null,
    clientTypeName: string = null
  ): Observable<Leads> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('modeOfIdentity', `${modeOfIdentity}`)
      .set('idNumber', `${idNumber}`)
      .set('clientTypeName', `${clientTypeName}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Leads>(
      ``,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createLead(data: Leads): Observable<Leads> {
    return this.api.POST<Leads>(
      `leads`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateLead(data: any, leadId: number): Observable<Leads> {
    return this.api.PATCH<Leads>(
      `leads/${leadId}`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteLead(leadId: number) {
    return this.api.DELETE<Leads>(
      `leads/${leadId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

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

  getLeads(): Observable<Leads[]> {
    return this.api.GET<Leads[]>(
      `leads`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getLeadComments(): Observable<LeadCommentDto[]> {
    return this.api.GET<LeadCommentDto[]>(
      `lead-comments`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createLeadComment(data: LeadCommentDto): Observable<LeadCommentDto> {
    return this.api.POST<LeadCommentDto>(
      `lead-comments`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateLeadComment(
    leadCommentId: number,
    data: LeadCommentDto
  ): Observable<LeadCommentDto> {
    return this.api.PUT<LeadCommentDto>(
      `lead-comments/${leadCommentId}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteLeadComment(leadCommentId: number) {
    return this.api.DELETE<LeadCommentDto>(
      `lead-comments/${leadCommentId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  assignLeadActivity(
    data: LeadActivityDto,
    leadCode: number
  ): Observable<LeadActivityDto> {
    const paramsObj: { [param: string]: string } = {};
    paramsObj['leadCode'] = leadCode.toString();

    const params = new HttpParams({ fromObject: paramsObj });
    return this.api.POST<LeadActivityDto>(
      'lead-activities',
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }
}
