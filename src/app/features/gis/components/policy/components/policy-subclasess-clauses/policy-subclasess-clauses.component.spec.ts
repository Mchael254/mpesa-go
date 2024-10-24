import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySubclasessClausesComponent } from './policy-subclasess-clauses.component';

describe('PolicySubclasessClausesComponent', () => {
  let component: PolicySubclasessClausesComponent;
  let fixture: ComponentFixture<PolicySubclasessClausesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicySubclasessClausesComponent]
    });
    fixture = TestBed.createComponent(PolicySubclasessClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
