import { Component } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Logger } from 'src/app/shared/services/logger/logger.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Router } from '@angular/router';
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
  constructor(
    public sharedService:SharedQuotationsService,
    public quotationService:QuotationsService,
    private router: Router,
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
      log.debug(this.quotationDetails)
    })
  }

  editDetails(){
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

  computePremium(){
    this.quotationService.computePremium(this.quotationCode).subscribe(res=>{
      log.debug(res)
    })
  }
}
