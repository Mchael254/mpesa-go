import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-claim-booking',
  templateUrl: './claim-booking.component.html',
  styleUrls: ['./claim-booking.component.css']
})
export class ClaimBookingComponent {
  lossDate = '18/02/2020';
  partyToBlame = 'Party To Blame';
  lossDescription = 'THEFT OF HUAWEI DEVICE ASSIGNED TO OKONKWO PAUL CHUKWU ON 18/01/2020';
  salvageRetained = 'No';
  amtOwedDefaulter = 'Amt Owed Defaulter';
  raining = 'No';
  claimRepudiated = 'No';
  reasonRepudiated = 'Reason Repudiated';
  reasonsForPending = 'Reasons for Pending';
  preventionMeasures = 'Prevention Measures';
  anySuspects = 'Any Suspects';
  claimAmount = '0';
  visibility = 'Visibility';
  insuranceContactPerson = 'Insurance Contact Person';
  refNo = 'Ref No';
  recoveryStepsTaken = 'Recovery Steps Taken';

  // Multilingual data (Replace with your translations)
  translationKeys = {
    lossDate: 'lossDate',
    partyToBlame: 'partyToBlame',
    lossDescription: 'lossDescription',
    salvageRetained: 'salvageRetained',
    amtOwedDefaulter: 'amtOwedDefaulter',
    raining: 'raining',
    claimRepudiated: 'claimRepudiated',
    reasonRepudiated: 'reasonRepudiated',
    reasonsForPending: 'reasonsForPending',
    preventionMeasures: 'preventionMeasures',
    anySuspects: 'anySuspects',
    claimAmount: 'claimAmount',
    visibility: 'visibility',
    insuranceContactPerson: 'insuranceContactPerson',
    refNo: 'refNo',
    recoveryStepsTaken: 'recoveryStepsTaken'
  };

}
