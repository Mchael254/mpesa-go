import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {TicketsDTO} from "../../../../data/ticketsDTO";
import {Logger} from "../../../../../../shared/services";
import {ViewClaimService} from "../../../../../gis/services/claims/view-claim.service";
import {ClaimsDTO} from "../../../../../gis/data/claims-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {LocalStorageService} from "../../../../../../shared/services/local-storage/local-storage.service";
import {
  CompletionRemarksService
} from "../../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";
import {PoliciesService} from "../../../../../gis/services/policies/policies.service";
import {untilDestroyed} from "../../../../../../shared/services/until-destroyed";

const log = new Logger('ClaimDetailsComponent');
@Component({
  selector: 'app-claim-details',
  templateUrl: './claim-details.component.html',
  styleUrls: ['./claim-details.component.css']
})
export class ClaimDetailsComponent implements OnInit {
  @Input() selectedSpringTickets: TicketsDTO;

  @Input() claim: ClaimsDTO;

  public pageSize: 5;
  claimExceptionData: any[];
  selectedClaimException: any[] = [];

  completionRemarksData: any[];
  selectedRemark: string = '';
  claimTransactionData: any[];
  claimTransaction: any;
  claimRevisionData: any[];

  claimPaymentTransactionData: any[];
  claimPaymentTransaction: any;

  authoriseExceptionsData: any;
  showDropdownForException: any;

  authorizationLevelsData: any[];
  selectedAuthorizationLevel: any[] = [];

  isLoadingAuthExc: boolean = false;
  isLoadingTransactionData: boolean = false;
  isLoadingMakeUndo: boolean = false;
  isLoadingAuthClaim: boolean = false;

  constructor(private claimsService: ViewClaimService,
              private globalMessagingService: GlobalMessagingService,
              private authService: AuthService,
              private localStorageService: LocalStorageService,
              private completionRemarksService: CompletionRemarksService,
              private policiesService: PoliciesService,
              private cdr: ChangeDetectorRef,) {
  }
  ngOnInit(): void {
    log.info('claim>>', this.selectedSpringTickets);
    // this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
    this.fetchClaimTransactionDetails();
    this.fetchCompletionRemarks();
    this.getAuthorizationLevels();
  }

  /**
   * The `fetchClaimExceptions` function fetches a list of exceptions related to a specific claim and logs the data.
   */
  fetchClaimExceptions() {
    this.claimsService.getListOfExceptionsByClaimNo(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo, this.claimTransaction?.transactionCode)
      .subscribe({
        next: (data) => {
          this.claimExceptionData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('exceptions>>', this.claimExceptionData);
        }
      })
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
            this.fetchClaimExceptions();
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

  /**
   * The `authoriseExceptions` function handles the authorization of selected claim exceptions, displaying success or error
   * messages accordingly.
   */
  authoriseExceptions() {
    this.isLoadingAuthExc = true;
    const selectedExceptions = this.selectedClaimException.map(data=> data.code);

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
   * The `fetchClaimTransactionDetails` function fetches claim transaction details, processes the data, and handles any
   * errors that may occur.
   */
  fetchClaimTransactionDetails() {
    this.claimsService.getClaimsTransactionsDetails(this.selectedSpringTickets?.ticket?.claimNo)
      .subscribe({
        next: (data) => {
          data.embedded[0].forEach( transaction => {
            this.claimTransaction = transaction
          });
          this.claimTransactionData = data.embedded[0];
          if (this.claimTransaction) {
            this.fetchClaimPaymentsTransactionDetails();
            this.fetchClaimExceptions();
            this.fetchClaimRevision();
            this.localStorageService.setItem('claimTransactionDetails', this.claimTransaction);
          }
          log.info('claim transaction data>>', this.claimTransactionData, this.claimTransaction);
          // transactionNo
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `fetchClaimPaymentsTransactionDetails` fetches claim payment transaction details and handles loading and
   * error states.
   */
  fetchClaimPaymentsTransactionDetails() {
    this.isLoadingTransactionData = true;
    this.claimsService.getClaimsPaymentTransactionsDetails(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          data.embedded[0].forEach( transaction => {
            this.claimPaymentTransaction = transaction;
          });
          this.isLoadingTransactionData = false;
          this.claimPaymentTransactionData = data.embedded[0];
          log.info('claim payment transaction data>>', this.claimPaymentTransactionData, this.claimPaymentTransaction);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
          this.isLoadingTransactionData = false;
        }
      })
  }

  ngOnDestroy(): void {
  }

  /**
   * The `makeReady` function  makes a claim transaction ready and displays success or error messages
   * accordingly.
   */
  makeReady() {
    this.isLoadingMakeUndo = true;
    const assignee = this.authService.getCurrentUserName();
      const payload: any = {
        claimNo: this.selectedSpringTickets?.ticket?.claimNo,
        transactionNo: this.claimTransaction?.transactionNo,
        transactionType: this.claimTransaction?.transactionCode,
        user: assignee
      }
      log.info('pay', payload);
      this.claimsService.claimMakeReady(payload)
        .subscribe({
          next: (data) => {
            // this.makeReadyData = data;
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully made ready claim transaction');
            this.isLoadingMakeUndo = false;
          },
          error: err => {
            this.globalMessagingService.displayErrorMessage('Error', err.error.message);
            this.isLoadingMakeUndo = false;
          }
        })
  }

  /**
   * The function fetches completion remarks data from a service and logs it, displaying an error message if there is an
   * error.
   */
  fetchCompletionRemarks() {
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
   * The `fetchClaimRevision` fetches claim revision details using the `claimsService` and displays error messages
   * if any.
   */
  fetchClaimRevision() {
    this.claimsService.getClaimRevisionDetails(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.claimRevisionData = data.embedded[0];
          log.info('revision data>>', this.claimRevisionData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getAuthorizationLevels` retrieves policy authorization levels based on the selected Spring ticket's
   * policy code.
   */
  getAuthorizationLevels() {
    this.policiesService.getPolicyAuthorizationLevels(this.selectedSpringTickets?.ticket?.policyCode)
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
   * The `authorizeClaim` function authorizes a claim by sending a payload to a service and displaying
   * success or error messages accordingly.
   */
  authorizeClaim() {
    this.isLoadingAuthClaim = true;
    const assignee = this.authService.getCurrentUserName();
    const payload: any = {
      claimNo: this.selectedSpringTickets?.ticket?.claimNo,
      claimRevisionCode: this.claimRevisionData[0]?.code,
      ignoreClaimants: "N",
      transactionNo: this.claimTransaction?.transactionNo,
      transactionType: this.claimTransaction?.transactionCode,
      user: assignee
    }
    log.info('pay', payload);
    this.claimsService.authorizeClaims(payload)
      .subscribe({
        next: (data) => {

          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully authorized claim');
          this.isLoadingAuthClaim = false;
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.error.message);
          this.isLoadingAuthClaim = false;
        }
      })
  }

  /**
   * The `toggleDropdown` function toggles the visibility of a dropdown based on the exception parameter.
   */
  toggleDropdown(exception: any) {
    if (this.showDropdownForException === exception) {
      this.showDropdownForException = null; // Hide the dropdown if already shown
    } else {
      this.showDropdownForException = exception; // Show the dropdown for the clicked exception
    }
  }
}
