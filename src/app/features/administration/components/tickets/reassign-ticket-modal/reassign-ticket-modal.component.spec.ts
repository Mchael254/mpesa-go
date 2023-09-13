import {ComponentFixture, ComponentFixtureAutoDetect, TestBed} from '@angular/core/testing';

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
import {NewTicketDto} from "../../../data/ticketsDTO";
import {GeneralTicketApiResponse} from "../../../data/generalTicketApiResponse";
import {StaffDto} from "../../../../entities/data/StaffDto";

class MockGlobalMessagingService {
  displayErrorMessage = jest.fn();
  displaySuccessMessage = jest.fn();
}

class MockStaffService {
  getStaffByGroup = jest.fn().mockReturnValue([]);
  getStaff = jest.fn().mockReturnValue(of([]));
}

class MockTicketService {
  reassignTickets = jest.fn().mockReturnValue(of({
    message: "Success",
    status: "200",
    embedded: null
  }))
}

const mockTickets: NewTicketDto[] = [
  {
    intermediaryName: "Intermediary A",
    clientName: "Client A",
    ticketAssignee: "Assignee A",
    ticketID: 1,
    createdOn: "2022-01-01",
    refNo: "REF001",
    ticketFrom: "From A",
    ticketName: "Ticket A",
    ticketSystem: "System A",
    policyCode: 123,
    policyNumber: "POL001",
    ticketBy: "User A",
    ticketDate: "2022-01-01",
    ticketDueDate: "2022-01-10",
    ticketRemarks: "Remarks A",
    quotationNo: "QUO001",
    claimNo: "CLM001",
    systemModule: "Module A",
    claimNumber: "CLM001",
    renewalDate: "2023-01-01",
    endorsementNumber: "END001",
    endorsementRemarks: "Endorsement Remarks A",
    quotationNumber: "QUO001"
  },
  {
    intermediaryName: "Intermediary B",
    clientName: "Client B",
    ticketAssignee: "Assignee B",
    ticketID: 2,
    createdOn: "2022-02-01",
    refNo: "REF002",
    ticketFrom: "From B",
    ticketName: "Ticket B",
    ticketSystem: "System B",
    policyCode: 456,
    policyNumber: "POL002",
    ticketBy: "User B",
    ticketDate: "2022-02-01",
    ticketDueDate: "2022-02-10",
    ticketRemarks: "Remarks B",
    quotationNo: "QUO002",
    claimNo: "CLM002",
    systemModule: "Module B",
    claimNumber: "CLM002",
    renewalDate: "2023-02-01",
    endorsementNumber: "END002",
    endorsementRemarks: "Endorsement Remarks B",
    quotationNumber: "QUO002"
  }
];

const selectedDefaultUser: StaffDto = {
  id: 190, name: "Jane Doe", organizationGroupId: 2, status: "A", userType: "U", username: "jane.doe"
};

const selectedMainUser: StaffDto = {
  id: 234, name: "John Doe", organizationGroupId: 2, status: "A", userType: "U", username: "john.doe"
};

