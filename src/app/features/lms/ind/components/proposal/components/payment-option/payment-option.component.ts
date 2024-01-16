import { Component, OnDestroy, OnInit } from '@angular/core';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
// import { PaystackOptions } from 'angular4-paystack';


@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
@AutoUnsubscribe
export class PaymentOptionComponent implements OnInit, OnDestroy{

  isMpesaSelected: boolean;
  isCardSelected: boolean;
  isBankSelected: boolean;
  bankList: BankDTO[] = [];
  reference = '';
  title = "CodeSandbox";
  // paymentInstance: PaymentInstance;
  token :string
  paystack_details: {key?: string, email?:string, amount?: string, reference?: string} = {};
  // options: PaystackOptions =  {
  //   amount: 50000 * 100,
  //   email: 'user@mail.com',
  //   ref: `ref-${Math.ceil(Math.random() * 10e13)}`
  // }

 



  constructor(private bank_service: BankService){  }
  ngOnInit(): void {
    // this.getBankList();
    this.paystack_details['key'] = 'sk_test_9f5e8c96f1af351cb674ed100e20a28c56cffd17';
    // this.options = {...this.options }

  }


  

  paymentInit() {
    console.log( this.paystack_details['reference'] );
    // console.log( this.options['ref'] );

    console.log('Payment initialized');
  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';

    console.log(this.title, ref);
    // this.ngOnInit()
  }

  paymentCancel() {
    console.log('payment failed');
    // this.options = {...this.options };
  }

  


 
  paymentFailure() {
    location.reload();
    console.log('Payment Failed');
  }
 
  // paymentSuccess(res) {
  //   console.log('Payment complete', res);
  //   this.paymentInstance.close();
  // }
 
  // paymentInited(paymentInstance) {
  //   this.paymentFailure = paymentInstance;
  //   console.log('Payment about to begin', paymentInstance);
  // }












  getBankList() {
    this.bank_service.getBanks(1100).subscribe((data) => {
      this.bankList = data;
    });
  }

  clickMpesa(){
    this.selectOneFlagAndDefaultRestToFalse('isMpesaSelected');

  }

  clickCard(){
    this.selectOneFlagAndDefaultRestToFalse('isCardSelected');
  }

  clickBank(){
    this.selectOneFlagAndDefaultRestToFalse('isBankSelected');
  }

  private selectOneFlagAndDefaultRestToFalse(selection: string) {
    const flagList: { [key: string]: boolean } = {
      isMpesaSelected: false,
      isCardSelected: false,
      isBankSelected: false,
    };

    if (flagList.hasOwnProperty(selection)) {
      flagList[selection] = true;

      for (const flag in flagList) {
        if (flag !== selection) {
          flagList[flag] = false;
        }
      }

      this.isMpesaSelected = flagList['isMpesaSelected'];
      this.isCardSelected = flagList['isCardSelected'];
      this.isBankSelected = flagList['isBankSelected'];
    } else {
      console.error(`Invalid Name selection: ${selection}`);
    }
  }

  ngOnDestroy(): void {
    console.log("UNSUBSCRIBE PaymentOptionComponent" );

  }


}
