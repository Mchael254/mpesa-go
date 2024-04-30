import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-policy-listing',
  templateUrl: './policy-listing.component.html',
  styleUrls: ['./policy-listing.component.css']
})
export class PolicyListingComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];

    ngOnInit(): void {
      this.policyListColumns();
    }

    ngOnDestroy(): void {
      
    }

    data = [
      { polNum: 'ABC123', prod: 'Life Insurance', status: 'Active', date: '2022-03-15', premium: 1500, sumAssured: 100000 },
      { polNum: 'DEF456', prod: 'Health Insurance', status: 'Expired', date: '2021-12-10', premium: 2000, sumAssured: 50000 },
      { polNum: 'GHI789', prod: 'Car Insurance', status: 'Cancelled', date: '2023-05-20', premium: 1200, sumAssured: 30000 },
      { polNum: 'JKL012', prod: 'Home Insurance', status: 'Active', date: '2022-08-05', premium: 1800, sumAssured: 200000 },
      { polNum: 'MNO345', prod: 'Travel Insurance', status: 'Active', date: '2024-01-30', premium: 1000, sumAssured: 75000 }
    ];

    policyListColumns() {
      this.columnOptions = [
        { label: 'Policy number', value: 'polNum' },
        { label: 'Product', value: 'prod' },
        { label: 'Status', value: 'status' },
        { label: 'Effective date', value: 'date' },
        { label: 'Premium', value: 'premium' },
        { label: 'Sum assured', value: 'sumAssured' },
      ];
  
      this.selectedColumns = this.columnOptions.map(option => option.value);
    }
    

}
