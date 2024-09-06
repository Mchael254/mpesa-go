import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { ClaimCoverTypesDTO, ClaimDetailsDTO, ClaimPolicyDetails, PayeeDTO } from '../../models/claim-models';
import { ClaimsService } from '../../service/claims.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

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
  coverType: string;
  claimableAmount: number;
  policyCode: number;
  productCode: number;
  payee$: Observable<PayeeDTO[]>;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private claimsService: ClaimsService,
    private messageService: MessageService,
    private router: Router,
    private session_storage: SessionStorageService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit(): void {
    this.getParams();
    this.getClaimPolicyDetails();
    this.getClaimInfo();
    this.getClaimCoverTypes();
    this.editCoverDetailsForm();
    this.getPayee();

  }

  ngOnDestroy(): void {

  }

  toggleFormVisibility(coverTypeCode: number) {
    const selectedCover = this.claimCoverTypes.find(cover => cover.cover_type_code === coverTypeCode);
    if (selectedCover) {
      this.coverTypeCode = selectedCover.cover_type_code,
      this.coverType = selectedCover.cover_type_description,
      this.claimableAmount = selectedCover.amount_claimed,

      // Update the form with the selected cover details
      this.coverDetailsForm.patchValue({
        claimableAmount: this.claimableAmount,
      });
    }
  
    // Toggle form visibility
    this.isFormVisible = !this.isFormVisible;
    this.cdr.detectChanges();
  }
  
editCoverDetailsForm() {
  this.coverDetailsForm = this.fb.group({
    claimableAmount: [{ value: '', disabled: true }],
    butPayAmount: [""],
    reason: [""],
    payee: ["", Validators.required],
  });
}

  getParams() {
    //to remove once fetched from endpoint
    const polAndProdCode = this.session_storage.get('polAndProdCode');
    if (polAndProdCode) {
      this.productCode = polAndProdCode.productCode;
      this.policyCode = polAndProdCode.policyCode;
    }
    // Get the claim number from the query parameters
    const claimNumberFromRoute = this.activatedRoute.snapshot.queryParams['claimNumber'];

    // If the claim number from the route is null, empty, or undefined, use the session storage value
    this.claimNumber = claimNumberFromRoute || this.session_storage.get('claimNumber');

    this.cdr.detectChanges();
  }

 /**
  * The function `getClaimCoverTypes` retrieves claim cover types data and updates the claimableAmount
  * fields in the form.
  */
  getClaimCoverTypes() {
    this.claimsService.getClaimCoverTypes(this.claimNumber).pipe(untilDestroyed(this)).subscribe((res: ClaimCoverTypesDTO[]) => {
      this.claimCoverTypes = res;
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

  investigateClaim() {
    this.router.navigate(['/home/lms/grp/claims/investigation'], {
      queryParams: {
        claimNumber: this.claimNumber,
      }
    });
  }

  /**
   * process claim and proceed without investigation
   */
  processClaim() {
    if (this.coverTypeCode === undefined || this.coverTypeCode === null) {
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Select covertype to process'
      });
    } else {

      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Are you sure you want to process Claim for ' + this.coverType + ' ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: "p-button-text",
        accept: () => {
          this.claimsService.processClaim(this.claimNumber, this.coverTypeCode).pipe(untilDestroyed(this)).subscribe((res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Claim processed successfully!'
            });

            this.router.navigate(['/home/lms/grp/claims/payment'], {
              queryParams: {
                claimNumber: this.claimNumber,
              }
            });
          }, () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Claim processing failed!'
            });
          });
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Select another cover to process', life: 3000 });
        }
      });
    }
  }


}
