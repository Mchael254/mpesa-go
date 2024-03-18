import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { EndorsementService } from 'src/app/features/lms/service/endorsement/endorsement.service';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { StringManipulation } from 'src/app/features/lms/util/string_manipulation';
import { Utils } from 'src/app/features/lms/util/util';
import { TableDetail } from 'src/app/shared/data/table-detail';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

@Component({
  selector: 'app-exceptions',
  templateUrl: './exceptions.component.html',
  styleUrls: ['./exceptions.component.css'],
})
@AutoUnsubscribe
export class ExceptionsComponent implements OnInit {
  exceptionFormModal: FormGroup;

  colsInd = [
    { field: 'name', header: 'Name' },
    { field: 'description', header: 'Description' }, 
    { field: 'value', header: 'Value' },
    { field: 'type', header: 'Type' },
    { field: 'captured_by', header: 'Captured By' },
    { field: 'authorized', header: 'Authorize' },
    { field: 'authorized_by', header: 'Authorize By' },
    
  ];
  webQuoteTotalLength = 0;

  exceptionList: TableDetail = {
    cols: this.colsInd,
    rows: [],
    // globalFilterFields: this.globalFilterFieldsInd,
    showFilter: false,
    showSorting: false,
    paginator: false,
  };
  util: Utils;
  exceptionTypeList: any[];

  constructor(
    private endorsement_service: EndorsementService,
    private session_storage_service: SessionStorageService,
    private spinner_service: NgxSpinnerService,
    private toast_service: ToastService,
    private fb: FormBuilder
  ) {
    this.util = new Utils(this.session_storage_service);
  }
  ngOnInit(): void {
    this.exceptionFormModal = this.fb.group({
      code: [],
      le_code: [null, Validators.required],
      value: [null, Validators.required],
    });

    this.listExceptionTypesByPolCode();
    this.getListOfExceptionsByEndrCode();
    this.getListOfExceptionsByPolCode();
  }

  listExceptionTypesByPolCode() {
    this.endorsement_service
      .listExceptionTypesByPolCode(this.util.getPolCode())
      .subscribe((data: any[]) => {
        this.exceptionTypeList = data;
        console.log(data);
      });
  }

  getListOfExceptionsByEndrCode() {
    this.endorsement_service
      .getListOfExceptionsByEndrCode(this.util.getEndrCode())
      .subscribe((data) => {
        console.log(data);
      });
  }

  getListOfExceptionsByPolCode() {
    this.spinner_service.show('exceptions');
    this.endorsement_service
      .getListOfExceptionsByEndrCode(this.util.getEndrCode())
      .subscribe(
        (response: any) => {
          this.exceptionList['rows'] = response.map((data: any) => ({
            ...data,
            authorized: data['authorized'] === 'N' ? 'False' : 'True',
          }));
          this.spinner_service.hide('exceptions');
        },
        (err) => {
          console.log(err);
          this.spinner_service.hide('exceptions');
        }
      );
  }

  deleteException(item: any) {
    this.spinner_service.show('exceptions');
    console.log(item);

    this.endorsement_service
      .deleteExceptionsByPolCode(item['code'], this.util.getEndrCode())
      .subscribe(
        (data) => {
          this.getListOfExceptionsByPolCode();
          console.log(data);
          this.spinner_service.hide('exceptions');
          this.toast_service.success(
            'Delete data successfully',
            'Exception Details'.toUpperCase()
          );
        },
        (err) => {
          console.log(err);
          this.toast_service.danger(
            'Fail to delete data successfully',
            'Exception Details'.toUpperCase()
          );
          this.spinner_service.hide('exceptions');
        }
      );
  }

  openModal(name = 'UnderWritingExceptionModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeModal(name = 'UnderWritingExceptionModal') {
    const modal = document.getElementById(name);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveException() {
    let request = { ...this.exceptionFormModal.value };
    console.log(request);
    request = {
      authorized: 'N',
      exception_process: 'C',
      ...request,
    };
    request['le_code'] = StringManipulation.returnNullIfEmpty(
      request['le_code']
    );
    if (request['authorized'] === 'True') {
      request['authorized'] = 'Y';
    } else if (request['authorized'] === 'False') {
      request['authorized'] = 'N';
    }
    if (!(request?.le_code && request?.value)) {
      this.toast_service.danger(
        'Exception type or value is empty!',
        'Exception Details'.toUpperCase()
      );
      return;
    }
    this.spinner_service.show('exceptions');
    this.endorsement_service
      .createEndorsementException(request, this.util.getEndrCode())
      .subscribe(
        (data) => {
          this.closeModal();
          this.getListOfExceptionsByPolCode();
          this.spinner_service.hide('exceptions');
          this.toast_service.success(
            'Save data successfully',
            'Exception Details'.toUpperCase()
          );
          this.exceptionFormModal.reset();
        },
        (err) => {
          this.toast_service.danger(
            err.error.errors[0],
            'Exception Details'.toUpperCase()
          );
          this.spinner_service.hide('exceptions');
        }
      );
  }

  editException(index: any) {
    this.openModal();
    let rows = [...this.exceptionList.rows];
    if (rows.length > 0) {
      let data = rows[index];
      this.exceptionFormModal.patchValue(data);
    }
  }

  paginate(e: any) {}

  selectRow(e: any) {}
}
