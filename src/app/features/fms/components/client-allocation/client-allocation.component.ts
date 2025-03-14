import { ChangeDetectorRef, Component } from '@angular/core';
import { ReceiptDataService } from '../../services/receipt-data.service';
import {
  acknowledgementSlipDTO,
  AllocationDTO,
  BanksDTO,
  BranchDTO,
  GetAllocationDTO,
  ReceiptingPointsDTO,
  ReceiptNumberDTO,
  ReceiptParticularsDTO,
  
  ReceiptSaveDTO,
  ReceiptUploadRequest,
  TransactionDTO,
} from '../../data/receipting-dto';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';

import { AuthService } from '../../../../shared/services/auth.service';
import { filter } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { DmsService } from '../../../../shared/services/dms/dms.service';
import { FmsSetupService } from '../../services/fms-setup.service';
import { TranslateService } from '@ngx-translate/core';
/**
 * `ClientAllocationComponent` is an Angular component responsible for managing client allocations
 * for receipts. It handles form inputs, allocation calculations, file uploads, and interactions
 * with backend services to save and retrieve allocation data.
 *
 * This component orchestrates the allocation of receipt amounts to various transactions,
 * facilitates file uploads for supporting documents, and manages the persistence of
 * receipt data. It integrates with multiple services for data retrieval, form management,
 * messaging, authentication, and document management.
 */
