/**
 * @fileOverview This file contains the `ReceiptPreviewComponent`, which is responsible for displaying a preview of a generated receipt.
 * It fetches the receipt data, generates a report using the `ReportsService`, and provides a download link.
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { SingleDmsDocument } from 'src/app/shared/data/common/dmsDocument';
import { ReportsDto } from 'src/app/shared/data/common/reports-dto';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReportsService } from 'src/app/shared/services/reports/reports.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { ReceiptService } from '../../services/receipt.service';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';

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
export class PdSlipPreviewComponent implements OnInit {
  // Reference to the iframe

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
  loggedInUser: any;
  selectedOrg: OrganizationDTO;
  defaultOrg: OrganizationDTO;
  receiptNumberResponse: number;
  downloadCompleted: boolean = false;
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
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private receiptService: ReceiptService,
    public translate: TranslateService
  ) {}

  /**
   * Lifecycle hook called once the component is initialized.
   * Retrieves receipt number and organization ID from localStorage and calls `getReceipt` to generate the receipt preview.
   * @returns {void}
   */
  ngOnInit(): void {
    // let receiptResponse = this.sessionStorage.getItem('receiptResponse');
    // this.receiptResponse = Number(receiptResponse);

    let receiptNo = this.sessionStorage.getItem('receiptNo');
    this.receiptResponse = receiptNo ? Number(receiptNo) : null;

    let defaultOrg = this.sessionStorage.getItem('defaultOrg');
    let selectedOrg = this.sessionStorage.getItem('selectedOrg');

    this.defaultOrg = defaultOrg ? JSON.parse(defaultOrg) : null;
    this.selectedOrg = selectedOrg ? JSON.parse(selectedOrg) : null;
    // console.log('org id>',this.selectedOrg);
    // console.log('defaultOrg>>',this.defaultOrg);
    this.loggedInUser = this.authService.getCurrentUser();
    //let receiptSlipResponse = this.sessionStorage.getItem('receiptSlipResponse');
    //this.receiptNumberResponse=receiptSlipResponse ? Number(receiptSlipResponse) : null;
    this.getReceipt();
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
          name: 'UP_USER_CODE',
          value: String(this.loggedInUser.code),
        },
        {
          name: 'UP_ORG_CODE',
          value: String(this.defaultOrg.id || this.selectedOrg.id), // Use the orgId
        },
      ],
      reportFormat: 'PDF',
      rptCode: 25000,
      system: 'CRM',
    };
    //console.log('receiptno>', this.receiptResponse);
    this.reportService.generateReport(reportPayload).subscribe({
      next: (response) => {
        //log.info('Report Response:', response);

        // Create a Blob from the response
        const blob = new Blob([response], { type: 'application/pdf' });
        this.filePath = window.URL.createObjectURL(blob);
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          err.error.status || 'an error occured processing your request'
        );
      },
    });
  }

  download() {
    if (this.filePath) {
      // 1. Create a temporary <a> element
      const link = document.createElement('a');
      // 2. Set the file URL (could be local Blob URL or remote URL)
      link.href = this.filePath;
      // 3. Set the suggested filename for the download
      link.download = 'acknowledmentSlip';

      // 4. Simulate a click on the link to trigger the browser's download
      link.click();

      this.updatePrintStatus();
    } else {
      this.globalMessagingService.displayErrorMessage(
        'failed!',
        'Download failed: Invalid file URL'
      );
    }
  }

  /**
   * Triggers a download of the file at the given URL.
   * Creates a temporary `<a>` element, sets its `href` and `download` attributes, and simulates a click to start the download.
   * @param {string} fileUrl - The URL of the file to download.
   * @param {string} fileName - The name to use for the downloaded file.
   * @returns {void}
   */

  navigateToReceiptCapture(): void {
    this.receiptDataService.clearReceiptData();
    this.router.navigate(['/home/fms/receipt-capture']);
  }
  updatePrintStatus() {
    const receiptId = Number(this.receiptResponse);
    console.log('reciptid>', receiptId);
    // Construct the payload as an array of numbers
    const payload: number[] = [receiptId];
    this.receiptService.updateSlipStatus(payload).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage(
          'success:',
          response.message
        );
      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage(
          'failed',
          err.error.msg || 'failed to update slip status'
        );
      },
    });
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
