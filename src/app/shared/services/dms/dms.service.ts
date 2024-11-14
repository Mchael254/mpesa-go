import {Injectable} from '@angular/core';
import {Logger} from "../logger/logger.service";
import {HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {DmsDocument, SingleDmsDocument} from "../../data/common/dmsDocument";
import {ParameterService} from "../system-parameters/parameter.service";
import {ApiService} from "../api/api.service";
import {API_CONFIG} from "../../../../environments/api_service_config";

const log = new Logger('DmsService');

const dmsEndpoints = {
  getByDocId : 'getDocumentByDocId',
  getDocsByQuotationNo: 'getQuotationDocsByQuoteNo',
  getDocsByPolicyNo: 'getNBDocByPolicyNo',
  getDocsByClaimNo: 'getClaimsDocsByClaimNo',
  getDocsByClaimantNo: 'getClaimantDocsByClaimantNo',
  getDocsByServiceProvCode: 'getSPDocsByAgentCode',
  getDocsByClientCode: 'getClientDocsByClientCode'
}

/**
 * Service that fetches documents from DMS (Document Management System)
 */

@Injectable({
  providedIn: 'root'
})
export class DmsService{

  protected dmsUrlParameter: BehaviorSubject<string> = new BehaviorSubject<string>('null');
  protected dmsApiUrl: string;

  dmsUrlParameter$ = this.dmsUrlParameter.asObservable();

  setDmsUrlParameter(url: string){
    this.dmsUrlParameter.next(url);
  }

  constructor(
    private parameterService: ParameterService,
    private api:ApiService,) {
    this.dmsUrlParameter$.subscribe( dmsUrl =>  this.dmsApiUrl = dmsUrl);
  }

  /**
   * Fetch Document by its id
   * @param docId String representing document id
   * @return Observable<SingleDmsDocument>
   */
  getDocumentById(docId: string): Observable<SingleDmsDocument> {
    let url: string;
    let urlEndpoint = dmsEndpoints.getByDocId;

    const params = new HttpParams()
      .set('docId', `${docId}`);

    // url = this.getDmsUrl(urlEndpoint);

    log.info('Fetching documents for document: ', `${docId}`);
    return this.api.GET<SingleDmsDocument>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE)
  }

  /**
   * Fetch Documents attached to a Quotation
   * @param quotationNo String representing quotation no
   * @return Observable<DmsDocument>
   * */
  fetchDocumentsByQuotationNo(quotationNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByQuotationNo;

    const params = new HttpParams()
      .set('qouteCode', `${quotationNo}`);
    // url = this.getDmsUrl(urlEndpoint);

    log.info('Fetching documents for quotation no: ', `${quotationNo}`);
    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  /**
   * Fetch Documents attached to a Policy
   * @param policyNo String representing policy no
   * @return Observable<DmsDocument>
   */
  fetchDocumentsByPolicyNo(policyNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByPolicyNo;

    const params = new HttpParams()
      .set('policyNo', `${policyNo}`);
    log.info('Fetching documents for policy: ', `${policyNo}`);

    // url = this.getDmsUrl(urlEndpoint);

    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  /**
   * Fetch Documents attached to a Claim
   * @param claimNo String representing claim no
   * @return Observable<DmsDocument>
   */
  fetchDocumentsByClaimNo(claimNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByClaimNo;

    const params = new HttpParams()
      .set('claimNo', `${claimNo}`);
    log.info('Fetching documents for claim no: ', `${claimNo}`);

    // url = this.getDmsUrl(urlEndpoint);

    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  fetchDocumentsByClaimantNo(claimantNo: string): Observable<DmsDocument[]>{
    let urlEndpoint = dmsEndpoints.getDocsByClaimantNo;

    const params = new HttpParams()
      .set('claimantNo', `${claimantNo}`);
    log.info('Fetching documents for claim no: ', `${claimantNo}`);

    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  fetchDocumentsByServiceProviderCode(spCode: string): Observable<DmsDocument[]>{
    let urlEndpoint = dmsEndpoints.getDocsByServiceProvCode;

    const params = new HttpParams()
      .set('spCode', `${spCode}`);
    log.info('Fetching documents for service provider no: ', `${spCode}`);

    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  fetchDocumentsByClientCode(clientCode: string): Observable<DmsDocument[]>{
    let urlEndpoint = dmsEndpoints.getDocsByClientCode;

    const params = new HttpParams()
      .set('clientCode', `${clientCode}`);
    log.info('Fetching documents for client no: ', `${clientCode}`);

    return this.api.GET<DmsDocument[]>(`${urlEndpoint}?${params}`, API_CONFIG.DMS_SERVICE);
  }

  fetchDispatchedDocumentsByBatchNo(batchNo: number): Observable<any>{
    const params = new HttpParams()
      .set('batchNo', `${batchNo}`);
    log.info('Fetching dispatched documents for batch no: ', `${batchNo}`);

    return this.api.GET<any>(`v2/document-dispatch?${params}`, API_CONFIG.GIS_UNDERWRITING_BASE_URL);
  }

  fetchDocumentsByAgentCode(agentCode: string): Observable<DmsDocument[]>{
    const params = new HttpParams()
      .set('agentCode', `${agentCode}`);
    log.info('Fetching documents for agent no: ', `${agentCode}`);

    return this.api.GET<DmsDocument[]>(`getAgentDocsByAgentCode?${params}`, API_CONFIG.DMS_SERVICE);
  }

  saveAgentDocs(data: any): Observable<any> {
    return this.api.POST<any>(
      `uploadAgentDocs`,
      JSON.stringify(data), API_CONFIG.DMS_SERVICE
    );
  }

  saveClientDocs(data: any): Observable<any> {
    return this.api.POST<any>(
      `uploadClientDocument`,
      JSON.stringify(data), API_CONFIG.DMS_SERVICE
    );
  }

  saveServiceProviderDocs(data: any): Observable<any> {
    return this.api.POST<any>(
      `uploadSPDocument`,
      JSON.stringify(data), API_CONFIG.DMS_SERVICE
    );
  }

  deleteDocumentById(docId: string): Observable<SingleDmsDocument> {
    const params = new HttpParams()
      .set('docId', `${docId}`);

    log.info('Fetching documents for document: ', `${docId}`);
    return this.api.GET<SingleDmsDocument>(`deleteDocsById?${params}`, API_CONFIG.DMS_SERVICE, {
      responseType: 'text' as 'json'
    })
  }

  /**
   * Get DMS Full Url
   * This method concatenates the dms service api with urlEndpoint
   * @param urlEndpoint Specific endpoint
   * @return string Return full string url of endpoint
   */
  /*private getDmsUrl(urlEndpoint: string): string {
    let url: string;

    // if dmsUrl has been set from the backend , otherwise select the one set on environment (either dev/prod)
    url = !environment.production ? environment.dmsDefaultUrl : url = this.dmsApiUrl ? this.dmsApiUrl : this.appConfig.config?.dmsDefaultUrl || environment.dmsDefaultUrl;

    log.info('Dms Url Selected is: ', url, 'Endpoint is: ', urlEndpoint);
    return url.endsWith('/') ? url + urlEndpoint :  url + '/' + urlEndpoint;
  }*/

}
