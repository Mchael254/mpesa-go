import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ProductsService } from '../../../setups/services/products/products.service';
import { Logger, UtilService } from '../../../../../../shared/services';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { QuotationsService } from '../../services/quotations/quotations.service';

import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ClientService } from '../../../../../entities/services/client/client.service';
import stepData from '../../data/steps.json';
import {
  Binders,
  Premiums,
  Products,
  Sections,
  SubclassCoverTypes,
  subclassCoverTypeSection,
  Subclasses,
  VesselType,
} from '../../../setups/data/gisDTO';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Calendar } from 'primeng/calendar';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { CountryService } from '../../../../../../shared/services/setups/country/country.service';
import { CountryDto } from '../../../../../../shared/data/common/countryDto';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import {
  SubClassCoverTypesSectionsService
} from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { ClientDTO, } from '../../../../../entities/data/ClientDTO';
import { BranchService } from '../../../../../../shared/services/setups/branch/branch.service';
import { OrganizationBranchDto } from '../../../../../../shared/data/common/organization-branch-dto';

import { NgxSpinnerService } from 'ngx-spinner';
import {
  DynamicRiskField,
  Limit,
  PremiumComputationRequest,
  QuickQuoteData,
  Risk,
  Tax,
  UserDetail,
} from '../../data/quotationsDTO';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';

