import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
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
    private api:ApiService,
    private authService: AuthService,
  ) { }

  getPolicyByBatchNo(batchNo: string) {
    return this.api.GET<any[]>(`v2/policies?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
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

    return this.api.GET<Pagination<PoliciesDTO>>(`v2/policies/client?${params}/` + id, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }
  getListOfExceptionsByPolBatchNo(batchNo):
    Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('batchNo', `${batchNo}`)
    return this.api.GET<Pagination<any>>(`v2/policies/exceptions?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL)
  }

  authoriseExceptions(data: any): Observable<any> {
    return this.api.POST<any>(
      `v1/policies/authoriseExceptions`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  policyMakeReady(batchNo: number): Observable<any> {
    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `v1/policies/make-ready/${batchNo}?user=${assignee}&reinTransactionParam=Y`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  policyUndoMakeReady(batchNo: number): Observable<any> {
    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `v1/policies/undo-make-ready/${batchNo}?user=${assignee}&reinTransactionParam=N`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  getPolicyAuthorizationLevels(batchNo: number): Observable<any> {
    return this.api.GET<any>(`v1/policies/authorization-levels?polBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  getPolicyReceipts(batchNo: number): Observable<any> {
    return this.api.GET<any>(`v1/receipts?PolBatchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  authorizeAuthorizationLevels(authLevelCode: number): Observable<any> {
    return this.api.POST<any>(
      `v1/policies/authorize-authorization-levels/${authLevelCode}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  debtOwnerPromiseDate(data: any): Observable<any> {
    return this.api.POST<any>(
      `v1/assignDebitOwnerAndPromiseDate`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  authorisePolicy(batchNo: number, scheduleStatus: string, dateToday: string): Observable<any> {
    const assignee = this.authService.getCurrentUserName();

    return this.api.POST<any>(
      `v1/policies/authorise/${batchNo}?user=${assignee}&scheduleStatus=${scheduleStatus}&authDate=${dateToday}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  saveExceptionRemark(data: any): Observable<any> {
    return this.api.POST<any>(
      `v1/policies/exception-remarks`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  getDispatchRejectionReasons(
    reasonsTypeShortDescription: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('reasonsTypeShortDescription', `${reasonsTypeShortDescription}`);

    return this.api.GET<any>(`v1/policies/exempt-document-dispatch?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  saveDispatchRejectReason(data: any): Observable<any> {
    return this.api.POST<any>(
      `v2/electronic-document-status`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  //fetches the list of reports to be dispatched
  fetchDispatchReports(batchNo: number, documentType: string): Observable<any> {
    const params = new HttpParams()
      .set('batchNo', `${batchNo}`)
      .set('documentType', `${documentType}`)
    return this.api.GET<any>(`v2/document-dispatch/dispatch-reports?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  //fetches a list of documents that have been dispatched
  fetchDocumentsDispatched(batchNo: number): Observable<any> {
    return this.api.GET<any>(`v2/document-dispatch?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  //dispatches documents
  dispatchDocuments(batchNo: any): Observable<any> {
    return this.api.POST<any>(
      `v2/document-dispatch/dispatch`, JSON.stringify(batchNo),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  //prepares reports that were selected for dispatch
  prepareDocuments(batchNo: any): Observable<any> {
    return this.api.POST<any>(
      `v2/electronic-document-status/prepared-documents?batchNo=${batchNo}`, null,
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  //add or removes reports to be dispatched
  //The report status should be "A" when adding a document and R when removing the document
  addRemoveReportsToPrepare(data: any): Observable<any> {
    return this.api.POST<any>(
      `v2/electronic-document-status/add-reports`, JSON.stringify(data),
      API_CONFIG.GIS_UNDERWRITING_BASE_URL
    );
  }

  fetchReportsDispatched(batchNo: number): Observable<any> {
    return this.api.GET<any>(`v2/document-dispatch/dispatch-documents-mapping?batchNo=${batchNo}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }
}
