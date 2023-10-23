import { Injectable } from '@angular/core';
import { ApiService } from '../../../../shared/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class RelationTypesService {

  constructor(private api:ApiService) {}

  getRelationTypes(){
    return this.api.GET('relation-types');
  }

}
