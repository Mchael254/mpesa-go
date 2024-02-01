import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-reinsurance-listing',
  templateUrl: './reinsurance-listing.component.html',
  styleUrls: ['./reinsurance-listing.component.css']
})
export class ReinsuranceListingComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];

  ngOnInit(): void {
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

  dummyData = [
    {
      code: 1,
      policy_number: 'POL001',
      description: 'Life Insurance',
      status: 'Active',
      effective_date: '2022-01-01',
      total_premium: 1500.00,
      total_sum_assured: 100000
    },
    {
      code: 2,
      policy_number: 'POL002',
      description: 'Health Insurance',
      status: 'Expired',
      effective_date: '2022-03-15',
      total_premium: 800.00,
      total_sum_assured: 50000
    },
    {
      code: 2,
      policy_number: 'POL002',
      description: 'Health Insurance',
      status: 'Expired',
      effective_date: '2022-03-15',
      total_premium: 800.00,
      total_sum_assured: 50000
    },
    {
      code: 1,
      policy_number: 'POL001',
      description: 'Life Insurance',
      status: 'Active',
      effective_date: '2022-01-01',
      total_premium: 1500.00,
      total_sum_assured: 100000
    },
  ];
  
}
