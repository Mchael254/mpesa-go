import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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

  isLoading: boolean = false;
  isLoadingMakeUndo: boolean = false;
  isLoadingAuthExc: boolean = false;

  showDropdownForException: any;

  constructor(private policiesService: PoliciesService,
              private globalMessagingService: GlobalMessagingService,
              private completionRemarksService: CompletionRemarksService,
              private cdr: ChangeDetectorRef,
              private authService: AuthService,
              private spinner: NgxSpinnerService,) {
  }

  ngOnInit(): void {
    this.getAuthorizationExceptionDetails();
    this.getAuthorizationLevels();
    this.getReceipts();
    this.getCompletionRemarks();
    log.info('policy', this.policyDetails?.authorizedStatus)
  }

  /**
   * The function `getAuthorizationExceptionDetails` retrieves a list of authorization exceptions by batch number and logs
   * the data.
   */
  getAuthorizationExceptionDetails() {
    this.authorizationExceptionData = null;
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
          this.cdr.detectChanges();
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
    this.isLoadingAuthExc = true;
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
            this.isLoadingAuthExc = false;
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
            this.isLoadingAuthExc = false;
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No exception is selected.'
      );
      this.isLoadingAuthExc = false;
    }
  }

  /**
   * The `makeReady` function calls a service to prepare a policy, updates data and displays success or error messages
   * accordingly.
   */
  makeReady() {
    if (this.policyDetails) {
      this.isLoadingMakeUndo = true;
      this.policiesService.policyMakeReady(this.policyDetails?.batch_no)
        .subscribe({
          next: (data) => {
            this.makeReadyData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully made ready');
            this.undoOrMakeReady.emit(data);
            this.getAuthorizationExceptionDetails();

            this.cdr.detectChanges();
            this.isLoadingMakeUndo = false;
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
            this.isLoadingMakeUndo = false;
          }
        });
    }
  }

  /**
   * The `undoMakeReady` function calls a service to undo a "make ready" action for a policy, displays success or error
   * messages, and fetches updated policy details.
   */
  undoMakeReady() {
    this.isLoadingMakeUndo = true;
    this.policiesService.policyUndoMakeReady(this.policyDetails?.batch_no)
      .subscribe({
        next: (data) => {
          this.undoMakeReadyData = data;
          this.globalMessagingService.displaySuccessMessage('Success', 'Undo make ready successful');
          this.undoOrMakeReady.emit(data);

          this.cdr.detectChanges();
          this.isLoadingMakeUndo = false;
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoadingMakeUndo = false;
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
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
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

  /**
   * The function `filterExceptions` filters a table based on the input value from an
   * HTML input element within an event.
   */
  filterExceptions(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.exceptionsTable.filterGlobal(filterValue, 'contains');
  }

  /**
   * The function `onDropdownChange` handles the change event of a dropdown, saves exception remark data, and displays
   * success or error messages accordingly.
   */
  onDropdownChange(event, exception) {
    log.info('>>>>', event.value, exception.code)

    if (event.value) {
      const payload: any = {
        exceptionCode: exception?.code,
        exceptionUnderwritingDecision: event.value
      }
      this.policiesService.saveExceptionRemark(payload)
        .subscribe({
          next: (data) => {
            this.authoriseExceptionsData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully saved remark');
            this.getAuthorizationExceptionDetails();
            this.cdr.detectChanges();
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          }
        })
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Exception remark not selected.'
      );
    }
  }

  toggleDropdown(exception: any) {
    if (this.showDropdownForException === exception) {
      this.showDropdownForException = null; // Hide the dropdown if already shown
    } else {
      this.showDropdownForException = exception; // Show the dropdown for the clicked exception
    }
  }
}
