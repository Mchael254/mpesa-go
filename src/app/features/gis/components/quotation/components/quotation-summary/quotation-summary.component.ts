import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Logger } from 'src/app/shared/services/logger/logger.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Router } from '@angular/router';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IntermediaryService } from 'src/app/features/entities/services/intermediary/intermediary.service';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
const log = new Logger('QuotationSummaryComponent');


@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.css']
})
export class QuotationSummaryComponent {
  steps = quoteStepsData;
  quotationCode:any
  quotationNumber:any;
  quotationDetails:any
  moreDetails:any 
  clientDetails:any
  agents:AgentDTO[];
  agentName:any
  agentDetails:any
  productDetails:any = [];
  prodCode:any
  riskDetails:any
  quotationProducts:any
  taxDetails:any
  riskInfo:any = [];
  clauses:any;
  user:any;
  clientCode:any;
  externalClaims:any;
  internalClaims:any
  constructor(
    public sharedService:SharedQuotationsService,
    public quotationService:QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public  agentService:IntermediaryService,
    public productService:ProductService,
    public activatedRoute:ActivatedRoute,
    public authService:AuthService,
    private messageService: GlobalMessagingService
  ){}
  public isCollapsibleOpen = false;
  public isRiskCollapsibleOpen = false;
  public makeQuotationReady = true;
  public confirmQuotation = false;
  public authoriseQuotation = false;
  public showEmail = false;
  public showSms = false;
  public showInternalClaims = false;
  public showExternalClaims = true;
  ngOnInit(): void {
    this.quotationCode=sessionStorage.getItem('quotationCode');
    this.quotationNumber=sessionStorage.getItem('quotationNum');
   
    this.moreDetails=sessionStorage.getItem('quotationFormDetails')
    const storedData = sessionStorage.getItem('clientFormData');
    this.clientDetails=JSON.parse(storedData);
    this.prodCode = JSON.parse(this.moreDetails).productCode
    this.clientCode = JSON.parse(this.moreDetails).clientCode
    this.getuser()
    this.getQuotationDetails(this.quotationNumber)
    this.getProductDetails(this.prodCode)
    this.getProductClause(this.prodCode)
    this.externalClaimsExperience(this.clientCode)
    this.internalClaimsExperience(this.clientCode)
  }

  /**
   * Retrieves quotation details based on the provided code.
   * @method getQuotationDetails
   * @param {string} code - The code of the quotation for which to retrieve details.
   * @return {void}
   */
  getQuotationDetails(code){
    this.quotationService.getQuotationDetails(code).subscribe(res=>{
      this.quotationDetails = res 

       // Extracts product details for each quotation product.
      this.quotationProducts = this.quotationDetails.quotationProduct
      this.riskDetails = this.quotationDetails.riskInformation
      // this.riskInfo.push(this.riskDetails.sectionsDetails)
      this.taxDetails = this.quotationDetails.taxInformation
      log.debug(this.taxDetails)

      this.productDetails.forEach(el=>{
          /**
         * Subscribes to the product service to get product details.
         * @param {any} productRes - The response containing product details.
         * @return {void}
         */
        this.productService.getProductByCode(el.proCode).subscribe(res=>{
          
        })
     
        log.debug(el.proCode)
      })
      this.agentService.getAgents().subscribe(data=>{
        this.agents = data.content
        this.agents.forEach(el=>{
          if(el.id === this.quotationDetails.agentCode ){
            this.agentDetails = el
          }
        })
      
      })
    })
  }
  /**
   * Navigates to the edit details page.
   * @method editDetails
   * @return {void}
   */
  editDetails(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }
   /**
   * Retrieves product details based on the product code in the 'moreDetails' property.
   * @method getProductDetails
   * @return {void}
   */
  getProductDetails(code){
    this.productService.getProductByCode(code).subscribe(res=>{
      this.productDetails.push(res)
    })
 

  }
 /**
   * Computes the premium for the current quotation and updates the quotation details.
   * @method computePremium
   * @return {void}
   */
  computePremium(){
    this.quotationService.computePremium(this.quotationCode).subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed' );
      this.quotationService.getQuotationDetails(this.quotationNumber).subscribe(res=>{
        this.quotationDetails = res 
        log.debug(this.quotationDetails.premium)
      }
      )
    },(error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
     
    }    )
  }
  
  getAgents(){
      /**
   * Retrieves agents using the AgentService.
   * Subscribes to the observable to handle the response.
   * Populates the 'agents' property with the content of the response.
   * @param {any} data - The response data containing agents.
   * @return {void}
   */
    this.agentService.getAgents().subscribe(data=>{
      this.agents = data.content
     
    })
  }
  toggleProductDetails() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  toggleRiskDetails() {
    this.isRiskCollapsibleOpen = !this.isRiskCollapsibleOpen;
  }
  getProductClause(productCode){
    this.quotationService.getProductClauses(productCode).subscribe(res=>{
      this.clauses= res
      log.debug(this.clauses)
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
  makeReady(){
    this.quotationService.makeReady(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.makeQuotationReady = !this.makeQuotationReady;
          this.authoriseQuotation = !this.authoriseQuotation;
          this.messageService.displaySuccessMessage('Success','Quotation Made Ready, Authorise to proceed')
        },
        error: (e) => {
          log.debug(e)
          this.messageService.displayErrorMessage('error', 'Failed to make ready')
        }
      }

    )

  }
  authorise(){
    this.quotationService.authoriseQuotation(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.messageService.displaySuccessMessage('Success','Quotation Authorised, Confirm to proceed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    ) 
  
  }
  confirm(){
    this.quotationService.confirmQuotation(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation; 
          this.confirmQuotation = !this.confirmQuotation;
          this.messageService.displaySuccessMessage('Success','Quotation Authorization Confirmed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  showCommunicationDetails(section){
    if(section === 'sms' ){
      this.showSms  = true
      this.showEmail = false

    }else if(section === 'email'){
      this.showEmail = true
      this.showSms  = false

    }
  }
  externalClaimsExperience(clientCode){
    this.quotationService.getExternalClaimsExperience(clientCode).subscribe(res=>{
      this.externalClaims = res
      
      log.debug(this.externalClaims.empty)
      
    })
  }
  internalClaimsExperience(clientCode){
    this.quotationService.getInternalClaimsExperience(clientCode).subscribe(res=>{
      this.internalClaims = res 
      log.debug(this.internalClaims.empty)
    })
  }

  showExternals(){
    this.showExternalClaims = !this.showExternalClaims
  }
  showInternal(){
    this.showInternalClaims = !this.showInternalClaims
  }
}
