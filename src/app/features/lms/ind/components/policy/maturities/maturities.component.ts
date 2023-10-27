import { Component } from '@angular/core';
import { TableDetail } from 'src/app/shared/data/table-detail';

@Component({
  selector: 'app-maturities',
  templateUrl: './maturities.component.html',
  styleUrls: ['./maturities.component.css']
})
export class MaturitiesComponent {
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
    showSorting: false,
    paginator: false,
  };

  constructor(){}

  paginate(e: any){}

  selectRow(e:any){}

}
