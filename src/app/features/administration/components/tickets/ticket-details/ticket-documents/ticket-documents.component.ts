import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DmsDocument, SingleDmsDocument} from "../../../../../../shared/data/common/dmsDocument";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";
import {ParameterService} from "../../../../../../shared/services/parameter.service";
import {NewTicketDto} from "../../../../data/ticketsDTO";
import {allTicketModules} from "../../../../data/ticketModule";
import {DynamicTableModalData} from "../../../../../../shared/components/dynamic-table/dynamic-table.component";
import {TableDetail} from "../../../../../../shared/data/table-detail";
import {untilDestroyed} from "../../../../../../shared/shared.module";
import {take} from "rxjs/internal/operators/take";

@Component({
  selector: 'app-ticket-documents',
  templateUrl: './ticket-documents.component.html',
  styleUrls: ['./ticket-documents.component.css']
})
export class TicketDocumentsComponent implements OnInit, OnDestroy{
  @Input() currentTicket: NewTicketDto;

  selectedDocument: DmsDocument;
  selectedDocumentData: SingleDmsDocument;

  tableDetails: TableDetail;

  viewDocs: DmsDocument[] = [];

  documentModalVisible: boolean = false;

  cols = [
    { field: 'actualName', header: 'Doc Format' },
    { field: 'docType', header: 'Doc Type' },
    { field: 'actualName', header: 'Doc Name' },
    { field: 'dateCreated', header: 'Date Created' },
    { field: 'modifiedBy', header: 'Modified by' },
  ];

  constructor(private dmsService: DmsService,
              private parameterService: ParameterService,) {
  }

  ngOnInit(): void {
    this.tableDetails = {
      paginator: false, showFilter: false, showSorting: false,
      cols: this.cols,
      rows: this.viewDocs,
      isLazyLoaded: false,
      showCustomModalOnView: true,
      noDataFoundMessage: 'No Documents Found'
    }
    this.fetchDMSUrlParameters();
    this.fetchDocuments();
  }

  fetchDocuments(){
    let ticketModule = this.currentTicket?.systemModule;
    switch (ticketModule) {
      case  allTicketModules.claims:
        this.fetchClaimDocuments(this.currentTicket?.claimNumber);
        break;
      case allTicketModules.quotation:
        this.fetchQuotationDocuments(this.currentTicket?.quotationNo);
        break;
      default:
        this.fetchPolicyDocuments(this.currentTicket?.policyNumber);
        break;
    }
  }

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
        this.viewDocs = docs;
        this.tableDetails.rows = this.viewDocs;
      }
      );
  }

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
      });
  }

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
        this.viewDocs = claimDocuments;
        this.tableDetails.rows = this.viewDocs;
      }
    );
  }

  protected fetchDMSUrlParameters() {
    // return this.parameterService
    //   .getParameterValue('DMS_WEBSERVICE_URL', 2) // first fetch DMS Service Url from backend
    //   .pipe(
    //     take(1),
    //     untilDestroyed(this)
    //   )
    //   .subscribe( paramValue => {
    //     this.dmsService.setDmsUrlParameter(paramValue);
    //   });
  }

  toggleDocumentModal(display: boolean){
    this.documentModalVisible = display;
  }

  ngOnDestroy(): void {
  }

  showModal(event: DynamicTableModalData<DmsDocument>) {
    this.selectedDocument = event.value;
    this.previewDocument();
    this.toggleDocumentModal(true);
  }

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

  processActionEmitted(event) {
    this.toggleDocumentModal(false);
  }
}
