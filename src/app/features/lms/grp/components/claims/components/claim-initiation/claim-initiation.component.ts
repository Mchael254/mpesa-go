import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ClaimsService } from '../../service/claims.service';
import { Logger } from 'src/app/shared/services';
import { ActualCauseDTO, CausationTypesDTO, ClaimPoliciesDTO, DocumentsToUploadDTO, FileDetailsDTO, newClaimDTO, PolicyMemberDTO, ProductListDTO } from '../../models/claim-models';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/features/lms/service/product/product.service';
import { AutoUnsubscribe } from 'src/app/shared/services/AutoUnsubscribe';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionStorageService } from 'src/app/shared/services/session-storage/session-storage.service';


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
  trans_no: string;
  endorsementCode: number;
  status: string;
  claimPolicies: ClaimPoliciesDTO[] = [];
  caus_type: string;
  caus_sht_desc: string;
  causationCode: number;
  today: Date = new Date();
  maxOccurrenceDate: Date = new Date();
  defaultOccurrenceDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService,
    private messageService: MessageService,
    private product_service: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private spinner_Service: NgxSpinnerService,
    private session_storage: SessionStorageService,
  ) {}
  
  ngOnInit(): void {
    this.claimForm();
    // this.getCausationTypes();
    // this.getActualCauses();
    this.getProducts();
    // this.getPolicyMembers();
    // this.getDocumentsToUpload();
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
      product: ["", Validators.required],
      policy: ["", Validators.required],
      policyMember: ["", Validators.required],
      causationType: ["", Validators.required],
      actualCause: ["", Validators.required],
      reportDate: ["", Validators.required],
      occurenceDate: ["", Validators.required],
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

  // highlights a touched/clicked/dirtified field that is not filled or option not selected
  highlightInvalid(field: string): boolean {
    const control = this.claimInitForm.get(field);
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * The function `onReportDateSelect` sets the max and default occurrence dates based on a selected
   * report date and resets the occurrence date if it's after the new max date.
   * @param {any} event - The `onReportDateSelect` function takes an `event` parameter of type `any`.
   * This event is used to extract a date value, which is then used to set the maximum occurrence date,
   * default occurrence date, and potentially reset the occurrence date in a form.
   */
  onReportDateSelect(event: any) {
    const reportDate = new Date(event);
    
    // Set the max date for the occurrence date to be the selected report date
    this.maxOccurrenceDate = reportDate;
    
    // Set the default date for the occurrence date to scroll the calendar or based on report date selected
    this.defaultOccurrenceDate = reportDate;
  
    // Reset occurrence date if it's after the new max date
    const occurrenceDate = this.claimInitForm.get('occurenceDate')?.value;
    if (occurrenceDate && new Date(occurrenceDate) > reportDate) {
      this.claimInitForm.get('occurenceDate')?.reset();
    }
  }

  submitClaimInitFormData() {
    if(this.claimInitForm.invalid) {
       /*
        together with the method -highlightInvalid(field: string), it helps
         highlight all invalid form fields on click of Book claim button
         */
         Object.keys(this.claimInitForm.controls).forEach(field => {
          const control = this.claimInitForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      this.messageService.add({severity: 'warn', summary: 'Warning', detail: 'Fill mandatory fields'});
      return;
    } else {
    this.spinner_Service.show('download_view');
    const claimformData = this.claimInitForm.value;
    const bookClaimData = {
      product: Number(claimformData.product),
      pol_code: Number(claimformData.policy.policy_code),
      polm_code: Number(claimformData.policyMember),
      caus_code: claimformData.causationType,
      ddc_code: Number(claimformData.actualCause),
      claim_date: this.formatDate(new Date(claimformData.reportDate)),
      loss_date: this.formatDate(new Date(claimformData.occurenceDate)),
      clm_location: claimformData.locationOfIncident,
      caus_sht_desc: this.caus_sht_desc,
      caus_type: this.caus_type,
      trans_type: "LO",
    }
    log.info("submitClaimInitFormData",claimformData, bookClaimData)
    this.claimsService.createNewClaim(bookClaimData, this.policyCode).subscribe((res: newClaimDTO) => {
      log.info("createNewClaim", res)
      if (res) {
        this.spinner_Service.hide('download_view');
        this.messageService.add({severity: 'success', summary: 'Summary', detail: 'Claim initiated successfully'});
        this.claimNo = res.claim_no;
        this.trans_no = res.trans_no.toString();
        this.cdr.detectChanges();

        /* navigate to claim admission screen after successfully initiating claim */
        this.router.navigate(['/home/lms/grp/claims/admission'], {
          queryParams: {
            claimNumber: this.claimNo,
          }
        });
        this.session_storage.set('claimNumber', this.claimNo);
        this.session_storage.set('transactionNumber', this.trans_no);
        this.session_storage.set('polMemCode', +claimformData.policyMember);

        //to remove once fetched
        this.session_storage.set('polAndProdCode', {
          productCode: bookClaimData.product,
          policyCode: bookClaimData.pol_code
        });

      }
    }, (error) => {
      this.spinner_Service.hide('download_view');
      this.messageService.add({severity: 'error', summary: 'summary', detail: 'Error initiating claim'});

    }
  );
}
  }

  getCausationTypes() {
    this.claimsService.getCausationTypes(this.productCode).subscribe((res: CausationTypesDTO[]) => {
      this.causationTypes = res;
      this.cdr.detectChanges();
    });
  }

  /**
   * The function `onCausationTypeChange` handles the change event for a causation type selection,
   * updating relevant properties based on the selected cause code.
   * @param {any} event - The `onCausationTypeChange` function takes an `event` parameter as input.
   * This event parameter is typically an object that represents an event triggered by a user action,
   * such as a change in a dropdown selection or input field. In this function, we get causation code which is used to fetch
   * actual causes, hence calling the method getActualCauses() inside it.
   */
  onCausationTypeChange(event: any) {
    this.claimInitForm.get('actualCause').reset();

    const selectedCauseCode = event.target.value;
    
    this.causationCode = selectedCauseCode;
    this.getActualCauses();
    this.cdr.detectChanges();

    const selectedCausation = this.causationTypes.find(causation => causation.cause_code === +selectedCauseCode);
    
    if (selectedCausation) {
      this.caus_sht_desc = selectedCausation.cause_short_desc,
      this.caus_type = selectedCausation.cause_type
    }
  }

  getActualCauses() {
    this.claimsService.getActualCauses(this.causationCode).subscribe((res: ActualCauseDTO[]) => {
      this.actualCauses = res;
      this.cdr.detectChanges();
    });
  }

  /**
   * The function `addActualType` adds actual cause data to a actual cause list and displays a success
   * message.
   */
  addActualType() {
    this.spinner_Service.show('download_view');
    const claimformData = this.claimInitForm.value;
    const actaulTypeData = {
      death_disability_cause_code: this.causationCode,
      death_disability_short_desc: claimformData.causationId,
      death_disability_description: claimformData.causationDesc,
      gender: claimformData.gender,
      min_claimable_prd: claimformData.claimableMonths,
    }

    log.info("actaulTypeData", actaulTypeData)
    if(this.causationCode === null || this.causationCode === undefined) {
      this.spinner_Service.hide('download_view');
      this.messageService.add({
        severity: 'info',
        summary: 'Information',
        detail: 'Select causation type first!'
      });
      return;
    } else {
    this.claimsService.addActualCause(actaulTypeData).subscribe((res) => {
      this.spinner_Service.hide('download_view');
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Actual type successfully added'
      });
      this.getActualCauses();
      this.cdr.detectChanges();
    }, (error) => {
      this.spinner_Service.hide('download_view');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Actual type NOT added!'
      });
    })
  }
  }

  getProducts() {
    this.product_service.getListOfProduct('G').subscribe((products) => {
      this.productList = products;
      this.cdr.detectChanges();
    });
  }

  getPolicyMembers() {
    this.claimsService.getPolicyMembers(this.policyCode).subscribe((res: PolicyMemberDTO[]) => {
      this.policyMembers = res;
      this.cdr.detectChanges();
    });
  }


  getClaimPolicies() {
      this.claimsService.getClaimPolicies(this.productCode,this.policyCode, this.status, this.endorsementCode).pipe(untilDestroyed(this)).subscribe((res: ClaimPoliciesDTO[]) => {
        this.claimPolicies = res;
        this.cdr.detectChanges();
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
      this.cdr.detectChanges();
      this.getClaimPolicies();
      this.getCausationTypes();
    });
  }

  getPolicyCode() {
    this.claimInitForm.get('policy').valueChanges.pipe(untilDestroyed(this)).subscribe((res) => {
        if (res && res.policy_code) {
          this.claimInitForm.get('policyMember').reset();
          this.policyCode = res.policy_code;
          this.getPolicyMembers();
          this.cdr.detectChanges();
        }
      });
  }

}
