import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-service-requests-dashboard',
  templateUrl: './service-requests-dashboard.component.html',
  styleUrls: ['./service-requests-dashboard.component.css']
})
export class ServiceRequestsDashboardComponent implements OnInit, OnDestroy {
  columnOptions: SelectItem[];
  selectedColumns: string[];

  constructor() { }

  ngOnInit(): void {
    this.serviceReqListingColumns();

  }

  ngOnDestroy(): void {

  }

  serviceReqListing = [
    { req: 'text' },
    { req: 'text' },
    { req: 'text' },
  ];

  serviceReqListingColumns() {
    this.columnOptions = [
      { label: 'Request ID', value: 'req' },
      { label: 'Category', value: 'req' },
      { label: 'Category type', value: 'req' },
      { label: 'Status', value: 'req' },
      { label: 'Date submitted', value: 'req' },
      { label: 'Policy number', value: 'req' },
      { label: 'Assigned to', value: 'req' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

}
