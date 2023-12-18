import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import stepData from '../../data/steps.json'
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { Subclass, Subclasses, subclassSection } from '../../../setups/data/gisDTO';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Calendar } from 'primeng/calendar';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Router } from '@angular/router';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { CountryService } from 'src/app/shared/services/setups/country/country.service';
import { CountryDto } from 'src/app/shared/data/common/countryDto';
import { Table } from 'primeng/table';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { finalize, forkJoin, mergeMap, switchMap, tap } from 'rxjs';
// import * as bootstrap from 'bootstrap'; // Import Bootstrap
import { ClientBranchesDto } from 'src/app/features/entities/data/ClientDTO';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';


const log = new Logger("QuickQuoteFormComponent");

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css']
})
export class QuickQuoteFormComponent {
  @ViewChild('calendar', { static: true }) calendar: Calendar;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;




  productList:any
  selectedProduct:any
  selectedProductCode: any;
  
  subClassList:Subclass[];
  allSubclassList:Subclasses[]
  filteredSubclass:Subclass[];
  selectedSubclassCode:any;
  allMatchingSubclasses=[];
  subclassSectionCoverList:any;
  mandatorySections:any;

  binderList:any;
  binderListDetails:any;
  selectedBinderCode:any;
  new:boolean;

  sourceList:any;
  sourceDetail:any;

  currencyList:any;
  currencyCode:any;
  selectedCurrency:any;
  selectedCurrencyCode:any;

  formContent:any;
  formData:any;
  dynamicForm:FormGroup;
  control:any;
  personalDetailsForm:FormGroup;
  clientForm:FormGroup;
  riskDetailsForm:FormGroup;
  sectionDetailsForm:FormGroup;

  clientList:any;
  clientDetails:any;
  clientData:any
  clientCode:any;
  clientType:any;
  clientName:any;
  clientEmail:any;
  clientPhone:any;
  


  countryList:CountryDto[];
  selectedCountry:any;
  filteredCountry:any;
  mobilePrefix:any;


  subclassCoverType:any;
  coverTypeCode:any;
  coverTypeDesc:any;

  quotationNo:any;
  quotationData:any;
  quotationCode:any;
  quotationNumbers=[];
  quotationCodes=[];
  quotationRiskData:any;
  riskCode:any;


  sectionArray:any;
  sectionList:subclassSection[];
  selectedSectionList:any;
  filteredSectionList:subclassSection[];

  steps = stepData;
  user:any;
  userDetails:any
  userBranchId:any;
  branchList:OrganizationBranchDto[];
  coverFromDate: string;
  coverToDate: string;
  passedCoverToDate:any;
  years: number[] = [];
  selectedYear: number;

  carRegNoValue: string;
  dynamicRegexPattern: string;
  carRegNoHasError: boolean = false; 

  xyz:any;

  @ViewChild('dt1') dt1: Table | undefined;

  constructor(
    public fb:FormBuilder,
    public branchService:BranchService,
    public productService:ProductsService,
    public binderService:BinderService,
    public quotationService:QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassSectionCovertypeService:SubClassCoverTypesSectionsService,
    public subclassService:SubclassesService,
    public currencyService:CurrencyService,
    private gisService: ProductService,
    public authService:AuthService,
    public cdr:ChangeDetectorRef,
    private messageService:MessageService,
    private clientService:ClientService,
    public sharedService:SharedQuotationsService,
    public sectionService:SectionsService,
    public countryService:CountryService,
    private router: Router,


  ) { }

