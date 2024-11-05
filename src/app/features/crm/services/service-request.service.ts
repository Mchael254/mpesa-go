import { Injectable } from '@angular/core';
import {ApiService} from "../../../shared/services/api/api.service";
import {Observable} from "rxjs";
import {API_CONFIG} from "../../../../environments/api_service_config";
import {ServiceRequestCategoryDTO, ServiceRequestStatusDTO} from "../data/service-request-dto";
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
    size: number | null = 5,
    sort: string = 'asc',
  ): Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sort', `${sort}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.apiService.GET<Pagination<any>>(
      `service-requests`,
      API_CONFIG.CRM_SERVICE_REQUEST,
      paramObject
    );
  }

  getRequestAccTypes(): Observable<any> {
    return this.apiService.GET<any>(
      `service-request/account-types`,
      API_CONFIG.CRM_SERVICE_REQUEST
    );
  }
}
