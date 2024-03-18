import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StaffDto} from "../../../../entities/data/StaffDto";
import {Logger} from "../../../../../shared/services";
import {PoliciesService} from "../../../../gis/services/policies/policies.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";

const log = new Logger('AuthorizePolicyModalComponent');
@Component({
  selector: 'app-authorize-policy-modal',
  templateUrl: './authorize-policy-modal.component.html',
  styleUrls: ['./authorize-policy-modal.component.css']
})
export class AuthorizePolicyModalComponent implements OnInit {
  @Input() policyDetails:any;

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

  debitOwnerPromiseDateData: any;
  scheduleData: any;

  isLoading: boolean = false;
  isLoadingAuthExc: boolean = false;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  constructor(private fb: FormBuilder,
              private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private cdr: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    this.showDefaultUser = false;
    this.createDebtOwnerTicketsForm();
    this.createScheduleCheckForm();
  }

  /**
   * The function creates a form for debt owner tickets with specific form controls and disables some of them.
   */
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

  /**
   * The function creates a form group for scheduling check with two form controls.
   */
  createScheduleCheckForm() {
    this.scheduleCheckForm = this.fb.group({
      scheduleReadyAuth: [''],
      dispatchDocuments: ['']
    })
  }

  /**
   * The function `openDebtOwnerModal` checks the interface type of a product and shows a corresponding modal element based
   * on the type.
   */
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
      this.openScheduleModal();
    }
  }

  /**
   * The function `openScheduleModal` displays a modal with a backdrop by adding classes and setting display properties.
   */
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

  /**
   * The function closeDebtOwnerModal() hides a modal element and its backdrop if they exist.
   */
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

  /**
   * The function closeScheduleModal hides the schedule modal and its backdrop if they are currently displayed.
   */
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

  /**
   * The function `openAllUsersModal` sets the z-index to -1 and toggles the all users modal to true.
   */
  openAllUsersModal() {
    this.zIndex  = -1;
    this.toggleAllUsersModal(true);
  }

  /**
   * The function `openGroupMembersModal` sets the z-index values and toggles the visibility of the group members modal.
   */
  openGroupMembersModal() {
    this.zIndex = -1;
    this.secondModalZIndex = 1;
    this.toggleGroupMembersModal(true);
  }

  /**
   * The function `toggleAllUsersModal` sets the visibility of the all users modal based on the `display` parameter.
   */
  private toggleAllUsersModal(display: boolean) {
    this.allUsersModalVisible = display;
  }

  /**
   * The function `toggleGroupMembersModal` sets the visibility of a modal in TypeScript.
   */
  private toggleGroupMembersModal(display: boolean){
    this.groupUserModalVisible = display;
  }

  /**
   * The function `getSelectedUser` sets the selected user, determines if it is a default user, and updates a form field
   * with the selected user's username.
   * @param {StaffDto} event - The `event` parameter in the `getSelectedUser` function is of type `StaffDto`. It is an
   * object that likely contains information about a staff member, such as their username, userType, and other relevant
   * details.
   */
  getSelectedUser(event: StaffDto) {
    this.selectedMainUser = event;
    this.showDefaultUser = this.selectedMainUser?.userType === 'G';
    this.debtOwnerForm.patchValue({
      modalUserAssignTo: event?.username
    });
  }

  /**
   * The function `processSelectedUser` toggles a modal and sets the zIndex to 1.
   */
  processSelectedUser($event: void) {
    this.toggleAllUsersModal(false);
    this.zIndex = 1;
  }

  /**
   * The function `processDefaultUser` toggles a modal and sets the zIndex to 1.
   */
  processDefaultUser(event: void) {
    this.toggleGroupMembersModal(false);
    this.zIndex = 1;
  }

  /**
   * The function `getSelectedDefaultUser` sets the selected default user and updates the value of a form control in a
   * TypeScript file.
   * @param {StaffDto} event - StaffDto object that contains information about a staff member, such as their name, ID, and
   * other details.
   */
  getSelectedDefaultUser(event: StaffDto) {
    this.selectedDefaultUser = event;
    this.debtOwnerForm.patchValue({
      modalDefaultGroupUser: event?.username
    })
  }

  /**
   * The function `saveDebitOwnerAndPromiseDate` saves the debit owner and promise date information and displays success or
   * error messages accordingly.
   */
  saveDebitOwnerAndPromiseDate() {
    const debtOwnerFormValues = this.debtOwnerForm.getRawValue();

    const debitOwnerPromiseDate: any = {
      debitOwner: debtOwnerFormValues.modalUserAssignTo,
      policyBatchNo: this.policyDetails?.batch_no,
      promiseDate: debtOwnerFormValues.promiseDate
    }

    this.policiesService.debtOwnerPromiseDate(debitOwnerPromiseDate)
      .subscribe({
        next: (data) => {
          this.debitOwnerPromiseDateData = data;
          log.info('save promise date>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved debt owner & promise date');
          this.openScheduleModal();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
        }
      })
  }

  /**
   * The `onAuthorize` function handles authorizing a policy, displaying success or error messages, and updating the UI
   * accordingly.
   */
  onAuthorize() {
    this.isLoading = true;
    const scheduleFormValues = this.scheduleCheckForm.getRawValue();

    log.info('schedule>>', scheduleFormValues);

    this.policiesService.authorisePolicy(this.policyDetails?.batch_no, scheduleFormValues.scheduleReadyAuth, this.dateToday)
      .subscribe({
        next: (data) => {
          this.scheduleData = data;
          log.info('save schedule>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized policy');
          this.isLoading = false;
          this.closeScheduleModal();
          this.closeDebtOwnerModal();

        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoading = false;
        }
      })
  }

  ngOnDestroy(): void {
  }
}
