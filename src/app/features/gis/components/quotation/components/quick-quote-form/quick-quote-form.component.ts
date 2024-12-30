import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import stepData from '../../data/steps.json';
import { ProductService } from '../../../../services/product/product.service';
import {
  Binders,
  Premiums,
  Products,
  Sections,
  Subclass,
  Subclasses,
  VesselType,
  subclassCoverTypeSection,
  subclassCoverTypes,
  subclassSection,
} from '../../../setups/data/gisDTO';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Calendar } from 'primeng/calendar';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { CountryDto } from '../../../../../../shared/data/common/countryDto';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import {
  ClientBranchesDto,
  ClientDTO,
} from '../../../../../entities/data/ClientDTO';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';

import { NgxSpinnerService } from 'ngx-spinner';
import {
  Clause,
  Limit,
  PremiumComputationRequest,
  Risk,
  Tax,
} from '../../data/quotationsDTO';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';

import { firstValueFrom, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgxCurrencyConfig } from 'ngx-currency';
import {
  CountryISO,
  PhoneNumberFormat,
  SearchCountryField,
} from 'ngx-intl-tel-input';
import { OccupationService } from 'src/app/shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from 'src/app/shared/data/common/occupation-dto';
import { VesselTypesService } from '../../../setups/services/vessel-types/vessel-types.service';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { TableDetail } from 'src/app/shared/data/table-detail';

const log = new Logger('QuickQuoteFormComponent');

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css'],
})
export class QuickQuoteFormComponent {
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
  filteredSubclass: Subclass[];
  selectedSubclassCode: any;
  allMatchingSubclasses = [];
  subclassSectionCoverList: any;
  mandatorySections: subclassCoverTypeSection[];
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
  clientData: any;
  clientCode: any;
  clientType: any;
  clientName: any;
  clientEmail: any;
  clientPhone: any;
  clientZipCode: any;
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
  userDetails: any;
  userBranchId: any;
  userBranchName: any;
  dateFormat: any;
  branchList: OrganizationBranchDto[];
  selectedBranchCode: any;
  selectedBranchDescription: any;
  branchDescriptionArray: any = [];

  coverFromDate: any;
  coverToDate: string;
  passedCoverToDate: any;
  years: number[] = [];
  selectedYear: number;

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
  riskPremiumDto: Risk[] = [];
  expiryPeriod: any;
  propertyId: any;
  premiumList: Premiums[] = [];
  allPremiumRate: Premiums[] = [];
  additionalLimit = [];
  // addedBenefit:subclassCoverTypes;
  addedBenefitsList: [] = [];
  @ViewChild('dt1') dt1: Table | undefined;
  component: {
    code: number;
    date_with_effect_from: string;
    date_with_effect_to: string;
    bind_remarks: string;
  };

  passedSections: any[] = [];
  isNewClient: boolean = true;
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
  formattedCoverFromDate: any;
  coverFrom: any;
  passedClientDetailsString: string;

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
  newClientPhoneInput: any;
  selectedEffectiveDate: any;
  effectiveFromDate: string;
  todaysDate: string;
  clientPhoneInput: any;
  isEditRisk: boolean;
  occupationData: OccupationDTO[];
  selectedoccupationCode: any;
  selectedCoverToDate: any;
  vesselTypeList: VesselType[];
  selectedVesselTypeCode: any;


