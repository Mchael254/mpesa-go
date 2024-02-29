import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {AppConfigService} from '../../../../core/config/app-config-service'
import {Observable} from "rxjs";
import {Pagination} from "../../../../shared/data/common/pagination";
import { PoliciesDTO } from '../../data/policies-dto';
import {API_CONFIG} from "../../../../../environments/api_service_config";
import {ApiService} from "../../../../shared/services/api/api.service";
import {AuthService} from "../../../../shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PoliciesService {

  constructor(
    private appConfig: AppConfigService,
    private api:ApiService,
    private authService: AuthService,
  ) { }

  getPolicyByBatchNo(batchNo: string) {


    return this.api.GET<any[]>(`api/v2/policies?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  getPoliciesByClientId(
    pageNo: number = 0,
    dateFrom: string,
    dateTo: string,
    id: number
  ): Observable<Pagination<PoliciesDTO>> {

    const params = new HttpParams()
      .set('pageNo', `${pageNo}`)
      .set('dateFrom', `${dateFrom}`)
      .set('dateTo', `${dateTo}`);

    return this.api.GET<Pagination<PoliciesDTO>>(`api/v2/policies/client?${params}/` + id, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }
  getListOfExceptionsByPolBatchNo(batchNo):
    Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('batchNo', `${batchNo}`)
    return this.api.GET<Pagination<any>>(`api/v2/policies/exceptions?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }

  authoriseExceptions(exceptionsCode: number): Observable<any> {

    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `api/v1/policies/authoriseExceptions/${exceptionsCode}?user=${assignee}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  policyMakeReady(batchNo: number): Observable<any> {

    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `api/v1/policies/make-ready/${batchNo}?user=${assignee}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  policyUndoMakeReady(batchNo: number): Observable<any> {

    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `api/v1/policies/undo-make-ready/${batchNo}?user=${assignee}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  getPolicyAuthorizationLevels(batchNo: number): Observable<any> {

    return this.api.GET<any>(`api/v1/policies/authorization-levels?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  getPolicyReceipts(batchNo: number): Observable<any> {

    return this.api.GET<any>(`api/v1/receipts?PolBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  authorizeAuthorizationLevels(authLevelCode: number): Observable<any> {

    return this.api.POST<any>(
      `api/v1/policies/authorize-authorization-levels/${authLevelCode}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  debtOwnerPromiseDate(data: any): Observable<any> {

    return this.api.POST<any>(
      `api/v1/assignDebitOwnerAndPromiseDate`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }
}
