import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ApiService} from "../../../shared/services/api/api.service";
import {API_CONFIG} from "../../../../environments/api_service_config";
import {MessageTemplate } from "../data/messaging-template";
import {Pagination} from "../../../shared/data/common/pagination";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class MessagingService {

  constructor(
    private api: ApiService,
  ) { }

  getMessageTemplates(
    page: number = 0,
    size: number = 10,
    systemId: number = 1
  ): Observable<Pagination<MessageTemplate>> {
    let params: HttpParams = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`)
      .set('systemId', `${systemId}`)
    return this.api.GET<Pagination<MessageTemplate>>
    (`message-templates`, API_CONFIG.NOTIFICATION_BASE_URL, params);
  }

  saveMessageTemplate(
    messageTemplate: MessageTemplate
  ): Observable<MessageTemplate> {
    return this.api.POST<MessageTemplate>(
      'api/message-templates',
      JSON.stringify(messageTemplate),
      API_CONFIG.NOTIFICATION_BASE_URL
    );
  }
}
