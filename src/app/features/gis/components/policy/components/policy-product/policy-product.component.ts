import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ClientService } from '../../../../../entities/services/client/client.service';
import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Products } from '../../../setups/data/gisDTO';

const log = new Logger("QuickQuoteFormComponent");

@Component({
  selector: 'app-policy-product',
  templateUrl: './policy-product.component.html',
  styleUrls: ['./policy-product.component.css']
})
export class PolicyProductComponent {
 
  clientData: ClientDTO[];
  clientDetails: ClientDTO;
  clientType: any;
  clientList: any;
  clientName: any;
  clientCode:any;

  
  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products[];
  selectedProductCode: any;

  policyProductForm: FormGroup;

  errorMessage: string;




  show:boolean=true;
  @ViewChild('dt1') dt1: Table | undefined;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;

  constructor(
    public fb: FormBuilder,
    private clientService: ClientService,
    public productService: ProductsService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,


  ){}

  ngOnInit(): void {
    this.loadAllClients();
    this.createPolicyProductForm();
    this.loadAllproducts();

  }
  ngOnDestroy(): void {}

  createPolicyProductForm(){
    this.policyProductForm = this.fb.group({
      action_type: [''],
      add_edit: [''],
      agent_code: [null],
      agent_short_description: [''],
      batch_number: [0],
      bdiv_code: [0],
      bind_code: [0],
      branch_code: [0, Validators.required],
      branch_short_description: [''],
      client_code: [0, Validators.required],
      client_type: [''],
      coin_leader_combined: [''],
      coinsurance_facultative_cession: [''],
      comments: [''],
      cons_code: [''],
      currency_code: [0],
      currency_symbol: [''],
      fequency_of_payment: [''],
      internal_comments: [''],
      introducer_code: [0],
      is_admin_fee_allowed: [''],
      is_binder_policy: [''],
      is_cashback_applicable: [''],
      is_coinsurance: [''],
      is_commission_allowed: [''],
      is_exchange_rate_fixed: [''],
      is_open_cover: [''],
      payment_mode: [''],
      pro_interface_type: ['', Validators.required],
      product_code: [0, Validators.required],
      source: [''],
      transaction_type: ['', Validators.required],
      with_effective_from_date: [''],
      with_effective_to_date: ['']
    });
  
  }
  loadAllClients() {
    this.clientService
      .getClients(0, 100)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          
          if (data) {
            this.clientList = data;
            log.debug("CLIENT DATA:", this.clientList)
            this.clientData = this.clientList.content
      log.debug("CLIENT DATA:", this.clientData)

          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
         
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
    }

   /**
   * - Get A specific client's details on select.
   * - populate the relevant fields with the client details.
   * - Retrieves and logs client type and country.
   * - Invokes 'getCountries()' to fetch countries data.
   * - Calls 'saveClient()' and closes the modal.
   * @method loadClientDetails
   * @param {number} id - ID of the client to load.
   * @return {void}
   */
   loadClientDetails(id) {
    log.info("Client Id:",id)
    this.clientService.getClientById(id).subscribe(data => {
      this.clientDetails = data;
      console.log("Selected Client Details:", this.clientDetails)
      // this.getCountries();
      this.saveclient()
      this.closebutton.nativeElement.click();
    })
  }
  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    sessionStorage.setItem('clientCode', this.clientCode);
  }
  /**
   * Applies a global filter to a DataTable.
   * - Retrieves the input value from the event target.
   * - Calls the DataTable's 'filterGlobal' method with the input value and a specified string value.
   * @method applyFilterGlobal
   * @param {Event} $event - The event triggering the filter application.
   * @param {string} stringVal - The specified string value for filtering.
   * @return {void}
   */
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  loadAllproducts() {
    const productDescription = [];
    const modifiedArray = [];

    this.productService
      .getAllProducts()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data) => {
          
          if (data) {
            this.productList = data;
            log.info(this.productList, "this is a product list")
            this.productList.forEach(product => {
              // Access each product inside the callback function
              let capitalizedDescription = product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase();
              productDescription.push({
                code: product.code,
                description: capitalizedDescription
              });
            });
      
            // Combine the characters back into words
            const combinedWords = productDescription.join(',');
            this.ProductDescriptionArray.push(...productDescription)
      
            // Now 'combinedWords' contains the result with words instead of individual characters
            log.info("modified product description", this.ProductDescriptionArray);
      
            this.cdr.detectChanges();

          } else {
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {
         
          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
    }
   /**
   * Handles the selection of a product.
   * - Retrieves the selected product code from the event.
   * - Fetches and loads product subclasses.
   * - Loads dynamic form fields based on the selected product.
   * @method onProductSelected
   * @param {any} event - The event triggered by product selection.
   * @return {void}
   */
   onProductSelected(selectedValue: any) {
    this.selectedProductCode = selectedValue.code;
    console.log("Selected Product Code:", this.selectedProductCode);
  }
}
