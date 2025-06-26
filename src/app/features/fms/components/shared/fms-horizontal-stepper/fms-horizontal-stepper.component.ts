import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fms-horizontal-stepper',
  templateUrl: './fms-horizontal-stepper.component.html',
  styleUrls: ['./fms-horizontal-stepper.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone : false
})
export class  FmsHorizontalStepperComponent 
 {

  constructor(private router: Router, private route: ActivatedRoute){}

  @Input() stepperData: any[];
  @Input() currentStep: number;
  @Input() dbStep: number;
  @Input() stepType: string = 'link';
  @Output() stepChange = new EventEmitter<number>();  // EventEmitter for step changes

  stepperItems: any[] = [
    {
      number: 1,
      title: 'First Step',
      caption: 'Optional',
      status: 'done',
      link: ""
    },
    {
      number: 2,
      title: 'Second Step',
      caption: 'This is description of the second step.',
      status: 'done',
      link: ""
    },
    {
      number: 3,
      title: 'Third Step',
      caption: 'Some text about the third step.',
      status: 'active',
      link: ""
    },
    {
      number: 4,
      title: 'Fourth Step',
      caption: 'Some text about the fourth step.',
      status: 'pending',
      link: ""
    }
  ];

  getStepClasses(index: number) {
    return {
      'done': index <= this.currentStep,
      'step-active': index === this.currentStep
    };
  }
  // getStepClasses(index: number) {
  //   return {
  //     'line': index === index,
  //     'line-black': index === index,
  //   };
  // }

  
  setCurrentStep(stepNumber: number) {
    // We only prevent clicking on the current step again.
    // The parent will handle validation for forward navigation.
    if (stepNumber !== this.currentStep) {
      this.stepChange.emit(stepNumber); // Emit the step number the user wants to go to
    }
  }
  

  navigateToPage(link: string){
    this.router.navigate([link], { relativeTo: this.route });
  }

}
