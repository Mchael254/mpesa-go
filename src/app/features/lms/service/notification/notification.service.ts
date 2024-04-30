import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import {ApiService} from "../../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../../environments/api_service_config";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private api:ApiService) {   }

  sendEmail(payload: any): Observable<any>{
    return this.api.POST(`email/send`, payload, API_CONFIG.NOTIFICATION_BASE_URL);
  }

  sendPhone(payload: any): Observable<any>{
    return this.api.POST(`sms/send`, payload, API_CONFIG.NOTIFICATION_BASE_URL);
  }
}
