import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {ClaimsDTO} from "../../../../../../gis/data/claims-dto";
import {TicketsDTO} from "../../../../../data/ticketsDTO";
import {LocalStorageService} from "../../../../../../../shared/services/local-storage/local-storage.service";
import {untilDestroyed} from "../../../../../../../shared/services/until-destroyed";
import {PoliciesService} from "../../../../../../gis/services/policies/policies.service";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {
  CompletionRemarksService
} from "../../../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";

const log = new Logger('RevisionDetailsComponent');
@Component({
  selector: 'app-revision-details',
  templateUrl: './revision-details.component.html',
  styleUrls: ['./revision-details.component.css']
})
export class RevisionDetailsComponent implements OnInit {
  claim: ClaimsDTO;
  @Input() selectedSpringTickets: TicketsDTO;
  @Input() claimPaymentTransaction : any;
  claimTransaction: any;
  pageSize: 5;
  perilsData: any[];
  treatyCedingData: any[];
  facultativeCedingData: any[];
  nonPropTreatyData: any[];
  penaltiesData: any[];
  reinsurancePoolData: any[];
  treatyCessionData: any[];
  facultativeCessionData: any[];
  nonPropReinsurerData: any[];
  claimBankData: any[];
  perilsPaymentData: any[];
  remarksData: any[];
  paymentItemsData: any[];

  authorizationLevelsData: any[];
  selectedAuthorizationLevel: any[] = [];

  authoriseExceptionsData: any;
  showDropdownForException: any;

  claimExceptionData: any[];
  selectedClaimException: any[] = [];

  completionRemarksData: any[];
  selectedRemark: string = '';

  isLoadingAuthExc: boolean = false;
  isLoadingTransactionData: boolean = false;
  isLoadingMakeUndo: boolean = false;
  isLoadingAuthClaim: boolean = false;

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private viewClaimService: ViewClaimService,
    private reinsuranceService: ReinsuranceService,
    private localStorageService: LocalStorageService,
    private policiesService: PoliciesService,
    private authService: AuthService,
    private completionRemarksService: CompletionRemarksService,
    private cdr: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      log.info('claimsData ticket detail>>', this.selectedSpringTickets);

      this.claimTransaction = this.localStorageService.getItem('claimTransactionDetails');
      this.claim = this.localStorageService.getItem('claimDetails');
      log.info('claimTransaction session', this.claimTransaction)
      log.info('claimsDetail session>>', this.claim);

      this.getPerils();
      this.getTreatyCeding();
      this.getFacultativeCeding();
      this.getNonProportionalTreaty();
      this.getPenalties();
      this.getReinsurancePool();
      this.getTreatyCession();
      this.getFacultativeCession();
      this.getNonPropReinsurers();
      this.getClaimBankDetails();
      this.getPerilsClaimPayment();
      this.getRemarks();
      this.getPaymentItems();


    },1500);
  }

  /**
   * The function `getPerils()` retrieves a list of perils associated with a specific claim ticket.
   */
  getPerils() {
    this.viewClaimService.getListOfPerilsLRV(this.selectedSpringTickets?.ticket?.claimNo)
      .subscribe({
        next: (data) => {
          this.perilsData = data.embedded[0];
          log.info('perils>>', this.perilsData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The `getTreatyCeding` function retrieves treaty ceding data using the `viewClaimService` service
   */
  getTreatyCeding() {
    this.viewClaimService.getTreatyCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.treatyCedingData = data.embedded[0];
          log.info('treaty ceding>>', this.treatyCedingData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getFacultativeCeding` retrieves facultative ceding data using a service call and handles success and
   * error responses accordingly.
   */
  getFacultativeCeding() {
    this.viewClaimService.getFacultativeCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.facultativeCedingData = data.embedded[0];
          log.info('facultative>>', this.facultativeCedingData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * This function retrieves non-proportional treaty data using the claim number and transaction number.
   */
  getNonProportionalTreaty() {
    this.viewClaimService.getNonPropTreatyLRV(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.nonPropTreatyData = data.embedded[0];
          log.info('nonprop data>>', this.nonPropTreatyData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getPenalties` retrieves penalties data for a selected ticket claim and handles any errors that occur.
   */
  getPenalties() {
    this.viewClaimService.getPenaltiesLRV(this.selectedSpringTickets?.ticket?.claimNo)
      .subscribe({
        next: (data) => {
          this.penaltiesData = data.embedded[0];
          log.info('penalties data>>', this.penaltiesData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The `getReinsurancePool` function retrieves reinsurance pool data based on the risk code and transaction number of a
   * claim.
   */
  getReinsurancePool() {
    this.reinsuranceService.getReinsurancePool(this.claim?.risk_code, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.reinsurancePoolData = data;
          log.info('reinsurance pool data>>', this.reinsurancePoolData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The `getTreatyCession` function retrieves treaty cession data based on selected spring tickets and claim transactions.
   */
  getTreatyCession() {
    this.viewClaimService.getTreatyCessions(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.treatyCessionData = data.embedded[0];
          log.info('treatyCession data>>', this.treatyCessionData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getFacultativeCession` retrieves facultative cessions data for a selected ticket claim and transaction.
   */
  getFacultativeCession() {
    this.viewClaimService.getFacultativeCessions(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.facultativeCessionData = data.embedded[0];
          log.info('facCession data>>', this.facultativeCessionData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getNonPropReinsurers` retrieves non-property reinsurance data for a specific claim and transaction.
   */
  getNonPropReinsurers() {
    this.viewClaimService.getNonPropReinsurers(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo)
      .subscribe({
        next: (data) => {
          this.nonPropReinsurerData = data.embedded[0];
          log.info('facCession data>>', this.nonPropReinsurerData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getClaimBankDetails` retrieves bank details for a claim transaction and handles success and error cases
   * accordingly.
   */
  getClaimBankDetails() {
    this.viewClaimService.getClaimsBankDetails(this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          this.claimBankData = data.embedded[0];
          log.info('claim bank data>>', this.claimBankData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getPerilsClaimPayment` retrieves a list of perils payment data for a specific claim voucher code.
   */
  getPerilsClaimPayment() {
    this.viewClaimService.getListOfPerilsPayment(this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          this.perilsPaymentData = data.embedded[0];
          log.info('perilsPayment>>', this.perilsPaymentData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getRemarks` retrieves remarks data for a selected ticket and handles success and error cases
   * accordingly.
   */
  getRemarks() {
    this.viewClaimService.getRemarks(this.selectedSpringTickets?.ticket?.policyCode.toString(),this.selectedSpringTickets?.ticket?.claimNo, 'C')
      .subscribe({
        next: (data) => {
          this.remarksData = data.embedded[0];
          log.info('remarks>>', this.remarksData);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  /**
   * The function `getPaymentItems` retrieves payment items for a claim transaction and handles success and error cases
   * accordingly.
   */
  getPaymentItems() {
    this.viewClaimService.getClaimsPaymentItems(this.claimTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          this.paymentItemsData = data.embedded;
          log.info('payment items>>', this.paymentItemsData);
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
   * The `fetchClaimExceptions` function fetches a list of exceptions related to a specific claim and logs the data.
   */
  fetchClaimExceptions() {
    this.viewClaimService.getListOfExceptionsByClaimNo(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo, this.claimTransaction?.transactionCode)
      .subscribe({
        next: (data) => {
          this.claimExceptionData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('exceptions>>', this.claimExceptionData);
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
    this.viewClaimService.claimMakeReady(payload)
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
}
