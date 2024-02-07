import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../../core/config/app-config-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AdminstrativeUnitDTO,
  CountryDto,
  CountryHolidayDTO,
  PostCountryDTO,
  PostCountryHolidayDTO,
  PostStateDTO,
  PostTownDTO,
  StateDto,
  SubCountyDTO,
  SubadminstrativeUnitDTO,
  TownDto,
} from '../../../data/common/countryDto';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../../logger/logger.service';
import { environment } from '../../../../../environments/environment';

const log = new Logger('CountryService');

/**
 * This service is used to manage countries, states and towns
 */

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  baseUrl = this.appConfig.config.contextPath.setup_services;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': environment.TENANT_ID,
    }),
  };
  constructor(private appConfig: AppConfigService, private http: HttpClient) {}

  /**
   * Fetch all countries
   * @returns Observable<CountryDTO[]> list of countries
   */
  getCountries(): Observable<CountryDto[]> {
    log.info('Fetching countries');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-TenantId': environment.TENANT_ID,
    });
    return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`, {
      headers: headers,
    });
  }

  /**
   * Fetch a country by id
   * @param countryId Country Id
   * @returns Observable<CountryDTO> Country
   */
  getCountryById(countryId: number): Observable<CountryDto> {
    log.info('Fetching county of id: ' + countryId);
    return this.http.get<CountryDto>(
      `/${this.baseUrl}/setups/countries/${countryId}`
    );
  }

  /**
   * Fetch all states
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStates(): Observable<StateDto[]> {
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/states`);
  }

  /**
   * Fetch all states by country
   * @param id Country Id
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStatesByCountry(id: number): Observable<StateDto[]> {
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(
      `/${this.baseUrl}/setups/countries/${id}/states`,
      this.httpOptions
    );
  }

  /**
   * Fetch a state by id
   * @param stateId State Id
   * @returns Observable<StateDTO > State
   */
  getMainCityStateById(stateId: number): Observable<StateDto> {
    log.info('Fetching city state of id: ' + stateId);
    return this.http.get<StateDto>(`/${this.baseUrl}/setups/states/${stateId}`);
  }

  /**
   * Fetch all towns
   * @param townId Town Id
   * @returns Observable<TownDto> Town
   */
  getTownById(townId: number): Observable<TownDto> {
    log.info('Fetching town of id: ' + townId);
    return this.http.get<TownDto>(`/${this.baseUrl}/setups/towns/${townId}`);
  }

  /**
   * Fetch all towns by country
   * @param countryId Country Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByCountry(countryId: number): Observable<TownDto[]> {
    log.info('Fetching towns of county id: ' + countryId);
    return this.http.get<TownDto[]>(
      `/${this.baseUrl}/setups/countries/${countryId}/towns`
    );
  }

  /**
   * Fetch all towns by state
   * @param id State Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByMainCityState(id: number): Observable<TownDto[]> {
    return this.http.get<TownDto[]>(
      `/${this.baseUrl}/setups/states/${id}/towns`,
      this.httpOptions
    );
  }

  createCountry(data: PostCountryDTO): Observable<PostCountryDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostCountryDTO>(
      `/${this.baseUrl}/setups/countries`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateCountry(
    countryId: number,
    data: PostCountryDTO
  ): Observable<PostCountryDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostCountryDTO>(
      `/${this.baseUrl}/setups/countries/${countryId}`,
      data,
      { headers: headers }
    );
  }

  deleteCountry(countryId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<CountryDto>(
      `/${this.baseUrl}/setups/countries/${countryId}`,
      { headers: headers }
    );
  }

  createState(data: PostStateDTO): Observable<PostStateDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostStateDTO>(
      `/${this.baseUrl}/setups/states`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateState(stateId: number, data: PostStateDTO): Observable<PostStateDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostStateDTO>(
      `/${this.baseUrl}/setups/states/${stateId}`,
      data,
      { headers: headers }
    );
  }

  deleteState(stateId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete(`/${this.baseUrl}/setups/states/${stateId}`, {
      headers: headers,
    });
  }

  createTown(data: PostTownDTO): Observable<PostTownDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostTownDTO>(
      `/${this.baseUrl}/setups/towns`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateTown(townId: number, data: PostTownDTO): Observable<PostTownDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostTownDTO>(
      `/${this.baseUrl}/setups/towns/${townId}`,
      data,
      { headers: headers }
    );
  }

  deleteTown(townId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<PostTownDTO>(
      `/${this.baseUrl}/setups/towns/${townId}`,
      { headers: headers }
    );
  }

  getAdminstrativeUnit(): Observable<AdminstrativeUnitDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<AdminstrativeUnitDTO[]>(
      `/${this.baseUrl}/setups/administrative-units`
    );
  }

  getSubadminstrativeUnit(): Observable<SubadminstrativeUnitDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<SubadminstrativeUnitDTO[]>(
      `/${this.baseUrl}/setups/sub-administrative-units`
    );
  }

  getSubCountyByStateId(stateId: number): Observable<SubCountyDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<SubCountyDTO[]>(
      `/${this.baseUrl}/setups/states/${stateId}/districts`,
      { headers: headers }
    );
  }

  createDistrict(data: SubCountyDTO): Observable<SubCountyDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<SubCountyDTO>(
      `/${this.baseUrl}/setups/districts`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateDistrict(
    districtId: number,
    data: SubCountyDTO
  ): Observable<SubCountyDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<SubCountyDTO>(
      `/${this.baseUrl}/setups/districts/${districtId}`,
      data,
      { headers: headers }
    );
  }

  deleteDistrict(districtId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<SubCountyDTO>(
      `/${this.baseUrl}/setups/districts/${districtId}`,
      { headers: headers }
    );
  }

  getCountryHoliday(countryCode: number): Observable<CountryHolidayDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams().set('countryCode', `${countryCode}`);
    return this.http.get<CountryHolidayDTO[]>(
      `/${this.baseUrl}/setups/country-holidays`,
      {
        headers: headers,
        params: params,
      }
    );
  }

  createCountryHoliday(
    data: PostCountryHolidayDTO
  ): Observable<PostCountryHolidayDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostCountryHolidayDTO>(
      `/${this.baseUrl}/setups/country-holidays`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateCountryHoliday(
    id: number,
    data: PostCountryHolidayDTO
  ): Observable<PostCountryHolidayDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostCountryHolidayDTO>(
      `/${this.baseUrl}/setups/country-holidays/${id}`,
      data,
      { headers: headers }
    );
  }

  deleteCountryHoliday(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<PostCountryHolidayDTO>(
      `/${this.baseUrl}/setups/country-holidays/${id}`,
      { headers: headers }
    );
  }
}
