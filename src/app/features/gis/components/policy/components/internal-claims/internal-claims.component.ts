import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent, Coinsurance, InternalClaimExp } from '../../data/policy-dto';
import { PolicyService } from '../../services/policy.service';

const log = new Logger("InternalClaimsComponent ");

@Component({
  selector: 'app-internal-claims',
  templateUrl: './internal-claims.component.html',
  styleUrls: ['./internal-claims.component.css']
})
export class InternalClaimsComponent {
  errorOccurred: boolean;
  errorMessage: string;
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  internalClaimList: InternalClaimExp[] = [];
  
  clientCode: number;

  @ViewChild('closebutton') closebutton;
  @ViewChild('closeEditClaimButton') closeEditClaimButton;


  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public authService: AuthService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }
  ngOnInit(): void {
   this.getUtil()
  }
  ngOnDestroy(): void { }
  getUtil() {
    this.policyDetails = JSON.parse(sessionStorage.getItem('passedPolicyDetails'))
    this.getPolicyDetails();
    log.debug("Policy Details", this.policyDetails);


  }

  getPolicyDetails() {
    this.batchNo = this.policyDetails.batchNumber;
    log.debug("Policy Batch Number:", this.batchNo)
    this.policyService
      .getPolicy(this.batchNo)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.policyResponse = response;
          this.policyDetailsData = this.policyResponse.content[0]
          log.debug("Policy Details Data:", this.policyDetailsData)
          this.clientCode = this.policyDetailsData.insureds[0].client.id
         
          if (this.clientCode) {
            this.getInternalClaimExp();
          }
          this.cdr.detectChanges();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  policy details.Try again later');
        }
      })
  }
  getInternalClaimExp() {
    this.policyService
      .fetchInternalClaimExp(this.clientCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {

            this.internalClaimList = data._embedded;
            log.debug("Internal Claim Exp List", this.internalClaimList);

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  Internal claim Experience.Try again later');
          }

        },
        error: (err) => {

          this.globalMessagingService.displayErrorMessage(
            'Error',
            this.errorMessage
          );
          log.info(`error >>>`, err);
        },
      })
  }
}
