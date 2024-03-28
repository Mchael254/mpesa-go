import {Component, Input, OnInit} from '@angular/core';
import {TicketsDTO} from "../../../../data/ticketsDTO";
import {Logger} from "../../../../../../shared/services";
import {ViewClaimService} from "../../../../../gis/services/claims/view-claim.service";
import {ClaimsDTO} from "../../../../../gis/data/claims-dto";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {AuthService} from "../../../../../../shared/services/auth.service";

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

  claimPaymentTransactionData: any[];
  claimPaymentTransaction: any;

  isLoadingAuthExc: boolean = false;

  constructor(private claimsService: ViewClaimService,
              private globalMessagingService: GlobalMessagingService,
              private authService: AuthService) {
  }
  ngOnInit(): void {
    log.info('claim>>', this.selectedSpringTickets);
    // this.fetchClaimDetails(this.selectedSpringTickets?.ticket?.claimNo);
    this.fetchClaimTransactionDetails();
  }

  fetchClaimExceptions() {
    this.claimsService.getListOfExceptionsByClaimNo(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.transactionNo, this.claimTransaction?.transactionCode)
      .subscribe({
        next: (data) => {
          this.claimExceptionData = data.embedded && data.embedded.length > 0 ? data.embedded[0] : [];
          log.info('exceptions>>', this.claimExceptionData);
        }
      })
  }

  onDropdownChange(event, exception) {
    log.info('>>>>', event.value, exception.code)

    /*if (event.value) {
      const payload: any = {
        exceptionCode: exception?.code,
        exceptionUnderwritingDecision: event.value
      }
      this.claimsService.saveExceptionRemark(payload)
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
    }*/
  }

  authoriseExceptions() {
    this.isLoadingAuthExc = true;
    const selectedExceptions = this.selectedClaimException.map(data=> data.code);

    log.info('selected exceptions', selectedExceptions);
    const assignee = this.authService.getCurrentUserName();
    /*if (selectedExceptions.length > 0) {
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
    }*/
  }

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
            this.claimsService.claimTransactionObject.set({...this.claimTransaction, fromClaimTransaction: true});
          }
          log.info('claim transaction data>>', this.claimTransactionData, this.claimTransaction);
          // transactionNo
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  fetchClaimPaymentsTransactionDetails() {
    this.claimsService.getClaimsPaymentTransactionsDetails(this.selectedSpringTickets?.ticket?.claimNo, this.claimTransaction?.code)
      .subscribe({
        next: (data) => {
          data.embedded[0].forEach( transaction => {
            this.claimPaymentTransaction = transaction
          });
          this.claimPaymentTransactionData = data.embedded[0];
          log.info('claim payment transaction data>>', this.claimPaymentTransactionData, this.claimPaymentTransaction);
        },
        error: err => {
          this.globalMessagingService.displayErrorMessage('Error', err.message);
        }
      })
  }

  ngOnDestroy(): void {
  }
}
