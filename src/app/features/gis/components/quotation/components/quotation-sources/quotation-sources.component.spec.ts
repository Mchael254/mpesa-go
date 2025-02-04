import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationSourcesComponent } from './quotation-sources.component';

describe('QuotationSourcesComponent', () => {
  let component: QuotationSourcesComponent;
  let fixture: ComponentFixture<QuotationSourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuotationSourcesComponent]
    });
    fixture = TestBed.createComponent(QuotationSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
