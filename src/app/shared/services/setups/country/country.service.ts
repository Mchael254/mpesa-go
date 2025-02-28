import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

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
  TownDto, PostalCodesDTO,
} from '../../../data/common/countryDto';
import { Logger } from '../../logger/logger.service';
import { ApiService } from '../../api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

import { SESSION_KEY } from '../../../../features/lms/util/session_storage_enum';
import { StringManipulation } from '../../../../features/lms/util/string_manipulation';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import {UtilService} from "../../util/util.service";

const log = new Logger('CountryService');

/**
 * This service is used to manage countries, states and towns
 */

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(
    private api: ApiService,
    private utilService: UtilService
  ) {}

  /**
   * Fetch all countries
   * @returns Observable<CountryDTO[]> list of countries
   */
  getCountries(): Observable<CountryDto[]> {
    return this.api.GET<CountryDto[]>(
      `countries`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch a country by id
   * @param countryId Country Id
   * @returns Observable<CountryDTO> Country
   */
  getCountryById(countryId: number): Observable<CountryDto> {
    return this.api.GET<CountryDto>(
      `countries/${countryId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch all states
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStates(): Observable<StateDto[]> {
    return this.api.GET<StateDto[]>(
      `states`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch all states by country
   * @param id Country Id
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStatesByCountry(id: number): Observable<StateDto[]> {
    return this.api.GET<StateDto[]>(
      `countries/${id}/states`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch a state by id
   * @param stateId State Id
   * @returns Observable<StateDTO > State
   */
  getMainCityStateById(stateId: number): Observable<StateDto> {
    return this.api.GET<StateDto>(
      `states/${stateId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch all towns
   * @param townId Town Id
   * @returns Observable<TownDto> Town
   */
  getTownById(townId: number): Observable<TownDto> {
    return this.api.GET<TownDto>(
      `towns/${townId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch all towns by country
   * @param countryId Country Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByCountry(countryId: number): Observable<TownDto[]> {
    return this.api.GET<TownDto[]>(
      `countries/${countryId}/towns`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Fetch all towns by state
   * @param id State Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByMainCityState(id: number): Observable<TownDto[]> {
    return this.api.GET<TownDto[]>(
      `states/${id}/towns`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createCountry(data: PostCountryDTO): Observable<PostCountryDTO> {
    return this.api.POST<PostCountryDTO>(
      `countries`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateCountry(
    countryId: number,
    data: PostCountryDTO
  ): Observable<PostCountryDTO> {
    return this.api.PUT<PostCountryDTO>(
      `countries/${countryId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteCountry(countryId: number) {
    return this.api.DELETE<CountryDto>(
      `countries/${countryId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createState(data: PostStateDTO): Observable<PostStateDTO> {
    return this.api.POST<PostStateDTO>(
      `states`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateState(stateId: number, data: PostStateDTO): Observable<PostStateDTO> {
    return this.api.PUT<PostStateDTO>(
      `states/${stateId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteState(stateId: number) {
    return this.api.DELETE(
      `states/${stateId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createTown(data: PostTownDTO): Observable<PostTownDTO> {
    return this.api.POST<PostTownDTO>(
      `towns`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateTown(townId: number, data: PostTownDTO): Observable<PostTownDTO> {
    return this.api.PUT<PostTownDTO>(
      `towns/${townId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteTown(townId: number) {
    return this.api.DELETE<PostTownDTO>(
      `towns/${townId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getAdminstrativeUnit(): Observable<AdminstrativeUnitDTO[]> {
    return this.api.GET<AdminstrativeUnitDTO[]>(
      `administrative-units`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getSubadminstrativeUnit(): Observable<SubadminstrativeUnitDTO[]> {
    return this.api.GET<SubadminstrativeUnitDTO[]>(
      `sub-administrative-units`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getSubCountyByStateId(stateId: number): Observable<SubCountyDTO[]> {
    return this.api.GET<SubCountyDTO[]>(
      `states/${stateId}/districts`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createDistrict(data: SubCountyDTO): Observable<SubCountyDTO> {
    return this.api.POST<SubCountyDTO>(
      `districts`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateDistrict(
    districtId: number,
    data: SubCountyDTO
  ): Observable<SubCountyDTO> {
    return this.api.PUT<SubCountyDTO>(
      `districts/${districtId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteDistrict(districtId: number) {
    return this.api.DELETE<SubCountyDTO>(
      `districts/${districtId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getCountryHoliday(countryCode: number): Observable<CountryHolidayDTO[]> {
    const params = new HttpParams().set('countryCode', `${countryCode}`);
    return this.api.GET<CountryHolidayDTO[]>(
      `country-holidays`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  createCountryHoliday(
    data: PostCountryHolidayDTO
  ): Observable<PostCountryHolidayDTO> {
    return this.api.POST<PostCountryHolidayDTO>(
      `country-holidays`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateCountryHoliday(
    id: number,
    data: PostCountryHolidayDTO
  ): Observable<PostCountryHolidayDTO> {
    return this.api.PUT<PostCountryHolidayDTO>(
      `country-holidays/${id}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteCountryHoliday(id: number) {
    return this.api.DELETE<PostCountryHolidayDTO>(
      `country-holidays/${id}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getPostalCodes(townCode: number): Observable<PostalCodesDTO[]> {
    const params = new HttpParams().set('townCode', `${townCode}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<PostalCodesDTO[]>(
      `postal-codes`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      paramObject
    );
  }
}
