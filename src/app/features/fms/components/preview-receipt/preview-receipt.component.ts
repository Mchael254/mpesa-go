
import { Component } from '@angular/core';

import { ReportService } from 'src/app/features/reports/services/report.service';
import { ReportsDto } from 'src/app/shared/data/common/reports-dto';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


import { ReceiptService } from '../../services/receipt.service';
import {OrganizationDTO} from '../../../../features/crm/data/organization-dto';
import { GlobalMessagingService} from '../../../../shared/services/messaging/global-messaging.service';

import {ReportsService} from '../../../../shared/services/reports/reports.service';

import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { ReceiptDataService } from '../../services/receipt-data.service';

@Component({
  selector: 'app-preview-receipt',
  templateUrl: './preview-receipt.component.html',
  styleUrls: ['./preview-receipt.component.css'],
})
export class PreviewReceiptComponent {
  agentCode: number | null;
  accountCode: number | null = null;
  receiptNo: number;
  code: number;
  name: string;
  email: string;
  phone: string;
  shareMethod: string;
  recipient: string;
  selectedOrg: OrganizationDTO;
  printStatus: 'Y' | 'N';
  receiptingScreen: 'Y' | 'N';
  /**
   * @property {OrganizationDTO} defaultOrg - The default organization.
   */
  defaultOrg: OrganizationDTO;
  /**
   * @property {string} filePath - The object URL generated for the receipt PDF Blob.
   * This URL is used as the source for the `ngx-doc-viewer`.
   */
  filePath: string = '';
  // A local flag to prevent revoking URL too early
   //  a property to hold the structured share data
  shareData: SharePreviewData | null = null;
  private isNavigating = false;
  constructor(
    private sessionStorage: SessionStorageService,
    private globalMessagingService: GlobalMessagingService,
    private reportService: ReportsService,
    private router: Router,
    private translate: TranslateService,
    private receiptService: ReceiptService,
    private receiptManagementService: ReceiptManagementService,
      private receiptDataService: ReceiptDataService
  ) {}
  ngOnInit() {
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
    this.receiptNo = Number(this.sessionStorage.getItem('receiptNo'));

    const agent_code = this.sessionStorage.getItem('agentCode');
    this.agentCode = Number(agent_code) || null;

    const account_code = this.sessionStorage.getItem('accountCode');
    this.accountCode = Number(account_code);
    if (this.agentCode) {
      this.code = this.agentCode;
      this.accountCode = null;
    } else if (this.accountCode) {
      this.code = this.accountCode;
      this.agentCode = null;
    }
    // this.recipient = this.sessionStorage.getItem('recipient');
// --- START: NEW WAY TO GET SHARE DATA ---
    const storedShareData = this.sessionStorage.getItem('sharePreviewData');
    if (storedShareData) {
      this.shareData = JSON.parse(storedShareData);
    }
    // --- END: NEW WAY TO GET SHARE DATA ---
    // this.shareMethod = this.sessionStorage.getItem('shareType');
    this.printStatus = this.sessionStorage.getItem('printed') as 'Y' | 'N';
    this.receiptingScreen = this.sessionStorage.getItem('receipting') as 'Y' | 'N';
    //console.log('from receipting screen:',this.receiptingScreen);
    this.getReceiptToPrint();
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
          value: String(this.receiptNo),
        },
        {
          name: 'UP_ORG_CODE', // Parameter name for Organization Code/ID
          value: String(this.defaultOrg?.id || this.selectedOrg?.id),
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
        const customMessage = this.translate.instant('fms.errorMessage');

        const backendError =
          err.error?.msg ||
          err.error?.error ||
          err.error?.status ||
          err.error?.message ||
          err.statusText;
        this.globalMessagingService.displayErrorMessage(
          customMessage,
          backendError
        );
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
     this.sessionStorage.removeItem('sharePreviewData');
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

  /**
   * @method navigateToReceiptCapture
   * @description Navigates the user back to the main receipt management view.
   * Typically used when the user clicks the 'Unprinted' button or cancels the operation.
   */
  navigateToReceiptManagement(): void {
    this.navigateBackToPrintTab();
  }
  postClientDetails() {
    const body = {
      shareType:this.shareData.shareType,
      recipientEmail: this.shareData.recipientEmail,
      recipientPhone: this.shareData.recipientPhone,
      receiptNumber: String(this.receiptNo),
      orgCode: String(this.defaultOrg?.id || this.selectedOrg?.id),
      
      clientName: this.shareData.clientName,
      
      

    };

    this.receiptManagementService.shareReceipt(body).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage(
          'success',
          response.msg
        );
        if (this.printStatus === 'N' || this.receiptingScreen==='Y') {
         
 this.updatePrintStatus();
        }
        if(this.receiptingScreen==='N'){
        this.navigateToReceiptManagement();
        }else if(this.receiptingScreen==='Y'){
          this.navigateToReceiptCapture();
        }
      },
      error: (err) => {
        const customMessage = this.translate.instant('fms.errorMessage');
        const backendError =
          err.error?.msg ||
          err.error?.error ||
          err.error?.status ||
          err.statusText;
        this.globalMessagingService.displayErrorMessage(
          customMessage,
          backendError
        );
      },
    });
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
    const payload: number[] = [this.receiptNo];
    this.receiptService.updateReceiptStatus(payload).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage(
          '',
          response?.msg || response?.error || response?.status
        );
         // On success, set the flag and navigate
        //this.navigateBackToPrintTab();




      },

      error: (err) => {
        const customMessage = this.translate.instant('fms.errorMessage');
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
        //this.navigateBackToPrintTab();
      },
    });
  }
  checkActiveScreen():void{
if(this.receiptingScreen==='N'){
        this.navigateToReceiptManagement();
        }else if(this.receiptingScreen==='Y'){
          this.navigateToReceiptCapture();
        }
  }
  navigateToReceiptCapture(){
     this.sessionStorage.removeItem('receiptNumber');
      
      this.sessionStorage.removeItem('shareType');
      this.sessionStorage.removeItem('recipient');
        this.sessionStorage.removeItem('receiptCode');
      this.sessionStorage.removeItem('branchReceiptNumber');
      this.sessionStorage.removeItem('receiptingPoint');
      this.sessionStorage.removeItem('globalBankAccount');
      this.sessionStorage.removeItem('globalBankType');
      

    this.receiptDataService.clearReceiptData();
    this.receiptDataService.clearFormState();
   
      
    this.router.navigate(['/home/fms/receipt-capture']);
  }
}
// Define a type for your share data for better type safety
interface SharePreviewData {
  shareType: string;
  recipientEmail: string | null;
  recipientPhone: string | null;
  clientName: string;
}