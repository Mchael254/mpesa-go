import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Table, TableLazyLoadEvent} from "primeng/table";
import {TicketsDTO} from "../../../data/ticketsDTO";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Logger} from "../../../../../shared/services";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {tap} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {TicketsService} from "../../../services/tickets.service";
import {LazyLoadEvent} from "primeng/api";
import {ReportsService} from "../../../../../shared/services/reports/reports.service";

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
  selectedSpringTickets: TicketsDTO[] = [];
  springTickets: Pagination<TicketsDTO> =  <Pagination<TicketsDTO>>{};
  selectedTicket: TicketsDTO;

  docDispatchForm: FormGroup;
  dispatchReasonsData: any[];
  saveDocumentRejectionData: any;
  documentsToDispatchData: any[];
  isLoading: boolean = false;
  isLoadingDispatch: boolean = false;
  reportsDispatchedData: any[];
  selectedOptions: any[];
  selectedRptName: string = '';

  filePath: any;
  fileName: any;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  constructor(
              private fb: FormBuilder,
              private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private cdr: ChangeDetectorRef,
              private spinner: NgxSpinnerService,
              private ticketsService: TicketsService,
              private reportService: ReportsService,) {
  }

  ngOnInit(): void {
    this.createDocDispatchForm();
  }

  /**
   * The function creates a form group for document dispatch with a single control for the document dispatched.
   */
  createDocDispatchForm() {
    this.docDispatchForm = this.fb.group({
      documentDispatched: ['']
    })
  }

  /**
   * The function `openDocDispatchModal` displays a modal with a backdrop if it exists.
   */
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

  /**
   * The function `closeDocDispatchModal` hides a modal and its backdrop if they are currently displayed.
   */
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

  /**
   * The function `openDocConfirmModal` displays a modal with a backdrop for confirming a document.
   */
  openDocConfirmModal() {
    const modal = document.getElementById('docConfirmToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  /**
   * The function `closeDocConfirmModal` hides a modal with the ID 'docConfirmToggle' and its backdrop.
   */
  closeDocConfirmModal() {
    const modal = document.getElementById('docConfirmToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  /**
   * The function getAllTickets retrieves data based on the specified page index, page size, and type.
   */
  getAllTickets(
    pageIndex: number,
    pageSize: number,) {
    this.spinner.show();
      return this.ticketsService.sortTickets(pageIndex, pageSize, null, null, null, null, 'Dispatch' )
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info('Fetch Tickets data>> ', data))
        );
  }

  /**
   * The function `lazyLoadTickets` is used to load tickets lazily based on the event parameters, with additional logic to
   * handle filtering from the dashboard screen.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `lazyLoadTickets` function takes an event parameter of type
   * `LazyLoadEvent` or `TableLazyLoadEvent`. This event parameter is used to determine the pagination details such as page
   * index, sort field, sort order, and page size for loading tickets.
   */
  lazyLoadTickets(event:LazyLoadEvent | TableLazyLoadEvent) {

    const pageIndex = event.first;
    const queryColumn = event.sortField;
    const sort = event.sortOrder === -1 ? `-${event.sortField}` : event.sortField;
    const pageSize = event.rows;
    log.info('sortorder',queryColumn);

    this.getAllTickets(pageIndex, pageSize)
      .pipe(untilDestroyed(this))
      .subscribe((data:Pagination<TicketsDTO>) => {
          this.springTickets = data;
          this.cdr.detectChanges();
          this.ticketsService.setCurrentTickets(this.springTickets.content);
          this.spinner.hide();

        },
        error => {
          this.spinner.hide();
        })

  }

  /**
   * The function `getReportsToPrepare` fetches dispatch reports for a given ticket and displays them in a modal if
   * available, otherwise shows an error message.
   */
  getReportsToPrepare(ticket: TicketsDTO) {
    this.selectedTicket = ticket;
    log.info('ticket>', ticket);
    this.policiesService.fetchDispatchReports(ticket?.ticket?.policyCode, ticket?.ticket?.endorsment)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.documentsToDispatchData = data;
          if (this.documentsToDispatchData) {
            this.openDocDispatchModal();
          }
          // this.spinner.hide();
          log.info('reports>>', this.documentsToDispatchData);
        },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', 'No documents to prepare');
          }
      }
      )
  }

  /**
   * The `prepareDocuments` function prepares and dispatches documents based on the form values and displays success or
   * error messages accordingly.
   */
  prepareDocuments() {
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    let reportSelected = this.documentsToDispatchData.filter(data => data['checked'] === true);
    const reportCodes = reportSelected.map(data=> data.dd_code);
    log.info('0', reportCodes)
    if (scheduleFormValues.documentDispatched.length > 0) {
      const payload: any = {
        dispatchDocumentCode: reportCodes,
        policyBatchNo: this.selectedTicket?.ticket?.policyCode,
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

  /**
   * The `savePreparedDocs` function prepares documents for a selected ticket's policy code and displays success or error
   * messages accordingly.
   */
  savePreparedDocs() {
    this.policiesService.prepareDocuments(this.selectedTicket?.ticket?.policyCode)
      .subscribe({
        next: (data) => {
          // this.savePreparedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully prepared documents');
          this.closeDocDispatchModal();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
  }

  /**
   * The onSave function in TypeScript retrieves selected ticket codes, validates the selection, dispatches documents, and
   * displays success or error messages accordingly.
   * @returns The `onSave()` function returns a boolean value. If there are no selected ticket codes, it returns `false`
   * after displaying an error message. Otherwise, it returns nothing after dispatching documents and displaying success or
   * error messages.
   */
  onSave() {
    const selectedTicketCodes = this.selectedSpringTickets.map(ticket => ticket.ticket.policyCode);

    log.info('tds', selectedTicketCodes)
    if (selectedTicketCodes.length === 0) {
      this.globalMessagingService.displayErrorMessage('Warning', 'Please select at least one ticket');
      return false;
    }
    this.policiesService.dispatchDocuments(selectedTicketCodes)
      .subscribe({
        next: (data) => {
          // this.saveDispatchedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully dispatched documents');
          this.closeDocConfirmModal();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
    this.cdr.detectChanges();
  }

  /**
   * The `filterDocs` function filters a table based on the input value from an HTML input element.
   * @param {Event} event - The `event` parameter in the `filterDocs` function is an Event object that represents an event
   * being handled, such as a user input event. It is used to extract the value entered by the user in an HTML input
   * element to perform filtering on a table or list of documents.
   */
  filterDocs(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dispatchDocsTable.filterGlobal(filterValue, 'contains');
  }

  getReportsDispatched() {
    this.policiesService.fetchReportsDispatched(this.selectedTicket?.ticket?.policyCode)
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

  selectDocs(doc:any) {
    log.info("report selected>>", doc);
    this.selectedRptName = doc.rpt_name;
    this.fetchReport(doc.dd_code);
    this.documentsToDispatchData = this.documentsToDispatchData.map(data =>{
      if (data?.dd_code === doc?.dd_code) {
        data['checked'] = !!!doc['checked'];
        return data;
      }
      return data;
    })
  }

  fetchReport(report: any) {
    // this.isLoadingReport = true;

    console.log('rpt>', report);
    this.reportService.fetchReport(report)
      .subscribe(
        (response) => {
          // this.apiService.DOWNLOADFROMBYTES(response, 'fname.pdf', 'application/pdf')
          const blob = new Blob([response], { type: 'application/pdf' });
          this.filePath  = window.URL.createObjectURL(blob);
          this.cdr.detectChanges();

          // this.openReportsModal();
          // this.isLoadingReport = false;
        },
        err=>{
          this.filePath= null;
          this.globalMessagingService.displayErrorMessage('Error', err.statusText);
          // this.isLoadingReport = false;
        })
  }

  ngOnDestroy(): void {
  }
}
