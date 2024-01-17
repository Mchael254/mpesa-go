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
import { ClientBranchesDto } from 'src/app/features/entities/data/ClientDTO';
import { BranchService } from 'src/app/shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from 'src/app/shared/data/common/organization-branch-dto';
import { ApiService } from 'src/app/shared/services/api/api.service';
import { API_CONFIG } from 'src/environments/api_service_config';
import { NgxSpinnerService } from 'ngx-spinner';


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

  passedQuotation:any;
  
  // isAddRisk:boolean=false;
  xyz:boolean;

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
    private apiService:ApiService,
    private ngxSpinner: NgxSpinnerService,


  ) { }

  ngOnInit(): void {
    // this.apiService.GET('email/3/send',API_CONFIG.NOTIFICATION_BASE_URL).subscribe(data =>console.log(data)
    // )
    // this.quotationService.test().subscribe(res=>console.log(res))
  this.loadAllproducts();
  this.loadAllClients();
  this.getbranch();
  this.loadAllQoutationSources();
  this.LoadAllFormFields(this.selectedProductCode);
  this.dynamicForm = this.fb.group({});
  // this.createForm();
  this.createRiskDetailsForm();
  this.createPersonalDetailsForm();
  
  //   const dynamicData = sessionStorage.getItem('dynamicFormData');
  //   if (dynamicData) {
  //     const parsedDynamicData = JSON.parse(dynamicData);
  //     this.dynamicForm.setValue(parsedDynamicData);
      
  //   }
  this.createSectionDetailsForm();
  this.getuser();
  this.loadAllSubclass();
  // this.getCountries();
  this.populateYears();
  /** THIS LINES OF CODES BELOW IS USED WHEN ADDING ANOTHER RISK ****/
  this.passedQuotation=this.sharedService.getAddAnotherRisk();
    // Console log the values
    // console.log("XYZ Details:", this.passedQuotation);

    // console.log("Quotation Details:", this.passedQuotation.quotationDetailsRisk);
    // console.log("Client Details:", this.passedQuotation.clientDetails);
    if(this.passedQuotation){
      // this.clientName=this.passedQuotation.clientDetails.firstName+ ' ' +this.passedQuotation.clientDetails.lastName;
      // this.clientEmail=this.passedQuotation.clientDetails.emailAddress;
      // this.clientPhone=this.passedQuotation.clientDetails.phoneNumber;
      // this.personalDetailsForm.patchValue(this.passedQuotation.quotationDetailsRisk)
  
      // this.xyz=this.sharedService.getIsAddRisk();
      // console.log("isAddRiskk Details:", this.xyz);
    }
   
    
    const quickQuoteFormDetails = sessionStorage.getItem('quickQuoteFormData');
    console.log(quickQuoteFormDetails,'Quick Quote form details session storage')

    if (quickQuoteFormDetails) {
      const parsedData = JSON.parse(quickQuoteFormDetails);
      console.log(parsedData)
      this.personalDetailsForm.setValue(parsedData);
      
    }
   

  }
 /**
 * Loads all products by making an HTTP GET request to the ProductService.
 * Retrieves a list of products and updates the component's productList property.
 * Also logs the received product list for debugging purposes.
 * @method loadAllProducts
 * @return {void}
 */
 loadAllproducts(){
  this.productService.getAllProducts().subscribe(data =>{
     this.productList = data;
     log.info(this.productList,"this is a product list")

     this.cdr.detectChanges()
   })

}
/**
 * Resets client data by clearing the values of clientName, clientEmail, clientPhone, and filteredCountry.
 * This method is typically used to reset form fields or client-related data in the component.
 * @method resetClientData
 * @return {void}
 */
resetClientData() {
  this.clientName = '';
  this.clientEmail = '';
  this.clientPhone = '';
  this.filteredCountry='';
}
/* Toggles between a new and existing client */
/**
 * Toggles the 'new' state to true.
 * This method is typically used to toggle between a new and existing client.
 * @method toggleButton
 * @return {void}
 */
toggleButton(){
  this.new = true
}
/**
 * Toggles the 'new' state to false and resets client-related data.
 * This method is commonly used to switch from a 'new' client state to a default state and clear client input fields.
 * @method toggleNewClient
 * @return {void}
 */
toggleNewClient(){
  this.new = false
  this.resetClientData();
}
/**
 * Retrieves user information from the authentication service.
 * - Sets the 'user' property with the current user's name.
 * - Sets the 'userDetails' property with the current user's details.
 * - Logs the user details for debugging purposes.
 * - Retrieves and sets the 'userBranchId' property with the branch ID from user details.
 * @method getUser
 * @return {void}
 */
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

