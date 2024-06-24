import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-claims-investigation',
  templateUrl: './claims-investigation.component.html',
  styleUrls: ['./claims-investigation.component.css']
})

export class ClaimsInvestigationComponent implements OnInit, OnDestroy {
  steps = stepData;
 
  constructor () {}

  ngOnInit() {}

  ngOnDestroy() {} 
}
