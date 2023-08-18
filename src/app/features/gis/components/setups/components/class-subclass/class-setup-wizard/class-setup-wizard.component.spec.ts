import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassSetupWizardComponent } from './class-setup-wizard.component';

describe('ClassSetupWizardComponent', () => {
  let component: ClassSetupWizardComponent;
  let fixture: ComponentFixture<ClassSetupWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassSetupWizardComponent]
    });
    fixture = TestBed.createComponent(ClassSetupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
