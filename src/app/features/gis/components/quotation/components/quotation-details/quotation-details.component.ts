import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
import { ProductClauseDTO, Products } from '../../../setups/data/gisDTO';
import { CountryISO, PhoneNumberFormat, SearchCountryField, } from 'ngx-intl-tel-input';
import { ClaimsService } from '../../../claim/services/claims.service';
import * as bootstrap from 'bootstrap';

const log = new Logger('QuotationDetails');

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit, OnDestroy {


  @ViewChild('dt') table!: Table;
  @ViewChild(Table) private dataTable: Table;
  @ViewChild('reassignProductModal') reassignProductModalElement!: ElementRef;
  @ViewChild('chooseClientReassignModal') chooseClientReassignModalElement!: ElementRef;

  quotationForm: FormGroup;
  newClient: boolean = false;
  selectedClientType = 'existing';
  showClientSearchModal = false;
  selectedClientName = '';

  headingSearch: string = '';
  shortDescriptionSearch: string = '';
  wordingSearch: string = '';
  steps = quoteStepsData;
  branch: OrganizationBranchDto[];
  currency: CurrencyDTO[]
  clauses: any;
  products: Products[] = [];
  ProductDescriptionArray: any = [];

  user: any;
  formData: any;

  agents: any
  agentDetails: any
  quotationsList: any;
  clientExistingQuotations: any
  quotationNo: any;
  quotationCode: any;
  isChecked: boolean = false;
  show: boolean = false;
  showProducts: boolean = true;
  showClauses: boolean = true;
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

  todaysDate: Date;
  expiryDate: string;
  coverToDate: Date;
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
  mandatoryProductClause: ProductClauseDTO[] = [];
  nonMandatoryProductClause: ProductClauseDTO[] = [];
  productClause: ProductClauseDTO[] = [];
  deleteCandidateProductCode: string | null = null;
  reassignProductCode: string | null = null;
  quotationFormContent: any
  detailedQuotationFormData: {
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
    scheduleLevel: string
    isPriority: string;
  }[];
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
  selectedClientCode: number;
  users: any
  selectedUser: any;
  fullNameSearch: string = '';
  globalSearch: string = '';
  noUserChosen: boolean = false
  clientToReassignProduct: string = '';
  reassignProductModal: any;
  chooseClientReassignModal: any;
  reassignButton: boolean = false

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
    public claimsService: ClaimsService,
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

  ngAfterViewInit() {
    this.reassignProductModal = new bootstrap.Modal(this.reassignProductModalElement.nativeElement);
    this.chooseClientReassignModal = new bootstrap.Modal(this.chooseClientReassignModalElement.nativeElement);
  }

  ngOnInit(): void {
    this.quotationForm = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern)]],
      phone: [''],
      client: ['', [Validators.minLength(2)]]
    });
    this.loadDetailedQuotationFields();

    this.minDate = new Date();
    // this.todaysDate = new Date();
    // this.coverToDate = new Date(this.todaysDate);
    //  this.coverToDate.setFullYear(this.todaysDate.getFullYear() + 1);
    this.getuser();
    this.createQuotationProductForm();


    this.quotationProductForm.get('productCodes')?.valueChanges.subscribe(product => {
      if (product) {
        const today = new Date();
        const oneYearLater = new Date(today);
        oneYearLater.setFullYear(today.getFullYear() + 1);

        this.quotationProductForm.patchValue({
          wef: today,
          wet: oneYearLater
        });


        this.updateCoverToDate(today);
      }
    });
    this.quoteToEditData = JSON.parse(sessionStorage.getItem("quoteToEditData"));
    log.debug("quote data to edit: ", this.quoteToEditData);

    if (this.quoteToEditData) {
      log.debug("load quotation details: ", this.quoteToEditData);
      this.loadClientQuotation();
    }

    this.loadPersistedClauses();
    this.getUsers()
  }



  loadDetailedQuotationFields(): void {
    const formFieldDescription = `detailed-quotation-details`;

    this.quotationService.getFormFields(formFieldDescription).subscribe({
      next: (response) => {
        const fields = response?.[0]?.fields || [];

        this.quotationFormContent = response;
        // this.subclassFormData = fields.filter(fields => fields.scheduleLevel === 'L1');
        this.detailedQuotationFormData = fields
        log.debug(this.quotationFormContent, ' Quotation Form-content');
        log.debug(this.detailedQuotationFormData, 'Quotation formData is defined here');
        this.fetchQuotationRelatedData()

        // Remove existing dynamic controls
        // Object.keys(this.riskDetailsForm.controls).forEach((controlName) => {
        //   const control = this.riskDetailsForm.get(controlName) as any;
        //   if (control?.metadata?.dynamic) {
        //     this.riskDetailsForm.removeControl(controlName);
        //     log.debug(`Removed dynamic control: ${controlName}`);
        //   }
        // });

        // Add new dynamic controls 
        // this.detailedQuotationFormData.forEach((field) => {
        //   const validators = field.isMandatory === 'Y' ? [Validators.required] : [];
        //   const savedValue = sessionStorage.getItem(`quotation_${field.name}`);
        //   const formControl = new FormControl(savedValue || '', validators);
        //   (formControl as any).metadata = { dynamic: true };

        //   this.quotationForm.addControl(field.name, formControl);
        //   formControl.valueChanges.subscribe(value => {
        //     sessionStorage.setItem(`quotation_${field.name}`, value);

        //     if (field.name === 'multiUserEntry') {
        //       if (value === 'Y') {
        //         this.handleMultiUserYes();
        //       } else if (value === 'N') {
        //         this.handleMultiUserNo();
        //       }
        //     }
        //   });

        //   if (field.name === 'multiUserEntry' && savedValue) {
        //     if (savedValue === 'Y') {
        //       this.handleMultiUserYes();
        //     } else if (savedValue === 'N') {
        //       this.handleMultiUserNo();
        //     }
        //   }
        // });
        this.detailedQuotationFormData.forEach((field) => {
          const validators = field.isMandatory === 'Y' ? [Validators.required] : [];

          // Handle rfqDate separately
          let initialValue: any;
          const savedValue = sessionStorage.getItem(`quotation_${field.name}`);

          if (field.name === 'rfqDate') {
            // If sessionStorage has value, use it; otherwise, use today's date
            initialValue = savedValue ? new Date(savedValue) : new Date();
            this.updateQuotationExpiryDate(initialValue)
          } else {
            initialValue = savedValue || '';
          }

          const formControl = new FormControl(initialValue, validators);
          (formControl as any).metadata = { dynamic: true };
          this.quotationForm.addControl(field.name, formControl);

          formControl.valueChanges.subscribe(value => {
            sessionStorage.setItem(`quotation_${field.name}`, value);

            if (field.name === 'multiUserEntry') {
              if (value === 'Y') {
                this.handleMultiUserYes();
              } else if (value === 'N') {
                this.handleMultiUserNo();
              }
            }
          });

          if (field.name === 'multiUserEntry' && savedValue) {
            if (savedValue === 'Y') {
              this.handleMultiUserYes();
            } else if (savedValue === 'N') {
              this.handleMultiUserNo();
            }
          }
        });


        log.debug(this.quotationForm.value, 'Final Form Value');
      },
      error: (err) => {
        log.error(err, 'Failed to load risk fields');
      }
    });
  }




  setClientType(value: 'new' | 'existing') {
    this.selectedClientType = value;
    this.newClient = value === 'new';
    log.debug("New client status", this.newClient)
  }
  handleSaveClient(eventData: any) {
    log.debug('Event received from Client search comp', eventData);
    const clientCode = eventData.id;
    this.selectedClientCode = clientCode;
    this.selectedClientName = eventData.clientFullName
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.showClientSearchModal = false;
  }
  //search clause
  filterByshortDescription(event: any): void {
    const value = event.target.value;
    this.shortDescriptionSearch = value;
    this.table.filter(value, 'shortDescription', 'contains');
  }

  filterByHeading(event: any): void {
    const value = event.target.value;
    this.table.filter(value, 'heading', 'contains');
  }

  filterByWording(event: any): void {
    const value = event.target.value;
    this.table.filter(value, 'wording', 'contains');
  }


  // Product Clauses
  sessionClauses: any
  getProductClause(product: any) {
    const productCode = product.code || this.productCode;
    this.productCode = productCode;
    sessionStorage.setItem("selectedProductCode", productCode);

    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    const productSessionData = allClausesMap[productCode];

    if (productSessionData) {
      log.debug("Loading clauses from session for product:", productCode);
      this.productClause = productSessionData.productClause;
      this.nonMandatoryProductClause = productSessionData.nonMandatoryProductClause;
      this.clausesModified = productSessionData.clausesModified;
      this.sessionClauses = [...this.productClause];
      return;
    }

    this.quotationService.getProductClauses(productCode).subscribe(res => {
      this.clauses = res;
      this.mandatoryProductClause = res.filter(c => c.isMandatory === 'Y');
      this.nonMandatoryProductClause = res.filter(c => c.isMandatory === 'N');
      this.productClause = this.mandatoryProductClause;
      log.debug("mandatory clauses", this.productClause)
      this.sessionClauses = [...this.productClause];

      allClausesMap[productCode] = {
        productClause: this.productClause,
        nonMandatoryProductClause: this.nonMandatoryProductClause,
        clausesModified: false
      };
      sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));
    });
  }

  private loadPersistedClauses() {
    const storedProductCode = sessionStorage.getItem("selectedProductCode");
    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");

    if (storedProductCode && allClausesMap[storedProductCode]) {
      const productSessionData = allClausesMap[storedProductCode];

      this.productCode = storedProductCode;
      this.selectedRow = storedProductCode;

      this.productClause = productSessionData.productClause;
      this.nonMandatoryProductClause = productSessionData.nonMandatoryProductClause;
      this.clausesModified = productSessionData.clausesModified;
      this.sessionClauses = [...this.productClause];

      log.debug("Loaded persisted data from allClausesMap:", {
        productCode: this.productCode,
        sessionClauses: this.sessionClauses,
        nonMandatoryProductClause: this.nonMandatoryProductClause,
        clausesModified: this.clausesModified
      });
    } else {
      log.debug("No persisted data found for product:", storedProductCode);
    }
  }

  showClauseModal: boolean = false;
  clausesModified: boolean = false;

  openClauseModal() {
    const storedProductCode = sessionStorage.getItem("selectedProductCode");

    if (storedProductCode) {
      if ((!this.clauses || this.clauses.length === 0) && !this.clausesModified) {
        this.getProductClause({ code: storedProductCode });
      }

      this.showClauseModal = true;
      const modalElement = document.getElementById('addClause');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    } else {
      this.globalMessagingService.displayErrorMessage('warning', 'You need to select a product first');
    }
  }
  closeClauseModal() {
    this.showClauseModal = false;
  }

  selectedClauses: any
  addProductClauses() {
    if (this.selectedClauses?.length) {
      this.productClause = [...this.productClause, ...this.selectedClauses];
      this.sessionClauses = [...this.productClause];
      this.nonMandatoryProductClause = this.nonMandatoryProductClause.filter(
        clause => !this.selectedClauses.some(sel => sel.shortDescription === clause.shortDescription)
      );
      this.clausesModified = true;

      const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
      allClausesMap[this.productCode] = {
        productClause: this.productClause,
        nonMandatoryProductClause: this.nonMandatoryProductClause,
        clausesModified: this.clausesModified
      };
      sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));

      this.selectedClauses = [];
      this.globalMessagingService.displaySuccessMessage("success", "Product clause added successfully")
    }
  }

  selectedProductClause: any = {
    id: '',
    heading: '',
    wording: ''
  };
  originalClauseBeforeEdit: any = null;

  wasModified(): boolean {
    if (!this.selectedProductClause || !this.originalClauseBeforeEdit) return false;

    const newWording = this.selectedProductClause.wording?.trim();
    const oldWording = this.originalClauseBeforeEdit.wording?.trim();

    return newWording !== oldWording && newWording.length > 0;
  }


  populateEditClauseModal(clause: any) {
    this.selectedProductClause = { ...clause };
    this.originalClauseBeforeEdit = { ...clause };
  }

  editClause() {
    if (!this.selectedProductClause) return;

    const replaceClause = (list: any[]) =>
      list.map(c => c.shortDescription === this.selectedProductClause.shortDescription ? { ...this.selectedProductClause } : c);

    this.sessionClauses = replaceClause(this.sessionClauses);
    this.productClause = replaceClause(this.productClause);

    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    if (allClausesMap[this.productCode]) {
      allClausesMap[this.productCode] = {
        ...allClausesMap[this.productCode],
        productClause: this.productClause,
        clausesModified: true
      };
      sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));
    }

    this.selectedProductClause = { id: '', heading: '', wording: '' };
    this.globalMessagingService.displaySuccessMessage('success', 'Clause edited successfully');
  }

  //delete product clause
  clauseToDelete: any = null;
  prepareDeleteClause(clause: any) {
    this.clauseToDelete = clause;
  }

  deleteProductClause() {
    if (!this.clauseToDelete) return;
    this.sessionClauses = this.sessionClauses.filter(c => c.shortDescription !== this.clauseToDelete.shortDescription);
    this.productClause = this.productClause.filter(c => c.shortDescription !== this.clauseToDelete.shortDescription);

    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    if (allClausesMap[this.productCode]) {
      allClausesMap[this.productCode].productClause = this.productClause;
      allClausesMap[this.productCode].clausesModified = true;
      sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));
      this.clauseToDelete = null;
    }
    this.globalMessagingService.displaySuccessMessage('success', 'Clause deleted successfully');


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
          this.getProductClause(selectedProduct);
          this.checkMotorClass();
        }
      });

      // Set currency code
      this.currency.forEach(el => {
        if (el.symbol === this.quotationDetails.currency) {
          this.quotationForm.controls['currency'].setValue(el);
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
            this.getProductClause(selectedProduct);
            this.checkMotorClass();
          }
        });

        // Set currency code
        this.currency.forEach(el => {
          if (el.symbol === this.quickQuotationDetails.currency) {
            this.quotationForm.controls['currency'].setValue(el);
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

    this.userCode = this.userDetails.code;
    log.debug('User Code ', this.userCode);

    this.dateFormat = this.userDetails?.orgDateFormat;
    log.debug('Organization Date Format:', this.dateFormat);
    sessionStorage.setItem('dateFormat', this.dateFormat);

    const todaysDate = new Date();
    log.debug('todays date before being formatted', todaysDate);


    this.todaysDate = todaysDate;


    const day = todaysDate.getDate();
    const month = todaysDate.toLocaleString('default', { month: 'long' });
    const year = todaysDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    log.debug('Formatted Todays Date (for display):', formattedDate);

    this.updateQuotationExpiryDate(this.todaysDate);

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
    log.debug('Organization currency delimiter', this.currencyDelimiter);
    sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);
  }



  createQuotationProductForm() {
    this.quotationProductForm = this.fb.group({
      code: [0],
      productCodes: [, Validators.required],
      quotationCode: [0],
      productShortDescription: [''],
      quotationNo: [''],
      premium: [0],
      wef: [null, Validators.required],
      wet: [null, Validators.required],
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
        currencyCode: quotationFormValues.currency.id || this.defaultCurrency.id,
        source: quotationFormValues.source.code,
        currencyRate: this.exchangeRate,
        agentShortDescription: this.agentDetails?.shortDesc || "Direct",
        agentCode: 0,
        clientCode: this.selectedClientCode,
        clientType: "I",
        wefDate: this.formatDate(this.productDetails[0].coverFrom),
        wetDate: this.formatDate(this.productDetails[0].coverTo),
        frequencyOfPayment: quotationFormValues?.frequencyOfPayment?.value,
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
      this.createQuotation(quotationPayload)
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
    const selectedProduct = this.quotationProductForm.get('productCodes')?.value;
    log.debug("Selected product:", selectedProduct)

    const coverFromDate = date;
    const formattedCoverFromDate = this.formatDate(coverFromDate);
    sessionStorage.setItem("selectedCoverFromDate", formattedCoverFromDate);
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
    const productCode = this.quotationProductForm.value.productCodes.code || this.selectedProduct?.code
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
          this.coverToDate = coverFromDate;

          // this.coverToDate = formattedDate;
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

  toggleClauses() {
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
          const currencySymbol = this.quotationForm.value.currency.symbol

          const currencyCode = this.quotationForm.value.currency.id
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
          this.globalMessagingService.displayErrorMessage('Error', error);
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

          // this.fetchUserOrgId()
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
        this.ProductDescriptionArray = this.products.map(product => {
          const description = this.capitalizeWord(product.description);
          return {
            code: product.code.toString(), // convert to string
            description,
            filterText: `${product.code} ${description}`.toLowerCase()
          };
        });

        console.log("✅ ProductDescriptionArray with filterText:", this.ProductDescriptionArray);


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
  editingRowIndex: number | null = null;



  onRowEditInit(index: number, row: any) {
    log.debug('onRowEditInit - selectedEditRowIndex before edit:', this.selectedEditRowIndex);

    this.selectedEditRowIndex = index;
    this.selectedEditRow = row;

    log.debug('onRowEditInit - selectedEditRowIndex after edit:', this.selectedEditRowIndex);
    log.debug('Editing row:', row);
  }

  onProductChange(selected: any, rowIndex: number, product: any) {
    // Only update if the product actually changed

    // if (product.productCode?.code !== selected.code) {
    //   product.productCode = selected;
    product._pendingProductCode = selected;
    console.log("Product change pending - will apply on save");


    //   // Optional: save to session storage
    //   sessionStorage.setItem(`product_${rowIndex}`, JSON.stringify(product));
    //   console.log("Updated product:", product);
    // }

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


  // onProductsChange(event: any) {
  //   console.log('Selected products:', event.value);
  //   // Add your custom logic here
  // }

  // isProductSelected(productCode: string): boolean {
  //   const selectedProducts = this.quotationProductForm.get('productCodes')?.value || [];
  //   return selectedProducts.includes(productCode);
  // }




  submitAddProductForm() {
    if (this.quotationProductForm.invalid) {
      this.quotationProductForm.markAllAsTouched();
      return;
    }

    const coverFromDate = new Date(this.quotationProductForm.get('wef')?.value);
    const coverToDate = new Date(this.quotationProductForm.get('wet')?.value);

    const selectedProduct = this.quotationProductForm.get('productCodes')?.value;
    const selectedProductCode = selectedProduct.code;
    log.debug('Selected product CODE', selectedProductCode);

    if (!this.productDetails) {
      this.productDetails = [];
    }

    // ✅ Check if product code already exists
    const alreadyExists = this.productDetails.some(
      p => p.productCode.code === selectedProductCode
    );

    if (alreadyExists) {
      this.globalMessagingService.displayErrorMessage('warning', 'This product has already been added');
      return;
    }

    // If new, add it
    if (selectedProduct && selectedProduct.description) {
      this.productDetails.push({
        productCode: selectedProduct,
        productName: selectedProduct.description,
        coverFrom: coverFromDate,
        coverTo: coverToDate
      });
    }

    this.productDetails = this.productDetails.filter(p => p?.productCode?.description);
    this.productDetails.forEach(product => {
      product.coverFrom = new Date(product.coverFrom);
      product.coverTo = new Date(product.coverTo);
      if (!product.productName && product.productCode?.description) {
        product.productName = product.productCode.description;
      }
    });

    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
    log.debug("Saved Product Details to sessionStorage:", this.productDetails);

    this.quotationProductForm.reset({
      productCodes: [],
      wef: this.todaysDate,
      wet: this.coverToDate
    });

    this.getProductClause({ code: selectedProductCode });

    // Close modal
    const closeBtn = document.querySelector('.btn-close') as HTMLElement;
    closeBtn?.click();
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
    this.selectedRow = product.productCode;
    this.getProductClause(this.selectedRow);
  }


  openProductDeleteModal(product: any) {
    this.productToDelete = product;
    if (!product || !product.productCode?.code) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select a product to continue');
      return;
    }

    this.deleteCandidateProductCode = product.productCode.code;

    // Directly open the modal using Bootstrap
    const modalElement = document.getElementById('deleteProduct');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    } else {
      console.error("❌ Modal with ID 'deleteProduct' not found in DOM.");
    }
  }

  productToDelete: any = null;
  deleteProduct() {
    if (!this.productToDelete) return;

    this.productDetails = this.productDetails.filter(
      p => p.productCode.code !== this.productToDelete.productCode.code
    );
    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));

    //remove related clauses from allClausesMap
    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    delete allClausesMap[this.productToDelete.productCode.code];
    sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));

    if (this.productCode === this.productToDelete.productCode.code) {
      const nextProduct = this.productDetails[0];
      if (nextProduct) {
        this.getProductClause({ code: nextProduct.productCode.code });
        this.productCode = nextProduct.productCode.code;
      } else {
        this.productCode = null;
        this.sessionClauses = [];
        this.productClause = [];
        this.nonMandatoryProductClause = [];
        this.clausesModified = false;
      }
    }

    this.globalMessagingService.displaySuccessMessage('success', 'Product deleted successfully');

    this.productToDelete = null;
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


  onRowEditInits(product: any, index: any) {
    this.clonedProducts[product.productCode.code] = { ...product };
    this.selectedEditRowIndex = index;

    log.debug('Editing row:', product);
  }

  onRowEditSaves(product: any) {
    const coverFromDate = product.coverFrom;
    const coverToDate = product.coverTo;

    // If there's a pending product code from dropdown selection, finalize it
    if (product._pendingProductCode) {
      product.productCode = product._pendingProductCode;
      product.productName = product._pendingProductCode.description;
      delete product._pendingProductCode;
    }

    // Ensure required values exist
    if (coverFromDate && coverToDate && product.productCode?.code) {
      product.coverFrom = new Date(coverFromDate);
      product.coverTo = new Date(coverToDate);

      // ✅ Update using row index instead of matching by productCode
      if (this.selectedEditRowIndex !== undefined) {
        this.productDetails[this.selectedEditRowIndex] = {
          ...product,
          productCode: { ...product.productCode }
        };
      }

      sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
      log.debug("Saved to sessionStorage:", JSON.parse(sessionStorage.getItem('productFormDetails')));

      delete this.clonedProducts[product.productCode.code];
    } else {
      // Optionally show validation errors
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
      log.debug("Updated product after dropdown change:", product);
    }
  }

  openReassignProductModal(product: any) {
    this.reassignProductModal.show();
  }

  openChooseClientModal() {
    this.chooseClientReassignModal.show();
  }


  getUsers() {
    this.claimsService.getUsers().subscribe({
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

  handleMultiUserYes(): void {
    this.reassignButton = true
  }

  handleMultiUserNo(): void {
    this.reassignButton = false
  }

  //search member to reassign
  filterGlobal(event: any): void {
    const value = event.target.value;
    this.globalSearch = value;
    this.table.filterGlobal(value, 'contains');
  }

  filterByFullName(event: any): void {
    const value = event.target.value;
    this.table.filter(value, 'name', 'contains');
  }

  onUserSelect(): void {
    if (this.selectedUser) {
      log.debug("Selected user>>>", this.selectedUser);
      this.globalSearch = this.selectedUser.id;
      this.fullNameSearch = this.selectedUser.name;
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

    this.clientToReassignProduct = this.selectedUser.name;
    this.chooseClientReassignModal.hide();
    this.reassignProductModal.show();

  }

  reassignProduct() {
    if (!this.clientToReassignProduct) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false

      }, 3000);
      return;
    }
    this.reassignProductModal.hide();
    this.globalMessagingService.displaySuccessMessage('Success', 'Product reassigned');
    this.clientToReassignProduct = null;

  }

  createQuotation(quotationPayload: any) {
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
        this.router.navigate(['/home/gis/quotation/risk-center']);
      },
      (error: HttpErrorResponse) => {
        log.info(error);
        this.spinner.hide();
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    );

  }
}
