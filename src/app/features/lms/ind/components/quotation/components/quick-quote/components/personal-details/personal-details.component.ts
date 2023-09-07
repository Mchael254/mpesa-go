import { Component } from '@angular/core';
import stepData from '../../data/steps.json';
import { Location } from '@angular/common';
import { QuotationFormSetUp } from '../../config/quotations.forms';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.css']
})
export class PersonalDetailsComponent {
  steps = stepData
  personalDetailFormfields: any[];
  buttonConfig: any;
  searchForm: FormGroup;
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
      label: 'Personal Details',
      url: '/home/lms/ind/quotation/quick-quote/personal-details'
    },
  ];

  isTableOpen: boolean = false;
  tableData: any[] = [
    { field1: '1', field2: 'Value A' },
    { field1: '2', field2: 'Value B' },
    { field1: '3', field2: 'Value C' },
  ];

  openTable() {
    this.isTableOpen = true;
  }

  closeTable() {
    this.isTableOpen = false;
  }

  onInputChange(event) {
    // Simulate data retrieval based on user input (value)
    // Replace this with actual data retrieval logic
    let value = event.target.value;
    console.log(value);

      this.tableData = this.tableData.filter(data =>{return data['field1']===value || data['field2']===value})

  }
  constructor(private location:Location, private quoteFormSetup: QuotationFormSetUp, private router: Router, private fb:FormBuilder){
    this.personalDetailFormfields = quoteFormSetup.personalDetailForms();
    this.buttonConfig = quoteFormSetup.actionButtonConfig();
    this.searchForm = this.fb.group({
      client: ['N'],
    });
  }

  get clientControl(){
    return this.searchForm.get('client') as FormControl;
  }


  saveButton(value){

    value['webClntType'] ='I'
    value['webClntIdRegDoc'] ='I'
    console.log(value);
    this.router.navigate(['/home/lms/ind/quotation/quick-quote/quotation-details']);
  }
  goBack(){
    this.location.back()
  }

}
