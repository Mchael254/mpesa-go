import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  constructor(private api: ApiService) { }

  getAllForms(){
    return this.api.GET('web-form-data',API_CONFIG.JSON_SERVICE_BASE_URL);
  }
  saveForm(form: any){
    return this.api.POST('web-form-data',form, API_CONFIG.JSON_SERVICE_BASE_URL);
  }
}
