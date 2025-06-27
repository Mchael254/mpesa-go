import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FmsHorizontalStepperComponent } from './fms-horizontal-stepper.component';

describe('FmsHorizontalStepperComponent', () => {
  let component: FmsHorizontalStepperComponent;
  let fixture: ComponentFixture<FmsHorizontalStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FmsHorizontalStepperComponent]
    });
    fixture = TestBed.createComponent(FmsHorizontalStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
