import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EndorsementService } from 'src/app/features/lms/service/endorsement/endorsement.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css']
})
@AutoUnsubscribe
export class ExceptionsComponent implements OnInit {
  exceptionFormModal: FormGroup;

  colsInd = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' },
    { field: 'type', header: 'Type' },
    {field: 'captured_by', header: 'Captured By'}
  ];
  webQuoteTotalLength = 0;

  exceptionList: TableDetail= {
    cols: this.colsInd,
    rows: [],
    // globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: false,
    paginator: false,
  };

  constructor(private endorsement_service: EndorsementService, private session_storage_service: SessionStorageService, private spinner_service: NgxSpinnerService, private fb: FormBuilder){}
  ngOnInit(): void {
    this.exceptionFormModal = this.fb.group({
      type: [],
      value: []

    })
    this.spinner_service.show('exceptions');
    let pol_code = StringManipulation.returnNullIfEmpty(this.session_storage_service.getItem(SESSION_KEY.POL_CODE));
    pol_code = pol_code===null ? 0 : pol_code;
    this.endorsement_service.getListOfExceptionsByPolCode().subscribe((data:any) => {
      this.exceptionList['rows'] = data
      console.log(data);
      this.spinner_service.hide('exceptions');
      
    }, err=>{
      this.spinner_service.hide('exceptions');
    })

  }

  deleteException(item:any){ 
    this.spinner_service.show();
    console.log(item); 
    let pol_code = StringManipulation.returnNullIfEmpty(this.session_storage_service.getItem(SESSION_KEY.POL_CODE));
    pol_code = pol_code===null ? 0 : pol_code;
    let endr_code = item['code'];
    // this.endorsement_service.deleteExceptionsByPolCode(pol_code, endr_code).subscribe(data => {
    //   this.exceptionList.rows = this.exceptionList.rows.filter(data => {data?.code !== item?.code});
    // }, err=>{
    //   this.spinner_service.hide();
    // })
  }


  openModal(name ='UnderWritingExceptionModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeModal(name ='UnderWritingExceptionModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveException(){}

  paginate(e: any){}

  selectRow(e:any){}

}
