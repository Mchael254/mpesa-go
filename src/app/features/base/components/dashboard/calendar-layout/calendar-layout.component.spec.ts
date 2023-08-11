import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarLayoutComponent } from './calendar-layout.component';

describe('CalendarLayoutComponent', () => {
  let component: CalendarLayoutComponent;
  let fixture: ComponentFixture<CalendarLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarLayoutComponent]
    });
    fixture = TestBed.createComponent(CalendarLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
