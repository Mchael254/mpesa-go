import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfigService} from "../../../core/config/app-config-service";
import {CalendarEventReqDTO, SaveCalendarEventDTO} from "../../../shared/data/base/dashboard/calendar-dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private baseUrl = this.appConfig.config.contextPath.users_services;

  constructor(
    private http: HttpClient,
    private appConfig: AppConfigService
  ) { }

  /**
   * Gets the list of calendar events for the loggedIn user
   * @param username - username for the loggedIn user
   * @return CalendarEventReqDTO[]
   */
  getCalendarEvent(username:string): Observable<CalendarEventReqDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    const params = new HttpParams()
      .set('user', `${username}`);

    return this.http.get<CalendarEventReqDTO[]>(`/${this.baseUrl}/administration/calendar-activities`, {
      headers:headers,
      params:params
    })
  }

  /**
   * Saves a calendar events for the loggedIn user
   * @param createEventData
   * @return SaveCalendarEventDTO[]
   */
  saveCalendarEvent(createEventData: SaveCalendarEventDTO): Observable<SaveCalendarEventDTO[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    return this.http.post<SaveCalendarEventDTO[]>(`/${this.baseUrl}/administration/calendar-activities`,
      JSON.stringify(createEventData), {headers:headers})
  }

}
