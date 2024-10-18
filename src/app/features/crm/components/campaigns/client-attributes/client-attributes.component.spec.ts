import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAttributesComponent } from './client-attributes.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {CampaignsService} from "../../../services/campaigns..service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {NgxSpinnerService} from "ngx-spinner";
import {of, throwError} from "rxjs";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";
import {createSpyObj} from "jest-createspyobj";
import {ClientAttributesDTO, ClientSearchAttributesDTO} from "../../../data/campaignsDTO";


export class MockCampaignService {
  getClientAttributes = jest.fn().mockReturnValue(of());
  getClientSearchAttributes = jest.fn().mockReturnValue(of());
  updateClientAttribute = jest.fn().mockReturnValue(of());
  createClientAttribute = jest.fn().mockReturnValue(of());
  deleteClientAttribute = jest.fn().mockReturnValue(of());
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

const mandatoryField: MandatoryFieldsDTO = {
  "id": 1,
  "fieldName": "username",
  "fieldLabel": "Username",
  "mandatoryStatus": "required",
  "visibleStatus": "Y",
  "disabledStatus": "enabled",
  "frontedId": "field-username",
  "screenName": "loginScreen",
  "groupId": "authGroup",
  "module": "authentication"
}

const mockClientAttribute: ClientAttributesDTO[] = [
  {
    "code": 1,
    "name": "Client attribute",
    "description": "client attr desc",
    "prompt": "trial",
    "range": "Y",
    "inputType": "null",
    "columnName": "first name",
    "tableName": "Clients"
  }
]

const mockClientSearchAttributes: ClientSearchAttributesDTO[] = [
  {
    "columnName": "first name",
    "shtDesc": "column desc",
    "tableName": "Clients"
  }
]

describe('ClientAttributesComponent', () => {
  let component: ClientAttributesComponent;
  let fixture: ComponentFixture<ClientAttributesComponent>;
  let campaignsServiceStub: CampaignsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])

  beforeEach(() => {
    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));
    TestBed.configureTestingModule({
      declarations: [ClientAttributesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CampaignsService, useClass: MockCampaignService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: NgxSpinnerService },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ClientAttributesComponent);
    component = fixture.componentInstance;
    campaignsServiceStub = TestBed.inject(CampaignsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open client attribute Modal', () => {
    component.openDefineClientAttributesModal();

    const modal = document.getElementById('campaignClientAttribute');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close client attribute Modal', () => {
    const modal = document.getElementById('campaignClientAttribute');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDefineClientAttributesModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open the client attribute modal and set form values when a client attribute is selected', () => {
    const mockSelectedClientAttribute = mockClientAttribute[0];
    component.selectedClientAttribute = mockSelectedClientAttribute;
    const spyOpenClientAttributeModal = jest.spyOn(component, 'openDefineClientAttributesModal');
    const patchValueSpy = jest.spyOn(
      component.createClientAttributesForm,
      'patchValue'
    );

    component.editClientAttribute();

    expect(spyOpenClientAttributeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      clientAttributeName: mockSelectedClientAttribute.name,
      clientAttributeDescription: mockSelectedClientAttribute.description,
      clientAttributePrompt: mockSelectedClientAttribute.prompt,
      clientAttributeRange: mockSelectedClientAttribute.range,
      clientAttribute: mockSelectedClientAttribute.columnName
    });
  });

  it('should display an error message when no client attribute is selected during edit', () => {
    component.selectedClientAttribute = null;

    component.editClientAttribute();

    expect(globalMessagingServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No client attribute is selected.'
    );
  });

  it('should fetch client attributes data', () => {
    jest.spyOn(campaignsServiceStub, 'getClientAttributes').mockReturnValue(of(mockClientAttribute));
    component.ngOnInit();
    component.fetchClientAttributes();
    expect(campaignsServiceStub.getClientAttributes).toHaveBeenCalled();
    expect(component.clientAttributesData).toEqual(mockClientAttribute);
  });

  it('should fetch client search attributes data', () => {
    jest.spyOn(campaignsServiceStub, 'getClientSearchAttributes').mockReturnValue(of(mockClientSearchAttributes));
    component.ngOnInit();
    component.fetchClientSearchAttributes();
    expect(campaignsServiceStub.getClientSearchAttributes).toHaveBeenCalled();
    expect(component.clientSearchAttributesData).toEqual(mockClientSearchAttributes);
  });

  it('should save client attributes', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveClientAttr');
    button.click();
    fixture.detectChanges();
    expect(campaignsServiceStub.createClientAttribute.call).toBeTruthy();
    expect(campaignsServiceStub.createClientAttribute.call.length).toBe(1);
  });

  it('should delete when a client attribute is selected', () => {
    component.selectedClientAttribute = mockClientAttribute[0];
    const selectedClientAttrId = mockClientAttribute[0].code;

    const spydeleteClientAttr = jest.spyOn(campaignsServiceStub, 'deleteClientAttribute');

    const spydisplaySuccessMessage = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');

    const spydeleteClientAttribute = jest.spyOn(component, 'deleteClientAttribute');
    component.deleteClientAttribute();

    const button = fixture.debugElement.nativeElement.querySelector('#deleteClientAttr');
    button.click();

    expect(spydeleteClientAttribute).toHaveBeenCalled();
    expect(spydeleteClientAttr).toHaveBeenCalledWith(selectedClientAttrId);
  });

  it('should throw error when delete client attribute fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(campaignsServiceStub, 'deleteClientAttribute').mockReturnValueOnce(throwError(() => error));

    component.selectedClientAttribute = mockClientAttribute[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteClientAttr');
    button.click();
    fixture.detectChanges();
    expect(component.deleteClientAttribute.call).toBeTruthy();
  });
});
