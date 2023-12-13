import { Injectable } from '@angular/core';
import {AppConfigService} from "../../core/config/app-config-service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {SetupsParametersDTO} from "../data/common/setups-parametersDTO";

@Injectable({
  providedIn: 'root'
})
export class SetupsParametersService {
  baseUrlSetups = this.appConfig.config.contextPath.setup_services;

  constructor(
    private appConfig: AppConfigService,
    private http: HttpClient
  ) { }


  /**
   * The function `getParameters` retrieves parameters based on a given name.
   * @param {string} name - The parameter "name" is a string that represents the name of the setup parameter.
   * @returns an Observable of type 'any'.
   */
  getParameters(name:string): Observable<SetupsParametersDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
      .set('name', `${name}`);

    return this.http.get<SetupsParametersDTO[]>(`/${this.baseUrlSetups}/setups/parameters`, {headers:header, params:params})
  }
}
