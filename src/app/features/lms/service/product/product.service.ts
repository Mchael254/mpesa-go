import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { map } from 'rxjs/internal/operators/map';
import { ApiService } from '../../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../../environments/api_service_config';
import { EscalationRateDTO } from '../../ind/components/quotation/models/escalation-rate';
import { Logger } from 'src/app/shared/services';
import { HttpParams } from '@angular/common/http';
import { LeaderOptionDTO } from '../../ind/components/quotation/models/leader-option';
import { CoinsurerOptionDTO } from '../../ind/components/quotation/models/coinsurer-option';

const log = new Logger('ProductService');

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private getListOfOrdProduct = toSignal(this.getListOfProduct());
  // getListOfGroupProduct = toSignal(this.getListOfProduct('G'));

  constructor(private api:ApiService) {   }

  getProductByCode(code: number){
    return this.api.GET(`products/${code}`)
    .pipe(
      map((_prod: any) => {
        return _prod;
    }),
    // catchError((_err) =>  {})
    );
  }

  // getListOfGroupProduct(){
  //   return this.api.GET(`products?page=0&size=22&class_type=G`)
  //   .pipe(
  //     map((_prod: any) => {
  //       return _prod['content'];
  //   }),
  //   // catchError((_err) =>  {})
  //   );
  // }



  // getListOfOrdProduct(){
  //   return this.api.GET(`products?page=0&size=22&class_type=O`)
  //   .pipe(
  //     map((_prod: any) => {
  //       return _prod['content'];
  //   }),
  //   // catchError((_err) =>  {})
  //   );
  // }

  getListOfProduct(type='O'){
    return this.api.GET(`products?page=0&size=22&class_type=${type}`)
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

  getProductOptionByCode(product_option: number){
    return this.api.GET(`product-options/${product_option}`, API_CONFIG.SETUPS_SERVICE_BASE_URL);
  }

  premium_computation(prem_obj: { lead: {}; quote: {}; }): Observable<any> {
    return this.api.POST('quotations/quick-quote', prem_obj, API_CONFIG.IND_MARKETING_SERVICE_BASE_URL)
    .pipe(
      map((_compute: any) => {
        return _compute;
    }),
    );
  }

  getProductEscalationRate(pop_code: number): Observable<EscalationRateDTO[]> {
    log.info('Fetching Rates');
    const paramObj: { [param: string] : string } = {};
    if (pop_code !== undefined && pop_code !== null) {
      paramObj['pop_code'] = pop_code.toString();
    }
    const params = new HttpParams({ fromObject: paramObj });
    return this.api.GET<EscalationRateDTO[]>(
      `products/2021747/escalation-rates?pop_code=${pop_code}`,
      API_CONFIG.SETUPS_SERVICE_BASE_URL,
      params
    );
  }

  getProductLeaderOption(endr_code: number): Observable<LeaderOptionDTO[]> {
    log.info('Fetching Leader Options');
    const paramObj: { [param: string] : string } = {};
    if (endr_code !== undefined && endr_code !== null) {
      paramObj['endr_code'] = endr_code.toString();
    }
    const params = new HttpParams({ fromObject: paramObj });
    return this.api.GET<LeaderOptionDTO[]>(
      `individual/parties/insurance-companies?endr_code=${endr_code}`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL,
      params
    );
  }

  getProductCoinsurerOption(endr_code): Observable<CoinsurerOptionDTO[]> {
    log.info('Fetching Coinsurer Options');
    const paramObj: { [param: string] : string } = {};
    if (endr_code !== undefined && endr_code !== null) {
      paramObj['endr_code'] = endr_code.toString();
    }
    const params = new HttpParams({ fromObject: paramObj });
    return this.api.GET<CoinsurerOptionDTO[]>(
      `individual/parties/insurance-companies?endr_code=${endr_code}`,
      API_CONFIG.UNDERWRITING_SERVICE_BASE_URL,
      params
    );
  }

  

}

