import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ClaimsService } from '../../services/claims.service';
import * as bootstrap from 'bootstrap';


// Data Model/DTO
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
  selector: 'app-claimant-management',
  templateUrl: './claimant-management.component.html',
  styleUrls: ['./claimant-management.component.css']
})
export class ClaimantManagementComponent {
  claimants: Claimant[] = [
    // Initial sample claimant data
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
    },
    // Add more sample claimants here if needed
  ];

  claimantForm: FormGroup; // Reactive form for adding/editing claimants
  selectedClaimant: Claimant | null = null; // For tracking the selected claimant
  showConfirmationDialog = false; // For the delete confirmation dialog

  /**
   * Constructor for the ClaimantManagementComponent.
   *
   * @param fb FormBuilder instance for creating reactive forms.
   * @param confirmationService ConfirmationService for the delete confirmation dialog.
   * @param messageService MessageService for displaying success/error messages.
   */
  constructor(
    private fb: FormBuilder, 
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    public claimService:ClaimsService
  ) { }

  /**
   * Initializes the component.
   */
  ngOnInit(): void {
    this.initClaimantForm();
  
  }

  /**
   * Initializes the reactive form for adding/editing claimants.
   */
  initClaimantForm() {
    this.claimantForm = this.fb.group({
      name: ['', Validators.required],
      idNumber: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      communicationChannels: this.fb.group({
        phone: [''],
        email: [''],
        sms: ['']
      }),
      liabilityAdmission: [false],
      liabilityAdmissionDate: [null],
      conditional: ['']
    });
  }

  /**
   * Adds a new claimant to the list.
   */
  addClaimant() {
    this.selectedClaimant = null;
    this.claimantForm.reset();
    this.showClaimantModal();
  }

  /**
   * Edits the details of a selected claimant.
   *
   * @param claimant The claimant to edit.
   */
  editClaimant(claimant: Claimant) {
    this.selectedClaimant = claimant;
    this.claimantForm.patchValue(claimant);
    this.showClaimantModal();
  }

  /**
   * Saves the claimant details (either add or update).
   */
  saveClaimant() {
    if (this.claimantForm.invalid) {
      return;
    }

    // Check if adding a new claimant or editing existing one
    if (this.selectedClaimant) {
      // Update existing claimant
      const index = this.claimants.findIndex(c => c.id === this.selectedClaimant.id);
      if (index !== -1) {
        this.claimants[index] = { ...this.claimants[index], ...this.claimantForm.value };
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Claimant details updated successfully' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Claimant not found' });
      }
    } else {
      // Add new claimant
      const newClaimant = { ...this.claimantForm.value, id: this.claimants.length + 1 }; // Assign a new ID for demo
      this.claimants.push(newClaimant);
      console.log(this.claimants)
      this.messageService.add({ severity: 'success', summary: 'Added', detail: 'Claimant added successfully' });
    }

    this.closeClaimantModal();
    this.claimantForm.reset(); // Reset the form after saving
  }

  /**
   * Deletes the selected claimant.
   *
   * @param claimant The claimant to delete.
   */
  deleteClaimant(claimant: Claimant) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${claimant.name}?`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const index = this.claimants.findIndex(c => c.id === claimant.id);
        if (index !== -1) {
          this.claimants.splice(index, 1);
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Claimant deleted successfully' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Claimant not found' });
        }
      },
      reject: () => {
        // Do nothing if canceled
      }
    });
  }

  /**
   * Shows the claimant details modal.
   */
  showClaimantModal() {
    const claimantModal = document.getElementById('claimantModal');
    if (claimantModal) {
      const modal = new bootstrap.Modal(claimantModal);
      modal.show();
    }
  }

  /**
   * Closes the claimant details modal.
   */
  closeClaimantModal() {
    const claimantModal = document.getElementById('claimantModal');
    if (claimantModal) {
      const modal = bootstrap.Modal.getInstance(claimantModal);
      modal.hide();
    }
  }

  /**
   * Saves the claimant's communication details.
   */
  saveCommunicationDetails(claimant: Claimant) {
    // Update communication channels for the selected claimant
    this.claimants.forEach(c => {
      if (c.id === claimant.id) {
        c.communicationChannels = { ...this.claimantForm.get('communicationChannels')?.value };
      }
    });
    this.closeCommunicationModal();
    this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Communication details updated successfully' });
  }

  /**
   * Shows the communication details modal.
   */
  showCommunicationModal(claimant: Claimant) {
    this.selectedClaimant = claimant;
    this.claimantForm.patchValue(claimant);
    const communicationModal = document.getElementById('communicationModal');
    if (communicationModal) {
      const modal = new bootstrap.Modal(communicationModal);
      modal.show();
    }
  }

  /**
   * Closes the communication details modal.
   */
  closeCommunicationModal() {
    const communicationModal = document.getElementById('communicationModal');
    if (communicationModal) {
      const modal = bootstrap.Modal.getInstance(communicationModal);
      modal.hide();
    }
  }




}
