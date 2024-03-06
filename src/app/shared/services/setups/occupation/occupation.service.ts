import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import {
  OccupationDTO,
  OccupationSectorDTO,
} from '../../../data/common/occupation-dto';

const log = new Logger('OccupationService');

/**
 * The service to manage occupation operations.
 */

@Injectable({
  providedIn: 'root',
})
export class OccupationService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Get all occupations for a given organization.
   * @param organizationId Organization ID
   * @returns {Observable<OccupationDTO[]>} List of occupations
   */
  getOccupations(organizationId: number): Observable<OccupationDTO[]> {
    log.info('Fetching Occupations');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams().set('organizationId', `${organizationId}`);

    return this.http.get<OccupationDTO[]>(
      `/${this.baseUrl}/setups/occupations`,
      { headers: header, params: params }
    );
  }

  getOccupationById(occupationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<OccupationDTO>(
      `/${this.baseUrl}/setups/occupations/${occupationId}`,
      { headers: headers }
    );
  }

  getOccupationBySectorId(sectorId: number): Observable<OccupationDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<OccupationDTO[]>(
      `/${this.baseUrl}/setups/occupations/${sectorId}/occupations`,
      { headers: headers }
    );
  }

  createOccupation(data: OccupationDTO): Observable<OccupationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OccupationDTO>(
      `/${this.baseUrl}/setups/occupations`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  createAssignOcuupation(
    data: OccupationSectorDTO
  ): Observable<OccupationSectorDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<OccupationSectorDTO>(
      `/${this.baseUrl}/setups/occupations/assignOccupation`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateOccupation(
    occupationId: number,
    data: OccupationDTO
  ): Observable<OccupationDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<OccupationDTO>(
      `/${this.baseUrl}/setups/occupations/${occupationId}`,
      data,
      { headers: headers }
    );
  }

  deleteOccupation(occupationId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OccupationDTO>(
      `/${this.baseUrl}/setups/occupations/${occupationId}`,
      { headers: headers }
    );
  }

  deactivateAssignOccupation(occupationId: number, sectorId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<OccupationDTO>(
      `/${this.baseUrl}/setups/occupations/${sectorId}/${occupationId}`,
      { headers: headers }
    );
  }
}
