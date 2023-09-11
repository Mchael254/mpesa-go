import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDocumentsComponent } from './ticket-documents.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {NgxSpinnerModule} from "ngx-spinner";
import {RouterTestingModule} from "@angular/router/testing";
import {DocViewerComponent} from "../../../../../../shared/components/doc-viewer/doc-viewer.component";
import {
  DynamicSimpleModalComponent
} from "../../../../../../shared/components/dynamic-simple-modal/dynamic-simple-modal.component";
import {
  DynamicTableComponent,
  DynamicTableModalData
} from "../../../../../../shared/components/dynamic-table/dynamic-table.component";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";
import {of} from "rxjs";
import {TableModule} from "primeng/table";
import {DmsDocument, SingleDmsDocument} from "../../../../../../shared/data/common/dmsDocument";

const claimDocuments:  DmsDocument []  = [{
  actualName: "testDoc.pdf",
  claimNo: "CLAIM/001/2023",
  docRefNo: "TICKET-OO1-2023",
  dateReceived: "07-09-2023",
  id: "7784683683fhufdbbsbfjbfd",
  docType: "PDF",
  mimeType: "application/pdf"
},
  {
    actualName: "idDoc.do",
    claimNo: "CLAIM/002/2023",
    docRefNo: "TICKET-002-2023",
    dateReceived: "08-09-2023",
    id: "1625235273dbdfbdfbjdfv",
    docType: "DOC",
    mimeType: "application/msword"
  }
];

const policyDocuments : DmsDocument [] = [{
    actualName: "pinDoc.pdf",
  policyNo: "POL/6437/001/23",
  docRefNo: "TICKET-003-2023",
  id: "2754743763486438dhvfdddj",
  docType: "PDF",
  mimeType: "application/pdf"
}];

const quotationDocuments : DmsDocument[]  =
    [{
      actualName:"logBook.pdf",
      docDescription: "LOG BOOK DOCUMENT",
      docReceivedDate: "08-09-2023",
      docRefNo: "TICKET-0049-2023",
      id: "1725746483vdjasvjevsdjc",
      mimeType: "application/pdf",
      name: "1725746483vdjasvjevsdjc_LOG_BOOK.pdf"
    }];

export class MockDmsService {
  fetchDocumentsByClaimNo = jest.fn().mockReturnValue(of(claimDocuments));
  fetchDocumentsByQuotationNo = jest.fn().mockReturnValue(of(quotationDocuments));
  fetchDocumentsByPolicyNo = jest.fn().mockReturnValue(of(policyDocuments));
  getDocumentById = jest.fn();
}

describe('TicketDocumentsComponent', () => {
  let component: TicketDocumentsComponent;
  let dmsService: Partial<DmsService>;
  let fixture: ComponentFixture<TicketDocumentsComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxSpinnerModule.forRoot(), HttpClientTestingModule, TableModule],
      declarations: [TicketDocumentsComponent,DynamicTableComponent, DynamicSimpleModalComponent, DocViewerComponent],
      providers: [{provide: DmsService, useClass: MockDmsService}]
    });
    fixture = TestBed.createComponent(TicketDocumentsComponent);

    dmsService = TestBed.inject(DmsService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch quotation documents and update viewDocs and tableDetails.rows', () => {
    const quoteCode = 'ABC123';
    jest.spyOn(dmsService, 'fetchDocumentsByQuotationNo');

    component.currentTicket = { quotationNo: quoteCode, systemModule: 'Q' };
    component.fetchDocuments();

    expect(dmsService.fetchDocumentsByQuotationNo).toHaveBeenCalledWith(quoteCode);
    expect(component.viewDocs).toEqual(quotationDocuments);
    expect(component.tableDetails.rows).toEqual(quotationDocuments);
  });

  it('should set viewDocs and tableDetails.rows to empty array if quoteCode is falsy', () => {
    component.fetchDocuments();

    expect(component.viewDocs).toEqual([]);
    expect(component.tableDetails.rows).toEqual([]);
  });

  it('should fetch policy documents and update viewDocs and tableDetails.rows', () => {
    const policyNo = 'XYZ789';
    jest.spyOn(dmsService, 'fetchDocumentsByPolicyNo');

    component.currentTicket = { policyNumber: policyNo, systemModule: 'P' };
    component.fetchDocuments();

    expect(dmsService.fetchDocumentsByPolicyNo).toHaveBeenCalledWith(policyNo);
    expect(component.viewDocs).toEqual(policyDocuments);
    expect(component.tableDetails.rows).toEqual(policyDocuments);
  });

  it('should fetch claim documents and update viewDocs and tableDetails.rows', () => {
    const claimNo = '123456';
    jest.spyOn(dmsService, 'fetchDocumentsByClaimNo')

    component.currentTicket = { claimNumber: claimNo, systemModule: 'C' };
    component.fetchDocuments();

    expect(dmsService.fetchDocumentsByClaimNo).toHaveBeenCalledWith(claimNo);
    expect(component.viewDocs).toEqual(claimDocuments);
    expect(component.tableDetails.rows).toEqual(claimDocuments);
  });

  it('should toggle the document modal visibility', () => {
    const display = true;
    component.toggleDocumentModal(display);
    expect(component.documentModalVisible).toBe(display);
  });

  it('should set the selected document, preview it, and toggle the document modal', () => {
    const event: DynamicTableModalData<DmsDocument> = {
      showModal: true,
      value: policyDocuments[1]
    };

    const mockDocumentData: SingleDmsDocument = {
      docName: 'pinDoc.pdf',
      docMimetype: 'application/pdf',
      url:null,
      byteData: null
    };

    jest.spyOn(dmsService, 'getDocumentById').mockReturnValue(of(mockDocumentData));

    component.showModal(event);

    expect(component.selectedDocument).toEqual(event.value);
    expect(dmsService.getDocumentById).toHaveBeenCalledWith(policyDocuments[1]?.id);
    expect(component.selectedDocumentData).toEqual(mockDocumentData);
    expect(component.documentModalVisible).toBe(true);
  });

  it('should toggle the document modal visibility to false', () => {
    jest.spyOn(component, 'toggleDocumentModal');

    component.processActionEmitted(null);

    expect(component.toggleDocumentModal).toHaveBeenCalledWith(false);
    expect(component.documentModalVisible).toBe(false);
  });


});
