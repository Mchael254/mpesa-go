import { Component, OnInit, OnDestroy } from '@angular/core';
import StepData from '../../data/steps.json';

@Component({
  selector: 'app-policy-and-claims-details',
  templateUrl: './policy-and-claims-details.component.html',
  styleUrls: ['./policy-and-claims-details.component.css']
})
export class PolicyAndClaimsDetailsComponent implements OnInit, OnDestroy {
  steps = StepData;

  constructor(){}

  ngOnInit(){}

  ngOnDestroy(){}
}
