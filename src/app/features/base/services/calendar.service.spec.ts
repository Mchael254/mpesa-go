import { TestBed } from '@angular/core/testing';

import { CalendarService } from './calendar.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppConfigService} from "../../../core/config/app-config-service";
import {SaveCalendarEventDTO} from "../../../shared/data/base/dashboard/calendar-dto";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
    };
  }
}
describe('CalendarService', () => {
  let service: CalendarService;
  let httpTestingController: HttpTestingController;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AppConfigService, useClass: MockAppConfigService },
      ]
    });
    service = TestBed.inject(CalendarService);
    httpTestingController = TestBed.inject(HttpTestingController);
    appConfigService = TestBed.inject(AppConfigService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should get calendar events', () => {
    const baseUrl = appConfigService.config.contextPath.users_services;
    service.getCalendarEvent(`WADUVAGA`).subscribe((events) => {
      expect(events).toBeTruthy();
    })
    const req = httpTestingController.expectOne(`/${baseUrl}/administration/calendar-activities?user=WADUVAGA`);
    expect(req.request.method).toEqual('GET');
    req.flush([])
  });

  test('should save calendar event', () => {
    const event: SaveCalendarEventDTO = {
      StartDate: "",
      code: 0,
      endDate: "",
      location: "",
      memo: "",
      startDate: "",
      title: "",
      user: ""
    };

    const baseUrl = appConfigService.config.contextPath.users_services;
    service.saveCalendarEvent(event).subscribe((res) => {
      expect(res).toBeTruthy();
      expect(res).toEqual([event])
    })
    const req = httpTestingController.expectOne(`/${baseUrl}/administration/calendar-activities`);
    expect(req.request.method).toEqual('POST');
    req.flush(event)
  });

});
