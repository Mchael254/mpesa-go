import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentQuotesComponent } from './agent-quotes.component';

describe('AgentQuotesComponent', () => {
  let component: AgentQuotesComponent;
  let fixture: ComponentFixture<AgentQuotesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgentQuotesComponent]
    });
    fixture = TestBed.createComponent(AgentQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
