import { PrimeNGConfig } from 'primeng/api';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { Validators } from '@angular/forms';
import { BatchesDTO } from '../../../data/banking-process-dto';
import { BranchDTO } from '../../../data/receipting-dto';
import { BanksDto } from '../../../data/payments-dto';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { CommonMethodsService } from '../../../services/common-methods.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { PaymentsService } from '../../../services/payments.service';
@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent {
  depositForm:FormGroup;
   /** Stores the batch object currently being acted upon (e.g., for re-assignment or deposit). */
    selectedBatchObj: BatchesDTO;
    /** Stores the single file selected by the user for upload. */
      uploadedFile: File | null = null;
      /** A flag to disable the file input after one file is selected to enforce a single-file upload limit. */
      maximumFiles: boolean = false;
      /** A flag to indicate when a file is being dragged over the dropzone for styling purposes. */
      isDragging: boolean = false;
      /** The maximum allowed file size for uploads, in bytes. */
      private readonly max_file_size = 5 * 1024 * 1024; // 5MB
      /** An array of bank accounts used to populate the deposit modal dropdown. */
      bankAccounts: BanksDto[] = [];
       /** Information about the currently logged-in user. */
        loggedInUser: any;
        /** The currently selected branch, retrieved from session storage. */
        selectedBranch: BranchDTO;
        /** The default branch for the logged-in user, retrieved from session storage. */
        defaultBranch: BranchDTO;
        /** The default organization for the logged-in user, retrieved from session storage. */
        defaultOrg: OrganizationDTO;
        /** The currently selected organization, retrieved from session storage. */
        selectedOrg: OrganizationDTO;
        selectedReceipt: any; 
        @Output() onFilePost = new EventEmitter<{
    file: File;
    slipNumber: string;
    amount: number;
  }>()
  @Output() onDeposit = new EventEmitter<{ slipNumber: string; selectedRctBatch: any
    amount: number;loggedInUser:number;branchCode:number;bankAccountCode:number;currencyCode:number;remarks:string}>()
  constructor(
    private fb:FormBuilder,
    private sessionStorage:SessionStorageService,
    private authService:AuthService,
    private globalMessagingService:GlobalMessagingService,
    private commonMethodsService:CommonMethodsService,
    private paymentsService:PaymentsService
  ){
 
  }
  ngOnInit(){
    this.initializeDepositForm();
    let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');
    let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
    this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
    this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;
    if (this.selectedOrg) {
      this.defaultOrg = null;
    } else if (this.defaultOrg) {
      this.selectedOrg = null;
    }
    // Retrieve branch from localStorage or receiptDataService
    let storedSelectedBranch = this.sessionStorage.getItem('selectedBranch');
    let storedDefaultBranch = this.sessionStorage.getItem('defaultBranch');
    this.selectedBranch = storedSelectedBranch
      ? JSON.parse(storedSelectedBranch)
      : null;
    this.defaultBranch = storedDefaultBranch
      ? JSON.parse(storedDefaultBranch)
      : null;
    // Ensure only one branch is active at a time
    if (this.selectedBranch) {
      this.defaultBranch = null;
    } else if (this.defaultBranch) {
      this.selectedBranch = null;
    }
    this.loggedInUser = this.authService.getCurrentUser();
    this.fetchBankAccounts();
  }
  /**
   * @description Initializes the `depositForm` with required controls.
   */
  initializeDepositForm(): void {
    this.depositForm = this.fb.group({
      bankAccount: ['', Validators.required],
      slipNumber: ['', Validators.required],
      amount: ['', Validators.required],
      remarks: ['',Validators.required],
    });
  }
/**
   * @description Opens the deposit modal for a specific batch and pre-fills the amount.
   * @param batch The batch object to be deposited.
   */
  openDepositModal(item: any): void {
    const modalEl = new bootstrap.Modal(
      document.getElementById('depositModal')
    );
    if (modalEl) {
      modalEl.show();
    }
    this.selectedBatchObj = item;
    this.uploadedFile = null;
    const amountToSet = item.receiptAmount || item.total_amount;
    this.depositForm.patchValue({ amount: amountToSet });
  }
  /**
   * @description Closes the deposit modal.
   */
  closeDepositModal() {
    const modal = document.getElementById('depositModal');
    if (modal) {
      const modalEl = bootstrap.Modal.getInstance(modal);
      if (modalEl) {
        modalEl.hide();

      }
    }
    this.depositForm.reset();
  }
  /**
   * Central method to process and validate a selected file.
   * @param file The File object to process.
   */
  private processFile(file: File): void {
    if (file.size > this.max_file_size) {
      this.globalMessagingService.displayErrorMessage(
        'File Too Large',
        `The selected file exceeds the 5MB size limit.`
      );
      return;
    }
    // Validate File Type
    const allowedTypes = [
         'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    if (!allowedTypes.includes(file.type)) {
    this.globalMessagingService.displayErrorMessage(
      'Invalid File Type',
      'This file format is not allowed. Please upload PDF or DOCX files only.'
    );
    return; 
  }
    // If validation passes, update the component state
    this.uploadedFile = file;
    this.maximumFiles = true;
  }
  /**
   * Handles the dragover event.
   * Prevents the browser's default behavior to allow a drop.
   * @param event The DragEvent.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  /**
   * Handles the dragleave event.
   * Resets the dragging state.
   * @param event The DragEvent.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  /**
   * Handles the drop event.
   * Prevents default browser action and processes the dropped file.
   * @param event The DragEvent.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      // Only proceed if a file is not already selected
      if (!this.maximumFiles) {
        this.processFile(event.dataTransfer.files[0]);
      }
      // Clear the dataTransfer
      event.dataTransfer.clearData();
    }
  }
  /**
   * Triggered when files are selected via the hidden input.
   * @param event The file input change event.
   */
  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.processFile(event.target.files[0]);
    }
  }
  /**
   * Removes the currently selected file.
   */

  removeFile(): void {
    this.uploadedFile = null;
    this.maximumFiles = false; // Re-enable the input
  }
  /**
   * Validates the form and emits the file and form data to the parent component.
   */
  postFile(): void {
      this.depositForm.markAllAsTouched();
    if (!this.uploadedFile) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No file selected.'
      );
      return;
    }
    if(this.depositForm.invalid){
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please fil all the required fields before uploading file!'
      );
      return;
    }
    const formValue = this.depositForm.value;
    this.onFilePost.emit({
      file: this.uploadedFile,
      slipNumber: formValue.slipNumber,
      amount: formValue.amount,
    });
  }
   /**
   * @description  This method is called by a parent component to clear the file state.
   * It' called after the parent confirms a successful API call.
   */
  public clearUploadedFile(): void {
    this.removeFile();
  }
  /**
   * @description a function to retrieve list of banks accounts for banking
   */
  fetchBankAccounts(): void {
    this.paymentsService
      .getPaymentsBankActs(
        this.loggedInUser.code,
        this.selectedOrg?.id || this.defaultOrg?.id,
        this.defaultBranch?.id || this.selectedBranch?.id
      )
      .subscribe({
        next: (response) => {
          this.bankAccounts = response.data;
        },
        error: (err) => {
          this.commonMethodsService.handleApiError(err);
        },
      });
  }
  deposit(){
     this.depositForm.markAllAsTouched();
      if(this.depositForm.invalid){
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please fill all the required fields marked with asterisk!'
      );
      return;
    }
    const formValue = this.depositForm.value;
    const selectedAccount = formValue.bankAccount;
    this.onDeposit.emit({slipNumber: formValue.slipNumber,
      amount: formValue.amount,remarks:formValue.remarks,
      loggedInUser:this.loggedInUser.code,branchCode:this.defaultBranch.id || 
      this.selectedBranch.id,currencyCode:selectedAccount.currencyCode,bankAccountCode:selectedAccount.code,
    selectedRctBatch: this.selectedBatchObj})
  }
}
