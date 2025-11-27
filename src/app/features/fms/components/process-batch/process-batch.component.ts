import { CommonMethodsService } from './../../services/common-methods.service';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import fmsStepsData from '../../data/fms-step.json';
import { BankingProcessService } from '../../services/banking-process.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { BatchesDTO } from '../../data/banking-process-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { ReceiptUploadRequest } from 'src/app/shared/data/common/dmsDocument';
import { PaymentsService } from '../../services/payments.service';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DepositComponent } from '../shared/deposit/deposit.component';
@Component({
  selector: 'app-process-batch',
  templateUrl: './process-batch.component.html',
  styleUrls: ['./process-batch.component.css'],
})
export class ProcessBatchComponent {
  /** Static data for the stepper component, indicating the current stage of the process. */
  steps = fmsStepsData.bankingSteps;
  /** Stores the original, unfiltered list of batches fetched from the API. */
  batches: BatchesDTO[] = [];
  /** Stores the filtered list of batches to be displayed in the table. */
  filteredBatches: BatchesDTO[] = [];
  /** Controls the visibility of the PrimeNG dialog for column selection. */
  visible: boolean = false;
  /** Stores the configuration for all available columns in the table. */
  columns: any[];
  /** A copy of all column configurations, used to render the table headers. */
  allColumns: any[] = [];
  /** An array of batches that the user has selected in the table via checkboxes. */
  selectedReceipts: BatchesDTO[] = [];
  /** A list of users available for task assignment, populating the user selection modal. */
  users: StaffDto[] = [];
  /** A filtered list of users for the user selection modal. */
  filteredUsers: StaffDto[] = [];
  /** A flag to determine if the assignment dialog is in 're-assign' mode. */
  reAssign: boolean = false;
  /** Stores the batch object currently being acted upon (e.g., for re-assignment or deposit). */
  selectedBatchObj: BatchesDTO;
  // @ViewChild to get a reference to the child component instance
  @ViewChild('deposit') DepositComponent: DepositComponent;
  /**
   * @constructor
   * @param translate Service for handling internationalization.
   * @param router Service for programmatic navigation.
   * @param bankingService Service for handling banking-related API calls.
   * @param commonMethodsService Service for common utility methods like error handling.
   * @param fb Service for building reactive forms.
   * @param globalMessagingService Service for displaying global notifications.
   * @param staffService Service for fetching staff/user data.
   * @param dmsService Service for document management system interactions.
   * @param paymentsService Service for fetching payment-related data like bank accounts.
   * @param authService Service for retrieving authentication and user information.
   * @param sessionStorage Service for interacting with browser session storage.
   */
  constructor(
    public translate: TranslateService,
    private router: Router,
    private bankingService: BankingProcessService,
    private commonMethodsService: CommonMethodsService,
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private staffService: StaffService,
    private dmsService: DmsService,
    private paymentsService: PaymentsService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService
  ) {}

  ngOnInit() {
    this.fetchBatches();
    this.allColumns = this.getColumns();
  }
  /**
   * @description Sets the visibility flag to true to show the column selection dialog.
   */
  showColumns(): void {
    this.visible = true;
  }
  /**
   * @description Defines the structure for all possible columns in the batches table.
   * @returns An array of column definition objects.
   */
  getColumns(): any {
    return (this.columns = [
      {
        field: 'batch_number',
        header: this.translate.instant('fms.receipting.batchNumber'),
      },
      {
        field: 'batch_date',
        header: this.translate.instant('fms.banking.date'),
      },
      {
        field: 'assignee',
        header: this.translate.instant('serviceDesk.assignee'),
      },
      {
        field: 'total_amount',
        header: this.translate.instant('fms.receipting.amount'),
      },
      {
        field: 'actions',
        header: this.translate.instant('fms.receipting.actions'),
      },
    ]);
  }
  /**
   * @description A getter that provides a translated string for the PrimeNG table's paginator report.
   * @returns The translated report template string.
   */
  get currentReportTemplate(): string {
    return this.translate.instant('fms.receipt-management.pageReport');
  }
  /**
   * @description Fetches the list of all available batches from the API and populates the table data.
   */
  fetchBatches(): void {
    this.bankingService.getBatches().subscribe({
      next: (response) => {
        this.batches = response;
        this.filteredBatches = this.batches;
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
    });
  }
  /**
   * @description Filters the `filteredReceipts` array based on user input in the table's filter row.
   * Handles filtering for string, number, and date fields.
   * @param event The input event from the filter field.
   * @param fieldName The key of the object property to filter on (e.g., 'receiptAmount').
   */
  filter(event: any, fieldName: any): any {
    let inputValue = (event.target as HTMLInputElement).value;
    this.filteredBatches = this.batches.filter((obj) => {
      let fieldValue = obj[fieldName];
      if (fieldValue instanceof Date) {
        const formattedDateField = fieldValue.toISOString().split('T')[0];

        return formattedDateField.includes(inputValue);
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
    this.filteredBatches = this.batches;
  }

  /**
   * @description Handles the re-assignment event emitted from the child component for a BATCH.
   * It builds the specific payload required for the `reAssignBatch` endpoint.
   */
  handleReassignment(event: any): void {
    // `event.item` is the original batch object passed to the child.
    const batchId = event.item;
    // `event.toUserId` is the ID of the new user selected in the dialog.
    const userId = event.toUserId;
    const requestBody = {
      batchId: batchId.batch_number,
      newUserId: userId,
    };

    this.bankingService.reAssignBatch(requestBody).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('', response.msg);
        this.fetchBatches();
      },
      error: (err) => this.commonMethodsService.handleApiError(err),
    });
  }
  detach(batch: any): void {
    this.selectedBatchObj = batch;
    const requestBody = {
      batchId: this.selectedBatchObj.batch_number,
    };
    this.bankingService.detach(requestBody).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('', response.msg);
        this.fetchBatches();
      },
      error: (err) => {
        this.commonMethodsService.handleApiError(err);
      },
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
        error: (err) =>this.commonMethodsService.handleApiError(err)
      });
    };
    fileReader.readAsDataURL(event.file);
  }
  /**
   * @description Navigates the user back to the main banking dashboard.
   */
  navigateToDashboard(): void {
    this.router.navigate(['/home/fms/banking-dashboard']);
  }
}
