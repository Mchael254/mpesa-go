import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";
import { PoliciesClaimModuleDTO } from '../../ind/components/claims/models/claim-inititation';
import { Observable } from 'rxjs';
import { Logger } from 'src/app/shared/services';
import { ClaimClientsDTO } from '../../ind/components/claims/models/claim-clients';
import { CausationCausesDTO } from '../../ind/components/claims/models/causation-causes';
import { CausationTypesDTO } from '../../ind/components/claims/models/causation-types';
import { HttpParams } from '@angular/common/http';
import {ClaimOnLiveDTO} from "../../ind/components/claims/models/claim-on-live";
import {ClaimDTO} from "../../ind/components/claims/models/claims";
import {PolicyClaimIntiation} from "../../ind/components/claims/models/policy-claim-intiation";

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
  getCausationTypes (): Observable<CausationTypesDTO[]> {
    log.info('Fetching Causation Types');
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

}