  ngOnInit(): void {
  this.loadAllproducts();
  this.loadAllClients();
  this.getbranch();
  this.loadAllQoutationSources();
  this.LoadAllFormFields(this.selectedProductCode);
  this.dynamicForm = this.fb.group({});
  // this.createForm();
  this.createRiskDetailsForm();
  this.createPersonalDetailsForm();
  this.createSectionDetailsForm();
  this.getuser();
  this.loadAllSubclass();
  // this.getCountries();
  this.populateYears();

  this.xyz=this.sharedService.getAddAnotherRisk();
    // Console log the values
    console.log("XYZ Details:", this.xyz);

    console.log("Quotation Details:", this.xyz.quotationDetailsRisk);
    console.log("Client Details:", this.xyz.clientDetails);


  }
 
  
 
 

  
 /**
 * Loads all products from the backend service and updates the component's ProductList.
 * Triggers change detection to reflect the updated data in the view.
 */
 loadAllproducts(){
  this.productService.getAllProducts().subscribe(data =>{
     this.productList = data;
     log.info(this.productList,"this is a product list")

     this.cdr.detectChanges()
   })

}
resetClientData() {
  this.clientName = '';
  this.clientEmail = '';
  this.clientPhone = '';
  this.filteredCountry='';
  // Add any other properties you want to reset
}
/* Toggles between a new and existing client */
toggleButton(){
  this.new = true
}

toggleNewClient(){
  this.new = false
  this.resetClientData();

}

getuser(){
  this.user = this.authService.getCurrentUserName()
  this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
  this.userBranchId=this.userDetails.branchId;
  log.debug("Branch Id",this.userBranchId);
 }
//  getAllBranches(){
//   this.clientService.getCLientBranches().subscribe(data=>{
//     this.branchList=data;
//     log.debug("Branch List",this.branchList);

//   })
//  }
 getbranch(){
  this.branchService.getBranch().subscribe(data=>{
    this.branchList = data;
    log.debug("Branch List",this.branchList);

  })
}
/* Get all the clients. This is used to get the options when selecting an existing client */
loadAllClients(){
  this.clientService.getClients().subscribe(data =>{
    this.clientList = data;
    this.clientData = this.clientList.content
    log.debug("CLIENT DATA:", this.clientData)

    
  })
}


getCountries(){
  this.countryService.getCountries().subscribe(data=>{
    this.countryList=data;
    log.debug("Country List",this.countryList);
    const testCountry="KENYA"
    this.filteredCountry = this.countryList.filter(prefix => prefix.name == testCountry)
    log.debug("Filtered Country",this.filteredCountry);

    this.mobilePrefix=this.filteredCountry[0].mobilePrefix;
    log.debug("Filtered mobilePrefix",this.mobilePrefix);

  })
}
createForm(){
  this.clientForm = this.fb.group({
    
    accountId: [''],
    branchCode: [''],
    category: [''],
    clientTitle: [''],
    clientTitleId: [''],
    clientTypeId: [''],
    country: [''],
    createdBy: [''],
    dateOfBirth: [''],
    emailAddress: [''],
    firstName: [''],
    gender: [''],
    id: [''],
    idNumber: [''],
    lastName: [''],
    modeOfIdentity: [''],
    occupationId: [''],
    passportNumber: [''],
    phoneNumber: [''],
    physicalAddress: [''],
    pinNumber: [''],
    shortDescription: [''],
    status: [''],
    withEffectFromDate: ['']
  })
}
createPersonalDetailsForm(){
  this.personalDetailsForm=this.fb.group({
    actionType: [''],
    addEdit: [''],
    agentCode: [''],
    agentShortDescription: [''],
    bdivCode: [''],
    bindCode: [''],
    branchCode: [''],
    clientCode: [''],
    clientType: [''],
    coinLeaderCombined: [''],
    consCode: [''],
    currencyCode: [''],
    currencySymbol: [''],
    fequencyOfPayment: [''],
    isBinderPolicy: [''],
    paymentMode: [''],
    proInterfaceType: [''],
    productCode: [''],
    source: [''],
    withEffectiveFromDate: [''],
    withEffectiveToDate: [''],
    multiUser:[''],
    comments:[''],
    internalComments:[''],
    introducerCode:[''],
    // dateRange:['']
});
}


/* Get A specific client's details on select. When the form controls have been 
defined use patch value to populate the relevant fields with the client details  */
loadClientDetails(id){
  this.clientService.getClientById(id).subscribe(data =>{
    this.clientDetails = data;
    // this.clientCode=this.clientDetails.id;
    this.clientType=this.clientDetails.clientType.clientTypeName
    console.log("Selected Client Details:",this.clientDetails)
    // console.log("Selected code client:",this.clientCode)
    console.log("Selected code client:",this.clientType)
    this.selectedCountry=this.clientDetails.country;
    console.log("Selected client country:",this.selectedCountry)
    this.getCountries();
  // this.pseudoForm.patchValue(this.clientDetails)
  // console.log("Selected Form:",this.pseudoForm)
   this.saveclient()
   this.closebutton.nativeElement.click();

  //  const modalElement = document.getElementById('clientModal');
  //   const modal = bootstrap.Modal.getInstance(modalElement); // Get the modal instance
  //   modal.hide();

  })
}
getUserBranch(){

}
saveclient(){
  this.clientCode=this.clientDetails.id;
  this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
  this.clientEmail=this.clientDetails.emailAddress;
  this.clientPhone=this.clientDetails.phoneNumber;
}

onProductSelected(event: any) {
  this.selectedProductCode = event.target.value;
  // const selectedProductCode = event.target.value;
  console.log("Selected Product Code:", this.selectedProductCode); 

  this.getProductSubclass(this.selectedProductCode);
  this.loadAllSubclass()

    // Load the dynamic form fields based on the selected product
    this.LoadAllFormFields(this.selectedProductCode);
}
getCoverToDate(){
  if (this.coverFromDate){
    this.productService.getCoverToDate(this.coverFromDate,this.selectedProductCode).subscribe(data=>{
      log.debug("DATA FROM COVERFROM:",data)
      const dataDate=data;
      this.passedCoverToDate = dataDate._embedded[0].coverToDate;
      log.debug("DATe FROM DATA:",this.passedCoverToDate)

    })
  }
}



getProductSubclass(code: number) {
  this.gisService.getProductSubclasses(code).subscribe(data => {
    this.subClassList = data._embedded.product_subclass_dto_list;
    log.debug(this.subClassList, 'Product Subclass List');

    this.subClassList.forEach(element => {
      const matchingSubclasses = this.allSubclassList.filter(subCode => subCode.code === element.sub_class_code);
      this.allMatchingSubclasses.push(...matchingSubclasses); // Merge matchingSubclasses into allMatchingSubclasses
    });

    log.debug("Retrieved Subclasses by code", this.allMatchingSubclasses);


    this.cdr.detectChanges();
  });
}

/**
 * Fetches all subclass data from the subclass service,
 */
  loadAllSubclass(){
    return this.subclassService.getAllSubclasses().subscribe(data=>{
      this.allSubclassList=data;
      log.debug(this.allSubclassList,"All Subclass List");
      this.cdr.detectChanges();

    })
  }
/** 
* Handles subclass selection.
* Updates the selected subclass code, logs the selection, and loads related data.
* It loads cover types, binders, and subclass clauses based on the selected value.
*/
onSubclassSelected(event: any) {
  const selectedValue = event.target.value; // Get the selected value
  this.selectedSubclassCode=selectedValue;
  // Perform your action based on the selected value
  console.log(`Selected value: ${selectedValue}`);
  log.debug(this.selectedSubclassCode,'Sekected Subclass Code')

  this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
  this.loadAllBinders();
  // this.loadSubclassSection();
  this.loadSubclassSectionCovertype();

}
loadAllBinders() {
  this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(data => {
     this.binderList=data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      console.log("All Binders Details:", this.binderListDetails); // Debugging
      this.cdr.detectChanges();
  });
}
onSelectBinder(event:any) {
  this.selectedBinderCode = event.target.value;
  const bind = this.binderListDetails.filter(bind => bind.code == this.selectedBinderCode)
   this.currencyCode = bind[0].currency_code;
  console.log("Selected Binder:", bind);
  console.log("Selected Binder:", this.currencyCode);
  this.loadAllCurrencies();

}
loadAllCurrencies(){
  this.currencyService.getAllCurrencies().subscribe(data =>{
    this.currencyList =data;
    log.info(this.currencyList,"this is a currency list");
    const curr =this.currencyList.filter(currency => currency.id == this.currencyCode);
    this.selectedCurrency = curr[0].name
    log.debug("Selected Currency:",this.selectedCurrency);
    this.selectedCurrencyCode = curr[0].id;
    log.debug("Selected Currency code:",this.selectedCurrencyCode);

    this.cdr.detectChanges()

  })
}

