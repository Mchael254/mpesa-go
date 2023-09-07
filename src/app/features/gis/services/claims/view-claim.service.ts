import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from '../../../../core/config/app-config-service'
import { ClaimsDTO } from '../../data/claims-dto';

@Injectable({
  providedIn: 'root'
})
export class ViewClaimService {

  baseUrl = this.appConfig.config.contextPath.gis_services;
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getClaims(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<ClaimsDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.http.get<Pagination<ClaimsDTO>>(`/${this.baseUrl}/claims/api/v1/claims/client/` + id,
      {
        headers: headers,
        params: params,
      });
  }
}
