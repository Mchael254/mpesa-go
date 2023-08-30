import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumRateComponent } from './premium-rate.component';

describe('PremiumRateComponent', () => {
  let component: PremiumRateComponent;
  let fixture: ComponentFixture<PremiumRateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumRateComponent]
    });
    fixture = TestBed.createComponent(PremiumRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
