import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReceiptAuthorizationService } from '../../services/receipt-authorization.service';
import { NormalReceipt, BatchReceipt } from '../../data/receipt-authorization-dto';
import { DatePipe } from '@angular/common';
import {  filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-receipt-authorization',
  templateUrl: './receipt-authorization.component.html',
  styleUrls: ['./receipt-authorization.component.css'],
  providers: [DatePipe]
})
export class ReceiptAuthorizationComponent implements OnInit {

  normalReceipts: NormalReceipt[] = [];
  batchReceipts: BatchReceipt[] = [];

  normalReceiptForm: FormGroup;
  batchReceiptForm: FormGroup;

  selectedNormalReceipt: NormalReceipt | null = null;
  selectedBatchReceipt: BatchReceipt | null = null;

  showRejectionRemarks: boolean = false;
  error: string | null = null;
  minDate: string;
  searchValue: string = "";
  activeTab: string = 'normal'; // Default active tab
  constructor(private fb: FormBuilder, private receiptAuthorizationService: ReceiptAuthorizationService, private datePipe: DatePipe) {
   // Initialize form with today's date
   const today = new Date();
   const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd') || '';
    this.normalReceiptForm = this.fb.group({
      authorizationDate: [formattedToday, Validators.required],
      bankAccount: [''],
      rejectionRemarks: ['']
    });
    
    // Set minDate to today's date to restrict past dates
    this.minDate = formattedToday;
    this.batchReceiptForm = this.fb.group({
      smsAlerts: [false],
    });
  }

  ngOnInit(): void {
    this.loadReceipts();
  }
  get filteredNormalReceipts() {
    return this.normalReceipts.filter(receipt =>
      receipt.receiptNo.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      this.datePipe.transform(receipt.captureDate, 'dd/MM/yyyy')?.includes(this.searchValue) ||
      receipt.amount.toString().includes(this.searchValue) ||
      receipt.policyNo.toString().includes(this.searchValue)
    );
  }
  
