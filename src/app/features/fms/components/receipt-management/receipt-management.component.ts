import { ClientService } from '../../../../features/entities/services/client/client.service';
import { IntermediaryService } from './../../../entities/services/intermediary/intermediary.service';
import { Component, OnInit } from '@angular/core';
import {
  glAccountDTO,
  glContentDTO,
  ReceiptsToCancelContentDTO,
  ReceiptToCancelDTO,
  unPrintedReceiptContentDTO,
  unPrintedReceiptsDTO,
} from '../../data/receipt-management-dto';
import * as bootstrap from 'bootstrap';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { Router } from '@angular/router';
import { BranchDTO, GenericResponse } from '../../data/receipting-dto';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TimeScale } from 'chart.js';
import { AuthService } from '../../../../shared/services/auth.service';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { ReceiptService } from '../../services/receipt.service';
import { Logger } from 'src/app/shared/services';
const log = new Logger('ReceiptManagementComponent');
import { YesNo } from '../shared/yes-no.component';
import { CommonMethodsService } from '../../services/common-methods.service';
@Component({
  selector: 'app-receipt-management',
  templateUrl: './receipt-management.component.html',
  styleUrls: ['./receipt-management.component.css'],
})
export class ReceiptManagementComponent implements OnInit {
  cancelForm: FormGroup;
  rctShareForm: FormGroup;
  users: any;
  /**
   * @property {BranchDTO} defaultBranch - The default branch context derived from session, used if no specific branch is selected.
   */
  defaultBranch: BranchDTO;
  /** @property {BranchDTO | null} selectedBranch - The branch explicitly selected by the user, derived from session. Takes precedence over defaultBranch. */
  selectedBranch: BranchDTO;
  // --- PrimeNG Table Pagination Properties ---
  /** @property {number} first - Index of the first row displayed in the current page (used  by custom paginator). */

  /** @property {number} totalRecords - Total number of records matching the search criteria.*/
  totalRecords: number = 0;
  // --- Data Holding Properties ---
  /** @property {unPrintedReceiptsDTO | null} unPrintedReceiptData - Holds the complete API response for unprinted receipts. */

  unPrintedReceiptData: Pagination<unPrintedReceiptContentDTO> =
    {} as Pagination<unPrintedReceiptContentDTO>;
  /** @property {unPrintedReceiptContentDTO[]} unPrintedReceiptContent - Holds the actual list/array of receipt details extracted from the API response. This should be the source for filtering. */

  unPrintedReceiptContent: unPrintedReceiptContentDTO[] = []; // Stores just the content array
  /** @property {unPrintedReceiptContentDTO[]} filteredtabledata - Holds the data currently displayed in the table after filtering. Should be typed correctly. */
  // tabledata: unPrintedReceiptContentDTO[] = [];
  filteredtabledata: unPrintedReceiptContentDTO[] = [];
  unPrintedReceiptsdata: unPrintedReceiptContentDTO[] = [];
  printedReceiptsdata: unPrintedReceiptContentDTO[] = [];
  // --- Filtering Properties ---
  /** @property {string} paymentMethodFilter - Filter value for the 'Payment Method' column. */
  paymentMethodFilter: string = '';
  /** @property {string} receivedFromFilter - Filter value for the 'Received From' column. */
  receivedFromFilter: string = '';
  /** @property {string} receiptDateFilter - Filter value for the 'Receipt Date' column. */
  receiptDateFilter: string = '';
  /** @property {number | null} amountFilter - Filter value for the 'Amount' column. */
  amountFilter: number | null = null;
  /** @property {string} receiptNumberFilter - Filter value for the 'Receipt Number' column. */
  receiptNumberFilter: string = '';

