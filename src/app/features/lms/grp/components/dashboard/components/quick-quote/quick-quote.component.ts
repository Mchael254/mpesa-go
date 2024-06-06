import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoverType } from 'src/app/features/gis/components/setups/data/gisDTO';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger("QuickQuoteComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-quick-quote',
  templateUrl: './quick-quote.component.html',
  styleUrls: ['./quick-quote.component.css']
})
export class QuickQuoteComponent implements OnInit, OnDestroy {
  quickQuoteForm: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.quickForm();
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Quick quote', url: '/home/lms/grp/dashboard/quick-quote' },
    ];
  }

  quickForm() {
    this.quickQuoteForm = this.fb.group({
      product: [""],
      coverType: [""],
      coverageType: [""],
      multipleOfEarnings: [""],
      NoOfMembers: [""],
      averageAge: [""],
      annualEarnings: [""],
      coverFrom: [""],
      coverTo: [""],
    });
  }

  submitQuickFormData() {
    log.info("quickFormData", this.quickQuoteForm.value)
  }

}
