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

  ) { }
  ngOnInit() {
    // Constructing the route using array of route segments
    const normalQuoteTimeStamp = new Date().getTime(); // Get current timestamp
    const queryParams = {  normalQuoteTimeStamp: normalQuoteTimeStamp };

    console.log("Normal quote Time Stamp", normalQuoteTimeStamp);
    console.log("Query Parameters", queryParams);

    const timestampString = JSON.stringify(normalQuoteTimeStamp);
    sessionStorage.setItem('normalQuoteTimeStamp', timestampString);
    console.log("Passed Time Stamp(GIS)", timestampString);
  }
}
