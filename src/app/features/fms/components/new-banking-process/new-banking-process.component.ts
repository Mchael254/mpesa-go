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
constructor(
  public translate:TranslateService,
  private fb:FormBuilder
){}
ngOnInit(){
  this.initializeForm();
}
initializeForm():void{
this.bankingForm = this.fb.group(
  {
    startDate:['',Validators.required],
    endDate:['',Validators.required],
    paymentMethod:['',Validators.required]
  }
)
}

}
