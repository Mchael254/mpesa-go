import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.editCoverDetailsForm();

  }

  ngOnDestroy(): void {

  }

  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
  }

  claimDetails = [
    {
      product: "Life Insurance",
      cause_type: "Accident",
      death_location: "New York",
      policy: "Policy12345",
      cause_description: "Car accident",
      date_reported: '2024-08-15',
      member_name: "John Doe",
      date_of_accident: new Date('2024-08-10')
    }
  ];

  coverDetails = [
    {
      cover_type: "Death",
      sum_assured: 30000,
      reserved_amount: 25000
    },
    {
      cover_type: "Accident",
      sum_assured: 50000,
      reserved_amount: 45000
    },
    {
      cover_type: "Critical Illness",
      sum_assured: 100000,
      reserved_amount: 85000
    }
  ];
  
editCoverDetailsForm() {
  this.coverDetailsForm = this.fb.group({
    claimableAmount: [{ value: '', disabled: true }],
    butPayAmount: [""],
    reason: [""],
    payee: ["", Validators.required],
    butPayAmount2: [""],
  });
}

}
