import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { ReportsDto } from 'src/app/shared/data/common/reports-dto';

import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';

import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptService } from '../../services/receipt.service';
import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { TranslateService } from '@ngx-translate/core';
import { EncryptionService } from 'src/app/shared/services/encryption/encryption.service';
import { CommonMethodsService } from '../../services/common-methods.service';
/**
 * @Component ReceiptPrintPreviewComponent
 * @description
 * This component is responsible for displaying a preview of a generated receipt PDF.
 * It fetches the receipt data based on information stored in session storage,
 * generates a PDF report using the ReportsService, displays it using ngx-doc-viewer,
 * and provides options to mark the receipt as 'Printed' (updating its status via ReceiptService)
 * or navigate back to the main receipt management screen.
 */
@Component({
  selector: 'app-receipt-print-preview',
  templateUrl: './receipt-print-preview.component.html',
  styleUrls: ['./receipt-print-preview.component.css'],
})
export class ReceiptPrintPreviewComponent {
  /**
   * @property {any} receiptNumber - The identifier of the receipt to be previewed.
   * Retrieved from session storage.
   * @remark Consider using a more specific type like `number` or `string` if possible.
   */
  receiptNumber: any;
  /**
   * @property {OrganizationDTO | null} selectedOrg - The currently selected organization details,
   * retrieved from session storage. Used if defaultOrg is not available.
   */
  selectedOrg: OrganizationDTO;
  /**
   * @property {OrganizationDTO | null} defaultOrg - The default organization details,
   * retrieved from session storage. Takes precedence over selectedOrg for report generation.
   */
  defaultOrg: OrganizationDTO;
  /**
   * @property {string} filePath - The object URL generated for the receipt PDF Blob.
   * This URL is used as the source for the `ngx-doc-viewer`.
   */
  filePath: string = '';

  /**
   * @property {any} documentData - intended to hold metadata about the document,
   * like the filename. Currently, only its `fileName` property might be implicitly used
   * by the template binding `[fileName]="documentData?.fileName ?? ''"`, though it's not explicitly set in this component.
   */
  documentData: any;
  isPrinting: boolean = false;

  // A local flag to prevent revoking URL too early
  private isNavigating = false;
  /**this flag checks if the receipt is set for printing or reprinting
   * if it is set for reprinting which its value is yes,then we hide the printed and unprinted buttons
   * and just show a back btn to navigate back to receipt management screen
   */
  reprintedReceipt: string;
  // SET THE FLAG: The user is initiating an action that will lead to navigation.
  private hasMadeChoice = false;
  /**
   * @constructor
   * @param {SessionStorageService} sessionStorage - Service to interact with browser session storage. Used to retrieve receipt number and organization details.
   * @param {GlobalMessagingService} globalMessagingService - Service to display global success or error messages to the user.
   * @param {ReportsService} reportService - Service to generate reports, specifically the receipt PDF in this case.
   * @param {Router} router - Angular Router service for navigating between views.
   * @param {ReceiptService} receiptService - Service to interact with the receipt backend, primarily for updating the print status.
   */
  constructor(
    private sessionStorage: SessionStorageService,
    private globalMessagingService: GlobalMessagingService,
    private reportService: ReportsService,
    private router: Router,
    private receiptService: ReceiptService,
    private receiptDataService: ReceiptDataService,
    private translate: TranslateService,
    private encryptionService: EncryptionService,
     private commonMethodsService :CommonMethodsService 
  ) {}

  /**
   * This is a browser event that triggers when the user tries to close the tab or refresh.
   * It provides a final warning, complementing the CanDeactivate guard.
   * @param event The BeforeUnloadEvent object.
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (!this.hasMadeChoice) {
      // This will trigger the browser's native "Are you sure you want to leave?" prompt.
      $event.returnValue = true;
    }
  }

  /**
   * This method is REQUIRED by the CanComponentDeactivate interface.
   * Our guard will call this method to decide whether to allow navigation away from this component.
   */
  canDeactivate(): boolean {
    // If the user has not clicked "Printed" or "Unprinted", block navigation.
    if (!this.hasMadeChoice) {
      alert(
        'You must select "Printed" or "Unprinted" before leaving this page.'
      );
      return false; // Block navigation
    }
    return true; // Allow navigation
  }

