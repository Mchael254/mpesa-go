import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsUploadComponent } from './documents-upload.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DmsService } from "../../../../../service/dms/dms.service";
import { of } from 'rxjs';
import { SessionStorageService } from "../../../../../../../shared/services/session-storage/session-storage.service";
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientService } from "../../../../../../entities/services/client/client.service";
import { ToastService } from "../../../../../../../shared/services/toast/toast.service";
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

export class MockDmsService {
  getClientDocumentById = jest.fn().mockReturnValue(of([{ type: 'document_type', id: 221243799 }]));
  saveClientDocument = jest.fn().mockReturnValue(of({ type: 'document_type' }));
  deleteDocumentById = jest.fn().mockReturnValue(of({}));
}

class MockSessionStorageService {
  get = jest.fn().mockReturnValue({ client_code: 'mockClientCode' });
}

class MockToastService {
  success = jest.fn();
  danger = jest.fn();
  info = jest.fn();
}

class MockNgxSpinnerService {
  show = jest.fn();
  hide = jest.fn();
}

class MockClientService {
  getclientRequiredDocuments = jest.fn().mockReturnValue(of([{ description: 'document_type' }]));
}

describe('DocumentsUploadComponent', () => {
  let component: DocumentsUploadComponent;
  let fixture: ComponentFixture<DocumentsUploadComponent>;
  let dms_service: DmsService;
  let session_storage: SessionStorageService;
  let crm_client_service: ClientService;
  let toast_service: ToastService;
  let spinner_service: NgxSpinnerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsUploadComponent],
      imports: [
        HttpClientTestingModule, 
        TranslateModule.forRoot(),
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: DmsService, useClass: MockDmsService },
        { provide: SessionStorageService, useClass: MockSessionStorageService },
        { provide: ToastService, useClass: MockToastService },
        { provide: NgxSpinnerService, useClass: MockNgxSpinnerService },
        { provide: ClientService, useClass: MockClientService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DocumentsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dms_service = TestBed.inject(DmsService);
    session_storage = TestBed.inject(SessionStorageService);
    crm_client_service = TestBed.inject(ClientService);
    toast_service = TestBed.inject(ToastService);
    spinner_service = TestBed.inject(NgxSpinnerService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get documents by client ID on initialization', () => {
  const mockClientCode = '12345';
  session_storage.get = jest.fn().mockReturnValue({ client_code: mockClientCode }); // Mocking session storage
  jest.spyOn(dms_service, 'getClientDocumentById');
  component.ngOnInit();
  expect(dms_service.getClientDocumentById).toHaveBeenCalledWith(1); // Match the dynamic value
});

  it('should handle document upload', () => {
    const eventMock = {
      target: { files: [new File([''], 'test.pdf')] },
    };
    jest.spyOn(dms_service, 'saveClientDocument').mockReturnValue(of({ type: 'document_type' }));
    jest.spyOn(toast_service, 'success');
    component.uploadFile(eventMock, 'document_type');
    expect(spinner_service.show).toHaveBeenCalled();
    expect(dms_service.saveClientDocument).toHaveBeenCalled();
    expect(toast_service.success).toHaveBeenCalledWith('Successfully uploaded document_type\'s document', 'Document Upload');
    expect(spinner_service.hide).toHaveBeenCalled();
  });

  it('should handle document deletion', () => {
    jest.spyOn(dms_service, 'deleteDocumentById').mockReturnValue(of({}));
    jest.spyOn(toast_service, 'success');
    const documentMock = { id: 1, type: 'document_type' };
    component.deleteDocumentFileById(documentMock, 0);
    expect(spinner_service.show).toHaveBeenCalled();
    expect(dms_service.deleteDocumentById).toHaveBeenCalledWith('');
    expect(toast_service.success).toHaveBeenCalledWith('Deleted document_type\'s document', 'Document Upload');
    expect(spinner_service.hide).toHaveBeenCalled();
  });

  it('should validate documents', () => {
    component.documentList = [
      { is_uploaded: true },
      { is_exempt: true },
      { upload_later: true },
    ];
    component.requiredDocuments = [{}, {}, {}];
    expect(component.validateDocument()).toBe(true);
  });

  it('should navigate to the next page if all documents are valid', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    jest.spyOn(component, 'validateDocument').mockReturnValue(true);
    component.nextPage();
    expect(toast_service.success).toHaveBeenCalledWith('Successfully completed the document process', 'Document Upload');
    expect(navigateSpy).toHaveBeenCalledWith(['/home/lms/ind/quotation/product']);
  });

  it('should show error if documents are not valid', () => {
    jest.spyOn(component, 'validateDocument').mockReturnValue(false);
    component.nextPage();
    expect(toast_service.danger).toHaveBeenCalledWith('All required documents must be uploaded, exempted, or marked for later upload', 'Document Upload');
  });

  it('should handle document exemption', () => {
    const document = { description: 'test_doc', is_exempt: false };
    component.handleExempt(document);
    expect(document.is_exempt).toBe(true);
    expect(toast_service.info).toHaveBeenCalledWith('test_doc marked as exempt', 'Document Upload');
  });

  it('should handle upload later', () => {
    const document = { description: 'test_doc', upload_later: false };
    component.handleUploadLater(document);
    expect(document.upload_later).toBe(true);
    expect(toast_service.info).toHaveBeenCalledWith('test_doc marked for later upload', 'Document Upload');
  });
});
