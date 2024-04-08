import { Component, OnDestroy, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger("PolicyDetailsComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit, OnDestroy {
  selectedContent: string = 'summary'
  columnOptions: SelectItem[];
  selectedColumns: string[];
  years: number[] = [];
  policySelected: string = 'PolicyAKA123';
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  breadCrumbItems: BreadCrumbItem[] = [
    { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
    { label: this.policySelected, url: '/home/lms/grp/dashboard/policy-details' },
  ];
  selectedRowIndex: number;
  pensionWithLifeRider: boolean = false;
  gla: boolean = false;
  investment: boolean = false;
  investmentWithRider: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.populateYears();
    this.adminDetsTableColumns();
  }

  ngOnDestroy(): void {

  }

  showContent(content: string) {
    if (content === 'summary') {
      this.selectedContent = 'summary';
    } else if (content === 'transactions') {
      this.selectedContent = 'transactions';
    }
    else if (content === 'cover_types') {
      this.selectedContent = 'cover_types';
    }
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  adminDetsTableColumns() {
    this.columnOptions = [
      { label: 'Name', value: 'contact_person_name' },
      { label: 'Date of birth', value: 'date_of_birth' },
      { label: 'ID number', value: 'identification_number' },
      { label: 'Position', value: 'position' },
      { label: 'Physical address', value: 'contact_person_physical_address' },
      { label: 'Contact', value: 'phone_number' },
      { label: 'Email', value: 'contact_person_email' },
      { label: 'With effect from', value: 'wef' },
      { label: 'With effect to', value: 'wet' },
    ];

    this.selectedColumns = this.columnOptions.map(option => option.value);
  }

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

  showReceiptsModal() {
    const modal = document.getElementById('receiptsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  closeReceiptsModal() {
    const modal = document.getElementById('receiptsModal');
    if (modal) {
      modal.classList.remove('show')
      modal.style.display = 'none';
    }
  }

  onReceiptsTableRowClick(dummyData, index: number) {
    this.selectedRowIndex = index;
    if(dummyData){
      log.info("dummydataPassed", dummyData);
      this.showReceiptsModal();
    }
  }

}
