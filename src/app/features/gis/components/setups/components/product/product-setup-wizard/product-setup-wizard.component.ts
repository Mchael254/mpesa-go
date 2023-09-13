import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Field, FormScreen, Product_group, Products, SubclassesDTO } from '../../../data/gisDTO';
import { ProductService } from '../../../../../services/product/product.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from '../../../../../../../core/config/app-config-service';
@Component({
  selector: 'app-product-setup-wizard',
  templateUrl: './product-setup-wizard.component.html',
  styleUrls: ['./product-setup-wizard.component.css']
})
export class ProductSetupWizardComponent implements OnInit {

  showParent = true;
  showsubclass = true;
  showdocument = true;
  productForm: FormGroup
  productGroupForm: FormGroup
  productdocumentform: FormGroup
  productGroupCode: Product_group
  productCode: Products
  selected: any;
  updateFormFields!:FormScreen
  testForm: FormGroup = new FormGroup<any>({});
  active: boolean = true;
  classDone: boolean = false;
  subclassDone: boolean = true;
  selectedCard: number = 0;
  detailsDone: boolean = true;
  mandatoryFrontendScreens:  Field[] = [];
  show:boolean = true;
  optionalFrontendScreens: Field[] = [];
  allProducts: Products[]
  allScheduleReports: any;
  allSubclasses: any;
  allScreens: any
  page: any;
  file: File
  report: any;
  base64Data: string;
  reportDetails: any;
  productDetails: any;

  constructor(
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
     public router:Router,
    private messageService: MessageService,
    private gisService: ProductService
  ) { }

  ngOnInit(): void {
    this.createProductForm()
    this.createProductGroupForm()
    this.getForms()
    this.getAllScreens()
    this.getAllProducts()
    this.getAllScheduleReports()
    this.getAllSubclasses()
    this.reportGroup()
    this.createProductDocument()
    this.sel();
    this.page = this.route.snapshot.paramMap.get('num');
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
  handleUpload(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.base64Data = reader.result as string;
      // console.log(this.base64Data);
    };
  }
  selectedScreen(cardNumber: string): void {

    this.page = cardNumber
    console.log(this.page)
    // this.cdr.detectChanges();
  }
  sel(){
    
    const cardNumber =  this.route.snapshot.paramMap.get('num')
    console.log(cardNumber)
    console.log(this.selectedCard)

  }
  createProductGroupForm(){
    this.productGroupForm = this.fb.group({
      code: null,
      description:  ['', Validators.required],
      type: ['', Validators.required],
      organizationCode:['2', {nonNullable: true}],
    })
  }
  getAllProducts(){
    this.gisService.getAllProducts().subscribe(data =>{
     return this.allProducts = data;
    })
  }
  getAllScheduleReports(){
    this.gisService.getAllScheduleReports().subscribe(data =>{
      this.allScheduleReports = data;
      console.log (this.allScheduleReports, "all reports")
    })
   }
   getAllScreens(){
    this.gisService.getAllScreens().subscribe(data =>{
      this.allScreens = data._embedded.screen_dto_list;
    })
   }
  createProductDocument(){
    this.productdocumentform = this.fb.group({
      dateWithEffectFrom: ['', Validators.required],
      dateWithEffectTo: ['', Validators.required],
      document: "path",
      isDefault: "Y",
      name: ['', Validators.required],
      precedence: ['', Validators.required],
      productCode: ['', Validators.required],
      version: 1
    })
  }
  createProductForm(){
    this.productForm = this.fb.group({
      code: null,
      shortDescription:  ['', Validators.required],
      description:  ['', Validators.required],
      productGroupCode:  ['', Validators.required],
      withEffectFrom:  ['', Validators.required],
      withEffectTo: ['', Validators.required],
      policyPrefix:['', Validators.required],
      organizationCode:['2', {nonNullable: true}],
      claimPrefix: ['', Validators.required],
      underwritingScreenCode: ['', Validators.required],
      claimScreenCode:null,
      expires: "Y",
      doesCashBackApply:['', Validators.required],
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
      enableSpareParts: ['', Validators.required],
      prerequisiteProductCode: null,
      allowMotorClass: "N",
      allowSameDayRenewal: "N",
      acceptUniqueRisks: null,
      industryCode: null,
      webDetails: null,
      showOnWebPortal: "N",
      areInstallmentAllowed: "Y",
      interfaceType: ['', Validators.required],
      isMarine: null,
      allowOpenPolicy: "N",
      order: null,
      isDefault: "N",
      prorataType: ['', Validators.required],
      doFullRemittance: null,
      productType: null,
      checkSchedule: null,
      scheduleOrder: 1,
      isPinRequired: ['', Validators.required],
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
  createProdGroup() {

    //const requestBody: Product_group = this.productGroupForm.value
    this.productGroupForm.removeControl('code');

    // requestBody.code = null
    this.gisService.createProductgroup(this.productGroupForm.value).subscribe((data: any) => {
      this.productGroupCode = data.code
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      } catch (error) {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

      }
    })
  }
  createProduct() {
    console.log(this.productForm.value)
    const requestBody: any = this.productForm.value
    requestBody.code = null
    requestBody.productGroupCode = this.productGroupCode
    requestBody.organizationCode = 2
    console.log(this.productGroupCode, "Product group code")
    this.gisService.createProducts(requestBody).subscribe((data: any) => {
      this.productCode = data.code
      try {
        console.log(this.productForm.value)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Saved' });
      } catch (error) {
        console.log(this.productForm.value)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });

      }
    })
  }
  getAllSubclasses(){
   
    return this.gisService.getSubclasses1().subscribe((data: any) =>{
        this.allSubclasses = data
       console.log(this.allSubclasses, "HTML")
       this.cdr.detectChanges();
     })
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
  reportGroup() {
    this.gisService.getReportGroup().subscribe(res => {
      this.report = res
      console.log(this.report)
    })
  }
  getReportGroup(code) {
    this.gisService.getReportGroupDetails(code).subscribe(res => {
      this.reportDetails = res
      console.log(this.reportDetails)
    })
  }
  saveReportGroup() {
    this.productForm.controls['productReportGroupsCode'].setValue(this.reportDetails.code);

  }
  savePreReqProd(){
    this.productForm.controls['prerequisiteProductCode'].setValue(this.productDetails.description);
  }
  getProd(code){
    this.gisService.getProductByCode(code).subscribe(res=>{
      this.productDetails = res
      console.log(this.productDetails)
    })
  }
  createProductSubclass() {
    const observables = this.selected.map(element => {
      
      const  sectionsArray: any = {
        code: null,
        is_mandatory: element.isMandatory,
        sub_class_code: element.code,
        policy_document_order_number: 2,
        product_group_code: this.productGroupCode,
        product_code: this.productCode,
        product_short_description: null,
        underwriting_screen_code: element.underwritingScreenCode,
        date_with_effect_from: element.withEffectFrom, 
        date_with_effect_to: "2024-06-25",
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
  
  saveProductDocument(){
    
    const doc = this.productdocumentform.value
    doc.productCode = this.productCode
    doc.document = this.base64Data
    doc.name = this.file?.name;
    console.log(doc)
    try {
      this.gisService.saveProductDocument(doc).subscribe(data =>{
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully uploaded Document' });
      })
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
    }
  }
}
