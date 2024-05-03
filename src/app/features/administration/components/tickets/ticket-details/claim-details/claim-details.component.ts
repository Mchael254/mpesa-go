import {Component, Input, OnInit} from '@angular/core';
import {TicketsDTO} from "../../../../data/ticketsDTO";
import {Logger} from "../../../../../../shared/services";
import {ViewClaimService} from "../../../../../gis/services/claims/view-claim.service";
import {ClaimsDTO} from "../../../../../gis/data/claims-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {LocalStorageService} from "../../../../../../shared/services/local-storage/local-storage.service";


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

  claimTransactionData: any[];
  claimTransaction: any;
  claimRevisionData: any[];

  claimPaymentTransactionData: any[];
  claimPaymentTransaction: any;

  isLoadingTransactionData: boolean = false;
  isLoadingAuthClaim: boolean = false;

  constructor(private claimsService: ViewClaimService,
              private globalMessagingService: GlobalMessagingService,
              private authService: AuthService,
              private localStorageService: LocalStorageService,) {
  }
  ngOnInit(): void {
    log.info('claim>>', this.selectedSpringTickets);
    // this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
    this.fetchClaimTransactionDetails();
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
            // this.fetchClaimExceptions();
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
}
