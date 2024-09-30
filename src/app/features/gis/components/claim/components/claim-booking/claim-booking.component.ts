import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

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
@Component({
  selector: 'app-claim-booking',
  templateUrl: './claim-booking.component.html',
  styleUrls: ['./claim-booking.component.css']
})
export class ClaimBookingComponent {
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
    claimantDetails: [],// Initialize claimantDetails as an empty array
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

  claimBookingForm: FormGroup; // Form for editing claim details
  isEditing = false; // Flag to track if editing mode is enabled
  causeOfLossOptions: string[] = ['Fire', 'Theft', 'Accident'];
  typeOfLossOptions: string[] = ['Total', 'Partial', 'Repairable'];
  salvageRetainedOptions: string[] = ['Full', 'Partial', 'None'];
  rainingOptions: string[] = ['Yes', 'No'];
  policeInformedOptions: string[] = ['Yes', 'No'];
  intendedProcedureOptions: string[] = ['Standard', 'Special'];
  exGratiaOptions: string[] = ['Yes', 'No'];
  disabilityScaleOptions: string[] = ['Minor', 'Moderate', 'Severe'];
  priorityLevelOptions: string[] = ['High', 'Medium', 'Low'];
  documentReceivedOptions: string[] = ['Received', 'Pending', 'Not Received'];
  riskRecoveredOptions: string[] = ['Yes', 'No'];
  vehicleInMotionOptions: string[] = ['Yes', 'No'];
  recoveryModeOptions: string[] = ['Salvage', 'Insurance'];
  vehicleRecoveredOptions: string[] = ['Yes', 'No'];
  vehicleRecoveredConditionOptions: string[] = ['Good', 'Damaged', 'Destroyed'];
  tentativeLossDateOptions: string[] = ['Yes', 'No'];

  /**
   * Constructor for the ClaimBookingDetailsComponent.
   *
   * @param fb FormBuilder instance for creating reactive forms.
   * @param messageService MessageService for displaying success/error messages.
   */
  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initClaimBookingForm();
  }

  /**
   * Initializes the reactive form for editing claim details.
   */
  initClaimBookingForm() {
    this.claimBookingForm = this.fb.group({
      lossDate: [this.claim.lossDate, Validators.required],
      causation: [this.claim.causation, Validators.required],
      claimRepudiated: [this.claim.claimRepudiated],
      reasonRepudiated: [this.claim.reasonRepudiated],
      accidentLocation: [this.claim.accidentLocation, Validators.required],
      lossDescription: [this.claim.lossDescription, Validators.required],
      reasonForPending: [this.claim.reasonForPending],
      receivedSteps: [this.claim.receivedSteps],
      typeOfLoss: [this.claim.typeOfLoss, Validators.required],
      salvageRetained: [this.claim.salvageRetained, Validators.required],
      preventionMeasures: [this.claim.preventionMeasures],
      anySuspects: [this.claim.anySuspects],
      guards: [this.claim.guards],
      amountOwedToDebtor: [this.claim.amountOwedToDebtor],
      totalClaimAmount: [this.claim.totalClaimAmount],
      visibility: [this.claim.visibility],
      roadSurface: [this.claim.roadSurface],
      raining: [this.claim.raining, Validators.required],
      policeInformed: [this.claim.policeInformed, Validators.required],
      policeDate: [this.claim.policeDate],
      policeStation: [this.claim.policeStation],
      reporter: [this.claim.reporter],
      policeOBNumber: [this.claim.policeOBNumber],
      intendedProcedure: [this.claim.intendedProcedure, Validators.required],
      exGratia: [this.claim.exGratia],
      reasonForExGratia: [this.claim.reasonForExGratia],
      reasonForRevision: [this.claim.reasonForRevision],
      disabilityScale: [this.claim.disabilityScale, Validators.required],
      disabilityScaleShortDescription: [this.claim.disabilityScaleShortDescription],
      incapacityPeriod: [this.claim.incapacityPeriod],
      payFull: [this.claim.payFull],
      claimNotificationDate: [this.claim.claimNotificationDate, Validators.required],
      eventCode: [this.claim.eventCode, Validators.required],
      catastropheCode: [this.claim.catastropheCode, Validators.required],
      division: [this.claim.division, Validators.required],
      referenceNumber: [this.claim.referenceNumber, Validators.required],
      averageBasicSalary: [this.claim.averageBasicSalary, Validators.required],
      averageEarnings: [this.claim.averageEarnings, Validators.required],
      offDutyDateFrom: [this.claim.offDutyDateFrom, Validators.required],
      offDutyDateTo: [this.claim.offDutyDateTo, Validators.required],
      priorityLevel: [this.claim.priorityLevel, Validators.required],
      notificationDate: [this.claim.notificationDate, Validators.required],
      nextReviewDate: [this.claim.nextReviewDate, Validators.required],
      liabilityAdmission: [this.claim.liabilityAdmission],
      insurerLiabilityAdmission: [this.claim.insurerLiabilityAdmission],
      documentReceived: [this.claim.documentReceived, Validators.required],
      liabilityAdmissionDate: [this.claim.liabilityAdmissionDate],
      repudiationDate: [this.claim.repudiationDate],
      liabilityReason: [this.claim.liabilityReason],
      nextReviewUser: [this.claim.nextReviewUser, Validators.required],
      leadClaimNumber: [this.claim.leadClaimNumber],
      riskRecovered: [this.claim.riskRecovered, Validators.required],
      vehicleInMotion: [this.claim.vehicleInMotion, Validators.required],
      recoveryMode: [this.claim.recoveryMode, Validators.required],
      riskRecoveryDate: [this.claim.riskRecoveryDate],
      vehicleRecovered: [this.claim.vehicleRecovered],
      vehicleRecoveredDate: [this.claim.vehicleRecoveredDate],
      vehicleRecoveredCondition: [this.claim.vehicleRecoveredCondition, Validators.required],
      tentativeLossDate: [this.claim.tentativeLossDate]
    });
  }

  /**
   * Enables editing mode.
   */
  editClaimDetails() {
    this.isEditing = true;
  }

  /**
   * Saves the updated claim booking details.
   */
  saveClaimBookingDetails() {
    if (this.claimBookingForm.invalid) {
      return;
    }

    // Update the claim object with the form values
    this.claim = { ...this.claim, ...this.claimBookingForm.value };
    this.isEditing = false;
    this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Claim Booking Details saved successfully' });
  }
}
