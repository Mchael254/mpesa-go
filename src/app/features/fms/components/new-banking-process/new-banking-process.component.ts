import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PaymentMethod } from 'src/app/features/lms/grp/components/claims/models/claim-models';

@Component({
  selector: 'app-new-banking-process',
  templateUrl: './new-banking-process.component.html',
  styleUrls: ['./new-banking-process.component.css']
})
export class NewBankingProcessComponent {
  bankingForm:FormGroup;
  paymentMethods=['mpesa','cash','bank'];
  receiptData:ReceiptDto[]=[
    {
      receiptId:"RO1",
      customer:"frankline",
      amount:2000,
      collectionAcc:"CA001",
      assignedTo:"unassigned",
      date:new Date("2020/01/25")


    },
    {
receiptId:"RO1",
      customer:"frankline",
      amount:2000,
      collectionAcc:"CA001",
      assignedTo:"unassigned",
      date:new Date("2000/02/24")
    }
  ];
constructor(
  public translate:TranslateService,
  private fb:FormBuilder
){}
ngOnInit(){
  this.createBankingForm();
  
}
createBankingForm():void{
this.bankingForm = this.fb.group(
  {
    startDate:['',Validators.required],
    endDate:['',Validators.required],
    paymentMethod:['',Validators.required]
  }
)

}


}
export interface ReceiptDto{
  receiptId:string;
  date:Date;
  customer:string;
  amount:number;
  collectionAcc:string;
  assignedTo:string;

}