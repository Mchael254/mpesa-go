import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from '../../../../core/config/app-config-service'
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { QuotationsDTO } from '../../data/quotations-dto';

@Injectable({
  providedIn: 'root'
})
export class QuotationsService {

  baseUrl = this.appConfig.config.contextPath.gis_services;
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getQuotations(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<QuotationsDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.http.get<Pagination<QuotationsDTO>>(`/${this.baseUrl}/quotation/api/v1/quotations/client/` + id,
      {
        headers: headers,
        params: params,
      });
  }
}
