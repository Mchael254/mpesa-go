import {Component, OnDestroy, OnInit} from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import {PassedClientDto} from 'src/app/features/entities/data/PassedClientDTO';
import {Logger} from '../../../../../../shared/services'
import {Router} from '@angular/router';

const log = new Logger('QuotationsClientDetailsComponent');


@Component({
  selector: 'app-quotations-client-details',
  templateUrl: './quotations-client-details.component.html',
  styleUrls: ['./quotations-client-details.component.css']
})
export class QuotationsClientDetailsComponent implements OnInit, OnDestroy {
  steps = quoteStepsData;
  clientData: PassedClientDto;

  constructor(
    public router: Router,
  ) {
  }

  ngOnInit() {
    const normalQuoteTimeStamp = new Date().getTime(); // Get current timestamp
    const queryParams = {normalQuoteTimeStamp: normalQuoteTimeStamp};
    const timestampString = JSON.stringify(normalQuoteTimeStamp);
    sessionStorage.setItem('normalQuoteTimeStamp', timestampString);
  }

  handleSaveClient(eventData: any) {
    log.debug('Event received in Component B:', eventData);
    sessionStorage.setItem("client", JSON.stringify(eventData));
    /*if (eventData) {
      log.debug("Navigate to quotation details")
      this.router.navigate(['/home/gis/quotation/quotation-details']);
    }*/
  }

  ngOnDestroy(): void {
  }
}
