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

  decodedIpayRefNo: string
  encodedIpayRefNo: string

  ngOnInit() {
    const encodedRef = this.route.snapshot.paramMap.get('ipayRefNumber'); 
    console.log('Token from URL:', encodedRef);

    if (encodedRef) {
      try {
        this.decodedIpayRefNo = atob(encodedRef);
        console.log('Decoded iPay Reference:', this.decodedIpayRefNo);
      } catch (error) {
        console.error('Error decoding iPay reference:', error);
      }
    } else {
      console.error('Invalid payment link - no reference found');
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
      ipayReferenceNumber: this.decodedIpayRefNo,
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
