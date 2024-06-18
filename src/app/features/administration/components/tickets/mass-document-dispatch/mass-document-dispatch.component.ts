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
  selectedSpringTickets: TicketsDTO[] = [];
  springTickets: Pagination<TicketsDTO> =  <Pagination<TicketsDTO>>{};
  selectedTicket: TicketsDTO;

  docDispatchForm: FormGroup;

  documentsToDispatchData: any[];
  isLoading: boolean = false;
  isLoadingDispatch: boolean = false;
  reportsDispatchedData: any[];

  filePath: any;
  fileName: any;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  documentList: any[];

  docsPrepared: any[] = [];
  docsUnprepared: any[] = [];
  docToPrepare: number[] = [];
  docToUnPrepare: number;
  reportList: any[] = [];
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
    this.documentList = [];
    this.reportList = [];
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
    log.info('prep', this.docToPrepare)
    if (this.docToPrepare.length > 0) {
      const payload: any = {
        dispatchDocumentCode: this.docToPrepare,
        policyBatchNo: this.selectedTicket?.ticket?.policyCode,
        reportStatus: "A"
      }

      log.info('prepare report payload>>', payload)
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

  /**
   * The function `getReportsDispatched` fetches and logs document dispatch codes for a selected
   * ticket's policy.
   */
  getReportsDispatched() {
    this.policiesService.fetchReportsDispatched(this.selectedTicket?.ticket?.policyCode)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          const codes = data.embedded.map(transaction => transaction?.documentDispatchCode);
          log.info('Codes:', codes);

          this.reportsDispatchedData = data;

          log.info('reports dispatched>>', this.reportsDispatchedData);
        }
      );
  }

  /**
   * The fetchPreparedDocs function fetches reports dispatched for a given policy code and then fetches
   * unprepared documents based on the policy code and endorsement.
   */
  fetchPreparedDocs(ticket: TicketsDTO) {
    this.policiesService.fetchReportsDispatched(ticket?.ticket?.policyCode)
      .subscribe((data) => {
        this.docsPrepared = data.embedded;
        this.fetchUnPreparedDocs(ticket?.ticket?.policyCode, ticket?.ticket?.endorsment);
      })
  }

  /**
   * The fetchUnPreparedDocs function fetches dispatch reports for a specific policy code and document
   * type and then combines the retrieved documents.
   */
  fetchUnPreparedDocs(policyCode: number, docType: string) {
    this.policiesService.fetchDispatchReports(policyCode, docType)
      .subscribe((data) => {
        this.docsUnprepared = data;
        this.combineDocs();
      })
  }

  /**
   * The function `combineDocs` prepares and combines document lists from two different sources and
   * then opens a document dispatch modal.
   */
  combineDocs() {
    let preparedList = this.docsPrepared.map(data => {
      let temp = {}
      temp['docCode'] = data['documentDispatchCode']
      temp['docName'] = data['dispatchDocumentDto']['report_name']
      temp['reportCode'] = data['report_code']
      temp['doneBy'] = data['doneBy']

      log.info('temp', temp);
      return temp;
    })

    let unPreparedList = this.docsUnprepared.map(data_ => {
      let temp = {}
      temp['docCode'] = data_['dd_code']
      temp['docName'] = data_['rpt_name']
      temp['reportCode'] = data_['emrpt_code']
      temp['doneBy'] = null

      log.info('temp', temp);
      return temp;
    })

    let combinedList = [...preparedList, ...unPreparedList];
    this.documentList = combinedList;
    log.info('list', combinedList)
    this.openDocDispatchModal();
  }

  /**
   * The `reportsDispatch` function in TypeScript fetches prepared documents for a given ticket and
   * sets the selected ticket.
   */
  reportsDispatch(ticket: TicketsDTO) {
    this.fetchPreparedDocs(ticket);
    this.selectedTicket = ticket;

  }

  /**
   * The function `selectDocs` handles the selection of documents based on user interaction, updating a
   * list of documents to prepare or unprepare accordingly.
   */
  selectDocs(event: Event, doc: any) {
    event.stopPropagation();
    const checkbox = event.target as HTMLInputElement;

    const filteredDoc = (this.documentList.filter(el => el.docCode == doc.docCode))[0];

    if (filteredDoc?.doneBy === null) {
      if (!(this.docToPrepare.includes(filteredDoc.docCode))) {
        log.info('unchecked')
        this.docToPrepare.push(filteredDoc.docCode)
      } else {
        this.docToPrepare.splice(filteredDoc, 1)
        log.info('in the list')
      }

    } else {
      this.unPrepareDocument(filteredDoc.docCode)
      log.info('checked. Call endpoint when checked', filteredDoc?.doneBy)
    }
    log.info('index', filteredDoc, this.docToPrepare)

  }

  /**
   * The function `onLabelClick` prevents the default label click behavior and fetches a report for
   * each document in the `documentList`.
   */
  onLabelClick(event: Event) {
    event.preventDefault(); // Prevent the default label click behavior (which toggles the checkbox)
    this.documentList.forEach(doc => {
      this.fetchReport(doc)
    })
  }

  /**
   * The fetchReport function fetches a report using a report code, creates a Blob from the response,
   * and adds the report to a list with file name and source URL.
   */
  fetchReport(report: any) {
    // this.isLoadingReport = true;

    console.log('rpt>', report);
    if (!report.reportCode) {
      log.info('no report code');
      return
    }
    this.reportService.fetchReport(report?.reportCode)
      .subscribe(
        (response) => {
          // this.apiService.DOWNLOADFROMBYTES(response, 'fname.pdf', 'application/pdf')
          const blob = new Blob([response], { type: 'application/pdf' });
          // this.filePath  = window.URL.createObjectURL(blob);
          const filePath = window.URL.createObjectURL(blob);

          this.reportList.push({
            fileName: report?.docName,
            srcUrl: filePath
          })
          log.info('report list', this.reportList)
          // this.isLoadingReport = false;
        },
        err=>{
          this.filePath= null;
          this.globalMessagingService.displayErrorMessage('Error', err.statusText);
          // this.isLoadingReport = false;
        })
  }

  /**
   * The function `unPrepareDocument` takes a document code as input, prepares a payload, and then
   * calls a service to unprepare the document, displaying success or error messages accordingly.
   */
  unPrepareDocument(docCode: number) {
    if (docCode) {
      const payload: any = {
        dispatchDocumentCode: docCode,
        policyBatchNo: this.selectedTicket?.ticket?.policyCode
      }

      log.info('un-prepare report payload>>', payload)
      this.policiesService.unPrepareDocuments(payload?.policyBatchNo, payload?.dispatchDocumentCode)
        .subscribe({
          next: (data) => {

            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully unprepared report');
            setTimeout(() => {
              this.reportsDispatch(this.selectedTicket);
            },1500);
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Document not unprepared, ensure a report is selected.'
      );
    }
  }

  ngOnDestroy(): void {
  }
}
