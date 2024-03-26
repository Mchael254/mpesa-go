import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-dashboard',
  templateUrl: './landing-dashboard.component.html',
  styleUrls: ['./landing-dashboard.component.css']
})
export class LandingDashboardComponent implements OnInit {

  constructor(
    private router: Router
  ) {

  }

  ngOnInit(): void {
    
  }

  // onViewPolicies() {
  //   this.router.navigate(['/home/lms/grp/policy/policyListing'])
  // }

}
