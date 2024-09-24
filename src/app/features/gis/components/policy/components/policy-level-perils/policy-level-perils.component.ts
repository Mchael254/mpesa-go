import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { QuotationsService } from 'src/app/features/gis/services/quotations/quotations.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { Logger, untilDestroyed } from 'src/app/shared/shared.module';
import { PolicyService } from '../../services/policy.service';
import { Table } from 'primeng/table';



const log = new Logger("PolicyLevelPerilsComponent");

@Component({
  selector: 'app-policy-level-perils',
  templateUrl: './policy-level-perils.component.html',
  styleUrls: ['./policy-level-perils.component.css']
})
export class PolicyLevelPerilsComponent {

  policyLevelPerilList:any;
  selectedPolicyLevel:any;
  selectedLevel:any;

  @ViewChild('dt1') dt1: Table | undefined;


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

  openPolicyLevelDeleteModal() {
    log.debug("Selected Policy level Peril", this.selectedPolicyLevel)
    if (!this.selectedPolicyLevel) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select policy level to continue');
    } else {
      document.getElementById("openModalPolicyPerilButtonDelete").click();
    }
  }

  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  clearForm() {

  }
}
