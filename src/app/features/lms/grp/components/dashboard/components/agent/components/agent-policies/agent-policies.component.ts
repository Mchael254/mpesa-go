import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-agent-policies',
  templateUrl: './agent-policies.component.html',
  styleUrls: ['./agent-policies.component.css']
})
export class AgentPoliciesComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.policyListingColumns();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/agent' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/agent-policies' },
    ];
  }

  policyListingColumns() {
    this.columnOptions = [
      { label: 'Policy no.', value: 'policy_no' },
      { label: 'Product', value: 'product' },
      { label: 'Status', value: 'status' },
      { label: 'With effect to', value: 'wet_date' },
      { label: 'Sum assured', value: 'sum_assured' },
      { label: 'Premium', value: 'premium' },
      { label: 'Members', value: 'members' }
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  policyDetails: any[] = [
    {
      policy_no: 'P12345',
      product_desc: 'Health Insurance',
      status: 'Open',
      wef_date: '2023-01-01',
      wet_date: '2023-12-31',
      members: 5,
      premium: 200.00,
      sum_assured: 10000.00
    },
    {
      policy_no: 'P12346',
      product_desc: 'Life Insurance',
      status: 'Closed',
      wef_date: '2023-02-01',
      wet_date: '2023-12-31',
      members: 3,
      premium: 400.00,
      sum_assured: 50000.00
    },
    {
      policy_no: 'P12347',
      product_desc: 'Car Insurance',
      status: 'Open',
      wef_date: '2023-03-01',
      wet_date: '2023-12-31',
      members: 1,
      premium: 150.00,
      sum_assured: 15000.00
    },
    {
      policy_no: 'P12348',
      product_desc: 'Travel Insurance',
      status: 'Pending',
      wef_date: '2023-04-01',
      wet_date: '2023-12-31',
      members: 2,
      premium: 75.00,
      sum_assured: 5000.00
    },
    {
      policy_no: 'P12349',
      product_desc: 'Home Insurance',
      status: 'Closed',
      wef_date: '2023-05-01',
      wet_date: '2023-12-31',
      members: 4,
      premium: 300.00,
      sum_assured: 25000.00
    }
  ];


}
