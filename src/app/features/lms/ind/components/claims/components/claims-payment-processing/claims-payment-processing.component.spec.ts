import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsPaymentProcessingComponent } from './claims-payment-processing.component';

describe('ClaimsPaymentProcessingComponent', () => {
  let component: ClaimsPaymentProcessingComponent;
  let fixture: ComponentFixture<ClaimsPaymentProcessingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsPaymentProcessingComponent]
    });
    fixture = TestBed.createComponent(ClaimsPaymentProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
