import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { Step } from 'src/app/shared/data/steps';

@Component({
  selector: 'app-steper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class StepperComponent {
  @Input() stepperData: Step[] = [];
  @Input() currentStep: number = 1;
  @Input() stepType: string = 'link';
  @Input() orientation: string = 'HORIZONTAL';
  @Input() isFormValid: boolean = false; // ✅ Accept validation state from parent
  @Input() dbStep: number = 1; // ✅ Add this line

  @Output() stepChange = new EventEmitter<number>();

  constructor(private router: Router) {}

  onStepChange(step: number) {
    if (this.isStepClickable(step)) {
      alert('success');
      this.stepChange.emit(step);
    } else {
      alert('errro occured');
      this.showValidationError();
    }
  }

  isStepClickable(stepNumber: number): boolean {
    return stepNumber < this.currentStep || this.isFormValid; // ✅ Allow only previous steps or valid current step
  }

  // navigateToStep(step: Step) {
  //   if (this.isStepClickable(step.number)) {
  //     this.router.navigate([step.link]);
  //   } else {
  //     this.showValidationError();
  //   }
  // }
  validateBeforeStepChange(step: number) {
    if (this.isFormValid) {
      this.onStepChange(step);
    } else {
      this.showValidationError();
    }
  }

  private showValidationError() {
    //console.warn("User must complete required fields before proceeding.");
  }
}
