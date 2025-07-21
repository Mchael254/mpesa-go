import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationOtherDetailsComponent } from './quotation-other-details.component';

describe('QuotationOtherDetailsComponent', () => {
  let component: QuotationOtherDetailsComponent;
  let fixture: ComponentFixture<QuotationOtherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationOtherDetailsComponent]
    });
    fixture = TestBed.createComponent(QuotationOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
