import { Injectable } from '@angular/core';
import {ApiService} from "../../../../shared/services/api/api.service";

@Injectable({
  providedIn: 'root'
})
export class CoverTypeService {

  constructor(private api:ApiService) { }

  getCoverTypeList(orgCode=2){
    return this.api.GET(`cover-types/${orgCode}/list-all`)
  }

  getCoverTypeListByProduct(prod_code=2021732){
    return this.api.GET(`products/${prod_code}/cover-types`)
  }

  getCoverTypeByCode(code:number){
    return this.api.GET(`cover-types/${code}`)
  }
}
