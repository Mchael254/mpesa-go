import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDocsComponent } from './entity-docs.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../../../../../shared/shared.module";
import {DmsService} from "../../../../../../shared/services/dms/dms.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {of} from "rxjs";
import {DmsDocument, SingleDmsDocument} from "../../../../../../shared/data/common/dmsDocument";


export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockAuthService {
  getCurrentUserName = jest.fn().mockReturnValue(of());
}

const MockUploadAgentDocs = {
  actualName: "Doc 1",
  userName: "JDoe",
  docType: "pdf",
  docData: "bfdyfbdkjf",
  originalFileName: "Doc 1",
  agentName: "John Doe",
  agentCode: "12343"
}

const clientDocuments : DmsDocument[]  =
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
  fetchDocumentsByClientCode = jest.fn().mockReturnValue(of());
  fetchDocumentsByAgentCode = jest.fn().mockReturnValue(of());
  fetchDocumentsByServiceProviderCode = jest.fn().mockReturnValue(of());
  getDocumentById = jest.fn();
  saveAgentDocs = jest.fn().mockReturnValue(of(MockUploadAgentDocs));
  deleteDocumentById = jest.fn().mockReturnValue(of());
}

describe('EntityDocsComponent', () => {
  let component: EntityDocsComponent;
  let fixture: ComponentFixture<EntityDocsComponent>;
  let globalMessagingServiceStub: GlobalMessagingService;
  let authServiceStub: AuthService;
  let dmsServiceStub: DmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntityDocsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      providers: [
        {provide: DmsService, useClass: MockDmsService},
        {provide: AuthService, useClass: MockAuthService},
        {provide: GlobalMessagingService, useClass: MockGlobalMessageService},
      ],
    });
    fixture = TestBed.createComponent(EntityDocsComponent);
    component = fixture.componentInstance;
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    authServiceStub = TestBed.inject(AuthService);
    dmsServiceStub = TestBed.inject(DmsService);
    component.partyAccountDetails = {partyType: {partyTypeName: "Client"}, accountCode: 1234};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set documentPayload and call uploadFile for selected Agent file', (done) => {
    component.partyAccountDetails = { partyType: { partyTypeName: 'Agent' }, accountCode: 123 };
    component.entityPartyIdDetails = { name: 'Test Agent' };

    const mockFile = new File(['file content'], 'test.pdf', { type: 'application/pdf' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event);

    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        expect(component.documentPayload).toEqual({
          actualName: 'test.pdf',
          userName: 'testUser',
          docType: 'application/pdf',
          docData: reader.result?.toString().split(',')[1],
          originalFileName: 'test.pdf',
          agentName: 'Test Agent',
          agentCode: '123'
        } as DmsDocument);

        expect(component.uploadFile).toHaveBeenCalled();

        done();
      }, 0);
    };
    reader.readAsDataURL(mockFile);
  });

  it('should display correct client payload and call uploadFile when partyType is Client', (done) => {
    component.partyAccountDetails = { partyType: { partyTypeName: 'Client' }, accountCode: 456 };
    component.entityPartyIdDetails = { name: 'Test Client' };

    const mockFile = new File(['file content'], 'test-client.pdf', { type: 'application/pdf' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event);

    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        expect(component.documentPayload).toEqual({
          actualName: 'test-client.pdf',
          userName: 'testUser',
          docType: 'application/pdf',
          docData: reader.result?.toString().split(',')[1],
          originalFileName: 'test-client.pdf',
          clientName: 'Test Client',
          clientCode: '456'
        } as DmsDocument);

        expect(component.uploadFile).toHaveBeenCalled();

        done();
      }, 0);
    };
    reader.readAsDataURL(mockFile);
  });

  it('should display correct service provider payload and call uploadFile when partyType is Service Provider', (done) => {
    component.partyAccountDetails = { partyType: { partyTypeName: 'Service Provider' }, accountCode: 456 };
    component.entityPartyIdDetails = { name: 'Test Service Provider' };

    const mockFile = new File(['file content'], 'test-Service Provider.pdf', { type: 'application/pdf' });
    const event = { target: { files: [mockFile] } } as unknown as Event;

    component.onFileSelected(event);

    const reader = new FileReader();
    reader.onload = () => {
      setTimeout(() => {
        expect(component.documentPayload).toEqual({
          actualName: 'test-Service Provider.pdf',
          userName: 'testUser',
          docType: 'application/pdf',
          docData: reader.result?.toString().split(',')[1],
          originalFileName: 'test-Service Provider.pdf',
          clientName: 'Test Service Provider',
          clientCode: '456'
        } as DmsDocument);

        expect(component.uploadFile).toHaveBeenCalled();

        done();
      }, 0);
    };
    reader.readAsDataURL(mockFile);
  });

  it('should delete the file and show success message', () => {
    const doc = { id: "123" };

    component.deleteUploadedFile(doc);

    setTimeout(() => {
      expect(dmsServiceStub.deleteDocumentById).toHaveBeenCalledWith(doc.id);

      expect(globalMessagingServiceStub.displaySuccessMessage).toHaveBeenCalledWith('Success', 'File deleted successfully!');
      expect(component.fetchDocuments).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Calling fetchDocuments...');

    });
  });

  it('should handle error during file deletion and call fetchDocuments', () => {
    const doc = { id: "123" };
    const mockError = { message: 'Delete failed' };

    component.deleteUploadedFile(doc);

    setTimeout(() => {
      expect(dmsServiceStub.deleteDocumentById).toHaveBeenCalledWith(doc.id);

      expect(console.error).toHaveBeenCalledWith('Error during document deletion:', mockError);

      expect(component.fetchDocuments).toHaveBeenCalled();

    });
  });

  it('should fetch client documents', () => {
    jest.spyOn(dmsServiceStub, 'fetchDocumentsByClientCode');

    component.partyAccountDetails = {partyType: {partyTypeName: "Client"}, accountCode: 1234};
    component.fetchDocuments();

    expect(dmsServiceStub.fetchDocumentsByClientCode).toHaveBeenCalledWith(component.partyAccountDetails.accountCode.toString());
    expect(component.viewAllDocs).toEqual([]);
  });
  it('should fetch agent documents', () => {
    jest.spyOn(dmsServiceStub, 'fetchDocumentsByAgentCode');

    component.partyAccountDetails = {partyType: {partyTypeName: "Agent"}, accountCode: 1234};
    component.fetchDocuments();

    expect(dmsServiceStub.fetchDocumentsByAgentCode).toHaveBeenCalledWith(component.partyAccountDetails.accountCode.toString());
    expect(component.viewAllDocs).toEqual([]);
  });
  it('should fetch service provider documents', () => {
    jest.spyOn(dmsServiceStub, 'fetchDocumentsByServiceProviderCode');

    component.partyAccountDetails = {partyType: {partyTypeName: "Service Provider"}, accountCode: 1234};
    component.fetchDocuments();

    expect(dmsServiceStub.fetchDocumentsByServiceProviderCode).toHaveBeenCalledWith(component.partyAccountDetails.accountCode.toString());
    expect(component.viewAllDocs).toEqual([]);
  });

  it('should set the selected document, preview it, and toggle the document modal', () => {

    const mockDocumentData: SingleDmsDocument = {
      docName: 'pinDoc.pdf',
      docMimetype: 'application/pdf',
      url:null,
      byteData: null
    };

    jest.spyOn(dmsServiceStub, 'getDocumentById').mockReturnValue(of(mockDocumentData));
    jest.spyOn(component, 'previewDocument');
    jest.spyOn(component, 'openDocViewerModal');

    component.fetchSelectedDoc();
    component.previewDocument(clientDocuments[1]?.id);

    expect(dmsServiceStub.getDocumentById).toHaveBeenCalledWith(clientDocuments[1]?.id);
  });

  it('should open doc viewer Modal', () => {
    component.openDocViewerModal();

    const modal = document.getElementById('docViewerToggle');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close doc viewer Modal', () => {
    const modal = document.getElementById('docViewerToggle');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDocViewerModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });
});
