import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { PassedClientDto } from 'src/app/features/entities/data/PassedClientDTO';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { Router } from '@angular/router';

const log = new Logger('QuotationsClientDetailsComponent');


@Component({
  selector: 'app-quotations-client-details',
  templateUrl: './quotations-client-details.component.html',
  styleUrls: ['./quotations-client-details.component.css']
})
export class QuotationsClientDetailsComponent {
  steps = quoteStepsData;
  clientData: PassedClientDto;

  constructor(
    public router: Router,

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
  handleSaveClient(eventData: any) {
    log.debug('Event received in Component B:', eventData);
    sessionStorage.setItem("clientCode", JSON.stringify(eventData.id));

    if(eventData) {
   log.debug("Navigate to quotation details")
   this.router.navigate(['/home/gis/quotation/quotation-details']);

    
    }
  }
}
