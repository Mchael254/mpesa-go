import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../core/config/app-config-service";
import {ParameterDto} from "../data/common/parameter-dto";
import {UtilService} from "./util.service";
import {Logger} from "./logger.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";

const log = new Logger('ParameterService');

@Injectable({
  providedIn: 'root'
})
export class ParameterService {

  private baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient, private utilService:UtilService) { }

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

  getAllParameters(parameterName: string, organization: number): Observable<ParameterDto[]>{
    return this.getParameters(parameterName, organization);
  }

  getParameterByName(parameterName: string, organizationId: number): Observable<ParameterDto>{
    log.info('Fetching parameter: ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(map(parameters => parameters[0]));
  }

  getParameterValue(parameterName: string, organizationId: number): Observable<string> {
    log.info('Fetching parameter value for : ', parameterName);
    return this.getParameters(parameterName, organizationId).pipe(map(parameters => parameters[0]?.value));
  }

  getParameterById(parameterId: number): Observable<ParameterDto> {
    log.info('Fetching parameters for ID: ', parameterId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`);
  }

  createParameter(parameter: ParameterDto): Observable<ParameterDto>{
    log.info('Saving new parameter ', parameter.name);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post<ParameterDto>(`/${this.baseUrl}/setups/parameters/`, JSON.stringify(parameter), {headers:headers});
  }

  updateParameter(updatedParameter: ParameterDto): Observable<ParameterDto>{
    log.info('Updating parameter ', updatedParameter.name);

    let parameterId = updatedParameter.id;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.put<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`, JSON.stringify(updatedParameter), {headers:headers});
  }

  deleteParameter(parameterId: number): Observable<ParameterDto> {
    log.info('Deleting parameter ', parameterId);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.delete<ParameterDto>(`/${this.baseUrl}/setups/parameters/${parameterId}`, {headers:headers});
  }
}
