import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {AuthService} from "../../../../../shared/services/auth.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Table} from "primeng/table";

const log = new Logger('AuthorizationTabComponent');

@Component({
  selector: 'app-authorization-tab',
  templateUrl: './authorization-tab.component.html',
  styleUrls: ['./authorization-tab.component.css']
})
export class AuthorizationTabComponent implements OnInit{
  @Input() policyDetails:any;
  @ViewChild('exceptionsTable') exceptionsTable: Table;
  @Output() undoOrMakeReady: EventEmitter<any> = new EventEmitter<any>();
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
  scheduleData: any;

  completionRemarksData: any[];
  selectedRemark: string = '';
  showDropdown: boolean = true;

  today = new Date();
  year = this.today.getFullYear(); // Get the current year
  month = (this.today.getMonth() + 1).toString().padStart(2, '0'); // Get the current month and pad with leading zero if necessary
  day = this.today.getDate().toString().padStart(2, '0'); // Get the current day and pad with leading zero if necessary

  dateToday = `${this.year}-${this.month}-${this.day}`;

  constructor(private fb: FormBuilder,
              private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private completionRemarksService: CompletionRemarksService,
              private cdr: ChangeDetectorRef,
              private authService: AuthService,
              private spinner: NgxSpinnerService,) {
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

  /*ngAfterViewInit() {
    // Ensure ticketDetailsComponent is initialized before calling methods on it
    if (this.ticketDetailsComponent) {
      this.ticketDetailsComponent.fetchPolicyDetails(this.policyDetails?.batch_no);
      log.info('ticketdetails viewinit')
    }
  }*/

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
   * The function `getAuthorizationExceptionDetails` retrieves a list of authorization exceptions by batch number and logs
   * the data.
   */
  getAuthorizationExceptionDetails() {
    this.spinner.show();
    this.policiesService.getListOfExceptionsByPolBatchNo(this.policyDetails?.batch_no)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.authorizationExceptionData = data;
          this.spinner.hide();
          log.info('AuthorizationExceptionDetails>>', this.authorizationExceptionData)
        }
      })
  }

  /**
   * The function `getAuthorizationLevels` retrieves policy authorization levels data and logs it.
   */
  getAuthorizationLevels() {
    this.policiesService.getPolicyAuthorizationLevels(this.policyDetails?.batch_no)
      .pipe(
        untilDestroyed(this),
      )
      .subscribe({
        next: (data) => {
          this.authorizationLevelsData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('AuthorizationLevels>>', this.authorizationLevelsData);
          },
      })
  }

  /**
   * The `getReceipts` function retrieves policy receipts data and logs it.
   */
  getReceipts() {
    this.policiesService.getPolicyReceipts(this.policyDetails?.batch_no)
      .subscribe({
        next: (data) => {
          this.receiptsData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('Receipts>>', this.receiptsData);
          }
      })
  }

  ngOnDestroy(): void {
  }

  /**
   * The `authoriseExceptions` function sends a request to authorize selected exceptions with the current user's name and
   * displays success or error messages accordingly.
   */
  authoriseExceptions() {
    const selectedExceptions = this.selectedAuthorizationException.map(data=> data.code);

    log.info('selected exceptions', selectedExceptions);
    const assignee = this.authService.getCurrentUserName();
    if (selectedExceptions.length > 0) {
      const payload: any = {
        code: selectedExceptions,
        userName: assignee
      }
      this.policiesService.authoriseExceptions(payload)
        .subscribe({
          next: (data) => {
            this.authoriseExceptionsData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized exception');
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No exception is selected.'
      );
    }
  }

  /**
   * The `makeReady` function calls a service to prepare a policy, updates data and displays success or error messages
   * accordingly.
   */
  makeReady() {
    if (this.policyDetails) {
      this.policiesService.policyMakeReady(this.policyDetails?.batch_no)
        .subscribe({
          next: (data) => {
            this.makeReadyData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully made ready');
            this.undoOrMakeReady.emit(data);
            this.getAuthorizationExceptionDetails();

            this.cdr.detectChanges();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.message);
          }
        });
    }
  }

  /**
   * The `undoMakeReady` function calls a service to undo a "make ready" action for a policy, displays success or error
   * messages, and fetches updated policy details.
   */
  undoMakeReady() {
    this.policiesService.policyUndoMakeReady(this.policyDetails?.batch_no)
      .subscribe({
        next: (data) => {
          this.undoMakeReadyData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Undo make ready successful');
          this.undoOrMakeReady.emit(data);

          this.cdr.detectChanges();
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
}

  /**
   * The function `authorizeAuthorizationLevels` authorizes a selected authorization level and displays success or error
   * messages accordingly.
   */
  authorizeAuthorizationLevels() {
    const selectedAuthLevel = this.selectedAuthorizationLevel;
    log.info("select", this.selectedAuthorizationLevel);

    this.policiesService.authorizeAuthorizationLevels(selectedAuthLevel[0]?.code)
      .subscribe({
      next: (data) => {
        this.authorizationLevelsData = data;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized level');
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
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
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getCompletionRemarks` retrieves completion remarks data and logs it, displaying an error message if
   * there is an error.
   */
  getCompletionRemarks() {
    this.completionRemarksService.getCompletionRemarks()
      .subscribe({
        next: (data) => {
          this.completionRemarksData = data._embedded;
          log.info('completionRemarks>>', this.completionRemarksData);
          },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }
  filterExceptions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.exceptionsTable.filterGlobal(filterValue, 'contains');
  }

  onAuthorize() {
    const scheduleFormValues = this.scheduleCheckForm.getRawValue();

    log.info('schedule>>', scheduleFormValues);

    this.policiesService.authorisePolicy(this.policyDetails?.batch_no, scheduleFormValues.scheduleReadyAuth, this.dateToday)
      .subscribe({
        next: (data) => {
          this.scheduleData = data;
          log.info('save schedule>>', data);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized policy');

        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  onDropdownChange() {
    this.showDropdown = false;
  }
}
