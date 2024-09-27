import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreditLifeSummaryComponent } from './admin-credit-life-summary.component';

describe('AdminCreditLifeSummaryComponent', () => {
  let component: AdminCreditLifeSummaryComponent;
  let fixture: ComponentFixture<AdminCreditLifeSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCreditLifeSummaryComponent]
    });
    fixture = TestBed.createComponent(AdminCreditLifeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
