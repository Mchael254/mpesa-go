import { Injectable } from '@angular/core';
import {ApiService} from "../../api/api.service";
import {Observable} from "rxjs/internal/Observable";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {MaritalStatus} from "../../../data/common/marital-status.model";

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {

  constructor(
    private api: ApiService,
  ) { }

  getClientMaritalStatus(): Observable<MaritalStatus[]> {
    return this.api.GET<MaritalStatus[]>(
      `client-marital-status`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getMaritalStatus(): Observable<MaritalStatus[]> {
    return this.api.GET<MaritalStatus[]>(
      `marital-status`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