@Component({
  selector: 'app-client-allocation',
  templateUrl: './client-allocation.component.html',
  styleUrls: ['./client-allocation.component.css'],
})
export class ClientAllocationComponent {
 /**
   * @description The amount received from client
   */
 receivedFrom: string;
 /**
  * @description the gross amount from receipt
  */
 grossReceiptAmount: number;
 /**
  * @description the date on the receipt
  */
 receiptDate: Date;
 /**
  * @description drawer's bank
  */
 drawersBank: string;
 /**
  * @description additional notes for the transaction
  */
 narration: string;
 /**
  * @description reference id for the payment
  */
 paymentRef: string;
 /**
  * @description the date on the document
  */
 documentDate: Date;
 /**
  * @description the type of currency used
  */
 currency: string;
 /**
  * @description the type of cheque
  */
 chequeType: string;
 /**
  * @description bank account
  */
 bankAccount: number;
 /**
  * @description point of receipt
  */
 receiptingPoint: string;
 /**
  * @description additional charges
  */
 charges: string;
 /**
  * @description amount of the charge
  */
 chargeAmount: number;
 /**
  * @description type of charge
  */
 selectedChargeType: string;
 /**
  * @description the mode of payment
  */
 paymentMode: string;
 /**
  * @description manual exchange rate
  */
 manualExchangeRate: number;
 /**
  * @description exchange rate
  */
 exchangeRate: number;
 /**
  * @description any other reference
  */
 otherRef: string;
 /**
  * @description bank account code
  */
 bankAccountCode: number;
 /**
  * @description bank account type
  */
 bankAccountType: string;
 /**
  * @description manual reference
  */
 manualRef: string;
 /**
  * @description account type short description
  */
 accountTypeShortDesc: string;
 /**
  * @description requests
  */
 requests: any;
 /**
  * @description form for receipt details
  */
 receiptingDetailsForm: FormGroup;
 /**
  * @description status of parameters
  */
 parameterStatus: string;
 /**
  * @description the receipting point object
  */
 receiptingPointObject: ReceiptingPointsDTO;
 /**
  * @description stored data
  */
 storedData: any;
 /**
  * @description global bank account variable
  */
 globalBankAccountVariable: number;
 /**
  * @description selected bank
  */
 selectedBank: BanksDTO;
 /**
  * @description global bank type
  */
 globalBankType: string;
 /**
  * @description default currency id
  */
 defaultCurrencyId: number;
 /**
  * @description user id
  */
 userId: number;
 /**
  * @description receipt number
  */
 receiptNumber: string;
 /**
  * @description global receipt branch number
  */
 globalReceiptBranchNumber: number;
 /**
  * @description global receipt number
  */
 globalReceiptNumber: number;
 /**
  * @description array of transactions
  */
 transactions: TransactionDTO[] = [];
 /**
  * @description logged in user
  */
 loggedInUser: any;
 /**
  * @description flag for allocation
  */
 allocation: boolean = false;
 /**
  * @description allocated amounts
  */
 allocatedAmounts: { allocatedAmount: number; commissionChecked: string }[] =
   [];
 /**
  * @description total amount allocated
  */
 totalAllocatedAmount: number = 0;
 /**
  * @description amount issued
  */
 amountIssued: number = 0;
 /**
  * @description selected client
  */
 selectedClient: any = null;
 /**
  * @description global account type selected
  */
 globalAccountTypeSelected: any = null;
 /**
  * @description flag for allocations returned
  */
 allocationsReturned: boolean = false;
 /**
  * @description global allocation
  */
 globalGetAllocation: any;
 /**
  * @description flag for get allocation status
  */
 getAllocationStatus: boolean = false;
 /**
  * @description flag for allocation completed
  */
 isAllocationCompleted: boolean = false;
 /**
  * @description flag for file saved
  */
 isFileSaved: boolean = false;
 /**
  * @description get allocation
  */
 getAllocation: GetAllocationDTO[] = [];
 /**
  * @description filtered transactions
  */
 filteredTransactions: any[] = [];
 /**
  * @description flag to show save button
  */
 showSaveButton: boolean = false;
 /**
  * @description flag for allocation posted
  */
 isAllocationPosted: boolean = false;
 /**
  * @description flag for file uploaded
  */
 fileUploaded: boolean = false;
 /**
  * @description receipt response
  */
 receiptResponse: any;
 /**
  * @description receipt slip response
  */
 receiptSlipResponse: any;
 /**
  * @description default organization
  */
 defaultOrg: OrganizationDTO;
 /**
  * @description selected organization
  */
 selectedOrg: OrganizationDTO;
 /**
  * @description selected branch
  */
 selectedBranch: BranchDTO;
 /**
  * @description default branch
  */
 defaultBranch: BranchDTO;
 /**
  * @description organization id
  */
 orgId: number;
 /**
  * @description receipt default branch
  */
 receiptDefaultBranch: BranchDTO;
 /**
  * @description branch receipt number
  */
 branchReceiptNumber: number;
 /**
  * @description receipt code
  */
 receiptCode: string;
 /**
  * @description filter for client name
  */
 clientNameFilter: string = '';
 debitNoteFilter: string = '';
 /**
  * @description filter for policy number
  */
 policyNumberFilter: string = '';
 /**
  * @description filter for amount
  */
 amountFilter: number | null = null;
 /**
  * @description filter for balance
  */
 balanceFilter: number | null = null;
 /**
  * @description filter for commission
  */
 commissionFilter: number | null = null;
 /**
  * @description flag for is amount
  */
 isAmount: boolean = false;
 /**
  * @description first row index
  */
 first: number = 0;
 /**
  * @description rows per page
  */
 rows: number = 5;
 /**
  * @description total number of records
  */
 totalRecords: number = 0;
 /**
  * @description Flag indicating whether a receipt is currently downloading.
  */
 isReceiptDownloading = false;
 /**
  * @description Flag indicating whether the file upload button should be displayed.
  */
 canShowUploadFileBtn: boolean = false;
 /**
  * @description Flag indicating whether the acknowledge button should be displayed.
  */
 showAcknowledgeBtn: boolean = false;
 /**
  * @description message
  */
 message: string;
 /**
  * @description current file index
  */
 currentFileIndex: number = 0;
 /**
  * @description file descriptions
  */
 fileDescriptions: { file: File; description: string; uploaded: boolean }[] =
   [];
 /**
  * @description flag for upload disabled
  */
 isUploadDisabled: boolean = true;
 /**
  * @description flag for file upload button disabled
  */
 isFileUploadButtonDisabled: boolean = false;
 /**
  * @description selected file
  */
 selectedFile: File | null = null;
 /**
  * @description description
  */
 description: string = '';
 /**
  * @description base64 output
  */
 base64Output: string = '';
 /**
  * @description flag for file is uploaded
  */
 fileIsUploaded = false;
 /**
  * @description global document id
  */
 globalDocId: string;
 /**
  * @description uploaded file
  */
 uploadedFile: any = null;
 /**
  * @description decoded file url
  */
 decodedFileUrl: string | null = null;
 /**
  * @description array of uploaded files
  */
 uploadedFiles: any[] = [];
 /**
  * @description file path
  */
 filePath: string | null = null;
 isEmptyAllocationPosted:boolean=false;
 /**
  * Constructor for `ClientAllocationComponent`.
  * @param receiptDataService Service for managing receipt data
  * @param fb FormBuilder for creating reactive forms
  * @param globalMessagingService Service for global messaging
  * @param receiptService Service for receipt-related operations
  * @param authService Service for authentication
  * @param cdr ChangeDetectorRef for detecting changes in the component
  * @param router Angular router for navigation
  * @param dmsService Service for document management
  * @param reportService Service for generating reports
  * @param sessionStorage Service for managing session storage
  * @param fmsSetupService Service for FMS setup configurations
  * @param translate Service for translations
  */
  constructor(
    private receiptDataService: ReceiptDataService,
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private receiptService: ReceiptService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    //private router:Router,
    private router: Router,
    private dmsService: DmsService,
    private reportService: ReportsService,
    private sessionStorage: SessionStorageService,
    private fmsSetupService: FmsSetupService,
    public translate: TranslateService
  ) {}
  /**
   * Angular lifecycle hook that initializes the component.
   * Fetches necessary data and sets up the form.
   */
  ngOnInit(): void {
    this.captureReceiptForm();
    this.loggedInUser = this.authService.getCurrentUser();
    const storedData = this.receiptDataService.getReceiptData();
    this.storedData = storedData;

    // Retrieve organization from localStorage or receiptDataService
    let storedSelectedOrg = this.sessionStorage.getItem('selectedOrg');
    let storedDefaultOrg = this.sessionStorage.getItem('defaultOrg');

    this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
    this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;

    // Ensure only one organization is active at a time
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

    let receiptingPoint = this.sessionStorage.getItem('receiptingPoint');
    this.receiptingPointObject = receiptingPoint
      ? JSON.parse(receiptingPoint)
      : {};
    this.transactions = this.receiptDataService.getTransactions();
    this.filteredTransactions = this.transactions;
    if (this.transactions) {
      this.allocation = true;
    }

    let receiptCode = this.sessionStorage.getItem('receiptCode');
    this.receiptCode = receiptCode;

    let branchReceiptNumber = this.sessionStorage.getItem(
      'branchReceiptNumber'
    );
    this.branchReceiptNumber = Number(branchReceiptNumber);

    if (storedData) {
      this.amountIssued = storedData.amountIssued || 0;
      // this.amountIssued = this.amountIssued ?? (storedData.amountIssued || 0);
      this.paymentMode = storedData.paymentMode || '';
      this.paymentRef = storedData.paymentRef || '';
      this.manualRef = storedData.manualRef || '';
      this.currency = storedData.currency || '';
      this.documentDate = storedData.documentDate
        ? new Date(storedData.documentDate)
        : null; // Convert string to Date
      this.receiptDate = storedData.receiptDate
        ? new Date(storedData.receiptDate)
        : null; // Convert string to Date
      this.charges = storedData.charges || '';
      this.chargeAmount = storedData.chargeAmount || 0;
      this.selectedChargeType = storedData.selectedChargeType || '';
      this.chequeType = storedData.chequeType || '';
      this.bankAccount = storedData.bankAccount || 0;
      this.exchangeRate = storedData.exchangeRate;
      this.manualExchangeRate = storedData.manualExchangeRate;
      this.otherRef = storedData.otherRef || '';
      this.drawersBank = storedData.drawersBank || '';
      this.narration = storedData?.narration || '';
      this.receivedFrom = storedData?.receivedFrom || '';
      this.grossReceiptAmount = storedData?.grossReceiptAmount || 0;
      this.receiptingPoint = storedData.receiptingPoint || '';
    }
    //let selectedBank = this.sessionStorage.getItem('selectedBank');
    //this.selectedBank = JSON.parse(selectedBank);

    let globalBankAccountVariable =
      this.sessionStorage.getItem('globalBankAccount');
    this.globalBankAccountVariable = Number(this.globalBankAccountVariable);
    let globalBankType = this.sessionStorage.getItem('globalBankType');
    this.globalBankType = globalBankType;
    this.allocatedAmounts = this.receiptDataService.getAllocatedAmounts();
    // Initialize form controls for each transaction
    this.initializeAllocatedAmountControls();
    this.calculateTotalAllocatedAmount();

    this.selectedClient = this.receiptDataService.getSelectedClient(); // Retrieve stored client
    this.globalAccountTypeSelected =
      this.receiptDataService.getGlobalAccountTypeSelected();
    if (
      this.globalAccountTypeSelected &&
      this.globalAccountTypeSelected.actTypeShtDesc
    ) {
    }
    let accountTypeShortDesc = this.sessionStorage.getItem(
      'accountTypeShortDesc'
    );
    this.accountTypeShortDesc = accountTypeShortDesc;
    if (this.selectedClient && this.selectedClient.code) {
    }
    this.totalRecords = this.transactions.length; // Set total records count

    // let exchangeRate = this.sessionStorage.getItem('exchangeRate');
    // this.exchangeRate = Number(exchangeRate);
    this.fetchParamStatus();
    this.getAllocations(); // Always fetch latest allocations
    this.confirmPaymentModeSelected();
  }
   /**
   * Initializes the receipt capture form with default values and validators.
   *
   * This method sets up the reactive form (`receiptingDetailsForm`) with a FormArray
   * for managing allocated amounts for each transaction. It also includes a
   * form control for file descriptions, which is used when uploading files.
   */
  captureReceiptForm() {
    //const today = this.formatDate(new Date()); // Get current date in 'yyyy-MM-dd' format
    this.receiptingDetailsForm = this.fb.group({
      allocatedAmount: this.fb.array([]), // FormArray for allocated amounts
      description: ['', Validators.required],
    });
  }
   /**
   * Updates the allocated amount for a specific transaction and recalculates the total allocated amount.
   * @param index The index of the transaction in the list
   * @param amount The new allocated amount
   */
  onAllocatedAmountChange(index: number, amount: number): void {
    this.receiptDataService.updateAllocatedAmount(index, amount);
    this.calculateTotalAllocatedAmount();
  }
   /**
   * Applies a filter to the transactions based on the specified field and value.
   * @param event The event triggered by the filter input
   * @param field The field to filter by (e.g., 'clientName', 'policyNumber')
   */
  applyFilter(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;

    switch (field) {
      case 'clientName':
        this.clientNameFilter = filterValue;
        break;
      case 'policyNumber':
        this.policyNumberFilter = filterValue;
        break;
      case 'debitNote':
        this.debitNoteFilter = filterValue;
        break;
      case 'amount':
        this.amountFilter = filterValue ? Number(filterValue) : null;
        break;
      case 'balance':
        this.balanceFilter = filterValue ? Number(filterValue) : null;
        break;
      case 'commission':
        this.commissionFilter = filterValue ? Number(filterValue) : null;
    }

    this.filterTransactions(); // Ensure this is called
  }
  /**
   * Filters the transactions based on the current filter values.
   */
  filterTransactions(): void {
    if (
      !this.clientNameFilter?.trim() &&
      !this.policyNumberFilter?.trim() &&
      !this.debitNoteFilter?.trim() &&
      this.amountFilter === null &&
      this.balanceFilter === null &&
      this.commissionFilter === null
    ) {
      this.filteredTransactions = [...this.transactions]; // Reset to original transactions if no filters are applied
      return;
    }

    this.filteredTransactions = this.transactions
      .map((transaction) => {
        let score = 0;

        // Client Name Match
        if (this.clientNameFilter?.trim()) {
          const clientNameMatch = transaction.clientName
            .toLowerCase()
            .includes(this.clientNameFilter.toLowerCase());
          if (clientNameMatch) score += 1;
        }

        // Policy Number Match
        if (this.policyNumberFilter?.trim()) {
          const policyNumberMatch = String(transaction.clientPolicyNumber)
            .toLowerCase()
            .includes(this.policyNumberFilter.toLowerCase());
          if (policyNumberMatch) score += 1;
        }
//debit Note match
if (this.debitNoteFilter?.trim()) {
  const debitNoteMatch = String(transaction.referenceNumber)
    .toLowerCase()
    .includes(this.debitNoteFilter.toLowerCase());
  if (debitNoteMatch) score += 1;
}
        // Amount Match
        if (this.amountFilter !== null) {
          const amountMatch = Number(transaction.amount) === this.amountFilter;
          if (amountMatch) score += 1;
        }

        // Balance Match
        if (this.balanceFilter !== null) {
          const balanceMatch =
            Number(transaction.balance) === this.balanceFilter;
          if (balanceMatch) score += 1;
        }

        // Commission Match
        if (this.commissionFilter !== null) {
          const commissionMatch =
            Number(transaction.commission) === this.commissionFilter;
          if (commissionMatch) score += 1;
        }

        return { ...transaction, score }; // Add score to transaction
      })
      .filter((transaction) => transaction.score > 0) // Only keep transactions that match at least one filter
      .sort((a, b) => b.score - a.score); // Sort by relevance
  }
  /**
   * Initializes form controls for each transaction in the allocated amounts FormArray.
   */
  // ✅ Initialize form controls for each transaction
  private initializeAllocatedAmountControls(): void {
    const allocatedAmountArray = this.allocatedAmountControls;
    allocatedAmountArray.clear(); // Clear existing controls

    this.transactions.forEach(() => {
      allocatedAmountArray.push(
        this.fb.group({
          allocatedAmount: [0, Validators.required],
          commissionChecked: ['N'],
        })
      );
    });
  }
  /**
   * Returns the allocatedAmount FormArray from the form.
   * @returns The FormArray for allocated amounts
   */

