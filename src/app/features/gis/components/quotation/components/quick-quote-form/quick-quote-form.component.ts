import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';

const log = new Logger("QuickQuoteFormComponent");

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css']
})
export class QuickQuoteFormComponent {

  productList:any
  selectedProduct:any

  binderList:any;
  binderListDetails:any;
  selectedBinderList:any;
  constructor(
    public fb:FormBuilder,
    public productService:ProductsService,
    public binderService:BinderService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,

  ) { }

  ngOnInit(): void {
  this.loadAllproducts();
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
  const selectedProductCode = event.target.value;
  console.log("Selected Product Code:", selectedProductCode); 

  this.loadAllBinders(selectedProductCode);
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

}
