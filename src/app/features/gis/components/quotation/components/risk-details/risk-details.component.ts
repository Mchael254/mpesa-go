import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PolicyService } from '../../../policy/services/policy.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { RiskClausesService } from '../../../setups/services/risk-clauses/risk-clauses.service';
import { SectionsService } from '../../../setups/services/sections/sections.service';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { VehicleMakeService } from '../../../setups/services/vehicle-make/vehicle-make.service';
import { VehicleModelService } from '../../../setups/services/vehicle-model/vehicle-model.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Clause, CreateLimitsOfLiability, DynamicRiskField, Excesses, QuotationDetails, quotationRisk, RiskCommissionDto, RiskInformation, RiskLimit, riskSection, scheduleDetails, ScheduleLevels, ScheduleTab, TaxInformation, TaxPayload } from '../../data/quotationsDTO';
import { Premiums, subclassClauses, SubclassCoverTypes, Subclasses, territories, vehicleMake, vehicleModel } from '../../../setups/data/gisDTO';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { debounceTime, distinctUntilChanged, firstValueFrom, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { Table } from 'primeng/table';
import { NgxCurrencyConfig } from "ngx-currency";
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as bootstrap from 'bootstrap';
import { riskClause, riskPeril } from 'src/app/features/gis/data/quotations-dto';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TerritoriesService } from '../../../setups/services/perils-territories/territories/territories.service';
import { RiskCentreComponent } from '../risk-centre/risk-centre.component';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { RiskDmsDocument } from 'src/app/shared/data/common/dmsDocument';


