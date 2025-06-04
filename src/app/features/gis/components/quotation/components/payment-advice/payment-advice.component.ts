import { Component } from '@angular/core';
import { PaymentAdviceDTO } from '../../data/quotationsDTO';
import { Logger} from "../../../../../../shared/shared.module";
import { dummyPaymentOptions, PaymentOption } from '../../data/dummyData';


const log = new Logger('PaymentAdviceComponent');
@Component({
  selector: 'app-payment-advice',
  templateUrl: './payment-advice.component.html',
  styleUrls: ['./payment-advice.component.css']
})
export class PaymentAdviceComponent {
  

  // paymentAdviceData: PaymentAdviceDTO = {
  //   paymentMethods: [
  //     {
  //       title: 'Cheque',
  //       details: ['Paybill: 123456', 'Account: Your name', 'Drop off: Lavington Chalbi drive']
  //     },
  //     {
  //       title: 'Mpesa',
  //       details: [
  //         'Paybill: 987654',
  //         'Account: Your Name',
  //         'Mobile number: +254712345678',
  //       ]
  //     },
  //     {
  //       title: 'Bank transfer',
  //       details: [
  //         'Bank: ABSA Bank Kenya',
  //         'Account name: TurnQuest Insurance Ltd',
  //         'Account Number: 12345658',
  //         'Branch: Westlands',
  //         'Swift code: ABSAKENX'
  //       ]
  //     },
  //     {
  //       title: 'Airtel money',
  //       details: ['Business name: TurnQuest Insurance Ltd', 'Reference: Your name']
  //     }
  //   ],

  //   footerInfo: [
  //     'Registered Office: Leadway Assurance House NN 28/29 Constitution Road P.O.Box 458, Kaduna',
  //     'Corporate Office: 121/123, Funso Williams Avenue, Iponri G.P.O.Box 6437 Marina, Lagos Tel: (01) 2800700 Email: insureleadway.com Website: www.leadway.com',
  //     'Printed On: 15 February 2025'
  //   ]
  // };

  // pay() {
  //   alert('Proceed to payment!');
  // }

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

    log.debug(paymentDetails)

  }


}
