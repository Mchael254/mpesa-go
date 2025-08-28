import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import {ClientBranchesDto, ClientDTO, ClientTitlesDto, ClientTypeDTO,} from '../../data/ClientDTO';
import {Pagination} from '../../../../shared/data/common/pagination';
import {ApiService} from '../../../../shared/services/api/api.service';
import {API_CONFIG} from '../../../../../environments/api_service_config';
import {UtilService} from '../../../../shared/services';
import {AppConfigService} from "../../../../core/config/app-config-service";
import {AiFileUploadMetadata} from "../../data/ai-file-upload-metadata.model";
import {OtpRequestPayload} from "../../data/otp-request.model";

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(
    private api: ApiService,
    private utilService: UtilService,
    private http: HttpClient,
    private configService: AppConfigService,
  ) {
  }

  getClients(
    page: number | null = 0,
    size: number | null = 5,
    sortField: string = 'createdDate',
    order: string = 'desc',
    columnName: string = null,
    columnValue: string = null
  ): Observable<Pagination<ClientDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`)
      .set('columnName', `${columnName}`)
      .set('columnValue', `${columnValue}`);
    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);
    return this.api.GET<Pagination<ClientDTO>>(
      `clients`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getAgents(
    page: number | null = 0,
    size: number | null = 10,
    sortField: string = 'createdDate',
    order: string = 'desc'
  ): Observable<Pagination<any>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('sortListFields', `${sortField}`)
      .set('order', `${order}`);

    /*if (organizationId !== undefined && organizationId !== null) { todo: add organizationId to parameters
      params['organizationId'] = organizationId.toString();
    }*/

    return this.api.GET<Pagination<ClientDTO>>(
      `agents`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }


  searchClients(
    page: number,
    size: number = 5,
    name: string,
    modeOfIdentity: string = null,
    idNumber: string = null,
    clientTypeName: string = null
  ): Observable<Pagination<ClientDTO>> {
    const params = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('name', `${name}`)
      .set('modeOfIdentity', `${modeOfIdentity}`)
      .set('idNumber', `${idNumber}`)
      .set('clientTypeName', `${clientTypeName}`);

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    let paramObject = this.utilService.removeNullValuesFromQueryParams(params);

    return this.api.GET<Pagination<ClientDTO>>(
      `clients`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      paramObject
    );
  }

  getIdentityType(): Observable<any[]> {
    const params = new HttpParams();

    /*if (organizationId !== undefined && organizationId !== null) {
      params['organizationId'] = organizationId.toString();
    }*/

    return this.api.GET<any[]>(
      `identity-modes`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  // getClientType(organizationId: number): Observable<any[]> {
  //   const params = new HttpParams().set('organizationId', `${organizationId}`);
  //   return this.api.GET<ClientTypeDTO[]>(
  //     `client-types`,
  //     API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
  //     params
  //   );
  // }

  getClientType(organizationId?: number): Observable<ClientTypeDTO[]> {
    const paramsObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramsObj['organizationId'] = organizationId.toString();
    }

    const params = new HttpParams({fromObject: paramsObj});
    return this.api.GET<ClientTypeDTO[]>(
      `client-types`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  saveClientDetails(clientData: ClientDTO): Observable<ClientDTO[]> {
    return this.api.POST<ClientDTO[]>(
      `v2/api/clients`,
      JSON.stringify(clientData),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  saveClientDetails2(clientData: any): Observable<any> {
    return this.api.POST<any>(
      `v2/api/clients`,
      JSON.stringify(clientData),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  createClient(client: {}): Observable<ClientDTO> {
    console.log('CREATE CLIENT:' + client);
    return;

    // return this.http.post<ClientDTO>(`/${this.baseUrl}/clients`, JSON.stringify(client), {headers:this.headers});
  }

  updateClient(client_id: number, client: {}): Observable<ClientDTO> {
    return this.api.PUT<ClientDTO>(
      `clients/${client_id}`,
      JSON.stringify(client),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  updateClientSection(client_id: number, client: {}): Observable<ClientDTO> {
    return this.api.POST<ClientDTO>(
      `v2/api/clients/${client_id}`,
      JSON.stringify(client),
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getClientDetailsByClientCode(client_id): Observable<ClientDTO> {
    return this.api.GET<ClientDTO>(
      `v2/api/clients/${client_id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  deleteAmlRecord(id: number): Observable<{message: string}> {
    return this.api.DELETE<{message: string}>(
      `aml-details/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  requestOtp(optRequestPayload: OtpRequestPayload): Observable<any> {
    return this.api.POST<any>(
      `otp/request/`,
      optRequestPayload,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  verifyOtp(optRequestPayload: OtpRequestPayload): Observable<any> {
    return this.api.POST<any>(
      `otp/verify/`,
      optRequestPayload,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getClientById(id: number): Observable<ClientDTO> {
    return this.api.GET<ClientDTO>(
      `clients/${id}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getclientRequiredDocuments() {
    return this.api.GET(
      'required-documents?accountType=C',
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getAccountByCode(code: number): Observable<ClientDTO> {
    return this.api.GET<ClientDTO>(
      `details?accountCode=${code}`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  getCLientBranches(): Observable<ClientBranchesDto[]> {
    return this.api.GET<ClientBranchesDto[]>(
      `branches`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  getClientTitles(organizationId?: number): Observable<ClientTitlesDto[]> {
    const paramObj: { [param: string]: string } = {};
    if (organizationId !== undefined && organizationId !== null) {
      paramObj['organizationId'] = organizationId.toString();
    }
    const params = new HttpParams({fromObject: paramObj});
    return this.api.GET<ClientTitlesDto[]>(
      `client-titles`,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL,
      params
    );
  }

  save(clientData: any): Observable<any> {
    return this.api.POST<any>(
      `clients`,
      clientData,
      API_CONFIG.CRM_ACCOUNTS_SERVICE_BASE_URL
    );
  }

  uploadDocForScanning(files: File[]): Observable<AiFileUploadMetadata> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    })
    return this.api.AI_DOC_UPLOAD(
      'ai-helper/document-storage',
      formData,
      API_CONFIG.AI_DOCUMENT_SERVICE
    );
  }

  readScannedDocuments(payload: any /*AiDocumentHubRequest*/): Observable<any> {
    return this.api.AI_DOC_UPLOAD(
      'ai-helper/document-extract',
      payload,
      API_CONFIG.AI_DOCUMENT_SERVICE
    );
  }

}
