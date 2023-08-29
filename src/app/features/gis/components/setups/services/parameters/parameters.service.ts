import { Injectable } from '@angular/core';
import {Observable, retry} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Params} from "../../data/gisDTO";
import {AppConfigService} from "../../../../../../core/config/app-config-service";

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

  getAllParams(): Observable<Params[]>{
    return this.http.get<Params[]>(`/${this.baseurl}/setups/api/v1/system-parameters?pageSize=100`)
  }

  getParam(code: any): Observable<Params[]>{
    return this.http.get<Params[]>(`/${this.baseurl}/setups/api/v1/system-parameters/${code}`);
  }
  createParam(param: Params) {
    return this.http.post<Params>( `/${this.baseurl}/setups/api/v1/system-parameters`, JSON.stringify(param), this.httpOptions);
  }
  updateParam(param: Params, code: number): Observable<Params> {
    console.log(`param to update >>> `, param)
    return this.http.put<Params>(`/${this.baseurl}/setups/api/v1/system-parameters/${code}`, JSON.stringify(param), this.httpOptions);
  }


}
