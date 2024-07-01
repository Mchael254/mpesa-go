import { Component, OnInit, OnDestroy } from '@angular/core';
import StepData from '../../data/steps.json';
import { ClaimsService } from 'src/app/features/lms/service/claims/claims.service';
import { Logger } from 'src/app/shared/services';
import { ClaimDetailsDTO } from '../../models/claim-details';

const log = new Logger('PolicyAndClaimsDetailsComponent');

@Component({
  selector: 'app-policy-and-claims-details',
  templateUrl: './policy-and-claims-details.component.html',
  styleUrls: ['./policy-and-claims-details.component.css']
})

export class PolicyAndClaimsDetailsComponent implements OnInit, OnDestroy {
  steps = StepData;
  claims: ClaimDetailsDTO; 
  clm_no = "MEEP23000122"

  constructor(private claims_service:ClaimsService){}

  ngOnInit(): void{
    this.getClaimDetails();
  }

  ngOnDestroy(): void{}

  getClaimDetails(){
    this.claims_service.getClaimDetails(this.clm_no).subscribe((claims: ClaimDetailsDTO)=>{
      this.claims = claims;
      log.info("Claim Details:", this.claims);
    })
  }
}
