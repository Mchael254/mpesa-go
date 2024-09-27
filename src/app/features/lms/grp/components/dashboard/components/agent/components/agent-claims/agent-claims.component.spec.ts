import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentClaimsComponent } from './agent-claims.component';

describe('AgentClaimsComponent', () => {
  let component: AgentClaimsComponent;
  let fixture: ComponentFixture<AgentClaimsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentClaimsComponent]
    });
    fixture = TestBed.createComponent(AgentClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
