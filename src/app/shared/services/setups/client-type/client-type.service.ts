import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import { HttpParams } from '@angular/common/http';

import { ClientTypeDTO } from 'src/app/shared/data/common/client-type';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

const log = new Logger('ClientTypeService');

@Injectable({
  providedIn: 'root',
})
export class ClientTypeService {
  constructor(private api: ApiService) {}

  getClientypeList(): { id: number; description: string }[] {
    log.info('Fetching Client Type');
    return [
      { id: 1, description: 'Corporate' },
      { id: 2, description: 'Individual' },
    ];
  }
  getClientTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.api.GET<any[]>(
      `client-types?organizationId=2`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
  getIdentifierTypes(): Observable<any[]> {
    log.info('Fetching Client Types');
    return this.api.GET<any[]>(
      `identity-modes?organizationId=2`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
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

    return this.api.GET<ClientTypeDTO[]>(
      `client-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  createClientType(data: ClientTypeDTO): Observable<ClientTypeDTO> {
    return this.api.POST<ClientTypeDTO>(
      `client-types`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateClientType(
    clientTypeCode: number,
    data: ClientTypeDTO
  ): Observable<ClientTypeDTO> {
    return this.api.PUT<ClientTypeDTO>(
      `client-types/${clientTypeCode}`,
      data,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteClientType(clientTypeCode: number) {
    return this.api.DELETE<ClientTypeDTO>(
      `client-types/${clientTypeCode}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
