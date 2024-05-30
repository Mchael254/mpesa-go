import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-pension-listing',
  templateUrl: './admin-pension-listing.component.html',
  styleUrls: ['./admin-pension-listing.component.css']
})
export class AdminPensionListingComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.populateBreadCrumbItems();

  }

  ngOnDestroy(): void {

  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Pension', url: '/home/lms/grp/dashboard/admin-pension-listing' },
    ];
  }

  memberPolicies = [
    { status: 'A', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life' },
    { status: 'A', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life' },
    { status: 'A', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life' },
  ]

  getStatusDescription(statusCode: string): string {
    switch (statusCode) {
      case 'A':
        return 'Active';
      // To addd more cases for other status codes
      default:
        return 'Unknown';
    }
  }

  // navigateToPolDets() {
  //   this.router.navigate(['/home/lms/grp/dashboard/admin-policy-details'], {
  //     queryParams: {
  //     }
  //   });
  // }
}