/**
 * Retrieves branch information by making an HTTP GET request to the BranchService.
 * - Populates the 'branchList' property with the received data.
 * - Logs the retrieved branch list for debugging purposes.
 * @method getBranch
 * @return {void}
 */
 getbranch(){
  this.branchService.getBranches(2).subscribe(data=>{
    this.branchList = data;
    log.debug("Branch List",this.branchList);

  })
}
/**
 * Fetches client data via HTTP GET from ClientService.
 * - Populates 'clientList' and extracts data from 'content'.
 * - Logs client data for debugging using 'log.debug'.
 * @method loadAllClients
 * @return {void}
 */
loadAllClients(){
  this.clientService.getClients().subscribe(data =>{
    this.clientList = data;
    this.clientData = this.clientList.content
    log.debug("CLIENT DATA:", this.clientData)
  })
}

/**
 * Fetches and filters country data from CountryService.
 * - Logs the entire country list for debugging.
 * - Filters for a test country ('KENYA') and logs the result.
 * - Assigns the mobile prefix of the filtered country to 'mobilePrefix' and logs it.
 * @method getCountries
 * @return {void}
 */
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
/**
 * Creates a form group using Angular FormBuilder (fb).
 * - Defines form controls for client details.
 * @method createForm
 * @return {void}
 */
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
/**
 * Creates a form group for personal details using Angular FormBuilder (fb).
 * - Defines form controls for various personal details.
 * @method createPersonalDetailsForm
 * @return {void}
 */
createPersonalDetailsForm(){
  this.personalDetailsForm=this.fb.group({
    actionType: [''],
    addEdit: [''],
    agentCode: [''],
    agentShortDescription: [''],
    bdivCode: [''],
    bindCode:  ['', Validators.required],
    branchCode:  ['', Validators.required],
    clientCode: [''],
    clientType: [''],
    coinLeaderCombined: [''],
    consCode: [''],
    currencyCode: ['', Validators.required],
    currencySymbol: [''],
    fequencyOfPayment: [''],
    isBinderPolicy: [''],
    paymentMode: [''],
    proInterfaceType: [''],
    productCode: ['', Validators.required],
    source: ['', Validators.required],
    withEffectiveFromDate:  ['', Validators.required],
    withEffectiveToDate:  ['', Validators.required],
    multiUser:[''],
    comments:[''],
    internalComments:[''],
    introducerCode:[''],
    // dateRange:['']
});
}

/**
 * - Get A specific client's details on select.
 * - populate the relevant fields with the client details.
 * - Retrieves and logs client type and country.
 * - Invokes 'getCountries()' to fetch countries data.
 * - Calls 'saveClient()' and closes the modal.
 * @method loadClientDetails
 * @param {number} id - ID of the client to load.
 * @return {void}
 */
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
   this.saveclient()
   this.closebutton.nativeElement.click();
  })
}
/**
 * Saves essential client details for further processing.
 * - Assigns client ID, name, email, and phone from 'clientDetails'.
 * @method saveClient
 * @return {void}
 */
saveclient(){
  this.clientCode=this.clientDetails.id;
  this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
  this.clientEmail=this.clientDetails.emailAddress;
  this.clientPhone=this.clientDetails.phoneNumber;
}
/**
 * Handles the selection of a product.
 * - Retrieves the selected product code from the event.
 * - Fetches and loads product subclasses.
 * - Loads dynamic form fields based on the selected product.
 * @method onProductSelected
 * @param {any} event - The event triggered by product selection.
 * @return {void}
 */
onProductSelected(event: any) {
  this.selectedProductCode = event.target.value;
  // const selectedProductCode = event.target.value;
  console.log("Selected Product Code:", this.selectedProductCode); 

  this.getProductSubclass(this.selectedProductCode);
  this.loadAllSubclass()

    // Load the dynamic form fields based on the selected product
    this.LoadAllFormFields(this.selectedProductCode);
}
/**
 * Retrieves cover to date based on the selected product and cover from date.
 * - Checks if 'coverFromDate' is available.
 * - Makes an HTTP GET request to ProductService for cover to date.
 * - Assigns the cover to date from the received data.
 * @method getCoverToDate
 * @return {void}
 */
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
/**
 * Retrieves and matches product subclasses for a given product code.
 * - Makes an HTTP GET request to GISService for product subclasses.
 * - Matches and combines subclasses with the existing 'allSubclassList'.
 * - Logs the final list of matching subclasses.
 * - Forces change detection to reflect updates.
 * @method getProductSubclass
 * @param {number} code - The product code to fetch subclasses.
 * @return {void}
 */
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
 * Loads all product subclasses from SubclassService.
 * - Subscribes to 'getAllSubclasses' observable and updates 'allSubclassList'.
 * - Logs all product subclasses for debugging and triggers change detection.
 * @method loadAllSubclass
 * @return {void}
 */
  loadAllSubclass(){
    return this.subclassService.getAllSubclasses().subscribe(data=>{
      this.allSubclassList=data;
      log.debug(this.allSubclassList,"All Subclass List");
      this.cdr.detectChanges();

    })
  }
