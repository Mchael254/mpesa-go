import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../services/quotations/quotations.service';
// import { Modal } from 'bootstrap';
import { introducersDTO } from '../../data/introducersDTO';
import { ProductSubclassService } from '../../../setups/services/product-subclass/product-subclass.service';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';

import {NgxSpinnerService} from 'ngx-spinner';
import {OrganizationBranchDto} from "../../../../../../shared/data/common/organization-branch-dto";
import {CurrencyDTO} from "../../../../../../shared/data/common/currency-dto";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {ClauseService} from "../../../../services/clause/clause.service";
import {ProductService} from "../../../../services/product/product.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {IntermediaryService} from "../../../../../entities/services/intermediary/intermediary.service";
import {Logger} from "../../../../../../shared/services";
import {AccountContact} from "../../../../../../shared/data/account-contact";
import { ClientAccountContact } from 'src/app/shared/data/client-account-contact';
import { WebAdmin } from 'src/app/shared/data/web-admin';
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
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
  midnightexpiry:any
  modalHeight: number = 200;
  quickQuotationDetails:any
  quickQuotationCode:any;
  quickQuotationNum:any
  selectedClause!:any;
  selectedAgent!:any
  productCode:any;
  @ViewChild('openModal') openModal;
  @ViewChild('dt1') dt1: Table | undefined;

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
    private spinner: NgxSpinnerService,
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
    this.quickQuoteDetails()


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

  quickQuoteDetails(){
    this.quickQuotationNum = sessionStorage.getItem('quickQuotationNum');
    this.quickQuotationCode =  sessionStorage.getItem('quickQuotationCode');
    if( this.quickQuotationCode){
      sessionStorage.setItem('quotationNum',this.quickQuotationNum );
      sessionStorage.setItem('quotationCode', this.quickQuotationCode );
      this.quotationService.getQuotationDetails(this.quickQuotationNum).subscribe(res=>{
        this.quickQuotationDetails = res
        console.log("QUICK QUOTE DETAILS",this.quickQuotationDetails)
        this.quotationForm.controls['expiryDate'].setValue(this.quickQuotationDetails.expiryDate);
        this.quotationForm.controls['withEffectiveFromDate'].setValue(this.quickQuotationDetails.coverFrom);
        this.quotationForm.controls['withEffectiveToDate'].setValue(this.quickQuotationDetails.coverTo);
        this.quotationForm.controls['source'].setValue(this.quickQuotationDetails.source.code);

        const productCode = this.quickQuotationDetails.quotationProduct[0].proCode
        this.productService.getProductByCode(productCode).subscribe(res=>{
          this.quotationForm.controls['productCode'].setValue(res);
        })

        console.log("Test currency",this.currency)
        this.currency.forEach(el=>{

          if(el.symbol === this.quickQuotationDetails.currency){
            console.log("Test currency", el)
            this.quotationForm.controls['currencyCode'].setValue(el);
          }
        })
      })
    }
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
  // getCurrencyCode(){
  //   console.log(this.quotationForm.value.currencyCode)
  //   this.quotationForm.controls['currencyCode'].setValue(this.quotationForm.value.currencyCode.id);
  // console.log(this.quotationForm.value)
  // }

/**
 * Retrieves all products from the product service, processes the data, and assigns it to the 'products' property.
 */

  getProduct(){
    this.producSetupService.getAllProducts().subscribe(res=>{
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
    this.quotationService.getAllQuotationSources().subscribe(res=>{
      const sources = res
      this.quotationSources = sources.content
      console.log("SOURCES",this.quotationSources)
    })
  }
 /**
   * Creates a new quotation form using Angular Reactive Forms.
   * @method createQuotationForm
   * @return {void}
   */
  createQuotationForm(){
      this.quotationForm = this.fb.group({
        actionType: ['',],
        addEdit: [''],
        agentCode: ['',Validators.required],
        agentShortDescription: [''],
        bdivCode: [''],
        bindCode: [''],
        branchCode: ['',Validators.required],
        clientCode: ['',Validators.required],
        clientType: [''],
        coinLeaderCombined: [''],
        consCode: [''],
        currencyCode: ['',Validators.required],
        currencySymbol: [''],
        fequencyOfPayment: [''],
        isBinderPolicy: [''],
        paymentMode: [''],
        proInterfaceType: [''],
        productCode: ['',Validators.required],
        source: ['',Validators.required],
        withEffectiveFromDate: ['',Validators.required],
        withEffectiveToDate: ['',Validators.required],
        multiUser:[''],
        comments:[''],
        internalComments:[''],
        introducerCode:[''],
        dateRange:[''],
        RFQDate:['',Validators.required],
        expiryDate:['',Validators.required]
      })
  }


  /**
 * Saves quotation details, sets form details, and navigates based on user preferences.
 * @method saveQuotationDetails
 * @return {void}
 */
  saveQuotationDetails(){
    this.spinner.show()

    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
    sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));

    if(this.quotationForm.value.multiUser == 'Y'){
        /**
     * Creates a new quotation with multi-user and navigates to quote assigning.
     * @param {Object} this.quotationForm.value - The form value representing quotation details.
     * @param {string} this.user - The user associated with the quotation.
     * @return {Observable<any>} - An observable of the response containing created quotation data.
     */
    if(this.quickQuotationDetails){
      console.log("Quick Quotation results")
      this.router.navigate(['/home/gis/quotation/quote-assigning'])
      this.spinner.hide()

    }else{
      this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
        this.quotationNo = data;
        this.spinner.hide()
        console.log(this.quotationNo,"Quotation results:")
        this.router.navigate(['/home/gis/quotation/quote-assigning'])
      },(error: HttpErrorResponse) => {
        log.info(error);
        this.spinner.hide()
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

      })
    }



    }else{
    if (this.isChecked) {
        /**
       * Creates a new quotation with import risks and navigates to import risks page.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       */
        if(this.quickQuotationDetails){
          this.router.navigate(['/home/gis/quotation/import-risks'])
          this.spinner.hide()
          sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
        }else{
          this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
            this.quotationNo = data
            this.spinner.hide()
            console.log(this.quotationForm.value)
            sessionStorage.setItem('quotationNum',this.quotationNum );
            sessionStorage.setItem('quotationCode',this.quotationCode );
            sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
            this.router.navigate(['/home/gis/quotation/import-risks'])
            },(error: HttpErrorResponse) => {
              log.info(error);
              this.spinner.hide()
              this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

            })
        }


    } else {
       /**
       * Creates a new quotation and navigates to risk section details based on user preferences.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       */

    if(this.quickQuotationDetails){
      this.router.navigate(['/home/gis/quotation/risk-section-details']);
      this.spinner.hide()

     }else{
      this.quotationService.createQuotation(this.quotationForm.value,this.user).subscribe(data=>{
        this.quotationNo = data;
        this.spinner.hide()
        console.log(this.quotationNo,'quotation number output');
        this.quotationCode=this.quotationNo._embedded[0].quotationCode;
        this.quotationNum = this.quotationNo._embedded[0].quotationNumber
        sessionStorage.setItem('quotationNum',this.quotationNum );
        sessionStorage.setItem('quotationCode',this.quotationCode );
        sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
        this.selectedProductClauses(this.quotationCode)
        this.sharedService.setQuotationDetails(this.quotationNum,this.quotationCode);

        this.router.navigate(['/home/gis/quotation/risk-section-details']);
        },(error: HttpErrorResponse) => {
          log.info(error);
          this.spinner.hide()
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

        })
     }


    }
  }
}
   /**
   * Applies a global filter to the DataTable.
   * @method applyFilterGlobal
   * @param {Event} $event - The event triggering the filter application.
   * @param {string} stringVal - The string value representing the filter criteria.
   * @return {void}
   */
   applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

 /**
   * Retrieves agents and populates the 'agents' property.
   * @method getAgents
   * @return {void}
   */
  getAgents(){
    this.quotationService.getAgents().subscribe(data=>{
      this.agents = data.content
     console.log("AGENTS",data)
    })
  }
   /**
   * Retrieves agent short description by ID and updates the corresponding form control.
   * @method agentShortDesc
   * @param {string} id - The ID of the agent for which to retrieve the short description.
   * @return {void}
   */
  agentShortDesc(){
    this.agentService.getAgentById(this.quotationForm.value.agentCode.id).subscribe(data=>{
      this.agentDetails = data
      this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);

    })

  }
  getAgentById(data){
    this.agentService.getAgentById(data).subscribe({
      next:(res)=>{
        this.agentDetails = res

        this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);
        this.quotationForm.controls['agentCode'].setValue(this.agentDetails.name);

      }
    })
  }
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
}
onResize(event: any) {
  this.modalHeight = event.height;
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
    this.quotationForm.controls['productCode'].setValue(this.quotationForm.value.productCode.code);
    this.quotationForm.controls['branchCode'].setValue(this.quotationForm.value.branchCode.id);
    this.quotationForm.controls['agentCode'].setValue(this.agentDetails.id);
    sessionStorage.setItem('coverFrom', JSON.stringify(this.quotationForm.value.withEffectiveFromDate));
    sessionStorage.setItem('coverTo', JSON.stringify(this.quotationForm.value.withEffectiveToDate));
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

    // this.producSetupService.getProductByCode(this.quotationForm.value.productCode).subscribe(res=>{
    //   this.productDetails = res
    //   console.log(this.productDetails)
      // if(this.productDetails.expires === 'Y'){
        this.producSetupService.getCoverToDate(coverFromDate,this.quotationForm.value.productCode.code).subscribe(res=>{
          this.midnightexpiry = res
          console.log(this.midnightexpiry)
          this.quotationForm.controls['withEffectiveToDate'].setValue(this.midnightexpiry._embedded[0].coverToDate)
        })

      // }else {
      //   const selectedDate = new Date(coverFromDate);
      //   selectedDate.setFullYear(selectedDate.getFullYear() + 1);
      //   const coverToDate = selectedDate.toISOString().split('T')[0];
      //   this.quotationForm.controls['withEffectiveToDate'].setValue(coverToDate);


      // }
    // })

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
getProductClause(){
  this.productCode = this.quotationForm.value.productCode.code
  this.quotationService.getProductClauses(this.quotationForm.value.productCode.code).subscribe(res=>{
    this.clauses= res
  })
}
selectedProductClauses(quotationCode){

  if(this.selectedClause){
    this.selectedClause.forEach(el=>{
      this.quotationService.addProductClause(el.code,this.productCode,quotationCode).subscribe(res=>{
        console.log(res)
      })
      console.log(el.code)
    })
  }

  // this.clauseService.getSingleClause(code).subscribe(
  //   {
  //     next:(res)=>{
  //       console.log(res)
  //     }
  //   }
  // )
}
unselectClause(event){
  console.log(this.selectedClause)
}
}
