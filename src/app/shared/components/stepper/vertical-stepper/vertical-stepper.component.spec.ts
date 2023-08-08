import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalStepperComponent } from './vertical-stepper.component';

describe('VerticalStepperComponent', () => {
  let component: VerticalStepperComponent;
  let fixture: ComponentFixture<VerticalStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticalStepperComponent]
    });
    fixture = TestBed.createComponent(VerticalStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
