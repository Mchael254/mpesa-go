import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { ParameterDto } from '../../data/common/parameter-dto';
import { UtilService } from '../util/util.service';
import { Logger } from '../logger/logger.service';
import { ApiService } from '../api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

const log = new Logger('ParameterService');

/**
 * Service class to manage system parameters related operations
 */
@Injectable({
  providedIn: 'root',
})
export class ParameterService {
  constructor(private utilService: UtilService, private api: ApiService) {}

  /**
   * Fetches all parameters for a given organization
   * @param parameterName - name of the parameter
   * @param organizationId - organization ID
   * @returns {Observable<ParameterDto[]>} list of parameters
   * @private
   */
  private getParameters(
    parameterName: string,
    organizationId: number
  ): Observable<ParameterDto[]> {
    log.info('Fetching all parameters for organization: ', organizationId);
    const params = new HttpParams()
      .set('name', `${parameterName}`)
      .set('organizationId', `${organizationId}`);

    let queryparamObject =
      this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<ParameterDto[]>(
      `parameters`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      queryparamObject
    );
  }

  /**
   * Fetches all parameters for a given organization
   * @param parameterName - name of the parameter
   * @param organization - organization ID
   * @returns {Observable<ParameterDto[]>} list of parameters
   */
  getAllParameters(
    parameterName: string,
    organization: number
  ): Observable<ParameterDto[]> {
    return this.getParameters(parameterName, organization);
  }

  /**
   * Fetches a parameter by name
   * @param parameterName - name of the parameter
   * @param organizationId - organization ID
   * @returns {Observable<ParameterDto>}
   */
  getParameterByName(
    parameterName: string,
    organizationId: number
  ): Observable<ParameterDto> {
    log.info('Fetching parameter: ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(
      map((parameters) => parameters[0])
    );
  }

  /**
   * Fetches a parameter value by name
   * @param parameterName - name of the parameter
   * @param organizationId - Organization ID
   * @returns {Observable<string>} - parameter value
   */
  getParameterValue(
    parameterName: string,
    organizationId: number
  ): Observable<string> {
    log.info('Fetching parameter value for : ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(
      map((parameters) => parameters[0]?.value)
    );
  }

  /**
   * Fetches a parameter by ID
   * @param parameterId {number} - parameter ID
   * @returns {Observable<ParameterDto>} - parameter
   */
  getParameterById(parameterId: number): Observable<ParameterDto> {
    log.info('Fetching parameters for ID: ', parameterId);
    return this.api.GET<ParameterDto>(
      `parameters/${parameterId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Creates a new parameter
   * @param parameter {ParameterDto} - parameter to be created
   * @returns {Observable<ParameterDto>} - created parameter
   */
  createParameter(parameter: ParameterDto): Observable<ParameterDto> {
    log.info('Saving new parameter ', parameter.name);
    return this.api.POST<ParameterDto>(
      `parameters/`,
      JSON.stringify(parameter),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Updates a parameter
   * @param updatedParameter {ParameterDto} - parameter to be updated
   * @returns {Observable<ParameterDto>} - updated parameter
   */
  updateParameter(updatedParameter: ParameterDto): Observable<ParameterDto> {
    log.info('Updating parameter ', updatedParameter.name);

    let parameterId = updatedParameter.id;
    return this.api.PUT<ParameterDto>(
      `parameters/${parameterId}`,
      JSON.stringify(updatedParameter),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  /**
   * Deletes a parameter
   * @param parameterId {number} - parameter ID
   * @returns {Observable<ParameterDto>} - deleted parameter
   */
  deleteParameter(parameterId: number): Observable<ParameterDto> {
    log.info('Deleting parameter ', parameterId);

    return this.api.DELETE<ParameterDto>(
      `parameters/${parameterId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
