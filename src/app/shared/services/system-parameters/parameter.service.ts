import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../core/config/app-config-service";
import {ParameterDto} from "../../data/common/parameter-dto";
import {UtilService} from "../util/util.service";
import {Logger} from "../logger/logger.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";

const log = new Logger('ParameterService');

/**
 * Service class to manage system parameters related operations
 */
@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient, private utilService:UtilService) { }

  /**
   * Fetches all parameters for a given organization
   * @param parameterName - name of the parameter
   * @param organizationId - organization ID
   * @returns {Observable<ParameterDto[]>} list of parameters
   * @private
   */
  private getParameters(parameterName: string , organizationId: number): Observable<ParameterDto[]>{
    log.info('Fetching all parameters for organization: ', organizationId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const params = new HttpParams()
      .set('name', `${parameterName}`)
      .set('organizationId', `${organizationId}`);

    let queryparamObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.http.get<ParameterDto[]>(`/${this.baseUrl}/setups/parameters`, {headers:headers, params:queryparamObject});
  }

  /**
   * Fetches all parameters for a given organization
   * @param parameterName - name of the parameter
   * @param organization - organization ID
   * @returns {Observable<ParameterDto[]>} list of parameters
   */
  getAllParameters(parameterName: string, organization: number): Observable<ParameterDto[]>{
    return this.getParameters(parameterName, organization);
  }

  /**
   * Fetches a parameter by name
   * @param parameterName - name of the parameter
   * @param organizationId - organization ID
   * @returns {Observable<ParameterDto>}
   */
  getParameterByName(parameterName: string, organizationId: number): Observable<ParameterDto>{
    log.info('Fetching parameter: ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(map(parameters => parameters[0]));
  }

  /**
   * Fetches a parameter value by name
   * @param parameterName - name of the parameter
   * @param organizationId - Organization ID
   * @returns {Observable<string>} - parameter value
   */
  getParameterValue(parameterName: string, organizationId: number): Observable<string> {
    log.info('Fetching parameter value for : ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(map(parameters => parameters[0]?.value));
  }

  /**
   * Fetches a parameter by ID
   * @param parameterId {number} - parameter ID
   * @returns {Observable<ParameterDto>} - parameter
   */
  getParameterById(parameterId: number): Observable<ParameterDto> {
    log.info('Fetching parameters for ID: ', parameterId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`);
  }

  /**
   * Creates a new parameter
   * @param parameter {ParameterDto} - parameter to be created
   * @returns {Observable<ParameterDto>} - created parameter
   */
  createParameter(parameter: ParameterDto): Observable<ParameterDto>{
    log.info('Saving new parameter ', parameter.name);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<ParameterDto>(`/${this.baseUrl}/setups/parameters/`, JSON.stringify(parameter), {headers:headers});
  }

  /**
   * Updates a parameter
   * @param updatedParameter {ParameterDto} - parameter to be updated
   * @returns {Observable<ParameterDto>} - updated parameter
   */
  updateParameter(updatedParameter: ParameterDto): Observable<ParameterDto>{
    log.info('Updating parameter ', updatedParameter.name);

    let parameterId = updatedParameter.id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.put<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`, JSON.stringify(updatedParameter), {headers:headers});
  }

  /**
   * Deletes a parameter
   * @param parameterId {number} - parameter ID
   * @returns {Observable<ParameterDto>} - deleted parameter
   */
  deleteParameter(parameterId: number): Observable<ParameterDto> {
    log.info('Deleting parameter ', parameterId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.delete<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`, {headers:headers});
  }
}
