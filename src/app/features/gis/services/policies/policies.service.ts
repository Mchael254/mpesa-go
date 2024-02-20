import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {AppConfigService} from '../../../../core/config/app-config-service'
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { PoliciesDTO } from '../../data/policies-dto';
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {ApiService} from "../../../../shared/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {

  constructor(
    private appConfig: AppConfigService,
    private api:ApiService
  ) { }

  getPolicies(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<PoliciesDTO>> {

    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.api.GET<Pagination<PoliciesDTO>>(`/api/v2/policies/client?${params}/` + id, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }
  getListOfExceptionsByPolBatchNo(batchNo):
    Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('batchNo', `${batchNo}`)
    return this.api.GET<Pagination<any>>(`api/v2/policies/exceptions?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }
}
