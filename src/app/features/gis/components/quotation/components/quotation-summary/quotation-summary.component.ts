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
  constructor(
    public sharedService:SharedQuotationsService,
    public quotationService:QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public  agentService:IntermediaryService,
  ){}
  ngOnInit(): void {
    this.quotationCode=this.sharedService.getQuotationNumber();
    this.quotationNumber=this.sharedService.getQuotationCode();
    this.getQuotationDetails()
    this.clientDetails = this.sharedService.getFormData()
    
    this.moreDetails=this.sharedService.getQuotationFormDetails()
    log.debug(this.moreDetails)
  }

  getQuotationDetails(){
    this.quotationService.getQuotationDetails(this.quotationCode).subscribe(res=>{
      this.quotationDetails = res 
      log.debug(this.quotationDetails.agentCode)
      this.agentService.getAgents().subscribe(data=>{
        this.agents = data.content
        this.agents.forEach(el=>{
          if(el.id === this.quotationDetails.agentCode ){
            console.log(el)
          }
        })
      
      })
    })
  }

  editDetails(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

  computePremium(){
    this.quotationService.computePremium(this.quotationNumber).subscribe(res=>{
      this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed' );
    },(error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
     
    }    )
  }
  getAgents(){
    this.agentService.getAgents().subscribe(data=>{
      this.agents = data.content
     
    })
  }
}
