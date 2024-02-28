import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {Logger} from "../../../../../shared/services";
import {Pagination} from "../../../../../shared/data/common/pagination";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {
  CompletionRemarksService
} from "../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";

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
  selectedAuthorizationException: any[] = [];

  authorizationLevelsData: any[];
  selectedAuthorizationLevel: any[] = [];
  receiptsData: any[];

  authoriseExceptionsData: any;

  makeReadyData: any;
  undoMakeReadyData: any;

  debitOwnerPromiseDateData: any;

  completionRemarksData: any[];

  constructor(private fb: FormBuilder,
              private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private completionRemarksService: CompletionRemarksService,) {
  }

  ngOnInit(): void {
    this.showDefaultUser = false;
    this.createDebtOwnerTicketsForm();
    this.createScheduleCheckForm();
    this.getAuthorizationExceptionDetails();
    this.getAuthorizationLevels();
    this.getReceipts();
    this.getCompletionRemarks();
    log.info('policy', this.policyDetails?.authorizedStatus)
  }

  createDebtOwnerTicketsForm() {

    this.debtOwnerForm = this.fb.group({
      modalUserAssignTo: ['', Validators.required],
      modalDefaultGroupUser: [''] ,
      scheduleReadyAuth: [''],
      promiseDate: ['']
    });

    this.debtOwnerForm.controls['modalUserAssignTo'].disable();
    this.debtOwnerForm.controls['modalDefaultGroupUser'].disable();

    this.debtOwnerForm.reset();
  }

  createScheduleCheckForm() {
    this.scheduleCheckForm = this.fb.group({
      scheduleReadyAuth: [''],
      dispatchDocuments: ['']
    })
  }

  openDebtOwnerModal() {
    if (this.policyDetails?.product?.interfaceType === 'ACCRUAL') {
      const modal = document.getElementById('debtOwnerToggle');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        if (modalBackdrop) {
          modalBackdrop.classList.add('show');
        }
      }
    } else {
      const modal = document.getElementById('scheduleModalToggle');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
        if (modalBackdrop) {
          modalBackdrop.classList.add('show');
        }
      }
    }
  }

  openScheduleModal() {
    const modal = document.getElementById('scheduleModalToggle');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.add('show');
      }
    }
  }

  closeDebtOwnerModal() {
    const modal = document.getElementById('debtOwnerToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
      }
    }
  }

  closeScheduleModal() {
    const modal = document.getElementById('scheduleModalToggle');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      const modalBackdrop = document.getElementsByClassName('modal-backdrop')[0];
      if (modalBackdrop) {
        modalBackdrop.classList.remove('show');
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
    this.debtOwnerForm.patchValue({
      modalUserAssignTo: event?.username
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

  getAuthorizationLevels() {
    this.policiesService.getPolicyAuthorizationLevels(this.policyDetails?.batch_no)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe(
        (data) => {
          this.authorizationLevelsData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('AuthorizationLevels>>', this.authorizationLevelsData);
        }
      )
  }

  getReceipts() {

    this.policiesService.getPolicyReceipts(this.policyDetails?.batch_no)

      .subscribe(
        (data) => {
          this.receiptsData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('Receipts>>', this.receiptsData);
        }
      )
  }

  ngOnDestroy(): void {
  }

  authoriseExceptions() {
    const selectedExceptions = this.selectedAuthorizationException;

    log.info('selected exceptions', selectedExceptions);

    this.policiesService.authoriseExceptions(selectedExceptions[0]?.code)
      .subscribe((data) => {
        this.authoriseExceptionsData = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized exception');
      })
  }

  makeReady() {
    this.policiesService.policyMakeReady(this.policyDetails?.batch_no)
      .subscribe((data) => {
        this.makeReadyData = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'Success');
      })
  }

  undoMakeReady() {
    this.policiesService.policyUndoMakeReady(this.policyDetails?.batch_no)
      .subscribe((data) => {
        this.undoMakeReadyData = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'Success');
      })
  }

  authorizeAuthorizationLevels() {
    const selectedAuthLevel = this.selectedAuthorizationLevel;
    log.info("select", this.selectedAuthorizationLevel);

    this.policiesService.authorizeAuthorizationLevels(selectedAuthLevel[0]?.code)
      .subscribe((data) => {
        this.authorizationLevelsData = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized level');
      })
  }

  authorizePolicy() {
    this.globalMessagingService.displaySuccessMessage('Success', 'Authorize policy clicked');
  }

  saveDebitOwnerAndPromiseDate() {
    const debtOwnerFormValues = this.debtOwnerForm.getRawValue();
  
    const debitOwnerPromiseDate: any = {
      debit_owner: debtOwnerFormValues.modalUserAssignTo,
      policy_batch_no: this.policyDetails?.batch_no,
      promise_date: debtOwnerFormValues.promiseDate
    }

    this.policiesService.debtOwnerPromiseDate(debitOwnerPromiseDate)
      .subscribe((data) => {
        this.debitOwnerPromiseDateData = data;
        log.info('save promise date>>', data);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved debt owner & promise date');

      })
  }

  getCompletionRemarks() {

    this.completionRemarksService.getCompletionRemarks()
      .subscribe(
        (data) => {
          this.completionRemarksData = data._embedded;
          log.info('completionRemarks>>', this.completionRemarksData);
        }
      )
  }
}
