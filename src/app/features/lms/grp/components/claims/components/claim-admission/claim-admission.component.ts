import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-claim-admission',
  templateUrl: './claim-admission.component.html',
  styleUrls: ['./claim-admission.component.css']
})
export class ClaimAdmissionComponent implements OnInit, OnDestroy {
  steps = stepData;

  constructor() {}
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