  // --- UI State Properties ---
  /** @property {boolean} printingEnabled - Flag indicating if the 'Printing' view and table are active. */
  printingEnabled: boolean = false;
  /** @property {boolean} cancellationDeactivated - Flag indicating if the 'Cancellation' view and table are *inactive*. Naming could be clearer (e.g., use isCancellationActive). */
  cancellationDeactivated: boolean = true; // Default view is Cancellation
  /** @property {boolean} isPrinting - Flag used for styling the 'Printing' button as active/inactive. */
  isPrinting: boolean = false;
  /** @property {boolean} isCancellation - Flag used for styling the 'Cancellation' button as active/inactive. */
  isCancellation: boolean = true; // Default view is Cancellation
  printed: boolean = false;
  printStatus: YesNo;
  unprinted: boolean = false;
  /** @property {number | null} receiptNumber - Stores the specific receipt number selected for printing before navigation. */
  receiptNumber: number | null = null; // Initialize as null
  accountCode: number | null = null;
  agentCode: number | null = null;
  receiptData: unPrintedReceiptContentDTO[] = [];
  //cancellation section
  // receiptsToCancel: ReceiptToCancelDTO;
  receiptsToCancelPagination: Pagination<ReceiptsToCancelContentDTO> =
    {} as Pagination<ReceiptsToCancelContentDTO>; // This holds full pagination data
  receiptsToCancelList: ReceiptsToCancelContentDTO[] = [];
  unCancelledReceipts: ReceiptsToCancelContentDTO[] = [];
  selectedReceipt: any = null;
  glAccountPagination: Pagination<glContentDTO> =
    {} as Pagination<glContentDTO>; // This holds full pagination data
  filteredReceipts: ReceiptsToCancelContentDTO[] = [];
  glAccountContent: glContentDTO[] = []; // This will hold just the content array
  checkActiveTab: any;
  loggedInUser: any;

  client: ClientDTO;
  agent: AgentDTO;
  receipt_no: string;
  branchRctCode: string;
  whatsappSelected: boolean = true;
  shareMethod: string;
  selectedOrg: OrganizationDTO;
  /**
   * @property {OrganizationDTO} defaultOrg - The default organization.
   */
  defaultOrg: OrganizationDTO;
  emailPattern: string;
  //raiseBankCharge: string = 'no';
  constructor(
    private receiptManagementService: ReceiptManagementService,
    private globalMessagingService: GlobalMessagingService,
    private sessionStorage: SessionStorageService,
    public translate: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private intermediaryService: IntermediaryService,
    private clientService: ClientService,
    private receiptService: ReceiptService,
    private commonMethodsService: CommonMethodsService
  ) {}
  /**
   * @ngOnInit Lifecycle hook.
   * Initializes the component by determining the active branch from session storage
   * and fetching the initial list of unprinted receipts for that branch.
   */
  ngOnInit(): void {
    this.initializeForm();
    this.initializeRctSharingForm();
    // Retrieve branch from localStorage or receiptDataService
    this.handleInitialTabState(); // <-- NEW: Logic to set the tab
    let storedSelectedBranch = this.sessionStorage.getItem('selectedBranch');
    let storedDefaultBranch = this.sessionStorage.getItem('defaultBranch');

    this.selectedBranch = storedSelectedBranch
      ? JSON.parse(storedSelectedBranch)
      : null;
    this.defaultBranch = storedDefaultBranch
      ? JSON.parse(storedDefaultBranch)
      : null;
    let storedDefaultOrg = this.sessionStorage.getItem('selectedOrg');
    let storedSelectedOrg = this.sessionStorage.getItem('defaultOrg');
    this.selectedOrg = storedSelectedOrg ? JSON.parse(storedSelectedOrg) : null;
    this.defaultOrg = storedDefaultOrg ? JSON.parse(storedDefaultOrg) : null;
    // Ensure only one organization is active at a time
    if (this.selectedOrg) {
      this.defaultOrg = null;
    } else if (this.selectedOrg) {
      this.selectedOrg = null;
    }
    this.loggedInUser = this.authService.getCurrentUser();
    // Ensure only one branch is active at a time
    if (this.selectedBranch) {
      this.defaultBranch = null;
    } else if (this.defaultBranch) {
      this.selectedBranch = null;
    }
    this.fetchUnprintedReceipts(
      this.defaultBranch?.id || this.selectedBranch?.id
    );
    this.fetchReceiptsToCancel(
      this.defaultBranch?.id || this.selectedBranch?.id
    );
    this.fetchGlAccounts(this.defaultBranch?.id || this.selectedBranch?.id);
  }
  // NEW METHOD: Handles setting the initial tab based on session storage
  handleInitialTabState(): void {
    try {
      const activeTabFlag = this.sessionStorage.getItem('printTabStatus');
      if (activeTabFlag) {
        // We found the flag, so we came from the print preview screen.
        // The value should be "true" (a string), but we just need to check for existence.
        this.isPrintingClicked();
        // IMPORTANT: Clean up the flag so it doesn't persist.
        this.sessionStorage.removeItem('printTabStatus');
      } else {
        // Default behavior: show cancellation tab
        this.cancelClicked();
      }
    } catch (e) {
      // This catch block will handle any unexpected errors during session storage access.
      // Default to the cancellation tab in case of an error
      this.cancelClicked();
    }
  }

