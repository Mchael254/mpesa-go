import { Component } from '@angular/core';
import { QuotationDTO } from '../../data/quotationsDTO';
import { StepsModule } from 'primeng/steps';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';


@Component({
  selector: 'app-quoute-summary',
  standalone:true,
  imports:[ BreadcrumbModule,
    StepsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    OverlayPanelModule],
  templateUrl: './quoute-summary.component.html',
  styleUrls: ['./quoute-summary.component.css']
})
export class QuouteSummaryComponent {
  steps = [
    { label: 'Quote Information' },
    { label: 'Quotation Summary' }
  ];

  editNotesVisible = false;
  activeIndex = 1;

  setStep(index: number) {
    this.activeIndex = index;
  }

  // Use the DTO type here
  quotation: QuotationDTO = {
    number: 'Q123',
    status: 'Active',
    reference: 'REF456',
    ticket: 'TICK789',
    notes: 'Some note goes here... Some note goes here..Some note goes here..Some note goes here..',
    currency: 'KES',
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
    const maxChars = 10;
    return notes.length > maxChars ? notes.slice(0, maxChars) + '...' : notes;
  }

  saveNotes() {
    console.log('Saved notes:', this.quotation.notes);
    // Close panel logic, etc.
  }

}
