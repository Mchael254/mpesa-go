import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { Logger } from 'src/app/shared/services';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyResponseDTO, PolicyContent } from '../../data/policy-dto';
import { PolicyService } from '../../services/policy.service';
const log = new Logger("PolicySubclasessClausesComponent");

@Component({
  selector: 'app-policy-subclasess-clauses',
  templateUrl: './policy-subclasess-clauses.component.html',
  styleUrls: ['./policy-subclasess-clauses.component.css']
})

export class PolicySubclasessClausesComponent {
  policyDetails: any;
  batchNo: any;
  policyResponse: PolicyResponseDTO;
  policyDetailsData: PolicyContent;
  riskDetails: any;
  selectedTransactionType: any;
  passedBinderCode: any;
  errorMessage: string;
  errorOccurred: boolean;
  productClauseList: any;
  // selectedPolicyClause: any;
  selectedPolicyClause: any = {};  // Initialize as an empty object

  modalHeight: number = 200;
  policyClausesDetailsForm: FormGroup;
  editPolicySubclassesClausesDetailsForm: FormGroup;
  selectedPolicySubclassClauses: any;





  constructor(
    public globalMessagingService: GlobalMessagingService,
    public cdr: ChangeDetectorRef,
    public quotationService: QuotationsService,
    public policyService: PolicyService,
    public fb: FormBuilder,



  ) { }
  ngOnInit(): void {
   
  }
  ngOnDestroy(): void { }

  onResize(event: any) {
    this.modalHeight = event.height;
  }
  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }
  openPolicySubclassesVlauseDeleteModal() {
    log.debug("Selected Policy Tax", this.selectedPolicySubclassClauses)
    if (!this.selectedPolicySubclassClauses) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a clause to continue');
    } else {
      document.getElementById("openModalPolicySubclassesClauseButtonDelete").click();

    }
  }
}
