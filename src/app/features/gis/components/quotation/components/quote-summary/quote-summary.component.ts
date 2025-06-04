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

  quotation:   {
    number: '',
    reference: '',
    status: '',
    ticket: '',
    notes: '',
    currency: '',
    products: [],
    quotationNo: '',
    comments: '',
    quotationProducts: [],
    premium: 0
  };
  

  getTotalPremium(): any {
   // return this.quotation?.products?.reduce((sum, p) => sum + p.premium, 0) || 0;
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
      .pipe(untilDestroyed(this)).subscribe((response: QuotationDTO) => {
       // this.quotation = response;
      log.debug("Quotation details>>>", response)
    })
  }

  ngOnDestroy(): void {
  }

}
