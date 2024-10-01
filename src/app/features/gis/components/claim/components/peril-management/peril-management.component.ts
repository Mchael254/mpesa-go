import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

// Dummy data interfaces 
interface Product {
  id: number;
  name: string;
}

interface Policy {
  id: number;
  name: string;
  product: Product; 
}

interface Risk {
  id: number;
  name: string;
  policy: Policy; 
}

interface Causation {
  id: number;
  name: string;
}

interface CatastropheEvent {
  id: number;
  name: string;
}

interface Claimant {
  id: number;
  name: string;
  isInsured: boolean;
  address: string;
  phone: string;
  email: string;
  idNumber: string;
  sms: string; // Added for communication
}

interface Peril {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
}
@Component({
  selector: 'app-peril-management',
  templateUrl: './peril-management.component.html',
  styleUrls: ['./peril-management.component.css']
})
export class PerilManagementComponent {
  claimantForm: FormGroup;
  claimants: Claimant[] = [];
  selectedClaimant: Claimant | null = null;
  showAddClaimantDialog: boolean = false;
  showEditClaimantDialog: boolean = false;
  showConfirmDeleteDialog: boolean = false;
  showCommunicationDialog: boolean = false;

  cols: any[] = [
    { field: 'name', header: this.translateService.instant('gis.claims.name') },
    { field: 'idNumber', header: this.translateService.instant('gis.claims.id_number') },
    { field: 'address', header: this.translateService.instant('gis.claims.address') },
    { field: 'phone', header: this.translateService.instant('gis.claims.phone') },
    { field: 'email', header: this.translateService.instant('gis.claims.email') },
    { field: 'isInsured', header: this.translateService.instant('gis.claims.insured_as_claimant') },
    { field: 'actions', header: 'Actions', style: { width: '100px' }, type: 'actions' },
  ];

  constructor(private fb: FormBuilder, private translateService: TranslateService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.claimantForm = this.fb.group({
      name: ['', Validators.required],
      idNumber: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      isInsured: [false],
      sms: [''], 
    });

    this.populateDummyData();
  }

  populateDummyData(): void {
    // ... (same dummy data as before)
  }

  // Event Handlers
  toggleAddClaimantDialog() {
    this.showAddClaimantDialog = !this.showAddClaimantDialog;
  }

  toggleEditClaimantDialog() {
    this.showEditClaimantDialog = !this.showEditClaimantDialog;
  }

  toggleConfirmDeleteDialog() {
    this.showConfirmDeleteDialog = !this.showConfirmDeleteDialog;
  }

  toggleCommunicationDialog() {
    this.showCommunicationDialog = !this.showCommunicationDialog;
  }

  // Form Handling
  saveClaimant() {
    if (this.claimantForm.valid) {
      const newClaimant: Claimant = {
        id: Math.max(...this.claimants.map(c => c.id)) + 1,
        ...this.claimantForm.value,
        isInsured: this.claimantForm.get('isInsured')?.value,
      };
      this.claimants.push(newClaimant);
      this.claimantForm.reset();
      this.toggleAddClaimantDialog();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claimant added successfully!', life: 3000 });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }
  }

  updateClaimant() {
    if (this.claimantForm.valid && this.selectedClaimant) {
      const updatedClaimant: Claimant = {
        ...this.selectedClaimant,
        ...this.claimantForm.value,
        isInsured: this.claimantForm.get('isInsured')?.value,
      };
      const index = this.claimants.findIndex(c => c.id === updatedClaimant.id);
      if (index !== -1) {
        this.claimants[index] = updatedClaimant;
      }
      this.claimantForm.reset();
      this.toggleEditClaimantDialog();
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Claimant updated successfully!', life: 3000 });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields', life: 3000 });
    }
  }

  deleteClaimant() {
    if (this.selectedClaimant) {
      this.claimants = this.claimants.filter(c => c.id !== this.selectedClaimant.id);
      this.selectedClaimant = null;
    }
    this.toggleConfirmDeleteDialog();
  }

  cancelDelete() {
    this.toggleConfirmDeleteDialog();
  }

  selectClaimant(claimant: Claimant) {
    this.selectedClaimant = claimant;
    this.claimantForm.patchValue({
      name: claimant.name,
      idNumber: claimant.idNumber,
      address: claimant.address,
      phone: claimant.phone,
      email: claimant.email,
      isInsured: claimant.isInsured,
      sms: claimant.sms,
    });
  }

  // Handle Communication
  saveCommunicationDetails() {
    // Logic to save the communication details (would typically call an API)
    // For now, just log the data
    if (this.selectedClaimant) {
      this.selectedClaimant.phone = this.claimantForm.get('phone')?.value;
      this.selectedClaimant.email = this.claimantForm.get('email')?.value;
      this.selectedClaimant.sms = this.claimantForm.get('sms')?.value;
      console.log("Updated Claimant Communication: ", this.selectedClaimant);
    }
    this.toggleCommunicationDialog();
  }

  // Table Actions (For PrimeNG Table)
  onRowEditSave(claimant: Claimant) {
    this.updateClaimant();
  }

  onRowEditCancel(claimant: Claimant, index: number) {
    this.claimants[index] = claimant;
  }

  onRowDelete(claimant: Claimant) {
    this.toggleConfirmDeleteDialog();
  }

  onRowSelect(claimant: Claimant) {
    this.selectedClaimant = claimant;
    this.claimantForm.patchValue({
      name: claimant.name,
      idNumber: claimant.idNumber,
      address: claimant.address,
      phone: claimant.phone,
      email: claimant.email,
      isInsured: claimant.isInsured,
      sms: claimant.sms,
    });
  }

}
