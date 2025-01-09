import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from '../../../../../../../../shared/data/common/BreadCrumbItem';
import { DashboardService } from '../../../services/dashboard.service';
import { AutoUnsubscribe } from '../../../../../../../../shared/services/AutoUnsubscribe';
import { Logger } from '../../../../../../../../shared/services';
import { PoliciesListingDTO } from '../../../models/admin-policies';

const log = new Logger("AdminPolicyListingComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-admin-policy-listing',
  templateUrl: './admin-policy-listing.component.html',
  styleUrls: ['./admin-policy-listing.component.css']
})
export class AdminPolicyListingComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  policiesListing: PoliciesListingDTO[] = [];
  clientCode: number = 2422853;
  investment: boolean = false;
  creditLife: boolean = false;


  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    this.getAdminPolicies();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/admin-policy-listing' },
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

  // getAdminPolicies() {
  //   this.dashboardService.getAdminPolicies(this.clientCode).subscribe((res: PoliciesListingDTO[]) => {
  //     this.policiesListing = res;
  //     log.info("getAdminPolicies", res);
  //   });
  // }

  getAdminPolicies() {
    this.dashboardService.getAdminPolicies(this.clientCode).subscribe(
      (res: { count: number, total_sum_assured: number, policies_list: PoliciesListingDTO[] }) => {
        this.policiesListing = res.policies_list;
        log.info("getAdminPolicies", this.policiesListing);
      },
      (error) => {
        log.error("Error fetching policies listing", error);
      }
    );
  }

  navigateToPolDets(polCode) {
    if(this.investment) {
      this.router.navigate(['/home/lms/grp/dashboard/investment'], {
        queryParams: {
          policyCode: polCode,
        }
      });
    } else if(this.creditLife) {
      this.router.navigate(['/home/lms/grp/dashboard/credit-life'], {
        queryParams: {
          policyCode: polCode,
        }
      });
    } else {
      this.router.navigate(['/home/lms/grp/dashboard/admin-policy-details'], {
        queryParams: {
          policyCode: polCode,
        }
      });
    }
    
  }

}
