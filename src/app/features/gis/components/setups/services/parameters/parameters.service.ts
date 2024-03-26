import { Injectable } from '@angular/core';
import {Observable, retry} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Params} from "../../data/gisDTO";
import {AppConfigService} from "../../../../../../core/config/app-config-service";
import {ParameterDto} from "../../../../../../shared/data/common/parameter-dto";
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
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
    private appConfig: AppConfigService,
    private api:ApiService
  ) { }

  getAllParams(): Observable<Params[]>{
    return this.api.GET<Params[]>(`system-parameters?pageSize=10000`,API_CONFIG.GIS_SETUPS_BASE_URL)
  }

  getParam(code: any): Observable<Params[]>{
    return this.api.GET<Params[]>(`system-parameters/${code}`,API_CONFIG.GIS_SETUPS_BASE_URL);
  }
  createParam(param: Params) {
    return this.api.POST<Params>( `system-parameters`,
      JSON.stringify(param), API_CONFIG.GIS_SETUPS_BASE_URL);
  }
  updateParam(param: Params, code: number): Observable<Params> {
    return this.api.PUT<Params>(`system-parameters/${code}`,
      JSON.stringify(param), API_CONFIG.GIS_SETUPS_BASE_URL);
  }

  deleteParameter(code: number): Observable<ParameterDto> {
    return this.api.DELETE<ParameterDto>(`system-parameters/${code}`, API_CONFIG.GIS_SETUPS_BASE_URL);
  }


}
