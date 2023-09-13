import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {NewTicketDto, TicketReassignDto, TicketsDTO} from "../../../data/ticketsDTO";
import {untilDestroyed} from "../../../../../shared/shared.module";
import {Observable} from "rxjs/internal/Observable";
import {StaffService} from "../../../../entities/services/staff/staff.service";
import {TicketsService} from "../../../services/tickets.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

@Component({
  selector: 'app-reassign-ticket-modal',
  templateUrl: './reassign-ticket-modal.component.html',
  styleUrls: ['./reassign-ticket-modal.component.css']
})
export class ReassignTicketModalComponent implements OnInit, OnDestroy{
  @Input() reassignModalVisible: boolean;
  @Input() selectedTickets: NewTicketDto[] = [];
  @Output() reassignedTickets = new EventEmitter<true>();
  @Output() actionReassignEmitter:  EventEmitter<void> = new EventEmitter<void>();

  groupStaffMembers: StaffDto[] = [];

  allUsersModalVisible: boolean = false;
  groupUserModalVisible: boolean = false;
  showDefaultUser: boolean = false;

  public reassignTicketForm: FormGroup;
  selectedMainUser: StaffDto;
  selectedDefaultUser: StaffDto;

  zIndex= 1;
  firstModalZIndex =  2;
  secondModalZIndex = 2;

  constructor(private fb: FormBuilder,
              private staffService: StaffService,
              private ticketsService: TicketsService,
              private globalMessagingService: GlobalMessagingService) {
  }

  ngOnInit(): void {
    this.showDefaultUser = false;
    this.createReassignTicketsForm();
  }

  createReassignTicketsForm() {

    this.reassignTicketForm = this.fb.group({
      modalUserAssignTo: ['', Validators.required],
      modalDefaultGroupUser: [''] ,
      modalTicketComments: ['']
    });

    this.reassignTicketForm.controls['modalUserAssignTo'].disable();
    this.reassignTicketForm.controls['modalDefaultGroupUser'].disable();
    this.setRequiredFields();
    this.clearForm();
  }

  setRequiredFields(){
    for (const key of Object.keys(this.reassignTicketForm.controls)) {
      const control = this.reassignTicketForm.controls[key];
      if(control.hasValidator(Validators.required)) {
        console.log('Control key: ', key);
        this.reassignTicketForm.controls[key].updateValueAndValidity();
        // const controlId = this.reassignTicketForm.controls[key]
        const label = document.querySelector(`label[for=${key}]`);
        console.log('Control label for key: ', key , ' is label:  ', label);
        if (label) {
          const asterisk = document.createElement('span');
          asterisk.innerHTML = ' *';
          asterisk.style.color = 'red';
          console.log('Control label true for key: ', key , ' is label:  ', label);
          label.appendChild(asterisk);
        }
      }
    }
  }

  openAllUsersModal() {
    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  openGroupMembersModal() {
    this.zIndex = -1;
    this.secondModalZIndex = 1;
    this.toggleGroupMembersModal(true);
  }

  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }

  private toggleGroupMembersModal(display: boolean){
    this.groupUserModalVisible = display;
  }

  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    this.showDefaultUser = this.selectedMainUser?.userType === 'G';
    this.reassignTicketForm.patchValue({
      modalUserAssignTo: event?.name
    });
  }

  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  showGroupMembers() {
    this.allUsersModalVisible = false;
    this.fetchStaffGroupMembers();
    this.openGroupMembersModal();
  }

  fetchStaffGroupMembers() {
    if(this.selectedMainUser){ //ensure we selected and set the user/group first
      let staffGroupId = this.selectedMainUser?.id; // get staffGroupId from the user first selected. This will load if default user is not hidden
      this.getStaffByGroup(staffGroupId)
        .pipe(untilDestroyed(this))
        .subscribe((data: StaffDto[]) => {
          this.groupStaffMembers = data;
        });
    }
  }

  getStaffByGroup(staffGroupId: number): Observable<StaffDto[]> {
    return this.staffService.getStaffByGroup(staffGroupId)
      .pipe(untilDestroyed(this));
  }

  processDefaultUser(event: void) {
    this.toggleGroupMembersModal(false);
    this.zIndex = 1;
  }

  reassignTicket() {
    if(!this.reassignTicketForm.valid){
      this.globalMessagingService.displayErrorMessage('Error', 'Form is invalid. Fill in required fields');
      return;
    }

    if(this.selectedTickets.length >= 0){
      let reassignForm = this.reassignTicketForm.value;
      let ticketsToReassign: TicketReassignDto[] = this.selectedTickets.map(item => {
        return {
          ticketCode: item?.ticketID,
          groupUser: this.selectedDefaultUser?.username,
          remarks: reassignForm.modalTicketComments,
          userCodeToAssignFrom: null,
          userCodeToAssignTo: this.selectedMainUser?.id
        };
      });

      this.ticketsService
        .reassignTickets(ticketsToReassign)
        .pipe(untilDestroyed(this),)
        .subscribe( response => {
          this.globalMessagingService.displaySuccessMessage("Success", response.message);
          this.reassignTicketForm.reset();
          this.reassignModalVisible = false;
          this.reassignedTickets.emit(true);
        } );
    }
  }

  private clearForm(){
    this.reassignTicketForm.reset();
  }

  clearReassignModalFields() {
    this.reassignModalVisible = false;
    this.actionReassignEmitter.emit();
    this.clearForm();
  }

  emitAction() {
    this.actionReassignEmitter.emit();
    this.reassignModalVisible = !this.reassignModalVisible;
    this.clearForm();
  }

  getSelectedDefaultUser(event: StaffDto) {
    this.selectedDefaultUser = event;
    this.reassignTicketForm.patchValue({
      modalDefaultGroupUser: event?.name
    })
  }

  get f() { return this.reassignTicketForm.controls; }

  ngOnDestroy(): void {
  }
}
