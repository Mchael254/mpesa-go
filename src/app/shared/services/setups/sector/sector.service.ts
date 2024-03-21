import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

import { Logger } from '../../logger/logger.service';
import { SectorDTO } from '../../../data/common/sector-dto';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

const log = new Logger('SectorService');

/**
 * This is a service class to manage sector related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class SectorService {
  constructor(private api: ApiService) {}

  /**
   * Get all sector for a given organization.
   * @param organizationId Organization ID
   * @returns {SectorDTO[]} List of sector
   */
  getSectors(organizationId: number): Observable<SectorDTO[]> {
    log.info('Fetching Sectors');
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.api.GET<SectorDTO[]>(
      `sectors`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getSectorById(sectorId: number) {
    return this.api.GET<SectorDTO>(
      `sectors/${sectorId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createSector(data: SectorDTO): Observable<SectorDTO> {
    return this.api.POST<SectorDTO>(
      `sectors`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateSector(sectorId: number, data: SectorDTO): Observable<SectorDTO> {
    return this.api.PUT<SectorDTO>(
      `sectors/${sectorId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteSector(sectorId: number) {
    return this.api.DELETE<SectorDTO>(
      `sectors/${sectorId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
