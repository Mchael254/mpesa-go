import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    
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

}
