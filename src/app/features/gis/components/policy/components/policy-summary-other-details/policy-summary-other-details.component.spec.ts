import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySummaryOtherDetailsComponent } from './policy-summary-other-details.component';

describe('PolicySummaryOtherDetailsComponent', () => {
  let component: PolicySummaryOtherDetailsComponent;
  let fixture: ComponentFixture<PolicySummaryOtherDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicySummaryOtherDetailsComponent]
    });
    fixture = TestBed.createComponent(PolicySummaryOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