const log = new Logger('RiskDetailsComponent');

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.component.html',
  styleUrls: ['./risk-details.component.css'],
  animations: [
    trigger('slideInOut', [
      state('open', style({
        height: '*', // Expand to fit content
        opacity: 1,
        overflow: 'hidden',
      })),
      state('closed', style({
        height: '0', // Collapse to 0 height
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('open <=> closed', [
        animate('300ms ease-in-out') // Smooth transition
      ]),
    ]),
  ],
})

export class RiskDetailsComponent {


  getFreeLimitLabel(arg0: any) {
    throw new Error('Method not implemented.');
  }
  @Input() selectedProduct!: any;
  @Output() premiumsChange = new EventEmitter<any>();
  @ViewChild('sectionTable') sectionTable!: Table;
  @ViewChild('limitTable') limitTable!: Table;
  @ViewChild('addedlimitTable') addedlimitTable!: Table;
  @ViewChild('excessTable') excessTable!: Table;
  @ViewChild('addExcessTable') addExcessTable!: Table;
  @ViewChild('riskClauseTable') riskClauseTable!: Table;
  @ViewChild('addRiskModal') addRiskModalRef!: ElementRef;
  @ViewChild('addRiskSection') addRiskSectionRef!: ElementRef;
  @ViewChild('editSectionModal') editSectionModal!: ElementRef;
  @ViewChild('perilsModal') perilsModal!: ElementRef;
  @ViewChild('choosePerilsModal') choosePerilsModal!: ElementRef;
  @ViewChild('taxTable') taxTable!: Table;
  @ViewChild('addotherScheduleModal') addotherScheduleModalRef!: ElementRef;
  @ViewChild('addedCommissionTable') addedCommissionTable!: Table;
  @ViewChild('commissionTable') commissionTable!: Table;
  @ViewChild(RiskCentreComponent) RiskCentreComponent!: RiskCentreComponent;




  private modals: { [key: string]: bootstrap.Modal } = {};

  modalInstance: any;
  sectionInstance: any;

  riskDetails: RiskInformation[] = [];
  riskDetailsForm: FormGroup;
  showRiskDetails: boolean = true;
  showRiskDetailsColumnModal = false;
  riskDetailsColumns: { field: string; header: string; visible: boolean, filterable: boolean }[] = [];

  minDate: Date | undefined;
  motorClassAllowed: string;
  showMotorSubclassFields: boolean = false;
  showNonMotorSubclassFields: boolean = false;
  dateFormat: string;
  primeNgDateFormat: string; // PrimeNG format
  private datePipe: DatePipe = new DatePipe('en-US');
  coverFromDate: string;
  coverToDate: string;
  midnightexpiry: any;
  binderList: any;
  binderListDetails: any;
  selectedBinderList: any;
  selectedBinderCode: any;
  selectedCoverType: SubclassCoverTypes;
  subclassCoverType: SubclassCoverTypes[] = [];
  passedCoverTypeCode: number;
  coverTypeCode: any;
  storedRiskFormDetails: quotationRisk = null
  vehicleMakeList: vehicleMake[];
  vehicleModelList: any;
  vehicleModelDetails: vehicleModel[];
  filteredVehicleModel: any;
  selectedVehicleMakeCode: any;
  vehiclemakeModel: any = '';
  selectedVehicleMakeName: any;
  selectedVehicleModelName: any;
  passedRiskId: any;
  allMatchingSubclasses = [];
  selectedSubclassCode: any
  passedSubclassCode: number;
  defaultBinder: any;
  defaultBinderName: any;
  regexPattern: string;
  taxList: any;
  clientList: ClientDTO[];
  client: ClientDTO[];
  clientName: any;
  selectedClientList: ClientDTO;
  insuredCode: any;
  quotationCode: any;
  quotationNumber: string;
  quotationDetails: QuotationDetails;
  selectedProductCode: any;
  quotationRiskData: any;
  quoteProductCode: any;
  quotationRiskCode: any
  sectionPremium: Premiums[] = [];
  passedCoverFromDate: string;
  passedCoverToDate: string;

  scheduleDetailsForm: FormGroup;
  level2DetailsForm: FormGroup;
  scheduleData: any;
  scheduleList: any;
  selectedSchedule: any;
  updatedSchedule: any;
  updatedScheduleData: any;
  passedlevel: any;
  bodytypesList: any;
  motorColorsList: any;
  securityDevicesList: any;
  motorAccessoriesList: any;
  modelYear: any;
  selectedRisk: RiskInformation;

  selectedSections: Premiums[] = [];
  selectedSection: any;
  updatedSelectedSections: riskSection[] = [];
  sectionDetails: any[] = [];
  sectionDetailsForm: FormGroup;
  riskSectionList: riskSection[] = [];

  selectedRiskSection: any;
  inputErrors: { [key: string]: boolean } = {};
  private typingTimer: any;// Timer reference
  passedSections: any[] = [];
  sectionToBeRemoved: number[] = [];
  public currencyObj: NgxCurrencyConfig;

  editing = false; // Add other properties as needed
  modalHeight: number = 200; // Initial height
  clauseList: Clause[];
  // selectedClauseList: Clause[];
  SubclauseList: any[] = [];
  selectedSubClauseList: subclassClauses[];
  selectedClauseCode: any;
  // clauseDetail:any;
  selectedClause: subclassClauses[] = [];
  nonMandatoryClauses: subclassClauses[] = [];
  riskClause: subclassClauses[] = [];
  selectProductCode: any
  showOtherSscheduleDetails: boolean = false;
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
    selectOptions?: { label: string; value: any }[];
  }[];
  subclassFormContent: any
  subclassFormData: {
    options: any[];
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
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[];
    applicableLevel: string
  }[];
  allSubclassFormData: {
    options: any[];
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
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[];
    applicableLevel: string
  }[];
  dynamicSubclassFormFields: {
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
    scheduleLevel: number
    selectOptions?: { label: string; value: any }[]
    applicableLevel: string
  }[];
  existingPropertyIds: string[] = [];
  dynamicRegexPattern: string;
  clientsData: ClientDTO[] = [];
  sectionToDelete: any = null;
  declaration1: boolean | null = null;
  declaration2: boolean | null = null;
  premiumTypes: any[] = [];
  isEditable: boolean = false;
  quotationIsAuthorised: boolean = true; // or false
  yearList: any;
  clientCode: number;
  // showSections: boolean = false;
  scheduleTabs: ScheduleTab[] = [];
  activeTab: ScheduleTab | null = null;
  isEditMode: boolean = false;
  isAddMode: boolean = false;

  selectedRiskClauses: any;
  clauseModified: boolean = false;
  sessionClauses: any[] = [];
  selectedRiskCode: any;
  showRiskClauses: boolean = true;
  showClauseModal: boolean = false;
  clausesModified: boolean = false;
  clauses: any;
  selectedRiskClause: any = {
    id: '',
    heading: '',
    wording: ''
  };
  originalClauseBeforeEdit: any = null;
  clauseToDelete: any = null;
  selectedClauses: any[] = [];
  showClauses: boolean = true;
  showClauseColumnModal = false;

  columns: { field: string; header: string; visible: boolean }[] = [];
  clauseColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];

  showSections: boolean = true;
  showColumnModal = false;
  columnModalPosition = { top: '0px', left: '0px' };
  selectedSubclassObject: Subclasses;
  freeLimitValue: any;
  sumInsured: number;
  mandatoryClause: any[];
  scheduleLevels: ScheduleLevels[] = [];
  levelTableColumnsMap: { [levelName: string]: Array<{ field: string, header: string }> } = {};
  riskActiveTab: string = 'riskClauses';

  levelDataMap: { [levelName: string]: any[] } = {};
  activeFormFields: { type: string; name: string; max: number; min: number; isMandatory: string; disabled: boolean; readonly: boolean; regexPattern: string; placeholder: string; label: string; scheduleLevel: number; selectOptions?: { label: string; value: any; }[]; }[];
  activeModalTab: ScheduleTab | null = null;
  scheduleOtherDetailsForm: FormGroup;
  addedLimitsOfLiability: any[] = [];
  selectedRiskLimits: any[] = [];

  showLimitModal: boolean = false;
  showLimitsOfLiability: boolean = true;
  showLimitsOfLiabilityColumnModal = false;
  limitsOfLiability: any[] = [];
  selectedLimit: any = { value: '', narration: '', };
  selectedDeleteLimit: any;
  originalLimitBeforeEdit: any = { value: '', narration: '' };
  originalLimitsOfLiability: any;
  limitsOfLiabilityColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];

  addedExcessess: any[] = [];
  selectedExcessess: any[] = [];
  showExcessModal: boolean = false;
  excessesData: any[] = [];
  selectedExcess: any = { value: '', narration: '', };
  originalExcessBeforeEdit: any = { value: '', narration: '' };
  originalExcesses: any;
  selectedDeleteExcess: any;
  showExcesses: boolean = true;
  showExcessesColumnModal = false;
  excessesColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];

  showPerils: boolean = true;
  showPerilColumnModal = false;
  perilColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];
  addedPerils: any[] = [];
  allPerilsMap: { [key: string]: any[] } = {};
  selectedPeril: any = null;
  showPerilsModal: boolean = false;
  perils: any[] = [];
  perilDetailsForm: FormGroup;
  perilTypeOptions = [
    { label: 'Self', value: 'SL' },
    { label: 'Third party', value: 'TP' },
    { label: 'Both', value: 'BO' }
  ];
  excessTypeOptions = [
    { label: 'Percentage', value: 'P' },
    { label: 'Amount', value: 'A' }
  ];
  sumInsuredOptions = [
    { label: 'Risk sum insured', value: 'SI' },
    { label: 'Section SI/Limit', value: 'SL' },
    { label: 'Peril limit', value: 'PL' },
    { label: 'Unlimited', value: 'UL' },
    { label: 'Extension', value: 'EL' }
  ];
  limitationOfUse: any[] = [];
  editingPeril: any = null;
  isPerilEditMode: boolean = false;
  perilToDelete: any;
  taxes: [] = [];
  showEditTaxModal: any;
  selectedTax: any = null;
  transactionTypes: any[] = [];
  isEditingTax: boolean = false;
  taxForm: FormGroup;
  showTaxModal = false;
  quotationView: QuotationDetails;
  taxDetails: TaxInformation[] = [];
  showTaxes: boolean = true;
  showTaxesColumnModal = false;
  taxesColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];
  isEditScheduleMode = false
  isLogBookAvailable = true;
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  errorMessage = '';
  successMessage = '';
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  selectedLevelNumber: any;
  isNewClientSelected: boolean = false;
  quickQuoteConverted: boolean = false;
  showModalSpinner = false;

  commissions: any[] = [];
  originalCommissions: any;
  showCommissionsModal: boolean = false;
  showCommissionsColumnModal = false;
  selectedCommission: any;
  showCommissions: boolean = true;
  commissionsColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];
  periodRates = [
    { label: 'Prorata', value: 'P' },
    { label: 'Short period rates', value: 'S' },
    { label: 'Full', value: 'F' },
  ]
  conveyannceTypes = [
    { label: 'By sea', value: 'SEA' },
    { label: 'By air', value: 'AIR' },
    { label: 'By sea-rail-road', value: 'SEA-RAIL-ROAD' },
    { label: 'By sea-road', value: 'SEA-ROAD' },
    { label: 'By air-road', value: 'AIR-ROAD' },

  ]
  ncdLevels = [
    { label: '1', value: 1 },
    { label: '2', value: 2 },
    { label: '3', value: 3 },
    { label: '4', value: 4 },
    { label: '5', value: 5 },
  ]
  logBookUploaded: boolean;
  showAiImportModal: boolean;
  uploadProgress: number;
  ncdStatusSelected: boolean;
  territories: territories[] = [];
  commissionToDelete: any = null;
  editingRowCode: number | null = null;

  aiErrorMessage: string | null = null;
  exceptionsData: any;
  premiumComputed: boolean = false;
  premiums: { net: number; gross: number; sumInsured: number };
  levelNumber: number;

  constructor(
    public subclassService: SubclassesService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public sharedService: SharedQuotationsService,
    public binderService: BinderService,
    public clientService: ClientService,
    public quotationService: QuotationsService,
    public sectionService: SectionsService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public vehicleMakeService: VehicleMakeService,
    public vehicleModelService: VehicleModelService,
    public producSetupService: ProductsService,
    public premiumRateService: PremiumRateService,
    public riskClauseService: RiskClausesService,
    public globalMessagingService: GlobalMessagingService,
    private policyService: PolicyService,
    public productService: ProductsService,
    public fb: FormBuilder,
    public cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private router: Router,
    private spinner: NgxSpinnerService,
    public territoryService: TerritoriesService,
    private dmsService: DmsService,


  ) {
    this.quickQuoteConverted = JSON.parse(sessionStorage.getItem('quickQuoteFlag'))

    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');
    log.debug("Quotation number from session storage:", this.quotationNumber)


  }

  public isCollapsibleOpen = false;
  public isOtherDetailsOpen = false;
  public isSectionDetailsOpen = false;
  public isThirdDetailsOpen = false;
  public isClausesOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && this.selectedProduct) {
      console.log("Selected Product-risk details:", this.selectedProduct);
      const selectedProductCode = this.selectedProduct?.productCode
      this.selectedProductCode = selectedProductCode
      this.loadSelectedProductRiskFields(selectedProductCode)
      this.getProductSubclass(selectedProductCode)
      this.checkMotorClass(selectedProductCode)
      const quoatationNo = this.selectedProduct?.quotationNo
      const quoatationCode = this.selectedProduct?.quotationCode
      log.debug('QUOTATION CODE- NGONCHANGES', quoatationCode)
      this.fetchQuotationDetails(quoatationCode)
      this.scheduleList = []
      this.sectionPremium = []
      this.sectionDetails = []
      this.levelDataMap = {}
      this.levelTableColumnsMap = {}
      this.scheduleTabs = []
      this.showOtherSscheduleDetails = false;

    }
  }

  ngOnInit(): void {
    this.isNewClientSelected = JSON.parse(sessionStorage.getItem('isNewClientSelected'))
    log.debug("Is this new client:", this.isNewClientSelected)
    this.quotationRiskCode = sessionStorage.getItem('selectedRiskCode');
    this.quotationCode = sessionStorage.getItem('quotationCode');
    this.fetchQuotationDetails(this.quotationCode);
    this.quoteProductCode = sessionStorage.getItem('newQuotationProductCode');
    const savedSubclass = sessionStorage.getItem('selectedSubclassCode');
    this.selectedSubclassCode = savedSubclass

    // if (savedSubclass) {
    //   this.selectedSubclassCode = savedSubclass;
    //   this.loadExcesses();
    // }
    this.fetchAddedLimitsOfLiability();
    this.initializePerilDetails();
    this.initializePerils();
    this.loadAddedClauses();
    this.getAddedExcesses();
    this.loadExcesses();
    if (this.selectedSubclassCode) {
      this.loadLimitsOfLiability();
      this.loadPersistedRiskClauses();

    }
    if (this.selectedSubclassCode && this.quoteProductCode) {
      this.loadAddedLimitsOfLiability();
    }
    this.loadAddedCommissions();
    this.createTaxForm();

    this.riskDetailsForm = new FormGroup({
      subclass: new FormControl(null)
    });
    this.scheduleOtherDetailsForm = this.fb.group({});
    this.dateFormat = sessionStorage.getItem('dateFormat');
    const dynamicFormFields = JSON.parse(sessionStorage.getItem('dynamicSubclassFormField'));
    this.dynamicSubclassFormFields = dynamicFormFields
    log.debug("Date Formart", this.dateFormat)

    // Convert dateFormat to PrimeNG format
    this.primeNgDateFormat = this.dateFormat
      .replace('yyyy', 'yy')
      .replace('MM', 'mm');

    // this.updateRiskDetailsForm();
    this.createScheduleDetailsForm();
    this.createSectionDetailsForm();
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol')
    log.debug("currency Object:", currencySymbol)
    log.debug("currency Delimeter:", currencyDelimiter)
    this.currencyObj = {
      prefix: currencySymbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };

    this.clientCode = Number(sessionStorage.getItem('insuredCode'))

    this.loadClientsThenInsured();
    if (!this.riskDetailsForm.contains('insureds')) {
      this.riskDetailsForm.addControl('insureds', new FormControl('',));
    }

    //dropdown changes
    this.riskDetailsForm.get('insureds')?.valueChanges.subscribe((clientId: number) => {
      const selectedClient = this.clientsData.find(c => c.id === clientId);
      if (selectedClient) {
        log.debug('Current client details:', selectedClient);

        // persist if needed
        sessionStorage.setItem('selectedClientId', clientId.toString());
        sessionStorage.setItem('selectedClient', JSON.stringify(selectedClient));
      }
    });

    const savedClientId = sessionStorage.getItem('selectedClientId');
    if (savedClientId) {
      this.isNewClientSelected = false
      this.riskDetailsForm.patchValue({ insureds: +savedClientId });
    }
    if (this.isNewClientSelected) {
      this.riskDetailsForm.get('insureds')?.disable();
    } else {
      this.riskDetailsForm.get('insureds')?.enable();
    }

  }

  ngOnDestroy(): void { }

  ngAfterViewInit(): void {

    this.modals['editSection'] = new bootstrap.Modal(this.editSectionModal.nativeElement);

    // Initialize addRiskModal
    if (this.addRiskModalRef?.nativeElement) {
      this.modalInstance = new bootstrap.Modal(this.addRiskModalRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
    }

    // Initialize addRiskSection (if treated like another modal)
    if (this.addRiskSectionRef?.nativeElement) {
      this.sectionInstance = new bootstrap.Modal(this.addRiskSectionRef.nativeElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }

  private initializePerilDetails() {
    this.perilDetailsForm = this.fb.group({
      description: ['', Validators.required],
      shortDescription: ['', Validators.required],
      claimLimit: [null, Validators.required],
      personLimit: [null, Validators.required],
      excess: [null, Validators.required],
      excessMax: [null, Validators.required],
      excessMin: [null, Validators.required],
      tlExcessType: [null, Validators.required],
      plExcessType: [null, Validators.required],
      perilLimit: [null, Validators.required],
      subclassSectionPerilCode: [null, Validators.required],
      perilType: [null, Validators.required],
      sumInsuredOrLimit: [null, Validators.required],
      expireOnClaim: [null, Validators.required]
    });
  }


  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();
  }


  setDeclaration1(value: boolean) {
    this.declaration1 = value;
    this.riskDetailsForm.get('declarationField')?.setValue(value ? 'Yes' : 'No'); // Optional
  }

  setDeclaration2(value: boolean) {
    this.declaration2 = value;
    this.riskDetailsForm.get('computeField')?.setValue(value ? 'Yes' : 'No'); // Optional
  }

  setSectionToDelete(section: any) {
    this.sectionToDelete = section;
    log.debug("Section to delete", this.sectionToDelete);
  }

  confirmDelete() {
    if (this.sectionToDelete) {
      const sectionId = this.sectionToDelete.code; // ✅ use code
      if (sectionId) {
        this.deleteRiskSection(sectionId);
      }
    }
  }

  fetchQuotationDetails(quotationCode: number) {
    log.debug("Quotation Number tot use:", quotationCode)
    this.quotationService.getQuotationDetails(quotationCode)
      .subscribe({
        next: (res: any) => {
          this.quotationDetails = res;
          log.debug("Quotation details-risk details", this.quotationDetails);
          const premiumComputed = this.quotationDetails.premiumComputed
          if (premiumComputed === 'Y') {
            this.premiumComputed = true
          } else {
            this.premiumComputed = false
          }

          // Reset commissions tab if currently active but agent source is not selected
          if (this.riskActiveTab === 'commissions' && this.isCommissionsButtonDisabled) {
            this.riskActiveTab = 'riskClauses'; // Reset to default tab
          }

          this.quoteProductCode = this.quotationDetails.quotationProducts?.[0].code;
          sessionStorage.setItem('newQuotationProductCode', this.quoteProductCode);
          this.selectedSubclassCode = this.quotationDetails?.quotationProducts?.[0].riskInformation?.[0]?.subclassCode;
          sessionStorage.setItem('selectedSubclasscode', this.selectedSubclassCode);

          this.insuredCode = this.quotationDetails.clientCode || this.clientCode
          log.debug("Insured code:", this.insuredCode)
          this.clientCode = this.quotationDetails.clientCode
          sessionStorage.setItem('insuredCode', this.insuredCode)
          if (this.insuredCode) {
            // this.loadClientDetails();
            // this.loadAllClients();
            this.loadClientsThenInsured()
          }

          this.passedCoverFromDate = this.quotationDetails.coverFrom
          this.passedCoverToDate = this.quotationDetails.coverTo
          log.debug("Selected Product code -fetching:", this.selectedProductCode)
          const productDetails = this.quotationDetails.quotationProducts.find(
            product => product.productCode === this.selectedProductCode
          )
          // this.quoteProductCode = productDetails.code;

          log.debug("limit qpcode", this.quoteProductCode);

          //risk details
          this.riskDetails = productDetails?.riskInformation || [];
          if (this.riskDetails && this.riskDetails.length > 0) {
            this.setRiskDetailsColumns(this.riskDetails[0]);
          }
          log.debug('risk details', this.riskDetails)

          const curentlySavedRisk = this.riskDetails?.find(risk => risk.code == this.quotationRiskCode) || this.riskDetails[0];
          log.debug('Currently saved Risk:', curentlySavedRisk)



          // ✅ Tax Information
          this.taxDetails = productDetails?.taxInformation || [];
          log.debug("taxDetailsr", this.taxDetails);
          if (this.taxDetails.length > 0) {
            this.setTaxesColumns(this.taxDetails[0]);
            log.debug("taxcolumns", this.taxDetails)
          }

          curentlySavedRisk && this.handleRowClick(curentlySavedRisk)
          log.debug("Risk information specific to the selected product:", this.riskDetails)


          log.debug("Schedule information specific to the selected product:", this.scheduleList)
          if (this.scheduleList?.[0]?.details?.level2) {
            this.showOtherSscheduleDetails = true;
          } else {
            this.showOtherSscheduleDetails = false;

          }
          this.getAddedExcesses();
          this.loadExcesses();


        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }


  selectAll: boolean = false;
  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.sectionPremium.forEach((section: any) => {
      section.isChecked = checked;
    });
  }

  //risk details
  saveRiskDetailsColumnsToSession(): void {
    if (this.riskDetailsColumns) {
      const visibility = this.riskDetailsColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('riskDetailsColumns', JSON.stringify(visibility));
    }
  }

  toggleRiskColumnVisibility(field: string) {
    this.saveRiskDetailsColumnsToSession();
  }


  toggleRiskDetailsColumns(iconElement: HTMLElement): void {
    this.showRiskDetails = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop - 50;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskDetailsColumnModal = true;
  }


  onDragStart(event: MouseEvent): void {
    this.dragging = true;
    this.dragOffset.x = event.clientX - parseInt(this.columnModalPosition.left, 10);
    this.dragOffset.y = event.clientY - parseInt(this.columnModalPosition.top, 10);
  }

  onDragMove(event: MouseEvent): void {
    if (this.dragging) {
      this.columnModalPosition.top = `${event.clientY - this.dragOffset.y}px`;
      this.columnModalPosition.left = `${event.clientX - this.dragOffset.x}px`;
    }
  }

  onDragEnd(): void {
    this.dragging = false;
  }

  // setRiskDetailsColumns(risk: any) {
  //   const excludedFields = ['riskLimits', 'clauseCodes', 'sectionsDetails', 'sectionsDetails', 'location', 'ncdLevel',
  //     'subclass',
  //   ];
  //   const defaultVisibleRiskDetailsFields = ['wef', 'wet', 'actions', 'propertyId', 'coverTypeDescription', 'binder.binderShortDescription'];

  //   this.riskDetailsColumns = Object.keys(risk)
  //     .filter((key) => !excludedFields.includes(key))
  //     .map((key) => ({
  //       field: key,
  //       header: this.sentenceCase(key),
  //       visible: defaultVisibleRiskDetailsFields.includes(key),
  //       filterable: true
  //     }));

  //   this.riskDetailsColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false });

  //   // Restore from sessionStorage if exists
  //   const saved = sessionStorage.getItem('riskDetailsColumns');
  //   if (saved) {
  //     const savedVisibility = JSON.parse(saved);
  //     this.riskDetailsColumns.forEach(col => {
  //       const savedCol = savedVisibility.find((s: any) => s.field === col.field);
  //       if (savedCol) col.visible = savedCol.visible;
  //     });
  //   }
  // }
  setRiskDetailsColumns(risk: any) {
    log.debug("riskDetails row sample:", this.riskDetails[0]);
    // 1️⃣ Flatten nested binder value
    const flattenedRisk = {
      ...risk,
      binderShortDescription: risk.binder?.binderShortDescription || ''

    };
    log.debug("flattenedRisk", flattenedRisk)
    if (Array.isArray(this.riskDetails) && this.riskDetails.length > 0) {
      this.riskDetails = this.riskDetails.map(r => ({
        ...r,
        binderShortDescription: (r as any)?.binder?.binderShortDescription || ''
      }));
    }
    const excludedFields = [
      'riskLimits', 'clauseCodes', 'sectionsDetails',
      'location', 'ncdLevel', 'subclass', 'binder'
    ];

    // Include both flattened and nested binder keys to be safe
    const defaultVisibleRiskDetailsFields = [
      'wef', 'wet', 'actions', 'propertyId',
      'coverTypeDescription', 'binderShortDescription', 'binder.binderShortDescription'
    ];

    // 2️⃣ Build columns dynamically from flattenedRisk
    this.riskDetailsColumns = Object.keys(flattenedRisk)
      .filter(key => !excludedFields.includes(key))
      .map(key => ({
        field: key,
        header: this.sentenceCase(key),
        visible: defaultVisibleRiskDetailsFields.includes(key),
        filterable: true
      }));

    // 3️⃣ Add static Actions column
    this.riskDetailsColumns.push({
      field: 'actions',
      header: 'Actions',
      visible: true,
      filterable: false
    });

    // 4️⃣ Restore visibility from sessionStorage
    const saved = sessionStorage.getItem('riskDetailsColumns');
    log.debug("Risk Detail column.", this.riskDetailsColumns)
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.riskDetailsColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }
  }


  openAddRiskModal() {
    log.debug("isNewClientSelected;", this.isNewClientSelected)
    log.debug("insuredCode;", this.insuredCode)
    if (!this.isNewClientSelected && !this.insuredCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'No insured selected');
      return;
    }

    this.modalInstance?.show();
    this.isEditMode = false
    this.isAddMode = true
    this.selectedSubclassCode = null
    this.clearRiskForm()
    this.riskDetailsForm.reset({
      insureds: this.riskDetailsForm.get('insureds')?.value
    });
    if (this.quickQuoteConverted) {
      log.debug('selected subclass code after converting to normal quote', this.selectedSubclassCode)
      this.selectedSubclassCode = null

    }
  }
  openEditRiskModal(risk: RiskInformation) {
    this.isEditMode = true
    this.modalInstance?.show();

    log.debug("Selected risk:", risk)
    this.selectedRisk = risk
    log.debug("Risk form Values:", this.riskDetailsForm.value)
    this.riskDetailsForm.patchValue(risk);
    this.riskDetailsForm.patchValue({ subclass: risk.subclass.code });
    this.onSubclassSelected(risk.subclass)
  }

  async loadSelectedSubclassRiskFields(subclassCode: number): Promise<void> {
    const riskFieldDescription = `detailed-risk-subclass-form-${subclassCode}`;

    try {
      const response = await firstValueFrom(this.quotationService.getFormFields(riskFieldDescription));
      const fields = response?.[0]?.fields || [];
      this.dynamicSubclassFormFields = fields
      this.subclassFormContent = response;
      sessionStorage.setItem('dynamicSubclassFormField', JSON.stringify(fields));
      this.subclassFormData = fields.filter(field => Number(field.scheduleLevel) === 1);
      this.allSubclassFormData = fields.filter(field => field.applicableLevel === 'S');

      // Remove old dynamic controls
      // Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
      //   const control = this.riskDetailsForm.get(controlName) as any;
      //   if (control?.metadata?.dynamicSubclass) {
      //     this.riskDetailsForm.removeControl(controlName);
      //   }
      // });
      Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
        const control = this.riskDetailsForm.get(controlName) as any;

        // Remove if it has dynamicSubclass metadata
        if (control?.metadata?.dynamicSubclass) {
          this.riskDetailsForm.removeControl(controlName);
        }

        // Additionally, remove 'butcharge' if not in edit mode
        if (!this.isEditMode && controlName === 'butCharge') {
          this.riskDetailsForm.removeControl('butCharge');
        }
      });


      // Add new dynamic controls
      // this.subclassFormData.forEach(field => {
      //   if (!this.riskDetailsForm.get(field.name)) {
      //     const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
      //     const control = new FormControl(this.getDefaultValue(field), validators);
      //     (control as any).metadata = { dynamicSubclass: true };
      //     this.riskDetailsForm.addControl(field.name, control);
      //     log.debug(`Added new dynamicSubclass control: ${field.name}`);
      //   }
      //   let defaultValue = '';
      //   if (field.name === 'ncdStatus') {
      //     defaultValue = 'N';
      //   }
      // });
      this.subclassFormData.forEach(field => {
        if (!this.riskDetailsForm.get(field.name)) {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
          const control = new FormControl(this.getDefaultValue(field), validators);
          (control as any).metadata = { dynamicSubclass: true };

          // ✅ Add control to the form
          this.riskDetailsForm.addControl(field.name, control);
          log.debug(`Added new dynamicSubclass control: ${field.name}`);
        }

        // ✅ Handle default value logic (like ncdStatus)
        if (field.name === 'ncdStatus') {
          this.riskDetailsForm.get(field.name)?.setValue('N');
        }
        if (!this.isEditMode && field.name === 'butCharge') {
          this.riskDetailsForm.removeControl('butCharge');
          this.subclassFormData = this.subclassFormData.filter(f => f.name !== 'butCharge');
        }

        if (field.options && field.options.length > 0) {
          let optionsList = field.options;

          // ✅ Parse JSON safely if options come as a string
          if (typeof field.options === 'string') {
            try {
              optionsList = JSON.parse(field.options);
            } catch {
              optionsList = [];
            }
          }

          // ✅ Use your helper to populate selectOptions
          this.safePopulateSelectOptions(
            this.subclassFormData,
            field.name,
            optionsList,
            'description', // labelKey
            'code'         // valueKey
          );
        }

      });

      log.debug(" risk details Value:", this.riskDetailsForm.value)

      const coverFromStr = this.quotationDetails.coverFrom;
      const coverToStr = this.quotationDetails.coverTo;

      const coverFrom = new Date(coverFromStr + 'T00:00:00');
      const coverTo = new Date(coverToStr + 'T00:00:00');

      this.riskDetailsForm.patchValue({
        coverFrom: coverFrom,
        coverTo: coverTo
      });

      log.debug('Risk Details Value after patching:', this.riskDetailsForm.value);

      if (this.riskDetailsForm.contains('coverDays')) {
        const coverDays = this.getCoverDays(coverFrom, coverTo);
        log.debug('Cover days:', coverDays);

        this.riskDetailsForm.patchValue({ coverDays });
      }



      this.fetchRegexPattern();

      if (this.isEditMode) {
        this.patchEditValues();
      }

    } catch (err) {
      this.globalMessagingService.displayErrorMessage('Error', err.error?.message || 'Failed to load fields');
      throw err; // important, so onSubclassSelected catch block runs
    }
  }

  // private patchEditValues(): void {
  //   if (!this.selectedRisk) return;
  //   log.debug("Selected risk", this.selectedRisk)
  //   this.riskDetailsForm.patchValue({
  //     registrationNumber: this.selectedRisk.propertyId,
  //     riskDescription: this.selectedRisk.itemDesc,
  //     coverType: this.selectedRisk.coverTypeCode,
  //     premiumBand: this.selectedRisk.binderCode,
  //     value: this.selectedRisk.value,
  //     vehicleMake: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.vehicleMake,
  //     vehicleModel: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.vehicleModel,
  //     yearOfManufacture: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.yearOfManufacture,
  //     cubicCapacity: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.cubicCapacity,
  //     seatingCapacity: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.seatingCapacity,
  //     bodyType: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.bodyType,
  //     color: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.color,
  //     chasisNumber: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.chasisNumber,
  //     engineNumber: this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.engineNumber
  //   });

  //   log.debug("Patched form with selectedRisk:", this.riskDetailsForm.value);
  // }
  // private patchEditValues(): void {
  //   if (!this.selectedRisk) return;

  //   // Explicit field mapping
  //   const explicitFields: Record<string, string> = {
  //     coverType: 'coverTypeCode',
  //     premiumBand: 'binderCode',
  //     registrationNumber: 'propertyId',
  //     riskDescription: 'itemDesc',
  //     riskId: 'propertyId'
  //   };

  //   // Patch explicit fields
  //   Object.keys(explicitFields).forEach(formControl => {
  //     const riskKey = explicitFields[formControl];
  //     if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
  //       this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
  //     }
  //   });

  //   // Patch value-related controls
  //   const valueControls = ['value', 'sumInsured'];
  //   valueControls.forEach(controlName => {
  //     if (this.riskDetailsForm.contains(controlName)) {
  //       this.riskDetailsForm.get(controlName)?.setValue(this.selectedRisk?.value);
  //     }
  //   });

  //   // Flatten recursively, skipping certain keys
  //   const flatten = (obj: any) => {
  //     Object.keys(obj).forEach(key => {
  //       const value = obj[key];

  //       // Skip keys that would overwrite explicitly mapped fields
  //       const excludedKeys = ['coverType', 'binderCode', 'propertyId', 'itemDesc', 'value'];
  //       if (excludedKeys.includes(key)) return;

  //       if (value && typeof value === 'object') {
  //         if (Array.isArray(value) && value.length > 0) {
  //           flatten(value[0]);
  //         } else {
  //           flatten(value);
  //         }
  //       } else {
  //         if (this.riskDetailsForm.contains(key)) {
  //           this.riskDetailsForm.get(key)?.setValue(value);
  //         }
  //       }
  //     });
  //   };

  //   flatten(this.selectedRisk);

  //   log.debug('Patched form with selectedRisk:', this.riskDetailsForm.value);
  // }
  private patchEditValues(): void {
    if (!this.selectedRisk) return;

    // Explicit field mapping between backend keys and form controls
    const explicitFields: Record<string, string> = {
      coverType: 'coverTypeCode',
      premiumBand: 'binderCode',
      registrationNumber: 'propertyId',
      riskDescription: 'itemDesc',
      riskId: 'propertyId'
    };

    // Patch explicitly mapped fields
    Object.keys(explicitFields).forEach(formControl => {
      const riskKey = explicitFields[formControl];
      if (this.selectedRisk[riskKey] !== undefined && this.riskDetailsForm.contains(formControl)) {
        this.riskDetailsForm.get(formControl)?.setValue(this.selectedRisk[riskKey]);
      }
    });

    // Patch value-related controls
    const valueControls = ['value', 'sumInsured'];
    valueControls.forEach(controlName => {
      if (this.riskDetailsForm.contains(controlName)) {
        this.riskDetailsForm.get(controlName)?.setValue(this.selectedRisk?.value);
      }
    });

    // Helper function to normalize date values
    const normalizeDate = (value: any, key: string): any => {
      const isDateField =
        key.toLowerCase().includes('date') ||
        key.toLowerCase().includes('coverfrom') ||
        key.toLowerCase().includes('coverto');

      return typeof value === 'string' && isDateField ? new Date(value) : value;
    };

    // Recursive flattening function
    const flatten = (obj: any) => {
      Object.keys(obj).forEach(key => {
        const value = obj[key];

        // Skip keys that would overwrite explicitly mapped fields
        const excludedKeys = ['coverType', 'binderCode', 'propertyId', 'itemDesc', 'value'];
        if (excludedKeys.includes(key)) return;

        if (value && typeof value === 'object') {
          if (Array.isArray(value) && value.length > 0) {
            flatten(value[0]);
          } else {
            flatten(value);
          }
        } else {
          if (this.riskDetailsForm.contains(key)) {
            const finalValue = normalizeDate(value, key);
            this.riskDetailsForm.get(key)?.setValue(finalValue);
          }
        }
      });
    };

    // Perform recursive patching
    flatten(this.selectedRisk);

    log.debug('Patched form with selectedRisk:', this.riskDetailsForm.value);
  }


  getDefaultValue(field: any): any {
    if (field.type === 'date') {
      return new Date();
    }
    return '';
  }

  //populates the dynamic risk fields
  safePopulateSelectOptions(formDataArray: any[], fieldName: string, options: any[], labelKey: string, valueKey: string) {
    if (formDataArray && Array.isArray(formDataArray)) {
      formDataArray.forEach(field => {
        if (field.name === fieldName) {
          field.selectOptions = options.map(opt => ({
            label: opt[labelKey],
            value: opt[valueKey]
          }));
        }
      });
      log.debug(`Populated selectOptions for '${fieldName}'`, formDataArray);
    } else {
      log.warn(`Cannot populate '${fieldName}', form data array is not ready`);
    }
  }


  loadSelectedProductRiskFields(productCode: number): void {
    const formFieldDescription = `detailed-quotation-risk-${productCode}`;

    this.quotationService.getFormFields(formFieldDescription).subscribe({
      next: (response) => {
        const fields = response?.[0]?.fields || [];

        this.formContent = response;
        this.formData = fields;

        log.debug(this.formContent, 'Form-content');
        log.debug(this.formData, 'formData is defined here');

        // Remove existing dynamic controls
        Object.keys(this.riskDetailsForm.controls).forEach((controlName) => {
          const control = this.riskDetailsForm.get(controlName) as any;
          if (control?.metadata?.dynamic) {
            this.riskDetailsForm.removeControl(controlName);
            log.debug(`Removed dynamic control: ${controlName}`);
          }
        });

        // Add new dynamic controls
        this.formData.forEach((field) => {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
          const formControl = new FormControl(this.getDefaultValue(field), validators);
          (formControl as any).metadata = { dynamic: true };
          this.riskDetailsForm.addControl(field.name, formControl);
        });



        log.debug(this.riskDetailsForm.value, 'Final Form Value');
      },
      error: (err) => {
        log.error(err, 'Failed to load risk fields');
      }
    });
  }

  loadClientsThenInsured() {
    const pageSize = 20;
    const pageIndex = 0;

    this.clientService.getClients(pageIndex, pageSize).pipe(
      tap((data: any) => {
        data.content.forEach(client => {
          client.clientTypeName = client.clientType?.clientTypeName;
          client.clientFullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
        });
        this.clientsData = data.content;
      }),
      switchMap(() => this.clientService.getClientById(this.insuredCode))
    ).subscribe({
      next: (insured: any) => {
        insured.clientFullName = `${insured.firstName || ''} ${insured.lastName || ''}`.trim();

        const exists = this.clientsData.some(c => c.id === insured.id);
        if (!exists) {
          this.clientsData = [insured, ...this.clientsData];
        }

        if (!this.riskDetailsForm.contains('insureds')) {
          this.riskDetailsForm.addControl('insureds', new FormControl(''));
        }
        this.riskDetailsForm.patchValue({ insureds: insured.id });
      },
      error: err => log.error('Error fetching clients or insured', err)
    });
  }


  // loadAllClients() {
  //   const pageSize = 20
  //   const pageIndex = 0;
  //   this.clientService.getClients(pageIndex, pageSize).subscribe({
  //     next: (data: any) => {
  //       // Format clients
  //       data.content.forEach(client => {
  //         client.clientTypeName = client.clientType?.clientTypeName;
  //         client.clientFullName = client.firstName || '' + ' ' + (client.lastName || '');
  //       });

  //       this.clientsData = data.content;
  //       log.debug('client data', this.clientsData)

  //     },
  //     error: (err) => {
  //       log.error('Failed to fetch clients', err);
  //     }
  //   });
  // }

  // loadClientDetails() {
  //   this.clientService.getClientById(this.insuredCode).subscribe((data: any) => {
  //     log.debug("client searching to patch data")
  //     const client = data;
  //     client.clientFullName = client.firstName + ' ' + (client.lastName || '');

  //     this.clientName = client.clientFullName;

  //     // Set dropdown options
  //     this.clientsData = [client]; // wrap in array for dropdown options
  //     log.debug("Clients data;", this.clientsData)
  //     // Add the control if it doesn't exist
  //     if (!this.riskDetailsForm.contains('insureds')) {
  //       this.riskDetailsForm.addControl('insureds', new FormControl('',));
  //     }

  //     // Pre-select the dropdown
  //     this.riskDetailsForm.patchValue({ insureds: client.id });
  //     //Setting insured as the authorized driver
  //     log.debug("Risk form values after patching client:", this.riskDetailsForm.value)


  //   });
  // }
  // loadClientDetails() {
  //   log.debug("Insured code -loadClientDetails", this.insuredCode)
  //   this.clientService.getClientById(this.insuredCode).subscribe((data: any) => {
  //     log.debug("client searching to patch data");

  //     const client = data;
  //     client.clientFullName = `${client.firstName || ''} ${client.lastName || ''}`.trim();

  //     this.clientName = client.clientFullName;

  //     // Merge client into existing dropdown list if missing
  //     const exists = this.clientsData?.some(c => c.id === client.id);
  //     if (!exists) {
  //       this.clientsData = [client, ...(this.clientsData || [])];
  //     }

  //     // Add the control if it doesn't exist
  //     if (!this.riskDetailsForm.contains('insureds')) {
  //       this.riskDetailsForm.addControl('insureds', new FormControl(''));
  //     }

  //     // Patch dropdown value
  //     this.riskDetailsForm.patchValue({ insureds: client.id });

  //     log.debug("Risk form values after patching client:", this.riskDetailsForm.value);
  //   });
  // }


  checkMotorClass(productCode: number) {
    this.productService.getProductDetailsByCode(productCode).subscribe(res => {
      log.debug("Product Response", res);
      this.motorClassAllowed = res.allowMotorClass
      log.debug("Motor class Allowed:", this.motorClassAllowed)



    });
  }


  get f() {
    return this.riskDetailsForm.controls;
  }
  updateCoverToDate(date) {
    log.debug("Cover from date:", date)
    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

    this.producSetupService.getCoverToDate(formattedCoverFromDate, this.selectedProductCode)
      .subscribe({
        next: (res) => {
          this.midnightexpiry = res;
          log.debug("midnightexpirydate", this.midnightexpiry);
          log.debug(this.midnightexpiry)
          const coverTo = this.midnightexpiry._embedded[0].coverToDate
          const coverToDate = new Date(coverTo)
          // Extract the day, month, and year
          const day = coverToDate.getDate();
          const month = coverToDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
          const year = coverToDate.getFullYear();

          // Format the date in 'dd-Month-yyyy' format
          const formattedDate = `${day}-${month}-${year}`;

          this.coverToDate = formattedDate;
          log.debug('Cover to  Date', this.coverToDate);
          // this.riskDetailsForm.controls['wet'].setValue(this.coverToDate)
          this.riskDetailsForm.patchValue({ coverTo: this.coverToDate });
          const coverDays = this.getCoverDays(formattedCoverFromDate, coverTo);
          this.riskDetailsForm.patchValue({ coverDays: coverDays });

        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })

  }
  formatDate(date: string | Date): string {
    // Check if the date is in the format "5-March-2025"
    if (typeof date === 'string' && /^\d{1,2}-[A-Za-z]+-\d{4}$/.test(date)) {
      // Split the date into day, month, and year
      const [day, month, year] = date.split('-');

      // Convert month name to month number (e.g., "March" -> 3)
      const monthNumber = new Date(`${month} 1, ${year}`).getMonth() + 1;

      // Format the date as "YYYY-MM-DD"
      return `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    // If the date is already in ISO format (e.g., "2025-03-05"), convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    // If the date is a Date object, format it as "YYYY-MM-DD"
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // If the date is already in the correct format or cannot be formatted, return it as is
    return date as string;
  }

  // sanitizeCurrency(raw: string): number {
  //   const cleaned = raw.replace(/[^0-9]/g, '');
  //   return Number(cleaned);
  // }
  sanitizeCurrency(raw: any): number | null {
    if (raw == null) return null; // handles null and undefined

    const str = String(raw); // ensure it's a string
    const cleaned = str.replace(/[^0-9.-]/g, ''); // allow negative & decimal
    const parsed = Number(cleaned);

    return isNaN(parsed) ? null : parsed;
  }

  onBinderSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On binder selected", selectedValue)
    this.selectedBinderList = selectedValue;
    this.selectedBinderCode = this.selectedBinderList.code

  }
  onCoverTypeSelected(event: any) {
    const selectedValue = event.value;
    log.debug("Selected value(On Covertype selected", selectedValue)
    this.selectedCoverType = selectedValue;


  }
  /**
  * Load cover types by subclass code
  * @param code {number} subclass code
  */
  loadCovertypeBySubclassCode(code: number) {
    this.subclassCoverTypesService.getSubclassCovertypeBySCode(code).subscribe(data => {
      this.subclassCoverType = data.map(value => ({
        ...value,
        description: value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase()
      }));
      log.debug('Processed covertypes:', this.subclassCoverType);

      // Inject into the subclass formData
      // this.subclassFormData = this.subclassFormData.map(field => {
      //   if (field.name === 'coverType') {
      //     return {
      //       ...field,
      //       selectOptions: this.subclassCoverType.map(cover => ({
      //         label: cover.description,
      //         value: cover.coverTypeCode
      //       }))
      //     };
      //   }
      //   return field;
      // });

      this.safePopulateSelectOptions(this.subclassFormData, 'coverType', this.subclassCoverType, 'description', 'coverTypeCode');

      const coverTypeCodeToUse = this.storedRiskFormDetails?.coverTypeCode || this.passedCoverTypeCode;
      if (coverTypeCodeToUse) {
        this.riskDetailsForm.patchValue({
          covertype: coverTypeCodeToUse
        });
      }


      this.cdr.detectChanges();
    });
  }

  getVehicleMake() {
    this.vehicleMakeService.getAllVehicleMake().subscribe(data => {
      this.vehicleMakeList = data;

      this.vehicleMakeList = data.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });

      log.debug('this is the vehicle make list >>>', this.vehicleMakeList)

      // Inject into the subclass formData
      this.safePopulateSelectOptions(this.subclassFormData, 'vehicleMake', this.vehicleMakeList, 'name', 'name');
      const selectedVehicleMake = this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.vehicleMake
      log.debug("selected vehicle make on edit;", selectedVehicleMake)
      const selectedVehicleMakeObj = this.vehicleMakeList?.find(make => make.name === selectedVehicleMake)


      log.debug("VehicleMake list", this.vehicleMakeList)
      // if (this.storedRiskFormDetails) {
      //   const selectedVehicleMake = this.vehicleMakeList.find(make => make.code === this.storedRiskFormDetails?.vehicleMake);
      //   if (selectedVehicleMake) {
      //     log.debug("selected vehicle make:", selectedVehicleMake)
      //     this.riskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
      //     this.getVehicleModel(selectedVehicleMake.code)

      //   }
      // }

      if (selectedVehicleMakeObj) {
        const selectedMakeCode = Number(selectedVehicleMakeObj.code)
        log.debug("selectedMakeCode:", selectedMakeCode)
        this.getVehicleModel(selectedMakeCode);
      }
    })
  }


  onVehicleMakeSelected(event: any) {
    const selectedMakeName = event.value;
    log.debug("Selected Vehicle Make Code:", selectedMakeName);
    const selectedObject = this.vehicleMakeList.find(vehicleMake => vehicleMake.name === selectedMakeName);
    this.selectedVehicleMakeName = selectedObject.name
    const selectedMakeCode = selectedObject.code
    if (selectedMakeName) {
      this.getVehicleModel(selectedMakeCode);
    }
  }


  convertToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your identifier
    // For example, if your identifier is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }


  getVehicleModel(code: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehicleModelService.getAllVehicleModel(code).subscribe({
        next: (data) => {
          this.vehicleModelList = data;
          this.vehicleModelDetails = this.vehicleModelList._embedded.vehicle_model_dto_list.map((value) => ({
            ...value,
            name: value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase()
          }));

          log.debug("Vehicle Model Details", this.vehicleModelDetails);
          sessionStorage.setItem('vehicleModelList', JSON.stringify(this.vehicleModelDetails));

          this.safePopulateSelectOptions(this.subclassFormData, 'vehicleModel', this.vehicleModelDetails, 'name', 'name');

          if (this.storedRiskFormDetails) {
            const selectedVehicleModel = this.vehicleModelDetails.find(
              model => model.code === this.storedRiskFormDetails?.vehicleModel
            );
            if (selectedVehicleModel) {
              this.riskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel.code });
            }
          }

          resolve(); // ✅ promise resolved here
        },
        error: (err) => reject(err) // ✅ handle errors too
      });
    });
  }



  onVehicleModelSelected(event: any) {
    const selectedValue = event.value;
    log.debug("SELECTED VALUE MODEL:", selectedValue)
    const vehicleModel = this.riskDetailsForm.value.vehicleModel || selectedValue
    log.debug("SELECTED VALUE MODEL:", vehicleModel)

    const typedSelectedValue = this.convertToCorrectType(vehicleModel);

    // Find the selected object using the converted value
    const selectedObject = this.vehicleModelDetails.find(vehicleModel => vehicleModel.name === selectedValue);

    // Check if the object is found
    if (selectedObject) {
      log.debug('Selected Vehicle Model:', selectedObject);
      sessionStorage.setItem('selectedVehicleModel', JSON.stringify(selectedObject));

      // Perform further actions with the selected object as needed
    } else {
      console.error('Selected Vehicle Model not found');
    }
    this.selectedVehicleModelName = selectedObject.name;
    this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;
    log.debug('Selected Vehicle make model', this.vehiclemakeModel);
    if (this.vehiclemakeModel) {
      this.riskDetailsForm.patchValue({ riskDescription: this.vehiclemakeModel });
    }

  }

  convertModelToCorrectType(value: any): any {
    // Implement the conversion logic based on the actual type of your code property
    // For example, if your code property is a number, you can use parseInt or parseFloat
    // If it's another type, implement the conversion accordingly
    return parseInt(value, 10); // Adjust based on your actual data type
  }
  // transformToUpperCase(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const upperCaseValue = input.value.toUpperCase();
  //   this.riskDetailsForm
  //     .get('propertyId')
  //     ?.setValue(upperCaseValue, { emitEvent: false });
  // }
  riskIdPassed(event: any): void {


    if (event instanceof Event) {
      this.passedRiskId = (event.target as HTMLInputElement).value;
    } else {
      this.passedRiskId = event;
    }

    if (this.passedRiskId !== undefined) {
      log.debug('Passed Risk Id', this.passedRiskId);
    } else {
      console.error('Unable to retrieve value from the event object.');
    }
  }

  getProductSubclass(code: number) {
    this.subclassService.getProductSubclasses(code).pipe(
      untilDestroyed(this)
    ).subscribe((subclasses) => {
      this.allMatchingSubclasses = subclasses.map((value) => {
        return {
          ...value,
          description: this.capitalizeWord(value.description),
        }
      });

      if (this.formData) {
        this.formData.forEach((field) => {
          if (field.name === 'subclass') {
            field.selectOptions = this.allMatchingSubclasses.map(subclass => ({
              label: subclass.description,
              value: subclass.code
            }));
          }
        });
      }
      log.debug("Subclasses-risk details:", this.allMatchingSubclasses)
      // Determine the subclass code to use (from storedRiskFormDetails or storedData)
      const subClassCodeToUse = this.storedRiskFormDetails?.subclassCode || this.passedSubclassCode;

      // If a subclass code is found, patch the form with the corresponding subclass
      if (subClassCodeToUse) {
        const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === subClassCodeToUse);
        if (selectedSubclass) {
          // Patch the form with the selected subclass
          this.riskDetailsForm.patchValue({ subclassCode: selectedSubclass });

          // Manually call onSubclassSelected to handle the selected subclass
          // this.onSubclassSelected({ value: selectedSubclass });

          // this.selectedSubclassCode = subClassCodeToUse; // Update the selected subclass code
          // this.loadAllBinders(); // Load all binders
        }
      } else {
        // If no subclass code is found, patch the form with the first subclass in the list
        if (this.allMatchingSubclasses.length > 0) {
          const firstSubclass = this.allMatchingSubclasses[0];
          // this.riskDetailsForm.patchValue({ subclassCode: firstSubclass });

          // Manually call onSubclassSelected to handle the first subclass
          // this.onSubclassSelected({ value: firstSubclass });

          this.selectedSubclassCode = firstSubclass.code; // Update the selected subclass code
          // this.loadAllBinders(); // Load all binders
        }
      }
    })
  }

  async onSubclassSelected(event: any) {
    log.debug("on subclass seelcted has been calleed")
    this.selectedSubclassCode = event.value || event.code || event;
    log.debug("Selected subclass code:", this.selectedSubclassCode);

    this.selectedSubclassObject = this.allMatchingSubclasses.find(subclass => subclass.code == this.selectedSubclassCode)
    log.debug("Selected Subclass Object:", this.selectedSubclassObject)
    if (this.selectedSubclassCode) {
      try {
        await this.loadSelectedSubclassRiskFields(this.selectedSubclassCode);
        // const selectedVehicleMake = this.selectedRisk?.scheduleDetails?.[0]?.details?.level1?.vehicleMake
        // log.debug("selected vehicle make on edit;", selectedVehicleMake)
        this.fetchTaxes();
        this.loadCovertypeBySubclassCode(this.selectedSubclassCode);
        this.loadAllBinders();
        this.fetchTerritories()
        this.loadSubclassClauses(this.selectedSubclassCode);
        log.debug('Motor class allowed:', this.motorClassAllowed)
        if (this.motorClassAllowed == 'Y') {
          this.getVehicleMake();
          this.fetchScheduleRelatedData();
        }
        // selectedVehicleMake && this.getVehicleModel(selectedVehicleMake);

        this.fetchYearOfManufacture();
      } catch (err) {
        log.error("Failed to load subclass risk fields asynccc:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to load subclass data asyncc');
      }
    }
  }

  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  loadAllBinders() {
    this.binderService.getAllBindersQuick(this.selectedSubclassCode).subscribe(
      (data) => {
        this.binderList = data;

        this.binderListDetails = this.binderList._embedded.binder_dto_list;

        // Map and capitalize binder names
        this.binderListDetails = this.binderListDetails.map((value) => {
          let capitalizedDescription = value.binder_name.charAt(0).toUpperCase() + value.binder_name.slice(1).toLowerCase();
          return {
            ...value,
            binder_name: capitalizedDescription,
          };
        });

        log.debug("binder list", this.binderListDetails)

        // Inject into the subclass formData
        this.subclassFormData = this.subclassFormData.map(field => {
          if (field.name === 'premiumBand') {
            return {
              ...field,
              selectOptions: this.binderListDetails.map(binder => ({
                label: binder.binder_short_description,
                value: binder.code
              }))
            };
          }
          return field;
        });

        log.debug("All Binders Details:", this.binderListDetails);
        sessionStorage.setItem('binderList', JSON.stringify(this.binderListDetails));

        // Find default binder
        this.defaultBinder = this.binderListDetails.filter(binder => binder.is_default === "Y");
        log.debug("Default Binder", this.defaultBinder);

        // Set default binder object (not just the name)
        if (this.defaultBinder && this.defaultBinder.length > 0) {
          this.defaultBinderName = this.defaultBinder[0].binder_name;
          this.selectedBinderList = this.defaultBinder[0]; // Store the complete object
          this.selectedBinderCode = this.defaultBinder[0].code; // Set the code as well
          log.debug("Default Binder name", this.defaultBinderName);
          log.debug("Selected binder code", this.selectedBinderCode);
        }
        if (this.storedRiskFormDetails) {
          const selectedBinder = this.binderListDetails.find(binder => binder.code === this.storedRiskFormDetails?.binderCode);
          if (selectedBinder) {
            this.riskDetailsForm.patchValue({ premiumBand: selectedBinder.binder_name });

          }
        }
        this.cdr.detectChanges();

        // Update form control value with default binder
        if (this.riskDetailsForm && this.defaultBinder && this.defaultBinder.length > 0) {
          this.riskDetailsForm.get('premiumBand').setValue(this.defaultBinder[0].code);
        }
      },
      (error) => {
        log.error("Error loading binders:", error);
        // Handle error appropriately
      }
    );
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
          log.debug("fetch regex risk details:", this.riskDetailsForm.value)
          const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

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
  fetchTaxes() {
    this.quotationService
      .getTaxes(this.selectedProductCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.taxList = response;
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


  createRiskDetail() {
    log.debug("RISK FORM VALUE", this.riskDetailsForm.value)
    sessionStorage.setItem('riskFormDetails', JSON.stringify(this.riskDetailsForm.value));
    log.debug("Insured code:", this.insuredCode)
    this.riskDetailsForm.get('insureds').setValue(this.insuredCode);
    this.selectedBinderCode = this.riskDetailsForm.value.premiumBand
    const selectedBinderObj = this.binderListDetails.find(binder => binder.code === this.selectedBinderCode)
    log.debug("SELECTED BINDER OBJ", selectedBinderObj)
    // validate inputs
    if (this.riskDetailsForm.invalid) {
      Object.keys(this.riskDetailsForm.controls).forEach(field => {
        const control = this.riskDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      for (let controlsKey in this.riskDetailsForm.controls) {
        if (this.riskDetailsForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.riskDetailsForm.get(controlsKey).errors
          );
        }
      }
      return;
    }
    // if valid
    const modal = bootstrap.Modal.getInstance(this.addRiskModalRef.nativeElement);
    modal.hide();
    const currentFormValues = this.riskDetailsForm.value
    const sumInsuredToPass = this.riskDetailsForm.value.value || this.riskDetailsForm.value.sumInsured
    log.debug("Suminsured to pass value:", sumInsuredToPass)
    if (this.riskDetailsForm.value) {
      const riskPayload = this.getQuotationRiskPayload();
      const payload = {
        quotationProducts: [
          {
            code: this.selectedProduct.code,
            productCode: this.selectedProductCode,
            quotationCode: this.selectedProduct.quotationCode,
            productName: this.selectedProduct.productName,
            productShortDescription: this.selectedProduct.productShortDescription,
            premium: this.selectedProduct.premium,
            sumInsured: sumInsuredToPass,
            wef: this.selectedProduct.wef,
            wet: this.selectedProduct.wet,
            totalSumInsured: this.selectedProduct.totalSumInsured,
            converted: this.selectedProduct.converted,
            binder: selectedBinderObj.binder_name,
            agentShortDescription: this.selectedProduct.agentShortDescription,
            riskInformation: riskPayload,
            limitsOfLiability: [],
            taxInformation: [],

          }
        ],
        quotationNumber: this.selectedProduct.quotationNo,
        quotationCode: this.selectedProduct.quotationCode,
        source: this.quotationDetails.source.code,
        user: this.quotationDetails.preparedBy,
        currencyCode: this.quotationDetails.currencyCode,
        currencyRate: this.quotationDetails.currencyRate,
        agentCode: this.quotationDetails.agentCode,
        agentShortDescription: this.quotationDetails.agentShortDescription,
        wefDate: this.quotationDetails.coverFrom,
        wetDate: this.quotationDetails.coverTo,
        premium: this.quotationDetails.premium,
        branchCode: this.quotationDetails.branchCode,
        comments: this.quotationDetails.comments,
        clientType: this.quotationDetails.clientType,
        multiUser: this.quotationDetails.multiUser,
        clientCode: this.quotationDetails.clientCode || null,
        prospectCode: this.quotationDetails.prospectCode,
        sumInsured: sumInsuredToPass,
        quoteType: 'NQ',

      };

      this.quotationService.processQuotation(payload).pipe(
        switchMap(data => {
          const quotationCode = data._embedded.quotationCode
          this.quotationCode = quotationCode
          const quotationNo = data._embedded.quotationNo
          this.addProductClauses();

          // this.quotationCode && this.fetchQuotationDetails(this.quotationCode)
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk created succesfully');

          const subclasscode = this.selectedSubclassCode;
          if (subclasscode) {
            sessionStorage.setItem('selectedSubclassCode', subclasscode);
          }
          const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
          const coverTypeCode = this.selectedCoverType.coverTypeCode
          // Call services directly
          return forkJoin([
            this.quotationService.getQuotationDetails(quotationCode),
            this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode)
          ]);
        })
      ).subscribe({
        next: ([quoteDetails, premiumRates]: any) => {

          this.quotationDetails = quoteDetails
          const premiumComputed = quoteDetails.premiumComputed
          if (premiumComputed === 'Y') {
            this.premiumComputed = true
          } else {
            this.premiumComputed = false
          }

          const quotationProducts = quoteDetails.quotationProducts || [];
          // Find the selected product
          const selectedProduct = quotationProducts.find(product => product.code === this.selectedProduct.code);
          log.debug("Quotation full details:", quoteDetails);
          log.debug("Matched product from quotation:", selectedProduct);
          log.debug("Current state of risk details form:", this.riskDetailsForm.value);
          // const matchedRisk: RiskInformation = selectedProduct?.riskInformation?.find(risk =>
          //   risk.propertyId === this.riskDetailsForm.value.registrationNumber || this.riskDetailsForm.value.riskId
          // );
          // log.debug("Matched risk from quotation:", matchedRisk);
          const formValue = this.riskDetailsForm.value;

          let matchedRisk: RiskInformation | undefined;

          if (formValue.registrationNumber) {
            // Motor-type risks
            matchedRisk = selectedProduct?.riskInformation?.find(
              risk => risk.propertyId === formValue.registrationNumber
            );
          } else if (formValue.riskId) {
            // Property or non-motor risks
            matchedRisk = selectedProduct?.riskInformation?.find(
              risk => risk.propertyId === formValue.riskId
            );
          }

          log.debug("Matched risk from quotation:", matchedRisk);
          this.selectedRisk = matchedRisk
          this.sectionDetails = this.selectedRisk.riskLimits;
          this.selectedFile && this.addRiskDocuments(this.selectedFile)

          const currentQuotationRiskCode = matchedRisk.code
          this.quotationRiskCode = currentQuotationRiskCode
          const result = premiumRates;
          // this.sectionPremium = result
          this.sumInsured = matchedRisk.value || this.riskDetailsForm.value.sumInsured
          log.debug("Sum insured:", this.sumInsured)
          const sectionPremiums = result
            .filter(premium => !this.sectionDetails.some(detail => detail.sectionCode === premium.sectionCode))
            .map(premium => {
              if (premium.isMandatory === 'Y') {
                return {
                  ...premium,
                  limitAmount: this.sumInsured
                };
              }
              return premium;
            });

          this.sectionPremium = sectionPremiums;
          // log.debug("Risk Clauses List:", this.riskClausesList);
          log.debug("RESPONSE AFTER getting premium rates ", this.sectionPremium);
          const defaultSection = this.sectionPremium.filter(section => section.isMandatory == 'Y')
          log.debug('the default or mandatory section to be added:', defaultSection)
          this.selectedSections = defaultSection
          log.debug("quotation risk code:-adding a section", currentQuotationRiskCode)
          currentQuotationRiskCode && this.createRiskSection();
          this.quotationRiskCode && this.createScheduleL1(this.quotationRiskCode)
          this.riskDetails = selectedProduct?.riskInformation || []

          this.selectedRiskCode = currentQuotationRiskCode;
          sessionStorage.setItem("selectedRiskCode", String(currentQuotationRiskCode));
          this.quotationCode && this.fetchQuotationDetails(this.quotationCode);
          this.loadPersistedRiskClauses();
          this.selectedSubclassCode = null;


        },
        // error: () => this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.message);
        }
      });

    }

    // const riskDetails: any = {
    //  selectedModel: this.riskDetailsForm.ge
    // }

    // this.updateRiskDetailsForm(riskPayload);
    // If we had form values, restore them
    if (currentFormValues) {
      // Wait for form to be recreated in ngOnInit
      setTimeout(() => {
        this.riskDetailsForm.patchValue(currentFormValues);
      }, 0);
    }

  }

  UpdateRiskDetail() {
    log.debug('UPDATE RISK-FORM', this.riskDetailsForm.value)
    log.debug('SELECTED RISK', this.selectedRisk)
    const scheduleDetails: any[] = (this.selectedRisk?.scheduleDetails ?? []) as any[];
    this.riskDetailsForm.get('insureds').setValue(this.insuredCode);
    this.selectedBinderCode = this.riskDetailsForm.value.premiumBand
    // validate inputs
    if (this.riskDetailsForm.invalid) {
      Object.keys(this.riskDetailsForm.controls).forEach(field => {
        const control = this.riskDetailsForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
      for (let controlsKey in this.riskDetailsForm.controls) {
        if (this.riskDetailsForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.riskDetailsForm.get(controlsKey).errors
          );
        }
      }
      return;
    }
    // if valid
    const modal = bootstrap.Modal.getInstance(this.addRiskModalRef.nativeElement);
    modal.hide();
    const currentFormValues = this.riskDetailsForm.value
    const sumInsuredToPass = this.riskDetailsForm.value.value || this.riskDetailsForm.value.sumInsured
    log.debug("Suminsured to pass value:", sumInsuredToPass)
    if (this.riskDetailsForm.value) {
      const riskPayload = this.getQuotationRiskPayload();
      const payload = {
        quotationProducts: [
          {
            code: this.selectedProduct.code,
            productCode: this.selectedProductCode,
            quotationCode: this.selectedProduct.quotationCode,
            productName: this.selectedProduct.productName,
            productShortDescription: this.selectedProduct.productShortDescription,
            premium: this.selectedProduct.premium,
            wef: this.selectedProduct.wef,
            wet: this.selectedProduct.wet,
            totalSumInsured: this.selectedProduct.totalSumInsured,
            converted: this.selectedProduct.converted,
            binder: this.riskDetailsForm.value.premiumBand,
            agentShortDescription: this.selectedProduct.agentShortDescription,
            riskInformation: riskPayload,
            limitsOfLiability: [], // can be empty for now
            taxInformation: [] // optional or empty
          }
        ],
        quotationNumber: this.selectedProduct.quotationNo,
        quotationCode: this.selectedProduct.quotationCode,
        source: this.quotationDetails.source.code,
        user: this.quotationDetails.preparedBy,
        currencyCode: this.quotationDetails.currencyCode,
        currencyRate: this.quotationDetails.currencyRate,
        agentCode: this.quotationDetails.agentCode,
        agentShortDescription: this.quotationDetails.agentShortDescription,
        wefDate: this.quotationDetails.coverFrom,
        wetDate: this.quotationDetails.coverTo,
        premium: this.quotationDetails.premium,
        sumInsured: sumInsuredToPass,
        branchCode: this.quotationDetails.branchCode,
        comments: this.quotationDetails.comments,
        clientType: this.quotationDetails.clientType,
        multiUser: this.quotationDetails.multiUser,
        clientCode: this.quotationDetails.clientCode || null,
        prospectCode: this.quotationDetails.prospectCode,
        quoteType: 'NQ',
      };

      this.quotationService.processQuotation(payload).pipe(
        switchMap(data => {
          const quotationCode = data._embedded.quotationCode
          this.quotationCode = quotationCode
          const quotationNo = data._embedded.quotationNo
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk edited succesfully');
          // this.quotationCode && this.fetchQuotationDetails(this.quotationCode);
          sessionStorage.setItem('riskFormDetails', JSON.stringify(this.riskDetailsForm.value));

          if (this.quickQuoteConverted && scheduleDetails.length === 0) {
            this.createScheduleL1(this.quotationRiskCode)
          } else {
            this.updateSchedule()

          }


          const subclasscode = this.selectedSubclassCode
          const binderCode = this.selectedBinderCode || this.defaultBinder[0].code
          const coverTypeCode = this.selectedCoverType.coverTypeCode
          // Call services directly
          return forkJoin([


            this.premiumRateService.getCoverTypePremiums(subclasscode, binderCode, coverTypeCode)
          ]);
        })
      ).subscribe({
        next: ([premiumRates]: any) => {

          // this.quotationDetails = quoteDetails
          // log.debug("Quotation List-risk creation method:", this.quotationDetails);

          const result = premiumRates;
          this.sectionPremium = result
          // log.debug("Risk Clauses List:", this.riskClausesList);
          log.debug("RESPONSE AFTER getting premium rates ", this.sectionPremium);
          // log.debug("Keys in sectionPremium[0]:", Object.keys(this.sectionPremium[0]));


          // this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created successfully');
          this.fetchQuotationDetails(this.quotationCode)


        },
        // error: () => this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.message);
        }
      });

    }
  }
  getQuotationRiskPayload(): any[] {
    log.debug("quotation code:", this.quotationCode)
    const limitPayload = this.getRiskLimitPayload()
    const selectedCoverTypeCode = this.riskDetailsForm.value.coverType
    const selectedCoverType = this.subclassCoverType.find(cover => cover.coverTypeCode === selectedCoverTypeCode)
    this.selectedCoverType = selectedCoverType
    log.debug("Cover type :", selectedCoverType)
    if (!selectedCoverType) {
      log.error("No matching cover type found for code:", selectedCoverTypeCode);
      return; // Exit the function early
    }

    const selectedSubclassCode = this.riskDetailsForm.value.subclass
    this.selectedSubclassCode = selectedSubclassCode
    const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === selectedSubclassCode)
    log.debug("Selected SUBCLASS :", selectedSubclass)

    const sumInsured = this.riskDetailsForm.value.value
    sessionStorage.setItem("sumInsured", sumInsured)
    log.debug("Currency code-quote creation", this.riskDetailsForm.value.propertyId)
    log.debug("Selected Cover", this.riskDetailsForm.value.coverTypeDescription)
    log.debug("ITEM DESC:", this.riskDetailsForm.value.itemDesc)
    const formattedCoverFromDate = this.formatDate(new Date(this.passedCoverFromDate));
    const formattedCoverToDate = this.formatDate(new Date(this.passedCoverToDate));
    const FormCoverFrom = this.formatDate(this.riskDetailsForm.value.coverFrom)
    const FormCoverTo = this.formatDate(this.riskDetailsForm.value.coverTo)
    log.debug(`API Cover From: ${formattedCoverFromDate}, API Cover To: ${formattedCoverToDate}`);
    log.debug(`Form Cover From: ${FormCoverFrom}, Form Cover To: ${FormCoverTo}`);

    // Determine the action based on whether riskInformation has a code
    let action
    if (this.isEditMode) {
      action = 'E'
    } else {
      action = 'A'
    }
    // const action = this.quotationDetails.quotationProducts[0]?.riskInformation[0]?.code ? "E" : "A";
    const existingRisk = this.quotationDetails.quotationProducts[0]?.riskInformation;
    log.debug("existing risk", existingRisk);

    // const coverTypeSections = this.riskLevelPremiums
    //   .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
    //   .map(section => section.limitPremiumDtos).flat()
    let riskPayload = {
      code: this.selectedRisk?.code || null,
      coverTypeCode: this.riskDetailsForm.value.coverType,
      coverTypeShortDescription: selectedCoverType?.coverTypeShortDescription ?? '',
      coverTypeDescription: selectedCoverType?.description ?? '',
      productCode: this.selectedProductCode,
      premium: null,
      value: this.riskDetailsForm.value.value || this.riskDetailsForm.value.sumInsured,
      clientType: "I",
      itemDesc: this.riskDetailsForm.value.riskDescription,
      wef: FormCoverFrom,
      wet: FormCoverTo,
      propertyId: this.riskDetailsForm.value.registrationNumber || this.riskDetailsForm.value.riskId,
      annualPremium: null,
      sectionsDetails: null,
      action: action,
      clauseCodes: [],
      subclassCode: this.riskDetailsForm.value.subclass,
      binderCode: this.riskDetailsForm.value.premiumBand,
      riskLimits: limitPayload || [],
      subclass: {
        code: this.riskDetailsForm.value.subclass,
        description: selectedSubclass?.description,
        shortDescription: selectedSubclass?.shortDescription,
        productCode: this.selectedProductCode,
      },
      coverDays: null,
      butCharge: this.riskDetailsForm.value.butCharge || 0
    };

    // let risk = {
    //   coverTypeCode: this.riskDetailsForm.value.propertyId,
    //   action: "A", // Set action to "A" (Add) or "E" (Edit) based on the condition
    //   quotationCode: JSON.parse(this.quotationCode),
    //   // code: existingRisk && action === "E" ? existingRisk[0].code : null,
    //   productCode: this.selectedProductCode,
    //   propertyId: this.riskDetailsForm.value.propertyId,
    //   // value: this.sumInsuredValue, // TODO attach this to individual risk
    //   coverTypeShortDescription: this.selectedCoverType.coverTypeShortDescription,
    //   // premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
    //   premium: existingRisk?.[0] ? existingRisk[0].premium : null,
    //   subclassCode: this.selectedSubclassCode,
    //   itemDesc: this.riskDetailsForm.value.itemDesc || this.vehiclemakeModel,
    //   binderCode: this.selectedBinderCode || this.defaultBinder[0].code,
    //   wef: FormCoverFrom || formattedCoverFromDate,
    //   wet: FormCoverTo || formattedCoverToDate,
    //   prpCode: this.insuredCode,
    //   quotationProductCode: existingRisk && action === "E" ? existingRisk[0]?.quotationProductCode : null,
    //   coverTypeDescription: this.selectedCoverType.description,


    //   taxComputation: this.taxList.map(tax => ({
    //     code: tax.code,
    //     premium: tax.premium
    //   }))
    // }
    log.debug("created risk payload", riskPayload);
    return [riskPayload]

  }
  /**
  * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
  * state of a Schedule section.
  */
  toggleSchedule() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  createScheduleDetailsForm() {
    this.scheduleDetailsForm = this.fb.group({
      details: this.fb.group({
        level1: this.fb.group({
          bodyType: [''],
          yearOfManufacture: [''],
          color: [''],
          engineNumber: [''],
          cubicCapacity: [''],
          make: [''],
          coverType: [''],
          registrationNumber: [''],
          chasisNumber: [''],
          tonnage: [''],
          carryCapacity: [''],
          logBook: [''],
          value: [''],
          age: [''],
          itemNo: [''],
          terrorismApplicable: [''],
          securityDevice1: [''],
          motorAccessories: [''],
          model: [''],
          securityDevice: [''],
          regularDriverName: [''],
          schActive: [''],
          licenceNo: [''],
          driverLicenceDate: [''],
          driverSmsNo: [''],
          driverRelationInsured: [''],
          driverEmailAddress: ['']
        }),
      }),
      riskCode: [''],
      transactionType: [''],
      version: [''],
    });

    this.level2DetailsForm = this.fb.group({
      code: [''],
      geographicalLimits: [''],
      deductibleDesc: [''],
      limitationUse: [''],
      authorisedDriver: ['']
    });
  }







  // This method Clears the Schedule Detail form by resetting the form model
  clearForm() {
    this.scheduleDetailsForm.reset();

  }
  onSelectSchedule(event: any) {
    this.selectedSchedule = event;
    log.info("Patched Schedule", this.selectedSchedule)
    this.scheduleDetailsForm.patchValue(this.selectedSchedule)
    let level = this.selectedSchedule.details;
    log.info("Patched level", level)
    // this.deleteScheduleForLevel();
  }
  openEditScheduleModal() {
    if (!this.selectedSchedule) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')
    } else {
      document.getElementById("openModalButtonEdit").click();

    }
  }
  // updateSchedule() {
  //   const schedule = this.scheduleDetailsForm.value;
  //   const level2Details = this.level2DetailsForm.value;
  //   log.debug("schedule form details value", schedule);
  //   log.debug(" level2Details value ", level2Details);

  //   // Check if level2DetailsForm has been touched or filled
  //   const isLevel2FormTouched = this.level2DetailsForm.touched || Object.values(level2Details).some(value => value !== '' && value !== null);

  //   if (isLevel2FormTouched) {
  //     // Get the current scheduleList data
  //     const scheduleItem = Array.isArray(this.scheduleList) ? this.scheduleList[0] : this.scheduleList;
  //     log.debug("schedule item", scheduleItem);

  //     // Create a properly structured payload with both level1 and level2
  //     const updatedPayload = {
  //       code: scheduleItem.code,
  //       riskCode: scheduleItem.riskCode,
  //       transactionType: scheduleItem.transactionType,
  //       organizationCode: scheduleItem.organizationCode,
  //       version: scheduleItem.version,
  //       details: {
  //         level1: scheduleItem.details.level1,  // Keep the existing level1 data
  //         level2: level2Details                // Add the new level2 data
  //       }
  //     };

  //     // Send the updated payload to the backend
  //     this.quotationService.updateSchedule(updatedPayload).subscribe(data => {
  //       log.debug('Final Updated Schedule:', data);
  //       this.updatedScheduleData = data;
  //       this.updatedSchedule = this.updatedScheduleData._embedded;
  //       this.scheduleList = this.updatedSchedule;

  //       // Save to session storage
  //       sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

  //       // Reset the forms
  //       this.scheduleDetailsForm.reset();
  //       this.level2DetailsForm.reset();
  //       this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated with Level 2 Details');
  //     }, (error) => {
  //       log.debug("schedule update error", error);
  //       this.globalMessagingService.displayErrorMessage('Error', 'Error updating schedule with level2 details');
  //     });
  //   } else {
  //     log.debug("updating level1 details");

  //     const scheduleItem = Array.isArray(this.scheduleList) ? this.scheduleList[0] : this.scheduleList;
  //     log.debug("schedule item", scheduleItem);
  //     // Handle the case where we're only updating level1 data
  //     schedule.riskCode = scheduleItem.riskCode;
  //     schedule.transactionType = scheduleItem.transactionType;
  //     schedule.version = scheduleItem.version;

  //     if (scheduleItem.details.level2) {
  //       schedule[0].details.level2 = scheduleItem[0].details.level2;
  //     } else {
  //       schedule[0].details.level2 = {};
  //     }

  //     const removeFields = [
  //       "terrorismApplicable", "securityDevice1", "motorAccessories",
  //       "model", "securityDevice", "regularDriverName", "schActive",
  //       "licenceNo", "driverLicenceDate", "driverSmsNo",
  //       "driverRelationInsured", "driverEmailAddress"
  //     ];

  //     // Conditionally remove fields if they exist
  //     removeFields.forEach(field => {
  //       if (schedule[0].details.level1[field] !== undefined) {
  //         delete schedule[0].details.level1[field];
  //       }
  //     });

  //     log.debug("level 1 payload", schedule);

  //     this.quotationService.updateSchedule(schedule).subscribe(data => {
  //       this.updatedScheduleData = data;
  //       log.debug('Updated Schedule Data:', this.updatedScheduleData);
  //       this.updatedSchedule = this.updatedScheduleData._embedded;
  //       log.debug('Updated Schedule:', this.updatedSchedule);
  //       this.scheduleList = this.updatedSchedule;
  //       sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

  //       log.debug("UPDATED SCHEDULE LIST:", this.scheduleList);

  //       if (Array.isArray(this.scheduleList)) {
  //         const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
  //         if (index !== -1) {
  //           this.scheduleList[index] = this.updatedSchedule;
  //           this.cdr.detectChanges();
  //         }
  //       }

  //       try {
  //         this.scheduleDetailsForm.reset();
  //         this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated with Level 1 Details');
  //       } catch (error) {
  //         this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
  //         this.scheduleDetailsForm.reset();
  //       }

  //       // this.loadClientQuotation();
  //     });
  //   }
  //   this.cdr.detectChanges();
  // }
  updateSchedule() {
    // const schedule = this.scheduleDetailsForm.value;
    // const riskform = this.riskDetailsForm.value;



    // schedule.details = schedule.details || {};
    // schedule.details.level1 = {
    //   bodyType: riskform.bodyType,
    //   yearOfManufacture: riskform.yearOfManufacture,
    //   color: riskform.color,
    //   engineNumber: riskform.engineNumber,
    //   cubicCapacity: riskform.cubicCapacity,
    //   make: riskform.vehicleMake,
    //   model: riskform.vehicleModel,
    //   coverType: this.selectedRisk.coverTypeDescription,
    //   registrationNumber: riskform.registrationNumber,
    //   chasisNumber: riskform.chasisNumber,
    //   tonnage: null,
    //   carryCapacity: riskform.seatingCapacity,
    //   logBook: null,
    //   value: riskform.value
    // };

    // schedule.riskCode = this.quotationRiskCode;
    // schedule.transactionType = "Q";
    // schedule.version = this.selectedRisk?.scheduleDetails?.[0].version || 0;

    // // Remove unnecessary fields
    // const removeFields = [
    //   "terrorismApplicable", "securityDevice1", "motorAccessories",
    //   "securityDevice", "regularDriverName", "schActive",
    //   "licenceNo", "driverLicenceDate", "driverSmsNo",
    //   "driverRelationInsured", "driverEmailAddress"
    // ];
    // removeFields.forEach(field => delete schedule.details.level1[field]);

    const scheduleFields = this.subclassFormData.filter(
      field => field.applicableLevel === 'S'
    );
    log.debug("Schedule dynamic fields", scheduleFields);

    const schedule = this.scheduleDetailsForm.value;
    const riskform =
      JSON.parse(sessionStorage.getItem('riskFormDetails')) ||
      this.riskDetailsForm.value;

    log.debug('SELECTED RISK:', this.selectedRisk);
    log.debug("Risk form-session storage:", riskform);

    const level1: any = {};

    scheduleFields.forEach(field => {
      const fieldName = field.name;
      const fieldValue =
        riskform?.[fieldName] ??
        this.scheduleDetailsForm.get(fieldName)?.value ??
        null;

      level1[fieldName] = fieldValue;
    });

    schedule.details.level1 = {
      ...level1,
      coverType: this.selectedRisk.coverTypeDescription,
    };

    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = 'Q';
    schedule.version = this.selectedRisk?.scheduleDetails?.[0].version || 0

    const removeFields = [

    ];

    removeFields.forEach(field => delete schedule.details.level1[field]);

    this.quotationService.updateSchedule(schedule).subscribe({
      next: (data) => {
        this.updatedScheduleData = data;
        log.debug('Updated Schedule Data:', this.updatedScheduleData);
        this.updatedSchedule = this.updatedScheduleData._embedded;
        log.debug('Updated Schedule:', this.updatedSchedule);
        this.scheduleList = this.updatedSchedule;
        sessionStorage.setItem('scheduleDetails', JSON.stringify(this.scheduleList));

        log.debug("UPDATED SCHEDULE LIST:", this.scheduleList);

        if (Array.isArray(this.scheduleList)) {
          const index = this.scheduleList.findIndex(item => item.code === this.updatedSchedule.code);
          if (index !== -1) {
            this.scheduleList[index] = this.updatedSchedule;
            this.cdr.detectChanges();
          }
        }

        try {
          this.scheduleDetailsForm.reset();
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Updated with Level 1 Details');
        } catch (error) {
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.scheduleDetailsForm.reset();
        }
      },
      error: (err) => {
        log.error("Update schedule failed:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Schedule update failed');
      }
    });
  }
  getLevelName(levelNumber: any) {
    log.debug("levelName", levelNumber)
    this.selectedLevelNumber = levelNumber
  }
  deleteScheduleForLevel() {
    log.debug('Schedule details:Delete', this.selectedSchedule)
    const levelNumber = this.selectedLevelNumber
    if (levelNumber !== null) {
      this.passedlevel = levelNumber;
      log.debug("the level passsed", this.passedlevel)
      this.deleteSchedule()
    } else {
      log.debug("No 'level' property found in the object.");
    }
  }
  extractLevelNumber(obj: any): number | null {
    const keys = Object.keys(obj);
    const levelKey = keys.find(key => key.startsWith('level'));
    const levelNumber = levelKey ? parseInt(levelKey.match(/\d+/)[0], 10) : null;
    return levelNumber;
  }
  deleteSchedule() {
    if (this.selectedSchedule && this.selectedSchedule[0].code) {
      let level = this.passedlevel;

      // Ensure that level is a number
      if (typeof level === 'number') {
        let scheduleCode = this.selectedSchedule[0].code;
        let riskCode = this.selectedSchedule[0].riskCode;

        this.quotationService.deleteSchedule(level, riskCode, scheduleCode).subscribe(() => {
          // Remove the deleted schedule from the scheduleList
          // this.scheduleList = this.scheduleList.filter(schedule => schedule.code !== scheduleCode);
          const quotationCode = this.selectedRisk?.quotationCode
          this.fetchQuotationDetails(quotationCode)
          this.globalMessagingService.displaySuccessMessage('Success', 'Deleted Successfully')

        }, error => {
          console.error('Error deleting schedule:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later')

        });
      } else {
        log.debug('Invalid level number:', level);
        // Handle the case where level is not a valid number
      }
    } else {
      // Handle the case where selectedPremiumRate is undefined or does not have a code property
      this.globalMessagingService.displayErrorMessage('Error', 'Select a Schedule to continue')

    }
  }

  hasAnyLevel2Data(): boolean {
    if (!Array.isArray(this.scheduleList) || this.scheduleList.length === 0) {
      return false;
    }
    return this.scheduleList.some(schedule =>
      schedule[0].details?.level2 &&
      (
        schedule[0].details.level2.code ||
        schedule[0].details.level2.geographicalLimits ||
        schedule[0].details.level2.deductibleDesc ||
        schedule[0].details.level2.limitationUse ||
        schedule[0].details.level2.authorisedDriver
      )
    );
  }
  // prepareSchedulePayload() {
  //   log.debug("Dynamic fields", this.subclassFormData)
  //   const scheduleFields = this.subclassFormData.filter(schedule => schedule.applicableLevel == 'S')
  //   log.debug("Schedule dynamic fields", scheduleFields)
  //   const schedule = this.scheduleDetailsForm.value;
  //   const riskform = JSON.parse(sessionStorage.getItem('riskFormDetails')) || this.riskDetailsForm.value;

  //   log.debug('SELECTED RISK:', this.selectedRisk)
  //   log.debug("Risk form-session storage:", riskform)
  //   schedule.details.level1 = {
  //     bodyType: riskform?.bodyType,
  //     yearOfManufacture: riskform.yearOfManufacture,
  //     color: riskform.color,
  //     engineNumber: riskform.engineNumber,
  //     cubicCapacity: riskform.cubicCapacity,
  //     make: riskform.vehicleMake,
  //     model: riskform.vehicleModel,
  //     coverType: this.selectedRisk.coverTypeDescription,
  //     registrationNumber: riskform.registrationNumber,
  //     chasisNumber: riskform.chasisNumber,
  //     tonnage: null,
  //     carryCapacity: riskform.seatingCapacity,
  //     logBook: null,
  //     value: riskform.value
  //   };

  //   schedule.riskCode = this.quotationRiskCode;
  //   schedule.transactionType = "Q";
  //   schedule.version = 0;

  //   // Remove unnecessary fields
  //   const removeFields = [
  //     "terrorismApplicable", "securityDevice1", "motorAccessories",
  //     , "securityDevice", "regularDriverName", "schActive",
  //     "licenceNo", "driverLicenceDate", "driverSmsNo",
  //     "driverRelationInsured", "driverEmailAddress"
  //   ];

  //   removeFields.forEach(field => delete schedule.details.level1[field]);

  //   return schedule;
  // }

  prepareSchedulePayload() {
    log.debug("Dynamic fields for schedules", this.allSubclassFormData);

    const scheduleFields = this.allSubclassFormData.filter(
      field => Number(field.scheduleLevel) === 1
    );
    log.debug("Schedule dynamic fields", scheduleFields);

    const schedule = this.scheduleDetailsForm.value;
    const riskform =
      JSON.parse(sessionStorage.getItem('riskFormDetails')) ||
      this.riskDetailsForm.value;

    log.debug('SELECTED RISK:', this.selectedRisk);
    log.debug("Risk form-session storage:", riskform);

    const level1: any = {};

    scheduleFields.forEach(field => {
      const fieldName = field.name;
      const fieldValue =
        riskform?.[fieldName] ??
        this.scheduleDetailsForm.get(fieldName)?.value ??
        null;

      level1[fieldName] = fieldValue;
    });

    schedule.details.level1 = {
      ...level1,
      coverType: this.selectedRisk.coverTypeDescription,
    };

    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = 'Q';
    schedule.version = 0;

    const removeFields = [

    ];

    removeFields.forEach(field => delete schedule.details.level1[field]);

    return schedule;
  }

  fetchScheduleRelatedData() {
    forkJoin(([
      this.policyService.getBodyTypes(),
      this.policyService.getMotorColors(),
      this.policyService.getSecurityDevices(),
      this.policyService.getMotorAccessories(),
      this.productService.getYearOfManufacture()
    ])).pipe(
      untilDestroyed(this)
    )
      .subscribe(([bodyTypes, motorColours, securityDevices, motorAccessories, modelYear]: any) => {
        this.bodytypesList = bodyTypes._embedded ?? []
        this.motorColorsList = motorColours._embedded ?? []
        this.securityDevicesList = securityDevices._embedded ?? []
        this.motorAccessoriesList = motorAccessories._embedded ?? []
        const model = modelYear._embedded
        this.modelYear = model[0]["List of cover years"]

        log.debug("Body Types:", this.bodytypesList)
        log.debug("Motor Colours:", this.motorColorsList)
        log.debug("Security Devices:", this.securityDevicesList)
        log.debug("Motor Accessories:", this.motorAccessoriesList)
        log.debug("model year", this.modelYear)

        this.safePopulateSelectOptions(this.subclassFormData, 'bodyType', this.bodytypesList, 'description', 'description');
        this.safePopulateSelectOptions(this.subclassFormData, 'color', this.motorColorsList, 'description', 'code');



      })
  }




  handleRowClick(data: any) {
    if (!data?.code) {
      log.debug('Invalid data for row click:', data);
      return;
    }

    log.debug('Row clicked with data:', data);
    this.selectedRisk = data;
    this.sumInsured = this.selectedRisk?.value;
    this.selectedRiskCode = this.selectedRisk?.code;
    const selectedRiskCode = this.selectedRisk?.code;
    this.quotationRiskCode = selectedRiskCode;
    log.debug("Quotation risk code:", this.quotationRiskCode);

    const productDetails = this.quotationDetails.quotationProducts.find(
      product => product.productCode === this.selectedProductCode
    );
    const riskSelectedData = productDetails.riskInformation.find(risk => risk.code === selectedRiskCode);
    this.scheduleList = riskSelectedData.scheduleDetails ? [riskSelectedData.scheduleDetails] : [];
    log.debug("SCHEDULE DETAILS AFTER ROW CLICK:", this.scheduleList);
    this.selectedSchedule = this.scheduleList
    this.sectionDetails = this.selectedRisk.riskLimits;
    log.debug("section DETAILS AFTER ROW CLICK:", this.sectionDetails);
    if (this.sectionDetails.length > 0) {
      this.setColumnsFromRiskLimit(this.sectionDetails[0]);
    }
    const subclassCode = riskSelectedData.subclassCode;
    this.selectedSubclassCode = subclassCode
    this.selectedSubclassCode && this.fetchsubclassDynamicFields(this.selectedSubclassCode)
    this.quoteProductCode = riskSelectedData.quotationProductCode
    const binderCode = riskSelectedData.binderCode;
    const covertypeCode = riskSelectedData.coverTypeCode;

    this.selectedSubclassObject = this.allMatchingSubclasses?.find(subclass => subclass.code == subclassCode)
    log.debug("selected subclass object handle row click:", this.selectedSubclassObject)
    const screenCode = this.selectedSubclassObject?.underwritingScreenCode
    this.getProductTaxes();
    if (this.selectedRiskCode) {
      this.loadLimitsOfLiability();
      this.loadAddedLimitsOfLiability();
      this.loadPersistedRiskClauses();
    } else {
      log.debug('No risk code selected, skipping limit loading');
    }


    // Parallel calls
    forkJoin({
      premiumRates: this.premiumRateService.getCoverTypePremiums(subclassCode, binderCode, covertypeCode),
      scheduleLevels: this.quotationService.getScheduleLevels(screenCode),
    }).subscribe({
      next: ({ premiumRates, scheduleLevels }) => {
        console.log('Premium rates:', premiumRates);
        console.log('Schedule levels:', scheduleLevels);

        const sectionPremiums = premiumRates
          .filter(premium => !this.sectionDetails.some(detail => detail.sectionCode === premium.sectionCode))
          .map(premium => {
            if (premium.isMandatory === 'Y') {
              return {
                ...premium,
                limitAmount: this.sumInsured
              };
            }
            return premium;
          });

        this.sectionPremium = sectionPremiums;
        log.debug("SECTION PREMIUMS-filtered & patched:", this.sectionPremium);

        // SCHEDULES RESPONSE
        this.scheduleLevels = scheduleLevels?._embedded || [];
        const sortedLevels = this.scheduleLevels.sort((a, b) => a.levelNumber - b.levelNumber);
        // Set the tab labels
        this.scheduleTabs = sortedLevels
          .sort((a, b) => a.levelNumber - b.levelNumber)
          .map(level => ({
            levelNumber: level.levelNumber,
            levelName: level.levelName,
          }));
        log.debug("Schedule Tabs:", this.scheduleTabs)
        // Set the first tab as the active one by default
        this.activeTab = this.scheduleTabs[0];        // Map to hold table columns per level
        this.levelTableColumnsMap = {};
        this.levelDataMap = {};
        // Go through each level and extract relevant fields
        // Define preferred columns for Level 1
        const level1PreferredColumns = [
          { field: 'registrationNumber', header: 'Registration Number' },
          { field: 'vehicleMake', header: 'Make' },
          { field: 'cubicCapacity', header: 'Cubic Capacity' },
          { field: 'yearOfManufacture', header: 'Year Of Manufacture' },
          { field: 'seatingCapacity', header: 'Seating Capacity' },
          { field: 'value', header: 'Value' },
          { field: 'bodyType', header: 'Body Type' },
          { field: 'coverType', header: 'Cover Type' }
        ];

        // Go through each level and extract relevant fields
        sortedLevels?.forEach(level => {
          const levelName = level.levelName;
          const levelNumber = level.levelNumber;
          const levelKey = `level${levelNumber}`; // e.g., level2

          // 1. Determine if motor class is allowed
          const isMotorClassAllowed = this.motorClassAllowed === 'Y';

          // 2. Define columns
          let columns;

          if (levelNumber === 1 && isMotorClassAllowed) {
            // Use preferred columns for level 1 if motorClassAllowed
            columns = level1PreferredColumns;
          } else {
            // Dynamically generate columns from subclass form fields
            // columns = this.dynamicSubclassFormFields
            //   .filter(field => Number(field.scheduleLevel) === levelNumber)
            //   .map(field => ({
            //     field: field.name,
            //     header: field.label
            //   }));

            log.debug("dynamicSubclassFormFields:Handle row click", this.dynamicSubclassFormFields)

            columns = this.dynamicSubclassFormFields
              .filter(
                field =>
                  Number(field.scheduleLevel) === levelNumber &&
                  field.applicableLevel === 'S'
              )
              .map(field => ({
                field: field.name,
                header: field.label
              }));
            log.debug("ScheduleColumns:Handle row click", columns)
            // Add "Actions" column for levels 2 and above
            if (levelNumber >= 2) {
              columns.push({
                field: 'actions',
                header: 'Actions',
                isAction: true, // helps in template logic
              });
            }
          }

          this.levelTableColumnsMap[levelName] = columns;
          log.debug('LEVEL TABLE COLUMN:', this.levelTableColumnsMap);

          // 3. Map level-specific data and attach original schedule
          const levelData = (this.scheduleList || [])
            .filter(schedule => !!schedule[0].details?.[levelKey])
            .map(schedule => ({
              ...schedule[0].details[levelKey],
              __originalSchedule: schedule
            }));

          this.levelDataMap[levelName] = this.normalizeOtherDetailsData(levelData);
          log.debug('LEVEL COLUMN DATA:', this.levelDataMap);
        });
      },
      error: (err) => {
        log.error("Error fetching data in forkJoin:", err);
      }
    });

    this.selectedSubclassCode = riskSelectedData.subclassCode;
    this.selectedRiskCode = riskSelectedData.code;
    log.debug("firstRiskCode", this.selectedRiskCode);
    sessionStorage.setItem("selectedRiskCode", this.selectedRiskCode);
    this.loadPersistedRiskClauses();
  }


  toggleSections(iconElement: HTMLElement): void {
    this.showSections = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + 30;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showColumnModal = true;
  }

  // setColumnsFromRiskLimit(sample: RiskLimit) {
  //   const defaultVisibleFields = [
  //     'rowNumber',
  //     'calcGroup',

  //     'sectionShortDescription',
  //     'limitAmount',
  //     'premiumRate',
  //     'rateType'
  //   ];
  //   const excludedFields = ['code', 'quotationCode', 'quotationProCode', 'productCode']; // adjust as needed

  //   this.columns = Object.keys(sample)
  //     .filter((key) => !excludedFields.includes(key))
  //     .map((key) => ({
  //       field: key,
  //       header: this.sentenceCase(key),
  //       visible: defaultVisibleFields.includes(key),
  //     }));

  //   // manually add actions column
  //   this.columns.push({ field: 'actions', header: 'Actions', visible: true });
  // }

  setColumnsFromRiskLimit(sample: RiskLimit) {
    const defaultVisibleFields = [
      'rowNumber',
      'calcGroup',
      'sectionShortDescription',
      'limitAmount',
      'premiumRate',
      'rateType'
    ];

    const excludedFields = ['code', 'quotationCode', 'quotationProCode', 'productCode']; // adjust as needed

    // start with defaultVisibleFields that exist in sample
    const columns: any[] = defaultVisibleFields
      .filter((key) => key in sample && !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: true,
      }));

    // add any remaining fields from sample that are not excluded or already added
    Object.keys(sample)
      .filter((key) => !excludedFields.includes(key) && !defaultVisibleFields.includes(key))
      .forEach((key) => {
        columns.push({
          field: key,
          header: this.sentenceCase(key),
          visible: false, // default to hidden
        });
      });

    // finally, add actions column
    columns.push({ field: 'actions', header: 'Actions', visible: true });

    this.columns = columns;
  }


  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  /**
  * This method toggles the 'isCollapsibleOpen' property, which controls the open/closed
  * state of a Section.
  */
  toggleSectionDetails() {
    this.isSectionDetailsOpen = !this.isSectionDetailsOpen;
  }

  toggleClauses() {
    this.isClausesOpen = !this.isClausesOpen;
  }
  /**
  * Creates and initializes a section details form.
  * Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
  * Defines form controls for various section-related fields, setting initial values as needed.
  */
  createSectionDetailsForm() {
    this.sectionDetailsForm = this.fb.group({
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
      sumInsuredRate: [''],
      minimumPremium: ['']
    });
  }
  onKeyUp(event: any, section: any): void {
    clearTimeout(this.typingTimer); // Reset the timer

    this.typingTimer = setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.trim(); // Trim spaces
      const checkbox = document.getElementById('check_section_' + section.sectionCode) as HTMLInputElement;
      if (section.isChecked && !section.limitAmount) {
        document.getElementById(`section_${section.sectionCode}`)?.classList.add('error-border');
      } else {
        document.getElementById(`section_${section.sectionCode}`)?.classList.remove('error-border');
      }
      // Update checkbox state based on input value
      checkbox.checked = !!(checkbox && inputValue);
      section.typedWord = parseInt(inputValue, 10);
      section.isChecked = !!inputValue;
      log.debug('section passed by checkbox', section)
      if (section.isChecked) {
        // Add section if it's not already included
        if (!this.passedSections.some(s => s.sectionCode === section.sectionCode)) {
          this.passedSections.push(section);
        }

        this.selectedSections = [...this.passedSections]; // Ensure selectedSections is updated properly
        log.debug("Section selected", this.passedSections);
        log.debug("Selected Sections", this.selectedSections);
      } else {
        // Remove section from passedSections
        this.passedSections = this.passedSections.filter(s => s.sectionCode !== section.sectionCode);
        this.selectedSections = [...this.passedSections]; // Update selectedSections after removal
        log.debug("Selected Sections after removal", this.selectedSections);

        const removedSectionCode = section.sectionCode;

        // Ensure sectionToBeRemoved is an array
        if (!Array.isArray(this.sectionToBeRemoved)) {
          this.sectionToBeRemoved = [];
        }

        // Store multiple removed sections
        this.sectionToBeRemoved.push(removedSectionCode);
        console.debug("Sections to be removed", this.sectionToBeRemoved);
      }


      // Remove error if user types a valid value
      if (section.limitAmount) {
        this.inputErrors[section.sectionCode] = false;
      }

      // this.loadAllPremiums();
    }, 500); // Trigger after 500ms of no typing
  }

  applyGlobalFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.sectionTable) {
      this.sectionTable.filterGlobal(filterValue, 'contains');
    }
    if (this.limitTable) {
      this.limitTable.filterGlobal(filterValue, 'contains');
    }
    if (this.addedlimitTable) {
      this.addedlimitTable.filterGlobal(filterValue, 'contains');
    }
    if (this.riskClauseTable) {
      this.riskClauseTable.filterGlobal(filterValue, 'contains');
    }
    if (this.excessTable) {
      this.excessTable.filterGlobal(filterValue, 'contains');
    }
    if (this.addExcessTable) {
      this.addExcessTable.filterGlobal(filterValue, 'contains');
    }
    if (this.riskClauseTable) {
      this.riskClauseTable.filterGlobal(filterValue, 'contains');
    }
    if (this.addedCommissionTable) {
      this.addedCommissionTable.filterGlobal(filterValue, 'contains');
    }
    if (this.commissionTable) {
      this.commissionTable.filterGlobal(filterValue, 'contains');
    }
  }


  makeRiskPayload() {
    if (this.selectedRisk) {
      const limitPayload = this.getRiskLimitPayload()
      let riskPayload = {
        code: this.selectedRisk.code,
        coverTypeCode: this.selectedRisk.coverTypeCode,
        coverTypeShortDescription: this.selectedRisk.coverTypeShortDescription,
        coverTypeDescription: this.selectedRisk.coverTypeDescription ?? '',
        productCode: this.selectedProductCode,
        premium: this.selectedRisk.premium,
        value: this.selectedRisk.value,
        clientType: "I",
        itemDesc: this.selectedRisk.itemDesc,
        wef: this.selectedRisk.wef,
        wet: this.selectedRisk.wet,
        propertyId: this.selectedRisk.propertyId,
        annualPremium: this.selectedRisk.annualPremium,
        sectionsDetails: this.selectedRisk.sectionsDetails,
        action: "E",
        clauseCodes: this.selectedRisk.clauseCodes,
        subclassCode: this.selectedRisk.subclassCode,
        binderCode: this.selectedRisk.binderCode,
        riskLimits: limitPayload || [],
        subclass: {
          code: this.selectedRisk.subclass.code,
          description: this.selectedRisk.subclass?.description,
          shortDescription: this.selectedRisk.subclass?.shortDescription,
          productCode: this.selectedProductCode,
        },
        coverDays: this.selectedRisk.coverDays,
        butCharge: 0
      };
      return [riskPayload]
    }
  }
  createRiskLimitsNew() {
    log.debug('selected risk', this.selectedRisk)
    const riskPayload = this.makeRiskPayload();
    const payload = {
      quotationProducts: [
        {
          code: this.selectedProduct.code,
          productCode: this.selectedProductCode,
          quotationCode: this.selectedProduct.quotationCode,
          productName: this.selectedProduct.productName,
          productShortDescription: this.selectedProduct.productShortDescription,
          premium: this.selectedProduct.premium,
          wef: this.selectedProduct.wef,
          wet: this.selectedProduct.wet,
          totalSumInsured: this.selectedProduct.totalSumInsured,
          converted: this.selectedProduct.converted,
          binder: this.riskDetailsForm.value.premiumBand,
          agentShortDescription: this.selectedProduct.agentShortDescription,
          riskInformation: riskPayload,
          limitsOfLiability: [], // can be empty for now
          taxInformation: [] // optional or empty
        }
      ],
      quotationNumber: this.selectedProduct.quotationNo,
      quotationCode: this.selectedProduct.quotationCode,
      source: this.quotationDetails.source.code,
      user: this.quotationDetails.preparedBy,
      currencyCode: this.quotationDetails.currencyCode,
      currencyRate: this.quotationDetails.currencyRate,
      agentCode: this.quotationDetails.agentCode,
      agentShortDescription: this.quotationDetails.agentShortDescription,
      wefDate: this.quotationDetails.coverFrom,
      wetDate: this.quotationDetails.coverTo,
      premium: this.quotationDetails.premium,
      branchCode: this.quotationDetails.branchCode,
      comments: this.quotationDetails.comments,
      clientType: this.quotationDetails.clientType,
      multiUser: this.quotationDetails.multiUser,
      clientCode: this.quotationDetails.clientCode || null,
      prospectCode: this.quotationDetails.prospectCode,
      quoteType: 'NQ',
    };

    this.quotationService.processQuotation(payload).subscribe({
      next: (response) => {
        log.debug('RESPONSE AFTER CREATING RISK LIMIT', response);

        this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');

        // Fetch updated risk sections after successful creation
        // this.fetchRiskSections();
      },
      error: (error) => {
        log.error('Error creating risk limits:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to create risk SECTIONS');
      }
    });
  }

  createRiskSection() {
    log.debug("Risk Code-CREATINF RISK SEDCTION:", this.quotationRiskCode);
    log.debug("Selected sections", this.selectedSections)
    log.debug("Selected sectionpremium", this.sectionPremium)

    // this.selectedSections = this.sectionPremium?.filter(section => section.isChecked) || [];
    // log.debug("Selected Sections from modal:", this.selectedSections);

    const limitsToSave = this.riskLimitPayload();
    log.debug("Limits to save:", limitsToSave)
    if (this.selectedSections.length === 0) {
      this.globalMessagingService.displayErrorMessage('Error', 'Premium list is empty');
      return;
    }

    const limitsPayLoad = {
      addOrEdit: 'A',
      quotationRiskCode: this.quotationRiskCode,
      riskSections: limitsToSave.map(value => ({
        ...value,
        quotationCode: Number(this.quotationCode),
        quotRiskCode: this.quotationRiskCode
      }))
    };

    this.createRiskLimits(limitsPayLoad);
  }
  private createRiskLimits(payload: any): void {
    this.quotationService.createRiskLimits(payload).subscribe({
      next: (response) => {
        log.debug('[createRiskLimits] Response:', {
          message: response?.message,
          status: response?.status
        });

        this.globalMessagingService.displaySuccessMessage('Success', 'Sections Created');
        this.selectedSections = [];
        this.passedSections = []

        // Fetch updated risk sections after successful creation
        this.fetchQuotationDetails(this.quotationCode);
      },
      error: (error) => {
        log.error('Error creating risk limits:', error);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to create risk limits');
      }
    });
  }

  // private fetchRiskSections(): void {
  //   this.quotationService.getRiskSection(this.quotationCode).subscribe({
  //     next: (data: any) => {
  //       try {
  //         const embedded = data?._embedded;

  //         if (embedded && Array.isArray(embedded) && embedded.length > 0) {
  //           const section = embedded[0];

  //           // Safe logging
  //           log.debug('[fetchRiskSections] Section keys:', Object.keys(section));

  //           this.riskSectionList = section;
  //           this.sectionDetails = section;

  //           // Store only safe fields if necessary
  //           sessionStorage.setItem('sectionDetails', JSON.stringify({
  //             id: section?.id,
  //             name: section?.name // Replace with safe keys only
  //           }));

  //           // Close modal
  //           const modalElement = this.addRiskSectionRef?.nativeElement;
  //           if (modalElement) {
  //             const modal = bootstrap.Modal.getInstance(modalElement);
  //             modal?.hide();
  //           }
  //         } else {
  //           this.globalMessagingService.displayErrorMessage('Error', 'No section data received');
  //         }
  //       } catch (e) {
  //         log.error('Error processing section response:', e);
  //         this.globalMessagingService.displayErrorMessage('Error', 'Invalid section data');
  //       }
  //     },
  //     error: (error) => {
  //       log.error('Error fetching risk sections:', error);
  //       this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch risk sections');
  //       setTimeout(() => this.sectionDetailsForm.reset(), 100);
  //     }
  //   });
  // }



  riskLimitPayload() {
    let limitsToSave: any[] = [];
    log.debug("Slected section-coming up with the payload:", this.selectedSections)
    for (let section of this.selectedSections) {
      limitsToSave.push({
        code: section.code || null,
        calcGroup: 1,
        compute: "Y",
        description: section.sectionDescription,
        freeLimit: section.freeLimit || 0,
        multiplierDivisionFactor: section.multiplierDivisionFactor,
        multiplierRate: section.multiplierRate,
        premiumAmount: section.premiumMinimumAmount || 0,
        premiumRate: section.rate || 0,
        minimumPremium: section.premiumMinimumAmount,
        rateDivisionFactor: section.divisionFactor || 1,
        rateType: section.rateType || "FXD",
        rowNumber: 1,
        sectionType: section.sectionType,
        sumInsuredLimitType: section.sumInsuredLimitType || null,
        sumInsuredRate: section.sumInsuredRate,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: section.limitAmount,
      });
    }

    return limitsToSave;
  }
  updateRiskLimitPayload() {
    let limitsToSave: any[] = [];
    log.debug("Slected section-coming up with the payload:", this.updatedSelectedSections)
    for (let section of this.updatedSelectedSections) {
      limitsToSave.push({
        code: section.code || null,
        calcGroup: 1,
        compute: "Y",
        description: section.description || section.sectionShortDescription,
        freeLimit: section.freeLimit || 0,
        multiplierDivisionFactor: section.multiplierDivisionFactor,
        multiplierRate: section.multiplierRate,
        premiumAmount: section.premiumAmount || 0,
        premiumRate: section.premiumRate || 0,
        rateDivisionFactor: section.rateDivisionFactor || 1,
        rateType: section.rateType || "FXD",
        rowNumber: 1,
        sectionType: section.sectionType,
        sumInsuredLimitType: section.sumInsuredLimitType || null,
        sumInsuredRate: section.sumInsuredRate,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: section.limitAmount,
        minimumPremium: section.minimumPremium
      });
    }

    return limitsToSave;
  }
  getRiskLimitPayload() {
    let limitsToSave: any[] = [];
    log.debug("Selected sections", this.selectedSections)
    for (let section of this.selectedSections) {
      limitsToSave.push({
        sectionCode: section.sectionCode,
        quotationCode: this.selectedProduct.quotationCode,
        quotationRiskCode: this.selectedRisk.code,
        productCode: this.selectedProductCode,
        quotationProCode: this.selectedProduct.code,
        minimumPremium: section.minimumPremium,
        rateDescription: section.rateDescription,
        annualPremium: null,
        usedLimit: null,
        setupPremiumRate: null,
        indemnityFirstPeriod: null,
        indemnityFirstPeriodPct: null,
        indemnityPeriod: null,
        indemnityRemainingPeriodPct: null,
        minimumPremiumRate: null,
        periodType: null,
        maxPremiumRate: null,
        calcGroup: 1,
        code: 0,
        compute: null,
        description: section.sectionDescription,
        freeLimit: section.freeLimit,
        multiplierRate: section.multiplierRate,
        premiumAmount: null,
        premiumRate: section.rate,
        rateDivisionFactor: section.divisionFactor,
        rateType: section.rateType,
        rowNumber: 1,
        sectionType: section.sectionType,
        sectionShortDescription: section.sectionShortDescription,
        limitAmount: section.limitAmount,
        sumInsuredRate: section.sumInsuredRate

      });
    }

    return limitsToSave;
  }


  openEditSectionModal() {
    this.openModals('editSection');
  }

  closeEditSectionModal() {
    this.closeModals('editSection');
  }

  onSelectSection(event: any) {
    this.selectedRiskSection = event;
    log.info("Patched section", this.selectedRiskSection)
    this.sectionDetailsForm.patchValue(this.selectedRiskSection)
  }

  onOpenEditSectionModal(selectedSection: any) {
    this.openEditSectionModal();
    this.selectedSection = selectedSection;
    log.debug("Selected section:", this.selectedSection);

    // Patch the form with the selected section's values, including the row number
    this.sectionDetailsForm.patchValue({
      ...this.selectedSection,
      rowNumber: this.selectedSection.rowNumber,
      minimumPremium: this.selectedSection.selectedSection
    });

    // Open the modal
    const modalElement: HTMLElement | null = this.editSectionModal.nativeElement;
    if (modalElement) {
      this.renderer.addClass(modalElement, 'show');
      this.renderer.setStyle(modalElement, 'display', 'block');
    }
  }

  editSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Selected Section(UpdateRiskSection):", this.selectedSection)
    log.debug("Section Details(UpdateRiskSection):", this.sectionDetails)
    log.debug("Section Details(UpdateRiskSection): form ", section)

    const formValue = this.sectionDetailsForm.value;
    const selected = this.selectedSection;

    const payload = {
      ...selected, // start with original section
      ...formValue, // override with updated form values
      // ensure required backend fields remain intact
      quotationRiskCode: selected.quotationRiskCode,
      quotationCode: selected.quotationCode,
      quotationProCode: selected.quotationProCode,
      productCode: selected.productCode,
      riskCode: selected.riskCode,
      code: selected.code,
      sectionCode: selected.sectionCode,
      sectionType: selected.sectionType,
      sectionShortDescription: selected.sectionShortDescription,
      calcGroup: selected.calcGroup,
      rowNumber: selected.rowNumber,
      compute: selected.compute
    };
    this.selectedSection = [payload]
    if (!this.selectedSection) {
      console.error('No section selected for update.');
      this.globalMessagingService.displayErrorMessage('Error', 'No section selected for update');
      return;
    }
    log.debug("Selected Section(after patching):", this.selectedSection)

    // const index = this.sectionDetails.findIndex(s => s.sectionCode === this.selectedSection.sectionCode);

    if (this.selectedSection) {
      this.updatedSelectedSections = [...this.selectedSection];
      const limitsToSave = this.updateRiskLimitPayload();

      const limitsPayLoad = {
        addOrEdit: 'E',
        quotationRiskCode: this.quotationRiskCode,
        riskSections: limitsToSave.map(value => ({
          ...value,
          quotationCode: Number(this.quotationCode),
          quotRiskCode: this.quotationRiskCode
        }))
      };

      // Send the updated section to the service
      this.quotationService.createRiskLimits(limitsPayLoad).subscribe((data) => {
        try {
          // Reset the form and selected section
          this.sectionDetailsForm.reset();
          this.selectedSection = null;
          this.quotationCode && this.fetchQuotationDetails(this.quotationCode)

          this.globalMessagingService.displaySuccessMessage('Success', 'Section Updated');
          this.closeEditSectionModal();
        } catch (error) {
          log.error("Error updating section:", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.sectionDetailsForm.reset();
        }
      });
    } else {
      console.error('Selected section not found in the sections array.');
      this.globalMessagingService.displayErrorMessage('Error', 'Selected section not found');
    }

  }




  updateRiskSection() {
    const section = this.sectionDetailsForm.value;
    log.debug("Selected Section(UpdateRiskSection):", this.selectedSection)
    log.debug("Section Details(UpdateRiskSection):", this.sectionDetails)
    // Ensure a section is selected
    if (!this.selectedSection) {
      console.error('No section selected for update.');
      this.globalMessagingService.displayErrorMessage('Error', 'No section selected for update');
      return;
    }

    // Find the index of the selected section in the 'sections' array
    const index = this.sectionDetails.findIndex(s => s.sectionCode === this.selectedSection.sectionCode);

    if (index !== -1) {
      const limitsToSave = this.riskLimitPayload();

      const limitsPayLoad = {
        addOrEdit: 'E',
        quotationRiskCode: this.quotationRiskCode,
        riskSections: limitsToSave.map(value => ({
          ...value,
          quotationCode: Number(this.quotationCode),
          quotRiskCode: this.quotationRiskCode
        }))
      };

      this.sectionDetails[index] = { ...this.sectionDetails[index], ...section };
      this.sectionDetails = [...this.sectionDetails]; // Trigger change detection

      // Log the updated section
      log.debug("Updated section:", this.sectionDetails[index]);

      // Send the updated section to the service
      this.quotationService.createRiskLimits(limitsPayLoad).subscribe((data) => {
        try {

          // sessionStorage.setItem('limitAmount', section.limitAmount);
          // const sumInsured = section.limitAmount;
          // log.debug("Sum Insured Risk Details:", sumInsured);

          // Reset the form and selected section
          this.sectionDetailsForm.reset();
          this.selectedSection = null;
          this.quotationCode && this.fetchQuotationDetails(this.quotationCode)


          this.globalMessagingService.displaySuccessMessage('Success', 'Section Updated');
        } catch (error) {
          log.error("Error updating section:", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
          this.sectionDetailsForm.reset();
        }
      });
    } else {
      console.error('Selected section not found in the sections array.');
      this.globalMessagingService.displayErrorMessage('Error', 'Selected section not found');
    }
  }

  loadSectionPremium(binderCode: number, subclassCode: number, coverTypeCode: number) {
    const passedSubclassCode = subclassCode || this.selectedSubclassCode || sessionStorage.getItem('selectedSubclassCode');
    const passedBinderCode = binderCode || this.selectedBinderCode || this.defaultBinder?.[0]?.code;
    const passedCoverTypeCode = coverTypeCode || this.selectedCoverType?.coverTypeCode;
    log.debug({ passedSubclassCode, passedBinderCode, passedCoverTypeCode });
    if (passedSubclassCode && passedBinderCode && passedCoverTypeCode) {
      this.premiumRateService.getCoverTypePremiums(passedSubclassCode, passedBinderCode, passedCoverTypeCode).subscribe({
        next: (result: any[]) => {
          // Apply the same filtering and mapping logic
          const sectionPremiums = result
            .filter(premium => !this.sectionDetails.some(detail => detail.sectionCode === premium.sectionCode))
            .map(premium => {
              if (premium.isMandatory === 'Y') {
                return {
                  ...premium,
                  limitAmount: this.sumInsured
                };
              }
              return premium;
            });

          this.sectionPremium = sectionPremiums;
          log.debug("Section premium reloaded after delete", this.sectionPremium);
        },
        error: (error) => {
          log.debug("Error reloading section premium", error);
        }
      });
    }
  }


  deleteRiskSection(riskSectionCode: number) {
    log.debug("selected risk section code", riskSectionCode);

    if (riskSectionCode) {
      this.quotationService.deleteRiskSections(riskSectionCode).subscribe({
        next: (response: any) => {
          log.debug("Response after deleting a risk section ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk section deleted successfully');
          log.debug("SELECTED RISK", this.selectedRisk)
          const binderCode = this.selectedRisk?.binderCode
          const subclassCode = this.selectedRisk?.subclassCode
          const coverTypeCode = this.selectedRisk?.coverTypeCode

          // ✅ filter by code
          this.sectionDetails = this.sectionDetails.filter(
            (section) => section.code !== this.sectionToDelete.code
          );

          this.loadSectionPremium(binderCode, subclassCode, coverTypeCode);

          this.sectionToDelete = null;
        },
        error: (error) => {
          log.debug("error when deleting a risk section", error);
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
    }
  }


  onResize(event: any) {
    this.modalHeight = event.height;
  }
  toggleClausesopen() {
    this.isClausesOpen = !this.isClausesOpen;
  }


  //risk clauses
  saveClauseColumnsToSession(): void {
    if (this.clauseColumns) {
      const visibility = this.clauseColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('clauseColumns', JSON.stringify(visibility));
    }
  }

  toggleClauseColumnVisibility(field: string) {
    this.saveClauseColumnsToSession();
  }


  toggleClauseColumns(iconElement: HTMLElement): void {
    this.showClauses = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showClauseColumnModal = true;
  }
  setClauseColumns(clause: Clause) {
    const excludedFields = [
    ];

    this.clauseColumns = Object.keys(clause)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisibleClauseFields.includes(key),
        filterable: true,
        sortable: true
      }));

    this.clauseColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    const saved = sessionStorage.getItem('clauseColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.clauseColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    // log.debug("clauseColumns", this.clauseColumns);
  }

  defaultVisibleClauseFields = ['shortDescription', 'heading', 'wording'];

  loadAddedClauses(): void {
    const riskCode = this.selectedRiskCode;
    if (!riskCode) return;

    this.quotationService.getAddedRiskClauses(riskCode).subscribe({
      next: (res) => {
        this.sessionClauses = res?._embedded || res || [];
      },
      error: (err) => {
        log.debug('Error fetching risk clauses', err);
      }
    });
  }

  loadSubclassClauses(code: any) {
    if (!code) {
      log.debug("Missing subclass code");
      return;
    }

    this.subclassService.getSubclassClauses(code).subscribe({
      next: (data) => {
        this.SubclauseList = data || [];

        // log.debug('subclass ClauseList#####', this.SubclauseList);
        this.mandatoryClause = this.SubclauseList.filter(clause => clause.isMandatory === 'Y');
        this.nonMandatoryClauses = this.SubclauseList.filter(clause => clause.isMandatory === 'N');
        // log.debug('selected subclass ClauseList#####', this.mandatoryClause);
        // log.debug('Non mandatory  subclass ClauseList#####', this.nonMandatoryClauses);

        this.SubclauseList.forEach(clause => {
          clause.checked = clause.isMandatory === 'Y';
        });
      },
      error: (err) => {
        console.error('Failed to load subclass clauses:', err);
        this.SubclauseList = [];
      },
      complete: () => {
        console.log('Subclass clause loading complete');
      }
    });
  }

  private fetchAndCacheSubclassClauses(code: string): void {
    this.subclassService.getSubclassClauses(code).subscribe({
      next: (data) => {
        this.SubclauseList = data || [];
        this.mandatoryClause = this.SubclauseList.filter(c => c.isMandatory === 'Y');
        this.nonMandatoryClauses = this.SubclauseList.filter(c => c.isMandatory === 'N');
        this.riskClause = [...this.mandatoryClause];
        this.sessionClauses = [...this.riskClause];

        const quotationCode = Number(sessionStorage.getItem("quotationCode"));
        const riskCode = Number(this.selectedRiskCode);

        this.mandatoryClause.forEach(clause => {
          const payload: riskClause = {
            clauseCode: clause.clauseCode,
            clauseShortDescription: clause.shortDescription ?? '',
            quotationCode,
            riskCode,
            clause: clause.wording?.trim() ?? '',
            clauseEditable: clause.isEditable ?? 'N',
            clauseType: clause.clauseType ?? 'CL',
            clauseHeading: clause.heading ?? ''
          };

          this.quotationService.addRiskClause(payload).subscribe({
            next: () => log.debug("Mandatory clause persisted:", clause.shortDescription),
            error: (err) => log.debug("Clause may already exist or failed to add:", err)
          });
        });

        this.saveRiskClausesToSession();

        if (this.sessionClauses.length > 0) {
          this.setClauseColumns(this.sessionClauses[0]);
        }
      },
      error: (err) => {
        log.debug("Error fetching subclass clauses:", err);
        this.SubclauseList = [];
      }
    });
  }

  private saveRiskClausesToSession(): void {
    const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");

    if (this.selectedRiskCode) {
      riskClauseMap[this.selectedRiskCode] = {
        riskClause: this.riskClause,
        nonMandatoryClauses: this.nonMandatoryClauses,
        clauseModified: this.clauseModified
      };

      sessionStorage.setItem("riskClauseMap", JSON.stringify(riskClauseMap));
      sessionStorage.setItem("selectedRiskCode", this.selectedRiskCode);
    }
  }

  toggleRiskClauses() {
    this.showRiskClauses = !this.showRiskClauses;
  }

  openClauseModal() {
    const storedRiskCode = sessionStorage.getItem("selectedRiskCode");

    if (storedRiskCode) {
      if ((!this.clauses || this.clauses.length === 0) && !this.clausesModified) {
        this.selectedRiskCode = storedRiskCode;
        this.loadPersistedRiskClauses();
      }

      this.showClauseModal = true;
      const modalElement = document.getElementById('addClause');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      this.globalMessagingService.displayErrorMessage('warning', 'Select a risk to proceed');
    }
  }

  private loadPersistedRiskClauses(): void {
    const storedRiskCode = sessionStorage.getItem("selectedRiskCode");
    const riskClauseMap = JSON.parse(sessionStorage.getItem("riskClauseMap") || "{}");

    if (storedRiskCode && riskClauseMap[storedRiskCode]) {
      const sessionData = riskClauseMap[storedRiskCode];
      this.selectedRiskCode = storedRiskCode;

      this.riskClause = sessionData.riskClause || [];
      this.nonMandatoryClauses = sessionData.nonMandatoryClauses || [];
      this.clauseModified = sessionData.clauseModified || false;
      this.sessionClauses = [...this.riskClause];

      if (this.sessionClauses.length > 0) {
        this.setClauseColumns(this.sessionClauses[0]);
      }
    } else {
      log.debug("No persisted data found. Fetching from API...");
      this.fetchAndCacheSubclassClauses(this.selectedSubclassCode);
    }
  }

  addRiskClauses(): void {
    if (this.selectedRiskClauses?.length) {
      this.riskClause = [...this.selectedRiskClauses, ...this.riskClause];
      this.sessionClauses = [...this.riskClause];

      this.nonMandatoryClauses = this.nonMandatoryClauses.filter(
        clause => !this.selectedRiskClauses.some(sel => sel.shortDescription === clause.shortDescription)
      );

      this.clauseModified = true;
      this.saveRiskClausesToSession();

      const quotationCode = Number(sessionStorage.getItem("quotationCode"));
      const riskCode = Number(this.selectedRiskCode);
      const combinedClauses = [...this.selectedRiskClauses];

      let successCount = 0, failureCount = 0;

      combinedClauses.forEach(clause => {
        const payload: riskClause = {
          clauseCode: clause.clauseCode,
          clauseShortDescription: clause.shortDescription,
          quotationCode,
          riskCode,
          clause: clause.wording,
          clauseEditable: clause.isEditable,
          clauseType: clause.clauseType,
          clauseHeading: clause.heading
        };

        this.quotationService.addRiskClause(payload).subscribe({
          next: () => {
            successCount++;
            if (successCount + failureCount === combinedClauses.length) {
              this.globalMessagingService.displaySuccessMessage("Success", 'risk clause(s) added successfully');
            }
          },
          error: (err) => {
            failureCount++;
            log.error(`Failed to add clause ${clause.clauseCode}:`, err);
            if (successCount + failureCount === combinedClauses.length) {
              this.globalMessagingService.displayErrorMessage("Error", `${failureCount} clause(s) failed to save`);
            }
          }
        });
      });

      this.selectedRiskClauses = [];
    }
  }


  //edit clause
  wasModified(): boolean {
    if (!this.selectedRiskClause || !this.originalClauseBeforeEdit) return false;

    const newWording = this.selectedRiskClause.wording?.trim();
    const oldWording = this.originalClauseBeforeEdit.wording?.trim();

    return newWording !== oldWording && newWording.length > 0;
  }

  populateEditClauseModal(clause: any) {
    this.selectedRiskClause = { ...clause };
    this.originalClauseBeforeEdit = { ...clause };
  }

  editRiskClause(): void {
    if (!this.selectedRiskClause || !this.wasModified()) return;

    const quotationCode = Number(sessionStorage.getItem("quotationCode"));
    const riskCode = Number(this.selectedRiskCode);

    const payload: riskClause = {
      clauseCode: this.selectedRiskClause.clauseCode,
      clauseShortDescription: this.selectedRiskClause.shortDescription ?? '',
      quotationCode,
      riskCode,
      clause: this.selectedRiskClause.wording?.trim() ?? '',
      clauseEditable: this.selectedRiskClause.isEditable ?? 'N',
      clauseType: this.selectedRiskClause.clauseType ?? 'CL',
      clauseHeading: this.selectedRiskClause.heading ?? ''
    };

    this.quotationService.editRiskClause(payload).subscribe({
      next: () => {
        const replaceClause = (list: any[]) =>
          list.map(c => c.shortDescription === this.selectedRiskClause.shortDescription
            ? { ...this.selectedRiskClause }
            : c
          );

        this.sessionClauses = replaceClause(this.sessionClauses);
        this.riskClause = replaceClause(this.riskClause);

        this.clauseModified = true;
        this.saveRiskClausesToSession();

        this.selectedRiskClause = { id: '', heading: '', wording: '' };
        this.originalClauseBeforeEdit = null;

        this.globalMessagingService.displaySuccessMessage('Success', 'Clause edited successfully');
      },
      error: (err) => {
        log.debug("Failed to edit clause:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to update clause');
      }
    });
  }


  //delete risk clause
  prepareDeleteClause(clause: any) {
    this.clauseToDelete = clause;
  }

  deleteRiskClause(): void {
    if (!this.clauseToDelete) return;

    const clauseCode = this.clauseToDelete.clauseCode;
    const riskCode = Number(this.selectedRiskCode);

    this.quotationService.deleteRiskClause(clauseCode, riskCode).subscribe({
      next: () => {
        this.sessionClauses = this.sessionClauses.filter(
          c => c.shortDescription !== this.clauseToDelete.shortDescription
        );
        this.riskClause = this.riskClause.filter(
          c => c.shortDescription !== this.clauseToDelete.shortDescription
        );
        this.nonMandatoryClauses = [...this.nonMandatoryClauses, this.clauseToDelete];

        this.clauseModified = true;
        this.saveRiskClausesToSession();

        this.globalMessagingService.displaySuccessMessage('Success', 'Clause deleted successfully');
        this.clauseToDelete = null;
      },
      error: (err) => {
        log.debug("Failed to delete clause:", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete clause');
      }
    });
  }


  onClauseSelectionChange(selectedClauseList: any) {
    if (selectedClauseList.checked) {
      if (!this.selectedClause.includes(selectedClauseList)) {
        this.selectedClause.push(selectedClauseList);
      }
    } else {
      if (selectedClauseList.isMandatory !== 'Y') {
        this.selectedClause = this.selectedClause.filter(item => item.clauseCode !== selectedClauseList.clauseCode);
      }
    }
    log.debug("Selected  Risk clause:", this.selectedClause)

  }


  // onRiskEdit(risk: any) {
  //   this.selectedRisk = risk;
  //   const binderList = JSON.parse(sessionStorage.getItem('binderList'));

  //   const selectedVehicleMake = JSON.parse(sessionStorage.getItem('selectedVehicleMake'));
  //   const selectedVehicleModel = JSON.parse(sessionStorage.getItem('selectedVehicleModel'));
  //   const patchData = {

  //     propertyId: risk.propertyId ?? '', // Assuming propertyId is a form field in the HTML
  //     itemDesc: risk.itemDesc ?? '', // Assuming itemDesc is a form field in the HTML
  //     coverTypeDescription: risk.coverTypeDescription ?? '', // Assuming coverTypeDescription is in the HTML
  //     // binderCode: risk.binderCode ?? null, // Assuming binderCode is in the HTML
  //     wef: risk.wef ? new Date(risk.wef) : '', // Assuming wef is part of the form
  //     wet: risk.wet ? new Date(risk.wet) : '' // Assuming wet is part of the form
  //   };

  //   // Patch only the fields that are in the form
  //   const subClassCodeToUse = risk.subclassCode
  //   const selectedSubclass = this.allMatchingSubclasses.find(subclass => subclass.code === subClassCodeToUse);
  //   if (selectedSubclass) {
  //     // Patch the form with the selected subclass
  //     this.editRiskDetailsForm.patchValue({ subclassCode: selectedSubclass });
  //   }
  //   const binderCodeToUse = risk.binderCode
  //   const selectedBinder = this.binderListDetails.find(binder => binder.code === binderCodeToUse);

  //   if (binderCodeToUse) {
  //     this.editRiskDetailsForm.patchValue({ binderCode: selectedBinder });
  //   }
  //   this.editRiskDetailsForm.patchValue({ vehicleMake: selectedVehicleMake });
  //   this.editRiskDetailsForm.patchValue({ vehicleModel: selectedVehicleModel });


  //   this.editRiskDetailsForm.patchValue(patchData);

  //   log.info("Patched Risk", patchData);
  //   log.info("Patched Risk whole", this.editRiskDetailsForm.value);
  // }

  // updateRiskDetails() {
  //   const quotationCode = this.selectedRisk.quotationCode
  //   log.debug("quotation code:", quotationCode)

  //   log.debug("Currency code-quote creation", this.editRiskDetailsForm.value.propertyId)
  //   log.debug("Selected Cover", this.editRiskDetailsForm.value.coverTypeDescription)
  //   log.debug("ITEM DESC:", this.editRiskDetailsForm.value.itemDesc)
  //   const formattedCoverFromDate = this.formatDate(new Date(this.passedCoverFromDate));
  //   const formattedCoverToDate = this.formatDate(new Date(this.passedCoverToDate));
  //   const FormCoverFrom = this.formatDate(this.editRiskDetailsForm.value.wef)
  //   const FormCoverTo = this.formatDate(new Date(this.editRiskDetailsForm.value.wet))
  //   log.debug(`API Cover From: ${formattedCoverFromDate}, API Cover To: ${formattedCoverToDate}`);
  //   log.debug(`Form Cover From: ${FormCoverFrom}, Form Cover To: ${FormCoverTo}`);

  //   // Determine the action based on whether riskInformation has a code
  //   const existingRisk = this.quotationDetails.quotationProducts[0]?.riskInformation;
  //   log.debug("existing risk", existingRisk);

  //   // const coverTypeSections = this.riskLevelPremiums
  //   //   .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
  //   //   .map(section => section.limitPremiumDtos).flat()

  //   // let risk = {
  //   //   coverTypeCode: this.selectedCoverType.coverTypeCode,
  //   //   action: "E", // Set action to "A" (Add) or "E" (Edit) based on the condition
  //   //   quotationCode: JSON.parse(this.quotationCode),
  //   //   code: this.selectedRisk.code,
  //   //   productCode: this.selectedProductCode,
  //   //   propertyId: this.editRiskDetailsForm.value.propertyId,
  //   //   // value: this.sumInsuredValue, // TODO attach this to individual risk
  //   //   coverTypeShortDescription: this.selectedCoverType.coverTypeShortDescription,
  //   //   // premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
  //   //   premium: existingRisk?.[0] ? existingRisk[0].premium : null,
  //   //   subclassCode: this.selectedSubclassCode,
  //   //   itemDesc: this.editRiskDetailsForm.value.itemDesc || this.vehiclemakeModel,
  //   //   binderCode: this.selectedBinderCode || this.defaultBinder[0].code,
  //   //   wef: FormCoverFrom || formattedCoverFromDate,
  //   //   wet: FormCoverTo || formattedCoverToDate,
  //   //   prpCode: this.insuredCode,
  //   //   quotationProductCode: this.selectedRisk.quotationProductCode,
  //   //   coverTypeDescription: this.selectedCoverType.description,


  //   //   taxComputation: this.taxList.map(tax => ({
  //   //     code: tax.code,
  //   //     premium: tax.premium
  //   //   })),
  //   //   // ✅ Now adding the **missing required fields** from your interface
  //   //   insuredCode: this.insuredCode,
  //   //   location: this.selectedRisk.location,
  //   //   town: this.selectedRisk.town,
  //   //   ncdLevel: this.selectedRisk.ncdLevel,
  //   //   quotationRevisionNumber: this.selectedRisk.quotationRevisionNumber,
  //   //   quotationRiskNo: this.selectedRisk.quotationRiskNo, // or generate one if needed
  //   //   value: this.selectedRisk.value || 0,
  //   //   commissionRate: this.selectedRisk.commissionRate || 0,
  //   //   commissionAmount: this.selectedRisk.commissionAmount || 0,
  //   //   clientShortDescription: this.selectedRisk.clientShortDescription || '',
  //   //   annualPremium: this.selectedRisk.annualPremium || 0,
  //   //   coverDays: this.selectedRisk.coverDays || 0,
  //   //   clientType: this.selectedRisk.clientType || '',
  //   //   prospectCode: this.selectedRisk.prospectCode || 0,
  //   //   vehicleModel: this.editRiskDetailsForm.value.vehicleModel,
  //   //   vehicleMake: this.editRiskDetailsForm.value.vehicleMake,
  //   // }
  //   const riskPayload = []
  //   this.quotationService.createQuotationRisk(quotationCode, riskPayload).pipe(

  //   ).subscribe({
  //     next: (data: any) => {
  //       const response = data._embedded;
  //       log.debug("Response after updating risk", response);
  //       this.fetchQuotationDetails(this.selectedProduct.quotationNo)
  //     },
  //     error: error => {
  //       this.globalMessagingService.displayErrorMessage('Error', error.error.message);
  //     }
  //   });

  // }

  openRiskDeleteModal() {
    log.debug("Selected Risk  to delete", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a risk to continue');
    } else {
      document.getElementById("openRiskModalButtonDelete").click();
    }
  }

  deleteRisk() {
    log.debug("Selected Risk to be deleted", this.selectedRisk)
    if (this.selectedRisk) {
      this.quotationService
        .deleteDetailedQuotationRisk(Number(this.selectedRisk.code))
        .pipe(untilDestroyed(this))
        .subscribe({
          next: (response: any) => {
            log.debug("Response after deleting a risk ", response);
            this.globalMessagingService.displaySuccessMessage('Success', 'Risk deleted successfully');

            // Remove the deleted risk from the riskDetails array
            // const index = this.riskDetails.findIndex(risk => risk.code === this.selectedRisk.code);
            // if (index !== -1) {
            //   this.riskDetails.splice(index, 1);
            // }
            this.scheduleList = []
            this.sectionPremium = []
            this.sessionClauses = []
            this.addedLimitsOfLiability = []

            this.fetchQuotationDetails(this.selectedRisk.quotationCode)
            this.cdr.detectChanges()
            // Clear the selected risk
            this.selectedRisk = null;

          },
          error: (error) => {

            this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete risk. Try again later');
          }
        });
    }

  }

  validateCarRegNo() {
    const control = this.riskDetailsForm.get('registrationNumber') as FormControl;
    log.debug("Keyed In value>>>", control);
    const input = event.target as HTMLInputElement;
    log.debug("Keyed In value event>>>", input);

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
      withEffectFrom: "2024-01-01",
      withEffectTo: "2024-01-01",
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
  transformToUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperCaseValue = input.value.toUpperCase();
    log.debug("RISK FORM VALUE", this.riskDetailsForm)
    const control = this.riskDetailsForm.get('registrationNumber') as FormControl;

    if (!control) {
      console.warn('Could not find control for carRegNo at given indexes');
      return;
    }

    log.debug("Keyed In value>>>", control.value);

    control.setValue(upperCaseValue, { emitEvent: false });
  }
  getCarRegNoControl(): FormControl {
    return this.riskDetailsForm.get('registrationNumber') as FormControl;

  }

  toggleSelectAlls(event: any) {
    // this.clauseList.forEach(clause => (clause.isChecked = this.selectAll));
  }

  openAddSectionModal(): void {

    if (!this.selectedRisk || !this.selectedRisk.code) {
      this.globalMessagingService.displayErrorMessage(
        'No Risk Selected',
        'Please select a risk before adding a section.'
      );
      return;
    }

    // const modal = document.getElementById('addRiskSection');
    // if (modal) {
    //   const bootstrapModal = new bootstrap.Modal(modal);
    //   bootstrapModal.show();
    // }

    const modalElement = document.getElementById('addRiskSection');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  // fetchYearOfManufacture() {
  //   this.productService.getYearOfManufacture()
  //     .subscribe({
  //       next: (modelYear) => {
  //         const model = modelYear._embedded
  //         this.yearList = model[0]["List of cover years"]
  //         log.debug("YEAR LIST", this.yearList)

  //       },
  //       error: (error: HttpErrorResponse) => {
  //         log.debug("Error log", error.error.message);

  //         this.globalMessagingService.displayErrorMessage(
  //           'Error',
  //           error.error.message
  //         );
  //       },

  //     })

  // }
  fetchYearOfManufacture() {
    this.productService.getYearOfManufacture().subscribe({
      next: (modelYear) => {
        const model = modelYear._embedded;
        const rawYears = model[0]["List of cover years"];

        // ✅ Map raw numbers to label/value objects for p-dropdown filtering
        this.yearList = rawYears.map((year: number) => ({
          label: year.toString(),
          value: year
        }));

        log.debug("YEAR LIST", this.yearList);
      },
      error: (error: HttpErrorResponse) => {
        log.debug("Error log", error.error.message);
        this.globalMessagingService.displayErrorMessage(
          'Error',
          error.error.message
        );
      },
    });
  }

  handleSelectChange(fieldName: string, event: any): void {
    switch (fieldName) {
      case 'vehicleMake':
        this.onVehicleMakeSelected(event);
        break;
      case 'vehicleModel':
        this.onVehicleModelSelected(event);
        break;
      // Add more cases if needed
    }
  }
  createScheduleL1(riskCode: number) {
    // Prepare schedule payload
    const schedulePayload = this.prepareSchedulePayload();
    log.debug("Schedule payload:", schedulePayload)
    this.quotationService.createSchedule(schedulePayload)
      .subscribe({
        next: (createdSchedule) => {
          this.scheduleData = createdSchedule;
          this.scheduleList = this.scheduleData._embedded;
          log.debug("Schedule List:", this.scheduleList);

          this.selectedSubclassObject = this.allMatchingSubclasses?.find(subclass => subclass.code == this.selectedSubclassCode)
          const screenCode = this.selectedSubclassObject.underwritingScreenCode
          this.quotationService.getScheduleLevels(screenCode).subscribe({
            next: (scheduleLevels) => {
              this.scheduleLevels = scheduleLevels?._embedded || [];
              const sortedLevels = this.scheduleLevels.sort((a, b) => a.levelNumber - b.levelNumber);
              // Set the tab labels
              this.scheduleTabs = sortedLevels
                .sort((a, b) => a.levelNumber - b.levelNumber)
                .map(level => ({
                  levelNumber: level.levelNumber,
                  levelName: level.levelName,
                }));
              log.debug("Schedule Tabs:", this.scheduleTabs)
              // Set the first tab as the active one by default
              this.activeTab = this.scheduleTabs[0];
              this.levelTableColumnsMap = {};
              this.levelDataMap = {};
              // Define preferred columns for Level 1
              const level1PreferredColumns = [
                { field: 'registrationNumber', header: 'Registration Number' },
                { field: 'vehicleMake', header: 'Make' },
                { field: 'cubicCapacity', header: 'Cubic Capacity' },
                { field: 'yearOfManufacture', header: 'Year Of Manufacture' },
                { field: 'seatingCapacity', header: 'Seating Capacity' },
                { field: 'value', header: 'Value' },
                { field: 'bodyType', header: 'Body Type' },
                { field: 'coverType', header: 'Cover Type' }
              ];

              // Go through each level and extract relevant fields
              sortedLevels.forEach(level => {
                const levelName = level.levelName;
                const levelNumber = level.levelNumber;
                const levelKey = `level${levelNumber}`; // e.g., level2

                // 1. Determine if motor class is allowed
                const isMotorClassAllowed = this.motorClassAllowed === 'Y';

                // 2. Define columns
                let columns;

                if (levelNumber === 1 && isMotorClassAllowed) {
                  // Use preferred columns for level 1 if motorClassAllowed
                  columns = level1PreferredColumns;
                } else {
                  // Dynamically generate columns from subclass form fields
                  // columns = this.dynamicSubclassFormFields
                  //   .filter(field => Number(field.scheduleLevel) === levelNumber)
                  //   .map(field => ({
                  //     field: field.name,
                  //     header: field.label
                  //   }));
                  columns = this.dynamicSubclassFormFields
                    .filter(
                      field =>
                        Number(field.scheduleLevel) === levelNumber &&
                        field.applicableLevel === 'S'
                    )
                    .map(field => ({
                      field: field.name,
                      header: field.label
                    }));

                  log.debug("ScheduleColumns:Create Schedule", columns)
                  // Add "Actions" column for levels 2 and above
                  if (levelNumber >= 2) {
                    columns.push({
                      field: 'actions',
                      header: 'Actions',
                      isAction: true, // helps in template logic
                    });
                  }
                }

                this.levelTableColumnsMap[levelName] = columns;
                log.debug('LEVEL TABLE COLUMN:', this.levelTableColumnsMap);

                // 3. Map level-specific data and attach original schedule
                const levelData = (this.scheduleList || [])
                  .filter(schedule => !!schedule[0].details?.[levelKey])
                  .map(schedule => ({
                    ...schedule[0].details[levelKey],
                    __originalSchedule: schedule
                  }));

                this.levelDataMap[levelName] = this.normalizeOtherDetailsData(levelData);
                log.debug('LEVEL COLUMN DATA:', this.levelDataMap);
              });

            },
            error: (error: HttpErrorResponse) => {
              log.debug("Error log", error.error.message);

              this.globalMessagingService.displayErrorMessage(
                'Error',
                error.error.message
              );
            },
          })
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule created successfully');
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }
  getProductClausesPayload(): any[] {
    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    const payload: any[] = [];

    Object.keys(allClausesMap).forEach(productCode => {
      const productData = allClausesMap[productCode];
      const clauses = productData.productClause || [];

      const productClauseList = clauses.map(clause => ({
        clauseWording: clause.wording || '',
        clauseHeading: clause.heading || '',
        clauseCode: clause.code || 0,
        clauseType: clause.type || '',
        clauseEditable: clause.isEditable || 'Y',
        clauseShortDescription: clause.shortDescription || ''
      }));

      payload.push({
        quotationCode: this.selectedProduct?.quotationCode || 0,
        productCode: this.selectedProduct?.productCode || 0,
        productClauses: productClauseList
      });
    });

    return payload;
  }
  addProductClauses() {
    const clausePayload = this.getProductClausesPayload();
    this.quotationService.addProductClause(clausePayload)
      .subscribe({
        next: (response) => {

          log.debug("Response after adding product Clause:", response);
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }
  clearRiskForm() {
    if (this.isAddMode) {
      log.debug('FORM CLEARED')
      // const keysToKeep = ['insureds', 'subclass'];

      // // Save values of keys to keep
      // const keptValues: any = {};
      // keysToKeep.forEach(key => {
      //   keptValues[key] = this.riskDetailsForm.get(key)?.value;
      // });

      // // Remove all controls
      // Object.keys(this.riskDetailsForm.controls).forEach(controlName => {
      //   this.riskDetailsForm.removeControl(controlName);
      // });

      // // Re-add only the kept controls with their previous values
      // this.formData.forEach(field => {
      //   if (keysToKeep.includes(field.name)) {
      //     this.riskDetailsForm.addControl(
      //       field.name,
      //       new FormControl(keptValues[field.name])
      //     );
      //   }
      // });

      // Remove dynamic fields from UI backing arrays
      this.subclassFormData = [];
    }

  }
  //
  getButtonLabel(levelNumber: number): string {
    return levelNumber === 2 ? 'Motor Details' : 'Other Details';
  }
  setRiskTab(tab: string): void {
    // Prevent switching to commissions tab if agent source is not selected
    if (tab === 'commissions' && this.isCommissionsButtonDisabled) {
      return;
    }

    this.riskActiveTab = tab;
  }


  //limits of liability
  saveLimitsOfLiabilityColumnsToSession(): void {
    if (this.limitsOfLiabilityColumns && this.selectedRiskCode) {
      const visibility = this.limitsOfLiabilityColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      const key = `limitsOfLiabilityColumns_${this.selectedRiskCode}`;
      sessionStorage.setItem(key, JSON.stringify(visibility));
    }
  }

  toggleLimitsColumnVisibility(field: string) {
    this.saveLimitsOfLiabilityColumnsToSession();
  }


  toggleLimitsOfLiabilityColumns(iconElement: HTMLElement): void {
    this.showLimitsOfLiability = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showLimitsOfLiabilityColumnModal = true;
  }

  setLimitsOfLiabilityColumns(limits: any) {
    const excludedFields = [];
    this.limitsOfLiabilityColumns = Object.keys(limits)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisibleLimitsOfLiabilityFields.includes(key),
        filterable: true,
        sortable: true
      }));

    this.limitsOfLiabilityColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    // Restore per-risk columns
    if (this.selectedRiskCode) {
      const saved = sessionStorage.getItem(`limitsOfLiabilityColumns_${this.selectedRiskCode}`);
      if (saved) {
        const savedVisibility = JSON.parse(saved);
        this.limitsOfLiabilityColumns.forEach(col => {
          const savedCol = savedVisibility.find((s: any) => s.field === col.field);
          if (savedCol) col.visible = savedCol.visible;
        });
      }
    }
  }


  defaultVisibleLimitsOfLiabilityFields = ['narration', 'value'];

  loadLimitsOfLiability(): void {
    if (!this.selectedSubclassCode || !this.selectedRiskCode) {
      log.debug('Subclass code is required to load limits');
      return;
    }

    const cacheKey = `limits_of_liability_${this.selectedRiskCode}`;
    const originalCacheKey = `original_limits_of_liability_${this.selectedRiskCode}`;

    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedOriginal = sessionStorage.getItem(originalCacheKey);

    // if (cachedData && cachedOriginal) {
    //   this.limitsOfLiability = JSON.parse(cachedData);
    //   this.originalLimitsOfLiability = JSON.parse(cachedOriginal);

    //   // if (this.originalLimitsOfLiability.length > 0) {
    //   //   this.setLimitsOfLiabilityColumns(this.originalLimitsOfLiability[0]);
    //   // }

    //   log.debug(`Loaded limits of liability for subclass ${this.selectedRiskCode} from sessionStorage`);
    //   return;
    // }
    if (cachedData && cachedOriginal) {
      const parsedData = JSON.parse(cachedData);
      const parsedOriginal = JSON.parse(cachedOriginal);

      if (parsedData.length > 0 && parsedOriginal.length > 0) {
        this.limitsOfLiability = parsedData;
        this.originalLimitsOfLiability = parsedOriginal;
        log.debug(`Loaded limits of liability for subclass ${this.selectedRiskCode} from sessionStorage`);

        return;
      }
    }


    this.quotationService.getLimitsOfLiability(this.selectedSubclassCode, 'L').subscribe({
      next: (response) => {
        const limits = response || [];

        this.originalLimitsOfLiability = [...limits];
        sessionStorage.setItem(originalCacheKey, JSON.stringify(this.originalLimitsOfLiability));

        this.limitsOfLiability = [...limits];
        sessionStorage.setItem(cacheKey, JSON.stringify(this.limitsOfLiability));

        // if (this.originalLimitsOfLiability.length > 0) {
        //   this.setLimitsOfLiabilityColumns(this.originalLimitsOfLiability[0]);
        // }

        log.debug(`Fetched and stored limits for subclass ${this.selectedSubclassCode}`);
      },
      error: (err) => {
        log.debug(`Failed to fetch limits for subclass ${this.selectedSubclassCode}:`, err);
        this.limitsOfLiability = [];
      }
    });
  }


  openLimitModal(): void {
    if (!this.selectedSubclassCode || !this.selectedRiskCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select or add risk to proceed');
      log.debug("selectedSubclassCode does not exist", this.selectedSubclassCode)
      return;
    }

    this.showLimitModal = true;
    this.loadLimitsOfLiability();


    const modalElement = document.getElementById('addLimit');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }


  loadAddedLimitsOfLiability(): void {
    log.debug("Selected SUBCLASS CODE:", this.selectedSubclassCode)
    log.debug("Selected quote product code:", this.quoteProductCode)

    if (!this.selectedSubclassCode || !this.quoteProductCode) {
      return;
    }
    this.fetchAddedLimitsOfLiability();
    // const addedCacheKey = `added_limits_of_liability_${this.selectedRiskCode}`;
    // const cachedAddedData = sessionStorage.getItem(addedCacheKey);
    // log.debug("cachedAddedData", cachedAddedData)

    // if (cachedAddedData.length > 0) {
    //   try {
    //     this.addedLimitsOfLiability = JSON.parse(cachedAddedData);
    //     log.debug(`Added limits loaded from cache for subclass ${this.selectedRiskCode}`);
    //     log.debug("ADDED LIMITS OF LIABILITY", this.addedLimitsOfLiability)

    //     return;
    //   } catch (error) {
    //     log.debug('Error parsing cached added limits, fetching fresh data:', error);
    //     sessionStorage.removeItem(addedCacheKey);
    //   }
    // } else {
    //   this.fetchAddedLimitsOfLiability();
    // }


  }


  addRiskLimit(): void {
    log.debug("selectedRisk", this.selectedRiskLimits)
    if (!this.selectedRiskLimits?.length) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please select at least one limit to add');
      return;
    }

    const newQpCode = this.quoteProductCode;
    const subclassCode = this.selectedRisk?.subclassCode || this.selectedSubclassCode;

    if (!subclassCode || !newQpCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Missing required information');
      return;
    }

    const limitsPayload: CreateLimitsOfLiability[] = this.selectedRiskLimits.map(limit => ({
      // code:limit.code,
      scheduleValueCode: limit.code,
      value: this.cleanCurrencyValue(limit.value),
      narration: limit.narration,
      type: 'L'
    }));

    this.quotationService.addLimitsOfLiability(newQpCode, limitsPayload).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Limits of liability added successfully');

        this.limitsOfLiability = this.limitsOfLiability.filter(
          limit => !this.selectedRiskLimits.some(selected => selected.code === limit.code)
        );

        const cacheKey = `limits_of_liability_${this.selectedRiskCode}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(this.limitsOfLiability));

        this.selectedRiskLimits = [];
        this.fetchAddedLimitsOfLiability();
      },
      error: (err) => {
        log.debug('Error adding limits of liability', err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add limits of liability');
      }
    });
  }


  //edit
  populateEditLimitModal(limit: any): void {
    this.selectedLimit = { ...limit };
    this.originalLimitBeforeEdit = { ...limit };
  }

  wasLimitModified(): boolean {
    if (!this.selectedLimit || !this.originalLimitBeforeEdit) return false;

    const newNarration = this.selectedLimit.narration?.trim() ?? '';
    const oldNarration = this.originalLimitBeforeEdit.narration?.trim() ?? '';
    const newValue = this.selectedLimit.value;
    const oldValue = this.originalLimitBeforeEdit.value;

    return (newNarration !== oldNarration && newNarration.length > 0) || newValue !== oldValue;
  }

  editLimit(): void {
    const newQpCode = this.quoteProductCode;

    if (!newQpCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Quote product code is missing');
      return;
    }

    if (!this.selectedLimit) {
      this.globalMessagingService.displayErrorMessage('Error', 'No limit selected for editing');
      return;
    }

    if (!this.wasLimitModified()) {
      this.globalMessagingService.displayInfoMessage('Info', 'No changes detected in the limit');
      return;
    }

    const payload = [
      {
        code: this.selectedLimit.code,
        scheduleValueCode: this.selectedLimit.quotationValueCode,
        value: this.cleanCurrencyValue(this.selectedLimit.value),
        narration: this.selectedLimit.narration?.trim(),
        type: 'L'
      }
    ];

    this.quotationService.editLimitsOfLiability(newQpCode, payload).subscribe({
      next: (res) => {
        res && this.globalMessagingService.displaySuccessMessage('Success', 'Limit updated successfully');
        this.quotationService.getAddedLimitsOfLiability(this.selectedSubclassCode, newQpCode, 'L')
          .subscribe({
            next: (res) => {
              this.addedLimitsOfLiability = res._embedded ? [...res._embedded] : [];

              this.cdr.detectChanges();
              this.selectedLimit = null;
              this.originalLimitBeforeEdit = null;
            },
            error: (err) => {
              log.debug('Error refreshing added limits after edit', err);
              this.globalMessagingService.displayErrorMessage('Error', 'Failed to refresh limits after edit');
            }
          });
      },
      error: (err) => {
        log.debug('Error updating limit', err);
        this.globalMessagingService.displayErrorMessage('Error', 'Error updating limit');
      }
    });
  }

  fetchAddedLimitsOfLiability(): void {
    log.debug("FETCH added limits of liability called ");
    if (!this.selectedSubclassCode || !this.quoteProductCode) {
      log.debug('Subclass code or quote product code missing');
      return;
    }

    this.quotationService
      .getAddedLimitsOfLiability(this.selectedSubclassCode, this.quoteProductCode, 'L')
      .subscribe({
        next: (response) => {
          this.addedLimitsOfLiability = response._embedded || [];
          log.debug("QUOTATION LIMITS OF LIABILITY", this.addedLimitsOfLiability);

          const cacheKey = `limits_of_liability_${this.selectedRiskCode}`;
          const originalCacheKey = `original_limits_of_liability_${this.selectedRiskCode}`;
          const originalData = sessionStorage.getItem(originalCacheKey);

          let availableLimits: any[] = [];
          if (originalData) {
            const originalLimits = JSON.parse(originalData);

            availableLimits = originalLimits.filter(
              (lim: any) => !this.addedLimitsOfLiability.some(al => al.quotationValueCode === lim.code)
            );
          }

          this.limitsOfLiability = availableLimits;
          sessionStorage.setItem(cacheKey, JSON.stringify(this.limitsOfLiability));

          const addedCacheKey = `added_limits_of_liability_${this.selectedRiskCode}`;
          sessionStorage.setItem(addedCacheKey, JSON.stringify(this.addedLimitsOfLiability));

          if (this.addedLimitsOfLiability.length > 0) {
            this.setLimitsOfLiabilityColumns(this.addedLimitsOfLiability[0]);
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          log.debug('Error fetching limits of liability (L):', err);
        },
      });
  }

  //delete limit
  prepareDeleteLimit(limit: any): void {
    this.selectedDeleteLimit = limit;
    log.debug("limitDelete", this.selectedDeleteLimit)
  }

  deleteLimit(): void {
    if (!this.selectedDeleteLimit?.code) return;

    this.quotationService.deleteLimit(this.selectedDeleteLimit.code).subscribe({
      next: () => {
        this.addedLimitsOfLiability = this.addedLimitsOfLiability.filter(
          l => l.code !== this.selectedDeleteLimit.code
        );

        const originalCacheKey = `original_limits_of_liability_${this.selectedRiskCode}`;
        const originalData = sessionStorage.getItem(originalCacheKey);
        const originalLimits = originalData ? JSON.parse(originalData) : [];

        const originalLimit = originalLimits.find(
          l => l.code === this.selectedDeleteLimit.quotationValueCode
        );

        if (originalLimit) {
          this.limitsOfLiability = [...this.limitsOfLiability, originalLimit];
          const cacheKey = `limits_of_liability_${this.selectedRiskCode}`;
          sessionStorage.setItem(cacheKey, JSON.stringify(this.limitsOfLiability));
        }

        this.selectedDeleteLimit = null;

        this.cdr.detectChanges();
        this.globalMessagingService.displaySuccessMessage('Success', 'Limit deleted successfully');
      },
      error: (err) => {
        log.debug("Error deleting limit", err);
        this.globalMessagingService.displayErrorMessage('Error', 'Error deleting limit');
      }
    });
  }


  cleanCurrencyValue(value: string | number): string {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    return stringValue.replace(/[^\d.]/g, '');
  }


  //excesses
  saveExcessesColumnsToSession(): void {
    if (this.excessesColumns) {
      const visibility = this.excessesColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('excessesColumns', JSON.stringify(visibility));
    }
  }

  toggleExcessColumnVisibility(field: string) {
    this.saveExcessesColumnsToSession();
  }

  toggleExcessesColumns(iconElement: HTMLElement): void {
    this.showExcesses = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showExcessesColumnModal = true;
  }

  setExcessesColumns(excess: Excesses) {
    const excludedFields = ['actions'];

    this.excessesColumns = Object.keys(excess)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisibleExcessesFields.includes(key),
        filterable: true,
        sortable: true
      }));

    this.excessesColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    // Restore from sessionStorage 
    const saved = sessionStorage.getItem('excessesColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.excessesColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    log.debug("excessesColumns", this.excessesColumns);
  }

  defaultVisibleExcessesFields = ['narration', 'value',];

  loadExcesses(): void {
    if (!this.selectedSubclassCode) {
      log.debug('Subclass code is required to load excesses');
      return;
    }

    const cacheKey = `excesses_${this.selectedSubclassCode}`;
    const originalCacheKey = `original_excesses_${this.selectedSubclassCode}`;

    // check session storage
    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedOriginal = sessionStorage.getItem(originalCacheKey);

    // if (cachedData && cachedOriginal) {
    //   this.excessesData = JSON.parse(cachedData);
    //   log.debug("Excesses fetched b4 service call:", this.excessesData)

    //   this.originalExcesses = JSON.parse(cachedOriginal);
    //   if (this.originalExcesses.length > 0) {
    //     this.setExcessesColumns(this.originalExcesses[0]);
    //   }
    //   return;
    // }
    if (cachedData && cachedOriginal) {
      const parsedData = JSON.parse(cachedData);
      const parsedOriginal = JSON.parse(cachedOriginal);

      if (parsedData.length > 0 && parsedOriginal.length > 0) {
        this.excessesData = parsedData;
        this.originalExcesses = parsedOriginal;
        this.setExcessesColumns(this.originalExcesses[0]);
        return;
      }
    }


    this.quotationService.getExcesses(this.selectedSubclassCode, 'E').subscribe({
      next: (res) => {
        this.excessesData = res || [];
        log.debug("Excesses fetched:", this.excessesData)
        this.originalExcesses = JSON.parse(JSON.stringify(this.excessesData));

        sessionStorage.setItem(cacheKey, JSON.stringify(this.excessesData));
        sessionStorage.setItem(originalCacheKey, JSON.stringify(this.originalExcesses));

        if (this.originalExcesses.length > 0) {
          this.setExcessesColumns(this.originalExcesses[0]);
        }
      },
      error: (err) => {
        log.debug('Error fetching excesses', err);
        this.excessesData = [];
      }
    });
  }

  openExcessModal(): void {
    if (!this.selectedSubclassCode || !this.selectedRiskCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select or add risk to proceed');
      return;
    }

    this.showExcessModal = true;
    const modalElement = document.getElementById('addExcess');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
    this.getAddedExcesses();
    this.loadExcesses();
  }

  addExcesses(): void {
    if (!this.selectedExcessess?.length) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select at least one excess to add');
      return;
    }

    const newQpCode = this.quoteProductCode;
    const subclassCode = this.selectedRisk?.subclassCode || this.selectedSubclassCode;

    if (!subclassCode || !newQpCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Missing required information');
      return;
    }

    const payload = this.selectedExcessess.map(excess => ({
      scheduleValueCode: excess.code,
      value: this.cleanCurrencyValue(excess.value),
      narration: excess.narration,
      type: 'E'
    }));

    this.quotationService.addLimitsOfLiability(newQpCode, payload).subscribe({
      next: () => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Excess added successfully');
        this.getAddedExcesses();

        this.excessesData = this.excessesData.filter(ex => !this.selectedExcessess.includes(ex));
        sessionStorage.setItem(`excesses_${subclassCode}`, JSON.stringify(this.excessesData));

        this.selectedExcessess = [];
      },
      error: (err) => {
        log.debug('Error adding excesses', err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add excesses');
      }
    });
  }

  getAddedExcesses(): void {
    if (!this.selectedSubclassCode || !this.quoteProductCode) return;

    this.quotationService.getAddedExcesses(this.selectedSubclassCode, this.quoteProductCode, 'E')
      .subscribe({
        next: (res) => {
          this.addedExcessess = res._embedded ? [...res._embedded] : [];

          const cacheKey = `excesses_${this.selectedSubclassCode}`;
          const originalCacheKey = `original_excesses_${this.selectedSubclassCode}`;
          const originalData = sessionStorage.getItem(originalCacheKey);

          let availableExcesses: any[] = [];
          if (originalData) {
            const originalExcesses = JSON.parse(originalData);
            availableExcesses = originalExcesses.filter(
              (ex: any) => !this.addedExcessess.some(ae => ae.quotationValueCode === ex.code)
            );
          }

          this.excessesData = availableExcesses;
          sessionStorage.setItem(cacheKey, JSON.stringify(this.excessesData));

          this.cdr.detectChanges();
        },
        error: (err) => log.debug('Error fetching added excesses', err)
      });
  }


  populateEditExcessModal(excess: any): void {
    this.selectedExcess = { ...excess };
    this.originalExcessBeforeEdit = { ...excess };
  }

  wasExcessModified(): boolean {
    if (!this.selectedExcess || !this.originalExcessBeforeEdit) return false;
    const newNarration = this.selectedExcess.narration?.trim() ?? '';
    const oldNarration = this.originalExcessBeforeEdit.narration?.trim() ?? '';
    const newValue = this.cleanCurrencyValue(String(this.selectedExcess.value));
    const oldValue = this.cleanCurrencyValue(String(this.originalExcessBeforeEdit.value));

    return (newNarration !== oldNarration && newNarration.length > 0) || newValue !== oldValue;
  }

  editExcess(): void {
    if (!this.selectedExcess) return;

    const payload = [{
      code: this.selectedExcess.code,
      scheduleValueCode: this.selectedExcess.quotationValueCode,
      value: this.cleanCurrencyValue(this.selectedExcess.value),
      narration: this.selectedExcess.narration?.trim(),
      type: 'E'
    }];

    log.debug("edit excess", payload)

    this.quotationService.editExcesses(this.quoteProductCode, payload).subscribe({
      next: (res) => {
        res && this.globalMessagingService.displaySuccessMessage('Success', 'Excess updated successfully');
        this.quotationService.getAddedExcesses(this.selectedSubclassCode, this.quoteProductCode, 'E')
          .subscribe({
            next: (res) => {
              this.addedExcessess = res._embedded ? [...res._embedded] : [];
              this.cdr.detectChanges();

              this.selectedExcess = null;
              this.originalExcessBeforeEdit = null;

              // Close modal programmatically
              const modalElement = document.getElementById('editExcess');
              if (modalElement) {
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                  modalInstance.hide();
                }
              }
            },
            error: (err) => log.debug('Error refreshing added excesses', err)
          });
      },
      error: (err) => this.globalMessagingService.displayErrorMessage('Error', 'Error updating excess')
    });
  }

  prepareDeleteExcess(excess: any): void {
    this.selectedDeleteExcess = excess;
  }

  deleteExcess(): void {
    if (!this.selectedDeleteExcess?.code) return;

    const subclassCode = this.selectedSubclassCode;
    if (!subclassCode) return;

    this.quotationService.deleteExcesses(this.selectedDeleteExcess.code).subscribe({
      next: () => {
        // Remove from addedExcessess
        this.addedExcessess = this.addedExcessess.filter(e => e.code !== this.selectedDeleteExcess.code);

        // Restore original from session storage
        const originalCacheKey = `original_excesses_${subclassCode}`;
        const originalData = sessionStorage.getItem(originalCacheKey);
        const originalExcesses: any[] = originalData ? JSON.parse(originalData) : [];

        const originalExcess = originalExcesses.find(
          ex => ex.code === this.selectedDeleteExcess.quotationValueCode
        );

        if (originalExcess) {
          this.excessesData = [...this.excessesData, originalExcess];
          sessionStorage.setItem(`excesses_${subclassCode}`, JSON.stringify(this.excessesData));
        }

        this.selectedDeleteExcess = null;
        this.cdr.detectChanges();

        this.globalMessagingService.displaySuccessMessage('Success', 'Excess deleted successfully');

      },
      error: (err) => this.globalMessagingService.displayErrorMessage('Error', 'Error deleting excess')
    });
  }


  //Perils
  savePerilColumnsToSession(): void {
    if (this.perilColumns) {
      const visibility = this.perilColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('perilColumns', JSON.stringify(visibility));
    }
  }

  togglePerilColumnVisibility(field: string) {
    this.savePerilColumnsToSession();
  }

  togglePerilColumns(iconElement: HTMLElement): void {
    this.showPerils = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showPerilColumnModal = true;
  }

  setPerilColumns(excess: Excesses) {
    const excludedFields = [
    ];

    this.perilColumns = Object.keys(excess)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisiblePerilFields.includes(key),
        filterable: true,
        sortable: true
      }));

    this.perilColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    const saved = sessionStorage.getItem('perilColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.perilColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    log.debug("perilColumns", this.perilColumns);
  }

  defaultVisiblePerilFields = ['description', 'excess', 'excessMin', 'excessMax', 'personLimit', 'claimLimit']

  loadQuotationPerils(): void {
    const riskCode = this.quotationRiskCode;
    const subclassCode = this.selectedRisk?.subclassCode

    if (!riskCode && !subclassCode) {
      log.debug('Risk code is missing');
      return;
    }

    this.quotationService.getQuotationPerils(subclassCode, riskCode).subscribe({
      next: (res) => {
        log.debug('DBperils:', res?._embedded || []);
        this.addedPerils = res?._embedded || [];
        log.debug("Added perils from database", this.addedPerils);

        this.updateAvailablePerils();
      },
      error: (err) => {
        console.error('Error fetching quotation perils', err);
      }
    });
  }

  updateAvailablePerils(): void {
    if (!this.addedPerils || !this.perils) {
      return;
    }
    const addedPerilCodes = this.addedPerils.map((peril: any) => peril.subclassSectionPerilCode || peril.code);

    this.perils = this.perils.filter((peril: any) =>
      !addedPerilCodes.includes(peril.code)
    );

    log.debug('Updated available perils after filtering:', this.perils);
  }

  loadPerils(): void {
    const savedSubclass = sessionStorage.getItem('selectedSubclassCode');
    if (savedSubclass) {
      this.selectedSubclassCode = savedSubclass;
    }

    log.debug('subclass code', savedSubclass)

    const subclassCode = this.selectedSubclassCode;
    log.debug('subclass code', this.selectedSubclassCode)
    if (!subclassCode) {
      this.addedPerils = [];
      this.perils = [];
      return;
    }

    const sessionKey = `availablePerils_${subclassCode}`;
    const savedAvailable = sessionStorage.getItem(sessionKey);

    const savedPerils = sessionStorage.getItem('perilsData');
    if (savedPerils) {
      this.allPerilsMap = JSON.parse(savedPerils);

      this.addedPerils = [...(this.allPerilsMap[subclassCode] || [])];
      console.log(`Restored added perils for subclass ${subclassCode}:`, this.addedPerils);
    } else {
      this.allPerilsMap = {};
      this.addedPerils = [];
    }

    if (savedAvailable) {
      this.perils = JSON.parse(savedAvailable);
      console.log(`Loaded available perils for subclass ${subclassCode} from session:`, this.perils);
      if (this.perils.length > 0) {
        this.setPerilColumns(this.perils[0]);
      }

    } else {
      this.quotationService.getSubclassSectionPeril(subclassCode, 0, 10)
        .subscribe({
          next: (data) => {
            this.perils = data?._embedded || [];

            if (this.allPerilsMap[subclassCode]) {
              const addedCodes = this.allPerilsMap[subclassCode].map((p: any) => p.code);
              this.perils = this.perils.filter((p: any) => !addedCodes.includes(p.code));
            }

            sessionStorage.setItem(sessionKey, JSON.stringify(this.perils));
            if (this.perils.length > 0) {
              this.setPerilColumns(this.perils[0]);
            }
            console.log(`Fetched available perils for subclass ${subclassCode} from API:`, this.perils);
          },
          error: (err) => {
            console.error(`Failed to fetch perils for subclass ${subclassCode}:`, err);
            this.globalMessagingService.displayErrorMessage('Error', 'Could not load perils');
          }
        });
    }
  }

  openPerilsModal(): void {
    if (!this.selectedSubclassCode || !this.selectedRiskCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select or add risk to proceed');
      return;
    }
    this.closeChoosePerilsModal();
    new bootstrap.Modal(this.perilsModal.nativeElement).show();

    this.loadPerils();
    // this.loadQuotationPerils();
  }

  closePerilsModal() {
    document.activeElement && (document.activeElement as HTMLElement).blur();
    bootstrap.Modal.getInstance(this.perilsModal.nativeElement)?.hide();
  }

  openChoosePerilsModal(): void {
    if (!this.selectedSubclassCode || !this.selectedRiskCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select or add risk to proceed');
      return;
    }

    this.loadQuotationPerils();


    if (!this.isPerilEditMode) {
      this.perilDetailsForm.reset();
      this.selectedPeril = null;
      this.editingPeril = null;
    }

    new bootstrap.Modal(this.choosePerilsModal.nativeElement).show();
  }

  closeChoosePerilsModal(): void {
    const modalElement = this.choosePerilsModal.nativeElement;
    const modalInstance = bootstrap.Modal.getInstance(modalElement);

    if (modalInstance) {
      modalInstance.hide();
    }

    document.activeElement && (document.activeElement as HTMLElement).blur();

    this.isPerilEditMode = false;
    this.editingPeril = null;
  }

  selectRiskLimit() {
    this.perilDetailsForm.patchValue({
      description: this.selectedPeril.description,
      shortDescription: this.selectedPeril.shortDescription,
      claimLimit: this.selectedPeril.claimLimit,
      personLimit: this.selectedPeril.personLimit,
      excess: this.selectedPeril.excess,
      excessMax: this.selectedPeril.excessMax,
      excessMin: this.selectedPeril.excessMin,
      tlExcessType: this.selectedPeril.tlExcessType,
      plExcessType: this.selectedPeril.plExcessType,
      perilLimit: this.selectedPeril.perilLimit,
      subclassSectionPerilCode: this.selectedPeril.code,
      expireOnClaim: this.selectedPeril.expireOnClaim,
      perilType: this.selectedPeril.plExcessType,
    });
    this.closePerilsModal();
    new bootstrap.Modal(this.choosePerilsModal.nativeElement).show();
  }

  //add peril
  addPerils(): void {
    if (!this.selectedPeril) return;

    const quotationCode = this.selectedProduct?.quotationCode;
    const quotationRiskCode = this.selectedRisk?.code;
    const subclassCode = this.selectedRisk?.subclassCode;

    if (!subclassCode) {
      console.error('Subclass code is missing');
      return;
    }

    const formValues = this.perilDetailsForm.value;

    const perilPayload: riskPeril = {
      quotationRiskCode,
      quotationCode,
      subclassSectionPerilCode: formValues.subclassSectionPerilCode,
      perilLimit: 0,
      perilType: formValues.plExcessType,
      sumInsuredOrLimit: formValues.sumInsuredOrLimit,
      excessType: formValues.tlExcessType,
      excess: formValues.excess,
      excessMinimum: formValues.excessMin,
      excessMaximum: formValues.excessMax,
      expireOnClaim: formValues.expireOnClaim,
      personLimit: formValues.personLimit,
      claimLimit: formValues.claimLimit,
      description: formValues.description
    };

    console.log("Peril payload", perilPayload);

    this.quotationService.addSubclassSectionPeril(perilPayload).subscribe({
      next: () => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Peril added successfully');
        this.closeChoosePerilsModal();
        this.loadQuotationPerils();

        const newPeril = {
          ...this.selectedPeril,
          value: this.cleanCurrencyValue(this.selectedPeril?.value),
          isModified: false
        };

        if (!this.addedPerils.some(p => p.code === newPeril.code)) {
          this.addedPerils = [...this.addedPerils, newPeril];
          console.log("Updated addedPerils:", this.addedPerils);

          if (!this.allPerilsMap[subclassCode]) {
            this.allPerilsMap[subclassCode] = [];
          }
          this.allPerilsMap[subclassCode] = [
            ...this.allPerilsMap[subclassCode],
            newPeril
          ];
          sessionStorage.setItem('perilsData', JSON.stringify(this.allPerilsMap));
          this.perils = this.perils.filter(p => p.code !== newPeril.code);

          const sessionKey = `availablePerils_${subclassCode}`;
          sessionStorage.setItem(sessionKey, JSON.stringify(this.perils));
        }

        this.selectedPeril = null;
      },
      error: (err) => {
        console.error('Error adding Peril', err);
        this.globalMessagingService.displayErrorMessage("Error", "Error adding Peril");
      }
    });
  }

  //edit perils
  populatePerilEditModal(peril: any): void {
    this.isPerilEditMode = true;
    this.editingPeril = { ...peril };

    this.perilDetailsForm.patchValue({
      description: peril.description,
      shortDescription: peril.shortDescription || peril.perilShortDescription,
      claimLimit: peril.claimLimit,
      personLimit: peril.personLimit,
      excess: peril.excess,
      excessMax: peril.excessMaximum || peril.excessMax,
      excessMin: peril.excessMinimum || peril.excessMin,
      tlExcessType: peril.excessType || peril.tlExcessType,
      plExcessType: peril.perilType || peril.plExcessType,
      perilLimit: peril.perilLimit,
      subclassSectionPerilCode: peril.subclassSectionPerilCode || peril.code,
      expireOnClaim: peril.expireOnClaim,
      perilType: peril.perilType || peril.plExcessType,
      sumInsuredOrLimit: peril.sumInsuredOrLimit
    });

    new bootstrap.Modal(this.choosePerilsModal.nativeElement).show();

    log.debug("Editing peril from database:", peril);
  }

  updatePeril(): void {
    if (!this.editingPeril) return;

    const quotationCode = this.selectedProduct?.quotationCode;
    const quotationRiskCode = this.selectedRisk?.code;
    const subclassCode = this.selectedRisk?.subclassCode;

    if (!subclassCode) {
      console.error('Subclass code is missing');
      return;
    }

    const formValues = this.perilDetailsForm.value;

    const perilPayload: riskPeril = {
      code: this.editingPeril.subclassSectionPerilsCode,
      quotationRiskCode,
      quotationCode,
      perilLimit: formValues.perilLimit || 0,
      perilType: formValues.plExcessType,
      sumInsuredOrLimit: formValues.sumInsuredOrLimit,
      excessType: formValues.tlExcessType,
      excess: formValues.excess,
      excessMinimum: formValues.excessMin,
      excessMaximum: formValues.excessMax,
      expireOnClaim: formValues.expireOnClaim,
      personLimit: formValues.personLimit,
      claimLimit: formValues.claimLimit,
      description: formValues.description
    };

    this.quotationService.updateSubclassSectionPeril(this.editingPeril.code, perilPayload)
      .subscribe({
        next: () => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Peril updated successfully');
          this.closeChoosePerilsModal();

          this.loadQuotationPerils();

          log.debug("Peril updated successfully");

          this.isPerilEditMode = false;
          this.editingPeril = null;
        },
        error: (err) => {
          log.debug('Error updating Peril', err);
          this.globalMessagingService.displayErrorMessage("Error", "Error updating Peril");
        }
      });
  }

  //delete peril
  prepareDeletePeril(peril: any): void {
    this.perilToDelete = peril;
  }

  deletePeril(): void {
    if (!this.perilToDelete) {
      log.debug("No peril selected for deletion");
      return;
    }

    this.quotationService.deleteSubclassSectionPeril(this.perilToDelete.code).subscribe({
      next: () => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Peril deleted successfully');

        this.addedPerils = this.addedPerils.filter(
          p => p.code !== this.perilToDelete.code
        );

        const setupPeril = this.findSetupPeril(this.perilToDelete.subclassSectionPerilsCode);
        if (setupPeril) {
          this.perils = [...this.perils, setupPeril];

          const sessionKey = `availablePerils_${this.selectedSubclassCode}`;
          sessionStorage.setItem(sessionKey, JSON.stringify(this.perils));
        }

        this.perilToDelete = null;
      },
      error: (err) => {
        console.error('Error deleting peril', err);
        this.globalMessagingService.displayErrorMessage("Error", "Error deleting peril");
      }
    });
  }

  private findSetupPeril(setupCode: number) {
    return this.allPerilsMap[this.selectedSubclassCode]?.find(
      (p: any) => p.code === setupCode
    );
  }

  initializePerils(): void {
    this.loadPerils();
    this.loadQuotationPerils();
  }


  //commissions
  agentCode: number;
  accountCode: number;
  addedCommissions: any[] = [];


  saveCommissionsColumnsToSession(): void {
    if (this.commissionsColumns) {
      const visibility = this.commissionsColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('commissionsColumns', JSON.stringify(visibility));
    }
  }

  toggleCommissionsColumnVisibility(field: string) {
    this.saveCommissionsColumnsToSession();
  }

  toggleCommissionsColumns(iconElement: HTMLElement): void {
    this.showCommissions = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showCommissionsColumnModal = true;
  }

  setCommissionsColumns(commissions: any) {
    const excludedFields = ['actions', 'code', 'quotationRiskCode', 'quotationCode', 'transCode', 'accountCode', 'trntCode',
      , 'discAmount', 'overrideCommission', 'agentCode'
    ];

    this.commissionsColumns = Object.keys(commissions)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: key === 'agentDto' ? 'Agent Name' : this.sentenceCase(key),
        visible: this.defaultVisibleCommissionsFields.includes(key),
        filterable: true,
        sortable: true
      }));

    // Ensure agentDto is always first
    const agentDtoIndex = this.commissionsColumns.findIndex(col => col.field === 'agentDto');
    if (agentDtoIndex > 0) {
      const agentDtoColumn = this.commissionsColumns.splice(agentDtoIndex, 1)[0];
      this.commissionsColumns.unshift(agentDtoColumn);
    }

    this.commissionsColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    // Restore from sessionStorage 
    const saved = sessionStorage.getItem('commissionsColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.commissionsColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    log.debug("commissionsColumns", this.commissionsColumns);
  }

  defaultVisibleCommissionsFields = ['agentDto', 'group', 'accountType', 'setupRate', 'usedRate', 'amount', 'withHoldingTaxRate',
    'withHoldingTax', 'discountType', 'discountRate'];

  /**
  * Checks if a commission field should be read-only (non-editable)
  * @param fieldName The name of the field to check
  * @returns boolean indicating if the field should be read-only
  */
  isCommissionFieldReadOnly(fieldName: string): boolean {
    const readOnlyFields = [
      'agentName',
      'accountType',
      'setupRate',
      'withHoldingRate',
      'withHoldingTax',
      'transactionType',
      'discAmount',
    ];

    return readOnlyFields.includes(fieldName);
  }


  loadCommissions(): void {
    const subclassCode = this.selectedSubclassCode;
    const quotationDetailsRaw = sessionStorage.getItem('quotationFormDetails');
    const quotationDetails = quotationDetailsRaw ? JSON.parse(quotationDetailsRaw) : null;

    this.accountCode = quotationDetails?.agent?.accountTypeId || 0;
    this.agentCode = quotationDetails?.agent?.id || 0;

    if (!this.accountCode) {
      this.globalMessagingService.displayErrorMessage('Error', 'Select an agent to proceed');
      return;
    }

    const riskFormDetailsRaw = sessionStorage.getItem('riskFormDetails');
    const riskFormDetails = riskFormDetailsRaw ? JSON.parse(riskFormDetailsRaw) : null;
    const binderCode = riskFormDetails?.premiumBand || 0;

    const cacheKey = `commissions_${this.selectedSubclassCode}_${this.accountCode}_${binderCode}`;
    const originalCacheKey = `original_commissions_${this.selectedSubclassCode}_${this.accountCode}_${binderCode}`;

    // Try loading from cache
    const cachedData = sessionStorage.getItem(cacheKey);
    const cachedOriginal = sessionStorage.getItem(originalCacheKey);

    if (cachedData && cachedOriginal) {
      this.commissions = JSON.parse(cachedData);
      this.originalCommissions = JSON.parse(cachedOriginal);

      log.debug(`Loaded commissions for subclass ${this.selectedSubclassCode} from sessionStorage`);
      return;
    }

    // Fetch fresh from API if no cache
    this.quotationService.getCommissions(subclassCode, this.accountCode, binderCode)
      .subscribe({
        next: (response) => {
          const commissions = response?._embedded || [];

          this.originalCommissions = [...commissions];
          sessionStorage.setItem(originalCacheKey, JSON.stringify(this.originalCommissions));

          this.commissions = [...commissions];
          sessionStorage.setItem(cacheKey, JSON.stringify(this.commissions));

          log.debug(`Fetched and stored commissions for subclass ${this.selectedSubclassCode}`);
        },
        error: (err) => {
          log.debug('Error fetching commissions:', err);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch commissions');
          this.commissions = [];
        }
      });
  }

  openCommissionsModal(): void {
    if (this.isCommissionsButtonDisabled) {
      log.debug('Agent source must be selected to access commissions');
      return;
    }

    if (!this.selectedSubclassCode) {
      log.debug('Subclass code is required to load excesses');
      return;
    }

    this.showCommissionsModal = true;

    const modalElement = document.getElementById('addCommission');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }

    this.loadCommissions();
    this.loadAddedCommissions();
  }

  addCommission(): void {
    if (!this.selectedCommission) {
      this.globalMessagingService.displayErrorMessage('Error', 'No commission selected');
      return;
    }

    const storedRiskCode = sessionStorage.getItem("selectedRiskCode");
    const QuotationCode = sessionStorage.getItem('quotationCode');

    const commissionPayload = {
      quotationRiskCode: Number(storedRiskCode || 0),
      quotationCode: Number(QuotationCode || 0),
      agentCode: this.agentCode,
      transCode: this.selectedCommission.transactionCode,
      accountCode: this.accountCode,
      trntCode: this.selectedCommission.transTypeCode,
      group: this.selectedCommission.orderType,
      usedRate: null
    };

    log.debug('commissionPayload', commissionPayload);

    this.quotationService.addRiskCommission(commissionPayload).subscribe({
      next: (res) => {
        const embedded = res?._embedded || null;
        const newCommission = embedded ? embedded : null;

        if (newCommission) {
          // ---- Update added_commissions cache ----
          const addedCacheKey = `added_commissions_${QuotationCode}`;
          const cachedAdded = sessionStorage.getItem(addedCacheKey);
          let addedCommissions = cachedAdded ? JSON.parse(cachedAdded) : [];

          addedCommissions = [...addedCommissions, newCommission];
          sessionStorage.setItem(addedCacheKey, JSON.stringify(addedCommissions));
          this.addedCommissions = [...addedCommissions];

          // ---- Remove from commissions cache ----
          const subclassCode = this.selectedSubclassCode;
          const riskFormDetailsRaw = sessionStorage.getItem('riskFormDetails');
          const riskFormDetails = riskFormDetailsRaw ? JSON.parse(riskFormDetailsRaw) : null;
          const binderCode = riskFormDetails?.premiumBand || 0;

          const commissionsCacheKey = `commissions_${subclassCode}_${this.accountCode}_${binderCode}`;
          const originalCommissionsCacheKey = `original_commissions_${subclassCode}_${this.accountCode}_${binderCode}`;

          const cachedCommissions = sessionStorage.getItem(commissionsCacheKey);
          if (cachedCommissions) {
            let commissions = JSON.parse(cachedCommissions);
            commissions = commissions.filter(
              (c: any) => c.transactionCode !== this.selectedCommission.transactionCode
            );
            sessionStorage.setItem(commissionsCacheKey, JSON.stringify(commissions));
            this.commissions = [...commissions];
          }

          this.originalCommissions = JSON.parse(sessionStorage.getItem(originalCommissionsCacheKey) || '[]');
          this.fetchAddedCommissions();

          if (this.addedCommissions.length > 0) {
            this.setCommissionsColumns(this.addedCommissions[0]);
          }
        }

        this.globalMessagingService.displaySuccessMessage('Success', 'Commission added successfully');
        log.debug('Commission successfully added & caches updated:', {
          available: this.commissions,
          added: this.addedCommissions
        });
      },
      error: (err) => {
        log.debug('Error adding commission:', err);
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add commission');
      }
    });
  }


  loadAddedCommissions(): void {
    if (!this.quotationCode) {
      log.debug("No quotationCode found, cannot load added commissions");
      return;
    }

    const addedCacheKey = `added_commissions_${this.quotationCode}`;
    const cachedAddedData = sessionStorage.getItem(addedCacheKey);

    if (cachedAddedData) {
      try {
        this.addedCommissions = JSON.parse(cachedAddedData);
        log.debug(`Added commissions loaded from cache for quotation ${this.quotationCode}`);
        if (this.addedCommissions.length > 0) {
          this.setCommissionsColumns(this.addedCommissions[0]);
        }
        return;
      } catch (error) {
        log.debug('Error parsing cached added commissions, fetching fresh data:', error);
        sessionStorage.removeItem(addedCacheKey);
      }
    }

    this.fetchAddedCommissions();
  }

  fetchAddedCommissions(): void {
    this.quotationService.getAddedCommissions(this.quotationCode).subscribe({
      next: (res: any) => {
        this.addedCommissions = res?._embedded || [];
        sessionStorage.setItem(`added_commissions_${this.quotationCode}`, JSON.stringify(this.addedCommissions));
        log.debug('Fetched and cached added commissions:', this.addedCommissions);

        if (this.addedCommissions.length > 0) {
          this.setCommissionsColumns(this.addedCommissions[0]);
        }
      },
      error: (err) => log.debug('Error fetching added commissions', err),
    });
  }

  //guard commissions if agent not selected
  isAgentSourceSelected(): boolean {
    return !!this.quotationDetails?.agentCode;
  }

  get isCommissionsButtonDisabled(): boolean {
    return !this.isAgentSourceSelected();
  }


  onAddOtherSchedule(tab: any): void {
    log.debug("DYNAMIC SUBCLASS FORM FIELDS", this.dynamicSubclassFormFields)
    this.activeModalTab = tab;
    this.activeFormFields = this.dynamicSubclassFormFields.filter(
      field => Number(field.scheduleLevel) === tab.levelNumber
    );
    this.levelNumber = tab.levelNumber
    // Build reactive form
    const group: { [key: string]: any } = {};
    this.activeFormFields.forEach(field => {
      group[field.name] = new FormControl('', field.isMandatory === 'Y' ? Validators.required : null);
    });

    this.scheduleOtherDetailsForm = this.fb.group(group);
    log.debug("Schedule other details client before", this.scheduleOtherDetailsForm.value)
    const authorisedDriverFieldPresent = this.dynamicSubclassFormFields.some(
      field => field.name === 'authorisedDriver'
    );

    if (!this.scheduleOtherDetailsForm.contains('authorisedDriver') && authorisedDriverFieldPresent) {
      this.scheduleOtherDetailsForm.addControl('authorisedDriver', new FormControl('', Validators.required));
      this.scheduleOtherDetailsForm.patchValue({ authorisedDriver: this.clientName });

    }

    log.debug("Schedule other details client", this.scheduleOtherDetailsForm.value)
    // Show Bootstrap modal
    setTimeout(() => {
      const modalElement = document.getElementById('addOtherDetailsModal');
      if (modalElement) {
        const bsModal = new bootstrap.Modal(modalElement);
        bsModal.show();
      }
    });
    if (!this.scheduleOtherDetailsForm.contains('authorisedDriver')) {
      this.fetchLimitationOfUse();

    }

  }
  // computePremium() {
  //   const premiumComputationPayload = this.generatePremiumComputationPayload(this.quotationDetails)
  //   log.debug("Premium comp payload:", premiumComputationPayload)
  //   this.quotationService.computePremium(premiumComputationPayload).subscribe({
  //     next: (response) => {
  //       log.debug("Respone after saving payload:", response)
  //     },
  //     error: (error) => {
  //       this.globalMessagingService.displayErrorMessage("Error", error.error.message);
  //     }
  //   })
  // }

  checkComputePremiumRequiredDataDetailed(): { isValid: boolean; missingItems: string[] } {
    const missingItems: string[] = [];

    // Check schedule details with more detail
    const hasScheduleData = this.levelDataMap &&
      Object.keys(this.levelDataMap).some(levelName =>
        this.levelDataMap[levelName] && this.levelDataMap[levelName].length > 0
      );

    if (!hasScheduleData) {
      missingItems.push('Schedule Details');
    }

    // Check risk details
    if (!this.riskDetails || this.riskDetails.length === 0) {
      missingItems.push('Risk Details');
    }

    // Check section details
    if (!this.sectionDetails || this.sectionDetails.length === 0) {
      missingItems.push('Section Details');
    }
    if (!this.premiumComputed) {
      missingItems.push('Premium not computed');

    }

    return {
      isValid: missingItems.length === 0,
      missingItems
    };
  }

  get premiumValidation() {
    return this.checkComputePremiumRequiredDataDetailed();
  }

  get nextButtonDisabled(): boolean {
    return !this.premiumValidation.isValid;
  }

  get nextButtonTooltip(): string {
    const missingItems = this.premiumValidation.missingItems;

    if (missingItems.length === 0) {
      return '';
    }

    if (missingItems.length === 1) {
      return `Add ${missingItems[0].toLowerCase()} to proceed`;
    }

    if (missingItems.length === 2) {
      return `Add ${missingItems[0].toLowerCase()} and ${missingItems[1].toLowerCase()} to proceed`;
    }

    // More than 2 missing
    const allButLast = missingItems.slice(0, -1).map(i => i.toLowerCase()).join(', ');
    const last = missingItems[missingItems.length - 1].toLowerCase();
    return `Add ${allButLast}, and ${last} to proceed`;
  }

  checkMakeReadyRequiredDataDetailed(): { isValid: boolean; missingItems: string[] } {
    const missingItems: string[] = [];

    // Check schedule details with more detail
    const hasScheduleData = this.levelDataMap &&
      Object.keys(this.levelDataMap).some(levelName =>
        this.levelDataMap[levelName] && this.levelDataMap[levelName].length > 0
      );

    if (!hasScheduleData) {
      missingItems.push('Schedule Details');
    }

    // Check risk details
    if (!this.riskDetails || this.riskDetails.length === 0) {
      missingItems.push('Risk Details');
    }

    // Check section details
    if (!this.sectionDetails || this.sectionDetails.length === 0) {
      missingItems.push('Section Details');
    }


    return {
      isValid: missingItems.length === 0,
      missingItems
    };
  }

  get makeReadyValidation() {
    return this.checkMakeReadyRequiredDataDetailed();
  }

  get computePremiumButtonDisabled(): boolean {
    return !this.makeReadyValidation.isValid;
  }

  get computePremiumButtonTooltip(): string {
    const missingItems = this.makeReadyValidation.missingItems;

    if (missingItems.length === 0) {
      return '';
    }

    if (missingItems.length === 1) {
      return `Add ${missingItems[0].toLowerCase()} to proceed`;
    }

    if (missingItems.length === 2) {
      return `Add ${missingItems[0].toLowerCase()} and ${missingItems[1].toLowerCase()} to proceed`;
    }

    // More than 2 missing
    const allButLast = missingItems.slice(0, -1).map(i => i.toLowerCase()).join(', ');
    const last = missingItems[missingItems.length - 1].toLowerCase();
    return `Add ${allButLast}, and ${last} to proceed`;
  }


  computePremium() {
    // const validation = this.checkComputePremiumRequiredDataDetailed();
    // if (!validation.isValid) {
    //   const missingItemsList = validation.missingItems.join(', ');
    //   const errorMessage = `The following required data is missing: ${missingItemsList}. Please ensure all tables contain at least one entry before computing premium.`;

    //   this.globalMessagingService.displayErrorMessage('Validation Error', errorMessage);
    //   return;
    // }

    const payload = this.generatePremiumComputationPayload(this.quotationDetails);

    this.quotationService.computePremium(payload).pipe(
      switchMap((response) => {
        log.debug("Response after computing premium:", response);

        const data = response?.productLevelPremiums || [];

        let totalNetPremium = 0;
        let totalGrossPremium = 0;
        let totalSumInsured = 0

        data.forEach(group => {
          group.riskLevelPremiums?.forEach(risk => {
            risk.coverTypeDetails?.forEach(detail => {
              const computed = detail.computedPremium || 0;
              totalNetPremium += computed;

              const taxes = detail.taxComputation?.reduce(
                (sum, t) => sum + (t?.premium || 0),
                0
              ) || 0;

              totalGrossPremium += computed + taxes;
            });
          });
        });
        data.forEach(group => {
          group.riskLevelPremiums?.forEach(risk => {
            const computed = risk?.sumInsured || 0;
            totalSumInsured += computed;



          });
        });

        this.premiums = {
          net: totalNetPremium,
          gross: totalGrossPremium,
          sumInsured: totalSumInsured
        };



        const updatePayload = this.prepareUpdatePremiumPayload(response);

        return this.quotationService.updatePremium(this.quotationCode, updatePayload);
      })
    ).subscribe({
      next: (updateResponse) => {
        log.debug("Premium updated successfully:", updateResponse);
        // this.router.navigate(['/home/gis/quotation/quotation-summary']);
        const quotationCode = this.quotationDetails.code
        log.debug("QuotationCode-after update", quotationCode)
        quotationCode && this.fetchQuotationDetails(quotationCode)
        log.debug("Premiums computed:", this.premiums);

        sessionStorage.setItem('premiums', JSON.stringify(this.premiums));
        this.premiumsChange.emit(this.premiums);


      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage("Error", err.error?.message || 'Premium update failed');
      }
    });
  }

  generateExceptions() {
    if (this.quotationCode) {
      this.makeReadyExceptions(this.quotationCode)

    }
  }
  // generatePremiumComputationPayload(quotationData: QuotationDetails): any {
  //   return {
  //     entityUniqueCode: 0,
  //     interfaceType: "QUOTATION",
  //     frequencyOfPayment: quotationData.frequencyOfPayment || "A",
  //     transactionStatus: "NB",
  //     quotationStatus: "Draft",
  //     products: quotationData.quotationProducts?.map(product => ({
  //       code: product.productCode,
  //       expiryPeriod: "Y",
  //       description: product.productName,
  //       withEffectFrom: product.wef,
  //       withEffectTo: product.wet,
  //       risks: product.riskInformation?.map(risk => ({
  //         code: risk.code.toString(),
  //         propertyId: risk.propertyId,
  //         binderDto: {
  //           code: risk.binderCode || 0,
  //           maxExposure: 0,
  //           currencyCode: quotationData.currencyCode,
  //           currencyRate: quotationData.currencyRate || 1
  //         },
  //         baseCurrencyCode: quotationData.currencyCode,
  //         prorata: 'S',
  //         itemDescription: risk.itemDesc,
  //         emlBasedOn: null,
  //         noClaimDiscountLevel: risk.ncdLevel || 0,
  //         subclassCoverTypeDto: [{
  //           subclassCode: risk.subclassCode,
  //           description: risk.subclass?.description || '',
  //           coverTypeCode: risk.coverTypeCode,
  //           minimumPremium: risk.riskLimits[0]?.minimumPremium || 0,
  //           coverTypeShortDescription: risk.coverTypeShortDescription,
  //           coverTypeDescription: risk.coverTypeDescription,
  //           limits: risk.riskLimits?.map(limit => ({
  //             description: limit.sectionShortDescription,
  //             code: limit.code,
  //             riskCode: risk.code,
  //             calculationGroup: limit.calcGroup,
  //             rowNumber: limit.rowNumber,
  //             rateDivisionFactor: limit.rateDivisionFactor,
  //             premiumRate: limit.premiumRate,
  //             rateType: limit.rateType,
  //             sectionType: limit.sectionType,
  //             limitAmount: risk.value,
  //             freeLimit: limit.freeLimit,
  //             compute: limit.compute,
  //             section: {
  //               code: limit.sectionCode,
  //               description: limit.sectionShortDescription,
  //               limitAmount: risk.value,
  //               isMandatory: null
  //             },
  //             multiplierRate: 1,
  //             multiplierDivisionFactor: limit.multiplierDivisionFactor,
  //             dualBasis: limit.dualBasis,
  //             shortDescription: limit.sectionShortDescription
  //           })) || [],
  //           limitPremium: risk.riskLimits?.map(limit => ({
  //             sectCode: limit.sectionCode,
  //             premium: limit.premiumAmount || 0,
  //             description: limit.sectionShortDescription,
  //             limitAmount: risk.value,
  //             isMandatory: null,
  //             calculationGroup: limit.calcGroup,
  //             compute: limit.compute,
  //             dualBasis: limit.dualBasis,
  //             rateDivisionFactor: limit.rateDivisionFactor,
  //             rateType: limit.rateType,
  //             rowNumber: limit.rowNumber,
  //             premiumRate: limit.premiumRate,
  //             freeLimit: limit.freeLimit,
  //             sectionType: limit.sectionType,
  //             multiplierRate: 1,
  //             shortDescription: limit.sectionShortDescription
  //           })) || []
  //         }],
  //         enforceCovertypeMinimumPremium: "Y",
  //         commissionRate: risk.commissionRate || 0,
  //         sumInsured: risk.value,
  //         useOfProperty: risk.subclass.description, // Default value
  //         taxes: product.taxInformation?.map(tax => ({
  //           taxRateType: tax.taxType || tax.rateType,
  //           applicationLevel: null,
  //           code: tax.code || 0,
  //           divisionFactor: 0,
  //           taxRate: tax.rate || 0,
  //           rangeTo: 0,
  //           rangeFrom: 0,
  //           rateDescription: tax.rateDescription || "",
  //           taxCode: tax.code || "",
  //           minPremium: 0,
  //           sumInsured: 0,
  //           premium: 0,
  //           quotationProductCode: 0
  //         })) || [],
  //         subclassSection: { code: risk.subclassCode },
  //         age: 0 // Hardcoded as requested
  //       })) || []
  //     })) || [],
  //     currency: { rate: quotationData.currencyRate || 1 },
  //     dateWithEffectTo: quotationData.coverTo,
  //     dateWithEffectFrom: quotationData.coverFrom,
  //     underwritingYear: new Date().getFullYear(),
  //     coinsuranceLeader: "N",
  //     coinsurancePercentage: 0
  //   };
  // }

  generatePremiumComputationPayload(quotationData: QuotationDetails): any {
    log.debug("Quotation details-compute premium", quotationData)
    return {
      entityUniqueCode: 0,
      interfaceType: "QUOTATION",
      frequencyOfPayment: quotationData.frequencyOfPayment || "A",
      transactionStatus: "NB",
      quotationStatus: "Draft",

      products: quotationData.quotationProducts?.map(product => ({
        code: product.code,
        expiryPeriod: "Y",
        description: product.productName,
        withEffectFrom: product.wef,
        withEffectTo: product.wet,

        risks: product.riskInformation?.map(risk => ({
          code: risk.code.toString(),
          propertyId: risk.propertyId,
          butCharge: risk.butCharge,

          binderDto: {
            code: risk.binderCode || 0,
            maxExposure: 0,
            currencyCode: quotationData.currencyCode,
            currencyRate: quotationData.currencyRate || 1
          },

          baseCurrencyCode: quotationData.currencyCode,
          prorata: "S",
          itemDescription: risk.itemDesc,
          emlBasedOn: null,
          noClaimDiscountLevel: risk.ncdLevel || 0,

          subclassCoverTypeDto: [{
            subclassCode: risk.subclassCode,
            description: risk.subclass?.description || "",
            coverTypeCode: risk.coverTypeCode,
            minimumPremium: risk.riskLimits?.[0]?.minimumPremium || 0,
            coverTypeShortDescription: risk.coverTypeShortDescription,
            coverTypeDescription: risk.coverTypeDescription,

            // ✅ limitAmount uses risk.value if freeLimit = 0
            limits: risk.riskLimits?.map(limit => {
              const limitAmount =
                (limit?.freeLimit || 0) === 0 ? risk?.value : limit?.limitAmount;

              return {
                description: limit.sectionShortDescription,
                code: limit.code,
                riskCode: risk.code,
                calculationGroup: limit.calcGroup,
                rowNumber: limit.rowNumber,
                rateDivisionFactor: limit.rateDivisionFactor,
                premiumRate: limit.premiumRate,
                rateType: limit.rateType,
                sectionType: limit.sectionType,
                limitAmount,
                freeLimit: limit.freeLimit,
                compute: limit.compute,
                section: {
                  code: limit.sectionCode,
                  description: limit.sectionShortDescription,
                  limitAmount,
                  isMandatory: null
                },
                minimumPremium: limit.minimumPremium,
                multiplierRate: 1,
                limitPeriod: 0,
                multiplierDivisionFactor: limit.multiplierDivisionFactor,
                dualBasis: limit.dualBasis,
                shortDescription: limit.sectionShortDescription
              };
            }) || [],

            // ✅ match logic in limitPremium
            limitPremium: risk.riskLimits?.map(limit => {
              const limitAmount =
                (limit?.freeLimit || 0) === 0 ? risk?.value : limit?.limitAmount;

              return {
                sectCode: limit.sectionCode,
                premium: limit.premiumAmount || 0,
                description: limit.sectionShortDescription,
                limitAmount,
                isMandatory: null,
                calculationGroup: limit.calcGroup,
                compute: limit.compute,
                dualBasis: limit.dualBasis,
                rateDivisionFactor: limit.rateDivisionFactor,
                rateType: limit.rateType,
                rowNumber: limit.rowNumber,
                premiumRate: limit.premiumRate,
                freeLimit: limit.freeLimit,
                sectionType: limit.sectionType,
                multiplierRate: 1,
                shortDescription: limit.sectionShortDescription
              };
            }) || []
          }],

          enforceCovertypeMinimumPremium: "Y",
          commissionRate: risk.commissionRate || 0,
          sumInsured: risk.value,
          useOfProperty: risk.subclass?.description || "",
          subclassSection: { code: risk.subclassCode },
          age: 0, // static as before

          taxes: product.taxInformation?.map(tax => ({
            taxRateType: tax.taxType || tax.rateType,
            applicationLevel: null,
            code: tax.code || 0,
            divisionFactor: 0,
            taxRate: tax.rate || 0,
            rangeTo: 0,
            rangeFrom: 0,
            rateDescription: tax.rateDescription || "",
            taxCode: tax.code || "",
            minPremium: 0,
            sumInsured: 0,
            premium: 0,
            quotationProductCode: product.code
          })) || []
        })) || []
      })) || [],

      currency: { rate: quotationData.currencyRate || 1 },
      dateWithEffectTo: quotationData.coverTo,
      dateWithEffectFrom: quotationData.coverFrom,
      underwritingYear: new Date().getFullYear(),
      coinsuranceLeader: "N",
      coinsurancePercentage: 0
    };
  }

  // prepareUpdatePremiumPayload(computeResponse: any): any {
  //   const product = computeResponse.productLevelPremiums?.[0];

  //   return {
  //     premiumAmount: product?.riskLevelPremiums?.reduce(
  //       (sum, risk) => sum + (risk.coverTypeDetails?.[0]?.computedPremium || 0),
  //       0
  //     ) || 0,
  //     productCode: product?.code,
  //     quotProductCode: 0, // set this if you have it from quotation details
  //     productPremium: product?.riskLevelPremiums?.[0]?.coverTypeDetails?.[0]?.computedPremium || 0,
  //     riskLevelPremiums: product?.riskLevelPremiums?.map(risk => ({
  //       code: risk.code,
  //       premium: risk.coverTypeDetails?.[0]?.computedPremium || 0,
  //       limitPremiumDtos: risk.coverTypeDetails?.[0]?.limitPremium?.map(limit => ({
  //         sectCode: limit.sectCode,
  //         premium: limit.premium
  //       })) || []
  //     })) || [],
  //     taxes: [] // if compute response gives taxComputation, map it here
  //   };

  // }
  prepareUpdatePremiumPayload(computeResponse: any): any[] {
    const products = computeResponse?.productLevelPremiums || [];

    return products.map((product: any) => {
      const productPremium = product.riskLevelPremiums?.reduce(
        (sum: number, risk: any) => sum + (risk.coverTypeDetails?.[0]?.computedPremium || 0),
        0
      ) || 0;

      return {
        premiumAmount: productPremium,
        // productCode: product.productCode ,
        quotProductCode: product.code,
        productPremium: productPremium,

        riskLevelPremiums: product.riskLevelPremiums?.map((risk: any) => {
          const coverType = risk.coverTypeDetails?.[0] || {};

          return {
            code: risk.code || 0,
            propertyId: risk.propertyId || '',
            propertyDescription: risk.propertyDescription || '',
            premium: coverType.computedPremium || 0,
            minimumPremiumUsed: risk.minimumPremiumUsed || 'N',

            coverTypeDetails: {
              code: coverType.code || 0,
              subclassCode: coverType.subclassCode || 0,
              description: coverType.description || '',
              coverTypeCode: coverType.coverTypeCode || 0,
              minimumAnnualPremium: coverType.minimumAnnualPremium || 0,
              minimumPremium: coverType.minimumPremium || 0,
              coverTypeShortDescription: coverType.coverTypeShortDescription || '',
              coverTypeDescription: coverType.coverTypeDescription || '',
              limits: coverType.limits || [],
              limitPremium: coverType.limitPremium?.map((limit: any) => ({
                sectCode: limit.sectCode || 0,
                premium: limit.premium || 0
              })) || [],
              taxComputation: coverType.taxComputation?.map((tax: any) => ({
                code: tax.code || 0,
                premium: tax.premium || 0,
                description: tax.description || ''
              })) || []
            },

            limitPremiumDtos: coverType.limitPremium?.map((limit: any) => ({
              sectCode: limit.sectCode || 0,
              premium: limit.premium || 0
            })) || [],

            taxComputation: coverType.taxComputation?.map((tax: any) => ({
              code: tax.code || 0,
              premium: tax.premium || 0,
              description: tax.description || ''
            })) || []
          };
        }) || [],

        taxes:
          product.taxes?.map((tax: any) => ({
            code: tax.code || 0,
            premium: tax.premium || 0,
            description: tax.description || ''
          })) ||
          [] // from top-level taxComputation if available
      };
    });
  }




  private buildUpdatePremiumPayload(computeResponse: any): any {
    const product = computeResponse.productLevelPremiums?.[0];

    return {
      premiumAmount: product?.riskLevelPremiums?.reduce(
        (sum, risk) => sum + (risk.coverTypeDetails?.[0]?.computedPremium || 0),
        0
      ) || 0,
      productCode: product?.code || 0,
      quotProductCode: 0, // set this if you have it from quotation details
      productPremium: product?.riskLevelPremiums?.[0]?.coverTypeDetails?.[0]?.computedPremium || 0,
      riskLevelPremiums: product?.riskLevelPremiums?.map(risk => ({
        code: risk.code,
        premium: risk.coverTypeDetails?.[0]?.computedPremium || 0,
        limitPremiumDtos: risk.coverTypeDetails?.[0]?.limitPremium?.map(limit => ({
          sectCode: limit.sectCode,
          premium: limit.premium
        })) || []
      })) || [],
      taxes: [] // if compute response gives taxComputation, map it here
    };
  }

  // generatePremiumPayload(quotationData: any): any {
  //   const currentDate = new Date().toISOString();
  //   const product = quotationData.quotationProducts[0];
  //   const risk = product.riskInformation[0];
  //   const riskLimit = risk.riskLimits[0];
  //   const vehicleDetails = risk.scheduleDetails.details.level1;

  //   return {
  //     payload: {
  //       entityUniqueCode: 0,
  //       interfaceType: "QUOTATION",
  //       frequencyOfPayment: quotationData.frequencyOfPayment || "A",
  //       transactionStatus: "EX",
  //       quotationStatus: "Active",
  //       products: [{
  //         code: product.productCode,
  //         expiryPeriod: "Y",
  //         description: product.productName,
  //         withEffectFrom: product.wef,
  //         withEffectTo: product.wet,
  //         risks: [{
  //           code: risk.code.toString(),
  //           propertyId: risk.propertyId,
  //           binderDto: {
  //             code: risk.binderCode || 0,
  //             maxExposure: 0,
  //             currencyCode: quotationData.currencyCode,
  //             currencyRate: quotationData.currencyRate || 0
  //           },
  //           baseCurrencyCode: quotationData.currencyCode,
  //           prorata: "S",
  //           rescueServiceDto: {
  //             code: 0,
  //             shortDescription: "string",
  //             applicationLevel: "string",
  //             rescueServiceTaxDto: {
  //               taxRate: 0,
  //               taxRateDivisionFactor: 0,
  //               taxRateType: "FXD"
  //             }
  //           },
  //           itemDescription: risk.itemDesc,
  //           emlBasedOn: "SI",
  //           noClaimDiscountLevel: risk.ncdLevel || 0,
  //           subclassCoverTypeDto: [{
  //             subclassCode: risk.subclassCode,
  //             description: risk.subclass.description,
  //             coverTypeCode: risk.coverTypeCode,
  //             minimumAnnualPremium: 0,
  //             minimumPremium: riskLimit.minimumPremium || 0,
  //             coverTypeShortDescription: risk.coverTypeShortDescription,
  //             coverTypeDescription: risk.coverTypeDescription,
  //             limits: [{
  //               description: riskLimit.sectionShortDescription,
  //               code: riskLimit.code,
  //               riskCode: risk.code,
  //               calculationGroup: riskLimit.calcGroup,
  //               declarationSection: "Y",
  //               rowNumber: riskLimit.rowNumber,
  //               rateDivisionFactor: riskLimit.rateDivisionFactor,
  //               premiumRate: riskLimit.premiumRate,
  //               rateType: riskLimit.rateType,
  //               sectionType: riskLimit.sectionType,
  //               firstLoss: "Y",
  //               firstLossAmountPercent: "string",
  //               firstLossValue: 0,
  //               limitAmount: risk.value,
  //               freeLimit: riskLimit.freeLimit,
  //               topLocRate: 0,
  //               topLocDivFact: 0,
  //               emlPercentage: 0,
  //               compute: riskLimit.compute,
  //               section: {
  //                 code: riskLimit.sectionCode,
  //                 description: riskLimit.sectionShortDescription,
  //                 limitAmount: risk.value,
  //                 isMandatory: "Y"
  //               },
  //               multiplierRate: riskLimit.multiplierRate,
  //               multiplierDivisionFactor: riskLimit.multiplierDivisionFactor,
  //               minimumPremium: riskLimit.minimumPremium,
  //               annualPremium: 0,
  //               premiumAmount: riskLimit.premiumAmount,
  //               dualBasis: riskLimit.dualBasis,
  //               shortDescription: riskLimit.sectionShortDescription,
  //               sumInsuredRate: 0,
  //               limitPeriod: 0,
  //               indemFstPeriod: 0,
  //               indemPeriod: 0,
  //               indemFstPeriodPercentage: 0,
  //               indemRemPeriodPercentage: 0
  //             }],
  //             computedPremium: 0,
  //             limitPremium: [{
  //               sectCode: riskLimit.sectionCode,
  //               premium: riskLimit.premiumAmount,
  //               description: riskLimit.sectionShortDescription,
  //               limitAmount: risk.value,
  //               isMandatory: "Y",
  //               calculationGroup: riskLimit.calcGroup,
  //               compute: riskLimit.compute,
  //               dualBasis: riskLimit.dualBasis,
  //               rateDivisionFactor: riskLimit.rateDivisionFactor,
  //               rateType: riskLimit.rateType,
  //               rowNumber: riskLimit.rowNumber,
  //               premiumRate: riskLimit.premiumRate,
  //               freeLimit: riskLimit.freeLimit,
  //               sectionType: riskLimit.sectionType,
  //               multiplierRate: riskLimit.multiplierRate,
  //               shortDescription: riskLimit.sectionShortDescription,
  //               sumInsuredRate: 0
  //             }],
  //             taxComputation: [{
  //               code: 0,
  //               premium: 0,
  //               description: "string"
  //             }]
  //           }],
  //           enforceCovertypeMinimumPremium: "Y",
  //           futurePremium: 0,
  //           commissionRate: risk.commissionRate || 0,
  //           effectiveDateWithEffectTo: currentDate,
  //           endorseRemove: "Y",
  //           sumInsured: risk.value,
  //           useOfProperty: vehicleDetails.bodyType === "TRUCK" ? "Commercial" : "Private",
  //           taxes: product.taxInformation?.map(tax => ({
  //             taxRateType: tax.rateType || "SRG",
  //             applicationLevel: "PRODUCT",
  //             code: tax.code || 0,
  //             divisionFactor: tax.divisionFactor || 0,
  //             taxRate: tax.rate || 0,
  //             rangeTo: 0,
  //             rangeFrom: 0,
  //             rateDescription: tax.description || "string",
  //             taxCode: tax.taxCode || "string",
  //             minPremium: tax.minimumPremium || 0,
  //             sumInsured: 0,
  //             premium: 0,
  //             quotationProductCode: 0
  //           })) || [],
  //           subclassSection: {
  //             code: risk.subclassCode
  //           }
  //         }]
  //       }],
  //       currency: {
  //         rate: quotationData.currencyRate || 0
  //       },
  //       dateWithEffectTo: currentDate,
  //       dateWithEffectFrom: currentDate,
  //       underwritingYear: 9999,
  //       age: 0, // Hardcoded as requested
  //       coinsuranceLeader: "Y",
  //       coinsurancePercentage: 0
  //     },
  //     quotationCode: quotationData.code
  //   };
  // }

  navigateToRiskDetails() {
    this.router.navigate(['/home/gis/quotation/quotation-details']).then(r => {
    });
  }

  fetchLimitationOfUse() {
    this.quotationService.fetchLimitationOfUse().subscribe({
      next: (response: any) => {
        log.debug("Limitations of use", response)
        this.limitationOfUse = response._embedded
        // Inject into the subclass formData
        this.activeFormFields = this.activeFormFields.map(field => {
          if (field.name === 'limitationsUse') {
            return {
              ...field,
              selectOptions: this.limitationOfUse.map(limitation => ({
                label: limitation.description,
                value: limitation.description
              }))
            };
          }
          return field;
        });

      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage("Error", error.error.message);
      }
    })
  }
  onOtherDetailSave() {
    log.debug("ADD OTHER SCHEDULE FORM:", this.scheduleOtherDetailsForm.value)
    if (this.scheduleOtherDetailsForm.value) {
      this.createScheduleL2()
    }
  }
  createScheduleL2() {
    // Prepare schedule payload

    const schedulePayloadL2 = this.prepareSchedulePayloadL2();
    log.debug("Schedule payload l2:", schedulePayloadL2)
    this.quotationService.updateSchedule(schedulePayloadL2)
      .subscribe({
        next: (createdScheduleL2: any) => {
          const scheduleListL2 = createdScheduleL2._embedded;
          log.debug("Schedule List l2:", scheduleListL2);
          const modal = bootstrap.Modal.getInstance(this.addotherScheduleModalRef.nativeElement);
          modal.hide();
          this.globalMessagingService.displaySuccessMessage('Success', 'Schedule Level 2 created successfully');
          log.debug("Selected Risk", this.selectedRisk)
          const quotationCode = this.selectedRisk?.quotationCode
          this.fetchQuotationDetails(quotationCode)
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })
  }
  // prepareSchedulePayloadL2() {
  //   const schedule = this.scheduleOtherDetailsForm.value;
  //   log.debug("schedule form values", schedule)
  //   log.debug("selectedSchedule", this.selectedSchedule)
  //   const selectedSchedule = this.selectedSchedule[0]
  //   log.debug("selectedSchedule", selectedSchedule)

  //   // const schedulePayloadL2: scheduleDetails = {
  //   //   details: {
  //   //     level2: {

  //   //       geographicalLimits: schedule.geographicalLimits,
  //   //       deductibleDesc: schedule.deductibleDescription,
  //   //       limitationUse: schedule.limitationsUse,
  //   //       authorisedDriver: schedule.authorisedDriver,
  //   //       garageCapacity: schedule.garageCapacity
  //   //     }
  //   //   },
  //   //   code: selectedSchedule?.code,
  //   //   riskCode: this.quotationRiskCode,
  //   //   transactionType: 'Q',
  //   //   version: selectedSchedule?.version
  //   // };
  //   const levelNumber = this.levelNumber
  //   const scheduleFields = this.allSubclassFormData.filter(
  //     field => Number(field.scheduleLevel) === levelNumber
  //   );

  //   log.debug("Schedule dynamic fields", scheduleFields);

  //   // const schedule = this.scheduleDetailsForm.value;
  //   const riskform =
  //     JSON.parse(sessionStorage.getItem('riskFormDetails')) ||
  //     this.riskDetailsForm.value;

  //   log.debug('SELECTED RISK:', this.selectedRisk);
  //   log.debug("Risk form-session storage:", riskform);

  //   const level2: any = {};

  //   scheduleFields.forEach(field => {
  //     const fieldName = field.name;
  //     const fieldValue =
  //       riskform?.[fieldName] ??
  //       this.scheduleDetailsForm.get(fieldName)?.value ??
  //       null;

  //     level2[fieldName] = fieldValue;
  //   });

  //   schedule.details.level2 = {
  //     ...level2,
  //     coverType: this.selectedRisk.coverTypeDescription,
  //   };
  //   schedule.code = selectedSchedule?.code,
  //     schedule.riskCode = this.quotationRiskCode;
  //   schedule.transactionType = 'Q';
  //   schedule.version = selectedSchedule?.version;

  //   const removeFields = [

  //   ];

  //   removeFields.forEach(field => delete schedule.details.level2[field]);



  //   return schedule;
  // }
  prepareSchedulePayloadL2() {
    const schedule = this.scheduleOtherDetailsForm.value;
    const selectedSchedule = this.selectedSchedule?.[0];
    const levelNumber = this.levelNumber; // e.g. 2, 3, 4, etc.
    const levelKey = `level${levelNumber}`; // e.g. "level2"

    log.debug("Schedule form values", schedule);
    log.debug("Selected Schedule", selectedSchedule);

    // Filter the fields belonging to this schedule level
    const scheduleFields = this.allSubclassFormData.filter(
      field => Number(field.scheduleLevel) === levelNumber
    );

    log.debug("Schedule dynamic fields", scheduleFields);

    // Ensure schedule.details exists
    if (!schedule.details) {
      schedule.details = {};
    }

    // Build the dynamic level data from the schedule form
    const levelData: any = {};

    scheduleFields.forEach(field => {
      const fieldName = field.name;
      const fieldValue = this.scheduleOtherDetailsForm.get(fieldName)?.value ?? null;
      levelData[fieldName] = fieldValue;
    });

    // ✅ Assign everything under dynamic level key (e.g. level2)
    schedule.details[levelKey] = {
      ...levelData,
      coverType: this.selectedRisk?.coverTypeDescription, // keep coverType included
    };

    // ✅ Add extra info at the root level
    schedule.code = selectedSchedule?.code;
    schedule.riskCode = this.quotationRiskCode;
    schedule.transactionType = 'Q';
    schedule.version = selectedSchedule?.version;

    // Optionally remove unwanted fields
    const removeFields: string[] = [];
    removeFields.forEach(field => delete schedule.details[levelKey][field]);

    return schedule;
  }



  //taxes
  createTaxForm() {
    this.taxForm = this.fb.group({
      tax: ['', Validators.required],
      taxType: ['', Validators.required],
      transactionType: ['', Validators.required],
      computationLevel: ['', Validators.required],
      taxMode: ['', Validators.required],
      taxValue: ['', [Validators.required, Validators.pattern(/^\d+(\.\d+)?$/)]],
      override: ['', Validators.required],
      rateDescription: ['', Validators.required],
      tracTrntCode: ['', Validators.required],
      rateType: ['', Validators.required]
    });
  }

  saveTaxesColumnsToSession(): void {
    if (this.taxesColumns) {
      const visibility = this.taxesColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('taxesColumns', JSON.stringify(visibility));
    }
  }

  toggleTaxesColumnVisibility(field: string) {
    this.saveTaxesColumnsToSession();
  }

  toggleTaxesColumns(iconElement: HTMLElement): void {
    this.showTaxes = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showTaxesColumnModal = true;
  }

  setTaxesColumns(tax: any) {
    const excludedFields = [];
    const defaultVisibleTaxesFields = ['rateDescription', 'rate', 'taxAmount', 'rateType',
    ];
    // All keys from the sample
    const keys = Object.keys(tax).filter(key => !excludedFields.includes(key));

    // Separate default fields and the rest
    const defaultFields = defaultVisibleTaxesFields.filter(f => keys.includes(f));
    const otherFields = keys.filter(k => !defaultVisibleTaxesFields.includes(k));

    // Strictly order = defaults first, then others
    const orderedKeys = [...defaultFields, ...otherFields];

    this.taxesColumns = orderedKeys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleTaxesFields.includes(key),
      truncate: defaultVisibleTaxesFields.includes(key),
      filterable: true,
      sortable: true // only these get truncated
    }));



    this.taxesColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

    // Restore from sessionStorage 
    const saved = sessionStorage.getItem('taxesColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.taxesColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    log.debug("taxes Columns", this.taxesColumns);
  }

  openEditTaxModal() {
    if (!this.selectedProduct) {
      this.globalMessagingService.displayErrorMessage('Missing Product', 'Please select a product before editing tax.');
      return;
    }
    this.showEditTaxModal = true;
  }

  closeEditTaxModal() {
    this.showEditTaxModal = false;
  }


  filterTable(event: Event, field: string, tableRef: any) {
    const input = (event.target as HTMLInputElement).value;
    tableRef.filter(input, field, 'contains');
  }

  getProductTaxes() {
    log.debug('getProductTaxes has been called ', this.selectedProduct)
    log.debug('SELECTED RISK', this.selectedRisk)
    const productCode = this.selectedProduct?.productCode
    const subClassCode = this.selectedRisk?.subclassCode
    if (productCode && subClassCode) {
      this.quotationService.getTaxes(productCode, subClassCode).subscribe(res => {

        this.taxes = res;
        log.debug('Taxes', this.taxes)
        // if (this.taxes.length > 0) {
        //   this.setTaxesColumns(this.taxes[0]);
        // }
        return;
      });
    } else {
      console.warn("Missing productCode or subClassCode for a risk:",);
    }


  }

  getTransactionTypes() {

    this.quotationService.getTransactionTypes().subscribe({
      next: (response) => {
        this.transactionTypes = response || [];

        log.debug('transactionTypes', this.transactionTypes)
      },
      error: (error) => {
        log.error('Error fetching transaction types:', error);
      }
    })

  }


  addTax() {

    Object.keys(this.taxForm.controls).forEach(field => {
      const control = this.taxForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });

    if (this.taxForm.invalid || !this.selectedProduct) {
      this.globalMessagingService.displayErrorMessage('Missing Info', 'Please complete the form before submitting');
      return;
    }

    const formValues = this.taxForm.value;
    const taxValue = parseFloat(formValues.taxValue);

    let rate = 0;
    let taxAmount = 0;

    if (formValues.taxMode === 'Rate') {
      rate = taxValue;
      taxAmount = 0;
    } else if (formValues.taxMode === 'Amount') {
      rate = 0;
      taxAmount = taxValue;
    }
    const payload: TaxPayload = {
      code: 0,
      rateDescription: formValues.rateDescription,
      rate: rate,
      rateType: formValues.rateType,
      taxAmount: taxAmount,
      productCode: this.selectedProduct.productCode,
      quotationCode: Number(this.quotationCode),
      transactionCode: formValues.tracTrntCode,
      renewalEndorsement: '',
      taxRateCode: formValues.taxRateCode,
      levelCode: formValues.computationLevel,
      taxType: formValues.taxType,
      riskProductLevel: ''
    };

    // const payload: TaxPayload = {
    //   code: 0,
    //   rateDescription: formValues.rateDescription,
    //   rate: parseFloat(formValues.taxValue),
    //   rateType: formValues.rateType,
    //   taxAmount: formValues.taxValue,
    //   productCode: this.selectedProduct.productCode,
    //   quotationCode: Number(this.quotationCode),
    //   transactionCode: formValues.tracTrntCode,
    //   renewalEndorsement: '',
    //   taxRateCode: formValues.taxRateCode,
    //   levelCode: formValues.computationLevel,
    //   taxType: formValues.taxType,
    //   riskProductLevel: ''
    // };

    log.debug('Payload to add:', payload);
    log.debug('quotationCode', this.quotationCode)
    const quotationCode = Number(this.quotationCode)

    this.quotationService.addTaxes(quotationCode, this.selectedProduct.code, [payload]).subscribe({
      next: (res) => {
        res && this.fetchQuotationDetails(quotationCode);
        this.globalMessagingService.displaySuccessMessage('Success', 'Tax added successfully');
        this.showTaxModal = false;
        this.taxForm.reset();
        this.selectedTax = null;
        this.isEditingTax = false;


      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add tax');
      }
    });

  }

  openTaxModal(tax: any, forceAddMode: boolean = false): void {
    console.log('--- openTaxModal Triggered ---');
    console.log('Tax passed in:', tax);
    console.log('forceAddMode:', forceAddMode);


    const isEditing = !forceAddMode && !!tax && !!tax.code;
    console.log('Is Editing:', isEditing);

    this.taxForm.reset();

    if (tax?.taxRateType ?? tax?.taxCode) {
      const value = tax.taxRateType ?? tax.taxCode;
      if (!this.taxTypes.find(t => t.value === value)) {
        this.taxTypes.unshift({ label: tax.RateType || value, value: value });
        this.taxTypes = [...this.taxTypes];
      }
    }


    if (tax?.transactionType) {
      const code = String(tax.transactionType);
      if (!this.transactionTypes.find(t => t.code === code)) {
        this.transactionTypes.unshift({ code: code, description: code });
        this.transactionTypes = [...this.transactionTypes];
      }
    }

    if (isEditing) {
      console.log('Patching form for Add mode with values:', {
        tax: tax.code,
        taxType: tax.taxRateType ?? tax.taxCode,
        transactionType: tax.transactionType,
        computationLevel: tax.computationLevel,
        taxMode: tax.taxMode,
        taxRateCode: tax.taxRateCode,
        taxValue: tax.taxRate,
        override: tax.override,
        rateDescription: tax.description,
        rateType: tax.taxRateType,
        tracTrntCode: tax.code
      });

      this.taxForm.patchValue({
        tax: tax.code,
        taxType: tax.taxRateType ?? tax.taxCode,
        transactionType: tax.transactionType,
        computationLevel: tax.computationLevel,
        taxMode: tax.taxMode,
        taxRateCode: tax.taxRateCode,
        taxValue: tax.taxRate,
        override: tax.override,
        rateDescription: tax.description,
        rateType: tax.taxRateType,
        tracTrntCode: tax.code
      });

    } else {
      console.log('Initializing ADD mode with default/empty values');
      this.taxForm.patchValue({
        tax: null,
        taxType: null,
        transactionType: null,
        computationLevel: null,
        taxMode: null,
        taxRateCode: null,
        taxValue: null,
        override: null,
        rateDescription: null,
        rateType: null,
        tracTrntCode: null
      });
    }

    // Log the patched form values for verification
    console.log('Patched Tax Form Values:', this.taxForm.value);

    // Show the modal
    this.showTaxModal = true;
  }

  openEditTaxModalFromDB(taxToEdit: any) {
    console.log('--- openEditTaxModalFromDB Triggered ---', taxToEdit);

    if (!taxToEdit) {
      console.error('No valid tax object found!');
      return;
    }

    // Store the selected tax for update
    this.selectedTax = taxToEdit;
    this.isEditingTax = true;

    const patchedValues = {
      tax: taxToEdit.code ?? '',
      taxType: taxToEdit.taxType ?? '',
      tracTrntCode: taxToEdit.transactionCode ?? '',
      computationLevel: taxToEdit.levelCode ?? '',
      taxMode: taxToEdit.rateType === 'FXD' ? 'Amount' : 'Rate',
      taxValue: taxToEdit.rate ?? '',
      taxAmount: taxToEdit.taxAmount ?? '',
      rateDescription: taxToEdit.rateDescription ?? '',
      rateType: taxToEdit.rateType ?? '',
      taxRateCode: taxToEdit.taxRateCode ?? ''
    };

    console.log('Patched Tax Form Values for Edit:', patchedValues);

    this.taxForm.patchValue(patchedValues);
    this.showTaxModal = true;
  }


  handleNextClick() {
    if (!this.selectedTax) {
      this.globalMessagingService.displayErrorMessage(
        'Selection Required',
        'Please select a tax to proceed'
      );
      return;
    }

    const selected = this.selectedTax;

    this.closeEditTaxModal();


    setTimeout(() => {
      this.openTaxModal({
        applicationLevel: selected.applicationLevel,
        code: selected.code,
        description: selected.description,
        divisionFactor: selected.divisionFactor,
        qpCode: selected.qpCode,
        taxCode: selected.taxCode,
        taxRate: selected.taxRate,
        taxRateType: selected.taxRateType,
        transactionType: selected.transactionType
      });
    }, 100);
  }

  closeTaxModal() {
    this.showTaxModal = false;
  }

  taxTypes = [
    { label: 'UW Tax', value: 'UW Tax' },
    { label: 'U/W Comm WHTX', value: 'U/W Comm WHTX' },
    { label: 'Premium Tax', value: 'Premium Tax' },
    { label: 'Service Fee', value: 'Service Fee' },
    { label: 'Stamp Duty', value: 'Stamp Duty' },
    { label: 'Extras', value: 'Extras' },
    { label: 'PolicyHolder Fund', value: 'PolicyHolder Fund' },
  ];
  openEditTaxModalFromAdd() {

    this.showTaxModal = false;


    this.showEditTaxModal = true;
  }

  updateTax() {
    if (!this.selectedTax) {
      console.error('No selected tax to update');
      return;
    }

    const formValue = this.taxForm.value;
    const taxValue = parseFloat(formValue.taxValue);

    let rate = 0;
    let taxAmount = 0;

    if (formValue.taxMode === 'Rate') {
      rate = taxValue;
      taxAmount = 0;
    } else if (formValue.taxMode === 'Amount') {
      rate = 0;
      taxAmount = taxValue;
    }

    const payload: TaxPayload = {
      code: 0,
      rateDescription: formValue.rateDescription,
      rate: rate,
      rateType: formValue.rateType,
      taxAmount: taxAmount,
      productCode: this.selectedProduct.productCode,
      quotationCode: Number(this.quotationCode),
      transactionCode: formValue.tracTrntCode,
      renewalEndorsement: '',
      taxRateCode: formValue.taxRateCode,
      levelCode: formValue.computationLevel,
      taxType: formValue.taxType,
      riskProductLevel: ''
    };
    console.log('Payload to update:', payload);

    this.quotationService.updateTaxes(payload).subscribe({
      next: (res) => {
        this.fetchQuotationDetails(this.quotationCode);
        this.globalMessagingService.displaySuccessMessage('Success', 'Tax updated successfully');
        this.taxForm.reset();
        this.isEditingTax = false;
        this.selectedTax = null;
        this.showTaxModal = false;
      },
      error: (err) => {
        console.error('Error updating tax:', err);
        this.globalMessagingService.displayErrorMessage('Error', err?.error?.message || 'Failed to update tax');
      }
    });
  }

  saveTax() {
    // Mark controls as touched to show errors
    Object.values(this.taxForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });

    console.log('Form values before save:', this.taxForm.value);
    console.log('Form valid?', this.taxForm.valid);

    if (!this.taxForm.valid) {
      this.globalMessagingService.displayErrorMessage('Missing Info', 'Please complete the form before submitting');
      return;
    }

    if (this.isEditingTax) {
      this.updateTax();
    } else {
      this.addTax();
    }
  }



  handleAddTaxClick() {
    this.openTaxModal(this.selectedTax);
    this.getTransactionTypes();
    log.debug("selectedProduct", this.selectedProduct)
    if (this.selectedProduct?.code) {
      this.getProductTaxes();
    }
  }

  loadTaxDetails() {
    if (!this.selectedProduct) {
      log.debug('[RiskDetailsComponent] No product selected, cannot load tax details.');
      return;
    }

    if (!this.quotationView || !this.quotationView.quotationProducts) {
      log.debug('[RiskDetailsComponent] Quotation view or products not loaded yet.');
      return;
    }

    const quotationProductCode = this.selectedProduct.code;
    log.debug("[RiskDetailsComponent] Loading Tax Details for product quotation code:", quotationProductCode);

    const matchingProduct = this.quotationView.quotationProducts.find(
      (product: any) => product.code === quotationProductCode
    );
    log.debug("Tax Details:", this.taxDetails);
    if (matchingProduct) {
      this.taxDetails = matchingProduct.taxInformation;
    } else {
      log.debug("No matching product found for code:", quotationProductCode);
    }
  }

  deleteTaxes(tax: any) {
    this.quotationService.deleteProductTaxes(tax.code).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Tax successfully deleted');
        this.taxDetails = this.taxDetails.filter(t => t.code !== tax.code);

        // Rebuild dynamic columns based on updated taxDetails
        if (this.taxDetails.length > 0) {
          this.setTaxesColumns(this.taxDetails[0]);
        } else {
          this.taxesColumns = []; // No taxes left
        }
      },
      error: (err) => {
        console.error('Delete failed:', err);
      }
    });
  }


  // editOtherDetails(tab: any) {
  //   this.isEditScheduleMode = true
  //   log.debug('Selected schedule other details', tab)
  //   log.debug("DYNAMIC SUBCLASS FORM FIELDS", this.dynamicSubclassFormFields)
  //   this.activeModalTab = tab;
  //   this.activeFormFields = this.dynamicSubclassFormFields.filter(
  //     field => Number(field.scheduleLevel) === tab.levelNumber
  //   );

  //   // Build reactive form
  //   const group: { [key: string]: any } = {};
  //   this.activeFormFields.forEach(field => {
  //     group[field.name] = new FormControl('', field.isMandatory === 'Y' ? Validators.required : null);
  //   });

  //   this.scheduleOtherDetailsForm = this.fb.group(group);
  //   log.debug("Schedule other details client before", this.scheduleOtherDetailsForm.value)

  //   if (!this.scheduleOtherDetailsForm.contains('authorisedDriver')) {
  //     this.scheduleOtherDetailsForm.addControl('authorisedDriver', new FormControl('', Validators.required));
  //   }
  //   this.scheduleOtherDetailsForm.patchValue({ authorisedDriver: this.clientName });
  //   log.debug("Schedule other details client", this.scheduleOtherDetailsForm.value)
  //   // Show Bootstrap modal
  //   setTimeout(() => {
  //     const modalElement = document.getElementById('addOtherDetailsModal');
  //     if (modalElement) {
  //       const bsModal = new bootstrap.Modal(modalElement);
  //       bsModal.show();
  //     }
  //   });
  //   this.fetchLimitationOfUse();
  // }
  editOtherDetails(tab: any) {
    this.isEditScheduleMode = true;
    log.debug('Selected schedule other details', this.selectedSchedule);
    log.debug('current state of schduler other details:', this.scheduleOtherDetailsForm)
    this.activeModalTab = tab;
    this.activeFormFields = this.dynamicSubclassFormFields.filter(
      field => Number(field.scheduleLevel) === tab.levelNumber
    );

    // Build reactive form
    const group: { [key: string]: any } = {};
    this.activeFormFields.forEach(field => {
      group[field.name] = new FormControl(
        '',
        field.isMandatory === 'Y' ? Validators.required : null
      );
    });

    this.scheduleOtherDetailsForm = this.fb.group(group);

    // // Add driver if missing
    // if (!this.scheduleOtherDetailsForm.contains('authorisedDriver')) {
    //   this.scheduleOtherDetailsForm.addControl(
    //     'authorisedDriver',
    //     new FormControl('', Validators.required)
    //   );
    // }
    const authorisedDriverFieldPresent = this.dynamicSubclassFormFields.some(
      field => field.name === 'authorisedDriver'
    );

    if (!this.scheduleOtherDetailsForm.contains('authorisedDriver') && authorisedDriverFieldPresent) {
      this.scheduleOtherDetailsForm.addControl('authorisedDriver', new FormControl('', Validators.required));
      this.scheduleOtherDetailsForm.patchValue({ authorisedDriver: this.clientName });

    }
    // ✅ Pick the correct level's details
    const levelKey = `level${tab.levelNumber}`;
    this.levelNumber = tab.levelNumber
    const rawLevelData = this.selectedSchedule[0]?.[0]?.details?.[levelKey] || {};
    log.debug("Level key:", levelKey);
    log.debug("Raw Level data:", rawLevelData);

    // Normalize before patch
    // const levelData = this.normalizeLevelData(rawLevelData);
    const levelData = this.normalizeLevelData(rawLevelData, tab.levelNumber);
    log.debug("Normalized Level data:", levelData);
    this.scheduleOtherDetailsForm.patchValue(levelData);

    // If you still want to force clientName into authorisedDriver:
    this.scheduleOtherDetailsForm.patchValue({ authorisedDriver: this.clientName });

    log.debug("Schedule other details after patch", this.scheduleOtherDetailsForm.value);

    // Show Bootstrap modal
    setTimeout(() => {
      const modalElement = document.getElementById('addOtherDetailsModal');
      if (modalElement) {
        const bsModal = new bootstrap.Modal(modalElement);
        bsModal.show();
      }
    });

  }

  // normalizeLevelData = (data: any) => ({
  //   geographicalLimits: data.geographicalLimits,
  //   deductibleDescription: data.deductibleDesc,
  //   limitationsUse: data.limitationUse,
  //   authorisedDriver: data.authorisedDriver,
  //   garageCapacity: data.garageCapacity,
  // });
  normalizeLevelData(data: any, levelNumber: number): any {
    // Get the fields defined for this level from allSubclassFormData
    log.debug("levelNumber", levelNumber)
    log.debug("levelNumber", this.allSubclassFormData)
    const scheduleFields = this.allSubclassFormData.filter(
      field => Number(field.scheduleLevel) === levelNumber
    );

    const normalizedData: any = {};

    // Loop through only the fields for this level
    scheduleFields.forEach(field => {
      const fieldName = field.name;
      if (data.hasOwnProperty(fieldName)) {
        normalizedData[fieldName] = data[fieldName];
      }
    });

    return normalizedData;
  }


  onOtherDetailUpdate() {
    log.debug("Editing schedules form values:", this.scheduleOtherDetailsForm.value)
    if (this.scheduleOtherDetailsForm.value) {
      this.createScheduleL2()
    }
  }

  normalizeOtherDetailsData(levelData: any[]): any[] {
    return levelData.map(row => ({
      ...row,
      limitationsUse: row.limitationUse,
      deductibleDescription: row.deductibleDesc
    }));
  }

  onLogBookSelected(selectedFile: any) {
    const file = selectedFile
    const reader = new FileReader();

    reader.onload = () => {
      // Convert to base64 string (remove prefix like "data:application/pdf;base64,")
      const base64String = (reader.result as string).split(',')[1];

      const payload = {
        assistant_id: "DocumentHubAgent",
        if_not_exists: "create",
        config: {
          configurable: {
            score_extraction: true,
            strict: false
          }
        },
        input: {
          schema: {
            $schema: "https://json-schema.org/draft/2020-12/schema",
            title: "KenyanLogbook",
            type: "object",
            properties: {
              reg_number: {
                type: "string",
                description: "Vehicle registration number "
              },
              risk_description: {
                type: "string",
                description: "Risk description associated with the vehicle"
              },
              vehicle_make: {
                type: "string",
                description: "Manufacturer or brand of the vehicle "
              },
              vehicle_model: {
                type: "string",
                description: "Model of the vehicle "
              },
              vehicle_value: {
                type: "number",
                description: "Declared value of the vehicle in Kenyan Shillings"
              },
              body_type: {
                type: "string",
                description: "Type of vehicle body "
              },
              engine_number: {
                "type": "string",
                "description": "Unique identifier stamped on the engine of the vehicle"
              },
              chassis_number: {
                "type": "string",
                "description": "Unique identifier stamped on the chassis/frame of the vehicle"
              },
              color: {
                "type": "string",
                "description": "Color of the vehicle "
              },
              seating_capacity: {
                "type": "integer",
                "description": "Number of passengers the vehicle can carry"
              },
              cubic_capacity: {
                "type": "integer",
                "description": "Engine cubic capacity in cc"
              },
              year_of_manufacture: {
                "type": "integer",
                "description": "Year the vehicle was manufactured "
              }
            },
            required: ["reg_number", "vehicle_make", "vehicle_value", "body_type", 'chassis_number',
              "vehicle_model", "engine_number", "year_of_manufacture", "seating_capacity", "color"
            ],
            additionalProperties: false
          },
          files: [base64String]   // 👈 send BASE64 here instead of URL
        }
      }

      this.showAiImportModal = true;
      this.uploadProgress = 10;
      setTimeout(() => this.uploadProgress = 30, 500);

      // this.quotationService.readScannedDocuments(payload).subscribe({
      //   next: (res) => {
      //     this.uploadProgress = 60;

      //     const data = res.data;

      //     this.uploadFile()
      //       .then(() => {
      //         this.uploadProgress = 75;
      //         return this.patchUploadedData(data);
      //       })
      //       .then(() => {
      //         this.uploadProgress = 90;

      //         setTimeout(() => {
      //           this.uploadProgress = 100;
      //           // this.globalMessagingService.displaySuccessMessage(
      //           //   'Success',
      //           //   'Successfully scanned Logbook'
      //           // );

      //           setTimeout(() => this.showAiImportModal = false, 500);
      //         }, 500);
      //       });
      //   },
      //   error: (err) => {
      //     this.globalMessagingService.displayErrorMessage(
      //       'Upload Failed',
      //       err?.error?.message || 'An error occurred while uploading logbook'
      //     );
      //     this.showAiImportModal = false;
      //   }
      // });

      this.quotationService.readScannedDocuments(payload).subscribe({
        next: (res) => {
          if (res?.__error__ || res?.evals.score < 7) {
            this.uploadProgress = 0;
            this.aiErrorMessage = "File doesn't match the required format. Please upload a logbook to continue.";
            this.selectedFile = null;
            return;
          }

          this.uploadProgress = 60;

          const data = res.data;

          this.uploadFile()
            .then(() => {
              this.uploadProgress = 75;
              return this.patchUploadedData(data);
            })
            .then(() => {
              this.uploadProgress = 90;

              setTimeout(() => {
                this.uploadProgress = 100;
                // this.globalMessagingService.displaySuccessMessage(
                //   'Success',
                //   'Successfully scanned Logbook'
                // );

                setTimeout(() => this.showAiImportModal = false, 500);
              }, 500);
            });
        },
        error: (err) => {
          this.aiErrorMessage =
            err?.error?.message || "An unexpected error occurred while uploading logbook.";
          this.uploadProgress = 0;
          this.showAiImportModal = false;
        }
      });



    };

    reader.readAsDataURL(file);
  }
  onDismissModal() {
    this.showAiImportModal = false;
    this.aiErrorMessage = null;
    this.uploadProgress = 0;
  }
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.validateAndSetFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.validateAndSetFile(file);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  validateAndSetFile(file: File): void {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Check if file exists
    if (!file) {
      return;
    }

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage = 'File size exceeds the maximum limit of 10MB';
      return;
    }

    // Check file type (optional - you can customize accepted types)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png'
    ];


    if (!allowedTypes.includes(file.type)) {
      this.errorMessage =
        'Please upload a valid document type (PDF, DOC, DOCX, TXT, PNG, JPG, JPEG)';
      return;
    }

    this.selectedFile = file;
    // this.selectedFile && this.uploadFile();
    this.onLogBookSelected(this.selectedFile)
  }

  // removeFile(): void {
  //   this.selectedFile = null;
  //   this.errorMessage = '';
  //   this.riskDetailsForm.reset()
  // }
  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';

    const keepValues = {
      insureds: this.riskDetailsForm.get('insureds')?.value,
      subclass: this.riskDetailsForm.get('subclass')?.value,
      coverFrom: this.riskDetailsForm.get('coverFrom')?.value,
      coverTo: this.riskDetailsForm.get('coverTo')?.value,
      premiumBand: this.riskDetailsForm.get('premiumBand')?.value
    };

    this.riskDetailsForm.reset();

    this.riskDetailsForm.patchValue(keepValues);
  }

  // uploadFile(): void {
  //   if (!this.selectedFile) return;

  //   this.uploading = true;
  //   this.errorMessage = '';
  //   this.successMessage = '';


  //   setTimeout(() => {
  //     this.uploading = false;
  //     // this.successMessage = 'Log book uploaded successfully!';

  //     setTimeout(() => {
  //       // this.selectedFile = null;
  //     }, 2000);
  //   }, 2000);
  // }
  uploadFile(): Promise<void> {
    if (!this.selectedFile) return Promise.resolve();

    this.uploading = true;
    this.errorMessage = '';
    this.successMessage = '';

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.uploadProgress < 90) {   // stop at 90 until API confirms
          this.uploadProgress += 5;
        } else {
          clearInterval(interval);
          this.uploading = false;
          resolve();
        }
      }, 300);
    });
  }


  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
  getFileIcon(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return 'pi pi-file-pdf';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'pi pi-image';
      case 'txt':
      case 'log':
        return 'pi pi-file';
      default:
        return 'pi pi-file'; // fallback
    }
  }


  patchUploadedData(data: any): Promise<void> {
    return new Promise((resolve) => {
      this.logBookUploaded = true;

      const uploadedVehicleMake = this.vehicleMakeList?.find(
        make => make.name.toLowerCase().includes(data.vehicle_make.toLowerCase())
      );

      if (uploadedVehicleMake) {
        this.getVehicleModel(uploadedVehicleMake.code).then(() => {
          const uploadedVehicleModel = this.vehicleModelDetails?.find(
            model => data.vehicle_model.toLowerCase().includes(model.name.toLowerCase())
          );

          this.riskDetailsForm.patchValue({ vehicleModel: uploadedVehicleModel?.code });
          this.riskDetailsForm.patchValue({ vehicleMake: uploadedVehicleMake?.code });

          this.selectedVehicleModelName = uploadedVehicleModel?.name;
          this.selectedVehicleMakeName = uploadedVehicleMake?.name;
          this.vehiclemakeModel = this.selectedVehicleMakeName + ' ' + this.selectedVehicleModelName;

          if (this.vehiclemakeModel) {
            this.riskDetailsForm.patchValue({ riskDescription: this.vehiclemakeModel });
          }

          this.finishPatching(data);
          resolve(); // ✅ guaranteed to fire after vehicle model is loaded
        });
      } else {
        this.finishPatching(data);
        resolve(); // ✅ still resolve if no make match
      }
    });
  }


  private finishPatching(data: any) {
    const uploadedVehicleColor = this.motorColorsList.find(
      color => data.color.toLowerCase().includes(color.description.toLowerCase())
    );

    let uploadedBodyType = this.bodytypesList.find(
      bodyType => data.body_type.toLowerCase().includes(bodyType.description.toLowerCase())
    );

    if (!uploadedBodyType) {
      const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      uploadedBodyType = this.bodytypesList.find(
        bodyType => normalize(data.body_type).includes(normalize(bodyType.description))
      );
    }

    this.riskDetailsForm.patchValue({
      registrationNumber: data?.reg_number,
      value: data?.vehicle_value,
      yearOfManufacture: data?.year_of_manufacture,
      cubicCapacity: data?.cubic_capacity,
      seatingCapacity: data?.seating_capacity,
      bodyType: uploadedBodyType?.description,
      color: uploadedVehicleColor?.code,
      chasisNumber: data?.chassis_number,
      engineNumber: data?.engine_number
    });
  }
  addRiskDocuments(selectedFile: any) {
    log.debug("Selected risk", this.quotationDetails)
    log.debug("Selected file", this.selectedFile)
    const selectedRiskCode = this.selectedRisk.code
    const file = selectedFile
    const reader = new FileReader();

    reader.onload = () => {
      // Convert to base64 string (remove prefix like "data:application/pdf;base64,")
      const base64String = (reader.result as string).split(',')[1];
      // const clientName = (this.clientDetails?.firstName ?? '') + ' ' + (this.clientDetails?.lastName ?? '')
      let riskDocPayload: RiskDmsDocument = {

        docType: file.type,
        docData: base64String,
        originalFileName: file.name,
        riskID: selectedRiskCode.toString()

      }

      this.quotationService.uploadRiskDocs(riskDocPayload).subscribe({
        next: (res: any) => {
          log.info(`document uploaded successfully!`, res);
          // this.globalMessagingService.displaySuccessMessage('Success', 'Document uploaded successfully');

        },
        error: (err) => {
          log.info(`upload failed!`, err)
        }
      });
    }
    reader.readAsDataURL(file);
  }
  onNcdStatusChange(event: any): void {
    const value = event.target.value;
    this.ncdStatusSelected = value === 'Y';
    log.debug('NCD Status selected:', value, ' -> ncdStatusSelected:', this.ncdStatusSelected);
  }
  fetchTerritories() {
    this.territoryService.getAllTerritories().subscribe({
      next: (res) => {
        this.territories = res


      },
      error: (err) => {
        this.globalMessagingService.displayErrorMessage('Error:', 'Fetching territories failed')
      }
    });
  }

  // Commented out - inline editing not needed at the moment

  markCommissionDirty(commission: any): void {
    commission._dirty = true;
  }
  hasCommissionChanges(): boolean {
    return this.addedCommissions?.some(c => c._dirty) ?? false;
  }

  startEditing(commission: any): void {
    this.editingRowCode = commission.code;
  }

  resetEditing(): void {
    this.editingRowCode = null;
  }

  updateRiskCommissions(): void {
    const modified = this.addedCommissions.filter(c => c._dirty);
    log.debug("Modified-comm", modified)
    if (!modified.length) return;

    modified.forEach(comm => {
      const payload: RiskCommissionDto = {
        code: comm.code,
        quotationRiskCode: comm.quotationRiskCode,
        quotationCode: comm.quotationCode,


        agentCode: comm.agentDto?.id ?? comm.agentCode,

        transCode: comm.transCode,
        transDescription: comm.transDescription,
        accountCode: comm.accountCode,
        trntCode: comm.trntCode,
        group: comm.group,


        usedRate: comm.usedRate,
        setupRate: comm.setupRate,
        discRate: comm.discRate,
        discType: comm.discType,
        amount: Number(comm.amount),
        discAmount: comm.discAmount,
        accountType: comm.accountType,
        withHoldingRate: comm.withHoldingRate,
        withHoldingTax: comm.withHoldingTax
      };

      log.debug("payload to update", payload)

      this.quotationService.updateRiskCommission(payload).subscribe({
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Commission updated successfully'
          );

          // ✅ ensure row no longer marked dirty
          comm._dirty = false;

          // ✅ immediately reload data from DB so user sees persisted values
          this.fetchAddedCommissions();
        },
        error: (err) => {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to update commission'
          );
        }
      });
    });
  }

  prepareDeleteCommission(commission: any): void {
    this.commissionToDelete = commission;
  }

  deleteRiskCommission(codeToDelete: number): void {
    this.quotationService.deleteRiskCommission(codeToDelete).subscribe({
      next: (res) => {

        this.addedCommissions = this.addedCommissions.filter(
          (c) => c.code !== codeToDelete
        );


        this.globalMessagingService.displaySuccessMessage(
          'Success:',
          'Commission deleted successfully'
        );
      },
      error: (err) => {
        log.error('Delete error:', err);

        this.globalMessagingService.displayErrorMessage(
          'Error:',
          'Failed to delete commission'
        );
      }
    });
  }

  onDateChange(): void {
    log.debug('on date change called')
    const coverFrom = this.riskDetailsForm.get('coverFrom')?.value;
    this.updateCoverToDate(coverFrom)
    const coverTo = this.riskDetailsForm.get('coverTo')?.value;

    if (coverFrom && coverTo) {
      const coverDays = this.getCoverDays(coverFrom, coverTo);

      if (this.riskDetailsForm.contains('coverDays')) {
        this.riskDetailsForm.patchValue({ coverDays });
      }
    }
  }
  getCoverDays(coverFrom: string | Date, coverTo: string | Date): number {
    const fromDate = new Date(coverFrom);
    const toDate = new Date(coverTo);
    log.debug("Cover from:", fromDate)
    log.debug("Cover to:", toDate)

    const diffInMs = toDate.getTime() - fromDate.getTime();

    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays;
  }

  makeReadyExceptions(quotationCode: number) {
    this.quotationService.generateExceptions(quotationCode).subscribe({
      next: (res) => {
        const hasExceptions = res._embedded.taskName
        const ticketStatus = res._embedded.taskName
        log.debug("Ticket status:", ticketStatus)
        sessionStorage.setItem('ticketStatus', ticketStatus);
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully made ready.')

        if (hasExceptions == 'Authorize Exception') {
          this.quotationService.fetchExceptions('Q', quotationCode).subscribe({
            next: (res: any) => {
              this.exceptionsData = res
              log.debug('exceptionData', this.exceptionsData);
              sessionStorage.setItem('exceptionsData', JSON.stringify(this.exceptionsData))
              this.router.navigate(['/home/gis/quotation/quotation-summary']);
              this.globalMessagingService.displaySuccessMessage(
                'Success:',
                'Exceptions fetched successfully'
              );
            },
            error: (err) => {
              log.error('fetch exception error:', err);

              this.globalMessagingService.displayErrorMessage(
                'Error:',
                'Failed to fetch  exceptions'
              );
            }
          });
        } else {
          this.router.navigate(['/home/gis/quotation/quotation-summary']);

        }



      },
      error: (error) => {
        log.debug("error", error)
        const apiError = error.error;
        const message =
          apiError?.debugMessage ??
          apiError?.message ??
          apiError?.errors?.[0] ??
          apiError?.developerMessage ??
          'Failed to send message';

        this.globalMessagingService.displayErrorMessage('error', message);
      }
    });

  }
  fetchsubclassDynamicFields(subclassCode: number) {
    const riskFieldDescription = `detailed-risk-subclass-form-${subclassCode}`;
    this.quotationService.getFormFields(riskFieldDescription).subscribe({
      next: (res) => {
        const fields = res?.[0]?.fields || [];
        this.dynamicSubclassFormFields = fields
        this.subclassFormContent = res;
        this.subclassFormData = fields.filter(field => Number(field.scheduleLevel) === 1);
        this.allSubclassFormData = fields.filter(field => field.applicableLevel === 'S');


        sessionStorage.setItem('dynamicSubclassFormField', JSON.stringify(fields));
        log.debug("Dynamic subclass fields on mynew method", fields)


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

  /**
   * Format date for display in templates
   * Returns formatted date string or placeholder if date is null/invalid
   */
  formatDateDisplay(date: any, placeholder: string = '—'): string {
    if (!date) {
      return placeholder;
    }

    try {
      const rawDate = new Date(date);

      // Check if date is valid
      if (isNaN(rawDate.getTime())) {
        return placeholder;
      }

      // Use the date format from session storage
      const formattedDate = this.datePipe.transform(rawDate, this.dateFormat);
      return formattedDate || placeholder;
    } catch (error) {
      log.error('Error formatting date for display:', error);
      return placeholder;
    }
  }

  /**
   * Check if a field name represents a date field
   * Used to determine if formatting should be applied
   */
  isDateField(fieldName: string): boolean {
    const dateFieldPatterns = [
      'date', 'Date', 'from', 'From', 'to', 'To',
      'wef', 'wet', 'expiry', 'Expiry', 'prepared', 'Prepared'
    ];
    return dateFieldPatterns.some(pattern => fieldName.includes(pattern));
  }

}
