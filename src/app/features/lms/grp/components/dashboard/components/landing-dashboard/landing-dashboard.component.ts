import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SESSION_KEY } from 'src/app/features/lms/util/session_storage_enum';
import { Logger } from 'src/app/shared/services';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { DashboardService } from '../../services/dashboard.service';
import { MemberPolicies, UserProfileDTO } from '../../models/member-policies';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

const log = new Logger('LandingDashboardComponent');
@AutoUnsubscribe
@Component({
  selector: 'app-landing-dashboard',
  templateUrl: './landing-dashboard.component.html',
  styleUrls: ['./landing-dashboard.component.css']
})
export class LandingDashboardComponent implements OnInit {
  entityCode: number;
  entityType: string;
  entity: string;
  entityIdNo: number;
  memberPolicies: MemberPolicies[];
  userProfileData: UserProfileDTO;
  policyNumber: string;
  policyCode: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private session_storage: SessionStorageService,
    private dashboardService: DashboardService,
  ) {

  }

  ngOnInit(): void {
    this.getData();
    this.getMemberPolicies();
    
  }

  getData() {
    // this.entityCode = this.activatedRoute.snapshot.queryParams['entityCode'];
   this.activatedRoute.queryParams.subscribe((params) => {
    this.entityCode = +params['entityCode'];
    });
    
    this.entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    const data = this.session_storage.get('memberProfile');
    this.userProfileData = data;
    this.entityIdNo =  data.idNo;
  }

  getStatusDescription(statusCode: string): string {
    switch (statusCode) {
      case 'A':
        return 'Active';
      // To addd more cases for other status codes
      default:
        return 'Unknown';
    }
  }

  // onViewPolicies() {
  //   this.router.navigate(['/home/lms/grp/policy/policyListing'])
  // }

  navigateToPolDets() {
    this.router.navigate(['/home/lms/grp/dashboard/policy-details'], { 
      queryParams: { 
        entityCode: this.entityCode, 
        policyNumber: this.policyNumber ,
        policyCode: this.policyCode,
      } 
    });
  }

  getMemberPolicies() {
    this.dashboardService.getMemberPolicies(this.entityIdNo).subscribe((res: MemberPolicies[]) => {
      this.memberPolicies = res;
      this.policyNumber = this.memberPolicies[0].policy_number;
      this.policyCode = this.memberPolicies[0].policy_code;
    })
  }

}
