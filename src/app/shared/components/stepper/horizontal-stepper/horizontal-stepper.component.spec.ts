import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalStepperComponent } from './horizontal-stepper.component';

describe('HorizontalStepperComponent', () => {
  let component: HorizontalStepperComponent;
  let fixture: ComponentFixture<HorizontalStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HorizontalStepperComponent]
    });
    fixture = TestBed.createComponent(HorizontalStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
