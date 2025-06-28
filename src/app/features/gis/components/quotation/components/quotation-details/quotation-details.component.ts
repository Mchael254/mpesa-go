import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { introducersDTO } from '../../data/introducersDTO';
import { ProductSubclassService } from '../../../setups/services/product-subclass/product-subclass.service';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';

import { NgxSpinnerService } from 'ngx-spinner';
import { OrganizationBranchDto } from "../../../../../../shared/data/common/organization-branch-dto";
import { CurrencyDTO } from "../../../../../../shared/data/common/currency-dto";
import { BankService } from "../../../../../../shared/services/setups/bank/bank.service";
import { BranchService } from "../../../../../../shared/services/setups/branch/branch.service";
import { ClauseService } from "../../../../services/clause/clause.service";
import { ProductService } from "../../../../services/product/product.service";
import { AuthService } from "../../../../../../shared/services/auth.service";
import { IntermediaryService } from "../../../../../entities/services/intermediary/intermediary.service";
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { forkJoin, mergeMap } from 'rxjs';
import { QuotationList, QuotationSource, UserDetail } from '../../data/quotationsDTO';
import { Products } from '../../../setups/data/gisDTO';

const log = new Logger('QuotationDetails');

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit, OnDestroy {

  dummyClauses = [
    {
      id: 1,
      heading: 'Introduction',
      wording: 'This agreement constitutes a legal contract between the parties.'
    },
    {
      id: 2,
      heading: 'Definitions',
      wording: 'For purposes of this agreement, the following terms shall have the meanings set forth below.'
    },
    {
      id: 3,
      heading: 'Payment Terms',
      wording: 'All invoices are payable within 30 days of receipt unless otherwise agreed in writing.'
    },
    {
      id: 4,
      heading: 'Confidentiality',
      wording: 'Both parties agree to maintain the confidentiality of all proprietary information.'
    },
    {
      id: 5,
      heading: 'Termination',
      wording: 'Either party may terminate this agreement with 30 days written notice.'
    },
    {
      id: 6,
      heading: 'Governing Law',
      wording: 'This agreement shall be governed by the laws of the State of California.'
    },
    {
      id: 7,
      heading: 'Amendments',
      wording: 'No amendment to this agreement shall be effective unless in writing and signed by both parties.'
    }
  ];
  idSearch: any
  headingSearch: any
  wordingSearch: any
  editInputs: boolean = false;
  editClauseId: any = null;
  toggleEdit(id: any) {
    this.editClauseId = this.editClauseId === id ? null : id;
  }


  sort(arg0: string) {
    throw new Error('Method not implemented.');
  }

  @ViewChild(Table) private dataTable: Table;
  steps = quoteStepsData;
  branch: OrganizationBranchDto[];
  currency: CurrencyDTO[]
  clauses: any;
  products: Products[] = [];
  ProductDescriptionArray: any = [];

  user: any;
  formData: any;
  quotationForm: FormGroup;
  agents: any
  agentDetails: any
  quotationsList: any;
  clientExistingQuotations: any
  quotationNo: any;
  quotationCode: any;
  isChecked: boolean = false;
  show: boolean = false;
  showProducts: boolean = false;
  showClauses:boolean = false;
  quotationNum: string;
  introducers: introducersDTO[] = [];
  userDetails: any;
  selected: any;
  quotationSources: QuotationSource[] = [];
  midnightexpiry: any
  modalHeight: number = 200;
  quickQuotationDetails: any
  quickQuotationCode: any;
  quotationNumber: any
  selectedClause!: any;
  selectedAgent!: any
  productCode: any;
  @ViewChild('openModal') openModal;
  @ViewChild('dt1') dt1: Table | undefined;
  quotationType: any[] = [];
  fromCampaign: any[] = []
  showIntermediaryField: boolean = false;
  resultFromCampaign: any;
  showCampaignField: boolean = false;
  campaignList: any;
  clientId: number;
  today = new Date();
  userCode: number;
  dateFormat: any;
  minDate: Date | undefined;

  todaysDate: string;
  expiryDate: string;
  coverToDate: string;
  defaultCurrencyName: string;
  defaultCurrencySymbol: string;
  organizationId: number;
  exchangeRate: number;
  userOrgDetails: UserDetail;
  defaultCurrency: CurrencyDTO;
  quotationFormDetails: any = null
  motorClassAllowed: string;
  currencyDelimiter: any;
  quotationDetails: any;
  quoteToEditData: QuotationList;
  agentName: string;
  branchId: number;
  productDetails: any[] = [];
  paymentFrequencies: any[] = [];
  clonedProducts: { [key: string]: any } = {};
  selectedEditRow: any = null;
  selectedEditRowIndex: number | null = null;
  selectedProduct: any;
  selectedRow: any;
  quotationProductForm: FormGroup
  existingQuotationDetails: any = undefined
  selectedClient: any = undefined

  constructor(
    public bankService: BankService,
    public branchService: BranchService,
    public clauseService: ClauseService,
    public productService: ProductService,
    public producSetupService: ProductsService,
    public authService: AuthService,
    public sharedService: SharedQuotationsService,
    public fb: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService,
    public agentService: IntermediaryService,
    public quotationService: QuotationsService,
    public productSubclass: ProductSubclassService,
    private globalMessagingService: GlobalMessagingService,
  ) {

    this.quotationFormDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails'));
    log.debug("QUOTATION FORM DETAILS", this.quotationFormDetails)
    const clientFormDetails = sessionStorage.getItem('clientPayload');
    log.debug("Client form details:", clientFormDetails)
    const clientCode = sessionStorage.getItem('clientCode');
    this.clientId = JSON.parse(clientCode)
    log.debug("Client Code- session storage", this.clientId)
    this.existingQuotationDetails = JSON.parse(sessionStorage.getItem('passedQuotationDetails'))
    this.productDetails = JSON.parse(sessionStorage.getItem('productFormDetails'));
    this.productDetails?.forEach(product => {
      product.coverFrom = new Date(product.coverFrom);
      product.coverTo = new Date(product.coverTo);
    });
    if (!this.productDetails && this.existingQuotationDetails) {
      this.productDetails = this.existingQuotationDetails?.quotationProducts
      this.productDetails.map((value) => {
        return {
          ...value,
          coverFrom: new Date(value.wef),
          coverTo: new Date(value.wet)
        }
      })
      log.debug("Existing product details >>>", this.productDetails)
    }
    this.paymentFrequencies = [
      { label: 'Annually', value: 'A' },
      { label: 'Semi annually', value: 'S' },
      { label: 'Quarterly', value: 'Q' },
      { label: 'Monthly', value: 'M' },
      { label: 'One-off', value: 'O' }
    ];
    this.quotationType = [
      { label: 'Direct', value: 'D' },
      { label: 'Intermediary', value: 'I' }
    ]
    this.fromCampaign = [
      { label: 'Others', value: 'O' },
      { label: 'Campaign', value: 'C' }
    ]
    this.selectedClient = JSON.parse(sessionStorage.getItem('client'))
    log.debug("product Form details", this.productDetails)



  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.fetchQuotationRelatedData()
    this.getuser();
    this.createQuotationForm();
    this.createQuotationProductForm();
    this.quoteToEditData = JSON.parse(sessionStorage.getItem("quoteToEditData"));
    log.debug("quote data to edit: ", this.quoteToEditData);

    if (this.quoteToEditData) {
      log.debug("load quotation details: ", this.quoteToEditData);
      this.loadClientQuotation();
    }
  }

  ngOnDestroy(): void {
  }

  loadClientQuotation() {
    log.debug("passed quotation Number:", this.quoteToEditData.quotationNumber);
    let defaultCode
    if (this.quoteToEditData.quotationNumber) {
      defaultCode = this.quoteToEditData.quotationNumber;
      log.debug("QUOTE Number", defaultCode)

      sessionStorage.setItem("quotationNum", defaultCode);
    }

    let quotationCode = JSON.stringify(this.quoteToEditData.quotationCode);
    if (quotationCode) {
      log.debug("Quotation Code", quotationCode);
      (sessionStorage.setItem("quotationCode", quotationCode));
    }

    this.quotationService.getQuotationDetails(defaultCode).subscribe(data => {
      this.quotationDetails = data;
      log.debug("Quotation Details-quotation details screen:", this.quotationDetails);

      this.quotationForm.patchValue({
        quotationCode: this.quotationDetails.code,
        quotationNo: this.quotationDetails.quotationNo,
        user: this.quotationDetails.preparedBy,
        wefDate: new Date(this.quotationDetails.coverFrom),
        wetDate: new Date(this.quotationDetails.coverTo),
        expiryDate: new Date(this.quotationDetails.expiryDate),
        branch: this.quotationDetails.branchCode,
        currencyCode: this.quotationDetails.currencyCode,
        agentCode: this.quotationDetails.agentCode,
        clientType: this.quotationDetails.clientType,
        source: this.quotationDetails.source?.code,
        clientCode: this.quotationDetails.clientCode,
        comments: this.quotationDetails.comments ? this.quotationDetails.comments : null,
        internalComments: this.quotationDetails.internalComments ? this.quotationDetails.internalComments : null,
        RFQDate: this.quotationDetails.preparedDate ? new Date(this.quotationDetails.preparedDate) : null,
        multiUser: this.quotationDetails.multiUser,
        currencyRate: this.quotationDetails.currencyRate,
        introducerCode: this.quotationDetails.introducerCode,
        polPropHoldingCoPrpCode: this.quotationDetails.quotPropHoldingCoPrpCode,
        chequeRequisition: this.quotationDetails.chequeRequisition,
        divisionCode: this.quotationDetails.divisionCode,
        subAgentCode: this.quotationDetails.subAgentCode,
        prospectCode: this.quotationDetails.prospectCode,
        marketerAgentCode: this.quotationDetails.marketerAgentCode,
        frequencyOfPayment: this.quotationDetails.frequencyOfPayment,
        web: this.quotationDetails.web,
        travelQuote: this.quotationDetails.travelQuote,
        organizationCode: this.quotationDetails.organizationCode,
        subQuote: this.quotationDetails.subQuote,
        premiumFixed: this.quotationDetails.premiumFixed,
        action: 'E',
      });

      log.debug("patched quotation form", this.quotationForm);

      // Set product code
      const productCode = this.quotationDetails.quotationProducts[0].productCode;
      this.productService.getProductDetailsByCode(productCode).subscribe(res => {
        log.debug("response product", res);
        const selectedProduct = this.ProductDescriptionArray.find((product: {
          code: number;
        }) => product.code === res?.code);
        if (selectedProduct) {
          this.quotationForm.controls['productCode'].setValue(selectedProduct);
          this.getProductClause();
          this.checkMotorClass();
        }
      });

      // Set currency code
      this.currency.forEach(el => {
        if (el.symbol === this.quotationDetails.currency) {
          this.quotationForm.controls['currencyCode'].setValue(el);
        }
      });

      // set branch
      this.branch.forEach(el => {
        if (el.id === this.quotationDetails.branchCode) {
          this.quotationForm.controls['branch'].setValue(el);
        }
      });

    })
  }

  quickQuoteDetails() {
    this.quickQuotationCode = sessionStorage.getItem('quickQuotationCode');
    if (this.quickQuotationCode) {
      sessionStorage.setItem('quotationNumber', this.quotationNumber);
      sessionStorage.setItem('quotationCode', this.quickQuotationCode);
      this.quotationService.getQuotationDetails(this.quotationNumber).subscribe(res => {
        this.quickQuotationDetails = res;
        log.debug("QUICK QUOTE DETAILS", this.quickQuotationDetails);

        // Set form values from the response
        this.quotationForm.patchValue({
          quotationCode: this.quickQuotationDetails.code,
          quotationNo: this.quickQuotationDetails.quotationNo,
          user: this.quickQuotationDetails.preparedBy,
          wefDate: new Date(this.quickQuotationDetails.coverFrom),
          wetDate: new Date(this.quickQuotationDetails.coverTo),
          expiryDate: new Date(this.quickQuotationDetails.expiryDate),
          branch: this.quickQuotationDetails.branchCode,
          currencyCode: this.quickQuotationDetails.currencyCode,
          agentCode: this.quickQuotationDetails.agentCode,
          agentShortDescription: this.quickQuotationDetails.agentShortDescription,
          clientType: this.quickQuotationDetails.clientType,
          source: this.quickQuotationDetails.sourceCode,
          clientCode: this.quickQuotationDetails.clientCode,
          comments: this.quickQuotationDetails.comments,
          internalComments: this.quickQuotationDetails.internalComments,
          RFQDate: this.quickQuotationDetails.preparedDate ? new Date(this.quickQuotationDetails.preparedDate) : null,
          multiUser: this.quickQuotationDetails.multiUser,
          unitCode: this.quickQuotationDetails.unitCode,
          locationCode: this.quickQuotationDetails.locationCode,
          // Add other fields as needed
        });

        // Set product code
        const productCode = this.quickQuotationDetails.quotationProducts[0].productCode;
        this.productService.getProductDetailsByCode(productCode).subscribe(res => {
          const selectedProduct = this.ProductDescriptionArray.find((product: {
            code: number;
          }) => product.code === res?.code);
          if (selectedProduct) {
            this.quotationForm.controls['productCode'].setValue(selectedProduct);
            this.getProductClause();
            this.checkMotorClass();
          }
        });

        // Set currency code
        this.currency.forEach(el => {
          if (el.symbol === this.quickQuotationDetails.currency) {
            this.quotationForm.controls['currencyCode'].setValue(el);
          }
        });

        // set branch
        this.branch.forEach(el => {
          if (el.id === this.quickQuotationDetails.branchCode) {
            this.quotationForm.controls['branch'].setValue(el);
          }
        });

        // Set source if needed
        if (this.quickQuotationDetails.source) {
          this.quotationForm.controls['source'].setValue(this.quickQuotationDetails.source.code);
        }
        log.debug("Form Values After Patch", this.quotationForm.value);
      });
    }
  }


  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  /**
   * Retrieves the current user and stores it in the 'user' property.
   * @method getUser
   * @return {void}
   */
  getuser() {
    this.user = this.authService.getCurrentUserName();
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);

    this.userCode = this.userDetails.code
    log.debug('User Code ', this.userCode);
    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);
    sessionStorage.setItem('dateFormat', this.dateFormat);

    const todaysDate = new Date();
    log.debug(' todays date before being formatted', todaysDate);

    // Extract the day, month, and year
    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
    const year = todaysDate.getFullYear();

    // Format the date in 'dd-Month-yyyy' format
    const formattedDate = `${day}-${month}-${year}`;

    this.todaysDate = formattedDate;
    log.debug('Todays  Date', this.todaysDate);
    this.updateQuotationExpiryDate(this.todaysDate)

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
    log.debug('Organization currency delimeter', this.currencyDelimiter);
    sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);
  }

  createQuotationForm() {
    this.quotationForm = this.fb.group({
      fromCampaign: [],
      frequencyOfPayment: [],
      source: ['', Validators.required],
      user: [''],
      currencyCode: [0, Validators.required],
      agent: [0, Validators.required],
      multiUser: [''],
      wefDate: [
        this.quotationFormDetails ? new Date(this.quotationFormDetails.wefDate) : this.todaysDate,
        Validators.required
      ],
      wetDate: [
        this.quotationFormDetails ? new Date(this.quotationFormDetails.wetDate) : this.coverToDate,
        Validators.required
      ],
      branch: [Validators.required],
      marketerAgentCode: [0],
      comments: [''],
      introducerCode: [0],
      internalComments: [''],
      RFQDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.RFQDate) : new Date(this.todaysDate)],
      expiryDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.expiryDate) : this.expiryDate],
      quotationType: [null]
    });

  }

  createQuotationProductForm() {
    this.quotationProductForm = this.fb.group({
      code: [0],
      productCode: [0, Validators.required],
      quotationCode: [0],
      productShortDescription: [''],
      quotationNo: [''],
      premium: [0],
      wef: [this.todaysDate, Validators.required],
      wet: [this.coverToDate, Validators.required],
      revisionNo: [0],
      totalSumInsured: [0],
      commission: [0],
      binder: [''],
      productName: [''],
      converted: [''],
      policyNumber: [''],
      /* taxInformation: this.fb.array([
         this.fb.group({
           rateDescription: [''],
           quotationRate: [0],
           rateType: [''],
           taxAmount: [0],
           productCode: [0]
         })
       ])*/
    })
  }


  /**
   * Saves quotation details, sets form details, and navigates based on user preferences.
   * @method saveQuotationDetails
   * @return {void}
   */
  saveQuotationDetails() {
    log.debug("Quotation form details >>>>", this.quotationForm)
    log.debug("Selected agent >>>>", this.agentDetails)
    if (this.quotationForm.valid) {
      const quotationFormValues = this.quotationForm.getRawValue();
      const quotationPayload = {
        user: this.user,
        branchCode: quotationFormValues.branch.id,
        RFQDate: this.formatDate(quotationFormValues.RFQDate),
        expiryDate: this.formatDate(quotationFormValues.expiryDate),
        currencyCode: quotationFormValues.currencyCode.id || this.defaultCurrency.id,
        source: quotationFormValues.source.code,
        currencyRate: this.exchangeRate,
        agentShortDescription: this.agentDetails.shortDesc,
        clientCode: this.selectedClient.id,
        clientType: "I",
        wefDate: this.formatDate(this.productDetails[0].coverFrom),
        wetDate: this.formatDate(this.productDetails[0].coverTo),
        frequencyOfPayment: quotationFormValues.frequencyOfPayment.value,
        quotationProducts: this.productDetails.map((value) => {
          return {
            wef: this.formatDate(value.coverFrom),
            wet: this.formatDate(value.coverTo),
            productCode: value.productCode.code,
            productName: value.productCode.description
          }
        })
      }
      log.debug("quotation payload to save", quotationPayload);
    } else {
      // Mark all fields as touched and validate the form
      this.quotationForm.markAllAsTouched();
      this.quotationForm.updateValueAndValidity();
      for (let controlsKey in this.quotationForm.controls) {
        if (this.quotationForm.get(controlsKey).invalid) {
          log.debug(
            `${controlsKey} is invalid`,
            this.quotationForm.get(controlsKey).errors
          );
        }
      }
    }
    return

    this.spinner.show()

    /*this.sharedService.setQuotationFormDetails(this.quotationForm.value);
    sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
    const quotationFormJson = this.quotationForm.value
    log.debug("Quotation form details", quotationFormJson)
    if (this.quotationForm.value.multiUser == 'Y') {
      /!**
       * Creates a new quotation with multi-user and navigates to quote assigning.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       *!/
      if (this.quickQuotationDetails) {
        log.debug("Quick Quotation results")
        this.router.navigate(['/home/gis/quotation/quote-assigning'])
        this.spinner.hide()

      } else {

        log.debug("CREATE QUOTATION -Multi user entry is Yes")
        this.quotationService.processQuotation(quotationPayload).subscribe(data => {
          this.quotationNo = data;
          this.spinner.hide()
          log.debug(this.quotationNo, "Quotation results:")
          this.router.navigate(['/home/gis/quotation/quote-assigning'])
        }, (error: HttpErrorResponse) => {
          log.info(error);
          this.spinner.hide()
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);

        })
      }


    } else {
      if (this.isChecked) {
        /!**
         * Creates a new quotation with import risks and navigates to import risks page.
         * @param {Object} this.quotationForm.value - The form value representing quotation details.
         * @param {string} this.user - The user associated with the quotation.
         * @return {Observable<any>} - An observable of the response containing created quotation data.
         *!/
        if (this.quickQuotationDetails) {
          this.router.navigate(['/home/gis/quotation/import-risks']);
          this.spinner.hide();
          sessionStorage.setItem('quotationFormDetails', JSON.stringify(quotationPayload));
        } else {

          log.debug("CREATE QUOTATION");
          this.quotationService.processQuotation(quotationPayload).subscribe(
            (data) => {
              this.quotationNo = data;
              this.spinner.hide();
              log.debug(this.quotationForm.value);
              log.debug(this.quotationNo, 'quotation number output');
              this.quotationCode = this.quotationNo._embedded.quotationCode;
              this.quotationNum = this.quotationNo._embedded.quotationNumber
              sessionStorage.setItem('quotationNum', this.quotationNum);
              sessionStorage.setItem('quotationCode', this.quotationCode);
              sessionStorage.setItem('quotationFormDetails', JSON.stringify(quotationPayload));
              this.router.navigate(['/home/gis/quotation/import-risks']);
            },
            (error: HttpErrorResponse) => {
              log.info(error);
              this.spinner.hide();
              this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');
            }
          );
        }
      } else {
        /!**
         * Creates a new quotation and navigates to risk section details based on user preferences.
         * @param {Object} this.quotationForm.value - The form value representing quotation details.
         * @param {string} this.user - The user associated with the quotation.
         * @return {Observable<any>} - An observable of the response containing created quotation data.
         *!/

        if (this.quickQuotationDetails) {
          this.router.navigate(['/home/gis/quotation/risk-center']);
          this.spinner.hide()

        } else if (this.quoteToEditData) {
          this.router.navigate(['/home/gis/quotation/risk-center']);
          this.spinner.hide()
        } else {
          sessionStorage.setItem('quotationFormDetails', JSON.stringify(quotationPayload));

          log.debug("Quotation form details", quotationPayload)
          log.debug("CREATE QUOTATION")
          this.quotationService.processQuotation(quotationPayload).subscribe(data => {
            this.quotationNo = data;
            this.spinner.hide()
            log.debug(this.quotationNo, 'quotation number output');
            this.quotationCode = this.quotationNo._embedded.quotationCode;
            this.quotationNum = this.quotationNo._embedded.quotationNumber
            sessionStorage.setItem('quotationNum', this.quotationNum);
            sessionStorage.setItem('quotationCode', this.quotationCode);
            sessionStorage.setItem('quotationFormDetails', JSON.stringify(quotationPayload));
            this.selectedProductClauses(this.quotationCode)
            this.sharedService.setQuotationDetails(this.quotationNum, this.quotationCode);

            this.router.navigate(['/home/gis/quotation/risk-center']);
          }, (error: HttpErrorResponse) => {
            log.info(error);
            this.spinner.hide()
            this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

          })
        }


      }
    }*/
  }

  /**
   * Applies a global filter to the DataTable.
   * @method applyFilterGlobal
   * @param {Event} $event - The event triggering the filter application.
   * @param {string} stringVal - The string value representing the filter criteria.
   * @return {void}
   */
  applyFilterGlobal($event, stringVal) {
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  /**
   * Retrieves agents and populates the 'agents' property.
   * @method getAgents
   * @return {void}
   */
  getAgents() {
    this.quotationService.getAgents().pipe(
      untilDestroyed(this)
    )
      .subscribe(data => {
        this.agents = data.content
        log.debug("AGENTS", data)
      })
  }

  /**
   * Retrieves agent short description by ID and updates the corresponding form control.
   * @method agentShortDesc
   * @param {string} id - The ID of the agent for which to retrieve the short description.
   * @return {void}
   */
  agentShortDesc() {
    this.agentService.getAgentById(this.quotationForm.value.agentCode.id).subscribe(data => {
      this.agentDetails = data
      this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);

    })

  }

  getAgentById(data) {
    log.debug("agent selected", data);
    this.agentDetails = data
    this.agentName = this.agentDetails.name;
    /*    this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);
        this.quotationForm.controls['agentCode'].setValue(this.agentDetails.name);*/
    /* this.agentService.getAgentById(data).subscribe({
       next: (res) => {
 
 
       }
     })*/
  }

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  onResize(event: any) {
    this.modalHeight = event.height;
  }

  /**
   * Retrieves existing quotations based on form values and performs further actions.
   * @method getExistingQuotations
   * @return {void}
   */
  getExistingQuotations() {
    const clientId = this.quotationForm.value.clientCode
    const fromDate = this.quotationForm.value.wefDate
    const toDate = this.quotationForm.value.wetDate
    const rawCoverTo = new Date(toDate)
    log.debug('raw cover to DATE:', toDate);


    const coverFromDate = fromDate;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

    const covertToDate = rawCoverTo;
    const formattedCoverToDate = this.formatDate(covertToDate);
    log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

    const productCode = this.quotationProductForm.value.productCode.code;

    //TODO: check this out
    // Set currency code in the form
    /* if (this.quotationType === "D") {
       this.quotationForm.controls['agentCode'].setValue(0);
       this.quotationForm.controls['agentShortDescription'].setValue("DIRECT")

     } else if (this.quotationType === "I") {
       this.quotationForm.controls['agentCode'].setValue(this.agentDetails.id);
     }*/
    this.saveQuotationDetails()
    return
    this.quotationForm.controls['branch'].setValue(this.quotationForm.value.branchCode.id);
    sessionStorage.setItem('coverFrom', JSON.stringify(formattedCoverFromDate));
    sessionStorage.setItem('coverTo', JSON.stringify(formattedCoverToDate));
    //TODO check this??? client code
    this.quotationService.getQuotations(221243911, formattedCoverFromDate, formattedCoverToDate).subscribe(data => {
      this.quotationsList = data
      this.clientExistingQuotations = this.quotationsList.content

      if (this.clientExistingQuotations.length > 0) {
        this.openModal.nativeElement.click();
      } else {

        this.saveQuotationDetails()
      }

    })


  }


  /**
   * Edits a row by updating a clause based on details and code.
   * @method editRow
   * @param {any} details - The details for updating the clause.
   * @param {string} code - The code associated with the clause.
   * @return {void}
   */
  editRow(details, code) {
    this.clauseService.updateClause(details, code).subscribe(res => {
      this.globalMessagingService.displaySuccessMessage('Success', 'Successfully updated');
    }, (error: HttpErrorResponse) => {
      log.info(error);
      this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

    }
    )
  }

  formatDate(date: string | Date | null): string {
    if (!date) return '';

    // Ensure the date is a Date object
    const parsedDate = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) {
      console.error('Invalid date:', date);
      return '';
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(parsedDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Updates the cover to date in the quotation form based on the selected cover from date.
   * @method updateCoverToDate
   * @param {Event} e - The event containing the target value representing the cover from date.
   * @return {void}
   */
  updateCoverToDate(date) {
    log.debug("Cover from date:", date)
    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    sessionStorage.setItem("selectedCoverFromDate", formattedCoverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
    const productCode = this.quotationProductForm.value.productCode.code || this.selectedProduct?.code
    log.debug('Product code:', productCode);
    this.producSetupService.getCoverToDate(formattedCoverFromDate, productCode)
      .subscribe({
        next: (res) => {
          this.midnightexpiry = res;
          log.debug("midnightexpirydate", this.midnightexpiry);
          log.debug(this.midnightexpiry)
          const coverFrom = this.midnightexpiry._embedded[0].coverToDate
          const coverFromDate = new Date(coverFrom)
          // Extract the day, month, and year
          const day = coverFromDate.getDate();
          const month = coverFromDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
          const year = coverFromDate.getFullYear();

          // Format the date in 'dd-Month-yyyy' format
          const formattedDate = `${day}-${month}-${year}`;

          this.coverToDate = formattedDate;
          log.debug('Cover to  Date', this.coverToDate);
          sessionStorage.setItem("selectedCoverToDate", this.formatDate(this.coverToDate))
          // this.quotationProductForm.controls['wet'].setValue(this.coverToDate)
          // 🛠 Delay the patch to avoid UI distortion
          setTimeout(() => {
            this.quotationProductForm.get('wet')?.patchValue(coverFromDate);
          }, 0);

          // Update the specific product's coverTo field
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error?.message
          );
        },

      })

  }

  /*  updateCoverToDateEdit(date, product) {
      log.debug("Cover from date:", date)
      const coverFromDate = date;
      const formattedCoverFromDate = this.formatDate(coverFromDate);
      sessionStorage.setItem("selectedCoverFromDate", formattedCoverFromDate);
      log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
      const productCode = this.quotationForm?.value?.productCode?.code || this.selectedProduct?.code
      log.debug('Product code:', productCode);
      this.producSetupService.getCoverToDate(formattedCoverFromDate, productCode)
        .subscribe({
          next: (res) => {
            this.midnightexpiry = res;
            log.debug("midnightexpirydate", this.midnightexpiry);
            log.debug(this.midnightexpiry)
            const coverFrom = this.midnightexpiry._embedded[0].coverToDate
            const coverFromDate = new Date(coverFrom)
            // Extract the day, month, and year
            const day = coverFromDate.getDate();
            const month = coverFromDate.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
            const year = coverFromDate.getFullYear();

            // Format the date in 'dd-Month-yyyy' format
            const formattedDate = `${day}-${month}-${year}`;

            this.coverToDate = formattedDate;
            log.debug('Cover to  Date', this.coverToDate);
            sessionStorage.setItem("selectedCoverToDate", this.formatDate(this.coverToDate))
            this.quotationForm.controls['wetDate'].setValue(this.coverToDate)
            // Update the specific product's coverTo field
            product.coverTo = this.formatDate(this.coverToDate);
          },
          error: (error: HttpErrorResponse) => {
            log.debug("Error log", error.error.message);

            this.globalMessagingService.displayErrorMessage(
              'Error',
              error.error?.message
            );
          },

        })
    }*/
  updateQuotationExpiryDate(date: any) {
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setMonth(selectedDate.getMonth() + 3); // Add 3 months

      // 🛠 Delay the patch to avoid UI distortion
      setTimeout(() => {
        this.quotationForm.get('expiryDate')?.patchValue(selectedDate);
      }, 0);

      // Optional: for display/debug
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleString('default', { month: 'long' });
      const year = selectedDate.getFullYear();
      this.expiryDate = `${day}-${month}-${year}`;

      log.debug("Expiry Date (formatted):", this.expiryDate);
    }
  }

  checkMotorClass() {
    const productCode = this.quotationProductForm.value.productCode.code
    const selectedProductDetails = this.products.find(product => product.code === productCode)
    this.motorClassAllowed = selectedProductDetails.allowMotorClass
    sessionStorage.setItem('motorClassAllowed', (this.motorClassAllowed));
    log.debug("Is motor class:", this.motorClassAllowed)
  }

  /**
   * Retrieves product clauses based on the provided product code.
   * @method getProductClause
   * @param {Event} productCode - The event containing the target value representing the product code.
   * @return {void}
   */
  getProductClause() {
    this.productCode = this.quotationProductForm.value.productCode.code
    sessionStorage.setItem("selectedProductCode", this.productCode);
    this.quotationService.getProductClauses(this.productCode).subscribe(res => {
      this.clauses = res
      // ✅ Ensure all mandatory clauses are selected on load
      this.selectedClause = this.clauses.filter(clause => clause.isMandatory === 'Y');

      // ✅ Mark mandatory clauses as checked
      this.clauses.forEach(clause => {
        clause.checked = clause.isMandatory === 'Y';
      });
    })
  }

  // 🔹 Function called when a checkbox is checked/unchecked
  onClauseSelectionChange(selectedClauseList: any) {
    if (selectedClauseList.checked) {
      // ✅ Add to selectedClause if not already included
      if (!this.selectedClause.includes(selectedClauseList)) {
        this.selectedClause.push(selectedClauseList);
      }
    } else {
      // ✅ Remove from selectedClause only if NOT mandatory
      if (selectedClauseList.isMandatory !== 'Y') {
        this.selectedClause = this.selectedClause.filter(item => item.code !== selectedClauseList.code);
      }
    }

    // ✅ Call API with updated selection
    // this.selectedProductClauses(this.quotationCode);
    log.debug("Selected clause:", this.selectedClause)
  }

  // 🔹 API call to add selected clauses
  selectedProductClauses(quotationCode: string) {
    if (this.selectedClause && this.selectedClause.length > 0) {
      this.selectedClause.forEach(el => {
        this.quotationService.addProductClause(el.code, this.productCode, quotationCode).subscribe(res => {
          console.debug(res);
        });
        console.debug(el.code);
      });
    }
  }

  onQuotationTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)
    this.showIntermediaryField = value === 'I';
    if (!this.showIntermediaryField) {
      this.quotationForm.get('agentCode').reset();
    }
    this.getAgents()
  }

  onResultCampaignTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)
    this.resultFromCampaign = value;
    log.debug("Result from campaign  ", this.resultFromCampaign)
    this.showCampaignField = value === 'C';
    this.fetchCampaigns();

    if (!this.showCampaignField) {
      this.quotationForm.get('agentCode').reset();
    }
  }

  fetchCampaigns() {
    this.quotationService
      .getCampaigns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.campaignList = response
          log.debug("Campaign List:", this.campaignList)

        },
        error: (error) => {

          // this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  campaign details.Try again later');
        }
      })
  }

  toggleProducts() {
    this.showProducts = !this.showProducts;
  }

  toggleClauses(){
     this.showClauses = !this.showClauses;

  }

  toggleDetails() {
    this.show = !this.show;
  }

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(
        mergeMap((organization) => {
          this.userOrgDetails = organization
          log.debug("User Organization Details  ", this.userOrgDetails);
          this.organizationId = this.userOrgDetails.organizationId
          const currencySymbol = this.quotationForm.value.currencyCode.symbol
          const currencyCode = this.quotationForm.value.currencyCode.id
          this.branchId = this.userOrgDetails.branchId;
          log.debug("Cuurency code", currencyCode)
          log.debug("Cuurency ", currencySymbol)
          sessionStorage.setItem('currencySymbol', currencySymbol);

          return this.quotationService.getExchangeRates(currencyCode, organization.organizationId)
        }),
        untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response
          log.debug("EXCHANGE RATE", this.exchangeRate)
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  fetchQuotationRelatedData() {
    forkJoin([
      this.bankService.getCurrencies(),
      this.quotationService.getAllQuotationSources(),
      this.branchService.getBranches(2),
      this.quotationService.getIntroducers(),
      this.producSetupService.getAllProducts()
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([currencies, sources, branches, introducers, products]: any) => {
        // CURRENCIES
        this.currency = currencies.map((value) => {
          let capitalizedDescription = value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase();
          return { ...value, name: capitalizedDescription };
        });

        log.info(this.currency, 'this is a currency list');

        const defaultCurrency = this.currency.find(currency => currency.currencyDefault === 'Y');
        if (defaultCurrency) {
          log.debug('DEFAULT CURRENCY', defaultCurrency);
          this.defaultCurrency = defaultCurrency;
          this.defaultCurrencyName = defaultCurrency.name;
          this.defaultCurrencySymbol = defaultCurrency.symbol;
          sessionStorage.setItem('currencySymbol', this.defaultCurrencySymbol);

          log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
          log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);

          this.fetchUserOrgId()
        }
        if (this.quotationFormDetails?.currencyCode) {
          const selectedCurrency = this.currency.find(currency => currency.id === this.quotationFormDetails?.currencyCode);
          if (selectedCurrency) {
            this.quotationForm.patchValue({ currencyCode: selectedCurrency });
          }
        } else {
          this.quotationForm.patchValue({ currencyCode: this.defaultCurrency });

        }
        // QUOTATION SOURCES
        this.quotationSources = sources?.content || [];
        this.quotationSources = this.quotationSources.map((value) => {
          let capitalizedDescription = value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase();
          return { ...value, description: capitalizedDescription };
        });

        log.debug("SOURCES", this.quotationSources);

        // BRANCHES
        this.branch = branches.map((value) => {
          let capitalizedDescription = value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase();
          return { ...value, name: capitalizedDescription };
        });

        log.info(this.branch, 'this is a branch list');

        if (this.quotationFormDetails?.branch) {
          const selectedBranch = this.branch.find(branch => branch.id === this.quotationFormDetails?.branch);
          if (selectedBranch) {
            this.quotationForm.patchValue({ branch: selectedBranch });
          }
        }

        // INTRODUCERS
        this.introducers = introducers;

        // PRODUCTS
        this.products = products;
        this.ProductDescriptionArray = this.products.map(product => ({
          code: product.code,
          description: this.capitalizeWord(product.description),
        }));

        if (this.quotationFormDetails?.productCode) {
          const selectedProduct = this.ProductDescriptionArray.find(product => product.code === this.quotationFormDetails?.productCode);
          if (selectedProduct) {
            this.quotationForm.patchValue({ productCode: selectedProduct });
          }
        }

        log.info("Quotation form >>>", this.quotationForm);
        log.info('Modified product description', this.ProductDescriptionArray);

        this.quotationNumber = sessionStorage.getItem('quotationNumber');
        if (this.quotationNumber) {
          this.quickQuoteDetails();
        }
      });
  }

  onSourceChange(event): void {
    const selectedSource = event.value;
    if (selectedSource) {
      // Check for Walk in - set to Direct
      if (selectedSource.description === 'Walk in') {
        this.quotationForm.get('quotationType').setValue('D'); // Set to Direct
        this.onQuotationTypeChange('D');
      }
      // Check for Agent, Agent/b, or Broker/agent - set to Intermediary
      else if (
        selectedSource.description === 'Agent' ||
        selectedSource.description === 'Agent/b' ||
        selectedSource.description === 'Broker/agent'
      ) {
        this.quotationForm.get('quotationType').setValue('I'); // Set to Intermediary
        this.onQuotationTypeChange('I');
      }
    }
  }

  onRowEditInit(index: number, row: any) {
    log.debug('onRowEditInit - selectedEditRowIndex before edit:', this.selectedEditRowIndex);

    this.selectedEditRowIndex = index;
    this.selectedEditRow = row;

    log.debug('onRowEditInit - selectedEditRowIndex after edit:', this.selectedEditRowIndex);
    log.debug('Editing row:', row);
  }

  onProductChange(event: any, rowIndex: number, product: any) {
    // Get the selected product from the event
    const selectedProduct = this.ProductDescriptionArray.find(p => p.code === event.code);

    if (selectedProduct) {
      // Manually update the product with the selected product
      product.productCode = selectedProduct;
      console.log("Updated product:", product);

      // Ensure the row is marked as editable
      this.selectedEditRowIndex = rowIndex;
    }
  }


  onRowEditSave(product: any) {
    log.debug("Before saving - Product:", product);
    // const coverFromDate = this.orgFormatDate(product.coverFrom,this.dateFormat)
    // const coverToDate = this.orgFormatDate(product.coverTo,this.dateFormat)
    const coverFromDate = product.coverFrom
    const coverToDate = product.coverTo
    log.debug("Cover From Date:", coverFromDate)
    log.debug("Cover to Date:", coverToDate)
    product.coverFrom = coverFromDate; // Assign full object
    product.coverTo = coverToDate; // Assign full object

    if (this.selectedProduct) {
      product.productCode = { ...this.selectedProduct }; // Assign full object
    }

    // Ensure the edited product is correctly updated in the array
    this.productDetails = this.productDetails.map(item =>
      item.productCode.code === product.productCode.code ? { ...item, ...product } : item
    );

    log.debug("Updated Product Details:", this.productDetails);
    this.productDetails?.forEach(product => {
      product.coverFrom = new Date(product.coverFrom);
      product.coverTo = new Date(product.coverTo);
    });
    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));

    // Reset selected product to avoid unwanted overwrites
    this.selectedProduct = null;
    // ✅ Reset the edit state
    this.selectedEditRowIndex = null;
    this.selectedEditRow = null;
  }


  onRowEditCancel(product: any) {
    // this.products[index] = this.clonedProducts[product.id as string];
    // delete this.clonedProducts[product.id as string];
    // Reset selected product to avoid unwanted overwrites
    this.selectedProduct = null;
    // ✅ Reset the edit state
    this.selectedEditRowIndex = null;
    this.selectedEditRow = null;
  }

  submitForm() {
    const coverFromDate = new Date(sessionStorage.getItem('selectedCoverFromDate'));
    const formattedCoverFromDate = this.orgFormatDate(coverFromDate, this.dateFormat);
    log.debug("cover to date formatted:", formattedCoverFromDate)

    const coverToDate = new Date(this.quotationProductForm.get('wet')?.value);
    const formattedCoverTo = this.orgFormatDate(coverToDate, this.dateFormat);
    log.debug("cover to date formatted:", formattedCoverTo)

    const selectedProductCode = this.quotationProductForm.value.productCode

    const newProductDetail = {
      productCode: selectedProductCode,
      coverFrom: coverFromDate,
      coverTo: coverToDate
    };
    log.debug("Captured Product Details:", newProductDetail);

    // this.productDetails.push(newProductDetail);
    if (!this.productDetails) {
      this.productDetails = [];
    }
    this.productDetails.push(newProductDetail);
    this.productDetails?.forEach(product => {
      product.coverFrom = new Date(product.coverFrom);
      product.coverTo = new Date(product.coverTo);
    });

    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));

    log.debug("Captured Product Details:", this.productDetails);
  }

  orgFormatDate(date: Date, format: string): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const yearFull = String(date.getFullYear());
    const yearShort = yearFull.slice(-2);

    return format
      .replace('dd', day)
      .replace('mm', month)
      .replace('yyyy', yearFull)
      .replace('yy', yearShort);
  }

  onRowSelect(product: any) {
    this.selectedRow = product;
    log.debug("selected product :", product)
  }

  openProductDeleteModal(product: any) {
    log.debug("Selected product to delete", this.selectedRow)
    if (!this.selectedRow) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a product  to continue');
    } else {
      document.getElementById("openProductButtonDelete").click();
    }
  }

  deleteProduct() {
    log.debug("selected Product:", this.selectedRow)
    // Find the index of the product
    const productIndex = this.productDetails.findIndex(
      (product: any) => product.productCode.code === this.selectedRow?.productCode.code
    );

    // If the product is found, remove it from the array
    if (productIndex !== -1) {
      this.productDetails.splice(productIndex, 1);
      this.productDetails?.forEach(product => {
        product.coverFrom = new Date(product.coverFrom);
        product.coverTo = new Date(product.coverTo);
      });
      log.debug('Product details array after deleting:', this.productDetails)
      sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));

    }
  }

  updateCoverTo(product: any) {
    if (product.coverFrom) {

      const formattedCoverFromDate = this.formatDate(product.coverFrom);
      this.producSetupService.getCoverToDate(formattedCoverFromDate, product.productCode.code)
        .subscribe({
          next: (res) => {
            this.midnightexpiry = res;
            log.debug("midnightexpirydate", this.midnightexpiry);
            log.debug(this.midnightexpiry)
            const coverFrom = this.midnightexpiry._embedded[0].coverToDate
            const coverToDate = new Date(coverFrom)
            product.coverTo = coverToDate

            // Update the specific product's coverTo field
          },
          error: (error: HttpErrorResponse) => {
            log.debug("Error log", error.error.message);

            this.globalMessagingService.displayErrorMessage(
              'Error',
              error.error?.message
            );
          },

        })
    }
  }


  onRowEditInits(product: any) {
    this.clonedProducts[product.productCode.code] = { ...product };
    console.log('Editing row:', product);
  }

  onRowEditSaves(product: any) {
    const coverFromDate = product.coverFrom;
    const coverToDate = product.coverTo;

    if (coverFromDate && coverToDate && product.productCode?.code) {
      // Clean assignment (optional, if values are changed before save)
      product.coverFrom = new Date(coverFromDate);
      product.coverTo = new Date(coverToDate);

      this.productDetails = this.productDetails.map(item =>
        item.productCode.code === product.productCode.code ? { ...item, ...product } : item
      );

      sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
      delete this.clonedProducts[product.productCode.code];

      // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Row updated successfully' });
    } else {
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields' });
    }
  }

  onRowEditCancels(product: any, index: number) {
    const code = product.productCode.code;
    this.productDetails[index] = this.clonedProducts[code];
    delete this.clonedProducts[code];

    // this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Edit cancelled' });
  }

  onProductChanges(event: any, rowIndex: number, product: any) {
    const selectedProduct = this.ProductDescriptionArray.find(p => p.code === event.code);
    if (selectedProduct) {
      product.productCode = selectedProduct;
      console.log("Updated product after dropdown change:", product);
    }
  }


}