  get filteredBatchReceipts() {
    return this.batchReceipts.filter(receipt =>
      receipt.statementNo.toString().toLowerCase().includes(this.searchValue.toLowerCase()) ||
      receipt.totalAmount.toString().includes(this.searchValue)
    );
  }
  getCurrentDateString(): string {
    const today = new Date();
    return this.datePipe.transform(today, 'yyyy-MM-dd') || ''; // Use DatePipe for consistent formatting
  }
  getCurrentDate(): Date {
    return new Date(); 
  }
  onDateChange(event: any): void {
    const selectedDate = new Date(event.target.value);
    if (selectedDate >= this.getCurrentDate()) { // Allow only future dates
      this.normalReceiptForm.patchValue({ authorizationDate: this.datePipe.transform(selectedDate, 'yyyy-MM-dd') }); // Update with string format
    } else {
      // Display an error message or handle invalid selection
      alert('Please select a future date.'); 
    }
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
  // Toggle the options menu to show on both hover and click
toggleOptionsMenu(event: Event, menu: any): void {
  menu.show(event);  // Show the popup menu on click or hover
}

getActions(receipt: NormalReceipt): MenuItem[] {
  if (receipt.status === 'Pending') {
    return [
      {
        label: 'Authorize',
        icon: 'pi pi-check',
        command: () => this.authorizeNormalReceipt(receipt),
      },
      {
        label: 'Reject',
        icon: 'pi pi-times',
        command: () => this.rejectNormalReceipt(receipt),
      },
    ];
  }
  return [];
}

  authorizeReceipt(receipt: any, receiptType: string): void {
  if (receiptType === 'normal') {
    this.authorizeNormalReceipt(receipt);
  } else if (receiptType === 'batch') {
    this.authorizeBatchReceipt(receipt);
  }
}

rejectReceipt(receipt: any, receiptType: string): void {
  if (receiptType === 'normal') {
    this.rejectNormalReceipt(receipt);
  } else if (receiptType === 'batch') {
    this.rejectBatchReceipt(receipt);
  }
}


  /**
   * Toggles the options menu for the ellipsis icon.
   */
  

  /**
   * Loads normal and batch receipts from the service.
   */
  loadReceipts(): void {
    this.receiptAuthorizationService.getNormalReceipts().subscribe(
      (receipts) => {
        this.normalReceipts = receipts;
      },
      (error) => {
        this.handleError(error);
      }
    );

    this.receiptAuthorizationService.getBatchReceipts().subscribe(
      (receipts) => {
        this.batchReceipts = receipts;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  /**
   * Handles errors from the service.
   * @param error The error object.
   */
  handleError(error: any): void {
    this.error = error.message || 'An error occurred.';
  }

  /**
   * Selects a normal receipt for authorization.
   * @param receipt The normal receipt object to select.
   */
  selectNormalReceipt(receipt: NormalReceipt): void {
    this.selectedNormalReceipt = receipt;
  }

  /**
   * Authorizes a selected normal receipt.
   * Updates the receipt status to "Authorized" and displays a confirmation message.
   * If a bank account is required, opens a modal to select a bank account.
   * @param receipt The normal receipt object to authorize.
   */
  authorizeNormalReceipt(receipt: NormalReceipt): void {
    // Skip validation for selectedNormalReceipt and process the provided receipt directly
    this.receiptAuthorizationService.authorizeNormalReceipt(receipt).subscribe(
      (response) => {
        this.error = null;
        receipt.status = 'Authorized';  // Update the status of the individual receipt
        alert('Receipt authorized successfully!');
        this.loadReceipts();  // Reload receipts to update the list
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  
  authorizeBatchReceipt(receipt: BatchReceipt): void {
    // Skip validation for selectedBatchReceipt and process the provided receipt directly
    this.receiptAuthorizationService.authorizeBatchReceipt(receipt, this.batchReceiptForm.get('smsAlerts')?.value).subscribe(
      (response) => {
        this.error = null;
        receipt.status = 'Authorized';  // Update the status of the individual receipt
        alert('Batch authorized successfully!');
        this.loadReceipts();  // Reload receipts to update the list
      },
      (error) => {
        this.handleError(error);
      }
    );
  }


  /**
   * Initiates the rejection process for a selected normal receipt.
   * Displays an input box for entering rejection remarks.
   * @param receipt The normal receipt object to reject.
   */
  rejectNormalReceipt(receipt: NormalReceipt): void {
    if (!receipt) {
      this.error = 'Please select a receipt to reject.';
      return;
    }
  
    // Display rejection remarks input if necessary
    this.showRejectionRemarks = true;
    this.normalReceiptForm.patchValue({
      rejectionRemarks: ''
    });
  
    // Confirm rejection with remarks (if required)
    this.receiptAuthorizationService.rejectNormalReceipt(receipt, this.normalReceiptForm.get('rejectionRemarks')?.value).subscribe(
      (response) => {
        this.error = null;
        receipt.status = 'Rejected';
        alert('Receipt rejected successfully!');
        this.loadReceipts();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  
  rejectBatchReceipt(receipt: BatchReceipt): void {
    if (!receipt) {
      this.error = 'Please select a batch to reject.';
      return;
    }
  
    this.receiptAuthorizationService.rejectBatchReceipt(receipt, this.batchReceiptForm.get('smsAlerts')?.value).subscribe(
      (response) => {
        this.error = null;
        receipt.status = 'Rejected';
        alert('Batch rejected successfully!');
        this.loadReceipts();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }
  
 

  /**
   * Confirms the rejection of a selected normal receipt.
   * Updates the receipt status to "Rejected" and saves rejection remarks.
   */
  confirmRejectNormalReceipt(): void {
    if (!this.normalReceiptForm.valid) {
      this.error = 'Please enter rejection remarks.';
      return;
    }

    this.receiptAuthorizationService.rejectNormalReceipt(this.selectedNormalReceipt, this.normalReceiptForm.get('rejectionRemarks')?.value).subscribe(
      (response) => {
        this.error = null;
        this.selectedNormalReceipt.status = 'Rejected';
        alert('Receipt rejected successfully!');
        this.showRejectionRemarks = false;
        this.loadReceipts();
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  /**
   * Selects a batch receipt for authorization.
   * @param receipt The batch receipt object to select.
   */
  selectBatchReceipt(receipt: BatchReceipt): void {
    this.selectedBatchReceipt = receipt;
  }

  /**
   * Authorizes a selected batch receipt.
   * Updates the batch status to "Authorized" and displays a confirmation message.
   * Optionally sends SMS alerts if enabled.
   * @param receipt The batch receipt object to authorize.
   */
 
  /**
   * Rejects a selected batch receipt.
   * Updates the batch status to "Rejected" and displays a confirmation message.
   * Optionally sends SMS alerts if enabled.
   * @param receipt The batch receipt object to reject.
   */
 

  /**
   * Selects all normal receipts in the table.
   */
  selectAllNormalReceipts(): void {
    this.normalReceipts.forEach(receipt => {
      receipt.selected = true;
    });
  }

  /**
   * Selects all batch receipts in the table.
   */
  selectAllBatchReceipts(): void {
    this.batchReceipts.forEach(receipt => {
      receipt.selected = true;
    });
  }
  
  
  
  
  /**
   * Authorizes all selected normal receipts.
   */
 

  /**
   * Rejects all selected normal receipts.
   */
  rejectAllNormalReceipts(): void {
    const selectedReceipts = this.normalReceipts.filter(receipt => receipt.selected);
    if (selectedReceipts.length === 0) {
      this.error = 'Please select at least one receipt to reject.';
      return;
    }
  
    selectedReceipts.forEach(receipt => this.rejectNormalReceipt(receipt));
  }
  
  rejectAllBatchReceipts(): void {
    const selectedReceipts = this.batchReceipts.filter(receipt => receipt.selected);
    if (selectedReceipts.length === 0) {
      this.error = 'Please select at least one batch receipt to reject.';
      return;
    }
  
    selectedReceipts.forEach(receipt => this.rejectBatchReceipt(receipt));
  }
  
  rejectAllSelectedReceipts(): void {
    if (this.activeTab === 'normal') {
      this.rejectAllNormalReceipts();
    } else if (this.activeTab === 'batch') {
      this.rejectAllBatchReceipts();
    }
  }
  

  /**
   * Authorizes all selected batch receipts.
   */
  authorizeAllNormalReceipts(): void {
    const selectedReceipts = this.normalReceipts.filter(receipt => receipt.selected);
    if (selectedReceipts.length === 0) {
      this.error = 'Please select at least one receipt to authorize.';
      return;
    }
  
    selectedReceipts.forEach(receipt => this.authorizeNormalReceipt(receipt));
  }
  
  authorizeAllBatchReceipts(): void {
    const selectedReceipts = this.batchReceipts.filter(receipt => receipt.selected);
    if (selectedReceipts.length === 0) {
      this.error = 'Please select at least one batch receipt to authorize.';
      return;
    }
  
    selectedReceipts.forEach(receipt => this.authorizeBatchReceipt(receipt));
  }
  

  /**
   * Rejects all selected batch receipts.
   */

  

  /**
   * Sorts normal receipts by the given column.
   * @param column The column to sort by.
   */
  sortNormalReceipts(column: string): void {
    this.normalReceipts.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1;
      } else if (a[column] > b[column]) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Sorts batch receipts by the given column.
   * @param column The column to sort by.
   */
  sortBatchReceipts(column: string): void {
    this.batchReceipts.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1;
      } else if (a[column] > b[column]) {
        return 1;
      } else {
        return 0;
      }
    });

  }

  /**
   * Searches for normal receipts based on the search value.
   */
  searchNormalReceipts(): void {
    // No need to update totalPages and pages as p-table handles pagination internally
  }

  /**
   * Searches for batch receipts based on the search value.
   */
  searchBatchReceipts(): void {
    // No need to update totalPages and pages as p-table handles pagination internally
  }
}


  