import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-horizontal-stepper',
  templateUrl: './horizontal-stepper.component.html',
  styleUrls: ['./horizontal-stepper.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalStepperComponent {

  constructor(private router: Router, private route: ActivatedRoute){}

  @Input() stepperData: any[];
  @Input() currentStep: number = 1;

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

  navigateToPage(link: string){
    this.router.navigate([link], { relativeTo: this.route });
  }

}