    /**
   * Load cover types by subclass code
   * @param code {number} subclass code
   */
    loadCovertypeBySubclassCode(code: number) {
      this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
        this.subclassCoverType = data;
        log.debug('Subclass Covertype',this.subclassCoverType);

        this.coverTypeCode=this.subclassCoverType[0].coverTypeCode;
        this.coverTypeDesc=this.subclassCoverType[0].coverTypeShortDescription;
        
        // log.debug(this.subclassCoverType,'filtered covertype');
        // log.debug(this.coverTypeCode,'filtered covertype code');
        log.debug(this.coverTypeDesc,'filtered covertype Desc');

        this.cdr.detectChanges();
      })
    }


loadAllQoutationSources(){
  this.quotationService.getAllQuotationSources().subscribe(data =>{
    this.sourceList=data;
    this.sourceDetail=data.content;
    console.log(this.sourceDetail, "Source list")
  })
}

// LoadAllFormFields(){
//   this.quotationService.getFormFields().subscribe(data =>{
//     this.formContent=data;
//     // this.formData=this.formContent.fields;
//     log.info(this.formContent,"this is Form field content")

//   })
// }
LoadAllFormFields(selectedProductCode: Number) {
  if (selectedProductCode) {
    const formFieldDescription = "product-quick-quote-".concat(selectedProductCode.toString());
    this.quotationService.getFormFields(formFieldDescription).subscribe(data => {
      this.formContent = data;
      console.log(this.formContent, "Form-content"); // Debugging: Check the received data
      this.formData = this.formContent.fields;
      console.log(this.formData, "formData is defined here");

      // Clear existing form controls
      this.removeFormControls();

      // Add new form controls for each product-specific field
      this.formData.forEach(field => {
        this.control = new FormControl('', [Validators.required, Validators.pattern(field.regexPattern)]);

        // Add a custom validator for displaying a specific error message
        this.control.setValidators([Validators.required, Validators.pattern(new RegExp(field.regexPattern))]);

        log.debug("Control", this.control);
        this.dynamicForm.addControl(field.name, this.control);
        this.dynamicRegexPattern = field.regexPattern;
        log.debug("Regex", field.regexPattern);
      });
      // this.testDynamicForm();
    });
  }
}


