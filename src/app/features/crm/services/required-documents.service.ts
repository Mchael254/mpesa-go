import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';

import { AssignedToDTO, RequiredDocumentDTO } from '../data/required-document';
import { AccountTypeDTO } from '../../entities/data/AgentDTO';
import { ProviderTypeDto } from '../../entities/data/ServiceProviderDTO';
import { ClientTypeDTO } from '../../entities/data/ClientDTO';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

interface DropdownItem {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequiredDocumentsService {
  constructor(private api: ApiService) {}

  getRequiredDocuments(
    organizationId?: number
  ): Observable<RequiredDocumentDTO[]> {
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<RequiredDocumentDTO[]>(
      `required-documents`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createRequiredDocument(
    data: RequiredDocumentDTO
  ): Observable<RequiredDocumentDTO> {
    return this.api.POST<RequiredDocumentDTO>(
      `required-documents`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateRequiredDocument(
    documentId: number,
    data: RequiredDocumentDTO
  ): Observable<RequiredDocumentDTO> {
    return this.api.PUT<RequiredDocumentDTO>(
      `required-documents/${documentId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteRequiredDocument(documentId: number) {
    return this.api.DELETE<RequiredDocumentDTO>(
      `required-documents/${documentId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getRequiredDocumentAssignments(
    requiredDocumentId: number
  ): Observable<AssignedToDTO[]> {
    return this.api.GET<AssignedToDTO[]>(
      `required-documents/${requiredDocumentId}/assignments`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createRequiredDocumentAssignment(
    data: AssignedToDTO,
    requiredDocumentId: number
  ): Observable<AssignedToDTO> {
    return this.api.POST<AssignedToDTO>(
      `required-documents/${requiredDocumentId}/assignments`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateRequiredDocumentAssignment(
    requiredDocAssignmentId: number,
    data: AssignedToDTO,
    requiredDocumentId: number
  ): Observable<AssignedToDTO> {
    return this.api.PUT<AssignedToDTO>(
      `required-documents/${requiredDocumentId}/assignments/${requiredDocAssignmentId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteRequiredDocumentAssignment(
    requiredDocAssignmentId: number,
    requiredDocumentId: number
  ) {
    return this.api.DELETE<AssignedToDTO>(
      `required-documents/${requiredDocumentId}/assignments/${requiredDocAssignmentId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getAgentAccountType(organizationId?: number): Observable<DropdownItem[]> {
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });
    return this.api
      .GET<AccountTypeDTO[]>(
        `account-types`,
        API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
        params
      )
      .pipe(
        map((data) =>
          data.map((item) => ({
            label: item.accountType,
            value: item.shortDescription,
          }))
        )
      );
  }

  getServiceProviderType(): Observable<DropdownItem[]> {
    return this.api
      .GET<ProviderTypeDto[]>(
        `service-provider-types`,
        API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
      )
      .pipe(
        map((data) =>
          data.map((item) => ({
            label: item.name,
            value: item.shortDescription,
          }))
        )
      );
  }

  getClientsType(organizationId?: number): Observable<DropdownItem[]> {
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api
      .GET<ClientTypeDTO[]>(
        `client-types`,
        API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
        params
      )
      .pipe(
        map((data) =>
          data.map((item) => ({
            label: item.clientTypeName,
            value: item.description,
          }))
        )
      );
  }

  // Method to fetch all data based on the selected client type
  getAllDataByClientType(clientType: string): Observable<DropdownItem[]> {
    switch (clientType) {
      case 'SP':
      case 'SPR':
        return this.getServiceProviderType();
      case 'A':
      case 'AGENT':
        return this.getAgentAccountType();
      case 'C':
      case 'CLIENT':
        return this.getClientsType();
      default:
        return of([]);
    }
  }

  // Method to fetch combined data for all client types
  getAllCombinedData(): Observable<DropdownItem[]> {
    return combineLatest([
      this.getServiceProviderType(),
      this.getAgentAccountType(),
      this.getClientsType(),
    ]).pipe(
      map(([serviceProviderData, agentData, clientsData]) => {
        return serviceProviderData.concat(agentData, clientsData);
      })
    );
  }
}
