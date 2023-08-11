import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsSummaryComponent } from './tickets-summary.component';

describe('TicketsSummaryComponent', () => {
  let component: TicketsSummaryComponent;
  let fixture: ComponentFixture<TicketsSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketsSummaryComponent]
    });
    fixture = TestBed.createComponent(TicketsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
