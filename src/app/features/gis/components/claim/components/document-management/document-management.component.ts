import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as bootstrap from 'bootstrap';

// Data Model/DTO
export interface Claim {
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
  transactions: { type: string; description: string; status: string; date: Date }[];
  claimRepudiated: boolean;
  reasonRepudiated: string;
  lossDescription: string;
  reasonForPending: string;
  receivedSteps: string;
  typeOfLoss: string;
  salvageRetained: string;
  preventionMeasures: string;
  anySuspects: string;
  guards: string;
  amountOwedToDebtor: number;
  totalClaimAmount: number;
  visibility: string;
  roadSurface: string;
  raining: boolean;
  policeInformed: boolean;
  policeDate: Date | null;
  policeStation: string;
  reporter: string;
  policeOBNumber: string;
  intendedProcedure: string;
  exGratia: boolean;
  reasonForExGratia: string;
  reasonForRevision: string;
  disabilityScale: string;
  disabilityScaleShortDescription: string;
  incapacityPeriod: number;
  payFull: boolean;
  claimNotificationDate: Date;
  eventCode: string;
  catastropheCode: string;
  division: string;
  claimantDetails: any[]; // Initialize claimantDetails as an empty array
  insurerLiabilityAdmission: boolean;
  documentReceived: string;
  liabilityAdmissionDate: Date | null;
  repudiationDate: Date | null;
  liabilityReason: string;
  leadClaimNumber: string;
  riskRecovered: boolean;
  vehicleInMotion: boolean;
  recoveryMode: string;
  riskRecoveryDate: Date | null;
  vehicleRecovered: boolean;
  vehicleRecoveredDate: Date | null;
  vehicleRecoveredCondition: string;
  tentativeLossDate: boolean;
  requiredDocuments: Document[]; // Array to hold required documents
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

export interface Transaction {
  id?: number; // Optional for potential backend integration
  type: string;
  description: string;
  status: string;
  date: Date;
}

export interface Claimant {
  id?: number; // Optional for potential backend integration
  name: string;
  idNumber: string;
  address: string;
  phone: string;
  email: string;
  communicationChannels: {
    phone: string;
    email: string;
    sms: string;
  };
  liabilityAdmission: boolean;
  liabilityAdmissionDate: Date | null;
  conditional: string | null; // For conditional liability admission
}

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.css']
})
export class DocumentManagementComponent {
  claim: Claim = {
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
    ],
    claimRepudiated: false,
    reasonRepudiated: '',
    lossDescription: '',
    reasonForPending: '',
    receivedSteps: '',
    typeOfLoss: '',
    salvageRetained: '',
    preventionMeasures: '',
    anySuspects: '',
    guards: '',
    amountOwedToDebtor: 0,
    totalClaimAmount: 0,
    visibility: '',
    roadSurface: '',
    raining: false,
    policeInformed: false,
    policeDate: null,
    policeStation: '',
    reporter: '',
    policeOBNumber: '',
    intendedProcedure: '',
    exGratia: false,
    reasonForExGratia: '',
    reasonForRevision: '',
    disabilityScale: '',
    disabilityScaleShortDescription: '',
    incapacityPeriod: 0,
    payFull: false,
    claimNotificationDate: new Date(),
    eventCode: '',
    catastropheCode: '',
    division: '',
    claimantDetails: [], // Initialize claimantDetails as an empty array
    insurerLiabilityAdmission: false,
    documentReceived: 'Pending',
    liabilityAdmissionDate: null,
    repudiationDate: null,
    liabilityReason: '',
    leadClaimNumber: '',
    riskRecovered: false,
    vehicleInMotion: false,
    recoveryMode: '',
    riskRecoveryDate: null,
    vehicleRecovered: false,
    vehicleRecoveredDate: null,
    vehicleRecoveredCondition: '',
    tentativeLossDate: false,
    requiredDocuments: [
      { name: 'Claim Form', status: 'Pending', submissionDate: null, referenceNumber: '', remarks: '', documentType: 'Claim Form', documentUser: '', documentUrl: null },
      { name: 'ID Proof', status: 'Submitted', submissionDate: new Date('2023-10-27'), referenceNumber: 'REF-123', remarks: '', documentType: 'ID Proof', documentUser: 'User A', documentUrl: null }
    ]
  };

  documentForm: FormGroup; // Form for adding/editing documents
  selectedDocument: Document | null = null; // For tracking the selected document
  showConfirmationDialog = false; // For the delete confirmation dialog
  showUploadDialog = false; // For the document upload dialog
  documentTypes: string[] = ['Claim Form', 'ID Proof', 'Medical Report', 'Police Report']; // Sample document types
  errors: string[] = []; // Array to store error messages

  /**
   * Constructor for the DocumentManagementComponent.
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
    this.initDocumentForm();
  }

  /**
   * Initializes the reactive form for adding/editing documents.
   */
  initDocumentForm() {
    this.documentForm = this.fb.group({
      name: ['', Validators.required],
      status: ['', Validators.required],
      submissionDate: [null],
      referenceNumber: [''],
      remarks: [''],
      documentType: ['', Validators.required],
      documentUser: ['']
    });
  }

  /**
   * Adds a new document.
   */
  addDocument() {
    this.selectedDocument = null;
    this.documentForm.reset();
    this.showDocumentModal();
  }

  /**
   * Edits the details of a selected document.
   *
   * @param document The document to edit.
   */
  editDocument(document: Document) {
    this.selectedDocument = document;
    this.documentForm.patchValue(document);
    this.showDocumentModal();
  }

  /**
   * Saves the document details (either add or update).
   */
  saveDocument() {
    if (this.documentForm.invalid) {
      return;
    }

    // Check if adding a new document or editing existing one
    if (this.selectedDocument) {
      // Update existing document
      const index = this.claim.requiredDocuments.findIndex(d => d.id === this.selectedDocument.id);
      if (index !== -1) {
        this.claim.requiredDocuments[index] = { ...this.claim.requiredDocuments[index], ...this.documentForm.value };
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Document details updated successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Document not found' });
      }
    } else {
      // Add new document
      const newDocument = { ...this.documentForm.value, id: this.claim.requiredDocuments.length + 1 }; // Assign a new ID for demo
      this.claim.requiredDocuments.push(newDocument);
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Document added successfully' });
    }

    this.closeDocumentModal();
    this.documentForm.reset(); // Reset the form after saving
  }

  /**
   * Deletes the selected document.
   *
   * @param document The document to delete.
   */
  deleteDocument(document: Document) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${document.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const index = this.claim.requiredDocuments.findIndex(d => d.id === document.id);
        if (index !== -1) {
          this.claim.requiredDocuments.splice(index, 1);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Document deleted successfully' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Document not found' });
        }
      },
      reject: () => {
        // Do nothing if canceled
      }
    });
  }

  /**
   * Shows the document details modal.
   */
  showDocumentModal() {
    const documentModal = document.getElementById('documentModal');
    if (documentModal) {
      const modal = new bootstrap.Modal(documentModal);
      modal.show();
    }
  }

  /**
   * Closes the document details modal.
   */
  closeDocumentModal() {
    const documentModal = document.getElementById('documentModal');
    if (documentModal) {
      const modal = bootstrap.Modal.getInstance(documentModal);
      modal.hide();
    }
  }

  /**
   * Shows the document upload modal.
   */
  showUploadModal() {
    this.showUploadDialog = true;
  }

  /**
   * Handles the document upload (simulated).
   */
  uploadDocument() {
    // Replace this with your actual document upload logic
    this.messageService.add({ severity: 'info', summary: 'Uploading', detail: 'Uploading document...' });
    this.showUploadDialog = false;
  }

  /**
   * Shows the document details.
   *
   * @param document The document to view.
   */
  viewDocument(document: Document) {
    // Simulate opening a modal or displaying the document details
    console.log('Viewing document:', document);
    this.messageService.add({ severity: 'info', summary: 'Viewing', detail: 'Document details are being displayed' });
  }

  /**
   * Downloads the selected document (simulated).
   *
   * @param document The document to download.
   */
  downloadDocument(document: Document) {
    // Replace this with your actual document download logic
    this.messageService.add({ severity: 'info', summary: 'Downloading', detail: 'Downloading document...' });
    console.log('Downloading document:', document);
  }

  /**
   * Views/edits the document in DMS (simulated).
   *
   * @param document The document to view/edit.
   */
  viewInDMS(document: Document) {
    // Replace this with your actual DMS integration logic
    this.messageService.add({ severity: 'info', summary: 'DMS', detail: 'Opening document in DMS' });
    console.log('Viewing/editing document in DMS:', document);
  }

  /**
   * Prints the selected document (simulated).
   *
   * @param document The document to print.
   */
  printDocument(document: Document) {
    // Replace this with your actual document printing logic
    this.messageService.add({ severity: 'info', summary: 'Printing', detail: 'Printing document...' });
    console.log('Printing document:', document);
  }
}
