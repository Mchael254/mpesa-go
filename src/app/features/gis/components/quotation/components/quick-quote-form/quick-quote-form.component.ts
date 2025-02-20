import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';
import {ProductsService} from '../../../setups/services/products/products.service';
import {Logger, UtilService} from '../../../../../../shared/services';
import {BinderService} from '../../../setups/services/binder/binder.service';
import {QuotationsService} from '../../services/quotations/quotations.service';

import {CurrencyService} from '../../../../../../shared/services/setups/currency/currency.service';
import {ClientService} from '../../../../../entities/services/client/client.service';
import stepData from '../../data/steps.json';
import {
  Binders,
  Premiums,
  Products, QuickQuoteData,
  Sections,
  Subclass,
  SubclassCoverTypes,
  subclassCoverTypeSection,
  Subclasses,
  VesselType,
} from '../../../setups/data/gisDTO';
import {AuthService} from '../../../../../../shared/services/auth.service';
import {SubClassCoverTypesService} from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import {SubclassesService} from '../../../setups/services/subclasses/subclasses.service';
import {Calendar} from 'primeng/calendar';
import {SectionsService} from '../../../setups/services/sections/sections.service';
import {CountryService} from '../../../../../../shared/services/setups/country/country.service';
import {CountryDto} from '../../../../../../shared/data/common/countryDto';
import {Table, TableLazyLoadEvent} from 'primeng/table';
import {
  SubClassCoverTypesSectionsService
} from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import {ClientDTO,} from '../../../../../entities/data/ClientDTO';
import {BranchService} from '../../../../../../shared/services/setups/branch/branch.service';
import {OrganizationBranchDto} from '../../../../../../shared/data/common/organization-branch-dto';

import {NgxSpinnerService} from 'ngx-spinner';
import {ClientPhone, Limit, PremiumComputationRequest, Risk, Tax,} from '../../data/quotationsDTO';
import {PremiumRateService} from '../../../setups/services/premium-rate/premium-rate.service';
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {untilDestroyed} from '../../../../../../shared/services/until-destroyed';

import {firstValueFrom, forkJoin, from, mergeMap, tap} from 'rxjs';
import {NgxCurrencyConfig} from 'ngx-currency';
import {CountryISO, PhoneNumberFormat, SearchCountryField,} from 'ngx-intl-tel-input';
import {OccupationService} from '../../../../../../shared/services/setups/occupation/occupation.service';
import {OccupationDTO} from '../../../../../../shared/data/common/occupation-dto';
import {VesselTypesService} from '../../../setups/services/vessel-types/vessel-types.service';
import {Pagination} from '../../../../../../shared/data/common/pagination';
import {TableDetail} from '../../../../../../shared/data/table-detail';
import {MenuService} from 'src/app/features/base/services/menu.service';
import {SidebarMenu} from 'src/app/features/base/model/sidebar.menu';
import {concatMap} from "rxjs/operators";

const log = new Logger('QuickQuoteFormComponent');

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css'],
})
export class QuickQuoteFormComponent implements OnInit, OnDestroy {
  @ViewChild('calendar', { static: true }) calendar: Calendar;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;

  public currencyObj: NgxCurrencyConfig;
  productList: Products[];
  ProductDescriptionArray: any = [];
  selectedProduct: Products[];
  selectedProductCode: any;

  subClassList: Subclass[];
  allSubclassList: Subclasses[];
  selectedSubclassCode: any;
  allMatchingSubclasses = [];
  subclassSectionCoverList: any;
  mandatorySections: subclassCoverTypeSection[];
  binderList: any;
  binderListDetails: any;
  selectedBinderCode: any;
  selectedBinder: Binders;
  newClient: boolean = true;
  isNewClient: boolean = true;
  existingClientSelected = false;
  readonlyClient: boolean = false;
  isFieldsDisabled: boolean = false;

  sourceList: any;
  sourceDetail: any;
  selectedSourceCode: any;
  selectedSource: any;

  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  formContent: any;
  formData: {
    type: string;
    name: string;
    isMandatory: string;
    disabled: boolean;
    readonly: boolean;
    regexPattern: string;
    placeholder: string;
    label: string;
  }[];
  dynamicForm: FormGroup;
  control: any;
  personalDetailsForm: FormGroup;
  clientForm: FormGroup;
  sectionDetailsForm: FormGroup;

  clientList: any;
  clientDetails: ClientDTO;
  clientData: any;
  clientCode: any;
  clientType: any;
  clientName: any;
  clientEmail: any;
  clientPhone: any;
  newClientData = {
    inputClientName: '',
    inputClientZipCode: '',
    inputClientPhone: '',
    inputClientEmail: '',
  };
  countryList: CountryDto[];
  selectedCountry: any;
  filteredCountry: any;
  mobilePrefix: any;
  selectedZipCode: any;

  subclassCoverType: SubclassCoverTypes[] = [];
  coverTypeCode: any;
  coverTypeDesc: any;

  quotationNo: any;
  quotationCode: any;
  riskCode: any;

  sectionArray: any;
  selectedSectionList: any;
  section: Sections;

  steps = stepData;
  user: any;
  userDetails: any;
  userBranchId: any;
  userBranchName: any;
  dateFormat: any;
  branchList: OrganizationBranchDto[];
  selectedBranchCode: any;
  branchDescriptionArray: any = [];

  coverFromDate: Date;
  coverToDate: string;
  passedCoverToDate: any;
  years: number[] = [];

  carRegNoValue: string;
  dynamicRegexPattern: string;
  carRegNoHasError: boolean = false;

  passedQuotation: any;
  passedQuotationNo: any;
  passedQuotationCode: string;
  PassedClientDetails: any;
  passedNewClientDetails: any;

  // isAddRisk:boolean=false;
  isAddRisk: boolean;

  premiumComputationRequest: PremiumComputationRequest;
  expiryPeriod: any;
  propertyId: any;
  premiumList: Premiums[] = [];
  allPremiumRate: Premiums[] = [];
  additionalLimit = [];
  @ViewChild('dt1') dt1: Table | undefined;
  component: {
    code: number;
    date_with_effect_from: string;
    date_with_effect_to: string;
    bind_remarks: string;
  };