/**
 * Handles the selection of a subclass.
 * - Retrieves the selected subclass code from the event.
 * - Logs the selected subclass code for debugging.
 * - Calls methods to load cover types, binders, and subclass sections.
 * @method onSubclassSelected
 * @param {any} event - The event triggered by subclass selection.
 * @return {void}
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
/**
 * Loads binders for the selected subclass.
 * - Subscribes to 'getAllBindersQuick' from BinderService.
 * - Populates 'binderListDetails' and triggers change detection.
 * @method loadAllBinders
 * @return {void}
 */
loadAllBinders() {
  this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(data => {
     this.binderList=data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      console.log("All Binders Details:", this.binderListDetails); // Debugging
      this.cdr.detectChanges();
  });
}
/**
 * Handles the selection of a binder.
 * - Retrieves the selected binder code from the event.
 * - Filters 'binderListDetails' based on the selected binder code.
 * - Assigns currency code from the filtered binder.
 * - Logs the selected binder details and currency code for debugging.
 * - Calls 'loadAllCurrencies'.
 * @method onSelectBinder
 * @param {any} event - The event triggered by binder selection.
 * @return {void}
 */
onSelectBinder(event:any) {
  this.selectedBinderCode = event.target.value;
  const bind = this.binderListDetails.filter(bind => bind.code == this.selectedBinderCode)
   this.currencyCode = bind[0].currency_code;
  console.log("Selected Binder:", bind);
  console.log("Selected Binder:", this.currencyCode);
  this.loadAllCurrencies();

}
/**
 * Loads all currencies and selects based on the currency code.
 * - Subscribes to 'getAllCurrencies' from CurrencyService.
 * - Populates 'currencyList' and filters for the selected currency.
 * - Assigns name and code from the filtered currency.
 * - Logs the selected currency details and triggers change detection.
 * @method loadAllCurrencies
 * @return {void}
 */
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
 * Loads cover types for the provided subclass code.
 * - Subscribes to 'getSubclassCovertypeBySCode' from SubclassCoverTypesService.
 * - Populates 'subclassCoverType' and assigns code/short description.
 * - Logs cover type details and triggers change detection.
 * @method loadCovertypeBySubclassCode
 * @param {number} code - Subclass code for fetching cover types.
 * @return {void}
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
/**
 * Loads all quotation sources.
 * - Subscribes to 'getAllQuotationSources' from QuotationService.
 * - Populates 'sourceList' and assigns 'sourceDetail'.
 * - Logs source details.
 * @method loadAllQuotationSources
 * @return {void}
 */
loadAllQoutationSources(){
  this.quotationService.getAllQuotationSources().subscribe(data =>{
    this.sourceList=data;
    this.sourceDetail=data.content;
    console.log(this.sourceDetail, "Source list")
  })
}
/**
 * Loads form fields dynamically based on the selected product code.
 * - Subscribes to 'getFormFields' observable from QuotationService.
 * - Populates 'formContent' with received data.
 * - Assigns 'formData' from 'formContent.fields'.
 * - Clears existing form controls and adds new controls for each product-specific field.
 * - Applies custom validators and logs control details for debugging.
 * @method LoadAllFormFields
 * @param {Number} selectedProductCode - The selected product code for dynamic form loading.
 * @return {void}
 */
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
/**
 * Validates a car registration number using a dynamic regex pattern.
 * - Logs the entered value and dynamic regex pattern.
 * - Tests the car registration number against the regex pattern.
 * - Updates 'carRegNoHasError' based on the test result.
 * @method validateCarRegNo
 * @return {void}
 */
validateCarRegNo() {
  console.log('Entered value:', this.carRegNoValue);
  const regex = new RegExp(this.dynamicRegexPattern);
  console.log('Regex pattern:', regex);
  this.carRegNoHasError = !regex.test(this.carRegNoValue);
  console.log('Has error:', this.carRegNoHasError);
}

/**
 * Removes all form controls from the dynamic form.
 * - Retrieves all control names from the dynamic form.
 * - Iterates through the control names and removes each control.
 * @method removeFormControls
 * @return {void}
 */
