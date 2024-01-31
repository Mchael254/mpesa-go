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
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


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
  quotationView:any
  moreDetails:any 
  clientDetails:any
  agents:any;
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
  internalClaims:any;
  computationDetails:any;
  premium:any;
  branch: any;
  currency:any;
  externalTable:any;
  internalTable:any;
  menuItems:MenuItem[] | undefined;
  sumInsured:any;
  userDetails:any;
  emailForm: FormGroup;
  sections:any;
  constructor(

    public sharedService:SharedQuotationsService,
    public quotationService:QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public  agentService:IntermediaryService,
    public productService:ProductService,
    public activatedRoute:ActivatedRoute,
    public authService:AuthService,
    private messageService: GlobalMessagingService,
    public branchService:BranchService,
    private spinner: NgxSpinnerService,
    public bankService:BankService,
    private fb: FormBuilder
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
    const sections=sessionStorage.getItem('sections')
    console.log(sections)
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
    this.getbranch()
    this.quotationDetails = JSON.parse(this.moreDetails) 
    this.spinner.show()
    this.getPremiumComputationDetails()
    console.log(this.quotationDetails , "MORE DETAILS TEST")
    this.sumInsured = sessionStorage.getItem('limitAmount')
    this.createEmailForm()
    this.agentService.getAgentById(this.quotationDetails.agentCode).subscribe(
      {
        next: (res) => {
          this.agents = res
          this.spinner.hide()
          console.log(res)
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )


    this.menuItems = [
      {
        label: 'Claims Experience',
        
        items: [
            {
                label: 'External',
                command: () => {
                  this.external();
              }
      },
      {
        label: 'Internal',
        command: () => {
          this.internal();
      }
}
  ]

}]
    
  }

external(){
  this.showExternalClaims = true;
  this.showInternalClaims = false;
  
}
internal(){

  this.showInternalClaims = true;
  this.showExternalClaims = false;
}
  /**
   * Retrieves quotation details based on the provided code.
   * @method getQuotationDetails
   * @param {string} code - The code of the quotation for which to retrieve details.
   * @return {void}
   */
  getQuotationDetails(code){
    this.quotationService.getQuotationDetails(code).subscribe(res=>{
      this.quotationView = res
      console.log(this.quotationView , "DETAILS TEST")
      console.log(code,"code")
       // Extracts product details for each quotation product.
      this.quotationProducts = this.quotationView.quotationProduct
      this.riskDetails = this.quotationView.riskInformation
      this.riskDetails.forEach(el=>{
        this.sections = el.sectionsDetails
      })
      console.log(this.sections)
      // this.riskInfo.push(this.riskDetails.sectionsDetails)
      this.taxDetails = this.quotationView.taxInformation
      log.debug(this.taxDetails)
      this.agentService.getAgentById(this.quotationDetails.agentCode).subscribe(res=>{
        this.agents = res
        console.log(res)
      })
      // this.productDetails.forEach(el=>{
      //     /**
      //    * Subscribes to the product service to get product details.
      //    * @param {any} productRes - The response containing product details.
      //    * @return {void}
      //    */
      //   this.productService.getProductByCode(el.proCode).subscribe(res=>{
          
      //   })
     
      //   log.debug(el.proCode)
      // })
      // this.agentService.getAgents().subscribe(data=>{
      //   this.agents = data.content
      //   this.agents.forEach(el=>{
      //     if(el.id === this.quotationDetails.agentCode ){
      //       this.agentDetails = el
      //     }
      //   })
      
      // })
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
  getbranch(){
    console.log(JSON.parse(this.moreDetails),"more  details")
    this.branchService.getBranchById(JSON.parse(this.moreDetails).branchCode).subscribe(data=>{
      this.branch = data
      console.log(this.branch)
    })
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
     getuser():void{
      this.user = this.authService.getCurrentUserName()
      this.quotationService.getUserProfile().subscribe(res=>{
        this.userDetails = res
       
      })
     }
  makeReady(){
    this.quotationService.makeReady(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.makeQuotationReady = !this.makeQuotationReady;
          this.authoriseQuotation = !this.authoriseQuotation;
          this.getQuotationDetails(this.quotationNumber);
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
          this.getQuotationDetails(this.quotationNumber);
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
          this.getQuotationDetails(this.quotationNumber);
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

      this.externalTable = this.externalClaims.content
      
      log.debug(this.externalTable)
      
    })
  }
  internalClaimsExperience(clientCode){
    this.quotationService.getInternalClaimsExperience(clientCode).subscribe(res=>{
      this.internalClaims = res 
      this.internalTable = this.internalClaims.content
      log.debug(this.internalTable)
    })
  }

  showExternals(){
    this.showExternalClaims = !this.showExternalClaims
  }
  showInternal(){
    this.showInternalClaims = !this.showInternalClaims
  }
  getPremiumComputationDetails(){
    this.quotationService.quotationUtils(this.quotationCode).subscribe({
      next :(res) =>{
       this.computationDetails = res
        this.computationDetails.underwritingYear = new Date().getFullYear();
       // Modify the prorata field for all risks
    this.computationDetails.risks.forEach((risk: any) => {
      risk.prorata = 'F';
      risk.limits.forEach((limit: any) => {
        // Update the fields you want to modify
        limit.premiumRate = sessionStorage.getItem('premiumRate');
        limit.sectionType = sessionStorage.getItem('sectionType');
        limit.multiplierDivisionFactor = sessionStorage.getItem('multiplierDivisionFactor');
        limit.rateType = sessionStorage.getItem('rateType');
        limit.rateDivisionFactor = sessionStorage.getItem('divisionFactor');
        limit.limitAmount = sessionStorage.getItem('limitAmount')
      });
    });
      console.log(this.computationDetails.risks)
    },
    error: (error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, you cannot compute premium, check quotation details and try again.' );
     
    }    }
    )
  }
   /**
   * Computes the premium for the current quotation and updates the quotation details.
   * @method computePremium
   * @return {void}
   */
   computePremium(){
    
    this.quotationService.computePremium(this.computationDetails).subscribe(
   {  
    next:(res)=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed' );
          this.premium = res
          console.log(res)
      },
    error : (error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
     
      }  
    }
      )
  }

  cancelQuotation(){
    sessionStorage.removeItem('clientFormData');
    sessionStorage.removeItem('quotationFormDetails');
    sessionStorage.removeItem('quotationCode');
    sessionStorage.removeItem('quotationNum');
    this.router.navigate(['/home/gis/quotation/quotations-client-details'])
    // this.router.navigate(['/home/gis/quotation/quotations-client-details'])
  }
  editQuotations(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }
  createEmailForm(){
    
    this.emailForm = this.fb.group({
      from: ['', [Validators.required, Validators.email]],
      clientCode: ['', Validators.required],
      emailAggregator: ['N', Validators.required],
      fromName: ['', Validators.required],
      message: ['', Validators.required],
      sendOn: ['', Validators.required], 
      status: ['D', Validators.required],
      subject: ['', Validators.required],
      systemCode: ['0', Validators.required],
      systemModule: ['NB', Validators.required],
      address: ['', Validators.required],
      cc: ['', Validators.required],
      bcc: ['', Validators.required],  
    });
  }

  emaildetails(){
    const currentDate = new Date();
    const current = currentDate.toISOString();
    console.log(this.clientDetails)
    console.log(this.emailForm.value)

    
      

      const payload = {
        address: [
          this.emailForm.value.address,
          this.emailForm.value.cc,
          this.emailForm.value.bcc,
        ].filter(email => email), // Filter out any empty values
        clientCode: this.clientDetails.id,
        emailAggregator: this.emailForm.value.emailAggregator,
        from: this.userDetails.emailAddress,
        fromName: this.emailForm.value.fromName,
        message: this.emailForm.value.message,
        sendOn: current,
        status: this.emailForm.value.status,
        subject: this.emailForm.value.subject,
        systemCode: this.emailForm.value.systemCode,
        systemModule: this.emailForm.value.systemModule,
        
      };
      this.quotationService.sendEmail(payload).subscribe(res=>{
        const response = res
        if(response === false)
        console.log(res)
      })
      console.log('Submitted payload:',JSON.stringify(payload) );
  }

}
