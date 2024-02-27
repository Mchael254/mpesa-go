import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyLandingScreenComponent } from './policy-landing-screen.component';

describe('PolicyLandingScreenComponent', () => {
  let component: PolicyLandingScreenComponent;
  let fixture: ComponentFixture<PolicyLandingScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PolicyLandingScreenComponent]
    });
    fixture = TestBed.createComponent(PolicyLandingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
