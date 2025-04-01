import { Injectable } from '@angular/core';
import {ApiService} from "../../api/api.service";
import {Observable} from "rxjs/internal/Observable";
import {API_CONFIG} from "../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class MaritalStatusService {

  constructor(
    private api: ApiService,
  ) { }

  getClientMaritalStatus(): Observable<any[]> {
    return this.api.GET<any[]>(
      `client-marital-status`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getMaritalStatus(): Observable<any[]> {
    return this.api.GET<any[]>(
      `marital-status`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
