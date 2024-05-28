import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

@Component({
  selector: 'app-admin-policy-details',
  templateUrl: './admin-policy-details.component.html',
  styleUrls: ['./admin-policy-details.component.css']
})
export class AdminPolicyDetailsComponent implements OnInit, OnDestroy {
  breadCrumbItems: BreadCrumbItem[] = [];
  selectedPolicyNumber: string = 'PL/009/IUIU';

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
      { label: this.selectedPolicyNumber, url: '/home/lms/grp/dashboard/admin-policy-details' },
    ];
  }

  memberPolicies = [
    { status: 'Member details', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life',
    multipleOfEarning: 1, shortDesc: 'Afya bora group'
     },
    { status: 'Cover types', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life', 
    multipleOfEarning: 3, shortDesc: 'Nairobi trade group'
     },
    { status: 'Category summary', policy_number: 'NBO/SACCO/007', policy_members: 167, sum_assured: 10000, description: 'Group life',
    multipleOfEarning: 3, shortDesc: 'Nairobi trade group'
     },
  ]

}
