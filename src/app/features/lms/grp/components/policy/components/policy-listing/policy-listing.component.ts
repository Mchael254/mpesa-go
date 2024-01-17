import { Component, OnDestroy, OnInit } from '@angular/core';
import { PolicySummaryService } from '../../service/policy-summary.service';
import { PolicyListingDTO } from '../../models/policy-summary';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-policy-listing',
  templateUrl: './policy-listing.component.html',
  styleUrls: ['./policy-listing.component.css']
})
export class PolicyListingComponent implements OnInit, OnDestroy {
  policyListing: PolicyListingDTO[];
  selectedPolicy!: PolicyListingDTO;
  agentCode = 2020201235490;
  clientProposerCode = 20231410738;
  searchTerm: string = '';
  columnOptions: SelectItem[];
  selectedColumns: string[];

  constructor(
    private policySummaryService: PolicySummaryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPolicyListing();
    this.policyListingColumns();

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

  getPolicyListing() {
    this.policySummaryService.getPolicyListing(this.agentCode, this.clientProposerCode).subscribe((policyListing: PolicyListingDTO[]) => {
      console.log('policyListing', policyListing)
      this.policyListing = policyListing;
    })
  }

  onRowSelect(event: any) {
    this.selectedPolicy = event.data;
    console.log('Selected Policy:', this.selectedPolicy.policy_code);
    this.router.navigate(['/home/lms/grp/policy/policySummary'], {
              queryParams: {
                policyCode: this.selectedPolicy.policy_code,
                endorsementCode: this.selectedPolicy.endorsement_code,
                productCode: this.selectedPolicy.product_code
              },
            });
  }

  //search in table
  // applyFilter() {
  //   // Filter policies based on the search term
  //   this.policyListing = this.policyListing.filter(policy =>
  //     policy.description.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  // }

  applyFilter() {
    if (this.searchTerm.trim() !== '') {
      // Filter policies based on the search term
      this.policyListing = this.policyListing.filter(policy =>
        policy.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      // If search term is empty, reset to normal state
      this.policyListing = this.policyListing;
    }
  }

}