  passedSections: any[] = [];
  existingPropertyIds: string[] = [];
  passedExistingClientDetails: any;
  parsedProductDesc: any;
  parsedSubclassDesc: any;
  parsedBinderDesc: any;
  parsedBranchDesc: any;
  parsedCarRegNo: string;
  parsedYearOfManufacture: string;
  parsedSumInsured: string;
  filteredBranchCodeNumber: number;
  regexPattern: any;
  defaultCurrencyName: any;
  minDate: Date | undefined;
  currencyDelimiter: any;
  defaultCurrencySymbol: any;
  selectedCurrencySymbol: any;
  coverFrom: any;
  passedClientDetailsString: string;
  passedNewClientDetailsString: string;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.Kenya,
    CountryISO.Nigeria,
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
  ];
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  selectedEffectiveDate: any;
  effectiveFromDate: string;
  todaysDate: string;
  isEditRisk: boolean;
  occupationData: OccupationDTO[];
  selectedoccupationCode: any;
  selectedCoverToDate: any;
  vesselTypeList: VesselType[];
  modeOfTransport: { code: number; description: string }[] = [
    {
      code: 1,
      description: 'Air',
    },
    {
      code: 2,
      description: 'By sea',
    },
    {
      code: 3,
      description: 'By road',
    },
    {
      code: 4,
      description: 'By sea road',
    },
    {
      code: 5,
      description: 'By sea rail road',
    },
    {
      code: 6,
      description: 'By air road',
    },
  ];

  selectedVesselTypeCode: any;
  isFormDataLoaded: boolean = false;
  quotationSubMenuList: SidebarMenu[];

  quickQuoteForm: FormGroup;
  quoteAction: string = null;

  filterObject: {
    name: string;
    idNumber: string;
  } = {
    name: '',
    idNumber: '',
  };
  public clientsData: Pagination<ClientDTO> = <Pagination<ClientDTO>>{};
  tableDetails: TableDetail;
  public pageSize: 5;
  isSearching = false;
  searchTerm = '';
  cols = [
    { field: 'clientFullName', header: 'Name' },
    { field: 'emailAddress', header: 'Email' },
    { field: 'phoneNumber', header: 'Phone number' },
    { field: 'idNumber', header: 'ID number' },
    { field: 'pinNumber', header: 'Pin' },
    { field: 'id', header: 'ID' },
  ];
  globalFilterFields = ['idNumber', 'firstName', 'lastName', 'emailAddress'];
  emailValue: string;
  phoneValue: string;
  pinValue: string;
  idValue: string;
  taxList: any;
  newClientPhone: ClientPhone;
  formattedCoverToDate: string;

  isReturnToQuickQuote: boolean;
  storedData: QuickQuoteData = null

  applicablePremiumRates: any

  constructor(
    public fb: FormBuilder,
    public utilService: UtilService,
    public branchService: BranchService,
    public productService: ProductsService,
    public binderService: BinderService,
    public quotationService: QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public subclassService: SubclassesService,
    public currencyService: CurrencyService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private clientService: ClientService,
    public sectionService: SectionsService,
    public countryService: CountryService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    public premiumRateService: PremiumRateService,
    public globalMessagingService: GlobalMessagingService,
    private occupationService: OccupationService,
    private vesselTypesService: VesselTypesService,
    private spinner: NgxSpinnerService,
    private menuService: MenuService
  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false,
    };
    this.storedData = JSON.parse(sessionStorage.getItem('quickQuoteData'));
    this.quoteAction = sessionStorage.getItem('quoteAction');
    this.quoteAction = sessionStorage.getItem('quoteAction');
    this.isReturnToQuickQuote = JSON.parse(
      sessionStorage.getItem('isReturnToQuickQuote')
    );
    this.PassedClientDetails = this.storedData?.selectedClient;
    this.passedQuotation = JSON.parse(
      sessionStorage.getItem('passedQuotationDetails')
    );
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.loadAllproducts();
    this.loadAllClients();
    this.getCountries();

    this.loadAllQoutationSources();
    this.getuser();
    this.loadAllSubclass();
    this.populateYears();
    this.loadAllCurrencies();

    this.quotationSubMenuList = this.menuService.quotationSubMenuList();
    this.dynamicSideBarMenu(this.quotationSubMenuList[1]);

    const QuickFormDetails = sessionStorage.getItem('riskFormData');

    const passedIsEditRiskString = sessionStorage.getItem('isEditRisk');
    this.isEditRisk = JSON.parse(passedIsEditRiskString);
    log.debug('isEditRisk Details:', this.isEditRisk);

    const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
    this.isAddRisk = JSON.parse(passedIsAddRiskString);
    log.debug('isAddRiskk Details:', this.isAddRisk);
    this.premiumComputationRequest;
    const organizationId = undefined;
    this.getOccupation(organizationId);
    this.getVesselTypes(organizationId);

    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
      globalFilterFields: this.globalFilterFields,
      showFilter: false,
      showSorting: true,
      paginator: true,
      // url: '/home/entity/view',
      urlIdentifier: 'id',
      viewDetailsOnView: true,
      // viewMethod: this.viewDetailsWithId.bind(this),
      isLazyLoaded: true,
    };

    log.debug('isReturnToQuickQuote Details:', this.isReturnToQuickQuote);
    const navigationSource = sessionStorage.getItem('navigationSource');
    sessionStorage.removeItem('navigationSource');
    this.createQuickQuiteForm();

    if (this.storedData) {
      log.debug('Existing data>>>>', this.storedData);
      this.selectedProductCode = this.storedData.product.code;
      this.selectedSubclassCode = this.storedData.subClass.code;
      this.LoadAllFormFields(this.selectedProductCode);
      this.getProductSubclass(this.selectedProductCode);
      this.getProductExpiryPeriod();
      this.getCoverToDate();
      this.fetchComputationData(
        this.selectedProductCode,
        this.selectedSubclassCode
      );
      this.fetchRegexPattern();
      this.existingClientSelected = this.storedData.existingClientSelected;
      if (this.existingClientSelected) {
        this.newClient = false;
      }
      this.quickQuoteForm.patchValue({
        clientName: this.storedData.clientName,
        emailAddress: this.storedData.clientEmail,
        phoneNumber: this.storedData.clientPhoneNumber,
        effectiveDate: new Date(this.storedData.effectiveDateFrom),
      });
    }
  }

  createQuickQuiteForm() {
    this.quickQuoteForm = this.fb.group({
      clientName: [''],
      emailAddress: ['', [Validators.email]],
      phoneNumber: [''],
      product: ['', [Validators.required]],
      subClass: ['', [Validators.required]],
      effectiveDate: ['', [Validators.required]],
      currency: ['', [Validators.required]],
    });
  }

  isFieldRequired(controlName: string): boolean {
    const control = this.quickQuoteForm.get(controlName);
    return control?.hasValidator(Validators.required) ?? false;
  }

  ngOnDestroy(): void {}

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
  }

  addRisk() {
    this.loadAllCurrencies();
    log.debug('ADDING ANOTHER RISK TO THE SAME QUOTATION');

    /** THIS LINES OF CODES BELOW IS USED WHEN ADDING ANOTHER RISK ****/

    this.passedClientDetailsString = sessionStorage.getItem(
      'passedClientDetails'
    );

    this.passedNewClientDetailsString = sessionStorage.getItem(
      'passedNewClientDetails'
    );

    log.debug('passedClientDetails', this.passedClientDetailsString);

    if (this.passedClientDetailsString == 'undefined' || 'null') {
      log.debug('New Client has been passed');

      this.passedNewClientDetails = JSON.parse(
        this.passedNewClientDetailsString
      );
      log.debug('new Client Details:', this.passedNewClientDetails);
    }

    if (this.passedNewClientDetails == 'null' || 'undefined') {
      log.debug('Existing Client has been passed');
      this.PassedClientDetails = JSON.parse(this.passedClientDetailsString);
    }

    log.debug('Quotation Details:', this.passedQuotation);
    this.passedQuotationNo = this.passedQuotation?.quotOriginalQuotNo ?? null;
    log.debug('passed QUOYTATION number', this.passedQuotationNo);
    if (this.passedQuotation) {
      this.existingPropertyIds = this.passedQuotation.riskInformation?.map(
        (risk) => risk.propertyId
      );
      log.debug('existing property id', this.existingPropertyIds);
    }

    this.passedQuotationCode =
      this.passedQuotation?.quotationProducts?.[0]?.quotCode ?? null;

    log.debug('passed QUOYTATION CODE', this.passedQuotationCode);
    sessionStorage.setItem('passedQuotationNumber', this.passedQuotationNo);
    sessionStorage.setItem('passedQuotationCode', this.passedQuotationCode);
    // sessionStorage.setItem('passedQuotationDetails', this.passedQuotation);

    log.debug('Existing Client Details:', this.PassedClientDetails);
    if (this.passedQuotation) {
      if (this.PassedClientDetails) {
        this.clientName = this.utilService.getFullName(
          this.PassedClientDetails
        );
        this.clientEmail = this.PassedClientDetails.emailAddress;
        this.clientPhone = this.PassedClientDetails.phoneNumber;
        this.personalDetailsForm.patchValue(this.passedQuotation);
        this.isNewClient = false;
        // this.toggleButton();
      } else {
        log.debug('NEW CLIENT ADD ANOTHER RISK');
        this.newClientData.inputClientName =
          this.passedNewClientDetails?.inputClientName;
        this.newClientData.inputClientEmail =
          this.passedNewClientDetails?.inputClientEmail;
        const phoneNumberString = this.passedNewClientDetails.inputClientPhone; // Treat as a string
        this.newClientPhone = {
          number: phoneNumberString,
          internationalNumber: '', // Left empty as it's not stored
          nationalNumber: phoneNumberString,
          e164Number: '',
          countryCode: '',
          dialCode: '',
        };
        this.selectedZipCode = this.passedNewClientDetails?.inputClientZipCode;
        this.isNewClient = true;
        this.toggleNewClient();
      }
      const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
      this.isAddRisk = JSON.parse(passedIsAddRiskString);
      log.debug('isAddRiskk Details:', this.isAddRisk);

      this.selectedCountry = this.PassedClientDetails.country;
      log.info('Paased selected country:', this.selectedCountry);
      if (this.selectedCountry) {
        this.getCountries();
      }
    }

    const quickQuoteFormDetails = sessionStorage.getItem('quickQuoteFormData');
    log.debug(
      quickQuoteFormDetails,
      'Quick Quote form details session storage'
    );

    if (quickQuoteFormDetails) {
      const parsedData = JSON.parse(quickQuoteFormDetails);
      log.debug(parsedData, 'pARSED dATA');
      //   this.personalDetailsForm.patchValue(parsedData);
    }

    this.premiumComputationRequest;
  }

  loadFormData() {
    if (!this.isEditRisk) {
      log.debug('Form data loading skipped - not in edit mode');
      return;
    }

    // Check fields disable state when loading form
    this.checkFieldsDisableState();

    log.debug('LOAD FORM DATA IS BEING CALLED TO POPULATE THE FORM');
    // Load data from session storage on initialization
    const savedData = sessionStorage.getItem('personalDetails');
    log.debug('TESTING IF THE DATA HAS BEEN SAVED', savedData);
    const savedCarRegNo = JSON.parse(sessionStorage.getItem('carRegNo'));

    log.debug('TESTING IF THE CAR REG DATA HAS BEEN  SAVED', savedCarRegNo);
    this.parsedCarRegNo = savedCarRegNo;

    // const savedYearOfManufacture = sessionStorage.getItem('yearOfManufacture')
    const savedYearOfManufacture = JSON.parse(
      sessionStorage.getItem('yearOfManufacture')
    );

    log.debug(
      'TESTING IF THE Year of manufacture DATA HAS BEEN  SAVED',
      savedYearOfManufacture
    );
    this.parsedYearOfManufacture = savedYearOfManufacture;

    // const savedSumInsured = sessionStorage.getItem('selfDeclaredValue')
    const savedSumInsured = JSON.parse(sessionStorage.getItem('sumInsured'));
    log.debug(
      'TESTING IF THE SumInsured DATA HAS BEEN  SAVED',
      savedSumInsured
    );
    this.parsedSumInsured = savedSumInsured;

    if (savedData) {
      const parsedPersonalDetailsData = JSON.parse(savedData);

      //  this.personalDetailsForm.patchValue(JSON.parse(savedData));
      /**BRANCH */
      const filteredBranchCode = parsedPersonalDetailsData.branchCode;
      this.filteredBranchCodeNumber = parseInt(filteredBranchCode);
      log.debug('Branch code', parsedPersonalDetailsData.branchCode);
      log.debug('Branch code number', this.filteredBranchCodeNumber);
      setTimeout(() => {
        log.debug('Branch listsssss:', this.branchDescriptionArray);
        const filteredbranch = this.branchDescriptionArray.find(
          (branch) => branch.code === this.filteredBranchCodeNumber
        );
        log.debug('Filtered Branch', filteredbranch);
        this.parsedBranchDesc = filteredbranch.description;
        log.debug('Filtered Branch description', this.parsedBranchDesc);
        this.userBranchName = this.parsedBranchDesc;
      }, 1000);
      /**PRODUCT */
      log.debug('product code', parsedPersonalDetailsData?.productCode);
      log.debug('parsedPersonalDetailsData', parsedPersonalDetailsData);
      log.debug('PRODUCT ARRAY', this.ProductDescriptionArray);
      if (this.ProductDescriptionArray) {
        const filteredProductCode = parsedPersonalDetailsData.productCode;
        const filteredProduct = this.ProductDescriptionArray.find(
          (product) => product.code === filteredProductCode
        );
        log.debug('Filtered Product', filteredProduct);
        this.parsedProductDesc = filteredProduct?.description;
        log.debug('Filtered Product description', this.parsedProductDesc);
        this.selectedProductCode = filteredProductCode;
        // if(this.selectedProductCode){
        //   this.getCoverToDate()
        // }
        this.getProductSubclass(this.selectedProductCode);
        // this.loadAllSubclass()

        // Load the dynamic form fields based on the selected product
        this.LoadAllFormFields(this.selectedProductCode);
        this.getProductExpiryPeriod();
        /**SUBCLASS */
        const filteredsubclassCode = parsedPersonalDetailsData.subclassCode;
        const filteredSubclassCodeNumber = parseInt(filteredsubclassCode);
        log.debug('Filtere subclass code:', filteredsubclassCode);
        log.debug('Filtere subclass code Number:', filteredSubclassCodeNumber);
        log.debug(
          'Type of filteredSubclassCodeNumber:',
          typeof filteredSubclassCodeNumber
        );
        log.debug('subclasses', this.allMatchingSubclasses);
        setTimeout(() => {
          log.debug('Subclasses after delay:', this.allMatchingSubclasses);
          const filteredSubclass = this.allMatchingSubclasses.find(
            (subclass) => subclass.code === filteredSubclassCodeNumber
          );
          log.debug('Filtered Subclass', filteredSubclass);
          this.parsedSubclassDesc = filteredSubclass.description;
          log.debug('Filtered Subclass description', this.parsedSubclassDesc);
          this.loadCovertypeBySubclassCode(filteredSubclassCodeNumber);
          // this.loadSubclassSectionCovertype(filteredSubclassCodeNumber)
          this.selectedSubclassCode = filteredsubclassCode;
          log.debug('selectedSubclassCode above', this.selectedSubclassCode);
          this.fetchTaxes();
        }, 1000);

        /** BINDER */
        this.loadAllBinders(filteredSubclassCodeNumber);
        const filteredBinderCode = parsedPersonalDetailsData.bindCode;
        const filteredBinderCodeNumber = parseInt(filteredBinderCode);
        log.debug('Filtered Binder Code', filteredBinderCode);
        setTimeout(() => {
          log.debug('Binder List', this.binderListDetails);
          const filteredBinder = this.binderListDetails.find(
            (binder) => binder.code === filteredBinderCodeNumber
          );
          log.debug('Filtered Binder', filteredBinder);
          this.parsedBinderDesc = filteredBinder.binder_name;
          log.debug('Filtered Binder description', this.parsedBinderDesc);
          const currencyCode = filteredBinder.currency_code;
          this.loadAllCurrencies();

          this.selectedBinderCode = filteredBinderCode;
          this.selectedBinder = filteredBinder;
        }, 1000);
        setTimeout(() => {
          log.info(this.currencyList, 'this is a currency list');

          log.debug('Selected Currency:', this.selectedCurrency);
        }, 1000);
        this.loadSubclassSectionCovertype(filteredSubclassCodeNumber)
          .then(() => {
            // Now execute this code after loadSubclassSectionCovertype finishes
            setTimeout(() => {
              log.debug('Selected Product Code:', this.selectedProductCode);
              log.debug('Selected Subclass:', this.selectedSubclassCode);
              log.debug('Selected Binder:', this.selectedBinderCode);

              if (
                this.selectedBinderCode &&
                this.selectedSubclassCode &&
                this.selectedProductCode
              ) {
                // this.getCoverToDate();
                const selctedDate = JSON.parse(
                  sessionStorage.getItem('selectedDate')
                );
                log.debug(
                  'NOW CHECK WHICH DATE WILL BE DISPLAYED before the formatting',
                  selctedDate
                );

                const selectedDate = new Date(selctedDate);

                // Extract the day, month, and year
                const day = selectedDate.getDate();
                const month = selectedDate.toLocaleString('default', {
                  month: 'long',
                }); // 'long' gives the full month name
                const year = selectedDate.getFullYear();

                // Format the date in 'dd-Month-yyyy' format
                const formattedDate = `${day}-${month}-${year}`;

                this.coverFrom = formattedDate;
                log.debug(
                  'NOW CHECK WHICH DATE WILL BE DISPLAYED',
                  this.coverFrom
                );
              }
            }, 1000);
          })
          .catch((error) => {
            log.error('Error in loading subclass section cover type:', error);
          });
      }
    }

    const storedClientDetailsString = sessionStorage.getItem('clientDetails');
    this.passedExistingClientDetails = JSON.parse(storedClientDetailsString);
    log.debug('Client details', this.passedExistingClientDetails);
  }

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

    this.productService
      .getAllProducts()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.productList = data;
        log.info(this.productList, 'this is a product list');
        this.productList.forEach((product) => {
          productDescription.push({
            code: product.code,
            description: this.capitalizeWord(product.description),
          });
        });
        this.ProductDescriptionArray.push(...productDescription);
        // Now 'combinedWords' contains the result with words instead of individual characters
        log.info('modified product description', this.ProductDescriptionArray);
        if (this.storedData) {
          this.quickQuoteForm.patchValue({
            product: this.ProductDescriptionArray.find(
              (value: { code: any }) =>
                value.code === this.storedData.product.code
            ),
          });
        }
      });
  }

  // Method to check and set fields disable state from session storage
  checkFieldsDisableState() {
    const disableState = sessionStorage.getItem('fieldsDisableState');
    this.isFieldsDisabled = disableState === 'true';
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
  toggleExistingClient() {
    this.newClient = false;
    this.existingClientSelected = true;
    this.quickQuoteForm?.get('emailAddress').disable();
    this.quickQuoteForm?.get('phoneNumber').disable();
    this.quickQuoteForm?.get('clientName').setValidators(Validators.required);
    if (this.quickQuoteForm) {
      this.quickQuoteForm.updateValueAndValidity();
    }
    if (this.storedData) {
      this.quickQuoteForm.patchValue({
        clientName: this.storedData.clientName,
        emailAddress: this.storedData.clientEmail,
        phoneNumber: this.storedData.clientPhoneNumber,
      });
    }
  }

  toggleToNewClient() {
    this.newClient = true;
    this.existingClientSelected = false;
    this.quickQuoteForm?.get('emailAddress').enable();
    this.quickQuoteForm?.get('phoneNumber').enable();
    this.quickQuoteForm?.get('clientName').setValue('');
    this.quickQuoteForm?.get('emailAddress').setValue('');
    this.quickQuoteForm?.get('phoneNumber').setValue('');
    this.quickQuoteForm?.get('clientName').clearValidators();
    if (this.quickQuoteForm) {
      this.quickQuoteForm.updateValueAndValidity();
    }
    this.clientDetails = null;
  }

  /**
   * Toggles the 'new' state to false and resets client-related data.
   * This method is commonly used to switch from a 'new' client state to a default state and clear client input fields.
   * @method toggleNewClient
   * @return {void}
   */

  toggleNewClient() {
    if (!this.isFieldDisabled('radio')) {
      this.newClient = false;
      this.isNewClient = true;
      this.readonlyClient = false;
      this.checkFieldsDisableState();
      this.resetClientData();
      sessionStorage.removeItem('clientDetails');
    }
  }

  // Helper method to determine if email field should be disabled
  isFieldDisabled(fieldType: 'email' | 'other' | 'radio'): boolean {
    if (this.isFieldsDisabled) {
      // When fieldsDisableState is true, disable all fields
      return true;
    } else {
      // When fieldsDisableState is false, handle specific field types
      switch (fieldType) {
        case 'email':
          return !this.isNewClient; // Disable email for existing client
        case 'radio':
          return this.readonlyClient || this.isFieldsDisabled; // Disable radio when readonly or fields are disabled
        default:
          return false; // Don't disable other fields
      }
    }
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
    this.user = this.authService.getCurrentUserName();
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails?.branchId;
    log.debug('User Branch Id', this.userBranchId);
    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);
    // Get today's date in yyyy-MM-dd format
    const today = new Date();
    log.debug('today date raaaw', today);
    // Format today's date to the format specified in myFormat
    // this.coverFromDate = this.datePipe.transform(today, this.dateFormat);
    this.coverFromDate = today;
    log.debug(' Date format', this.dateFormat);

    const todaysDate = new Date(today);
    this.selectedEffectiveDate = todaysDate;
    log.debug(' todays date before being formatted', todaysDate);

    // Extract the day, month, and year
    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = todaysDate.getFullYear();

    // Format the date in 'dd-Month-yyyy' format
    const formattedDate = `${day}-${month}-${year}`;

    this.todaysDate = formattedDate;
    log.debug('Todays  Date', this.todaysDate);
    log.debug('Cover from  Date(current date)', this.coverFromDate);

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
    log.debug('Organization currency delimeter', this.currencyDelimiter);
    sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);

    this.fetchBranches();
  }

  onZipCodeSelected(event: any) {
    this.selectedZipCode = event.target.value;
    log.debug('Selected Zip Code:', this.selectedZipCode);
  }

  // onInputChange() {
  //   log.debug('Method called');
  //   this.newClientData.inputClientZipCode = this.newClientPhone?.dialCode;
  //   this.newClientData.inputClientPhone = this.newClientPhone?.number
  //   // this.newClientData.inputClientPhone = this.newClientPhone
  //   log.debug('New User Data', this.newClientData);
  //   const newClientDetailsString = JSON.stringify(this.newClientData);
  //   sessionStorage.setItem('newClientDetails', newClientDetailsString);
  // }

  /**
   * Retrieves branch information by making an HTTP GET request to the BranchService.
   * - Populates the 'branchList' property with the received data.
   * - Logs the retrieved branch list for debugging purposes.
   * @method getBranch
   * @return {void}
   */
  fetchBranches(organizationId?: number, regionId?: number) {
    const branchDescription = [];
    this.branchService
      .getAllBranches(organizationId, regionId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchList = data;
        log.info('Fetched Branches', this.branchList);
        const branch = this.branchList.filter(
          (branch) => branch.id == this.userBranchId
        );
        log.debug('branch', branch);
        this.selectedBranchCode = this.branchList[0].id;
        this.userBranchName = branch[0]?.name;
        this.branchList.forEach((branch) => {
          // Access each product inside the callback function
          let capitalizedDescription =
            branch.name.charAt(0).toUpperCase() +
            branch.name.slice(1).toLowerCase();
          branchDescription.push({
            code: branch.id,
            description: capitalizedDescription,
          });
        });

        // Combine the characters back into words
        const combinedWords = branchDescription.join(',');
        this.branchDescriptionArray.push(...branchDescription);

        // Now 'combinedWords' contains the result with words instead of individual characters
        log.info('modified Branch description', this.branchDescriptionArray);
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
    this.clientService.getClients(0, 100).subscribe((data) => {
      this.clientList = data;
      log.debug('CLIENT DATA:', this.clientList);
      this.clientData = this.clientList.content;
      log.debug('CLIENT DATA:', this.clientData);
    });
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
    this.countryService.getCountries().subscribe((data) => {
      this.countryList = data;
      log.debug('Country List', this.countryList);
      if (this.selectedCountry) {
        this.filteredCountry = this.countryList.filter(
          (prefix) => prefix.id == this.selectedCountry
        );
        log.debug('Filtered Country', this.filteredCountry);

        if (this.filteredCountry) {
          this.mobilePrefix = this.filteredCountry[0].zipCodeString;
          log.debug('Filtered mobilePrefix', this.mobilePrefix);
        }
      }
    });
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
      bindCode: [''],
      branchCode: [''],
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
      source: [''],
      withEffectiveFromDate: ['', Validators.required],
      withEffectiveToDate: [''],
      multiUser: [''],
      comments: [''],
      internalComments: [''],
      introducerCode: [''],
      subclassCode: ['', Validators.required],
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
  loadClientDetails(client: ClientDTO) {
    this.clientDetails = client;
    this.clientType = this.clientDetails.clientType.clientTypeName;
    this.selectedCountry = this.clientDetails.country;
    //sessionStorage.setItem('clientDetails', JSON.stringify(this.clientDetails));
    // this.getCountries();
    this.saveclient();

    let fullName = this.utilService.getFullName(this.clientDetails);
    log.debug('Selected Client fullname::::', this.clientDetails, fullName);
    this.quickQuoteForm.get('clientName').setValue(fullName);
    this.quickQuoteForm
      .get('emailAddress')
      .setValue(this.clientDetails.emailAddress);
    this.quickQuoteForm
      .get('phoneNumber')
      .setValue(this.clientDetails.mobileNumber);
    this.closebutton.nativeElement.click();
  }

  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName = this.utilService.getFullName(this.clientDetails);
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
    log.debug('Selected Product Code:', this.selectedProductCode);
    const defaultCurrency = this.currencyList?.find(
      (currency) => currency.currencyDefault === 'Y'
    );
    log.debug('Default currency here', defaultCurrency);
    this.quickQuoteForm.get('currency').setValue(defaultCurrency);
    this.quickQuoteForm.get('effectiveDate').setValue(new Date());
    this.setCurrencySymbol(defaultCurrency.symbol);

    this.getProductSubclass(this.selectedProductCode);
    this.loadAllSubclass();

    // Load the dynamic form fields based on the selected product
    this.LoadAllFormFields(this.selectedProductCode);
    this.getProductExpiryPeriod();
    this.getCoverToDate();
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
    log.debug(
      'Selected Product Code-coverdate method',
      this.selectedProductCode
    );
    log.debug('Selected Covercoverdate method', this.coverFromDate);
    log.debug('selected Effective date', this.selectedEffectiveDate);
    if (this.coverFromDate) {
      let date: Date;

      // Check if the value is already a Date or a string
      if (typeof this.coverFromDate === 'string') {
        // Parse the string to a Date object
        date = new Date(this.coverFromDate);
        log.debug('Was a string object', date);
        log.debug('Was a string object', this.coverFromDate);
      } else {
        date = this.coverFromDate; // It's already a Date object
        const stringRepresentation = JSON.stringify(date);
        log.debug('Was a date object', date);
      }

      const formattedCoverFromDate = this.formatDate(date);
      log.debug('FORMATTED DATE:', formattedCoverFromDate);

      if (this.selectedEffectiveDate) {
        const SelectedFormatedDate = this.formatDate(
          this.selectedEffectiveDate
        );
        log.debug(' SELECTED FORMATTED DATE:', SelectedFormatedDate);

        this.effectiveFromDate = SelectedFormatedDate;
        log.debug('effective date from selected date:', this.effectiveFromDate);

        // this.coverFrom = SelectedFormatedDate
        // log.debug("COVER FROM selected date", this.coverFrom)
      } else {
        this.effectiveFromDate = formattedCoverFromDate;
        log.debug('effective date from todays date:', this.effectiveFromDate);
        // this.coverFrom = formattedCoverFromDate
        // log.debug("COVER FROM todays date", this.coverFrom)
      }
      log.debug(
        'selected Effective date raw format',
        this.selectedEffectiveDate
      );
      const selectedDateString = JSON.stringify(this.effectiveFromDate);
      sessionStorage.setItem('selectedDate', selectedDateString);

      this.productService
        .getCoverToDate(this.effectiveFromDate, this.selectedProductCode)
        .subscribe((data) => {
          log.debug('DATA FROM COVERFROM:', data);
          const dataDate = data;
          this.passedCoverToDate = dataDate._embedded[0].coverToDate;
          log.debug('cover date:', this.passedCoverToDate);
          const passedCoverTo = new Date(this.passedCoverToDate);

          // Extract the day, month, and year
          const day = passedCoverTo.getDate();
          const month = passedCoverTo.toLocaleString('default', {
            month: 'long',
          }); // 'long' gives the full month name
          const year = passedCoverTo.getFullYear();

          // Format the date in 'dd-Month-yyyy' format
          const formattedDate = `${day}-${month}-${year}`;

          this.formattedCoverToDate = formattedDate;
          log.debug('formatted cover to  Date', this.formattedCoverToDate);

          // this.coverFrom =this.effectiveFromDate
          log.debug('DATe FROM DATA:', this.passedCoverToDate);
          this.selectedCoverToDate = this.passedCoverToDate;
          // this.getPremiumRates(); //TODO confirm this
        });
    }
  }

  formatDate(date: Date): string {
    log.debug('Date (formatDate method):', date);
    const year = date?.getFullYear();
    const month = String(date?.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date?.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getProductExpiryPeriod() {
    log.debug('SELECTED PRODUCTC CODE', this.selectedProductCode);
    if (!this.selectedProductCode || !this.productList) {
      this.expiryPeriod = 'N';
      return;
    }

    this.selectedProduct = this.productList.filter(
      (product) => product.code === this.selectedProductCode
    );

    if (this.selectedProduct.length > 0) {
      this.expiryPeriod = this.selectedProduct[0].expires;
    } else {
      this.expiryPeriod = 'N';
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
    this.allMatchingSubclasses = [];
    this.productService
      .getProductSubclasses(code)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.subClassList = data._embedded.product_subclass_dto_list;
        log.debug(this.subClassList, 'Product Subclass List');

        this.subClassList.forEach((element) => {
          const matchingSubclasses = this.allSubclassList
            .filter((subCode) => subCode.code === element.sub_class_code)
            .map((value) => {
              //let capitalizedDescription = value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase();
              return {
                ...value,
                description: this.capitalizeWord(value.description),
              };
            });
          this.allMatchingSubclasses.push(...matchingSubclasses);
          if (this.storedData && this.quoteAction === 'E') {
            this.quickQuoteForm.patchValue({
              subClass: this.allMatchingSubclasses.find(
                (value) => value.code === this.storedData.subClass.code
              ),
            });
          }
        });
        log.debug('Retrieved Subclasses by code', this.allMatchingSubclasses);
        //  this.cdr.detectChanges();
      });
  }

  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  /**
   * Loads all product subclasses from SubclassService.
   * - Subscribes to 'getAllSubclasses' observable and updates 'allSubclassList'.
   * - Logs all product subclasses for debugging and triggers change detection.
   * @method loadAllSubclass
   * @return {void}
   */
  loadAllSubclass() {
    return this.subclassService
      .getAllSubclasses()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.allSubclassList = data;
        log.debug(this.allSubclassList, 'All Subclass List');
      });
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
    log.debug(`Selected value: ${JSON.stringify(event)}`);
    this.selectedSubclassCode = event.code;
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code');
    const selectedSubclassCodeString = JSON.stringify(
      this.selectedSubclassCode
    );
    this.fetchComputationData(
      this.selectedProductCode,
      this.selectedSubclassCode
    );
    // this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    // this.loadAllBinders(this.selectedSubclassCode);
    // this.loadSubclassSectionCovertype(this.selectedSubclassCode);
    //  sessionStorage.setItem('selectedSubclassCode', selectedSubclassCodeString);
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code');
    sessionStorage.setItem('selectedSubclassCode', selectedSubclassCodeString);
    //   this.getPremiumRates()
    this.fetchRegexPattern();
    // this.fetchTaxes();
  }

  onDateInputChange(date: any) {
    log.debug('selected Effective date raaaaaw', date);
    this.selectedEffectiveDate = date;
    this.getCoverToDate();
    log.debug('selected Effective date', this.selectedEffectiveDate);
  }

  /**
   * Loads binders for the selected subclass.
   * - Subscribes to 'getAllBindersQuick' from BinderService.
   * - Populates 'binderListDetails' and triggers change detection.
   * @method loadAllBinders
   * @return {void}
   */
  loadAllBinders(code: number) {
    this.binderService
      .getAllBindersQuick(code)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.binderList = data;
        this.binderListDetails = this.binderList._embedded.binder_dto_list;
        log.debug('All Binders Details:', this.binderListDetails);
        if (this.binderListDetails && this.binderListDetails.length > 0) {
          this.selectedBinder = this.binderListDetails.find(
            (value) => value?.is_default === 'Y'
          ); // Set the first binder as the selected one
          log.debug('Selected Binder:', this.selectedBinder);
          this.selectedBinderCode = this.selectedBinder.code;
          this.currencyCode = this.selectedBinder.currency_code;
          log.debug('Selected Currency Code:', this.currencyCode);
        } else {
          console.error('Binder list is empty or undefined');
        }
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
    const bind = this.binderListDetails.filter(
      (bind) => bind.code == this.selectedBinderCode
    );
    this.currencyCode = bind[0].currency_code;
    if (bind != null && bind.length > 0) {
      this.selectedBinder = bind[0];
    }

    log.debug('Selected Binder:', this.selectedBinder);
    log.debug('Selected Currency Code:', this.currencyCode);
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
    this.currencyService
      .getAllCurrencies()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.currencyList = data.map((value) => {
          let capitalizedDescription =
            value.name.charAt(0).toUpperCase() +
            value.name.slice(1).toLowerCase();
          return {
            ...value,
            name: capitalizedDescription,
          };
        });
        log.info(this.currencyList, 'this is a currency list');
        const defaultCurrency = this.currencyList.find(
          (currency) => currency.currencyDefault == 'Y'
        );
        if (defaultCurrency) {
          log.debug('DEFAULT CURRENCY', defaultCurrency);
          this.defaultCurrencyName = defaultCurrency.name;
          log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
          this.defaultCurrencySymbol = defaultCurrency.symbol;
          log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
        }
        if (this.storedData) {
          this.quickQuoteForm.patchValue({
            currency: this.currencyList.find(
              (value: { id: any }) => value.id === this.storedData.currency.id
            ),
          });
          this.setCurrencySymbol(this.defaultCurrencySymbol);
        }
      });
  }

  onCurrencySelected(selectedValue: any) {
    this.selectedCurrencyCode = selectedValue.id;
    log.debug(
      'Selecetd currency from the dropdown:',
      this.selectedCurrencyCode
    );
    const selectedCurrency = this.currencyList.find(
      (currency) => currency.id == this.selectedCurrencyCode
    );
    log.debug('Selected Currency', selectedCurrency);
    this.setCurrencySymbol(selectedCurrency.symbol);
  }

  setCurrencySymbol(currencySymbol: string) {
    this.selectedCurrencySymbol = currencySymbol + ' ';
    this.currencyObj = {
      prefix: this.selectedCurrencySymbol,
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: this.currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };
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
    this.subclassCoverTypesService
      .getSubclassCovertypeBySCode(code)
      .subscribe((data) => {
        this.subclassCoverType = data;
        log.debug('Subclass Covertype', this.subclassCoverType);

        this.coverTypeCode = this.subclassCoverType[0].coverTypeCode;
        this.coverTypeDesc =
          this.subclassCoverType[0].coverTypeShortDescription;

        // log.debug(this.subclassCoverType,'filtered covertype');
        // log.debug(this.coverTypeCode,'filtered covertype code');
        log.debug(this.coverTypeDesc, 'filtered covertype Desc');

        //  this.cdr.detectChanges();
      });
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
    this.quotationService.getAllQuotationSources().subscribe((data) => {
      this.sourceList = data;
      this.sourceDetail = data.content;
      log.debug(this.sourceDetail, 'Source list');
    });
  }

  onSourceSelected(event: any) {
    this.selectedSourceCode = event.target.value;
    log.debug('Selected Source Code:', this.selectedSourceCode);
    this.selectedSource = this.sourceDetail.filter(
      (source) => source.code == this.selectedSourceCode
    );
    log.debug('Selected Source :', this.selectedSource);
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
      const formFieldDescription = 'product-quick-quote-'.concat(
        selectedProductCode.toString()
      );
      this.quotationService
        .getFormFields(formFieldDescription)
        .subscribe((data) => {
          this.formData = [];
          this.formContent = data;
          log.debug(this.formContent, 'Form-content'); // Debugging: Check the received data
          this.formData = this.formContent[0]?.fields;
          log.debug(this.formData, 'formData is defined here');
          Object.keys(this.quickQuoteForm.controls).forEach((controlName) => {
            const control = this.quickQuoteForm.get(controlName) as any;
            if (control?.metadata?.dynamic) {
              this.quickQuoteForm.removeControl(controlName);
              log.debug(`Removed dynamic control: ${controlName}`);
            }
          });
          this.formData.forEach((field) => {
            const validators = [];
            if (field.isMandatory === 'Y') {
              validators.push(Validators.required);
            }
            if (field.regexPattern) {
              validators.push(Validators.pattern(field.regexPattern));
            }
            log.debug(`Validators about to be added ${field.name}`, validators);
            this.quickQuoteForm.addControl(
              field.name,
              new FormControl(
                this.storedData &&
                this.storedData[field.name] &&
                this.quoteAction == 'E'
                  ? this.storedData[field.name]
                  : '',
                validators
              )
            );
            (this.quickQuoteForm.get(field.name) as any).metadata = {
              dynamic: true,
            };
          });
        });
      Object.keys(this.quickQuoteForm.controls).forEach((controlName) => {
        const control = this.quickQuoteForm.get(controlName);
        log.debug(
          `Control: ${controlName}, Value: ${
            control?.value
          }, Validators: ${this.getValidatorNames(control)}`
        );
      });
    }
  }

  getValidatorNames(control: AbstractControl | null): string[] {
    if (!control || !control.validator) return [];
    const validatorFns = control.validator({} as AbstractControl);
    return Object.keys(validatorFns || {});
  }

  editingRisk(): boolean {
    return this.storedData && this.quoteAction === 'E';
  }

  updateCarRegNoValue(event: Event) {
    const input = event.target as HTMLInputElement; // Type assertion to HTMLInputElement
    this.carRegNoValue = input.value; // Set the value directly
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
    const control = this.quickQuoteForm.get('carRegNo');
    if (!control) return;
    // this.existingPropertyIds = ['WER 324R']
    if (this.existingPropertyIds) {
      const value = control.value.replace(/\s+/g, '').toUpperCase();
      log.debug('Doing validation of ', value, this.existingPropertyIds);
      const isDuplicate = this.existingPropertyIds.some(
        (existingValue) =>
          existingValue.replace(/\s+/g, '').toUpperCase() === value
      );
      if (isDuplicate) {
        control.addValidators([this.uniqueValidator]);
      } else {
        control.removeValidators([this.uniqueValidator]); // Remove uniqueness validator if not needed
      }
      control.updateValueAndValidity({ emitEvent: false }); // Prevent infinite loop
    }
  }

  uniqueValidator(control: AbstractControl) {
    return { unique: true };
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

  loadSubclassSectionCovertype(code: number): Promise<void> {
    return firstValueFrom(
      this.subclassSectionCovertypeService.getSubclassCovertypeSections()
    ).then((data) => {
      this.subclassSectionCoverList = data;
      log.debug('Subclass Section Covertype:', this.subclassSectionCoverList);
      this.mandatorySections = this.subclassSectionCoverList.filter(
        (section) => section.subClassCode == code && section.isMandatory == 'Y'
      );
      log.debug('Mandatory Section Covertype:', this.mandatorySections);
      const notMandatorySections = this.subclassSectionCoverList.filter(
        (section) => section.subClassCode == code && section.isMandatory == null
      );
      log.debug('NOT MANDATORY', notMandatorySections);

      if (this.mandatorySections?.length > 0) {
        this.selectedSectionList = this.mandatorySections[0];
        log.debug('Selected Section', this.selectedSectionList);
      }

      const mandatorySectionsString = JSON.stringify(this.mandatorySections);
      sessionStorage.setItem('mandatorySections', mandatorySectionsString);
      this.getSectionByCode();
    });
  }

  getSectionByCode() {
    this.sectionService
      .getSectionByCode(this.selectedSectionList?.sectionCode)
      .subscribe((data) => {
        this.section = data;
        log.debug('Section', this.section);
      });
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
    return this.productService.getYearOfManufacture().subscribe((data) => {
      log.debug('Data YOM', data._embedded[0]['List of cover years']);
      this.years = data._embedded[0]['List of cover years'];
    });
  }

  /***********************NEW PREMIUM COMPUTATION*******************************/
  getPremiumRates() {
    log.debug('MANDA SEC', this.mandatorySections);
    for (let i = 0; i < this.mandatorySections.length; i++) {
      this.selectedSectionList = this.mandatorySections[i];
      log.debug('SELECTED SECTIONS', this.selectedSectionList);
      const selectedSectionCode = this.selectedSectionList.sectionCode;
      this.premiumRateService
        .getAllPremiums(
          selectedSectionCode,
          this.selectedBinderCode,
          this.selectedSubclassCode
        )
        .pipe(untilDestroyed(this))
        .subscribe((data) => {
          this.premiumList = data;
          log.debug('premium rates data>>> ', data);
          this.allPremiumRate.push(...this.premiumList);
          log.debug('premium List', this.premiumList);

          // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
        });
      log.debug('all quick quote premium List', this.allPremiumRate);
    }
  }

  setRiskPremiumDto(): Risk[] {
    log.debug("All available premium items>>>", this.applicablePremiumRates)
    log.debug("subclass cover type", this.subclassCoverType)
    log.debug("Car Reg no:", this.carRegNoValue)

    const propertyId = this.quickQuoteForm.get('riskId')?.value;
    this.carRegNoValue = this.quickQuoteForm.get('carRegNo')?.value;
    const subClassCode = +this.quickQuoteForm.get('subClass')?.value.code;
    const value = this.quickQuoteForm.get('value')?.value;
    log.debug("Value", value)
    const sumInsured = this.quickQuoteForm.get('selfDeclaredValue')?.value;
    const finalValue = value ?? sumInsured;
    log.debug("Final Value", finalValue);
    sessionStorage.setItem('sumInsuredValue', finalValue);
    log.debug("Risk Id:", propertyId)
    let risks: Risk[] = []
    for (let coverType of this.applicablePremiumRates) {
      const applicableLimits = coverType.applicableRates.map(rate => {
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
            code: rate.sectionCode
          },
          sectionType: rate.sectionType,
          riskCode: null,
          limitAmount: sumInsured || value,
          compute: "Y",
          dualBasis: "N"
        }
      })

      let risk: Risk = {
        propertyId: this.carRegNoValue || propertyId,
        withEffectFrom: this.effectiveFromDate,
        withEffectTo: this.passedCoverToDate,
        prorata: 'F',
        subclassSection: {
          code: this.selectedSubclassCode,
        },
        itemDescription: this.carRegNoValue || propertyId,
        noClaimDiscountLevel: 0,
        subclassCoverTypeDto: {
          subclassCode: this.selectedSubclassCode,
          coverTypeCode: coverType.coverTypeCode,
          minimumAnnualPremium: 0,
          minimumPremium: parseInt(coverType.minimumPremium, 10),
          coverTypeShortDescription: coverType.coverTypeShortDescription,
          coverTypeDescription: coverType.description
        },
        enforceCovertypeMinimumPremium: 'N',
        binderDto: {
          code: this.selectedBinderCode,
          currencyCode: this.currencyCode,
          maxExposure: this.selectedBinder?.maximum_exposure,
          currencyRate: 1.25 /**TODO: Fetch from API */,
        },
        limits: applicableLimits,
      };
      risks.push(risk)
    }
    return risks
  }

  setLimitPremiumDto(coverTypeCode: number): Limit[] {
    log.debug("Current form structure:", this.quickQuoteForm.controls);

    const value = this.quickQuoteForm.get('value')?.value;
    log.debug("Value", value)
    const sumInsured = this.quickQuoteForm.get('selfDeclaredValue')?.value;
    log.debug('SUM INSURED', sumInsured);

    const finalValue = value ?? sumInsured;
    log.debug('Final Value', finalValue);
    sessionStorage.setItem('sumInsuredValue', finalValue);

    const coverTypeSections = this.mandatorySections.filter(
      (value) => value.coverTypeCode === coverTypeCode
    );
    log.debug(
      'Mandatory Sections for covertype',
      coverTypeCode,
      coverTypeSections
    );
    let limitItems = [];
    let sectionCodes = [];
    log.debug('Found cover type sections ', coverTypeSections);
    log.debug('Premium rates ', this.allPremiumRate);
    let response: Limit[] = coverTypeSections
      .map((it) =>
        this.allPremiumRate
          .filter((rate) => {
            log.debug(
              'In limit: ' + rate.sectionCode + ' vs ' + it.sectionCode
            );
            return rate.sectionCode == it.sectionCode;
          })
          .map((rate) => {
            return {
              calculationGroup: 1,
              declarationSection: 'N',
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
                code: it.sectionCode,
              },
              sectionType: rate.sectionType,
              riskCode: null,
              limitAmount: sumInsured || value,
              compute: 'Y',
              dualBasis: 'N',
            };
          })
      )
      .flatMap((item) => item);
    log.debug('Added Limit', this.additionalLimit);

    if (this.additionalLimit.length > 0) {
      log.debug('Added Limit', this.additionalLimit);
      // Adjust the existing response to include the additional risk
      this.additionalLimit.forEach((item) => coverTypeSections.push(item));
      log.debug('section for CoverType:', coverTypeSections);
      response = response.concat(
        coverTypeSections
          .map((it) =>
            this.allPremiumRate
              .filter((rate) => {
                log.debug(
                  'In limit: ' + rate.sectionCode + ' vs ' + it.sectionCode
                );
                return rate.sectionCode == it.sectionCode;
              })
              .map((rate) => {
                return {
                  calculationGroup: 2, // Adjust the calculationGroup for the additional risk
                  declarationSection: 'N',
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
                    code: it.sectionCode,
                  },
                  sectionType: rate.sectionType,
                  riskCode: null,
                  limitAmount: sumInsured || value,
                  compute: 'Y',
                  dualBasis: 'N',
                };
              })
          )
          .flatMap((item) => item)
      );
    }

    log.debug('Covertype', coverTypeCode);
    log.debug('Section items', coverTypeSections);
    log.debug('limit items', response);
    return response;
  }

  fetchComputationData(productCode: number, subClassCode: number
  ) {
    this.binderService.getAllBindersQuick(subClassCode).pipe(
      mergeMap((binders) => {
        this.binderList = binders._embedded.binder_dto_list;
        this.selectedBinder = this.binderList.find((value: { is_default: string; }) => value?.is_default === 'Y');
        this.selectedBinderCode = this.selectedBinder?.code;
        log.debug("Testing fetching taxes", this.selectedBinderCode)
        return forkJoin([
          this.quotationService.getTaxes(productCode, subClassCode),
          this.subclassCoverTypesService.getCoverTypeSections(subClassCode, this.selectedBinderCode)
        ])
      })
    ).subscribe(([taxes, coverTypeSections]) => {
      this.taxList = taxes._embedded
      this.applicablePremiumRates = coverTypeSections._embedded
      log.debug("Taxes:::", taxes, this.applicablePremiumRates)
    })
  }

  computePremiumV2() {
    log.info('Submitted form {}', this.quickQuoteForm);
    if (!this.isEmailOrPhoneValid()) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Provide either a valid phone number or email to proceed.'
      );
      return;
    }
    if (this.quickQuoteForm.valid) {
      this.ngxSpinner.show();

      log.debug('Form is valid, proceeding with premium computation...');
      sessionStorage.setItem('product', this.selectedProductCode);
      const quickQuoteDataModel = this.quickQuoteForm.getRawValue();
      log.debug(
        'Mandatory sections: ',
        this.subclassSectionCoverList,
        this.mandatorySections
      );
      log.debug('Subclass Cover Types', this.subclassCoverType);
      log.debug('Selected binder ', this.binderList, this.selectedBinder);
      this.currencyCode = quickQuoteDataModel.currency.id;
      const quickQuoteData: QuickQuoteData = {
        effectiveDateFrom: quickQuoteDataModel.effectiveDate,
        carRegNo: quickQuoteDataModel.carRegNo,
        yearOfManufacture: quickQuoteDataModel.yearOfManufacture,
        clientName: quickQuoteDataModel.clientName,
        clientEmail: quickQuoteDataModel.emailAddress,
        product: quickQuoteDataModel.product,
        subClass: quickQuoteDataModel.subClass,
        currency: quickQuoteDataModel.currency,
        selfDeclaredValue: quickQuoteDataModel.selfDeclaredValue,
        clientPhoneNumber: quickQuoteDataModel.phoneNumber?.number,
        coverTo: quickQuoteDataModel?.coverTo,
        riskId: quickQuoteDataModel?.riskId,
        value: quickQuoteDataModel?.value,
        modeOfTransport: quickQuoteDataModel?.modeOfTransport,
        existingClientSelected: this.existingClientSelected,
        selectedClient: this.clientDetails ? this.clientDetails : null
      }

      sessionStorage.setItem('quickQuoteData', JSON.stringify(quickQuoteData))
      this.mandatorySections = this.applicablePremiumRates.map(value => value.applicableRates)
      sessionStorage.setItem('mandatorySections', JSON.stringify(this.mandatorySections));
      this.premiumComputationRequest = {
        dateWithEffectFrom: this.effectiveFromDate,
        dateWithEffectTo: this.passedCoverToDate,
        underwritingYear: new Date().getFullYear(),
        age: null,
        coinsuranceLeader: null,
        coinsurancePercentage: null,
        entityUniqueCode: null,
        interfaceType: null,
        frequencyOfPayment: "A",
        quotationStatus: "Draft",
        transactionStatus: "NB",
        /**Setting Product Details**/
        product: {
          code: this.selectedProductCode,
          expiryPeriod: this.expiryPeriod,
        },
        /**Setting Tax Details**/
        taxes: this.setTax(),

        currency: {
          rate: 1.25 /**TODO: Fetch from API */,
        },
        risks: this.setRiskPremiumDto(),
      };
      sessionStorage.setItem(
        'premiumComputationRequest',
        JSON.stringify(this.premiumComputationRequest)
      );
      log.debug("Aggregated payload", this.premiumComputationRequest)
      // return
      this.quotationService
        .premiumComputationEngine(this.premiumComputationRequest)
        .subscribe({
          next: (data) => {
            log.debug('Data', data);
            const premiumResponseString = JSON.stringify(data);
            sessionStorage.setItem('premiumResponse', premiumResponseString);
            this.router.navigate(['/home/gis/quotation/cover-type-details']);
          },
          error: (error: HttpErrorResponse) => {
            log.info(error);
            this.ngxSpinner.hide();

            this.globalMessagingService.displayErrorMessage(
              'Error',
              error.error.message
            );
          },
        });

    } else {
      // Mark all fields as touched and validate the form
      this.quickQuoteForm.markAllAsTouched();
      this.quickQuoteForm.updateValueAndValidity();
      for (let controlsKey in this.quickQuoteForm.controls) {
        if (this.quickQuoteForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.quickQuoteForm.get(controlsKey).errors
          );
        }
      }
    }
  }

  fetchRegexPattern() {
    this.quotationService
      .getRegexPatterns(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.regexPattern = response._embedded?.riskIdFormat;
          log.debug('New Regex Pattern', this.regexPattern);
          this.dynamicRegexPattern = this.regexPattern;
          this.quickQuoteForm
            ?.get('carRegNo')
            .addValidators(Validators.pattern(this.dynamicRegexPattern));
          this.quickQuoteForm?.get('carRegNo').updateValueAndValidity();
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch regex patterns. Try again later'
          );
        },
      });
  }

  isEmailOrPhoneValid(): boolean {
    if (
      this.quickQuoteForm.get('emailAddress').invalid &&
      this.quickQuoteForm.get('phoneNumber').invalid
    ) {
      return false;
    }
    const emailAddress = Boolean(this.quickQuoteForm.get('emailAddress').value);
    const phoneNumber = Boolean(this.quickQuoteForm.get('phoneNumber').value);
    log.debug('Email Address:', emailAddress, phoneNumber);
    return !(!emailAddress && !phoneNumber);
  }

  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();
    this.quickQuoteForm
      .get('carRegNo')
      ?.setValue(upperCaseValue, { emitEvent: false });
  }

  // onPhoneInputChange() {
  //   console.log('Client Phone:', this.clientPhone);

  //   console.log('New Client Phone:', this.newClientData.inputClientPhone);
  //   this.onInputChange();
  //   console.log('New input Client Phone:', this.newClientData.inputClientPhone);
  //   sessionStorage.setItem("newClientDetails", JSON.stringify(this.newClientData));
  // }

  /**
   * Fetches occupation data based on the provided organization ID and
   *  updates the component's occupationData property.
   * @param organizationId The organization ID used to retrieve occupation data.
   */
  getOccupation(organizationId: number) {
    this.occupationService
      .getOccupations(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.occupationData = response;
          log.debug('Occupation List', this.occupationData);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch occupation list. Try again later'
          );
        },
      });
  }

  /**
   * Handles the selection of occupation.
   * - Retrieves the selected occupation code from the event.
   *
   * @method onOccupationSelected
   * @param {any} event - The event triggered by occupation selection.
   * @return {void}
   */
  onOccupationSelected(selectedValue: any) {
    this.selectedoccupationCode = selectedValue.id;
    log.debug('Selected occupation Code:', this.selectedoccupationCode);
  }

  onCoverToChange(event: Date): void {
    const selectedCoverToDate = event;
    log.debug('selected cover to date', selectedCoverToDate);

    if (selectedCoverToDate) {
      const SelectedFormatedDate = this.formatDate(selectedCoverToDate);
      log.debug(' SELECTED FORMATTED DATE:', SelectedFormatedDate);

      this.selectedCoverToDate = SelectedFormatedDate;
      log.debug('Cover  to date  :', this.selectedCoverToDate);
    }
  }

  /**
   * Fetches vessel types data based on the provided organization ID and
   *  updates the component's vessel types property.
   * @param organizationId The organization ID used to retrieve vessel types.
   */
  getVesselTypes(organizationId: number) {
    this.vesselTypesService
      .getVesselTypes(organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.vesselTypeList = response;
          log.debug('Vessel type List', this.vesselTypeList);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch occupation list. Try again later'
          );
        },
      });
  }

  /**
   * Handles the selection of vessel type.
   * - Retrieves the selected vessel type code from the event.
   *
   * @method onVesselTypeSelected
   * @param {any} event - The event triggered by vessel type selection.
   * @return {void}
   */
  onVesselTypeSelected(selectedValue: any) {
    this.selectedVesselTypeCode = selectedValue.code;
    log.debug('Selected vessel type Code:', this.selectedVesselTypeCode);
  }

  // SEARCHING CLIENT USING KYC
  getClients(
    pageIndex: number,
    pageSize: number,
    sortField: any = 'createdDate',
    sortOrder: string = 'desc'
  ) {
    return this.clientService
      .getClients(pageIndex, pageSize, sortField, sortOrder)
      .pipe(untilDestroyed(this));
  }

  /**
   * The function "lazyLoadClients" is used to fetch clients data with pagination, sorting, and filtering options.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is used to determine the pagination, sorting, and filtering options for fetching clients.
   */
  lazyLoadClients(event: LazyLoadEvent | TableLazyLoadEvent) {
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;

    if (this.isSearching) {
      const searchEvent = {
        target: { value: this.searchTerm },
      };
      this.filter(searchEvent, pageIndex, pageSize);
    } else {
      this.getClients(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Clients>>>`, data))
        )
        .subscribe(
          (data: Pagination<ClientDTO>) => {
            data.content.forEach((client) => {
              client.clientTypeName = client.clientType.clientTypeName;
              client.clientFullName =
                client.firstName + ' ' + (client.lastName || ''); //the client.clientFullName will be set to just firstName,
              // as the null value for lastName is handled  using the logical OR (||) operator
            });
            this.clientsData = data;
            this.tableDetails.rows = this.clientsData?.content;
            this.tableDetails.totalElements = this.clientsData?.totalElements;
            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
          }
        );
    }
  }

  filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
    this.clientsData = null; // Initialize with an empty array or appropriate structure
    let columnName;
    let columnValue;
    if (this.emailValue) {
      columnName = 'emailAddress';
      columnValue = this.emailValue;
    } else if (this.phoneValue) {
      columnName = 'phoneNumber';
      columnValue = this.phoneValue;
    } else if (this.pinValue) {
      columnName = 'pinNumber';
      columnValue = this.pinValue;
    } else if (this.idValue) {
      columnName = 'id';
      columnValue = this.idValue;
    }

    this.isSearching = true;
    this.spinner.show();
    this.quotationService
      .searchClients(
        columnName,
        columnValue,
        pageIndex,
        pageSize,
        this.filterObject?.name,
        this.filterObject?.idNumber
      )
      .subscribe(
        (data) => {
          this.clientsData = data;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  inputName(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['name'] = value;
  }

  inputEmail(event) {
    const value = (event.target as HTMLInputElement).value;
    this.emailValue = value;
    // this.filterObject['emailAddress'] = value;
  }

  inputPhone(event) {
    const value = (event.target as HTMLInputElement).value;
    this.phoneValue = value;

    // this.filterObject['phoneNumber'] = value;
  }

  inputIdNumber(event) {
    const value = (event.target as HTMLInputElement).value;
    this.filterObject['idNumber'] = value;
  }

  inputPin(event) {
    const value = (event.target as HTMLInputElement).value;
    this.pinValue = value;

    // this.filterObject['pinNumber'] = value;
  }

  inputInternalId(event) {
    const value = (event.target as HTMLInputElement).value;
    this.idValue = value;

    // this.filterObject['id'] = value;
  }

  fetchTaxes() {
    this.quotationService
      .getTaxes(this.selectedProductCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.taxList = response._embedded;
          log.debug('Tax List ', this.taxList);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch taxes. Try again later'
          );
        },
      });
  }

  setTax(): Tax[] {
    log.debug('Tax List when setting the payload', this.taxList);

    // Map the tax list to the desired format
    const taxList: Tax[] = this.taxList.map((item) => {
      return {
        taxRate: String(item.taxRate), // Convert to string to match Tax interface
        code: String(item.code),
        taxCode: String(item.taxCode),
        divisionFactor: String(item.divisionFactor),
        applicationLevel: String(item.applicationLevel),
        taxRateType: String(item.taxRateType),
      };
    });

    log.debug('Tax List after mapping the payload', taxList);
    return taxList; // Explicitly returning the list
  }
}
