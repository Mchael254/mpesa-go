import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-policy-listing',
  templateUrl: './admin-policy-listing.component.html',
  styleUrls: ['./admin-policy-listing.component.css']
})
export class AdminPolicyListingComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.populateBreadCrumbItems();
    
  }

  ngOnDestroy(): void {
    
  }

  populateBreadCrumbItems(): void {
    this.breadCrumbItems = [
      { label: 'Dashboard', url: '/home/lms/grp/dashboard/admin' },
      { label: 'Policies', url: '/home/lms/grp/dashboard/admin-policy-listing' },
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

  navigateToPolDets() {
    this.router.navigate(['/home/lms/grp/dashboard/admin-policy-details'], {
      queryParams: {
      }
    });
  }

}
