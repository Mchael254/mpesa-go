import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuoteSummaryComponent } from './admin-quote-summary.component';

describe('AdminQuoteSummaryComponent', () => {
  let component: AdminQuoteSummaryComponent;
  let fixture: ComponentFixture<AdminQuoteSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminQuoteSummaryComponent]
    });
    fixture = TestBed.createComponent(AdminQuoteSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
