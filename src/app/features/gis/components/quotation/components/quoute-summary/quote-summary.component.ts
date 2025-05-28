import {Component, OnDestroy, OnInit} from '@angular/core';
import {QuotationDTO} from '../../data/quotationsDTO';

import {QuotationsService} from "../../services/quotations/quotations.service";
import {Logger, untilDestroyed} from "../../../../../../shared/shared.module";

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-quoute-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy {
  constructor(
    private quotationService: QuotationsService
  ) {

  }

  steps = [
    {label: 'Quote Information'},
    {label: 'Quotation Summary'}
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
  }

  ngOnInit(): void {
    this.quotationService.getQuotationDetails(sessionStorage.getItem("quotationNumber"))
      .pipe(untilDestroyed(this)).subscribe((response) => {
      log.debug("Quotation details>>>", response)
    })
  }

  ngOnDestroy(): void {
  }

}
