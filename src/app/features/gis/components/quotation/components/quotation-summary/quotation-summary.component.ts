import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { Observable, of, Subject, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
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
  IntroducerDto,
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

import { Modal } from 'bootstrap';
import { left } from '@popperjs/core';
import { DmsDocument, RiskDmsDocument } from 'src/app/shared/data/common/dmsDocument';
import { DmsService } from 'src/app/shared/services/dms/dms.service';

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

  viewClientProfile() {
    throw new Error('Method not implemented.');
  }
  @ViewChild('fileInput') fileInput!: ElementRef;
  // @ViewChild('closebutton') closebutton;
  @ViewChild('dt') table!: Table;
  @ViewChild('reassignTable') reassignTable!: any;
  @ViewChild('closeReassignButton') closeReassignButton: ElementRef;
  @ViewChild('reassignQuotationModal') reassignQuotationModalElement!: ElementRef;
  @ViewChild('rejectQuotationModal') rejectQuotationModalElement!: ElementRef;
  @ViewChild('chooseClientReassignModal') chooseClientReassignModal!: ElementRef;
  @ViewChild('productClauseTable') productClauseTable: any;
  @ViewChild('riskClausesTable') riskClausesTable: any;
  @ViewChild('clientConsentModal') clientConsentModalElement!: ElementRef;
  @ViewChild('viewDocumentsModal') viewDocumentsModal!: ElementRef;
  @ViewChild('addRiskDocumentModal') addRiskDocModalRef!: ElementRef;

  @Input() modalTitle: string = 'Action required';
  @Input() modalSubtitle: string = 'Required details missing.';
  @Input() modalMessage: string = 'Some details in step 1 and 2 are missing. Please go back and complete to finalize the quote.';
  @Input() modalButtonLabel: string = 'Close';

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

  computationDetails: any;
  premium: any;
  branch: any;
  currency: any;
  externalTable: any;
  internalTable: any;
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
  selectedRisk: RiskInformation;
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

  sessionClauses: any
  showClauses: boolean = true;
  showClausesColumnModal: boolean = false;
  clausesColumns: { field: string; header: string; visible: boolean }[] = [];
  show: boolean = false;
  isProductClauseOpen: boolean = false
  showProductClauses: boolean = true;
  showProductClauseColumnModal = false;
  productClauseColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];

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
  showVerifyButton = false;



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
    { label: 'SMS', value: 'sms', disabled: false },
    { label: 'WhatsApp', value: 'whatsapp', disabled: true, tooltip: 'WhatsApp sharing coming soon' }
  ];
  shareForm!: FormGroup;
  otpGenerated: boolean = false;
  otpResponse: OtpResponse;
  changeToPolicyButtons: boolean = false;
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
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  storedQuotationFormDetails: any = null
  zoomLevel = 1;
  paymentFrequencies: any[] = [];
  introducers: IntroducerDto[] = [];
  introducerName: string = '';
  quotationFormDetails: any;
  quotationAuthorized: boolean;
  fileUrl: SafeResourceUrl;
  quickQuoteQuotation: boolean;
  showCreateClientTip = false;
  riskCommissions: any[] = [];
  showCommissionColumnModal = false;
  commissionColumns: { field: string; header: string; visible: boolean }[] = [];
  ticketStatus: string;
  // confirmQuote: boolean = false;
  ticketData: any;
  zoomRiskDocLevel = 1;
  showRiskDocColumnModal = false;
  showRiskDoc: boolean = true;

  riskDocColumns: { field: string; header: string; visible: boolean, filterable: boolean }[] = [];
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  errorMessage = '';
  successMessage = '';
  loggedInUser: string;

  riskDocuments: DmsDocument[];
  selectedRiskDoc: DmsDocument;
  previewRiskDoc: { name: string; mimeType: string; dataUrl: string } | null = null;
  ticketPayload: any;
  authorizedQuoteFlag: boolean = false;


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
    private cdr: ChangeDetectorRef,

    private dmsService: DmsService,


  ) {
    this.viewQuoteFlag = JSON.parse(sessionStorage.getItem('viewQuoteFlag'));
    log.debug("View Quotation Flag", this.viewQuoteFlag)
    this.revisedQuotationNumber = sessionStorage.getItem('revisedQuotationNo');
    log.debug("Revised Quotation Number", this.revisedQuotationNumber);
    this.paymentFrequencies = [
      { label: 'Annually', value: 'A' },
      { label: 'Semi annually', value: 'S' },
      { label: 'Quarterly', value: 'Q' },
      { label: 'Monthly', value: 'M' },
      { label: 'One-off', value: 'O' }
    ];
    // this.authorizedQuoteFlag = JSON.parse(sessionStorage.getItem('authorizedQuoteFlag'));
    this.ticketStatus = sessionStorage.getItem('ticketStatus');
    this.showVerifyButton = JSON.parse(sessionStorage.getItem('showVerifyButton'));
    this.showViewDocumentsButton = JSON.parse(sessionStorage.getItem('showViewDocumentsButton'));
    this.showConfirmButton = JSON.parse(sessionStorage.getItem('showConfirmButton'));
    this.otpGenerated = JSON.parse(sessionStorage.getItem('otpGenerated'));
    this.changeToPolicyButtons = JSON.parse(sessionStorage.getItem('changeToPolicyButtons'));
    this.showAuthorizeButton = JSON.parse(sessionStorage.getItem('showAuthorizeButton'));

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




  shareQuoteData: ShareQuoteDTO = {
    selectedMethod: 'email',
    email: '',
    smsNumber: '',
    whatsappNumber: '',
    clientName: ''
  };

  ngOnInit(): void {
    // Check if fetchQuickQuoteProductClauses has already been called for this session
    const quickQuoteProductClausesFetched = sessionStorage.getItem('quickQuoteProductClausesFetched');
    if (!quickQuoteProductClausesFetched) {
      this.fetchQuickQuoteProductClauses();
    }

    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'));
    log.debug("two codes", this.quotationCode, this.quotationCodeString)
    this.quotationNumber = sessionStorage.getItem('quotationNumber') || sessionStorage.getItem('quotationNum');
    log.debug('quotationCode', this.quotationCodeString)
    log.debug("quick Quotation number", this.quotationNumber);
    this.storedQuotationFormDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails'));
    log.debug("QUOTATION FORM DETAILS", this.storedQuotationFormDetails)
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
        sessionStorage.setItem('quotationDetails', JSON.stringify(this.quotationDetails))
        const ticketStatus = response?.processFlowResponseDto?.taskName
        log.debug("Ticket status:", ticketStatus)
        this.ticketStatus = ticketStatus
        ticketStatus && sessionStorage.setItem('ticketStatus', ticketStatus);

        if ('Rejected' === response.status) {
          this.afterRejectQuote = true
        }
      });
    this.getQuotationDetails(this.quotationCode);


    // Retrieve authorization flag specific to this quotation
    const authorizedFlag = sessionStorage.getItem(`quotationAuthorized_${this.quotationCode}`);
    this.quotationAuthorized = authorizedFlag === 'true';

    if (this.quotationAuthorized) {
      this.showAuthorizeButton = false;
      // this.showViewDocumentsButton = true;
      // this.showVerifyButton = true;
    } else {
      this.showAuthorizeButton = true;
      // this.showViewDocumentsButton = false;
      // this.showVerifyButton = false;
    }


    this.clientDetails = JSON.parse(
      sessionStorage.getItem('clientFormData') ||
      sessionStorage.getItem('clientDetails') ||
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

    // Load quotation details first
    // this.getquotationDetails();

    // Then load introducers and set the name
    this.setIntroducerNameFromService();

    // this.quotationCode && this.getQuotationDetails(this.quotationCode);
    this.getuser();
    this.getRiskDetails();

    this.loadSummaryPerils()
    this.getUsers();


    log.debug("MORE DETAILS TEST", this.quotationDetails)

    this.limitAmount = Number(sessionStorage.getItem('limitAmount'));
    log.debug('SUM INSURED NGONIT', this.limitAmount);

    // this.createEmailForm();
    this.loadAllSubclass();
    // this.createSmsForm();
    // this.getDocumentTypes();

    this.hasUnderwriterRights();




    log.debug('QuotationView', this.quotationView)
    log.debug('quotationDetails', this.quotationDetails)
    // log.debug('quotationDetailsm', this.getQuotationDetails(this.productSubclass))


    this.shareForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      smsNumber: [''],

    });
    this.viewDocForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      cc: ['', Validators.email],
      bcc: ['', Validators.email],
      subject: [''],
      wording: [''],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      smsMessage: ['', [Validators.required, Validators.minLength(1)]]
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


    const selected = sessionStorage.getItem('selectedQuotation');

    if (selected) {
      const parsed = JSON.parse(selected);
      const quotationCode = parsed.quotationCode;


      this.getQuotationDetails(quotationCode);
    }

    const ticketJson = sessionStorage.getItem('activeTicket');

    if (ticketJson) {
      this.ticketData = JSON.parse(ticketJson);
      const quotationCode = this.ticketData.quotationCode;
      if (quotationCode) {
        this.quotationCode = quotationCode
      }
      this.getQuotationDetails(quotationCode);


    }

    //  this.patchQuotationData();

    console.log('Share Methods:', this.shareMethods);
  }

  ngAfterViewInit() {
    this.modals['chooseClientReassign'] = new bootstrap.Modal(this.chooseClientReassignModal.nativeElement);
    this.modals['reassignQuotation'] = new bootstrap.Modal(this.reassignQuotationModalElement.nativeElement);
    this.modals['clientConsentModal'] = new bootstrap.Modal(this.clientConsentModalElement.nativeElement);
    this.modals['rejectQuotation'] = new bootstrap.Modal(this.rejectQuotationModalElement.nativeElement);
  }

  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();

  }

  getquotationDetails() {
    const saved = sessionStorage.getItem("quotationFormDetails");

    if (saved) {
      this.storedQuotationFormDetails = JSON.parse(saved);
      this.quotationFormDetails = JSON.parse(saved);
      log.debug("Set quotationFormDetails:", this.quotationFormDetails);

      const branchName = this.storedQuotationFormDetails?.branch?.name;
      if (branchName) {
        this.branch = branchName;
      }
    }

  }

  setIntroducerNameFromService(): void {
    log.debug("setIntroducerNameFromService called");

    const quotationFormDetails = JSON.parse(sessionStorage.getItem("quotationFormDetails") || 'null');
    const introducerCode = quotationFormDetails?.introducer;

    if (!introducerCode) {
      log.debug("No introducer code found in session storage");
      return;
    }

    // Fetch introducers from service and find match
    this.quotationService.getIntroducers().subscribe({
      next: (introducers: any[]) => {
        log.debug("Received introducers data:", introducers);

        if (!introducers || introducers.length === 0) {
          log.debug("No introducers received from service");
          return;
        }

        const matchingIntroducer = introducers.find(i => i.code === introducerCode);
        // log.debug("Found matching introducer:", matchingIntroducer);

        if (matchingIntroducer) {
          const firstName = matchingIntroducer.surName?.trim() || '';
          const lastName = matchingIntroducer.otherNames?.trim() || '';
          this.introducerName = `${firstName} ${lastName}`.trim();

          log.debug("Successfully set introducerName to:", this.introducerName);
        } else {
          log.debug(`No matching introducer found for code: ${introducerCode}`);
          this.introducerName = 'Unknown Introducer';
        }

        // Store introducers for potential future use
        this.introducers = introducers;
      },
      error: (error) => {
        log.error("Error fetching introducers from service:", error);
        this.introducerName = 'Error loading introducer';
      }
    });
  }




  // closeMenu() {
  //   this.menuItems[0].expanded = false; // Collapse the section
  //   this.menuItems = [...this.menuItems]; // Trigger change detection
  //   this.cdr.detectChanges(); // Ensure UI updates
  // }

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
        sessionStorage.setItem('quotationDetails', JSON.stringify(this.quotationView))
        if (this.quotationView?.source?.description === 'Agent' && this.quotationView?.clientType === 'I') {
          this.getCommissions();
        }
        const ticketStatus = res?.processFlowResponseDto?.taskName
        log.debug("Ticket status:", ticketStatus)
        this.ticketStatus = ticketStatus
        ticketStatus && sessionStorage.setItem('ticketStatus', ticketStatus);
        this.premiumAmount = res.premium
        this.fetchedQuoteNum = this.quotationView.quotationNo;
        this.user = this.quotationView.preparedBy;
        log.debug('this user', this.user)
        this.quotationAuthorized = JSON.parse(sessionStorage.getItem('quotationHasBeenAuthorzed'))
        if (this.quotationAuthorized) {
          this.showAuthorizeButton = false;
          // this.showViewDocumentsButton = true;
          // this.showVerifyButton = true;
        }
        // this.getExceptions(this.quotationView.code);
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
        this.clientCode = this.quotationView?.clientCode;

        this.clientCode && this.loadClientDetails(this.clientCode);
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

        const Product1 = this.quotationDetails?.quotationProducts?.[0];
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
        // this.getExcesses(subclassCode);

        if (defaultRiskCode) {
          this.getSections(defaultRiskCode);
        }

      });


  }


  patchQuotationData() {
    const revisedQuotation = sessionStorage.getItem('revisedQuotation');
    if (!revisedQuotation) {
      log.debug('[QuotationSummaryComponent] No revisedQuotation found in session storage');
      return;
    }

    const data = JSON.parse(revisedQuotation);
    log.debug('[QuotationSummaryComponent] Patching from revisedQuotation session data:', data);

    const quotationCode = data._embedded.newQuotationCode;

    if (quotationCode) {
      log.debug('[QuotationSummaryComponent] Quotation code:', quotationCode);
      this.quotationCode = quotationCode
      this.getQuotationDetails(quotationCode);
    } else {
      log.debug('[QuotationSummaryComponent] No quotation code found in data');
    }



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
  fetchTicketPayload(): Observable<any> {
    if (this.quotationCode) {
      return this.quotationService.getTaskById(this.quotationCode).pipe(
        map((ticketData) => {
          log.debug('Ticket details:', ticketData);
          return {
            processDefinitionId: ticketData.processDefinitionId,
            processInstanceId: ticketData.processInstanceId,
            previousActivityId: ticketData.processDefinitionKey,
            processAttributeRequestDto: {
              quotationNumber: this.quotationNumber,
              quotationCode: this.quotationCode,
              processId: ticketData.taskId,
              ticketTo: 'Quotation Data Entry'
            }
          };
        }),
        catchError((error) => {
          log.error('Error during reassignment:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch ticket');
          return throwError(() => error);
        })
      );
    } else {
      return of(null);
    }
  }


  /**
   * Navigates to the edit details page.
   * @method editDetails
   * @return {void}
   */
  // editQuotationDetails() {
  //   const action = "E";
  //   sessionStorage.setItem("quotationAction", action);
  //   this.fetchTicketPayload().subscribe(res => {
  //     console.log('Ticket Payload:', res);
  //     this.ticketPayload = res
  //   });

  //   this.quotationService.changeTicketStatus(this.ticketPayload).subscribe(
  //     {
  //       next: (res) => {
  //         log.debug("RESPONSE AFTER CHANGING TICKET STATUS:", res)
  //         this.makeQuotationReady = !this.makeQuotationReady;
  //         this.authoriseQuotation = !this.authoriseQuotation;
  //         this.getQuotationDetails(this.quotationCode);
  //         this.messageService.displaySuccessMessage('Success', 'Quotation Made Ready, Authorise to proceed')
  //       },
  //       error: (e) => {
  //         log.debug(e)
  //         this.messageService.displayErrorMessage('error', 'Failed to make ready')
  //       }
  //     }
  //   )
  //   // this.router.navigate(['/home/gis/quotation/quotation-details']);
  // }
  editQuotationDetails() {
    const action = "E";
    sessionStorage.setItem("quotationAction", action);
    log.debug('qUOTATIONcODE', this.quotationCode)
    this.quotationService.undoMakeReady(this.quotationCode).subscribe(
      {
        next: (res) => {
          log.debug("RESPONSE AFTER UNDO MAKE READY:", res)
          const ticketStatus = res._embedded.taskName
          log.debug("Ticket status:", ticketStatus)
          this.ticketStatus = ticketStatus
          sessionStorage.setItem('ticketStatus', ticketStatus);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully undone make ready.')
          this.router.navigate(['/home/gis/quotation/quotation-details']);
        },
        error: (e) => {
          log.debug(e)
          this.globalMessagingService.displayErrorMessage('error', 'Failed to make ready')
        }
      }
    )
    // this.fetchTicketPayload().pipe(
    //   switchMap((payload) => {
    //     this.ticketPayload = payload;
    //     return this.quotationService.undoMakeReady(this.quotationCode);
    //   })
    // ).subscribe({
    //   next: (response) => {
    //     log.debug("RESPONSE AFTER Undoing make ready:", response);
    //     this.makeQuotationReady = !this.makeQuotationReady;
    //     this.authoriseQuotation = !this.authoriseQuotation;
    //     this.getQuotationDetails(this.quotationCode);
    //     // this.router.navigate(['/home/gis/quotation/quotation-details']);

    //   },
    //   error: (err) => {
    //     log.error(err);
    //     this.messageService.displayErrorMessage('Error', 'Failed to make ready');
    //   }
    // });
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

  sanitizeCurrency(raw: string): number {
    const cleaned = raw.replace(/[^0-9]/g, '');
    return Number(cleaned);
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
    this.quotationService.makeReady(this.quotationCode).subscribe(
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

  confirmQuote() {
    this.quotationService.confirmQuotation(this.quotationCode, this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.getQuotationDetails(this.quotationCode);
          this.globalMessagingService.displaySuccessMessage('Success', 'Quotation  Confirmed')
          this.changeToPolicyButtons = true
          sessionStorage.setItem('changeToPolicyButtons', JSON.stringify(this.changeToPolicyButtons))
          if (this.changeToPolicyButtons) {
            this.showViewDocumentsButton = false
            this.showVerifyButton = false
            this.showConfirmButton = false
            sessionStorage.setItem('showViewDocumentsButton', JSON.stringify(this.showViewDocumentsButton))
            sessionStorage.setItem('showVerifyButton', JSON.stringify(this.showVerifyButton))
            sessionStorage.setItem('showConfirmButton', JSON.stringify(this.showConfirmButton))

          }
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
          next: (res: any) => {
            this.limits = res
            this.limitsList = this.limits?._embedded
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
        next: (res: any) => {
          this.excesses = res;
          this.excessesList = res?._embedded ?? [];



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
    log.debug("Risk data passed", data)
    if (!data?.code) {
      log.debug('Invalid data for row click:', data);
      this.riskDetails = []
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
    // this.getExcesses(subclassCode);
    this.getRiskClauses(data.code);

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
    log.debug("Matching product ", matchingProduct);

    if (matchingProduct) {
      this.riskDetails = matchingProduct.riskInformation
      this.handleRowClick(matchingProduct.riskInformation[0])
      this.isRiskCollapsibleOpen = true
      this.taxDetails = matchingProduct.taxInformation;
      if (this.taxDetails.length > 0) {
        this.setColumnsFromTaxesDetails(this.taxDetails[0])

      }
      log.debug("Tax Details:", this.taxDetails);
    } else {
      log.debug("No matching product found for the given code.");
    }

    this.fetchAndLogQuotationProductClauses(proCode, data.productName || 'Selected Product', this.quotationView.code);
    this.getProductSubclass(proCode);
    // this.fetchSimilarQuotes(quotationProductCode);
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
        next: (res: any) => {
          this.riskClauses = res._embedded || [];
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

  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     for (let i = 0; i < input.files.length; i++) {
  //       const file = input.files[i];
  //       // Read the file as a data URL
  //       const reader = new FileReader();
  //       reader.onload = () => {
  //         // Convert the file to Base64 string
  //         const base64String = reader.result?.toString().split(',')[1];

  //         // Add the file to your files array with additional properties
  //         this.files.push({
  //           file,
  //           name: file.name,
  //           selected: false,
  //           documentType: this.selectedDocumentType,
  //           base64: base64String
  //         });
  //         log.debug("File:", this.clientDetails)
  //         let payload = {
  //           agentCode: "",
  //           agentName: "",
  //           brokerCode: "",
  //           brokerName: "",
  //           brokerType: "",
  //           cbpCode: "",
  //           cbpName: "",
  //           claimNo: "",
  //           claimantNo: "",
  //           clientCode: this.clientDetails.id,
  //           clientFullname: this.clientDetails.firstName + this.clientDetails.lastName,
  //           clientName: this.clientDetails.firstName,
  //           dateReceived: "",
  //           department: "",
  //           deptName: "",
  //           docData: "",
  //           docDescription: "",
  //           docId: "",
  //           docReceivedDate: "",
  //           docRefNo: "",
  //           docRemark: "",
  //           docType: this.selectedDocumentType,
  //           document: base64String,
  //           documentName: file.name,
  //           documentType: this.selectedDocumentType,
  //           endorsementNo: "",
  //           fileName: file.name,
  //           folderId: "",
  //           memberName: "",
  //           memberNo: "",
  //           module: "",
  //           originalFileName: "",
  //           paymentType: "",
  //           policyNo: "",
  //           policyNumber: "",
  //           processName: "",
  //           proposalNo: "",
  //           providerCode: "",
  //           providerName: "",
  //           qouteCode: "",
  //           rdCode: "",
  //           referenceNo: "",
  //           riskID: "",
  //           spCode: "",
  //           spName: "",
  //           subject: "",
  //           transNo: "",
  //           transType: "",
  //           userName: "",
  //           username: "",
  //           valuerDate: "",
  //           valuerName: "",
  //           voucherNo: ""
  //         }
  //         this.quotationService.postDocuments(payload).subscribe({
  //           next: (res) => {
  //             this.globalMessagingService.displaySuccessMessage('Success', 'Document uploaded successfully');
  //           }
  //         })
  //       };
  //       // Read the file as data URL
  //       reader.readAsDataURL(file);
  //       // this.files.push({ file, name: file.name, selected: false, documentType: this.selectedDocumentType });
  //     }
  //   }
  // }

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


  fetchInsurers() {
    this.quotationService.getInsurers().subscribe({
      next: (res: any) => {
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
      // this.selectedClientName = this.clientDetails.firstName +''+ this.clientDetails.lastName
      const clientDetailsString = JSON.stringify(this.clientDetails);
      sessionStorage.setItem('clientDetails', clientDetailsString);
      this.saveclient();
      // this.closebutton.nativeElement.click();
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
    this.clientName = (this.clientDetails?.firstName ?? '') + ' ' + (this.clientDetails?.lastName ?? '');

    log.debug("Client name:", this.clientName)
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
      user: this.clientToReassignQuotation.name,
      comment: this.reassignQuotationComment
    }

    const quotationCode = this.quotationCode;

    if (quotationCode) {
      // Call getTaskById service to get the taskId
      this.quotationService.getTaskById(quotationCode).pipe(
        switchMap((response) => {
          log.debug('Task details from getTaskById:', response);

          // Extract taskId from response
          const taskId = response?.taskId;
          const newAssignee = this.clientToReassignQuotation.name;
          const comment = this.reassignQuotationComment;

          if (!taskId) {
            throw new Error('Task ID not found in response');
          }

          return this.quotationService.reassignTicket(taskId, newAssignee, comment);
        })
      ).subscribe({
        next: (reassignResponse) => {
          log.debug('Ticket reassigned successfully:', reassignResponse);
          this.globalMessagingService.displaySuccessMessage('Success', 'Quotation reassigned successfully');
          this.closeReassignQuotationModal();
          this.onUserUnselect();
          this.reassignQuotationComment = null;
          this.router.navigate(['/home/gis/quotation/quotation-management']);
        },
        error: (error) => {
          log.error('Error during reassignment:', error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to reassign quotation');
        }
      });
    } else {
      log.warn('No quotation code found');
      this.globalMessagingService.displayWarningMessage('Warning', 'No quotation code found');
    }

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
      next: (response: any) => {
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
    const action = "E";
    sessionStorage.setItem("quotationAction", action);
    log.debug('qUOTATIONcODE', this.quotationCode)
    this.quotationService.undoMakeReady(this.quotationCode).subscribe(
      {
        next: (res) => {
          log.debug("RESPONSE AFTER UNDO MAKE READY:", res)
          const ticketStatus = res._embedded.taskName
          log.debug("Ticket status:", ticketStatus)
          this.ticketStatus = ticketStatus
          sessionStorage.setItem('ticketStatus', ticketStatus);
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully undone make ready.')
          this.router.navigate(['/home/gis/quotation/risk-center']).then(r => {
          });
        },
        error: (e) => {
          log.debug(e)
          this.globalMessagingService.displayErrorMessage('error', 'Failed to make ready')
        }
      })


  }

  toggleAll() {
    this.exceptionsData.forEach(e => (e.selected = this.selectAll));
  }
  logCheckbox(row: any) {
    console.log('Selected row:', row);
  }


  getExceptions(quotationCode: number) {
    this.quotationService.generateExceptions(quotationCode).subscribe({
      next: (res: any) => {
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
        next: (res: any) => {
          log.debug(`limits of liability (${scheduleType})`, res);

          if (scheduleType === 'L') {
            this.limitsRiskofLiability = res._embedded;

            if (this.limitsRiskofLiability?.length) {
              this.setColumnsFromLimitsOfLiabilityDetails(this.limitsRiskofLiability[0]);
            }
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
        .authoriseExceptions(selected)
        .subscribe({
          next: (res: any) => {
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

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showProductColumnModal = true;
  }





  toggleClauses(iconElement: HTMLElement): void {
    this.showClauses = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop; // align vertically with icon
    const left = iconElement.offsetLeft - 260; // shift left by modal width (~250px)

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showClausesColumnModal = true;
  }

  toggleTaxes(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showTaxesColumnModal = true;
  }
  toggleRisk(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskColumnModal = true;
  }

  toggleSection(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showSectionColumnModal = true;
  }



  toggleRiskClauses(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskClauseColumnModal = true;
  }

  toggleSchedule(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showScheduleColumnModal = true;
  }


  togglePeril(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showPerilColumnModal = true;
  }


  toggleExcess(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showExcessColumnModal = true;
  }

  toggleLimitsOfLiability(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

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
    const defaultVisibleFields = [
      'clauseShortDescription',
      'clause',

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

  // setColumnsFromScheduleDetails(sample: any) {
  //   const defaultVisibleFields = ['sectionShortDescription',
  //     'make',
  //     'cubicCapacity',
  //     'yearOfManufacture',
  //     'carryCapacity',
  //     'value',
  //     'bodyType'






  //   ];

  //   const excludedFields = [

  //   ];


  //   let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


  //   keys = keys.sort((a, b) => {
  //     if (a === 'productName') return -1;
  //     if (b === 'productName') return 1;
  //     return 0;
  //   });


  //   this.scheduleColumns = keys.map(key => ({
  //     field: key,
  //     header: this.sentenceCase(key),
  //     visible: defaultVisibleFields.includes(key),
  //   }));
  // }
  setColumnsFromScheduleDetails(sample: any) {
    if (!sample) {
      this.scheduleColumns = [];
      return;
    }

    const excludedFields: string[] = [

    ];

    // Step 1: Get all keys from the sample
    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));

    // Step 2: Sort keys so important ones (like productName) appear first if needed
    keys = keys.sort((a, b) => {
      if (a === 'productName') return -1;
      if (b === 'productName') return 1;
      return 0;
    });

    // Step 3: Choose which fields to show by default — for example:
    // - show all non-null or non-empty fields from the sample
    // - or show only the first few
    const defaultVisibleFields = keys.filter(
      key => sample[key] !== null && sample[key] !== '' && sample[key] !== undefined
    ).slice(0, 7); // show first 7 non-empty fields

    // Step 4: Map into column definitions
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


    let keys = Object?.keys(sample)?.filter(key => !excludedFields.includes(key));


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


      if (this.summaryPerils?.length > 0) {
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



  hasEmptySchedules(): boolean {
    const currentSchedule = this.getCurrentSchedule();
    return !currentSchedule || currentSchedule.length === 0;
  }

  hasExceptionsData(): boolean {
    return this.exceptionsData?.length > 0;
  }

  get authorizeButtonTooltip(): string {
    if (this.hasExceptionsData()) {
      return 'Please resolve exceptions';
    }
    if (this.hasEmptySchedules()) {
      return 'No schedules available for this risk';
    }
    return '';
  }

  get authorizeButtonDisabled(): boolean {
    return this.hasExceptionsData() || this.hasEmptySchedules();
  }

  authorizeQuote() {
    const quotationCode = this.quotationCode;
    const user = this.user;

    if (!this.hasUnderwriterRights()) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'This user does not have the rights to authorize a quote.'
      );
      this.router.navigate(['/quotation-management']);
      return;
    }

    // Step 1: Authorize
    this.quotationService.authorizeQuote(quotationCode, user).subscribe({
      next: (res) => {
        if (res?.status?.toUpperCase().trim() === 'SUCCESS') {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            res?.message || 'Quotation authorized successfully.'
          );

          sessionStorage.setItem(`quotationAuthorized_${quotationCode}`, 'true');
          if (res) {
            this.viewQuoteFlag = true
            sessionStorage.setItem(`viewQuoteFlag`, JSON.stringify(this.viewQuoteFlag));

          }


          // Step 2: Update Status
          const newStatus = 'Pending';
          const reason = '';
          this.quotationService.updateQuotationStatus(quotationCode, newStatus, reason)
            .subscribe({
              next: (updateRes) => {
                log.debug('Status update response', updateRes);
                this.globalMessagingService.displaySuccessMessage(
                  'Status Updated',
                  'Quotation status changed to Pending'
                );
                this.getQuotationDetails(this.quotationCode);

                this.showAuthorizeButton = false;
                this.showViewDocumentsButton = true;
                this.showVerifyButton = true;

                sessionStorage.setItem('showAuthorizeButton', JSON.stringify(this.showAuthorizeButton))
                sessionStorage.setItem('showViewDocumentsButton', JSON.stringify(this.showViewDocumentsButton))
                sessionStorage.setItem('showVerifyButton', JSON.stringify(this.showVerifyButton))

              },
              error: (err: HttpErrorResponse) => {
                log.error('Error updating quotation status', err);
                this.globalMessagingService.displayErrorMessage(
                  'Status Update Error',
                  err?.error?.message || err.message || 'Failed to update status.'
                );
              }
            });

        } else {
          this.globalMessagingService.displayErrorMessage(
            'Authorization Error',
            res?.message || 'Authorization failed.'
          );
        }
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
          this.showAuthorizeButton = false;
          this.showViewDocumentsButton = true;
          this.showVerifyButton = true;
          sessionStorage.setItem('showAuthorizeButton', JSON.stringify(this.showAuthorizeButton))
          sessionStorage.setItem('showViewDocumentsButton', JSON.stringify(this.showViewDocumentsButton))
          sessionStorage.setItem('showVerifyButton', JSON.stringify(this.showVerifyButton))

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

    log.debug("Client name:", this.clientName);

    const methodValue = this.shareQuoteData.selectedMethod?.toUpperCase();

    if (methodValue !== 'EMAIL' && methodValue !== 'SMS' && methodValue !== 'WHATSAPP') {
      this.globalMessagingService.displayErrorMessage("Error", "Please select a valid sending method");
      return;
    }

    const selectedMethod: 'EMAIL' | 'SMS' | 'WHATSAPP' = methodValue;


    let identifierValue = '';

    if (selectedMethod === 'EMAIL') {
      const emailCtrl = this.shareForm.get('email');
      if (!emailCtrl || emailCtrl.invalid) return;
      identifierValue = emailCtrl.value;
    } else if (selectedMethod === 'SMS' || selectedMethod === 'WHATSAPP') {
      const smsCtrl = this.shareForm.get('smsNumber');
      if (!smsCtrl || smsCtrl.invalid) return;
      identifierValue = smsCtrl.value;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP code

    const payload = {
      identifier: identifierValue,
      subject: "Action Required: Verify Your Consent with OTP",
      body: `Dear ${this.clientName},\nPlease use the following One-Time Password (OTP) to verify your consent: ${otp}`
    };

    this.quotationService.generateOTP(payload, selectedMethod).subscribe({
      next: (res: any) => {
        this.globalMessagingService.displaySuccessMessage(
          "Success",
          `OTP sent successfully via ${selectedMethod}`
        );
        this.otpResponse = { otp: otp, ...res };
        this.otpGenerated = true;
        this.cdr.detectChanges();
        sessionStorage.setItem('otpGenerated', JSON.stringify(this.otpGenerated));

        log.debug("otp generated:", this.otpGenerated);
        log.debug("Otp response", this.otpResponse)
      },
      error: (error) => {
        console.error("Error generating OTP:", error.error?.message || error);
        this.globalMessagingService.displayErrorMessage(
          "Error",
          `Failed to send OTP via ${selectedMethod}`
        );
      }
    });
  }


  onShareMethodChange(method: ShareMethod) {

    this.shareQuoteData.selectedMethod = method;
    console.log('Clicked method:', method);
    this.otpGenerated = false;
    this.cdr.detectChanges();


    this.shareForm.get('email')?.clearValidators();
    this.shareForm.get('smsNumber')?.clearValidators();
    this.shareForm.get('email')?.setValue('');
    this.shareForm.get('smsNumber')?.setValue('');
    this.shareForm.get('otp')?.setValue('');

    // Add validators based on method
    if (method === 'email') {
      this.shareForm.get('email')?.setValidators([Validators.email]);
    } else if (method === 'sms') {
      this.shareForm.get('smsNumber')?.setValidators([
        Validators.pattern(/^(\+254|0)[17]\d{8}$/)
      ]);
    }


    this.shareForm.get('email')?.updateValueAndValidity();
    this.shareForm.get('smsNumber')?.updateValueAndValidity();
  }




  // verifyOTP() {
  //   const userIdentifier = this.otpResponse.userIdentifier
  //   const otp = this.shareForm.value.otp
  //   this.quotationService.verifyOTP(userIdentifier, otp)
  //     .subscribe({
  //       next: (res: any[]) => {
  //         if (res) {
  //           this.globalMessagingService.displaySuccessMessage("Succes", "Successfully verified OTP")

  //           const modal = bootstrap.Modal.getInstance(this.consentModal.nativeElement);
  //           modal.hide();
  //           this.otpGenerated = false
  //           this.changeToPolicyButtons = true
  //           if (this.changeToPolicyButtons) {
  //             this.showViewDocumentsButton = false
  //             this.showConfirmButton = false
  //           }
  //         }
  //       },
  //       error: (err: any) => {
  //         const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);

  //         // 🔔 Show in global error handler
  //         this.globalMessagingService.displayErrorMessage("Error", backendMsg);
  //       }
  //     });
  // }
  closeConsentModal() {

    this.closeModals('clientConsentModal');
  }
  verifyOTP() {

    const userIdentifier = this.otpResponse?._embedded?.userIdentifier || this.otpResponse?.userIdentifier;
    const otp = this.shareForm.value.otp
    this.quotationService.verifyOTP(userIdentifier, otp)
      .subscribe({
        next: (res: any[]) => {
          if (res) {
            this.globalMessagingService.displaySuccessMessage("Succes", "Successfully verified OTP");

            (document.activeElement as HTMLElement)?.blur();

            const modalEl = this.clientConsentModalElement.nativeElement;
            const modal = bootstrap.Modal.getInstance(modalEl);

            if (modal) {
              // Add event listener for when modal is fully hidden
              modalEl.addEventListener(
                'hidden.bs.modal',
                () => {
                  document.body.classList.remove('modal-open');
                  document.body.style.overflow = '';
                  document.body.style.paddingRight = '';
                },
                { once: true } // remove listener automatically
              );

              modal.hide();
            }
            this.otpGenerated = false
            sessionStorage.setItem('otpGenerated', JSON.stringify(this.otpGenerated))

            this.showConfirmButton = true
            if (this.showConfirmButton) {
              this.showViewDocumentsButton = false
              this.showVerifyButton = false

              sessionStorage.setItem('showConfirmButton', JSON.stringify(this.showConfirmButton))
              sessionStorage.setItem('showViewDocumentsButton', JSON.stringify(this.showViewDocumentsButton))
              sessionStorage.setItem('showVerifyButton', JSON.stringify(this.showVerifyButton))

            }
          }
        },
        error: (err: any) => {
          let backendMessage = "An error occurred while verifying OTP";

          if (typeof err === 'string') {

            backendMessage = "Invalid, expired or already used OTP";
          } else {
            backendMessage = err?.error?.message || err?.message || backendMessage;
          }

          this.globalMessagingService.displayErrorMessage("Error", backendMessage);
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
    this.viewDocForm.updateValueAndValidity();
    
    if (!this.selectedReports || this.selectedReports.length === 0) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please select at least one report to send');
      return;
    }

    // Check if SMS tab is active (index 0)
    if (this.activeIndex === 0) {
      // Send via SMS
      this.sendReportViaSMS();
    } else {
      // Send via Email (index 1)
      this.sendReportViaEmailMethod();
    }
  }

  /**
   * Send reports via SMS
   */
  async sendReportViaSMS() {
    const phoneNumberControl = this.viewDocForm.get('phoneNumber');

    if (!phoneNumberControl) {
      this.globalMessagingService.displayErrorMessage('Error', 'Form controls not initialized');
      return;
    }

    // Validate phone number (exactly 10 digits)
    if (phoneNumberControl.invalid) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    const rawPhoneNumber = phoneNumberControl.value;
    
    // Generate SMS message template automatically
    const message = this.getSMSMessageTemplate();

    // Format phone number to 254 format
    let formattedPhoneNumber: string;
    try {
      formattedPhoneNumber = this.formatPhoneNumber(rawPhoneNumber);
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Invalid phone number format');
      return;
    }

    log.debug('Raw phone number:', rawPhoneNumber);
    log.debug('Formatted phone number:', formattedPhoneNumber);
    log.debug('Message:', message);

    this.spinner.show();

    this.quotationService.sendNormalQuotationSms(message, formattedPhoneNumber).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        log.debug('SMS sent successfully:', response);
        this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully');
        
        // Close the modal
        const modalEl = this.viewDocumentsModal.nativeElement;
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        log.error('Error sending SMS:', error);
        const errorMessage = error?.error?.message || error?.message || 'Failed to send SMS';
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
  }

  /**
   * Send reports via Email
   */
  async sendReportViaEmailMethod() {
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
      ccAddress: viewDocForm.cc,
      bccAddress: viewDocForm.bcc,
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
  isHovering = false;
  lensX = 0;
  lensY = 0;
  pdfImage: string = '';

  onMouseMove(event: MouseEvent) {
    this.isHovering = true;
    const container = (event.currentTarget as HTMLElement).getBoundingClientRect();

    // position lens relative to container
    this.lensX = event.clientX - container.left - 75;
    this.lensY = event.clientY - container.top - 75;

    // grab the first rendered PDF page as image (canvas snapshot)
    const canvas = (event.currentTarget as HTMLElement).querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      this.pdfImage = canvas.toDataURL();
    }
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  /**
   * Gets the full payment frequency label based on the abbreviation
   * @param frequencyValue - The frequency abbreviation (A, S, Q, M, O)
   * @returns The full label or the original value if not found
   */
  getPaymentFrequencyLabel(frequencyValue: string): string {
    if (!frequencyValue) return '';

    const frequency = this.paymentFrequencies.find(freq => freq.value === frequencyValue);
    return frequency ? frequency.label : frequencyValue;
  }

  fetchQuickQuoteProductClauses() {
    const quickQuotePayloadString = sessionStorage.getItem('quickQuotePayload');

    if (!quickQuotePayloadString) {
      log.debug('quickQuotePayload not found in session storage');
      return;
    }

    const quotationCodeString = sessionStorage.getItem('quotationCode');
    if (!quotationCodeString) {
      log.debug('quotationCode not found in session storage');
      return;
    }

    try {
      const quickQuotePayload = JSON.parse(quickQuotePayloadString);
      const quotationCode = Number(quotationCodeString);
      if (!quickQuotePayload.products || quickQuotePayload.products.length === 0) {
        log.debug('No products found in quickQuotePayload');
        return;
      }

      sessionStorage.setItem('quickQuoteProductClausesFetched', 'true');
      // log.debug('fetchQuickQuoteProductClauses marked as executed in session storage');

      const allProductClausesPayload: any[] = [];

      quickQuotePayload.products.forEach((product: any, index: number) => {
        const productCode = product.code;

        if (!productCode) {
          log.debug(`Product at index ${index} has no code`);
          return;
        }

        log.debug(`Fetching clauses for product: ${product.description} (Code: ${productCode})`);

        this.quotationService.getProductClauses(productCode)
          .subscribe({
            next: (clauses) => {
              log.debug(`All clauses for product ${product.description} (Code: ${productCode}):`, clauses);

              // Filter to get only mandatory clauses 
              const mandatoryClauses = clauses.filter((clause: any) => clause.isMandatory === 'Y');
              log.debug(`Mandatory clauses for product ${product.description} (Code: ${productCode}):`, mandatoryClauses);

              if (mandatoryClauses.length === 0) {
                log.debug(`No mandatory clauses found for product ${product.description} (Code: ${productCode})`);
                return;
              }

              //mandatory product clauses
              const transformedClauses = mandatoryClauses.map((clause: any) => ({
                clauseWording: clause.wording || '',
                clauseHeading: clause.heading || '',
                clauseCode: clause.code || 0,
                clauseType: clause.type || '',
                clauseEditable: clause.isEditable || 'N',
                clauseShortDescription: clause.shortDescription || ''
              }));

              const productClausePayload = {
                quotationCode: quotationCode,
                productCode: productCode,
                productClauses: transformedClauses
              };

              allProductClausesPayload.push(productClausePayload);

              log.debug(`Transformed mandatory clauses for product ${product.description}:`, productClausePayload);

              // Post only the mandatory clauses to the quotation
              this.quotationService.createQuotationProductClauses([productClausePayload])
                .subscribe({
                  next: (response) => {
                    log.debug(`Successfully posted mandatory clauses for product ${product.description} (Code: ${productCode}):`, response);
                    this.globalMessagingService.displaySuccessMessage(
                      'Success',
                      `Mandatory product clauses added successfully for ${product.description}`
                    );

                    this.fetchAndLogQuotationProductClauses(productCode, product.description, quotationCode);
                  },
                  error: (err) => {
                    log.debug(`Error posting mandatory clauses for product ${product.description} (Code: ${productCode}):`, err);
                    this.globalMessagingService.displayErrorMessage(
                      'Error',
                      `Failed to add mandatory clauses for ${product.description}. Please try again.`
                    );
                  }
                });
            },
            error: (err) => {
              log.debug(`Error fetching clauses for product ${product.description} (Code: ${productCode}):`, err);
              this.globalMessagingService.displayErrorMessage(
                'Error',
                `Failed to fetch clauses for ${product.description}. Please try again.`
              );
            }
          });
      });

    } catch (error) {
      log.debug('Error parsing quickQuotePayload from session storage:', error);
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Failed to process product clauses. Please refresh and try again.'
      );
    }
  }

  /**
   * Fetches and logs quotation product clauses after they have been posted
   * @param productCode - The product code
   * @param productDescription - The product description for logging
   * @param quotationCode - The quotation code
   */
  fetchAndLogQuotationProductClauses(productCode: number, productDescription: string, quotationCode: number) {
    this.quotationService.getQuotationDetails(quotationCode)
      .subscribe({
        next: (quotationDetails: any) => {
          const quotationProduct = quotationDetails.quotationProducts?.find(
            (qp: any) => qp.productCode === productCode
          );

          if (quotationProduct && quotationProduct.code) {
            const quotationProductCode = quotationProduct.code;
            // log.debug(`Found quotationProductCode ${quotationProductCode} for product ${productDescription} (Code: ${productCode})`);

            this.quotationService.getQuotationProductClauses(quotationProductCode)
              .subscribe({
                next: (response: any) => {
                  if (response.status === 'SUCCESS' && response._embedded) {
                    const clauses = response._embedded;
                    // log.debug(`${response.message} - Retrieved ${clauses.length} clauses for ${productDescription}`);
                    this.sessionClauses = clauses;
                    if (this.sessionClauses.length > 0) {
                      this.setProductClauseColumns(this.sessionClauses[0]);
                    }

                  } else {
                    log.debug(`Unexpected response format or no clauses for ${productDescription}:`, response);
                  }
                },
                error: (err) => {
                  log.debug(`Error fetching quotation product clauses for ${productDescription}:`, err);
                }
              });
          } else {
            log.debug(`Could not find quotationProductCode for product ${productDescription} (Code: ${productCode}) in quotation details`);
          }
        },
        error: (err) => {
          log.debug(`Error fetching quotation details to get quotationProductCode for product ${productDescription}:`, err);
        }
      });
  }

  //product clauses
  saveProductClauseColumnsToSession(): void {
    if (this.productClauseColumns) {
      const visibility = this.productClauseColumns.map(col => ({
        field: col.field,
        visible: col.visible
      }));
      sessionStorage.setItem('productClauseColumns', JSON.stringify(visibility));
    }
  }

  toggleProductClauseColumnVisibility(field: string) {
    this.saveProductClauseColumnsToSession();
  }

  toggleProductClauseColumns(iconElement: HTMLElement): void {

    this.showProductClauses = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 160;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showProductClauseColumnModal = true;
  }

  setProductClauseColumns(productClause: any) {
    const excludedFields = [
    ];

    this.productClauseColumns = Object.keys(productClause)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: this.defaultVisibleProductClauseFields.includes(key),
        filterable: true,
        sortable: true
      }));

    const saved = sessionStorage.getItem('productClauseColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.productClauseColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }

    // log.debug("productClauseColumns", this.productClauseColumns);
  }

  defaultVisibleProductClauseFields = ['clauseShortDescription', 'clauseHeading', 'clauseWording'];



  getCommissions() {
    const quotationCode = this.quotationCode;

    if (!quotationCode) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Quotation code is missing.'
      );
      return;
    }

    this.quotationService.getRiskCommissions(quotationCode).subscribe({
      next: (res: any) => {

        if (res?.status?.toUpperCase().trim() === 'SUCCESS' || res?.data) {
          this.riskCommissions = res?._embedded || [];
          if (this.riskCommissions.length) {
            this.setColumnsFromCommissions(this.riskCommissions[0]);
          }
          // this.globalMessagingService.displaySuccessMessage(
          //   'Success',
          //   res?.message || 'Commissions loaded successfully.'
          // );
        } else {
          this.globalMessagingService.displayErrorMessage(
            'Error',
            res?.message || 'Failed to load commissions.'
          );
        }
      },
      error: (err: HttpErrorResponse) => {
        log.error('Error fetching commissions:', err);

        this.globalMessagingService.displayErrorMessage(
          'Error',
          err?.error?.message || err.message || 'Failed to load commissions.'
        );
      }
    });
  }

  toggleCommission(iconElement: HTMLElement): void {

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showCommissionColumnModal = true;
  }


  setColumnsFromCommissions(sample: any) {
    // Fields to show by default
    const defaultVisibleFields = [
      // for Agent Name
      'transDescription',
      'discRate',
      'discType',
      'amount',
      'group'
    ];

    // Fields to exclude (optional)
    const excludedFields = [
      'quotationRiskCode',
      'quotationCode',
      'code',
      'id',
      'accountCode'
    ];

    // Get all keys from sample and filter excluded fields
    let keys = Object.keys(sample).filter(key => !excludedFields.includes(key));


    keys = keys.sort((a, b) => {
      if (a === 'transDescription') return -1;
      if (b === 'transDescription') return 1;
      return 0;
    });

    // Map to column objects
    this.commissionColumns = keys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleFields.includes(key)
    }));
  }

  isEditDisabled(): boolean {

    if (this.viewQuoteFlag) return true;
    if (this.ticketStatus === 'AUTHORIZED') return true;

    return false;
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
  toggleClientCard(iconElement: HTMLElement): void {
    this.showRiskDoc = true;

    const parentOffset = iconElement.offsetParent as HTMLElement;

    const top = iconElement.offsetTop + 30;
    const left = iconElement.offsetLeft - 260;

    this.columnModalPosition = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.showRiskDocColumnModal = true;
  }

  setRiskDocColumns(doc: any) {
    const excludedFields = [
    ];
    const defaultVisibleClientDocFields = ['name', 'docType', 'dateCreated', 'modifiedBy', 'actions'];

    const keys = Object.keys(doc).filter(key => !excludedFields.includes(key));

    // Separate default fields and the rest
    const defaultFields = defaultVisibleClientDocFields.filter(f => keys.includes(f));
    const otherFields = keys.filter(k => !defaultVisibleClientDocFields.includes(k));

    // Strictly order = defaults first, then others
    const orderedKeys = [...defaultFields, ...otherFields];

    this.riskDocColumns = orderedKeys.map(key => ({
      field: key,
      header: this.sentenceCase(key),
      visible: defaultVisibleClientDocFields.includes(key),
      truncate: defaultVisibleClientDocFields.includes(key),
      filterable: true,
      sortable: true
    }));

    this.riskDocColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false });
    log.debug("Client doc Columns", this.riskDocColumns)
    // Restore from sessionStorage if exists
    const saved = sessionStorage.getItem('clientDocColumns');
    if (saved) {
      const savedVisibility = JSON.parse(saved);
      this.riskDocColumns.forEach(col => {
        const savedCol = savedVisibility.find((s: any) => s.field === col.field);
        if (savedCol) col.visible = savedCol.visible;
      });
    }
  }


  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
  onDocumetTabSelect(selectedRisk: RiskInformation) {
    log.debug("Selected risk-", selectedRisk)
    const selectedRiskCode = selectedRisk.code
    selectedRisk && this.fetchRiskDoc(selectedRiskCode)
  }
  fetchRiskDoc(riskId: any) {
    log.debug("Selected Risk code:", riskId)
    this.dmsService.fetchRiskDocs(riskId)
      .subscribe({
        next: (res: DmsDocument[]) => {
          log.debug('Response after fetching clients DOCS:', res)
          this.riskDocuments = res
          if (this.riskDocuments && this.riskDocuments.length > 0) {
            this.setRiskDocColumns(this.riskDocuments[0]);
          }
        },
        error: (err: any) => {
          const backendMsg = err.error?.message || err.message || 'An unexpected error occurred'; console.error("OTP Verification Error:", backendMsg);
          this.globalMessagingService.displayErrorMessage("Error", backendMsg);
        }
      });
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
  removeFile(): void {
    this.selectedFile = null;
    this.errorMessage = '';

    ;
  }
  addRiskDocuments(selectedFile: any) {
    log.debug("Selected risk", this.selectedRisk)
    const selectedRiskCode = this.selectedRisk.code
    const file = selectedFile
    const reader = new FileReader();

    reader.onload = () => {
      // Convert to base64 string (remove prefix like "data:application/pdf;base64,")
      const base64String = (reader.result as string).split(',')[1];
      const clientName = (this.clientDetails?.firstName ?? '') + ' ' + (this.clientDetails?.lastName ?? '')
      let riskDocPayload: RiskDmsDocument = {

        docType: file.type,
        docData: base64String,
        originalFileName: file.name,
        riskID: selectedRiskCode.toString()

      }

      this.dmsService.uploadRiskDocs(riskDocPayload).subscribe({
        next: (res: any) => {
          log.info(`document uploaded successfully!`, res);
          this.globalMessagingService.displaySuccessMessage('Success', 'Document uploaded successfully');
          this.fetchRiskDoc(this.selectedRisk?.code)
          const modal = bootstrap.Modal.getInstance(this.addRiskDocModalRef.nativeElement);
          modal.hide();
        },
        error: (err) => {
          log.info(`upload failed!`, err)
        }
      });
    }
    reader.readAsDataURL(file);
  }
  saveRiskDoc() {
    this.selectedFile && this.addRiskDocuments(this.selectedFile);

  }

  onPreviewRiskDoc(event: any) {
    this.selectedRiskDoc = event;
    log.info("Selected client doc", this.selectedRiskDoc)
    this.fetchDocById(this.selectedRiskDoc)
  }
  fetchDocById(selectedRiskDoc: DmsDocument) {
    const docId = selectedRiskDoc.id

    this.dmsService.getDocumentById(docId).subscribe({
      next: (res: any) => {
        log.info(`Selected Document details`, res);
        // Construct the preview-friendly object
        this.previewRiskDoc = {
          name: res.docName,
          mimeType: res.docMimetype,
          dataUrl: `data:${res.docMimetype};base64,${res.byteData}`
        };

        const modal = new bootstrap.Modal(document.getElementById('previewDocModal'));
        modal.show();
      },
      error: (err) => {
        log.info(`upload failed!`, err)
      }
    });
  }
  private documentBlobs: { [id: string]: Blob } = {};

  onDownloadRiskDoc(event: any) {
    this.selectedRiskDoc = event;
    log.info("Selected client doc", this.selectedRiskDoc);

    const docId = this.selectedRiskDoc.id;

    // If we already have it cached, download directly
    if (this.documentBlobs[docId]) {
      this.downloadRiskDocument(docId, this.selectedRiskDoc.actualName);
      return;
    }

    // Otherwise, fetch from backend
    this.dmsService.getDocumentById(docId).subscribe({
      next: (res: any) => {
        log.info(`Selected Document details`, res);

        if (!res || res.empty || !res.byteData) {
          log.warn("Document data is empty or invalid");
          return;
        }

        const byteCharacters = atob(res.byteData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: res.docMimetype });
        this.documentBlobs[docId] = blob; // cache it

        this.downloadRiskDocument(docId, res.docName);
      },
      error: (err) => {
        log.error(`Download failed!`, err);
      },
    });
  }

  downloadRiskDocument(docId: string, fileName?: string) {
    const blob = this.documentBlobs[docId];
    if (!blob) {
      log.warn("No cached blob found for document:", docId);
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    log.info("Document downloaded:", fileName);
  }

  onDeleteRiskDoc(event: any) {
    this.selectedRiskDoc = event;
    log.info("Selected risk doc", this.selectedRiskDoc);


  }
  deleteRiskDoc() {
    const docId = this.selectedRiskDoc.id;

    this.dmsService.deleteDocumentById(docId).subscribe({
      next: (res: any) => {
        log.info(`Response after deleting  Document details`, res);
        this.globalMessagingService.displaySuccessMessage('Success', 'Document deleted successfully');
        // Remove the deleted doc from the clientDocuments array
        const index = this.riskDocuments.findIndex(doc => doc.id === this.selectedRiskDoc.id);
        if (index !== -1) {
          this.riskDocuments.splice(index, 1);
        }
        this.selectedRiskDoc = null

      },
      error: (err) => {
        log.error(`Download failed!`, err);
      },
    });
  }

  /**
   * Get product type from quotation details
   */
  getProductType(): string {
    if (!this.quotationView?.quotationProducts || this.quotationView.quotationProducts.length === 0) {
      return 'Insurance';
    }
    return this.quotationView.quotationProducts
      .map(p => p.productName || p.productCode)
      .join(', ');
  }

  /**
   * Get total sum insured from all risks
   */
  getTotalSumInsured(): number {
    if (!this.quotationView?.quotationProducts) {
      return 0;
    }

    return this.quotationView.quotationProducts.reduce((total: number, product: any) => {
      if (!product.riskInformation) return total;
      return total + product.riskInformation.reduce((sum: number, risk: any) => {
        return sum + (risk.value || 0);
      }, 0);
    }, 0);
  }

  /**
   * Get total premium from quotation
   */
  getTotalPremium(): number {
    if (!this.quotationView?.quotationProducts) {
      return 0;
    }

    return this.quotationView.quotationProducts.reduce((total: number, product: any) => {
      if (!product.riskInformation) return total;
      return total + product.riskInformation.reduce((sum: number, risk: any) => {
        return sum + (risk.premium || 0);
      }, 0);
    }, 0);
  }

  /**
   * Get insurer name from session storage store_ details
   */
  getInsurerName(): string {
    try {
      const storeDetailsRaw = sessionStorage.getItem('store_');
      if (storeDetailsRaw) {
        const storeDetails = JSON.parse(storeDetailsRaw);
        // Use API_TENANT_ID as the insurer name
        if (storeDetails.API_TENANT_ID) {
          return storeDetails.API_TENANT_ID;
        }
      }
    } catch (error) {
      log.error('Error parsing store details from session storage', error);
    }
    // Fallback to stored insurerName or default
    return sessionStorage.getItem('insurerName') || 'Turnkey Insurance';
  }

  /**
   * Get customer name from session storage client details
   */
  getCustomerName(): string {
    try {
      const clientDetailsRaw = sessionStorage.getItem('SelectedClientDetails');
      if (clientDetailsRaw) {
        const clientDetails = JSON.parse(clientDetailsRaw);
        // Use firstName and lastName if available, otherwise use clientFullName
        if (clientDetails.firstName && clientDetails.lastName) {
          return `${clientDetails.firstName} ${clientDetails.lastName}`.trim();
        } else if (clientDetails.clientFullName && clientDetails.clientFullName !== 'null null') {
          return clientDetails.clientFullName;
        } else if (clientDetails.lastName) {
          return clientDetails.lastName;
        }
      }
    } catch (error) {
      log.error('Error parsing client details from session storage', error);
    }
    return 'Customer';
  }

  /**
   * Handle tab change event
   */
  onTabChange(event: any): void {
    // Update active index to track current tab
    this.activeIndex = event.index;
  }

  /**
   * Get SMS message template with dynamic content
   */
  getSMSMessageTemplate(): string {
    const customerName = this.getCustomerName();
    const message = `Dear ${customerName},
    Your insurance quotation #${this.fetchedQuoteNum} for ${this.getProductType()} is ready. Valid until ${this.expiryDate}.
    Sum insured: KES ${this.getTotalSumInsured().toFixed(2)} Premium: KES ${this.getTotalPremium().toFixed(2)}
    For the full quote, please contact us. ${this.getInsurerName()}`;

    return message;
  }

  /**
   * Format phone number to international format (254XXXXXXXXX)
   * @param phoneNumber - The phone number to format
   * @returns Formatted phone number with 254 prefix
   */
  formatPhoneNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // If already starts with 254, return as is
    if (cleaned.startsWith('254')) {
      return cleaned;
    }

    if (!cleaned.match(/^(01|07)/)) {
      throw new Error("Invalid phone number format");
    }

    // Convert to 254 format by removing leading 0 and adding 254
    return '254' + cleaned.substring(1);
  }

  sendQuotationSms() {
    // Mark form as touched to show validation errors
    this.viewDocForm.markAllAsTouched();
    
    // Check if the SMS form fields are valid
    const phoneNumberControl = this.viewDocForm.get('phoneNumber');
    const smsMessageControl = this.viewDocForm.get('smsMessage');

    if (!phoneNumberControl || !smsMessageControl) {
      this.globalMessagingService.displayErrorMessage('Error', 'Form controls not initialized');
      return;
    }

    // Validate phone number (exactly 10 digits)
    if (phoneNumberControl.invalid) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Validate message content
    if (smsMessageControl.invalid || !smsMessageControl.value?.trim()) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please enter a message to send');
      return;
    }

    const rawPhoneNumber = phoneNumberControl.value;
    const message = smsMessageControl.value;

    // Format phone number to 254 format
    let formattedPhoneNumber: string;
    try {
      formattedPhoneNumber = this.formatPhoneNumber(rawPhoneNumber);
    } catch (error) {
      this.globalMessagingService.displayErrorMessage('Error', 'Invalid phone number format');
      return;
    }

    log.debug('Raw phone number:', rawPhoneNumber);
    log.debug('Formatted phone number:', formattedPhoneNumber);
    log.debug('Message:', message);

    this.spinner.show();

    this.quotationService.sendNormalQuotationSms(message, formattedPhoneNumber).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        log.debug('SMS sent successfully:', response);
        this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully');
        
        // Optionally close the modal
        const modalEl = this.viewDocumentsModal.nativeElement;
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
          modal.hide();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        log.error('Error sending SMS:', error);
        const errorMessage = error?.error?.message || error?.message || 'Failed to send SMS';
        this.globalMessagingService.displayErrorMessage('Error', errorMessage);
      }
    });
  }

}

