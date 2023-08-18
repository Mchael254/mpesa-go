import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicSetupWizardWelcomeScreenComponent } from './dynamic-setup-wizard-welcome-screen.component';

describe('DynamicSetupWizardWelcomeScreenComponent', () => {
  let component: DynamicSetupWizardWelcomeScreenComponent;
  let fixture: ComponentFixture<DynamicSetupWizardWelcomeScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicSetupWizardWelcomeScreenComponent]
    });
    fixture = TestBed.createComponent(DynamicSetupWizardWelcomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
