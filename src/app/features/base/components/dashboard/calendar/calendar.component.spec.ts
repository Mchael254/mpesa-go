import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BehaviorSubject, Observable, of, shareReplay} from "rxjs";
import {AccountContact} from "../../../../../shared/data/account-contact";
import {ClientAccountContact} from "../../../../../shared/data/client-account-contact";
import {WebAdmin} from "../../../../../shared/data/web-admin";
import {AuthService} from "../../../../../shared/services/auth.service";
import {AppConfigService} from "../../../../../core/config/app-config-service";
import {MessageService} from "primeng/api";
import {DebugElement, NO_ERRORS_SCHEMA} from "@angular/core";
import {createSpyObj} from "jest-createspyobj";
import {
  CalendarDay,
  CalendarEventReqDTO,
  SaveCalendarEventDTO
} from "../../../../../shared/data/base/dashboard/calendar-dto";
import {CalendarService} from "../../../services/calendar.service";
import {By} from "@angular/platform-browser";

export class MockAppConfigService {
  get config() {
    return {
      contextPath: {
        "accounts_services": "crm",
        "users_services": "user",
        "auth_services": "oauth"
      },
      cubejsDefaultUrl: `http://10.176.18.211:4000/cubejs-api/v1`
    };
  }
}

export class MockAuthService {
  private currentUserSubject = new BehaviorSubject<AccountContact | ClientAccountContact | WebAdmin>({} as AccountContact | ClientAccountContact | WebAdmin);
  public currentUser$: Observable<AccountContact | ClientAccountContact | WebAdmin> = this.currentUserSubject.asObservable().pipe(shareReplay());
  getCurrentUser(): AccountContact | ClientAccountContact | WebAdmin {
    return this.currentUserSubject.value;
  }
  getCurrentUserName(): string {
    return 'WADUVAGA';
  }
}

export function findComponent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
): DebugElement {
  return fixture.debugElement.query(By.css(selector));
}

describe('CalendarComponent', () => {
  const calendarServiceStub = createSpyObj('CalendarService',[
    'getCalendarEvent', 'saveCalendarEvent']);

  /*jest.mock('moment', () => {
    const oMoment = jest.requireActual('moment');
    const mm = {
      format: jest.fn(),
    };
    const mMoment = jest.fn(() => mm);
    for (let prop in oMoment) {
      mMoment[prop] = oMoment[prop];
    }
    return mMoment;
  });*/

  const calendarEvent: CalendarEventReqDTO = {
    code: 0,
    createdDate: "",
    endDate: "",
    endDays: "",
    endHours: "",
    location: "",
    startDate: "18/09/2023",
    startDays: "",
    startHour: "",
    title: "",
    user: ""
  };

  const createdEVent: SaveCalendarEventDTO = {
    StartDate:"2023-10-17T23:00:00.000Z",
    code: 101,
    endDate: "2023-10-17T23:00:00.000Z",
    location: "Lagos",
    memo: "sample memo",
    startDate: "2023-10-17T23:00:00.000Z",
    title: "Sample test event",
    user: "WADUVAGA"
  }

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let authService: AuthService;
  let appConfigService: AppConfigService;

  beforeEach(() => {
    jest.spyOn(calendarServiceStub, 'getCalendarEvent' ).mockReturnValue(of([calendarEvent]))
    jest.spyOn(calendarServiceStub, 'saveCalendarEvent' ).mockReturnValue(of(createdEVent))


    TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useClass: MockAppConfigService },
        { provide: CalendarService, useValue: calendarServiceStub },
        MessageService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const date = new Date('18/09/2023');
    component.currYear = date.getFullYear();
    component.currMonth = date.getMonth();
  });

  test('should create', () => {
    expect(component).toBeTruthy();

    expect(component.createDateString.call).toBeTruthy();
    expect(component.getEvents.call).toBeTruthy();
    expect(component.createDateSelectionForm.call).toBeTruthy();
    expect(component.sliceTime.call).toBeTruthy();
    expect(component.renderCalendar.call).toBeTruthy();
    expect(component.filterEvents.call).toBeTruthy();
  });

  test('should select data', () => {
    const day: CalendarDay = {
      active: false,
      date: 18,
      event: [],
      isSelected: false,
      month: 8,
      overflow: false,
      year: 2023
    }
    const daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const calendarLayout = findComponent(fixture,'app-calendar-layout');

    calendarLayout.triggerEventHandler('selectDate', day)

    expect(component.deselectDays.call).toBeTruthy();
    expect(component.selectedDate).toBe(18)
    expect(component.fetchFilteredEvents.call).toBeTruthy();
    expect(calendarLayout).toBeTruthy();
    expect(calendarLayout.properties['daysOfTheWeek']).toEqual(daysOfTheWeek)
  });

  test('should goto previous & next', () => {
    const select = fixture.debugElement.nativeElement.querySelector('#gotoPrevNext');
    select.value = select.options[8].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.date).toEqual(new Date("2023-09-17T23:00:00.000Z"));
    expect(component.renderCalendar.call).toBeTruthy();
    expect(component.fetchFilteredEvents.call).toBeTruthy();
  });

  test('should create an event', () => {
    component.newEventForm.controls['fromDate'].setValue(new Date("2023-10-17T23:00:00.000Z"));
    component.newEventForm.controls['toDate'].setValue(new Date("2023-10-17T23:00:00.000Z"));
    component.newEventForm.controls['location'].setValue('Lagos');
    component.newEventForm.controls['details'].setValue('some details');
    component.newEventForm.controls['eventTitle'].setValue('Sample test event');

    const button = fixture.debugElement.nativeElement.querySelector('#createEvent');
    // button.click()
    component.createEvent();
    fixture.detectChanges();

    expect(component.createDateString.call).toBeTruthy();
    expect(component.getEvents.call).toBeTruthy();

  });


});
