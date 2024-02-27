import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfigService } from '../../../core/config/app-config-service';
import { Observable } from 'rxjs';
import { ChannelsDTO } from '../data/channels';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  baseUrl = this.appConfig.config.contextPath.setup_services;

  constructor(private http: HttpClient, private appConfig: AppConfigService) {}

  getChannels(): Observable<ChannelsDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.get<ChannelsDTO[]>(`/${this.baseUrl}/setups/channels`, {
      headers: headers,
    });
  }

  createChannel(data: ChannelsDTO): Observable<ChannelsDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.post<ChannelsDTO>(
      `/${this.baseUrl}/setups/channels`,
      JSON.stringify(data),
      { headers: headers }
    );
  }

  updateChannel(channelId: number, data: ChannelsDTO): Observable<ChannelsDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.put<ChannelsDTO>(
      `/${this.baseUrl}/setups/channels/${channelId}`,
      data,
      { headers: headers }
    );
  }

  deleteChannel(channelId: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http.delete<ChannelsDTO>(
      `/${this.baseUrl}/setups/channels/${channelId}`,
      { headers: headers }
    );
  }
}
