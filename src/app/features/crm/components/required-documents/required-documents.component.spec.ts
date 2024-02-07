import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { of } from 'rxjs';

import { RequiredDocumentsComponent } from './required-documents.component';
import { SharedModule } from '../../../../shared/shared.module';
import { RequiredDocumentsService } from '../../services/required-documents.service';
import { EntityService } from '../../../../features/entities/services/entity/entity.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { HttpClientModule } from '@angular/common/http';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { PartyTypeDto } from '../../../../features/entities/data/partyTypeDto';
import { RequiredDocumentDTO } from '../../data/required-document';

const mockDocumentData: RequiredDocumentDTO[] = [
  {
    accountType: '',
    dateSubmitted: '',
    description: '',
    id: 0,
    isMandatory: '',
    organizationId: 0,
    organizationName: '',
    shortDescription: '',
  },
];

const mockPartyAccountData: PartyTypeDto[] = [
  {
    id: 0,
    organizationId: 0,
    partyTypeLevel: 0,
    partyTypeName: '',
    partyTypeShtDesc: '',
    partyTypeVisible: '',
  },
];

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'description',
    screenName: '',
    groupId: '',
    module: '',
  },
];

export class MockRequiredDocumentsService {
  getAllDataByClientType = jest.fn().mockReturnValue(of());
  getRequiredDocuments = jest.fn().mockReturnValue(of(mockDocumentData));
  createRequiredDocument = jest.fn().mockReturnValue(of());
  updateRequiredDocument = jest.fn().mockReturnValue(of());
  deleteRequiredDocuments = jest.fn().mockReturnValue(of());
}

export class MockEntityService {
  getPartiesType = jest.fn().mockReturnValue(of(mockPartyAccountData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockGlobalMessagingService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('RequiredDocumentsComponent', () => {
  let component: RequiredDocumentsComponent;
  let fixture: ComponentFixture<RequiredDocumentsComponent>;
  let documentServiceStub: RequiredDocumentsService;
  let entityServiceStub: EntityService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequiredDocumentsComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        {
          provide: RequiredDocumentsService,
          useClass: MockRequiredDocumentsService,
        },
        {
          provide: EntityService,
          useClass: MockEntityService,
        },
        {
          provide: MandatoryFieldsService,
          useClass: MockMandatoryService,
        },
        {
          provide: GlobalMessagingService,
          useClass: MockGlobalMessagingService,
        },
      ],
    });
    fixture = TestBed.createComponent(RequiredDocumentsComponent);
    component = fixture.componentInstance;
    documentServiceStub = TestBed.inject(RequiredDocumentsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    entityServiceStub = TestBed.inject(EntityService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch party type data', () => {
    jest.spyOn(entityServiceStub, 'getPartiesType');
    component.getAccountType();
    expect(entityServiceStub.getPartiesType).toHaveBeenCalled();
    expect(component.accounts).toEqual(mockPartyAccountData);
  });

  test('should fetch required document data', () => {
    jest.spyOn(documentServiceStub, 'getRequiredDocuments');
    component.fetchRequiredDocuments();
    expect(documentServiceStub.getRequiredDocuments).toHaveBeenCalled();
    expect(component.documentsData).toEqual(mockDocumentData);
  });

  test('should open Document Modal', () => {
    component.openDocumentModal();

    const modal = document.getElementById('documentModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Document Modal', () => {
    const modal = document.getElementById('documentModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDocumentModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open Assign Document Modal', () => {
    component.openAssignDocumentModal();

    const modal = document.getElementById('assignDocumentModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close Assign Document Modal', () => {
    const modal = document.getElementById('assignDocumentModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeAssignDocumentModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should filter documets on filterDocuments', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.documentTable, 'filterGlobal');

    component.filterDocuments(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter assign documets on filterAssignDocuments', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.assignDocumentTable,
      'filterGlobal'
    );

    component.filterAssignDocuments(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });
});
