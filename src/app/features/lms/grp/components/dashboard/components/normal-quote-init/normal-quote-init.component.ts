import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger("NormalQuoteInitComponent");
!AutoUnsubscribe
@Component({
  selector: 'app-normal-quote-init',
  templateUrl: './normal-quote-init.component.html',
  styleUrls: ['./normal-quote-init.component.css']
})
export class NormalQuoteInitComponent implements OnInit, OnDestroy {
  normalQuoteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.quoteForm();
  }

  ngOnDestroy(): void {

  }


  quoteForm() {
    this.normalQuoteForm = this.fb.group({
      product: [""],
      durationType: [""],
      facultativeType: [""],
      quotationCovers: [""],
      freqOfPayment: [""],
      unitRateOption: [""],
      currency: [""],
      effectiveDate: [""],
    });
  }

  submitnormalQuoteFormData() {
    log.info("quickFormData", this.normalQuoteForm.value)
    this.router.navigate(['/home/lms/grp/dashboard/cover-details']);
  }
}
