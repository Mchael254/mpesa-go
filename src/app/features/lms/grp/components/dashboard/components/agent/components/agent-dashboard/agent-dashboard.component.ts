import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from 'src/app/shared/services';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';


const log = new Logger("AgentDashboardComponent")
@AutoUnsubscribe
@Component({
  selector: 'app-agent-dashboard',
  templateUrl: './agent-dashboard.component.html',
  styleUrls: ['./agent-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentDashboardComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

  }

  // Mock data for user profile
  userProfileData = {
    fullName: 'John Doe',
    idNo: 'AG123456',
    userName: 'john.doe@example.com'
  };

  // Mock data for policies summary
  policiesSummary = {
    count: 5,
    total_sum_assured: 1000000
  };

  // Mock data for claims summary
  claimsSummary = {
    count: 3,
    tot_amt_claimed: 250000
  };

  // Mock data for pension summary
  pensionSummary = {
    count: 2
  };

  // Mock data for recent quotes
  quoteDetails = [
    {
      description: 'Health Insurance Plan',
      policy_number: 'Q123456789',
      member_number: 'John Doe',
      initiation_date: '2024-09-21'
    },
    {
      description: 'Health Insurance Plan',
      policy_number: 'Q123456789',
      member_number: 'John Doe',
      initiation_date: '2024-09-21'
    },
    {
      description: 'Life Insurance Plan',
      policy_number: 'Q987654321',
      member_number: 'Jane Smith',
      initiation_date: '2024-08-15'
    }
  ];


  onPoliciesClick() {
    this.router.navigate(['/home/lms/grp/dashboard/agent-policies']);
  }

  onClaimsClick() {
    this.router.navigate(['/home/lms/grp/dashboard/agent-claims']);
  }

  onQuotesClick() {
    this.router.navigate(['/home/lms/grp/dashboard/agent-quotes']);
  }

}
