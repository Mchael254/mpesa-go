import { Injectable } from '@angular/core';
import {Observable, retry} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Params} from "../../data/gisDTO";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {ParameterDto} from "../../../../../../shared/data/common/parameter-dto";

@Injectable({
  providedIn: 'root'
})
export class ParametersService {

  private baseurl = this.appConfig.config.contextPath.gis_services;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    })
  }

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  /**
   * Gets a list of parameters from the DB
   * @return Params[] - an observable
   */
  getAllParams(): Observable<Params[]>{
    return this.http.get<Params[]>(`/${this.baseurl}/setups/api/v1/system-parameters?pageSize=10000`)
  }

  /**
   * Gets a specific parameter from the DB
   * @param code:number
   * @return Params - an observable
   */
  getParam(code: any): Observable<Params>{
    return this.http.get<Params>(`/${this.baseurl}/setups/api/v1/system-parameters/${code}`);
  }

  /**
   * Saves a parameter to the DB
   * @param param:Params
   * @return Params - an observable
   */
  createParam(param: Params): Observable<Params> {
    return this.http.post<Params>( `/${this.baseurl}/setups/api/v1/system-parameters`,
      JSON.stringify(param), this.httpOptions);
  }

  /**
   * Updates a specific parameter in the DB
   * @param param:Params
   * @param code:number
   * @return Params - an observable
   */
  updateParam(param: Params, code: number): Observable<Params> {
    return this.http.put<Params>(`/${this.baseurl}/setups/api/v1/system-parameters/${code}`,
      JSON.stringify(param), this.httpOptions);
  }

  /**
   * Delets a specific parameter from the DB
   * @param code:number
   * @return ParameterDto - an observable
   */
  deleteParameter(code: number): Observable<ParameterDto> {
    return this.http.delete<ParameterDto>(`/${this.baseurl}/setups/api/v1/system-parameters/${code}`, this.httpOptions);
  }


}
