import { Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';

@Component({
  selector: 'app-payment-processing',
  templateUrl: './payment-processing.component.html',
  styleUrls: ['./payment-processing.component.css']
})
export class PaymentProcessingComponent implements OnInit, OnDestroy {
  steps = stepData;

  constructor() {}
  
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }
}
