import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClaimsService } from '../../services/claims.service';
@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.css']
})
export class ClaimDetailsComponent {
  @Output() captureClaim = new EventEmitter<void>();

  claimForm: FormGroup;

  constructor(
    private fb: FormBuilder,
     private claimService: ClaimsService
    ) {
    this.claimForm = this.fb.group({
      product: ['', Validators.required],
      policy: ['', Validators.required],
      lossDate: ['', Validators.required],
      lossTime: ['', Validators.required],
      risk: ['', Validators.required],
      notificationDate: ['', Validators.required],
      causation: ['', Validators.required],
      catastropheEvent: [''],
      claimDescription: ['', Validators.required],
      partyToBlame: [''],
      averageBasicSalary: [''],
      averageEarnings: [''],
      offDutyDateFrom: [''],
      offDutyDateTo: [''],
      liabilityAdmission: [false],
      nextReviewDate: [''],
      nextReviewUser: [''],
      priorityLevel: [''],
      referenceNumber: [''],
      accidentLocation: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.claimForm.valid) {
      this.claimService.updateFormData(this.claimForm.value);
      this.captureClaim.emit();
    }
}
}