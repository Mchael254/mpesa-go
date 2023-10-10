import { Injectable } from '@angular/core';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {HttpClient} from "@angular/common/http";
import {retry} from "rxjs/operators";

/**
 * This service is used to handle currency related operations
 */
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  /**
   * Get all currencies
   * @returns all currencies
   */
  getAllCurrencies(){

    return this.http.get<any>(`/${this.baseUrl}/setups/currencies`).pipe(
      retry(1)
    )
  }

}