import { firstValueFrom, forkJoin, mergeMap, Observable, of, tap } from 'rxjs';
import { NgxCurrencyConfig } from 'ngx-currency';
import { OccupationService } from '../../../../../../shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from '../../../../../../shared/data/common/occupation-dto';
import { VesselTypesService } from '../../../setups/services/vessel-types/vessel-types.service';
import { Pagination } from '../../../../../../shared/data/common/pagination';
import { TableDetail } from '../../../../../../shared/data/table-detail';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { distinctUntilChanged, map } from "rxjs/operators";
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';

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


  breadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard',
    },
    {
      label: 'Quotation',
      url: '/home/lms/quotation/list',
    },
    {
      label: 'New quote',
      url: '/home/gis/quotation/quick-quote',
    },
  ];
  public currencyObj: NgxCurrencyConfig;
  products: Products[];
  ProductDescriptionArray: { code: number, description: string }[] = [];
  selectedProductCode: any;
  selectedProducts: Products[] = []
  previousSelected: Products[] = [];

  productRiskFields: DynamicRiskField[][] = [];
  expandedStates: boolean[] = [];


  allSubclassList: Subclasses[];
  selectedSubclassCode: any;
  productSubclassesMap: { [productCode: number]: Subclasses[] } = {};
  subclassSectionCoverList: any;
  mandatorySections: subclassCoverTypeSection[];
  binderList: any;
  binderListDetails: any;
  selectedBinderCode: any;
  selectedBinder: Binders;


  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  formContent: any;
  formData: {
    type: string;
    name: string;
    max: number
    min: number
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
  selectedSectionList: any;
  section: Sections;

  steps = stepData;
  user: any;
  userDetails: any;
  userBranchId: any;
  dateFormat: any;
  branchList: OrganizationBranchDto[];
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
  parsedProductDesc: any;
  regexPattern: any;
  defaultCurrencyName: any;
  minDate: Date | undefined;
  currencyDelimiter: any;
  defaultCurrencySymbol: any;
  selectedCurrencySymbol: any;
  coverFrom: any;

  minCoverToDate = new Date()

  selectedEffectiveDate: any;
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
  formattedCoverToDate: string;

  isReturnToQuickQuote: boolean;
  storedData: QuickQuoteData = null
  userCode: number;
  userOrgDetails: UserDetail;
  organizationId: number;
  exchangeRate: number;

  applicablePremiumRates: any
  computationPayloadCode: number;


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

  }

  ngOnInit(): void {
    this.LoadAllFormFields();
    this.quickQuoteForm = this.fb.group({
      product: [[]],
      effectiveDate: [''],
      quotComment: [''],
      products: this.fb.array([])
    });
    this.loadAllCurrencies()
    this.getuser()
    this.expandedStates = this.productsFormArray.controls.map((_, index) => index === 0);

  }


  isFieldRequired(controlName: string): boolean {
    const control = this.quickQuoteForm.get(controlName);
    return control?.hasValidator(Validators.required) ?? false;
  }

  ngOnDestroy(): void {
  }

  dynamicSideBarMenu(sidebarMenu: SidebarMenu): void {
    if (sidebarMenu.link.length > 0) {
      this.router.navigate([sidebarMenu.link]); // Navigate to the specified link
    }
    this.menuService.updateSidebarMainMenu(sidebarMenu.value); // Update the sidebar menu
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
  LoadAllFormFields() {
    const formFieldDescription = 'product-quick-quote';

    this.quotationService
      .getFormFields(formFieldDescription)
      .subscribe((data) => {
        this.formData = [];
        this.formContent = data;
        log.debug(this.formContent, 'Form-content');
        this.formData = this.formContent[0]?.fields;
        log.debug(this.formData, 'formData is defined here');
        this.formData && this.loadAllproducts();

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
          this.quickQuoteForm.addControl(
            field.name,
            new FormControl('', validators)
          );
          (this.quickQuoteForm.get(field.name) as any).metadata = {
            dynamic: true,
          };
        });


      });
    // Object.keys(this.quickQuoteForm.controls).forEach((controlName) => {
    //   const control = this.quickQuoteForm.get(controlName);
    //   log.debug(
    //     `Control: ${controlName}, Value: ${control?.value
    //     }, Validators: ${this.getValidatorNames(control)}`
    //   );
    // });
  }
  // getRiskFieldsForProduct(productCode: number): Observable<string[]> {
  //   const formFieldDescription = 'product-quick-quote-' + productCode;
  //   return this.quotationService.getFormFields(formFieldDescription).pipe(
  //     map(data => {
  //       // Defensive: data[0]?.fields might not exist, so default to empty array
  //       const fields = data[0]?.fields || [];
  //       // Extract the field names into a string array
  //       return fields.map(field => field.name);
  //     })
  //   );
  // }

  /**
   * Loads all products by making an HTTP GET request to the ProductService.
   * Retrieves a list of products and updates the component's productList property.
   * Also logs the received product list for debugging purposes.
   * @method loadAllProducts
   * @return {void}
   */
  loadAllproducts() {
    this.productService
      .getAllProducts()
      .pipe(
        map(products => {
          return products.map(product => {
            return {
              ...product,
              description: this.capitalizeWord(product.description)
            }
          })
        }),
        untilDestroyed(this))
      .subscribe((data) => {
        this.products = data
      });
  }

  get productsFormArray(): FormArray {
    return this.quickQuoteForm.get('products') as FormArray;
  }

  getRisks(productIndex: number): FormArray {
    return this.productsFormArray.at(productIndex).get('risks') as FormArray;
  }

  // Fetches dynamic risk fields based on product code
  // getRiskFieldsForProduct(productCode: number): Observable<string[]> {
  //   const formFieldDescription = `product-risk-quick-quote-${productCode}`;
  //   return this.quotationService.getFormFields(formFieldDescription).pipe(
  //     map(response => (response?.[0]?.fields || []).map(field => field.name))
  //   );
  // }
  getRiskFieldsForProduct(productCode: number): Observable<DynamicRiskField[]> {
    const formFieldDescription = `product-quick-quote-${productCode}`;
    return this.quotationService.getFormFields(formFieldDescription).pipe(
      map(response => {
        const fields = response?.[0]?.fields || [];
        return fields.map(field => ({
          type: field.type,
          name: field.name,
          max: field.max,
          min: field.min,
          isMandatory: field.isMandatory,
          disabled: field.isEnabled === "N",
          readonly: field.isReadOnly === "Y",
          regexPattern: field.regexPattern,
          placeholder: field.placeholder,
          label: field.label
        }));
      })
    );
  }


  // Dynamically creates a FormGroup for a risk using provided fields
  createRiskGroup(riskFields: DynamicRiskField[]): FormGroup {
    const group: { [key: string]: FormControl } = {};

    riskFields.forEach(field => {
      group[field.name] = new FormControl(
        { value: '', disabled: field.disabled },
        field.isMandatory === 'Y' ? Validators.required : []
      );
    });

    return new FormGroup(group);
  }


  // When products are selected from multi-select
  getSelectedProducts(event: any) {
    const currentSelection = event.value as Products[];
    const currentCodes = currentSelection.map(p => p.code);
    const previousCodes = this.previousSelected.map(p => p.code);

    // Find added and removed products
    const added = currentSelection.filter(p => !previousCodes.includes(p.code));
    const removed = this.previousSelected.filter(p => !currentCodes.includes(p.code));

    // Remove unselected products from FormArray
    removed.forEach(removedProduct => {
      const index = this.productsFormArray.controls.findIndex(
        ctrl => ctrl.get('code')?.value === removedProduct.code
      );
      if (index !== -1) {
        this.productsFormArray.removeAt(index);
      }
    });

    // Add newly selected products
    added.forEach(product => {
      const productGroup = this.fb.group({
        code: [product.code],
        description: [product.description],
        risks: this.fb.array([])
      });

      this.productsFormArray.push(productGroup);
      this.expandedStates = this.productsFormArray.controls.map((_, index) => index === 0);

      this.getProductSubclass(product.code);
      if(product.code === 8293){
        log.debug("years endpoint called for motor product")
        this.populateYears();
      }

      // Add first empty risk group
      this.getRiskFieldsForProduct(product.code).subscribe((riskFields: DynamicRiskField[]) => {
        const risksArray = productGroup.get('risks') as FormArray;
        risksArray.push(this.createRiskGroup(riskFields));
        this.productRiskFields[this.productsFormArray.length - 1] = riskFields;
        // this.cdr.detectChanges();
      });

    });

    // 🔁 Load all product risk field metadata AFTER loop
    // this.loadProductRiskFields();

    this.selectedProducts = [...currentSelection];
    this.previousSelected = [...currentSelection];

    log.debug("FormArray now >>>>", this.productsFormArray);
  }

  // Add risk row dynamically
  addRisk(productIndex: number) {
    const productGroup = this.productsFormArray.at(productIndex);
    const risksArray = productGroup.get('risks') as FormArray;
    const productCode = productGroup.get('code')?.value;

    this.getRiskFieldsForProduct(productCode).subscribe((riskFields: DynamicRiskField[]) => {
      const newRiskGroup = this.createRiskGroup(riskFields);
      risksArray.push(newRiskGroup);
    });
  }

  loadProductRiskFields() {
    const observables = this.selectedProducts.map((product, index) =>
      this.getRiskFieldsForProduct(product.code).pipe(
        map((fields: DynamicRiskField[]) => ({ index, fields }))
      )
    );

    forkJoin(observables).subscribe(results => {
      results.forEach(({ index, fields }) => {
        this.productRiskFields[index] = fields;
      });
    });
  }



  // Remove a risk row
  deleteRisk(productIndex: number, riskIndex: number) {
    this.getRisks(productIndex).removeAt(riskIndex);
  }

  // Remove product
  deleteProduct(productIndex: number) {
    this.productsFormArray.removeAt(productIndex);
    this.selectedProducts.splice(productIndex, 1);
  }
