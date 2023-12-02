import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductOptionService {
  private PRODUCT_OPTION_BASE_URL = 'product-options'

  constructor(private api:ApiService) {   }

  getProductOptionByCode(code: number){
    return this.api.GET(`${this.PRODUCT_OPTION_BASE_URL}/${code}`)
    
  }
}
