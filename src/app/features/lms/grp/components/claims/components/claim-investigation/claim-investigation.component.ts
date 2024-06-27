import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-claim-investigation',
  templateUrl: './claim-investigation.component.html',
  styleUrls: ['./claim-investigation.component.css']
})
export class ClaimInvestigationComponent implements OnInit, OnDestroy {
  steps = stepData;

  constructor() {}
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

}