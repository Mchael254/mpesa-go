import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { PassedClientDto } from 'src/app/features/entities/data/PassedClientDTO';
@Component({
  selector: 'app-quotations-client-details',
  templateUrl: './quotations-client-details.component.html',
  styleUrls: ['./quotations-client-details.component.css']
})
export class QuotationsClientDetailsComponent {
  steps = quoteStepsData;
  clientData: PassedClientDto;

    constructor(

  ){}

}