markAllFieldsAsTouched(formGroup: FormGroup | FormArray) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);

    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup || control instanceof FormArray) {
      this.markAllFieldsAsTouched(control);
    }
  });
}

  // Submit
onSubmit() {
  if (this.quickQuoteForm.invalid) {
    this.markAllFieldsAsTouched(this.quickQuoteForm);
    return; // Prevent submission if form is invalid
  }

  log.debug("Form submission payload >>>>", this.quickQuoteForm.value);

  const computationRequest = this.computationPayload();
  this.quotationService.premiumComputationEngine(computationRequest).pipe(
    untilDestroyed(this)
  ).subscribe(response => {
    // Handle response
  });
}


  toggleExpand(index: number) {
    this.expandedStates[index] = !this.expandedStates[index];
  }

  
  computationPayload(): PremiumComputationRequest {

    return
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
    this.subclassService.getProductSubclasses(code).pipe(
      untilDestroyed(this)
    ).subscribe((subclasses: Subclasses[]) => {
      this.productSubclassesMap[code] = subclasses.map(value => ({
        ...value, // keep all original properties
        description: this.capitalizeWord(value.description), // update description only
      }));
      log.debug("SUBCLASS LIST:", this.productSubclassesMap)
    });
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
      .pipe(

        untilDestroyed(this))
      .subscribe((data) => {
        this.currencyList = data
        const defaultCurrency = this.currencyList.find(
          (currency) => currency.currencyDefault == 'Y'
        );
        if (defaultCurrency) {
          log.debug('DEFAULT CURRENCY', defaultCurrency);
          this.defaultCurrencyName = defaultCurrency.name;
          log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
          this.defaultCurrencySymbol = defaultCurrency.symbol;
          log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
          this.setCurrencySymbol(this.defaultCurrencySymbol);
        }
      });
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
    log.debug("Currency object:", this.currencyObj)
  }


  /** OLD QUICK QUOTE TS CODE*/

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
    this.userCode = this.userDetails.code
    log.debug('User Code ', this.userCode);
    if (this.userCode) {
      this.fetchUserOrgId()
    }
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
        const branch = this.branchList.filter(
          (branch) => branch.id == this.userBranchId
        );
        this.branchDescriptionArray = data.map((branch) => {
          return {
            code: branch.id,
            description: this.capitalizeWord(branch.name),
          }
        })
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
    this.selectedEffectiveDate = new Date();
    this.quickQuoteForm.get('effectiveDate').setValue(this.selectedEffectiveDate);
    // this.setCurrencySymbol(defaultCurrency.symbol);
    // this.getProductSubclass(this.selectedProductCode);

    // Load the dynamic form fields based on the selected product
    // this.getProductExpiryPeriod();
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
    log.debug('selected Effective date', this.selectedEffectiveDate);

    let dateFrom = this.formatDate(this.selectedEffectiveDate);
    if (dateFrom) {
      sessionStorage.setItem('selectedDate', JSON.stringify(dateFrom));
      this.productService
        .getCoverToDate(dateFrom, this.selectedProductCode)
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
          log.debug('DATe FROM DATA:', this.passedCoverToDate);
          this.selectedCoverToDate = this.passedCoverToDate;
          this.quickQuoteForm?.get('coverTo')?.setValue(new Date(this.selectedCoverToDate))
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
  onSubclassSelected(event: any,productIndex: number, riskIndex: number) {
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
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code');
    sessionStorage.setItem('selectedSubclassCode', selectedSubclassCodeString);
    this.fetchRegexPattern(productIndex,riskIndex);
  }

  onDateInputChange(date: any) {
    log.debug('selected Effective date', date.value);
    this.selectedEffectiveDate = date;
    this.minCoverToDate = this.selectedEffectiveDate
    this.getCoverToDate();
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
      });
  }


  getValidatorNames(control: AbstractControl | null): string[] {
    if (!control || !control.validator) return [];
    const validatorFns = control.validator({} as AbstractControl);
    return Object.keys(validatorFns || {});
  }

  /**
   * Validates a car registration number using a dynamic regex pattern.
   * - Logs the entered value and dynamic regex pattern.
   * - Tests the car registration number against the regex pattern.
   * - Updates 'carRegNoHasError' based on the test result.
   * @method validateCarRegNo
   * @return {void}
   */
