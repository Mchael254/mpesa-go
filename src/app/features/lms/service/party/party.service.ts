import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  constructor(private api:ApiService) {}

  getListOfBeneficariesByQuotationCode(quote_code:number, proposal_code:number){
    return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}`, API_CONFIG.MARKETING_SERVICE_BASE_URL)
    // return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}&proposal_code=${proposal_code}`, API_CONFIG.MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((data: any) => {
        return data['content'];
    }),
    );
  }

  getAllBeneficiaryTypes(){
    return this.api.GET('parties/beneficiary-types', API_CONFIG.MARKETING_SERVICE_BASE_URL);
  }


  createBeneficary(beneficiary: any){
    return this.api.POST(`parties/beneficiaries`, beneficiary, API_CONFIG.MARKETING_SERVICE_BASE_URL);
  }
  deleteBeneficiary(code: number){
    // return of(code)
    return this.api.DELETE(`parties/beneficiaries/${code}`, API_CONFIG.MARKETING_SERVICE_BASE_URL);
  }



}
