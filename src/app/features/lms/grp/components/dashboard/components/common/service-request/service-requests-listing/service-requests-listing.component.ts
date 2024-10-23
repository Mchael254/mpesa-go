import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { SESSION_KEY } from "../../../../../../../util/session_storage_enum";
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

const log = new Logger("ServiceRequestsListingComponent");
@Component({
  selector: 'app-service-requests-listing',
  templateUrl: './service-requests-listing.component.html',
  styleUrls: ['./service-requests-listing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceRequestsListingComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  columnOptions: SelectItem[];
  selectedColumns: string[];
  selectedRowIndex: number;
  newServiceReqForForm: FormGroup;
  entityType: string;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private session_storage: SessionStorageService,
  ) { }

  ngOnInit(): void {
    this.serviceReqListingColumns();
    this.populateBreadCrumbItems();
    this.getData();

  }

  ngOnDestroy(): void {

  }

  getData() {
    this.entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    const userProfileData = this.session_storage.get('memberProfile');
  }

  newRequestForm() {
    this.newServiceReqForForm = this.fb.group({
      investigator: [""],
      requestDate: [""],
      submissionDate: [""],
      remarks: [""],
      invoiceNumber: [""],
      invoiceDate: [""],
      invoiceAmount: [""],
      paymentMode: [""],
      accountNumber: [""],
    });
  }

  populateBreadCrumbItems(): void {
    const dashboardUrl = this.entityType === 'MEMBER'
      ? '/home/lms/grp/dashboard/dashboard-screen'
      : this.entityType === 'ADMIN'
        ? '/home/lms/grp/dashboard/admin'
        : this.entityType === 'AGENT'
          ? '/home/lms/grp/dashboard/agent'
          : '/home/lms/grp/dashboard/dashboard-screen';
    this.breadCrumbItems = [
      { label: 'Dashboard', url: dashboardUrl },
      { label: 'Service request', url: '/home/lms/grp/dashboard/member-service-requests' },
    ];
  }

  serviceReqListingColumns() {
    this.columnOptions = [
      { label: 'Request ID', value: 'req' },
      { label: 'Category', value: 'req' },
      { label: 'Category type', value: 'req' },
      { label: 'Status', value: 'req' },
      { label: 'Date submitted', value: 'req' },
      { label: 'Policy number', value: 'req' },
      { label: 'Assigned to', value: 'req' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

  detailedMemContrReceipts = [];
  memberPensionDepReceipts = [];
  serviceReqListing = [
    { req: 'text' },
    { req: 'text' },
    { req: 'text' },
  ];
  serviceReqSummary = 'req';

  // showServiceReqSummary() {
  //   const modal = document.getElementById('serviceReqSummaryModal');
  //   if (modal) {
  //     modal.classList.add('show');
  //     modal.style.display = 'block';
  //   }
  // }

  // closeServiceReqSummary() {
  //   const modal = document.getElementById('serviceReqSummaryModal');
  //   if (modal) {
  //     modal.classList.remove('show')
  //     modal.style.display = 'none';
  //   }
  // }

  // showNewServiceReqModall() {
  //   const modal = document.getElementById('newServiceReqModal');
  //   if (modal) {
  //     modal.classList.add('show');
  //     modal.style.display = 'block';
  //   }
  // }

  // closeNewServiceReqModal() {
  //   const modal = document.getElementById('newServiceReqModal');
  //   if (modal) {
  //     modal.classList.remove('show')
  //     modal.style.display = 'none';
  //   }
  // }

  onReceiptsTableRowClick(memberPensionDepReceipts, index: number) {
    this.selectedRowIndex = index;
    if (memberPensionDepReceipts) {
      this.router.navigate(['/home/lms/grp/dashboard/service-request-details']);
    }
  }

  newServiceReq() {
    this.router.navigate(['/home/lms/grp/dashboard/new-service-request']);
  }

}
