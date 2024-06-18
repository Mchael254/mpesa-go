import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { ClaimSummaryDTO, PensionResponse, PoliciesResponse } from '../../models/admin-policies';

const log = new Logger("AdminDashboardComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  claimsSummary: ClaimSummaryDTO | null = null;
  clientCode: number = 2422853;
  policiesSummary: PoliciesResponse;
  pensionSummary: PensionResponse;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.getPoliciesSummary();
    this.getClaimsSummary();
    this.getPensionSummary();
  }

  ngOnDestroy(): void {
    
  }

  userProfileData = {
    fullName: 'Nairobi Union Sacco', idNo: 'NBO/SACCO/007', userName: 'nbisacco@gmail.com'
  }

  onPoliciesClick() {
    this.router.navigate(['/home/lms/grp/dashboard/admin-policy-listing'])
  }

  onClaimsClick() {
    this.router.navigate(['/home/lms/grp/dashboard/admin-claims-listing'])
  }

  onPensionClick() {
    this.router.navigate(['/home/lms/grp/dashboard/admin-pension-listing'])
  }

  getPoliciesSummary() {
    this.dashboardService.getAdminPolicies(this.clientCode).subscribe(
      (res: PoliciesResponse) => {
        this.policiesSummary = res;
        log.info("getPoliciesSummary", this.policiesSummary);
      },
      (error) => {
        log.error("Error fetching policies summary", error);
      }
    );
  }

  getClaimsSummary() {
    this.dashboardService.getClaimsSummary(this.clientCode).subscribe((res: ClaimSummaryDTO) => {
      this.claimsSummary = res
      log.info("getClaimsSummary", this.claimsSummary)
    });
  }

  getPensionSummary() { 
    this.dashboardService.getAdminPensionListing(this.clientCode).subscribe(
      (res: PensionResponse) => {
        this.pensionSummary = res;
        log.info("getPensionSummary", this.pensionSummary);
      },
      (error) => {
        log.error("Error fetching pension summary", error);
      }
    );
  }

}
