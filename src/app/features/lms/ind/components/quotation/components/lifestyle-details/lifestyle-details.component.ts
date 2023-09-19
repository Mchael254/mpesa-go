import { Component } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';


@Component({
  selector: 'app-lifestyle-details',
  templateUrl: './lifestyle-details.component.html',
  styleUrls: ['./lifestyle-details.component.css']
})
export class LifestyleDetailsComponent {
  steps = stepData
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
      label: 'Lifestyle details(Data Entry)',
      url: '/home/lms/ind/quotation/lifestyle-details'
    },
  ];

  insuranceHistoryForm: FormGroup;
  constructor(private fb: FormBuilder){
    this.insuranceHistoryForm = this.fb.group({
      question1: ['N'],
      question2: ['N'],
      question3: ['N'],
      question4: ['N'],
    });
  }

  getValue(name: string = 'sa_prem_select') {
    return this.insuranceHistoryForm.get(name).value;
  }

}
