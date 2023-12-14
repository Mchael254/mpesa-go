import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationDetailsComponent } from './quotation-details.component';

describe('QuotationDetailsComponent', () => {
  let component: QuotationDetailsComponent;
  let fixture: ComponentFixture<QuotationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationDetailsComponent]
    });
    fixture = TestBed.createComponent(QuotationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
