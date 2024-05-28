import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';
import {
  MessageTemplate,
  MessageTemplateResponse,
} from '../data/messaging-template';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  constructor(private api: ApiService) {}

  getMessageTemplates(
    page: number = 0,
    size: number = 10,
    systemId: number = 1
  ): Observable<MessageTemplateResponse> {
    return this.api.GET<MessageTemplateResponse>(
      `api/message-templates?page=${page}&size=${size}&systemId=${systemId}`,
      API_CONFIG.NOTIFICATION_BASE_URL
    );
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
