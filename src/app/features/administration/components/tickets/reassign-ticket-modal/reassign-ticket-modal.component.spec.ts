import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignTicketModalComponent } from './reassign-ticket-modal.component';
import {
  DynamicSimpleModalComponent
} from "../../../../../shared/components/dynamic-simple-modal/dynamic-simple-modal.component";
import {StaffModalComponent} from "../../../../entities/components/staff/staff-modal/staff-modal.component";
import {RouterTestingModule} from "@angular/router/testing";
import {TableModule} from "primeng/table";
import {NgxSpinnerModule} from "ngx-spinner";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {TicketsService} from "../../../services/tickets.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {of} from "rxjs";

class MockGlobalMessagingService {
  displayErrorMessage = jest.fn();
  displaySuccessMessage = jest.fn();
}

class MockStaffService {
  getStaffByGroup = jest.fn().mockReturnValue([]);
}

class MockTicketService {
  reassignTickets = jest.fn().mockReturnValue(of({
    message: "Success",
    status: "200",
    embedded: null
  }))
}

describe('ReassignTicketModalComponent', () => {
  let component: ReassignTicketModalComponent;
  let staffServiceStub: Partial<StaffService>;
  let ticketServiceStub: TicketsService;
  let globalMessagingServiceStub: GlobalMessagingService;

  let fixture: ComponentFixture<ReassignTicketModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TableModule,NgxSpinnerModule.forRoot(), HttpClientTestingModule,
        FormsModule, ReactiveFormsModule, NoopAnimationsModule],
      declarations: [ReassignTicketModalComponent, DynamicSimpleModalComponent, StaffModalComponent],
      providers: [
        {provide:StaffService, useClass: MockStaffService},
        {provide: TicketsService, useClass: MockTicketService},
        {provide: GlobalMessagingService, useClass: MockGlobalMessagingService},
        FormBuilder
      ]
    });
    fixture = TestBed.createComponent(ReassignTicketModalComponent);
    staffServiceStub = TestBed.inject(StaffService);
    ticketServiceStub = TestBed.inject(TicketsService);
    globalMessagingServiceStub = TestBed.inject(GlobalMessagingService);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form and set required fields', () => {
    jest.spyOn(component, 'createReassignTicketsForm');
    jest.spyOn(component, 'setRequiredFields');

    component.ngOnInit();

    const modalUserAssignTo =  component.reassignTicketForm.controls['modalUserAssignTo'];

    expect(component.showDefaultUser).toBeFalsy();
    expect(component.createReassignTicketsForm).toHaveBeenCalled();
    expect(component.reassignTicketForm).toBeTruthy();

    // expect(modalUserAssignTo.).toBeTruthy();
    expect(component.reassignTicketForm.controls['modalDefaultGroupUser'].disabled).toBeTruthy();
    expect(component.reassignTicketForm.controls['modalTicketComments']).toBeTruthy();

    modalUserAssignTo.setValue(null);
    expect(modalUserAssignTo.hasError('required')).toBeTruthy();
  });

  it('should open the all users modal', () => {
    component.openAllUsersModal();
    expect(component.allUsersModalVisible).toBeTruthy();
    expect(component.zIndex).toEqual(-1);
  });

});
