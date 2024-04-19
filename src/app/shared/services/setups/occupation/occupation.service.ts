import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Logger } from '../../logger/logger.service';
import {
  OccupationDTO,
  OccupationSectorDTO,
  PostOccupationDTO,
} from '../../../data/common/occupation-dto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

const log = new Logger('OccupationService');

/**
 * The service to manage occupation operations.
 */

@Injectable({
  providedIn: 'root',
})
export class OccupationService {
  constructor(private api: ApiService) {}

  /**
   * Get all occupations for a given organization.
   * @param organizationId Organization ID
   * @returns {Observable<OccupationDTO[]>} List of occupations
   */
  getOccupations(organizationId?: number): Observable<OccupationDTO[]> {
    log.info('Fetching Occupations');
    const paramsObj: { [param: string]: string } = {};

    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({ fromObject: paramsObj });

    return this.api.GET<OccupationDTO[]>(
      `occupations`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getOccupationById(occupationId: number) {
    return this.api.GET<OccupationDTO>(
      `occupations/${occupationId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getOccupationBySectorId(sectorId: number): Observable<OccupationDTO[]> {
    return this.api.GET<OccupationDTO[]>(
      `sectors/${sectorId}/occupations`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createOccupation(data: PostOccupationDTO): Observable<PostOccupationDTO> {
    return this.api.POST<PostOccupationDTO>(
      `occupations`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createAssignOcuupation(
    data: OccupationSectorDTO
  ): Observable<OccupationSectorDTO> {
    return this.api.POST<OccupationSectorDTO>(
      `occupations/assignOccupation`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateOccupation(
    occupationId: number,
    data: PostOccupationDTO
  ): Observable<PostOccupationDTO> {
    return this.api.PUT<PostOccupationDTO>(
      `occupations/${occupationId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteOccupation(occupationId: number) {
    return this.api.DELETE<OccupationDTO>(
      `occupations/${occupationId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deactivateAssignOccupation(occupationId: number, sectorId: number) {
    return this.api.DELETE<OccupationDTO>(
      `occupations/${sectorId}/${occupationId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
