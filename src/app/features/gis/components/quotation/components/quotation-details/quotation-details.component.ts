import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent {
  steps = quoteStepsData;

}
