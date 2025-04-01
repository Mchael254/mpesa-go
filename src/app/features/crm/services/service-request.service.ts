import { Injectable } from '@angular/core';
import {ApiService} from "../../../shared/services/api/api.service";
import {Observable} from "rxjs";
import {API_CONFIG} from "../../../../environments/api_service_config";
import {
  ServiceRequestCategoryDTO, ServiceRequestDocumentsDTO,
  ServiceRequestIncidentDTO, ServiceRequestsDTO,
  ServiceRequestStatusDTO
} from "../data/service-request-dto";
import {HttpParams} from "@angular/common/http";
import {UtilService} from "../../../shared/services";
import {Pagination} from "../../../shared/data/common/pagination";

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(
    private apiService: ApiService,
    private utilService: UtilService
  ) { }

  getRequestStatus(): Observable<ServiceRequestStatusDTO[]> {
    return this.apiService.GET<ServiceRequestStatusDTO[]>(
      `service-request/status`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  createRequestStatus(data: ServiceRequestStatusDTO): Observable<ServiceRequestStatusDTO> {
    return this.apiService.POST<ServiceRequestStatusDTO>(
      `service-request/status`,
      JSON.stringify(data),
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  updateRequestStatus(
    requestStatusId: number,
    data: ServiceRequestStatusDTO
  ): Observable<ServiceRequestStatusDTO> {
    return this.apiService.PUT<ServiceRequestStatusDTO>(
      `service-request/status/${requestStatusId}`,
      data,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  deleteRequestStatus(requestStatusId: number) {
    return this.apiService.DELETE<ServiceRequestStatusDTO>(
      `service-request/status/${requestStatusId}`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getMainStatus(): Observable<any> {
    return this.apiService.GET<any>(
      `service-request/main-statuses`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestCategory(): Observable<ServiceRequestCategoryDTO[]> {
    return this.apiService.GET<ServiceRequestCategoryDTO[]>(
      `service-request/categories`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  createRequestCategory(data: ServiceRequestCategoryDTO): Observable<ServiceRequestCategoryDTO> {
    return this.apiService.POST<ServiceRequestCategoryDTO>(
      `service-request/categories`,
      JSON.stringify(data),
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  updateRequestCategory(
    requestStatusId: number,
    data: ServiceRequestCategoryDTO
  ): Observable<ServiceRequestCategoryDTO> {
    return this.apiService.PUT<ServiceRequestCategoryDTO>(
      `service-request/categories/${requestStatusId}`,
      data,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  deleteRequestCategory(requestStatusId: number) {
    return this.apiService.DELETE<ServiceRequestCategoryDTO>(
      `service-request/categories/${requestStatusId}`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getServiceRequests(
    page: number | null = 1,
    size: number | null = 10,
    sort: string = 'desc',
    status: string = null,
    statusCode: number = null,
    accountType: string = null,
    accountCode: number = null,
    assignee: number = null,
    ownerType: string = null,
    ownerCode: number = null
  ): Observable<Pagination<ServiceRequestsDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sort', `${sort}`)
      .set('status', `${status}`)
      .set('statusCode', `${statusCode}`)
      .set('accountType', `${accountType}`)
      .set('accountCode', `${accountCode}`)
      .set('assignee', `${assignee}`)
      .set('ownerType', `${ownerType}`)
      .set('ownerCode', `${ownerCode}`)
    ;
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<Pagination<ServiceRequestsDTO>>(
      `service-requests`,
      API_CONFIG.CRM_SERVICE_REQUEST,
      paramObject
    );
  }

  createServiceRequest(data: ServiceRequestsDTO): Observable<ServiceRequestsDTO> {
    return this.apiService.POST<ServiceRequestsDTO>(
      `service-requests`,
      JSON.stringify(data),
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestAccTypes(): Observable<any> {
    return this.apiService.GET<any>(
      `service-request/account-types`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestIncidents(): Observable<ServiceRequestIncidentDTO[]> {
    return this.apiService.GET<ServiceRequestIncidentDTO[]>(
      `service-request/incidents`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  createRequestIncident(data: ServiceRequestIncidentDTO): Observable<ServiceRequestIncidentDTO> {
    return this.apiService.POST<ServiceRequestIncidentDTO>(
      `service-request/incidents`,
      JSON.stringify(data),
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  updateRequestIncident(
    requestIncidentId: number,
    data: ServiceRequestIncidentDTO
  ): Observable<ServiceRequestIncidentDTO> {
    return this.apiService.PUT<ServiceRequestIncidentDTO>(
      `service-request/incidents/${requestIncidentId}`,
      data,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  deleteRequestIncident(requestIncidentId: number) {
    return this.apiService.DELETE<ServiceRequestIncidentDTO>(
      `service-request/incidents/${requestIncidentId}`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestDocuments(): Observable<ServiceRequestDocumentsDTO[]> {
    return this.apiService.GET<ServiceRequestDocumentsDTO[]>(
      `service-request/documents`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  createRequestDocument(data: ServiceRequestDocumentsDTO): Observable<ServiceRequestDocumentsDTO> {
    return this.apiService.POST<ServiceRequestDocumentsDTO>(
      `service-request/documents`,
      JSON.stringify(data),
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  updateRequestDocument(
    requestDocId: number,
    data: ServiceRequestDocumentsDTO
  ): Observable<ServiceRequestDocumentsDTO> {
    return this.apiService.PUT<ServiceRequestDocumentsDTO>(
      `service-request/documents/${requestDocId}`,
      data,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  deleteRequestDocument(requestDocId: number) {
    return this.apiService.DELETE<ServiceRequestDocumentsDTO>(
      `service-request/documents/${requestDocId}`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestSources(): Observable<any> {
    return this.apiService.GET<any>(
      `service-request/request-sources`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }

  getRequestCommunicationModes(): Observable<any> {
    return this.apiService.GET<any>(
      `service-request/communication-modes`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }
}