validateCarRegNo() {
  console.log('Entered value:', this.carRegNoValue);
  const regex = new RegExp(this.dynamicRegexPattern);
  console.log('Regex pattern:', regex);
  this.carRegNoHasError = !regex.test(this.carRegNoValue);
  console.log('Has error:', this.carRegNoHasError);
}






// Helper method to remove all form controls from the FormGroup
removeFormControls() {
  const formControls = Object.keys(this.dynamicForm.controls);
  formControls.forEach((controlName) => {
      this.dynamicForm.removeControl(controlName);
  });
}
createQuotation() {
  this.quotationNumbers = [];
  this.quotationCodes = [];

  const riskCreationObservables = this.subclassCoverType.map(element => {
    const quickQuoteForm = this.personalDetailsForm.value;
    quickQuoteForm.clientCode = this.clientCode;
    quickQuoteForm.clientType = "I";
    quickQuoteForm.agentCode = 0;
    quickQuoteForm.agentShortDescription = "DIRECT";
    quickQuoteForm.branchCode = this.userBranchId;
    quickQuoteForm.currencySymbol = this.selectedCurrency;
    quickQuoteForm.currencyCode = this.selectedCurrencyCode;

    console.log('Quick Quotation Form', quickQuoteForm);

    return this.quotationService.createQuotation(quickQuoteForm, this.user).pipe(
      switchMap(data => {
        this.quotationData = data;
        this.quotationCode = this.quotationData._embedded[0].quotationCode;
        this.quotationNo = this.quotationData._embedded[0].quotationNumber;

        this.quotationNumbers.push(this.quotationNo);
        this.quotationCodes.push(this.quotationCode);

        console.log(this.quotationData);
        console.log("All Quotation Numbers:", this.quotationNumbers);
        console.log("All Quotation Codes:", this.quotationCodes);

        console.log("Quotation Code:", this.quotationCode);
        console.log("Quotation Number:", this.quotationNo);

        const code = element.coverTypeCode;
        const description = element.coverTypeShortDescription;
        console.log('CoverType Code', code);

        // Creating risk mrethod called

        const risk = this.riskDetailsForm.value;
        const dateWithEffectFromC = quickQuoteForm.withEffectiveFromDate;
        const dateWithEffectToC = quickQuoteForm.withEffectiveToDate;

        risk.binderCode = this.selectedBinderCode;
        risk.coverTypeCode = code;
        risk.coverTypeShortDescription = description;
        risk.insuredCode = this.clientCode;
        risk.productCode = this.selectedProductCode;
        risk.dateWithEffectFrom = dateWithEffectFromC;
        risk.dateWithEffectTo = dateWithEffectToC;
        risk.subClassCode = this.selectedSubclassCode;
        risk.itemDescription = "volvo 4e";
        delete risk.dateRange;

        // FROM DYNAMIC FORM
        const riskIDValue = this.dynamicForm.get('carRegNo').value;

     
        

        risk.propertyId = riskIDValue;

        console.log('Quick Form Risk', risk);

        const riskArray = [risk];

        return this.quotationService.createQuotationRisk(this.quotationCode, riskArray).pipe(
          tap(data => {
            this.quotationRiskData = data;

            const quotationRiskCode = this.quotationRiskData._embedded[0];
            if (quotationRiskCode) {
              for (const key in quotationRiskCode) {
                if (quotationRiskCode.hasOwnProperty(key)) {
                  const value = quotationRiskCode[key];
                  console.log(`${value}`);
                  this.riskCode = value;
                }
              }
            } else {
              console.log("The quotationRiskCode object is not defined.");
            }

            console.log(this.quotationRiskData, "Quotation Risk Code Data");
            console.log(this.riskCode, "Quotation Risk Code ");

            // try {
            //   this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Risk Created' });
            //   this.riskDetailsForm.reset();
            // } catch (error) {
            //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
            //   this.riskDetailsForm.reset();
            // }

            this.createRiskSection();
          })
        );
      })
    );
  });

  forkJoin(riskCreationObservables).subscribe(
    () => {
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'All Quotations Created' });

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Risk Created successfully' });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
      }
    },
    error => {
      console.error('Error creating risks:', error);
    }
  );
}




