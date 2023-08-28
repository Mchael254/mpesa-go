import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardShortPeriodRatesComponent } from './standard-short-period-rates.component';

describe('StandardShortPeriodRatesComponent', () => {
  let component: StandardShortPeriodRatesComponent;
  let fixture: ComponentFixture<StandardShortPeriodRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StandardShortPeriodRatesComponent]
    });
    fixture = TestBed.createComponent(StandardShortPeriodRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
