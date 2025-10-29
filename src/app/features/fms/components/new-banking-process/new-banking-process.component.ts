import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import {Logger} from '../../../../shared/services'
import fmsStepsData from '../../data/fms-step.json';
import { BankingProcessService } from '../../services/banking-process.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import {
  assignedUsersDTO,
  ReceiptDTO,
  ReceiptsToBankRequest,
  UsersDTO,
} from '../../data/receipting-dto';
import * as bootstrap from 'bootstrap';
import {AuthService} from '../../../../shared/services/auth.service';
const log = new Logger('NewBankingProcessComponent');
/**
 * @Component NewBankingProcessComponent
 * @description This component manages the first step of the banking process, which involves retrieving
 * receipts based on user-defined criteria, displaying them in a table, and allowing the user
 * to assign them to other users for further processing.
 */
@Component({
  selector: 'app-new-banking-process',
  templateUrl: './new-banking-process.component.html',
  styleUrls: ['./new-banking-process.component.css'],
})
export class NewBankingProcessComponent implements OnInit {
  // --- Form Groups ---
  /** Manages the form controls for retrieving receipts (date range, payment method). */
  rctsRetrievalForm!: FormGroup;
  /** Manages the form controls for assigning receipts to a user (user selection, comment). */
  usersForm!: FormGroup;
  // --- UI State and Data ---
  /** Static data for the stepper component, indicating the current stage of the process. */
  steps = fmsStepsData.bankingSteps;
  /** Stores the original, unfiltered list of receipts fetched from the API. */
  receiptData: ReceiptDTO[];
  /** Stores the filtered list of receipts to be displayed in the table. Initially a copy of `receiptData`. */
  filteredReceipts: ReceiptDTO[] = [];
  /** The total number of records fetched, used for display purposes. */
  totalRecord: number;
  /** An array of receipts that the user has selected in the table via checkboxes. */
  selectedReceipts: ReceiptDTO[] = [];
  /** Controls the visibility of the PrimeNG dialog for column selection. */
  visible: boolean = false;
  /** An array of `PaymentModesDTO` used to populate the payment method dropdown. */
  paymentModes: PaymentModesDTO[] = [];
  /** A list of users available for task assignment, populating the user selection modal. */
  users: assignedUsersDTO[] = [];
  filteredUsers: assignedUsersDTO[] = [];
  /** Flag to control whether the receipts table is rendered in the DOM. */
  displayTable: boolean = false;
  /** Controls visibility of the main assignment dialog. */
  assignDialogVisible: boolean = false;
  /** Controls visibility of the user selection dialog. */
  userSelectDialogVisible: boolean = false;

  /** Holds the user object selected from the second dialog to display in the first dialog's input. */
  selectedUserForAssignment: assignedUsersDTO | null = null;

  /** Temporarily holds the user selected in the user table before confirmation. */
  tempSelectedUser: assignedUsersDTO | null = null;

