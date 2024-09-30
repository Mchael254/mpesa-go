import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
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
  // Additional fields for Claim Booking Details
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
  claimantDetails: Claimant[]; // Array to hold claimant details (optional)
  // Newly added properties
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

export interface PerilRevision {
  id?: number; // Optional for potential backend integration
  revisionOn: string; // Claimant or Service Provider
  claimantOrServiceProviderId: number; // ID of the claimant or service provider
  peril: string;
  perilExcessAmount: number;
  depreciationRate: number;
  retainedSalvage: number;
  initialReserveAmount: number;
  perilRemarks: string;
  perilOutstandingAmount: number;
}

export interface ServiceProvider {
  id?: number; // Optional for potential backend integration
  name: string;
  // ... other service provider details
}

@Component({
  selector: 'app-claim-revisions',
  templateUrl: './claim-revisions.component.html',
  styleUrls: ['./claim-revisions.component.css']
})
export class ClaimRevisionsComponent {
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
    tentativeLossDate: false
  };

  claimants: Claimant[] = [
    // Sample claimant data
    {
      name: 'John Doe',
      idNumber: '123456789',
      address: '123 Main Street',
      phone: '555-123-4567',
      email: 'john.doe@example.com',
      communicationChannels: { phone: '', email: '', sms: '' },
      liabilityAdmission: false,
      liabilityAdmissionDate: null,
      conditional: null
    }
    // Add more sample claimants here if needed
  ];

  serviceProviders: ServiceProvider[] = [
    // Sample service providers
    { id: 1, name: 'Service Provider A' },
    { id: 2, name: 'Service Provider B' }
  ];

  perils: { label: string; value: string }[] = [
    { label: 'Peril 1', value: 'peril1' },
    { label: 'Peril 2', value: 'peril2' }
  ];

  perilRevisionForm: FormGroup; // Form for adding/editing peril revisions
  perilRevisions: PerilRevision[] = []; // Array to hold peril revisions
  selectedPerilRevision: PerilRevision | null = null; // For tracking the selected peril revision
  selectedClaimant: Claimant | null = null;
  selectedServiceProvider: ServiceProvider | null = null;
  selectedPeril: string | null = null;
  showPerilRevisionmodal = false; // Flag to control the peril revision modal
  showClaimantOrServiceProviderDropdown = false; // Flag to control the claimant/service provider dropdown

  /**
   * Constructor for the ClaimRevisionComponent.
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
    this.initPerilRevisionForm();
  }

  /**
   * Initializes the reactive form for adding/editing peril revisions.
   */
  initPerilRevisionForm() {
    this.perilRevisionForm = this.fb.group({
      revisionOn: ['', Validators.required],
      claimantOrServiceProviderId: ['', Validators.required],
      peril: ['', Validators.required],
      perilExcessAmount: [0],
      depreciationRate: [0],
      retainedSalvage: [0],
      initialReserveAmount: [0],
      perilRemarks: [''],
      perilOutstandingAmount: [0]
    });
  }

  /**
   * Adds a new peril revision.
   */
  addPerilRevision() {
    this.selectedPerilRevision = null;
    this.perilRevisionForm.reset();
    this.showClaimantOrServiceProviderDropdown = true; // Show the dropdown for claimant/service provider
    this.showPerilRevisionmodal = true; // Open the modal
  }

  /**
   * Saves a new peril revision.
   */
  savePerilRevision() {
    if (this.perilRevisionForm.invalid) {
      return;
    }

    const newPerilRevision = { ...this.perilRevisionForm.value, id: this.perilRevisions.length + 1 };
    this.perilRevisions.push(newPerilRevision);
    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Peril Revision added successfully' });
    this.closePerilRevisionModal();
    this.perilRevisionForm.reset();
  }

  /**
   * Edits a peril revision.
   *
   * @param perilRevision The peril revision to edit.
   */
  editPerilRevision(perilRevision: PerilRevision) {
    this.selectedPerilRevision = perilRevision;
    this.perilRevisionForm.patchValue(perilRevision);
    this.showPerilRevisionmodal = true;
  }

  /**
   * Saves the edited peril revision details.
   */
  savePerilRevisionDetails() {
    if (this.perilRevisionForm.invalid) {
      return;
    }

    if (this.selectedPerilRevision) {
      const index = this.perilRevisions.findIndex(pr => pr.id === this.selectedPerilRevision.id);
      if (index !== -1) {
        this.perilRevisions[index] = { ...this.perilRevisions[index], ...this.perilRevisionForm.value };
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Peril Revision updated successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Peril Revision not found' });
      }
    }

    this.closePerilRevisionModal();
    this.perilRevisionForm.reset();
  }

  /**
   * Deletes a peril revision.
   *
   * @param perilRevision The peril revision to delete.
   */
  deletePerilRevision(perilRevision: PerilRevision) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this Peril Revision?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const index = this.perilRevisions.findIndex(pr => pr.id === perilRevision.id);
        if (index !== -1) {
          this.perilRevisions.splice(index, 1);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Peril Revision deleted successfully' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Peril Revision not found' });
        }
      },
      reject: () => {
        // Do nothing if canceled
      }
    });
  }

  /**
   * Shows the peril revision modal.
   */
  showPerilRevisionModal() {
    const perilRevisionModal = document.getElementById('perilRevisionModal');
    if (perilRevisionModal) {
      const modal = new bootstrap.Modal(perilRevisionModal);
      modal.show();
    }
  }

  /**
   * Closes the peril revision modal.
   */
  closePerilRevisionModal() {
    const perilRevisionModal = document.getElementById('perilRevisionModal');
    if (perilRevisionModal) {
      const modal = bootstrap.Modal.getInstance(perilRevisionModal);
      modal.hide();
    }
  }

  /**
   * Handles the selection of the revision target (claimant or service provider).
   *
   * @param event The selected value from the dropdown.
   */
  onRevisionTargetChange(event: any) {
    this.showClaimantOrServiceProviderDropdown = true; // Show the dropdown for claimant/service provider
    this.showPerilRevisionmodal = true;
  }

  /**
   * Finds the claimant or service provider based on the selected target.
   *
   * @param event The selected value from the dropdown.
   */
  findClaimantOrServiceProvider(event: any) {
    const target = event.value;

    if (target === 'Claimant') {
      this.showClaimantOrServiceProviderDropdown = false; // Hide the dropdown
      // You would typically fetch claimants from your backend based on the claim
      // For demo, we're using the sample claimants data
    } else if (target === 'Service Provider') {
      this.showClaimantOrServiceProviderDropdown = false; // Hide the dropdown
      // You would typically fetch service providers from your backend based on the claim
      // For demo, we're using the sample service providers data
    }
  }

  /**
   * Finds the perils for the selected claimant/service provider.
   *
   * @param event The selected value from the dropdown.
   */
  findPerils(event: any) {
    const selectedId = event.value;

    // You would typically fetch perils from your backend based on the selected claimant/service provider
    // For demo, we're using the sample perils data
  }

  viewTransaction(perilRevision: PerilRevision) {
    // You would typically navigate to a separate component or modal to show the transaction details
    // Here, we're just logging the perilRevision for now
    console.log('Viewing transaction details for Peril Revision:', perilRevision);
  }

}