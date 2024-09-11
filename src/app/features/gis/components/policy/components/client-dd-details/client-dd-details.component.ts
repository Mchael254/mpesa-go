import { ChangeDetectorRef, Component } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';
import { AuthService } from '../../../../../../shared/services/auth.service';

const log = new Logger("ClientDDDetailsComponent ");
@Component({
  selector: 'app-client-dd-details',
  templateUrl: './client-dd-details.component.html',
  styleUrls: ['./client-dd-details.component.css']
})
export class ClientDdDetailsComponent {

  branchList: OrganizationBranchDto[];
  user: any;
  userDetails: any
  userBranchId: any;
  userBranchName: any;
  selectedBranchCode: any;
  selectedBranchDescription: any;
  errorOccurred: boolean;
  errorMessage: string;

  constructor( 
    public branchService: BranchService,
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,  
    public authService: AuthService,

  ){}

  ngOnInit(): void {
    this.fetchBranches();
  }
  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    const passedUserDetailsString = JSON.stringify(this.userDetails);
    sessionStorage.setItem('passedUserDetails', passedUserDetailsString);
    this.userBranchId = this.userDetails?.branchId;
    log.debug("Branch Id", this.userBranchId);
    // this.fetchBranches();

  }

  fetchBranches(organizationId?: number, regionId?: number) {
    this.branchService.getAllBranches(organizationId, regionId).subscribe({
        next: (data) => {

          if (data) {
            this.branchList = data;
            log.info('Fetched Branches', this.branchList);
            // const branch = this.branchList.filter(branch => branch.id == this.userBranchId)
            // log.debug("branch", branch);
            // this.userBranchName = branch[0]?.name;
            // log.debug("branch name", this.userBranchName);
            this.cdr.detectChanges();

          } else {
            this.errorOccurred = true;
            this.errorMessage = 'Something went wrong. Please try Again';
            this.globalMessagingService.displayErrorMessage(
              'Error',
              'Something went wrong. Please try Again'
            );
          }
        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      });
  }
  onBranchSelected(selectedValue: any) {
    this.selectedBranchCode = selectedValue;
    const selectedBranch = this.branchList.find(branch => branch.id === selectedValue);
    if (selectedBranch) {
      console.log("Selected Branch Data:", selectedBranch);

      const selectedBranchCode = selectedBranch.id;
      const selectedBranchName = selectedBranch.name;

      console.log("Selected Agent Code:", selectedBranchCode);
      console.log("Selected Agent Name:", selectedBranchName);
      this.selectedBranchCode = selectedBranchCode;
      this.selectedBranchDescription = selectedBranchCode;

    } else {
      console.log("Branch not found in agentList");
    }

}
}