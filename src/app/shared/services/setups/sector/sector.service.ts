import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import { SectorDTO } from '../../../data/common/sector-dto';

const log = new Logger('SectorService');

/**
 * This is a service class to manage sector related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class SectorService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Get all sector for a given organization.
   * @param organizationId Organization ID
   * @returns {SectorDTO[]} List of sector
   */
  getSectors(organizationId: number): Observable<SectorDTO[]> {
    log.info('Fetching Sectors');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.http.get<SectorDTO[]>(`/${this.baseUrl}/setups/sectors`, {
      headers: header,
      params: params,
    });
  }

  getSectorById(sectorId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<SectorDTO>(
      `/${this.baseUrl}/setups/sectors/${sectorId}`,
      { headers: headers }
    );
  }

  createSector(data: SectorDTO): Observable<SectorDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<SectorDTO>(
      `/${this.baseUrl}/setups/sectors`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateSector(sectorId: number, data: SectorDTO): Observable<SectorDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<SectorDTO>(
      `/${this.baseUrl}/setups/sectors/${sectorId}`,
      data,
      { headers: headers }
    );
  }

  deleteSector(sectorId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<SectorDTO>(
      `/${this.baseUrl}/setups/sectors/${sectorId}`,
      { headers: headers }
    );
  }
}
