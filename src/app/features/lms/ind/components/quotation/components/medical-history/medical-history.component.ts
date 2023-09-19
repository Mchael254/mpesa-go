import { Component } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';


@Component({
  selector: 'app-medical-history',
  templateUrl: './medical-history.component.html',
  styleUrls: ['./medical-history.component.css']
})
export class MedicalHistoryComponent {

  steps = stepData
  personalDetailFormfields: any[];
  buttonConfig: any;
  searchForm: FormGroup;
  escalationForm: FormGroup;
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
      label: 'Medical History(Data Entry)',
      url: '/home/lms/ind/quotation/medical-history'
    },
  ];


  medicalHistoryForm: FormGroup;
  clonedProducts: any;
  products: any;
  constructor(private fb: FormBuilder){
    this.medicalHistoryForm = this.fb.group({
      question1: ['N'],
      question2: ['N'],
      question3: ['N'],
      question4: ['N'],
    });
  }

  getValue(name: string = 'question1') {
    return this.medicalHistoryForm.get(name).value;
  }

  onRowEditInit(product: any) {
    this.clonedProducts[product.id as string] = { ...product };
}

onRowEditSave(product: any) {
    if (product.price > 0) {
        delete this.clonedProducts[product.id as string];
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
    } else {
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
    }
}

onRowEditCancel(product: any, index: number) {
    this.products[index] = this.clonedProducts[product.id as string];
    delete this.clonedProducts[product.id as string];
}

}
