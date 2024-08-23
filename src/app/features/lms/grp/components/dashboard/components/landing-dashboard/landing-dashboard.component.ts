import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { MemberPolicies, UserProfileDTO } from '../../models/member-policies';
import {Logger} from "../../../../../../../shared/services";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";

const log = new Logger('LandingDashboardComponent');
@AutoUnsubscribe
@Component({
  selector: 'app-landing-dashboard',
  templateUrl: './landing-dashboard.component.html',
  styleUrls: ['./landing-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  endorsementCode: number;
  productType: string;
  policyMemberCode: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private session_storage: SessionStorageService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    this.getData();
    this.getMemberPolicies();

  }

  getData() {
    // this.entityCode = this.activatedRoute.snapshot.queryParams['entityCode'];
  //  this.activatedRoute.queryParams.subscribe((params) => {
  //   this.entityCode = +params['entityCode'];
  //   });

    this.entityType = this.session_storage.get(SESSION_KEY.ENTITY_TYPE);
    const data = this.session_storage.get('memberProfile');
    this.userProfileData = data;
    this.entityCode = data.code;
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

  navigateToPolDets(selectedPolicy: MemberPolicies) {

    this.router.navigate(['/home/lms/grp/dashboard/policy-details'], {
      queryParams: {
        entityCode: this.entityCode,
        policyNumber: selectedPolicy.policy_number,
        policyCode: selectedPolicy.policy_code,
        endorsementCode: selectedPolicy.endorsement_code,
        productType: selectedPolicy.product_type,
        policyMemberCode: selectedPolicy.policy_member_code,
        productCode: selectedPolicy.product_code
      }
    });
  }

  getMemberPolicies() {
    this.dashboardService.getMemberPolicies(this.entityIdNo).subscribe((res: MemberPolicies[]) => {
      this.memberPolicies = res;
      this.cdr.detectChanges();
    })
  }

}
