import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';


const log = new Logger("ServiceRequestComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.css']
})
export class ServiceRequestComponent implements OnInit, OnDestroy {
  selectedRowIndex: number;
  newRequestForm: FormGroup;
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.newReqFormCreation();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
      { label: 'Service request', url: '/home/lms/grp/service-request/service-request' },
    ];
  }

  newReqFormCreation() {
    this.newRequestForm = this.fb.group({
      category: ["", Validators.required],
      categoryType: ["", Validators.required],
      policy: ["", Validators.required],
      policyMembers: [27, Validators.required],
      contactMethod: ["", Validators.required],
      contactTime: ["", Validators.required],
      dueDate: ["", Validators.required],
      summary: ["", Validators.required],
      description: ["", Validators.required],
      fileUpload: ["", Validators.required],
    });
  }

  dummyData = [
    {
      receiptNumber: "001",
      category: "Complaint",
      summary: "Wrong receipted amount",
      date: "2024-04-10",
      status: "Inprogress",
      dueDate: "2024-04-25",
      lapsedDate: "13 days"
    },
    {
      receiptNumber: "002",
      category: "Complaint",
      summary: "Wrong receipted amount",
      date: "2024-04-12",
      status: "Pending",
      dueDate: "2024-04-30",
      lapsedDate: "15 days"
    },
    {
      receiptNumber: "003",
      category: "Complaint",
      summary: "Wrong receipted amount",
      date: "2024-04-15",
      status: "Delivered",
      dueDate: "2024-05-05",
      lapsedDate: "20 days"
    },
    {
      receiptNumber: "004",
      category: "Complaint",
      summary: "Wrong receipted amount",
      date: "2024-04-18",
      status: "Received",
      dueDate: "2024-05-08",
      lapsedDate: "24 days"
    },
    {
      receiptNumber: "005",
      category: "Complaint",
      summary: "Wrong receipted amount",
      date: "2024-04-20",
      status: "Pending",
      dueDate: "2024-05-10",
      lapsedDate: "20 days"
    }
  ];

  onReceiptsTableRowClick(dummyData, index: number) {
    this.selectedRowIndex = index;
    if (dummyData) {
      log.info("dummydataPassed", dummyData);
      this.showServiceReqSummaryModal();
    }
  }

  showServiceReqSummaryModal() {
    const modal = document.getElementById('serviceReqSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeServiceReqSummaryModal() {
    const modal = document.getElementById('serviceReqSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showNewServiceReqModal() {
    const modal = document.getElementById('newServiceReqModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeNewServiceReqModal() {
    const modal = document.getElementById('newServiceReqModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  submitNewReqForm() {
    log.info(this.newRequestForm.value)
  }


}
