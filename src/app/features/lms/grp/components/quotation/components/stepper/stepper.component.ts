import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css']
})
export class StepperComponent implements OnInit {

  constructor(private route: ActivatedRoute) {}

  isStepActive(step: string): boolean {
    return this.route.snapshot.routeConfig?.path === step;
  }

  ngOnInit(): void {
    
  }

}
