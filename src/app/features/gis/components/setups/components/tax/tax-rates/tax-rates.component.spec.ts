import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRatesComponent } from './tax-rates.component';

describe('TaxRatesComponent', () => {
  let component: TaxRatesComponent;
  let fixture: ComponentFixture<TaxRatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxRatesComponent]
    });
    fixture = TestBed.createComponent(TaxRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
