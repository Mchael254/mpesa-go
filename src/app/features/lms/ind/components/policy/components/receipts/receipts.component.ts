import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {TableDetail} from "../../../../../../../shared/data/table-detail";
import {Utils} from "../../../../../util/util";
import {PoliciesService} from "../../../../../service/policies/policies.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit{

  colsInd = [
    { field: 'receipt_no', header: 'Receipt No.' },
    { field: 'receipt_date', header: 'Receipt Date', date: true},
    { field: 'drcr', header: 'DR/CR' },
    { field: 'balance', header: 'Balance' },
    { field: 'amt', header: 'Amount' },
    { field: 'allocated_amt', header: 'Allocated Amount' },
  ];

  webQuoteTotalLength = 0;

  quotationListInd: TableDetail= {
    cols: this.colsInd,
    rows: [],
    // globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: false,
    paginator: false,
  };
  util: Utils;

  constructor(private policy_service: PoliciesService, private spinner_service: NgxSpinnerService, private session_storage_service: SessionStorageService){}
  ngOnInit(): void {
    this.util = new Utils(this.session_storage_service);
    this.listPolicyReceipts();
  }

  public listPolicyReceipts(){

    this.spinner_service.show()

    this.policy_service.listPolicyReceipts(this.util.getPolCode()).subscribe((data: any) =>{
      this.quotationListInd['rows'] = data
      this.spinner_service.hide()
    }, err =>{
      this.spinner_service.hide();
    })
  }

  paginate(e: any){}

  selectRow(e:any){}

}
