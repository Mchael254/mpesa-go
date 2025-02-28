/**
 * @fileOverview This file contains the `ReceiptPreviewComponent`, which is responsible for displaying a preview of a generated receipt.
 * It fetches the receipt data, generates a report using the `ReportsService`, and provides a download link.
 */

import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SingleDmsDocument } from 'src/app/shared/data/common/dmsDocument';
import { ReportsDto } from 'src/app/shared/data/common/reports-dto';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReportsService } from 'src/app/shared/services/reports/reports.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';

const log = new Logger('ReceiptPreviewComponent');

/**
 * @Component({
 *   selector: 'app-receipt-preview',
 *   templateUrl: './receipt-preview.component.html',
 *   styleUrls: ['./receipt-preview.component.css']
 * })
 *
 * The `ReceiptPreviewComponent` fetches receipt data, generates a PDF report using the `ReportsService`,
 * and displays a link allowing the user to download the generated receipt.
 */
@Component({
  selector: 'app-receipt-preview',
  templateUrl: './pd-slip-preview.component.html',
  styleUrls: ['./pd-slip-preview.component.css'],
})
export class PdSlipPreviewComponent implements OnInit,AfterViewInit {
  // Reference to the iframe

  @ViewChild('docViewerIframe', { static: false }) docViewerIframe!: ElementRef;
  filePath: string = '';

 
  //@ViewChild('docViewer', { static: false }) docViewer!: ElementRef;
  //@ViewChild('receiptIframe') receiptIframe!: ElementRef;
 // @ViewChild('docViewer') docViewer: ElementRef; // Reference to ngx-doc-viewer
  /** @property {any} receiptResponse - The receipt response data (likely a receipt number). */
  receiptResponse: any;

  /** @property {string | null} filePath - The path to the generated receipt file (PDF), or null if not yet generated.*/
  // filePath: string | null = null;

  /** @property {number} orgId - The ID of the organization for which the receipt is generated. */
  orgId: number;

  /** @property {any} documentData - Currently unused, but could contain more complex data associated with the receipt document. */
  documentData: any;

  /**
   * Constructs a new `ReceiptPreviewComponent`.
   * @param {ReportsService} reportService - The service used to generate reports (e.g., the receipt PDF).
   * @param {GlobalMessagingService} globalMessagingService - The service used to display messages to the user.
   * @param {Router} router - The Angular Router service, used for navigation.
   * @param {ReceiptDataService} receiptDataService - The service used to manage receipt data across the application.
   */
  constructor(
    private reportService: ReportsService,
    private globalMessagingService: GlobalMessagingService,
    private router: Router,
    private receiptDataService: ReceiptDataService,
    private sessionStorage:SessionStorageService
  ) {}

  /**
   * Lifecycle hook called once the component is initialized.
   * Retrieves receipt number and organization ID from localStorage and calls `getReceipt` to generate the receipt preview.
   * @returns {void}
   */
  ngOnInit(): void {
    let receiptResponse = this.sessionStorage.getItem('receiptResponse');
    this.receiptResponse = Number(receiptResponse);
    //console.log('receipt', this.receiptResponse);
    let receiptNo = this.sessionStorage.getItem('receiptNo');
    this.receiptResponse = Number(receiptNo);
    //console.log('receiptNo>>', this.receiptResponse);
    let globalOrgId = this.sessionStorage.getItem('OrgId');
    this.orgId = Number(globalOrgId);
    this.getReceipt();
  }
  // Add event listeners after the view is fully initialized
  // ngAfterViewInit() {
  //   setTimeout(() => this.addEventListeners(), 1000); // Delay to ensure DOM is ready
  // }
 


   
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.detectPrintAndDownload();
    }, 2000); // Delay to allow iframe to load
  }

  detectPrintAndDownload() {
    const iframe = this.docViewerIframe?.nativeElement?.querySelector('iframe');
    if (!iframe) {
      console.warn('No iframe found inside ngx-doc-viewer');
      return;
    }

    const observer = new MutationObserver(() => {
      const printButton = iframe.contentDocument?.querySelector('button[title="Print"]');
      const downloadButton = iframe.contentDocument?.querySelector('button[title="Download"]');

      if (printButton && downloadButton) {
        printButton.addEventListener('click', () => {
          console.log('Printed');
          this.updateRecord('printed');
        });

        downloadButton.addEventListener('click', () => {
          console.log('Downloaded');
          this.updateRecord('downloaded');
        });

        observer.disconnect(); // Stop observing once buttons are found
      }
    });

    observer.observe(iframe, { childList: true, subtree: true });
  }

  updateRecord(action: string) {
    console.log('Receipt ${action} recorded');
    // Call API here if needed
  }
  /**
   * Generates the receipt report by calling the `ReportsService`.
   * Builds the `ReportDto` payload with the receipt number and organization ID and subscribes to the result.
   * On success, it creates a Blob from the response and sets the `filePath` to the Blob's URL.
   * On error, it displays an error message using the `GlobalMessagingService`.
   * @returns {void}
   */
  getReceipt(): void {
    const reportPayload: ReportsDto = {
      encodeFormat: 'RAW',
      params: [
        {
          name: 'UP_RCT_NO',
          value: String(this.receiptResponse), // Use the receiptNumber
        },
        {
          name: 'UP_ORG_CODE',
          value: String(this.orgId), // Use the orgId
        },
      ],
      reportFormat: 'PDF',
      rptCode: 300,
      system: 'CRM',
    };

    this.reportService.generateReport(reportPayload).subscribe({
      next: (response) => {
        log.info('Report Response:', response);

        // Create a Blob from the response
        const blob = new Blob([response], { type: 'application/pdf' });
        this.filePath = window.URL.createObjectURL(blob);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.status
        );
      },
    });
  }
  downloadReceipt(){
    this.download(this.filePath,'receipt.pdf');
    this.router.navigate(['/home/fms/receipt-capture']);
  }

  /**
   * Triggers a download of the file at the given URL.
   * Creates a temporary `<a>` element, sets its `href` and `download` attributes, and simulates a click to start the download.
   * @param {string} fileUrl - The URL of the file to download.
   * @param {string} fileName - The name to use for the downloaded file.
   * @returns {void}
   */
  download(fileUrl: string, fileName: string): void {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.click();
    }
  }
  
 
  
  /**
   * Navigates back to the first screen (`/home/fms/screen1`) and clears the receipt data using the `ReceiptDataService`.
   * @returns {void}
   */
  onBack() {
    this.receiptDataService.clearReceiptData(); // Clear but keep currency
    this.router.navigate(['/home/fms/receipt-capture']); // Navigate to the next screen
  }
}