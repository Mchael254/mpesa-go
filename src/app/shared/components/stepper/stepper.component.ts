import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { Step } from '../../data/steps';
import { StepperService } from '../../services/stepper/stepper.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StepperComponent {
  @Input() stepperData: Step[];
  @Input() currentStep: number = 1;
  @Input() dbStep: number = 1;
  @Input() orientation: string = 'HORIZONTAL'
  @Output() stepChange = new EventEmitter<number>();  // EventEmitter to re-emit step changes



  constructor(private stepperService: StepperService) { }


  onStepChange(step: number) {
    this.stepChange.emit(step);  // Re-emit the step number
  }

}
