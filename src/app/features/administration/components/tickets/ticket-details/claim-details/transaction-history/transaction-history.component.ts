import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Logger} from "../../../../../../../shared/services";
import {TicketsDTO} from "../../../../../data/ticketsDTO";
import {GlobalMessagingService} from "../../../../../../../shared/services/messaging/global-messaging.service";
import {PoliciesService} from "../../../../../../gis/services/policies/policies.service";
import {ViewClaimService} from "../../../../../../gis/services/claims/view-claim.service";
import {AuthService} from "../../../../../../../shared/services/auth.service";
import {
  CompletionRemarksService
} from "../../../../../../gis/components/setups/services/completion-remarks/completion-remarks.service";
import {untilDestroyed} from "../../../../../../../shared/services/until-destroyed";
import {ReinsuranceService} from "../../../../../../gis/reinsurance/reinsurance.service";
import {ClaimsDTO} from "../../../../../../gis/data/claims-dto";
import {LocalStorageService} from "../../../../../../../shared/services/local-storage/local-storage.service";

const log = new Logger('TransactionHistoryComponent');
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.css']
})
export class TransactionHistoryComponent implements OnInit {
  @Input() selectedSpringTickets: TicketsDTO;
  claim: ClaimsDTO;
  pageSize: 5;
  claimExceptionData: any[];
  selectedClaimException: any[] = [];

  claimTransactionData: any[];
  claimTransaction: any;
  claimPaymentTransactionData: any[];
  claimPaymentTransaction: any;
  claimRevisionData: any[];

  authoriseExceptionsData: any;
  showDropdownForException: any;

  completionRemarksData: any[];
  selectedRemark: string = '';

  perilsData: any[];
  treatyCedingData: any[];
  facultativeCedingData: any[];
  nonPropTreatyData: any[];

  authorizationLevelsData: any[];
  selectedAuthorizationLevel: any[] = [];

  penaltiesData: any[];
  reinsurancePoolData: any[];
  perilsPaymentData: any[];
  treatyCessionData: any[];
  facultativeCessionData: any[];
  nonPropReinsurerData: any[];
  claimBankData: any[];
  paymentItemsData: any[];
  remarksData: any[];

  isLoadingTransactionData: boolean = false;
  isLoadingAuthClaim: boolean = false;
  selectedTransaction: any;

  constructor(
    private globalMessagingService: GlobalMessagingService,
    private policiesService: PoliciesService,
    private claimsService: ViewClaimService,
    private authService: AuthService,
    private completionRemarksService: CompletionRemarksService,
    private reinsuranceService: ReinsuranceService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
  ) {
  }
  ngOnInit(): void {
    this.fetchClaimTransactionDetails();
    this.claim = this.localStorageService.getItem('claimDetails');
  }

  fetchClaimExceptions() {
    this.claimsService.getListOfExceptionsByClaimNo(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo, this.selectedTransaction?.transactionCode)
      .subscribe({
        next: (data) => {
          this.claimExceptionData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('exceptions>>', this.claimExceptionData);
        }
      })
  }

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

  fetchClaimTransactionDetails() {
    this.claimsService.getClaimsTransactionsDetails(this.selectedSpringTickets?.ticket?.claimNo)
      .subscribe({
        next: (data) => {

          this.claimTransactionData = data.embedded[0].filter((claimTransaction) => claimTransaction.authorized === 'Y');
          this.claimTransactionData.forEach( transaction => {
            this.claimTransaction = transaction
          });
          /*if (this.claimTransaction) {
            this.fetchClaimPaymentsTransactionDetails();
            this.fetchClaimExceptions();
            this.fetchClaimRevision();
            // this.localStorageService.setItem('claimTransactionDetails', this.claimTransaction);
          }*/
          log.info('claim transaction data2>>', this.claimTransactionData, this.claimTransaction);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  fetchClaimPaymentsTransactionDetails() {
    this.isLoadingTransactionData = true;
    this.claimsService.getClaimsPaymentTransactionsDetails(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.claimVoucherCode)
      .subscribe({
        next: (data) => {
          data.embedded[0].forEach( transaction => {
            this.claimPaymentTransaction = transaction;
          });
          this.isLoadingTransactionData = false;
          this.claimPaymentTransactionData = data.embedded[0];
          log.info('claim payment transaction data2>>', this.claimPaymentTransactionData, this.claimPaymentTransaction);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
          this.isLoadingTransactionData = false;
        }
      })
  }

  fetchClaimRevision() {
    this.claimsService.getClaimRevisionDetails(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getPerils() {
    this.claimsService.getListOfPerilsLRV(this.selectedSpringTickets?.ticket?.claimNo)
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

  getTreatyCeding() {
    this.claimsService.getTreatyCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getFacultativeCeding() {
    this.claimsService.getFacultativeCedingLRV(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getNonProportionalTreaty() {
    this.claimsService.getNonPropTreatyLRV(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getPenalties() {
    this.claimsService.getPenaltiesLRV(this.selectedSpringTickets?.ticket?.claimNo)
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

  getReinsurancePool() {
    this.reinsuranceService.getReinsurancePool(this.claim?.risk_code, this.selectedTransaction?.transactionNo)
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

  getPerilsClaimPayment() {
    this.claimsService.getListOfPerilsPayment(this.selectedTransaction?.claimVoucherCode)
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

  getTreatyCession() {
    this.claimsService.getTreatyCessions(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getFacultativeCession() {
    this.claimsService.getFacultativeCessions(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getNonPropReinsurers() {
    this.claimsService.getNonPropReinsurers(this.selectedSpringTickets?.ticket?.claimNo, this.selectedTransaction?.transactionNo)
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

  getClaimBankDetails() {
    this.claimsService.getClaimsBankDetails(this.selectedTransaction?.claimVoucherCode)
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

  getPaymentItems() {
    this.claimsService.getClaimsPaymentItems(this.selectedTransaction?.claimVoucherCode)
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

  getRemarks() {
    this.claimsService.getRemarks(this.selectedSpringTickets?.ticket?.policyCode.toString(),this.selectedSpringTickets?.ticket?.claimNo, 'C')
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

  toggleDropdown(exception: any) {
    if (this.showDropdownForException === exception) {
      this.showDropdownForException = null; // Hide the dropdown if already shown
    } else {
      this.showDropdownForException = exception; // Show the dropdown for the clicked exception
    }
  }

  toggleTransactionDetails(transaction: any, expanded: boolean) {
    if (!expanded) {
      log.info('>>', transaction);
      this.selectedTransaction = transaction;
      this.fetchClaimPaymentsTransactionDetails();
      this.fetchClaimExceptions();
      this.fetchClaimRevision();

      this.getAuthorizationLevels();
      this.getPerils();
      this.getTreatyCeding();
      this.getFacultativeCeding();
      this.getNonProportionalTreaty();
      this.getPenalties();
      this.getReinsurancePool();
      this.getPerilsClaimPayment();
      this.getTreatyCession();
      this.getFacultativeCession();
      this.getNonPropReinsurers();
      this.getClaimBankDetails();
      this.getPaymentItems();
      this.getRemarks();
    }
    else {
      this.selectedTransaction = null;
    }
  }

  ngOnDestroy(): void {
  }
}
