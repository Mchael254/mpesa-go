import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../core/config/app-config-service";
import {HttpClient} from "@angular/common/http";
import {CountryDto, StateDto, TownDto} from "../../data/common/countryDto";
import {Observable} from "rxjs/internal/Observable";
import {Logger} from "../logger.service";

const log = new Logger('CountryService');
@Injectable({
  providedIn: 'root'
})
export class CountryService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  getCountries(): Observable<CountryDto[]> {
    log.info('Fetching countries');
    return this.http.get<CountryDto[]>(`/${this.baseUrl}/setups/countries`);
  }

  getCountryById(countryId: number): Observable<CountryDto>{
    log.info('Fetching county of id: '+ countryId);
    return this.http.get<CountryDto>(`/${this.baseUrl}/setups/countries/${countryId}`);
  }

  getMainCityStates(): Observable<StateDto[]>{
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/states`);
  }

  getMainCityStatesByCountry(id: number): Observable<StateDto[]>{
    log.info('Fetching city states');
    return this.http.get<StateDto[]>(`/${this.baseUrl}/setups/countries/${id}/states`);
  }

  getMainCityStateById(stateId: number): Observable<StateDto>{
    log.info('Fetching city state of id: '+ stateId);
    return this.http.get<StateDto>(`/${this.baseUrl}/setups/states/${stateId}`);
  }

  getTownById(townId: number): Observable<TownDto>{
    log.info('Fetching town of id: '+ townId);
    return this.http.get<TownDto>(`/${this.baseUrl}/setups/towns/${townId}`);
  }

  getTownsByCountry(countryId: number): Observable<TownDto[]>{
    log.info('Fetching towns of county id: '+ countryId);
    return this.http.get<TownDto[]>(`/${this.baseUrl}/setups/countries/${countryId}/towns`);
  }

  getTownsByMainCityState(id: number): Observable<TownDto[]>{
    return this.http.get<TownDto[]>(`/${this.baseUrl}/setups/states/${id}/towns`);
  }
}
