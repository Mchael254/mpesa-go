import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationReportComponent} from './quotation-report.component';

describe('NewComponent', () => {
  let component: QuotationReportComponent;
  let fixture: ComponentFixture<QuotationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
