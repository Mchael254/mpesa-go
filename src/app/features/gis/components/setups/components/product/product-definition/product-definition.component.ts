import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Field, FormScreen } from '../../../data/gisDTO';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-definition',
  templateUrl: './product-definition.component.html',
  styleUrls: ['./product-definition.component.css']
})
export class ProductDefinitionComponent implements OnInit{

  showParent = true;
  showsubclass = true;
  showdocument = true;
  filterby: any;
  subclassform: FormGroup
  productGroupForm: FormGroup
  productForm: FormGroup
  showOptionalFields: boolean = false;
  mandatoryFrontendScreens:  Field[] = [];
  optionalFrontendScreens: Field[] = [];
  show:boolean = true;
  updateFormFields!:FormScreen
  response: any = [];
  prodGroup: any;
  prodGCode: number;
  unAssignedSubclasses: any;
  selected: any;
  prodCode: number;
  allSubclasses: any;
  productList: any = [];
  singleSubclass: any
  selectedCard: number = 0;
  productSubclassResponse: any;
  testForm: FormGroup = new FormGroup<any>({});
  constructor(
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private gisService: ProductService
  ) { }
  ngOnInit(): void {
    this.loadAllProductGroupWithProducts()
    this.createProductForm()
    this.createProductGroupForm()
    this.getForms()
    this.createProductSubClassForm()
  }
  hideParent() {
    this.showParent = !this.showParent;
  }
  hideSubclass() {
    this.showsubclass = !this.showsubclass;
  }
  hideProductDocument() {
    this.showdocument = !this.showdocument;
  }
  selectCard(trackCard: number): void {
    this.selectedCard = trackCard;
  }
  onRowSelect(code: number) {
    this.getsubclasseswithCode(code)
  }
  createProductSubClassForm() {
    this.subclassform = this.fb.group({
      code: ['', Validators.required],
      is_mandatory: ['', Validators.required],
      sub_class_code: ['', Validators.required],
      policyDocumentOrderNumber: 2,
      product_group_code: this.prodGCode,
      product_code: this.prodCode,
      product_short_description: null,
      underwriting_screen_code: ['', Validators.required],
      date_with_effect_from: ['', Validators.required],
      date_with_effect_to: ['', Validators.required],
      version: 1,

    })
  }
  getsubclasseswithCode(code: any){
    this.gisService.getsubclassByCode(code).subscribe(data =>{
      this.singleSubclass = data;
      this.subclassform.patchValue(this.singleSubclass)
      console.log(this.singleSubclass);
      this.cdr.detectChanges();
    })
  
  }
  createProductSubclass() {
    const observables = this.selected.map(element => {
      
      const  sectionsArray: any = {
        code: null,
        isMandatory: element.isMandatory,
        sub_class_code: element.code,
        policyDocumentOrderNumber: 2,
        product_group_code: 700,
        product_code: 3967,
        product_short_description: null,
        underwriting_screenCode: element.underwritingScreenCode,
        date_with_effect_from: element.withEffectFrom, 
        date_with_effect_to: element.withEffectTo,
        version: 1,
        } 
        return this.gisService.createProductSubclasses(sectionsArray);
      });
     
      forkJoin(observables).subscribe(
        () => {
          this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
        },
        (error: HttpErrorResponse) => {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
        }
      );

  }
  createProductGroupForm() {
    this.productGroupForm = this.fb.group({
      code: null,
      description: ['', Validators.required],
      type: ['', Validators.required],
      organizationCode: ['2', { nonNullable: true }],
    })
  }
  createProductForm() {
    this.productForm = this.fb.group({
      code: null,
      shortDescription: ['', Validators.required],
      description: ['', Validators.required],
      productGroupCode: ['', Validators.required],
      withEffectFrom: ['', Validators.required],
      withEffectTo: ['', Validators.required],
      policyPrefix: ['', Validators.required],
      organizationCode: ['2', { nonNullable: true }],
      claimPrefix: ['', Validators.required],
      underwritingScreenCode: ['', Validators.required],
      claimScreenCode: null,
      expires: "Y",
      doesCashBackApply: "Y",
      minimumSubClasses: 1,
      acceptsMultipleClasses: "N",
      minimumPremium: null,
      isRenewable: "Y",
      allowAccommodation: "N",
      openCover: "N",
      productReportGroupsCode: 1,
      policyWordDocument: null,
      shortName: "AVIATION HULL",
      endorsementMinimumPremium: null,
      showSumInsured: "Y",
      showFAP: "Y",
      policyCodePages: null,
      policyDocumentPages: null,
      isPolicyNumberEditable: "N",
      policyAccumulationLimit: null,
      insuredAccumulationLimit: null,
      totalCompanyAccumulationLimit: null,
      enableSpareParts: "N",
      prerequisiteProductCode: null,
      allowMotorClass: "N",
      allowSameDayRenewal: "N",
      acceptUniqueRisks: null,
      industryCode: null,
      webDetails: null,
      showOnWebPortal: "N",
      areInstallmentAllowed: "Y",
      interfaceType: "ACCRUAL",
      isMarine: null,
      allowOpenPolicy: "N",
      order: null,
      isDefault: "N",
      prorataType: null,
      doFullRemittance: null,
      productType: null,
      checkSchedule: null,
      scheduleOrder: 1,
      isPinRequired: "Y",
      maximumExtensions: null,
      autoGenerateCoverNote: "N",
      commissionRate: null,
      autoPostReinsurance: "N",
      insuranceType: null,
      years: null,
      enableWeb: null,
      doesEscalationReductionApply: null,
      isLoanApplicable: null,
      isAssignmentAllowed: null,
      minimumAge: null,
      maximumAge: null,
      minimumTerm: null,
      maximumTerm: null,
      termDistribution: null,
    })
  }
  loadAllProductGroupWithProducts() {
    return this.gisService.getGroupedData().subscribe((data: {}) => {
      this.productList = data;
      const nodes = {};
      this.productList.forEach((item: any) => {
        if (item.pGroupCode) {
          const parentNode = nodes[item.pGroupCode.code] || (nodes[item.pGroupCode.code] = {
            //name: item.pGroupCode.description, 
            label: item.pGroupCode.description,
            // initialize name to empty string
            code: item.pGroupCode.code,
            children: []
          });
          parentNode.children.push({ label: item.shortName, code2: item.code });
          //parentNode.name = `${item.pGroupCode.description} (${item.pGroupCode.code})`; // update name property
          parentNode.label = `${item.pGroupCode.description}`;
        }
      });

      // convert the map into an array of top-level nodes
      const treeData = Object.values(nodes) as any;

      // set the tree data as the response array
      this.response = treeData;
      console.log("This is tree", this.response);
    });
  }
  getForms(){
    const screenId = 15
    this.gisService.getFormScreen(screenId).subscribe(data => {
      
      this.updateFormFields = data
      let fields = this.updateFormFields.fields;

      let controls = {};
      fields.forEach(field => {
        controls= {...controls, [field.name]: new FormControl({value: '', disabled: field.isEnabled == 'N'})}
      })

      this.productForm = new FormGroup<any>(controls) // instantiate the reactive form controls

      this.mandatoryFrontendScreens = fields.filter(field => field.isMandatory === 'Y');
      this.optionalFrontendScreens = fields.filter(field => field.isMandatory === 'N');
      console.log(fields)
    });
  }
  getSubclasses(productCode: any, productGroupCode: any) {
    this.gisService.getASubclasses().subscribe(data => {
      this.allSubclasses = data._embedded.product_subclass_dto_list
      this.productSubclassResponse = this.allSubclasses.filter(prod => prod.product_code == productCode && prod.product_group_code == productGroupCode)
      this.cdr.detectChanges();
    })
  }
  updateProductSubclass() {
    const requestBody  = this.subclassform.value;
    const updateCode = requestBody.code
    console.log(requestBody)
    requestBody.code = null
    requestBody.product_short_description = null
    try {
      this.gisService.updateSubclass(requestBody, updateCode).subscribe(data => {
        console.log("Updated successfully here")
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully updated' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }

  }
}
