import { Component } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PoliciesService } from 'src/app/features/lms/service/policies/policies.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

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

  constructor(private policy_service: PoliciesService, private spinner_service: NgxSpinnerService, private session_storage_service: SessionStorageService){
    this.listPolicyMaturities()
  }
  
  ngOnInit(): void {
  }

  public listPolicyMaturities(){
    let pol_code = StringManipulation.returnNullIfEmpty(this.session_storage_service.getItem(SESSION_KEY.POL_CODE));
    pol_code = pol_code===null ? 0 : pol_code;
    this.spinner_service.show('maturities')
    this.policy_service.listPolicyMaturities().subscribe((data: any[]) =>{
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

