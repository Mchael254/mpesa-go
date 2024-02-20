import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {Logger} from "../../../../../shared/services";
import {Pagination} from "../../../../../shared/data/common/pagination";

const log = new Logger('AuthorizationTabComponent');

@Component({
  selector: 'app-authorization-tab',
  templateUrl: './authorization-tab.component.html',
  styleUrls: ['./authorization-tab.component.css']
})
export class AuthorizationTabComponent implements OnInit{
  @Input() policyDetails:any;
  public pageSize: 5;
  risKCedingDetails: any;

  debtOwnerForm: FormGroup;
  scheduleCheckForm: FormGroup;

  zIndex= 1;
  firstModalZIndex =  2;
  secondModalZIndex = 2;

  allUsersModalVisible: boolean = false;
  groupUserModalVisible: boolean = false;
  showDefaultUser: boolean = false;

  selectedMainUser: StaffDto;
  selectedDefaultUser: StaffDto;
  groupStaffMembers: StaffDto[] = [];

  authorizationExceptionData: Pagination<any> = <Pagination<any>>{};

  constructor(private fb: FormBuilder,
              private policiesService: PoliciesService,) {
  }

  ngOnInit(): void {
    this.showDefaultUser = false;
    this.createDebtOwnerTicketsForm();
    this.createScheduleCheckForm();
    this.getAuthorizationExceptionDetails();
  }

  createDebtOwnerTicketsForm() {

    this.debtOwnerForm = this.fb.group({
      modalUserAssignTo: ['', Validators.required],
      modalDefaultGroupUser: [''] ,
      scheduleReadyAuth: ['']
    });

    this.debtOwnerForm.controls['modalUserAssignTo'].disable();
    this.debtOwnerForm.controls['modalDefaultGroupUser'].disable();

    this.debtOwnerForm.reset();
  }

  createScheduleCheckForm() {
    this.scheduleCheckForm = this.fb.group({
      scheduleReadyAuth: ['']
    })
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
    this.debtOwnerForm.patchValue({
      modalUserAssignTo: event?.name
    });
  }

  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  processDefaultUser(event: void) {
    this.toggleGroupMembersModal(false);
    this.zIndex = 1;
  }

  getSelectedDefaultUser(event: StaffDto) {
    this.selectedDefaultUser = event;
    this.debtOwnerForm.patchValue({
      modalDefaultGroupUser: event?.name
    })
  }

  getAuthorizationExceptionDetails() {
    this.policiesService.getListOfExceptionsByPolBatchNo(this.policyDetails?.batch_no)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.authorizationExceptionData = data;
          log.info('AuthorizationExceptionDetails>>', this.authorizationExceptionData)
        }
      )
  }

  ngOnDestroy(): void {
  }
}
