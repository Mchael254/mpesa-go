import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalLandingScreenComponent } from './proposal-landing-screen.component';

describe('ProposalLandingScreenComponent', () => {
  let component: ProposalLandingScreenComponent;
  let fixture: ComponentFixture<ProposalLandingScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposalLandingScreenComponent]
    });
    fixture = TestBed.createComponent(ProposalLandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
