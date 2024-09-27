import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingDashboardComponent } from './landing-dashboard.component';

describe('LandingDashboardComponent', () => {
  let component: LandingDashboardComponent;
  let fixture: ComponentFixture<LandingDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LandingDashboardComponent]
    });
    fixture = TestBed.createComponent(LandingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
