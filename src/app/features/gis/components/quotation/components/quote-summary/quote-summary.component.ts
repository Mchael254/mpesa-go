
import { Component } from '@angular/core';


@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent {
  steps = [
    { label: 'Quote Information' },
    { label: 'Quotation Summary' }
  ];

editNotesVisible = false;

  activeIndex = 1;

setStep(index: number) {
  this.activeIndex = index;
}


quotation = {
  number: 'Q123',
  status: 'Active',
  reference: 'REF456',
  ticket: 'TICK789',
  notes: 'Some note goes here...',
  currency:'KES',
  products: [
    {
      product: 'Motor Private',
      risk: 'Toyota Premio',
      coverType: 'Comprehensive',
      effectiveDate: '2025-06-01',
      sumInsured: 1200000,
      premium: 25000,
      
    },
    {
      product: 'Motor Private',
      risk: 'Honda Fit',
      coverType: 'Third Party',
      effectiveDate: '2025-06-01',
      sumInsured: 800000,
      premium: 15000,
      
    },
    {
      product: 'Domestic',
      risk: 'House Fire',
      coverType: 'Full',
      effectiveDate: '2025-06-01',
      sumInsured: 2000000,
      premium: 30000,
      
    }
  ]
};

getTotalPremium(): number {
  return this.quotation.products.reduce((sum, p) => sum + p.premium, 0);
}


getShortNotes(notes: string): string {
  if (!notes) return '';
  const words = notes.trim().split(/\s+/); // handles extra spaces
  return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : notes;
}





  
}
