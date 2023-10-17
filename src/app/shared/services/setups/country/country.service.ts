import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AdminstrativeUnitDTO, CountryDTO, PostCountryDTO, PostStateDTO, StateDTO , SubadminstrativeUnitDTO, TownDto} from "../../../data/common/countryDto";
import {Observable} from "rxjs/internal/Observable";
import {Logger} from "../../logger/logger.service";

const log = new Logger('CountryService');

/**
 * This service is used to manage countries, states and towns
 */

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  /**
   * Fetch all countries
   * @returns Observable<CountryDTO[]> list of countries
   */
  getCountries(): Observable<CountryDTO[]> {
    log.info('Fetching countries');
    return this.http.get<CountryDTO[]>(`/${this.baseUrl}/setups/countries`);
  }

  /**
   * Fetch a country by id
   * @param countryId Country Id
   * @returns Observable<CountryDTO> Country
   */
  getCountryById(countryId: number): Observable<CountryDTO>{
    log.info('Fetching county of id: '+ countryId);
    return this.http.get<CountryDTO>(`/${this.baseUrl}/setups/countries/${countryId}`);
  }

  /**
   * Fetch all states
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStates(): Observable<StateDTO []>{
    log.info('Fetching city states');
    return this.http.get<StateDTO[]>(`/${this.baseUrl}/setups/states`);
  }

  /**
   * Fetch all states by country
   * @param id Country Id
   * @returns Observable<StateDTO []> list of states
   */
  getMainCityStatesByCountry(id: number): Observable<StateDTO []>{
    log.info('Fetching city states');
    return this.http.get<StateDTO[]>(`/${this.baseUrl}/setups/countries/${id}/states`);
  }

  /**
   * Fetch a state by id
   * @param stateId State Id
   * @returns Observable<StateDTO > State
   */
  getMainCityStateById(stateId: number): Observable<StateDTO >{
    log.info('Fetching city state of id: '+ stateId);
    return this.http.get<StateDTO>(`/${this.baseUrl}/setups/states/${stateId}`);
  }

  /**
   * Fetch all towns
   * @param townId Town Id
   * @returns Observable<TownDto> Town
   */
  getTownById(townId: number): Observable<TownDto>{
    log.info('Fetching town of id: '+ townId);
    return this.http.get<TownDto>(`/${this.baseUrl}/setups/towns/${townId}`);
  }

  /**
   * Fetch all towns by country
   * @param countryId Country Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByCountry(countryId: number): Observable<TownDto[]>{
    log.info('Fetching towns of county id: '+ countryId);
    return this.http.get<TownDto[]>(`/${this.baseUrl}/setups/countries/${countryId}/towns`);
  }

  /**
   * Fetch all towns by state
   * @param id State Id
   * @returns Observable<TownDto[]> list of towns
   */
  getTownsByMainCityState(id: number): Observable<TownDto[]>{
    return this.http.get<TownDto[]>(`/${this.baseUrl}/setups/states/${id}/towns`);
  }

  createCountry(data: PostCountryDTO): Observable<PostCountryDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostCountryDTO>(`/${this.baseUrl}/setups/countries`, JSON.stringify(data), {headers:headers})
  }

  updateCountry(countryId: number, data: PostCountryDTO): Observable<PostCountryDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<PostCountryDTO>(`/${this.baseUrl}/setups/countries/${countryId}`,
      data, { headers: headers })
  }

  createState(data: PostStateDTO ): Observable<PostStateDTO > {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<PostStateDTO >(`/${this.baseUrl}/setups/states`, JSON.stringify(data), {headers:headers})
  }

  getAdminstrativeUnit(): Observable<AdminstrativeUnitDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<AdminstrativeUnitDTO[]>(`/${this.baseUrl}/setups/administrative-units`);
  }

  getSubadminstrativeUnit(): Observable<SubadminstrativeUnitDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<SubadminstrativeUnitDTO[]>(`/${this.baseUrl}/setups/sub-administrative-units`);
  }
}
