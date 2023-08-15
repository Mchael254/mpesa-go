import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullTicketDetailsComponent } from './full-ticket-details.component';

describe('FullTicketDetailsComponent', () => {
  let component: FullTicketDetailsComponent;
  let fixture: ComponentFixture<FullTicketDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullTicketDetailsComponent]
    });
    fixture = TestBed.createComponent(FullTicketDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
