import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
const log = new Logger("QuickQuoteFormComponent");

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css']
})
export class QuickQuoteFormComponent {

  productList:any
  selectedProduct:any
  selectedProductCode: any;

  binderList:any;
  binderListDetails:any;
  selectedBinderList:any;

  sourceList:any;
  sourceDetail:any;

  formContent:any;
  formData:any;
  dynamicForm:FormGroup;

  currencyList:any;
  constructor(
    public fb:FormBuilder,
    public productService:ProductsService,
    public binderService:BinderService,
    public quotationService:QuotationsService,
    public currencyService:CurrencyService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,

  ) { }

  ngOnInit(): void {
  this.loadAllproducts();
  this.loadAllQoutationSources();
  this.loadAllCurrencies();
  this.LoadAllFormFields(this.selectedProductCode);
  this.dynamicForm = this.fb.group({});
  }
 /**
 * Loads all products from the backend service and updates the component's ProductList.
 * Triggers change detection to reflect the updated data in the view.
 */
 loadAllproducts(){
  this.productService.getAllProducts().subscribe(data =>{
     this.productList = data;
     log.info(this.productList,"this is a product list")

     this.cdr.detectChanges()

   })
}
onProductSelected(event: any) {
  this.selectedProductCode = event.target.value;
  // const selectedProductCode = event.target.value;
  console.log("Selected Product Code:", this.selectedProductCode); 

  this.loadAllBinders(this.selectedProductCode);

    // Load the dynamic form fields based on the selected product
    this.LoadAllFormFields(this.selectedProductCode);
}


loadAllBinders(productCode: string) {
  this.binderService.getAllBinders().subscribe(data => {
      this.binderList = data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      console.log("All Binders Details:", this.binderListDetails); // Debugging

      this.selectedBinderList = this.binderListDetails.filter(binder => {
        // Check if the product_short_description matches the selected code or if it's null
        return binder.product_short_description === productCode || !binder.product_short_description;
    });      
    console.log("Selected Binders:", this.selectedBinderList); // Debugging

      this.cdr.detectChanges();
  });
}
loadAllQoutationSources(){
  this.quotationService.getAllQuotationSources().subscribe(data =>{
    this.sourceList=data;
    this.sourceDetail=data.content;
    console.log(this.sourceDetail, "Source list")
  })
}
loadAllCurrencies(){
  this.currencyService.getAllCurrencies().subscribe(data =>{
    this.currencyList =data;
    log.info(this.currencyList,"this is a currency list")

    this.cdr.detectChanges()

  })
}
// LoadAllFormFields(){
//   this.quotationService.getFormFields().subscribe(data =>{
//     this.formContent=data;
//     // this.formData=this.formContent.fields;
//     log.info(this.formContent,"this is Form field content")

//   })
// }
LoadAllFormFields(selectedProductCode: Number) {
  const formFieldDescription="product-quick-quote-".concat(selectedProductCode.toString());
  this.quotationService.getFormFields(formFieldDescription).subscribe(data => {
    this.formContent = data; 
    console.log(this.formContent, "Form-content"); // Debugging: Check the received data
    this.formData = this.formContent.fields;
    console.log(this.formData, "formData is defined here");

     // Clear existing form controls
     this.removeFormControls();

     // Add new form controls for each product-specific field
     this.formData.forEach((field) => {
         this.dynamicForm.addControl(field.name, new FormControl(''));
     });
  });
}


// loadDynamicFormFields(selectedProductCode: string) {
//   console.log('Form Data:', this.formData);

//   // Check if formData exists
//   if (this.formData) {
//       // Filter the fields based on the selected product
//       const formFieldDescription="product-quick-quote-".concat(selectedProductCode.toString());
//       const productFields = this.formData.filter((field) => {
//           return field.shortDescription === selectedProductCode;
//       });

//       // Log the filtered fields for debugging
//       console.log('Filtered Fields:', productFields);

//       // Clear existing form controls
//       this.removeFormControls();

//       // Add new form controls for each product-specific field
//       productFields.forEach((field) => {
//           this.dynamicForm.addControl(field.name, new FormControl(''));
//       });
//   }
// }

// loadDynamicFormFields(selectedProductCode: string) {
//   console.log('Fields:', this.formContent.fields);
//   console.log('formContent:', this.formContent);

//   // Check if formContent and fields exist
//   if (this.formContent && this.formContent.fields) {
//       // Filter the fields based on the selected product
//       const productFields = this.formContent.fields.filter((field) => {
//           return field.name === selectedProductCode;
//       });

//       // Log the filtered fields for debugging
//       console.log('Filtered Fields:', productFields);
      

//       // Clear existing form controls
//       this.removeFormControls();

//       // Add new form controls for each product-specific field
//       productFields.forEach((field) => {
//           this.dynamicForm.addControl(field.name, new FormControl(''));
//       });
//   }
// }


// Helper method to remove all form controls from the FormGroup
removeFormControls() {
  const formControls = Object.keys(this.dynamicForm.controls);
  formControls.forEach((controlName) => {
      this.dynamicForm.removeControl(controlName);
  });
}
}
