import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
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
  NewPremiums,
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
  LimitsOfLiability,
  QuotationDetails,
  QuotationProduct,
  QuotationReportDto,
  RiskInformation,
  ShareQuoteDTO,
  Tax,
  TaxInformation,
  UserDetail,
} from '../../data/quotationsDTO';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service';
import { Router } from '@angular/router';
import { untilDestroyed } from '../../../../../../shared/services/until-destroyed';

import { firstValueFrom, forkJoin, mergeMap, Observable, Subject, tap, throwError } from 'rxjs';
import { NgxCurrencyConfig } from 'ngx-currency';
import { OccupationService } from '../../../../../../shared/services/setups/occupation/occupation.service';
import { OccupationDTO } from '../../../../../../shared/data/common/occupation-dto';
import { VesselTypesService } from '../../../setups/services/vessel-types/vessel-types.service';
import { Pagination } from '../../../../../../shared/data/common/pagination';
import { TableDetail } from '../../../../../../shared/data/table-detail';
import { MenuService } from 'src/app/features/base/services/menu.service';
import { SidebarMenu } from 'src/app/features/base/model/sidebar.menu';
import { debounceTime } from "rxjs/internal/operators/debounceTime";
import { distinctUntilChanged, map, takeUntil } from "rxjs/operators";
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import {
  ComputationPayloadDto,
  CoverType,
  Limit,
  PremiumComputationRequest,
  Product,
  ProductLevelPremium,
  ProductPremium,
  Risk,
  RiskLevelPremium
} from "../../data/premium-computation";
import { QuotationDetailsRequestDto } from "../../data/quotation-details";
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { ShareQuotesComponent } from '../share-quotes/share-quotes.component';
import { EmailDto, SmsDto, WhatsappDto } from "../../../../../../shared/data/common/email-dto";
import { NotificationService } from "../../services/notification/notification.service";
import { SessionStorageService } from "../../../../../../shared/services/session-storage/session-storage.service";
import { OrganizationDTO } from "../../../../../crm/data/organization-dto";

import { OrganizationService } from "../../../../../crm/services/organization.service";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';

