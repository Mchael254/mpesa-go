import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { ProductsExcludedTaxes } from '../../../data/gisDTO';
import { TaxRatesService } from '../../../services/tax-rate/tax-rates.service';
import { TransactionTypesService } from '../../../services/transaction-types/transaction-types.service';
import { ProductsExcludedService } from '../../../services/products-excluded/products-excluded.service';
import { ProductsService } from '../../../services/products/products.service';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-tax-rates',
  templateUrl: './tax-rates.component.html',
  styleUrls: ['./tax-rates.component.css']
})
/**
 * This component handles the management of tax rates, transactions types, and tax excluded products.
 * It allows users to view, create, edit, and delete tax rates, manage associated transaction types, and handle tax excluded products. 
 */
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
  filteredTransaction:any;
  

  searchForm:FormGroup;
  selected:any;
   filterBy:any;

  productForm:FormGroup;
  ProductList:any; //todo: variable name 
  productListData:any;

   productsExcludedList:any;
  LoadProductExcludedTax: any;  
  assignedProductExcludedTaxes: any;
  selectedProductsExcluded:any;
  SelectedDeleteProduct:any;

  new:boolean=true;
  @ViewChild('dt1') dt1: Table | undefined;


  constructor(
    public fb:FormBuilder,
    public TaxService:TaxRatesService,
    public TransactionService:TransactionTypesService,
    public ProductExcludedService:ProductsExcludedService,
    public ProductsService:ProductsService,
    public cdr: ChangeDetectorRef,
    private messageService:MessageService
  ) { }
 /**
   * Initialize component by:
   * 1.Initialize the Tax Rate and Product form
   * 2. Load all  transaction types
   * 3.Load all products
   */
  ngOnInit(): void {
    this.createTaxRateForm();
    this.loadAllTransactions();
    this.createProductForm();
    this.loadAllproducts();
   
  }
  
