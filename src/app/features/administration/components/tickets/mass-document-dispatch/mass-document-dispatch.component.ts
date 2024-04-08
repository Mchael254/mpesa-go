import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Table} from "primeng/table";
import {DmsService} from "../../../../../shared/services/dms/dms.service";
import {TicketsDTO} from "../../../data/ticketsDTO";
import {LocalStorageService} from "../../../../../shared/services/local-storage/local-storage.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../../../../shared/services/auth.service";
import {Logger} from "../../../../../shared/services";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";

const log = new Logger('MassDocumentDispatchComponent');
@Component({
  selector: 'app-mass-document-dispatch',
  templateUrl: './mass-document-dispatch.component.html',
  styleUrls: ['./mass-document-dispatch.component.css']
})
export class MassDocumentDispatchComponent implements OnInit {
  @ViewChild('dispatchDocsTable') dispatchDocsTable: Table;
  public pageSize: 5;
  isDispatch: boolean = false;
  dispatchedDocs: any[];
  selectedDoc: any[] = [];
  selectedSpringTickets: TicketsDTO;

  docDispatchForm: FormGroup;
  dispatchReasonsData: any[];
  saveDocumentRejectionData: any;
  documentsToDispatchData: any[];
  isLoading: boolean = false;
  reportsDispatchedData: any[];
  selectedOptions: any[];

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  constructor(private dmsService: DmsService,
              private localStorageService: LocalStorageService,
              private fb: FormBuilder,
              private authService: AuthService,
              private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.selectedSpringTickets = this.localStorageService.getItem('ticketDetails');
    console.log('ticket mass', this.selectedSpringTickets);
    this.dmsService.fetchDispatchedDocumentsByBatchNo(this.selectedSpringTickets?.ticket?.policyCode);

    this.createDocDispatchForm();
    this.getDispatchReasons();
    this.getDocumentsDispatched();
    this.getReportsToPrepare();
    this.getReportsDispatched();

    this.getDispatchedDocs();
  }

  createDocDispatchForm() {
    this.docDispatchForm = this.fb.group({
      dispatchDocuments: [''],
      rejectionDescription: [''],
      documentDispatched: ['']
    })
  }
  dispatchDocs() {

  }

  openDocDispatchModal() {
    const modal = document.getElementById('docDispatchToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }
  closeDocDispatchModal() {
    const modal = document.getElementById('docDispatchToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  getDocumentsDispatched() {
    this.policiesService.fetchDocumentsDispatched(this.selectedSpringTickets?.ticket?.policyCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.documentsToDispatchData = data.embedded[0];
          // this.spinner.hide();
          log.info('docs to display>>', this.documentsToDispatchData);
        })
  }

  getDispatchReasons() {
    // this.spinner.show();
    this.policiesService.getDispatchRejectionReasons('EDD')
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.dispatchReasonsData = data.embedded[0];
          // this.spinner.hide();
          log.info('dispatch reasons>>', this.dispatchReasonsData);
        }
      )
  }

  getReportsToPrepare() {
    this.policiesService.fetchDispatchReports(this.selectedSpringTickets?.ticket?.policyCode, this.selectedSpringTickets?.ticket?.endorsment)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.documentsToDispatchData = data;
          // this.spinner.hide();
          log.info('reports>>', this.documentsToDispatchData);
        }
      )
  }

  getReportsDispatched() {
    this.policiesService.fetchReportsDispatched(this.selectedSpringTickets?.ticket?.policyCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          const codes = data.embedded.map(transaction => transaction?.documentDispatchCode);
          log.info('Codes:', codes);

          // this.selectedOptions = codes;
          this.reportsDispatchedData = data;

          log.info('reports dispatched>>', this.reportsDispatchedData);
        }
      );
  }
  saveDispatchRejection() {
    // log.info('>>>>', event.value)
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    const assignee = this.authService.getCurrentUserName();
    if (scheduleFormValues) {
      const payload: any = {
        code: 0,
        dispatchApply: "N",
        exemptReason: scheduleFormValues.rejectionDescription,
        policyBatchNo: this.selectedSpringTickets?.ticket?.policyCode,
        preparedBy: assignee,
        preparedDate: this.dateToday

      }
      log.info('save payload>>', payload)
      this.policiesService.saveDispatchRejectReason(payload)
        .subscribe({
          next: (data) => {
            this.saveDocumentRejectionData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved reason for dispatch rejection');
            // this.cdr.detectChanges();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Rejection reason not saved.'
      );
    }
  }

  prepareDocuments() {
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    if (scheduleFormValues.documentDispatched.length > 0) {
      const payload: any = {
        dispatchDocumentCode: scheduleFormValues.documentDispatched,
        policyBatchNo: this.selectedSpringTickets?.ticket?.policyCode,
        reportStatus: "A"
      }

      log.info('prepare report payload>>', payload, scheduleFormValues)
      this.policiesService.addRemoveReportsToPrepare(payload)
        .subscribe({
          next: (data) => {
            // this.saveAddReportData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully added report(s)');
            setTimeout(() => {
              this.savePreparedDocs();
            },1500);
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Document(s) not prepared, ensure a report is selected.'
      );
    }
  }

  savePreparedDocs() {
    this.policiesService.prepareDocuments(this.selectedSpringTickets?.ticket?.policyCode)
      .subscribe({
        next: (data) => {
          // this.savePreparedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully prepared documents');
          this.onSave();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
  }

  onSave() {
    this.policiesService.dispatchDocuments(this.selectedSpringTickets?.ticket?.policyCode)
      .subscribe({
        next: (data) => {
          // this.saveDispatchedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully dispatched documents');
          this.dmsService.fetchDispatchedDocumentsByBatchNo(this.selectedSpringTickets?.ticket?.policyCode);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
    this.cdr.detectChanges();
    // this.globalMessagingService.displaySuccessMessage('Success', 'Saved');
  }
  filterDocs(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dispatchDocsTable.filterGlobal(filterValue, 'contains');
  }

  getDispatchedDocs() {
    this.dmsService.fetchDispatchedDocumentsByBatchNo(this.selectedSpringTickets?.ticket?.policyCode)
      .pipe(untilDestroyed(this))
      .subscribe( policyDocs =>
      {
        this.dispatchedDocs = policyDocs;
        // this.tableDispatchedDocs.rows = this.viewDocs;
      });
  }

  ngOnDestroy(): void {
  }
}
