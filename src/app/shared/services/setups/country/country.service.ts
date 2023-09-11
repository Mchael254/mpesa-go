import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient} from "@angular/common/http";
import {CountryDto, StateDto, TownDto} from "../../../data/common/countryDto";
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
   * @returns Observable<CountryDto[]> list of countries
   */
  getCountries(): Observable<CountryDto[]> {
    log.info('Fetching countries');
    return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`);
  }

  /**
   * Fetch a country by id
   * @param countryId Country Id
   * @returns Observable<CountryDto> Country
   */
  getCountryById(countryId: number): Observable<CountryDto>{
    log.info('Fetching county of id: '+ countryId);
    return this.http.get<CountryDto>(`/${this.baseUrl}/setups/countries/${countryId}`);
  }

  /**
   * Fetch all states
   * @returns Observable<StateDto[]> list of states
   */
  getMainCityStates(): Observable<StateDto[]>{
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/states`);
  }

  /**
   * Fetch all states by country
   * @param id Country Id
   * @returns Observable<StateDto[]> list of states
   */
  getMainCityStatesByCountry(id: number): Observable<StateDto[]>{
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/countries/${id}/states`);
  }

  /**
   * Fetch a state by id
   * @param stateId State Id
   * @returns Observable<StateDto> State
   */
  getMainCityStateById(stateId: number): Observable<StateDto>{
    log.info('Fetching city state of id: '+ stateId);
    return this.http.get<StateDto>(`/${this.baseUrl}/setups/states/${stateId}`);
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
}
