import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  constructor(private api:ApiService) {   }

  getListOfBeneficariesByQuotationCode(quote_code:number){
    return this.api.GET(`parties/beneficiaries?page=0&size=5&quote_code=${quote_code}`, API_CONFIG.MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((data: any) => {
        return data['content'];
    }),
    );
  }

  createBeneficary(beneficiary: any){
    return this.api.POST(`parties/beneficiaries`, beneficiary, API_CONFIG.MARKETING_SERVICE_BASE_URL);

  }
}
