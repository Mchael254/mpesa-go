import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent} from '../../data/policy-dto';
import { PolicyService } from '../../services/policy.service';

const log = new Logger("ReasonsForPendingComponent");

@Component({
  selector: 'app-reasons-for-pending',
  templateUrl: './reasons-for-pending.component.html',
  styleUrls: ['./reasons-for-pending.component.css']
})
export class ReasonsForPendingComponent {
  errorOccurred: boolean;
  errorMessage: string;
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  reasonForPendingList: any[] = [];
  reasonsList:any;
  selectedReason: any;
  reasonsForPendingDetailsForm: FormGroup;

  
  clientCode: number;

  @ViewChild('closebutton') closebutton;
  @ViewChild('closeEditClaimButton') closeEditClaimButton;


  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public authService: AuthService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }
  ngOnInit(): void {
   
  }
  ngOnDestroy(): void { }

  openReasonForPendingDeleteModal() {
    log.debug("Selected External Claim", this.selectedReason)
    if (!this.selectedReason) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a reason to continue');
    } else {
      document.getElementById("openReasonForPendingButtonDelete").click();

    }
  }
}
