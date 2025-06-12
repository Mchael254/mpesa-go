import { Component } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import { dummyPaymentOptions, PaymentOption } from '../../data/dummyData';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ActivatedRoute } from '@angular/router';

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css']
})
export class PaymentCheckoutComponent {

  constructor(private globalMessagingService: GlobalMessagingService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    const ipayRefNo = sessionStorage.getItem(`payment_${token}`);

    if (ipayRefNo) {
      sessionStorage.removeItem(`payment_${token}`);
    } else {
      console.error('Invalid payment link');
    }
  }

  //paymnet
  validPhoneNumber: boolean = false
  phoneNumber: string = ''
  selectedPayment: string = 'mpesa';
  amount: number = 500;
  paymentOptions: PaymentOption[] = dummyPaymentOptions

  get selectedDetails(): PaymentOption | undefined {
    return this.paymentOptions.find(opt => opt.method === this.selectedPayment);
  }

  isValidPhoneNumber(): boolean {
    return /^\d{10}$/.test(this.phoneNumber);
  }

  sendSTK() {
    if (!this.isValidPhoneNumber()) {
      this.validPhoneNumber = true
      setTimeout(() => {
        this.validPhoneNumber = false;
      }, 3000);


      return;
    }

    const paymentDetails = {
      phoneNumber: this.phoneNumber,
      paymentMethod: this.selectedPayment,
      amount: this.amount,
      paybill: this.selectedDetails.paybill,
      account: this.selectedDetails.account
    }
    this.globalMessagingService.displaySuccessMessage('Success', 'ProcessingPayment...Check your phone')

    log.debug(paymentDetails)


  }

}
