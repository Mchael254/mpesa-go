import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as bootstrap from 'bootstrap';

// Data Model/DTO
export interface CourtCase {
  id?: number; // Optional for potential backend integration
  caseNumber: string;
  courtName: string;
  caseType: string;
  caseStatus: string; // 'Pending', 'Active', 'Closed'
  caseDate: Date | null;
  caseDescription: string;
  caseDocuments: Document[]; // Array of documents related to the case
}

export interface Document {
  id?: number; // Optional for potential backend integration
  name: string;
  status: string; // 'Submitted', 'Pending', 'Not Received'
  submissionDate: Date | null;
  referenceNumber: string;
  remarks: string;
  documentType: string; // Type of document (e.g., 'Claim Form', 'ID Proof')
  documentUser: string; // User responsible for the document
  documentUrl: string | null; // URL for the uploaded document (if available)
}
@Component({
  selector: 'app-court-case-management',
  templateUrl: './court-case-management.component.html',
  styleUrls: ['./court-case-management.component.css']
})
export class CourtCaseManagementComponent {
  courtCases: CourtCase[] = [
    // Sample court cases (replace with your actual data)
    {
      caseNumber: 'CC-12345',
      courtName: 'High Court',
      caseType: 'Personal Injury',
      caseStatus: 'Pending',
      caseDate: new Date('2023-10-25'),
      caseDescription: 'Personal Injury claim against XYZ Company',
      caseDocuments: [
        { name: 'Court Summons', status: 'Submitted', submissionDate: new Date('2023-10-26'), referenceNumber: 'REF-123', remarks: '', documentType: 'Court Document', documentUser: 'User A', documentUrl: null }
      ]
    }
    // Add more sample court cases here
  ];

  courtCaseForm: FormGroup; // Reactive form for adding/editing court cases
  selectedCourtCase: CourtCase | null = null; // For tracking the selected court case
  showConfirmationDialog = false; // For the delete confirmation dialog
  errors: string[] = []; // Array to store error messages

  /**
   * Constructor for the CourtCaseManagementComponent.
   *
   * @param fb FormBuilder instance for creating reactive forms.
   * @param confirmationService ConfirmationService for the delete confirmation dialog.
   * @param messageService MessageService for displaying success/error messages.
   */
  constructor(private fb: FormBuilder, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initCourtCaseForm();
  }

  /**
   * Initializes the reactive form for adding/editing court cases.
   */
  initCourtCaseForm() {
    this.courtCaseForm = this.fb.group({
      caseNumber: ['', Validators.required],
      courtName: ['', Validators.required],
      caseType: ['', Validators.required],
      caseStatus: ['', Validators.required],
      caseDate: [null],
      caseDescription: ['', Validators.required]
    });
  }

  /**
   * Adds a new court case.
   */
  addCourtCase() {
    this.selectedCourtCase = null;
    this.courtCaseForm.reset();
    this.showCourtCaseModal();
  }

  /**
   * Edits the details of a selected court case.
   *
   * @param courtCase The court case to edit.
   */
  editCourtCase(courtCase: CourtCase) {
    this.selectedCourtCase = courtCase;
    this.courtCaseForm.patchValue(courtCase);
    this.showCourtCaseModal();
  }

  /**
   * Saves the court case details (either add or update).
   */
  saveCourtCase() {
    if (this.courtCaseForm.invalid) {
      return;
    }

    // Check if adding a new court case or editing existing one
    if (this.selectedCourtCase) {
      // Update existing court case
      const index = this.courtCases.findIndex(c => c.id === this.selectedCourtCase.id);
      if (index !== -1) {
        this.courtCases[index] = { ...this.courtCases[index], ...this.courtCaseForm.value };
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Court case details updated successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Court case not found' });
      }
    } else {
      // Add new court case
      const newCourtCase = { ...this.courtCaseForm.value, id: this.courtCases.length + 1 }; // Assign a new ID for demo
      this.courtCases.push(newCourtCase);
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Court case added successfully' });
    }

    this.closeCourtCaseModal();
    this.courtCaseForm.reset(); // Reset the form after saving
  }

  /**
   * Deletes the selected court case.
   *
   * @param courtCase The court case to delete.
   */
  deleteCourtCase(courtCase: CourtCase) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete Court Case ${courtCase.caseNumber}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const index = this.courtCases.findIndex(c => c.id === courtCase.id);
        if (index !== -1) {
          this.courtCases.splice(index, 1);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Court case deleted successfully' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Court case not found' });
        }
      },
      reject: () => {
        // Do nothing if canceled
      }
    });
  }

  /**
   * Shows the court case details modal.
   */
  showCourtCaseModal() {
    const courtCaseModal = document.getElementById('courtCaseModal');
    if (courtCaseModal) {
      const modal = new bootstrap.Modal(courtCaseModal);
      modal.show();
    }
  }

  /**
   * Closes the court case details modal.
   */
  closeCourtCaseModal() {
    const courtCaseModal = document.getElementById('courtCaseModal');
    if (courtCaseModal) {
      const modal = bootstrap.Modal.getInstance(courtCaseModal);
      modal.hide();
    }
  }
}
