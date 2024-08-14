import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-claim-investigation',
  templateUrl: './claim-investigation.component.html',
  styleUrls: ['./claim-investigation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimInvestigationComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimInvestigationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.claimInvForm();
    
  }

  ngOnDestroy(): void {
    
  }

  claimInvForm() {
    this.claimInvestigationForm = this.fb.group({
      investigator: [""],
      requestDate: [""],
      submissionDate: [""],
      remarks: [""],
      invoiceNumber: [""],
      invoiceDate: [""],
      invoiceAmount: [""],
      paymentMode: [""],
      accountNumber: [""],
    });
  }

}