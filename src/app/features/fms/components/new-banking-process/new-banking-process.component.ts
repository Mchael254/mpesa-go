import { ReceiptManagementService } from './../../services/receipt-management.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import { Logger } from '../../../../shared/services';
import fmsStepsData from '../../data/fms-step.json';
import { BankingProcessService } from '../../services/banking-process.service';
import { PaymentModesDTO } from '../../data/auth-requisition-dto';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import {
  DeAssignDTO,
  ReceiptDTO,
  ReceiptsToBankRequest,
} from '../../data/banking-process-dto';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../../../shared/services/auth.service';
import { GLAccountDTO } from '../../data/receipt-management-dto';
import { ReceiptService } from '../../services/receipt.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { ReceiptUploadRequest } from 'src/app/shared/data/common/dmsDocument';
import { CommonMethodsService } from '../../services/common-methods.service';
import { PaymentsService } from '../../services/payments.service';
import { BranchDTO } from '../../data/receipting-dto';
import { BanksDto } from '../../data/payments-dto';
import { DepositComponent } from '../shared/deposit/deposit.component';
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
  /** Manages the form controls for retrieving receipts (date range, payment method). */
  rctsRetrievalForm!: FormGroup;
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
  users: StaffDto[] = [];
  filteredUsers: StaffDto[] = [];
  /** Flag to control whether the receipts table is rendered in the DOM. */
  displayTable: boolean = false;
  /** Controls visibility of the user selection dialog. */
  userSelectDialogVisible: boolean = false;
  /**controls visibility of create batches btn,it should be hidden if payment mode selected is cheque */
  isCashSelected: boolean = false;
  /**it controls the visibility of deposit button which should only be visible if the payment mode is cheque */
  paymentMode: string;
  // --- Table Column Configuration ---
  /** Stores the configuration for all available columns in the receipts table. */
  columns: any[];
  /** Stores the configuration for the columns that are currently visible in the table. */
  allColumns: any[] = [];
  // --- Session and User Data ---
  /** The default organization for the logged-in user, retrieved from session storage. */
  defaultOrg: OrganizationDTO;
  /** The currently selected organization, retrieved from session storage. */
  selectedOrg: OrganizationDTO;
  /** Information about the currently logged-in user. */
  loggedInUser: any;
  selectedBranch: BranchDTO;
  /**
   * @property {BranchDTO} defaultBranch - The default branch.
   */
  defaultBranch: BranchDTO;
  @ViewChild('deposit') DepositComponent: DepositComponent;
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
    private authService: AuthService,
    private dmsService: DmsService,
    private commonMethodsService: CommonMethodsService,
  ) {}
  /**
   * @description Angular lifecycle hook that runs on component initialization.
   * Sets up forms, retrieves initial data like payment modes and users, and loads
   * user/organization info from session storage.
   */
  ngOnInit() {
    this.initiateRctsForm();
    this.initiateColumns();
    this.allColumns = this.initiateColumns();
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
        field: 'receiptNo',
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
        this.commonMethodsService.handleApiError(err);
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
    if (formData?.paymentMethod === 'CASH') {
      this.isCashSelected = true;
    } else {
      this.isCashSelected = false;
      // For any other payment mode, show all columns
      //this.selectedColumns = [...this.allColumns];
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
        this.paymentMode = this.rctsRetrievalForm.get('paymentMethod')?.value;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * @description this method prepares the request body for assignUser method and calls it
   * the assignUser method sends the request to assign a batch of receipts or a single receipt for
   * assignment and creation of batch
   * a successfull response results to updating the receipts to bank table by re-calling the fetchReceipts()
   * otherwise we display the error
   * @returns if the usersForm is invalid we stop the execution others continue
   */
  handleAssignment(event: any): void {
    const userId = event.userId;
    const requestBody = {
      userId: userId,
      receiptNumbers: this.selectedReceipts.map((rct) => {
        return rct.receiptNo;
      }),
    };
    this.bankingService.assignUser(requestBody).subscribe({
      next: (response) => {
        this.selectedReceipts = [];
        this.fetchReceipts();
        this.globalMessagingService.displaySuccessMessage('', response.msg);
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * @description this method takes one argument once the de-assign button is clicked per row and
   * prepares the request body containing an array of receipts or a single receipt and calls deAssignRct endpoint
   * @param receipt  it stores the receipt object that contains the required receipt Number for deassigning
   */
  deAssign(receipt: any): void {
    const body = {
      receiptNumbers: [receipt.receiptNo],
    };
    this.deAssignRct(body);
  }
  /**
   *
   * @param body the request body expects a an array of receipt number or single receipt number
   * it calls the deAssign method and if there is a response we refresh the receipts to bank to
   *ensure the assigned to field is upated to unassigned
   */
  deAssignRct(body: DeAssignDTO): void {
    this.bankingService.deAssign(body).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('', response.msg);
        this.fetchReceipts();
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * Handles the re-assignment event emitted from the child component for a RECEIPT.
   * It builds the specific payload required for the `reAssignUser` endpoint.
   */
  handleReassignment(event: any): void {
    const receiptToReassign = event.item;
    const newUserId = event.toUserId;
    const requestBody = {
      fromUserId: receiptToReassign.batchAssignmentUserId,
      toUserId: newUserId,
      receiptNumbers: [receiptToReassign.receiptNo],
    };
    this.bankingService.reAssignUser(requestBody).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('', response.msg);
        this.fetchReceipts(); // Refresh this parent's data
      },
      error: (err) => this.commonMethodsService.handleApiError(err),
    });
  }

  /**
   * Handles the file post event emitted from the child component.
   */
  handleFilePost(event: {
    file: File;
    slipNumber: string;
    amount: number;
  }): void {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const base64String = fileReader.result as string;
      const pureBase64 = base64String.split(',')[1];
      const payload: ReceiptUploadRequest[] = [
        {
          docData: pureBase64,
          docType: event.file.type,
          originalFileName: event.file.name,
          module: 'CB-RECEIPTS',
          filename: event.file.name,
          referenceNo: event.slipNumber,
          docDescription: '',
          amount: event.amount,
          paymentMethod: null,
          policyNumber: null,
        },
      ];
      this.dmsService.uploadFiles(payload).subscribe({
        next: (response) => {
          this.globalMessagingService.displaySuccessMessage(
            '',
            response[0].uploadStatus
          );
           if (this.DepositComponent) {
                      this.DepositComponent.clearUploadedFile();
                    }
        },
        error: (err) => this.commonMethodsService.handleApiError(err),
      });
    };
    fileReader.readAsDataURL(event.file);
  }

  /**
   * @description Navigates the user to the next step in the banking process (Create Batches).
   */
  navigateToBatch(): void {
    this.displayTable = true;
    this.router.navigate(['/home/fms/process-batch']);
  }
  navigateToDashboard(): void {
    this.router.navigate(['/home/fms/banking-dashboard']);
  }
}
