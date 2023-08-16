import {Component, Input} from '@angular/core';
import {TicketsService} from "../../../../services/tickets.service";
import {take} from "rxjs/operators";
import {Logger} from "../../../../../../shared/services";

const log = new Logger('TaxDetailsComponent');

@Component({
  selector: 'app-tax-details',
  templateUrl: './tax-details.component.html',
  styleUrls: ['./tax-details.component.css']
})
export class TaxDetailsComponent {

  @Input() taxInformation;
  @Input() totalPremium;
  public transactionTypes = {};

  constructor(private ticketService: TicketsService) {
    this.getTransactionTypes();
  }

  getTransactionTypes() {
    this.ticketService.getTransactionTypes()
      .pipe(take(1))
      .subscribe((res) => {
        res.forEach((transactionType) => {
          this.transactionTypes[transactionType.code] = transactionType.description;
        })
      })
  }

  getTaxDescription(taxCode: string): string {
    return this.transactionTypes[taxCode];


  }
}
