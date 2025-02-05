import { Injectable } from '@angular/core';
import { GenericResponse } from '../data/receipting-dto';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../shared/services/api/api.service';

import {API_CONFIG} from '../../../../environments/api_service_config';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FmsSetupService {

  constructor(private api:ApiService) { 
    
  }
  getParamStatus(paramName:string):Observable<GenericResponse<string>>{
    const params=new HttpParams().set('paramName',`${paramName}`);
    return(
      this.api.GET<GenericResponse<string>>(
        `parameters/get-param-status`,
        API_CONFIG.FMS_SETUPS_SERVICE_BASE_URL,
        params
        
      )
    )
      }
}
