import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-my-policies',
  templateUrl: './my-policies.component.html',
  styleUrls: ['./my-policies.component.css']
})
export class MyPoliciesComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.myPolicyListingColumns();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/agent' },
      { label: 'My policies', url: '/home/lms/grp/dashboard/agent-individual-policies' },
    ];
  }

  myPolicyListingColumns() {
    this.columnOptions = [
      { label: 'Quote no.', value: 'policy_no' },
      { label: 'Client', value: 'client' },
      { label: 'Product', value: 'product' },
      { label: 'Status', value: 'status' },
      { label: 'Effective date', value: 'effective_date' },
      { label: 'Premium', value: 'premium' }, 
      { label: 'Sum assured', value: 'sum_assured' },
    ];
  
    this.selectedColumns = this.columnOptions.map(option => option.value);
  }
  

  myPolicyDetails = [
    {
      policy_no: 'Q1001',
      client: 'John Doe',
      product: 'Life Insurance',
      status: 'Active',
      effective_date: '2024-01-01',
      premium: 4500,
      sum_assured: 1000000
    },
    {
      policy_no: 'Q1002',
      client: 'Jane Smith',
      product: 'Health Insurance',
      status: 'Pending',
      effective_date: '2023-12-15',
      premium: 3500,
      sum_assured: 500000
    },
    {
      policy_no: 'Q1003',
      client: 'XYZ Corporation',
      product: 'Corporate Health Insurance',
      status: 'Active',
      effective_date: '2023-10-25',
      premium: 12000,
      sum_assured: 3000000
    },
    {
      policy_no: 'Q1004',
      client: 'Emily Brown',
      product: 'Auto Insurance',
      status: 'Lapsed',
      effective_date: '2023-11-10',
      premium: 800,
      sum_assured: 150000
    },
    {
      policy_no: 'Q1005',
      client: 'Michael Green',
      product: 'Travel Insurance',
      status: 'Expired',
      effective_date: '2023-09-01',
      premium: 600,
      sum_assured: 50000
    }
  ];
  

}
