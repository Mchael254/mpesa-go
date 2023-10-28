import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, map, switchMap } from 'rxjs';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { QuotationService } from 'src/app/features/lms/service/quotation/quotation.service';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { Logger } from 'src/app/shared/services';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

const logger = new Logger('QuotationComponent');
@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css'],
})
export class QuotationListComponent implements OnInit {
  fieldsets: any[];
  buttonConfig: any;
  page: any;
  stepsData: any[];
  rowsInd: any[] = [];
  productList: any[];
  webQuoteTotalLength: number;

  constructor(
    private quotation_service: QuotationService,
    private product_service: ProductService,
    private router: Router,
    private session_service: SessionStorageService,
    private spinner: NgxSpinnerService,
  ) {
    this.getListOfWebQuote();
  }
  ngOnInit(): void {}

  paginate(value){
    let pageObj = {...value};
    let page = 0;
    page = Math.round(pageObj['first']/pageObj['rows']);
    if(pageObj['first']===0) page=0;
    this.getListOfWebQuote(page, pageObj['rows'])
  }

  getListOfWebQuote(page=0, size=5) {
    this.spinner.show('lms_ind_view');
    this.product_service
      .getListOfProduct()
      .pipe(
        switchMap((x: any[]) => {
          return this.quotation_service
            .getLmsIndividualQuotationWebQuoteList(page, size)
            .pipe(map((data) =>{
              console.log(data);
              this.webQuoteTotalLength = Number(data['total_elements']);

              return data['content']}))
            .pipe(
              map((data_) => {
                return data_.map((da) => {
                  da['product_desc'] = x.filter((xa) => {
                    return xa['code'] === da['product_code'];
                  })[0]['description'];
                  return da;
                });
              }),
              finalize(() => {
                this.spinner.hide('lms_ind_view');
              })

            );
        })
      )
      .subscribe((data) => {
        this.quotationListInd['rows'] = data;

      },
      (err) => {this.spinner.hide('lms_ind_view')});
  }

  cols = [
    { field: 'quotationNo', header: 'Quotation Number' },
    { field: 'type', header: 'Type' },
    { field: 'insured', header: 'Insured' },
    { field: 'status', header: 'Status' },
    { field: 'premium', header: 'Premium' },
  ];

  colsInd = [
    { field: 'quote_no', header: 'Quotation No' },
    { field: 'premium', header: 'Premium Amt.' },
    // { field: 'payment_status', header: 'Payment Status' },
    { field: 'quote_type', header: 'Quote Type' },
    { field: 'product_desc', header: 'Product' },
  ];

  rows = [
    {
      policyNumber: 'TA823151',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823152',
      type: 'Travel',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823159',
      type: 'Marine',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823158',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
    {
      policyNumber: 'TA823150',
      type: 'Motor',
      insured: 'John Doe',
      status: 'Active',
      premium: 'KSH 40,000.00',
    },
  ];

  globalFilterFields = ['quotationNo', 'type', 'insured', 'status', 'premium'];
  globalFilterFieldsInd = ['quote_no', 'premium'];

  policyDataTable: TableDetail = {
    cols: this.cols,
    rows: this.rows,
    globalFilterFields: this.globalFilterFields,
    showFilter: false,
    showSorting: false,
    title: 'A list of policies transacted',
    paginator: true,
    url: 'entities',
    urlIdentifier: 'policyNumber',
  };

  quotationListInd: TableDetail = {
    cols: this.colsInd,
    rows: this.rowsInd,
    globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: false,
    paginator: true,
  };

  applyFilterGlobal($event, stringVal) {
    // this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  selectRow(i: any) {
    // console.log(i);
    this.session_service.set('quote_code', i['quote_no']);
    this.session_service.set('client_code', i['client_code']);
    this.session_service.set('quick_code', i['code']);
    this.session_service.set('proposal_code', i['proposal_no']);
    this.router.navigate(['/home/lms/ind/quotation/client-details']);
  }

  submitForm(data: any) {
    logger.info(data);
  }
  goBack(data?: any) {
    if (data != null) {
    }
    logger.info('GO BACK');
  }
}
