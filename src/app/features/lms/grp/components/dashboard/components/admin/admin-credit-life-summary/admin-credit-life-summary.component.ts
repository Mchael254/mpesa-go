import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-credit-life-summary',
  templateUrl: './admin-credit-life-summary.component.html',
  styleUrls: ['./admin-credit-life-summary.component.css']
})
export class AdminCreditLifeSummaryComponent implements OnInit, OnDestroy {
  selectedContent: string = 'summary'
  selectedPolicyNumber: string = 'CL/006/005';
  breadCrumbItems: BreadCrumbItem[] = [];
  columnOptions: SelectItem[];
  selectedColumns: string[];
  constructor() { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.policyListingColumns();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/credit-life' },
    ];
  }

  policyListingColumns() {
    this.columnOptions = [
      { label: 'Product', value: 'product' },
      { label: 'Claim number', value: 'claim_number' },
      { label: 'Member', value: 'member' },
      { label: 'Member number', value: 'mem_no' },
      { label: 'Claim amount', value: 'claim_amnt' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }


  showContent(content: string) {
    if (content === 'summary') {
      this.selectedContent = 'summary';
    } else if (content === 'members') {
      this.selectedContent = 'members';
    }
  }

  adminDetails = [
    {
      name: 'nBO',
      rod: 'January',
      members: 10000,
      status: 'Active',
      salary: 1200500,
      plicyNo: 'PLY/008/EN'
    }
  ]


  dummyData = [
    {
      year: 2022,
      period: 'January',
      balanceBF: 10000,
      contribution: 2000,
      rate: 5,
      interest: 500,
      balanceCF: 12500
    },
    {
      year: 2022,
      period: 'February',
      balanceBF: 12500,
      contribution: 2000,
      rate: 5,
      interest: 625,
      balanceCF: 15125
    },
    {
      year: 2022,
      period: 'March',
      balanceBF: 15125,
      contribution: 2000,
      rate: 5,
      interest: 756.25,
      balanceCF: 17881.25
    }
  ];

  showAmortizationPopUp() {
    const modal = document.getElementById('amortizationModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeAmortizationPopUp() {
    const modal = document.getElementById('amortizationModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  //Enables modal to close on click of anywhere outside the modal
  onBackdropClick(event: MouseEvent) {
    // Check if the clicked element is the backdrop of the modal
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal')) {
      this.closeAmortizationPopUp();
    }
  }

}
