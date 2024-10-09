import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pagination } from '../../../../shared/data/common/pagination';
import {
  AccountTypeDTO,
  AgentDTO,
  AgentPostDTO,
  IntermediaryDTO,
} from '../../data/AgentDTO';
import { IdentityModeDTO } from '../../data/entityDto';
import { UtilService } from '../../../../shared/services';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class IntermediaryService {
  constructor(private utilService: UtilService, private api: ApiService) {}

  getAllAgents(): Observable<AgentDTO[]> {
    return this.api.GET<AgentDTO[]>(
      `agents`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getAgents(
    page: number | null = 0,
    size: number | null = 5,
    sortList: string = 'createdDate',
    order: string = 'desc'
  ): Observable<Pagination<AgentDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      // .set('organizationId', 2)
      .set('sortListFields', `${sortList}`)
      .set('order', `${order}`);

    return this.api.GET<Pagination<AgentDTO>>(
      `agents`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getAgentById(id: number): Observable<AgentDTO> {
    return this.api.GET<AgentDTO>(
      `agents/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  searchAgent(
    page: number = 0,
    size: number = 5,
    columnName: string = null,
    columnValue: string = null
  ): Observable<Pagination<AgentDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`);

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<Pagination<AgentDTO>>(
      `agents`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getIdentityType(): Observable<IdentityModeDTO[]> {
    const params = new HttpParams();

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    return this.api.GET<IdentityModeDTO[]>(
      `identity-modes`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  getAccountType(): Observable<AccountTypeDTO[]> {
    const params = new HttpParams();
    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/
    return this.api.GET<AccountTypeDTO[]>(
      `account-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  saveAgentDetails(data: AgentPostDTO): Observable<IntermediaryDTO> {
    return this.api.POST<IntermediaryDTO>(
      `accounts`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
