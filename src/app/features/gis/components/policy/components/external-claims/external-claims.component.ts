import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankBranchDTO } from 'src/app/shared/data/common/bank-dto';
import { PolicyResponseDTO, PolicyContent, Coinsurance, ExternalClaimExp } from '../../data/policy-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { PolicyService } from '../../services/policy.service';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'

const log = new Logger("ExternalClaimsComponent ");

@Component({
  selector: 'app-external-claims',
  templateUrl: './external-claims.component.html',
  styleUrls: ['./external-claims.component.css']
})
export class ExternalClaimsComponent {


  errorOccurred: boolean;
  errorMessage: string;
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  externalClaimList: ExternalClaimExp[] = [];
  selectedExternalClaim: ExternalClaimExp;
  insurersDetailsForm: FormGroup;
  insuranceList: Coinsurance[] = [];
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
    this.getUtil();
    this.createInsurersForm()
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
          if (this.batchNo) {
            this.getInsurers();
          }
          if (this.clientCode) {
            this.getExternalClaimExp();
          }
          this.cdr.detectChanges();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  policy details.Try again later');
        }
      })
  }
  createInsurersForm() {

    this.insurersDetailsForm = this.fb.group({
      claimPaid: ['', [Validators.required]],
      clientCode: [''],
      code: [''],
      damageAmount: ['', [Validators.required]],
      insurer: ['', [Validators.required]],
      lossAmount: ['', [Validators.required]],
      noAcc: ['', [Validators.required]],
      otherAmount: ['', [Validators.required]],
      policyNo: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      riskDetails: ['', [Validators.required]],
      totalPaidAmount: ['', [Validators.required]],
      year: ['', [Validators.required]]
    });
  }

  getInsurers() {
    this.policyService
      .getCoinsurance(this.batchNo)
      .pipe(untilDestroyed(this))

      .subscribe({
        next: (response: any) => {
          this.insuranceList = response._embedded[0];
          log.debug("Insurance List", this.insuranceList);


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  Insurers.Try again later');
        }
      });
  }
  onInsurerSelected(insurer: any) {

  }
  createExternalClaimExp() {
    // Mark all fields as touched and validate the form
    this.insurersDetailsForm.markAllAsTouched();
    this.insurersDetailsForm.updateValueAndValidity();
    if (this.insurersDetailsForm.invalid) {
      console.log('Form is invalid, will not proceed');
      return;
    }
    Object.keys(this.insurersDetailsForm.controls).forEach(control => {
      if (this.insurersDetailsForm.get(control).invalid) {
        console.log(`${control} is invalid`, this.insurersDetailsForm.get(control).errors);
      }
    });


    // If form is valid, proceed 
    console.log('Form is valid, proceeding with premium computation...');

    const insurer = this.insurersDetailsForm.value;
    log.debug("Client Code", this.clientCode)

    const damageAmountString = this.insurersDetailsForm.get('damageAmount').value.replace(/,/g, '');

    log.debug('damageAmount (String):', damageAmountString);
    const damageAmountInt = parseInt(damageAmountString);
    log.debug('damageAmount (Integer):', damageAmountInt);

    // Log and convert totalPaidAmount
    const totalPaidAmountString = this.insurersDetailsForm.get('totalPaidAmount').value.replace(/,/g, '');
    log.debug('totalPaidAmount (String):', totalPaidAmountString);
    const totalPaidAmountInt = parseInt(totalPaidAmountString);
    log.debug('totalPaidAmount (Integer):', totalPaidAmountInt);

    // Log and convert otherAmount
    const otherAmountString = this.insurersDetailsForm.get('otherAmount').value.replace(/,/g, '');
    log.debug('otherAmount (String):', otherAmountString);
    const otherAmountInt = parseInt(otherAmountString);
    log.debug('otherAmount (Integer):', otherAmountInt);

    insurer.damageAmount = damageAmountInt;
    insurer.totalPaidAmount = totalPaidAmountInt;
    insurer.otherAmount = otherAmountInt;
    insurer.clientCode = this.clientCode;


    this.closebutton.nativeElement.click();

    log.debug("EXTERNAL CLAIMS FORM-ADDING", insurer)
    this.policyService
      .addExternalClaimExp(insurer)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'External claim experience details added successfully');

          log.debug("Response after adding external Claim Experience", response);
          this.getExternalClaimExp();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add external claim exp...Try again later');
        }
      });
  }
  getExternalClaimExp() {
    this.policyService
      .fetchExternalClaimExp(this.clientCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (data: any) => {
          if (data) {

            this.externalClaimList = data._embedded;
            log.debug("External Claim Exp List", this.externalClaimList);

          }
          else {
            this.errorOccurred = true;
            this.errorMessage = 'Empty response received from the server.';
            this.globalMessagingService.displayErrorMessage('Error', 'Failed to get  Insurers.Try again later');
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
  onSelectExternalClaim(externalClaim: any) {
    log.debug("Selected EXternal claim to be edited", externalClaim)
    this.selectedExternalClaim = externalClaim

    this.insurersDetailsForm.patchValue({

      policyNo: this.selectedExternalClaim.policyNo,
      insurer: this.selectedExternalClaim.insurer,
      year: this.selectedExternalClaim.year,
      riskDetails: this.selectedExternalClaim.riskDetails,
      lossAmount: this.selectedExternalClaim.lossAmount,
      claimPaid: this.selectedExternalClaim.claimPaid,
      noAcc: this.selectedExternalClaim.noAcc,
      damageAmount: this.selectedExternalClaim.damageAmount,
      totalPaidAmount: this.selectedExternalClaim.totalPaidAmount,
      otherAmount: this.selectedExternalClaim.otherAmount,
      remarks: this.selectedExternalClaim.remarks,

    });

  }
  editExternalClaimExp() {
    // Mark all fields as touched and validate the form
    this.insurersDetailsForm.markAllAsTouched();
    this.insurersDetailsForm.updateValueAndValidity();
    if (this.insurersDetailsForm.invalid) {
      console.log('Form is invalid, will not proceed');
      return;
    }
    Object.keys(this.insurersDetailsForm.controls).forEach(control => {
      if (this.insurersDetailsForm.get(control).invalid) {
        console.log(`${control} is invalid`, this.insurersDetailsForm.get(control).errors);
      }
    });


    // If form is valid, proceed 
    console.log('Form is valid, proceeding with premium computation...');

    const insurer = this.insurersDetailsForm.value;
    log.debug("Client Code", this.clientCode)

    // const damageAmountString = this.insurersDetailsForm.get('damageAmount').value.replace(/,/g, '');

    // log.debug('damageAmount (String):', damageAmountString);
    // const damageAmountInt = parseInt(damageAmountString);
    // log.debug('damageAmount (Integer):', damageAmountInt);
    const damageAmountString = this.insurersDetailsForm.get('damageAmount').value
      ? this.insurersDetailsForm.get('damageAmount').value.toString().replace(/,/g, '')
      : '0';
    log.debug('damageAmount (String):', damageAmountString);
    const damageAmountInt = parseInt(damageAmountString, 10);
    log.debug('damageAmount (Integer):', damageAmountInt);

    // Log and convert totalPaidAmount
    // const totalPaidAmountString = this.insurersDetailsForm.get('totalPaidAmount').value.replace(/,/g, '');
    // log.debug('totalPaidAmount (String):', totalPaidAmountString);
    // const totalPaidAmountInt = parseInt(totalPaidAmountString);
    // log.debug('totalPaidAmount (Integer):', totalPaidAmountInt);

    // Log and convert otherAmount
    // const otherAmountString = this.insurersDetailsForm.get('otherAmount').value.replace(/,/g, '');
    // log.debug('otherAmount (String):', otherAmountString);
    // const otherAmountInt = parseInt(otherAmountString);
    // log.debug('otherAmount (Integer):', otherAmountInt);

    // Log and convert totalPaidAmount
    const totalPaidAmountString = this.insurersDetailsForm.get('totalPaidAmount').value
      ? this.insurersDetailsForm.get('totalPaidAmount').value.toString().replace(/,/g, '')
      : '0';
    log.debug('totalPaidAmount (String):', totalPaidAmountString);
    const totalPaidAmountInt = parseInt(totalPaidAmountString, 10);
    log.debug('totalPaidAmount (Integer):', totalPaidAmountInt);

    // Log and convert otherAmount
    const otherAmountString = this.insurersDetailsForm.get('otherAmount').value
      ? this.insurersDetailsForm.get('otherAmount').value.toString().replace(/,/g, '')
      : '0';
    log.debug('otherAmount (String):', otherAmountString);
    const otherAmountInt = parseInt(otherAmountString, 10);
    log.debug('otherAmount (Integer):', otherAmountInt);

    insurer.damageAmount = damageAmountInt;
    insurer.totalPaidAmount = totalPaidAmountInt;
    insurer.otherAmount = otherAmountInt;
    insurer.clientCode = this.clientCode;
    insurer.code = this.selectedExternalClaim.code;



    log.debug("EXTERNAL CLAIMS FORM-ADDING", insurer)
    this.policyService
      .editExternalClaimExp(insurer)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.closeEditClaimButton.nativeElement.click();

          this.globalMessagingService.displaySuccessMessage('Success', 'External claim experience details updated successfully');
          log.debug("Response after editing external Claim Experience", response);
          this.getExternalClaimExp();

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to edit external claim exp...Try again later');
        }
      });
  }
  openExternalClaimDeleteModal() {
    log.debug("Selected External Claim", this.selectedExternalClaim)
    if (!this.selectedExternalClaim) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a claim to continue');
    } else {
      document.getElementById("openExternalClaimModalButtonDelete").click();

    }
  }
  deleteExternalClaimExp() {
    this.policyService
      .deleteExternalClaimExp(this.selectedExternalClaim.code)
      .pipe(untilDestroyed(this))

      .subscribe({
        next: (response: any) => {

          log.debug("Response after deleting External Claim Exp.", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully deleted External Claim Exp.')

          // Remove the deleted policy subclass clause from the policy subclass clause Details array 
          const index = this.externalClaimList.findIndex(claim => claim.code === this.selectedExternalClaim.code);
          if (index !== -1) {
            this.externalClaimList.splice(index, 1);
          }
          // Clear the selected subclass clause
          this.selectedExternalClaim = null;


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to deleted External claim Insurer.Try again later');
        }
      });
  }
}
