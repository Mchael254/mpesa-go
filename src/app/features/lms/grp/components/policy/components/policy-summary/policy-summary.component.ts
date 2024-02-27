import { Component, OnDestroy, OnInit } from '@angular/core';
import { PolicySummaryService } from '../../service/policy-summary.service';
import { AnnualValuationsDTO, MemberClaimsDTO, MembersDTO, PartialWithdrawalsDTO, PolicyClaimsDTO, PolicyDetailsDTO, ReceiptsAllocatedDTO } from '../../models/policy-summary';
import { ActivatedRoute, Router } from '@angular/router';

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
  policyClaims: PolicyClaimsDTO[];
  memberClaims: MemberClaimsDTO[];
  receiptsAllocated: ReceiptsAllocatedDTO[];
  quoteSummary = 'summary';
  // policyCode = 20221453490; 20231454304 20231453504 20211453247
  // policyCode = 20231453504;
  policyCode: number;
  // productCode=2021675;
  productCode: number;
  // endorsementCode=20231683286;
  endorsementCode: number;
  clmNo='CLM/GLA-832/2023';
  memberCode=20221299132;
  // role: string = 'agent'
  // role: string = 'client' 
  // client and agent see same data except reports, agent view intermediary report
  role: string = 'policy-holder'

  constructor(
    private policySummaryService: PolicySummaryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.getPolicyDetails();
    this.getMembers();
    this.getAnnualvaluations();
    this.getPartialWithdrawals();
    this.getPolicyClaims();
    this.getMembersClaims();
    this.getReceiptsAllocated();
    
  }

  ngOnDestroy(): void {
    
  }

  getParams() {
  this.activatedRoute.queryParams.subscribe((queryParams) => {
    this.policyCode = queryParams['policyCode'];
    this.endorsementCode = queryParams['endorsementCode'];
    this.productCode = queryParams['productCode'];
    console.log('policyFromRoute', this.policyCode, this.endorsementCode, this.productCode )
  });
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
    this.policySummaryService.getAnnualvaluations(this.policyCode).subscribe((valuations: AnnualValuationsDTO[]) => {
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
    this.policySummaryService.getPolicyClaims(this.policyCode).subscribe((policyClaims: PolicyClaimsDTO[]) => {
      console.log('policyClaims', policyClaims)
      this.policyClaims = policyClaims
    });
  }

  getMembersClaims() {
    this.policySummaryService.getMembersClaims(this.clmNo, this.memberCode).subscribe((memberClaims: MemberClaimsDTO[]) => {
      console.log('memberClaims', memberClaims)
      this.memberClaims = memberClaims
    });
  }

  getReceiptsAllocated() {
    // 20211453247
    this.policySummaryService.getReceiptsAllocated(this.policyCode).subscribe((receiptsAllocated: ReceiptsAllocatedDTO[]) => {
      console.log('receiptsAllocated', receiptsAllocated)
      this.receiptsAllocated = receiptsAllocated;
    });
  }

  onBack() {
    this.router.navigate(['/home/lms/grp/policy/policyListing'])
  }
}
