import { Injectable } from '@angular/core';
import { map } from 'rxjs/internal/operators/map';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private api:ApiService) {   }

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

  getListOfProductTermByProductCode(prodCode: number, prodPopCoe: number, dob: Date){
    // console.log(prodOptionCode);

    return this.api.GET(`ord-prem-terms/product-option/${prodCode}/${prodPopCoe}/${dob}`)
    .pipe(
      map((_prod_term: any) => {
        return _prod_term;
    }),
    // catchError((_err) =>  {})
    );
  }


}
