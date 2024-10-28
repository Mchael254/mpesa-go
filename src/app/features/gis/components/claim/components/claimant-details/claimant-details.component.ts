import { Component } from '@angular/core';
import { ClaimsService } from '../../services/claims.service';
@Component({
  selector: 'app-claimant-details',
  templateUrl: './claimant-details.component.html',
  styleUrls: ['./claimant-details.component.css']
})
export class ClaimantDetailsComponent {

  constructor(
    public claimService:ClaimsService
  ){}
  ngOnInit(): void {
    this.getClaimDetailsByClient()
  }
  /**
  * Claim transaction details data.
  */
  claimTransactionDetails = {
    claimNumber: 'C/LGIU/MVCL/23/000012',
    product: 'MOTOR COMMERCIAL',
    riskWef: '01/10/2022',
    lossDescription: 'ACCIDENTAL DAMAGE TO MV REG NO. UBF 847V INVOLVING INJURIES TO THIRD PARTY',
    claimStatus: 'Closed Settled',
    catastrophe: '',
    policyNumber: 'P/HQ/704/17/000679',
    insured: 'THE COOPER MOTOR CORPORA',
    riskWet: '30/09/2023',
    bookedBy: 'BALISINWA',
    nextReviewDate: '',
    event: '',
    endorsementNumber: 'E/704/22/035439',
    risk: 'UBF847V',
    claimLossDate: '25/10/2022',
    bookedDate: '09/01/2023',
    agentIntermediary: 'MINET UGANDA INSURANCE BROKERS LIMITED',
    priorityLevel: '',
    client: 'THE COOPER MOTOR CORPORA',
    riskValue: '147,000,000.00',
    claimNotificationDate: '25/10/2022',
    admitLiability: 'N',
    insuredPolicyNo: 'P/HQ/704/17/000679',
    currency: 'USH'
  };


getClaimDetailsByClient(){
  this.claimService.getClaimByClient(1195475).subscribe({
    next:(res=>{
      console.log(res)
    })
  })
}
}
