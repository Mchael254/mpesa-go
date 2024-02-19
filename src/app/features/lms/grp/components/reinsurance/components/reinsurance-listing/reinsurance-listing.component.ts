import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { PolicySummaryService } from '../../../policy/service/policy-summary.service';
import { PolicyListingDTO } from '../../../policy/models/policy-summary';

@Component({
  selector: 'app-reinsurance-listing',
  templateUrl: './reinsurance-listing.component.html',
  styleUrls: ['./reinsurance-listing.component.css']
})
export class ReinsuranceListingComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  policyListing: PolicyListingDTO[];
  selectedPolicy!: PolicyListingDTO;
  agentCode = 2020201235490;
  clientProposerCode = 20231410738;

  constructor(
    private policySummaryService: PolicySummaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.policyListingColumns();
    this.getReinsurancePolicyListing()

  }

  ngOnDestroy(): void {
    
  }

  policyListingColumns() {
    this.columnOptions = [
      { label: 'Policy number', value: 'policy_number' },
      { label: 'Product', value: 'description' },
      { label: 'Status', value: 'status' },
      { label: 'Effective date', value: 'effective_date' },
      { label: 'Premium', value: 'total_premium' },
      { label: 'Sum assured', value: 'total_sum_assured' },
  ];

  this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  getReinsurancePolicyListing() {
    this.policySummaryService.getPolicyListing(this.agentCode, this.clientProposerCode).subscribe((policyListing: PolicyListingDTO[]) => {
      console.log('ReinsurancePolicyListing', policyListing)
      this.policyListing = policyListing;
    })
  }

  onRowSelect(event: any) {
    this.selectedPolicy = event.data;
    console.log('Selected Policy:', this.selectedPolicy.policy_code);
    this.router.navigate(['/home/lms/grp/reinsurance/selection'], {
              queryParams: {
                policyCode: this.selectedPolicy.policy_code,
                endorsementCode: this.selectedPolicy.endorsement_code,
                productCode: this.selectedPolicy.product_code
              },
            });
  }
  
}
