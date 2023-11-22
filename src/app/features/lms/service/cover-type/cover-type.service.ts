import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CoverTypeService {

  constructor(private api:ApiService) { }

  getCoverTypeList(orgCode=2){
    return this.api.GET(`cover-types/${orgCode}/list-all`)
  }

  getCoverTypeByCode(code:number){
    return this.api.GET(`cover-types/${code}`)
  }
}
