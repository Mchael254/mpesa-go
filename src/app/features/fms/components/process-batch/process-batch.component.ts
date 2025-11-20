import { CommonMethodsService } from './../../services/common-methods.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import fmsStepsData from '../../data/fms-step.json';
import { BankingProcessService } from '../../services/banking-process.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { BatchesDTO } from '../../data/banking-process-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { ReceiptUploadRequest } from 'src/app/shared/data/common/dmsDocument';
import * as bootstrap from 'bootstrap';
import { BanksDto } from '../../data/payments-dto';
import { PaymentsService } from '../../services/payments.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { BranchDTO } from '../../data/receipting-dto';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.css'],
})
export class ProcessBatchComponent {
  steps = fmsStepsData.bankingSteps;
  //selectedBatch!:batch;
  batches: BatchesDTO[] = [];
  filteredBatches: BatchesDTO[] = [];
  visible: boolean = false;
  columns: any[];
  allColumns:any[]=[];
  depositForm!: FormGroup;
  bankAccounts: BanksDto[] = [];
  /** Holds the user object selected from the second dialog to display in the first dialog's input. */
    selectedUserForAssignment: StaffDto | null = null;
  
    /** Temporarily holds the user selected in the user table before confirmation. */
    tempSelectedUser: StaffDto | null = null;
    /** Manages the form controls for assigning receipts to a user (user selection, comment). */
     /** Controls visibility of the main assignment dialog. */
  assignDialogVisible: boolean = false;
  /** Controls visibility of the user selection dialog. */
  userSelectDialogVisible: boolean = false;
  /** An array of receipts that the user has selected in the table via checkboxes. */
    selectedReceipts: BatchesDTO[] = [];
     /** A list of users available for task assignment, populating the user selection modal. */
  users: StaffDto[] = [];
  filteredUsers: StaffDto[] = [];
   /**controls the visibility of assign buttons */
  reAssign: boolean = false;
  selectedBatchObj:BatchesDTO;
    usersForm!: FormGroup;
    staffPageSize = 5;
     /** Stores the list of files selected by the user. */
  uploadedFile: File | null = null;
  /** A flag to disable the file input after one file is selected. */
  maximumFiles: boolean = false;
  /** A flag to indicate when a file is being dragged over the dropzone for styling. */
  isDragging: boolean = false;
  //  max file size in bytes (5MB = 5 * 1024 * 1024 bytes)
  private readonly max_file_size = 5 * 1024 * 1024;
    /** Information about the currently logged-in user. */
  loggedInUser: any;
  selectedBranch: BranchDTO;
     /**
        * @property {BranchDTO} defaultBranch - The default branch.
        */
       defaultBranch: BranchDTO;
       /** The default organization for the logged-in user, retrieved from session storage. */
         defaultOrg: OrganizationDTO;
         /** The currently selected organization, retrieved from session storage. */
         selectedOrg: OrganizationDTO;
  constructor(
    public translate: TranslateService,
    private router: Router,
    private bankingService: BankingProcessService,
    private commonMethodsService: CommonMethodsService,
    private fb:FormBuilder,
    private globalMessagingService:GlobalMessagingService,
    private staffService:StaffService,
    private dmsService:DmsService,
    private paymentsService:PaymentsService,
    private authService:AuthService,
    private sessionStorage:SessionStorageService
  ) {}

