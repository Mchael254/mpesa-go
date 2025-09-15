import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IntermediaryService } from "../../../../../entities/services/intermediary/intermediary.service";
import { ProductService } from "../../../../services/product/product.service";
import { AuthService } from "../../../../../../shared/services/auth.service";
import { BranchService } from "../../../../../../shared/services/setups/branch/branch.service";
import { BankService } from "../../../../../../shared/services/setups/bank/bank.service";
import { Logger, UtilService } from "../../../../../../shared/services";
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import {
  GroupedUser,
  LimitsOfLiability,
  OtpResponse,
  ProductClauses,
  ProductDetails,
  QuotationDetails,
  QuotationProduct,
  ReportParams,
  ReportResponse,
  RiskInformation,
  ScheduleDetails,
  scheduleDetails,
  ShareQuoteDTO,
  SubclassSectionPeril,
  TaxDetails,
  TaxInformation,
  TaxPayload
} from '../../data/quotationsDTO';
import { EmailDto } from "../../../../../../shared/data/common/email-dto";
import { Table } from 'primeng/table';
import { ClaimsService } from '../../../claim/services/claims.service';
import * as bootstrap from 'bootstrap';
import { riskClauses } from '../../../setups/data/gisDTO';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NotificationService } from '../../services/notification/notification.service';
import { NgxCurrencyConfig } from 'ngx-currency';

type ShareMethod = 'email' | 'sms' | 'whatsapp';

const log = new Logger('QuotationSummaryComponent');

interface FileItem {
  file: File;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-quotation-summary',
  templateUrl: './quotation-summary.component.html',
  styleUrls: ['./quotation-summary.component.css']
})
export class QuotationSummaryComponent implements OnInit, OnDestroy {
  quotationAuthorized: boolean;
  fileUrl: SafeResourceUrl;


  viewClientProfile() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('closebutton') closebutton;
  @ViewChild('dt') table!: Table;
  @ViewChild('reassignTable') reassignTable!: any;
  @ViewChild('closeReassignButton') closeReassignButton: ElementRef;
  @ViewChild('reassignQuotationModal') reassignQuotationModalElement!: ElementRef;
  @ViewChild('rejectQuotationModal') rejectQuotationModalElement!: ElementRef;
  @ViewChild('chooseClientReassignModal') chooseClientReassignModal!: ElementRef;
  @ViewChild('productClauseTable') productClauseTable: any;
  @ViewChild('riskClausesTable') riskClausesTable: any;
  @ViewChild('consentModal') consentModal!: ElementRef;
  @ViewChild('viewDocumentsModal') viewDocumentsModal!: ElementRef;

  private modals: { [key: string]: bootstrap.Modal } = {};

  steps = quoteStepsData;
  quotationCode: any
  quotationNumber: any;
  quotationDetails: any
  quotationView: QuotationDetails
  moreDetails: any
  clientDetails: any
  agents: any;
  agentName: any
  productDetails: any = [];
  prodCode: any
  riskDetails: any
  quotationProducts: any
  taxDetails: TaxInformation[] = [];
  clauses: any;
  user: any;
  clientCode: any;
  externalClaims: any;
  internalClaims: any;
  computationDetails: any;
  premium: any;
  branch: any;
  currency: any;
  externalTable: any;
  internalTable: any;
  menuItems: MenuItem[] | undefined;
  sumInsured: any;
  userDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  sections: any;
  schedules: any[];
  limits: any;
  limitsList: any[];
  excesses: any;
  excessesList: SubclassSectionPeril[] = []
  subclassList: any;
  productSubclass: any;
  allSubclassList: any;
  documentTypes: any;
  riskClauses: any;
  modalHeight: number = 200;


  files = [];
  selectedDocumentType: string = '';
  branchCode: number;
  limitAmount: number;
  quotationCodeString: string;
  selectedExternalClaimExp: any;
  selectedIntetnalClaimExp: any;
  insurersList: any = [];
  selectedInsurer: any = null;
  externalClaimExpCode: number;
  clientName: any;
  marketerCommissionAmount: number;
  subClassCodes: number[] = [];
  similarQuotesList: any;
  selectedProduct: QuotationProduct;

  insurersDetailsForm: FormGroup;
  selectedClause: any;
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  selectedSubclassCode: number;
  activeTab: string = 'clauses';
  conversionFlag: boolean = false;
  conversionFlagString: string;
  acceptedYear: number = new Date().getFullYear();
  convertedDate: string;
  coverFrom: string;
  coverTo: string;
  source: string;
  quickQuoteData: any;
  expiryDate: string;
  selectedRisk: any;
  fetchedQuoteNum: string;
  viewQuoteFlag: boolean;
  revisedQuotationNumber: string;
  premiumAmount: number
  editableComment: string = '';
  showCommentModal: boolean = false;
  taxForm: FormGroup;
  showTaxModal = false;
  reassignComment: string = ''
  users: any;
  selectedUser: any;
  fullNameSearch: string = '';
  globalSearch: string = '';
  comment: boolean = false
  noUserChosen: boolean = false
  clientToReassignQuote: string = '';
  reassignQuoteModal: any;
  reassignQuotationComment: string;
  noCommentleft: boolean = false;
  clientToReassignQuotation: any;
  clientOptions: any;
  taxes: any;
  showEditTaxModal: any;
  selectedTax: any = null;
  transactionTypes: any[] = [];
  isEditingTax: boolean = false;
  rejectComment: string = ''
  noComment: boolean = false;
  afterRejectQuote: boolean = false;
  productClauses: ProductClauses[] = [];
  activeRiskDetailsTab: string = 'sections';
  activeRiskTab: string = '';
  products: any[] = [];
  activeScheduleTab: string = '';
  scheduleLevels: string[] = [];
  schedulesData: { [key: string]: any[] } = {};
  availableScheduleLevels: string[] = [];
  exceptionsCollapsed: boolean = false;
  exceptionsData: any;
  error: string | null = null;
  exceptionErrorMessage: string | null = null;
  limitsRiskofLiability: any;
  selectAll = false;
  comments: any;
  showProducts: boolean = true;
  showProductColumnModal: boolean = false;
  columnModalPosition = { top: '0px', left: '0px' }
  columns: { field: string; header: string; visible: boolean }[] = [];
  showClauses: boolean = true;
  showClausesColumnModal: boolean = false;
  showTaxesColumnModal: boolean = false;
  showRiskColumnModal: boolean = false;
  showSectionColumnModal: boolean = false;
  showRiskClauseColumnModal: boolean = false;
  showScheduleColumnModal: boolean = false;
  showPerilColumnModal: boolean = false;
  showExcessColumnModal: boolean = false;
  showLimitsOfLiabilityColumnModal: boolean = false;
  showAuthorizeButton = true;
  showViewDocumentsButton = false;
  showConfirmButton = false;


  clausesColumns: { field: string; header: string; visible: boolean }[] = [];
  taxesColumns: { field: string; header: string; visible: boolean }[] = [];
  riskColumns: { field: string; header: string; visible: boolean }[] = [];
  sectionColumns: { field: string; header: string; visible: boolean }[] = [];
  riskClausesColumns: { field: string; header: string; visible: boolean }[] = [];
  scheduleColumns: { field: string; header: string; visible: boolean }[] = [];
  perilColumns: { field: string; header: string; visible: boolean }[] = [];
  excessColumns: { field: string; header: string; visible: boolean }[] = [];
  limitsColumns: { field: string; header: string; visible: boolean }[] = [];
  summaryPerils: any[] = [];
  departmentSelected: boolean = false;
  groupUsers: GroupedUser[] = [];
  selectedGroupUserId!: number;
  groupLeaderName: string = '';
  activeConsentTab: string = 'otp';
  shareMethods: { label: string; value: ShareMethod; disabled: boolean; tooltip?: string }[] = [
    { label: 'Email', value: 'email', disabled: false },
    { label: 'SMS', value: 'sms', disabled: true, tooltip: 'SMS sharing coming soon' },
    { label: 'WhatsApp', value: 'whatsapp', disabled: true, tooltip: 'WhatsApp sharing coming soon' }
  ];
  shareForm!: FormGroup;
  otpGenerated: boolean = false;
  otpResponse: OtpResponse;
  changeButtons: boolean = false;
  filePath: string = '';
  documentData: any;
  reports: any[] = [];
  selectedReports: ReportResponse[] = [];
  fetchedReports: ReportResponse[] = [];
  currentIndex: number = 0;
  currentReport!: ReportResponse;
  activeIndex: number = 1;
  reportBlobs: { [code: string]: Blob } = {};
  viewDocForm!: FormGroup;
  public currencyObj: NgxCurrencyConfig;


  constructor(
    public quotationService: QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public agentService: IntermediaryService,
    public productService: ProductService,
    public subclassService: SubclassesService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private messageService: GlobalMessagingService,
    public branchService: BranchService,
    private spinner: NgxSpinnerService,
    public bankService: BankService,
    private fb: FormBuilder,
    private clientService: ClientService,
    public claimsService: ClaimsService,
    public utilService: UtilService,
    private notificationService: NotificationService,


  ) {
    this.viewQuoteFlag = JSON.parse(sessionStorage.getItem('viewQuoteFlag'));
    log.debug("View Quotation Flag", this.viewQuoteFlag)
    this.revisedQuotationNumber = sessionStorage.getItem('revisedQuotationNo');
    log.debug("Revised Quotation Number", this.revisedQuotationNumber)
  }

  public isCollapsibleOpen = false;
  public isRiskCollapsibleOpen = false;
  public makeQuotationReady = true;
  public confirmQuotation = false;
  public authoriseQuotation = false;
  public showEmail = false;
  public showSms = false;
  public showInternalClaims = false;
  public showExternalClaims = false;
  private ngUnsubscribe = new Subject();
  public cdr: ChangeDetectorRef;



