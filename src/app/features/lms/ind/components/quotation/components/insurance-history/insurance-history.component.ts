import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import stepData from '../../data/steps.json';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-insurance-history',
  templateUrl: './insurance-history.component.html',
  styleUrls: ['./insurance-history.component.css']
})
export class InsuranceHistoryComponent {
  steps = stepData
  products = []
  insuranceHistoryForm: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list'
    },
    {
      label: 'Insurance History(Data Entry)',
      url: '/home/lms/ind/quotation/insurance-history'
    },
  ];

  constructor(private fb: FormBuilder){
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      question2: ['N'],
    });
  }

  getValue(name: string = 'question1') {
    return this.insuranceHistoryForm.get(name).value;
  }



  onRowEditInit(event){}
  onRowEditSave(event){}
  onRowEditCancel(event, ev){}

}
