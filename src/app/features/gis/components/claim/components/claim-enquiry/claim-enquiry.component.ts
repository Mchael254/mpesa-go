import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as bootstrap from 'bootstrap';

// Data Model/DTO
export interface Claim {
  id?: number; // Optional for potential backend integration
  claimNumber: string;
  product: string;
  policy: string;
  lossDate: Date;
  lossTime: Date;
  risk: string;
  notificationDate: Date;
  causation: string;
  catastropheEvent: string;
  claimDescription: string;
  partyToBlame: string;
  averageBasicSalary: number;
  averageEarnings: number;
  offDutyDateFrom: Date;
  offDutyDateTo: Date;
  liabilityAdmission: boolean;
  nextReviewDate: Date;
  nextReviewUser: string;
  priorityLevel: string;
  referenceNumber: string;
  accidentLocation: string;
  perils: { label: string; value: number }[];
  transactions: Transaction[];
}

export interface Transaction {
  id?: number; // Optional for potential backend integration
  type: string;
  description: string;
  status: string;
  date: Date;
}

@Component({
  selector: 'app-claim-enquiry',
  templateUrl: './claim-enquiry.component.html',
  styleUrls: ['./claim-enquiry.component.css']
})
export class ClaimEnquiryComponent {
  claims: Claim[] = [
    // Sample claim data (replace with your actual data)
    {
      claimNumber: '1234567',
      product: 'Product A',
      policy: 'Policy 1',
      lossDate: new Date('2023-10-26'),
      lossTime: new Date('2023-10-26T10:00:00'),
      risk: 'Risk 1',
      notificationDate: new Date('2023-10-27'),
      causation: 'Causation 1',
      catastropheEvent: 'Catastrophe 1',
      claimDescription: 'Test Claim Description',
      partyToBlame: 'Third Party',
      averageBasicSalary: 1000,
      averageEarnings: 1500,
      offDutyDateFrom: new Date('2023-10-28'),
      offDutyDateTo: new Date('2023-10-30'),
      liabilityAdmission: true,
      nextReviewDate: new Date('2023-11-01'),
      nextReviewUser: 'User A',
      priorityLevel: 'High',
      referenceNumber: 'REF-123',
      accidentLocation: 'Test Location',
      perils: [
        { label: 'Peril 1', value: 1000 },
        { label: 'Peril 2', value: 500 }
      ],
      transactions: [
        { type: 'Loss Opening', description: 'Initial Loss Opening', status: 'Completed', date: new Date('2023-10-26') },
        { type: 'Claim Fee Payment', description: 'Claim Fee Payment', status: 'Pending', date: new Date('2023-10-27') }
      ]
    },
    // Add more sample claims here
  ];

  claimEnquiryForm: FormGroup; // Form for searching claims
  selectedClaim: Claim | null = null; // For tracking the selected claim
  selectedTransaction: Transaction | null = null; // For tracking selected transaction
  errors: string[] = []; // Array to store error messages

  /**
   * Constructor for the ClaimEnquiryComponent.
   *
   * @param fb FormBuilder instance for creating reactive forms.
   * @param messageService MessageService for displaying success/error messages.
   */
  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initClaimEnquiryForm();
  }

  /**
   * Initializes the reactive form for searching claims.
   */
  initClaimEnquiryForm() {
    this.claimEnquiryForm = this.fb.group({
      claimNumber: ['', Validators.required]
    });
  }

  /**
   * Finds a claim based on the entered claim number.
   */
  findClaim() {
    if (this.claimEnquiryForm.invalid) {
      return;
    }

    const claimNumber = this.claimEnquiryForm.get('claimNumber')?.value;
    this.selectedClaim = this.claims.find(claim => claim.claimNumber === claimNumber);

    if (this.selectedClaim) {
      this.messageService.add({ severity: 'success', summary: 'Claim Found', detail: 'Claim details found' });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Claim Not Found', detail: 'Claim not found' });
    }

    this.closeClaimEnquiryModal();
    this.claimEnquiryForm.reset();
  }

  /**
   * Shows the claim enquiry modal.
   */
  showClaimEnquiryModal() {
    const claimEnquiryModal = document.getElementById('claimEnquiryModal');
    if (claimEnquiryModal) {
      const modal = new bootstrap.Modal(claimEnquiryModal);
      modal.show();
    }
  }

  /**
   * Closes the claim enquiry modal.
   */
  closeClaimEnquiryModal() {
    const claimEnquiryModal = document.getElementById('claimEnquiryModal');
    if (claimEnquiryModal) {
      const modal = bootstrap.Modal.getInstance(claimEnquiryModal);
      modal.hide();
    }
  }

  /**
   * Shows the transaction details modal.
   *
   * @param transaction The transaction to view.
   */
  showTransactionModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    const transactionModal = document.getElementById('transactionModal');
    if (transactionModal) {
      const modal = new bootstrap.Modal(transactionModal);
      modal.show();
    }
  }

  /**
   * Prints the claim details (simulated).
   */
  printClaimDetails() {
    // Replace this with your actual PDF generation/download logic
    this.messageService.add({ severity: 'info', summary: 'Printing', detail: 'Generating and downloading the PDF report...' });
    console.log('Printing Claim Details', this.selectedClaim);
  }
}