  get allocatedAmountControls(): FormArray {
    return this.receiptingDetailsForm.get('allocatedAmount') as FormArray;
  }
  /**
   * Returns a specific form control from the allocatedAmount FormArray.
   * @param index The index of the control in the FormArray
   * @param controlName The name of the control
   * @returns The FormControl or null if not found
   */
  getFormControl(index: number, controlName: string): FormControl | null {
    const formGroup = this.allocatedAmountControls.at(index) as FormGroup;
    return formGroup ? (formGroup.get(controlName) as FormControl) : null;
  }

  calculateTotalAllocatedAmount(): void {
    // Sum previously posted allocations
    const previousAllocations =
      this.getAllocation?.reduce(
        (total, allocation) =>
          total +
          allocation.receiptParticularDetails.reduce(
            (sum, detail) => sum + detail.premiumAmount,
            0
          ),
        0
      ) || 0;

    // Sum currently allocated form values
    const newAllocatedTotal = this.allocatedAmountControls.value.reduce(
      (total: number, item: { allocatedAmount: number }) =>
        total + Number(item.allocatedAmount || 0),
      0
    );

    // Ensure we are adding both previous allocations and new allocations
    this.totalAllocatedAmount = previousAllocations + newAllocatedTotal;

    // Persist the total in session storage
    this.sessionStorage.setItem(
      'totalAllocatedAmount',
      JSON.stringify(this.totalAllocatedAmount)
    );
  }

  /**
   * Handles the change event for the commission checkbox.
   * @param index The index of the transaction in the list
   * @param event The checkbox change event
   */
  // onCommissionCheckedChange(index: number, event: Event): void {
  //   const isChecked = (event.target as HTMLInputElement).checked;
  //   const commissionControl = this.getFormControl(index, 'commissionChecked');
  //   if (commissionControl) {
  //     commissionControl.setValue(isChecked ? 'Y' : 'N');
  //   }
  // }
  onCommissionCheckedChange(index: number, value: string): void {
    const commissionControl = this.getFormControl(index, 'commissionChecked');
    if (commissionControl) {
      commissionControl.setValue(value);
    }
  }
  /**
   * Calculates the remaining amount by subtracting the total allocated amount from the amount issued.
   * @returns The remaining amount
   */
  getRemainingAmount(): number {
    return this.amountIssued - this.totalAllocatedAmount;
  }

