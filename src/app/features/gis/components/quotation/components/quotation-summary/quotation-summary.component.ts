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
  productDetails:any;
  paramRoute:any
  constructor(
    public sharedService:SharedQuotationsService,
    public quotationService:QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public  agentService:IntermediaryService,
    public productService:ProductService,
    public activatedRoute:ActivatedRoute,

  ){}
  ngOnInit(): void {
    this.quotationCode=this.sharedService.getQuotationNumber();
    this.quotationNumber=this.sharedService.getQuotationCode();
    this.clientDetails = this.sharedService.getFormData()
    this.paramRoute = decodeURIComponent(this.activatedRoute.snapshot.paramMap.get('num'))
    this.moreDetails=this.sharedService.getQuotationFormDetails()
   log.debug(this.paramRoute)
   this.getQuotationDetails(this.paramRoute)

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
      this.productDetails = this.quotationDetails.quotationProduct
      this.productDetails.forEach(el=>{
          /**
         * Subscribes to the product service to get product details.
         * @param {any} productRes - The response containing product details.
         * @return {void}
         */
        this.productService.getProductByCode(el.proCode).subscribe(res=>{
          log.debug(res)
          
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
  getProductDetails(){
    this.productService.getProductByCode(this.moreDetails.productCode).subscribe(res=>{
      log.debug(res)
    })
 

  }
 /**
   * Computes the premium for the current quotation and updates the quotation details.
   * @method computePremium
   * @return {void}
   */
  computePremium(){
    this.quotationService.computePremium(this.quotationNumber).subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed' );
      this.quotationService.getQuotationDetails(this.quotationCode).subscribe(res=>{
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
}