  shareQuoteData: ShareQuoteDTO = {
    selectedMethod: 'email',
    email: '',
    smsNumber: '',
    whatsappNumber: '',
    clientName: ''
  };
  ngOnInit(): void {
    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'));
    log.debug("two codes", this.quotationCode, this.quotationCodeString)
    this.quotationNumber = sessionStorage.getItem('quotationNumber') || sessionStorage.getItem('quotationNum');
    log.debug('quotationCode', this.quotationCodeString)
    log.debug("quick Quotation number", this.quotationNumber);

    this.conversionFlagString = sessionStorage.getItem("conversionFlag");
    this.conversionFlag = JSON.parse(this.conversionFlagString);
    log.debug("conversion flag:", this.conversionFlag);


    if (this.conversionFlag) {
      this.globalMessagingService.displaySuccessMessage('Success', 'Conversion completed succesfully');
      sessionStorage.removeItem("conversionFlag");
    }

    this.moreDetails = sessionStorage.getItem('quotationFormDetails');

    if (this.quotationCodeString) {
      this.quotationCode = Number(this.quotationCodeString);
      log.debug("second code", this.quotationCode)
    }
    this.quotationService.getQuotationDetails(this.quotationCode)
      .pipe(untilDestroyed(this)).subscribe((response: any) => {
        log.debug("Quotation details>>>", response)
        this.quotationDetails = response
        if ('Rejected' === response.status) {
          this.afterRejectQuote = true
        }
      });


    this.clientDetails = JSON.parse(
      sessionStorage.getItem('clientFormData') ||
      sessionStorage.getItem('clientDetails') ||
      sessionStorage.getItem('newClientDetails') ||
      'null'
    );

    this.quickQuoteData = sessionStorage.getItem('quickQuoteData');
    log.debug("quick quote data", this.quickQuoteData);

    log.debug("client-Details quotation summary", this.clientDetails);

    // Handle clientCode assignment
    if (this.moreDetails) {
      const parsedMoreDetails = JSON.parse(this.moreDetails);
      this.quotationDetails = parsedMoreDetails;
    }


    this.quotationCode && this.getQuotationDetails(this.quotationCode);
    this.getuser();
    this.getRiskDetails();

    this.loadSummaryPerils()
    this.getUsers();


    // this.createInsurersForm();
    // this.fetchInsurers();

    log.debug("MORE DETAILS TEST", this.quotationDetails)

    this.limitAmount = Number(sessionStorage.getItem('limitAmount'));
    log.debug('SUM INSURED NGONIT', this.limitAmount);

    // this.createEmailForm();
    this.loadAllSubclass();
    // this.createSmsForm();
    // this.getDocumentTypes();

    this.hasUnderwriterRights();


    this.menuItems = [
      {
        label: 'Claims Experience',
        expanded: false, // Initially expanded
        items: [
          {
            label: 'External',
            command: () => {
              this.external();
              this.closeMenu();
            }
          },
          {
            label: 'Internal',
            command: () => {
              this.internal();
              this.closeMenu();
            }
          }
        ]
      }
    ];

    // Add this to your existing ngOnInit
    const modal = document.getElementById('addExternalClaimExperienceModal');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.clearForm();
      });
    }


    log.debug('QuotationView', this.quotationView)
    log.debug('quotationDetails', this.quotationDetails)
    // log.debug('quotationDetailsm', this.getQuotationDetails(this.productSubclass))


    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: ['']

    });
    this.viewDocForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', Validators.email],
      bcc: ['', Validators.email],
      subject: [''],
      wording: ['']
    });
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
  }

  ngAfterViewInit() {
    this.modals['chooseClientReassign'] = new bootstrap.Modal(this.chooseClientReassignModal.nativeElement);
    this.modals['reassignQuotation'] = new bootstrap.Modal(this.reassignQuotationModalElement.nativeElement);
    this.modals['rejectQuotation'] = new bootstrap.Modal(this.rejectQuotationModalElement.nativeElement);
  }

  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();

  }


  // Method to show external claims
  external() {
    this.showExternalClaims = true;
    this.showInternalClaims = false;
  }

  // Method to show internal claims
  internal() {
    this.showInternalClaims = true;
    this.showExternalClaims = false;
  }

  closeMenu() {
    this.menuItems[0].expanded = false; // Collapse the section
    this.menuItems = [...this.menuItems]; // Trigger change detection
    this.cdr.detectChanges(); // Ensure UI updates
  }

  /**
   * Retrieves quotation details based on the provided code.
   * @method getQuotationDetails
   * @param {string} code - The code of the quotation for which to retrieve details.
   * @return {void}
   */
  getQuotationDetails(code: any) {
    this.quotationService.getQuotationDetails(code)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe((res: any) => {
        this.quotationView = res;
        log.debug('QuotationView', this.quotationView)
        this.premiumAmount = res.premium
        this.fetchedQuoteNum = this.quotationView.quotationNo;
        this.user = this.quotationView.preparedBy;
        log.debug('this user', this.user)
        this.quotationAuthorized = JSON.parse(sessionStorage.getItem('quotationHasBeenAuthorzed'))
        if (this.quotationAuthorized) {
          this.showAuthorizeButton = false;
          this.showViewDocumentsButton = true;
          this.showConfirmButton = true;
        }
        this.getExceptions(this.quotationView.code);
        if (!this.moreDetails) {
          this.quotationDetails = this.quotationView;
          log.debug("MORE DETAILS TEST quotationView", this.quotationDetails)
        }
        this.sumInsured = this.quotationView.sumInsured;
        if (!this.quotationCodeString) {
          this.quotationCode = res.code
          log.debug("quotation code", this.quotationCode)
        }

        this.marketerCommissionAmount = this.quotationView.marketerCommissionAmount;
        log.debug("marketerCommissionAmount", this.marketerCommissionAmount);

        // Assuming `quotationView` is the quotation object
        this.subClassCodes = this.quotationView.quotationProducts
          .flatMap(product => product.riskInformation) // Flatten the riskInformation arrays
          .map(risk => risk.subclassCode); // Extract the subclassCode from each risk
        log.debug("Subclass Codes:", this.subClassCodes);

        this.coverFrom = this.convertDate(this.quotationView.coverFrom)
        this.coverTo = this.convertDate(this.quotationView.coverTo)
        this.expiryDate = this.convertDate(this.quotationDetails?.expiryDate)
        this.source = this.quotationView.source?.description


        // Extract subclassCode and quotationProductCode
        const firstProduct = this.quotationView.quotationProducts?.[0];
        const firstRisk = firstProduct?.riskInformation?.[0];
        const subclassCode = firstRisk?.subclassCode;
        const quotationProductCode = firstRisk?.quotationProductCode;

        log.debug('Subclass Code:', subclassCode);
        log.debug('Quotation Product Code:', quotationProductCode)

        // Extract product details
        this.quotationProducts = this.quotationView.quotationProducts;
        this.riskDetails = this.quotationView.quotationProducts[0]?.riskInformation;
        log.debug("Risk Details quotation-summary", this.riskDetails);
        log.debug('quoationProducts', this.quotationProducts)

        if (this.riskDetails.length > 0) {
          this.setColumnsFromRiskDetails(this.riskDetails[0])
        }


        this.products = this.quotationView.quotationProducts;

        if (this.products.length > 0) {
          this.activeRiskTab = this.products[0].code;
        }



        this.productDetails = this.quotationView.quotationProducts
        log.debug('product details', this.productDetails)
        if (this.productDetails.length > 0) {
          this.setColumnsFromProductDetails(this.productDetails[0]);
        }



        // this.getbranch();
        // this.getPremiumComputationDetails();
        // this.getAgent();

        // extract client-code and productCode
        this.prodCode = this.quotationView.quotationProducts[0].code;
        this.clientCode = this.quotationView.clientCode;

        this.loadClientDetails(this.clientCode);
        // this.getExternalClaimsExperience(this.clientCode);
        // this.getInternalClaimsExperience(this.clientCode);
        // Handle risk information and session storage
        if (this.riskDetails && this.riskDetails.length > 0) {
          const firstRisk = this.riskDetails[0];
          const sectionDetails = firstRisk.sectionsDetails && firstRisk.sectionsDetails.length > 0
            ? firstRisk.sectionsDetails[0]
            : null;
          log.debug("section details list", sectionDetails)
          if (sectionDetails) {
            sessionStorage.setItem('premiumRate', sectionDetails.rate?.toString() || '');
            sessionStorage.setItem('sectionDescription', sectionDetails.sectionShortDescription || '');
            sessionStorage.setItem('sectionType', sectionDetails.sectionType || '');
            sessionStorage.setItem('rateType', sectionDetails.rateType || '');
          }
        }

        log.debug('SUM INSURED', this.sumInsured);
        log.debug('Session storage values set for LIMITS:', {
          premiumRate: sessionStorage.getItem('premiumRate'),
          sectionType: sessionStorage.getItem('sectionType'),
          sectionDescription: sessionStorage.getItem('sectionDescription'),
          rateType: sessionStorage.getItem('rateType'),
          limitAmount: this.sumInsured
        });
        this.handleProductClick(this.quotationView.quotationProducts[0])

        const Product1 = this.quotationDetails.quotationProducts[0];
        log.debug('Product1', Product1);

        if (Product1) {
          this.taxDetails = Product1.taxInformation;
          this.productClauses = Product1.productClauses;


          log.debug('taxDetais', this.taxDetails);
          log.debug('productClauses', this.productClauses);

          const risk1 = Product1.riskInformation[0];
          log.debug('risk1', risk1);


          this.sections = risk1.sectionsDetails || [];
          log.debug('sections', this.sections);



          const scheduleArray = risk1.scheduleDetails || [];
          const firstSchedule = scheduleArray[0] || {};
          const details = firstSchedule.details || {};

          this.availableScheduleLevels = Object.keys(details);
          this.schedulesData = {};
          this.availableScheduleLevels.forEach(level => {
            const levelData = details[level];
            this.schedulesData[level] = levelData ? [levelData] : [];
          });

          this.activeScheduleTab = this.availableScheduleLevels[0] || '';

          log.debug('default schedule', this.schedulesData);


          if (risk1.code) {
            this.getRiskClauses(risk1.code);
          } else {
            log.debug('No code found in risk1');
          }

        }


        log.debug('subclassCode: passed for excess', subclassCode);
        log.debug('quotationProductCode: passed for excess', quotationProductCode);

        this.getLimitsofLiability(subclassCode, quotationProductCode, 'L');
        this.getLimitsofLiability(subclassCode, quotationProductCode, 'E')
        const defaultRiskCode = this.riskDetails.length > 0 ? this.riskDetails[0].code : null;
        this.getExcesses(subclassCode);

        if (defaultRiskCode) {
          this.getSections(defaultRiskCode);
        }

      });


  }
  getRiskDetails() {
    const currentProduct = this.products.find(p => p.code === this.activeRiskTab);
    const riskDetails = currentProduct?.riskInformation || [];

    this.riskDetails = riskDetails;

    if (riskDetails.length > 0) {
      this.setColumnsFromRiskDetails(riskDetails[0]);
    } else {
      this.columns = [];
    }
  }





  filterTable(event: Event, field: string, tableRef: any) {
    const input = (event.target as HTMLInputElement).value;
    tableRef.filter(input, field, 'contains');
  }


  getAgent() {
    this.agentService.getAgentById(this.quotationDetails.agentCode).subscribe(
      {
        next: (res) => {
          this.agents = res
          this.spinner.hide()
          log.debug(res, "AGENTS")
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  getSections(data: any) {
    this.riskDetails.forEach((el: { code: any; sectionsDetails: any; scheduleDetails: ScheduleDetails }) => {
      if (data === el.code) {
        this.sections = el.sectionsDetails;
        const scheduleArray = el.scheduleDetails || [];
        const firstSchedule = scheduleArray[0] || {};
        const details = firstSchedule.details || {};

        this.availableScheduleLevels = Object.keys(details); // e.g., ['level1', 'level2']

        this.schedulesData = {};
        this.availableScheduleLevels.forEach(level => {
          const levelData = details[level];
          this.schedulesData[level] = levelData ? [levelData] : [];
        });

        this.activeScheduleTab = this.availableScheduleLevels[0] || '';
      }
    });

    if (this.availableScheduleLevels.length > 0) {
      this.activeScheduleTab = this.availableScheduleLevels[0];

      if (this.getCurrentSchedule().length > 0) {
        this.setColumnsFromScheduleDetails(this.getCurrentSchedule()[0]);
      }
    }
    if (this.sections.length > 0) {
      this.setColumnsFromSectionDetails(this.sections[0])
    }

    log.debug(this.schedulesData, 'schedulesData by level');
    log.debug(this.sections, 'section Details');
  }

  getCurrentSchedule() {
    return this.schedulesData[this.activeScheduleTab] || [];
  }

  selectScheduleTab(tab: string) {
    this.activeScheduleTab = tab;
    console.log('Active tab:', tab);
    console.log('Schedules for this tab:', this.getCurrentSchedule());

    if (this.getCurrentSchedule().length > 0) {
      const sampleSchedule = this.getCurrentSchedule()[0];
      this.setColumnsFromScheduleDetails(sampleSchedule);
    }

  }


  /**
   * Navigates to the edit details page.
   * @method editDetails
   * @return {void}
   */
  editQuotationDetails() {
    const action = "E";
    sessionStorage.setItem("quotationAction", action);
    this.router.navigate(['/home/gis/quotation/quotation-details']);
  }

  /**
   * Retrieves product details based on the product code in the 'moreDetails' property.
   * @method getProductDetails
   * @return {void}
   */
  getProductDetails(code: number) {
    this.productService.getProductByCode(code).subscribe(res => {
      this.productDetails.push(res)
      log.debug("Product details", this.productDetails)
    })
  }

  getbranch() {

    if (this.moreDetails) {
      this.branchCode = JSON.parse(this.moreDetails).branchCode;
    } else {
      this.branchCode = this.quotationView.branchCode;
    }
    log.debug("Branch Code: ", this.branchCode);

    this.branchService.getBranchById(this.branchCode).subscribe(data => {
      this.branch = data;
      log.debug("Branch Details", this.branch);
    })
  }

  getAgents() {
    /**
     * Retrieves agents using the AgentService.
     * Subscribes to the observable to handle the response.
     * Populates the 'agents' property with the content of the response.
     * @param {any} data - The response data containing agents.
     * @return {void}
     */
    this.agentService.getAgents().subscribe(data => {
      this.agents = data.content

    })
  }

  toggleProductDetails() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }

  toggleRiskDetails() {
    this.isRiskCollapsibleOpen = !this.isRiskCollapsibleOpen;
  }

  getProductClause(productCode) {
    this.quotationService.getProductClauses(productCode).subscribe(res => {
      this.clauses = res
      log.debug(this.clauses)
    })
  }







  /**
   * Retrieves the current user and stores it in the 'user' property.
   * @method getUser
   * @return {void}
   */
  getuser(): void {
    this.user = this.authService.getCurrentUserName()
    this.quotationService.getUserProfile().subscribe(res => {
      this.userDetails = res

    })
  }

  makeReady() {
    this.quotationService.makeReady(this.quotationCode, this.user).subscribe(
      {
        next: (res) => {
          this.makeQuotationReady = !this.makeQuotationReady;
          this.authoriseQuotation = !this.authoriseQuotation;
          this.getQuotationDetails(this.quotationCode);
          this.messageService.displaySuccessMessage('Success', 'Quotation Made Ready, Authorise to proceed')
        },
        error: (e) => {
          log.debug(e)
          this.messageService.displayErrorMessage('error', 'Failed to make ready')
        }
      }
    )
  }

  authorise() {
    this.quotationService.authoriseQuotation(this.quotationCode, this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.getQuotationDetails(this.quotationCode);
          this.messageService.displaySuccessMessage('Success', 'Quotation Authorised, Confirm to proceed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  confirm() {
    this.quotationService.confirmQuotation(this.quotationCode, this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.getQuotationDetails(this.quotationCode);
          this.messageService.displaySuccessMessage('Success', 'Quotation Authorization Confirmed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  showCommunicationDetails(section) {
    if (section === 'sms') {
      this.showSms = true
      this.showEmail = false

    } else if (section === 'email') {
      this.showEmail = true
      this.showSms = false
    }
  }

  getExternalClaimsExperience(clientCode: number) {
    this.quotationService.getExternalClaimsExperience(clientCode)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(res => {
        this.externalClaims = res;
        this.externalTable = this.externalClaims._embedded;
        log.debug("external claims table", this.externalTable);
      })
  }

  getInternalClaimsExperience(clientCode: number) {
    this.quotationService.getInternalClaimsExperience(clientCode)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(res => {
        this.internalClaims = res;
        this.internalTable = this.internalClaims._embedded;
        log.debug("internal-claims table", this.internalTable);
      })
  }

  showExternals() {
    this.showExternalClaims = !this.showExternalClaims
  }

  showInternal() {
    this.showInternalClaims = !this.showInternalClaims
  }

  getPremiumComputationDetails() {
    log.debug("Quotation code when computing premium", this.quotationCode);
    this.quotationService.quotationUtils(this.quotationCode).subscribe({
      next: (res) => {
        log.debug("Response before modifying limits", res)
        this.computationDetails = res
        this.computationDetails.underwritingYear = new Date().getFullYear();
      },
      error: (error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, you cannot compute premium, check quotation details and try again.');
      }
    });
  }

  /**
   * Computes the premium for the current quotation and updates the quotation details.
   * @method computePremium
   * @return {void}
   */
  computePremium() {
    this.quotationService.computePremium(this.computationDetails).subscribe({
      next: (res) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed');
        this.premium = res;
        log.debug("res.riskLevelPremiums >>>", res.riskLevelPremiums)
        const totalTax = (res.riskLevelPremiums || [])
          .map(risk =>
            (risk.taxComputation || []).reduce(
              (taxAcc, tax) => taxAcc + (tax.premium || 0),
              0
            )
          )
          .reduce((sum, taxSum) => sum + taxSum, 0);
        this.premiumAmount = res.premiumAmount + totalTax
        log.debug("premium", res);
        this.updateQuotationPremmium();
      },
      error: (error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    })
  }

  cancelQuotation() {
    sessionStorage.removeItem('clientFormData');
    sessionStorage.removeItem('quotationFormDetails');
    sessionStorage.removeItem('quotationCode');
    sessionStorage.removeItem('quotationNum');
    this.router.navigate(['/home/gis/quotation/quotations-client-details'])
  }

  editQuotations() {
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

  createEmailForm() {
    this.emailForm = this.fb.group({
      from: ['', [Validators.required, Validators.email]],
      clientCode: ['', Validators.required],
      emailAggregator: ['N', Validators.required],
      fromName: ['', Validators.required],
      message: ['', Validators.required],
      sendOn: ['', Validators.required],
      status: ['D', Validators.required],
      subject: ['', Validators.required],
      systemCode: ['0', Validators.required],
      systemModule: ['NB', Validators.required],
      address: ['', Validators.required],
      cc: ['', Validators.required],
      bcc: ['', Validators.required],
    });
  }





  logFilter(event: any) {
    console.log('Filter event:', event);
  }








  createSmsForm() {
    this.smsForm = this.fb.group({
      message: ['', Validators.required],
      recipients: ['', Validators.required],
      sender: ['', Validators.required],
    });
  }

  emaildetails() {
    const currentDate = new Date();
    const current = currentDate.toISOString();
    log.debug(this.clientDetails)
    log.debug(this.emailForm.value)
    const payload = {
      address: [
        this.emailForm.value.address,
        this.emailForm.value.cc,
        this.emailForm.value.bcc,
      ].filter(email => email), // Filter out any empty values
      clientCode: this.clientDetails.id,
      emailAggregator: this.emailForm.value.emailAggregator,
      from: this.userDetails.emailAddress,
      fromName: this.emailForm.value.fromName,
      message: this.emailForm.value.message,
      sendOn: current,
      status: this.emailForm.value.status,
      subject: this.emailForm.value.subject,
      systemCode: this.emailForm.value.systemCode,
      systemModule: this.emailForm.value.systemModule,

    };
    const emailDto: EmailDto = {
      address: [

      ],
      emailAggregator: this.emailForm.value.emailAggregator,
      from: this.emailForm.value.fromName,
      message: this.emailForm.value.message,
      sendOn: current,
      status: this.emailForm.value.status,
      systemModule: this.emailForm.value.systemModule,
      subject: this.emailForm.value.subject,
      attachments: [],
      systemCode: null,
      fromName: null,
      response: null,

    }
    this.quotationService.sendEmail(emailDto)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe({
        next: (res) => {
          const response = res
          this.globalMessagingService.displaySuccessMessage('Success', 'Email sent successfully');
          log.debug(res)
        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
        }
      })
    log.debug('Submitted payload:', JSON.stringify(payload));
  }

  sendSms() {
    const payload = {
      recipients: [
        this.smsForm.value.recipients
      ],
      message: this.smsForm.value.message,
      sender: this.smsForm.value.sender,
    };
    this.quotationService.sendSms(payload).subscribe(
      {
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully');
        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
        }
      }
    )
  }

  getLimits(productCode) {
    this.quotationService.assignProductLimits(productCode).subscribe({
      next: (res) => {
        this.quotationService.getLimits(productCode, 'L').subscribe({
          next: (res) => {
            this.limits = res
            this.limitsList = this.limits._embedded
            this.globalMessagingService.displaySuccessMessage('Success', this.limits.message);
            log.debug(res)
          }
        })
      }
    })
  }

  getExcesses(subclassCode: number) {
    const subClassCode = subclassCode
    log.debug("SUBCLASS CODE:", subClassCode)
    this.quotationService.getSubclassSectionPeril(subClassCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.excesses = res;
          this.excessesList = this.excesses._embedded ?? [];



          log.debug("EXCESS LIST", this.excessesList);
          if (this.limits?.message) {
            this.globalMessagingService.displaySuccessMessage('Success', this.limits.message);
          }
        },
        error: (error) => {
          log.debug('Error fetching excesses:', error);
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      }
      );
  }

  handleRowClick(data: any) {
    if (!data?.code) {
      log.debug('Invalid data for row click:', data);
      return;
    }

    log.debug('Row clicked with data:', data);
    this.selectedRisk = data;
    const subclassCode = data.subclassCode
    log.debug("SUBCLASS CODE:", subclassCode)
    const firstProduct = this.quotationView.quotationProducts?.[0];
    const firstRisk = firstProduct?.riskInformation?.[0];
    const quotationProductCode = firstRisk?.quotationProductCode;

    // Call all methods sequentially
    this.getSections(data.code);
    this.getExcesses(subclassCode);
    this.getRiskClauses(data.code);

    //       log.debug('subclassCode: passed for excess', subclassCode);
    // log.debug('quotationProductCode: passed for excess', quotationProductCode);
    this.getLimitsofLiability(subclassCode, quotationProductCode, 'L');
    this.getLimitsofLiability(subclassCode, quotationProductCode, 'E')

  }

  handleProductClick(data: QuotationProduct) {
    if (!data) {
      log.debug('Invalid data for row click:', data);
      return;
    }

    this.selectedProduct = data;

    log.debug('Product clicked with data:', data);


    const proCode = data.productCode;
    log.debug("product Code", proCode);

    const quotationProductCode = data.code;
    log.debug("product quotation Code", quotationProductCode);
    // Find the matching product in the quotationProducts array
    const matchingProduct = this.quotationView.quotationProducts.find(
      product => product.code === quotationProductCode
    );

    if (matchingProduct) {
      this.taxDetails = matchingProduct.taxInformation;
      if (this.taxDetails.length > 0) {
        this.setColumnsFromTaxesDetails(this.taxDetails[0])

      }
      log.debug("Tax Details:", this.taxDetails);
    } else {
      log.debug("No matching product found for the given code.");
    }

    // this.getProductClause(proCode);
    this.productClauses = data.productClauses
    this.getProductSubclass(proCode);
    // this.fetchSimilarQuotes(quotationProductCode);
    log.debug('productClauses -handle click', this.productClauses)
    if (this.productClauses) {
      this.setColumnsFromClausesDetails(this.productClauses[0])
    }
    this.handleRowClick(matchingProduct.riskInformation[0])
  }

  loadAllSubclass() {
    return this.subclassService.getAllSubclasses().subscribe(data => {
      this.allSubclassList = data;
      log.debug(this.allSubclassList, " from the service All Subclass List");
    })
  }

  getProductSubclass(code: number): void {
    this.productService.getProductSubclasses(code).subscribe({
      next: (res) => {
        this.subclassList = res._embedded.product_subclass_dto_list;
        log.debug(this.subclassList, 'Product Subclass List');

        // Validate allSubclassList
        if (!this.allSubclassList || !Array.isArray(this.allSubclassList)) {
          log.error('allSubclassList is not initialized or not an array');
          this.allSubclassList = [];
          return; // Exit early if no valid data to match against
        }

        // Reset productSubclass array
        this.productSubclass = [];

        // Get user's subclass codes as numbers for consistent comparison
        const userSubclassCodes = this.subClassCodes.map(code => Number(code));
        log.debug('User subclass codes:', userSubclassCodes);

        // Filter subclasses that match the user's codes
        this.productSubclass = this.subclassList
          .filter(element => userSubclassCodes.includes(element.sub_class_code))
          .map(element => {
            // Find the matching detailed subclass info from allSubclassList
            const matchingSubclass = this.allSubclassList.find(
              subClass => subClass.code === element.sub_class_code
            );
            log.debug("Product subclass", this.productSubclass)

            if (!matchingSubclass) {
              log.debug(`No matching subclass found for code: ${element.sub_class_code}`);
            }

            return matchingSubclass;
          })
          .filter(Boolean); // Remove any undefined entries

        log.debug("Retrieved matching subclasses:", this.productSubclass);
      },
      error: (err) => {
        log.error("Error retrieving product subclasses", err);
      }
    });
  }


  getDocumentTypes() {
    this.quotationService.documentTypes('C').pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (res) => {
        this.documentTypes = res
      }
    })
  }

  getRiskClauses(riskCode: number) {
    if (!riskCode) {
      log.debug('Missing riskCode for getRiskClauses');
      return;
    }

    this.quotationService.getRiskClauses(riskCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.riskClauses = res;
          log.debug("RISK CLAUSES", this.riskClauses);

          if (this.riskClauses.length) {
            this.setColumnsFromRiskClausesDetails(this.riskClauses[0])
          }
        },
        error: (error) => {
          log.debug('Error fetching risk clauses:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch risk clauses');
        }
      }
      );
  }

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  // start document upload functionality
  onBrowseClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        // Read the file as a data URL
        const reader = new FileReader();
        reader.onload = () => {
          // Convert the file to Base64 string
          const base64String = reader.result?.toString().split(',')[1];

          // Add the file to your files array with additional properties
          this.files.push({
            file,
            name: file.name,
            selected: false,
            documentType: this.selectedDocumentType,
            base64: base64String
          });
          log.debug("File:", this.clientDetails)
          let payload = {
            agentCode: "",
            agentName: "",
            brokerCode: "",
            brokerName: "",
            brokerType: "",
            cbpCode: "",
            cbpName: "",
            claimNo: "",
            claimantNo: "",
            clientCode: this.clientDetails.id,
            clientFullname: this.clientDetails.firstName + this.clientDetails.lastName,
            clientName: this.clientDetails.firstName,
            dateReceived: "",
            department: "",
            deptName: "",
            docData: "",
            docDescription: "",
            docId: "",
            docReceivedDate: "",
            docRefNo: "",
            docRemark: "",
            docType: this.selectedDocumentType,
            document: base64String,
            documentName: file.name,
            documentType: this.selectedDocumentType,
            endorsementNo: "",
            fileName: file.name,
            folderId: "",
            memberName: "",
            memberNo: "",
            module: "",
            originalFileName: "",
            paymentType: "",
            policyNo: "",
            policyNumber: "",
            processName: "",
            proposalNo: "",
            providerCode: "",
            providerName: "",
            qouteCode: "",
            rdCode: "",
            referenceNo: "",
            riskID: "",
            spCode: "",
            spName: "",
            subject: "",
            transNo: "",
            transType: "",
            userName: "",
            username: "",
            valuerDate: "",
            valuerName: "",
            voucherNo: ""
          }
          this.quotationService.postDocuments(payload).subscribe({
            next: (res) => {
              this.globalMessagingService.displaySuccessMessage('Success', 'Document uploaded successfully');
            }
          })
        };
        // Read the file as data URL
        reader.readAsDataURL(file);
        // this.files.push({ file, name: file.name, selected: false, documentType: this.selectedDocumentType });
      }
    }
  }

  downloadFile(fileItem: FileItem): void {
    const url = window.URL.createObjectURL(fileItem.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileItem.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  printFile(fileItem: FileItem): void {
    // Implement your print logic here
    log.debug('Print file:', fileItem.name);
  }

  deleteFile(index: number): void {
    this.files.splice(index, 1);
  }

  onDocumentTypeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = +selectElement.value;
    const selectedData = this.documentTypes.find(data => data.id === selectedId);
    if (selectedData) {
      this.selectedDocumentType = selectedData.description;
    }
  }

  openClaimDeleteModal() {
    log.debug("Selected Claim experience to delete", this.selectedExternalClaimExp)
    if (!this.selectedExternalClaimExp) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a Claim experience to continue');
    } else {
      document.getElementById("openClaimModalButtonDelete").click();
    }
  }

  onExternalClaimSelect(externalClaim: any): void {
    this.selectedExternalClaimExp = externalClaim;
    log.debug('Selected external Claim item:', this.selectedExternalClaimExp);
  }

  onInternalClaimSelect(internalClaim: any): void {
    this.selectedIntetnalClaimExp = internalClaim;
    log.debug('Selected internal Claim item:', internalClaim);
  }

  fetchInsurers() {
    this.quotationService.getInsurers().subscribe({
      next: (res) => {
        this.insurersList = res.content; // Ensure you're accessing the `content` array
        log.debug("INSURERS", this.insurersList);
      }
    })
  }

  onInsurerChange(event: any) {
    // event.value will contain the selected insurer object
    this.selectedInsurer = event.value;
    log.debug('Selected Insurer ID:', this.selectedInsurer.name);
  }

  createInsurersForm() {
    this.insurersDetailsForm = this.fb.group({
      claimPaid: ['', [Validators.required]],
      clientCode: [''],
      code: [''],
      damageAmount: ['', [Validators.required]],
      insurer: ['', [Validators.required]],
      lossAmount: ['', [Validators.required]],
      noAccrual: ['', [Validators.required]],
      otherAmount: ['', [Validators.required]],
      policyNumber: ['', [Validators.required]],
      remarks: ['', [Validators.required]],
      riskDetails: ['', [Validators.required]],
      totalPaidAmount: ['', [Validators.required]],
      year: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.acceptedYear),
        Validators.pattern('^[0-9]{4}$')
      ]]
    });
  }

  createExternalClaimExp() {
    // Mark all fields as touched and validate the form
    this.insurersDetailsForm.markAllAsTouched();
    this.insurersDetailsForm.updateValueAndValidity();
    if (this.insurersDetailsForm.invalid) {
      log.debug('Form is invalid, will not proceed');
      return;
    } else {
      log.debug("The valid form", this.insurersDetailsForm);
    }
    Object.keys(this.insurersDetailsForm.controls).forEach(control => {
      if (this.insurersDetailsForm.get(control).invalid) {
        log.debug(`${control} is invalid`, this.insurersDetailsForm.get(control).errors);
      }
    });


    // If form is valid, proceed
    log.debug('Form is valid, proceeding with premium computation...');

    // Extract only the name of the insurer
    const insurer = { ...this.insurersDetailsForm.value, insurer: this.insurersDetailsForm.value.insurer?.name };
    log.debug("Client Code", this.clientCode)

    const damageAmountString = this.insurersDetailsForm.get('damageAmount').value.replace(/,/g, '');

    log.debug('damageAmount (String):', damageAmountString);
    const damageAmountInt = parseInt(damageAmountString);
    log.debug('damageAmount (Integer):', damageAmountInt);

    // Log and convert totalPaidAmount
    const totalPaidAmountString = this.insurersDetailsForm.get('totalPaidAmount').value.replace(/,/g, '');
    log.debug('totalPaidAmountInt (String):', totalPaidAmountString);
    const totalPaidAmountInt = parseInt(totalPaidAmountString);
    log.debug('totalPaidAmountInt (Integer):', totalPaidAmountInt);

    // Log and convert otherAmount
    const otherAmountString = this.insurersDetailsForm.get('otherAmount').value.replace(/,/g, '');
    log.debug('otherAmount (String):', otherAmountString);
    const otherAmountInt = parseInt(otherAmountString);
    log.debug('otherAmount (Integer):', otherAmountInt);

    insurer.damageAmount = damageAmountInt;
    insurer.totalPaidAmount = totalPaidAmountInt;
    insurer.otherAmount = otherAmountInt;
    insurer.clientCode = this.clientCode;


    this.closebutton.nativeElement.click();

    log.debug("EXTERNAL CLAIMS FORM-ADDING", insurer)
    this.quotationService
      .addExternalClaimExp(insurer)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'External claim experience details added successfully');

          log.debug("Response after adding external Claim Experience", response);
          this.getExternalClaimsExperience(this.clientCode);

        },
        error: (error) => {
          log.debug("error after adding external Claim Experience", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to add external claim exp...Try again later');
        }
      }
      );
  }

  editExternalClaimExp() {
    // Mark all fields as touched and validate the form
    this.insurersDetailsForm.markAllAsTouched();
    this.insurersDetailsForm.updateValueAndValidity();
    if (this.insurersDetailsForm.invalid) {
      log.debug('Form is invalid, will not proceed');
      return;
    } else {
      log.debug("The valid form", this.insurersDetailsForm);
    }
    Object.keys(this.insurersDetailsForm.controls).forEach(control => {
      if (this.insurersDetailsForm.get(control).invalid) {
        log.debug(`${control} is invalid`, this.insurersDetailsForm.get(control).errors);
      }
    });


    // If form is valid, proceed
    log.debug('Form is valid, proceeding with premium computation...');

    // Extract only the name of the insurer
    const insurer = { ...this.insurersDetailsForm.value, insurer: this.insurersDetailsForm.value.insurer?.name };
    log.debug("Client Code", this.clientCode)

    const damageAmountString = this.insurersDetailsForm.get('damageAmount').value.replace(/,/g, '');

    log.debug('damageAmount (String):', damageAmountString);
    const damageAmountInt = parseInt(damageAmountString);
    log.debug('damageAmount (Integer):', damageAmountInt);

    // Log and convert totalPaidAmount
    const totalPaidAmountString = this.insurersDetailsForm.get('totalPaidAmount').value.replace(/,/g, '');
    log.debug('totalPaidAmount (String):', totalPaidAmountString);
    const totalPaidAmountInt = parseInt(totalPaidAmountString);
    log.debug('totalPaidAmount (Integer):', totalPaidAmountInt);

    // Log and convert otherAmount
    const otherAmountString = this.insurersDetailsForm.get('otherAmount').value.replace(/,/g, '');
    log.debug('otherAmount (String):', otherAmountString);
    const otherAmountInt = parseInt(otherAmountString);
    log.debug('otherAmount (Integer):', otherAmountInt);

    insurer.damageAmount = damageAmountInt;
    insurer.totalPaidAmount = totalPaidAmountInt;
    insurer.otherAmount = otherAmountInt;
    insurer.clientCode = this.clientCode;
    insurer.code = this.selectedExternalClaimExp.code;


    this.closebutton.nativeElement.click();

    log.debug("EXTERNAL CLAIMS FORM-EDITING", insurer)
    this.quotationService
      .editExternalClaimExp(insurer)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'External claim experience details edited successfully');

          log.debug("Response after editing external Claim Experience", response);
          this.getExternalClaimsExperience(this.clientCode);
          this.selectedExternalClaimExp = null;

        },
        error: (error) => {
          log.debug("Error editing an external claim exp", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to edit external claim exp...Try again later');
        }
      }
      );
  }

  deleteExternalClaimExperience() {

    if (this.selectedExternalClaimExp.code) {
      this.externalClaimExpCode = this.selectedExternalClaimExp.code;
      log.debug('External claim exp code: ', this.externalClaimExpCode);
    }

    this.quotationService
      .deleteExternalClaimExp(this.externalClaimExpCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response after deleting an external claim experience ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'External claim experience deleted successfully');
          this.getExternalClaimsExperience(this.clientCode);
          this.selectedExternalClaimExp = null;
        },
        error: (error) => {
          log.debug('Error deleting external claim exp', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete external claim exp...Try again later');
        }
      }
      );
  }

  openExternalClaimExpEditModal() {
    if (!this.selectedExternalClaimExp) {
      this.globalMessagingService.displayInfoMessage('Error', 'Please select an external claim experience to edit');
    } else {
      this.populateEditForm();
    }
  }

  populateEditForm() {
    // Find the matching insurer object from the insurersList
    log.debug("InsurersList", this.insurersList);
    const selectedInsurer = this.insurersList.find(
      insurer => insurer.name === this.selectedExternalClaimExp.insurer
    );

    log.debug("selectedInsurer on edit", selectedInsurer);

    // Format the numeric values with commas for display
    const formatNumber = (num: number) => {
      return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
    };

    // Map claimPaid value to match the dropdown options
    const claimPaidValue = this.selectedExternalClaimExp.claimPaid === "Yes" ? "Y" : "N";

    // Populate the form with the selected claim's data
    this.insurersDetailsForm.patchValue({
      policyNumber: this.selectedExternalClaimExp.policyNumber,
      insurer: selectedInsurer, // Pass the full insurer object for p-dropdown
      year: this.selectedExternalClaimExp.year,
      riskDetails: this.selectedExternalClaimExp.riskDetails,
      lossAmount: this.selectedExternalClaimExp.lossAmount,
      claimPaid: claimPaidValue, // Corrected mapping
      noAccrual: this.selectedExternalClaimExp.noAccrual,
      damageAmount: formatNumber(this.selectedExternalClaimExp.damageAmount),
      totalPaidAmount: formatNumber(this.selectedExternalClaimExp.totalPaidAmount),
      otherAmount: formatNumber(this.selectedExternalClaimExp.otherAmount),
      remarks: this.selectedExternalClaimExp.remarks
    });
  }

  externalClaimExpAction() {
    if (!this.selectedExternalClaimExp) {
      this.createExternalClaimExp();
    } else {
      this.editExternalClaimExp();
    }
  }


  clearForm() {
    // Reset the form to its initial state
    this.insurersDetailsForm.reset();

    // Clear the selected claim
    this.selectedExternalClaimExp = null;

    // If you have any default values you want to set after clearing, you can do it here
    // For example, if claimPaid should default to 'N':
    this.insurersDetailsForm.patchValue({
      claimPaid: 'N'
    });
  }

  loadClientDetails(id) {
    this.clientService.getClientById(id).subscribe((data) => {
      this.clientDetails = data;
      log.debug('Selected Client Details:', this.clientDetails);
      const clientDetailsString = JSON.stringify(this.clientDetails);
      sessionStorage.setItem('clientDetails', clientDetailsString);
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
    this.clientCode = Number(this.clientDetails.id);
    this.clientName =
      this.clientDetails.firstName + ' ' + this.clientDetails.lastName;
    sessionStorage.setItem('clientCode', this.clientCode);
  }

  // end document upload functionality
  onResize(event: any) {
    this.modalHeight = event.height;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();

    const modal = document.getElementById('addExternalClaimExperienceModal');
    if (modal) {
      modal.removeEventListener('hidden.bs.modal', () => {
        this.clearForm();
      });
    }
  }

  onSubclassClick(subclassCode: number): void {
    log.debug('Clicked Subclass Code:', subclassCode);
    this.selectedSubclassCode = subclassCode
    if (this.selectedSubclassCode) {
      this.fetchLimitsOfLiability()
    }
    // Perform any action you need with subclassCode
  }

  fetchLimitsOfLiability() {
    this.quotationService
      .getLimitsOfLiability(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.limitsOfLiabilityList = response._embedded
          log.debug("Limits of Liability List ", this.limitsOfLiabilityList);

        },
        error: (error) => {
          log.debug("error fetching limits of liability", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch limits of liabilty. Try again later');
        }
      }
      );
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  fetchSimilarQuotes(quotationProductCode: number) {
    log.debug("quotation-view at fetch-similar-quotations", this.quotationView);
    // const quotationProductCode = this.quotationView.quotationProducts.map((quotationProduct) => quotationProduct.code);
    log.debug("quotation-product-code at fetch-similar-quotations", quotationProductCode);

    this.quotationService
      .getSimilarQuotes(quotationProductCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.similarQuotesList = response._embedded
          log.debug("Similar Quotes List ", this.similarQuotesList);

        },
        error: (error) => {
          log.debug("error fetching similar quotes", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch similar quotations. Try again later');
        }
      }
      );
  }

  convertDate(date: any) {
    log.debug("DATE TO BE CONVERTED", date)
    const rawDate = new Date(date);
    log.debug(' Raw before being formatted', rawDate);

    // Extract the day, month, and year
    const day = rawDate.getDate();
    const month = rawDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = rawDate.getFullYear();

    // Format the date in 'dd-Month-yyyy' format
    const formattedDate = `${day}-${month}-${year}`;

    this.convertedDate = formattedDate;
    log.debug('Converted date', this.convertedDate);
    return this.convertedDate
  }

  updateQuotationPremmium() {
    log.debug("Premium computation Response:", this.premium)
    const selectedProduct = this.quotationView.quotationProducts[0];
    log.debug("Selected product", selectedProduct)

    // Transforming data into the expected payload format
    const transformedPayload = {
      premiumAmount: this.premiumAmount,
      productCode: selectedProduct.productCode,
      quotProductCode: selectedProduct.code.toString(),
      productPremium: this.premiumAmount,
      riskLevelPremiums: this.premium.riskLevelPremiums.map(risk => ({
        code: risk.code,
        premium: risk.premium,
        limitPremiumDtos: risk.limitPremiumDtos.map(limit => ({
          sectCode: limit.sectCode,
          premium: limit.premium
        }))
      })),
      taxes: [] // Assuming taxes are not available in the given input data
    };
    log.debug("Payload to be sent to updatePremium", transformedPayload)
    this.quotationService
      .updatePremium(this.quotationCode, transformedPayload)
      .subscribe({
        next: (response: any) => {
          const result = response;
          log.debug("RESPONSE AFTER UPDATING QUOTATION DETAILS:", result);
          result && this.getQuotationDetails(this.quotationCode);

        },
        error: (error) => {
          log.error("Failed to update details:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        }
      });

  }

  openRiskDeleteModal() {
    log.debug("Selected Risk", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
    } else {
      document.getElementById("openRiskModalButtonDelete").click();

    }
  }

  deleteRisk() {
    log.debug("Selected Risk to be deleted", this.selectedRisk)
    this.quotationService
      .deleteRisk(this.selectedRisk.code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response after deleting a risk ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk deleted successfully');

          // Remove the deleted risk from the riskDetails array
          const index = this.riskDetails.findIndex(risk => risk.code === this.selectedRisk.code);
          if (index !== -1) {
            this.riskDetails.splice(index, 1);
          }
          // Clear the selected risk
          this.selectedRisk = null;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete risk. Try again later');
        }
      });
  }

  openProductDeleteModal() {
    log.debug("Selected Product", this.selectedProduct)
    if (!this.selectedProduct) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Product to continue');
    } else {
      document.getElementById("openProductModalButtonDelete").click();

    }
  }

  deleteProduct() {
    log.debug("Selected Product to be deleted", this.selectedProduct)
    this.quotationService
      .deleteQuotationProduct(this.quotationCode, this.selectedProduct.code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          log.debug("Response after deleting a risk ", response);
          this.globalMessagingService.displaySuccessMessage('Success', 'Risk deleted successfully');

          // Remove the deleted risk from the riskDetails array
          const index = this.productDetails.findIndex(product => product.code === this.selectedProduct.code);
          if (index !== -1) {
            this.productDetails.splice(index, 1);
          }
          // Clear the selected risk
          this.selectedProduct = null;

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  openCommentModal() {
    this.editableComment = this.quotationView?.comments || '';
    this.showCommentModal = true;
  }

  closeCommentModal() {
    this.showCommentModal = false;
  }

  saveComment() {


    if (!this.editableComment || this.editableComment.trim() === '') {
      this.globalMessagingService.displayErrorMessage(
        'Validation Error',
        'Notes cannot be empty.'
      );
      return;
    }

    const payload = {
      comment: this.editableComment,
      quotationCode: this.quotationView.code
    };

    this.quotationService.updateQuotationComment(payload).subscribe({
      next: () => {

        this.quotationView.comments = this.editableComment;


        this.globalMessagingService.displaySuccessMessage(
          'Success',
          'Notes updated successfully.'
        );

        this.closeCommentModal();
      },
      error: (error) => {
        console.error('Error updating comment:', error);

        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Unable to update notes. Please try again later.'
        );
      }
    });
  }





  //reassign
  openReassignQuotationModal() {
    this.openModals('reassignQuotation');

  }

  closeReassignQuotationModal() {
    this.closeModals('reassignQuotation');
    this.reassignComment = null;
    this.clientToReassignQuotation = null;
  }

  openChooseClientReassignModal() {
    this.openModals('chooseClientReassign');
    this.closeReassignQuotationModal();
  }

  closeChooseClientReassignModal(): void {
    this.closeModals('chooseClientReassign');
    this.onUserUnselect();
  }

  getUsers() {
    this.claimsService.getUsers(0, 1000).subscribe({
      next: (res => {
        this.users = res;
        this.users = this.users.content;
        log.debug('users>>>', this.users)

      }),
      error: (error => {
        log.debug('error', error)
        this.globalMessagingService.displayErrorMessage('Error', 'failed to feth users')
      })
    })
  }


  //search member to reassign
  filterGlobal(event: any): void {
    const value = event.target.value;
    this.globalSearch = value;
    this.reassignTable.filterGlobal(value, 'contains');
  }


  filterByFullName(event: any): void {
    const value = event.target.value;
    this.reassignTable.filter(value, 'name', 'contains');
  }
  onUserSelect(): void {
    if (this.selectedUser) {
      log.debug("Selected user>>>", this.selectedUser);
      this.globalSearch = this.selectedUser.id;
      this.fullNameSearch = this.selectedUser.name;
      this.fetchGroupedUserDetails(this.selectedUser)

    }
  }

  onUserUnselect(): void {
    this.selectedUser = null;
    this.globalSearch = '';
    this.fullNameSearch = '';
  }
  selectClient() {
    if (!this.selectedUser) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false
      }, 3000);
      return;
    }

    this.clientToReassignQuotation = this.selectedUser.name;
    if (this.selectedUser.userType == "G") {
      this.departmentSelected = true
    }
    this.closeChooseClientReassignModal();
    this.openReassignQuotationModal();

  }

  // selectClient() {
  //   if (!this.selectedUser) {
  //     this.noUserChosen = true;
  //     setTimeout(() => {
  //       this.noUserChosen = false
  //     }, 3000);
  //     return;
  //   }

  //   this.clientToReassignQuotation = this.selectedUser.name;
  //   this.closeChooseClientReassignModal();
  //   this.openReassignQuotationModal();

  // }

  //reassign quotation

  reassignQuotation() {
    if (!this.clientToReassignQuotation) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false
      }, 3000);
      return;

    }

    if (!this.reassignQuotationComment) {
      this.noCommentleft = true;
      setTimeout(() => {
        this.noCommentleft = false
      }, 3000);
      return;
    }

    const reassignPayload = {
      user: this.clientToReassignQuotation.id,
    }
    this.closeReassignQuotationModal();
    this.onUserUnselect();
    this.reassignQuotationComment = null;
    this.globalMessagingService.displaySuccessMessage('Success', 'Quote reassigned successfully')

    log.debug('reassign Payload', reassignPayload)

  }

  //reject quotation
  openRejectQuotationModal() {
    this.openModals('rejectQuotation');

  }

  closeRejectQuotationModal() {
    this.closeModals('rejectQuotation');
    this.rejectComment = null;
  }

  rejectQuotation(code: number) {
    if (!code) {
      this.globalMessagingService.displayErrorMessage('error', 'Create quoatation first');
      this.closeRejectQuotationModal();
      return;
    }
    const reasonCancelled = this.rejectComment;
    const status = 'Rejected';
    if (!reasonCancelled) {
      this.noComment = true;
      setTimeout(() => {
        this.noComment = false;
      }, 3000);

      return;
    }

    this.quotationService.updateQuotationStatus(this.quotationCode, status, reasonCancelled).subscribe({
      next: (response) => {
        this.globalMessagingService.displaySuccessMessage('success', 'quote rejected successfully')
        log.debug(response);
        this.afterRejectQuote = true;
        this.quotationDetails.status = 'Rejected'
        this.closeRejectQuotationModal();
        this.navigateToQuoteDetails();
      },
      error: (error) => {
        this.closeRejectQuotationModal();
        this.globalMessagingService.displayErrorMessage('error', error);
        log.debug(error);

      }

    })

  }

  navigateToQuoteDetails() {
    // log.debug("Quotation Object", this.quotationDetails);
    // sessionStorage.setItem("quotationObject", JSON.stringify(this.quotationDetails));
    // if (this.afterRejectQuote) {
    //   this.utilService.clearSessionStorageData()
    // }
    this.router.navigate(['/home/gis/quotation/quotation-management']).then(r => {
    });
  }

  navigateToRiskCenter() {
    this.router.navigate(['/home/gis/quotation/risk-center']).then(r => {
    });

  }

  toggleAll() {
    this.exceptionsData.forEach(e => (e.selected = this.selectAll));
  }
  logCheckbox(row: any) {
    console.log('Selected row:', row);
  }


  getExceptions(quotationCode: number) {
    this.quotationService.getExceptions(quotationCode).subscribe({
      next: (res) => {
        log.debug('exceptions', res);
        this.exceptionsData = res._embedded;
        log.debug('exceptionData', this.exceptionsData);
      },
      error: (error) => {
        log.error('Error fetching exceptions:', error);
        this.error = 'Something went wrong while fetching exceptions.';
      }
    });
  }




  getLimitsofLiability(subClassCode: number, quotationProductCode: number, scheduleType: 'L' | 'E') {
    this.quotationService.getRiskLimitsOfLiability(subClassCode, quotationProductCode, scheduleType)
      .subscribe({
        next: (res) => {
          log.debug(`limits of liability (${scheduleType})`, res);

          if (scheduleType === 'L') {
            this.limitsRiskofLiability = res._embedded;

            this.setColumnsFromLimitsOfLiabilityDetails(this.limitsRiskofLiability[0])
          } else {
            this.excesses = res._embedded;
            this.comments = res._embedded


            if (this.excesses.length) {
              this.setColumnsFromExcessDetails(this.excesses[0])
            }
          }

        },
        error: (error) => {
          log.error(`Error fetching limits of liability (${scheduleType}):`, error);
          this.error = `Something went wrong while fetching limits of liability (${scheduleType})`;
        }
      });
  }


  // getExcessAndComments(subClassCode: number, quotationProductCode: number) {
  //   this.quotationService.getExcessAndComments(subClassCode, quotationProductCode)
  //     .subscribe({
  //       next: (res) => {
  //         log.debug('Excess and Comments', res);
  //         this.excesses = res._embedded;
  //         this.comments = res._embedded;
  //       },
  //       error: (error) => {
  //         log.error('Error fetching excess and comments:', error);
  //         this.error = 'Something went wrong while fetching excess and comments';
  //       }
  //     });
  // }
  authorizeSelectedExceptions(): void {
    const selected = this.exceptionsData?.filter(ex => ex.selected);

    if (!selected || selected.length === 0) {

      this.globalMessagingService.displayErrorMessage('Error', "Select an exception to continue");
      return;
    }



    if (this.hasUnderwriterRights()) {

      log.debug('Quotation status:', this.quotationView.status);

      if (this.quotationView.status === 'AUTHORISED') {
        this.globalMessagingService.displayInfoMessage(
          'Info',
          'This quotation is already authorised'
        );
        return;
      }

      log.debug('Authorizing as underwriter:', selected);

      this.quotationService
        .AuthoriseExceptions(this.quotationView.code, this.quotationView.preparedBy)
        .subscribe({
          next: (res) => {
            if (res.status === 'SUCCESS') {
              this.globalMessagingService.displaySuccessMessage(
                'Success',
                res.message || 'Exceptions authorised successfully'
              );
            } else {
              this.globalMessagingService.displayErrorMessage(
                'Authorization Error',
                res.message || 'Could not authorise exceptions'
              );
            }
          },
          error: (err) => {
            this.globalMessagingService.displayErrorMessage(
              'Authorization Error',
              'Could not authorise exceptions'
            );
            log.error(err);
          }
        })

    }
    // authorizeSelectedExceptions(): void {
    //   const selected = this.exceptionsData?.filter(ex => ex.selected);

    //   if (!selected || selected.length === 0) {

    //     this.globalMessagingService.displayErrorMessage('Error', "Select an exception to continue");
    //     return;
    //   }



    //   if (this.hasUnderwriterRights()) {

    //     log.debug('Quotation status:', this.quotationView.status);

    //     if (this.quotationView.status === 'AUTHORISED') {
    //       this.globalMessagingService.displayInfoMessage(
    //         'Info',
    //         'This quotation is already authorised'
    //       );
    //       return;
    //     }

    //     log.debug('Authorizing as underwriter:', selected);

    //     this.quotationService
    //       .AuthoriseExceptions(this.quotationView.code, this.quotationView.preparedBy)
    //       .subscribe({
    //         next: (res) => {
    //           if (res.status === 'SUCCESS') {
    //             this.globalMessagingService.displaySuccessMessage(
    //               'Success',
    //               res.message || 'Exceptions authorised successfully'
    //             );
    //           } else {
    //             this.globalMessagingService.displayErrorMessage(
    //               'Authorization Error',
    //               res.message || 'Could not authorise exceptions'
    //             );
    //           }
    //         },
    //         error: (err) => {
    //           this.globalMessagingService.displayErrorMessage(
    //             'Authorization Error',
    //             'Could not authorise exceptions'
    //           );
    //           log.error(err);
    //         }
    //       });
    //   }
    //   else {
    //     this.globalMessagingService.displayErrorMessage(
    //       'Authorization Error',
    //       'You do not have rights to authorize; please reassign.'
    //     )
    //   }
    //   this.openChooseClientReassignModal();
    // }
  }


  hasUnderwriterRights(): boolean {
    const rolesString = sessionStorage.getItem('account_roles');
    log.debug('Raw roles string from sessionStorage:', rolesString);

    const roles = JSON.parse(rolesString || '[]');
    log.debug('Parsed roles array:', roles);

    const hasRights = roles.includes('underwriter');
    log.debug('Has underwriter rights:', hasRights);

    return hasRights;
  }

  toggleProducts(iconElement: HTMLElement): void {
    this.showProducts = true;


    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showProductColumnModal = true;
  }
  toggleClauses(iconElement: HTMLElement): void {
    this.showClauses = true;


    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showClausesColumnModal = true;
  }
  toggleTaxes(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showTaxesColumnModal = true;
  }
  toggleRisk(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskColumnModal = true;
  }
  toggleSection(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showSectionColumnModal = true;
  }

  toggleRiskClauses(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskClauseColumnModal = true;
  }

  toggleSchedule(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showScheduleColumnModal = true;
  }
  togglePeril(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showPerilColumnModal = true;
  }
  toggleExcess(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showExcessColumnModal = true;
  }

  toggleLimitsOfLiability(iconElement: HTMLElement): void {



    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + iconElement.offsetHeight + 4;
    const left = iconElement.offsetLeft;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showLimitsOfLiabilityColumnModal = true;
  }

  setColumnsFromProductDetails(sample: ProductDetails) {
    const defaultVisibleFields = [
      'productName',
      'wet',
      'wef',
      'premium',
      'commission'
    ];

    const excludedFields = [
      'productClauses',
      'taxInformation',
      'riskInformation',

      'limitsOfLiability'





    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.columns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }

  // setColumnsFromClausesDetails(sample: ProductClauses) {
  //   log.debug("SET COLUMN FOR PRODUCT CLAUSES", sample)
  //   const defaultVisibleFields = [
  //     'clauseShortDescription',
  //     'clauseHeading',
  //     'clause',

  //   ];
  //   const excludedFields = [];

  //   this.clausesColumns = Object.keys(sample)
  //     .filter((key) => !excludedFields.includes(key))
  //     .map((key) => ({
  //       field: key,
  //       header: this.sentenceCase(key),
  //       visible: defaultVisibleFields.includes(key),
  //     }));


  // }


  setColumnsFromClausesDetails(sample: ProductClauses) {
    log.debug("SET COLUMN FOR PRODUCT CLAUSES");

    const defaultVisibleFields = [
      'clauseShortDescription',
      'clauseHeading',
      'clause',
    ];

    const excludedFields: string[] = [];

    // All keys from the sample
    const keys = Object.keys(sample).filter(key => !excludedFields.includes(key));

    // Separate default fields and the rest
    const defaultFields = defaultVisibleFields.filter(f => keys.includes(f));
    const otherFields = keys.filter(k => !defaultVisibleFields.includes(k));

    // Strictly order = defaults first, then others
    const orderedKeys = [...defaultFields, ...otherFields];

    this.clausesColumns = orderedKeys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
      truncate: defaultVisibleFields.includes(key), // only these get truncated
    }));

    log.debug("clause columns", this.clausesColumns);
    log.debug("product clauses clause columns:", this.productClauses);
  }




  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }



  setColumnsFromTaxesDetails(sample: TaxDetails) {
    const defaultVisibleFields = [
      'rateDescription',
      'rate',
      'rateType',
      'taxType',
      'taxAmount'

    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.taxesColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }


  setColumnsFromRiskDetails(sample: RiskInformation) {
    const defaultVisibleFields = [
      'propertyId',
      'wet',
      'wef',
      'itemDesc',
      'coverTypeDescription'

    ];

    const excludedFields = [
      'riskLimits',
      'scheduleDetails',
      'schedules',
      'sectionsDetails',
      'taxComputation',

      'action'

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.riskColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }



  setColumnsFromSectionDetails(sample: RiskInformation) {
    const defaultVisibleFields = [
      'rowNumber',
      'calcGroup',
      'sectionCode',
      'sectionShortDescription',
      'limitAmount',
      'premiumRate',
      'rateType',
    ];

    const excludedFields: string[] = [];

    // All keys from the sample, excluding unwanted ones
    const keys = Object.keys(sample).filter(key => !excludedFields.includes(key));

    // Separate defaults (in order) and the rest
    const defaultFields = defaultVisibleFields.filter(f => keys.includes(f));
    const otherFields = keys.filter(k => !defaultVisibleFields.includes(k));

    // If productName exists, make sure it comes first
    const orderedKeys = [
      ...(keys.includes('productName') ? ['productName'] : []),
      ...defaultFields,
      ...otherFields.filter(f => f !== 'productName')
    ];

    this.sectionColumns = orderedKeys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }



  setColumnsFromRiskClausesDetails(sample: riskClauses) {
    const defaultVisibleFields = ['sectionShortDescription',
      'clauseCode',
      'clause',
      'shortDescription'






    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.riskClausesColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }

  setColumnsFromScheduleDetails(sample: any) {
    const defaultVisibleFields = ['sectionShortDescription',
      'make',
      'cubicCapacity',
      'yearOfManufacture',
      'carryCapacity',
      'value',
      'bodyType'






    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.scheduleColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }
  setColumnsFromPerilDetails(sample: any) {
    const defaultVisibleFields = ['sectionShortDescription',
      'description',
      'shortDescription',
      'code',
      'claimExcessType'







    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.perilColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }
  setColumnsFromExcessDetails(sample: any) {
    const defaultVisibleFields = [
      'narration',
      'value'







    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.excessColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }


  setColumnsFromLimitsOfLiabilityDetails(sample: any) {
    const defaultVisibleFields = [
      'narration',
      'value'







    ];

    const excludedFields = [

    ];


    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });


    this.limitsColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key),
    }));
  }


  getCellValue(row: any, field: string): any {
    const value = row[field];




    if (value instanceof Date) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(value);
    }


    if (value && typeof value === 'object') {
      return value.code ?? JSON.stringify(value);
    }
    if (value === 0) return 0;
    if (value === null || value === undefined) return 'N/A';

    return value;
  }

  loadSummaryPerils(): void {
    const savedPerilsData = sessionStorage.getItem('perilsData');
    console.log("Raw perilsData from sessionStorage:", savedPerilsData);

    if (!savedPerilsData) {
      console.warn("No perilsData found in sessionStorage.");
      this.summaryPerils = [];
      return;
    }

    try {
      const allPerilsMap = JSON.parse(savedPerilsData);
      const subclassCode = this.selectedRisk?.subclassCode;
      log.debug("SubclassCode in summary:", subclassCode);
      log.debug("Available subclassCodes in perilsData:", Object.keys(allPerilsMap));

      if (subclassCode && allPerilsMap[subclassCode]) {
        this.summaryPerils = allPerilsMap[subclassCode];
      } else {

        this.summaryPerils = Object.values(allPerilsMap).flat();
      }

      log.debug("Loaded summary perils:", this.summaryPerils);


      if (this.summaryPerils) {
        this.setColumnsFromPerilDetails(this.summaryPerils[0])
      }
    } catch (error) {
      log.debug("Failed to parse perilsData from sessionStorage:", error);
      this.summaryPerils = [];
    }
  }
  fetchGroupedUserDetails(selectedUser: any) {
    const groupedUserId = selectedUser.id;
    this.quotationService.getGroupedUserDetails(groupedUserId)
      .subscribe({
        next: (res: GroupedUser[]) => {
          this.groupUsers = res;

          // Find the team leader
          const groupLeader = res.find(user => user.isTeamLeader === "Y");
          if (groupLeader) {
            this.selectedGroupUserId = groupLeader.id; // auto-select in dropdown
            this.groupLeaderName = groupLeader.userDetails.name;
          }
        },
        error: (error) => {
          console.error("Error fetching group users", error);
        }
      });
  }
  authorizeQuote() {
    const quotationCode = this.quotationCode;
    const user = this.user;

    if (!this.hasUnderwriterRights()) {
      this.globalMessagingService.displayErrorMessage('Error', 'This user does not have the rights to authorize a quote.')
      this.router.navigate(['/quotation-management']);
      return;
    }

    this.quotationService.authorizeQuote(quotationCode, user).subscribe({
      next: (res) => {
        log.debug('Authorize response', res);

        if (res?.status?.toUpperCase().trim() === 'SUCCESS') {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            res?.message || 'Quotation authorized successfully.'
          );
        }



        // Hide authorize button and show next actions in both cases
        this.showAuthorizeButton = false;
        this.showViewDocumentsButton = true;
        this.showConfirmButton = true;
      },
      error: (err: HttpErrorResponse) => {
        log.error('Error authorizing quote:', err);

        if (
          err?.error?.status === 'ERROR' &&
          err?.error?.debugMessage?.includes('already Authorised')
        ) {
          log.debug("Already authorized");

          this.globalMessagingService.displayInfoMessage(
            'Notice',
            'This quotation is already authorized.'
          );
          this.quotationAuthorized = true;
          sessionStorage.setItem('quotationHasBeenAuthorzed', JSON.stringify(this.quotationAuthorized))
          this.showAuthorizeButton = false;
          this.showViewDocumentsButton = true;
          this.showConfirmButton = true;
        } else {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            err?.error?.message || 'Something went wrong.'
          );
        }
      }

    });
  }


  generateOTP() {
    this.shareForm.markAllAsTouched();
    this.shareForm.updateValueAndValidity();

    const emailCtrl = this.shareForm.get('email');
    if (!emailCtrl || emailCtrl.invalid) {
      return;
    }

    log.debug("Client name:", this.clientName);

    const otpPayload = {
      email: emailCtrl.value,
      subject: "Action Required: Verify Your Consent with OTP",
      body: `Dear ${this.clientName},\nPlease use the following One-Time Password (OTP) to verify your consent:`, // OTP appended by backend
    };

    this.quotationService.generateOTP(otpPayload).subscribe({
      next: (res: any) => {
        this.globalMessagingService.displaySuccessMessage("Succes", "Successfully generated OTP")

        this.otpResponse = res._embedded;
        this.otpGenerated = true;

      },
      error: (error) => {
        console.error("Error generating OTP:", error.error?.message || error);
      }
    });
  }

  verifyOTP() {
    const userIdentifier = this.otpResponse.userIdentifier
    const otp = this.shareForm.value.otp
    this.quotationService.verifyOTP(userIdentifier, otp)
      .subscribe({
        next: (res: any[]) => {
          this.globalMessagingService.displaySuccessMessage("Succes", "Successfully verified OTP")
          if (res) {
            // Close modal only on success
            const modalEl: any = this.consentModal.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalEl)
              || new bootstrap.Modal(modalEl);
            modal.hide();
            this.otpGenerated = false
            this.changeButtons = true
          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);

          // 🔔 Show in global error handler
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
  }
  fetchReports() {
    const system = 37;
    const applicationLevel = "QUOTE"
    this.quotationService.fetchReports(system, applicationLevel)
      .subscribe({
        next: (res: any[]) => {
          this.fetchedReports = res
          if (res) {
            const modalEl: any = this.viewDocumentsModal.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalEl)
              || new bootstrap.Modal(modalEl);
            modal.show();
            if (this.fetchedReports?.length) {
              this.currentIndex = 0;
              this.currentReport = this.fetchedReports[0];
              this.selectedReports = [this.currentReport]; // show first as checked
              this.loadAndShowReport(this.currentReport);
            }

          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
  }
  // onReportToggle(event: any, report: ReportResponse) {
  //   if (event.checked) {
  //     log.debug("Checked:", report);

  //     this.quotationService.fetchReportParams(report.code)
  //       .subscribe({
  //         next: (res: ReportParams) => {
  //           const reportDetails = res
  //           this.generateReport(reportDetails)
  //         },
  //         error: (err: any) => {
  //           const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
  //           this.globalMessagingService.displayErrorMessage("Error", backendMsg);
  //         }
  //       });
  //   } else {
  //     log.debug("Unchecked:", report);
  //     // Handle uncheck
  //   }
  // }
  onReportToggle(event: any, report: ReportResponse) {

    if (event.checked) {
      this.currentIndex = this.fetchedReports.findIndex(r => r.code === report.code);
      this.currentReport = report;
      this.loadAndShowReport(report);
    } else {

      if (this.currentReport && this.currentReport.code === report.code) {
        if (this.selectedReports && this.selectedReports.length) {
          this.currentReport = this.selectedReports[0];
          this.currentIndex = this.fetchedReports.findIndex(r => r.code === this.currentReport.code);
          this.loadAndShowReport(this.currentReport);
        } else {
          this.currentReport = null;
          this.filePath = null;
        }
      }
    }
  }


  toggleReport(direction: 'prev' | 'next') {
    if (!this.fetchedReports || this.fetchedReports.length === 0) return;

    if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'next' && this.currentIndex < this.fetchedReports.length - 1) {
      this.currentIndex++;
    } else {
      return;
    }

    this.currentReport = this.fetchedReports[this.currentIndex];

    // visually select only the active report (this will uncheck others)
    this.selectedReports = [this.currentReport];

    // generate and preview
    this.loadAndShowReport(this.currentReport);
  }


  private loadAndShowReport(report: ReportResponse) {
    this.quotationService.fetchReportParams(report.code).subscribe({
      next: (res: ReportParams) => this.generateReport(res),
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }
  generateReport(selectedReportDetails: ReportParams) {
    const reportCode = selectedReportDetails.rptCode;

    // Check if report is already generated and cached
    if (this.reportBlobs[reportCode]) {
      console.log("Report already generated, downloading from cache...");
      this.filePath = URL.createObjectURL(this.reportBlobs[reportCode]);
      // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      return;
    }

    // Build payload for backend
    const value = this.quotationCode;
    const reportPayload = {
      params: selectedReportDetails.params.map(param => ({
        name: param.name,   // transform if needed
        value: value
      })),
      rptCode: reportCode,
      system: "GIS",
      reportFormat: "PDF",
      encodeFormat: "RAW"
    };

    console.log("Generating report payload:", reportPayload);

    // Call backend
    this.quotationService.generateReports(reportPayload).subscribe({
      next: (res: Blob) => {
        // Create PDF blob
        const blob = new Blob([res], { type: 'application/pdf' });
        this.filePath = URL.createObjectURL(blob);
        log.debug("Blob URL:", this.filePath);
        // Cache the blob
        this.reportBlobs[reportCode] = blob;

        console.log("Report generated and cached:", reportCode);

        // this.downloadReportByCode(reportCode, selectedReportDetails.reportName);
      },
      error: (err: any) => {
        const backendMsg = err.error?.message || err.message || 'An unexpected error occurred';
        console.error("Error generating report:", backendMsg);
        this.globalMessagingService.displayErrorMessage("Error", backendMsg);
      }
    });
  }

  downloadReports(reports: any[]) {
    if (!reports || reports.length === 0) return;

    reports.forEach(report => {
      const reportCode = report.rptCode || report.code;
      this.downloadReportByCode(reportCode, report.description);
    });
  }

  downloadReportByCode(reportCode: number, fileName?: string) {
    const blob = this.reportBlobs[reportCode];
    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || 'report'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log("Report downloaded:", reportCode);
  }


  printReport(report: any) {
    const reportCode = report.rptCode || report.code;
    const blob = this.reportBlobs[reportCode];

    if (!blob) {
      console.warn("No cached blob found for report:", reportCode);
      this.globalMessagingService.displayInfoMessage('Info', 'Select a report to continue');
      return;
    }

    this.spinner.show();

    const url = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } finally {
        this.spinner.hide();
      }

      iframe.contentWindow?.addEventListener("afterprint", () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      });
    };

    document.body.appendChild(iframe);
  }


  async sendReportViaEmail() {
    this.viewDocForm.markAllAsTouched();
    this.viewDocForm.updateValueAndValidity()
    if (!this.selectedReports || this.selectedReports.length === 0) return;

    const viewDocForm = this.viewDocForm.value;
    log.debug("Selected reports:", this.selectedReports)
    log.debug("Report blobs", this.reportBlobs)
    const attachments = await Promise.all(
      this.selectedReports.map(async (report: any) => {
        const reportKey = report.rptCode || report.code; // <-- unified key
        const blob = this.reportBlobs[reportKey];
        console.log('Blob for report', reportKey, blob);
        if (!blob) return null;

        const base64 = await this.blobToBase64(blob);
        return {
          name: `${report.description || reportKey}.pdf`,
          content: base64,
          type: 'application/pdf',
          disposition: 'attachment',
          contentId: reportKey
        };
      })
    );


    // Filter out any nulls (in case blob not found)
    const filteredAttachments = attachments.filter(att => att !== null);

    const payload: EmailDto = {
      code: null,
      address: [viewDocForm.to],
      subject: viewDocForm.subject,
      message: viewDocForm.wording,
      status: 'D',
      emailAggregator: 'N',
      response: '524L',
      systemModule: 'NB for New Business',
      systemCode: 0,
      attachments: filteredAttachments,
      sendOn: new Date().toISOString(),
      clientCode: 0,
      agentCode: 0
    };

    this.notificationService.sendEmail(payload).subscribe({
      next: (res: any) => {
        this.globalMessagingService.displaySuccessMessage("Success", "Reports sent successfully!")
        if (res) {
          const modalEl: any = this.viewDocumentsModal.nativeElement;
          const modal = bootstrap.Modal.getInstance(modalEl)
            || new bootstrap.Modal(modalEl);
          modal.hide();
        }
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Failed to send reports';
        this.globalMessagingService.displayErrorMessage("Error", msg);
      }
    });
  }
  blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]); // remove data: prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

}