  // --- Table Column Configuration ---
  /** Stores the configuration for all available columns in the receipts table. */
  columns: any[];
  /** Stores the configuration for the columns that are currently visible in the table. */
  selectedColumns: any[] = [];
  // --- Session and User Data ---
  /** The default organization for the logged-in user, retrieved from session storage. */
  defaultOrg: OrganizationDTO;
  /** The currently selected organization, retrieved from session storage. */
  selectedOrg: OrganizationDTO;
  /** Information about the currently logged-in user. */
  loggedInUser: any;
  /**
   * @constructor
   * @param translate Service for handling internationalization (i18n).
   * @param fb Service for building reactive forms.
   * @param router Service for programmatic navigation.
   * @param globalMessagingService Service for displaying global notifications.
   * @param bankingService Service for handling banking-related API calls.
   * @param sessionStorage Service for interacting with browser session storage.
   * @param authService Service for retrieving authentication and user information.
   */
  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    private bankingService: BankingProcessService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService
  ) {}
  /**
   * @description Angular lifecycle hook that runs on component initialization.
   * Sets up forms, retrieves initial data like payment modes and users, and loads
   * user/organization info from session storage.
   */
  ngOnInit() {
    this.initiateRctsForm();
    this.initializeUsersForm();
    this.initiateColumns();
    this.selectedColumns = this.initiateColumns();
    this.fetchPaymentsModes();
    let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
    let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');
    this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
    this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;
    if (this.selectedOrg) {
      this.defaultOrg = null;
    } else if (this.defaultOrg) {
      this.selectedOrg = null;
    }
    this.loggedInUser = this.authService.getCurrentUser();
    this.fetchUsers(this.loggedInUser.code);
  }
  /**
   * @description Initializes the `rctsRetrievalForm` with required controls and validators.
   */
  initiateRctsForm(): void {
    this.rctsRetrievalForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
    });
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
  /**
   * @description A getter that provides a translated string for the PrimeNG table's paginator report.
   * @returns The translated report template string.
   */
  get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
  /**
   * @description Defines the structure for all possible columns in the receipts table.
   * @returns An array of column definition objects.
   */
  initiateColumns(): any {
    return (this.columns = [
      {
        field: 'branchReceiptCode',
        header: this.translate.instant('fms.banking.receiptId'),
      },
      {
        field: 'receivedFrom',
        header: this.translate.instant('fms.banking.customer'),
      },
      {
        field: 'receiptAmount',
        header: this.translate.instant('fms.receipting.amount'),
      },
      {
        field: 'bankAccountCode',
        header: this.translate.instant('fms.banking.collectionAcc'),
      },
      {
        field: 'batchAssignedUser',
        header: this.translate.instant('fms.banking.assignedTo'),
      },
      { field: 'date', header: this.translate.instant('fms.date') },
      {
        field: 'actions',
        header: this.translate.instant('fms.receipting.actions'),
      },
    ]);
  }
  /**
   * @description Sets the visibility flag to true to show the column selection dialog.
   */
  showColumnsDialogs(): void {
    this.visible = true;
  }
  /**
   * @description Filters the `filteredReceipts` array based on user input in the table's filter row.
   * Handles filtering for string, number, and date fields.
   * @param event The input event from the filter field.
   * @param fieldName The key of the object property to filter on (e.g., 'receiptAmount').
   */
  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value;
    this.filteredReceipts = this.receiptData.filter((obj) => {
      let fieldValue = obj[fieldName];
      if (fieldValue instanceof Date) {
        const formattedDateField = fieldValue.toISOString().split('T')[0];

        return formattedDateField.includes(inputValue);
      } else if (typeof fieldValue === 'number') {
        const inputNumber = String(inputValue);

        return fieldValue.toString().includes(inputNumber);
      } else if (typeof fieldValue === 'string') {
        fieldValue = fieldValue.toString();

        return fieldValue.toLowerCase().includes(inputValue.toLowerCase());
      }
      return false;
    });
  }
  /**
   * @description Resets the table data to its original, unfiltered state.
   */
  clearFilters(): void {
    this.filteredReceipts = this.receiptData;
  }
  /**
   * @description Fetches the list of available payment modes from the API and populates the dropdown.
   * It automatically selects the first payment mode as the default.
   */
  fetchPaymentsModes(): void {
    this.bankingService.getPaymentMethods().subscribe({
      next: (response) => {
        this.paymentModes = response.data;
        //automatically default to any available method
        if (this.paymentModes?.length > 0) {
          const selectedMethod = this.paymentModes[0].code;
          this.rctsRetrievalForm.patchValue({ paymentMethod: selectedMethod });
        }
      },
      error: (err) => {
        this.handleApiError(err);
      },
    });
  }
  /**
   * @description A click handler for the "Retrieve Receipts" button. Validates the form
   * before triggering the API call to fetch receipts.
   */
  onClickRetrieveRcts() {
    const formData = this.rctsRetrievalForm.value;
    this.rctsRetrievalForm.markAllAsTouched();
    if (!this.rctsRetrievalForm.valid) {
      this.globalMessagingService.displayErrorMessage(
        '',
        'Please fill the required fields'
      );
      return;
    }
    this.fetchReceipts();
  }
  /**
   * @description Constructs the request payload and calls the service to fetch receipts.
   * On success, it populates the table data and makes the table visible.
   */
  fetchReceipts(): void {
    const params: ReceiptsToBankRequest = {
      dateFrom: this.rctsRetrievalForm.get('startDate')?.value,
      dateTo: this.rctsRetrievalForm.get('endDate')?.value,
      orgCode: this.defaultOrg?.id || this.selectedOrg?.id,
      payMode: this.rctsRetrievalForm.get('paymentMethod')?.value,
      includeBatched: 'Y',
    };
    this.bankingService.getReceipts(params).subscribe({
      next: (response) => {
        this.receiptData = response;
        this.filteredReceipts = this.receiptData;
        this.displayTable = true;
        this.totalRecord = this.filteredReceipts.length;
      },
      error: (err) => {
        this.handleApiError(err);
      },
    });
  }

  /**
   * @description Opens the main assignment dialog.
   * Checks if receipts have been selected first.
   */
  openAssignModal(): void {
    if (!this.selectedReceipts || this.selectedReceipts.length === 0) {
      this.globalMessagingService.displayErrorMessage(
        '',
        'Please select at least one receipt to assign.'
      );
      return;
    }
    this.assignDialogVisible = true;
  }

  /**
   * @description Closes the main assignment dialog and resets the form and selections.
   */
  closeAssignModal(): void {
    this.assignDialogVisible = false;
    this.usersForm.reset();
    this.selectedUserForAssignment = null;
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
   * @description Called when the "Select User" button in the second dialog is clicked.
   * It transfers the selected user to the main form and closes the selection dialog.
   */
  confirmUserSelection(): void {
    if (this.tempSelectedUser) {
      this.selectedUserForAssignment = this.tempSelectedUser;
      // Patch the form with the selected user's ID
      this.usersForm.patchValue({
        user: this.selectedUserForAssignment.user_id,
      });
      this.closeUserSelectDialog();
    }
  }
  /**
   * @description Final submission handler for the main assignment dialog.
   * This is where I call the endpoint to assign the users.
   */
  onAssignSubmit(): void {
    this.usersForm.markAllAsTouched();
    if (this.usersForm.invalid) {
      return;
    }
    const formData = this.usersForm.value;
    // console.log('Submitting assignment with the following data:');
    // console.log('Selected User ID:', formData.user);
    // console.log('Comment:', formData.comment);
    // console.log('Selected Receipts:', this.selectedReceipts.map(r => r.receiptNo));
    this.closeAssignModal();
  }
  /**
   * @description Fetches a list of users that the current user can assign tasks to.
   * @param currentUserCode The unique code of the currently logged-in user.
   */
  fetchUsers(currentUserCode: number): void {
    this.bankingService.getUsers(currentUserCode).subscribe({
      next: (response) => {
        this.users = response;
        this.filteredUsers = this.users;
      },
      error: (err) => {
        this.handleApiError(err);
      },
    });
  }
  /**
   * @description Navigates the user to the next step in the banking process (Create Batches).
   */
  navigateToBatch(): void {
    this.displayTable = true;
    this.router.navigate(['/home/fms/process-batch']);
  }
  /**
   * @description A centralized helper method to handle and display API errors.
   * @param err The error object returned from an HttpClient call.
   */
  private handleApiError(err: any): void {
    const customMessage = this.translate.instant('fms.errorMessage');
    const backendError =
      err.error?.msg || err.error?.error || err.error?.status || err.statusText;
    this.globalMessagingService.displayErrorMessage(
      customMessage,
      backendError
    );
  }
}
