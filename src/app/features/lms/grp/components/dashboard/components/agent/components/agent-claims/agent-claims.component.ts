import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-agent-claims',
  templateUrl: './agent-claims.component.html',
  styleUrls: ['./agent-claims.component.css']
})
export class AgentClaimsComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.claimListingColumns();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/agent' },
      { label: 'Claims', url: '/home/lms/grp/dashboard/agent-claims' },
    ];
  }

  claimListingColumns() {
    this.columnOptions = [
      { label: 'Claim no.', value: 'claim_no' },       // Claim no.
      { label: 'Policy no.', value: 'policy_no' },     // Policy no.
      { label: 'Status', value: 'status' },            // Status
      { label: 'Product', value: 'product_desc' },     // Product
      { label: 'Cover type', value: 'cover_type' },    // Cover type (if needed)
      { label: 'Claim on', value: 'wet_date' },        // Claim on (With effect to)
      { label: 'Sum assured', value: 'sum_assured' },  // Sum assured
      { label: 'Payable amount', value: 'premium' },   // Payable amount
      { label: 'Amount to be paid', value: 'amount_to_be_paid' } // Amount to be paid
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  claimDetails: any[] = [
    {
      claim_no: 'CLM12345',
      policy_no: 'P12345',
      product_desc: 'Health Insurance',
      status: 'Open',
      cover_type: 'Comprehensive',
      wet_date: '2023-12-31',
      sum_assured: 10000.00,
      premium: 200.00,           // Payable amount
      amount_to_be_paid: 180.00  // Amount to be paid
    },
    {
      claim_no: 'CLM12346',
      policy_no: 'P12346',
      product_desc: 'Life Insurance',
      status: 'Closed',
      cover_type: 'Term Life',
      wet_date: '2023-12-31',
      sum_assured: 50000.00,
      premium: 400.00,
      amount_to_be_paid: 380.00
    },
    {
      claim_no: 'CLM12347',
      policy_no: 'P12347',
      product_desc: 'Car Insurance',
      status: 'Open',
      cover_type: 'Third-Party',
      wet_date: '2023-12-31',
      sum_assured: 15000.00,
      premium: 150.00,
      amount_to_be_paid: 140.00
    },
    {
      claim_no: 'CLM12348',
      policy_no: 'P12348',
      product_desc: 'Travel Insurance',
      status: 'Pending',
      cover_type: 'International',
      wet_date: '2023-12-31',
      sum_assured: 5000.00,
      premium: 75.00,
      amount_to_be_paid: 70.00
    },
    {
      claim_no: 'CLM12349',
      policy_no: 'P12349',
      product_desc: 'Home Insurance',
      status: 'Closed',
      cover_type: 'Full Coverage',
      wet_date: '2023-12-31',
      sum_assured: 25000.00,
      premium: 300.00,
      amount_to_be_paid: 280.00
    }
  ];



}

