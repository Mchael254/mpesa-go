import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { ClaimCoverTypesDTO, ClaimDetailsDTO, ClaimPolicyDetails, PayeeDTO } from '../../models/claim-models';
import { ClaimsService } from '../../service/claims.service';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';

const log = new Logger("ClaimProcessingComponent")
@Component({
  selector: 'app-claim-processing',
  templateUrl: './claim-processing.component.html',
  styleUrls: ['./claim-processing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimProcessingComponent implements OnInit, OnDestroy {
  steps = stepData;
  coverDetailsForm: FormGroup;
  isFormVisible: boolean = false;
  claimInformation: ClaimDetailsDTO[] = []
  claimNumber: string;
  claimCoverTypes: ClaimCoverTypesDTO[] = [];
  claimPolicyDetails: ClaimPolicyDetails[] = [];
  coverTypeCode: number;
  claimableAmount: number;
  policyCode: number;
  productCode: number;
  payee$: Observable<PayeeDTO[]>;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private claimsService: ClaimsService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.editCoverDetailsForm();
    this.getClaimCoverTypes();
    this.getClaimPolicyDetails();
    this.getClaimInfo();
    this.getPayee();

  }

  ngOnDestroy(): void {

  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }
  
editCoverDetailsForm() {
  this.coverDetailsForm = this.fb.group({
    claimableAmount: [{ value: '', disabled: true }],
    butPayAmount: [""],
    reason: [""],
    payee: ["", Validators.required],
  });
}

 /**
  * The function `getClaimCoverTypes` retrieves claim cover types data and updates the claimableAmount
  * fields in the form.
  */
  getClaimCoverTypes() {
    this.claimsService.getClaimCoverTypes(this.claimNumber).pipe(untilDestroyed(this)).subscribe((res: ClaimCoverTypesDTO[]) => {
      this.claimCoverTypes = res;
      this.coverTypeCode = this.claimCoverTypes[0].cover_type_code;
      this.claimableAmount = this.claimCoverTypes[0].earnings;

      // Patch the claimableAmount field in the form
      this.coverDetailsForm.patchValue({
        claimableAmount: this.claimableAmount
      });
      this.cdr.detectChanges();
    });
  }

  /**
   * The function `getClaimPolicyDetails` retrieves claim policy details
   */
  getClaimPolicyDetails() {
    this.claimsService.getClaimPolicyDetails(this.policyCode, this.productCode).pipe(untilDestroyed(this)).subscribe((res: ClaimPolicyDetails[]) => {
      this.claimPolicyDetails = res;
      this.cdr.detectChanges();
    });
  }

  /**
   * The `getClaimInfo` function retrieves claim details using a service and updates the claim
   * information in the component.
   */
  getClaimInfo() {
    this.claimsService.getClaimDetails(this.claimNumber).pipe(untilDestroyed(this)).subscribe((res: ClaimDetailsDTO[]) => {
      this.claimInformation = res;
      this.cdr.detectChanges();
    });
  }

  /**
   * The function `getPayee()` retrieves list of Payees and assign to stream payee$
   */
  getPayee() {
    this.payee$ = this.claimsService.getPayee()
  }

  /**
   * The function onSubmitClaimCovDetailsForm handles form submission for updating claim cover details.
   * @returns The function `onSubmitClaimCovDetailsForm()` returns either a success message indicating
   * that the claim cover has been updated successfully, or an information message prompting the user
   * to select a payee if the payee field is empty.
   */
  onSubmitClaimCovDetailsForm() {
    const formValues = this.coverDetailsForm.value;
    const payload = {
      cover_type_code: this.coverTypeCode,
      amount_claimed: this.claimableAmount,
      benefit_payable: Number(formValues.butPayAmount),
      remarks: formValues.reason,
      payee: formValues.payee,
      claim_number: this.claimNumber
    }

    if (this.coverDetailsForm.get('payee')?.value === null || this.coverDetailsForm.get('payee')?.value === '') {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Select Payee!'
      });
      return;
    }
    this.claimsService.updateClaimCovers(this.coverTypeCode, payload).pipe(untilDestroyed(this)).subscribe((res) => {
      this.cdr.detectChanges();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Claim cover updated!'
      });
      this.coverDetailsForm.reset();
    })
}

}
