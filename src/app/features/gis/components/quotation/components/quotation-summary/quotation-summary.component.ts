import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IntermediaryService } from "../../../../../entities/services/intermediary/intermediary.service";
import { ProductService } from "../../../../services/product/product.service";
import { AuthService } from "../../../../../../shared/services/auth.service";
import { BranchService } from "../../../../../../shared/services/setups/branch/branch.service";
import { BankService } from "../../../../../../shared/services/setups/bank/bank.service";
import { Logger } from "../../../../../../shared/services";
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { LimitsOfLiability, QuotationProduct } from '../../data/quotationsDTO';

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
export class QuotationSummaryComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('closebutton') closebutton;

  steps = quoteStepsData;
  quotationCode: any
  quotationNumber: any;
  quotationDetails: any
  quotationView: any
  moreDetails: any
  clientDetails: any
  agents: any;
  agentName: any
  agentDetails: any
  productDetails: any = [];
  prodCode: any
  riskDetails: any
  quotationProducts: any
  taxDetails: any
  riskInfo: any = [];
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
  excessesList: any[];
  subclassList: any;
  productSubclass: any;
  allSubclassList: any;
  documentTypes: any;
  riskClauses: any;
  modalHeight: number = 200; // Initial height


  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  selectedDocumentType: string = '';
  prodCodeString: string;
  clientCodeString: string;
  branchCode: number;
  limitAmount: number;
  quotationCodeString: string;
  selectedExternalClaimExp: any;
  selectedIntetnalClaimExp: any;
  insurersList: any = [];
  insurerNames: any;
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
  quotationSources: any;
  source: number;
  sourecDescription: string;
  quickQuoteData: any;
  expiryDate: string;
  selectedRisk: any;
  fetchedQuoteNum: string;


  constructor(

    public sharedService: SharedQuotationsService,
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
    private config: PrimeNGConfig,
    private clientService: ClientService,

  ) { }
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
      // public cdr: ChangeDetectorRef;
  public cdr: ChangeDetectorRef;



  ngOnInit(): void {
    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quickQuotationNum') || sessionStorage.getItem('quotationNum');
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
      this.quotationCode = this.quotationCodeString;
    }

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
      this.prodCode = parsedMoreDetails.productCode;
      this.clientCode = parsedMoreDetails.clientCode;
    } else {
      this.clientCodeString = sessionStorage.getItem('clientCode');
      this.clientCode = JSON.parse(this.clientCodeString);
    }

    this.getQuotationDetails(this.quotationNumber);
    this.getuser();
    this.getExternalClaimsExperience(this.clientCode);
    this.getInternalClaimsExperience(this.clientCode);
    // this.getPremiumComputationDetails();
    // this.getAgent();
    this.createInsurersForm();
    this.fetchInsurers();
    this.loadClientDetails(this.clientCode);

    log.debug("MORE DETAILS TEST", this.quotationDetails)

    this.limitAmount = Number(sessionStorage.getItem('limitAmount'));
    log.debug('SUM INSURED NGONIT', this.limitAmount);

    // if (this.limitAmount) {
    //   this.sumInsured = this.limitAmount;
    // }

    this.createEmailForm();
    this.loadAllSubclass();
    this.createSmsForm();
    this.getDocumentTypes();

    this.menuItems = [
      {
        label: 'Claims Experience',
        expanded: false, // Initially expanded
        items: [
          {
            label: 'External',
            command: () => { this.external(); this.closeMenu(); }
          },
          {
            label: 'Internal',
            command: () => { this.internal(); this.closeMenu(); }
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
    this.quotationService.getQuotationDetails(code).subscribe(res => {
      this.quotationView = res;

      this.fetchedQuoteNum = this.quotationView.quotationNo;
      log.debug("DETAILS TEST quotation data", this.quotationView);
      log.debug(code, "code");

      // Set quotationDetails from response if not already set from moreDetails
      if (!this.moreDetails) {
        this.quotationDetails = this.quotationView;
        log.debug("MORE DETAILS TEST quotationView", this.quotationDetails)
      }


        this.sumInsured = this.quotationView.sumInsured;


      if (!this.quotationCodeString) {
        // Access the quotationCode from the first riskInformation object
        this.quotationCode = this.quotationView.quotationProducts[0]?.riskInformation[0]?.quotationCode;
        log.debug("quotaion code", this.quotationCode)
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
      this.source = this.quotationView.sourceCode

      if (this.source) {
        this.getQuotationSources()
      }

      // Extract product details
      this.quotationProducts = this.quotationView.quotationProduct;
      this.riskDetails = this.quotationView.quotationProducts[0]?.riskInformation;
      log.debug("Risk Details quotation-summary", this.riskDetails);

      this.productDetails = this.quotationView.quotationProducts

      this.getbranch();
      this.getPremiumComputationDetails();
      this.getAgent();

      this.taxDetails = this.quotationView.taxInformation;
      log.debug(this.taxDetails);

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
    });
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

    this.riskDetails.forEach((el: { code: any; sectionsDetails: any; scheduleDetails: { level1: any; }; }) => {

      if (data === el.code) {
        this.sections = el.sectionsDetails
        this.schedules = [el.scheduleDetails?.level1]
      }

    })
    log.debug(this.schedules, "schedules Details")
    log.debug(this.sections, "section Details")

  }

  /**
   * Navigates to the edit details page.
   * @method editDetails
   * @return {void}
   */
  editDetails() {
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
    log.debug(JSON.parse(this.moreDetails), "more  details")

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
          this.getQuotationDetails(this.quotationNumber);
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
          this.getQuotationDetails(this.quotationNumber);
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
          this.getQuotationDetails(this.quotationNumber);
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
    this.quotationService.getExternalClaimsExperience(clientCode).subscribe(res => {
      this.externalClaims = res;
      this.externalTable = this.externalClaims._embedded;
      log.debug("external claims table", this.externalTable);
    })
  }

  getInternalClaimsExperience(clientCode: number) {
    this.quotationService.getInternalClaimsExperience(clientCode).subscribe(res => {
      this.internalClaims = res;
      this.internalTable = this.internalClaims.embedded;
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
        log.debug("Response before modifyig limits",res)
        this.computationDetails = res
        this.computationDetails.underwritingYear = new Date().getFullYear();
        // // Modify the prorata field for all risks
        // this.computationDetails.risks.forEach((risk: any) => {
        //   risk.prorata = 'F';
        //   risk.limits.forEach((limit: any) => {
        //     // Retrieve and log session storage values
        //     const premiumRate = Number(sessionStorage.getItem('premiumRate'));
        //     const sectionDescription = sessionStorage.getItem('sectionDescription');
        //     const sectionType = sessionStorage.getItem('sectionType');
        //     const multiplierDivisionFactor = 1
        //     const rateType = "FXD"
        //     //  const divisionFactor = sessionStorage.getItem('divisionFactor');
        //     const limitAmount = this.sumInsured


        //     log.debug('Retrieved values from session storage:', {
        //       premiumRate,
        //       sectionType,
        //       multiplierDivisionFactor,
        //       rateType,
        //       sectionDescription,
        //       //  divisionFactor,
        //       limitAmount
        //     });
        //     // Update the fields you want to modify
        //     limit.premiumRate = Number(sessionStorage.getItem('premiumRate'));
        //     limit.description = sessionStorage.getItem('sectionDescription');
        //     // limit.sectionType = sessionStorage.getItem('sectionType');
        //     limit.multiplierDivisionFactor = 1
        //     limit.rateType = "FXD"
        //     // limit.rateDivisionFactor = sessionStorage.getItem('divisionFactor');
        //     limit.limitAmount = this.sumInsured
        //   });
        // });
        // log.debug("Latest COMPUTATION Details", this.computationDetails.risks)
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
    // this.router.navigate(['/home/gis/quotation/quotations-client-details'])
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
    this.quotationService.sendEmail(payload).subscribe({
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

  getExcesses(riskCode: any) {
    if (!this.prodCode || !riskCode) {
      log.debug('Missing required parameters for getExcesses:', { prodCode: this.prodCode, riskCode });
      return;
    }

    this.quotationService.getLimits(this.prodCode, 'E', riskCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.excesses = res;
          this.excessesList = this.excesses._embedded;
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
    // Call all methods sequentially
    this.getSections(data.code);
    this.getExcesses(data.code);
    this.getRiskClauses(data.code);
  }

  handleProductClick(data: any) {
    if (!data) {
      log.debug('Invalid data for row click:', data);
      return;
    }

    this.selectedProduct = data;

    log.debug('Product clicked with data:', data);

    const proCode = data.proCode;
    log.debug("product Code", proCode);

    const quotationProductCode = data.code;
    log.debug("product quotation Code", quotationProductCode);

    this.getProductClause(proCode);
    this.getProductSubclass(proCode);
    this.fetchSimilarQuotes(quotationProductCode);
    // this.getLimits(quotationProductCode);
  }

  loadAllSubclass() {
    return this.subclassService.getAllSubclasses().subscribe(data => {
      this.allSubclassList = data;
      log.debug(this.allSubclassList, " from the service All Subclass List");
    })
  }

  getProductSubclass(code: string): void {
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
          this.files.push({ file, name: file.name, selected: false, documentType: this.selectedDocumentType, base64: base64String });
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
          log.debug('Error deleteing external claim exp', error);
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
  getQuotationSources() {
    this.quotationService.getAllQuotationSources().subscribe(res => {
      const sources = res
      this.quotationSources = sources.content
      log.debug("SOURCES", this.quotationSources)
      const selectedSource = this.quotationSources.filter(source => source.code == this.source)
      log.debug("Selected Source:", selectedSource)
      this.sourecDescription = selectedSource[0].description
    })
  }
  updateQuotationPremmium() {
    log.debug("Premium computation Response:", this.premium)
    const selectedProduct = this.quotationView.quotationProducts[0];
    log.debug("Selected product", selectedProduct)

    // Transforming data into the expected payload format
    const transformedPayload = {
      premiumAmount: this.premium.premiumAmount,
      productCode: selectedProduct.proCode,
      quotProductCode: selectedProduct.code,
      productPremium: this.premium.premiumAmount,
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
        result && this.getQuotationDetails(this.quotationNumber);

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
}
