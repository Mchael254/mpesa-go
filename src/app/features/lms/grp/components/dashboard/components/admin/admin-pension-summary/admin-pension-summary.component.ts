import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { memberBalancesDTO, MemberCoversDTO, MemberPensionDepReceiptsDTO, MemberDetailsDTO, DetailedMemContrReceiptsDTO } from '../../../models/member-policies';
import { DashboardService } from '../../../services/dashboard.service';
import { MemberListDTO, PartialWithdrawalsDTO, ReceiptsDTO, ValuationsDTO } from '../../../models/admin-policies';

const log = new Logger("PolicyDetailsComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-admin-pension-summary',
  templateUrl: './admin-pension-summary.component.html',
  styleUrls: ['./admin-pension-summary.component.css']
})
export class AdminPensionSummaryComponent implements OnInit, OnDestroy {
  selectedContent: string = 'summary'
  selectedPolicyNumber: string;
  breadCrumbItems: BreadCrumbItem[] = [];
  years: number[] = [];
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  policyCode: number;
  endorsementCode: number = 	20241004;
  partialWithdrawals: PartialWithdrawalsDTO[] = [];
  receipts: ReceiptsDTO[] = [];
  valuations: ValuationsDTO[] =[];
  memberList: MemberListDTO[] = [];

  constructor(
    private dashboardService: DashboardService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.getParams();
    this.populateBreadCrumbItems();
    this.populateYears();
    this.getPolicyValuations();
    this.getPartialWithdrawals();
    this.getReceipts();
    this.getMemberDetailsList();
  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/admin-pension-summary' },
    ];
  }

  populateYears(): void {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
      this.years.push(year);
    }
  }

  showContent(content: string) {
    if (content === 'summary') {
      this.selectedContent = 'summary';
    } else if (content === 'transactions') {
      this.selectedContent = 'transactions';
    } else if (content === 'members') {
      this.selectedContent = 'members';
    }
  }

  getParams() {
    this.policyCode = this.activatedRoute.snapshot.queryParams['policyCode'];
    this.selectedPolicyNumber = this.activatedRoute.snapshot.queryParams['policyNumber'];
    log.info("getParamsPolCode", this.policyCode, this.selectedPolicyNumber)
  }

  adminPensionDepReceipts = [
    {
      pension_member_dep_code: "REC-001",
      pnmdp_date: "2023-01-15",
      employee_amount: 1500,
      voluntary_contribution_amount: 300,
      total_transfer_amount: 200,
      cost_of_past_benefits: 100,
      total_amount: 2100,
      pnmdp_amount: 2300
    },
    {
      pension_member_dep_code: "REC-002",
      pnmdp_date: "2023-02-20",
      employee_amount: 1600,
      voluntary_contribution_amount: 400,
      total_transfer_amount: 250,
      cost_of_past_benefits: 150,
      total_amount: 2400,
      pnmdp_amount: 2650
    },
    {
      pension_member_dep_code: "REC-003",
      pnmdp_date: "2023-03-18",
      employee_amount: 1700,
      voluntary_contribution_amount: 350,
      total_transfer_amount: 300,
      cost_of_past_benefits: 200,
      total_amount: 2550,
      pnmdp_amount: 2850
    },
    {
      pension_member_dep_code: "REC-004",
      pnmdp_date: "2023-04-22",
      employee_amount: 1800,
      voluntary_contribution_amount: 450,
      total_transfer_amount: 350,
      cost_of_past_benefits: 250,
      total_amount: 2850,
      pnmdp_amount: 3200
    },
    {
      pension_member_dep_code: "REC-005",
      pnmdp_date: "2023-05-25",
      employee_amount: 1900,
      voluntary_contribution_amount: 500,
      total_transfer_amount: 400,
      cost_of_past_benefits: 300,
      total_amount: 3100,
      pnmdp_amount: 3500
    }
  ];


  adminDetails = [
    {
      name: 'nBO',
      rod: 'January',
      members: 10000,
      status: 'Active',
      salary: 1200500
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

  getPolicyValuations() {
    this.dashboardService.getPolicyValuations(2022169).subscribe((res: ValuationsDTO[]) => {
      this.valuations = res;
      log.info("getPolicyValuations", this.valuations)
    });
  }

  getReceipts() {
    this.dashboardService.getReceipts(this.policyCode).subscribe((res: ReceiptsDTO[]) => {
      this.receipts =  res;
      log.info("getReceipts", res)
    });
  }

  getPartialWithdrawals() {
    this.dashboardService.getPartialWithdrawals(this.policyCode).subscribe((res: PartialWithdrawalsDTO[]) => {
      this.partialWithdrawals =  res;
      log.info("getPartialWithdrawals", this.partialWithdrawals)
    });
  }

  getMemberDetailsList() {
    // this.dashboardService.getMemberDetailsList(this.policyCode, this.endorsementCode).subscribe((res: MemberListDTO[]) => {
      this.dashboardService.getMemberDetailsList(2024833, this.endorsementCode).subscribe((res: MemberListDTO[]) => {
      this.memberList = res
      log.info("getMemberDetailsList", this.memberList)
    });
  }


}