createRiskDetailsForm(){
  this.riskDetailsForm=this.fb.group({
    binderCode: ['', Validators.required],
    coverTypeCode: ['', Validators.required],
    coverTypeShortDescription: [''],
    dateWithEffectFrom: [''],
    dateWithEffectTo: [''],
    dateRange:[''],
    insuredCode: [''],
    isNoClaimDiscountApplicable:[''],
    itemDescription: ['', Validators.required],
    location: [''],
    noClaimDiscountLevel: [''],
    productCode: [''],
    propertyId:[''],
    riskPremAmount: [''],
    subClassCode: ['', Validators.required],
    town: [''],
});
}


loadSubclassSectionCovertype(){
  this.subclassSectionCovertypeService.getSubclassCovertypeSections().subscribe(data =>{
    this.subclassSectionCoverList=data;
    log.debug("Subclass Section Covertype:",this.subclassSectionCoverList);
    this.mandatorySections=this.subclassSectionCoverList.filter(section=>section.subClassCode == this.selectedSubclassCode && section.isMandatory =="Y");
    log.debug("Mandatory Section Covertype:",this.mandatorySections);

    if(this.mandatorySections.length > 0){
      this.selectedSectionList = this.mandatorySections[0];
      log.debug("Selected Section ", this.selectedSectionList)

    }else {

    }
    this.sharedService.setQuickSectionDetails(this.mandatorySections);

  })
}
// loadSubclassSection(){
//   this.sectionService.getSubclassSections(this.selectedSubclassCode).subscribe(data =>{
//     this.sectionList=data;
//     this.filteredSectionList=this.sectionList.filter(section=>section.subclassCode == this.selectedSubclassCode);
//     if (this.filteredSectionList.length > 0) {
//       this.selectedSectionList = this.filteredSectionList[0];
     
//     } else {
//     }
//     log.debug("Filtered Section List  first", this.filteredSectionList)

//     log.debug("Filtered Section List", this.selectedSectionList)
//     this.sharedService.setQuickSectionDetails(this.filteredSectionList);


