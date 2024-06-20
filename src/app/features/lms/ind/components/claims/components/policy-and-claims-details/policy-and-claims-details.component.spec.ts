import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyAndClaimsDetailsComponent } from './policy-and-claims-details.component';

describe('PolicyAndClaimsDetailsComponent', () => {
  let component: PolicyAndClaimsDetailsComponent;
  let fixture: ComponentFixture<PolicyAndClaimsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyAndClaimsDetailsComponent]
    });
    fixture = TestBed.createComponent(PolicyAndClaimsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
