import {Component, OnDestroy, OnInit} from '@angular/core';
import {Logger} from 'src/app/shared/services';
import {GlobalMessagingService} from 'src/app/shared/services/messaging/global-messaging.service';
import {ActivatedRoute} from '@angular/router';
import {PaymentService} from '../../services/payment-service/payment.service';
import {untilDestroyed} from "../../../../../../shared/shared.module";
import {tap} from "rxjs";
import {SESSION_KEY} from "../../../../../lms/util/session_storage_enum";
import {SessionStorageService} from "../../../../../../shared/services/session-storage/session-storage.service";

const log = new Logger('PaymentCheckoutComponent');

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css']
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  ipayRefNo: string
  currencyPrefix: string;
  amount: number
  paymentButtonLabel = "Initiate payment"
  action: 'initiate' | 'confirm' = 'initiate'
  checkoutId: string = null

  constructor(private globalMessagingService: GlobalMessagingService,
              private route: ActivatedRoute,
              private sessionStorageService: SessionStorageService,
              private paymentService: PaymentService) {
  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    this.currencyPrefix = queryParams.get('currencyPrefix') || '';
    this.sessionStorageService.set(SESSION_KEY.API_TENANT_ID, atob(queryParams.get('tenant')));
    this.ipayRefNo = atob(queryParams.get('reference'))
    this.amount = +atob(queryParams.get('amount'))
  }

  validPhoneNumber: boolean = false
  phoneNumber: string = ''
  selectedPayment: 'mpesa' | 'airtel' | 'tkash' = 'mpesa';

  formatPhoneNumber = (phoneNumber: string): string => {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.startsWith('254')) {
      return cleaned;
    }

    if (!cleaned.match(/^(01|07)/)) {
      throw new Error("invalid format");
    }

    return '254' + cleaned.substring(1);
  };

  isValidPhoneNumber(): boolean {
    return /^(01|07)\d{8}$/.test(this.phoneNumber);
  }


  sendSTK() {
    if (!this.isValidPhoneNumber()) {
      this.validPhoneNumber = true
      setTimeout(() => {
        this.validPhoneNumber = false;
      }, 3000);
      return;
    }

    const paymentPayload = {
      TransactionCode: this.ipayRefNo,
      PhoneNumber: this.formatPhoneNumber(this.phoneNumber),
      Amount: Math.round(this.amount)
    }

    log.debug('this is payment payload>>>', paymentPayload)
    /**
     * Initiate payment
     * send STK push
     * if success
     *  change button to Confirm payment, a user clicks the button
     *    if success suggesting payment was made,
     *        display the success and tell a user to close the browser tab
     *  if error:
     *    display the error messages and tell the user to try again or seek help
     */
    if (this.action === 'initiate') {
      this.paymentService.initiatePayment(paymentPayload)
        .pipe(
          tap((value) => {
          }),
          untilDestroyed(this)
        )
        .subscribe({
          next: ((response) => {
            if (response._embedded && this.selectedPayment === 'mpesa' && response._embedded.CheckoutRequestID) {
              this.globalMessagingService.displaySuccessMessage('Success', 'ProcessingPayment...Check your phone')
              this.paymentButtonLabel = 'Confirm payment'
              this.action = 'confirm'
              this.checkoutId = response._embedded.CheckoutRequestID
            } else {
              this.checkoutId = null
            }
          }),
          error: ((err) => {
            log.debug(err)
            this.globalMessagingService.displayErrorMessage('Error', err)
          })
        })
    } else if (this.action === 'confirm' && this.checkoutId) {
      this.paymentService.confirmPayment(this.checkoutId).pipe(
        untilDestroyed(this)
      )
        .subscribe({
          next: ((response) => {
            if (response._embedded === 'SUCCESS') {
            }
          }),
          error: ((error) => {

          })
        })
    }
  }

  ngOnDestroy(): void {
  }

}
