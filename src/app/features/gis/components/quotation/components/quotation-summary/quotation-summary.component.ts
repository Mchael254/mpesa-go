import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';



@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.css']
})
export class QuotationSummaryComponent {
  steps = quoteStepsData;
}
