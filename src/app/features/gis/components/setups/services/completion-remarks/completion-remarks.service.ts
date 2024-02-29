import { Injectable } from '@angular/core';
import {API_CONFIG} from "../../../../../../../environments/api_service_config";
import {ApiService} from "../../../../../../shared/services/api/api.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompletionRemarksService {

  constructor(
    private api:ApiService,
  ) { }

  getCompletionRemarks(): Observable<any> {

    return this.api.GET<any>(`api/v1/completion-remarks`, API_CONFIG.GIS_SETUPS_BASE_URL);
  }
}
