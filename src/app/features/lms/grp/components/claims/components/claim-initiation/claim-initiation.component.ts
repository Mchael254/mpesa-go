import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ClaimsService } from '../../service/claims.service';
import { Logger } from 'src/app/shared/services';
import { ActualCauseDTO, CausationTypesDTO, PolicyMemberDTO, ProductListDTO } from '../../models/claim-models';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';


const log = new Logger("ClaimInitiationComponent");
@AutoUnsubscribe
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
  productCode: number = 2021675;
  productList: ProductListDTO[] = [];
  policyCode: number = 2024826;
  policyMembers: PolicyMemberDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private messageService: MessageService,
    private product_service: ProductService,
  ) {}
  
  ngOnInit(): void {
    this.claimForm();
    this.getCausationTypes();
    this.getActualCauses();
    this.getProducts();
    this.getPolicyMembers();
    
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
    const claimformData = this.claimInitForm.value;
    const bookClaimData = {
      // product: claimformData.product,
      // policy: claimformData.policy,
      pol_code: 2024826,
      polm_code: claimformData.policyMember,
      caus_type: claimformData.causationType,
      caus_code: claimformData.actualCause,
      claim_date: claimformData.reportDate,
      loss_date: claimformData.occurenceDate,
      clm_location: claimformData.locationOfIncident
    }
    log.info("submitClaimInitFormData", bookClaimData)
    this.claimsService.createNewClaim(bookClaimData, 2023248).subscribe((res) => {
      log.info("createNewClaim", res)
    });
  }

  getCausationTypes() {
    this.claimsService.getCausationTypes(this.productCode).subscribe((res: CausationTypesDTO[]) => {
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

  getProducts() {
    this.product_service.getListOfProduct('G').subscribe((products) => {
      this.productList = products;
    });
  }

  getPolicyMembers() {
    this.claimsService.getPolicyMembers(this.policyCode).subscribe((res: PolicyMemberDTO[]) => {
      this.policyMembers = res;
      log.info("getPolicyMembers", res);
    });
  }

}
