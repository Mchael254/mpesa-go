import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCategoriesComponent } from './request-categories.component';
import {of, throwError} from "rxjs";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ServiceRequestService} from "../../../services/service-request.service";
import {SystemsService} from "../../../../../shared/services/setups/systems/systems.service";
import {createSpyObj} from "jest-createspyobj";
import {MandatoryFieldsDTO} from "../../../../../shared/data/common/mandatory-fields-dto";
import {ServiceRequestCategoryDTO, ServiceRequestIncidentDTO} from "../../../data/service-request-dto";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {SystemsDto} from "../../../../../shared/data/common/systemsDto";

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

const mockServiceRequestCategoryData: ServiceRequestCategoryDTO[] = [
  {
    id: 0,
    desc: '',
    shtDesc: '',
    usrCode: 0,
  }
]

const mockServiceRequestIncidentData: ServiceRequestIncidentDTO[] = [
  {
    id: 0,
    name: '',
    validity: 0,
    userCode: 0,
    branchCode: 0,
    requestTypeCode: 0,
    isDefault: '',
  }
]

const mockSystem: SystemsDto[] = [
  {
    "id": 1,
    "shortDesc": "GIS",
    "systemName": "General Insurance"
  }
]

export class MockServiceRequestService {
  getRequestCategory= jest.fn().mockReturnValue(of(mockServiceRequestCategoryData));
  getRequestIncidents= jest.fn().mockReturnValue(of(mockServiceRequestIncidentData));
  updateRequestCategory = jest.fn().mockReturnValue(of())
  createRequestCategory = jest.fn().mockReturnValue(of())
  deleteRequestCategory = jest.fn().mockReturnValue(of())
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

export class MockSystemsService {
  getSystems = jest.fn().mockReturnValue(of());
}


describe('RequestCategoriesComponent', () => {
  let component: RequestCategoriesComponent;
  let fixture: ComponentFixture<RequestCategoriesComponent>;
  let messageServiceStub: GlobalMessagingService;
  let serviceRequestStub: ServiceRequestService;
  let systemsServiceStub: SystemsService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;

  const mandatoryFieldServiceStub = createSpyObj('MandatoryFieldsService', ['getMandatoryFieldsByGroupId'])
  beforeEach(() => {
    jest.spyOn(mandatoryFieldServiceStub, 'getMandatoryFieldsByGroupId').mockReturnValue(of([mandatoryField]));

    TestBed.configureTestingModule({
      declarations: [RequestCategoriesComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: ServiceRequestService, useClass: MockServiceRequestService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
        { provide: MandatoryFieldsService, useValue: mandatoryFieldServiceStub },
        { provide: SystemsService, useClass: MockSystemsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(RequestCategoriesComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    serviceRequestStub = TestBed.inject(ServiceRequestService);
    systemsServiceStub = TestBed.inject(SystemsService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open request escalation Modal', () => {
    component.openRequestEscalationModal();

    const modal = document.getElementById('requestEscalationModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close request escalation Modal', () => {
    const modal = document.getElementById('requestEscalationModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeRequestEscalationModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should open request category Modal', () => {
    component.openServiceRequestCategoryModal();

    const modal = document.getElementById('serviceRequestCategoryModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close request category Modal', () => {
    const modal = document.getElementById('serviceRequestCategoryModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeServiceRequestCategoryModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should fetch systems data', () => {
    jest.spyOn(systemsServiceStub, 'getSystems').mockReturnValue(of(mockSystem));
    component.ngOnInit();
    component.getAllSystems();
    expect(systemsServiceStub.getSystems).toHaveBeenCalled();
    expect(component.systems).toEqual(mockSystem);
  });

  it('should fetch request incidents data', () => {
    jest.spyOn(serviceRequestStub, 'getRequestIncidents');
    component.fetchServiceIncidents();
    expect(serviceRequestStub.getRequestIncidents).toHaveBeenCalled();
    expect(component.incidentsData).toEqual(mockServiceRequestIncidentData);
  });

  it('should fetch request categories data', () => {
    jest.spyOn(serviceRequestStub, 'getRequestCategory');
    component.fetchServiceCategory();
    expect(serviceRequestStub.getRequestCategory).toHaveBeenCalled();
    expect(component.requestCategoriesData).toEqual(mockServiceRequestCategoryData);
  });

  it('should save request category', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveRequestCategory');
    button.click();
    fixture.detectChanges();
    expect(serviceRequestStub.createRequestCategory.call).toBeTruthy();
    expect(serviceRequestStub.createRequestCategory.call.length).toBe(1);
  });

  it('should delete when a request category is selected', () => {
    component.selectedRequestCategory = mockServiceRequestCategoryData[0];
    const selectedCategory = mockServiceRequestCategoryData[0].id;

    const spydeleteRequestCategory = jest.spyOn(serviceRequestStub, 'deleteRequestCategory');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteCategory = jest.spyOn(component, 'deleteRequestCategory');
    component.deleteRequestCategory();

    const button = fixture.debugElement.nativeElement.querySelector('#deleteRequestCategory');
    button.click();

    expect(spydeleteCategory).toHaveBeenCalled();
    expect(spydeleteRequestCategory).toHaveBeenCalledWith(selectedCategory);
  });

  it('should throw error when delete request category fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(serviceRequestStub, 'deleteRequestCategory').mockReturnValueOnce(throwError(() => error));

    component.selectedRequestCategory = mockServiceRequestCategoryData[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteRequestCategory');
    button.click();
    fixture.detectChanges();
    expect(component.deleteRequestCategory.call).toBeTruthy();
  });
});
