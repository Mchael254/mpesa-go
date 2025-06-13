import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators,} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';
import {ProductsService} from '../../../setups/services/products/products.service';
import {Logger, UtilService} from '../../../../../../shared/services';
import {BinderService} from '../../../setups/services/binder/binder.service';
import {QuotationsService} from '../../services/quotations/quotations.service';
import {AfterViewInit} from '@angular/core';


import {CurrencyService} from '../../../../../../shared/services/setups/currency/currency.service';
import {ClientService} from '../../../../../entities/services/client/client.service';
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
import {
  DynamicRiskField, LimitsOfLiability,
  QuickQuoteData,
  QuotationDetails,
  QuotationProduct,
  RiskInformation, ShareQuoteDTO,
  Tax,
  TaxInformation,
  UserDetail,
} from '../../data/quotationsDTO';
import {PremiumRateService} from '../../../setups/services/premium-rate/premium-rate.service';
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service';
import {Router} from '@angular/router';
import {untilDestroyed} from '../../../../../../shared/services/until-destroyed';

import {firstValueFrom, forkJoin, mergeMap, Observable, tap} from 'rxjs';
import {NgxCurrencyConfig} from 'ngx-currency';
import {OccupationService} from '../../../../../../shared/services/setups/occupation/occupation.service';
import {OccupationDTO} from '../../../../../../shared/data/common/occupation-dto';
import {VesselTypesService} from '../../../setups/services/vessel-types/vessel-types.service';
import {Pagination} from '../../../../../../shared/data/common/pagination';
import {TableDetail} from '../../../../../../shared/data/table-detail';
import {MenuService} from 'src/app/features/base/services/menu.service';
import {SidebarMenu} from 'src/app/features/base/model/sidebar.menu';
import {debounceTime} from "rxjs/internal/operators/debounceTime";
import {distinctUntilChanged, map} from "rxjs/operators";
import {BreadCrumbItem} from 'src/app/shared/data/common/BreadCrumbItem';
import {
  ComputationPayloadDto,
  CoverType, Limit,
  PremiumComputationRequest,
  Product,
  ProductLevelPremium,
  ProductPremium,
  Risk,
  RiskLevelPremium
} from "../../data/premium-computation";
import {QuotationDetailsRequestDto} from "../../data/quotation-details";
import {differenceInCalendarDays, parseISO} from 'date-fns';
import {QuoteReportComponent} from '../quote-report/quote-report.component';
import {EmailDto} from "../../../../../../shared/data/common/email-dto";

const log = new Logger('QuickQuoteFormComponent');

