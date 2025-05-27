import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteReportComponent } from './quote-report.component';


describe('QuoutationReportComponent', () => {
  let component: QuoteReportComponent;
  let fixture: ComponentFixture<QuoteReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoteReportComponent]
    });
    fixture = TestBed.createComponent(QuoteReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
