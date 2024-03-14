import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';
import { map } from 'rxjs/internal/operators/map';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PartyService {
  private POLICY_PARTY_BASE_URL = 'individual/parties';

  constructor(private api:ApiService) {}

  getListOfBeneficariesByQuotationCode(quote_code:number, proposal_code:number){
    return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    // return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}&proposal_code=${proposal_code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((data: any) => {
        return data['content'];
    }),
    );
  }

  getListOfDependentByQuotationCode(pol_code:number, endr_code:number){
    return this.api.GET(`parties/dependents?pol_code=${pol_code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    // return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}&proposal_code=${proposal_code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((data: any) => {
        return data;
    }),
    );
  }

  getListPolicyDependents(endr_code = 2023618118){
    return this.api.GET(`${this.POLICY_PARTY_BASE_URL}/dependents?endr_code=${endr_code}`, API_CONFIG.UNDERWRITING_SERVICE_BASE_URL);
  }

  getAllBeneficiaryTypes(){
    return this.api.GET('parties/beneficiary-types', API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }


  createBeneficiary(beneficiary: any){
    let save_beneficiary_api: Observable<any>;
    save_beneficiary_api =  beneficiary?.code ===null?this.api.POST(`parties/beneficiaries`, beneficiary, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL):
      this.api.PUT(`parties/beneficiaries/${beneficiary?.code}`, beneficiary, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    return save_beneficiary_api;
  }
  deleteBeneficiary(code: number){
    // return of(code)
    return this.api.DELETE(`parties/beneficiaries/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }

  
  saveDependent(deps: any){
    let save_beneficiary_api: Observable<any>;
    save_beneficiary_api =  deps?.code ===null?this.api.POST(`parties/dependents`, deps, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL):
      this.api.PUT(`parties/dependents/${deps?.code}`, deps, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    return save_beneficiary_api;
  }
  deleteDependent(code: number){
    return this.api.DELETE(`parties/dependents/${code}`, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL);
  }
}