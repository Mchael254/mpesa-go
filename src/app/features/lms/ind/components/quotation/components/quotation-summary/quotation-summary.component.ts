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

  contactDetailsForm: FormGroup;
  postalAddressForm: FormGroup;
  residentialAddressForm: FormGroup;

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
      url: '/home/lms/ind/quotation/quotation-details'
    },
  ];
  steps = stepData
  // emailForm1: FormGroup;
  shareInputType: string;

  // constructor(private fb: FormBuilder){
  //   this.emailForm1 = this.fb.group({
  //     email_type:['']
  //   })
  // }

  // get emailTypeControl() {
  //   return this.emailForm1.get('email_type') as FormControl;
  // }

  constructor(private fb: FormBuilder){

    this.contactDetailsForm = this.fb.group({
      branch: [''],
      number: [''],
      title: [''],
      telephone: [''],
      email: [''],
      p_contact_channel: [''],
      edocs: [''],
    });


    this.postalAddressForm = this.fb.group({
      po_box: [''],
      country: [''],
      county: [''],
      town: [''],
      p_address: [''],
    });

    this.residentialAddressForm = this.fb.group({
      town: [''],
      road: [''],
      house_no: [''],
      u_bill: [''],
      u_u_bill: [''],
    });
  }

  selectShareType(value: string) {
    this.shareInputType = value === 'email' ? 'email' : 'phone';
  }





}
