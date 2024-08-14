import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ClaimsService } from '../../service/claims.service';
import { Logger } from 'src/app/shared/services';
import { ActualCauseDTO, CausationTypesDTO, ClaimPoliciesDTO, DocumentsToUploadDTO, FileDetailsDTO, PolicyMemberDTO, ProductListDTO } from '../../models/claim-models';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { untilDestroyed } from 'src/app/shared/shared.module';


const log = new Logger("ClaimInitiationComponent");
@AutoUnsubscribe
@Component({
  selector: 'app-claim-initiation',
  templateUrl: './claim-initiation.component.html',
  styleUrls: ['./claim-initiation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClaimInitiationComponent implements OnInit, OnDestroy {
  steps = stepData;
  claimInitForm: FormGroup;
  causationTypes: CausationTypesDTO[] = [];
  actualCauses: ActualCauseDTO[] = [];
  @ViewChild('op') overlayPanel: OverlayPanel;
  productCode: number;
  productList: ProductListDTO[] = [];
  policyCode: number;
  policyMembers: PolicyMemberDTO[] = [];
  claimNo: string;
  documents: DocumentsToUploadDTO[] = [];
  selectedFile: FileDetailsDTO = null;
  endorsementCode: number;
  status: string;
  claimPolicies: ClaimPoliciesDTO[] = []

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private messageService: MessageService,
    private product_service: ProductService,
    private cdr: ChangeDetectorRef
  ) {}
  
  ngOnInit(): void {
    this.claimForm();
    // this.getCausationTypes();
    this.getActualCauses();
    this.getProducts();
    // this.getPolicyMembers();
    this.getDocumentsToUpload();
    // this.getClaimPolicies();
    this.getProductCode();
    this.getPolicyCode();
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

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  submitClaimInitFormData() {
    const claimformData = this.claimInitForm.value;
    const bookClaimData = {
      product: Number(claimformData.product),
      pol_code: Number(claimformData.policy),
      polm_code: Number(claimformData.policyMember),
      caus_type: claimformData.causationType,
      caus_code: Number(claimformData.actualCause),
      claim_date: this.formatDate(new Date(claimformData.reportDate)),
      loss_date: this.formatDate(new Date(claimformData.occurenceDate)),
      clm_location: claimformData.locationOfIncident
    }
    log.info("submitClaimInitFormData",claimformData, bookClaimData)
    this.claimsService.createNewClaim(bookClaimData, this.policyCode).subscribe((res) => {
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

/**
 * The function `getDocumentsToUpload` retrieves list of documents to upload for a specific claim number. claimNo- 'CLM/GLA-726/2024'
 */
  getDocumentsToUpload() {
    this.claimsService.getDocumetsToUpload(this.claimNo).pipe(untilDestroyed(this)).subscribe((res: DocumentsToUploadDTO[]) => {
      this.cdr.detectChanges();
      this.documents = res;
    });
  }

  /**
   * The function `onFileSelected` is triggered when a file is selected, and it logs the selected file
   * and the associated document label.
   * @param {any} event - The `event` parameter typically represents the event that occurred, such as a
   * file selection event in this case. It contains information about the event, including the target
   * element that triggered the event (in this case, the file input element).
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      log.info('File selected:', this.selectedFile);
      // file upload service call
     
    }
  }

  getClaimPolicies() {
      this.claimsService.getClaimPolicies(this.productCode,this.policyCode, this.status, this.endorsementCode).pipe(untilDestroyed(this)).subscribe((res: ClaimPoliciesDTO[]) => {
        this.claimPolicies = res;
        log.info("getClaimPolicies", res)
      });
  }

  getProductCode() {
    this.claimInitForm.get('product').valueChanges.pipe(untilDestroyed(this)).subscribe((res) =>{
      /* The code `['policy', 'causationType'].forEach(control => {
          this.claimInitForm.get(control).reset();
      });` is iterating over an array `['policy', 'causationType']` and for each element in the
      array, it is resetting the corresponding form control in the `claimInitForm` FormGroup. */
      ['policy', 'causationType'].forEach(control => {
        this.claimInitForm.get(control).reset();
      });
      this.productCode = res;
      this.getClaimPolicies();
      this.getCausationTypes();
      this.cdr.detectChanges();
    });
  }

  getPolicyCode() {
    this.claimInitForm.get('policy').valueChanges.pipe(untilDestroyed(this)).subscribe((res) =>{
      this.claimInitForm.get('policyMember').reset();
      this.policyCode = res;
      this.getPolicyMembers();
      this.cdr.detectChanges();
    });
  }

}
