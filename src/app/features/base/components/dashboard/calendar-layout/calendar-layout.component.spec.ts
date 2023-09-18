import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLayoutComponent } from './calendar-layout.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {CalendarDay, CalendarEventReqDTO} from "../../../../../shared/data/base/dashboard/calendar-dto";

describe('CalendarLayoutComponent', () => {
  let component: CalendarLayoutComponent;
  let fixture: ComponentFixture<CalendarLayoutComponent>;

  const event: CalendarEventReqDTO = {
    code: 0,
    createdDate: "",
    endDate: "",
    endDays: "",
    endHours: "",
    location: "",
    startDate: "",
    startDays: "",
    startHour: "",
    title: "",
    user: ""
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarLayoutComponent],
      imports: [],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(CalendarLayoutComponent);

    component = fixture.componentInstance;
    component.daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    component.daysToDisplay = [
      {
        date: 1,
        month: 1,
        year: 2023,
        active: true,
        overflow: true,
        isSelected: true,
        event: [event, event]
      }
    ];
    component.selectedDayInMonthView = {};
    component.selectedRange = 'MONTH';

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should emit selectedDate', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#selectDayBtn');
    button.click()
    fixture.detectChanges();
    expect(component.emitSelectedDate.call).toBeTruthy();
  });

  test('should showDialog', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#showDialog');
    button.click()
    fixture.detectChanges();
    expect(component.showDialog.call).toBeTruthy();
  })


});
