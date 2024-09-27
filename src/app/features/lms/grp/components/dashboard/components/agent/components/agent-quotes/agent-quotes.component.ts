import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-agent-quotes',
  templateUrl: './agent-quotes.component.html',
  styleUrls: ['./agent-quotes.component.css']
})
export class AgentQuotesComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.quoteListingColumns();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/agent' },
      { label: 'Quotes', url: '/home/lms/grp/dashboard/agent-quotes' },
    ];
  }

  quoteListingColumns() {
    this.columnOptions = [
      { label: 'Quote number', value: 'quote_number' },
      { label: 'Product', value: 'product' },
      { label: 'Status', value: 'status' },
      { label: 'WEF date', value: 'wef_date' },
      { label: 'WET date', value: 'wet_date' },
      { label: 'Members', value: 'members' },
      { label: 'Premium', value: 'premium' },
      { label: 'Sum assured', value: 'sum_assured' }
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  quoteDetails: any[] = [
    {
      quote_number: 'Q12345',
      product_desc: 'Health Insurance',
      claim_number: 'CLM123456',
      status: 'Open',
      wef_date: '2023-01-01',
      wet_date: '2023-12-31',
      members: 5,
      premium: 200.00,
      sum_assured: 10000.00,
      member_name: 'John Doe',
      member_number: 'MEM1001',
      clm_amt_claimed: 1200.50
    },
    {
      quote_number: 'Q12346',
      product_desc: 'Life Insurance',
      claim_number: 'CLM123457',
      status: 'Closed',
      wef_date: '2023-02-01',
      wet_date: '2023-12-31',
      members: 3,
      premium: 400.00,
      sum_assured: 50000.00,
      member_name: 'Jane Smith',
      member_number: 'MEM1002',
      clm_amt_claimed: 8500.75
    },
    {
      quote_number: 'Q12347',
      product_desc: 'Car Insurance',
      claim_number: 'CLM123458',
      status: 'Open',
      wef_date: '2023-03-01',
      wet_date: '2023-12-31',
      members: 1,
      premium: 150.00,
      sum_assured: 15000.00,
      member_name: 'Robert Johnson',
      member_number: 'MEM1003',
      clm_amt_claimed: 3500.00
    },
    {
      quote_number: 'Q12348',
      product_desc: 'Travel Insurance',
      claim_number: 'CLM123459',
      status: 'Pending',
      wef_date: '2023-04-01',
      wet_date: '2023-12-31',
      members: 2,
      premium: 75.00,
      sum_assured: 5000.00,
      member_name: 'Emily Davis',
      member_number: 'MEM1004',
      clm_amt_claimed: 220.40
    },
    {
      quote_number: 'Q12349',
      product_desc: 'Home Insurance',
      claim_number: 'CLM123460',
      status: 'Closed',
      wef_date: '2023-05-01',
      wet_date: '2023-12-31',
      members: 4,
      premium: 300.00,
      sum_assured: 25000.00,
      member_name: 'Michael Brown',
      member_number: 'MEM1005',
      clm_amt_claimed: 15000.00
    }
  ];


}
