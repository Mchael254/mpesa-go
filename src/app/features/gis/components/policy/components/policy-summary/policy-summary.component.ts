import { Component } from '@angular/core';
import underwritingSteps from '../../data/underwriting-steps.json';
import { PolicyService } from '../../services/policy.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';

@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css']
})
export class PolicySummaryComponent {
  steps = underwritingSteps
  policyDetails:any
  computationDetails: Object;
  premiumResponse:any;
  premium:any;

  constructor(
    public policyService:PolicyService,
    private globalMessagingService: GlobalMessagingService,
  ){}

  ngOnInit(): void {
    this.getUtil();
  }


  getUtil(){
   this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
   

   this.policyService.policyUtils(this.policyDetails.batchNumber).subscribe({
    next :(res) =>{
     this.computationDetails = res
     console.log( 'computation details',this.computationDetails)
    }
  })
}
computePremium(){
  this.policyService.computePremium(this.computationDetails).subscribe({
    next:(res)=>{
      this.premiumResponse = res
      this.premium = this.premiumResponse.premiumAmount
      this.globalMessagingService.displaySuccessMessage('Success','Premium computed successfully ')
      console.log(this.premium)
    }, error : (error) => {
     
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );

      }
  })
}
}
