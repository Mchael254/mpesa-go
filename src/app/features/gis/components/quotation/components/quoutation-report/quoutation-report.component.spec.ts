import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoutationReportComponent } from './quoutation-report.component';


describe('QuoutationReportComponent', () => {
  let component: QuoutationReportComponent;
  let fixture: ComponentFixture<QuoutationReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuoutationReportComponent]
    });
    fixture = TestBed.createComponent(QuoutationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