  //
  updateTotalAllocatedAmount(): void {
    let totalPostedAmount =
      this.getAllocation?.reduce(
        (total, allocation) =>
          total +
          allocation.receiptParticularDetails.reduce(
            (sum, detail) => sum + detail.premiumAmount,
            0
          ),
        0
      ) || 0;

    const newAllocatedTotal = this.transactions.reduce(
      (total, transaction, index) => {
        const allocatedAmountControl = this.getFormControl(
          index,
          'allocatedAmount'
        );
        const allocatedAmount = Number(allocatedAmountControl?.value || 0);
        return total + allocatedAmount;
      },
      0
    );

    // Ensure the total includes previous allocations + new allocations
    this.totalAllocatedAmount = totalPostedAmount + newAllocatedTotal;
  }

 /**
   * Allocates and posts the allocations to the backend.
   *
   * This method collects the allocated amounts from the form, validates the input,
   * and sends the allocation data to the backend for processing. It handles error
   * cases such as invalid amounts, missing data, and backend errors, displaying
   * appropriate messages to the user.
   */
  allocateAndPostAllocations(): any {
    const allocatedTransactionsData = this.transactions
      .map((transaction, index) => {
        const allocatedAmountControl = this.getFormControl(
          index,
          'allocatedAmount'
        );
        const allocatedAmount = allocatedAmountControl?.value || 0;

        return {
          transaction,
          allocatedAmount,
          index,
        };
      })
      .filter((item) => item.allocatedAmount > 0);

    if (allocatedTransactionsData.length === 0) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No transactions have been allocated'
      );
      return;
    }
    if (!this.amountIssued) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please enter the amount issued.'
      );
      return false; // Stop further execution
    }

    if (this.totalAllocatedAmount > this.amountIssued) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Total Allocated Amount Exceeds Amount Issued'
      );

      return false;
    }
    const receiptParticulars = {
      receiptNumber: this.branchReceiptNumber,
      capturedBy: this.loggedInUser.code,
      systemCode: this.selectedClient.systemCode,
      branchCode: this.defaultBranch?.id || this.selectedBranch?.id,
      clientCode: this.selectedClient.code,
      clientShortDescription: this.selectedClient.shortDesc,
      receiptType: this.selectedClient.receiptType,
      clientName: this.selectedClient.name,
      sslAccountCode: this.selectedClient.accountCode,
      accountTypeId: this.accountTypeShortDesc,
      referenceNumber: null,
      receiptParticularDetails: allocatedTransactionsData.map(
        ({ transaction, allocatedAmount, index }) => ({
          policyNumber: String(transaction.transactionNumber),
          referenceNumber: transaction.referenceNumber,
          transactionNumber: transaction.transactionNumber,
          batchNumber: transaction.policyBatchNumber,
          premiumAmount: allocatedAmount,
          loanAmount: 0,
          pensionAmount: 0,
          miscAmount: 0,
          endorsementCode: 0,
          endorsementDrCrNumber: null,
          includeCommission:
            this.getFormControl(index, 'commissionChecked')?.value === 'Y'
              ? 'Y'
              : 'N',
          commissionAmount: transaction.commission,
          narration: this.narration || '',
          overAllocated: 0,
          includeVat: 'N',
          clientPolicyNumber: transaction.clientPolicyNumber,
          policyType: null,
          accountNumber: null,
          side: null,
          directType: null,
        })
      ),
    };

    const allocationData: AllocationDTO = {
      receiptParticulars: [receiptParticulars],
    };
    this.receiptService
      .postAllocation(this.loggedInUser.code, allocationData)
      .subscribe({
        next: (response) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Allocations posted successfully'
          );

          // ✅ Preserve previous allocated values
          const newlyAllocatedTotal = allocatedTransactionsData.reduce(
            (total, item) => total + item.allocatedAmount,
            0
          );
          this.totalAllocatedAmount += newlyAllocatedTotal; // ✅ Keep accumulating

          // ✅ Reset allocated amounts after posting
          this.transactions.forEach((transaction, index) => {
            const allocatedAmountControl = this.getFormControl(
              index,
              'allocatedAmount'
            );
            if (allocatedAmountControl) {
              allocatedAmountControl.setValue(0); // Reset only UI, not the total
            }
          });

          // ✅ Ensure newly posted amounts persist
          this.getAllocations();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err.error?.msg || 'Failed to post allocations'
          );
        },
      });
  }
