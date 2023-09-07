import { Component } from '@angular/core';
import stepData from '../../data/steps.json';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.css']
})
export class QuotationSummaryComponent {

  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quick Quote',
      url: '/home/administration/ticket/details'
    },
    {
      label: 'Quotation Summary',
      url: '/home/lms/ind/quotation/quick-quote/quotation-details'
    },
  ];
  steps = stepData
  emailForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder){
    this.emailForm = this.fb.group({
      email_type:['']
    })
  }

  get emailTypeControl() {
    return this.emailForm.get('email_type') as FormControl;
  }


}
