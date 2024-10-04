import { Component } from '@angular/core';
import claimSteps from '../../data/claims_steps.json'
@Component({
  selector: 'app-claim-transaction',
  templateUrl: './claim-transaction.component.html',
  styleUrls: ['./claim-transaction.component.css']
})
export class ClaimTransactionComponent {
  activeTab = 'claimEnquiry'; // Default tab
  steps = claimSteps

  constructor() { }

  ngOnInit(): void {
  }

  // Placeholder method for handling tab change
  onTabChange(event: any) {
    this.activeTab = event.tab.id;
    console.log('Active tab:', this.activeTab);
  }
}
