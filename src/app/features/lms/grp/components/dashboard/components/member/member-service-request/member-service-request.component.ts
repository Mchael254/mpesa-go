import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';

const log = new Logger("MemberServiceRequestComponent");
@Component({
  selector: 'app-member-service-request',
  templateUrl: './member-service-request.component.html',
  styleUrls: ['./member-service-request.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberServiceRequestComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  columnOptions: SelectItem[];
  selectedColumns: string[];
  selectedRowIndex: number;
  newServiceReqForForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.serviceReqListingColumns();
    this.populateBreadCrumbItems();

  }

  ngOnDestroy(): void {

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
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
      { label: 'Service request', url: '/home/lms/grp/dashboard/member-service-request' },
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

  showServiceReqSummary() {
    const modal = document.getElementById('serviceReqSummaryModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeServiceReqSummary() {
    const modal = document.getElementById('serviceReqSummaryModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  showNewServiceReqModall() {
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

  onReceiptsTableRowClick(memberPensionDepReceipts, index: number) {
    this.selectedRowIndex = index;
    if(memberPensionDepReceipts){
      this.showServiceReqSummary();
    }
  }

}
