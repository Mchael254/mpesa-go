import { Component } from '@angular/core';
import { TableDetail } from 'src/app/shared/data/table-detail';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent {

  colsInd = [
    { field: 'quote_no', header: 'Quote No' },
    { field: 'premium', header: 'Client.' },
    { field: 'payment_status', header: 'Assigned' },
    { field: 'quote_type', header: 'Insurance Type' },
    { field: 'product_desc', header: 'Quotation Date' },
  ];
  webQuoteTotalLength = 0;
  rowsInd: any[] = [];

  quotationListInd: TableDetail= {
    cols: this.colsInd,
    rows: this.rowsInd,
    // globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: true,
    paginator: true,
  };

  constructor(){}

  paginate(e: any){}

  selectRow(e:any){}

}
