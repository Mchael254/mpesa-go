import { Injectable } from '@angular/core';
import { AppConfigService } from "../../../core/config/app-config-service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { BankBranchDTO, BankDTO, CurrencyDTO, FundSourceDTO} from '../../data/common/bank-dto';
import { Logger } from "../logger.service";

const log = new Logger('BankService');

@Injectable({
  providedIn: 'root'
})
export class BankService {

  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private appConfig: AppConfigService, private http: HttpClient) { }

  getBanks(countryId: number): Observable<BankDTO[]> {
    log.info('Fetching Banks');
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    const params = new HttpParams()
    .set('countryId', `${countryId}`);

    return this.http.get<BankDTO[]>(`/${this.baseUrl}/setups/banks`, {headers:header, params:params})
  }

  getBankBranch(): Observable<BankBranchDTO[]> {
    log.info('Fetching Bank Branches')
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<BankBranchDTO[]>(`/${this.baseUrl}/setups/bank-branches`, {headers:header})
  }

  getBankBranchesByBankId(bankId: number): Observable<BankBranchDTO[]> {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<BankBranchDTO[]>(`/${this.baseUrl}/setups/bank-branches/${bankId}/bank-branches`, { headers: header });
  }


  getCurrencies(): Observable<CurrencyDTO[]> {
    log.info('Fetching Source of Funds')
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<CurrencyDTO[]>(`/${this.baseUrl}/setups/currencies`, {headers:header})
  }

  getFundSource(): Observable<FundSourceDTO[]> {
    log.info('Fetching Source of Funds')
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return this.http.get<FundSourceDTO[]>(`/${this.baseUrl}/setups/source-of-funds`, {headers:header})
  }

}
