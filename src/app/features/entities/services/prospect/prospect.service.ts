import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { Pagination } from '../../../../shared/data/common/pagination';
import { ApiService } from '../../../../shared/services/api/api.service';
import { UtilService } from '../../../../shared/services/util/util.service';
import { ProspectDto } from '../../data/prospectDto';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ProspectService {
  constructor(private api: ApiService, private utilService: UtilService) {}

  getAllProspects(
    page: number,
    size: number = 10,
    sortField: string = 'type',
    order: string = 'desc'
  ): Observable<Pagination<ProspectDto>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<ProspectDto>>(
      `prospects`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  searchProspects(
    page: number,
    size: number = 5,
    name: string,
    modeOfIdentity: string = null,
    idNumber: string = null,
    clientTypeName: string = null
  ): Observable<ProspectDto> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('modeOfIdentity', `${modeOfIdentity}`)
      .set('idNumber', `${idNumber}`)
      .set('clientTypeName', `${clientTypeName}`);

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<ProspectDto>(
      `prospects`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  createProspect(data: ProspectDto): Observable<ProspectDto> {
    return this.api.POST<ProspectDto>(
      `prospects`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateProspect(data: any, prospectId: number): Observable<ProspectDto> {
    return this.api.PATCH<ProspectDto>(
      `prospects/${prospectId}`,
      JSON.stringify(data),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteProspect(prospectId: number) {
    return this.api.DELETE<ProspectDto>(
      `prospects/${prospectId}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }
}
