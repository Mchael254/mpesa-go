import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { Observable, combineLatest, map, of } from 'rxjs';
import { AssignedToDTO, RequiredDocumentDTO } from '../data/required-document';
import { AccountTypeDTO } from '../../entities/data/AgentDTO';
import { ProviderTypeDto } from '../../entities/data/ServiceProviderDTO';
import { ClientTypeDTO } from '../../entities/data/ClientDTO';

interface DropdownItem {
  label: string;
  value: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequiredDocumentsService {
  baseUrl = this.appConfig.config.contextPath.setup_services;
  baseAccUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getRequiredDocuments(
    organizationId?: number
  ): Observable<RequiredDocumentDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http.get<RequiredDocumentDTO[]>(
      `/${this.baseUrl}/setups/required-documents`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createRequiredDocument(
    data: RequiredDocumentDTO
  ): Observable<RequiredDocumentDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<RequiredDocumentDTO>(
      `/${this.baseUrl}/setups/required-documents`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateRequiredDocument(
    documentId: number,
    data: RequiredDocumentDTO
  ): Observable<RequiredDocumentDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<RequiredDocumentDTO>(
      `/${this.baseUrl}/setups/required-documents/${documentId}`,
      data,
      { headers: headers }
    );
  }

  deleteRequiredDocument(documentId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<RequiredDocumentDTO>(
      `/${this.baseUrl}/setups/required-documents/${documentId}`,
      { headers: headers }
    );
  }

  getRequiredDocumentAssignments(
    requiredDocumentId: number
  ): Observable<AssignedToDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.get<AssignedToDTO[]>(
      `/${this.baseUrl}/setups/required-documents/${requiredDocumentId}/assignments`,
      {
        headers: headers,
      }
    );
  }

  createRequiredDocumentAssignment(
    data: AssignedToDTO,
    requiredDocumentId: number
  ): Observable<AssignedToDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<AssignedToDTO>(
      `/${this.baseUrl}/setups/required-documents/${requiredDocumentId}/assignments`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateRequiredDocumentAssignment(
    requiredDocAssignmentId: number,
    data: AssignedToDTO,
    requiredDocumentId: number
  ): Observable<AssignedToDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<AssignedToDTO>(
      `/${this.baseUrl}/setups/required-documents/${requiredDocumentId}/assignments/${requiredDocAssignmentId}`,
      data,
      { headers: headers }
    );
  }

  deleteRequiredDocumentAssignment(
    requiredDocAssignmentId: number,
    requiredDocumentId: number
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<AssignedToDTO>(
      `/${this.baseUrl}/setups/required-documents/${requiredDocumentId}/assignments/${requiredDocAssignmentId}`,
      { headers: headers }
    );
  }

  getAgentAccountType(organizationId?: number): Observable<DropdownItem[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });
    return this.http
      .get<AccountTypeDTO[]>(`/${this.baseAccUrl}/account-types`, {
        headers: headers,
        params: params,
      })
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http
      .get<ProviderTypeDto[]>(`/${this.baseAccUrl}/service-provider-types`, {
        headers: headers,
      })
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http
      .get<ClientTypeDTO[]>(`/${this.baseAccUrl}/client-types`, {
        headers: headers,
        params: params,
      })
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
