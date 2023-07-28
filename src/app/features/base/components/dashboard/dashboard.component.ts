import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class DashboardComponent {

  cols = [
    { field: 'policyNumber', header: 'Policy Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
  ];

  rows = [
    { policyNumber: 'TA823151', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823152', type: 'Travel', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823159', type: 'Marine', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823158', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
    { policyNumber: 'TA823150', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00'},
  ];

  globalFilterFields = ['policyNumber', 'type', 'insured', 'status', 'premium'];

  tableDetails: TableDetail = {
    cols: this.cols,
    rows: this.rows,
    // rowsPerPage: 2,
    globalFilterFields: this.globalFilterFields,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
    url: 'entities',
    urlIdentifier: 'policyNumber'
  }

  cols2 = [
    { field: 'policyNumber', header: 'Policy Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
    { field: 'options', header: 'Options' },
  ];

  rows2 = [
    { policyNumber: 'TA823151', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00', options: 'View'},
    { policyNumber: 'TA823152', type: 'Travel', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00',options: 'View' },
    { policyNumber: 'TA823159', type: 'Marine', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00', options: 'View'},
    { policyNumber: 'TA823158', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00', options: 'View'},
    { policyNumber: 'TA823150', type: 'Motor', insured: 'John Doe', status: 'Active', premium: 'KSH 40,000.00', options: 'View'},
  ];

  globalFilterFields2 = ['policyNumber', 'type', 'insured', 'status', 'premium'];

  tableDetails2: TableDetail = {
    cols: this.cols2,
    rows: this.rows2,
    // rowsPerPage: 3,
    globalFilterFields: this.globalFilterFields2,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
  }
}

export interface TableDetail {
  cols: {field: string, header: string}[],
  rows: any[],
  rowsPerPage?: number,
  globalFilterFields: string[],
  showFilter: boolean,
  showSorting: boolean,
  title: string,
  paginator: boolean,
  url?: string,
  urlIdentifier?: string,
}
