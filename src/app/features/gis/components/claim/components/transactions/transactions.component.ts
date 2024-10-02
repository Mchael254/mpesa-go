import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  activeView: string = 'transactionDetails'; // Set default view

  /**
  * Array of transaction data.
  */
  transactionData = [
    {
      transType: 'Loss Opening',
      transDate: '12/08/2024',
      grossLiability: '30,000,000.00',
      netLiabilityPayee: '30,000,000.00',
      paidAmount: '0.00',
      authorisedBy: 'N',
      authoriseDate: '',
      chequeNumber: '',
      chequeDate: '',
      receiptNumber: '',
      action: 'View Transaction'
    }
  ];

 
  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    // No initialization logic required
  }
  
  setActiveView(view: string) {
    this.activeView = view;
  }

  /**
  * Handles the view transaction action.
  *
  * @param transaction The transaction data.
  */
  viewTransaction(transaction: any): void {
    // TODO: Implement view transaction logic
    console.log('View Transaction:', transaction);
  }
}
