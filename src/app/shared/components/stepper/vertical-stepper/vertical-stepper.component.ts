import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Step} from "../../../data/steps";

@Component({
  selector: 'app-vertical-stepper',
  templateUrl: './vertical-stepper.component.html',
  styleUrls: ['./vertical-stepper.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone : false
})
export class VerticalStepperComponent {
  constructor(private router:Router, private route: ActivatedRoute){}

  @Input() stepperData: Step[];
  @Input() currentStep: number = 1;

  getStepClasses(index: number) {
    return {
      'done': index < this.currentStep,
      'step-active': index === this.currentStep
    };
  }

  navigateToPage(link: string){
    this.router.navigate([link], { relativeTo: this.route });
  }

}
