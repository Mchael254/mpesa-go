import { Component } from '@angular/core';
import { Logger } from 'src/app/shared/services';
import { dummyPaymentOptions, PaymentOption } from '../../data/dummyData';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment-service/payment.service';

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-payment-checkout',
  templateUrl: './payment-checkout.component.html',
  styleUrls: ['./payment-checkout.component.css']
})
export class PaymentCheckoutComponent {

  ipayRefNo: string
  sumInsured: number;
  tenantId: string;
  amount:number = 0;

  currencyPrefix: string;
  currencyThousands: string;

  constructor(private globalMessagingService: GlobalMessagingService,
    private route: ActivatedRoute,
    private paymentService: PaymentService) {

  }

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParamMap;
    const ipRef = queryParams.get('ref');
    const sumInsured = queryParams.get('sumInsured');
    const tenant = queryParams.get('tenant');

    this.currencyPrefix = queryParams.get('currencyPrefix') || '';


    this.sumInsured = Number(sumInsured);
    this.tenantId = tenant;
    this.ipayRefNo = ipRef;
    this.amount = Number(sumInsured)


    console.log('ipay ref:', this.ipayRefNo);
    console.log('Sum Insured:', this.sumInsured);
    console.log('Tenant:', this.tenantId);
  }


  //paymnet
  validPhoneNumber: boolean = false
  phoneNumber: string = ''
  selectedPayment: string = 'mpesa';
 
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

    const paymentPayload = {
      TransactionCode: this.ipayRefNo,//ipayRefNumber
      PhoneNumber: this.phoneNumber,
      Amount: this.amount,
      // paybill: this.selectedDetails.paybill,
      // account: this.selectedDetails.account,
      // paymentMethod: this.selectedPayment,
    }

    log.debug('this is payment payload>>>', paymentPayload)

    this.paymentService.initiatePayment(paymentPayload).subscribe({
      next: ((res) => {
        log.debug(res.data)
        this.globalMessagingService.displaySuccessMessage('Success', 'ProcessingPayment...Check your phone')

      }),
      error: ((err) => {
        log.debug(err)
        this.globalMessagingService.displayErrorMessage('Error', err)
      })
    })

  }

}
