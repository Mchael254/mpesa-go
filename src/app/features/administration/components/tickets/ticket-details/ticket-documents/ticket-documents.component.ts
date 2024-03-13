import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DmsDocument, SingleDmsDocument} from "../../../../../../shared/data/common/dmsDocument";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";
import {TicketsDTO} from "../../../../data/ticketsDTO";
import {allTicketModules} from "../../../../data/ticketModule";
import {DynamicTableModalData} from "../../../../../../shared/components/dynamic-table/dynamic-table.component";
import {TableDetail} from "../../../../../../shared/data/table-detail";
import {untilDestroyed} from "../../../../../../shared/shared.module";
import {take} from "rxjs/internal/operators/take";
import {LocalStorageService} from "../../../../../../shared/services/local-storage/local-storage.service";

/**
 * Component to display a list of documents attached to a ticket and preview a document within the list
 */

@Component({
  selector: 'app-ticket-documents',
  templateUrl: './ticket-documents.component.html',
  styleUrls: ['./ticket-documents.component.css']
})
export class TicketDocumentsComponent implements OnInit, OnDestroy{
  currentTicket: TicketsDTO;

  selectedDocument: DmsDocument;
  selectedDocumentData: SingleDmsDocument;

  tableDetails: TableDetail;
  tableClaimantDocs: TableDetail;

  viewDocs: DmsDocument[] = [];

  documentModalVisible: boolean = false;

  cols = [
    { field: 'actualName', header: 'Doc Format' },
    { field: 'docType', header: 'Doc Type' },
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
  ];

  colsClaimantDocs = [
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
    { field: 'version', header: 'Version' },
  ];

  constructor(private dmsService: DmsService,
              private localStorageService: LocalStorageService,
  ) {
  }

  /**
   * Initialize component by:
   *  1.Setting table details
   *  2.Fetch documents for the selected ticket
   */
  ngOnInit(): void {
    this.currentTicket = this.localStorageService.getItem('ticketDetails');
    this.tableDetails = {
      paginator: false, showFilter: false, showSorting: false,
      cols: this.cols,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Documents Found'
    }
    this.tableClaimantDocs = {
      paginator: false, showFilter: false, showSorting: false,
      cols: this.colsClaimantDocs,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Documents Found'
    }
    this.fetchDocuments();
  }

  /**
   * Fetch documents according to the selected ticket's module
   */
  fetchDocuments(){
    let ticketModule = this.currentTicket?.ticket?.sysModule;
    switch (ticketModule) {
      case  allTicketModules.claims:
        this.fetchClaimDocuments(this.currentTicket?.ticket?.claimNo);
        break;
      case allTicketModules.quotation:
        this.fetchQuotationDocuments(this.currentTicket?.ticket?.quotationNo);
        break;
      default:
        this.fetchPolicyDocuments(this.currentTicket?.ticket?.policyNo);
        break;
    }
  }

  /**
   * Fetch documents by quotation code
   * @param quoteCode - Quotation Code
   * @private
   */
  private fetchQuotationDocuments(quoteCode: string){
    if(!quoteCode){
      this.viewDocs = [];
      this.tableDetails.rows = this.viewDocs;
      this.tableClaimantDocs.rows = this.viewDocs;
      return;
    }

    this.dmsService.fetchDocumentsByQuotationNo(quoteCode)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe( docs =>
      {
        this.viewDocs = docs;
        this.tableDetails.rows = this.viewDocs;
        this.tableClaimantDocs.rows = this.viewDocs;
      }
      );
  }

  /**
   * Fetch documents by Policy No
   * @param policyNo - Policy no
   * @private
   */
  private fetchPolicyDocuments(policyNo: string) {
    if(!policyNo){
      this.viewDocs = [];
      this.tableDetails.rows = this.viewDocs;
      return;
    }
    //
    this.dmsService.fetchDocumentsByPolicyNo(policyNo)
      .pipe(untilDestroyed(this))
      .subscribe( policyDocs =>
      {
        this.viewDocs = policyDocs;
        this.tableDetails.rows = this.viewDocs;
        this.tableClaimantDocs.rows = this.viewDocs;
      });
  }

  /**
   * Fetch documents by claim no
   * @param claimNo - Claim No
   * @private
   */
  private fetchClaimDocuments(claimNo: string) {
    if(!claimNo){
      this.viewDocs = [];
      this.tableDetails.rows = this.viewDocs;
      this.tableClaimantDocs.rows = this.viewDocs;
      return;
    }
    //
    this.dmsService.fetchDocumentsByClaimNo(claimNo)
      .pipe(untilDestroyed(this))
      .subscribe( claimDocuments => {
        this.viewDocs = claimDocuments;
        this.tableDetails.rows = this.viewDocs;
        this.tableClaimantDocs.rows = this.viewDocs;
      }
    );
  }

  /**
   * Toggle display of the modal
   * @param display - Modal visibility status
   */
  toggleDocumentModal(display: boolean){
    this.documentModalVisible = display;
  }

  ngOnDestroy(): void {
  }

  /**
   * Fetch and Show document modal triggered by an event
   * @param event - Event  emitted
   */
  showModal(event: DynamicTableModalData<DmsDocument>) {
    this.selectedDocument = event.value;
    this.previewDocument();
    this.toggleDocumentModal(true);
  }

  /**
   * Fetch document data for preview
   */
  previewDocument(){
    return this.dmsService.getDocumentById(this.selectedDocument?.id)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe((documentData: SingleDmsDocument) => {
        this.selectedDocumentData = documentData;
      });
  }

  /**
   * Hide document modal triggered by event emitted
   * @param event - Event emitted from an Output Event Emitter
   */
  processActionEmitted(event) {
    this.toggleDocumentModal(false);
  }
}
