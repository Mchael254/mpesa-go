import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimBookingComponent } from './claim-booking.component';

describe('ClaimBookingComponent', () => {
  let component: ClaimBookingComponent;
  let fixture: ComponentFixture<ClaimBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimBookingComponent]
    });
    fixture = TestBed.createComponent(ClaimBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
