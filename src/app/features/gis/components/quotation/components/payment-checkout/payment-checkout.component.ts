import { Component, OnDestroy, OnInit } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment-service/payment.service';
import { untilDestroyed } from "../../../../../../shared/shared.module";
import { tap } from "rxjs";
import { SESSION_KEY } from "../../../../../lms/util/session_storage_enum";
import { SessionStorageService } from "../../../../../../shared/services/session-storage/session-storage.service";
import { faL } from '@fortawesome/free-solid-svg-icons';

const log = new Logger('PaymentCheckoutComponent');

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css']
})
export class PaymentCheckoutComponent implements OnInit, OnDestroy {
  ipayRefNo: string
  currencyPrefix: string;
  amount: number;
  paymentButtonLabel = "Send STK push"
  action: 'initiate' | 'confirm' = 'initiate'
  checkoutId: string = null
  paymentButton: boolean = true

  // Payment completion state
  paymentCompleted: boolean = false
  completionMessage: string = ''

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

    // Check if payment was already completed
    this.checkPaymentCompletion();
    
    // Restore payment state from session storage
    this.restorePaymentState();
  }

  validPhoneNumber: boolean = true
  phoneNumber: string = ''
  selectedPayment: 'mpesa' | 'airtel' | 'tkash' = 'mpesa';
  empty: boolean = false;
  paymentStatus: boolean = false
  successMessage: string = ''
  failedMessage: string = ''
  success: boolean = false
  failed: boolean = false

  private checkPaymentCompletion() {
    const completedPayment = this.sessionStorageService.get(`payment_completed_${this.ipayRefNo}`);
    if (completedPayment) {
      this.paymentCompleted = true;
      this.completionMessage = completedPayment.message || 'Payment completed successfully';
    }
  }

  private restorePaymentState() {
    if (this.paymentCompleted) return;

    const savedState = this.sessionStorageService.get(`payment_state_${this.ipayRefNo}`);
    if (savedState) {
      this.phoneNumber = savedState.phoneNumber || '';
      this.selectedPayment = savedState.selectedPayment || 'mpesa';
      this.action = savedState.action || 'initiate';
      this.checkoutId = savedState.checkoutId || null;
      this.paymentButtonLabel = savedState.paymentButtonLabel || 'Send STK push';
    }
  }

  private savePaymentState() {
    const state = {
      phoneNumber: this.phoneNumber,
      selectedPayment: this.selectedPayment,
      action: this.action,
      checkoutId: this.checkoutId,
      paymentButtonLabel: this.paymentButtonLabel
    };
    this.sessionStorageService.set(`payment_state_${this.ipayRefNo}`, state);
  }

  private markPaymentCompleted(message: string) {
    const completionData = {
      message: message,
      timestamp: new Date().toISOString()
    };
    this.sessionStorageService.set(`payment_completed_${this.ipayRefNo}`, completionData);
    
    // Clear the payment state 
    this.sessionStorageService.remove(`payment_state_${this.ipayRefNo}`);
    
    this.paymentCompleted = true;
    this.completionMessage = message;
  }

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

  paymentResponse() {
    this.failed = true
    this.paymentStatus = true;
    this.paymentButtonLabel = 'Send STK push'
    this.action = 'initiate';
    this.checkoutId = null
    
    // Save state after failure
    this.savePaymentState();
    
    setTimeout(() => {
      this.paymentStatus = false;
    }, 8000);
  }

  sendSTK() {
    if (this.phoneNumber === '') {
      this.empty = true;
      setTimeout(() => {
        this.empty = false;
      }, 3000);
      return;
    }

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
              
              // Save state after successful initiation
              this.savePaymentState();
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
              this.paymentStatus = true
              this.success = true
              this.successMessage = response.message
              this.paymentButton = false
              this.checkoutId = null
              
              // Mark payment as completed
              this.markPaymentCompleted(response.message || 'Payment completed successfully');
              
            } else if (response._embedded !== 'SUCCESS') {
              this.paymentResponse()
              this.failedMessage = `Transaction failed, ${response.message}`
            }
          }),
          error: ((error) => {
            log.debug(error)
          })
        })
    }
  }

  ngOnDestroy(): void {
    if (!this.paymentCompleted) {
      this.savePaymentState();
    }
  }
}
