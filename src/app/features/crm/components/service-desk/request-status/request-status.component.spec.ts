import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusComponent } from './request-status.component';
import {of, throwError} from "rxjs";
import {ServiceRequestStatusDTO} from "../../../data/service-request-dto";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {ServiceRequestService} from "../../../services/service-request.service";
import {RouterTestingModule} from "@angular/router/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from "@angular/core";

const mockMainStatusData = [
  'Pending', 'Closed'
]

const mockServiceRequestStatusData: ServiceRequestStatusDTO[] = [
  {
    srsCode: 0,
    srsName: '',
    srsShortDescription: '',
    srsMainStatus: ''
  }
]

export class MockServiceRequestService {
  getRequestStatus= jest.fn().mockReturnValue(of(mockServiceRequestStatusData));
  getMainStatus= jest.fn().mockReturnValue(of(mockMainStatusData));
  updateRequestStatus = jest.fn().mockReturnValue(of())
  createRequestStatus = jest.fn().mockReturnValue(of())
  deleteRequestStatus = jest.fn().mockReturnValue(of())
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('RequestStatusComponent', () => {
  let component: RequestStatusComponent;
  let fixture: ComponentFixture<RequestStatusComponent>;
  let messageServiceStub: GlobalMessagingService;
  let serviceRequestStub: ServiceRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestStatusComponent],
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
    fixture = TestBed.createComponent(RequestStatusComponent);
    component = fixture.componentInstance;
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    serviceRequestStub = TestBed.inject(ServiceRequestService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open request status Modal', () => {
    component.openServiceRequestStatusModal();

    const modal = document.getElementById('serviceRequestStatusModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  it('should close request status Modal', () => {
    const modal = document.getElementById('serviceRequestStatusModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeServiceRequestStatusModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  it('should fetch request status data', () => {
    jest.spyOn(serviceRequestStub, 'getRequestStatus');
    component.fetchMainStatus();
    expect(serviceRequestStub.getRequestStatus).toHaveBeenCalled();
    expect(component.requestStatusData).toEqual(mockServiceRequestStatusData);
  });

  it('should fetch main status data', () => {
    jest.spyOn(serviceRequestStub, 'getMainStatus');
    component.fetchMainStatus();
    expect(serviceRequestStub.getMainStatus).toHaveBeenCalled();
    expect(component.mainStatusData).toEqual(mockMainStatusData);
  });

  it('should save request status', () => {
    const button = fixture.debugElement.nativeElement.querySelector('#saveRequestStatus');
    button.click();
    fixture.detectChanges();
    expect(serviceRequestStub.createRequestStatus.call).toBeTruthy();
    expect(serviceRequestStub.createRequestStatus.call.length).toBe(1);
  });

  it('should delete when a request status is selected', () => {
    component.selectedRequestStatus = mockServiceRequestStatusData[0];
    const selectedStatus = mockServiceRequestStatusData[0].srsCode;

    const spydeleteRequestStatus = jest.spyOn(serviceRequestStub, 'deleteRequestStatus');

    const spydisplaySuccessMessage = jest.spyOn(messageServiceStub, 'displaySuccessMessage');

    const spydeleteStatus = jest.spyOn(component, 'deleteRequestStatus');
    component.deleteRequestStatus();

    const button = fixture.debugElement.nativeElement.querySelector('#deleteRequestStatus');
    button.click();

    expect(spydeleteStatus).toHaveBeenCalled();
    expect(spydeleteRequestStatus).toHaveBeenCalledWith(selectedStatus);
  });

  it('should throw error when delete request status fail', () => {
    const error = {
      error: { message: 'Failed'}
    };
    jest.spyOn(serviceRequestStub, 'deleteRequestStatus').mockReturnValueOnce(throwError(() => error));

    component.selectedRequestStatus = mockServiceRequestStatusData[0];
    const button = fixture.debugElement.nativeElement.querySelector('#deleteRequestStatus');
    button.click();
    fixture.detectChanges();
    expect(component.deleteRequestStatus.call).toBeTruthy();
  });

  it('should open the request status modal and set form values when a request status is selected', () => {
    const mockSelectedServiceRequestStatus = mockServiceRequestStatusData[0];
    component.selectedRequestStatus = mockSelectedServiceRequestStatus;
    const spyOpenServiceRequestStatusModal = jest.spyOn(component, 'openServiceRequestStatusModal');
    const patchValueSpy = jest.spyOn(
      component.serviceRequestStatusForm,
      'patchValue'
    );

    component.editRequestStatus();

    expect(spyOpenServiceRequestStatusModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      name: mockSelectedServiceRequestStatus.srsName,
      shtDesc: mockSelectedServiceRequestStatus.srsShortDescription,
      status: mockSelectedServiceRequestStatus.srsMainStatus
    });
  });
});
