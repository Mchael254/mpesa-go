import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ChannelsDTO } from '../data/channels';
import { ApiService } from '../../../shared/services/api/api.service';
import { API_CONFIG } from '../../../../environments/api_service_config';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private api: ApiService) {}

  getChannels(): Observable<ChannelsDTO[]> {
    return this.api.GET<ChannelsDTO[]>(
      `channels`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  createChannel(data: ChannelsDTO): Observable<ChannelsDTO> {
    return this.api.POST<ChannelsDTO>(
      `channels`,
      JSON.stringify(data),
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  updateChannel(channelId: number, data: ChannelsDTO): Observable<ChannelsDTO> {
    return this.api.PUT<ChannelsDTO>(
      `channels/${channelId}`,
      data,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }

  deleteChannel(channelId: number) {
    return this.api.DELETE<ChannelsDTO>(
      `channels/${channelId}`,
      API_CONFIG.CRM_SETUPS_SERVICE_BASE_URL
    );
  }
}
