import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import stepData from '../../data/steps.json'
import { ProductService } from '../../../../services/product/product.service';
import { Binders, Premiums, Products, Sections, Subclass, Subclasses, subclassCoverTypeSection, subclassCoverTypes, subclassSection } from '../../../setups/data/gisDTO';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Calendar } from 'primeng/calendar';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { CountryDto } from '../../../../../../shared/data/common/countryDto';
import { Table } from 'primeng/table';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { ClientBranchesDto, ClientDTO } from '../../../../../entities/data/ClientDTO';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';

import { NgxSpinnerService } from 'ngx-spinner';
import { Limit, PremiumComputationRequest, Risk } from '../../data/quotationsDTO';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service'
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';

import { Observable, tap } from 'rxjs';

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


  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products[];
  selectedProductCode: any;

  subClassList: Subclass[];
  allSubclassList: Subclasses[]
  filteredSubclass: Subclass[];
  selectedSubclassCode: any;
  allMatchingSubclasses = [];
  subclassSectionCoverList: any;
  mandatorySections: subclassCoverTypeSection[]
  binderList: any;
  binderListDetails: any;
  selectedBinderCode: any;
  selectedBinder: Binders;
  new: boolean;

  sourceList: any;
  sourceDetail: any;
  selectedSourceCode: any;
  selectedSource: any;

  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  formContent: any;
  formData: any;
  dynamicForm: FormGroup;
  control: any;
  personalDetailsForm: FormGroup;
  clientForm: FormGroup;
  riskDetailsForm: FormGroup;
  sectionDetailsForm: FormGroup;

  clientList: any;
  clientDetails: ClientDTO;
  clientData: any
  clientCode: any;
  clientType: any;
  clientName: any;
  clientEmail: any;
  clientPhone: any;



  countryList: CountryDto[];
  selectedCountry: any;
  filteredCountry: any;
  mobilePrefix: any;


  subclassCoverType: subclassCoverTypes[] = [];
  coverTypeCode: any;
  coverTypeDesc: any;

  quotationNo: any;
  quotationData: any;
  quotationCode: any;
  quotationNumbers = [];
  quotationCodes = [];
  quotationRiskData: any;
  riskCode: any;


  sectionArray: any;
  sectionList: subclassSection[];
  selectedSectionList: any;
  filteredSectionList: subclassSection[];
  section: Sections;

  steps = stepData;
  user: any;
  userDetails: any
  userBranchId: any;
  userBranchName:any;
  branchList: OrganizationBranchDto[];
  coverFromDate: string;
  coverToDate: string;
  passedCoverToDate: any;
  years: number[] = [];
  selectedYear: number;

  carRegNoValue: string;
  dynamicRegexPattern: string;
  carRegNoHasError: boolean = false;

  passedQuotation: any;
  passedQuotationNo: any;
  passedQuotationCode: any
  PassedClientDetails: any;

  // isAddRisk:boolean=false;
  isAddRisk: boolean;

  premiumComputationRequest: PremiumComputationRequest;
  riskPremiumDto: Risk[] = [];
  expiryPeriod: any;
  propertyId: any;
  premiumList: Premiums[] = [];
  allPremiumRate: Premiums[] = []
  additionalLimit = [];
  // addedBenefit:subclassCoverTypes;
  addedBenefitsList: [] = [];
  @ViewChild('dt1') dt1: Table | undefined;
  component: { code: number; date_with_effect_from: string; date_with_effect_to: string; bind_remarks: string; };


  passedSections: any[] = [];

  constructor(
    public fb: FormBuilder,
    public branchService: BranchService,
    public productService: ProductsService,
    public binderService: BinderService,
    public quotationService: QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public subclassService: SubclassesService,
    public currencyService: CurrencyService,
    private gisService: ProductService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private clientService: ClientService,
    public sharedService: SharedQuotationsService,
    public sectionService: SectionsService,
    public countryService: CountryService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    public premiumRateService: PremiumRateService,
    public globalMessagingService: GlobalMessagingService,


  ) { }

  ngOnInit(): void {
    this.loadAllproducts();
    this.loadAllClients();
    this.loadAllQoutationSources();
    this.LoadAllFormFields(this.selectedProductCode);
    this.dynamicForm = this.fb.group({});
    this.createPersonalDetailsForm();
    this.createForm();
    this.getuser();
    this.loadAllSubclass();
    this.populateYears();

    const QuickFormDetails = sessionStorage.getItem('riskFormData');

    /** THIS LINES OF CODES BELOW IS USED WHEN ADDING ANOTHER RISK ****/
    const passedQuotationDetailsString = sessionStorage.getItem('passedQuotationDetails');
    this.passedQuotation = JSON.parse(passedQuotationDetailsString);

    const passedClientDetailsString = sessionStorage.getItem('passedClientDetails');
    this.PassedClientDetails = JSON.parse(passedClientDetailsString);
    console.log("Quotation Details:", this.passedQuotation);
    this.passedQuotationNo = this.passedQuotation?.no;
    this.passedQuotationCode = this.passedQuotation?.quotationProduct[0].quotCode

    sessionStorage.setItem('passedQuotationNumber', this.passedQuotationNo);
    sessionStorage.setItem('passedQuotationCode', this.passedQuotationCode);

    console.log("Client Details:", this.PassedClientDetails);
    if (this.passedQuotation) {
      this.clientName = this.PassedClientDetails.firstName + ' ' + this.PassedClientDetails.lastName;
      this.clientEmail = this.PassedClientDetails.emailAddress;
      this.clientPhone = this.PassedClientDetails.phoneNumber;
      this.personalDetailsForm.patchValue(this.passedQuotation)

      const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
      this.isAddRisk = JSON.parse(passedIsAddRiskString);
      console.log("isAddRiskk Details:", this.isAddRisk);
    }


    const quickQuoteFormDetails = sessionStorage.getItem('quickQuoteFormData');
    console.log(quickQuoteFormDetails, 'Quick Quote form details session storage')

    if (quickQuoteFormDetails) {
      const parsedData = JSON.parse(quickQuoteFormDetails);
      console.log(parsedData)
      this.personalDetailsForm.setValue(parsedData);

    }
    this.premiumComputationRequest;

  }
  ngOnDestroy(): void {}
  /**
  * Loads all products by making an HTTP GET request to the ProductService.
  * Retrieves a list of products and updates the component's productList property.
  * Also logs the received product list for debugging purposes.
  * @method loadAllProducts
  * @return {void}
  */
  loadAllproducts() {

    const productDescription = [];
    const modifiedArray = [];

    this.productService.getAllProducts().subscribe(data => {
      this.productList = data;
      log.info(this.productList, "this is a product list")
      this.productList.forEach(product => {
        // Access each product inside the callback function
        let capitalizedDescription = product.description.charAt(0).toUpperCase() + product.description.slice(1).toLowerCase();
        productDescription.push({
          code: product.code,
          description: capitalizedDescription
        });
      });

      // Combine the characters back into words
      const combinedWords = productDescription.join(',');
      this.ProductDescriptionArray.push(...productDescription)

      // Now 'combinedWords' contains the result with words instead of individual characters
      log.info("modified product description", this.ProductDescriptionArray);

      this.cdr.detectChanges();
    });
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
    this.filteredCountry = '';
  }
  /* Toggles between a new and existing client */
  /**
   * Toggles the 'new' state to true.
   * This method is typically used to toggle between a new and existing client.
   * @method toggleButton
   * @return {void}
   */
  toggleButton() {
    this.new = true
  }
  /**
   * Toggles the 'new' state to false and resets client-related data.
   * This method is commonly used to switch from a 'new' client state to a default state and clear client input fields.
   * @method toggleNewClient
   * @return {void}
   */
  toggleNewClient() {
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
  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails?.branchId;
    log.debug("Branch Id", this.userBranchId);
    this.fetchBranches();

  }

  /**
   * Retrieves branch information by making an HTTP GET request to the BranchService.
   * - Populates the 'branchList' property with the received data.
   * - Logs the retrieved branch list for debugging purposes.
   * @method getBranch
   * @return {void}
   */
  // getbranch() {
  //   this.branchService.getBranch().subscribe(data => {
  //     this.branchList = data;
  //     log.debug("Branch List", this.branchList);
  //     const branch = this.branchList.filter(branch => branch.id == this.userBranchId)
  //     log.debug("branch", branch)
  //   })
  // }
  fetchBranches(organizationId?: number, regionId?: number) {
    this.branchService
      .getAllBranches(organizationId, regionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchList = data;
        log.info('Fetched Branches', this.branchList);
        const branch = this.branchList.filter(branch => branch.id == this.userBranchId)
        log.debug("branch", branch);
        this.userBranchName= branch[0].name;
      });
  }
  /**
   * Fetches client data via HTTP GET from ClientService.
   * - Populates 'clientList' and extracts data from 'content'.
   * - Logs client data for debugging using 'log.debug'.
   * @method loadAllClients
   * @return {void}
   */
  loadAllClients() {
    this.clientService.getClients().subscribe(data => {
      this.clientList = data;
      log.debug("CLIENT DATA:", this.clientList)
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
  getCountries() {
    this.countryService.getCountries().subscribe(data => {
      this.countryList = data;
      log.debug("Country List", this.countryList);
      const testCountry = "KENYA"
      // const clientCountry= this.clientDetails.
      this.filteredCountry = this.countryList.filter(prefix => prefix.id == this.selectedCountry)
      log.debug("Filtered Country", this.filteredCountry);

      this.mobilePrefix = this.filteredCountry[0].zipCodeString;
      log.debug("Filtered mobilePrefix", this.mobilePrefix);

    })
  }
  /**
   * Creates a form group using Angular FormBuilder (fb).
   * - Defines form controls for client details.
   * @method createForm
   * @return {void}
   */
  createForm() {
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
  createPersonalDetailsForm() {
    this.personalDetailsForm = this.fb.group({
      actionType: [''],
      addEdit: [''],
      agentCode: [''],
      agentShortDescription: [''],
      bdivCode: [''],
      bindCode: ['', Validators.required],
      branchCode: ['', Validators.required],
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
      withEffectiveFromDate: ['', Validators.required],
      withEffectiveToDate: ['', Validators.required],
      multiUser: [''],
      comments: [''],
      internalComments: [''],
      introducerCode: [''],
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
  loadClientDetails(id) {
    this.clientService.getClientById(id).subscribe(data => {
      this.clientDetails = data;
      this.clientType = this.clientDetails.clientType.clientTypeName
      console.log("Selected Client Details:", this.clientDetails)
      const clientDetailsString = JSON.stringify(this.clientDetails);
      sessionStorage.setItem('clientDetails', clientDetailsString);
      console.log("Selected code client:", this.clientType)
      this.selectedCountry = this.clientDetails.country;
      console.log("Selected client country:", this.selectedCountry)
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
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    this.clientEmail = this.clientDetails.emailAddress;
    this.clientPhone = this.clientDetails.phoneNumber;
    sessionStorage.setItem('clientCode', this.clientCode);
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
  onProductSelected(selectedValue: any) {
    this.selectedProductCode = selectedValue.code;
    console.log("Selected Product Code:", this.selectedProductCode);

    this.getProductSubclass(this.selectedProductCode);
    // this.loadAllSubclass()

    // Load the dynamic form fields based on the selected product
    this.LoadAllFormFields(this.selectedProductCode);
    this.getProductExpiryPeriod();
  }
  /**
   * Retrieves cover to date based on the selected product and cover from date.
   * - Checks if 'coverFromDate' is available.
   * - Makes an HTTP GET request to ProductService for cover to date.
   * - Assigns the cover to date from the received data.
   * @method getCoverToDate
   * @return {void}
   */
  getCoverToDate() {
    if (this.coverFromDate) {
      this.productService.getCoverToDate(this.coverFromDate, this.selectedProductCode).subscribe(data => {
        log.debug("DATA FROM COVERFROM:", data)
        const dataDate = data;
        this.passedCoverToDate = dataDate._embedded[0].coverToDate;
        log.debug("DATe FROM DATA:", this.passedCoverToDate)
        this.getPremiumRates();

      })
    }
  }

  // getProductExpiryPeriod() {
  //   if (this.selectedProductCode && this.productList) {
  //     this.selectedProduct = this.productList.filter(product => product.code == this.selectedProductCode);
  //     log.debug("Selected Product", this.selectedProduct);
  //     if (this.selectedProduct != null && this.selectedProduct.length > 0) {
  //       this.expiryPeriod = this.selectedProduct[0].expires;
  //       log.debug("Expiry period", this.expiryPeriod)
  //     } else {
  //       this.expiryPeriod = "N";
  //     }

  //   }
  // }

  getProductExpiryPeriod() {
  if (!this.selectedProductCode || !this.productList) {
    this.expiryPeriod = "N";
    return;
  }

  this.selectedProduct = this.productList.filter(product => product.code === this.selectedProductCode);

  if (this.selectedProduct.length > 0) {
    this.expiryPeriod = this.selectedProduct[0].expires;
  } else {
    this.expiryPeriod = "N";
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
    this.productService.getProductSubclasses(code).subscribe(data => {
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
  loadAllSubclass() {
    return this.subclassService.getAllSubclasses().subscribe(data => {
      this.allSubclassList = data;
      log.debug(this.allSubclassList, "All Subclass List");
      this.cdr.detectChanges();

    })
  }

  // loadAllSubclass(): Observable<any> {
  //   return this.subclassService.getAllSubclasses().pipe(
  //     tap(data => {
  //       this.allSubclassList = data;
  //       log.debug(this.allSubclassList, "All Subclass List");
  //       this.cdr.detectChanges();
  //     })
  //   );
  // }
  
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
    this.selectedSubclassCode = selectedValue;
    // Perform your action based on the selected value
    console.log(`Selected value: ${selectedValue}`);
    log.debug(this.selectedSubclassCode, 'Sekected Subclass Code')

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders();
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
      this.binderList = data;
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
  onSelectBinder(event: any) {
    this.selectedBinderCode = event.target.value;
    const bind = this.binderListDetails.filter(bind => bind.code == this.selectedBinderCode)
    this.currencyCode = bind[0].currency_code;
    if (bind != null && bind.length > 0) {
      this.selectedBinder = bind[0];

    }

    console.log("Selected Binder:", this.selectedBinder);
    console.log("Selected Currency Code:", this.currencyCode);
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
  loadAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe(data => {
      this.currencyList = data;
      log.info(this.currencyList, "this is a currency list");
      const curr = this.currencyList.filter(currency => currency.id == this.currencyCode);
      this.selectedCurrency = curr[0].name
      log.debug("Selected Currency:", this.selectedCurrency);
      this.selectedCurrencyCode = curr[0].id;
      log.debug("Selected Currency code:", this.selectedCurrencyCode);

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
      log.debug('Subclass Covertype', this.subclassCoverType);

      this.coverTypeCode = this.subclassCoverType[0].coverTypeCode;
      this.coverTypeDesc = this.subclassCoverType[0].coverTypeShortDescription;

      // log.debug(this.subclassCoverType,'filtered covertype');
      // log.debug(this.coverTypeCode,'filtered covertype code');
      log.debug(this.coverTypeDesc, 'filtered covertype Desc');

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
  loadAllQoutationSources() {
    this.quotationService.getAllQuotationSources().subscribe(data => {
      this.sourceList = data;
      this.sourceDetail = data.content;
      console.log(this.sourceDetail, "Source list")
    })
  }

  onSourceSelected(event: any) {
    this.selectedSourceCode = event.target.value;
    console.log("Selected Source Code:", this.selectedSourceCode);
    this.selectedSource = this.sourceDetail.filter(source => source.code == this.selectedSourceCode);
    console.log("Selected Source :", this.selectedSource);
    // this.sharedService.setQuotationSource(this.selectedSource)
    const quotationSourceString = JSON.stringify(this.selectedSource);
    sessionStorage.setItem('quotationSource', quotationSourceString);


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
   * Loads subclass sections and cover types for the selected subclass code.
   * - Subscribes to 'getSubclassCovertypeSections' from SubclassSectionCovertypeService.
   * - Populates 'subclassSectionCoverList' and filters mandatory sections.
   * - Sets the first mandatory section as 'selectedSectionList'.
   * - Updates shared service with quick section details.
   * @method loadSubclassSectionCovertype
   * @return {void}
   */
  loadSubclassSectionCovertype() {
    this.subclassSectionCovertypeService.getSubclassCovertypeSections().subscribe(data => {
      this.subclassSectionCoverList = data;
      log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
      this.mandatorySections = this.subclassSectionCoverList.filter(section => section.subClassCode == this.selectedSubclassCode && section.isMandatory == "Y");
      log.debug("Mandatory Section Covertype:", this.mandatorySections);
      const notMandatorySections = this.subclassSectionCoverList.filter(section =>
        section.subClassCode == this.selectedSubclassCode &&
        section.isMandatory == null
      );
      log.debug("NOT MANDATORY", notMandatorySections)
      if (this.mandatorySections.length > 0) {

        this.selectedSectionList = this.mandatorySections[0];

        log.debug("Selected Section ", this.selectedSectionList)

      } else {

      }

      const mandatorySectionsString = JSON.stringify(this.mandatorySections);
      sessionStorage.setItem('mandatorySections', mandatorySectionsString);
      this.getSectionByCode();
    })
  }
  getSectionByCode() {
    this.sectionService.getSectionByCode(this.selectedSectionList.sectionCode).subscribe(data => {
      this.section = data;
      log.debug("Section", this.section)
    })
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
    return this.productService.getYearOfManufacture().subscribe(data => {
      log.debug("Data YOM", data._embedded[0]["List of cover years"])
      this.years = data._embedded[0]["List of cover years"];

    })
  }
  /***********************NEW PREMIUM COMPUTATION*******************************/
  getPremiumRates() {

    for (let i = 0; i < this.mandatorySections.length; i++) {
      this.selectedSectionList = this.mandatorySections[i];
      const selectedSectionCode = this.selectedSectionList.sectionCode;
      this.premiumRateService.getAllPremiums(selectedSectionCode, this.selectedBinderCode, this.selectedSubclassCode).subscribe(data => {
        this.premiumList = data;
        log.debug("data ", data)
        this.allPremiumRate.push(...this.premiumList)
        log.debug(this.premiumList, "premium List");

        // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
      });
      log.debug(this.allPremiumRate, "all quick quote premium List");

    }

  }


  setRiskPremiumDto(): Risk[] {
    log.debug("subclass cover type", this.subclassCoverType)

    return this.subclassCoverType.map(item => {
      let risk: Risk = {
        propertyId: this.dynamicForm.get('carRegNo').value,
        withEffectFrom: this.coverFromDate,
        withEffectTo: this.passedCoverToDate,
        prorata: "F",
        subclassSection: {
          code: this.selectedSubclassCode
        },
        itemDescription: this.dynamicForm.get('carRegNo').value,
        noClaimDiscountLevel: 0,
        subclassCoverTypeDto: {
          subclassCode: this.selectedSubclassCode,
          coverTypeCode: item.coverTypeCode,
          minimumAnnualPremium: 0,
          minimumPremium: parseInt(item.minimumPremium, 10),
          coverTypeShortDescription: item.description

        },
        enforceCovertypeMinimumPremium: "N",
        binderDto: {
          code: this.selectedBinderCode,
          currencyCode: this.currencyCode,
          maxExposure: this.selectedBinder.maximum_exposure,
          currencyRate: 415.25 /**TODO: Fetch from API */
        },
        limits: this.setLimitPremiumDto(item.coverTypeCode),
      }
      // this.riskPremiumDto.push(risk);

      return risk
    })


  }

  setLimitPremiumDto(coverTypeCode: number): Limit[] {
    const sumInsured = this.dynamicForm.get('selfDeclaredValue').value.replace(/,/g, '');

    let limitItems = [];
    let sectionCodes = [];
    let sectionsForCovertype = this.mandatorySections.filter(sect => {
      log.debug(sect)
      log.debug(sect.coverTypeCode + " vs " + coverTypeCode)
      return sect.coverTypeCode == coverTypeCode
    });

    if (!this.allPremiumRate) return []
    this.getPremiumRates()
    log.debug("Found " + sectionsForCovertype.length + " Sections ")
    log.debug("Premium rates " + this.allPremiumRate)
    let response: Limit[] = sectionsForCovertype.map(it =>
      this.allPremiumRate
        .filter(rate => {
          log.debug("In limit: " + rate.sectionCode + " vs " + it.sectionCode)
          return rate.sectionCode == it.sectionCode;
        })
        .map(rate => {
          return {
            calculationGroup: 1,
            declarationSection: "N",
            rowNumber: 1,
            rateDivisionFactor: rate.divisionFactor,
            premiumRate: rate.rate,
            rateType: rate.rateType,
            minimumPremium: rate.premiumMinimumAmount,
            annualPremium: 0,
            multiplierDivisionFactor: 1,
            multiplierRate: rate.multiplierRate,
            description: rate.sectionShortDescription,
            section: {
              code: it.sectionCode
            },
            sectionType: rate.sectionType,
            riskCode: null,
            limitAmount: sumInsured,
            compute: "Y",
            dualBasis: "N"
          }

        })

    ).flatMap(item => item)

    if (this.additionalLimit.length > 0) {
      log.debug("Added Limit", this.additionalLimit)
      // Adjust the existing response to include the additional risk
      this.additionalLimit.forEach(item => sectionsForCovertype.push(item))
      log.debug("section for CoverType:", sectionsForCovertype)
      response = response.concat(
        sectionsForCovertype.map(it =>
          this.allPremiumRate
            .filter(rate => {
              log.debug("In limit: " + rate.sectionCode + " vs " + it.sectionCode)
              return rate.sectionCode == it.sectionCode;
            })
            .map(rate => {
              return {
                calculationGroup: 2,  // Adjust the calculationGroup for the additional risk
                declarationSection: "N",
                rowNumber: 1,
                rateDivisionFactor: rate.divisionFactor,
                premiumRate: rate.rate,
                rateType: rate.rateType,
                minimumPremium: rate.premiumMinimumAmount,
                annualPremium: 0,
                multiplierDivisionFactor: 1,
                multiplierRate: rate.multiplierRate,
                description: rate.sectionShortDescription,
                section: {
                  code: it.sectionCode
                },
                sectionType: rate.sectionType,
                riskCode: null,
                limitAmount: sumInsured,
                compute: "Y",
                dualBasis: "N"
              }
            })
        ).flatMap(item => item)
      );
    }

    log.debug("Covertype", coverTypeCode)
    log.debug("Section items", sectionsForCovertype)
    log.debug("limit items", response)

    return response;
  }
  computePremiumV2() {
    this.ngxSpinner.show()

    sessionStorage.setItem('product', this.selectedProductCode);

    this.premiumComputationRequest = {
      dateWithEffectFrom: this.coverFromDate,
      dateWithEffectTo: this.passedCoverToDate,
      underwritingYear: 2024,
      age: null,
      coinsuranceLeader: null,
      coinsurancePercentage: null,
      entityUniqueCode: null,
      interfaceType: null,
      frequencyOfPayment: "A",
      quotationStatus: "Draft",
      /**Setting Product Details**/
      product: {
        code: this.selectedProductCode,
        expiryPeriod: this.expiryPeriod,
      },
      currency: {
        rate: 415.25 /**TODO: Fetch from API */,
      },
      risks: this.setRiskPremiumDto(),

    }
    log.debug("PREMIUM COMPUTATION PAYLOAD", this.premiumComputationRequest);

    const premiumComputationRequestString = JSON.stringify(this.premiumComputationRequest);
    sessionStorage.setItem('premiumComputationRequest', premiumComputationRequestString);
    const subclassCoverTypeString = JSON.stringify(this.subclassCoverType);
    sessionStorage.setItem('subclassCoverType', subclassCoverTypeString);

    // this.sharedService.setPremiumComputationPayload(this.premiumComputationRequest, this.subclassCoverType);

    return this.quotationService.premiumComputationEngine(this.premiumComputationRequest).subscribe({
      next: (data) => {
        log.debug("Data", data)
        const premiumResponseString = JSON.stringify(data);
        sessionStorage.setItem('premiumResponse', premiumResponseString);

        // this.sharedService.setPremiumResponse(data);
        this.router.navigate(['/home/gis/quotation/cover-type-details']);
      },
      error: (error: HttpErrorResponse) => {
        log.info(error);
        this.ngxSpinner.hide()

        this.globalMessagingService.displayErrorMessage('Error', 'Premium Computation Failed');

      }

    }

    )

  }
  onCreateRiskSection() {
    console.log('Selected Sections:', this.passedSections);

    // Assuming this.premiumList is an array of premium rates retrieved from the service
    const premiumRates = this.premiumList;

    if (premiumRates.length !== this.passedSections.length) {
      // Handle the case where the number of premium rates doesn't match the number of sections
      console.error("Number of premium rates doesn't match the number of sections");
      return;
    }

    const payload = this.passedSections.map((section, index) => {
      const premiumRate = premiumRates[index]; // Get the corresponding premium rate for the current section

      return {
        calcGroup: 1,
        code: section.code,
        compute: "Y",
        description: premiumRate.sectionShortDescription,
        freeLimit: 0,
        multiplierDivisionFactor: premiumRate.multiplierDivisionFactor,
        multiplierRate: premiumRate.multiplierRate,
        premiumAmount: 0,
        premiumRate: premiumRate.rate,
        rateDivisionFactor: premiumRate.divisionFactor,
        rateType: premiumRate.rateType,
        rowNumber: 1,
        sumInsuredLimitType: null,
        sumInsuredRate: 0,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: 34,
      };
    });

    this.sectionArray = payload;

    this.quotationService.createRiskSection(this.riskCode, this.sectionArray).subscribe(data => {
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
      }
      // this.computeQuotePremium();
     
    });
  }

}
