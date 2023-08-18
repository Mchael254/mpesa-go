import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassesSetupWizardComponent } from './classes-setup-wizard.component';

describe('ClassesSetupWizardComponent', () => {
  let component: ClassesSetupWizardComponent;
  let fixture: ComponentFixture<ClassesSetupWizardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassesSetupWizardComponent]
    });
    fixture = TestBed.createComponent(ClassesSetupWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
