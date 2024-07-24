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

const log = new Logger('ClaimsService');

@Injectable({
  providedIn: 'root'
})

export class ClaimsService {

  constructor(private api:ApiService) { }

  getClaimModules(): Observable<PoliciesClaimModuleDTO[]> {
    log.info('Fetching Policies');
    return this.api.GET<PoliciesClaimModuleDTO[]>(
      `individual/parties/claim-clients?policy_no=&name=an`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
    );
  }

  getClaimDetails(clm_no:string){
    return this.api.GET(`individual/claims?clm_no=${clm_no}`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL)
  }

  getClaimClients(): Observable<ClaimClientsDTO[]> {
    log.info('Fetching Clients');
    return this.api.GET<[ClaimClientsDTO]>(
      `individual/parties/claim-clients?name=an`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL
    );
  }

  getCausationTypes (): Observable<CausationTypesDTO[]> {
    log.info('Fetching Causation Types');
    return this.api.GET<[CausationTypesDTO]>(
      `individual/claims/enums/causation-types`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL
    );
  }

  getCausationCauses(caus_type:string): Observable<CausationCausesDTO[]> {
    log.info('Fetching Causation Causes');
    const params = new HttpParams().set('caus_type', `${caus_type}`);
    return this.api.GET<[CausationCausesDTO]>(
      `individual/claims/causations`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL,
      params
    );
  }

  /* getCausationCauses(): Observable<CausationCausesDTO[]> {
    log.info('Fetching Causation Causes');
    return this.api.GET<[CausationCausesDTO]>(
      `individual/claims/causations?caus_type=ILL`,
      API_CONFIG.CLAIMS_SERVICE_BASE_URL
    );
  } */
}
