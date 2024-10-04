import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import { PoliciesClaimModuleDTO } from '../../ind/components/claims/models/claim-inititation';
import { Observable } from 'rxjs';
import { Logger } from 'src/app/shared/services';
import { ClaimClientsDTO } from '../../ind/components/claims/models/claim-clients';
import { CausationCausesDTO } from '../../ind/components/claims/models/causation-causes';
import { CausationTypesDTO } from '../../ind/components/claims/models/causation-types';
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {ClaimOnLiveDTO} from "../../ind/components/claims/models/claim-on-live";
import {ClaimDTO} from "../../ind/components/claims/models/claims";
import {PolicyClaimIntiation} from "../../ind/components/claims/models/policy-claim-intiation";
import {
  ClaimDocument,
  UploadedDocumentResponse
} from "../../ind/components/claims/models/claim-document";

const log = new Logger('ClaimsService');

@Injectable({
  providedIn: 'root'
})

export class ClaimsService {

  constructor(private api:ApiService) { }

  getClaimModules(): Observable<PoliciesClaimModuleDTO[]> {

    return this.api.GET<PoliciesClaimModuleDTO[]>(
      `individual/parties/claim-clients?policy_no=&name=an`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
    );
  }

  getClaimPolicies(policyNo: string = '', name: string = ''): Observable<PoliciesClaimModuleDTO[]> {
    const url = `individual/parties/claim-clients?policy_no=${encodeURIComponent(policyNo)}&name=${encodeURIComponent(name)}`;

    return this.api.GET<PoliciesClaimModuleDTO[]>(
      url,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
    );
  }

  getClaimDetails(clm_no:string){
    return this.api.GET(`individual/claims?clm_no=${clm_no}`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL)
  }

  /**
   * Get Claim Client
   * @returns {Observable<ClaimClientsDTO>}
   */
  getClaimClients(): Observable<ClaimClientsDTO[]> {
    return this.api.GET<[ClaimClientsDTO]>(
      `individual/parties/claim-clients?name=an`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
    );
  }

  /**
   * Get Claim Causation Types
   * @returns {Observable<CausationTypesDTO>}
   */
  getCausationTypes(): Observable<CausationTypesDTO[]> {
    return this.api.GET<[CausationTypesDTO]>(
      `individual/claims/enums/causation-types`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL
    );
  }
  /**
   * Get Claim Causation Causes
   * @param cause_type
   * @returns {Observable<CausationCausesDTO>}
   */
  getCausationCauses(caus_type:string): Observable<CausationCausesDTO[]> {
    const params = new HttpParams().set('caus_type', `${caus_type}`);
    return this.api.GET<[CausationCausesDTO]>(
      `individual/claims/causations`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get Claim On Lives
   * @param caus_code
   * @param pol_no
   * @returns {Observable<ClaimClientsDTO>}
   */
  getClaimOnLive(causCode, polNo): Observable<ClaimOnLiveDTO[]> {
    const params = new HttpParams().set('caus_code', `${causCode}`)
      .set('pol_no', `${polNo}`);
    const url = `individual/parties/causation-lives`
    return this.api.GET<[ClaimOnLiveDTO]>(
      url,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Initiate a claim request and get the claim response.
   * @param requestBody PolicyClaimIntiation request body.
   * @returns {Observable<ClaimDTO>} Observable containing the response.
   */
  initiateClaims(requestBody: PolicyClaimIntiation): Observable<ClaimDTO> {
    return this.api.POST<ClaimDTO>(
    `individual/claims`,
      requestBody,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
    )
  }

  /**
   * Get Claim Details
   * @param claimNo
   * @returns {Observable<ClaimClientsDTO>}
   */
  fetchClaimDetails(claimNo): Observable<ClaimDTO> {

    const params = new HttpParams().set('clm_no', `${claimNo}`);
    const url = `individual/claims`;
    return this.api.GET<ClaimDTO>(
      url,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get Claim Documents
   * @param cnotNo
   * @returns {Observable<ClaimDocument>}
   */
  getClaimsDocument(cnotNo): Observable<ClaimDocument[]> {
    const params = new HttpParams().set('cnot_code', `${cnotNo}`);
    const url = `individual/claims/documents`;
    return this.api.GET<ClaimDocument[]>(
      url,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }

  /**
   * Get Uploaded Claim Documents
   * @param ownerCode
   * @param ownerType
   * @param moduleUploadType
   * @returns {Observable<UploadedDocument[]>}
   */
  getUploadedDocuments(ownerCode: string, ownerType: string = 'CLIENT', moduleUploadType: string = 'CLAIMS'): Observable<UploadedDocumentResponse> {
    const params = new HttpParams()
      .set('owner_type', ownerType)
      .set('owner_code', ownerCode)
      .set('module_upload_type', moduleUploadType);

    const url = `documents`;  // LMS Marketing Service base URL should be configured in API_CONFIG.
    return this.api.GET<UploadedDocumentResponse>(
      url,
      API_CONFIG.IND_MARKETING_SERVICE_BASE_URL,  // Ensure this is the base URL for the marketing service
      params
    );
  }

  /**
   * Initiate a claim request and get the claim response.
   * @param requestBody PolicyClaimIntiation request body.
   * @returns {Observable<ClaimDTO>} Observable containing the response.
   */
  uploadDocument(requestBody: PolicyClaimIntiation): Observable<ClaimDTO> {
    return this.api.POST<ClaimDTO>(
      `individual/claims`,
      requestBody,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
    )
  }
}