const log = new Logger('QuickQuoteFormComponent');

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css'],
})
export class QuickQuoteFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('calendar', { static: true }) calendar: Calendar;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('closebutton') closebutton;
  @ViewChild('shareQuoteModal') shareQuoteModal!: ElementRef;
  @ViewChild(ShareQuotesComponent) shareQuotes!: ShareQuotesComponent;


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
  selectedProducts: Products[] = []
  previousSelected: Products[] = [];

  productRiskFields: DynamicRiskField[][] = [];
  expandedQuoteStates: boolean[] = [];
  expandedComparisonStates: boolean[] = [];
  expandedCoverTypeIndexes: (number | null)[] = [];
  currencySymbol: string;


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
  dateFormat: string = 'dd-MMM-yyyy'; // Default format
  primeNgDateFormat: string = 'dd-M-yy'; // PrimeNG format
  branchList: OrganizationBranchDto[];
  branchDescriptionArray: any = [];

  coverFromDate: Date;
  coverToDate: string;
  passedCoverToDate: any;
  years: number[] = [];

  carRegNoValue: string;
  dynamicRegexPattern: string;
  carRegNoHasError: boolean = false;
  passedQuotationCode: string;
  passedNewClientDetails: any;
  expiryPeriod: any;
  propertyId: any;
  premiumList: Premiums[] = [];
  @ViewChild('dt1') dt1: Table | undefined;
  component: {
    code: number;
    date_with_effect_from: string;
    date_with_effect_to: string;
    bind_remarks: string;
  };

  passedSections: any[] = [];
  existingPropertyIds: string[] = [];
  regexPattern: any;
  defaultCurrencyName: any;
  minDate: Date | undefined;
  currencyDelimiter: any;
  defaultCurrencySymbol: any;
  selectedCurrencySymbol: any;
  coverFrom: any;

  selectedEffectiveDate: any;
  todaysDate: string;
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
  taxList: Tax[] = [];

  isReturnToQuickQuote: boolean;
  userCode: number;
  userOrgDetails: UserDetail;
  organizationId: number;
  exchangeRate: number;

  applicablePremiumRates: any
  premiumComputationResponse: ProductLevelPremium = null
  selectedProductCovers: ProductPremium[] = [];
  canMoveToNextScreen = false;
  currentSelectedRisk: any
  currentComputationPayload: PremiumComputationRequest = null
  premiumComputationPayloadToShare: ProductLevelPremium = null
  selectedProductIndex: number = null
  selectedRiskIndex: number = null
  selectedRiskGroup: AbstractControl<any, any>;
  quotationObject: QuotationDetails;
  currentExpandedIndex: number | null = null;
  productToDelete: AbstractControl<any, any> = null;
  productIndexToDelete: number = null;
  productSearch: string = '';
  filteredProducts: Products[] = [];
  searchChanged = new Subject<string>();
  destroy$ = new Subject<void>();
  previewVisible = false;
  pdfSrc: SafeResourceUrl | null = null;
  reportDetails: any;
  ticketStatus: string


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
    public premiumRateService: PremiumRateService,
    public globalMessagingService: GlobalMessagingService,
    private occupationService: OccupationService,
    private vesselTypesService: VesselTypesService,
    private spinner: NgxSpinnerService,
    private menuService: MenuService,
    private notificationService: NotificationService,
    private sessionStorageService: SessionStorageService,
    private sanitizer: DomSanitizer
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
    this.ticketStatus = sessionStorage.getItem('ticketStatus');

  }

  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
  }

  //
  toggleCoverType(productIndex: number, riskIndex: number): void {
    const current = this.expandedCoverTypeIndexes[productIndex];
    this.expandedCoverTypeIndexes[productIndex] = current === riskIndex ? null : riskIndex;
    log.debug('expandedCoverTypeIndexes', this.expandedCoverTypeIndexes)
  }

  ngOnInit(): void {
    const savedFlag = sessionStorage.getItem("canMoveToNextScreen");
    if (savedFlag !== null) {
      this.canMoveToNextScreen = JSON.parse(savedFlag);
    }
    this.LoadAllFormFields();
    this.loadAllproducts();
    this.quickQuoteForm = this.fb.group({
      product: [[]],
      effectiveDate: [new Date()],
      quotComment: [''],
      products: this.fb.array([])
    });
    this.loadAllCurrencies()
    const organization = this.sessionStorageService.getItem("organizationDetails") as OrganizationDTO;
    if (organization) {
      this.organizationId = organization.id
    }
    this.getuser()
    this.searchChanged.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchText => {
      this.filterProducts(searchText);
    });
    const savedState = sessionStorage.getItem('savedProductsState');
    log.debug("PRODUCT SAVED STATE", savedState)
    if (savedState) {
      const parsed = JSON.parse(savedState);
      this.selectedProducts = parsed.selectedProducts;
      this.previousSelected = JSON.parse(JSON.stringify(parsed.selectedProducts));

      log.debug("selectedProducts === previousSelected?", this.selectedProducts === this.previousSelected); // should be false

      log.debug("previous selected ", this.previousSelected);
      log.debug("Form array ", parsed.formArray);
      log.debug("product array ", this.selectedProducts);

      // Parse the effective date properly
      const savedEffectiveDate = parsed.formArray.effectiveDate;
      const parsedEffectiveDate = this.parseDate(savedEffectiveDate) || new Date();
      log.debug("Saved effective date:", savedEffectiveDate, "Parsed:", parsedEffectiveDate);

      // Patch top-level fields
      this.quickQuoteForm.patchValue({
        product: parsed.formArray.product || [],
        quotComment: parsed.formArray.quotComment || '',
        effectiveDate: parsedEffectiveDate
      });


      // Wait for all async loads to finish
      const productLoaders = parsed.formArray.products.map(async (product: any) => {
        const [riskFields, subclasses] = await forkJoin([
          this.getRiskFieldsForProduct(product.code),
          this.subclassService.getProductSubclasses(product.code)
        ]).toPromise();

        // Save subclasses for the product
        this.productSubclassesMap[product.code] = subclasses.map(value => ({
          ...value,
          description: this.capitalizeWord(value.description),
        }));

        const productGroup = this.fb.group({
          code: [product.code],
          expiry: [product.expiry],
          effectiveTo: [product.effectiveTo],
          description: [product.description],
          risks: this.fb.array([]),
        });

        const risksArray = productGroup.get('risks') as FormArray;
        product.risks.forEach((savedRisk: any, index: number) => {
          const riskGroup = this.createRiskGroup(riskFields, product.code, index + 1);

          Object.keys(savedRisk).forEach(key => {
            if (riskGroup.get(key)) {
              riskGroup.get(key)?.setValue(savedRisk[key]);
            }
          });

          risksArray.push(riskGroup);
        });

        this.productsFormArray.push(productGroup);
        this.productRiskFields[this.productsFormArray.length - 1] = riskFields;
      });

      Promise.all(productLoaders).then(() => {

      });
    }
    this.premiumComputationResponse = JSON.parse(sessionStorage.getItem('premiumComputationResponse'))
    log.debug("Premium Computation:", this.premiumComputationResponse)

    this.quotationObject = JSON.parse(sessionStorage.getItem('quotationObject'))
    log.debug("Quotation object", this.quotationObject)
    this.quotationNo = this.quotationObject?.quotationNo
    this.quotationCode = this.quotationObject?.code
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        // this.formData && this.loadAllproducts();

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
  }

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
        untilDestroyed(this))
      .subscribe((data) => {
        this.products = data;
        this.filteredProducts = this.products
      });
  }
  // filterProducts() {
  //   const search = this.productSearch.toLowerCase();
  //   log.debug("Search product", this.productSearch)
  //   this.filteredProducts = this.products.filter(p =>
  //     p.description.toLowerCase().includes(search)
  //   );
  // }
  // onSearchChange(search: string) {
  //   log.debug('search word', search)
  //   this.searchChanged.next(search);
  // }
  onInputChange(value: string) {
    log.debug('search word', value)

    this.searchChanged.next(value);
  }
  filterProducts(searchText: string) {
    const search = searchText.toLowerCase();
    log.debug("Search product", search);
    this.filteredProducts = this.products.filter(p =>
      p.description.toLowerCase().includes(search)
    );
    log.debug("filtered products:", this.filteredProducts)
  }
  get productsFormArray(): FormArray {
    return this.quickQuoteForm.get('products') as FormArray;
  }

  getRisks(productIndex: number): FormArray {
    return this.productsFormArray.at(productIndex).get('risks') as FormArray;

  }

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

  private handleSingleSubclassLogic(
    subclass: any,
    productCode: number,
    group: { [key: string]: AbstractControl }
  ): void {
    const subClassCode = subclass.code;

    this.binderService.getAllBindersQuick(subClassCode).pipe(
      mergeMap(binders => {
        this.binderList = binders._embedded.binder_dto_list;
        const defaultBinder = this.binderList.find((binder: { is_default: string }) =>
          binder?.is_default === 'Y'
        ) as Binders;
        group['applicableBinder'].setValue(defaultBinder);
        this.currencyCode = defaultBinder?.currency_code;

        if (this.currencyCode) {
          this.fetchExchangeRate();
        }
        return forkJoin([
          this.quotationService.getTaxes(productCode, subClassCode),
          this.subclassCoverTypesService.getCoverTypeSections(subClassCode, defaultBinder.code)
        ]);
      }),
      untilDestroyed(this)
    ).subscribe(([taxes, coverTypeSections]) => {
      const taxList = taxes as Tax[];
      this.taxList = taxList;
      log.debug("CoverTypeSections single subclasss", coverTypeSections)
      log.debug("taxes single subclasss", taxList)
      const coverTypeSectionList = coverTypeSections._embedded
      log.debug("covertypesection list;", coverTypeSectionList)
      // sessionStorage.setItem("covertypeSections", JSON.stringify(coverTypeSectionList))
      sessionStorage.setItem(
        `covertypeSections-${subClassCode}`,
        JSON.stringify(coverTypeSectionList)
      );
      group['applicableTaxes'].setValue(taxList);
      log.debug("Tax list", taxList)

      group['applicableCoverTypes'].setValue(coverTypeSections._embedded);
    });
  }


  // Dynamically creates a FormGroup for a risk using provided fields
  createRiskGroup(
    riskFields: DynamicRiskField[],
    productCode: number,
    nextRiskIndex: number
  ): FormGroup {
    const group: { [key: string]: AbstractControl } = {};
    const subclasses = this.productSubclassesMap?.[productCode] || [];
    const hasSingleSubclass = subclasses.length === 1;
    const singleSubclass = hasSingleSubclass ? subclasses[0] : null;
    riskFields.forEach(field => {
      const isUseOfProperty = field.name === 'useOfProperty';
      group[field.name] = new FormControl(
        {
          value: isUseOfProperty && singleSubclass ? singleSubclass : '',
          disabled: field.disabled
        },
        field.isMandatory === 'Y' ? Validators.required : []
      );
    });
    group['applicableTaxes'] = new FormControl(null);
    group['applicableBinder'] = new FormControl(null);
    group['applicableCoverTypes'] = new FormControl(null);
    group['riskCode'] = new FormControl(`#${productCode}${nextRiskIndex}`);
    if (hasSingleSubclass) {
      this.handleSingleSubclassLogic(singleSubclass, productCode, group);
    }
    return new FormGroup(group);
  }


  isProductSelected(product: any): boolean {
    return this.selectedProducts.some(p => p.code === product.code);
  }
  onCheckboxChange(event: Event, product: any) {
    log.debug("previousSelected on check", this.previousSelected)

    const checked = (event.target as HTMLInputElement).checked;
    log.debug("checked", checked)
    if (checked) {
      // Avoid duplicate entries
      log.debug("checked", this.selectedProducts)

      const exists = this.selectedProducts.some(p => p.code === product.code);
      if (!exists) {
        this.selectedProducts.push(product);
      }
    } else {
      // Remove by code instead of reference
      this.selectedProducts = this.selectedProducts.filter(p => p.code !== product.code);
      log.debug("checked", this.selectedProducts)

    }

    const fakeEvent = { value: this.selectedProducts };
    this.getSelectedProducts(fakeEvent);
  }



  // When products are selected from multi-select
  getSelectedProducts(event: any) {

    const previousCodes = this.previousSelected.map(p => p.code);
    log.debug("previousCodes", previousCodes)
    log.debug("previousSelected", this.previousSelected)

    const currentSelection = event.value as Products[];
    const currentCodes = currentSelection.map(p => p.code);
    log.debug("currentCodest", currentCodes)
    log.debug("previousSelected", this.previousSelected)

    // Find added and removed products
    const addedProduct = currentSelection.find(p => !previousCodes.includes(p.code));
    const removedProduct = this.previousSelected.find(p => !currentCodes.includes(p.code));
    log.debug("added product", addedProduct)
    log.debug("removedProduct", removedProduct)

    if (removedProduct) {
      // Remove unselected products from FormArray
      const index = this.productsFormArray.controls.findIndex(
        ctrl => ctrl.get('code')?.value === removedProduct.code
      );
      this.removeProductCoverTypes(removedProduct.code)
      if (index !== -1) {
        this.productsFormArray.removeAt(index);
      }
      if (this.productsFormArray.controls.length == 0) {
        this.premiumComputationResponse = null
        this.premiumComputationPayloadToShare = null
      }
      this.checkCanMoveToNextScreen()

    }

    if (addedProduct) {
      log.debug("Added product Array:", addedProduct)
      const effectiveDate = this.quickQuoteForm.get('effectiveDate')?.value || new Date();
      forkJoin(([
        this.subclassService.getProductSubclasses(addedProduct.code),
        this.getRiskFieldsForProduct(addedProduct.code),
        this.productService.getCoverToDate(this.formatDate(new Date(effectiveDate)), addedProduct.code)
      ])).pipe(untilDestroyed(this))
        .subscribe(([subclasses, riskFields, coverTo]) => {
          const productGroup = this.fb.group({
            code: [addedProduct.code],
            expiry: [addedProduct?.expires],
            effectiveTo: coverTo._embedded[0].coverToDate,
            description: [addedProduct.description],
            risks: this.fb.array([])
          });
          this.productSubclassesMap[addedProduct.code] = subclasses.map(value => ({
            ...value,
            description: this.capitalizeWord(value.description),
          }));
          this.productsFormArray.push(productGroup);
          const index = this.productsFormArray.controls.findIndex(
            ctrl => ctrl.get('code')?.value === addedProduct.code
          );
          const productIndex = index
          log.debug("PRODUCT INDEX", index);
          log.debug("PRODUCT ARRAY CONTENTS", this.productsFormArray.value);
          this.expandedQuoteStates = this.productsFormArray.controls.map((_, index) => index === 0);
          const risksArray = productGroup.get('risks') as FormArray;
          const nextRiskIndex = risksArray.length + 1;
          const riskIndex = risksArray.length
          risksArray.push(this.createRiskGroup(riskFields, addedProduct.code, nextRiskIndex));
          this.productRiskFields[this.productsFormArray.length - 1] = riskFields;
        })

      //this.getProductSubclass(addedProduct.code);
      //TODO check this hardCoding
      if (addedProduct.code === 8293) {
        log.debug("years endpoint called for motor product")
        this.populateYears();
      }
    }
    this.selectedProducts = [...currentSelection];
    this.previousSelected = [...currentSelection];
    this.canMoveToNextScreen = false
    log.debug("FormArray now >>>>", this.productsFormArray);
  }

  // Add risk row dynamically
  addRisk(productIndex: number) {
    const productGroup = this.productsFormArray.at(productIndex);
    const risksArray = productGroup.get('risks') as FormArray;
    const productCode = productGroup.get('code')?.value;
    const nextRiskIndex = risksArray.length + 1;
    this.getRiskFieldsForProduct(productCode).subscribe((riskFields: DynamicRiskField[]) => {
      const newRiskGroup = this.createRiskGroup(riskFields, productCode, nextRiskIndex);
      risksArray.push(newRiskGroup);
    });
  }

  fetchProductRiskIndex(riskControl: AbstractControl, productIndex: number, riskIndex: number) {
    this.selectedProductIndex = productIndex
    this.selectedRiskIndex = riskIndex
    this.selectedRiskGroup = riskControl
    log.debug("PRODUCT INDEX", this.selectedProductIndex)
    log.debug("RISK INDEX", this.selectedRiskIndex)
    log.debug("RISK GROUP", riskControl)

  }

  // Remove a risk row
  deleteRisk() {
    const riskControl = this.selectedRiskGroup
    log.debug("Removing risk>>>", riskControl.value)
    if (this.premiumComputationResponse) {
      this.premiumComputationResponse = {
        productLevelPremiums: this.premiumComputationResponse
          .productLevelPremiums.map((value) => {
            return {
              ...value,
              riskLevelPremiums: value.riskLevelPremiums
                .filter(riskPremium => riskPremium.code !== riskControl.value.riskCode)
            }
          })
      }
    }
    this.getRisks(this.selectedProductIndex).removeAt(this.selectedRiskIndex);
    log.debug("FORM ARRAY:", this.productsFormArray)
  }

  // Prepare product for deletion
  prepareProductForDeletion(product: AbstractControl, productIndex: number) {
    this.productToDelete = product;
    this.productIndexToDelete = productIndex;
    log.debug("Product prepared for deletion:", product.value, "at index:", productIndex);
  }

  //delete product
  deleteProduct() {
    if (this.productToDelete === null || this.productIndexToDelete === null) {
      log.debug("No product selected for deletion");
      return;
    }

    const product = this.productToDelete;
    const productIndex = this.productIndexToDelete;
    const deletedCode = product.value.code;
    log.debug("PRODUCT to be deleted", deletedCode);

    // Check if product exists in productsFormArray
    const existsInFormArray = this.productsFormArray.at(productIndex)?.value?.code === deletedCode;
    log.debug("Product exists in FormArray:", existsInFormArray);

    // Get quotationObject from sessionStorage
    const quotationDetailsStr = sessionStorage.getItem('quotationObject');
    const quotationObject = quotationDetailsStr ? JSON.parse(quotationDetailsStr) : null;
    log.debug('quotationObject from session storage:', quotationObject);

    // Check if product exists in quotationObject
    let existsInQuotationObject = false;
    let targetCode: number | null = null;

    if (quotationObject && quotationObject.quotationProducts) {
      const matchingProduct = quotationObject.quotationProducts.find((qp: any) =>
        qp.productCode === deletedCode
      );
      existsInQuotationObject = !!matchingProduct;
      if (matchingProduct) {
        targetCode = matchingProduct.code;
        log.debug("Found matching product code in quotationObject:", targetCode);
      }
    }
    log.debug("Product exists in quotationObject:", existsInQuotationObject);

    // If product exists only in FormArray, remove it locally
    if (existsInFormArray && !existsInQuotationObject) {
      log.debug("Product exists only in FormArray, removing locally...");

      // Remove from UI state
      this.previousSelected = this.previousSelected.filter(value => value.code !== deletedCode);
      this.removeProductCoverTypes(product.value.code);
      this.selectedProducts = this.selectedProducts.filter(p => p.code !== deletedCode);
      this.selectedProductCovers = this.selectedProductCovers.filter(p => p.code !== deletedCode);

      // Update form
      this.quickQuoteForm.patchValue({
        product: this.previousSelected
      });

      // Remove from FormArray
      this.productsFormArray.removeAt(productIndex);

      this.globalMessagingService.displaySuccessMessage('Success', 'Product removed successfully');
      log.debug("Product removed from FormArray and cover types cleared");

      // Clear the stored references after successful local deletion
      this.productToDelete = null;
      this.productIndexToDelete = null;
      return;
    }

    // If product doesn't exist in FormArray, log error and return
    if (!existsInFormArray) {
      log.debug("Product not found in FormArray");
      this.globalMessagingService.displayErrorMessage('Error', 'Product not found in form');
      return;
    }

    // product exists in both FormArray and quotationObject and ready for deletion
    const quotationCode = Number(sessionStorage.getItem('quotationCode')) || 0;

    const quickQuotePayloadStr = sessionStorage.getItem('quickQuotePayload');
    const quickQuotePayload = quickQuotePayloadStr ? JSON.parse(quickQuotePayloadStr) : null;

    if (!quickQuotePayload || !quickQuotePayload.products || quickQuotePayload.products.length === 0) {
      log.debug('No products found in session quickQuotePayload');
      return;
    }

    if (!quotationObject) {
      this.globalMessagingService.displayErrorMessage('Error', 'No products found in session quickQuotePayload');
      log.debug('No products found in session quickQuotePayload');
      return;
    }

    // prevent deletion if only one product exists 
    if (quotationObject && quotationObject.quotationProducts && quotationObject.quotationProducts.length === 1) {
      log.debug("Delete not allowed - quotation only has one product");
      this.globalMessagingService.displayErrorMessage('Error', 'Delete Not Allowed, A quotation must have at least one product.');
      return;
    }

    // find the product to delete from the stored payload
    const targetProduct = quickQuotePayload.products.find((p: any) => p.code === deletedCode);

    if (!targetProduct) {
      log.debug("Product not found in quickQuotePayload:", deletedCode);
      return;
    }

    const quotationProductCode = targetCode;

    this.quotationService.deleteQuotationProduct(quotationCode, quotationProductCode).subscribe({
      next: (response: any) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Product deleted successfully');

        // Update UI state and form data locally after successful deletion
        this.previousSelected = this.previousSelected.filter(value => value.code !== deletedCode);
        this.removeProductCoverTypes(product.value.code);

        this.selectedProducts = this.selectedProducts.filter(p => p.code !== deletedCode);
        this.selectedProductCovers = this.selectedProductCovers.filter(p => p.code !== deletedCode);

        this.quickQuoteForm.patchValue({
          product: this.previousSelected
        });

        this.productsFormArray.removeAt(productIndex);

        if (this.premiumComputationResponse?.productLevelPremiums?.length > 0) {
          this.canMoveToNextScreen = true;
        } else {
          this.premiumComputationResponse = null;
        }

        //remove from session payload
        quickQuotePayload.products = quickQuotePayload.products.filter((p: any) => p.code !== deletedCode);
        sessionStorage.setItem('quickQuotePayload', JSON.stringify(quickQuotePayload));

        // Remove from quotationObject in sessionStorage
        const quotationDetailsStr = sessionStorage.getItem('quotationObject');
        if (quotationDetailsStr) {
          const quotationObject = JSON.parse(quotationDetailsStr);
          if (quotationObject && quotationObject.quotationProducts) {
            quotationObject.quotationProducts = quotationObject.quotationProducts.filter(
              (qp: any) => qp.productCode !== deletedCode
            );
            sessionStorage.setItem('quotationObject', JSON.stringify(quotationObject));
            log.debug('Removed product from quotationObject in sessionStorage:', deletedCode);
          }
        }

        // Update savedProductsState in sessionStorage
        const savedStateStr = sessionStorage.getItem('savedProductsState');
        if (savedStateStr) {
          const savedState = JSON.parse(savedStateStr);
          if (savedState) {
            // Update selectedProducts in saved state
            savedState.selectedProducts = savedState.selectedProducts.filter((p: any) => p.code !== deletedCode);

            // Update form array products in saved state
            if (savedState.formArray && savedState.formArray.products) {
              savedState.formArray.products = savedState.formArray.products.filter((p: any) => p.code !== deletedCode);
            }

            sessionStorage.setItem('savedProductsState', JSON.stringify(savedState));
            log.debug('Updated savedProductsState in sessionStorage after product deletion:', deletedCode);
          }
        }

        // Update selectedCovers in sessionStorage
        const selectedCoversStr = sessionStorage.getItem('selectedCovers');
        if (selectedCoversStr) {
          const selectedCovers = JSON.parse(selectedCoversStr);
          if (selectedCovers && selectedCovers.productLevelPremiums) {
            selectedCovers.productLevelPremiums = selectedCovers.productLevelPremiums.filter(
              (p: any) => p.code !== deletedCode
            );
            sessionStorage.setItem('selectedCovers', JSON.stringify(selectedCovers));
            log.debug('Updated selectedCovers in sessionStorage after product deletion:', deletedCode);
          }
        }

        // Remove  cover selections
        const deletedProductRisks = this.premiumComputationResponse?.productLevelPremiums
          ?.find(p => p.code === deletedCode)?.riskLevelPremiums || [];

        deletedProductRisks.forEach(risk => {
          // Remove default covers for each risk
          const defaultCoverKey = `defaultCovers-${risk.code}`;
          if (sessionStorage.getItem(defaultCoverKey)) {
            sessionStorage.removeItem(defaultCoverKey);
            log.debug(`Removed ${defaultCoverKey} from sessionStorage`);
          }

          // Remove selected covers for each risk
          const selectedCoverKey = `selectedCover-${risk.code}`;
          if (sessionStorage.getItem(selectedCoverKey)) {
            sessionStorage.removeItem(selectedCoverKey);
            log.debug(`Removed ${selectedCoverKey} from sessionStorage`);
          }

          // Remove cover type sections for each risk's subclass
          const coverTypeSectionsKey = `covertypeSections-${risk.selectCoverType?.subclassCode}`;
          if (sessionStorage.getItem(coverTypeSectionsKey)) {
            sessionStorage.removeItem(coverTypeSectionsKey);
            log.debug(`Removed ${coverTypeSectionsKey} from sessionStorage`);
          }
        });

        // Update premiumComputationResponse in sessionStorage
        if (this.premiumComputationResponse) {
          sessionStorage.setItem('premiumComputationResponse', JSON.stringify(this.premiumComputationResponse));
          log.debug('Updated premiumComputationResponse in sessionStorage after product deletion');
        }

        // Clear the stored references after successful deletion
        this.productToDelete = null;
        this.productIndexToDelete = null;
      },
      error: (error: any) => {
        log.error("Failed to delete quotation product:", error);
        this.globalMessagingService.displayErrorMessage('Error', 'Unable to delete product. Please try again later');

        // Clear the stored references on error
        this.productToDelete = null;
        this.productIndexToDelete = null;
      }
    });
  }

  removeProductCoverTypes(code: number) {
    if (this.premiumComputationResponse) {
      this.premiumComputationResponse = {
        productLevelPremiums: this.premiumComputationResponse
          .productLevelPremiums.filter(value => value.code !== code)
      }
    }
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

  private handleInvalidRiskForm(): void {
    this.markAllFieldsAsTouched(this.quickQuoteForm);
    this.productsFormArray.controls.forEach((group, index) => {
      if (group.invalid) {
        log.debug("Invalid group detected:", group);
        this.expandedQuoteStates[index] = true;
      } else {
        this.expandedQuoteStates[index] = false;
      }
    });

  }

  private handleValidRiskForm(): void {
    log.debug("Form submission payload:", this.quickQuoteForm.value);
    const computationRequest = this.computationPayload();
    log.debug("Premium computation payload:", computationRequest);
    this.performComputation(computationRequest);
    this.productsFormArray.controls.forEach((group, index) => {
      if (group.valid) {
        this.expandedQuoteStates[index] = false;
      }
    });
  }

  onSubmit() {
    if (this.quickQuoteForm.invalid) {
      this.handleInvalidRiskForm();
      return;
    }
    this.handleValidRiskForm();
    this.checkCanMoveToNextScreen()
  }


  // performComputation(computationPayload: PremiumComputationRequest) {
  //   this.quotationService.premiumComputationEngine(computationPayload).pipe(
  //     untilDestroyed(this)
  //   ).subscribe({
  //     next: (response) => {
  //       const riskLevelPremiums = this.selectedProductCovers.flatMap(value => value.riskLevelPremiums);
  //       this.premiumComputationResponse = response;
  //       log.debug("Premium computation response:", this.premiumComputationResponse)
  //       const productLevelPremiums = response.productLevelPremiums;
  //       this.expandedComparisonStates = productLevelPremiums.map(() => true);
  //       this.expandedCoverTypeIndexes = productLevelPremiums.map(product =>
  //         product.riskLevelPremiums.length > 0 ? 0 : null
  //       );
  //       riskLevelPremiums?.forEach(selected => {
  //         this.premiumComputationResponse.productLevelPremiums.forEach(premium => {
  //           const match = premium.riskLevelPremiums.find(risk => risk.code === selected.code);
  //           if (match) {
  //             match.selectCoverType = selected.selectCoverType;
  //           }
  //         });
  //       });
  //       this.canMoveToNextScreen = false
  //       this.globalMessagingService.displaySuccessMessage('Success', 'Premium computed successfully');
  //       this.cdr.markForCheck();
  //     },
  //     error: () => {
  //       this.globalMessagingService.displayErrorMessage('Error', 'Error during computation');
  //     }
  //   });
  // }

  /**
   * Performs premium computation using the provided payload.
   * - Calls the computation service and merges new results with existing data.
   * - Updates or adds product risks as needed.
   * - Expands updated products in the UI and displays status messages.
   *
   * @method performComputation
   * @param {PremiumComputationRequest} computationPayload - Payload used for premium computation.
   * @returns {void}
   */

  performComputation(computationPayload: PremiumComputationRequest) {
    this.quotationService.premiumComputationEngine(computationPayload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response) => {
          const newProducts = response.productLevelPremiums;

          if (!this.premiumComputationResponse) {
            // First computation
            this.premiumComputationResponse = response;
          } else {
            const existingProducts = this.premiumComputationResponse.productLevelPremiums || [];

            newProducts.forEach(newProduct => {
              const existingIndex = existingProducts.findIndex(p => p.code === newProduct.code);
              if (existingIndex !== -1) {
                const existingProduct = existingProducts[existingIndex];

                // Merge risks within the same product
                const existingRisks = existingProduct.riskLevelPremiums || [];
                const newRisks = newProduct.riskLevelPremiums || [];

                newRisks.forEach(newRisk => {
                  const riskIndex = existingRisks.findIndex(r => r.code === newRisk.code);
                  if (riskIndex !== -1) {
                    existingRisks[riskIndex] = newRisk; // Update existing risk
                  } else {
                    existingRisks.push(newRisk); // Add new risk
                  }
                });

                existingProduct.riskLevelPremiums = existingRisks;
                existingProducts[existingIndex] = existingProduct;
              } else {
                existingProducts.push(newProduct);
              }
            });


            this.premiumComputationResponse.productLevelPremiums = existingProducts;
          }

          // Optional: expand only new/updated products in UI
          this.expandedComparisonStates = this.premiumComputationResponse.productLevelPremiums.map(() => true);
          this.expandedCoverTypeIndexes = this.premiumComputationResponse.productLevelPremiums.map(product =>
            product.riskLevelPremiums.length > 0 ? 0 : null
          );
          this.globalMessagingService.displaySuccessMessage('Success', 'Premium computed successfully');
          this.cdr.markForCheck();
        },
        error: () => {
          this.globalMessagingService.displayErrorMessage('Error', 'Error during computation');
        }
      });
  }

  toggleQuoteExpand(index: number) {
    // Collapse if clicking the already expanded item
    if (this.currentExpandedIndex === index) {
      this.expandedQuoteStates[index] = false;
      this.currentExpandedIndex = null;
    }
    // Expand the new item and collapse others
    else {
      // Collapse previously expanded item
      if (this.currentExpandedIndex !== null) {
        this.expandedQuoteStates[this.currentExpandedIndex] = false;
      }

      // Expand the new one
      this.expandedQuoteStates[index] = true;
      this.currentExpandedIndex = index;
    }
  }

  toggleCoverExpand(productIndex: number): void {
    this.expandedComparisonStates[productIndex] = !this.expandedComparisonStates[productIndex];
  }

  // computationPayload(): PremiumComputationRequest {
  //   const formValues = this.quickQuoteForm.getRawValue();
  //   log.debug("QUICK QUOTE FORM VALUES B4VCOMP", formValues)
  //   const withEffectFrom = new Date(formValues.effectiveDate);
  //   let payload = {
  //     transactionStatus: "NB",
  //     quotationStatus: "Draft",
  //     frequencyOfPayment: "A",
  //     interfaceType: null,
  //     entityUniqueCode: null,
  //     coinsurancePercentage: null,
  //     coinsuranceLeader: null,
  //     age: null,
  //     underwritingYear: withEffectFrom.getFullYear(),
  //     dateWithEffectTo: this.formatDate(new Date()),
  //     dateWithEffectFrom: this.formatDate(withEffectFrom),
  //     products: this.getProductPayload(formValues),
  //     currency: {
  //       rate: this.exchangeRate
  //     }
  //   };
  //   this.currentComputationPayload = payload
  //   return payload;
  // }
  // computationPayload(): PremiumComputationRequest {
  //   const formValues = this.quickQuoteForm.getRawValue();
  //   const withEffectFrom = new Date(formValues.effectiveDate);

  //   const previousProducts = this.premiumComputationResponse?.productLevelPremiums || [];
  //   const formProducts = formValues.products;

  //   const productsToInclude = formProducts.filter(p => {
  //     const existing = previousProducts.find(prev => prev.code === p.code);
  //     if (!existing) return true;

  //     // 🧠 Compare limit amounts between current (request) and previous (response)
  //     const prevLimits = existing.riskLevelPremiums
  //       .flatMap(r => r.coverTypeDetails)
  //       .flatMap(ct => ct.limitPremium || [])
  //       .map(lp => ({
  //         sectCode: lp.sectCode,
  //         limitAmount: lp.limitAmount
  //       }));
  //     log.debug("Previous limits:", prevLimits)
  //     const currentLimits = (p.risks || [])
  //       .flatMap(r => r.subclassCoverTypeDto || [])
  //       .flatMap(ct => ct.limits || [])
  //       .map(l => ({
  //         sectCode: l.section?.code,
  //         limitAmount: l.limitAmount
  //       }));
  //     log.debug("Current  limits:", currentLimits)

  //     const hasChangedLimit = currentLimits.some(curr => {
  //       const prev = prevLimits.find(pl => pl.sectCode === curr.sectCode);
  //       return !prev || prev.limitAmount !== curr.limitAmount;
  //     });

  //     return hasChangedLimit;
  //   });



  //   log.debug("Products to include:", productsToInclude)
  //   // ✅ If none detected, compute all (first run)
  //   const finalProducts = productsToInclude.length ? productsToInclude : formProducts;

  //   const payload: PremiumComputationRequest = {
  //     transactionStatus: "NB",
  //     quotationStatus: "Draft",
  //     frequencyOfPayment: "A",
  //     interfaceType: null,
  //     entityUniqueCode: null,
  //     coinsurancePercentage: null,
  //     coinsuranceLeader: null,
  //     age: null,
  //     underwritingYear: withEffectFrom.getFullYear(),
  //     dateWithEffectTo: this.formatDate(new Date()),
  //     dateWithEffectFrom: this.formatDate(withEffectFrom),
  //     products: this.getProductPayload({ ...formValues, products: finalProducts }),
  //     currency: { rate: this.exchangeRate }
  //   };

  //   this.currentComputationPayload = payload;
  //   return payload;
  // }

  /**
   * Builds the payload object required for premium computation based on the current form state.
   * - Extracts raw values from the 'quickQuoteForm'.
   * - Compares current form product data with previously computed products to determine what has changed.
   * - Detects new risks or modified cover limits for each product.
   * - Constructs a filtered list of products to include in the computation payload.
   * - If no changes are detected, includes all products by default.
   * - Prepares a complete `PremiumComputationRequest` object with quotation details, dates, products, and currency rate.
   * - Updates the current computation payload reference for potential reuse.
   *
   * @method computationPayload
   * @returns {PremiumComputationRequest} The formatted payload object to be sent for premium computation.
   */

  computationPayload(): PremiumComputationRequest {
    const formValues = this.quickQuoteForm.getRawValue();

    // Validate and parse effectiveDate - use user's selected date
    if (!formValues.effectiveDate) {
      // If no date is selected, throw an error - don't default
      this.globalMessagingService.displayErrorMessage('Error', 'Please select an effective date');
      throw new Error('Effective date is required');
    }

    const withEffectFrom = this.parseDate(formValues.effectiveDate);

    // Validate the parsed date
    if (!withEffectFrom || isNaN(withEffectFrom.getTime())) {
      log.error('Failed to parse effective date:', formValues.effectiveDate);
      this.globalMessagingService.displayErrorMessage('Error', 'Invalid effective date format. Please select a valid date.');
      throw new Error('Invalid effective date');
    }

    log.debug('Effective date for computation:', withEffectFrom);

    const previousProducts = this.premiumComputationResponse?.productLevelPremiums || [];
    const formProducts = formValues.products;

    const productsToInclude = formProducts
      .map(p => {
        const existing = previousProducts.find(prev => prev.code === p.code);
        if (!existing) {
          return p;
        }

        const prevLimits = existing.riskLevelPremiums
          .flatMap(r => r.coverTypeDetails)
          .flatMap(ct => ct.limitPremium || [])
          .map(lp => ({
            sectCode: lp.sectCode,
            limitAmount: lp.limitAmount
          }));

        const currentLimits = (p.risks || [])
          .flatMap(r => r.subclassCoverTypeDto || [])
          .flatMap(ct => ct.limits || [])
          .map(l => ({
            sectCode: l.section?.code,
            limitAmount: l.limitAmount
          }));

        const hasChangedLimit = currentLimits.some(curr => {
          const prev = prevLimits.find(pl => pl.sectCode === curr.sectCode);
          return !prev || prev.limitAmount !== curr.limitAmount;
        });

        const prevRiskCodes = existing.riskLevelPremiums.map(r => r.code);
        const newRisks = (p.risks || []).filter(
          r => !prevRiskCodes.includes(r.riskCode)
        );

        if (hasChangedLimit) return p;

        if (newRisks.length > 0) {
          return {
            ...p,
            risks: newRisks
          };
        }

        return null;
      })
      .filter(Boolean);

    const finalProducts = productsToInclude.length ? productsToInclude : formProducts;

    const payload: PremiumComputationRequest = {
      transactionStatus: "NB",
      quotationStatus: "Draft",
      frequencyOfPayment: "A",
      interfaceType: null,
      entityUniqueCode: null,
      coinsurancePercentage: null,
      coinsuranceLeader: null,
      age: null,
      underwritingYear: withEffectFrom.getFullYear(),
      dateWithEffectTo: this.formatDate(new Date()),
      dateWithEffectFrom: this.formatDate(withEffectFrom),
      products: this.getProductPayload({
        ...formValues,
        products: finalProducts
      }),
      currency: { rate: this.exchangeRate }
    };

    this.currentComputationPayload = payload;
    log.debug('Computation payload:', payload);
    return payload;
  }


  getProductPayload(formValues: any): Product[] {
    let productPayload: Product[] = []

    // Validate effectiveDate
    let effectiveDate: Date;
    if (!formValues.effectiveDate) {
      log.warn('No effective date in formValues, using current date');
      effectiveDate = new Date();
    } else if (formValues.effectiveDate instanceof Date) {
      effectiveDate = formValues.effectiveDate;
    } else {
      effectiveDate = new Date(formValues.effectiveDate);
    }

    // Validate the parsed date
    if (isNaN(effectiveDate.getTime())) {
      log.error('Invalid effective date in getProductPayload, using current date');
      effectiveDate = new Date();
    }

    for (let product of formValues.products) {
      // Validate product effectiveTo
      let effectiveTo: Date;
      if (!product.effectiveTo) {
        log.warn(`No effectiveTo for product ${product.code}, using current date`);
        effectiveTo = new Date();
      } else if (product.effectiveTo instanceof Date) {
        effectiveTo = product.effectiveTo;
      } else {
        effectiveTo = new Date(product.effectiveTo);
      }

      // Validate the parsed date
      if (isNaN(effectiveTo.getTime())) {
        log.error(`Invalid effectiveTo for product ${product.code}, using current date`);
        effectiveTo = new Date();
      }

      productPayload.push({
        code: product.code,
        description: product.description,
        expiryPeriod: product.expiry,
        withEffectFrom: this.formatDate(effectiveDate),
        withEffectTo: this.formatDate(effectiveTo),
        risks: this.getRiskPayload(product, effectiveDate)
      })
    }
    return productPayload
  }

  // getRiskPayload(product: any, effectiveDate): Risk[] {
  //   let riskPayload: Risk[] = []
  //   for (const [index, risk] of product.risks.entries()) {

  //     riskPayload.push({
  //       code: risk.riskCode,
  //       binderCode: risk?.applicableBinder?.code,
  //       sumInsured: risk?.selfDeclaredValue || risk?.value,
  //       useOfProperty: risk?.useOfProperty?.description,
  //       withEffectFrom: this.formatDate(new Date(effectiveDate)),
  //       withEffectTo: this.formatDate(new Date(product.effectiveTo)),
  //       propertyId: `Risk ${index + 1}`,
  //       prorata: "F",
  //       subclassSection: {
  //         code: risk?.useOfProperty?.code
  //       },
  //       taxes: risk.applicableTaxes.map((tax) => {
  //         return {
  //           taxRate: tax.taxRate,
  //           code: tax.code,
  //           taxCode: tax.taxCode,
  //           divisionFactor: tax.divisionFactor,
  //           applicationLevel: tax.applicationLevel,
  //           taxRateType: tax.taxRateType,
  //           rateDescription: tax.description
  //         }
  //       }),
  //       itemDescription: risk.description,
  //       noClaimDiscountLevel: 0,
  //       enforceCovertypeMinimumPremium: "N",
  //       binderDto: {
  //         code: risk?.applicableBinder?.code,
  //         currencyCode: risk?.applicableBinder?.currency_code,
  //         maxExposure: risk?.applicableBinder?.maximum_exposure,
  //         currencyRate: this.exchangeRate
  //       },
  //       subclassCoverTypeDto: this.getCoverTypePayload(risk)
  //     })
  //   }
  //   return riskPayload;
  // }
  getRiskPayload(product: any, effectiveDate): Risk[] {
    let riskPayload: Risk[] = [];

    // Validate effectiveDate parameter
    let validEffectiveDate: Date;
    if (!effectiveDate) {
      log.warn('No effectiveDate passed to getRiskPayload, using current date');
      validEffectiveDate = new Date();
    } else if (effectiveDate instanceof Date) {
      validEffectiveDate = effectiveDate;
    } else {
      validEffectiveDate = new Date(effectiveDate);
    }

    if (isNaN(validEffectiveDate.getTime())) {
      log.error('Invalid effectiveDate in getRiskPayload, using current date');
      validEffectiveDate = new Date();
    }

    // Validate product.effectiveTo
    let validEffectiveTo: Date;
    if (!product.effectiveTo) {
      log.warn(`No effectiveTo for product in getRiskPayload, using current date`);
      validEffectiveTo = new Date();
    } else if (product.effectiveTo instanceof Date) {
      validEffectiveTo = product.effectiveTo;
    } else {
      validEffectiveTo = new Date(product.effectiveTo);
    }

    if (isNaN(validEffectiveTo.getTime())) {
      log.error(`Invalid effectiveTo in getRiskPayload, using current date`);
      validEffectiveTo = new Date();
    }

    // Find previous product from computation response (if any)
    const previousProduct = this.premiumComputationResponse?.productLevelPremiums?.find(
      (prev) => prev.code === product.code
    );

    const existingRiskCount = previousProduct?.riskLevelPremiums?.length || 0;
    console.debug(
      `Existing risk count detected: ${existingRiskCount} for product code ${product.code}`
    );

    for (const [index, risk] of product.risks.entries()) {
      const riskNumber = existingRiskCount + index + 1; // continue numbering from previous count
      const propertyId = `Risk ${riskNumber}`;
      console.debug(`Assigning ${propertyId} for risk code ${risk?.riskCode}`);

      riskPayload.push({
        code: risk.riskCode,
        binderCode: risk?.applicableBinder?.code,
        sumInsured: risk?.selfDeclaredValue || risk?.value,
        useOfProperty: risk?.useOfProperty?.description,
        withEffectFrom: this.formatDate(validEffectiveDate),
        withEffectTo: this.formatDate(validEffectiveTo),
        propertyId,
        prorata: "F",
        subclassSection: {
          code: risk?.useOfProperty?.code
        },
        taxes: risk.applicableTaxes.map((tax) => ({
          taxRate: tax.taxRate,
          code: tax.code,
          taxCode: tax.taxCode,
          divisionFactor: tax.divisionFactor,
          applicationLevel: tax.applicationLevel,
          taxRateType: tax.taxRateType,
          rateDescription: tax.description,
          transactionCode: tax.trntCode
        })),
        itemDescription: risk.description,
        noClaimDiscountLevel: 0,
        enforceCovertypeMinimumPremium: "N",
        binderDto: {
          code: risk?.applicableBinder?.code,
          currencyCode: risk?.applicableBinder?.currency_code,
          maxExposure: risk?.applicableBinder?.maximum_exposure,
          currencyRate: this.exchangeRate
        },
        subclassCoverTypeDto: this.getCoverTypePayload(risk)
      });
    }

    console.debug("Final risk payload:", riskPayload);
    return riskPayload;
  }


  // getCoverTypePayload(risk): CoverType[] {
  //   let coverTypes: CoverType[] = []
  //   for (let coverType of risk.applicableCoverTypes) {
  //     log.debug("COVERSSS", coverType)
  //     coverTypes.push({
  //       subclassCode: coverType?.subClassCode,
  //       description: coverType?.applicableRates[0].subClassDescription,
  //       coverTypeCode: coverType?.coverTypeCode,
  //       minimumAnnualPremium: null,
  //       minimumPremium: coverType?.minimumPremium,
  //       coverTypeShortDescription: coverType?.coverTypeShortDescription,
  //       coverTypeDescription: coverType?.description,
  //       limits: this.getLimitsPayload(coverType.applicableRates, risk)
  //     })
  //   }
  //   return coverTypes;
  // }

  getCoverTypePayload(risk): CoverType[] {
    const coverTypes: CoverType[] = [];

    for (const coverType of risk.applicableCoverTypes) {
      console.debug("COVERSSS", coverType);

      coverTypes.push({
        subclassCode: coverType?.subClassCode,
        description: coverType?.sections?.[0]?.applicableRates?.[0]?.subClassDescription || null,
        coverTypeCode: coverType?.coverTypeCode,
        minimumAnnualPremium: null,
        minimumPremium: coverType?.minimumPremium,
        coverTypeShortDescription: coverType?.coverTypeShortDescription,
        coverTypeDescription: coverType?.description,
        limits: this.getLimitsPayload(coverType?.sections || [], risk)
      });
    }

    return coverTypes;
  }



  // getLimitsPayload(applicableLimits: any, risk: any): Limit[] {
  //   log.debug("Processing risk >>.", risk);
  //   log.debug("Processing applicableLimits >>.", applicableLimits);

  //   let limitsPayload: Limit[] = [];

  //   // 1️⃣ Filter only relevant limits
  //   const filteredLimits = applicableLimits.filter((limit: any) => {
  //     const isMandatory =
  //       limit?.isMandatory?.toString().toUpperCase() === "Y" ||
  //       limit?.sectionMandatory?.toString().toUpperCase() === "Y";

  //     const hasFreeLimit = (limit?.freeLimit || 0) > 0;

  //     return isMandatory || hasFreeLimit;
  //   });

  //   // 2️⃣ Process each filtered limit
  //   for (let limit of filteredLimits) {
  //     // Determine limitAmount based on new rules
  //     let limitAmount;

  //     const isMandatory =
  //       limit?.isMandatory?.toString().toUpperCase() === "Y" ||
  //       limit?.sectionMandatory?.toString().toUpperCase() === "Y";

  //     if (isMandatory) {
  //       // ✅ Mandatory → use selfDeclaredValue
  //       limitAmount = risk?.selfDeclaredValue || risk?.value;
  //     } else if ((limit?.freeLimit || 0) > 0) {
  //       // ✅ Has free limit → use freeLimit
  //       limitAmount = limit?.freeLimit;
  //     } else {
  //       // Should not happen because of filter, but fallback
  //       continue;
  //     }

  //     // Build payload
  //     limitsPayload.push({
  //       calculationGroup: 1,
  //       declarationSection: "N",
  //       rowNumber: 1,
  //       limitPeriod: limit?.limitPeriod || 0,
  //       rateDivisionFactor: limit?.divisionFactor,
  //       premiumRate: limit?.rate,
  //       rateType: limit?.rateType,
  //       minimumPremium: limit?.premiumMinimumAmount,
  //       annualPremium: 0,
  //       multiplierRate: limit?.multiplierRate || 1,
  //       section: {
  //         limitAmount: limitAmount,
  //         description: limit?.sectionDescription,
  //         code: limit?.sectionCode,
  //         isMandatory: "Y",
  //       },
  //       sectionType: limit?.sectionType,
  //       multiplierDivisionFactor: limit?.multiplierDivisionFactor,
  //       riskCode: null,
  //       limitAmount: limitAmount,
  //       description: limit?.sectionDescription,
  //       shortDescription: limit?.sectionShortDescription,
  //       sumInsuredRate: limit?.sumInsuredRate,
  //       freeLimit: limit?.freeLimit || 0,
  //       compute: "Y",
  //       dualBasis: "N",
  //     });
  //   }

  //   return limitsPayload;
  // }
  getLimitsPayload(applicableLimits: any, risk: any): Limit[] {
    const mandatorysections = applicableLimits.filter(sec => sec.isMandatory === 'Y')
    log.debug("madatory sections", mandatorysections)

    // return applicableLimits
    //   .filter(sec => sec.isMandatory === "Y")
    //   .map(sec => {
    //     const rate = sec.applicableRates?.[0];

    //     let limitAmount = 0;


    //     const isSumInsuredSection =
    //       sec.sectionDescription?.toUpperCase().includes('SUM INSURED') ||
    //       sec.sectionShortDescription?.toUpperCase().includes('SUM INSURED');


    //     if (isSumInsuredSection) {
    //       // Rule 1: Sum Insured uses risk values
    //       limitAmount = risk?.selfDeclaredValue || risk?.value || 0;
    //     } else if (rate?.freeLimit) {
    //       // Rule 2: Other sections use free limit if available
    //       limitAmount = rate.freeLimit;
    //     } else {
    //       // Rule 3: Otherwise use limit amount from rate
    //       limitAmount = rate?.limitAmount ?? 0;
    //     }

    //     return {
    //       description: sec.sectionShortDescription,
    //       code: sec.code,
    //       calculationGroup: rate?.grpCode ?? 0,
    //       declarationSection: "Y",
    //       rowNumber: 1,
    //       rateDivisionFactor: rate?.divisionFactor,
    //       premiumRate: sec.selectedRate ?? rate?.rate,
    //       rateType: rate?.rateType ?? "FXD",
    //       sectionType: rate?.sectionType ?? null,
    //       firstLoss: "Y",
    //       firstLossAmountPercent: "",
    //       firstLossValue: 0,

    //       limitAmount: limitAmount,             // <– final computed limit
    //       freeLimit: rate?.freeLimit ?? 0,

    //       topLocRate: 0,
    //       topLocDivFact: 0,
    //       emlPercentage: 0,
    //       compute: "Y",

    //       section: {
    //         code: sec.sectionCode,
    //         description: sec.sectionShortDescription,
    //         limitAmount: limitAmount,
    //         isMandatory: sec.isMandatory
    //       },

    //       multiplierRate: rate?.multiplierRate ?? 1,
    //       multiplierDivisionFactor: rate?.multiplierDivisionFactor ?? 1,
    //       minimumPremium: rate?.premiumMinimumAmount ?? 0,
    //       annualPremium: 0,
    //       premiumAmount: 0,

    //       dualBasis: "Y",
    //       shortDescription: sec.sectionShortDescription,
    //       sumInsuredRate: rate?.sumInsuredRate ?? 1,
    //       limitPeriod: 0,
    //       indemFstPeriod: 0,
    //       indemPeriod: 0,
    //       indemFstPeriodPercentage: 0,
    //       indemRemPeriodPercentage: 0
    //     };
    //   });
    return applicableLimits
      .filter(sec =>
        sec.isMandatory === "Y" &&
        Array.isArray(sec.applicableRates) &&
        sec.applicableRates.length > 0   // <-- REMOVE SECTIONS WITH EMPTY applicableRates
      )
      .map(sec => {
        const rate = sec.applicableRates?.[0];

        let limitAmount = 0;

        const isSumInsuredSection =
          sec.sectionDescription?.toUpperCase().includes('SUM INSURED') ||
          sec.sectionShortDescription?.toUpperCase().includes('SUM INSURED');

        if (isSumInsuredSection) {

          limitAmount = risk?.selfDeclaredValue || risk?.value || 0;
        } else if (rate?.freeLimit) {

          limitAmount = rate.freeLimit;
        } else {

          limitAmount = rate?.limitAmount ?? 0;
        }

        return {
          description: sec.sectionShortDescription,
          code: sec.code,
          calculationGroup: rate?.grpCode ?? 0,
          declarationSection: "Y",
          rowNumber: 1,
          rateDivisionFactor: rate?.divisionFactor,
          premiumRate: sec.selectedRate ?? rate?.rate,
          rateType: rate?.rateType ?? "FXD",
          sectionType: rate?.sectionType ?? null,
          firstLoss: "Y",
          firstLossAmountPercent: "",
          firstLossValue: 0,

          limitAmount: limitAmount,
          freeLimit: rate?.freeLimit ?? 0,

          topLocRate: 0,
          topLocDivFact: 0,
          emlPercentage: 0,
          compute: "Y",

          section: {
            code: sec.sectionCode,
            description: sec.sectionShortDescription,
            limitAmount: limitAmount,
            isMandatory: sec.isMandatory
          },

          multiplierRate: rate?.multiplierRate ?? 1,
          multiplierDivisionFactor: rate?.multiplierDivisionFactor ?? 1,
          minimumPremium: rate?.premiumMinimumAmount ?? 0,
          annualPremium: 0,
          premiumAmount: 0,

          dualBasis: "Y",
          shortDescription: sec.sectionShortDescription,
          sumInsuredRate: rate?.sumInsuredRate ?? 1,
          limitPeriod: 0,
          indemFstPeriod: 0,
          indemPeriod: 0,
          indemFstPeriodPercentage: 0,
          indemRemPeriodPercentage: 0
        };
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
    sessionStorage.setItem('currencySymbol', this.selectedCurrencySymbol);

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
    // this.userBranchId = this.userDetails?.branchId;
    // log.debug('User Branch Id', this.userBranchId);
    this.userCode = this.userDetails.code
    log.debug('User Code ', this.userCode);

    // Load date format from sessionStorage first, then from userDetails
    const storedDateFormat = sessionStorage.getItem('dateFormat');
    if (storedDateFormat) {
      this.dateFormat = storedDateFormat;
      log.debug("Loaded date format from session storage:", this.dateFormat);
    } else {
      log.debug("Using default date format:", this.dateFormat);
    }

    // Update dateFormat from organization settings
    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);
    sessionStorage.setItem('dateFormat', this.dateFormat);

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat
      .replace('yyyy', 'yy')
      .replace('MM', 'm');

    // Get today's date in yyyy-MM-dd format
    const today = new Date();
    this.coverFromDate = today;
    log.debug(' Date format', this.dateFormat);

    const todaysDate = new Date(today);
    this.selectedEffectiveDate = todaysDate;
    log.debug(' todays date before being formatted', todaysDate);

    // Extract the day, month, and year
    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = todaysDate.getFullYear();
    this.todaysDate = `${day}-${month}-${year}`;
    log.debug('Todays  Date', this.todaysDate);
    log.debug('Cover from  Date(current date)', this.coverFromDate);

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
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
    this.branchService.getBranches(2)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.branchList = data;
        // const branch = this.branchList.filter(
        //   (branch) => branch.id == this.userBranchId
        // );
        this.branchDescriptionArray = data.map((branch) => {
          return {
            code: branch.id,
            description: this.capitalizeWord(branch.name),
          }
        })
        const userCode = this.userCode?.toString()
        this.quotationService.getUserBranches(userCode).subscribe({
          next: (userBranches) => {
            if (!userBranches?.length) return;
            log.debug('user branches', userBranches)
            //Get the first user branchId
            const firstUserBranchId = userBranches[0].branchId;

            //Match it against the full branch list
            const matchedBranch = this.branchList.find(b => b.id === firstUserBranchId);
            this.userBranchId = matchedBranch.id
            log.debug("User branch Id;", this.userBranchId)

          },
          error: (err) => {
            console.error('Error fetching user branches:', err);
          }
        });
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
   * Parse date string or Date object into a valid Date object
   * Handles organization date formats (dd-MM-yyyy, dd-MMM-yyyy, etc.)
   * @param date - Date to parse (can be Date object or string)
   * @returns Parsed Date object or null if invalid
   */
  parseDate(date: string | Date): Date | null {
    if (!date) {
      return null;
    }

    // If already a Date object, validate and return
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle string dates
    const dateStr = date.toString();

    // Check if it's in dd-MM-yyyy or dd-MMM-yyyy format (organization format)
    if (dateStr.includes('-') && dateStr.split('-').length === 3) {
      const parts = dateStr.split('-');
      // Check if it looks like dd-MM-yyyy or dd-MMM-yyyy format (day is first)
      if (parts[0].length <= 2) {
        const day = parseInt(parts[0], 10);
        const monthPart = parts[1];
        const year = parseInt(parts[2], 10);

        // Try to parse month (could be number or month name)
        let month: number;
        if (isNaN(parseInt(monthPart, 10))) {
          // Month name - convert to month number
          const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          month = monthNames.findIndex(m => monthPart.toLowerCase().startsWith(m));
        } else {
          month = parseInt(monthPart, 10) - 1; // Month is 0-indexed
        }

        const parsedDate = new Date(year, month, day);
        return isNaN(parsedDate.getTime()) ? null : parsedDate;
      }
    }

    // Try standard Date parsing as fallback
    const parsedDate = new Date(dateStr);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  /**
   * Format date for backend API (ISO format: YYYY-MM-DD)
   * Handles both Date objects and various string formats
   * @param date - Date to format (can be Date object or string)
   * @returns Formatted date string in YYYY-MM-DD format
   */
  formatDate(date: string | Date): string {
    if (!date) {
      log.debug('formatDate: No date provided');
      return '';
    }

    log.debug('formatDate input:', date);

    // Parse the date first
    const parsedDate = this.parseDate(date);

    if (!parsedDate) {
      log.error('formatDate: Invalid date format', date);
      return '';
    }

    // Format as YYYY-MM-DD
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
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
  onSubclassSelected(event: any, productIndex: number, riskIndex: number, productCode: number) {
    log.debug(`Selected value: ${JSON.stringify(event)}`, productCode, riskIndex);
    this.selectedSubclassCode = event.code;
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code');
    this.fetchComputationData(productCode, event.code, riskIndex, productIndex);
    log.debug(this.selectedSubclassCode, 'Selected Subclass Code');
    this.fetchRegexPattern(productIndex, riskIndex);
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


  fetchComputationData(productCode: number, subClassCode: number, riskIndex: number, productIndex: number
  ) {
    log.debug("PRODUCT INDEX-computation data fetching", productIndex);
    log.debug("RISK INDEX-computation data fetching", riskIndex);
    log.debug("PRO CODE-computation data fetching", productCode);
    log.debug("SYB CODE-computation data fetching", subClassCode);
    log.debug("productFormArray for risks>>>", this.productsFormArray)

    let productFormArray = this.productsFormArray.at(productIndex);
    let riskFormGroup = (this.productsFormArray.at(productIndex).get('risks') as FormArray).at(riskIndex) as FormGroup
    log.debug("Current  productFormArray for risks>>>", riskFormGroup)
    this.binderService.getAllBindersQuick(subClassCode).pipe(
      mergeMap((binders) => {
        this.binderList = binders._embedded.binder_dto_list;
        const defaultBinder = this.binderList.find((value: {
          is_default: string;
        }) => value?.is_default === 'Y') as Binders;
        riskFormGroup.get('applicableBinder')?.setValue(defaultBinder)
        this.selectedBinderCode = this.selectedBinder?.code;
        log.debug("Selected Binder code", this.selectedBinderCode)
        this.currencyCode = defaultBinder?.currency_code
        if (this.currencyCode) {
          this.fetchExchangeRate()
        }
        return forkJoin([
          this.quotationService.getTaxes(productCode, subClassCode),
          this.subclassCoverTypesService.getCoverTypeSections(subClassCode, defaultBinder.code)
        ])
      }),
      untilDestroyed(this)
    ).subscribe(([taxes, coverTypeSections]) => {
      this.taxList = taxes?._embedded as Tax[]
      log.debug("Taxes-list:::", this.taxList)

      log.debug("CoverTypeSections-log", coverTypeSections)
      const coverTypeSectionList = coverTypeSections._embedded
      log.debug("covertypesection list;", coverTypeSectionList)
      sessionStorage.setItem("covertypeSections", JSON.stringify(coverTypeSectionList))
      sessionStorage.setItem(
        `covertypeSections-${subClassCode}`,
        JSON.stringify(coverTypeSectionList)
      );
      riskFormGroup.get('applicableTaxes')?.setValue(taxes)
      riskFormGroup.get('applicableCoverTypes')?.setValue(coverTypeSections._embedded)
      log.debug("Taxes:::", taxes, this.applicablePremiumRates)
    })
    log.debug("Current after form changes >>>", riskFormGroup)

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

  transformToUpperCase(event: Event, productIndex: number, riskIndex: number): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();

    const control = this.quickQuoteForm.get(['products', productIndex, 'risks', riskIndex, 'carRegNo']) as FormControl;

    if (!control) {
      console.warn('Could not find control for carRegNo at given indexes');
      return;
    }

    log.debug("Keyed In value>>>", control.value);

    control.setValue(upperCaseValue, { emitEvent: false });
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
    this.filterObject['name'] = (event.target as HTMLInputElement).value;
  }

  fetchExchangeRate() {
    const quickQuoteDataModel = this.quickQuoteForm.getRawValue();
    // const formCurrencyCode = quickQuoteDataModel.currency.id;
    const currencyCode = this.currencyCode;
    log.debug("Currency Code", currencyCode)
    this.quotationService
      .getExchangeRates(currencyCode, this.organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response.rate
          log.debug("Exchange rate  ", this.exchangeRate);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  saveQuotationDetails() {
    const quotationPayload = this.getQuotationPayload()
    log.debug("Quotation details >>>", quotationPayload)
    const premiumToSave: ProductLevelPremium = {
      ...this.premiumComputationResponse,
      productLevelPremiums: this.premiumComputationResponse.productLevelPremiums.map((value) => {
        return {
          ...value,
          riskLevelPremiums: value.riskLevelPremiums.map((riskDetails) => {
            return {
              ...riskDetails,
              coverTypeDetails: riskDetails.coverTypeDetails
                .filter(coverType => coverType.coverTypeCode === riskDetails.selectCoverType.coverTypeCode)
            }
          })
        }
      })
    }

    log.debug("Computation response after mutation >>>", premiumToSave)
    sessionStorage.setItem("selectedCovers", JSON.stringify(premiumToSave))
    sessionStorage.setItem('premiumComputationResponse', JSON.stringify(this.premiumComputationResponse));
    this.quotationService.processQuotation(quotationPayload).pipe(
      mergeMap((response) => {
        if (response._embedded?.quotationNumber && response._embedded?.quotationCode) {
          sessionStorage.setItem("quotationNumber", response._embedded.quotationNumber)
          sessionStorage.setItem("quotationCode", response._embedded.quotationCode)
          const fullState = {
            selectedProducts: this.selectedProducts,
            formArray: this.quickQuoteForm.value,
          };
          sessionStorage.setItem('savedProductsState', JSON.stringify(fullState));
          const computationPayload: ComputationPayloadDto = {
            quotationCode: +response._embedded?.quotationCode,
            payload: this.currentComputationPayload
          }
          return this.quotationService.savePremiumComputationPayload(computationPayload)
        } else {
          this.globalMessagingService.displayErrorMessage('Error', 'Could not save quotation details');
        }
      }),
      untilDestroyed(this)
    ).subscribe({
      next: (response) => {
        this.router.navigate(['/home/gis/quotation/quote-summary']).then(r => {
        })
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        log.debug('saveQuote error >>>', error.error.message)
      }
    }
    )
  }

  getQuotationPayload(): QuotationDetailsRequestDto {
    if (this.quickQuoteForm.invalid) {
      this.markAllFieldsAsTouched(this.quickQuoteForm);
      return
    }
    const formModel = this.quickQuoteForm.getRawValue();
    log.debug("Selected products >>>>", this.selectedProductCovers)
    log.debug("Quotation details >>>", formModel)
    sessionStorage.setItem("quickQuotePayload", JSON.stringify(formModel))
    const coverTypes = this.selectedProductCovers
      .flatMap(value => value.riskLevelPremiums.map(premium => premium.selectCoverType));
    const totalPremium = coverTypes.reduce((sum, coverType) => sum + coverType.computedPremium, 0);

    log.debug("Quotation details map1 >>>", coverTypes, totalPremium)

    // Parse and format the effective date properly
    const effectiveDateParsed = this.parseDate(formModel.effectiveDate);
    const wefDate = effectiveDateParsed ? this.formatDate(effectiveDateParsed) : '';

    log.debug("Parsed effective date:", effectiveDateParsed, "Formatted wefDate:", wefDate);

    return {
      quotationProducts: this.getQuotationProductPayload(),
      quotationNumber: this.quotationNo || null,
      quotationCode: this.quotationCode || null,
      source: 37,
      user: this.user,
      currencyCode: this.currencyCode,
      currencyRate: this.exchangeRate,
      agentCode: 0,
      agentShortDescription: "DIRECT",
      wefDate: wefDate,
      wetDate: formModel.products[0]?.effectiveTo,
      premium: totalPremium,
      branchCode: this.userBranchId || null,
      comments: formModel.quotComment,
      clientType: 'I',
      quoteType: 'QQ',
    }
  }

  getQuotationProductPayload(): QuotationProduct[] {
    let existingProducts = this.quotationObject?.quotationProducts;
    const quotationProducts: QuotationProduct[] = []
    const products = this.quickQuoteForm.getRawValue().products
    log.debug("User selected products>>>", products)

    // Parse and format the effective date properly
    const effectiveDateValue = this.quickQuoteForm.get('effectiveDate').value;
    const effectiveDateParsed = this.parseDate(effectiveDateValue);
    let coverFrom = effectiveDateParsed ? this.formatDate(effectiveDateParsed) : '';

    log.debug("Effective date value:", effectiveDateValue, "Parsed:", effectiveDateParsed, "Formatted coverFrom:", coverFrom);

    for (let product of products) {
      let selectedProductPremium = this.selectedProductCovers
        .find(value => value.code === product.code)
      log.debug("Selected coverType", selectedProductPremium)
      selectedProductPremium.coverFrom = coverFrom
      selectedProductPremium.coverTo = product.effectiveTo
      const productPremium = selectedProductPremium.riskLevelPremiums
        .reduce((sum, value) => sum + value.selectCoverType.computedPremium, 0);
      const matchingProduct = existingProducts?.find((value) => value.productCode === product.code)
      quotationProducts.push({
        code: matchingProduct ? matchingProduct.code : null,
        productCode: product.code,
        quotationCode: this.quotationCode || null,
        productName: product.description,
        productShortDescription: product.description,
        premium: productPremium,
        wef: coverFrom,
        wet: product.effectiveTo,
        totalSumInsured: 0,
        converted: "N",
        binder: null,
        agentShortDescription: "DIRECT",
        riskInformation: this.getProductRisksPayload(product.risks, selectedProductPremium, matchingProduct),
        limitsOfLiability: this.limitsOfLiabilityPayload(selectedProductPremium),
        taxInformation: this.getProductTaxesPayload(product)
      })
    }
    return quotationProducts
  }

  getProductTaxesPayload(product: any): TaxInformation[] {
    const applicableTaxes = product.risks.flatMap(risk => risk.applicableTaxes);
    log.debug("All applicable taxes >>>", applicableTaxes)
    const computedTaxes = this.selectedProductCovers
      .filter(value => value.code === product.code)
      .flatMap(value => value.riskLevelPremiums
        .flatMap(premium => premium.selectCoverType.taxComputation));

    const groupedMap = new Map<number, number>();
    for (const item of computedTaxes) {
      const currentSum = groupedMap.get(item.code) || 0;
      groupedMap.set(item.code, currentSum + item.premium);
    }
    return Array.from(groupedMap.entries()).map(([code, taxAmount]) => {
      const original = applicableTaxes.find(t => t.code === code);
      return {
        quotationRate: original?.taxRate,
        taxAmount: taxAmount,
        code,
        rateDescription: original.description,
        rateType: original?.taxRateType,
        quotationCode: null,
        transactionCode: original.trntCode,
        renewalEndorsement: null,
        taxRateCode: null,//original?.taxCode,
        levelCode: original?.applicationLevel,
        taxType: original?.taxType,
        riskProductLevel: original?.applicationLevel,
        rate: original?.taxRate,
      };
    })
  }

  getProductRisksPayload(formRisks: any, product: ProductPremium, quotationProduct: QuotationProduct): RiskInformation[] {
    const existingRisks = quotationProduct?.riskInformation
    const riskInformation: RiskInformation[] = []
    for (const [index, risk] of product.riskLevelPremiums.entries()) {
      const riskId = `Risk ${index + 1}`
      const formRisk = formRisks.find(value => value.riskCode === risk.code)
      const matchingRisk = existingRisks?.find((value) => value.propertyId?.replace(/\s/g, '') === riskId?.replace(/\s/g, ''))
      log.debug("Mathching Risk", matchingRisk)
      log.debug("Existing Risk", existingRisks)
      log.debug("Form Risk", formRisk)
      log.debug("Processing Risk>>>, formRisk", risk, formRisk)
      riskInformation.push({
        code: matchingRisk ? matchingRisk.code : null,
        riskCode: risk?.code,
        coverTypeCode: risk.selectCoverType.coverTypeCode,
        coverTypeShortDescription: risk.selectCoverType.coverTypeShortDescription,
        coverTypeDescription: risk.selectCoverType.coverTypeDescription,
        productCode: product.code,
        premium: risk.selectCoverType.computedPremium,
        value: formRisk?.selfDeclaredValue || formRisk?.value,
        clientType: "I",
        itemDesc: riskId,
        wef: product.coverFrom,
        wet: product.coverTo,
        propertyId: riskId,
        annualPremium: risk.selectCoverType.computedPremium,
        sectionsDetails: null,
        action: matchingRisk ? 'E' : 'A',
        clauseCodes: Array.from(new Set(risk.coverTypeDetails.flatMap(cover =>
          (cover.clauses ?? []).map(clause => clause.code)
        )
        )),
        butCharge: 0,
        subclassCode: risk.selectCoverType.subclassCode,
        binderCode: risk.binderCode,
        riskLimits: risk.selectCoverType.limitPremium.map((limit) => {
          const matchingLimit = matchingRisk?.riskLimits?.find(
            (ml) => ml.sectionCode === limit.sectCode
          );
          log.debug("matching limit:", matchingLimit)
          return {
            sectionCode: limit.sectCode,
            quotationCode: null,
            quotationRiskCode: null,
            productCode: product.code,
            quotationProCode: null,
            minimumPremium: null,
            rateDescription: limit.description,
            annualPremium: limit.premium,
            usedLimit: null,
            dualBasis: "N",
            setupPremiumRate: null,
            indemnityFirstPeriod: null,
            indemnityFirstPeriodPct: null,
            indemnityPeriod: null,
            indemnityRemainingPeriodPct: null,
            minimumPremiumRate: null,
            periodType: null,
            maxPremiumRate: null,
            calcGroup: limit.calculationGroup,
            code: matchingLimit?.code ?? null,
            compute: "Y",
            description: limit.description,
            freeLimit: limit?.freeLimit || 0,
            multiplierDivisionFactor: limit.multiplierDivisionFactor,
            multiplierRate: limit.multiplierRate ?? 1,
            premiumAmount: limit.premium,
            premiumRate: limit.premiumRate,
            rateDivisionFactor: limit.rateDivisionFactor,
            rateType: limit?.rateType || "FXD",
            rowNumber: limit.rowNumber,
            sectionType: limit.sectionType,
            sectionShortDescription: limit.shortDescription,
            limitAmount: limit.limitAmount,
            sumInsuredRate: null
          }
        }),
        subclass: {
          code: risk.selectCoverType.subclassCode,
          description: formRisk?.useOfProperty?.description,
          shortDescription: null,
          productCode: product.code
        },
        coverDays: differenceInCalendarDays(parseISO(product.coverTo), parseISO(product.coverFrom)) + 1
      })
    }
    return riskInformation;
  }

  limitsOfLiabilityPayload(product: ProductPremium): LimitsOfLiability[] {
    const excesses = product.riskLevelPremiums.flatMap(value => value.selectCoverType.excesses)
    let limitsOfLiabilities: LimitsOfLiability[] = []
    for (let excess of excesses) {
      limitsOfLiabilities.push({
        value: excess?.value,
        narration: excess?.narration,
        type: 'E',
        scheduleValueCode: excess?.code
      })
    }
    const limitOfLiabilities = product.riskLevelPremiums.flatMap(value => value.selectCoverType.limitOfLiabilities)
    for (let limit of limitOfLiabilities) {
      limitsOfLiabilities.push({
        value: limit?.value,
        narration: limit?.narration,
        type: 'L',
        scheduleValueCode: limit?.code
      })
    }
    return limitsOfLiabilities
  }


  selectCovers(product: ProductPremium, riskDetails: RiskLevelPremium) {
    log.debug("Selected risk >>>", riskDetails);
    this.currentSelectedRisk = riskDetails;
    log.debug("hasSelectedAllProductCovers before >>>", this.selectedProductCovers)

    this.selectedProductCovers = this.selectedProductCovers.filter(value => value.code !== product.code);
    this.selectedProductCovers.push(product);
    this.checkCanMoveToNextScreen()
    log.debug('canMoveToNextScreen:', this.canMoveToNextScreen);
  }

  checkCanMoveToNextScreen() {
    const premiums = this.premiumComputationResponse?.productLevelPremiums ?? [];
    log.debug("current premiums >>>", premiums)
    const hasSelectedAllProductCovers = this.selectedProductCovers && this.selectedProductCovers.length === premiums.length;
    log.debug("hasSelectedAllProductCovers >>>", this.selectedProductCovers)

    const allRisksHaveSelectedCover = premiums

      .flatMap(premium => premium.riskLevelPremiums).every(risk => risk.selectCoverType);
    log.debug("allRisksHaveSelectedCover >>>", hasSelectedAllProductCovers)

    this.canMoveToNextScreen = hasSelectedAllProductCovers && allRisksHaveSelectedCover;

    sessionStorage.setItem("canMoveToNextScreen", JSON.stringify(this.canMoveToNextScreen));
  }


  listenToBenefitsAddition(
    benefitDto: { risk: RiskLevelPremium; premiumItems: NewPremiums[] },
    productIndex?: number,
    coverIndex?: number
  ) {
    log.debug("product index:", productIndex)
    log.debug("cover index:", coverIndex)
    // Save which section was expanded
    const previousExpandedIndexes = [...this.expandedCoverTypeIndexes];
    if (productIndex !== undefined && coverIndex !== undefined) {
      previousExpandedIndexes[productIndex] = coverIndex;
    }
    log.debug("CURRENT EXPANDED:", previousExpandedIndexes)
    log.debug("CURRENT EXPANDED:", previousExpandedIndexes)

    const updatedPayload = this.modifyPremiumPayload(benefitDto);
    log.debug("Modified Premium Computation Payload:", updatedPayload);

    setTimeout(() => {
      this.performComputation(updatedPayload);

      // Wait a bit for computation to finish and UI to reload
      setTimeout(() => {
        this.expandedCoverTypeIndexes = previousExpandedIndexes;
        document.body.style.overflow = 'auto';
      }, 300); // Adjust delay if needed based on recomputation time
    }, 100);
  }

  removeBenefit(
    benefitDto: { risk: RiskLevelPremium; premiumItems: Premiums },
    productIndex?: number,
    coverIndex?: number
  ) {
    const previousExpandedIndexes = [...this.expandedCoverTypeIndexes];
    if (productIndex !== undefined && coverIndex !== undefined) {
      previousExpandedIndexes[productIndex] = coverIndex;
    }

    const sectionToRemove = benefitDto.premiumItems.sectCode;
    const dtoToProcess = {
      risk: benefitDto.risk,
      premiumItems: []
    };

    log.debug("About to remove >>>>", benefitDto, dtoToProcess, sectionToRemove);
    const updatedPayload = this.modifyPremiumPayload(dtoToProcess, sectionToRemove);

    setTimeout(() => {
      this.performComputation(updatedPayload);

      // Restore expanded section after refresh
      setTimeout(() => {
        this.expandedCoverTypeIndexes = previousExpandedIndexes;
        document.body.style.overflow = 'auto';
      }, 300);
    }, 100);
  }


  // modifyPremiumPayload(benefitsDto: {
  //   risk: RiskLevelPremium,
  //   premiumItems: Premiums[]
  // }, sectionCodeToRemove?: number): PremiumComputationRequest {
  //   log.debug("currentComputationPayload", this.currentComputationPayload)
  //   // const premiumComputationRequest = this.computationPayload() || this.currentComputationPayload
  //   const premiumComputationRequest =
  //     this.currentComputationPayload &&
  //       this.currentComputationPayload.products.some(p =>
  //         p.risks.some(r => r.code === benefitsDto.risk.code)
  //       )
  //       ? this.currentComputationPayload
  //       : this.computationPayload();

  //   const riskCode = benefitsDto.risk.code;
  //   const coverTypeCode = benefitsDto.risk.selectCoverType.coverTypeCode;
  //   const updatedProducts = premiumComputationRequest.products.map(product => ({
  //     ...product,
  //     risks: product.risks.map(risk => {
  //       if (risk.code !== riskCode) return risk;
  //       return {
  //         ...risk,
  //         subclassCoverTypeDto: risk.subclassCoverTypeDto.map(coverType => {
  //           if (coverType.coverTypeCode !== coverTypeCode) return coverType;

  //           let updatedLimits = [...coverType.limits];
  //           log.debug("Section to remove>>", sectionCodeToRemove, updatedLimits, coverTypeCode)
  //           if (sectionCodeToRemove) {
  //             updatedLimits = updatedLimits.filter(
  //               limit => limit.section.code !== sectionCodeToRemove
  //             );
  //           }
  //           if (benefitsDto.premiumItems.length > 0) {
  //             updatedLimits = updatedLimits.map(limit => {
  //               const match = benefitsDto.premiumItems.find(b => b.code === limit.section.code);
  //               return match
  //                 ? { ...limit, limitAmount: match.limitAmount }
  //                 : limit;
  //             });
  //             benefitsDto.premiumItems.forEach(benefit => {
  //               updatedLimits = updatedLimits.filter(value => value.section.code !== benefit.sectionCode)
  //               log.debug("I am adding this benefit>>>", benefit)
  //               updatedLimits.push({
  //                 section: {
  //                   code: benefit.sectionCode,
  //                   description: benefit.sectionDescription,
  //                   isMandatory: "N",
  //                   limitAmount: benefit.limitAmount
  //                 },
  //                 multiplierDivisionFactor: benefit.multiplierDivisionFactor,
  //                 riskCode: null,
  //                 shortDescription: benefit.sectionDescription,
  //                 limitAmount: benefit.limitAmount,
  //                 premiumRate: benefit.rate ?? 1,
  //                 minimumPremium: benefit.minimumPremium ?? 0,
  //                 rateType: benefit.rateType,
  //                 calculationGroup: 1,
  //                 declarationSection: "N",
  //                 limitPeriod: benefit?.limitPeriod || 0,
  //                 rowNumber: updatedLimits.length + 1,
  //                 rateDivisionFactor: benefit.divisionFactor,
  //                 annualPremium: 0,
  //                 multiplierRate: benefit.multiplierRate || 1,
  //                 sectionType: benefit.sectionType,
  //                 description: benefit.sectionDescription,
  //                 compute: "Y",
  //                 dualBasis: "N",
  //                 freeLimit: benefit.freeLimit
  //               });
  //             });
  //           }
  //           return {
  //             ...coverType,
  //             limits: updatedLimits
  //           };
  //         })
  //       };
  //     })
  //   }));
  //   let updatedPayload = {
  //     ...premiumComputationRequest,
  //     products: updatedProducts
  //   };
  //   this.currentComputationPayload = updatedPayload
  //   return updatedPayload;
  // }
  modifyPremiumPayload(
    benefitsDto: { risk: RiskLevelPremium; premiumItems: NewPremiums[] },
    sectionCodeToRemove?: number
  ): PremiumComputationRequest {

    log.debug("currentComputationPayload", this.currentComputationPayload);

    const premiumComputationRequest =
      this.currentComputationPayload &&
        this.currentComputationPayload.products.some(p =>
          p.risks.some(r => r.code === benefitsDto.risk.code)
        )
        ? this.currentComputationPayload
        : this.computationPayload();

    const riskCode = benefitsDto.risk.code;
    const coverTypeCode = benefitsDto.risk.selectCoverType.coverTypeCode;

    const updatedProducts = premiumComputationRequest.products.map(product => ({
      ...product,
      risks: product.risks.map(risk => {
        if (risk.code !== riskCode) return risk;

        return {
          ...risk,
          subclassCoverTypeDto: risk.subclassCoverTypeDto.map(coverType => {
            if (coverType.coverTypeCode !== coverTypeCode) return coverType;

            let updatedLimits = [...coverType.limits];

            // REMOVE A SINGLE SECTION
            if (sectionCodeToRemove) {
              updatedLimits = updatedLimits.filter(
                limit => limit.section.code !== sectionCodeToRemove
              );
            }

            // UPDATE / ADD LIMITS FROM premiumItems
            if (benefitsDto.premiumItems.length > 0) {
              // Update existing limits
              updatedLimits = updatedLimits.map(limit => {
                const match = benefitsDto.premiumItems.find(
                  b => b.sectionCode === limit.section.code
                );

                if (!match) return limit;

                const rate = match.applicableRates?.[0];

                return {
                  ...limit,
                  limitAmount: match?.limitAmount ?? limit.limitAmount,
                  premiumRate: match?.selectedRate ?? rate?.rate ?? limit.premiumRate,
                  minimumPremium: rate?.premiumMinimumAmount ?? limit.minimumPremium,
                  rateType: rate?.rateType ?? limit.rateType,
                  multiplierRate: rate?.multiplierRate ?? limit.multiplierRate ?? 1,
                  multiplierDivisionFactor: rate?.multiplierDivisionFactor ?? limit.multiplierDivisionFactor,
                };
              });

              // ADD NEW BENEFITS AS NEW LIMITS
              benefitsDto.premiumItems.forEach(benefit => {
                log.debug("Adding benefit >>>", benefit);

                const rate = benefit.applicableRates?.[0];

                // remove if exists already
                updatedLimits = updatedLimits.filter(
                  limit => limit.section.code !== benefit.sectionCode
                );

                updatedLimits.push({
                  section: {
                    code: benefit.sectionCode,
                    description: benefit.sectionShortDescription,
                    isMandatory: benefit?.isMandatory,
                    limitAmount: benefit?.limitAmount,
                  },
                  riskCode: Number(risk.code),
                  shortDescription: benefit?.sectionShortDescription,
                  limitAmount: benefit?.limitAmount,
                  premiumRate: benefit.selectedRate ?? rate?.rate,
                  minimumPremium: rate?.premiumMinimumAmount,
                  rateType: rate?.rateType,
                  calculationGroup: benefit.calcGroup ?? 1,
                  declarationSection: "N",
                  limitPeriod: 0,
                  rowNumber: updatedLimits.length + 1,
                  multiplierRate: rate?.multiplierRate ?? 1,
                  multiplierDivisionFactor: rate?.multiplierDivisionFactor,
                  rateDivisionFactor: rate?.divisionFactor,
                  annualPremium: 0,
                  sectionType: rate?.sectionType,
                  description: benefit.sectionShortDescription,
                  compute: "Y",
                  dualBasis: "N",
                  freeLimit: rate?.freeLimit
                });
              });
            }

            return {
              ...coverType,
              limits: updatedLimits
            };
          })
        };
      })
    }));

    const updatedPayload = {
      ...premiumComputationRequest,
      products: updatedProducts
    };

    this.currentComputationPayload = updatedPayload;
    return updatedPayload;
  }

  isShareModalOpen = false;

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }


  notificationPayload(): QuotationReportDto {
    log.debug("SELECTED COVERS", this.premiumComputationPayloadToShare)
    const now = new Date();
    const formModel = this.quickQuoteForm.getRawValue();
    const coverFrom = format(new Date(formModel.effectiveDate), 'dd MMMM yyyy')
    const coverTo = format(new Date(formModel.products[0]?.effectiveTo), 'dd MMMM yyyy')
    const organizationDetails = this.sessionStorageService.getItem("organizationDetails") as OrganizationDTO
    return {
      paymentLink: null,
      quotation: {
        quotationAgent: 'N/A',
        insuredName: 'N/A',
        quotationPeriod: `${coverFrom} to ${coverTo}`,
        quotationTime: format(now, 'dd MMMM yyyy HHmm') + ' HRS',
        quotationStatus: 'Draft',
        quotationNo: 'N/A'


      },
      organization: {
        organizationLogo: organizationDetails.organizationLogo,
        organizationName: organizationDetails.name,
      },
      products: this.premiumComputationPayloadToShare.productLevelPremiums.map((product: any) => ({
        code: product.code,
        description: product.description,
        riskLevelPremiums: product.riskLevelPremiums.map((risk: any) => ({
          sumInsured: risk.sumInsured,
          propertyId: risk.propertyId,
          coverTypeDetails: risk.coverTypeDetails.map((cover: any) => ({
            subclassCode: cover?.subclassCode,
            description: cover.description || null,
            propertyId: cover.propertyId,
            coverTypeShortDescription: cover.coverTypeShortDescription,
            coverTypeDescription: cover.coverTypeDescription,
            limits: cover.limits?.map((limit: any) => ({
              narration: limit.narration?.trim(),
              value: limit.value
            })) || [],
            computedPremium: cover.computedPremium,
            taxComputation: (cover.taxComputation ?? []).map((tax: any) => ({
              code: tax.code,
              rateDescription: tax.description?.trim() || 'N/A',
              premium: tax.premium || 0
            })),
            clauses: cover.clauses?.map((clause: any) => ({
              heading: clause.heading,
              wording: clause.wording
            })) || [],
            limitOfLiabilities: cover.limitOfLiabilities?.map((limit: any) => ({
              narration: limit.narration?.trim(),
              value: limit.value
            })) || [],
            excesses: cover.excesses?.map((excess: any) => ({
              narration: excess.narration?.trim(),
              value: excess.value
            })) || [],
            limitPremium: cover.limitPremium?.map((limit: any) => ({
              sectCode: limit.sectCode,
              premium: limit.premium,
              description: limit.description,
              limitAmount: limit.limitAmount,
              isMandatory: limit.isMandatory,
              calculationGroup: limit.calculationGroup,
              compute: limit.compute,
              dualBasis: limit.dualBasis,
              rateDivisionFactor: limit.rateDivisionFactor,
              rateType: limit.rateType,
              rowNumber: limit.rowNumber,
              premiumRate: limit.premiumRate,
              multiplierDivisionFactor: limit.multiplierDivisionFactor,
              multiplierRate: limit.multiplierRate ?? 1,
              sectionType: limit.sectionType,
              shortDescription: limit.shortDescription,
              freeLimit: limit.freeLimit,
            })) || []
          }))
        }))
      }))
    }
  }
  onPreviewRequested() {
    this.previewVisible = false;
    this.pdfSrc = null;
    if (this.reportDetails) {
      this.pdfSrc = `data:application/pdf;base64,${this.reportDetails.base64}`;

      setTimeout(() => {
        this.previewVisible = true;
      }, 0);
      return
    }
    const payload = this.notificationPayload();
    this.quotationService.generateQuotationReport(payload).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (response) => {
        this.reportDetails = response
        // 👇 Just prepend the header, no sanitizer needed
        this.pdfSrc = `data:application/pdf;base64,${response.base64}`;

        setTimeout(() => {
          this.previewVisible = true;
        }, 0);
      },
      error: (err) => {
        console.error('Failed to preview quotation report', err);
      }
    });
  }


  onDownloadRequested() {
    const payload = this.notificationPayload();
    if (this.reportDetails) {
      this.utilService.downloadPdfFromBase64(this.reportDetails.base64, "quotation-report.pdf");
      return
    }

    this.quotationService.generateQuotationReport(payload)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.reportDetails = response

        // Normal download using utilService
        this.utilService.downloadPdfFromBase64(response.base64, "quotation-report.pdf");
      });
  }


  onPrintRequested() {
    if (this.reportDetails) {
      const byteCharacters = atob(this.reportDetails.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);

      // Create hidden iframe for printing
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);

      iframe.onload = () => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();

      };
      return
    }
    const payload = this.notificationPayload();

    this.quotationService.generateQuotationReport(payload)
      .pipe(untilDestroyed(this))
      .subscribe((response) => {
        this.reportDetails = response

        const byteCharacters = atob(response.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(blob);

        // Create hidden iframe for printing
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = pdfUrl;
        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

        };
      });
  }








  fetchCoverRelatedData() {
    const productLevelPremiums$ = this.premiumComputationResponse.productLevelPremiums.map((product) => {
      const riskLevelPremiums$ = product.riskLevelPremiums.map((risk) => {
        const coverTypeDetails$ = risk.coverTypeDetails.map((coverType) => {
          const clauses$ = this.quotationService.getClauses(coverType.subclassCode, coverType.coverTypeCode,);
          const limits$ = this.quotationService.getLimitsOfLiability(coverType.subclassCode);
          const excesses$ = this.quotationService.getExcesses(coverType.subclassCode);
          return forkJoin([clauses$, limits$, excesses$]).pipe(
            map(([clauses, limits, excesses]) => ({
              ...coverType,
              clauses: clauses?._embedded ?? [],
              limits: limits?._embedded ?? [],
              limitOfLiabilities: limits?._embedded ?? [],
              excesses: excesses?._embedded ?? [],
            }))
          );
        });
        return forkJoin(coverTypeDetails$).pipe(
          map((coverTypeDetails) => ({
            ...risk,
            coverTypeDetails,
          }))
        );
      });

      return forkJoin(riskLevelPremiums$).pipe(
        map((riskLevelPremiums) => ({
          ...product,
          riskLevelPremiums,
        }))
      );
    });

    forkJoin(productLevelPremiums$).pipe(
      map((productLevelPremiums) => ({
        ...this.premiumComputationResponse,
        productLevelPremiums,
      }))
    ).subscribe((enrichedResult: ProductLevelPremium) => {
      this.premiumComputationPayloadToShare = enrichedResult;
      log.debug("Enriched Premium Computation: ", enrichedResult);
    });
  }

  // listenToSendEvent(sendEvent: { mode: ShareQuoteDTO }) {
  //   const emailPayload = this.notificationPayload()
  //   this.quotationService.generateQuotationReport(emailPayload).pipe(
  //     mergeMap((response) => {
  //       const payload: EmailDto = {
  //         code: null,
  //         address: [sendEvent.mode.email],
  //         subject: 'Quotation Report',
  //         message: `Dear ${sendEvent.mode.clientName},\nPlease find the attached quotation report.`,
  //         status: 'D',
  //         emailAggregator: 'N',
  //         response: '524L',
  //         systemModule: 'NB for New Business',
  //         systemCode: 0,
  //         attachments: [
  //           {
  //             name: 'quote-report.pdf',
  //             content: response.base64,
  //             type: 'application/pdf',
  //             disposition: 'attachment',
  //             contentId: 'quote-report'
  //           }
  //         ],
  //         sendOn: new Date().toISOString(),
  //         clientCode: 0,
  //         agentCode: 0
  //       };
  //       return this.notificationService.sendEmail(payload)

  //     })
  //   )
  //     .subscribe({
  //       next: (response) => {
  //         if (response) {
  //           this.globalMessagingService.displaySuccessMessage('success', 'Email sent successfully')
  //           log.debug("Response after sending email:", response)
  //           log.debug("Email sent:", response.sent)
  //           const emailSent = response.sent
  //           // if (emailSent == false) {
  //           //   this.globalMessagingService.displayErrorMessage('Error', 'This email adrress does not exist')
  //           // } else {
  //           //   const modal = bootstrap.Modal.getInstance(this.shareQuoteModal.nativeElement);
  //           //   modal.hide();
  //           // }
  //         }
  //       },
  //       error: (error) => {
  //         this.globalMessagingService.displayErrorMessage('error', error.error.message);
  //         log.debug(error);
  //       }
  //     })
  // }
  listenToSendEvent(sendEvent: { mode: ShareQuoteDTO }) {
    const reportPayload = this.notificationPayload();

    this.quotationService.generateQuotationReport(reportPayload).pipe(
      mergeMap((response) => {
        const base64Report = response.base64;

        // Common attachment object for re-use
        const attachment = {
          fileName: 'quote-report.pdf',
          mimeType: 'application/pdf',
          data: base64Report,
          caption: 'Quotation Report'
        };

        const { selectedMethod, clientName, email, smsNumber, whatsappNumber } = sendEvent.mode;

        // --- EMAIL MODE ---
        if (selectedMethod === 'email') {
          const emailPayload: EmailDto = {
            code: null,
            address: [email],
            subject: 'Quotation Report',
            message: `Dear ${clientName},\nPlease find the attached quotation report.`,
            status: 'D',
            emailAggregator: 'N',
            response: '524L',
            systemModule: 'NB for New Business',
            systemCode: 0,
            attachments: [
              {
                name: attachment.fileName,
                content: attachment.data,
                type: attachment.mimeType,
                disposition: 'attachment',
                contentId: 'quote-report'
              }
            ],
            sendOn: new Date().toISOString(),
            clientCode: 0,
            agentCode: 0
          };
          return this.notificationService.sendEmail(emailPayload);
        }

        // --- WHATSAPP MODE ---
        else if (selectedMethod === 'whatsapp') {
          // Ensure WhatsApp number is in E.164 format (with + prefix)
          const formattedWhatsappNumber = whatsappNumber.startsWith('+')
            ? whatsappNumber
            : `+${whatsappNumber}`;

          const whatsappPayload: WhatsappDto = {
            recipientPhone: formattedWhatsappNumber,
            message: `Dear ${clientName}, please find your quotation report attached.`,
            templateName: 'report_sharing_template_v1',
            templateParams: [clientName],
            attachments: [attachment]
          };
          return this.notificationService.sendWhatsapp(whatsappPayload);
        }

        // --- SMS MODE ---
        else if (selectedMethod === 'sms') {
          const message = this.buildQuotationMessage(reportPayload, clientName);
          const smsPayload: SmsDto = {
            scheduledDate: null,
            smsMessages: [
              {
                message: message,
                sendDate: new Date().toISOString(),
                systemCode: 0,
                telephoneNumber: smsNumber
              }
            ]
          };
          return this.notificationService.sendSms(smsPayload);
        }

        // --- UNSUPPORTED MODE ---
        else {
          return throwError(() => new Error('Unsupported send mode'));
        }
      })
    )
      .subscribe({
        next: (response) => {
          const channelLabel =
            sendEvent.mode.selectedMethod === 'email'
              ? 'Email'
              : sendEvent.mode.selectedMethod === 'whatsapp'
                ? 'WhatsApp'
                : 'SMS';
          this.globalMessagingService.displaySuccessMessage('success', `${channelLabel} sent successfully`);
          log.debug('Response after sending:', response);
        },
        error: (error) => {
          log.debug("error", error)
          const apiError = error.error;
          const message =
            apiError?.errors?.[0] ??
            apiError?.developerMessage ??
            'Failed to send message';

          this.globalMessagingService.displayErrorMessage('error', message);
        }


      });
  }

  toggleProductSelection(product: any) {
    const selected = this.isProductSelected(product);

    const fakeEvent = { target: { checked: !selected } };
    this.onCheckboxChange(fakeEvent as any, product);
  }

  buildQuotationMessage(data: any, clientName: string): string {
    let message = `Dear ${clientName}, find your attached quotation.\n\n`;

    data.products.forEach((product: any) => {
      message += `${product.description.toUpperCase()}\n`;

      product.riskLevelPremiums.forEach((risk: any) => {
        message += `  ${risk.propertyId}\n`;

        risk.coverTypeDetails.forEach((cover: any) => {
          const premium = cover.computedPremium.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          message += `    - ${cover.coverTypeDescription} (${cover.coverTypeShortDescription}) – ${premium}\n`;
        });

        message += '\n';
      });
    });

    return message.trim();
  }

}