  /**
   * @method ngOnInit
   * @description Lifecycle hook called after component initialization.
   * Retrieves necessary data (receipt number, organization details) from session storage
   * and initiates the process to fetch and display the receipt PDF by calling `getReceiptToPrint()`.
   */
  ngOnInit() {
    const receiptNumber = this.sessionStorage.getItem('receiptNumber');

    this.receiptNumber = JSON.parse(receiptNumber);

    const status = this.sessionStorage.getItem('reprinted');

    this.reprintedReceipt = status; // This will be true or false

    let defaultOrg = this.sessionStorage.getItem('defaultOrg');
    let selectedOrg = this.sessionStorage.getItem('selectedOrg');
    this.defaultOrg = defaultOrg ? JSON.parse(defaultOrg) : null;
    this.selectedOrg = selectedOrg ? JSON.parse(selectedOrg) : null;
    this.getReceiptToPrint();
    this.checkReprintedRct();
  }
  /**
   * @method getReceiptToPrint
   * @description Constructs the payload and calls the ReportsService to generate the receipt PDF.
   * On success, it creates a Blob URL from the response and assigns it to `filePath` for display.
   * On error, it displays an error message using the GlobalMessagingService.
   */
  getReceiptToPrint() {
    const reportPayload: ReportsDto = {
      encodeFormat: 'RAW', // Requesting raw byte data for the PDF
      params: [
        {
          name: 'UP_RCT_NO', // Parameter name for Receipt Number
          value: String(this.receiptNumber),
        },
        {
          name: 'UP_ORG_CODE', // Parameter name for Organization Code/ID
          value: String(this.defaultOrg.id || this.selectedOrg.id),
        },
      ],
      reportFormat: 'PDF',
      rptCode: 300,
      system: 'CRM',
    };
    this.reportService.generateReport(reportPayload).subscribe({
      next: (response) => {
        // Create a Blob from the response
        const blob = new Blob([response], { type: 'application/pdf' });
        // Create an object URL that the browser can use to display the Blob
        // Revoke previous URL if it exists to prevent memory leaks
        this.filePath = window.URL.createObjectURL(blob);
        //you can call the download() automatically here
        //this.downlaod(this.filePath,'receiptpdf');
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
        // On error, also set the flag and navigate back
        this.handleNavigationError();
      },
    });
  }
  // Consolidated navigation logic
  private navigateBackToPrintTab() {
    this.isNavigating = true;
    this.sessionStorage.setItem('printTabStatus', JSON.stringify(true));
    this.sessionStorage.removeItem('receiptNumber');
    this.sessionStorage.removeItem('reprinted');
    this.sessionStorage.removeItem('shareType');
    this.sessionStorage.removeItem('recipient');
    this.sessionStorage.removeItem('printStatus');
    this.router.navigate(['/home/fms/receipt-management']);
  }
  // Handles API error navigation
  private handleNavigationError(customError?: string) {
    const customMessage = this.translate.instant('fms.errorMessage');
    if (customError) {
      this.globalMessagingService.displayErrorMessage(
        customMessage,
        customError
      );
    }
    this.navigateBackToPrintTab();
  }
  /**this method is initialized to at ngOnInit,if we are reprinting a receipt,then we allow users
   * to navigate back using browser' navigation btns or the compoenent's button
   */
  checkReprintedRct(): void {
    if (this.reprintedReceipt == 'yes') {
      this.hasMadeChoice = true;
    }
  }
  /**
   * @method navigateToReceiptCapture
   * @description Navigates the user back to the main receipt management view.
   * Typically used when the user clicks the 'Unprinted' button or cancels the operation.
   */

  navigateToReceiptManagment(): void {
    this.hasMadeChoice = true;
    this.navigateBackToPrintTab();
  }
  /**
   * @method updatePrintStatus
   * @description Sends a request to the ReceiptService to mark the current receipt as printed.
   * The payload is an array containing the receipt number.
   * On success, displays a success message and navigates back to the receipt management view.
   * On error, displays an error message.
   */
  updatePrintStatus() {
    this.hasMadeChoice = true;
    // Construct the payload as an array of numbers
    const payload: number[] = [this.receiptNumber];
    this.receiptService.updateReceiptStatus(payload).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage(
          '',
          response?.msg || response?.error || response?.status
        );
        // On success, set the flag and navigate
        this.navigateBackToPrintTab();
      },

      error: (err) => {
        const customMessage = this.translate.instant('fms.printUpdateError');
        const backendError =
          err.error?.msg ||
          err.error?.error ||
          err.error?.status ||
          err.statusText;
        this.globalMessagingService.displayErrorMessage(
          customMessage,
          backendError
        );
        // Even on error, navigate back to the print tab as per the user story
        this.navigateBackToPrintTab();
      },
    });
  }
  /**When you use createObjectURL, the browser holds the PDF file data in memory. 
   * This memory is not automatically released until the entire page/tab is closed. 
   * If a user prints many receipts without closing the tab, this could slowly consume memory (a memory leak).
The Solution: The best practice is to manually release the memory using window.URL.revokeObjectURL(this.filePath) 
when you are finished with the file. 
The perfect place to do this is in the ngOnDestroy lifecycle hook, which runs just before the component is removed from the screen. */
  // Clean up the blob URL to prevent memory leaks
  /**this.isNavigating flag was to handle a potential memory leak related to window.URL.createObjectURL(blob). */
  ngOnDestroy() {
    if (this.filePath && !this.isNavigating) {
      window.URL.revokeObjectURL(this.filePath);
    }
  }
}
