import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { DashboardService } from '../../services/dashboard.service';
import { DetailedMemContrReceiptsDTO, MemberCoversDTO, MemberDetailsDTO, MemberPensionDepReceiptsDTO, MemberWithdrawalsDTO, memberBalancesDTO } from '../../models/member-policies';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';
import { ReportsService } from 'src/app/shared/services/reports/reports.service';

const log = new Logger("PolicyDetailsComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyDetailsComponent implements OnInit, OnDestroy {
  selectedContent: string = 'summary'
  columnOptions: SelectItem[];
  selectedColumns: string[];
  years: number[] = [];
  selectedPolicyNumber: string;
  selectedPolicyCode: number;
  endorsementCode: number;
  productType: string;
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedRowIndex: number;
  pensionWithLifeRider: boolean = false;
  gla: boolean = false;
  investment: boolean = false;
  investmentWithRider: boolean = false;
  memberBalances: memberBalancesDTO[];
  memberCovers: MemberCoversDTO[];
  memberPensionDepReceipts: MemberPensionDepReceiptsDTO[];
  memberDetails: MemberDetailsDTO[];
  detailedMemContrReceipts: DetailedMemContrReceiptsDTO[]
  policyMemCode: number;
  entityCode: number
  pensionDepositCode: number;
  withdrawals: MemberWithdrawalsDTO[];
  blobUrl: string | null = null;
  rptCode: number = 789233;
  productCode: number;
  totalContributions: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dashboardService: DashboardService,
    private router: Router,
    private reportsService: ReportsService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.selectedPolicyNumber = this.activatedRoute.snapshot.queryParams['policyNumber'];
    this.entityCode = this.activatedRoute.snapshot.queryParams['entityCode'];
    this.selectedPolicyCode = this.activatedRoute.snapshot.queryParams['policyCode'];
    this.endorsementCode = this.activatedRoute.snapshot.queryParams['endorsementCode'];
    this.productType = this.activatedRoute.snapshot.queryParams['productType'];
    this.policyMemCode = this.activatedRoute.snapshot.queryParams['policyMemberCode']
    this.productCode = this.activatedRoute.snapshot.queryParams['productCode']
    this.getProductType();
    this.populateYears();
    this.adminDetsTableColumns();
    this.populateBreadCrumbItems();
    this.getMemberAllPensionDepositReceipts();
    this.getValuations();
    this.getMemberCovers();
    this.getMemberDetails();
    this.getMemberWithdrawals();
    this.getReports();
  }

  ngOnDestroy(): void {

  }

  /**
   * The function `getProductType` sets the `gla`(Group life assurance) property to true if the `productType` is 'EARN'.
   * If productType is 'PENS'(Pension product), that is default. To add for pension with life rider, inv and inv with rider
   */
  getProductType() {
    if (this.productType === 'PENSWITHRIDER') {
      this.pensionWithLifeRider = true;
    } else if (this.productType === 'INV') {
      this.investment = true;
    } else if (this.productType === 'INVWITHRIDER') {
      this.investmentWithRider = true;
    } else if (this.productType === 'EARN') {
      this.gla = true;
    }
    //DEFAULT this.productType === 'PENS'
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

  getGenderLabel(gender: string): string {
    return gender === 'M' ? 'Male' : 'Female';
  }

  getStatusLabel(value: string): string {
    switch (value) {
      case 'W':
        return 'Withdrawn';
      case 'A':
        return 'Active';
      case 'E':
        return 'Exited';
      default:
        return '';
    }
  }

  onReceiptsTableRowClick(memberPensionDepReceipts, index: number) {
    this.selectedRowIndex = index;
    if(memberPensionDepReceipts){
      this.pensionDepositCode = memberPensionDepReceipts.pension_member_dep_code;
      this.policyMemCode = memberPensionDepReceipts.policy_member_code;
      this.getDetMemDepConReceipts();
      this.showReceiptsModal();
      this.cdr.detectChanges();
    }
  }

  getDetMemDepConReceipts() {
    this.dashboardService.getDetMemDepConReceipts(this.pensionDepositCode, this.policyMemCode).subscribe((res: DetailedMemContrReceiptsDTO[]) => {
      this.detailedMemContrReceipts = res;
      // Calculate the total contributions after data retrieval
      this.totalContributions = this.calculateTotalContributions();
      this.cdr.detectChanges();
    });
  }
  
  // Method to calculate total contributions
  calculateTotalContributions(): number {
    const employeeContribution = this.detailedMemContrReceipts[0]?.employee_amount || 0;
    const employeeTransfer = this.detailedMemContrReceipts[0]?.pnmdp_empye_trans_amt || 0;
    const employeeVoluntary = this.detailedMemContrReceipts[0]?.pnmdp_empye_vol_amt || 0;
    const employeeCostBenefits = this.detailedMemContrReceipts[0]?.cost_of_past_benefits || 0;
    const employeeTotal = this.detailedMemContrReceipts[0]?.total_amount || 0;

    const employerContribution = this.detailedMemContrReceipts[0]?.employer_amount || 0;
    const employerTransfer = this.detailedMemContrReceipts[0]?.pnmdp_empyr_trans_amt || 0;
    const employerVoluntary = this.detailedMemContrReceipts[0]?.pnmdp_empyr_trans_amt || 0;
    const employerCostBenefits = this.detailedMemContrReceipts[0]?.cost_of_past_benefits || 0;
    const employerTotal = this.detailedMemContrReceipts[0]?.total_amount || 0;

    const totalEmployeeEmployerContr = employeeContribution + employeeTransfer + employeeVoluntary + employeeCostBenefits + 
    employeeTotal + employerContribution + employerTransfer + employerVoluntary + employerCostBenefits + employerTotal;

    return totalEmployeeEmployerContr;
  }

  getMemberDetails() {
    this.dashboardService.getMemberDetails(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberDetailsDTO[]) => {
      this.memberDetails =  res;
      this.cdr.detectChanges();
    });
  }

  getMemberAllPensionDepositReceipts() {
    this.dashboardService.getMemberAllPensionDepositReceipts(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberPensionDepReceiptsDTO[]) => {
      this.memberPensionDepReceipts = res;
      this.cdr.detectChanges();
    });
  }

  getValuations() {
    this.dashboardService.getMemberBalances(this.selectedPolicyCode, this.policyMemCode).subscribe((res: memberBalancesDTO[]) => {
      this.memberBalances = res;
      this.cdr.detectChanges();
    });
  }

  getMemberCovers() {
    this.dashboardService.getMemberCovers(this.policyMemCode, this.endorsementCode).subscribe((res: MemberCoversDTO[]) => {
      this.memberCovers = res;
      this.cdr.detectChanges();
    });
  }

  getMemberWithdrawals() {
    this.dashboardService.getMemberWithdrawals(this.selectedPolicyCode, this.policyMemCode).subscribe((res: MemberWithdrawalsDTO[]) => {
      this.withdrawals = res;
      this.cdr.detectChanges();
    });
  }


  getReports() {
    this.dashboardService.getReports(this.rptCode, this.productCode, this.selectedPolicyCode, this.policyMemCode).subscribe((res) => {
      const blob = new Blob([res], { type: 'application/pdf' });
      this.blobUrl = window.URL.createObjectURL(blob);
      this.cdr.detectChanges();
    });
  }


  downloadReport(event: Event): void {
    event.preventDefault();

    if (this.blobUrl) {
      const link = document.createElement('a');
      link.href = this.blobUrl;
      link.download = 'pension_report.pdf';
      link.click();
    }
  }
  
}
