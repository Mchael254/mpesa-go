import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';

@Component({
  selector: 'app-risk-section-details',
  templateUrl: './risk-section-details.component.html',
  styleUrls: ['./risk-section-details.component.css']
})
export class RiskSectionDetailsComponent {
  steps = quoteStepsData;

}
