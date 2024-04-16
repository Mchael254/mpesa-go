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
              private ticketsService: TicketsService,) {
  }

  ngOnInit(): void {
    this.createDocDispatchForm();
  }

  createDocDispatchForm() {
    this.docDispatchForm = this.fb.group({
      documentDispatched: ['']
    })
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

  getAllTickets(
    pageIndex: number,
    pageSize: number,) {
    this.spinner.show();
      return this.ticketsService.sortTickets(pageIndex, pageSize, null, null, 'DISP', null )
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info('Fetch Tickets data>> ', data))
        );
  }

  lazyLoadTickets(event:LazyLoadEvent | TableLazyLoadEvent) {

    const ticketFilter:any = this.ticketsService.ticketFilterObject();

    if(!ticketFilter?.fromDashboardScreen) {
      const pageIndex = event.first / event.rows;
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

  }

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

  prepareDocuments() {
    const scheduleFormValues = this.docDispatchForm.getRawValue();
    if (scheduleFormValues.documentDispatched.length > 0) {
      const payload: any = {
        dispatchDocumentCode: scheduleFormValues.documentDispatched,
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

  savePreparedDocs() {
    this.policiesService.prepareDocuments(this.selectedTicket?.ticket?.policyCode)
      .subscribe({
        next: (data) => {
          // this.savePreparedDocumentData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully prepared documents');
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
  }

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
  filterDocs(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dispatchDocsTable.filterGlobal(filterValue, 'contains');
  }

  ngOnDestroy(): void {
  }
}
