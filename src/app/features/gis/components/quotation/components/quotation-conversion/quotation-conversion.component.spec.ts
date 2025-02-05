import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationConversionComponent } from './quotation-conversion.component';

describe('QuotationConversionComponent', () => {
  let component: QuotationConversionComponent;
  let fixture: ComponentFixture<QuotationConversionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationConversionComponent]
    });
    fixture = TestBed.createComponent(QuotationConversionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