  initializeForm() {
    this.cancelForm = this.fb.group({
      accountCharged: ['', Validators.required],
      glAccount: ['', Validators.required],
      remarks: ['', Validators.required],
      cancellationDate: ['', Validators.required],
      raiseBankCharge: ['N', Validators.required], // 'no' is the default value
      bankCharges: [''],
      clientCharges: [''],
    });

    //Add conditional validation
    this.cancelForm.get('raiseBankCharge')?.valueChanges.subscribe((value) => {
      const accountChargedControl = this.cancelForm.get('accountCharged');
      const glAccountControl = this.cancelForm.get('glAccount');
      if (value === 'Y') {
        accountChargedControl?.setValidators([Validators.required]);
        glAccountControl?.setValidators([Validators.required]);
      } else {
        accountChargedControl?.clearValidators();
        glAccountControl?.clearValidators();
      }
      accountChargedControl?.updateValueAndValidity();
      glAccountControl?.updateValueAndValidity();
    });

    // Listen for changes to be truly reactive
  }
  initializeRctSharingForm() {
    this.emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    this.rctShareForm = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern), Validators.required]], // Not required initially
      phone: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]], // Initially required with 12 digits for a phone
      name: ['', Validators.required],
      shareMethod: ['whatsapp', Validators.required], // Default to 'whatsapp'
    });
    this.listenForShareMethodChanges();
  }
  listenForShareMethodChanges(): void {
    // Get a reference to the shareMethod control
    const shareMethodControl = this.rctShareForm.get('shareMethod');

    if (shareMethodControl) {
      // Subscribe to its valueChanges observable
      shareMethodControl.valueChanges.subscribe((method) => {
        const phoneControl = this.rctShareForm.get('phone');
        const emailControl = this.rctShareForm.get('email');
        if (method === 'email') {
          // If email is selected:
          this.whatsappSelected = false;
          emailControl.setValidators([
            Validators.required,
            Validators.pattern(this.emailPattern),
          ]);
          phoneControl.clearValidators(); // Remove validators from phone
        } else {
          // If whatsapp is selected:
          this.whatsappSelected = true;
          phoneControl.setValidators(Validators.required);
          emailControl.clearValidators(); // Remove validators from email
        }
        //  Update the validity state of the controls
        emailControl.updateValueAndValidity();
        phoneControl.updateValueAndValidity();
      });
    }
  }
  // Helper getter for easy access in template
  get raiseBankCharge() {
    return this.cancelForm.get('raiseBankCharge')?.value;
  }
  get currentPageReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }

  // --- UI Mode Switching ---

  /**
   * @method setViewMode
   * @description Sets the component's view mode to either 'printing' or 'cancellation'.
   * @param {'printing' | 'cancellation'} mode - The desired view mode.
   */
  /**
   * @method isPrintingClicked
   * @description Handles the click event for the 'Printing' button, setting the view mode.
   */
  isPrintingClicked(): void {
    this.printingEnabled = true;
    this.isPrinting = true;
    this.isCancellation = false;
    this.cancellationDeactivated = false;
  }
  /**
   * @method cancleClicked - Typo: Should be cancelClicked or cancellationClicked
   * @description Handles the click event for the 'Cancellation' button, setting the view mode.
   */
  cancelClicked(): void {
    this.printingEnabled = false;
    this.isCancellation = true;
    this.isPrinting = false;
    this.cancellationDeactivated = true;
  }
  // --- Data Fetching ---
  /**
   * @method fetchUnprintedReceipts
   * @description Fetches the list of unprinted receipts for the specified branch from the backend service.
   * Updates the component's data properties and applies initial filtering.
   * @param {number} branchCode - The ID of the branch for which to fetch receipts.
   */
  fetchUnprintedReceipts(branchCode: number) {
    this.receiptManagementService.getUnprintedReceipts(branchCode).subscribe({
      next: (
        response: GenericResponse<Pagination<unPrintedReceiptContentDTO>>
      ) => {
        this.unPrintedReceiptData = response.data;
        this.unPrintedReceiptContent = response.data.content; // Stores just the content array
        this.filteredtabledata = this.unPrintedReceiptContent;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  // --- Filtering Logic ---
  /**
   * @method applyFilter
   * @description Updates the appropriate filter property based on user input in a filter field.
   * Called typically on 'input' or 'change' events from filter input elements.
   * @param {Event} event - The input event object.
   * @param {'receiptNumber' | 'receiptDate' | 'receivedFrom' | 'amount' | 'paymentMethod'} field - The data field being filtered.
   */
  filter(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;
    switch (field) {
      case 'receiptNumber':
        this.receiptNumberFilter = filterValue;
        break;
      case 'receiptDate':
        this.receiptDateFilter = filterValue;
        break;
      case 'receivedFrom':
        this.receivedFromFilter = filterValue;
        break;
      case 'amount':
        this.amountFilter = filterValue ? Number(filterValue) : null;
        break;
      case 'paymentMethod':
        this.paymentMethodFilter = filterValue;
        break;
    }

    this.filterAllReceipts(); // Ensure this is called
  }
  filterAllReceipts(): void {
    if (!this.receiptsToCancelList) return;
    // Always start with the full dataset
    let filteredData = [...this.unCancelledReceipts];
    // Apply filters only if they have values
    if (this.receiptNumberFilter.trim()) {
      const searchTerm = this.receiptNumberFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.branchReceiptCode?.toLowerCase().includes(searchTerm)
      );
    }
    if (this.receiptDateFilter?.trim()) {
      const searchTerm = this.receiptDateFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.receiptDate?.toLowerCase().includes(searchTerm)
      );
    }
    if (this.receivedFromFilter?.trim()) {
      const searchTerm = this.receivedFromFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.receivedFrom?.toLowerCase().includes(searchTerm)
      );
    }
    if (this.amountFilter) {
      filteredData = filteredData.filter(
        (item) => Number(item.amount) === this.amountFilter
      );
    }
    if (this.paymentMethodFilter?.trim()) {
      const searchTerm = this.paymentMethodFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.paymentMode?.toLowerCase().includes(searchTerm)
      );
    }

    this.filteredReceipts = filteredData;
    this.totalRecords = this.filteredReceipts.length;
  }
  clearFilters() {
    let filteredData = [...this.unCancelledReceipts];
    this.receiptNumberFilter = '';
    this.receiptDateFilter = '';
    this.receivedFromFilter = '';
    this.amountFilter = null;
    this.paymentMethodFilter = '';
    this.filteredReceipts = filteredData;
    this.totalRecords = this.filteredReceipts.length;
  }
  applyFilter(event: Event, field: string): void {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement.value;

    switch (field) {
      case 'receiptNumber':
        this.receiptNumberFilter = filterValue;
        break;
      case 'receiptDate':
        this.receiptDateFilter = filterValue;
        break;
      case 'receivedFrom':
        this.receivedFromFilter = filterValue;
        break;
      case 'amount':
        this.amountFilter = filterValue ? Number(filterValue) : null;
        break;
      case 'paymentMethod':
        this.paymentMethodFilter = filterValue;
        break;
    }

    this.filterReceipts(); // Ensure this is called
  }

  /**
   * @method filterReceipts
   * @description Filters the main `unPrintedReceiptContent` array based on the current
   * values of the filter properties (`receiptNumberFilter`, `receiptDateFilter`, etc.)
   * and updates the `filteredtabledata` property used by the p-table.
   * Converts filters to lowercase for case-insensitive string matching.
   */
  filterReceipts(): void {
    // Always start with the full dataset
    let filteredData = [...this.unPrintedReceiptContent];
    // Apply filters only if they have values
    if (this.receiptNumberFilter?.trim()) {
      const searchTerm = this.receiptNumberFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.branchReceiptCode.toLowerCase().includes(searchTerm)
      );
    }
    if (this.receiptDateFilter?.trim()) {
      const searchTerm = this.receiptDateFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.receiptDate.toLowerCase().includes(searchTerm)
      );
    }
    if (this.receivedFromFilter?.trim()) {
      const searchTerm = this.receivedFromFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.receivedFrom.toLowerCase().includes(searchTerm)
      );
    }
    if (this.amountFilter) {
      filteredData = filteredData.filter(
        (item) => item.amount === this.amountFilter
      );
    }
    if (this.paymentMethodFilter?.trim()) {
      const searchTerm = this.paymentMethodFilter.toLowerCase();
      filteredData = filteredData.filter((item) =>
        item.paymentMode.toLowerCase().includes(searchTerm)
      );
    }
    this.filteredtabledata = filteredData;
    this.totalRecords = this.filteredtabledata.length;
  }

  // Simplified empty check version
  hasActiveFilters(): boolean {
    return !!(
      this.receiptNumberFilter?.trim() ||
      this.receiptDateFilter?.trim() ||
      this.receivedFromFilter?.trim() ||
      this.amountFilter ||
      this.paymentMethodFilter?.trim()
    );
  }
  clearFilter() {
    let filteredData = [...this.unPrintedReceiptContent];
    this.receiptNumberFilter = '';
    this.receiptDateFilter = '';
    this.receivedFromFilter = '';
    this.amountFilter = null;
    this.paymentMethodFilter = '';
    this.filteredtabledata = filteredData;
    this.totalRecords = this.filteredtabledata.length;
  }
  /**
   * @method printReceipt
   * @description Stores the selected receipt number in session storage and navigates
   * to the receipt print preview page.
   * @param {number} receiptNo - The unique identifier (`no` field) of the receipt to be printed.
   */
  printReceipt(index: number, value: number) {
    this.receiptNumber = value;
    this.sessionStorage.setItem(
      'receiptNumber',
      JSON.stringify(this.receiptNumber)
    );
    this.sessionStorage.setItem('reprinted', 'no');
    this.router.navigate(['/home/fms/receipt-print-preview']);
  }
  rePrintReceipt(index: number, value: number) {
    this.receiptNumber = value;
    this.sessionStorage.setItem(
      'receiptNumber',
      JSON.stringify(this.receiptNumber)
    );
    this.sessionStorage.setItem('reprinted', 'yes');
    this.router.navigate(['/home/fms/receipt-print-preview']);
  }

  //cancellation section
  fetchReceiptsToCancel(branchCode: number) {
    this.receiptManagementService.getReceiptsToCancel(branchCode).subscribe({
      next: (
        response: GenericResponse<Pagination<ReceiptsToCancelContentDTO>>
      ) => {
        this.receiptsToCancelPagination = response.data;

        this.receiptsToCancelList = response.data.content;
        //this.globalMessagingService.displaySuccessMessage('success','successfully retrieved reeipts to cancel');
        this.unCancelledReceipts = this.receiptsToCancelList.filter((list) => {
          return list.cancelled == 'N';
        });
        // this.filteredReceipts = [...this.receiptsToCancelList]; // Make a copy
        this.filteredReceipts = [...this.unCancelledReceipts]; // Make a copy
        this.totalRecords = this.filteredReceipts.length;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  // --- Modal Interactions (Using Bootstrap JS ) ---
  /**
   * @method openCancelModal
   * @description Opens the Bootstrap modal for receipt cancellation using direct Bootstrap JS API.
   * Consider using an Angular-friendly modal solution.
   */
  openCancelModal(receipt: any): void {
    this.selectedReceipt = receipt;
    this.resetForm(); // Reset form when opening modal
    const modalElement = new bootstrap.Modal(
      document.getElementById('staticBackdrop')
    );
    modalElement.show();
  }
  // Add form reset method
  resetForm(): void {
    this.cancelForm.reset({
      remarks: '',
      cancellationDate: '',
      raiseBankCharge: 'N',
      accountCharged: '',
      glAccount: '',
    });
  }
  validateFields() {
    if (this.cancelForm.invalid) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please fill all the required fields'
      );
      return;
    }
    this.cancelReceipt();
  }
  cancelReceipt() {
    if (!this.selectedReceipt) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No receipt selected for cancellation'
      );
      return;
    }
    const formValues = this.cancelForm.value;
    const body = {
      no: this.selectedReceipt.no,
      remarks: formValues.remarks,
      isChargeRaised: formValues.raiseBankCharge,
      cancellationDate: formValues.cancellationDate,
      bankAmount: formValues.bankCharges || null,
      clientAmount: formValues?.clientCharges || null,
      userCode: this.loggedInUser.code,
      branchCode: this.defaultBranch?.id || this.selectedBranch?.id,
      bankChargesGlAcc: formValues?.accountCharged || null,
      otherChargesGlAcc: formValues?.glAccount || null,
    };
    this.receiptManagementService.cancelReceipt(body).subscribe({
      next: (response) => {
        const backendResponse =
          response?.msg || response?.error || response?.status;
        this.globalMessagingService.displaySuccessMessage('', backendResponse);
        this.closeModal();
        this.fetchReceiptsToCancel(
          this.defaultBranch?.id || this.selectedBranch?.id
        );
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  fetchGlAccounts(branchCode: number) {
    this.receiptManagementService.getGlAccount(branchCode).subscribe({
      next: (response: GenericResponse<Pagination<glContentDTO>>) => {
        this.glAccountPagination = response.data;
        this.glAccountContent = response.data.content;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * @method closeModal - Deprecated if using Angular modals
   * @description Closes the Bootstrap modal for receipt cancellation using direct DOM manipulation.
   * This approach is generally discouraged in Angular.
   */
  closeModal(): void {
    const modalElement = document.getElementById('staticBackdrop');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }
  /**
   * @method openReceiptShareModal
   * @description Opens the Bootstrap modal for sharing a receipt using direct Bootstrap JS API.
   * Consider using an Angular-friendly modal solution.
   */
  openReceiptShareModal(
    index: number,
    receipt_no: string,
    branchRctCode: string,
    agent_code: number,
    account_code: number,
    printed: 'Y' | 'N'
  ): void {
    this.agentCode = agent_code;
    this.accountCode = account_code;
    this.receipt_no = receipt_no;
    this.branchRctCode = branchRctCode;
    this.printStatus = printed as YesNo;
    this.sessionStorage.setItem('agentCode', this.agentCode);
    this.sessionStorage.setItem('accountCode', this.accountCode);
    this.sessionStorage.setItem('receiptNo', this.receipt_no);
    this.sessionStorage.setItem('printed', this.printStatus);
    let code = null;
    if (agent_code !== null) {
      code = agent_code;

      this.getAgentById(code);
    } else {
      code = account_code;
      this.getAgentById(code);
    }

    // this.getClientByCode(code);
    const modal = new bootstrap.Modal(
      document.getElementById('shareReceiptModal')
    );
    if (modal) {
      modal.show();
    }
  }
  /**
   *
   * @description this method updates form control  with values retrived from agent/client object i.e name ,email,etc
   */
  patchFormControl(): void {
    this.rctShareForm.patchValue({
      name: this.agent.name,
      email: this.agent.emailAddress,
      phone: this.agent.phoneNumber,
    });
  }
  getAgentById(agent_Code: number): void {
    this.intermediaryService.getAgentById(agent_Code).subscribe({
      next: (response) => {
        this.agent = response;

        this.patchFormControl();
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * A streamlined helper function to build the share data payload.
   * It assumes the form has already been validated.
   */
  private prepareShareData(): {
    shareType: string;
    recipientEmail: string | null;
    recipientPhone: string | null;
  } {
    // Use getRawValue() once to get a clean snapshot of all form values.
    const formValues = this.rctShareForm.getRawValue();

    if (formValues.shareMethod === 'email') {
      return {
        shareType: formValues.shareMethod.toUpperCase(),
        recipientEmail: formValues.email,
        recipientPhone: null,
      };
    } else {
      // 'whatsapp'
      return {
        shareType: formValues.shareMethod.toUpperCase(),
        recipientPhone: formValues.phone,
        recipientEmail: null, // Ensure email is null for whatsapp
      };
    }
  }

  /**
   *
   * @description this method performs validation check of the form inputs before it posts
   * here,I first mark all form controls as touched so as to perform validation on the auto
   * populated values that may be invalid
   */
  postClientDetails() {
    //  Mark all fields as touched to show any validation errors in the UI

    this.rctShareForm.markAllAsTouched();
    //  Check the form's overall validity.
    if (this.rctShareForm.invalid) {
      this.globalMessagingService.displayErrorMessage(
        'Validation Error',
        'Please correct the errors before sending.'
      );
      return; // Stop if the form is invalid
    }
    //const shareData = this.rctShareForm.getRawValue();
    const shareData = this.prepareShareData();
    if (!shareData) {
      return; // Stop if data is invalid (e.g., no method selected)
    }

    const body = {
      shareType: shareData.shareType,
      clientName: this.agent.name,
      recipientEmail: shareData?.recipientEmail,
      recipientPhone: shareData?.recipientPhone,
      receiptNumber: String(this.receipt_no),
      branchReceiptCode: this.branchRctCode,
      orgCode: String(this.defaultOrg?.id || this.selectedOrg?.id),
    };
    this.receiptManagementService.shareReceipt(body).subscribe({
      next: (response) => {
        const modalEl = document.getElementById('shareReceiptModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
          }
        }
        if (this.printStatus === YesNo.No) {
          this.updatePrintStatus();
        }

        this.globalMessagingService.displaySuccessMessage(
          'success',
          response.msg
        );
      },

      error: (err) => {
        const modalEl = document.getElementById('shareReceiptModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
          }
        }
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  getClientByCode(client_Code: number): void {
    this.clientService.getClientById(client_Code).subscribe({
      next: (response) => {
        this.client = response;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  onClickPreview(): void {
    //  Mark all fields as touched to show any validation errors in the UI
    this.rctShareForm.markAllAsTouched();
    this.sessionStorage.setItem('receipting', 'N');
    //  Check the form's overall validity.
    if (this.rctShareForm.invalid) {
      this.globalMessagingService.displayErrorMessage(
        'Validation Error',
        'Please correct the errors before sending.'
      );
      return; // Stop if the form is invalid
    }
    const shareData = this.prepareShareData();
    if (!shareData) {
      return; // Stop if data is invalid (e.g., no method selected)
    }
    // Create a single, comprehensive object to store
    const previewData = {
      shareType: shareData.shareType,
      recipientEmail: shareData.recipientEmail,
      recipientPhone: shareData.recipientPhone,
      clientName: this.rctShareForm.get('name')?.value || 'N/A', // Get the client name from the form
    };

    // Store the single object as a JSON string
    this.sessionStorage.setItem(
      'sharePreviewData',
      JSON.stringify(previewData)
    );
    this.router.navigate(['/home/fms/preview-receipt']);
  }
  /**
   * @method updatePrintStatus
   * @description Sends a request to the ReceiptService to mark the current receipt as printed.
   * The payload is an array containing the receipt number.
   * On success, displays a success message and navigates back to the receipt management view.
   * On error, displays an error message.
   */
  updatePrintStatus() {
    // Construct the payload as an array of numbers
    const receiptNumber = Number(this.receipt_no);
    const payload: number[] = [receiptNumber];
    this.receiptService.updateReceiptStatus(payload).subscribe({
      next: (response) => {},
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
}
