import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { Observable, combineLatest, map, of } from 'rxjs';
import { RequiredDocumentDTO } from '../data/required-document';
import { AccountTypeDTO } from '../../entities/data/AgentDTO';
import { ProviderTypeDto } from '../../entities/data/ServiceProviderDTO';

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

  deleteRequiredDocuments(documentId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<RequiredDocumentDTO>(
      `/${this.baseUrl}/setups/required-documents/${documentId}`,
      { headers: headers }
    );
  }

  getAgentAccountType(organizationId: number): Observable<DropdownItem[]> {
    const baseUrl = this.appConfig.config.contextPath.accounts_services;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);
    return this.http
      .get<AccountTypeDTO[]>(`/${baseUrl}/account-types`, {
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

  getClientsType(): Observable<DropdownItem[]> {
    const data = [
      { label: 'Individual', value: 'I' },
      { label: 'Corporate', value: 'C' },
    ];
    return of(data);
  }

  // Method to fetch all data based on the selected client type
  getAllDataByClientType(clientType: string): Observable<DropdownItem[]> {
    switch (clientType) {
      case 'SP':
      case 'SPR':
        return this.getServiceProviderType();
      case 'A':
      case 'AGENT':
        return this.getAgentAccountType(2);
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
      this.getAgentAccountType(2),
      this.getClientsType(),
    ]).pipe(
      map(([serviceProviderData, agentData, clientsData]) => {
        return serviceProviderData.concat(agentData, clientsData);
      })
    );
  }
}
