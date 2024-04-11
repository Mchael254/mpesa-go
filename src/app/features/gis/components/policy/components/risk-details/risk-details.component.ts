import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { PolicyService } from '../../services/policy.service';
import { Router } from '@angular/router';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Subclass, Subclasses, subclassCoverTypes } from '../../../setups/data/gisDTO';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { BinderService } from '../../../setups/services/binder/binder.service';

const log = new Logger("RiskDetailsComponent");

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css']
})
export class RiskDetailsComponent {
  policyRiskForm: FormGroup;
  show: boolean = true;
  isNcdApplicable: boolean = false;
  isCashApplicable: boolean = false;

  passedPolicyDetails:any;
  batchNo:any;
  policyResponse:any;
  policyDetails:any;

  errorMessage: string;
  errorOccurred: boolean;

  subClassList: Subclass[];
  allSubclassList: Subclasses[]
  allMatchingSubclasses = [];
  selectedSubclassCode:any;
  productCode:any;

  binderList: any;
  binderListDetails: any;

  subclassCoverType: subclassCoverTypes[] = [];
  coverTypeCode: any;
  coverTypeDesc: any;

  constructor(
    public fb: FormBuilder,
    private policyService:PolicyService,
    public subclassService: SubclassesService,
    public productService: ProductsService,
    public binderService: BinderService,
    private subclassCoverTypesService: SubClassCoverTypesService,

    public globalMessagingService: GlobalMessagingService,
    private router: Router,
    public cdr: ChangeDetectorRef,

  ) {

  }

  ngOnInit(): void {
    const passedPolicyDetailsString = sessionStorage.getItem('passedPolicyDetails');
    this.passedPolicyDetails = JSON.parse(passedPolicyDetailsString);
    console.log("Passed Policy Details:", this.passedPolicyDetails);
    this.createPolicyRiskForm();
    this.getPolicy();
    this.loadAllSubclass();
  }
  ngOnDestroy(): void { }

  createPolicyRiskForm() {
    this.policyRiskForm = this.fb.group({

      allowed_commission_rate: [''],
      basic_premium:[''],
      binder_code: [''],
      commission_amount: [''],
      commission_rate: [''],
      cover_type_code: [''],
      cover_type_short_description: [''],
      currency_code: [''],
      date_cover_from: [''],
      date_cover_to: [''],
      del_sect: [''],
      gross_premium: [''],
      insureds: this.fb.group({
        client: this.fb.group({
          first_name: [''],
          id: [''],
          last_name: ['']
        }),
        prp_code:[''],
      }),
      ipu_ncd_cert_no: [''],
      loaded: [''],
      lta_commission: [''],
      net_premium: [''],
      paid_premium: [''],
      policy_batch_no: [''],
      policy_number: [''],
      policy_status: [''],
      product_code: [''],
      property_description: [''],
      property_id: [''],
      quantity: [''],
      reinsurance_endorsement_number: [''],
      renewal_area: [''],
      risk_fp_override:[''],
      risk_ipu_code: [''],
      sections: this.fb.array([
        this.fb.group({
          div_factor: [0],
          free_limit: [0],
          limit_amount: [0],
          multiplier_rate: [0],
          pil_prem_rate: [0],
          premium: [0],
          rate_type: [''],
          sect_code: [0],
          sect_ipu_code: [0],
          section_code: [0],
          section_desc: [''],
          section_short_desc: ['']
        })
      ]),
      stamp_duty: [''],
      sub_class_code:[''],
      sub_class_description: [''],
      transaction_type: [''],
      underwriting_year: [''],
      value: [''],
    });
  }
  toggleNcdApplicableFields(checked: boolean) {
    this.isNcdApplicable = checked;
  }
  toggleCashApplicableField(checked: boolean) {
    this.isCashApplicable = checked;
  }
  getPolicy(){
    this.batchNo= this.passedPolicyDetails.batchNumber;
    log.debug("Batch No:",this.batchNo)
    this.policyService
    .getPolicy(this.batchNo)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (data) => {

        if (data) {
          this.policyResponse = data;
          log.debug("Get Policy Endpoint Response", this.policyResponse)
          this.policyDetails = this.policyResponse.content[0]
          log.debug("Policy Details", this.policyDetails)
         this.productCode=this.policyDetails.product.code;
         log.debug("Product Code", this.productCode)
          this.getProductSubclass();
          this.cdr.detectChanges();
        
        } else {
          this.errorOccurred = true;
          this.errorMessage = 'Something went wrong. Please try Again';
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Something went wrong. Please try Again'
          );
        }
      },
      error: (err) => {

        this.globalMessagingService.displayErrorMessage(
          'Error',
          this.errorMessage
        );
        log.info(`error >>>`, err);
      },
    });
  }
  loadAllSubclass() {
    return this.subclassService.getAllSubclasses().subscribe(data => {
      this.allSubclassList = data;
      log.debug(this.allSubclassList, "All Subclass List");
      this.cdr.detectChanges();

    })
  }
  getProductSubclass() {
    this.productService.getProductSubclasses(this.productCode).subscribe(data => {
      this.subClassList = data._embedded.product_subclass_dto_list;
      log.debug(this.subClassList, 'Product Subclass List');

      this.subClassList.forEach(element => {
        const matchingSubclasses = this.allSubclassList.filter(subCode => subCode.code === element.sub_class_code);
        this.allMatchingSubclasses.push(...matchingSubclasses); 
      });

      log.debug("Retrieved Subclasses by code", this.allMatchingSubclasses);


      this.cdr.detectChanges();
    });
  }
  onSubclassSelected(event: any) {
    const selectedValue = event.target.value; 
    this.selectedSubclassCode = selectedValue;
    // Perform your action based on the selected value
    log.debug(this.selectedSubclassCode, 'Sekected Subclass Code')

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders();
    // this.loadSubclassSectionCovertype();

  }
  loadAllBinders() {
    this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(data => {
      this.binderList = data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      console.log("All Binders Details:", this.binderListDetails);
    });
  }
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
      this.subclassCoverType = data;
      log.debug('Subclass Covertype', this.subclassCoverType);

      this.cdr.detectChanges();
    })
  }
  onCoverTypeSelected(event:any){
    const selectedValue = event.target.value; 
    this.coverTypeCode= selectedValue;
    log.debug("Cover Type Code:",this.coverTypeCode)
  }
}

