import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {TableDetail} from "../../../../../../../shared/data/table-detail";
import {Utils} from "../../../../../util/util";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {PoliciesService} from "../../../../../service/policies/policies.service";


@Component({
  selector: 'app-maturities',
  templateUrl: './maturities.component.html',
  styleUrls: ['./maturities.component.css']
})
export class MaturitiesComponent {
  colsInd = [
    { field: 'paid', header: 'Paid' },
    { field: 'maturity_type', header: 'Maturity Type' },
    { field: 'paid_date', header: 'Paid Date', date:true },
    { field: 'expected_date', header: 'Expected Date', date:true },
    { field: 'percent', header: 'Percentage(%)' },
    { field: 'amt', header: 'Amount' },
  ];

  maturityList: any[] = [];
  webQuoteTotalLength = 0;
  rowsInd: any[] = [];

  quotationListInd: TableDetail= {
    cols: this.colsInd,
    rows: this.rowsInd,
    showFilter: false,
    showSorting: false,
    paginator: false,
  };
  util: Utils;

  constructor(private policy_service: PoliciesService, private spinner_service: NgxSpinnerService, private session_storage_service: SessionStorageService){
    this.util = new Utils(this.session_storage_service);

    this.listPolicyMaturities()

  }

  ngOnInit(): void {
  }

  public listPolicyMaturities(){
    this.spinner_service.show('maturities')
    this.policy_service.listPolicyMaturities(this.util.getPolCode()).subscribe((data: any[]) =>{
      data = data.map(r => {
        r['paid'] = r['paid']==='N' ? 'Not Paid': 'Paid';
        r['maturity_type'] = r['maturity_type']==='P'?'Partial':'Full';
        return r
      })

      this.quotationListInd['rows'] = data
      this.spinner_service.hide('maturities')
    }, err=>{
      this.spinner_service.hide('maturities');
    })
  }

  paginate(e: any){}

  selectRow(e:any){}

}

