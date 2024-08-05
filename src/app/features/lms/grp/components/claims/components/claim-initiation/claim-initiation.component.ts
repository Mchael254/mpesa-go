import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ClaimsService } from '../../service/claims.service';
import { Logger } from 'src/app/shared/services';
import { ActualCauseDTO, CausationTypesDTO } from '../../models/claim-models';
import { MessageService } from 'primeng/api';

const log = new Logger("ClaimInitiationComponent");
@Component({
  selector: 'app-claim-initiation',
  templateUrl: './claim-initiation.component.html',
  styleUrls: ['./claim-initiation.component.css']
})
export class ClaimInitiationComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimInitForm: FormGroup;
  causationTypes: CausationTypesDTO[] = [];
  actualCauses: ActualCauseDTO[] = [];
  @ViewChild('op') overlayPanel: OverlayPanel;

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    this.claimForm();
    this.getCausationTypes();
    this.getActualCauses();
    
  }

  ngOnDestroy(): void {
    
  }

  onSelectClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('add-causation-link')) {
      this.showOverlay(event);
    }
  }

  showOverlay(event: MouseEvent) {
    this.overlayPanel.toggle({
      target: event.target as HTMLElement,
      currentTarget: event.currentTarget as HTMLElement,
      originalEvent: event
    });
  }

  claimForm() {
    this.claimInitForm = this.fb.group({
      product: [""],
      policy: [""],
      policyMember: [""],
      causationType: [""],
      actualCause: [""],
      reportDate: [""],
      occurenceDate: [""],
      locationOfIncident: [""],
      causationId: [""],
      causationDesc: [""],
      gender: [""],
      claimableMonths: [""]
    });
  }

  submitClaimInitFormData() {
  }

  getCausationTypes() {
    this.claimsService.getCausationTypes(2021675).subscribe((res: CausationTypesDTO[]) => {
      this.causationTypes = res;
      log.info("getCausationTypes", this.causationTypes)
    });
  }

  getActualCauses() {
    this.claimsService.getActualCauses().subscribe((res: ActualCauseDTO[]) => {
      this.actualCauses = res;
      log.info("getActualCauses", this.actualCauses)
    });
  }

  /**
   * The function `addActualType` adds actual cause data to a actual cause list and displays a success
   * message.
   */
  addActualType() {
    const claimformData = this.claimInitForm.value;
    const actaulTypeData = {
      csc_code: claimformData.causationId,
      csc_ddc_code: claimformData.causationDesc,
      csc_sex: claimformData.gender,
      csc_min_claimable_prd: claimformData.claimableMonths
    }

    log.info("actaulTypeData", actaulTypeData)
    this.claimsService.addActualCause(actaulTypeData).subscribe((res) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Actual type successfully added'
      });
      this.getCausationTypes();
    })
  }

}
