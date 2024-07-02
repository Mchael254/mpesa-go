import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySummaryDetailsComponent } from './policy-summary-details.component';

describe('PolicySummaryDetailsComponent', () => {
  let component: PolicySummaryDetailsComponent;
  let fixture: ComponentFixture<PolicySummaryDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicySummaryDetailsComponent]
    });
    fixture = TestBed.createComponent(PolicySummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
