import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(private api:ApiService, private http: HttpClient) {   }

  getListOfGroupProduct(){
    return this.api.GET('products?page=0&size=22&class_type=G')
    .pipe(
      map((_prod: any) => {
        return _prod['content'];
    }),
    // catchError((_err) =>  {})
    );
  }

  getListOfProduct(){
    return this.api.GET('products?page=0&size=22&class_type=O')
    .pipe(
      map((_prod: any) => {
        return _prod['content'];
    }),
    // catchError((_err) =>  {})
    );
  }

  getListOfProductOptionByProductCode(product_code: number){

    return this.api.GET(`product-options/product/${product_code}`).pipe(
      map((_prod_option: any) => {
        return _prod_option;
    }),
    );
  }

  getListOfProductCoverTypeByProductCode(prodOptionCode: number){
    return this.api.GET(`product-cover-types/product/${prodOptionCode}`)
    .pipe(
      map((_prod_cover_type: any) => {
        return _prod_cover_type;
    }),
    );
  }

  getListOfProductTermByProductCode(prodCode: number, prodPopCode: number, age: number){
    return this.api.GET(`ord-prem-terms/product-option?product_code=${prodCode}&product_option_code=${prodPopCode}&client_age=${age}`)
    .pipe(
      map((_prod_term: any) => {
        return _prod_term;
    }),
    );
  }

  premium_computation(prem_obj: { lead: {}; quote: {}; }): Observable<any> {
    return this.api.POST('quotations/quick-quote', prem_obj, API_CONFIG.MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((_compute: any) => {
        return _compute;
    }),
    );
  }


}
