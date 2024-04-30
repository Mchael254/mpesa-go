import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {AutoUnsubscribe} from "../../../../../../../shared/services/AutoUnsubscribe";
import {BankDTO} from "../../../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../../../shared/services/setups/bank/bank.service";
import {SessionStorageService} from "../../../../../../../shared/services/session-storage/session-storage.service";
import {StringManipulation} from "../../../../../util/string_manipulation";
import {SESSION_KEY} from "../../../../../util/session_storage_enum";


@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.css']
})
@AutoUnsubscribe
export class PaymentOptionComponent implements OnInit, OnDestroy{


  @Input() payment_details: any = {};
  @Input() client: any = {};

  isMpesaSelected: boolean;
  isCardSelected: boolean;
  isBankSelected: boolean;
  bankList: BankDTO[] = [];
  reference = '';
  title: string;
  // paymentInstance: PaymentInstance;
  token :string
  client_record: any;

  paystack_details: {key?: string, email?:string, amount?: string, reference?: string} = {};
  options: any =  {
    amount: this.payment_details?.premium * 100,
    email: 'user@gmail.com',
    ref: `ref-${Math.ceil(Math.random() * 10e13)}`
  }
  quote: any;



  constructor(private bank_service: BankService, private session_storage: SessionStorageService){  }
  ngOnInit(): void {
    this.quote = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.QUOTE_DETAILS))
    this.quote['proposal_no'] = StringManipulation.returnNullIfEmpty(this.session_storage.get(SESSION_KEY.WEB_QUOTE_DETAILS))?.proposal_no
    this.options['email'] = new String(this.client?.emailAddress).toLowerCase();
    this.paystack_details['key'] = 'sk_test_9f5e8c96f1af351cb674ed100e20a28c56cffd17';
    this.options['amount'] = Math.ceil(this.payment_details['premium'])*100;
    this.options = {...this.options }

  }




  paymentInit() {
    console.log( this.paystack_details['reference'] );
    console.log( this.options['ref'] );

    console.log('Payment initialized');
    console.log(this.payment_details);

  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';

    console.log(this.title, ref);
    // this.ngOnInit()
  }

  paymentCancel() {
    console.log('payment failed');
    this.options = {...this.options };
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
