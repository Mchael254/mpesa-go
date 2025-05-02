import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router'; // Import Router
import { EventEmitter } from '@angular/core'; // Import EventEmitter if needed for complex spies

import { StepperComponent } from './stepper.component';
import { Step } from 'src/app/shared/data/steps'; // Import Step if needed for stepperData typing

// Mock Router
class MockRouter {
  navigate(commands: any[], extras?: any): Promise<boolean> {
    return Promise.resolve(true); // Basic mock, doesn't need complex logic here
  }
}

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;
  let mockRouter: MockRouter; // Use the mock instance

  beforeEach(async () => { // Make async for potentially async TestBed operations
    mockRouter = new MockRouter(); // Create instance of mock

    await TestBed.configureTestingModule({
      declarations: [StepperComponent],
      providers: [
        { provide: Router, useValue: mockRouter } // Provide the mock
      ]
    }).compileComponents(); // Compile components if using external templates/styles

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    // Initialize default inputs if needed, or do it per test
    component.stepperData = [
      { number: 1, title: 'Step 1', link: '/step1' },
      { number: 2, title: 'Step 2', link: '/step2' },
      { number: 3, title: 'Step 3', link: '/step3' }
    ];
    fixture.detectChanges(); // Initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- isStepClickable Tests ---

  it('isStepClickable should return true for a previous step', () => {
    component.currentStep = 3;
    component.isFormValid = false; // Form validity shouldn't matter for previous steps
    const targetStep = 2;
    expect(component.isStepClickable(targetStep)).toBeTruthy();
  });

  it('isStepClickable should return false for a future step if form is invalid', () => {
    component.currentStep = 1;
    component.isFormValid = false;
    const targetStep = 2;
    expect(component.isStepClickable(targetStep)).toBeFalsy();
  });

  it('isStepClickable should return true for the current step if form is valid', () => {
    component.currentStep = 2;
    component.isFormValid = true;
    const targetStep = 2;
    expect(component.isStepClickable(targetStep)).toBeTruthy();
  });

    it('isStepClickable should return false for the current step if form is invalid', () => {
    component.currentStep = 2;
    component.isFormValid = false;
    const targetStep = 2;
    // According to the logic: stepNumber < this.currentStep || this.isFormValid
    // 2 < 2 is false. isFormValid is false. So, false || false = false.
    expect(component.isStepClickable(targetStep)).toBeFalsy();
  });


  it('isStepClickable should return true for a future step if form is valid', () => {
    component.currentStep = 1;
    component.isFormValid = true;
    const targetStep = 2;
    expect(component.isStepClickable(targetStep)).toBeTruthy();
  });

  // --- onStepChange Tests ---

  it('onStepChange should emit stepChange if step is clickable', () => {
    spyOn(component.stepChange, 'emit'); // Spy on the event emitter
    spyOn(component, 'isStepClickable').and.returnValue(true); // Force clickable to be true
    spyOn(window, 'alert'); // Suppress and spy on alert

    const targetStep = 2;
    component.onStepChange(targetStep);

    expect(component.isStepClickable).toHaveBeenCalledWith(targetStep);
    expect(component.stepChange.emit).toHaveBeenCalledWith(targetStep);
    expect(window.alert).toHaveBeenCalledWith('success'); // Verify success alert
  });

  it('onStepChange should call showValidationError and not emit if step is not clickable', () => {
    spyOn(component.stepChange, 'emit'); // Spy on the event emitter
    spyOn(component, 'isStepClickable').and.returnValue(false); // Force clickable to be false
    // Spy on the private method (requires 'as any')
    const showValidationErrorSpy = spyOn(component as any, 'showValidationError');
    spyOn(window, 'alert'); // Suppress and spy on alert


    const targetStep = 3;
    component.onStepChange(targetStep);

    expect(component.isStepClickable).toHaveBeenCalledWith(targetStep);
    expect(component.stepChange.emit).not.toHaveBeenCalled();
    expect(showValidationErrorSpy).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('errro occured'); // Verify error alert
  });

  // --- validateBeforeStepChange Tests ---

  it('validateBeforeStepChange should call onStepChange if form is valid', () => {
    spyOn(component, 'onStepChange'); // Spy on the method to be called
    const showValidationErrorSpy = spyOn(component as any, 'showValidationError');

    component.isFormValid = true;
    const targetStep = 2;
    component.validateBeforeStepChange(targetStep);

    expect(component.onStepChange).toHaveBeenCalledWith(targetStep);
    expect(showValidationErrorSpy).not.toHaveBeenCalled();
  });

  it('validateBeforeStepChange should call showValidationError if form is invalid', () => {
    spyOn(component, 'onStepChange'); // Spy on the method that shouldn't be called
    const showValidationErrorSpy = spyOn(component as any, 'showValidationError');

    component.isFormValid = false;
    const targetStep = 2;
    component.validateBeforeStepChange(targetStep);

    expect(component.onStepChange).not.toHaveBeenCalled();
    expect(showValidationErrorSpy).toHaveBeenCalled();
  });

  // --- Input Default Tests (Optional but good practice) ---
  it('should have default input values', () => {
    // Re-create component without setting inputs to test defaults
    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    // Note: We don't call fixture.detectChanges() here yet if we want pure defaults

    expect(component.stepperData).toEqual([]);
    expect(component.currentStep).toBe(1);
    expect(component.stepType).toBe('link');
    expect(component.orientation).toBe('HORIZONTAL');
    expect(component.isFormValid).toBe(false);
    expect(component.dbStep).toBe(1);
  });

});