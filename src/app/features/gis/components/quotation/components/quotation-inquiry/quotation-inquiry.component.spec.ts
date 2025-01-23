import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationInquiryComponent } from './quotation-inquiry.component';

describe('QuotationInquiryComponent', () => {
  let component: QuotationInquiryComponent;
  let fixture: ComponentFixture<QuotationInquiryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationInquiryComponent]
    });
    fixture = TestBed.createComponent(QuotationInquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
