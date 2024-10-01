import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css']
})
export class PolicySummaryComponent implements OnInit, OnDestroy {
  selectedOption: string = '';

  constructor() {}

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    
  }

  policySummary = {
    policyNumber: 'PN1234567',
    clientName: 'Jane Doe',
    product: 'Life Insurance',
    coverageDuration: '20 Years',
    covers: 'Death, Total Disability',
    frequencyOfPayment: 'Monthly',
    coverFrom: '01-Jan-2024',
    coverTo: '31-Dec-2044',
    sumAssured: '$200,000',
    premium: '$1,500',
    commission: '$150'
};

selectPaymentOption(option: string) {
  this.selectedOption = option;
}

showPushPopUpModal() {
  const modal = document.getElementById('pushPopUpModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'block';
  }
}

closePushPopUpModal() {
  const modal = document.getElementById('pushPopUpModal');
  if (modal) {
    modal.classList.remove('show')
    modal.style.display = 'none';
  }
}

}
