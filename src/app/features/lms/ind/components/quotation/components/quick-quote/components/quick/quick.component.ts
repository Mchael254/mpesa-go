import { Component, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import stepData from '../../data/steps.json';
import prods from '../../data/quick.json';
import options from '../../data/options.json';
import covers from '../../data/covers.json';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-quick',
  templateUrl: './quick.component.html',
  styleUrls: ['./quick.component.css']
})
export class QuickComponent {


  quickForm: FormGroup;
  shareForm: FormGroup;
  productList: any[] = prods;
  productOptionList: any[];
  productTermList: any[];
  coverTypeList = signal([]);
  coverTypeListSelected = signal([]);
  steps = stepData
  shareInputType: string = '';

  constructor(private fb: FormBuilder, private spinner:NgxSpinnerService) {
    this.quickForm = this.fb.group({
        date_of_birth: [''],
        gender: ['M'],
        product: [0],
        option: [0],
        term: [''],
        sa_prem_select: ['P'],
        sa_prem_amount: [''],

    });

    this.shareForm = this.fb.group({
      name:['']
    })
  }

  selectProduct(event){
    this.spinner.show();
    console.log(event.target.value);
    // this.getCoverTypeFormArray.clear();
    this.coverTypeList.set([])
    this.coverTypeListSelected.set([]);
    let productCode = +event.target.value
    this.productOptionList = options.filter(data  => {
      return data['product_code'] === productCode});
      this.productOptionList = [{code: 0, product_code: 0,description: 'SELECT PRODUCT OPTION'}, ...this.productOptionList]

    // this.api.GET(`products/web/${productCode}/webProduct`).subscribe(productOptions =>{
    //   console.log(productOptions);

    //   this.productOptionList = productOptions})
    this.spinner.hide();
  }
  selectOption(pCode:any){
    console.log(pCode.target.value);

    this.spinner.show();
    // this.getCoverTypeFormArray.clear();
    this.coverTypeList.set([])
    this.coverTypeListSelected.set([]);

    let pCodeItem = +pCode.target.value
    this.coverTypeList.set(covers.filter(cover => {return cover['p_code'] === pCodeItem}));

    if(this.coverTypeList().length > 0){
      // this.coverTypeList().forEach(i => {return this.addCoverType(i['description'])});
      // this.coverTypeListSelected =
      this.coverTypeListSelected.set(this.coverTypeList().filter(i => {return i['selected']===true}));
    }
    this.spinner.hide();
  }


  selectShareType(value: string) {
    this.shareInputType = value === 'email' ? 'email' : 'phone';
    }


    closeModal() {
      // Close the Bootstrap modal programmatically
      const modal = document.getElementById('QuoteShareModal');
      if (modal) {
        modal.classList.remove('show'); // Remove the 'show' class to hide the modal
        modal.setAttribute('aria-hidden', 'true');
      }
    }
}
