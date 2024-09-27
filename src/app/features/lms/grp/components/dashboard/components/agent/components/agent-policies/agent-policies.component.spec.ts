import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentPoliciesComponent } from './agent-policies.component';

describe('AgentPoliciesComponent', () => {
  let component: AgentPoliciesComponent;
  let fixture: ComponentFixture<AgentPoliciesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentPoliciesComponent]
    });
    fixture = TestBed.createComponent(AgentPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
