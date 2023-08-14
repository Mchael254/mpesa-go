import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { AppConfigService } from 'src/app/core/config/app-config-service';
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { PoliciesDTO } from '../../data/policies-dto';

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {

  baseUrl = this.appConfig.config.contextPath.gis_services;
  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  getPolicies(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<PoliciesDTO>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.http.get<Pagination<PoliciesDTO>>(`/${this.baseUrl}/underwriting/api/v1/policies/client/` + id,
      {
        headers: headers,
        params: params,
      });
  }
}
