import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import { DashboardService } from '../../../services/dashboard.service';
import { PensionListingDTO } from '../../../models/admin-policies';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { Logger } from 'src/app/shared/services';

const log = new Logger("AdminPensionListingComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-admin-pension-listing',
  templateUrl: './admin-pension-listing.component.html',
  styleUrls: ['./admin-pension-listing.component.css']
})
export class AdminPensionListingComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  pensionList: PensionListingDTO[] = [];
  clientCode: number = 2422853;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.getAdminPensionListing();

  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Pension', url: '/home/lms/grp/dashboard/admin-pension-listing' },
    ];
  }

  getStatusDescription(statusCode: string): string {
    switch (statusCode) {
      case 'A':
        return 'Active';
        case 'D':
        return 'Draft';
      // To addd more cases for other status codes
      default:
        return 'Unknown';
    }
  }

  navigateToPensionDets(policy_code, policy_number) {
    this.router.navigate(['/home/lms/grp/dashboard/admin-pension-summary'], {
      queryParams: {
        policyCode: policy_code,
        policyNumber: policy_number,
      }
    });
  }

  // getAdminPensionListing() {
  //   this.dashboardService.getAdminPensionListing(this.clientCode).subscribe((res: PensionListingDTO[]) => {
  //     this.pensionList = res;
  //     log.info("getAdminPensionListing", this.pensionList)
  //   });
  // }
  getAdminPensionListing() {
    this.dashboardService.getAdminPensionListing(this.clientCode).subscribe(
      (res: { count: number, pension_list: PensionListingDTO[] }) => {
        this.pensionList = res.pension_list;
        log.info("getAdminPensionListing", this.pensionList);
      },
      (error) => {
        log.error("Error fetching pension listing", error);
      }
    );
  }
}
