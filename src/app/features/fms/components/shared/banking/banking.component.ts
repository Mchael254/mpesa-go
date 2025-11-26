import { group } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { BatchesDTO } from '../../../data/banking-process-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { BanksDto } from '../../../data/payments-dto';
import { CommonMethodsService } from '../../../services/common-methods.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptUploadRequest } from 'src/app/shared/data/common/dmsDocument';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { TranslateService } from '@ngx-translate/core';
import { PaymentsService } from '../../../services/payments.service';
import { BranchDTO } from '../../../data/receipting-dto';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-banking',
  templateUrl: './banking.component.html',
  styleUrls: ['./banking.component.css'],
})
export class BankingComponent {
  /** A flag to determine if the assignment dialog is in 're-assign' mode. */
  reAssign: boolean = false;
  assign: boolean = false;
  /** Stores the batch object currently being acted upon (e.g., for re-assignment or deposit). */
  selectedBatchObj: BatchesDTO;
  /** Controls visibility of the main assignment dialog. */
  assignDialogVisible: boolean = false;
  usersForm: FormGroup;
  depositForm: FormGroup;
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
  /** Holds the user object selected from the second dialog to display in the first dialog's input. */
  selectedUserForAssignment: StaffDto | null = null;
  /** Temporarily holds the user selected in the user table before confirmation. */
  tempSelectedUser: StaffDto | null = null;
  /** Controls visibility of the user selection dialog. */
  userSelectDialogVisible: boolean = false;
  /** A list of users available for task assignment, populating the user selection modal. */
  users: StaffDto[] = [];
  /** A filtered list of users for the user selection modal. */
  filteredUsers: StaffDto[] = [];
  /** The page size for fetching staff members. */
  staffPageSize = 5;
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
  @Output() onReassignSubmit = new EventEmitter<any>();
  @Output() onFilePost = new EventEmitter<{
    file: File;
    slipNumber: string;
    amount: number;
  }>();
  @Output() onAssignSubmit = new EventEmitter<any>();
  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private commonMethodsService: CommonMethodsService,
    private globalMessagingService: GlobalMessagingService,
    private dmsService: DmsService,
    private translate: TranslateService,
    private paymentsService: PaymentsService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.initiateUsersForm();
    this.initializeDepositForm();
    this.fetchActiveUsers(0, this.staffPageSize);
    let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
    let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');
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
  initiateUsersForm() {
    this.usersForm = this.fb.group({
      user: ['', Validators.required],
      comment: [''],
    });
  }
  /**
   * @description Initializes the `depositForm` with required controls.
   */
  initializeDepositForm(): void {
    this.depositForm = this.fb.group({
      bankAccount: ['', Validators.required],
      slipNumber: ['', Validators.required],
      amount: ['', Validators.required],
      remarks: [''],
    });
  }
  /**
   * @description A getter that provides a translated string for the PrimeNG table's paginator report.
   * @returns The translated report template string.
   */
  get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
  /**
   * @description Filters the `filteredUsers` array based on user input.
   * @param event The input event from the filter field.
   * @param field The user property to filter on ('username' or 'name').
   */
  filterUsers(event: any, field: string) {
    const inputValue = (event.target as HTMLInputElement).value;
    switch (field) {
      case 'username':
        this.filteredUsers = this.users.filter((user) => {
          return user.username.toLowerCase().includes(inputValue.toLowerCase());
        });
        break;
      case 'name':
        this.filteredUsers = this.users.filter((user) => {
          return user.name.toLowerCase().includes(inputValue.toLowerCase());
        });
        break;
    }
  }
  /**
   * @description Opens the main assignment dialog.
   * Checks if receipts have been selected first.
   */
  openAssignModal(): void {
    this.assignDialogVisible = true;
    this.reAssign = false;
    this.assign = true;
  }
  /**
   * @description Opens the main assignment dialog.
   * it sets reAssign flag to true so as to call reAssignUser() once the Assign button is clicked
   * rather than calling  onAssignSubmit() to does assigning
   */
  openReAssignModal(batch: any) {
    this.selectedBatchObj = batch;
    this.assignDialogVisible = true;
    this.reAssign = true;
    this.assign = false;
  }
  /**
   * @description Opens the second dialog for selecting a user from a table.
   */
  openUserSelectDialog(): void {
    this.tempSelectedUser = null; // Clear previous temporary selection
    this.userSelectDialogVisible = true;
  }
  /**
   * @description Closes the user selection dialog without saving the choice.
   */
  closeUserSelectDialog(): void {
    this.userSelectDialogVisible = false;
  }
  /**
   * @description Closes the main assignment dialog and resets the form and selections.
   */
  closeAssignModal(): void {
    this.assignDialogVisible = false;
    this.usersForm.reset();
    this.selectedUserForAssignment = null;
  }
  /**
   * @description Called when the "save" button in the second dialog is clicked.
   * It transfers the selected user to the main form and closes the selection dialog.
   */
  confirmUserSelection(): void {
    if (this.tempSelectedUser) {
      this.selectedUserForAssignment = this.tempSelectedUser;
      // Patch the form with the selected user's ID
      this.usersForm.patchValue({
        user: this.selectedUserForAssignment.id,
      });
      this.closeUserSelectDialog();
    }
  }
  /**
   * Validates the form and emits the raw data needed for re-assignment to the parent component.
   */
  reAssignBatch(): void {
    this.usersForm.markAllAsTouched();
    if (this.usersForm.invalid) {
      return;
    }
    const formData = this.usersForm.value;
    //a generic event object containing all the necessary pieces of information.
    // The parent component will use this to build its specific request body.
    this.onReassignSubmit.emit({
      toUserId: formData.user,
      comment: formData.comment,
      item: this.selectedBatchObj,
    });
    this.closeAssignModal();
  }
  assignReceipts(): void {
    this.usersForm.markAllAsTouched();
    if (this.usersForm.invalid) {
      return;
    }
    const formData = this.usersForm.value;
    this.onAssignSubmit.emit({
      userId: formData.user,
    });
    this.closeAssignModal();
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
    if (!this.uploadedFile) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No file selected.'
      );
      return;
    }
    const formValue = this.depositForm.value;
    if (!formValue.slipNumber) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please enter the slip Number first!'
      );
      return;
    }
    this.onFilePost.emit({
      file: this.uploadedFile,
      slipNumber: formValue.slipNumber,
      amount: formValue.amount,
    });

    this.removeFile();
  }
  /**
   * @description Fetches a list of users that the current user can assign tasks to.
   *
   */
  fetchActiveUsers(
    pageIndex: number,
    pageSize: number,
    sortList: any = 'dateCreated',
    order: string = 'desc'
  ): void {
    this.staffService
      .getStaff(
        pageIndex,
        pageSize,

        'U',
        sortList,
        order,
        null,
        'A'
      )
      .subscribe({
        next: (response) => {
          this.users = response.content;
          this.filteredUsers = this.users;
        },
        error: (err) => {
          this.commonMethodsService.handleApiError(err);
        },
      });
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
}
