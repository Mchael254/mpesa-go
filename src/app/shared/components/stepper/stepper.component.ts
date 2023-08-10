import { Component, Input, ViewEncapsulation } from '@angular/core';
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
  @Input() orientation: string = 'HORIZONTAL';



  constructor(private stepperService: StepperService) { }




}
