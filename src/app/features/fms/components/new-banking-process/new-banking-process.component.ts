import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import { GlobalMessagingService } from './../../../../shared/services/messaging/global-messaging.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Logger } from 'src/app/shared/services';
 const log = new Logger('NewBankingProcessComponent');
import { Logger } from 'src/app/shared/services';
 const log = new Logger('NewBankingProcessComponent');
@Component({
  selector: 'app-new-banking-process',
  templateUrl: './new-banking-process.component.html',
  styleUrls: ['./new-banking-process.component.css'],
})
export class NewBankingProcessComponent {
  bankingForm: FormGroup;
  
  
  paymentMethods = ['mpesa', 'cash', 'bank'];
  receiptData: ReceiptDto[] = [
    {
      receiptId: 'RO1',
      customer: 'frankline',
      amount: 2000,
      collectionAcc: 'CA001',
      assignedTo: 'unassigned',
      date: new Date('2020/01/25'),
    },
    {
      receiptId: 'RO2',
      customer: 'frankline',
      amount: 2000,
      collectionAcc: 'CA001',
      assignedTo: 'unassigned',
      date: new Date('2000/02/24'),
    },
  ];
  selectedReceipt!: ReceiptDto;
  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private globalMessagingService:GlobalMessagingService,
    
  ) {
   
  }
    private router: Router,
    private globalMessagingService:GlobalMessagingService,
    
  ) {
   
  }
  ngOnInit() {
    this.createBankingForm();
  }
  createBankingForm(): void {
    this.bankingForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      paymentMethod: ['mpesa', Validators.required],
      paymentMethod: ['mpesa', Validators.required],
    });
  }
onClickRetrieveRcts(){
  //  Mark all fields as touched to show any validation errors in the UI
this.bankingForm.markAllAsTouched();
  if (!this.bankingForm.valid){
    this.globalMessagingService.displayErrorMessage("","please fill the required fields");
    return;
  }
}
onClickRetrieveRcts(){
  //  Mark all fields as touched to show any validation errors in the UI
this.bankingForm.markAllAsTouched();
  if (!this.bankingForm.valid){
    this.globalMessagingService.displayErrorMessage("","please fill the required fields");
    return;
  }
}
  navigateToBatch(): void {
//console.log("the record is",this.selectedReceipt);
//console.log("the record is",this.selectedReceipt);
    this.router.navigate(['/home/fms/process-batch']);
    
  }
onRowSelected(event:any):void{
  const s =(event.target as HTMLInputElement).value;
console.log("event",s);
}

}
export interface ReceiptDto {
  receiptId: string;
  date: Date;
  customer: string;
  amount: number;
  collectionAcc: string;
  assignedTo: string;
}
