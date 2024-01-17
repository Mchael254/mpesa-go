import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { ClauseService } from 'src/app/features/gis/services/clause/clause.service';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup,FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { IntermediaryService } from 'src/app/features/entities/services/intermediary/intermediary.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
// import { Modal } from 'bootstrap';
import { introducersDTO } from '../../data/introducersDTO';
import { Logger } from 'src/app/shared/services/logger/logger.service';
import { AccountContact } from 'src/app/shared/data/account-contact';
import { ClientAccountContact } from 'src/app/shared/data/client-account-contact';
import { WebAdmin } from 'src/app/shared/data/web-admin';
import { ProductSubclassService } from '../../../setups/services/product-subclass/product-subclass.service';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

const log = new Logger('QuotationDetails');
@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent {
  @ViewChild(Table) private dataTable: Table;
  steps = quoteStepsData;
  branch:OrganizationBranchDto[];
  currency:CurrencyDTO[]
  clauses:any;
  products:any;
  user:any;
  formData: any;
  quotationForm:FormGroup;
  agents:any
  agentDetails:any
  quotationsList:any;
  quotation:any
  quotationNo:any;
  quotationCode:any;
  isChecked: boolean = false;
  show:boolean=true;
  showProduct:boolean=true;
  quotationNum:string;
  introducers:any;
  productSubclassList:any
  productDetails:any
  userDetails: AccountContact | ClientAccountContact | WebAdmin;
  selected:any;
  quotationSources:any
  @ViewChild('openModal') openModal;
  constructor(
    public bankService:BankService,
    public branchService:BranchService,
    public clauseService:ClauseService,
    public productService:ProductService,
    public producSetupService: ProductsService,
    public authService:AuthService,
    public sharedService:SharedQuotationsService,
    public fb:FormBuilder,
    private router: Router,
    public  agentService:IntermediaryService,
    public  quotationService:QuotationsService,
    public  productSubclass:ProductSubclassService,   
    private globalMessagingService: GlobalMessagingService,

  ){}

  ngOnInit(): void {
    this.getbranch();
    this.getCurrency();
    this.getProduct();
    this.getuser();
    // this.formData = this.sharedService.getFormData();
    this.createQuotationForm();
    this.getAgents()
    
    this.getIntroducers();
    this.getQuotationSources()
    
 
    const quotationFormDetails = sessionStorage.getItem('quotationFormDetails');
    const clientFormDetails = sessionStorage.getItem('clientFormData');
    log.debug(quotationFormDetails)
    if (quotationFormDetails) {
      const parsedData = JSON.parse(quotationFormDetails);
      this.quotationForm.patchValue(parsedData);
      
      log.debug(parsedData)
    }
    if(clientFormDetails){
      const clientData = JSON.parse(clientFormDetails)
      this.quotationForm.controls['clientCode'].setValue(clientData.id);
      this.quotationForm.controls['branchCode'].setValue(clientData.branchCode);
      this.quotationForm.controls['clientType'].setValue(clientData.clientTypeId);
    }
  
    log.debug(this.quotationForm.value)

  }

  /**
 * Retrieves branch data from the branch service and assigns it to the 'branch' property.
 */
  getbranch(){
    this.branchService.getBranches(2).subscribe(data=>{
      this.branch = data
    })
  }

/**
 * Retrieves currency data from the bank service and assigns it to the 'currency' property.
 */
  getCurrency(){  
    this.bankService.getCurrencies().subscribe(data=>{
      this.currency = data
    })
  }
  /**
 * Sets the 'currencyCode' control value in the quotation form based on the selected currency code.
 * Logs the current value of the quotation form.
 */
  getCurrencyCode(){
    this.quotationForm.controls['currencyCode'].setValue(this.quotationForm.value.currencyCode.id);
  console.log(this.quotationForm.value)
  }

/**
 * Retrieves all products from the product service, processes the data, and assigns it to the 'products' property.
 */

  getProduct(){
    this.productService.getAllProducts().subscribe(res=>{
      const ProdList = res
      this.products = ProdList
    })
  
  }
   /**
   * Retrieves the current user and stores it in the 'user' property.
   * @method getUser
   * @return {void}
   */
  getuser(){
   this.user = this.authService.getCurrentUserName()
   
  }
  getQuotationSources(){
    this.quotationService.getQuotationSources().subscribe(res=>{
      this.quotationSources = res
      log.debug(this.quotationSources)
    })
  }
 /**
   * Creates a new quotation form using Angular Reactive Forms.
   * @method createQuotationForm
   * @return {void}
   */
  createQuotationForm(){
    this.quotationForm = this.fb.group({
      actionType: [''],
      addEdit: [''],
      agentCode: [''],
      agentShortDescription: [''],
      bdivCode: [''],
      bindCode: [''],
      branchCode: [''],
      clientCode: [''],
      clientType: [''],
      coinLeaderCombined: [''],
      consCode: [''],
      currencyCode: [''],
      currencySymbol: [''],
      fequencyOfPayment: [''],
      isBinderPolicy: [''],
      paymentMode: [''],
      proInterfaceType: [''],
      productCode: [''],
      source: [''],
      withEffectiveFromDate: [''],
      withEffectiveToDate: [''],
      multiUser:[''],
      comments:[''],
      internalComments:[''],
      introducerCode:[''],
      dateRange:[''],
      RFQDate:[''],
      expiryDate:['']
    })
  }


  /**
 * Saves quotation details, sets form details, and navigates based on user preferences.
 * @method saveQuotationDetails
 * @return {void}
 */
  saveQuotationDetails(){
    
    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
   
    if(this.quotationForm.value.multiUser == 'Y'){
        /**
     * Creates a new quotation with multi-user and navigates to quote assigning.
     * @param {Object} this.quotationForm.value - The form value representing quotation details.
     * @param {string} this.user - The user associated with the quotation.
     * @return {Observable<any>} - An observable of the response containing created quotation data.
     */
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data;
    console.log(this.quotationNo,"Quotation results:")    
    this.router.navigate(['/home/gis/quotation/quote-assigning'])
    })
    
    }else{
    if (this.isChecked) {
        /**
       * Creates a new quotation with import risks and navigates to import risks page.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       */
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data
    console.log(this.quotationForm.value)
    sessionStorage.setItem('quotationNum',this.quotationNum );
    sessionStorage.setItem('quotationCode',this.quotationCode );
    sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
    this.router.navigate(['/home/gis/quotation/import-risks'])
    })
    
    } else {
       /**
       * Creates a new quotation and navigates to risk section details based on user preferences.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       */
    this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
    this.quotationNo = data;
    console.log(this.quotationNo,'quotation number output');
    this.quotationCode=this.quotationNo._embedded[0].quotationCode;
    this.quotationNum = this.quotationNo._embedded[0].quotationNumber
    sessionStorage.setItem('quotationNum',this.quotationNum );
    sessionStorage.setItem('quotationCode',this.quotationCode );
    sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));

    this.sharedService.setQuotationDetails(this.quotationNum,this.quotationCode);

    this.router.navigate(['/home/gis/quotation/risk-section-details']);
    })
    
    } 
  }  
}

 /**
   * Retrieves agents and populates the 'agents' property.
   * @method getAgents
   * @return {void}
   */
  getAgents(){
    this.quotationService.getAgents().subscribe(data=>{
      this.agents = data.content
     console.log(data)
    })
  }
   /**
   * Retrieves agent short description by ID and updates the corresponding form control.
   * @method agentShortDesc
   * @param {string} id - The ID of the agent for which to retrieve the short description.
   * @return {void}
   */ 
  agentShortDesc(id){
    this.agentService.getAgentById(id).subscribe(data=>{
      this.agentDetails = data
      this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);
     
    })
    
  }
  /**
   * Retrieves existing quotations based on form values and performs further actions.
   * @method getExistingQuotations
   * @return {void}
   */
  getExistingQuotations(){
    const clientId = this.quotationForm.value.clientCode
    const fromDate = this.quotationForm.value.withEffectiveFromDate
    const fromTo = this.quotationForm.value.withEffectiveToDate 
    
    // Set currency code in the form
    this.quotationForm.controls['currencyCode'].setValue(this.quotationForm.value.currencyCode.id);
    this.quotationService.getQuotations(clientId,fromDate,fromTo).subscribe(data=>{
      this.quotationsList = data
      this.quotation = this.quotationsList.content

      if(this.quotation.length > 0){
        this.openModal.nativeElement.click();

        // const element = document.getElementById('exampleModal') as HTMLElement;
        // const myModal = new Modal(element);
        // myModal.show();
      }else{
        this.saveQuotationDetails()
      }
     
    })

    
  }
    /**
   * Retrieves introducers and populates the 'introducers' property.
   * @method getIntroducers
   * @return {void}
   */
  getIntroducers(){
    this.quotationService.getIntroducers().subscribe(res=>{
      this.introducers = res
    })
  }

    /**
   * Edits a row by updating a clause based on details and code.
   * @method editRow
   * @param {any} details - The details for updating the clause.
   * @param {string} code - The code associated with the clause.
   * @return {void}
   */
  editRow(details,code){
    this.clauseService.updateClause(details,code).subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated' );
      },(error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
       
      }
    )
  }
    /**
   * Updates the cover to date in the quotation form based on the selected cover from date.
   * @method updateCoverToDate
   * @param {Event} e - The event containing the target value representing the cover from date.
   * @return {void}
   */