describe('ReassignTicketModalComponent', () => {
  let component: ReassignTicketModalComponent;
  let staffServiceStub: Partial<StaffService>;
  let ticketServiceStub: TicketsService;
  let globalMessagingServiceStub: GlobalMessagingService;
  let fb: FormBuilder;

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
        {provide: ComponentFixtureAutoDetect, useValue: true },
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
    modalUserAssignTo.updateValueAndValidity();
    // expect(modalUserAssignTo.hasError('required')).toBeTruthy();
  });

  it('should open the all users modal', () => {
    component.openAllUsersModal();
    expect(component.allUsersModalVisible).toBeTruthy();
    expect(component.zIndex).toEqual(-1);
  });

  it('should call clearReassignModalFields when the Cancel button is clicked', () => {
    component.openAllUsersModal();

    // Arrange
    jest.spyOn(component, 'clearReassignModalFields');
    jest.spyOn(component.actionReassignEmitter, 'emit');
    jest.spyOn(component.reassignTicketForm, 'reset');

    // Act
    const cancelButton = fixture.nativeElement.querySelector('#cancelReassignBtn');
    cancelButton.click();

    // Assert
    expect(component.clearReassignModalFields).toHaveBeenCalled();
    expect(component.reassignModalVisible).toBe(false);
    expect(component.reassignTicketForm.reset).toHaveBeenCalled();

  });

  it('should reassign tickets(s) when the Reassign button is clicked', () => {
    const mockApiResponse: GeneralTicketApiResponse = {
      embedded: {},
      message: "Successfully reassigned ticket",
      status: "200"
    };

    // Arrange
    jest.spyOn(component, 'reassignTicket');
    const ticketReassignSpy = jest.spyOn(ticketServiceStub, 'reassignTickets').mockReturnValue(of(mockApiResponse));
    const displaySuccessMessageSpy = jest.spyOn(globalMessagingServiceStub, 'displaySuccessMessage');
    const resetSpy = jest.spyOn(component.reassignTicketForm, 'reset')
    const emitSpy =jest.spyOn(component.reassignedTickets, 'emit');


    // Act
    component.selectedTickets = mockTickets;
    component.selectedDefaultUser = selectedDefaultUser;
    component.selectedMainUser = selectedMainUser;

    component.reassignTicketForm.controls['modalUserAssignTo'].setValue('User A');
    component.reassignTicketForm.controls['modalTicketComments'].setValue('Sample comments');


    const reassignButton = fixture.nativeElement.querySelector('#reassignTktBtn');
    reassignButton.click();

    // Assert
    expect(component.reassignTicket).toHaveBeenCalled();
    expect(component.reassignTicketForm.valid).toBeTruthy();
    expect(component.selectedTickets.length).toBeGreaterThan(0);
    expect(ticketReassignSpy).toHaveBeenCalledWith([
      {
        ticketCode: 1,
        groupUser: selectedDefaultUser?.username,
        remarks: 'Sample comments',
        userCodeToAssignFrom: null,
        userCodeToAssignTo: selectedMainUser?.id
      },
      {
        ticketCode: 2,
        groupUser: selectedDefaultUser?.username,
        remarks: 'Sample comments',
        userCodeToAssignFrom: null,
        userCodeToAssignTo: selectedMainUser?.id
      }
    ]);
    expect(displaySuccessMessageSpy).toHaveBeenCalledWith('Success', mockApiResponse?.message);
    expect(resetSpy).toHaveBeenCalled();
    expect(component.reassignModalVisible).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should emit actionReassignEmitter event, toggle reassignModalVisible, and call clearForm method', () => {
    // Arrange
    const emitSpy = jest.spyOn(component.actionReassignEmitter, 'emit');
    const clearFormSpy = jest.spyOn(component.reassignTicketForm, 'reset');

    // Act
    component.emitAction();

    // Assert
    expect(emitSpy).toHaveBeenCalled();
    expect(component.reassignModalVisible).toBe(true);
    expect(clearFormSpy).toHaveBeenCalled();
  });

  it('should set selectedDefaultUser and patch modalDefaultGroupUser value in reassignTicketForm', () => {
    // Arrange
    const event = selectedDefaultUser;
    component.reassignTicketForm = {
      patchValue: jest.fn()
    } as any;

    // Act
    component.getSelectedDefaultUser(event);

    // Assert
    expect(component.selectedDefaultUser).toEqual(event);
    expect(component.reassignTicketForm.patchValue).toHaveBeenCalledWith({
      modalDefaultGroupUser: selectedDefaultUser?.name
    });
  });

  it('should toggle allUsersModalVisible property', () => {
    const display = true;

    component['toggleAllUsersModal'](display);

    expect(component.allUsersModalVisible).toBe(display);
  });

  it('should toggle groupUserModalVisible property', () => {
    const display = false;

    component['toggleGroupMembersModal'](display);

    expect(component.groupUserModalVisible).toBe(display);
  });

  it('should set selectedMainUser, showDefaultUser, and patch modalUserAssignTo value in reassignTicketForm', () => {
    jest.spyOn(component.reassignTicketForm, 'patchValue');
    const event: StaffDto = selectedMainUser;

    component.getSelectedUser(event);

    expect(component.selectedMainUser).toEqual(event);
    expect(component.showDefaultUser).toBeFalsy();
    expect(component.reassignTicketForm.patchValue).toHaveBeenCalledWith({
      modalUserAssignTo: 'John Doe'
    });

    event.userType = 'G';
    component.getSelectedUser(event);

    expect(component.showDefaultUser).toBeTruthy();
  });

});
