import { Component, OnDestroy, OnInit } from '@angular/core';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';

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

  constructor(){}
  ngOnInit(): void {
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