  ngOnInit() {
    this.initializeUsersForm();
    this.initializeDepositForm();
    this.fetchBatches();
    this.allColumns = this.getColumns();
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
  /**
     * @description Initializes the `usersForm` with required controls.
     */
    initializeUsersForm(): void {
      this.usersForm = this.fb.group({
        user: ['', Validators.required],
        comment: [''],
      });
    }
    initializeDepositForm(): void {
    this.depositForm = this.fb.group({
      bankAccount: ['', Validators.required],
      slipNumber: ['', Validators.required],
      amount: ['', Validators.required],
      remarks: [''],
    });
  }
  showColumns(): void {
    this.visible = true;
  }
  getColumns(): any {
    return (this.columns = [
      {
        field: 'batch_number',
        header: this.translate.instant('fms.receipting.batchNumber'),
      },
      {
        field: 'batch_date',
        header: this.translate.instant('fms.banking.date'),
      },
      {
        field: 'assignee',
        header: this.translate.instant('serviceDesk.assignee'),
      },
      {
        field: 'total_amount',
        header: this.translate.instant('fms.receipting.amount'),
      },
      {
        field: 'actions',
        header: this.translate.instant('fms.receipting.actions'),
      },
    ]);
  }
  get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
  fetchBatches(): void {
    this.bankingService.getBatches().subscribe({
      next: (response) => {
        this.batches = response;
        this.filteredBatches = this.batches;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * @description Filters the `filteredReceipts` array based on user input in the table's filter row.
   * Handles filtering for string, number, and date fields.
   * @param event The input event from the filter field.
   * @param fieldName The key of the object property to filter on (e.g., 'receiptAmount').
   */
  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value;
    this.filteredBatches = this.batches.filter((obj) => {
      let fieldValue = obj[fieldName];
      if (fieldValue instanceof Date) {
        const formattedDateField = fieldValue.toISOString().split('T')[0];

        return formattedDateField.includes(inputValue);
      }  else if (typeof fieldValue === 'string') {
        fieldValue = fieldValue.toString();
        return fieldValue.toLowerCase().includes(inputValue.toLowerCase());
      }
      return false;
    });
  }
  clearFilters():void{
this.filteredBatches = this.batches;
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
     *
     * @description it calls the reAssign() to post the request body,if successfull we recall fetchReceipts()
     * to show the newly re-assigned receipts
     */
    reAssignUser(): void {
      this.usersForm.markAllAsTouched();
      if (this.usersForm.invalid) {
        return;
      }
      const formData = this.usersForm.value;
      const requestBody = {
        fromUserId: this.selectedBatchObj.user_id,
        toUserId: formData.user,
        receiptNumbers: [this.selectedBatchObj.batch_number],
      };
      this.bankingService.reAssignUser(requestBody).subscribe({
        next: (response) => {
          this.globalMessagingService.displaySuccessMessage('', response.msg);
          this.fetchBatches();
        },
        error: (err) => {
         this.commonMethodsService.handleApiError(err);
        },
      });
      this.closeAssignModal();
    }
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
 * @description a function to retrieve list of banks accounts for banking
 */
  fetchBankAccounts():void{
    this.paymentsService.getPaymentsBankActs(this.loggedInUser.code,this.selectedOrg?.id || this.defaultOrg?.id,this.defaultBranch?.id || this.selectedBranch?.id).subscribe({
      next:(response)=>{
        this.bankAccounts = response.data;
      },
      error:(err)=>{
         this.commonMethodsService.handleApiError(err);
      }
    })
  }
   openDepositModal(batch: any): void {
      const modalEl = new bootstrap.Modal(
        document.getElementById('depositModal')
      );
      if (modalEl) {
        modalEl.show();
      }
      this.selectedBatchObj = batch;
      this.uploadedFile = null; // Clear previous files when opening
      this.depositForm.patchValue({ amount: this.selectedBatchObj.total_amount});
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
   * Removes the currently selected file.
   */
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
  removeFile(): void {
    this.uploadedFile = null;
    this.maximumFiles = false; // Re-enable the input
  }
  /**
     * Reads the selected file as a Base64 string and then calls the service to post it.
     */
    postFile(): void {
      if (!this.uploadedFile) {
        return;
      }
      const formValue = this.depositForm.value;
      if (!formValue.slipNumber) {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'please enter the slip Number first!'
        );
        return;
      }
      const fileReader = new FileReader();
      // this event happens AFTER the file is read
      fileReader.onloadend = () => {
        // The result includes the "data:[mime/type];base64," prefix
        const base64String = fileReader.result as string;
        //  pure Base64 data by removing the prefix
        const pureBase64 = base64String.split(',')[1];
        //preparing the payload
        const payload: ReceiptUploadRequest[] = [
          {
            docData: pureBase64,
            docType: this.uploadedFile.type,
            originalFileName: this.uploadedFile.name,
            module: 'CB-RECEIPTS',
            filename: this.uploadedFile.name,
            referenceNo: formValue.slipNumber,
            docDescription: '',
            amount: formValue.amount,
            paymentMethod: null,
            policyNumber: null,
          },
        ];
        //The service call is called inside the onloadend callback
        this.dmsService.uploadFiles(payload).subscribe({
          next: (response) => {
            this.globalMessagingService.displaySuccessMessage(
              '',
              response[0].uploadStatus
            );
            this.uploadedFile = null;
            this.maximumFiles = false;
          },
          error: (err) => {
           this.commonMethodsService.handleApiError(err);
          },
        });
      };
      // Start the asynchronous file reading process
      fileReader.readAsDataURL(this.uploadedFile);
    }
  closeDepositModal() {
      const modal = document.getElementById('depositModal');
      if (modal) {
        const modalEl = bootstrap.Modal.getInstance(modal);
        if (modalEl) {
          modalEl.hide();
        }
      }
    }

  navigateToDashboard(): void {
    this.router.navigate(['/home/fms/banking-dashboard']);
  }
}
