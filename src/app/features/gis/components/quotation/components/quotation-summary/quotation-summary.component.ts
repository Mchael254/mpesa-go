import { Component, ElementRef, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { untilDestroyed } from 'src/app/shared/services/until-destroyed';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {IntermediaryService} from "../../../../../entities/services/intermediary/intermediary.service";
import {ProductService} from "../../../../services/product/product.service";
import {AuthService} from "../../../../../../shared/services/auth.service";
import {BranchService} from "../../../../../../shared/services/setups/branch/branch.service";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {Logger} from "../../../../../../shared/services";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";

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
  steps = quoteStepsData;
  quotationCode:any
  quotationNumber:any;
  quotationDetails:any
  quotationView:any
  moreDetails:any
  clientDetails:any
  agents:any;
  agentName:any
  agentDetails:any
  productDetails:any = [];
  prodCode:any
  riskDetails:any
  quotationProducts:any
  taxDetails:any
  riskInfo:any = [];
  clauses:any;
  user:any;
  clientCode:any;
  externalClaims:any;
  internalClaims:any;
  computationDetails:any;
  premium:any;
  branch: any;
  currency:any;
  externalTable:any;
  internalTable:any;
  menuItems:MenuItem[] | undefined;
  sumInsured:any;
  userDetails:any;
  emailForm: FormGroup;
  smsForm:FormGroup;
  sections:any;
  schedules:any[];
  limits:any;
  limitsList:any[];
  excesses:any;
  excessesList:any[];
  subclassList:any;
  productSubclass:any;
  allSubclassList:any;
  documentTypes:any;
  riskClauses:any;
  modalHeight: number = 200; // Initial height


  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;
  selectedDocumentType: string = '';
  prodCodeString : string;
  clientCodeString: string;
  branchCode: number;
  limitAmount: number;
  quotationCodeString: string;
  selectedClaim: any;
  insurersList: any = [];
  insurerNames: any;
  selectedInsurer: { label: string; value: any } | null = null;

  constructor(

    public sharedService: SharedQuotationsService,
    public quotationService: QuotationsService,
    private router: Router,
    private globalMessagingService: GlobalMessagingService,
    public  agentService: IntermediaryService,
    public productService: ProductService,
    public subclassService: SubclassesService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private messageService: GlobalMessagingService,
    public branchService: BranchService,
    private spinner: NgxSpinnerService,
    public bankService:BankService,
    private fb: FormBuilder,
    private config: PrimeNGConfig,

  ) {}
  public isCollapsibleOpen = false;
  public isRiskCollapsibleOpen = false;
  public makeQuotationReady = true;
  public confirmQuotation = false;
  public authoriseQuotation = false;
  public showEmail = false;
  public showSms = false;
  public showInternalClaims = false;
  public showExternalClaims = true;
  private ngUnsubscribe = new Subject();


  ngOnInit(): void {
    this.quotationCodeString = sessionStorage.getItem('quotationCode');
    this.quotationNumber = sessionStorage.getItem('quotationNum');
    log.debug("Quotation number", this.quotationNumber);

    this.moreDetails = sessionStorage.getItem('quotationFormDetails');

    if(this.quotationCodeString) {
      this.quotationCode = this.quotationCodeString;
    }

    const storedData = sessionStorage.getItem('clientFormData');
    if (storedData) {
      this.clientDetails = JSON.parse(storedData);
    } else {
      this.clientDetails = JSON.parse(sessionStorage.getItem('clientDetails'));
    }

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
    this.externalClaimsExperience(this.clientCode);
    this.internalClaimsExperience(this.clientCode);
    // this.getPremiumComputationDetails();
    // this.getAgent();

    log.debug("MORE DETAILS TEST",this.quotationDetails )

    this.limitAmount = Number(sessionStorage.getItem('limitAmount'));
    log.debug('SUM INSURED NGONIT', this.limitAmount);

    if(this.limitAmount) {
      this.sumInsured = this.limitAmount;
    }

    this.createEmailForm();
    this.loadAllSubclass();
    this.createSmsForm();
    this.getDocumentTypes();

    this.menuItems = [
      {
        label: 'Claims Experience',
        items: [
          {
            label: 'External',
            command: () => { this.external(); }
          },
          {
            label: 'Internal',
            command: () => { this.internal(); }
          }
        ]
      }
    ];
  }

  external() {
    this.showExternalClaims = true;
    this.showInternalClaims = false;

  }

  internal() {

    this.showInternalClaims = true;
    this.showExternalClaims = false;
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
      log.debug("DETAILS TEST quotation data", this.quotationView);
      log.debug(code, "code");

      // Set quotationDetails from response if not already set from moreDetails
      if (!this.moreDetails) {
        this.quotationDetails = this.quotationView;
        log.debug("MORE DETAILS TEST quotationView",this.quotationDetails )
      }

      if(!this.limitAmount) {
        this.sumInsured = this.quotationView.sumInsured;
      }

      if(!this.quotationCodeString) {
        this.quotationCode = this.quotationView.riskInformation[0].quotationCode;
        log.debug("quotaion code", this.quotationCode)
      }

      // Extract product details
      this.quotationProducts = this.quotationView.quotationProduct;
      this.riskDetails = this.quotationView.riskInformation;
      log.debug("Risk Details quotation-summary", this.riskDetails);

      // Handle multiple product codes
      const proCodes = this.quotationView.quotationProducts.map((product: { proCode: any; }) => product.proCode);
      log.debug("Product codes", proCodes);

      // Call functions for each product code
      proCodes.forEach((proCode) => {
        this.getProductDetails(proCode);
        this.getProductClause(proCode);
        this.getProductSubclass(proCode);
      });

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

        if (sectionDetails) {
          sessionStorage.setItem('premiumRate', sectionDetails.rate?.toString() || '');
          sessionStorage.setItem('sectionDescription', sectionDetails.sectionShortDescription || '');
          sessionStorage.setItem('sectionType', sectionDetails.rateType || '');
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
          log.debug(res,"AGENTS")
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  getSections(data: any) {

    this.riskDetails.forEach((el: { code: any; sectionsDetails: any; scheduleDetails: { level1: any; }; })=>{

      if(data===el.code) {
        this.sections = el.sectionsDetails
        this.schedules = [el.scheduleDetails.level1]
      }

    })
    log.debug(this.schedules,"schedules Details")
    log.debug(this.sections,"section Details")

  }

  /**
   * Navigates to the edit details page.
   * @method editDetails
   * @return {void}
   */
  editDetails() {
    this.router.navigate(['/home/gis/quotation/quotation-details'])
  }

   /**
   * Retrieves product details based on the product code in the 'moreDetails' property.
   * @method getProductDetails
   * @return {void}
   */
  getProductDetails(code: number) {
    this.productService.getProductByCode(code).subscribe(res=>{
      this.productDetails.push(res)
      log.debug("Product details", this.productDetails)
    })
  }

  getbranch() {
    log.debug(JSON.parse(this.moreDetails),"more  details")

    if(this.moreDetails) {
      this.branchCode = JSON.parse(this.moreDetails).branchCode;
    } else {
      this.branchCode = this.quotationView.branchCode;
    }
    log.debug("Branch Code: ", this.branchCode);

    this.branchService.getBranchById(this.branchCode).subscribe(data=>{
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
    this.agentService.getAgents().subscribe(data=>{
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
    this.quotationService.getProductClauses(productCode).subscribe(res=>{
      this.clauses= res
      log.debug(this.clauses)
    })
  }

  /**
   * Retrieves the current user and stores it in the 'user' property.
   * @method getUser
   * @return {void}
  */
  getuser():void {
    this.user = this.authService.getCurrentUserName()
    this.quotationService.getUserProfile().subscribe(res=>{
      this.userDetails = res

    })
  }

  makeReady() {
    this.quotationService.makeReady(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.makeQuotationReady = !this.makeQuotationReady;
          this.authoriseQuotation = !this.authoriseQuotation;
          this.getQuotationDetails(this.quotationNumber);
          this.messageService.displaySuccessMessage('Success','Quotation Made Ready, Authorise to proceed')
        },
        error: (e) => {
          log.debug(e)
          this.messageService.displayErrorMessage('error', 'Failed to make ready')
        }
      }
    )
  }

  authorise() {
    this.quotationService.authoriseQuotation(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.getQuotationDetails(this.quotationNumber);
          this.messageService.displaySuccessMessage('Success','Quotation Authorised, Confirm to proceed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  confirm() {
    this.quotationService.confirmQuotation(this.quotationCode,this.user).subscribe(
      {
        next: (res) => {
          this.authoriseQuotation = !this.authoriseQuotation;
          this.confirmQuotation = !this.confirmQuotation;
          this.getQuotationDetails(this.quotationNumber);
          this.messageService.displaySuccessMessage('Success','Quotation Authorization Confirmed')
        },
        error: (e) => {
          log.debug(e.message)
          this.messageService.displayErrorMessage('error', e.error.message)
        }
      }
    )
  }

  showCommunicationDetails(section) {
    if(section === 'sms' ){
      this.showSms  = true
      this.showEmail = false

    } else if(section === 'email') {
      this.showEmail = true
      this.showSms  = false
    }
  }

  externalClaimsExperience(clientCode) {
    this.quotationService.getExternalClaimsExperience(clientCode).subscribe(res=>{
      this.externalClaims = res;
      this.externalTable = this.externalClaims.embedded;
      log.debug("external claims table", this.externalTable);
    })
  }

  internalClaimsExperience(clientCode) {
    this.quotationService.getInternalClaimsExperience(clientCode).subscribe(res=>{
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
      next :(res) => {
        this.computationDetails = res
        this.computationDetails.underwritingYear = new Date().getFullYear();
        // Modify the prorata field for all risks
        this.computationDetails.risks.forEach((risk: any) => {
          risk.prorata = 'F';
          risk.limits.forEach((limit: any) => {
            // Retrieve and log session storage values
            const premiumRate = Number(sessionStorage.getItem('premiumRate'));
            const sectionDescription = sessionStorage.getItem('sectionDescription');
            const sectionType = sessionStorage.getItem('sectionType');
            const multiplierDivisionFactor = 1
            const rateType = "FXD"
            //  const divisionFactor = sessionStorage.getItem('divisionFactor');
            const limitAmount = this.sumInsured


            log.debug('Retrieved values from session storage:', {
              premiumRate,
              sectionType,
              multiplierDivisionFactor,
              rateType,
              sectionDescription,
              //  divisionFactor,
              limitAmount
            });
            // Update the fields you want to modify
            limit.premiumRate = Number(sessionStorage.getItem('premiumRate'));
            limit.description = sessionStorage.getItem('sectionDescription');
            limit.sectionType = sessionStorage.getItem('sectionType');
            limit.multiplierDivisionFactor = 1
            limit.rateType = "FXD"
            // limit.rateDivisionFactor = sessionStorage.getItem('divisionFactor');
            limit.limitAmount = this.sumInsured
          });
        });
        log.debug("Latest COMPUTATION Details",this.computationDetails.risks)
      },
      error: (error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, you cannot compute premium, check quotation details and try again.' );
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
      next:(res) => {
        this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed' );
          this.premium = res;
          log.debug("premium", res);
      },
      error : (error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
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
      next:(res) => {
        const response = res
        this.globalMessagingService.displaySuccessMessage('Success', 'Email sent successfully' );
        log.debug(res)
      },
      error : (error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
      }
    })
    log.debug('Submitted payload:',JSON.stringify(payload) );
  }

  sendSms() {
    const payload = {
      recipients: [
        this.smsForm.value.recipients
      ],
      message:this.smsForm.value.message,
      sender:this.smsForm.value.sender,
    };
    this.quotationService.sendSms(payload).subscribe(
      {
        next:(res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully' );
        },
        error : (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later' );
        }
      }
    )
  }

  getLimits(productCode) {
    this.quotationService.assignProductLimits(productCode).subscribe({
      next:(res) => {
        this.quotationService.getLimits(productCode,'L').subscribe({
          next:(res) => {
            this.limits = res
            this.limitsList = this.limits._embedded
            this.globalMessagingService.displaySuccessMessage('Success', this.limits.message );
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
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch excesses');
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

    // Call all methods sequentially
    this.getSections(data.code);
    this.getExcesses(data.code);
    this.getRiskClauses(data.code);
  }

  loadAllSubclass() {
    return this.subclassService.getAllSubclasses().subscribe(data=>{
      this.allSubclassList=data;
      log.debug(this.allSubclassList," from the service All Subclass List");
    })
  }

  getProductSubclass(code: string): void {
    this.productService.getProductSubclasses(code).subscribe({
      next: (res) => {
        this.subclassList = res._embedded.product_subclass_dto_list;
        log.debug(this.subclassList, 'Product Subclass List');

        // Ensure allSubclassList is initialized
        if (!this.allSubclassList || !Array.isArray(this.allSubclassList)) {
          log.error('allSubclassList is not initialized or not an array');
          this.allSubclassList = []; // Initialize as an empty array if undefined
        }

        this.productSubclass = []; // Initialize or reset productSubclass

        this.subclassList.forEach(element => {
          const matchingSubclasses = this.allSubclassList.filter(
            subCode => subCode.code === element.sub_class_code
          );
          this.productSubclass = this.productSubclass.concat(matchingSubclasses); // Merge into productSubclass
        });

        log.debug("Retrieved Subclasses by code", this.productSubclass);
      },
      error: (err) => {
        log.error("Error retrieving product subclasses", err);
      }
    });
  }


  getDocumentTypes() {
    this.quotationService.documentTypes('C').pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next:(res) => {
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
          log.debug("File:",this.clientDetails)
          let payload ={
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
            clientFullname:this.clientDetails.firstName + this.clientDetails.lastName ,
            clientName:this.clientDetails.firstName,
            dateReceived: "",
            department: "",
            deptName: "",
            docData: "",
            docDescription: "",
            docId: "",
            docReceivedDate: "",
            docRefNo: "",
            docRemark: "",
            docType:this.selectedDocumentType,
            document: base64String,
            documentName: file.name,
            documentType:this.selectedDocumentType,
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
            next:(res) => {
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
    log.debug("Selected Claim experience to delete", this.selectedClaim)
    if (!this.selectedClaim) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a Claim experience to continue');
    } else {
      document.getElementById("openClaimModalButtonDelete").click();
    }
  }

  onExternalClaimSelect(externalClaim: any): void {
    this.selectedClaim = externalClaim;
    log.debug('Selected external Claim item:', externalClaim);
  }

  onInternalClaimSelect(internalClaim: any): void {
    this.selectedClaim = internalClaim;
    log.debug('Selected internal Claim item:', internalClaim);
  }

  fetchInsurers() {
    this.quotationService.getInsurers().subscribe({
      next: (res) => {
        this.insurersList = res.content; // Ensure you're accessing the `content` array
        this.insurerNames = this.insurersList.map((insurer: { name: any; id: any; }) => ({
          label: insurer.name,
          value: insurer.id
        }));// Map insurers to an array of objects with `label` and `value` properties
        log.debug("INSURERS", this.insurersList);
      }
    })
  }

  onInsurerSelect(event: any) {
    this.selectedInsurer = event.value;
  }

  // end document upload functionality
  onResize(event: any) {
    this.modalHeight = event.height;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }
}
