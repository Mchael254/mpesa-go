import {Injectable} from '@angular/core';
import {Logger} from "../logger.service";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {DmsDocument, SingleDmsDocument} from "../../data/common/dmsDocument";
import {ParameterService} from "../parameter.service";
import {environment} from "../../../../environments/environment";
import {AppConfigService} from "../../../core/config/app-config-service";

const log = new Logger('DmsService');

const dmsEndpoints = {
  getByDocId : 'getDocumentByDocId',
  getDocsByQuotationNo: 'getQuotationDocsByQuoteNo',
  getDocsByPolicyNo: 'getNBDocByPolicyNo',
  getDocsByClaimNo: 'getClaimsDocsByClaimNo',
}

@Injectable({
  providedIn: 'root'
})
export class DmsService{

  protected dmsUrlParameter: BehaviorSubject<string> = new BehaviorSubject<string>('null');
  protected dmsApiUrl!: string;

  dmsUrlParameter$ = this.dmsUrlParameter.asObservable();

  setDmsUrlParameter(url: string){
    this.dmsUrlParameter.next(url);
  }

  constructor(
    private parameterService: ParameterService,
    private appConfig: AppConfigService,
    private http: HttpClient) {
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

    const header = new HttpHeaders({
      "Accept": "application/json"
    });

    const params = new HttpParams()
      .set('docId', `${docId}`);

    url = this.getDmsUrl(urlEndpoint);

    log.info('Fetching documents for document: ', `${docId}`);
    return this.http.get<SingleDmsDocument>(url, {headers:header, params:params})
  }

  /**
   * Fetch Documents attached to a Quotation
   * @param quotationNo String representing quotation no
   * @return Observable<DmsDocument>
   * */
  fetchDocumentsByQuotationNo(quotationNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByQuotationNo;

    const header = new HttpHeaders({
      "Accept": "application/json"
    });
    const params = new HttpParams()
      .set('qouteCode', `${quotationNo}`);
    url = this.getDmsUrl(urlEndpoint);

    log.info('Fetching documents for quotation no: ', `${quotationNo}`);
    return this.http.get<DmsDocument[]>(url, {headers:header, params:params});
  }

  /**
   * Fetch Documents attached to a Policy
   * @param policyNo String representing policy no
   * @return Observable<DmsDocument>
   */
  fetchDocumentsByPolicyNo(policyNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByPolicyNo;
    const header = new HttpHeaders({
      "Accept": "application/json"
    });
    const params = new HttpParams()
      .set('policyNo', `${policyNo}`);
    log.info('Fetching documents for policy: ', `${policyNo}`);

    url = this.getDmsUrl(urlEndpoint);

    return this.http.get<DmsDocument[]>(url, {headers:header, params:params});
  }

  /**
   * Fetch Documents attached to a Claim
   * @param claimNo String representing claim no
   * @return Observable<DmsDocument>
   */
  fetchDocumentsByClaimNo(claimNo: string): Observable<DmsDocument[]>{
    let url: string, urlEndpoint = dmsEndpoints.getDocsByClaimNo;
    const header = new HttpHeaders({
      "Accept": "application/json"
    });
    const params = new HttpParams()
      .set('claimNo', `${claimNo}`);
    log.info('Fetching documents for claim no: ', `${claimNo}`);

    url = this.getDmsUrl(urlEndpoint);

    return this.http.get<DmsDocument[]>(url, {headers:header, params:params});
  }

  /**
   * Get DMS Full Url
   * This method concatenates the dms service api with urlEndpoint
   * @param urlEndpoint Specific endpoint
   * @return string Return full string url of endpoint
   */
  private getDmsUrl(urlEndpoint: string): string {
    let url: string;

    // if dmsUrl has been set from the backend , otherwise select the one set on environment (either dev/prod)
    if(this.dmsApiUrl)
      url = this.dmsApiUrl;
    else
      url = this.appConfig.config.dmsDefaultUrl || environment.dmsDefaultUrl;

    log.info('Dms Url Selected is: ', url, 'Endpoint is: ', urlEndpoint);
    return url.endsWith('/') ? url + urlEndpoint :  url + '/' + urlEndpoint;
  }

}