//  validateCarRegNo(productIndex: number, riskIndex: number) {
//   const control = this.quickQuoteForm.get(['products', productIndex, 'risks', riskIndex, 'carRegNo']) as FormControl;
  

//     control.removeValidators([this.uniqueValidator]);
//     const value = control.value;
//     log.debug("Keyed In value>>>", value);
  
//     if (!control || this.quickQuoteForm?.get('carRegNo')?.hasError('pattern') || !value) return;
//     this.quotationService.validateRiskExistence({
//       propertyId: value,
//       subClassCode: this.selectedSubclassCode,
//       withEffectFrom: this.formatDate(this.selectedEffectiveDate),
//       withEffectTo: this.selectedCoverToDate,
//       addOrEdit: 'A'
//     }).pipe(
//       debounceTime(500),
//       distinctUntilChanged(),
//       untilDestroyed(this)
//     ).subscribe((response) => {
//       const canProceed = response?._embedded?.duplicateAllowed
//       log.debug("Risk allowed>>>", canProceed)
//       if (this.existingPropertyIds) {
//         log.debug('Doing validation of ', value, this.existingPropertyIds);
//         const isDuplicate = this.existingPropertyIds.some(
//           (existingValue) =>
//             existingValue.replace(/\s+/g, '').toUpperCase() === value.replace(/\s+/g, '').toUpperCase()
//         );
//         log.debug("Existing risk>>>", isDuplicate)
//         if (isDuplicate || !canProceed) {
//           control.addValidators([this.uniqueValidator]);
//         } else {
//           control.removeValidators([this.uniqueValidator]);
//         }
//         control.updateValueAndValidity({ emitEvent: false });
//       }
//     })
//   }
validateCarRegNo(productIndex: number, riskIndex: number) {
  const control = this.quickQuoteForm.get(['products', productIndex, 'risks', riskIndex, 'carRegNo']) as FormControl;
  log.debug("Keyed In value>>>", control);

  if (!control) return;

  const value = control.value;
  log.debug("Keyed In value>>>", value);

  // Exit early if there's a pattern error or no value
  if (control.hasError('pattern') || !value) return;

  // Remove validator before making the service call
  control.removeValidators([this.uniqueValidator]);
  control.updateValueAndValidity({ emitEvent: false });

  this.quotationService.validateRiskExistence({
    propertyId: value,
    subClassCode: this.selectedSubclassCode,
    withEffectFrom: this.formatDate(this.selectedEffectiveDate),
    withEffectTo: this.selectedCoverToDate,
    addOrEdit: 'A'
  }).pipe(
    debounceTime(500),
    distinctUntilChanged(),
    untilDestroyed(this)
  ).subscribe((response) => {
    const canProceed = response?._embedded?.duplicateAllowed;
    log.debug("Risk allowed>>>", canProceed);

    const isDuplicate = this.existingPropertyIds?.some(
      (existingValue) =>
        existingValue.replace(/\s+/g, '').toUpperCase() === value.replace(/\s+/g, '').toUpperCase()
    );

    log.debug("Existing risk>>>", isDuplicate);

    if (isDuplicate || !canProceed) {
      control.addValidators([this.uniqueValidator]);
    } else {
      control.removeValidators([this.uniqueValidator]);
    }

    control.updateValueAndValidity({ emitEvent: false });
  });
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
          description: rate.sectionDescription,
          section: {
            limitAmount: sumInsured || value,
            description: rate.sectionDescription,
            code: rate.sectionCode,
            isMandatory: "Y"
          },
          sectionType: rate.sectionType,
          riskCode: null,
          limitAmount: sumInsured || value,
          compute: "Y",
          dualBasis: "N"
        }
      })

      let risk: Risk = {
        propertyId: propertyId,
        withEffectFrom: this.selectedEffectiveDate,
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
          currencyRate: this.exchangeRate,
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
        log.debug("Selected Binder code", this.selectedBinderCode)
        this.currencyCode = this.selectedBinder.currency_code

        if (this.currencyCode) {
          this.fetchExchangeRate()
        }
        return forkJoin([
          this.quotationService.getTaxes(productCode, subClassCode),
          this.subclassCoverTypesService.getCoverTypeSections(subClassCode, this.selectedBinderCode)
        ])
      }),
      untilDestroyed(this)
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
      sessionStorage.setItem('product', this.selectedProductCode);
      const quickQuoteDataModel = this.quickQuoteForm.getRawValue();
      log.debug('Form is valid, proceeding with premium computation...', quickQuoteDataModel);
      log.debug(
        'Mandatory sections: ',
        this.subclassSectionCoverList,
        this.mandatorySections
      );
      log.debug('Subclass Cover Types', this.subclassCoverType);
      log.debug('Selected binder ', this.binderList, this.selectedBinder);
      this.currencyCode = quickQuoteDataModel.currency.id;
      let quickQuoteData: QuickQuoteData = {
        effectiveDateFrom: quickQuoteDataModel.effectiveDate,
        carRegNo: quickQuoteDataModel?.carRegNo || quickQuoteDataModel?.riskId,
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
        existingClientSelected: null,
        selectedBinderCode: this.selectedBinderCode,
        selectedClient: null

      }


      this.mandatorySections = this.applicablePremiumRates.map(value => value.applicableRates)
      sessionStorage.setItem('mandatorySections', JSON.stringify(this.mandatorySections));
      this.premiumComputationRequest = {
        dateWithEffectFrom: this.selectedEffectiveDate,
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
          rate: this.exchangeRate,
        },
        risks: this.setRiskPremiumDto(),
      };
      sessionStorage.setItem(
        'premiumComputationRequest',
        JSON.stringify(this.premiumComputationRequest)
      );
      log.debug("Aggregated payload", this.premiumComputationRequest)


      return forkJoin([
        this.quotationService.premiumComputationEngine(this.premiumComputationRequest),
        this.quotationService.savePremiumComputationPayload(this.premiumComputationRequest)
      ])
        .subscribe({
          next: ([premiumResponse, payloadResponse]) => {
            log.debug('Data', premiumResponse);
            sessionStorage.setItem('quickQuoteData', JSON.stringify(quickQuoteData))
            const premiumResponseString = JSON.stringify(premiumResponse);
            sessionStorage.setItem('premiumResponse', premiumResponseString);

            this.computationPayloadCode = payloadResponse._embedded
            log.debug("Code returned after saving premium computation payload ", this.computationPayloadCode);


            quickQuoteData.computationPayloadCode = this.computationPayloadCode
            sessionStorage.setItem('quickQuoteData', JSON.stringify(quickQuoteData))
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

  
 fetchRegexPattern(productIndex: number, riskIndex: number) {
  this.quotationService
    .getRegexPatterns(this.selectedSubclassCode)
    .pipe(untilDestroyed(this))
    .subscribe({
      next: (response: any) => {
        this.regexPattern = response._embedded?.riskIdFormat;
        log.debug('New Regex Pattern', this.regexPattern);

        this.dynamicRegexPattern = this.regexPattern;

        const controlPath = ['products', productIndex, 'risks', riskIndex, 'carRegNo'];
        const control = this.quickQuoteForm.get(controlPath) as FormControl;

        if (control) {
          // Add your required validators here
          control.setValidators([
            Validators.required,
            Validators.pattern(this.dynamicRegexPattern)
          ]);

          control.updateValueAndValidity();
        }
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error.error.message
        );
      },
    });
}
getCarRegNoControl(productIndex: number, riskIndex: number): FormControl {
  return this.quickQuoteForm.get([
    'products',
    productIndex,
    'risks',
    riskIndex,
    'carRegNo'
  ]) as FormControl;
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
            error.error.message
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
            error.error.message
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
            error.error.message
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

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.userOrgDetails = response
          log.debug("User Organization Details  ", this.userOrgDetails);
          this.organizationId = this.userOrgDetails.organizationId
          if (this.organizationId) {
            // this.fetchExchangeRate()
          }
        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  fetchExchangeRate() {
    const quickQuoteDataModel = this.quickQuoteForm.getRawValue();
    // const formCurrencyCode = quickQuoteDataModel.currency.id;
    const currencyCode = this.currencyCode ;
    log.debug("Currency Code", currencyCode)
    this.quotationService
      .getExchangeRates(currencyCode, this.organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response
          log.debug("Exchange rate  ", this.exchangeRate);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

}
