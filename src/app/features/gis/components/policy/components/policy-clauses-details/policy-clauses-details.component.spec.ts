import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyClausesDetailsComponent } from './policy-clauses-details.component';

describe('PolicyClausesDetailsComponent', () => {
  let component: PolicyClausesDetailsComponent;
  let fixture: ComponentFixture<PolicyClausesDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyClausesDetailsComponent]
    });
    fixture = TestBed.createComponent(PolicyClausesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
