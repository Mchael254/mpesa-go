import { Component } from '@angular/core';
import {
  unPrintedReceiptContentDTO,
  unPrintedReceiptsDTO,
} from '../../data/receipt-management-dto';
import * as bootstrap from 'bootstrap';

import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';

import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';

import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { Router } from '@angular/router';
import { BranchDTO } from '../../data/receipting-dto';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-receipt-management',
  templateUrl: './receipt-management.component.html',
  styleUrls: ['./receipt-management.component.css'],
})
export class ReceiptManagementComponent {
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

  unPrintedReceiptData: unPrintedReceiptsDTO;
  /** @property {unPrintedReceiptContentDTO[]} unPrintedReceiptContent - Holds the actual list/array of receipt details extracted from the API response. This should be the source for filtering. */

  unPrintedReceiptContent: unPrintedReceiptContentDTO[] = []; // Stores just the content array
  /** @property {unPrintedReceiptContentDTO[]} filteredtabledata - Holds the data currently displayed in the table after filtering. Should be typed correctly. */
  tabledata: unPrintedReceiptContentDTO[] = [];
  filteredtabledata: unPrintedReceiptContentDTO[] = [];
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

  /** @property {number | null} receiptNumber - Stores the specific receipt number selected for printing before navigation. */
  receiptNumber: number | null = null; // Initialize as null
  receiptData: unPrintedReceiptContentDTO[] = [];

  constructor(
    private receiptManagementService: ReceiptManagementService,
    private globalMessagingService: GlobalMessagingService,
    private sessionStorage: SessionStorageService,
    private translate: TranslateService,
    private router: Router
  ) {}
  /**
   * @ngOnInit Lifecycle hook.
   * Initializes the component by determining the active branch from session storage
   * and fetching the initial list of unprinted receipts for that branch.
   */
  ngOnInit(): void {
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
    this.fetchUnprintedReceipts(
      this.defaultBranch?.id || this.selectedBranch?.id
    );
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
      next: (response) => {
        this.unPrintedReceiptData = response;
        this.unPrintedReceiptContent = response.data.content; // Stores just the content array
        this.filteredtabledata = this.unPrintedReceiptContent;
      },

      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.msg || 'failed to load data'
        );
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
  //   filterReceipts(): void {
  //     if(
  //       !this.receiptNumberFilter?.trim() && !this.receiptDateFilter?.trim() && !this.receivedFromFilter?.trim() && !this.amountFilter && !this.paymentMethodFilter?.trim()
  //     ){
  //       this.filteredtabledata = [...this.unPrintedReceiptContent]; // Reset to original receipts
  // return
  //     }
  //     this.filteredtabledata = this.filteredtabledata.filter((item) => {
  //       return (
  //         (!this.receiptNumberFilter ||
  //           item.branchReceiptCode.includes(this.receiptNumberFilter)) &&
  //         (!this.receiptDateFilter ||
  //           item.receiptDate.includes(this.receiptDateFilter)) &&
  //         (!this.receivedFromFilter ||
  //           item.receivedFrom.includes(this.receivedFromFilter)) &&
  //         (!this.amountFilter  || item.amount === this.amountFilter) &&
  //         (!this.paymentMethodFilter ||
  //           item.paymentMode.includes(this.paymentMethodFilter))
  //       );
  //     })
  //     // After filtering, you might need to reset pagination if desired
  //     // this.first = 0;
  //     this.totalRecords = this.filteredtabledata.length; // Update total records for pagination display if using custom template
  //   }
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

    this.router.navigate(['/home/fms/receipt-print-preview']);
  }
  //cancellation section
  cancelReceipt() {
    const body = {
      no: 123456,
      remarks: 'Duplicate entry',
      isChargeRaised: 'Y',
      cancellationDate: '2025-04-25T08:22:30.836Z',
      bankAmount: 100,
      clientAmount: 500,
      userCode: 1094,
      branchCode: 342,
      bankChargesGlAcc: 101899,
      otherChargesGlAcc: 101899,
    };
    this.receiptManagementService.cancelReceipt(body).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          'receipt successfully cancelled'
        );
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.msg || 'failed to cancel the receipt'
        );
      },
    });
  }
  // --- Modal Interactions (Using Bootstrap JS ) ---
  /**
   * @method openCancelModal
   * @description Opens the Bootstrap modal for receipt cancellation using direct Bootstrap JS API.
   * Consider using an Angular-friendly modal solution.
   */
  openCancelModal(): void {
    const modalElement = new bootstrap.Modal(
      document.getElementById('staticBackdrop')
    );
    modalElement.show();
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
  openReceiptShareModal(): void {
    const modal = new bootstrap.Modal(
      document.getElementById('shareReceiptModal')
    );
    if (modal) {
      modal.show();
    }
  }
}
