import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { ContactMethodDTO, ServiceReqCategoriesDTO, ServiceReqCatTypesDTO } from '../models/admin-policies';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(
    private api:ApiService,
  ) { }

  getContactMethod(): Observable<ContactMethodDTO[]> {
    return this.api.GET<ContactMethodDTO[]>(
      `service-request/contact-method`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getServiceReqCategories(): Observable<ServiceReqCategoriesDTO[]> {
    return this.api.GET<ServiceReqCategoriesDTO[]>(
      `service-request/service-request-categories?srtCode&reqName`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getServiceReqCategoryTypes(): Observable<ServiceReqCatTypesDTO[]> {
    return this.api.GET<ServiceReqCatTypesDTO[]>(
      `service-request/category-types`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getServiceReqPolicies(clientCode: number): Observable<any> {
    return this.api.GET<any>(
      `service-request/request-policies?clntCode=${clientCode}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  postServiceReq(payload) {
    return this.api.POST('service-request/create', payload, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }

  postDocument(data) {
    return this.api.POST('uploadAgentDocs', JSON.stringify(data),API_CONFIG.DMS_SERVICE)
  }

  postDocumentInfo(data) {
    return this.api.POST('service-request/documents', data, API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL)
  }
}