  filterObject: {
    name:string, idNumber:string,
  } = {
    name:'',  idNumber:'',
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
  globalFilterFields = ['idNumber', 'firstName','lastName','emailAddress'];
  emailValue: string;
  phoneValue: string;
  pinValue: string;
  idValue: string;
  taxList: any;

  // headers: { key: string, translationKey: string }[] = [
  //   { key: 'name', translationKey: 'gis.quotation.name' },
  //   { key: 'email', translationKey: 'gis.quotation.email' },
  //   { key: 'phoneNumber', translationKey: 'gis.quotation.phone_number' },
  //   { key: 'id_no', translationKey: 'gis.quotation.id_no' },
  //   { key: 'pinNumber', translationKey: 'gis.quotation.pin_number' },


  // ];


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
    private datePipe: DatePipe,
    private occupationService: OccupationService,
    private vesselTypesService:VesselTypesService,
    private spinner:NgxSpinnerService


  ) {
    this.tableDetails = {
      cols: this.cols,
      rows: this.clientsData?.content,
      globalFilterFields: this.globalFilterFields,
      isLazyLoaded: true,
      paginator: false,
      showFilter: false,
      showSorting: false
    }
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.loadAllproducts();
    this.loadAllClients();
    this.getCountries();

    this.loadAllQoutationSources();
    this.LoadAllFormFields(this.selectedProductCode);
    this.dynamicForm = this.fb.group({});
    this.createPersonalDetailsForm();
    this.createForm();
    this.getuser();
    this.loadAllSubclass();
    this.populateYears();

    const QuickFormDetails = sessionStorage.getItem('riskFormData');

    const passedIsEditRiskString = sessionStorage.getItem('isEditRisk');
    this.isEditRisk = JSON.parse(passedIsEditRiskString);
    log.debug("isEditRisk Details:", this.isEditRisk);

    const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
    this.isAddRisk = JSON.parse(passedIsAddRiskString);
    log.debug("isAddRiskk Details:", this.isAddRisk);
    if (this.isAddRisk) {
      log.debug("ADD RISK IS TRUE")
      this.addRisk();  // Call addRisk() if isAddRisk is true
    } else if (this.isEditRisk) {
      log.debug("EDIT RISK IS TRUE")

      this.editRisk();  // Call editRisk() if isEditRisk is true
    }
    this.premiumComputationRequest;
    // this.loadFormData()
    this.loadAllCurrencies();
    const organizationId = undefined;
    this.getOccupation(organizationId);
    this.getVesselTypes(organizationId)

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
      isLazyLoaded: true
    }
  }
  ngOnDestroy(): void { }
  addRisk() {
    log.debug("ADDING ANOTHER RISK TO THE SAME QUOTATION")

    /** THIS LINES OF CODES BELOW IS USED WHEN ADDING ANOTHER RISK ****/
    const passedQuotationDetailsString = sessionStorage.getItem(
      'passedQuotationDetails'
    );
    this.passedQuotation = JSON.parse(passedQuotationDetailsString);
    this.passedClientDetailsString = sessionStorage.getItem(
      'passedClientDetails'
    );

    if (this.passedClientDetailsString == undefined) {
      log.debug('New Client has been passed');

      const passedNewClientDetailsString = sessionStorage.getItem(
        'passedNewClientDetails'
      );
      this.passedNewClientDetails = JSON.parse(passedNewClientDetailsString);
      log.debug('Client Details:', this.passedNewClientDetails);
    } else {
      log.debug('Existing Client has been passed');
      this.PassedClientDetails = JSON.parse(this.passedClientDetailsString);
    }

    log.debug('Quotation Details:', this.passedQuotation);
    this.passedQuotationNo = this.passedQuotation?.no ?? null;
    log.debug('passed QUOYTATION number', this.passedQuotationNo);
    if (this.passedQuotation) {
      this.existingPropertyIds = this.passedQuotation.riskInformation?.map(
        (risk) => risk.propertyId
      );
      log.debug('existing property id', this.existingPropertyIds);
    }

    // this.passedQuotationCode = this.passedQuotation?.quotationProduct[0].quotCode ?? null

    this.passedQuotationCode =
      this.passedQuotation?.quotationProduct?.[0]?.quotCode ?? null;
    log.debug('passed QUOYTATION CODE', this.passedQuotationCode);
    sessionStorage.setItem('passedQuotationNumber', this.passedQuotationNo);
    sessionStorage.setItem('passedQuotationCode', this.passedQuotationCode);
    // sessionStorage.setItem('passedQuotationDetails', this.passedQuotation);

    log.debug('Client Details:', this.PassedClientDetails);
    if (this.passedQuotation) {
      if (this.PassedClientDetails) {
        this.clientName =
          this.PassedClientDetails.firstName +
          ' ' +
          this.PassedClientDetails.lastName;
        this.clientEmail = this.PassedClientDetails.emailAddress;
        this.clientPhone = this.PassedClientDetails.phoneNumber;
        this.personalDetailsForm.patchValue(this.passedQuotation);
        this.isNewClient = false;
        this.toggleButton();
      } else {
        log.debug('NEW CLIENT ADD ANOTHER RISK');
        this.newClientData.inputClientName =
          this.passedNewClientDetails?.inputClientName;
        this.newClientData.inputClientEmail =
          this.passedNewClientDetails?.inputClientEmail;
        this.newClientData.inputClientPhone =
          this.passedNewClientDetails?.inputClientPhone?.number;
        this.selectedZipCode = this.passedNewClientDetails?.inputClientZipCode;
        this.isNewClient = true;
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
      log.debug(parsedData);
      this.personalDetailsForm.patchValue(parsedData);
    }
    this.premiumComputationRequest;
    // this.loadFormData()
    this.loadAllCurrencies();
  }

  editRisk() {
    log.debug("EDIT RISK METHOD")
    const passedIsEditRiskString = sessionStorage.getItem('isEditRisk');
    this.isEditRisk = JSON.parse(passedIsEditRiskString);
    log.debug("isEditRiskk Details:", this.isEditRisk);

    /** THIS LINES OF CODES BELOW IS USED WHEN EDITING  RISK ****/
    const passedQuotationDetailsString = sessionStorage.getItem('passedQuotationDetails');
    this.passedQuotation = JSON.parse(passedQuotationDetailsString);
    this.passedClientDetailsString = sessionStorage.getItem('passedClientDetails');

    if (this.passedClientDetailsString == undefined) {
      log.debug("New Client has been passed")

      const passedNewClientDetailsString = sessionStorage.getItem('passedNewClientDetails');
      this.passedNewClientDetails = JSON.parse(passedNewClientDetailsString);
      log.debug("Client Details:", this.passedNewClientDetails);

    } else {
      log.debug("Existing Client has been passed")
      this.PassedClientDetails = JSON.parse(this.passedClientDetailsString);


    }



    log.debug("Quotation Details:", this.passedQuotation);
    this.passedQuotationNo = this.passedQuotation?.no ?? null;
    log.debug("passed QUOYTATION number", this.passedQuotationNo)
    if (this.passedQuotation) {
      this.existingPropertyIds = this.passedQuotation.riskInformation?.map(risk => risk.propertyId);
      log.debug("existing property id", this.existingPropertyIds);
    }


    // this.passedQuotationCode = this.passedQuotation?.quotationProduct[0].quotCode ?? null

    this.passedQuotationCode = this.passedQuotation?.quotationProduct?.[0]?.quotCode ?? null
    log.debug("passed QUOYTATION CODE", this.passedQuotationCode)
    sessionStorage.setItem('passedQuotationNumber', this.passedQuotationNo);
    sessionStorage.setItem('passedQuotationCode', this.passedQuotationCode);
    // sessionStorage.setItem('passedQuotationDetails', this.passedQuotation);

    log.debug("Client Details:", this.PassedClientDetails);
    if (this.passedQuotation) {
      if (this.PassedClientDetails) {
        this.clientName = this.PassedClientDetails.firstName + ' ' + this.PassedClientDetails.lastName;
        this.clientEmail = this.PassedClientDetails.emailAddress;
        this.clientPhone = this.PassedClientDetails.phoneNumber;
        this.personalDetailsForm.patchValue(this.passedQuotation)
        this.isNewClient = false;
        this.toggleButton();
      } else {
        log.debug("NEW CLIENT ADD ANOTHER RISK")
        this.newClientData.inputClientName = this.passedNewClientDetails?.inputClientName;
        this.newClientData.inputClientEmail = this.passedNewClientDetails?.inputClientEmail;
        this.newClientData.inputClientPhone = this.passedNewClientDetails?.inputClientPhone?.number;
        this.selectedZipCode = this.passedNewClientDetails?.inputClientZipCode;
        this.isNewClient = true;
      }
      // const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
      // this.isAddRisk = JSON.parse(passedIsAddRiskString);
      // log.debug("isAddRiskk Details:", this.isAddRisk);

      this.selectedCountry = this.PassedClientDetails.country;
      log.info("Paased selected country:", this.selectedCountry)
      if (this.selectedCountry) {
        this.getCountries()

      }
    }


    const quickQuoteFormDetails = sessionStorage.getItem('quickQuoteFormData');
    log.debug(quickQuoteFormDetails, 'Quick Quote form details session storage')

    if (quickQuoteFormDetails) {
      const parsedData = JSON.parse(quickQuoteFormDetails);
      log.debug(parsedData)
      this.personalDetailsForm.patchValue(parsedData);

    }
    this.premiumComputationRequest;
    // this.loadFormData()
    this.loadAllCurrencies()


  }

  loadFormData() {
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

      this.personalDetailsForm.patchValue(JSON.parse(savedData));
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

    if (this.passedExistingClientDetails) {
      this.toggleButton();

      this.clientName =
        this.passedExistingClientDetails.firstName +
        ' ' +
        this.passedExistingClientDetails.lastName;
      this.clientEmail = this.passedExistingClientDetails.emailAddress;
      this.clientPhone = this.passedExistingClientDetails.phoneNumber;
      this.isNewClient = false;
    } else {
      log.debug('NEW CLIENT ADD ANOTHER RISK');
      this.newClientData.inputClientName =
        this.passedNewClientDetails?.inputClientName;
      this.newClientData.inputClientEmail =
        this.passedNewClientDetails?.inputClientEmail;
      this.newClientData.inputClientPhone =
        this.passedNewClientDetails?.inputClientPhone?.number;
      this.selectedZipCode = this.passedNewClientDetails?.inputClientZipCode;
      this.isNewClient = true;
    }
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

    this.productService.getAllProducts().subscribe((data) => {
      this.productList = data;
      log.info(this.productList, 'this is a product list');
      this.productList.forEach((product) => {
        // Access each product inside the callback function
        let capitalizedDescription =
          product.description.charAt(0).toUpperCase() +
          product.description.slice(1).toLowerCase();
        productDescription.push({
          code: product.code,
          description: capitalizedDescription,
        });
      });

      // Combine the characters back into words
      const combinedWords = productDescription.join(',');
      this.ProductDescriptionArray.push(...productDescription);

      // Now 'combinedWords' contains the result with words instead of individual characters
      log.info('modified product description', this.ProductDescriptionArray);
      this.loadFormData();
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
    this.new = true;
  }
  /**
   * Toggles the 'new' state to false and resets client-related data.
   * This method is commonly used to switch from a 'new' client state to a default state and clear client input fields.
   * @method toggleNewClient
   * @return {void}
   */
  toggleNewClient() {
    this.new = false;
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
    this.user = this.authService.getCurrentUserName();
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails?.branchId;
    log.debug('User Branch Id', this.userBranchId);
    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);
    // Get today's date in yyyy-MM-dd format
    const today = new Date();
    log.debug("today date raaaw", today)
    // Format today's date to the format specified in myFormat
    // this.coverFromDate = this.datePipe.transform(today, this.dateFormat);
    this.coverFromDate = today;
    // this.coverFrom = this.coverFromDate
    // this.coverFromDate = today.toISOString().split('T')[0];
    log.debug(' Date format', this.dateFormat);

    const todaysDate = new Date(today);

    // Extract the day, month, and year
    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = todaysDate.getFullYear();

    // Format the date in 'dd-Month-yyyy' format
    const formattedDate = `${day}-${month}-${year}`;

    this.todaysDate = formattedDate
    log.debug("Todays  Date", this.todaysDate)
    log.debug("Cover from  Date(current date)", this.coverFromDate)

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
    log.debug('Organization currency delimeter', this.currencyDelimiter);
    sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);

    this.fetchBranches();
  }
  onZipCodeSelected(event: any) {
    this.selectedZipCode = event.target.value;
    log.debug('Selected Zip Code:', this.selectedZipCode);
  }
  onInputChange() {
    log.debug('Method called');
    this.newClientData.inputClientZipCode = this.selectedZipCode;
    log.debug('New User Data', this.newClientData);
    const newClientDetailsString = JSON.stringify(this.newClientData);
    sessionStorage.setItem('newClientDetails', newClientDetailsString);
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
  // onBranchSelected(selectedValue: any) {
  //   this.selectedBranchCode = selectedValue.code;
  //   log.debug("Branch Code:", this.selectedBranchCode)
  //   this.selectedBranchDescription = selectedValue.description;
  //   log.debug("Branch Description:", this.selectedBranchDescription)

  // }

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
      const testCountry = 'KENYA';
      // const clientCountry= this.clientDetails.
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
      withEffectFromDate: [''],
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
  loadClientDetails(id) {
    this.clientService.getClientById(id).subscribe((data) => {
      this.clientDetails = data;
      this.clientType = this.clientDetails.clientType.clientTypeName;
      log.debug('Selected Client Details:', this.clientDetails);
      const clientDetailsString = JSON.stringify(this.clientDetails);
      sessionStorage.setItem('clientDetails', clientDetailsString);
      log.debug('Selected code client:', this.clientType);
      this.selectedCountry = this.clientDetails.country;
      log.debug('Selected client country:', this.selectedCountry);
      this.getCountries();
      this.saveclient();
      this.closebutton.nativeElement.click();
    });
  }
  /**
   * Saves essential client details for further processing.
   * - Assigns client ID, name, email, and phone from 'clientDetails'.
   * @method saveClient
   * @return {void}
   */
  saveclient() {
    this.clientCode = this.clientDetails.id;
    this.clientName =
      this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
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

    this.getProductSubclass(this.selectedProductCode);
    // this.loadAllSubclass()

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
    // this.coverFrom = this.coverFromDate

    log.debug("Selected Product Code-coverdate method", this.selectedProductCode)
    log.debug("Selected Covercoverdate method", this.coverFromDate)
    log.debug("selected Effective date", this.selectedEffectiveDate)
    if (this.coverFromDate) {
      let date: Date;

      // Check if the value is already a Date or a string
      if (typeof this.coverFromDate === 'string') {
        // Parse the string to a Date object
        date = new Date(this.coverFromDate);
        log.debug("Was a string object", date)
        log.debug("Was a string object", this.coverFromDate)

      } else {
        date = this.coverFromDate; // It's already a Date object
        const stringRepresentation = JSON.stringify(date);
        log.debug("Was a date object", date)

      }

      const formattedCoverFromDate = this.formatDate(date);
      log.debug("FORMATTED DATE:", formattedCoverFromDate)

      if (this.selectedEffectiveDate) {
        const SelectedFormatedDate = this.formatDate(this.selectedEffectiveDate)
        log.debug(" SELECTED FORMATTED DATE:", SelectedFormatedDate)

        this.effectiveFromDate = SelectedFormatedDate
        log.debug("effective date from selected date:",this.effectiveFromDate)

        // this.coverFrom = SelectedFormatedDate
        // log.debug("COVER FROM selected date", this.coverFrom)
      } else {
        this.effectiveFromDate = formattedCoverFromDate
        log.debug("effective date from todays date:",this.effectiveFromDate)
        // this.coverFrom = formattedCoverFromDate
        // log.debug("COVER FROM todays date", this.coverFrom)
      }




      // if (SelectedFormatedDate) {
      //   this.effectiveFromDate = SelectedFormatedDate
      //   this.coverFrom = SelectedFormatedDate
      //   log.debug("COVER FROM selected date", this.coverFrom)
      // } else {
      //   this.effectiveFromDate = formattedCoverFromDate
      //   this.coverFrom = formattedCoverFromDate
      //   log.debug("COVER FROM todays date", this.coverFrom)
      // }
      log.debug("selected Effective date raw format", this.selectedEffectiveDate)
      const selectedDateString = JSON.stringify(this.effectiveFromDate);
      sessionStorage.setItem('selectedDate', selectedDateString);

      this.productService.getCoverToDate(this.effectiveFromDate, this.selectedProductCode).subscribe(data => {
        log.debug("DATA FROM COVERFROM:", data)
        const dataDate = data;
        this.passedCoverToDate = dataDate._embedded[0].coverToDate;
        // this.coverFrom =this.effectiveFromDate
        log.debug("DATe FROM DATA:", this.passedCoverToDate)
        this.getPremiumRates();

      })
    }
  }
  formatDate(date: Date): string {
    log.debug("Date (formatDate method):", date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    this.productService.getProductSubclasses(code).subscribe((data) => {
      this.subClassList = data._embedded.product_subclass_dto_list;
      log.debug(this.subClassList, 'Product Subclass List');

      this.subClassList.forEach((element) => {
        const matchingSubclasses = this.allSubclassList.filter(
          (subCode) => subCode.code === element.sub_class_code
        );
        this.allMatchingSubclasses.push(...matchingSubclasses); // Merge matchingSubclasses into allMatchingSubclasses
      });

      log.debug('Retrieved Subclasses by code', this.allMatchingSubclasses);

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
    return this.subclassService.getAllSubclasses().subscribe((data) => {
      this.allSubclassList = data;
      log.debug(this.allSubclassList, 'All Subclass List');
      this.cdr.detectChanges();
    });
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
    log.debug(`Selected value: ${selectedValue}`);
    log.debug(this.selectedSubclassCode, 'Sekected Subclass Code');
    const selectedSubclassCodeString = JSON.stringify(
      this.selectedSubclassCode
    );
    sessionStorage.setItem('selectedSubclassCode', selectedSubclassCodeString);

    this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
    this.loadAllBinders(this.selectedSubclassCode);
    this.loadSubclassSectionCovertype(this.selectedSubclassCode);
    this.fetchRegexPattern();
    this.fetchTaxes();
  }
  /**
   * Loads binders for the selected subclass.
   * - Subscribes to 'getAllBindersQuick' from BinderService.
   * - Populates 'binderListDetails' and triggers change detection.
   * @method loadAllBinders
   * @return {void}
   */
  loadAllBinders(code: number) {
    this.binderService.getAllBindersQuick(code).subscribe((data) => {
      this.binderList = data;
      this.binderListDetails = this.binderList._embedded.binder_dto_list;
      log.debug('All Binders Details:', this.binderListDetails);
      if (this.binderListDetails && this.binderListDetails.length > 0) {
        this.selectedBinder = this.binderListDetails[0]; // Set the first binder as the selected one
        log.debug('Selected Binder:', this.selectedBinder);
        this.selectedBinderCode = this.selectedBinder.code;
        this.currencyCode = this.selectedBinder.currency_code;
        log.debug('Selected Currency Code:', this.currencyCode);
      } else {
        console.error('Binder list is empty or undefined');
      }
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
    this.currencyService.getAllCurrencies().subscribe((data) => {
      this.currencyList = data;
      log.info(this.currencyList, 'this is a currency list');
      // const curr = this.currencyList.filter(currency => currency.id == this.currencyCode);
      const defaultCurrency = this.currencyList.find(
        (currency) => currency.currencyDefault == 'Y'
      );
      if (defaultCurrency) {
        log.debug('DEFAULT CURRENCY', defaultCurrency);
        this.defaultCurrencyName = defaultCurrency.name;
        log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
        this.defaultCurrencySymbol = defaultCurrency.symbol;
        log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);

        // Set the default value in the form control
        this.personalDetailsForm
          .get('currencyCode')
          ?.setValue(this.defaultCurrencyName);
        this.currencyObj = {
          prefix: this.defaultCurrencySymbol + ' ',
          allowNegative: false,
          allowZero: false,
          decimal: '.',
          precision: 0,
          thousands: this.currencyDelimiter,
          suffix: '',
          nullable: true,
          align: 'left',
        };
      }

      // this.selectedCurrency = curr[0].name
      // log.debug("Selected Currency:", this.selectedCurrency);
      // this.selectedCurrencyCode = curr[0].id;
      // log.debug("Selected Currency code:", this.selectedCurrencyCode);
      // this.personalDetailsForm.get('currencyCode').setValue(this.selectedCurrencyCode);

      this.cdr.detectChanges();
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
    this.selectedCurrencySymbol = selectedCurrency.symbol;
    log.debug('Selected Currency symbol', this.selectedCurrencySymbol);
    this.currencyObj = {
      prefix: this.selectedCurrencySymbol,
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: this.currencyDelimiter,
      suffix: '',
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

        this.cdr.detectChanges();
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
          this.formContent = data;
          log.debug(this.formContent, 'Form-content'); // Debugging: Check the received data
          this.formData = this.formContent[0].fields;
          log.debug(this.formData, 'formData is defined here');

          // Clear existing form controls
          this.removeFormControls();

          // Add new form controls for each product-specific field
          this.formData.forEach((field) => {
            this.control = new FormControl('', [
              Validators.required,
              Validators.pattern(field.regexPattern),
            ]);

            // Add a custom validator for displaying a specific error message
            this.control.setValidators([
              Validators.required,
              Validators.pattern(new RegExp(field.regexPattern)),
            ]);

            log.debug('Control', this.control);
            this.dynamicForm.addControl(field.name, this.control);
            // this.dynamicRegexPattern = field.regexPattern;
            // this.dynamicRegexPattern = this.regexPattern;
            // log.debug("Regex", field.regexPattern);
          });
        });
    }
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
    log.debug('Entered value:', this.carRegNoValue);

    // Validate against the regex pattern
    const regex = new RegExp(this.dynamicRegexPattern);
    log.debug('Regex pattern:', regex);
    this.carRegNoHasError = !regex.test(this.carRegNoValue);
    log.debug('Has error:', this.carRegNoHasError);
    if (this.existingPropertyIds) {
      // Check for duplicate property IDs
      const isDuplicate = this.existingPropertyIds.includes(this.carRegNoValue);
      if (isDuplicate) {
        this.carRegNoHasError = true; // Set error to true if a duplicate is found
        log.debug('Duplicate property ID found.', isDuplicate);
      }
    }
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
  // loadSubclassSectionCovertype(code: number) {
  //   this.subclassSectionCovertypeService.getSubclassCovertypeSections().subscribe(data => {
  //     this.subclassSectionCoverList = data;
  //     log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
  //     this.mandatorySections = this.subclassSectionCoverList.filter(section => section.subClassCode == code && section.isMandatory == "Y");
  //     log.debug("Mandatory Section Covertype:", this.mandatorySections);
  //     const notMandatorySections = this.subclassSectionCoverList.filter(section =>
  //       section.subClassCode == code &&
  //       section.isMandatory == null
  //     );
  //     log.debug("NOT MANDATORY", notMandatorySections)
  //     if (this.mandatorySections.length > 0) {

  //       this.selectedSectionList = this.mandatorySections[0];

  //       log.debug("Selected Section ", this.selectedSectionList)

  //     } else {

  //     }

  //     const mandatorySectionsString = JSON.stringify(this.mandatorySections);
  //     sessionStorage.setItem('mandatorySections', mandatorySectionsString);
  //     this.getSectionByCode();
  //   })
  // }
  loadSubclassSectionCovertype(code: number): Promise<void> {
    return firstValueFrom(this.subclassSectionCovertypeService.getSubclassCovertypeSections())
      .then(data => {
        this.subclassSectionCoverList = data;
        log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
        this.mandatorySections = this.subclassSectionCoverList.filter(
          section => section.subClassCode == code && section.isMandatory == "Y"
        );
        log.debug("Mandatory Section Covertype:", this.mandatorySections);
        const notMandatorySections = this.subclassSectionCoverList.filter(
          section => section.subClassCode == code && section.isMandatory == null
        );
        log.debug("NOT MANDATORY", notMandatorySections);
        this.getCoverToDate();

      if (this.mandatorySections.length > 0) {
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
      .getSectionByCode(this.selectedSectionList.sectionCode)
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
        .subscribe((data) => {
          this.premiumList = data;
          log.debug('data ', data);
          this.allPremiumRate.push(...this.premiumList);
          log.debug('premium List', this.premiumList);

          // this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
        });
      log.debug('all quick quote premium List', this.allPremiumRate);
    }
  }

  setRiskPremiumDto(): Risk[] {
    log.debug("subclass cover type", this.subclassCoverType)
    log.debug("Car Reg no:", this.carRegNoValue)
    const propertyId = this.dynamicForm.get('riskId')?.value;
    log.debug("Risk Id:", propertyId)


    return this.subclassCoverType.map((item) => {
      let risk: Risk = {
        propertyId: this.carRegNoValue || propertyId,
        withEffectFrom: this.effectiveFromDate,
        withEffectTo: this.passedCoverToDate,
        prorata: 'F',
        subclassSection: {
          code: this.selectedSubclassCode,
        },
        itemDescription:this.carRegNoValue || propertyId,
        noClaimDiscountLevel: 0,
        subclassCoverTypeDto: {
          subclassCode: this.selectedSubclassCode,
          coverTypeCode: item.coverTypeCode,
          minimumAnnualPremium: 0,
          minimumPremium: parseInt(item.minimumPremium, 10),
          coverTypeShortDescription: item.coverTypeShortDescription,
          coverTypeDescription: item.description
        },
        enforceCovertypeMinimumPremium: 'N',
        binderDto: {
          code: this.selectedBinderCode,
          currencyCode: this.currencyCode,
          maxExposure: this.selectedBinder.maximum_exposure,
          currencyRate: 1.25 /**TODO: Fetch from API */,
        },
        limits: this.setLimitPremiumDto(item.coverTypeCode),
      };
      // this.riskPremiumDto.push(risk);

      return risk;
    });
  }

  setLimitPremiumDto(coverTypeCode: number): Limit[] {
    log.debug("Current form structure:", this.dynamicForm.controls);

    const value = this.dynamicForm.get('value')?.value;
    log.debug("Value", value)


    const sumInsured = this.dynamicForm.get('selfDeclaredValue')?.value;
    log.debug("SUM INSURED", sumInsured)

    const finalValue = value ?? sumInsured;
    log.debug("Final Value", finalValue);
    sessionStorage.setItem('sumInsuredValue', finalValue);

    log.debug('Mandatory Sections', this.mandatorySections);

    let limitItems = [];
    let sectionCodes = [];
    let sectionsForCovertype = this.mandatorySections.filter((sect) => {
      log.debug(sect);
      log.debug(sect.coverTypeCode + ' vs ' + coverTypeCode);
      return sect.coverTypeCode == coverTypeCode;
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
            limitAmount: sumInsured || value,
            compute: "Y",
            dualBasis: "N"
          }

        })

    ).flatMap(item => item)
    log.debug("Added Limit", this.additionalLimit)

    if (this.additionalLimit.length > 0) {
      log.debug('Added Limit', this.additionalLimit);
      // Adjust the existing response to include the additional risk
      this.additionalLimit.forEach((item) => sectionsForCovertype.push(item));
      log.debug('section for CoverType:', sectionsForCovertype);
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
                limitAmount: sumInsured || value,
                compute: "Y",
                dualBasis: "N"
              }
            })
        ).flatMap(item => item)
      );
    }

    log.debug('Covertype', coverTypeCode);
    log.debug('Section items', sectionsForCovertype);
    log.debug('limit items', response);

    return response;
  }
  computePremiumV2() {
    this.ngxSpinner.show();
    this.personalDetailsForm.get('productCode').setValue(this.selectedProductCode);
    this.personalDetailsForm.get('withEffectiveToDate').setValue(this.passedCoverToDate);
    this.personalDetailsForm.get('withEffectiveFromDate').setValue(this.effectiveFromDate);
    // if (this.) {

    // }
    if (this.selectedBranchCode) {
      this.personalDetailsForm
        .get('branchCode')
        .setValue(this.selectedBranchCode);
    } else {
      this.personalDetailsForm
        .get('branchCode')
        .setValue(this.filteredBranchCodeNumber);
    }

    // Mark all fields as touched and validate the form
    this.personalDetailsForm.markAllAsTouched();
    this.personalDetailsForm.updateValueAndValidity();

    // Log
    log.debug('Email:', this.newClientData.inputClientEmail);
    log.debug('Phone:', this.newClientData.inputClientPhone);
    // Custom validation for email and phone number
    if (!this.isEmailOrPhoneValid()) {
      this.ngxSpinner.hide();
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Provide either a valid phone number or email to proceed.'
      );

      return;
    }

    // Log form validity for debugging
    log.debug('Form Valid:', this.personalDetailsForm.valid);
    log.debug('Form Values:', this.personalDetailsForm.value);

    if (this.personalDetailsForm.invalid) {
      log.debug('Form is invalid, will not proceed');
      this.ngxSpinner.hide();
      return;
    }
    Object.keys(this.personalDetailsForm.controls).forEach((control) => {
      if (this.personalDetailsForm.get(control).invalid) {
        log.debug(
          `${control} is invalid`,
          this.personalDetailsForm.get(control).errors
        );
      }
    });

    // If form is valid, proceed with the premium computation logic
    log.debug('Form is valid, proceeding with premium computation...');
    sessionStorage.setItem('product', this.selectedProductCode);

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
      transactionStatus:"NB",
      /**Setting Product Details**/
      product: {
        code: this.selectedProductCode,
        expiryPeriod: this.expiryPeriod,
      },
      /**Setting Tax Details**/
      taxes:this.setTax(),

      currency: {
        rate: 1.25 /**TODO: Fetch from API */,
      },
      risks: this.setRiskPremiumDto(),
    };
    log.debug('PREMIUM COMPUTATION PAYLOAD', this.premiumComputationRequest);

    const premiumComputationRequestString = JSON.stringify(
      this.premiumComputationRequest
    );
    sessionStorage.setItem(
      'premiumComputationRequest',
      premiumComputationRequestString
    );
    const subclassCoverTypeString = JSON.stringify(this.subclassCoverType);
    sessionStorage.setItem('subclassCoverType', subclassCoverTypeString);

    return this.quotationService
      .premiumComputationEngine(this.premiumComputationRequest)
      .subscribe({
        next: (data) => {
          log.debug('Data', data);
          const premiumResponseString = JSON.stringify(data);
          sessionStorage.setItem('premiumResponse', premiumResponseString);

          // this.sharedService.setPremiumResponse(data);
          this.router.navigate(['/home/gis/quotation/cover-type-details']);
        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.ngxSpinner.hide();

          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Premium Computation Failed'
          );
        },
      });
  }
  onCreateRiskSection() {
    log.debug('Selected Sections:', this.passedSections);

    // Assuming this.premiumList is an array of premium rates retrieved from the service
    const premiumRates = this.premiumList;

    if (premiumRates.length !== this.passedSections.length) {
      // Handle the case where the number of premium rates doesn't match the number of sections
      console.error(
        "Number of premium rates doesn't match the number of sections"
      );
      return;
    }

    const payload = this.passedSections.map((section, index) => {
      const premiumRate = premiumRates[index]; // Get the corresponding premium rate for the current section

      return {
        calcGroup: 1,
        code: section.code,
        compute: 'Y',
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

    this.quotationService
      .createRiskSection(this.riskCode, this.sectionArray)
      .subscribe((data) => {
        try {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Section Created'
          );
          this.sectionDetailsForm.reset();
        } catch (error) {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Error try again later'
          );
        }
        // this.computeQuotePremium();
      });
  }
  saveFormState() {
    log.debug('SAVE FORM STATE METHOD HAS BEEN CALLED');
    sessionStorage.setItem(
      'personalDetails',
      JSON.stringify(this.personalDetailsForm.value)
    );

    // sessionStorage.setItem('sumInsured', JSON.stringify(this.dynamicForm.get('selfDeclaredValue').value.replace(/,/g, '')));
    // sessionStorage.setItem('yearOfManufacture', JSON.stringify(this.dynamicForm.get('yearOfManufacture').value));
    // sessionStorage.setItem('carRegNo', JSON.stringify(this.dynamicForm.get('carRegNo').value));

    const selfDeclaredValue = this.dynamicForm.get('selfDeclaredValue').value;
    const yearOfManufacture = this.dynamicForm.get('yearOfManufacture').value;
    const carRegNo = this.carRegNoValue;

    // Store values in session storage
    sessionStorage.setItem('sumInsured', JSON.stringify(selfDeclaredValue));
    log.debug('sumInsured:', selfDeclaredValue);

    sessionStorage.setItem(
      'yearOfManufacture',
      JSON.stringify(yearOfManufacture)
    );
    log.debug('yearOfManufacture:', yearOfManufacture);

    sessionStorage.setItem('carRegNo', JSON.stringify(carRegNo));
    log.debug('carRegNo:', carRegNo);

    // const formData = this.personalDetailsForm.value;
    // sessionStorage.setItem('formState', JSON.stringify(formData));
  }
  fetchRegexPattern() {
    this.quotationService
      .getRegexPatterns(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.regexPattern = response._embedded.riskIdFormat;
          log.debug('New Regex Pattern', this.regexPattern);
          this.dynamicRegexPattern = this.regexPattern;
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to fetch regex patterns. Try again later'
          );
        },
      });
  }
  onEmailInputChange() {
    if (!this.emailPattern.test(this.newClientData.inputClientEmail)) {
      console.error('Invalid email format');
      // You can also set a custom error state here if needed
    }
  }
  // isEmailOrPhoneValid(): boolean {
  //   const email1Valid = this.validateEmail(this.newClientData.inputClientEmail); //new client email input
  //   const email2Valid = this.validateEmail(this.clientEmail); // existing client email input
  //   const phone1Valid = this.newClientPhoneInput?.valid; // From ngx-intl-tel-input
  //   const phone2Valid = this.clientPhoneInput?.valid; // From ngx-intl-tel-input

  //   return phone1Valid || phone2Valid || email1Valid || email2Valid;
  // }
  isEmailOrPhoneValid(): boolean {
    const email1Valid = !!this.newClientData.inputClientEmail; // Check if new client email has a value
    const email2Valid = !!this.clientEmail; // Check if existing client email has a value
    const phone1Valid = !!this.newClientData.inputClientPhone; // Check if new client phone has a value
    const phone2Valid = !!this.clientPhone; // Check if existing client phone has a value

    // Debugging to verify values
    log.debug({
      email1Valid,
      email2Valid,
      phone1Valid,
      phone2Valid,
      'Input Phone 1': this.newClientData.inputClientPhone,
      'Input Phone 2': this.clientPhone,
    });

    // Return true if any field has a value
    return phone1Valid || phone2Valid || email1Valid || email2Valid;
  }



  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  onDateInputChange(date: any) {
    log.debug('selected Effective date raaaaaw', date);
    this.selectedEffectiveDate = date;
    log.debug('selected Effective date', this.selectedEffectiveDate);
  }
  transformToUpperCase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.toUpperCase();
  }
  onPhoneInputChange() {
    console.log('Client Phone:', this.clientPhone);
    console.log('New Client Phone:', this.newClientData.inputClientPhone);
  }
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

  onCoverToInputChange(date: any) {
    log.debug('selected Cover to date raaaaaw', date);
    this.selectedCoverToDate = date;
    log.debug('selected cover to date', this.selectedCoverToDate);
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
getClients(pageIndex: number,
  pageSize: number,
  sortField: any = 'createdDate',
  sortOrder: string = 'desc') {
return this.clientService
.getClients(pageIndex, pageSize, sortField, sortOrder)
.pipe(
untilDestroyed(this),
);
}
  /**
   * The function "lazyLoadClients" is used to fetch clients data with pagination, sorting, and filtering options.
   * @param {LazyLoadEvent | TableLazyLoadEvent} event - The `event` parameter is of type `LazyLoadEvent` or
   * `TableLazyLoadEvent`. It is used to determine the pagination, sorting, and filtering options for fetching clients.
   */
  lazyLoadClients(event:LazyLoadEvent | TableLazyLoadEvent){
    const pageIndex = event.first / event.rows;
    const sortField = event.sortField;
    const sortOrder = event?.sortOrder == 1 ? 'desc' : 'asc';
    const pageSize = event.rows;


    if (this.isSearching) {
      const searchEvent = {
        target: {value: this.searchTerm}
      };
      this.filter(searchEvent, pageIndex, pageSize);
    }
    else {
      this.getClients(pageIndex, pageSize, sortField, sortOrder)
        .pipe(
          untilDestroyed(this),
          tap((data) => log.info(`Fetching Clients>>>`, data))
        )
        .subscribe(
          (data: Pagination<ClientDTO>) => {
            data.content.forEach( client => {
              client.clientTypeName = client.clientType.clientTypeName;
              client.clientFullName = client.firstName + ' ' + (client.lastName || ''); //the client.clientFullName will be set to just firstName,
              // as the null value for lastName is handled  using the logical OR (||) operator
            });
            this.clientsData = data;
            this.tableDetails.rows = this.clientsData?.content;
            this.tableDetails.totalElements = this.clientsData?.totalElements;
            this.cdr.detectChanges();
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
    }
  }
filter(event, pageIndex: number = 0, pageSize: number = event.rows) {
  this.clientsData = null; // Initialize with an empty array or appropriate structure
  let columnName ;
  let columnValue;
  /*const value = (event.target as HTMLInputElement).value.toLowerCase();

  log.info('myvalue>>>', value)

    this.searchTerm = value;*/
    if(this.emailValue){
      columnName = "emailAddress";
      columnValue = this.emailValue
    }else if(this.phoneValue){
      columnName = "phoneNumber";
      columnValue = this.phoneValue
    }else if(this.pinValue){
      columnName = "pinNumber";
      columnValue = this.pinValue
    }else if(this.idValue){
      columnName = "id";
      columnValue = this.idValue
    }


    this.isSearching = true;
    this.spinner.show();
    this.quotationService
      .searchClients(
        columnName,columnValue,
        pageIndex, pageSize,
        this.filterObject?.name,
        this.filterObject?.idNumber,

      )
      .subscribe((data) => {
        this.clientsData = data;
        this.spinner.hide();
      },
        error => {
          this.spinner.hide();
        });
}

inputName(event) {

  const value = (event.target as HTMLInputElement).value;
  this.filterObject['name'] = value;
}

inputEmail(event) {

  const value = (event.target as HTMLInputElement).value;
  this.emailValue=value
  // this.filterObject['emailAddress'] = value;
}
inputPhone(event) {

  const value = (event.target as HTMLInputElement).value;
    this.phoneValue=value

  // this.filterObject['phoneNumber'] = value;
}
inputIdNumber(event) {

  const value = (event.target as HTMLInputElement).value;
  this.filterObject['idNumber'] = value;
}



inputPin(event) {

  const value = (event.target as HTMLInputElement).value;
  this.pinValue=value

  // this.filterObject['pinNumber'] = value;
}
inputInternalId(event) {

  const value = (event.target as HTMLInputElement).value;
  this.idValue=value

  // this.filterObject['id'] = value;
}
fetchTaxes() {
  this.quotationService
    .getTaxes(this.selectedProductCode,this.selectedSubclassCode)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (response: any) => {

        this.taxList = response._embedded
        log.debug("Tax List ", this.taxList);

      },
      error: (error) => {

        this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch taxes. Try again later');
      }
    });
}


setTax(): Tax[] {
  log.debug("Tax List when setting the payload", this.taxList);

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

  log.debug("Tax List after mapping the payload", taxList);
  return taxList; // Explicitly returning the list
}

}
