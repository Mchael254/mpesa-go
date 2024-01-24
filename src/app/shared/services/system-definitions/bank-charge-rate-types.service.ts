import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AppConfigService} from "../../../core/config/app-config-service";
import {Observable} from "rxjs";
import {BankChargeRateTypesDto} from "../../data/common/bank-charge-rate-types-dto";

@Injectable({
  providedIn: 'root'
})
export class BankChargeRateTypesService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private http: HttpClient, private appConfig: AppConfigService) { }

  getBankChargeRateTypes(): Observable<BankChargeRateTypesDto[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<BankChargeRateTypesDto[]>(
      `/${this.baseUrl}/setups/system-definitions/bank-charge-rate-types`,
      {
        headers: headers,
      }
    );
  }
}
