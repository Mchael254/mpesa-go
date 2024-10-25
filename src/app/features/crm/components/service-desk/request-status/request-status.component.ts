import {Component, OnInit} from '@angular/core';
import {Logger} from "../../../../../shared/services";
import {FormBuilder, FormGroup} from "@angular/forms";

const log = new Logger('RequestStatusComponent');
@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.css']
})
export class RequestStatusComponent implements OnInit {

  pageSize: 5;
  requestStatusData: any;

  editMode: boolean = false;
  serviceRequestStatusForm: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.serviceRequestStatusCreateForm()
  }

  serviceRequestStatusCreateForm() {
    this.serviceRequestStatusForm = this.fb.group({
      name: [''],
      shtDesc: [''],
      status: ['']
    });
  }

  openServiceRequestStatusModal() {
    const modal = document.getElementById('serviceRequestStatusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeServiceRequestStatusModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceRequestStatusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveServiceRequestStatus() {

  }
}
