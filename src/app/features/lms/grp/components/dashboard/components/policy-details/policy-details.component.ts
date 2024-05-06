import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DashboardService } from '../../services/dashboard.service';
import { memberBalancesDTO } from '../../models/member-policies';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';

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
  selectedPolicyNumber: string;
  selectedPolicyCode: number;
  memberCode: number;
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedRowIndex: number;
  pensionWithLifeRider: boolean = false;
  gla: boolean = false;
  investment: boolean = false;
  investmentWithRider: boolean = false;
  memberBalances: memberBalancesDTO[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.selectedPolicyNumber = this.activatedRoute.snapshot.queryParams['policyNumber'];
    this.memberCode = this.activatedRoute.snapshot.queryParams['entityCode'];
    this.selectedPolicyCode = this.activatedRoute.snapshot.queryParams['policyCode'];
    this.populateYears();
    this.adminDetsTableColumns();
    this.populateBreadCrumbItems();
    this.getMemberAllPensionDepositReceipts();
    this.getValuations();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/dashboard-screen' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/policy-details' },
    ];
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

  getMemberAllPensionDepositReceipts() {
    this.dashboardService.getMemberAllPensionDepositReceipts(this.selectedPolicyCode, this.memberCode).subscribe((res) => {
      // this.dashboardService.getMemberAllPensionDepositReceipts(2022169, 20221254139).subscribe((res) => {
      log.info("MemberAllPensionDepositReceipts-->", res)
    })
  }

  getValuations() {
    this.dashboardService.getMemberBalances(this.selectedPolicyCode, this.memberCode).subscribe((res: memberBalancesDTO[]) => {
      // this.dashboardService.getMemberBalances(2022169, 20221254139).subscribe((res: memberBalancesDTO[]) => {
      log.info("MemberBalances", res)
      this.memberBalances = res;
    });
  }

}