//   })
// }

/**
 * Creates and initializes a section details form.
 * Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
 * Defines form controls for various section-related fields, setting initial values as needed.
 */
createSectionDetailsForm(){
  this.sectionDetailsForm=this.fb.group({
    calcGroup: [''],
    code: [''],
    compute: [''],
    description: [''],
    freeLimit: [''],
    limitAmount: [''],
    multiplierDivisionFactor: [''],
    multiplierRate: [''],
    premiumAmount: [''],
    premiumRate: [''],
    quotRiskCode: [''],
    rateDivisionFactor: [''],
    rateType: [''],
    rowNumber: [''],
    sectionCode: [''],
    sectionShortDescription: [''],
    sectionType: [''],
    sumInsuredLimitType: [''],
    sumInsuredRate: ['']
});
}

 
  /**
 * Creates a new risk section associated with the current risk.
 * Takes section data from the 'sectionDetailsForm', sends it to the server
 * to create a new risk section associated with the current risk, and handles
 * the response data by displaying a success or error message.
 */
  createRiskSection(){
    
    const section = this.sectionDetailsForm.value;
     // FROM DYNAMIC FORM
    const riskIDValue = this.dynamicForm.get('carRegNo').value;
    const yearOfManufactureValue = this.dynamicForm.get('yearOfManufacure').value;
    const sumInsuredValue = this.dynamicForm.get('selfDeclaredValue').value;
    section.calcGroup = 1;
    section.code = this.selectedSectionList.code;
    section.compute = null;
    section.description = this.selectedSectionList.sectionShortDescription;
    section.freeLimit = 0;
    section.limitAmount = sumInsuredValue;
    section.multiplierDivisionFactor = 0;
    section.multiplierRate = 0;
    // section.premiumAmount = 20000;
    section.premiumRate = 0.5;
    section.rateDivisionFactor = 0;
    section.rateType = "FXD";
    section.rowNumber = 0;
    section.sumInsuredLimitType = null;
    section.sumInsuredRate = 0;
    section.sectionCode=this.selectedSectionList.sectionCode;;
    section.sectionShortDescription=this.selectedSectionList.sectionShortDescription;
    section.sectionType=this.selectedSectionList.sectionType;
    this.sectionArray = [section];


    log.debug("Section Form Array",this.sectionArray)
    this.quotationService.createRiskSection(this.riskCode,this.sectionArray,).subscribe(data =>{
      
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset()
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        this.sectionDetailsForm.reset()
      }
      this.sharedService.setSumInsured(sumInsuredValue);


      this.computePremium()
    
    })
  }
  
  
  // computePremium(){
  //   this.quotationService.computePremium(this.quotationCode).subscribe(data =>{
  //     try {
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premium Computed successfully' });
  //     } catch (error) {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
  //     }
  //     this.sharedService.setQuickQuotationDetails(this.quotationNumbers);
  //     this.router.navigate(['/home/gis/quotation/cover-type-details']);
  //   })
  // }
  computePremium() {
    const premiumComputationObservables = this.quotationCodes.map(quotationCode => {
      return this.quotationService.computePremium(quotationCode);
    });
  
    forkJoin(premiumComputationObservables).subscribe(
      (data: any[]) => {
        try {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premiums computed successfully' });
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
        }
  
        this.sharedService.setQuickQuotationDetails(this.quotationNumbers);
        this.router.navigate(['/home/gis/quotation/cover-type-details']);
      },
      error => {
        console.error('Error computing premium:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error computing premium' });
      }
    );
  }
  
  
/**
 * Applies a global filter to a DataTable by using the provided event value and filter key.
 * This method triggers the global filtering functionality and logs the applied filter.
 * @param $event The event containing the input value triggering the global filter.
 * @param stringVal The filter key to apply the global filter on the DataTable.
 */
applyFilterGlobal($event, stringVal) {
  this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}
populateYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 1973; // Adjust the starting year as needed

  for (let year = startYear; year <= currentYear; year++) {
    this.years.push(year);
  }

  // Set the default selected year
  this.selectedYear = currentYear;
  log.debug("YEARS:",this.years)
}


}
