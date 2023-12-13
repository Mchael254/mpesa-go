import { Component, OnDestroy, OnInit } from '@angular/core';
import { PolicySummaryService } from '../../service/policy-summary.service';
import { AnnualValuationsDTO, MembersDTO, PartialWithdrawalsDTO, PolicyDetailsDTO } from '../../models/policy-summary';

@Component({
  selector: 'app-policy-summary',
  templateUrl: './policy-summary.component.html',
  styleUrls: ['./policy-summary.component.css']
})
export class PolicySummaryComponent implements OnInit, OnDestroy {
  members: MembersDTO[];
  policyDetails: PolicyDetailsDTO[];
  partiwalWithdrawal: PartialWithdrawalsDTO[];
  annualValuations: AnnualValuationsDTO[];
  quoteSummary = 'summary';
  // policyCode = 20221453490; 20231454304 20231453504
  policyCode = 20231453504;
  productCode=2021675;
  endorsementCode=20231683286;
  clmNo='CLM/GLA-832/2023';
  memberCode=20221299132;

  constructor(
    private policySummaryService: PolicySummaryService
  ) {}

  ngOnInit(): void {
    this.getPolicyDetails();
    this.getMembers();
    this.getAnnualvaluations();
    this.getPartialWithdrawals();
    this.getPolicyClaims();
    this.getMembersClaims();
    
  }

  ngOnDestroy(): void {
    
  }

  showViewMoreModal() {
    const modal = document.getElementById('viewMoreModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeViewMoreModal() {
    const modal = document.getElementById('viewMoreModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  getPolicyDetails() {
    this.policySummaryService.getPolicyDetails(this.policyCode, this.productCode, this.endorsementCode).subscribe((policyDetails: PolicyDetailsDTO[]) => {
      console.log('policiDetails', policyDetails)
      this.policyDetails = policyDetails
    },
    (error) => {
      console.log(error)
    });
  }

  getMembers() {
    this.policySummaryService.getMembers(this.policyCode).subscribe((members: MembersDTO[]) => {
      console.log('members', members)
      this.members = members
    }, 
    (error) => {
      console.log('Error fetching members:', error)
    });
  }

  getAnnualvaluations() {
    // this.policySummaryService.getAnnualvaluations(this.policyCode).subscribe((valuations: AnnualValuationsDTO[]) => {
      this.policySummaryService.getAnnualvaluations(20211453247).subscribe((valuations: AnnualValuationsDTO[]) => {
      console.log('valuations', valuations)
      this.annualValuations = valuations
    },
    (error) => {
      console.log(error)
    });
  }

  getPartialWithdrawals() {
    this.policySummaryService.getPartialWithdrawals(this.policyCode).subscribe((withdrawals: PartialWithdrawalsDTO[]) => {
      console.log('withdrawals', withdrawals);
      this.partiwalWithdrawal = withdrawals;
    },
    (error) => {
      console.log(error);
    });
  }

  getPolicyClaims() {
    this.policySummaryService.getPolicyClaims(this.policyCode).subscribe((policyClaims) => {
      console.log('policyClaims', policyClaims)
    });
  }

  getMembersClaims() {
    this.policySummaryService.getMembersClaims(this.clmNo, this.memberCode).subscribe((memberClaims) => {
      console.log('memberClaims', memberClaims)
    });
  }
}
