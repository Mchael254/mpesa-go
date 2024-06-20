import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-claims-initiation',
  templateUrl: './claims-initiation.component.html',
  styleUrls: ['./claims-initiation.component.css']
})
export class ClaimsInitiationComponent implements OnInit, OnDestroy{
  steps = stepData;

  constructor(){}

  ngOnInit(){}

  ngOnDestroy(){}
}
