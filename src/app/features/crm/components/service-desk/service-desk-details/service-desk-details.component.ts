import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-service-desk-details',
  templateUrl: './service-desk-details.component.html',
  styleUrls: ['./service-desk-details.component.css']
})
export class ServiceDeskDetailsComponent implements OnInit {
  pageSize: 5;
  openRequestsData: any;
  closedRequestsData: any;
  clientsCommentsData: any;
  serviceRequestDocsData: any;
  agencyCommissionData: any;
  serviceProviderFeesData: any;

  editMode: boolean = false;
  clientDetailsForm: FormGroup;
  requestDetailsForm: FormGroup;
  clientCommentsForm: FormGroup;
  requestDocsForm: FormGroup;
  serviceProviderFeesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) { }
  ngOnInit(): void {
    this.clientDetailsCreateForm();
    this.requestDetailsCreateForm();
    this.clientCommentsCreateForm();
    this.requestDocsCreateForm();
    this.serviceProviderFeesCreateForm();
  }

  clientDetailsCreateForm() {
    this.clientDetailsForm = this.fb.group({
      telNo: [''],
      telNoTwo: [''],
      emailAddress: [''],
      emailAddressTwo: [''],
      gender: [''],
      marital: [''],
      tinNo: [''],
      postalAddress: [''],
      physicalAddress: ['']
    });
  }

  requestDetailsCreateForm() {
    this.requestDetailsForm = this.fb.group({
      polNo: [''],
      requestCategory: [''],
      incident: [''],
      requestSource: [''],
      accountType: [''],
      account: [''],
      summary: [''],
      desc: [''],
      captureDate: [''],
      requestDate: [''],
      receiveDate: [''],
      dueDate: [''],
      assignee: [''],
      reporter: [''],
      ownerAccountType: [''],
      status: [''],
      closedBy: [''],
      resolutionDate: [''],
      solution: [''],
      comments: [''],
      prefCommMode: [''],
      primaryMode: ['']
    });
  }

  clientCommentsCreateForm() {
    this.clientCommentsForm = this.fb.group({
      dateCaptured: [''],
      postedBy: [''],
      clientComments: [''],
      solution: ['']
    });
  }

  requestDocsCreateForm() {
    this.requestDocsForm = this.fb.group({
      docType: [''],
      referenceNo: [''],
      receivedBy: [''],
      dateCreated: [''],
      remarks: ['']
    });
  }

  serviceProviderFeesCreateForm() {
    this.serviceProviderFeesForm = this.fb.group({
      clientName: [''],
      policyNo: [''],
      description: [''],
      fee: ['']
    });
  }

  openClientDetailsModal() {
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeClientDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('clientDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestDetailsModal() {
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRequestDetailsModal() {
    this.editMode = false;
    const modal = document.getElementById('newCaseModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openClientCommentModal() {
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeClientCommentModal() {
    this.editMode = false;
    const modal = document.getElementById('clientCommentsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openRequestDocsModal() {
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeRequestDocsModal() {
    this.editMode = false;
    const modal = document.getElementById('requestDocsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  openServiceProviderFeesModal() {
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }
  closeServiceProviderFeesModal() {
    this.editMode = false;
    const modal = document.getElementById('serviceProviderFeesModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  saveClientDetails() {

  }


  saveRequestDetails() {

  }

  saveServiceProviderFeeDetails() {

  }
}