updateCoverToDate(e) {
    
    const coverFromDate= e.target.value
    console.log(this.quotationForm.value.productCode)
    if(this.quotationForm.value.productCode === '7275'){
      this.producSetupService.getCoverToDate(coverFromDate,this.quotationForm.value.productCode).subscribe(res=>{
        console.log(res)
      })
     
    }
    if (coverFromDate) {
      const selectedDate = new Date(coverFromDate);
      selectedDate.setFullYear(selectedDate.getFullYear() + 1);
      const coverToDate = selectedDate.toISOString().split('T')[0];
      this.quotationForm.controls['withEffectiveToDate'].setValue(coverToDate);

     
    } 
  }
  /**
   * Updates the quotation expiry date in the form based on the selected RFQ date.
   * @method updateQuotationExpiryDate
   * @param {Event} e - The event containing the target value representing the RFQ date.
   * @return {void}
   */
updateQuotationExpiryDate(e){
  const RFQDate = e.target.value
  if (RFQDate) {
    const selectedDate = new Date(RFQDate);
    selectedDate.setMonth(selectedDate.getMonth() + 3);
    const expiryDate = selectedDate.toISOString().split('T')[0];
    this.quotationForm.controls['expiryDate'].setValue(expiryDate);

    log.debug(expiryDate)
  } 
}
  /**
   * Retrieves product clauses based on the provided product code.
   * @method getProductClause
   * @param {Event} productCode - The event containing the target value representing the product code.
   * @return {void}
   */
getProductClause(productCode){
  
  this.quotationService.getProductClauses(productCode.target.value).subscribe(res=>{
    this.clauses= res
  
  })
}
}
