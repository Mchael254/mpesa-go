import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { ProductsExcludedTaxes } from '../../../data/gisDTO';
import { TaxRatesService } from '../../../services/tax-rate/tax-rates.service';
import { TransactionTypesService } from '../../../services/transaction-types/transaction-types.service';
import { ProductsExcludedService } from '../../../services/products-excluded/products-excluded.service';
import { ProductsService } from '../../../services/products/products.service';
@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.css']
})
export class TaxRatesComponent {
  taxBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'GIS',
      url: '/home/dashboard',
    },
    {
      label: 'Taxes Setups',
      url: '/home/gis/setup/tax/tax-rate'
    },
    {
      label: 'Taxe Rate (Not Based On Sub Class)',
      url: '/home/gis/setup/tax/tax-rate'
    }
  ];

  taxRateList:any;
  taxRateData:any;
  taxRateDetails:any;
  taxRateForm:FormGroup;
  editTaxRateForm:FormGroup;
  taxRateCode: any;
  selectedTaxRateDetails: any;
  SelectedChargesDeductible:any;
  
  transactionList:any;
  transactionData:any;
  transactionTypeDetails:any;
  transactionForm:FormGroup;
  editTransactionForm:FormGroup;
  filteredTransactionList: any;
  

  searchForm:FormGroup;
  selected:any;
   filterBy:any;

  productForm:FormGroup;
  ProductList:any;
  productListData:any;

   productsExcludedList:any;
  LoadProductExcludedTax: any;  
  assignedProductExcludedTaxes: any;
  selectedProductsExcluded:any;
  SelectedDeleteProduct:any;

  new:boolean=true;


  constructor(
    public fb:FormBuilder,
    public TaxService:TaxRatesService,
    public TransactionService:TransactionTypesService,
    public ProductExcludedService:ProductsExcludedService,
    public ProductsService:ProductsService,
    public cdr: ChangeDetectorRef,
    private messageService:MessageService
  ) { }

  ngOnInit(): void {
    this.createTaxRateForm();
    // this.createTransactionForm();
    this.loadAllTransactions();
    // this.loadAllTaxRates();
    this.createProductForm();
    this.loadAllproducts();
   
  }
  

  loadAllTaxRates(code: any){
     this.TaxService.getAllTaxRates().subscribe(data =>{
      this.taxRateList=data;
      this.selectedTaxRateDetails = this.taxRateList.filter(tax => tax.transactionTypeCode === code);
       console.log(this.selectedTaxRateDetails,"All Tax Rates");
      this.cdr.detectChanges();

    })
  }
  createTaxRateForm(){
    this.taxRateForm=this.fb.group({
      amount: null,
      rate:['', Validators.required],
      dateWithEffectFrom:['', Validators.required],
      dateWithEffectTo: [''],
      subClassCode: null,
      rangeFrom:['', Validators.required],
      rangeTo: ['', Validators.required],
      calMode:['R'],
      minimumAmount: [''],
      roundNext: ['2'],
      transactionTypeCode: ['', Validators.required],
      transactionLevelCode: [''],
      rateCategory:[''],
      rateDescription:['', Validators.required],
      divisionFactor: [1, Validators.required],
      rateType: ['', Validators.required],
      applicationArea: [''],
      applicationLevel: ['', Validators.required],
      taxType: ['EX'],
      isMultiplierApplicable: ['N', Validators.required],
      organizationCode: ['2', { nonNullable: true }]
    });

    this.searchForm=this.fb.group({
      search:['']
    })
  }
  get f() {
    return this.taxRateForm.controls;
  }
  loadTaxesRates(id:any){
    return this.TaxService. getTaxRates(id).subscribe(res =>{
      this.selected = res;
      // console.log(this.selected,"Tax Rates By Code")
      this.taxRateForm.patchValue(this.selected);
      this.SelectedChargesDeductible=id;
      this.new =false;
      this.cdr.detectChanges();
    })
  }
  
  selectedTaxRate(code:any,item: any){
    this.taxRateCode = code;
    // console.log(this.taxRateCode)
    this.loadAllTaxRates(this.taxRateCode)
    this.loadAllProductsExcluded(this.taxRateCode)
  }
  loadAllTransactions() {
    this.TransactionService.getAllTransactionTypes().subscribe(data => {
      this.transactionList = data;
      // console.log(this.transactionList, "All Transaction Rates");
      this.filteredTransactionList = this.transactionList.filter((transaction: any) => {
        return transaction.isItApplicableToSubclass === "N";
      });
      this.cdr.detectChanges();
    });
  }

  // createTransactionForm(){
  //   this.transactionForm=this.fb.group({
  //     code:['', Validators.required],
  //     description: [''],
  //     generalLegerCode: [''],
  //     type: ['',, Validators.required],
  //     applicationLevel:['', Validators.required],
  //     isItApplicableToSubclass: [''],
  //     isMandatory: [''],
  //     contraGeneralLegerCode:[''],
  //     accountType: [''],
  //     appliesToNewBusiness: [''],
  //     appliesToShortPeriod: [''],
  //     appliesToRenewal: [''],
  //     appliesToEndorsement: [''],
  //     appliesToCancellation: [''],
  //     appliesToExtension: [''],
  //     appliesToDeclaration: [''],
  //     appliesToReinstatement: [''],
  //     organizationCode: ['2', { nonNullable: true }]
  //   })
  // }
  isActive(item:any){
    return this.selected ===item;
  }

  // loadTransactionTypes(id:any){
  //   return this.TaxService.getTransactionType(id).subscribe(res =>{
  //     this.selected=res;
  //     console.log(this.selected,"Transaction Types By Code")
  //     // this.transactionForm.patchValue(this.selected);
  //   })
  // }

  
  createProductForm(){
    this.productForm=this.fb.group({
      code:[''],
      description:['']
    });
  }
  loadAllproducts(){
    this.ProductsService.getAllProducts().subscribe(data =>{
       this.ProductList = data;
      //  console.log(this.ProductList, "All Products");
       this.cdr.detectChanges()
     })
  }
  loadProducts(code:any){
    return this.ProductsService.getProductByCode(code).subscribe(res =>{
      this.selected=res;
      // console.log(this.selected,"Test");
      this.taxRateForm.patchValue(this.selected);

      this.new=false;
      this.cdr.detectChanges()
    })
  }
  
  loadAllProductsExcluded(code:any){
    this.ProductExcludedService.getAllProductsExcluded(code).subscribe(data=>{
    this.productsExcludedList=data;
    // console.log(this.productsExcludedList,"product excluded taxes")
    let allProductsExcludedList = [];
    this.productsExcludedList.forEach(assignedProductExcluded =>{
      this.ProductList.forEach(prodList =>{
        if(assignedProductExcluded.productCode === prodList.code){
          allProductsExcludedList.push(prodList)
        }
      })
    })
    this.assignedProductExcludedTaxes = allProductsExcludedList;
    // console.log(this.assignedProductExcludedTaxes,"product excluded taxes List")
    })
  }
  selectedEvent(event: any){
    this.selectedProductsExcluded = event
    // console.log(this.selectedProductsExcluded)
  }
  createProductExcludedTax(){
    const productExcludedTax: ProductsExcludedTaxes = {
      productCode: this.selectedProductsExcluded,
      transactionTypeCode: this.taxRateCode
    }
      this.ProductExcludedService.createProductsExcluded(productExcludedTax).subscribe(data=>{
        const res = data;
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      },(error:HttpErrorResponse)=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      }
      )
      
  }
  selectProductExcluded(code:any){
    this.SelectedDeleteProduct=code;
    }
 deleteProductExcludedTax(){
  console.log(this.SelectedDeleteProduct)
    this.ProductExcludedService.deleteProductExcluded(this.taxRateCode,this.SelectedDeleteProduct).subscribe(
      (res)=>{
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Product Deleted Succesfully'});
    },
    (error:HttpErrorResponse)=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
    }
    )
 }
 AddChargeDeductibles(){
  const charges = this.taxRateForm.value
  charges.transactionTypeCode = this.taxRateCode
  this.TaxService.createTaxRate(charges).subscribe((data:{})=>{
    try{
      console.log(this.taxRateForm.value)
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      this.taxRateForm.reset()
    }catch(error){
      console.log(this.taxRateForm.value)
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      this.taxRateForm.reset()

    }
    });
 }

test(){
  if (!this.taxRateCode){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Tax Rate to continue'});
  }else{
  document.getElementById("openModalButton").click();
  }
 }

 UpdateChargesDeductibles(){
  let id=this.SelectedChargesDeductible
  this.TaxService.updateTaxRate(this.taxRateForm.value,id).subscribe((data)=>{
    try{
      this.taxRateForm.reset();
      console.log(this.taxRateForm.value)
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      this.taxRateForm.reset()
    }catch(error){
      console.log(this.taxRateForm.value)
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      this.taxRateForm.reset()
    } 
  })
 }
 cancel(){
  this.taxRateForm.reset();
 }
 deleteChargesDeductibles(){
  let id=this.SelectedChargesDeductible
  if(!id){
    this.messageService.add({severity:'error', summary: 'Error', detail: 'Select a Charge to continue'});
  }else{
  this.TaxService.deleteTaxRate(id).subscribe((data)=>{
    try{
      this.taxRateForm.reset();
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Deleted Succesfully'});
    }catch(error){
      console.log(this.taxRateForm.value)
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});

    }
  })
}
 }
}
