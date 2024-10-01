import { Component } from '@angular/core';

@Component({
  selector: 'app-claim-transaction',
  templateUrl: './claim-transaction.component.html',
  styleUrls: ['./claim-transaction.component.css']
})
export class ClaimTransactionComponent {
  activeTab = 'claimEnquiry'; // Default tab


  constructor() { }

  ngOnInit(): void {
  }

  // Placeholder method for handling tab change
  onTabChange(event: any) {
    this.activeTab = event.tab.id;
    console.log('Active tab:', this.activeTab);
  }
}
