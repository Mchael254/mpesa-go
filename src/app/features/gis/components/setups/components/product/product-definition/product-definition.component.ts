import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Field, FormScreen, Product_group, Products, productDocument } from '../../../data/gisDTO';
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
  detailsDone:boolean = true;
  productGroupCode: Product_group
  subclassform: FormGroup
  productGroupForm: FormGroup
  productForm: FormGroup
  productDetails: any = [];
  showOptionalFields: boolean = false;
  mandatoryFrontendScreens:  Field[] = [];
  optionalFrontendScreens: Field[] = [];
  show:boolean = true;
  subclassDone:boolean = true;
  updateFormFields!:FormScreen
  response: any = [];
  prodGroup: any;
  page:any;
  productdocumentform: FormGroup
  prodGCode: number;
  unAssignedSubclasses: any;
  selected: any;
  productDocument:any
  prodCode: number;
  allSubclasses: any;
  productList: any = [];
  file: File
  report:any;
  base64Data: string;
  singleSubclass: any
  selectedCard: number = 0;
  productSubclassResponse: any;
  allProducts: Products[]
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
    this.getAllProducts()
    this.createProductSubClassForm()
    this.createProductDocument()
    this.getAllSubclasses()
  }
  SelectNode(event: any) {
    const selectedNode = event.node;

    if (selectedNode.code) {
      this.getProductGroup(selectedNode.code);
      this.prodGCode = selectedNode.code
    } else if (selectedNode.code2) {
      this.getProduct(selectedNode.code2);
      // this.getProductFormFields(selectedNode.code2)
      this.prodCode = selectedNode.code2
      this.getProductDocument(this.prodCode)
    }
    this.getSubclasses(this.prodCode, this.prodGCode);

  }
  getProduct(code: any) {

    this.gisService.getProductByCode(code).subscribe(data => {
      this.productDetails = data;
      console.log(this.productDetails, "product details")
      this.productForm.patchValue(this.productDetails)
      this.cdr.detectChanges();
    })
  }
  getProductDocument(code: any){
    this.gisService.getProductDocument(code).subscribe(data => {
      this.productDocument = data;
      this.productdocumentform.patchValue(this.productDocument)
      this.cdr.detectChanges();
    })
  }
  getProductGroup(code: any) {
    this.gisService.getProductGroupByCode(code).subscribe(data => {
      this.prodGroup = data;
      this.productGroupForm.patchValue(this.prodGroup)
      this.cdr.detectChanges();
    })
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
  selectedScreen(cardNumber:string): void {
    
    this.page = cardNumber
    this.cdr.detectChanges();
    console.log(this.page)
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
  createProduct(){
    console.log(this.productForm.value)
    const requestBody: any = this.productForm.value
    requestBody.code = null
    requestBody.productGroupCode = 16678633
    requestBody.enableSpareParts = "Y"
    requestBody.areInstallmentAllowed = "Y"
    requestBody.doesCashBackApply = "Y"
    requestBody.isPinRequired = "Y"
    console.log(this.productGroupCode,"Product group code")
    this.gisService.createProducts(requestBody).subscribe((data: {}) => {
     
      try{
        console.log(this.productForm.value)
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
      }catch(error){
        console.log(this.productForm.value)
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
      
      }
    })
   }
  handleUpload(event) {
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = () => {
      this.base64Data = reader.result as string;
        console.log(this.base64Data);
    };
}
  saveProductDocument(){
    
    const doc = this.productdocumentform.value
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
  createProductSubclass() {
    console.log(this.selected)
    const observables = this.selected.map(element => {
      
      const  sectionsArray: any = {
        code: null,
        isMandatory: element.isMandatory,
        sub_class_code: element.code,
        policyDocumentOrderNumber: 2,
        product_group_code: this.prodGCode,
        product_code: this.prodCode,
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
  getAllProducts(){
    this.gisService.getAllProducts().subscribe(data =>{
     return this.allProducts = data;
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
  getSubclasses(productCode: any, productGroupCode: any) {
    this.gisService.getASubclasses().subscribe(data => {
      this.allSubclasses = data._embedded.product_subclass_dto_list
      this.productSubclassResponse = this.allSubclasses.filter(prod => prod.product_code == productCode && prod.product_group_code == productGroupCode)
      // this.unAssignedSubclasses = this.allSubclasses.filter(prod => prod.product_code != productCode && prod.product_group_code != productGroupCode)
      this.cdr.detectChanges();
    })
  }
  getAllSubclasses(){
   
    return this.gisService.getSubclasses1().subscribe((data: any) =>{
        this.unAssignedSubclasses = data
       console.log(this.unAssignedSubclasses, "HTML")
       this.cdr.detectChanges();
     })
   }
  createProdGroup(){
    
    //const requestBody: Product_group = this.productGroupForm.value
        this.productGroupForm.removeControl('code');
        
       // requestBody.code = null
        this.gisService.createProductgroup(this.productGroupForm.value).subscribe((data: any) => {
          this.productGroupCode = data.code
          try{
            this.messageService.add({severity:'success', summary: 'Success', detail: 'Saved'});
          }catch(error){
            
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Error, try again later'});
          
          }
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
