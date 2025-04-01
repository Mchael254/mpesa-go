import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTrackingComponent } from './request-tracking.component';
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {of} from "rxjs";
import {ServiceRequestService} from "../../../services/service-request.service";
import {ServiceRequestsDTO} from "../../../data/service-request-dto";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";
import {TranslateModule} from "@ngx-translate/core";

const mockServiceRequestDTO: ServiceRequestsDTO[] = [
  {
    id: 0,
    accCode: 0,
    accType: '',
    assignee: 0,
    captureDate: '',
    captureDateAlternate: '',
    clientStatus: '',
    closedBy: '',
    communicationMode: '',
    communicationModeValue: '',
    comments: '',
    date: '',
    desc: '',
    dueDate: '',
    endorsementCode: 0,
    initiator: '',
    incidentCode: 0,
    ownerCode: 0,
    ownerType: '',
    policyNo: '',
    receiveDate: '',
    refNumber: '',
    reminder: '',
    reopennedDate: '',
    reporter: '',
    requestDate: '',
    resolutionDate: '',
    secondaryCommunicationMode: '',
    secondaryCommunicationModeValue: '',
    solution: '',
    statusCode: 0,
    categoryCode: 0,
    mainStatus: '',
    stsCode: 0,
    summary: '',
    tcbCode: 0,
    timeOfCommunication: '',
    source: '',
  }
]

const mockMainStatusData = [
  'Pending', 'Closed'
]

const mockRequestAccTypesData = [
  'Client', 'Agent'
]

export class MockServiceRequestService {
  getServiceRequests= jest.fn().mockReturnValue(of(mockServiceRequestDTO));
  getMainStatus= jest.fn().mockReturnValue(of(mockMainStatusData));
  getRequestAccTypes= jest.fn().mockReturnValue(of(mockRequestAccTypesData));
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('RequestTrackingComponent', () => {
  let component: RequestTrackingComponent;
  let fixture: ComponentFixture<RequestTrackingComponent>;
  let messageServiceStub: GlobalMessagingService;
  let serviceRequestStub: ServiceRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestTrackingComponent],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(RequestTrackingComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    serviceRequestStub = TestBed.inject(ServiceRequestService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getServiceRequests when fetchServiceRequests is called', () => {
    const event = {
      first: 0,
      rows: 10,
      sortOrder: 1,
    };
    component.fetchServiceRequests(event);
    expect(serviceRequestStub.getServiceRequests).toHaveBeenCalledTimes(2);
    expect(serviceRequestStub.getServiceRequests).toHaveBeenCalledWith(0, 10, 'desc');
  });

  it('should call requestTrackingFilters when isFiltering is true', () => {
    component.isFiltering = true;
    const event = {
      first: 0,
      rows: 10,
      sortOrder: 1,
    };
    const spyFilter = jest.spyOn(component, 'requestTrackingFilters');
    component.fetchServiceRequests(event);
    expect(spyFilter).toHaveBeenCalledTimes(1);
  });

  /*it('should display error message when getServiceRequests returns error', () => {
    const event = {
      first: 0,
      rows: 10,
      sortOrder: 1,
    };
    component.fetchServiceRequests(event);
    serviceRequestStub.getServiceRequests.mockRejectedValue({ error: 'Error message' });
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledTimes(1);
    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith('Error', 'Error message');
  });*/

  it('should fetch main status data', () => {
    jest.spyOn(serviceRequestStub, 'getMainStatus');
    component.fetchMainStatus();
    expect(serviceRequestStub.getMainStatus).toHaveBeenCalled();
    expect(component.mainStatusData).toEqual(mockMainStatusData);
  });

  it('should fetch request account types data', () => {
    jest.spyOn(serviceRequestStub, 'getRequestAccTypes');
    component.fetchRequestAccountTypes();
    expect(serviceRequestStub.getRequestAccTypes).toHaveBeenCalled();
    expect(component.requestAccTypesData).toEqual(mockRequestAccTypesData);
  });

  it('should open all users modal', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '.open-all-users-modal'
    );
    button.click();
    fixture.detectChanges();
    expect(component.openAllUsersModal.call).toBeTruthy();
  });

  it('should process selected user', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      '#process-selected-user'
    );
    button.click();
    fixture.detectChanges();
    expect(component.processSelectedUser.call).toBeTruthy();
  });

  it('should get selected user', () => {
    const button =
      fixture.debugElement.nativeElement.querySelector('#get-selected-user');
    button.click();
    fixture.detectChanges();
    expect(component.getSelectedUser.call).toBeTruthy();
  });

  it('should open request tracking Modal', () => {
    component.openRequestTrackingModal();

    const modal = document.getElementById('requestTrackingModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close request tracking Modal', () => {
    const modal = document.getElementById('requestTrackingModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeServiceRequestTrackingModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should patch request tracking form with request tracking values when viewRequest is called', () => {
    const requestTracking = {
      categoryCode: 'Category 1',
      incidentCode: 'Incident 1',
      source: 'Source 1',
      accType: 'Acc Type 1',
      accountDto: { name: 'Account 1' },
      summary: 'Summary 1',
      requestDate: '2022-01-01T00:00:00.000Z',
      dueDate: '2022-01-15T00:00:00.000Z',
      desc: 'Description 1',
      assigneeDto: { name: 'Assignee 1' },
      ownerDto: { name: 'Owner 1' },
      ownerType: 'Owner Type 1',
      statusDto: { srsName: 'Status 1' },
      resolutionDate: '2022-01-20T00:00:00.000Z',
      solution: 'Solution 1',
      comments: 'Comments 1',
    };
    component.viewRequest(requestTracking);
    expect(component.requestTrackingForm.value).toEqual({
      categoryType: 'Category 1',
      requestIncidence: 'Incident 1',
      requestSource: 'Source 1',
      accType: 'Acc Type 1',
      acc: 'Account 1',
      summary: 'Summary 1',
      requestDate: '01/01/2022',
      dueDate: '01/15/2022',
      desc: 'Description 1',
      assignee: 'Assignee 1',
      owner: 'Owner 1',
      ownerAccType: 'Owner Type 1',
      status: 'Status 1',
      resDate: '01/20/2022',
      solution: 'Solution 1',
      comments: 'Comments 1',
    });
  });

});
