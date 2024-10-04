import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import * as bootstrap from 'bootstrap';
// Data Model/DTO
export interface Memo {
  id?: number; // Optional for potential backend integration
  applicationLevel: string;
  claimNumber: string;
  memoType: string;
  addressee: string;
  branch: string;
  salutation: string;
  attentionText: string;
  memoHeader: string;
  memoDetails: string;
  mergeFields: { [key: string]: string }; // Dictionary to store merge field values
}

export interface MemoType {
  id?: number; // Optional for potential backend integration
  name: string;
  template: string; // Template string with merge fields
}

export interface Addressee {
  id?: number; // Optional for potential backend integration
  name: string;
  to: string; // "To" field value
  address: string; // Address field value
}

@Component({
  selector: 'app-letters-and-memos',
  templateUrl: './letters-and-memos.component.html',
  styleUrls: ['./letters-and-memos.component.css']
})
export class LettersAndMemosComponent {
  memoTypes: MemoType[] = [
    // Sample memo types
    { name: 'Claim Acknowledgement', template: 'Dear [Insured],\n\nThis memo acknowledges receipt of your claim for [Claim No].\n\nKind regards,\n\n[Your Name]' },
    { name: 'Repudiation Notice', template: 'Dear [Insured],\n\nThis memo informs you that your claim for [Claim No] has been repudiated due to [Reason].\n\nKind regards,\n\n[Your Name]' }
  ];

  addressees: Addressee[] = [
    // Sample addressees
    { name: 'John Doe', to: 'John Doe', address: '123 Main Street' },
    { name: 'Jane Doe', to: 'Jane Doe', address: '456 Oak Avenue' }
  ];

  applicationLevels: string[] = ['Individual', 'Corporate'];
  branches: string[] = ['Branch A', 'Branch B'];
  selectedMemoType: MemoType | null = null; // For tracking the selected memo type
  selectedAddressee: Addressee | null = null; // For tracking the selected addressee
  memoForm: FormGroup; // Form for creating/editing memos
  memo: Memo | null = null; // For tracking the current memo being edited
  mergeFieldValues: { [key: string]: string } = {}; // To store merge field values
  mergeFieldKeys: string[] = []; // To store merge field keys
  showMergeFieldmodal = false; // For the merge field modal
  errors: string[] = []; // Array to store error messages

  /**
   * Constructor for the LettersAndMemosComponent.
   *
   * @param fb FormBuilder instance for creating reactive forms.
   * @param messageService MessageService for displaying success/error messages.
   */
  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initMemoForm();
  }

  /**
   * Initializes the reactive form for creating/editing memos.
   */
  initMemoForm() {
    this.memoForm = this.fb.group({
      applicationLevel: ['', Validators.required],
      claimNumber: ['', Validators.required],
      memoType: ['', Validators.required],
      addressee: ['', Validators.required],
      branch: ['', Validators.required],
      salutation: [''],
      attentionText: [''],
      memoHeader: [''],
      memoDetails: ['']
    });
  }

  /**
   * Creates a new memo.
   */
  createMemo() {
    this.memo = null;
    this.memoForm.reset();
    this.showMemoModal();
  }

  /**
   * Saves the memo.
   */
  saveMemo() {
    if (this.memoForm.invalid) {
      return;
    }

    // Check if editing an existing memo or creating a new one
    if (this.memo) {
      // Update existing memo
      const index = this.memoTypes.findIndex(mt => mt.id === this.selectedMemoType?.id);
      if (index !== -1) {
        this.memoTypes[index] = { ...this.memoTypes[index], ...this.memoForm.value };
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Memo updated successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Memo not found' });
      }
    } else {
      // Create new memo
      const newMemo = { ...this.memoForm.value, id: this.memoTypes.length + 1 }; // Assign a new ID for demo
      this.memoTypes.push(newMemo);
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Memo added successfully' });
    }

    this.closeMemoModal();
    this.memoForm.reset(); // Reset the form after saving
  }

  /**
   * Validates the memo header.
   */
  validateMemoHeader() {
    const memoHeader = this.memoForm.get('memoHeader')?.value;
    if (memoHeader && memoHeader.includes('[')) {
      this.showMergeFieldmodal = true; // Open the merge field modal
      this.errors = []; // Clear previous errors
    } else {
      this.errors = [];
      this.messageService.add({ severity: 'info', summary: 'Validation', detail: 'Memo Header is valid' });
    }
  }

  /**
   * Validates the memo details/body.
   */
  validateMemoDetails() {
    const memoDetails = this.memoForm.get('memoDetails')?.value;
    if (memoDetails && memoDetails.includes('[')) {
      this.showMergeFieldmodal = true; // Open the merge field modal
      this.errors = []; // Clear previous errors
    } else {
      this.errors = [];
      this.messageService.add({ severity: 'info', summary: 'Validation', detail: 'Memo Details are valid' });
    }
  }

  /**
   * Shows the memo modal.
   */
  showMemoModal() {
    const memoModal = document.getElementById('memoModal');
    if (memoModal) {
      const modal = new bootstrap.Modal(memoModal);
      modal.show();
    }
  }

  /**
   * Closes the memo modal.
   */
  closeMemoModal() {
    const memoModal = document.getElementById('memoModal');
    if (memoModal) {
      const modal = bootstrap.Modal.getInstance(memoModal);
      modal.hide();
    }
  }

  /**
   * Shows the merge field modal.
   */
  showMergeFieldModal() {
    const mergeFieldModal = document.getElementById('mergeFieldModal');
    if (mergeFieldModal) {
      const modal = new bootstrap.Modal(mergeFieldModal);
      modal.show();
    }

    // Update the mergeFieldKeys after showing the modal
    this.mergeFieldKeys = Object.keys(this.mergeFieldValues);
  }

  /**
   * Closes the merge field modal.
   */
  closeMergeFieldModal() {
    const mergeFieldModal = document.getElementById('mergeFieldModal');
    if (mergeFieldModal) {
      const modal = bootstrap.Modal.getInstance(mergeFieldModal);
      modal.hide();
    }
  }

  /**
   * Saves the merge field values.
   */
  saveMergeFieldValues() {
    // Extract values from the form
    this.mergeFieldValues = { ...this.memoForm.value };
    this.closeMergeFieldModal();
    this.messageService.add({ severity: 'info', summary: 'Saved', detail: 'Merge fields saved' });
  }
}
