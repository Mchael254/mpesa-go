import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import stepData from '../../data/steps.json';
import prods from '../../data/quick.json';
import options from '../../data/options.json';
import covers from '../../data/covers.json';

import { QuotationFormSetUp } from '../../config/quotations.forms';
import { Location } from '@angular/common';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit, OnDestroy{

  items = [
    { label: 'Cover Type Select One', checked: false },
    { label: 'Cover Type Select Two', checked: false },
    { label: 'Cover Type Select Three', checked: false }
  ];

  isSumAssuredOrPremium = [
    { label: 'SUM ASSURED', value: 'SA' },
    { label: 'PREMIUM', value: 'P' }
  ];


  showCSS: boolean;
  productList: any[] = prods;
  productOptionList: any[];
  coverTypeList = signal([]);
  coverTypeListSelected = signal([]);


  steps = stepData
  quotationDetailForm: FormGroup;
  coverTypeFormArray: FormArray;
  quotationDetailsFormfields: any[];
  buttonConfig: any;
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
      label: 'Quotation Details',
      url: '/home/lms/ind/quotation/quotation-details'
    },
  ];

  constructor(private quoteFormSetup: QuotationFormSetUp, private location: Location, private fb: FormBuilder, private router: Router, private api: ApiService, private spinner: NgxSpinnerService
    ){
    this.quotationDetailsFormfields =  quoteFormSetup.quotationDetailsForms();
    this.buttonConfig = quoteFormSetup.quotationDetailsActionButtonConfig();
    this.quotationDetailForm = this.createQuotationDetailForm();
    this.coverTypeFormArray = this.fb.array([]);
  }

  ngOnInit(): void {
    this.getAllProducts();
    }


  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  toggleShowCSS(){
    this.showCSS = !this.showCSS;
  }


  createQuotationDetailForm(): FormGroup {
    return this.fb.group({
      product: ['', [Validators.required]],
      option: ['', [Validators.required]],
      term: ['', [Validators.required]],
      freq_pay: ['', [Validators.required]],
      cover_type: this.fb.array([]),
      sum_assured: [''],

    })
  }

  onSubmitQuotationDetailForm(){
    this.router.navigate(['/home/lms/ind/quotation/summary']);
  }

  toPersonalDetailsForm(){
    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  getAllProducts(){
    // this.api.GET('v2/products/all/webProdMappings/').subscribe(products =>{
    //   console.log(products);

    //   this.productList = products})
  }

  selectProduct(event){
    this.spinner.show();
    this.getCoverTypeFormArray.clear();
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
    this.spinner.show();
    this.getCoverTypeFormArray.clear();
    this.coverTypeList.set([])
    this.coverTypeListSelected.set([]);


    let pCodeItem = +pCode.target.value
    this.coverTypeList.set(covers.filter(cover => {return cover['p_code'] === pCodeItem}));

    if(this.coverTypeList().length > 0){
      this.coverTypeList().forEach(i => {return this.addCoverType(i['description'])});
      // this.coverTypeListSelected =
      this.coverTypeListSelected.set(this.coverTypeList().filter(i => {return i['selected']===true}));
    }

    this.spinner.hide();


  }
  selectTerm(term:any){}
  selectCoverType(ct:any){}
  selectSumAssured(sA:any){}

  goBack(){
    this.location.back();
    console.log("HELLOO");

  }


  updateCheckboxValue(control, index) {
    this.spinner.show();
    let checkedValue = this.coverTypeList()[index];
    // checkedValue = {description: checkedValue['description'], selected: checkedValue['selected'] }
    checkedValue['selected'] = !checkedValue['selected']

    control.patchValue (checkedValue['selected']); // Toggle the 'selected' property
    this.coverTypeList()[index] = checkedValue

    // this.coverTypeListSelected =
    this.coverTypeListSelected.set(this.coverTypeList().filter(i => {return i['selected']===true}));
    // this.coverTypeList.filter(i => {return i['selected']===true});
    console.log(this.coverTypeListSelected());
    this.spinner.hide();


  }



   // Getter to access the cover_type FormArray
   get getCoverTypeFormArray() {
    return this.quotationDetailForm.get('cover_type') as FormArray;
  }
  createCoverTypeFormGroup(description: string): FormControl {
    return this.fb.control(false);
  }

  // Function to add a cover type to the FormArray
  addCoverType(description) {
    const newCoverTypes = this.createCoverTypeFormGroup(description); // Create a new FormControl with an initial value
    return this.getCoverTypeFormArray.push(newCoverTypes);
  }

  // Function to remove a cover type from the FormArray
  removeCoverType(index: number) {
    this.getCoverTypeFormArray.removeAt(index);
  }



  ngOnDestroy(): void {
  }
}