@Component({
  selector: 'app-quick-quote-form',
  templateUrl: './quick-quote-form.component.html',
  styleUrls: ['./quick-quote-form.component.css'],
})
export class QuickQuoteFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('calendar', {static: true}) calendar: Calendar;
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
  selectedProducts: Products[] = []
  previousSelected: Products[] = [];

  productRiskFields: DynamicRiskField[][] = [];
  // expandedStates: boolean[] = [];
  expandedQuoteStates: boolean[] = [];
  expandedComparisonStates: boolean[] = [];
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
    {field: 'clientFullName', header: 'Name'},
    {field: 'emailAddress', header: 'Email'},
    {field: 'phoneNumber', header: 'Phone number'},
    {field: 'idNumber', header: 'ID number'},
    {field: 'pinNumber', header: 'Pin'},
    {field: 'id', header: 'ID'},
  ];
  globalFilterFields = ['idNumber', 'firstName', 'lastName', 'emailAddress'];
  emailValue: string;
  phoneValue: string;
  pinValue: string;
  idValue: string;
  taxList: Tax[] = [];

  isReturnToQuickQuote: boolean;
  storedData: QuickQuoteData = null
  userCode: number;
  userOrgDetails: UserDetail;
  organizationId: number;
  exchangeRate: number;

  applicablePremiumRates: any
  premiumComputationResponse: ProductLevelPremium = null
  selectedProductCovers: ProductPremium[] = [];
  coverSelected = false;
  currentSelectedRisk: any
  currentComputationPayload: PremiumComputationRequest = null
  premiumComputationPayloadToShare: ProductLevelPremium = null
  selectedProductIndex: number = null
  selectedRiskIndex: number = null
  selectedRiskGroup: AbstractControl<any, any>;
  quotationObject: QuotationDetails;
  currentExpandedIndex: number | null = null;


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

  ngAfterViewInit(): void {
    //throw new Error('Method not implemented.');
  }

  //
  expandedCoverTypeIndex: number | null = 0;

  toggleCoverType(index: number) {
    if (this.expandedCoverTypeIndex === index) {
      this.expandedCoverTypeIndex = null;
    } else {
      this.expandedCoverTypeIndex = index;
    }
  }

  ngOnInit(): void {
    this.LoadAllFormFields();
    this.quickQuoteForm = this.fb.group({
      product: [[]],
      effectiveDate: [new Date()],
      quotComment: [''],
      products: this.fb.array([])
    });
    this.loadAllCurrencies()
    this.getuser()

    const savedState = sessionStorage.getItem('savedProductsState');
    log.debug("PRODUCT SAVED STATE", savedState)
    if (savedState) {
      const parsed = JSON.parse(savedState);
      this.selectedProducts = parsed.selectedProducts;
      log.debug("Form array ", parsed.formArray);
      // Patch top-level fields
      this.quickQuoteForm.patchValue({
        product: parsed.formArray.product || [],
        quotComment: parsed.formArray.quotComment || '',
        effectiveDate: parsed.formArray.effectiveDate || new Date()
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
    const premiumComputationResponse = JSON.parse(sessionStorage.getItem('premiumComputationResponse'));
    this.premiumComputationResponse = premiumComputationResponse
    log.debug("Premium Computation:", this.premiumComputationResponse)

    this.quotationObject = JSON.parse(sessionStorage.getItem('quotationObject'))
    log.debug("Quotation object", this.quotationObject)
    this.quotationNo = this.quotationObject?.quotationNo
    this.quotationCode = this.quotationObject?.code


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
  // createRiskGroup(riskFields: DynamicRiskField[],
  //   productCode: number, nextRiskIndex: number): FormGroup {
  //   const group: { [key: string]: AbstractControl } = {};

  //   riskFields.forEach(field => {
  //     group[field.name] = new FormControl(
  //       { value: '', disabled: field.disabled },
  //       field.isMandatory === 'Y' ? Validators.required : []
  //     );
  //   });
  //   group['applicableTaxes'] = new FormControl(null)
  //   group['applicableBinder'] = new FormControl(null)
  //   group['applicableCoverTypes'] = new FormControl(null)
  //   group['riskCode'] = new FormControl('#' + productCode + nextRiskIndex)
  //   return new FormGroup(group);
  // }
  createRiskGroup(riskFields: DynamicRiskField[],
                  productCode: number,
                  nextRiskIndex: number,
                  productIndex?: number,
                  riskIndex?: number): FormGroup {
    const group: { [key: string]: AbstractControl } = {};

    riskFields.forEach(field => {
      if (field.name === 'useOfProperty') {
        const subclasses = this.productSubclassesMap[productCode] || [];
        const initialValue = subclasses.length === 1 ? subclasses[0] : '';

        group[field.name] = new FormControl(
          initialValue,
          field.isMandatory === 'Y' ? Validators.required : []
        );

        // Trigger subclass selection if only one exists
        if (subclasses.length === 1) {
          setTimeout(() => {
            this.onSubclassSelected(
              subclasses[0],
              productIndex,
              riskIndex,
              productCode
            );
          });
        }
      } else {
        group[field.name] = new FormControl(
          {value: '', disabled: field.disabled},
          field.isMandatory === 'Y' ? Validators.required : []
        );
      }
    });

    group['applicableTaxes'] = new FormControl(null);
    group['applicableBinder'] = new FormControl(null);
    group['applicableCoverTypes'] = new FormControl(null);
    group['riskCode'] = new FormControl('#' + productCode + nextRiskIndex);

    return new FormGroup(group);
  }

  // When products are selected from multi-select
  getSelectedProducts(event: any) {
    const currentSelection = event.value as Products[];
    const currentCodes = currentSelection.map(p => p.code);
    const previousCodes = this.previousSelected.map(p => p.code);

    // Find added and removed products
    const addedProduct = currentSelection.find(p => !previousCodes.includes(p.code));
    const removedProduct = this.previousSelected.find(p => !currentCodes.includes(p.code));

    if (removedProduct) {
      // Remove unselected products from FormArray
      const index = this.productsFormArray.controls.findIndex(
        ctrl => ctrl.get('code')?.value === removedProduct.code
      );
      if (index !== -1) {
        this.productsFormArray.removeAt(index);
      }
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
          log.debug("SUBCLASS LIST:", this.productSubclassesMap)
          const risksArray = productGroup.get('risks') as FormArray;
          const nextRiskIndex = risksArray.length + 1;
          const riskIndex = risksArray.length
          log.debug("RISFH INDEX", nextRiskIndex);
          log.debug("RISFH INDEX NEW", riskIndex);

          risksArray.push(this.createRiskGroup(riskFields, addedProduct.code, nextRiskIndex, productIndex, riskIndex));
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

    log.debug("FormArray now >>>>", this.productsFormArray);
  }

  // Add risk row dynamically
  addRisk(productIndex: number) {
    const productGroup = this.productsFormArray.at(productIndex);
    const risksArray = productGroup.get('risks') as FormArray;
    const productCode = productGroup.get('code')?.value;
    const nextRiskIndex = risksArray.length + 1;
    this.getRiskFieldsForProduct(productCode).subscribe((riskFields: DynamicRiskField[]) => {
      const newRiskGroup = this.createRiskGroup(riskFields, productCode, nextRiskIndex, productIndex);
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

  // Remove product
  deleteProduct(product: AbstractControl, productIndex: number) {
    log.debug("Selected product>>>", product.value)
    log.debug("PRODUCT INDEX", productIndex)
    if (this.premiumComputationResponse) {
      this.premiumComputationResponse = {
        productLevelPremiums: this.premiumComputationResponse
          .productLevelPremiums.filter(value => value.code !== product.value.code)
      }
    }

    log.debug("Current computation payload >>>", this.premiumComputationResponse)
    this.productsFormArray.removeAt(productIndex);
    this.selectedProducts.splice(productIndex, 1);
  }

  markAllFieldsAsTouched(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);

      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllFieldsAsTouched(control);
      }
    });
  }

  onSubmit() {
    if (this.quickQuoteForm.invalid) {
      this.markAllFieldsAsTouched(this.quickQuoteForm);
      return;
    }
    log.debug("Form submission payload >>>>", this.quickQuoteForm.value);
    const computationRequest = this.computationPayload();
    log.debug("premium computation payload >>>>", computationRequest);
    this.performComputation(computationRequest)
  }

  performComputation(computationPayload: PremiumComputationRequest) {
    this.quotationService.premiumComputationEngine(computationPayload).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (response) => {
        const riskLevelPremiums = this.selectedProductCovers.flatMap(value => value.riskLevelPremiums);
        this.premiumComputationResponse = response;

        riskLevelPremiums?.forEach(selected => {
          this.premiumComputationResponse.productLevelPremiums.forEach(premium => {
            const match = premium.riskLevelPremiums.find(risk => risk.code === selected.code);
            if (match) {
              match.selectCoverType = selected.selectCoverType;
            }
          });
        });
        log.debug("Currently selected products after computation>>>", riskLevelPremiums, this.premiumComputationResponse)
        this.globalMessagingService.displaySuccessMessage('Success', 'Premium computed successfully ')
        log.debug("Computation response >>>>", response)
        this.cdr.markForCheck()
      }, error: (error) => {
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

  toggleCoverExpand(index: number) {
    this.expandedComparisonStates[index] = !this.expandedComparisonStates[index];
  }

  collapseAllCards() {
    this.expandedQuoteStates = this.expandedQuoteStates.map(() => false);
  }


  computationPayload(): PremiumComputationRequest {
    const formValues = this.quickQuoteForm.getRawValue();
    const withEffectFrom = new Date(formValues.effectiveDate);
    let payload = {
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
      products: this.getProductPayload(formValues),
      currency: {
        rate: this.exchangeRate
      }
    };
    this.currentComputationPayload = payload
    return payload;
  }

  getProductPayload(formValues: any): Product[] {
    let productPayload: Product[] = []
    for (let product of formValues.products) {
      productPayload.push({
        code: product.code,
        description: product.description,
        expiryPeriod: product.expiry,
        withEffectFrom: this.formatDate(new Date(formValues.effectiveDate)),
        withEffectTo: this.formatDate(new Date(product.effectiveTo)),
        risks: this.getRiskPayload(product, formValues.effectiveDate)
      })
    }
    return productPayload
  }

  getRiskPayload(product: any, effectiveDate): Risk[] {
    let riskPayload: Risk[] = []
    for (const [index, risk] of product.risks.entries()) {
      riskPayload.push({
        code: risk.riskCode,
        binderCode: risk?.applicableBinder?.code,
        sumInsured: risk?.selfDeclaredValue || risk?.value,
        withEffectFrom: this.formatDate(new Date(effectiveDate)),
        withEffectTo: this.formatDate(new Date(product.effectiveTo)),
        propertyId: `Risk ${index + 1}`,
        prorata: "F",
        subclassSection: {
          code: risk?.useOfProperty?.code
        },
        taxes: risk.applicableTaxes.map((tax) => {
          return {
            taxRate: tax.taxRate,
            code: tax.code,
            taxCode: tax.taxCode,
            divisionFactor: tax.divisionFactor,
            applicationLevel: tax.applicationLevel,
            taxRateType: tax.taxRateType
          }
        }),
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
      })
    }
    return riskPayload;
  }


  getCoverTypePayload(risk): CoverType[] {
    let coverTypes: CoverType[] = []
    for (let coverType of risk.applicableCoverTypes) {
      coverTypes.push({
        subclassCode: coverType?.subClassCode,
        coverTypeCode: coverType?.coverTypeCode,
        minimumAnnualPremium: null,
        minimumPremium: coverType?.minimumPremium,
        coverTypeShortDescription: coverType?.coverTypeShortDescription,
        coverTypeDescription: coverType?.description,
        limits: this.getLimitsPayload(coverType.applicableRates, risk)
      })
    }
    return coverTypes;
  }

  getLimitsPayload(applicableLimits: any, risk: any): Limit[] {
    log.debug("Processing risk >>.", risk, applicableLimits)
    let limitsPayload: Limit[] = []
    for (let limit of applicableLimits) {
      limitsPayload.push({
        calculationGroup: 1,
        declarationSection: "N",
        rowNumber: 1,
        limitPeriod: limit?.limitPeriod || 0,
        rateDivisionFactor: limit?.divisionFactor,
        premiumRate: limit?.rate,
        rateType: limit?.rateType,
        minimumPremium: limit.premiumMinimumAmount,
        annualPremium: 0,
        multiplierRate: limit?.multiplierRate || 1,
        section: {
          limitAmount: risk?.selfDeclaredValue || risk?.value,
          description: limit?.sectionDescription,
          code: limit?.sectionCode,
          isMandatory: "Y"
        },
        sectionType: limit?.sectionType,
        multiplierDivisionFactor: limit?.multiplierDivisionFactor,
        riskCode: null,
        limitAmount: risk?.selfDeclaredValue || risk?.value,
        description: limit?.sectionDescription,
        shortDescription: limit?.sectionShortDescription,
        sumInsuredRate: limit?.sumInsuredRate,
        freeLimit: limit?.freeLimit || 0,
        compute: "Y",
        dualBasis: "N",
      })
    }
    return limitsPayload
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
    this.coverFromDate = today;
    log.debug(' Date format', this.dateFormat);

    const todaysDate = new Date(today);
    this.selectedEffectiveDate = todaysDate;
    log.debug(' todays date before being formatted', todaysDate);

    // Extract the day, month, and year
    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', {month: 'long'}); // 'long' gives the full month name
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
    control.updateValueAndValidity({emitEvent: false});

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

      control.updateValueAndValidity({emitEvent: false});
    });
  }


  uniqueValidator(control: AbstractControl) {
    return {unique: true};
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
      this.taxList = taxes._embedded as Tax[]
      riskFormGroup.get('applicableTaxes')?.setValue(taxes._embedded)
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

    control.setValue(upperCaseValue, {emitEvent: false});
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
        target: {value: this.searchTerm},
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

          this.globalMessagingService.displayErrorMessage('Error', error?.error?.message);
        }
      });
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
          this.exchangeRate = response
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
          const fullState = {
            selectedProducts: this.selectedProducts,
            formArray: this.quickQuoteForm.value,
          };
          sessionStorage.setItem('savedProductsState', JSON.stringify(fullState));
          const computationPayload: ComputationPayloadDto = {
            quotationCode : +response._embedded?.quotationCode,
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
      wefDate: this.formatDate(new Date(formModel.effectiveDate)),
      wetDate: formModel.products[0]?.effectiveTo,
      premium: totalPremium,
      branchCode: this.userBranchId || 1,
      comments: formModel.quotComment,
      clientType: 'I'
    }
  }

  getQuotationProductPayload(): QuotationProduct[] {
    const quotationProducts: QuotationProduct[] = []
    const products = this.quickQuoteForm.getRawValue().products
    log.debug("User selected products>>>", products)
    let coverFrom = this.formatDate(new Date(this.quickQuoteForm.get('effectiveDate').value));
    for (let product of products) {
      let selectedProductPremium = this.selectedProductCovers
        .find(value => value.code === product.code)
      log.debug("Selected coverType", selectedProductPremium)
      selectedProductPremium.coverFrom = coverFrom
      selectedProductPremium.coverTo = product.effectiveTo
      const productPremium = selectedProductPremium.riskLevelPremiums
        .reduce((sum, value) => sum + value.selectCoverType.computedPremium, 0);
      quotationProducts.push({
        code: null,
        productCode: product.code,
        quotationCode: null,
        productName: product.description,
        productShortDescription: product.description,
        premium: productPremium,
        wef: coverFrom,
        wet: product.effectiveTo,
        totalSumInsured: 0,
        converted: "N",
        binder: null,
        agentShortDescription: "DIRECT",
        riskInformation: this.getProductRisksPayload(product.risks, selectedProductPremium),
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
        transactionCode: original.taxCode,
        renewalEndorsement: null,
        taxRateCode: null,//original?.taxCode,
        levelCode: original?.applicationLevel,
        taxType: original?.taxType,
        riskProductLevel: original?.applicationLevel,
        rate: original?.taxRate,
      };
    })
  }

  getProductRisksPayload(formRisks: any, product: ProductPremium): RiskInformation[] {
    const riskInformation: RiskInformation[] = []
    for (const [index, risk] of product.riskLevelPremiums.entries()) {
      const formRisk = formRisks.find(value => value.riskCode === risk.code)
      log.debug("Processing Risk>>>, formRisk", risk, formRisk)
      riskInformation.push({
        riskCode: risk?.code,
        coverTypeCode: risk.selectCoverType.coverTypeCode,
        coverTypeShortDescription: risk.selectCoverType.coverTypeShortDescription,
        coverTypeDescription: risk.selectCoverType.coverTypeDescription,
        productCode: product.code,
        premium: risk.selectCoverType.computedPremium,
        value: formRisk?.selfDeclaredValue || formRisk?.value,
        clientType: "I",
        itemDesc: `Risk ${index + 1}`,
        wef: product.coverFrom,
        wet: product.coverTo,
        propertyId: `Risk ${index + 1}`,
        annualPremium: risk.selectCoverType.computedPremium,
        sectionsDetails: null,
        action: "A",
        clauseCodes: Array.from(new Set(risk.coverTypeDetails.flatMap(cover =>
            (cover.clauses ?? []).map(clause => clause.code)
          )
        )),
        subclassCode: risk.selectCoverType.subclassCode,
        binderCode: risk.binderCode,
        riskLimits: risk.selectCoverType.limitPremium.map((limit) => {
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
            code: limit.sectCode,
            compute: "Y",
            description: limit.description,
            freeLimit: limit?.freeLimit || 0,
            multiplierDivisionFactor: limit.multiplierDivisionFactor,
            multiplierRate: limit.multiplierRate,
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
    log.debug("Selected risk >>>", riskDetails)
    log.debug("Currently selected products >>>", this.selectedProductCovers)
    this.currentSelectedRisk = riskDetails
    this.selectedProductCovers = this.selectedProductCovers.filter(value => value.code !== product.code);
    this.selectedProductCovers.push(product)
    if (this.selectedProductCovers.length === this.premiumComputationResponse.productLevelPremiums.length) {
      this.coverSelected = true
    }
  }


  removeBenefit(benefitDto: { risk: RiskLevelPremium, premiumItems: Premiums }) {
    const sectionToRemove = benefitDto.premiumItems.sectCode
    const dtoToProcess: { risk: RiskLevelPremium, premiumItems: Premiums[] } = {
      risk: benefitDto.risk,
      premiumItems: []
    }
    log.debug("About to remove >>>>", benefitDto, dtoToProcess, sectionToRemove)
    const updatedPayload = this.modifyPremiumPayload(dtoToProcess, sectionToRemove)
    setTimeout(() => {
      this.performComputation(updatedPayload);
      document.body.style.overflow = 'auto';
    }, 100);
  }

  listenToBenefitsAddition(benefitDto: { risk: RiskLevelPremium, premiumItems: Premiums[] }) {
    let updatedPayload = this.modifyPremiumPayload(benefitDto);
    log.debug("Modified Premium Computation Payload:", updatedPayload);
    setTimeout(() => {
      this.performComputation(updatedPayload);
      document.body.style.overflow = 'auto';
    }, 100);
  }

  modifyPremiumPayload(benefitsDto: {
    risk: RiskLevelPremium,
    premiumItems: Premiums[]
  }, sectionCodeToRemove?: number): PremiumComputationRequest {
    const premiumComputationRequest = this.currentComputationPayload || this.computationPayload();
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
            log.debug("Section to remove>>", sectionCodeToRemove, updatedLimits, coverTypeCode)
            if (sectionCodeToRemove) {
              updatedLimits = updatedLimits.filter(
                limit => limit.section.code !== sectionCodeToRemove
              );
            }
            if (benefitsDto.premiumItems.length > 0) {
              updatedLimits = updatedLimits.map(limit => {
                const match = benefitsDto.premiumItems.find(b => b.code === limit.section.code);
                return match
                  ? {...limit, limitAmount: match.limitAmount}
                  : limit;
              });
              benefitsDto.premiumItems.forEach(benefit => {
                updatedLimits = updatedLimits.filter(value => value.section.code !== benefit.sectionCode)
                log.debug("I am adding this benefit>>>", benefit)
                updatedLimits.push({
                  section: {
                    code: benefit.sectionCode,
                    description: benefit.sectionDescription,
                    isMandatory: "N",
                    limitAmount: benefit.limitAmount
                  },
                  multiplierDivisionFactor: benefit.multiplierDivisionFactor,
                  riskCode: null,
                  shortDescription: benefit.sectionDescription,
                  limitAmount: benefit.limitAmount,
                  premiumRate: benefit.rate ?? 1,
                  minimumPremium: benefit.minimumPremium ?? 0,
                  rateType: benefit.rateType,
                  calculationGroup: 1,
                  declarationSection: "N",
                  limitPeriod: benefit?.limitPeriod || 0,
                  rowNumber: updatedLimits.length + 1,
                  rateDivisionFactor: benefit.divisionFactor,
                  annualPremium: 0,
                  multiplierRate: benefit.multiplierRate || 1,
                  sectionType: benefit.sectionType,
                  description: benefit.sectionDescription,
                  compute: "Y",
                  dualBasis: "N",
                  freeLimit: benefit.freeLimit
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
    let updatedPayload = {
      ...premiumComputationRequest,
      products: updatedProducts
    };
    this.currentComputationPayload = updatedPayload
    return updatedPayload;
  }

  isShareModalOpen = false;

  openShareModal() {
    this.isShareModalOpen = true;
  }

  closeShareModal() {
    this.isShareModalOpen = false;
  }

  @ViewChild('shareQuoteModal') shareQuoteModal?: ElementRef;
  @ViewChild('quoteReport', {static: false}) quoteReportComponent!: QuoteReportComponent;


  onDownloadRequested() {
    this.cdr.detectChanges();
    setTimeout(() => {
      this.quoteReportComponent.generatePdf(true).then(r => {

      })
    }, 100);
  }

  fetchCoverRelatedData() {
    const productLevelPremiums$ = this.premiumComputationResponse.productLevelPremiums.map((product) => {
      const riskLevelPremiums$ = product.riskLevelPremiums.map((risk) => {
        const coverTypeDetails$ = risk.coverTypeDetails.map((coverType) => {
          const clauses$ = this.quotationService.getClauses(coverType.coverTypeCode, coverType.subclassCode);
          const limits$ = this.quotationService.getLimitsOfLiability(coverType.subclassCode);
          const excesses$ = this.quotationService.getExcesses(coverType.subclassCode);
          return forkJoin([clauses$, limits$, excesses$]).pipe(
            map(([clauses, limits, excesses]) => ({
              ...coverType,
              clauses: clauses?._embedded ?? [],
              limits,
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

  listenToSendEvent(sendEvent: { mode: ShareQuoteDTO }) {
    if (sendEvent && ['email', 'whatsapp'].includes(sendEvent.mode.selectedMethod)) {
      this.cdr.detectChanges();
      setTimeout(async () => {
        try {
          const pdfFile = await this.quoteReportComponent.generatePdf(false, 'quote-report.pdf');
          if (pdfFile) {
            const emailDto: EmailDto = {
              address: [sendEvent.mode.email],
              clientCode: 0,
              attachments: [],
              subject: 'Draft Quotation',
              message: 'Draft Quotation',
              emailAggregator: 'P',
              systemModule: 'GIS',
              systemCode: 37,
              fromName: 'Turnkey Africa',
              sendOn: new Date().toString(),
              from: 'test@gmail.com',
              status: 'pending'
            }
            const formData = new FormData();
            this.quotationService.sendEmail(emailDto).pipe(
              untilDestroyed(this)
            )
              .subscribe((response) => {
                log.debug("Form Data....", response);
              })
            formData.append('file', pdfFile, 'quote-report.pdf');
          }
        } catch (err) {
          console.error('PDF generation failed', err);
        }
      }, 200);
    }
  }
}
