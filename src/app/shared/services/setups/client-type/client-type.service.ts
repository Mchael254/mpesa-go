import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import { isObservable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { ClientTypeDTO } from 'src/app/shared/data/common/client-type';
import { ApiService } from '../../api/api.service';

const log = new Logger('ClientTypeService');

@Injectable({
  providedIn: 'root',
})
export class ClientTypeService {
  baseUrl = this.appConfig.config.contextPath.accounts_services;

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient,
    private api: ApiService
  ) {}

  getClientypeList(): { id: number; description: string }[] {
    log.info('Fetching Client Type');
    // return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`);
    return [
      { id: 1, description: 'Corporate' },
      { id: 2, description: 'Individual' },
    ];
  }
  getClientTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.http.get<any[]>(
      `/${this.baseUrl}/client-types?organizationId=2`
    );
  }
  getIdentifierTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.http.get<any[]>(
      `/${this.baseUrl}/identity-modes?organizationId=2`
    );
  }

  getClientType(
    name?: string,
    shortDescription?: string,
    status?: string,
    category?: string,
    clientTypeName?: string,
    description?: string,
    organizationId?: number,
    type?: string
  ): Observable<ClientTypeDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Create an object to hold parameters only if they are provided
    const paramsObj: { [param: string]: string } = {};
    if (name) {
      paramsObj['name'] = name;
    }
    if (shortDescription) {
      paramsObj['shortDescription'] = shortDescription;
    }
    if (status) {
      paramsObj['status'] = status;
    }
    if (category) {
      paramsObj['category'] = category;
    }
    if (clientTypeName) {
      paramsObj['clientTypeName'] = clientTypeName;
    }
    if (description) {
      paramsObj['description'] = description;
    }
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }
    if (type) {
      paramsObj['type'] = type;
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.http.get<ClientTypeDTO[]>(`/${this.baseUrl}/client-types`, {
      headers: headers,
      params: params,
    });
  }

  createClientType(data: ClientTypeDTO): Observable<ClientTypeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<ClientTypeDTO>(
      `/${this.baseUrl}/client-types`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateClientType(
    clientTypeCode: number,
    data: ClientTypeDTO
  ): Observable<ClientTypeDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<ClientTypeDTO>(
      `/${this.baseUrl}/client-types/${clientTypeCode}`,
      data,
      { headers: headers }
    );
  }

  deleteClientType(clientTypeCode: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<ClientTypeDTO>(
      `/${this.baseUrl}/client-types/${clientTypeCode}`,
      { headers: headers }
    );
  }
}