/**
 * Loads all tax rates from the backend service and filters the result based on the provided code.
 * @param code The code used to filter tax rates based on a specific transaction type.
 */
  loadAllTaxRates(code: any){
     this.TaxService.getAllTaxRates().subscribe(data =>{
      this.taxRateList=data;
      this.selectedTaxRateDetails = this.taxRateList.filter(tax => tax.transactionTypeCode === code);
       console.log(this.selectedTaxRateDetails,"All Tax Rates");
      this.cdr.detectChanges();

    })
  }
   /**
   * Creates the  tax rate form 
   * Sets rate,dateWithEffectFrom,rangeFrom,rangeTo,transactionTypeCode,rateDescription,divisionFactor,rateType
   * applicationLevel,isMultiplierApplicable as required fields
   * It also initializes the search form group for user search queries
   */
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

    /**
   * Convenience getter for easy access to Tax rate form fields
   */
  get f() {
    return this.taxRateForm.controls;
  }

  /**
 * Loads tax rates based on the provided ID and 
 * updates the tax rate form with the retrieved data
 * @param id The ID used to fetch tax rates for a specific record.
 */
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
  /**
 * Handles the selection of a tax rate by updating the taxRateCode, loading Load all tax rates 
 * and excluded products related to the selected code.
 * @param code The code of the selected tax rate.
 * @param item The selected tax rate object.
 */
  selectedTaxRate(code:any,item: any){
    this.taxRateCode = code;
    // console.log(this.taxRateCode)
    this.loadAllTaxRates(this.taxRateCode)
    this.loadAllProductsExcluded(this.taxRateCode)
  }

  /**
 * Loads all transaction types from the backend service, filters them based on their
 * applicability to a subclass, and updates the component's transaction-related data.
 */
  loadAllTransactions() {
    this.TransactionService.getAllTransactionTypes().subscribe(data => {
      this.transactionList = data;
      // console.log(this.transactionList, "All Transaction Rates");
      this.filteredTransactionList = this.transactionList.filter((transaction: any) => {
        return transaction.isItApplicableToSubclass === "N";
      });
      this.filteredTransaction=this.filteredTransactionList;
      this.cdr.detectChanges();
    });
  }
  filterTransaction(event: any) {
    const searchValue = (event.target.value).toUpperCase();
    this.filteredTransaction = this.filteredTransactionList.filter((el) => el.description.includes(searchValue));
    this.cdr.detectChanges();
  }

  /**
 * Determines whether the provided item is currently selected, based on the comparison
 * with the 'selected' property of the component.
 */
  isActive(item:any){
    return this.selected ===item;
  }

 /**
 * Creates and initializes the product form using Angular's FormBuilder.
 * The product form is used to capture data related to products.
 */
  createProductForm(){
    this.productForm=this.fb.group({
      code:[''],
      description:['']
    });
  }

  /**
 * Loads all products from the backend service and updates the component's ProductList.
 * Triggers change detection to reflect the updated data in the view.
 */
  loadAllproducts(){
    this.ProductsService.getAllProducts().subscribe(data =>{
       this.ProductList = data;
      //  console.log(this.ProductList, "All Products");
       this.cdr.detectChanges()
     })
  }
  /**
 * Loads product data based on the provided code from the backend service, updates the
 * component's state, and patches the retrieved data to the taxRateForm for editing.
 * Sets 'new' flag to false and triggers change detection.
 * @param code The code of the product to be loaded.
 */
  loadProducts(code:any){
    return this.ProductsService.getProductByCode(code).subscribe(res =>{
      this.selected=res;
      // console.log(this.selected,"Test");
      this.taxRateForm.patchValue(this.selected);

      this.new=false;
      this.cdr.detectChanges()
    })
  }
  /**
 * Loads all products that are excluded based on the provided code from the backend service,
 * and Iterates through each assigned product excluded and match it with the product list.
 */

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

  /**
 * Handles the selection of an excluded product event by updating the selectedProductsExcluded
 * property with the provided event data.
 * @param event The event containing data about the selected excluded product.
 */
  selectedEvent(event: any){
    this.selectedProductsExcluded = event
    // console.log(this.selectedProductsExcluded)
  }

  /**
 * Creates a new product exclusion entry by calling the backend service with the provided
 * selected excluded product and tax rate code. Displays a success message upon success
 * or an error message if the operation fails.
 */
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
  /**
 * Marks a product for deletion by updating the SelectedDeleteProduct property with the provided code.
 * @param code The code of the product to be marked for deletion.
 */
  selectProductExcluded(code:any){
    this.SelectedDeleteProduct=code;
    }

    /**
 * Deletes a product exclusion entry by calling the backend service with the tax rate code and
 * the product code marked for deletion. Displays a success message upon successful deletion
 * or an error message if the operation fails.
 */
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

 /**
 * Adds new charge deductibles to the tax rate by creating a new entry in the backend service.
 * The transactionTypeCode is updated to match the current taxRateCode. Displays a success message
 * upon successful creation or an error message if the operation fails.
 */
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
/**
 * Initiates the testing process. If no tax rate code is selected, displays an error message
 * prompting the user to select a tax rate. Otherwise, triggers a click event on the
 * "openModalButton" element to open a modal or dialog for further testing.
 */
test(){
  if (!this.taxRateCode){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Tax Rate to continue'});
  }else{
  document.getElementById("openModalButton").click();
  }
 }

 /**
 * Updates existing charge deductibles in the tax rate by calling the backend service with the
 * updated data and the selected charge's identifier. Displays a success message upon successful
 * update or an error message if the operation fails.
 */
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
 testEdit(){
  if (!this.taxRateCode){
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'Select a Tax Rate to continue'});
  }else{
  document.getElementById("openModalButtonEdit").click();
  }
 }

 /**
 * Resets the tax rate form, effectively canceling any ongoing changes or edits.
 * This method restores the form fields to their initial or default values.
 */
 cancel(){
  this.taxRateForm.reset();
 }

 /**
 * Deletes the selected charge deductibles entry by calling the backend service with the
 * identifier of the selected charge. Displays a success message upon successful deletion
 * or an error message if the operation fails. Checks if a charge is selected before
 * proceeding with deletion.
 */
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

 /**
 * Applies a global filter to a DataTable by using the provided event value and filter key.
 * This method triggers the global filtering functionality and logs the applied filter.
 * @param $event The event containing the input value triggering the global filter.
 * @param stringVal The filter key to apply the global filter on the DataTable.
 */
 applyFilterGlobal($event, stringVal) {
  console.log(`calling global filter`, stringVal);
  this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}

}
