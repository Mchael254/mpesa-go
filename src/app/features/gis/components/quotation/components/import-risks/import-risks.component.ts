import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';

@Component({
  selector: 'app-import-risks',
  templateUrl: './import-risks.component.html',
  styleUrls: ['./import-risks.component.css']
})
export class ImportRisksComponent {
  steps = quoteStepsData;

}
