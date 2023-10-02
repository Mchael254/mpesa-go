import { Component } from '@angular/core';
import stepData from '../../data/steps.json'

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent {
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;

}