removeFormControls() {
  const formControls = Object.keys(this.dynamicForm.controls);
  formControls.forEach((controlName) => {
      this.dynamicForm.removeControl(controlName);
  });
}
/**
 * Creates quotations with associated risks and handles the asynchronous operations.
 * - Maps and processes each SubclassCoverType element to create a quotation.
 * - Maps and processes risk details to create associated risks for each quotation.
 * - Logs relevant details for debugging.
 * - Displays success messages for created quotations, risks, and computed premiums.
 * @method createQuotation
 * @return {void}
 */
createQuotation() {
  this.ngxSpinner.show("quickQuoteScreen")

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

        // create associated risks for each quotation

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
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Quotations Created' });

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Risk Created successfully' });
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premiums computed successfully' });

      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
      }
    },
    error => {
      this.ngxSpinner.hide("quickQuoteScreen")

      console.error('Error creating risks:', error);
    }
  );
}
 
/**
 * Creates and initializes the risk details form using Angular FormBuilder.
 * - Defines form controls with validators for various risk details.
 * @method createRiskDetailsForm
 * @return {void}
 */
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
/**
 * Loads subclass sections and cover types for the selected subclass code.
 * - Subscribes to 'getSubclassCovertypeSections' from SubclassSectionCovertypeService.
 * - Populates 'subclassSectionCoverList' and filters mandatory sections.
 * - Sets the first mandatory section as 'selectedSectionList'.
 * - Updates shared service with quick section details.
 * @method loadSubclassSectionCovertype
 * @return {void}
 */
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
 * Creates and initializes the section details form using Angular FormBuilder.
 * - Defines form controls for various section details.
 * @method createSectionDetailsForm
 * @return {void}
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
 * Creates a risk section, saves it, and triggers premium computation.
 * - Retrieves relevant values from the dynamic form.
 * - Sets default values for section details.
 * - Creates a section object with calculated values.
 * - Calls 'createRiskSection' from QuotationService.
 * - Resets the section details form after success.
 * - Updates shared service with declared sum insured value.
 * - Triggers premium computation.
 * @method createRiskSection
 * @return {void}
 */
  createRiskSection(){
    
    const section = this.sectionDetailsForm.value;
     // FROM DYNAMIC FORM
    const riskIDValue = this.dynamicForm.get('carRegNo').value;
    const yearOfManufactureValue = this.dynamicForm.get('yearOfManufacture').value;
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
        // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset()
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        this.sectionDetailsForm.reset()
      }
      this.sharedService.setSumInsured(sumInsuredValue);


      this.computePremium()
    
    })
  }
  /**
 * Computes premiums for all generated quotations.
 * - Subscribes to 'computePremium' for each quotation code.
 * - Displays success or error messages accordingly.
 * - Updates shared service with quick quotation details.
 * - Navigates to the next page after successful premium computation.
 * @method computePremium
 * @return {void}
 */
  computePremium() {
    this.ngxSpinner.show("quickQuoteScreen")
    const premiumComputationObservables = this.quotationCodes.map(quotationCode => {
      return this.quotationService.computePremium(quotationCode);
    });
  
    forkJoin(premiumComputationObservables).subscribe(
      (data: any[]) => {
        try {
          // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premiums computed successfully' });
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
        }
  
        this.sharedService.setQuickQuotationDetails(this.quotationNumbers);
        sessionStorage.setItem('quickQuoteFormData', JSON.stringify(this.personalDetailsForm.value));
        this.ngxSpinner.hide("quickQuoteScreen")

        this.router.navigate(['/home/gis/quotation/cover-type-details']);
      },
      
      error => {
        this.ngxSpinner.hide("quickQuoteScreen")

        console.error('Error computing premium:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error computing premium' });
      }
    );
    // sessionStorage.setItem('dynamicFormData', JSON.stringify(this.dynamicForm.value));


  }
  
/**
 * Applies a global filter to a DataTable.
 * - Retrieves the input value from the event target.
 * - Calls the DataTable's 'filterGlobal' method with the input value and a specified string value.
 * @method applyFilterGlobal
 * @param {Event} $event - The event triggering the filter application.
 * @param {string} stringVal - The specified string value for filtering.
 * @return {void}
 */
applyFilterGlobal($event, stringVal) {
  this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
}
/**
 * Populates the 'years' property with the list of cover years.
 * - Subscribes to 'getYearOfManufacture' observable from ProductService.
 * - Logs the retrieved data for debugging purposes.
 * @method populateYears
 * @return {void}
 */
populateYears() {
  return this.productService.getYearOfManufacture().subscribe(data=>{
    log.debug("Data YOM",data._embedded[0]["List of cover years"])
    this.years=data._embedded[0]["List of cover years"];

  })
}


}
