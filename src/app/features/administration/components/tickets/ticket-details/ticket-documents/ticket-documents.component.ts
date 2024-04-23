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
  tableClientDocs: TableDetail;
  tableServiceProviderDocs: TableDetail;
  tableDispatchedDocs: TableDetail;

  viewDocs: DmsDocument[] = [];

  documentModalVisible: boolean = false;

  cols = [
    { field: 'format', header: 'Doc Format' },
    { field: 'docType', header: 'Doc Type' },
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
  ];

  colsClaimantDocs = [
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
    { field: 'versionLabel', header: 'Version' },
  ];

  colsClientDocs = [
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
    { field: 'versionLabel', header: 'Version' },
  ];

  colsServiceProviderDocs = [
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
    { field: 'versionLabel', header: 'Version' },
  ];
  colsDispatchedDocs = [
    { field: 'dd_report_name', header: 'Report Name' },
    { field: 'ged_dms_posted_status', header: 'E-doc client delivery status' },
    { field: 'ged_dms_posted_status', header: 'E-doc agent delivery status' },
    { field: 'geds_clnt_email_addrs', header: 'Client email address' },
    { field: 'geds_agn_accholder', header: 'Agent acc holder email' },
    { field: 'agn_name', header: 'Interested party' },
    { field: 'geds_pip_email_address', header: 'Interested party email' },
    { field: 'ged_pip_sent_status', header: 'Interested Party Delivery Status' },
    { field: 'ged_dms_posted_status', header: 'DMS Delivery Status' },
    { field: 'geds_pip_email_address2', header: '2nd Interested Party' },
    { field: 'geds_pip_email_address3', header: '3rd Interested Party' },
    { field: 'ged_pip_email_address4', header: '4th Interested Party' },
    { field: 'ged_approved_by', header: 'Dispatched By' },
    { field: 'ged_approved_date', header: 'Dispatched Date' },
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
      paginator: false, showFilter: false, showSorting: false, showSearch: true,
      cols: this.cols,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Documents Found'
    }
    this.tableClaimantDocs = {
      paginator: false, showFilter: false, showSorting: false, showSearch: true,
      cols: this.colsClaimantDocs,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Documents Found'
    }
    this.tableClientDocs = {
      paginator: false, showFilter: false, showSorting: false, showSearch: true,
      cols: this.colsClientDocs,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Client Documents Found'
    }
    this.tableServiceProviderDocs = {
      paginator: false, showFilter: false, showSorting: false, showSearch: true,
      cols: this.colsServiceProviderDocs,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Service Provider Documents Found'
    }

    this.tableDispatchedDocs = {
      paginator: false, showFilter: false, showSorting: false, showSearch: true,
      cols: this.colsDispatchedDocs,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: false,
      noDataFoundMessage: 'No Dispatch Documents Found'
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
        this.fetchClaimantDocuments(this.currentTicket?.ticket?.claimNo); ///should add claimant number
        this.fetchServiceProvDocuments(this.currentTicket?.ticket?.claimNo); ///should add service provider code
        break;
      case allTicketModules.quotation:
        this.fetchQuotationDocuments(this.currentTicket?.ticket?.quotationNo);
        break;
      default:
        this.fetchPolicyDocuments(this.currentTicket?.ticket?.policyNo);
        this.fetchDispatchedDocuments(this.currentTicket?.ticket?.policyCode)
        break;
    }
    this.fetchClientDocuments(this.currentTicket?.ticket?.clientCode.toString());
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
      return;
    }

    this.dmsService.fetchDocumentsByQuotationNo(quoteCode)
      .pipe(
        untilDestroyed(this),
        take(1)
      )
      .subscribe( docs =>
      {
        docs.forEach( doc => {
          const splitName = doc['actualName'].split('.');
          doc.format = splitName[1]?.toUpperCase();
        });
        this.viewDocs = docs;
        this.tableDetails.rows = this.viewDocs;
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
        policyDocs.forEach( doc => {
          const splitName = doc['actualName'].split('.');
          doc.format = splitName[1]?.toUpperCase();
        });
        this.viewDocs = policyDocs;
        this.tableDetails.rows = this.viewDocs;
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
      return;
    }
    //
    this.dmsService.fetchDocumentsByClaimNo(claimNo)
      .pipe(untilDestroyed(this))
      .subscribe( claimDocuments => {
        claimDocuments.forEach( doc => {
          const splitName = doc['actualName'].split('.');
          doc.format = splitName[1]?.toUpperCase();
        });
        this.viewDocs = claimDocuments;
        this.tableDetails.rows = this.viewDocs;
      }
    );
  }

  private fetchClientDocuments(clientCode: string) {
    if(!clientCode){
      this.viewDocs = [];
      this.tableClientDocs.rows = this.viewDocs;
      return;
    }
    //
    this.dmsService.fetchDocumentsByClientCode(clientCode)
      .pipe(untilDestroyed(this))
      .subscribe( clientDocuments => {
          this.viewDocs = clientDocuments;
          this.tableClientDocs.rows = this.viewDocs;
        }
      );
  }

  private fetchClaimantDocuments(claimantNo: string) {
    if(!claimantNo){
      this.viewDocs = [];
      this.tableClaimantDocs.rows = this.viewDocs;
      return;
    }
    //
    this.dmsService.fetchDocumentsByClaimNo(claimantNo)
      .pipe(untilDestroyed(this))
      .subscribe( clientDocuments => {
          this.viewDocs = clientDocuments;
          this.tableClaimantDocs.rows = this.viewDocs;
        }
      );
  }

  private fetchServiceProvDocuments(spCode: string) {
    if(!spCode){
      this.viewDocs = [];
      this.tableServiceProviderDocs.rows = this.viewDocs;
      return;
    }
    //
    this.dmsService.fetchDocumentsByServiceProviderCode(spCode)
      .pipe(untilDestroyed(this))
      .subscribe( clientDocuments => {
          this.viewDocs = clientDocuments;
          this.tableServiceProviderDocs.rows = this.viewDocs;
        }
      );
  }

  private fetchDispatchedDocuments(batchNo: number) {
    if(!batchNo){
      this.viewDocs = [];
      this.tableDetails.rows = this.viewDocs;
      return;
    }
    this.dmsService.fetchDispatchedDocumentsByBatchNo(batchNo)
      .pipe(untilDestroyed(this))
      .subscribe( policyDocs =>
      {
        this.viewDocs = policyDocs;
        this.tableDispatchedDocs.rows = this.viewDocs;
      });
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