confirmtotalAllocatedAmount(){
  if(this.totalAllocatedAmount > 0){
    this.allocateAndPostAllocations();
  }else{
    this.saveEmptyAllocations();
  }
}
saveEmptyAllocations(): any {
  const receiptParticulars: ReceiptParticularsDTO[] = [
    {
      receiptNumber: this.branchReceiptNumber,
      capturedBy: this.loggedInUser.code,
      systemCode: this.selectedClient.systemCode,
      branchCode: this.defaultBranch?.id || this.selectedBranch?.id,
      clientCode: this.selectedClient.code,
      clientShortDescription: this.selectedClient.shortDesc,
      receiptType: this.selectedClient.receiptType,
      clientName: this.selectedClient.name,
      sslAccountCode: this.selectedClient.accountCode,
      accountTypeId: this.accountTypeShortDesc,
      referenceNumber: null
    }
  ];

  // ✅ Now passing an array of ReceiptParticularsDTO
  this.receiptService.postEmptyAllocation(this.loggedInUser.code, receiptParticulars).subscribe({
    next: (response) => {
      this.globalMessagingService.displaySuccessMessage('Success', response.msg);
      this.isEmptyAllocationPosted=true;
    },
    error: (err) => {
      this.isEmptyAllocationPosted=true;
      this.globalMessagingService.displayErrorMessage('Failed!', err.error?.msg || 'Unable to post allocations');
    }
  });
}

   /**
   * Fetches the allocations from the backend.
   *
   * This method retrieves allocation data from the backend based on the branch
   * receipt number and user code. It filters the allocations to include only
   * those with amounts allocated, updates the component's state, and stores the
   * allocations in session storage.
   */
  getAllocations() {
    this.receiptService
      .getAllocations(this.branchReceiptNumber, this.loggedInUser.code)
      .subscribe({
        next: (response) => {
          this.selectedClient;

          // Filter allocations where there are amounts allocated
          this.getAllocation = response.data.filter((allocation) =>
            allocation.receiptParticularDetails.some(
              (detail) => detail.premiumAmount > 0
            )
          );
          if (this.getAllocation) {
            this.canShowUploadFileBtn = true;
          }
          // ✅ Use .length to check if allocations exist
          this.isAllocationCompleted = this.getAllocation.length > 0;
          this.sessionStorage.setItem(
            'allocations',
            JSON.stringify(this.getAllocation)
          );
          //  ✅ Reset totalAllocatedAmount before recalculating
          this.totalAllocatedAmount = this.getAllocation.reduce(
            (total, allocation) => {
              return (
                total +
                allocation.receiptParticularDetails.reduce(
                  (sum, detail) => sum + detail.premiumAmount,
                  0
                )
              );
            },
            0
          );

          // ✅ Store the latest total in localStorage
          this.sessionStorage.setItem(
            'totalAllocatedAmount',
            JSON.stringify(this.totalAllocatedAmount)
          );
          // ✅ Set transactions for new allocations
          this.transactions = this.receiptDataService.getTransactions();
          this.transactions.forEach((transaction, index) => {
            const allocatedAmountControl = this.getFormControl(
              index,
              'allocatedAmount'
            );
            if (allocatedAmountControl) {
              allocatedAmountControl.valueChanges.subscribe(() => {
                this.calculateTotalAllocatedAmount(); // ✅ Keeps running total live
              });
            }
          });

          this.getAllocationStatus = true;
          this.allocationsReturned = true;
          this.globalGetAllocation = this.getAllocation;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'error fetched',
            err.error?.msg || 'Failed to fetch Allocation'
          );
        },
      });
  }
   /**
   * Deletes an allocation by its receipt detail code.
   * @param receiptDetailCode The code of the receipt detail to delete
   */
  deleteAllocation(receiptDetailCode: number): void {
    this.receiptService.deleteAllocation(receiptDetailCode).subscribe({
      next: (response) => {
        if (response.success) {
          let amountToSubtract = 0;

          // Find and remove the deleted allocation from local state
          this.getAllocation.forEach((allocation) => {
            const detailIndex = allocation.receiptParticularDetails.findIndex(
              (detail) => detail.code === receiptDetailCode
            );

            if (detailIndex !== -1) {
              amountToSubtract +=
                allocation.receiptParticularDetails[detailIndex].premiumAmount;
              allocation.receiptParticularDetails.splice(detailIndex, 1); // Remove allocation detail
            }
          });

          // Remove empty allocation records
          this.getAllocation = this.getAllocation.filter(
            (allocation) => allocation.receiptParticularDetails.length > 0
          );

          // Update total allocated amount
          this.totalAllocatedAmount = Math.max(
            0,
            this.totalAllocatedAmount - amountToSubtract
          );

          // Store the updated total in localStorage
          this.sessionStorage.setItem(
            'totalAllocatedAmount',
            JSON.stringify(this.totalAllocatedAmount)
          );
          // Hide upload button if no allocations exist
          this.canShowUploadFileBtn = this.getAllocation.length > 0;
          // ✅ Use .length to check if allocations exist
          this.isAllocationCompleted = this.getAllocation.length > 0;
          // Display success message
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Allocation deleted successfully'
          );

          // No need to call `getAllocations()` since we updated the state locally!
        } else {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to delete allocation'
          );
        }
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error?.message || 'Failed to delete allocation'
        );
      },
    });
  }
    /**
   * Saves the file description for the currently selected file.
   *
   * This method retrieves the file description from the `receiptingDetailsForm`,
   * updates the corresponding file description in the `fileDescriptions` array,
   * and closes the file description modal.
   */
  saveFileDescription(): void {
    const description = this.receiptingDetailsForm.get('description')?.value; // Get the description from the form

    if (
      this.currentFileIndex >= 0 &&
      this.currentFileIndex < this.fileDescriptions.length
    ) {
      if (description) {
        // Check if description is not empty
        this.fileDescriptions[this.currentFileIndex].description = description; // Update the description for the current file

        // Close the modal after saving the description
        this.closeFileModal();
      } else {
        this.globalMessagingService.displayErrorMessage(
          'Failed',
          'Please enter file description'
        );
      }
    }
  }
  /**
   * Closes the file description modal.
   */
  closeFileModal(): void {
    const modalElement = document.getElementById('fileDescriptionModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
  /**
   * Removes a file from the file descriptions array.
   * @param index The index of the file to remove
   */
  onRemoveFile(index: number): void {
    this.fileDescriptions.splice(index, 1);
    // If no files are left, reset selectedFile and fileUploaded flags
    if (this.fileDescriptions.length === 0) {
      this.selectedFile = null;
      this.fileUploaded = false; // Ensure submission check works properly
    }
    this.globalMessagingService.displaySuccessMessage(
      'Success',
      'File removed successfully'
    );
    this.isFileUploadButtonDisabled = false;
  }
  clearFileInput(event: Event): void {
    (event.target as HTMLInputElement).value = ''; // Clears previous selection
  }

  /**
   * Handles the file selection event.
   * @param event The file selection event
   */
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Add file to descriptions array
      this.currentFileIndex = this.fileDescriptions.length;
      this.fileDescriptions.push({
        file: this.selectedFile,
        description: this.description,
        uploaded: false,
      });

      // Convert file to Base64 without the "data:" prefix
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;

        // Remove the "data:" prefix if present
        if (base64String.includes(',')) {
          this.base64Output = base64String.split(',')[1];
        } else {
          this.base64Output = base64String;
        }
      };
      reader.readAsDataURL(this.selectedFile);
      //this.openModal(this.fileDescriptions.length - 1); // Open modal for the last added file
      setTimeout(() => {
        this.openModal(this.fileDescriptions.length - 1);
      }, 100); // Small delay to ensure UI updates
      this.isFileUploadButtonDisabled = true;
    } else {
      this.selectedFile = null; // Reset selectedFile if no file is selected
      this.isFileUploadButtonDisabled = false; // Keep "File Upload" button active
    }
  }
  /**
   * Opens the file description modal.
   * @param index The index of the file to open the modal for
   */

  openModal(index: number): void {
    this.currentFileIndex = index;
    setTimeout(() => {
      const modalElement = document.getElementById('fileDescriptionModal');
      if (modalElement) {
        const modalInstance = new bootstrap.Modal(modalElement, {
          backdrop: 'static', // Prevent closing on click outside
          keyboard: false, // Prevent closing with keyboard ESC
        });
        modalInstance.show();
      }
    }, 100); // Small delay to ensure modal is found
  }

  /**
   * Uploads the selected file to the backend.
   */
  uploadFile(): void {
    if (!this.getAllocationStatus) {
      this.globalMessagingService.displayErrorMessage(
        'Warning',
        'please make allocation first!'
      );
      return;
    }
    if (!this.selectedFile || !this.base64Output) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No selected file found!'
      );
      return;
    }

    if (!this.globalGetAllocation.length) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No fetched allocations'
      );

      return;
    }

    //const paymentMode = this.receiptingDetailsForm.get('paymentMode')?.value;
    if (!this.paymentMode) {
      this.globalMessagingService.displayErrorMessage(
        'Warning',
        'Please select payment mode first!'
      );
      return;
    }

    try {
      const requests: ReceiptUploadRequest[] = [];

      this.globalGetAllocation.forEach((allocation) => {
        if (
          allocation.receiptParticularDetails &&
          Array.isArray(allocation.receiptParticularDetails)
        ) {
          allocation.receiptParticularDetails.forEach((detail) => {
            requests.push({
              docType: 'RECEIPT',
              docData: this.base64Output, // No "data:" prefix here
              module: 'CB-RECEIPTS',
              originalFileName: this.selectedFile.name,
              filename: this.selectedFile.name,
              referenceNo: detail.referenceNumber,
              docDescription:
                this.fileDescriptions[this.currentFileIndex].description,
              amount: detail.premiumAmount,
              paymentMethod: this.paymentMode,
              policyNumber: detail.policyNumber,
            });
          });
        }
      });

      this.receiptService.uploadFiles(requests).subscribe({
        next: (response) => {
          this.globalDocId = response.docId;
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Receipt uploaded successfully'
          );
          this.fileUploaded = true;
          if (response.docId) {
            this.globalDocId = response.docId;

            // Store file in uploadedFiles immediately
            const uploadedFile = {
              docId: response.docId, // Ensure we store docId properly
              docName: this.selectedFile.name,
              contentType: this.selectedFile.type,
              byteData: this.base64Output, // Store base64 for immediate use
            };

            this.uploadedFiles.push(uploadedFile);
          }
          this.selectedFile = null;
          this.base64Output = '';
          this.fileDescriptions = [];
          this.currentFileIndex = 0;
          this.isFileUploadButtonDisabled = false; // Re-enable the "File Upload" button
          this.fileIsUploaded = true;
          this.fetchDocByDocId(this.globalDocId);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error?.error || 'Failed to upload receipt'
          );
        },
      });
    } catch (error) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Error preparing file upload'
      );
    }
  }

  /**
   * Fetches a document by its document ID.
   * @param docId The document ID to fetch
   */
  fetchDocByDocId(docId: string) {
    this.dmsService.getDocumentById(docId).subscribe({
      next: (response) => {
        this.uploadedFile = response;

        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Doc retrieved successfullly'
        );
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error.error?.error || 'failed to fetch doc'
        );
      },
    });
  }
  /**
   * Opens a file in a new tab or initiates a download.
   * @param file The file to open
   */
  openFile(file: any): void {
    if (file && file.byteData) {
      try {
        // Convert Base64 to binary data
        const byteCharacters = atob(file.byteData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Determine file type
        const isPdf = file.docName?.toLowerCase().endsWith('.pdf');
        const blobType = isPdf
          ? 'application/pdf'
          : file.contentType || 'application/octet-stream';

        // Create Blob with correct type
        const blob = new Blob([byteArray], { type: blobType });

        // Handle PDF files
        if (isPdf) {
          const fileUrl = URL.createObjectURL(blob);
          window.open(fileUrl, '_blank');
        } else {
          // Handle non-PDF files: Provide a download option
          const downloadUrl = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = downloadUrl;
          anchor.download = file.docName || 'downloaded_file';
          document.body.appendChild(anchor);
          anchor.click();
          document.body.removeChild(anchor);
          URL.revokeObjectURL(downloadUrl); // Clean up the download URL
        }
      } catch (error) {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to process the file. The file might be corrupted or in an invalid format.'
        );
      }
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No file data available'
      );
    }
  }

  /**
   * Deletes a file from the uploaded files list.
   * @param file The file to delete
   * @param index The index of the file in the list
   */
  deleteFile(file: any, index: number): void {
    if (!file || !file.docId) {
      //console.error('File missing docId:', file); // Debugging log
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No valid file selected for deletion'
      );
      return;
    }

    this.dmsService.deleteDocumentById(file.docId).subscribe({
      next: () => {
        // Remove file from the list
        this.uploadedFiles.splice(index, 1);
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'File deleted successfully'
        );

        // Reset globalDocId if needed
        if (this.globalDocId === file.docId) {
          this.globalDocId = null;
        }
      },
      error: (error) => {
        console.error('Error deleting file:', error);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error.error?.error || 'failed to delete file'
        );
      },
    });
  }
  fetchParamStatus() {
    this.fmsSetupService
      .getParamStatus('TRANSACTION_SUPPORT_DOCUMENTS')
      .subscribe({
        next: (response) => {
          this.parameterStatus = response.data;
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error:Failed to fetch Param Status',
            err.err.error
          );
        },
      });
  }

  confirmPaymentModeSelected(): any {
    if (
      this.paymentMode === 'CHEQUE' &&
      this.chequeType === 'post_dated_cheque'
    ) {
      this.message = 'Receipt will be issued upon cheque maturity';

      this.showAcknowledgeBtn = true;
    } else {
      this.showAcknowledgeBtn = false;
    }
  }
  /**
   * Submits the receipt data to the backend.
   */
  submitReceipt(): any {
    // ✅ 1. Check if any selected file is not posted
    const hasUnpostedFiles = this.fileDescriptions.some(
      (file) => !file.uploaded
    );

    if (hasUnpostedFiles) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete all selected files before saving the receipt.'
      );
      return; // Stop execution
    }

    // ✅ 2. Ensure no unposted selected file
    if (this.selectedFile !== null) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete the file before saving the receipt.'
      );
      return;
    }

    if (!this.amountIssued) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please enter the amount issued.'
      );
      return false; // Stop further execution
    }
    // Step 2: Validate the total allocated amount against the issued amount
    // if (this.totalAllocatedAmount < this.amountIssued) {
    //   this.globalMessagingService.displayErrorMessage(
    //     'Error',
    //     'Amount issued is not fully allocated.'
    //   );

    //   return false; // Stop further execution
    // }
    // if (this.totalAllocatedAmount > this.amountIssued) {
    //   this.globalMessagingService.displayErrorMessage(
    //     'Error',
    //     'Total Allocated Amount Exceeds Amount Issued'
    //   );

    //   return false;
    // }

    // console.log('receiptDoc>>',this.parameterStatus);
    if (this.parameterStatus == 'Y' && !this.fileUploaded) {
      if (
        confirm('do you want to save receipt without uploading file?') == true
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (
      !this.amountIssued &&
      !this.receivedFrom &&
      !this.receiptDate &&
      !this.narration &&
      !this.paymentMode &&
      !this.bankAccount
    ) {
      this.globalMessagingService.displayErrorMessage(
        'Failed',
        'please fill all fields marked with * in receipt capture!'
      );
      return false;
    }
    const allocatedDetails =
      this.getAllocation?.[0]?.receiptParticularDetails || [];
    if (
      this.paymentMode === 'CHEQUE' &&
      this.chequeType === 'post_dated_cheque'
    ) {
      this.message = 'Receipt will be issued upon cheque maturity';

      this.showAcknowledgeBtn = true;
      //post_dated_cheque open_cheque
      //console.log('type>',this.chequeType);
      //return;
    } else {
      this.message = 'success';
      this.showAcknowledgeBtn = false;
      //this.submitReceipt();
    }
    // Map allocated transactions to receiptParticularDetailUpdateRequests format
    const receiptParticularDetailUpdateRequests = allocatedDetails.map(
      (detail) => ({
        receiptParticularDetailCode: Number(detail.code), // Ensure it's a number
        premium: Number(detail.premiumAmount), // Ensure it's a number
        loan: Number(detail.loanAmount || 0),
        pension: Number(detail.pensionAmount || 0),
        misc: Number(detail.miscAmount || 0),
      })
    );
    const receiptData: ReceiptSaveDTO = {
      //this is the branch receiptNumber that is used via out receipting process
      receiptNo: this.branchReceiptNumber,
      receiptCode: this.receiptCode,
      receiptDate: this.receiptDate
        ? this.receiptDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      amount: String(this.storedData?.amountIssued || 0), // Add decimal points for BigDecimal fields
      paidBy: this.receivedFrom,
      currencyCode: String(this.currency), // Add quotes to ensure it's treated as string before conversion

      branchCode: String(this.defaultBranch?.id || this.selectedBranch?.id), // Add quotes to ensure it's treated as string before conversion
      paymentMode: this.paymentMode,
      paymentMemo: this.paymentRef || null,
      docDate: this.documentDate
        ? this.documentDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      //drawerBank: formValues.drawersBank || 'N/A',
      drawerBank: this.drawersBank || null,
      userCode: this.loggedInUser.code,
      narration: this.narration,
      insurerAccount: null,
      receivedFrom: this.receivedFrom || null,
      grossOrNet: 'G',
      //  grossOrNet: null,
      sysShtDesc: this.selectedClient?.systemShortDesc,
      receiptingPointId: this.receiptingPointObject.id,
      receiptingPointAutoManual: this.receiptingPointObject.autoManual,

      // capitalInjection:  "N",
      //capitalInjection: this.capitalInjection || this.NoCapitalInjection ,
      capitalInjection: 'N',
      chequeNo: null,
      ipfFinancier: null,
      receiptSms: 'Y',
      receiptChequeType: null,
      vatInclusive: null,
      //rctbbrCode: Number(this.defaultBranch?.id || this.selectedBranch?.id) ,
      rctbbrCode: null,
      directType: null,
      pmBnkCode: null,
      dmsKey: null,
      currencyRate: this.exchangeRate || this.manualExchangeRate || null,
      internalRemarks: null,
      // manualRef:formValues.manualRef || null,
      manualRef: this.manualRef || null,
      bankAccountCode: String(this.bankAccount),
      //bankAccountCode: Number(this.globalBankAccountVariable) || null, // Add quotes to ensure it's treated as string before conversion
      grossOrNetAdminCharge: 'G',
      insurerAcc: null,
      grossOrNetWhtax: null,
      grossOrNetVat: null,

      sysCode: Number(this.selectedClient.systemCode),
      bankAccountType: this.bankAccountType,
    };

    // Call the service to save the receipt
    this.receiptService.saveReceipt(receiptData).subscribe({
      next: (response) => {
        this.receiptResponse = response.data;
        this.sessionStorage.setItem(
          'receiptNo',
          this.receiptResponse.receiptNumber
        );
        this.globalMessagingService.displaySuccessMessage(
          this.message,
          this.receiptResponse.message
        );
        //this.sessionStorage.clear();
        this.router.navigate(['/home/fms/receipt-capture']);
        this.receiptDataService.clearReceiptData();

        //prepare receipt upload payload
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Failed to save receipt',
          error.error.msg
        );
      },
    });
  }
  /**
   * Saves the receipt and navigates to the receipt preview page.
   */
  saveAndPrint() {
    // ✅ 1. Check if any selected file is not posted
    const hasUnpostedFiles = this.fileDescriptions.some(
      (file) => !file.uploaded
    );

    if (hasUnpostedFiles) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete all selected files before saving the receipt.'
      );
      return; // Stop execution
    }

    // ✅ 2. Ensure no unposted selected file
    if (this.selectedFile !== null) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete the file before saving the receipt.'
      );
      return;
    }
    if (this.parameterStatus == 'Y' && !this.fileUploaded) {
      if (
        confirm('do you want to save receipt without uploading file?') == true
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (
      !this.amountIssued &&
      !this.receivedFrom &&
      !this.receiptDate &&
      !this.narration &&
      !this.paymentMode &&
      !this.bankAccount
    ) {
      this.globalMessagingService.displayErrorMessage(
        'Failed',
        'please fill all fields marked with * in receipt capture!'
      );
      return false;
    }
    if (!this.amountIssued) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please enter the amount issued.'
      );
      return false; // Stop further execution
    }

    // Step 2: Validate the total allocated amount against the issued amount
  
    const receiptData: ReceiptSaveDTO = {
      //this is the branch receiptNumber that is used via out receipting process
      receiptNo: this.branchReceiptNumber,
      receiptCode: this.receiptCode,
      receiptDate: this.receiptDate
        ? this.receiptDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      amount: String(this.storedData?.amountIssued || 0), // Add decimal points for BigDecimal fields
      paidBy: this.receivedFrom,
      currencyCode: String(this.currency), // Add quotes to ensure it's treated as string before conversion

      branchCode: String(this.defaultBranch?.id || this.selectedBranch?.id), // Add quotes to ensure it's treated as string before conversion
      paymentMode: this.paymentMode,
      paymentMemo: this.paymentRef || null,
      docDate: this.documentDate
        ? this.documentDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      //drawerBank: formValues.drawersBank || 'N/A',
      drawerBank: this.drawersBank || null,
      userCode: this.loggedInUser.code,
      narration: this.narration,
      insurerAccount: null,
      receivedFrom: this.receivedFrom || null,
      grossOrNet: 'G',
      //  grossOrNet: null,
      sysShtDesc: this.selectedClient?.systemShortDesc,
      receiptingPointId: this.receiptingPointObject.id,
      receiptingPointAutoManual: this.receiptingPointObject.autoManual,

      // capitalInjection:  "N",
      //capitalInjection: this.capitalInjection || this.NoCapitalInjection ,
      capitalInjection: 'N',
      chequeNo: null,
      ipfFinancier: null,
      receiptSms: 'Y',
      receiptChequeType: null,
      vatInclusive: null,
      //rctbbrCode: Number(this.defaultBranch?.id || this.selectedBranch?.id) ,
      rctbbrCode: null,
      directType: null,
      pmBnkCode: null,
      dmsKey: null,
      currencyRate: this.exchangeRate || this.manualExchangeRate || null,
      internalRemarks: null,
      // manualRef:formValues.manualRef || null,
      manualRef: this.manualRef || null,
      bankAccountCode: String(this.bankAccount),
      //bankAccountCode: Number(this.globalBankAccountVariable) || null, // Add quotes to ensure it's treated as string before conversion
      grossOrNetAdminCharge: 'G',
      insurerAcc: null,
      grossOrNetWhtax: null,
      grossOrNetVat: null,

      sysCode: Number(this.selectedClient.systemCode),
      bankAccountType: this.bankAccountType,
    };

    // Call the service to save the receipt
    this.receiptService.saveReceipt(receiptData).subscribe({
      next: (response) => {
        this.receiptResponse = response.data;
        this.sessionStorage.setItem(
          'receiptNo',
          this.receiptResponse.receiptNumber
        );
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Receipt saved successfully'
        );
        this.router.navigate(['/home/fms/receipt-preview']);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Failed to save receipt',
          error.error.msg || 'an error occured'
        );
      },
    });
  }
  handleSaveAndPrint() {
    this.saveAndGenerateSlip();
    // setTimeout(()=>{
    //   this.generateSlip();
    // },1000)
    this.generateSlip();
  }
  saveAndGenerateSlip() {
    // ✅ 1. Check if any selected file is not posted
    const hasUnpostedFiles = this.fileDescriptions.some(
      (file) => !file.uploaded
    );

    if (hasUnpostedFiles) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete all selected files before saving the receipt.'
      );
      return; // Stop execution
    }

    // ✅ 2. Ensure no unposted selected file
    if (this.selectedFile !== null) {
      this.globalMessagingService.displayErrorMessage(
        'Error!',
        'Please post or delete the file before saving the receipt.'
      );
      return;
    }
    if (this.parameterStatus == 'Y' && !this.fileUploaded) {
      if (
        confirm('do you want to save receipt without uploading file?') == true
      ) {
        return true;
      } else {
        return false;
      }
    }
    if (
      !this.amountIssued &&
      !this.receivedFrom &&
      !this.receiptDate &&
      !this.narration &&
      !this.paymentMode &&
      !this.bankAccount
    ) {
      this.globalMessagingService.displayErrorMessage(
        'Failed',
        'please fill all fields marked with * in receipt capture!'
      );
      return false;
    }
    if (!this.amountIssued) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please enter the amount issued.'
      );
      return false; // Stop further execution
    }

   
    const receiptData: ReceiptSaveDTO = {
      //this is the branch receiptNumber that is used via out receipting process
      receiptNo: this.branchReceiptNumber,
      receiptCode: this.receiptCode,
      receiptDate: this.receiptDate
        ? this.receiptDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      amount: String(this.storedData?.amountIssued || 0), // Add decimal points for BigDecimal fields
      paidBy: this.receivedFrom,
      currencyCode: String(this.currency), // Add quotes to ensure it's treated as string before conversion

      branchCode: String(this.defaultBranch?.id || this.selectedBranch?.id), // Add quotes to ensure it's treated as string before conversion
      paymentMode: this.paymentMode,
      paymentMemo: this.paymentRef || null,
      docDate: this.documentDate
        ? this.documentDate.toISOString().split('T')[0]
        : null, // Ensure it's a valid Date before calling toISOString()
      //drawerBank: formValues.drawersBank || 'N/A',
      drawerBank: this.drawersBank || null,
      userCode: this.loggedInUser.code,
      narration: this.narration,
      insurerAccount: null,
      receivedFrom: this.receivedFrom || null,
      grossOrNet: 'G',
      //  grossOrNet: null,
      sysShtDesc: this.selectedClient?.systemShortDesc,
      receiptingPointId: this.receiptingPointObject.id,
      receiptingPointAutoManual: this.receiptingPointObject.autoManual,

      // capitalInjection:  "N",
      //capitalInjection: this.capitalInjection || this.NoCapitalInjection ,
      capitalInjection: 'N',
      chequeNo: null,
      ipfFinancier: null,
      receiptSms: 'Y',
      receiptChequeType: null,
      vatInclusive: null,
      //rctbbrCode: Number(this.defaultBranch?.id || this.selectedBranch?.id) ,
      rctbbrCode: null,
      directType: null,
      pmBnkCode: null,
      dmsKey: null,
      currencyRate: this.exchangeRate || this.manualExchangeRate || null,
      internalRemarks: null,
      // manualRef:formValues.manualRef || null,
      manualRef: this.manualRef || null,
      bankAccountCode: String(this.bankAccount),
      //bankAccountCode: Number(this.globalBankAccountVariable) || null, // Add quotes to ensure it's treated as string before conversion
      grossOrNetAdminCharge: 'G',
      insurerAcc: null,
      grossOrNetWhtax: null,
      grossOrNetVat: null,

      sysCode: Number(this.selectedClient.systemCode),
      bankAccountType: this.bankAccountType,
    };

    // Call the service to save the receipt
    this.receiptService.saveReceipt(receiptData).subscribe({
      next: (response) => {
        this.receiptResponse = response.data;
        this.sessionStorage.setItem(
          'receiptNo',
          this.receiptResponse.receiptNumber
        );
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Receipt saved successfully'
        );
        setTimeout(() => {
          this.router.navigate(['/home/fms/slip-preview']);
        }, 100);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Failed to save receipt',
          error.error.msg || 'an error occured'
        );
      },
    });
  }
  generateSlip() {
    const payload: acknowledgementSlipDTO = {
      receiptNumbers: [this.receiptResponse.receiptNumber],
      userCode: this.loggedInUser.code,
    };
    //console.log('payloade>',payload)
    this.receiptService.generateAcknowledgementSlip(payload).subscribe({
      next: (response) => {
        this.receiptSlipResponse = response.data;
        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'slip generated successfully'
        );
        //this.sessionStorage.setItem('receiptSlipResponse',this.receiptSlipResponse.receiptNo);
        //this.router.navigate(['/home/fms/slip-preview']);
      },

      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Failed to save receipt',
          err.error.msg || 'an error occured'
        );
      },
    });
  }
  /**
   * Navigates back to the previous screen.
   */
  onBack() {
    //this.receiptDataService.setReceiptData(this.receiptingDetailsForm.value);
    this.router.navigate(['/home/fms/client-search']); // Navigate to the next screen
  }
}
