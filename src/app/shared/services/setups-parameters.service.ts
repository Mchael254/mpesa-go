import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {SetupsParametersDTO} from "../data/common/setups-parametersDTO";
import {API_CONFIG} from "../../../environments/api_service_config";
import {ApiService} from "./api/api.service";

@Injectable({
  providedIn: 'root'
})
export class SetupsParametersService {

  constructor(
    private api: ApiService,
  ) { }


  /**
   * The function `getParameters` retrieves parameters based on a given name.
   * @param {string} name - The parameter "name" is a string that represents the name of the setup parameter.
   * @returns an Observable of type 'any'.
   */
  getParameters(name:string): Observable<SetupsParametersDTO[]> {
    const params = new HttpParams()
      .set('name', `${name}`);

    return this.api.GET<SetupsParametersDTO[]>(
      `parameters`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL,
      params
    );
  }
}
