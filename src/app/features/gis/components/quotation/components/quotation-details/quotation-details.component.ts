import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { Introducer } from '../../data/introducersDTO';
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
import { GroupedUser, ProductDetails, ProductDTO, QuotationDetails, QuotationList, QuotationSource, UserDetail } from '../../data/quotationsDTO';
import { ProductClauseDTO, Products } from '../../../setups/data/gisDTO';
import { CountryISO, PhoneNumberFormat, SearchCountryField, } from 'ngx-intl-tel-input';
import { ClaimsService } from '../../../claim/services/claims.service';
import * as bootstrap from 'bootstrap';
import { AgentDTO } from 'src/app/features/entities/data/AgentDTO';
import { Modal } from 'bootstrap';

const log = new Logger('QuotationDetails');

@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent implements OnInit, OnDestroy {


  @ViewChild('productClauseTable') productClauseTable!: any;
  @ViewChild('addProductClausesTable') addProductClausesTable!: any;
  @ViewChild('selectIntroducerTable') selectIntroducerTable!: any;
  @ViewChild('selectAgentTable') selectAgentTable!: any;
  @ViewChild('selectMarketerTable') selectMarketerTable!: any;


  @ViewChild('reassignTable') reassignTable!: any;

  @ViewChild(Table) private dataTable: Table;
  @ViewChild('reassignProductModal') reassignProductModalElement!: ElementRef;
  @ViewChild('chooseClientReassignModal') chooseClientReassignModal!: ElementRef;

  private modals: { [key: string]: bootstrap.Modal } = {};

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
  quotationCode: number;
  isChecked: boolean = false;

  show: boolean = false;
  showProducts: boolean = true;
  showClauses: boolean = true;
  isProductClauseOpen: boolean = false
  showProductClauses: boolean = true;
  showProductClauseColumnModal = false;
  productClauseColumns: { field: string; header: string; visible: boolean, filterable: boolean, sortable: boolean }[] = [];




  quotationNum: string;
  introducers: Introducer[] = [];
  selectedIntroducer: Introducer | null = null;
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
  storedQuotationFormDetails: any = null
  motorClassAllowed: string;
  currencyDelimiter: any;
  quotationDetails: QuotationDetails;
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
    isPriority: 'Y' | 'N';
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
  reassignButton: boolean = false
  productToReassign: any;
  noCommentleft: boolean = false
  reassignProductComment: string;
  sessionClauses: any;
  clientToReassignQuotation: any;
  clientOptions: any;
  quotationAction: string;
  marketerList: AgentDTO[] = [];
  showMarketerSearchModal = false;
  selectedMarketerName: string;
  selectedMarketer!: any
  departmentSelected: boolean = false;
  showIntroducerSearchModal = false;
  selectedIntroducerName: string;
  showProductColumnModal: boolean = false;
  columnModalPosition = { top: '0px', left: '0px' }
  columns: { field: string; header: string; visible: boolean }[] = [];
  groupUsers: GroupedUser[] = [];
  selectedGroupUserId!: number;
  groupLeaderName: string = '';
  showAgentSearchModal = false;
  selectedAgentName: string;
  dragging = false;
  dragOffset = { x: 0, y: 0 };
  isNewClientSelected: boolean = false;
  quickQuoteConverted: boolean = false;
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
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {
    this.quickQuoteConverted = JSON.parse(sessionStorage.getItem('quickQuoteConvertedFlag'))
    this.quotationAction = sessionStorage.getItem('quotationAction')
    this.quotationCode = Number(sessionStorage.getItem('quotationCode'))
    this.quotationCode && this.fetchQuotationDetails(this.quotationCode);
    this.storedQuotationFormDetails = JSON.parse(sessionStorage.getItem('quotationFormDetails'));
    log.debug("QUOTATION FORM DETAILS", this.storedQuotationFormDetails)
    const StoredQuotationPayload = JSON.parse(sessionStorage.getItem('quotationPayload'));
    log.debug("QUOTATION FORM Payload", StoredQuotationPayload)
    const selectedClientName = sessionStorage.getItem('SelectedClientName')
    this.selectedClientName = selectedClientName;
    log.debug("Selected client name:", this.selectedClientName)
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
    this.getuser();
    this.getAgents();
    this.quotationForm = this.fb.group({
      email: ['', [Validators.pattern(this.emailPattern)]],
      phone: ['', this.newClient ? [Validators.required] : []],
      client: ['', [Validators.minLength(2)]],
      paymentFrequency: [this.paymentFrequencies[0].value, Validators.required]
    });
    this.loadDetailedQuotationFields();

    this.minDate = new Date();
    // this.todaysDate = new Date();
    // this.coverToDate = new Date(this.todaysDate);
    //  this.coverToDate.setFullYear(this.todaysDate.getFullYear() + 1);
    this.createQuotationProductForm();
    if (this.productDetails?.length > 0) {
      this.setColumnsFromProductDetails(this.productDetails[0]);
      this.checkProducts()
    }


    this.quotationProductForm.get('productCodes')?.valueChanges.subscribe(product => {
      if (product) {
        const today = new Date();
        const oneYearLater = new Date(today);
        oneYearLater.setFullYear(today.getFullYear() + 1);

        this.quotationProductForm.patchValue({
          wef: today,
          wet: oneYearLater
        });

        // this.updateCoverToDate(today);
      }
    });

    this.loadPersistedClauses();
    this.getUsers();

  }

  // ngOnChanges(): void {
  //   this.checkProducts();
  //   this.updateProductsFromQuickQuote();
  // }


  checkProducts() {
    if (this.productDetails && this.productDetails.length > 0) {
      this.isProductClauseOpen = true;
    }
  }

  ngAfterViewInit() {
    this.modals['chooseClientReassign'] = new bootstrap.Modal(this.chooseClientReassignModal.nativeElement);
    this.modals['reassignProduct'] = new bootstrap.Modal(this.reassignProductModalElement.nativeElement);
  }

  openModals(modalName: string) {
    this.modals[modalName]?.show();
  }

  closeModals(modalName: string) {
    this.modals[modalName]?.hide();
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
          }
          else if (field.name === 'multiUserEntry') {
            initialValue = savedValue || 'N';
          }

          else {
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

          if (field.name === 'multiUserEntry') {
            if (savedValue === 'Y') {
              this.handleMultiUserYes();
            } else {
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

    this.newClient && (this.isNewClientSelected = true);
    sessionStorage.setItem('isNewClientSelected', JSON.stringify(this.isNewClientSelected))
    log.debug("New client status", this.newClient)
  }
  handleSaveClient(eventData: any) {
    log.debug('Event received from Client search comp', eventData);
    const clientCode = eventData.id;
    this.selectedClientCode = clientCode;
    this.selectedClientName =
      eventData.firstName && eventData.lastName
        ? `${eventData.firstName} ${eventData.lastName}`
        : eventData.firstName || eventData.lastName || '';
    sessionStorage.setItem("SelectedClientName", this.selectedClientName);
    this.quotationForm.controls['client'].setValue(this.selectedClientCode);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.showClientSearchModal = false;
  }
  //search clause
  filterByshortDescription(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productClauseTable.filter(input.value, 'shortDescription', 'contains');
  }

  filterByHeading(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productClauseTable.filter(input.value, 'heading', 'contains');
  }

  filterByWording(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.productClauseTable.filter(input.value, 'wording', 'contains');
  }
  filterByAddshortDescription(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addProductClausesTable.filter(input.value, 'shortDescription', 'contains');
  }

  filterByAddHeading(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.addProductClausesTable.filter(input.value, 'heading', 'contains');
  }
  fetchQuotationDetails(quotationCode: number) {
    log.debug("Quotation Number tot use:", quotationCode)
    this.quotationService.getQuotationDetails(quotationCode)
      .subscribe({
        next: (res: any) => {
          this.quotationDetails = res;
          log.debug("Quotation details-risk details", this.quotationDetails);


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

  //product clauses
  toggleProductClausesopen() {
    this.isProductClauseOpen = !this.isProductClauseOpen;
  }

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

    this.productClauseColumns.push({ field: 'actions', header: 'Actions', visible: true, filterable: false, sortable: false });

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

  defaultVisibleProductClauseFields = ['shortDescription', 'heading', 'wording'];

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

      if (this.sessionClauses.length > 0) {
        this.setProductClauseColumns(this.sessionClauses[0]);
      }

      return;
    }

    this.quotationService.getProductClauses(productCode).subscribe(res => {
      this.clauses = res;
      this.mandatoryProductClause = res.filter(c => c.isMandatory === 'Y');
      this.nonMandatoryProductClause = res.filter(c => c.isMandatory === 'N');
      this.productClause = this.mandatoryProductClause;
      log.debug("mandatory clauses", this.productClause)
      this.sessionClauses = [...this.productClause];

      if (this.sessionClauses.length > 0) {
        this.setProductClauseColumns(this.sessionClauses[0]);
      }

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

      if (this.sessionClauses.length > 0) {
        this.setProductClauseColumns(this.sessionClauses[0]);
      }

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

  // deleteProductClause() {
  //   if (!this.clauseToDelete) return;
  //   this.sessionClauses = this.sessionClauses.filter(c => c.shortDescription !== this.clauseToDelete.shortDescription);
  //   this.productClause = this.productClause.filter(c => c.shortDescription !== this.clauseToDelete.shortDescription);

  //   const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
  //   if (allClausesMap[this.productCode]) {
  //     allClausesMap[this.productCode].productClause = this.productClause;
  //     allClausesMap[this.productCode].clausesModified = true;
  //     sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));
  //     this.clauseToDelete = null;
  //   }
  //   this.globalMessagingService.displaySuccessMessage('success', 'Clause deleted successfully');


  // }

  deleteProductClause(): void {
    if (!this.clauseToDelete) return;

    // Remove from local arrays
    this.sessionClauses = this.sessionClauses.filter(
      c => c.shortDescription !== this.clauseToDelete.shortDescription
    );
    this.productClause = this.productClause.filter(
      c => c.shortDescription !== this.clauseToDelete.shortDescription
    );

    // Push back into nonMandatoryProductClauses 
    this.nonMandatoryProductClause = [...this.nonMandatoryProductClause, this.clauseToDelete];

    // Update session storage 
    const allClausesMap = JSON.parse(sessionStorage.getItem("allClausesMap") || "{}");
    if (allClausesMap[this.productCode]) {
      allClausesMap[this.productCode].productClause = this.productClause;
      allClausesMap[this.productCode].nonMandatoryProductClause = this.nonMandatoryProductClause;
      allClausesMap[this.productCode].clausesModified = true;
      sessionStorage.setItem("allClausesMap", JSON.stringify(allClausesMap));
    }

    this.globalMessagingService.displaySuccessMessage('Success', 'Clause deleted successfully');
    this.clauseToDelete = null;
  }


  ngOnDestroy(): void {
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
    sessionStorage.setItem('userCode', JSON.stringify(this.userCode))

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

  checkQuationDetailsRequiredFields(): { isValid: boolean; missingItems: string[]; tooltipMessage: string } {
    const missingItems: string[] = [];

    // Check client 
    const hasClient = (this.selectedClientName && this.selectedClientName.trim() !== '')
      || (this.quotationForm.get('client')?.value && this.quotationForm.get('client')?.value.trim() !== '');

    if (!hasClient) {
      missingItems.push('client');
    }


    // Check source 
    const hasSource = this.quotationForm.get('source')?.value;
    if (!hasSource) {
      missingItems.push('source');
    }

    // Check quotation type 
    const hasQuotationType = this.quotationForm.get('quotationType')?.value;
    if (!hasQuotationType) {
      missingItems.push('quotation type');
    }

    // Check branch 
    const hasBranch = this.quotationForm.get('branch')?.value;
    if (!hasBranch) {
      missingItems.push('branch');
    }

    // Check currency 
    const hasCurrency = this.quotationForm.get('currency')?.value;
    if (!hasCurrency) {
      missingItems.push('currency');
    }

    const knownDateFields = [
      { name: 'RFQDate', label: 'Request for quote date' },
      { name: 'expiryDate', label: 'Quotation expiry date' },
    ];

    knownDateFields.forEach(dateField => {
      const control = this.quotationForm.get(dateField.name);
      if (control && (!control.value || control.value === '')) {
        if (!missingItems.includes(dateField.label)) {
          missingItems.push(dateField.label);
        }
      }
    });

    // Check multi-user entry
    const hasMultiUserEntry = this.quotationForm.get('multiUserEntry')?.value;
    if (!hasMultiUserEntry) {
      missingItems.push('multi-user entry');
    }

    // Check products 
    const hasProducts = this.productDetails && this.productDetails.length > 0;
    if (!hasProducts) {
      missingItems.push('products');
    }

    // dynamic tooltip message
    let tooltipMessage = '';
    if (missingItems.length === 0) {
      tooltipMessage = '';
    } else if (missingItems.length === 1) {
      tooltipMessage = `Please select ${missingItems[0]} to continue.`;
    } else if (missingItems.length === 2) {
      tooltipMessage = `Please select ${missingItems.join(' and ')} to continue.`;
    } else {
      const lastItem = missingItems.pop();
      tooltipMessage = `Please select ${missingItems.join(', ')} and ${lastItem} to continue.`;
    }

    return {
      isValid: missingItems.length === 0,
      missingItems,
      tooltipMessage
    };
  }

  get validationStatus() {
    return this.checkQuationDetailsRequiredFields();
  }

  saveQuotationDetails() {
    const validation = this.checkQuationDetailsRequiredFields();

    if (!validation.isValid) {
      const missingItemsList = validation.missingItems.join(' and ');
      this.globalMessagingService.displayErrorMessage(
        'Missing Required Information',
        `Please select ${missingItemsList} before proceeding.`
      );
      return;
    }

    log.debug("Quotation form details >>>>", this.quotationForm)
    log.debug("Selected agent >>>>", this.agentDetails)
    log.debug("ProductDetails:", this.productDetails)
    if (this.quotationForm.valid) {
      const quotationFormValues = this.quotationForm.getRawValue();
      const quotationPayload = {
        quotationNumber: this.quotationDetails?.quotationNo,
        quotationCode: this.quotationCode || null,
        user: this.user,
        branchCode: quotationFormValues.branch.id,
        RFQDate: this.formatDate(quotationFormValues.RFQDate),
        expiryDate: this.formatDate(quotationFormValues.expiryDate),
        currencyCode: quotationFormValues.currency.id || this.defaultCurrency.id,
        source: quotationFormValues.source.code,
        currencyRate: this.exchangeRate,
        agentShortDescription: quotationFormValues?.agent?.shortDesc || "Direct",
        agentCode: quotationFormValues?.agent?.id || 0,
        clientCode: this.selectedClientCode,
        clientType: "I",
        wefDate: this.formatDate(this.productDetails[0].coverFrom),
        wetDate: this.formatDate(this.productDetails[0].coverTo),
        frequencyOfPayment: quotationFormValues?.frequencyOfPayment?.value,
        prospectCode: this.quotationDetails?.prospectCode,
        premium: this.quotationDetails?.premium,
        comments: this.quotationDetails?.comments || quotationFormValues?.externalComments,
        internalComments: quotationFormValues?.internalComments,
        introducerCode: quotationFormValues?.introducer,
        marketerAgentCode: quotationFormValues?.marketer?.id,

        quotationProducts: this.productDetails.map((value) => {
          const existingProduct = this.quotationDetails?.quotationProducts?.find(
            (p) => p.productCode == value.productCode.code
          );
          log.debug('existing product:', existingProduct)

          return {
            code: existingProduct?.code || null, // If editing, use existing code; otherwise null
            quotationCode: this.quotationCode,
            wef: this.formatDate(value.coverFrom),
            wet: this.formatDate(value.coverTo),
            productCode: value.productCode.code,
            productName: value.productCode.description
          };
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


  }
  updateQuickQuoteDetails() {
    const validation = this.checkQuationDetailsRequiredFields();

    if (!validation.isValid) {
      const missingItemsList = validation.missingItems.join(' and ');
      this.globalMessagingService.displayErrorMessage(
        'Missing Required Information',
        `Please select ${missingItemsList} before proceeding.`
      );
      return;
    }

    log.debug('THIS IS CALEED IF IT IS A CONVERSION FROM QUICK QUOTE')
    log.debug("Quotation form details >>>>", this.quotationForm)
    log.debug("Selected agent >>>>", this.agentDetails)
    log.debug("ProductDetails:", this.productDetails)
    log.debug("QuoteDetails:", this.quotationDetails)
    if (this.quotationForm.valid) {
      const quotationFormValues = this.quotationForm.getRawValue();
      const quotationPayload = {
        quotationNumber: this.quotationDetails?.quotationNo,
        quotationCode: this.quotationCode || null,
        user: this.user,
        branchCode: quotationFormValues.branch.id,
        RFQDate: this.formatDate(quotationFormValues.RFQDate),
        expiryDate: this.formatDate(quotationFormValues.expiryDate),
        currencyCode: quotationFormValues.currency.id || this.defaultCurrency.id,
        source: quotationFormValues.source.code,
        currencyRate: this.exchangeRate,
        agentShortDescription: quotationFormValues?.agent?.shortDesc || "Direct",
        agentCode: quotationFormValues?.agent?.id || 0,
        clientCode: this.selectedClientCode,
        clientType: "I",
        wefDate: this.formatDate(this.productDetails[0].coverFrom),
        wetDate: this.formatDate(this.productDetails[0].coverTo),
        frequencyOfPayment: quotationFormValues?.frequencyOfPayment?.value,
        prospectCode: this.quotationDetails?.prospectCode,
        premium: this.quotationDetails?.premium,
        comments: this.quotationDetails?.comments,
        internalComments: quotationFormValues?.internalComments,
        introducerCode: quotationFormValues?.introducer,
        marketerAgentCode: quotationFormValues?.marketer?.id,

        quotationProducts: this.productDetails.map((value) => {
          const existingProduct = this.quotationDetails?.quotationProducts?.find(
            (p) => Number(p.productCode) == Number(value.productCode)
          );
          log.debug('existing product:', existingProduct)

          return {
            code: existingProduct?.code || null, // If editing, use existing code; otherwise null
            quotationCode: this.quotationCode,
            wef: this.formatDate(value.coverFrom),
            wet: this.formatDate(value.coverTo),
            productCode: value.productCode,
            productName: value.productCode.description
          };
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
        this.agents = data.content;
        log.debug("AGENTS", data)
        log.debug("AGENTS", this.agents)
        this.marketerList = data.content.filter(agent => agent.accountTypeId == 10);
        log.debug("Marketer list", this.marketerList);
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


  onQuotationTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)
    this.showIntermediaryField = value === 'I';
    if (!this.showIntermediaryField) {
      this.quotationForm?.get('agentCode').reset();
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

  // toggleProducts() {
  //   this.showProducts = !this.showProducts;
  // }

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

          this.fetchUserOrgId();
        }
        if (this.storedQuotationFormDetails?.currency) {
          const selectedCurrency = this.currency.find(currency => currency.id === this.storedQuotationFormDetails?.currency.id);
          if (selectedCurrency) {
            this.quotationForm.patchValue({ currency: selectedCurrency });
          }
        } else {
          this.quotationForm.patchValue({ currency: this.defaultCurrency });

        }
        console.log("Form value here:", this.quotationForm.value);

        // QUOTATION SOURCES
        this.quotationSources = sources?.content || [];
        this.quotationSources = this.quotationSources.map((value) => {
          let capitalizedDescription = value.description.charAt(0).toUpperCase() + value.description.slice(1).toLowerCase();
          return { ...value, description: capitalizedDescription };
        });

        log.debug("SOURCES", this.quotationSources);
        if (this.storedQuotationFormDetails?.source) {
          const selectedSource = this.quotationSources.find(source => source.code === this.storedQuotationFormDetails?.source.code);
          if (selectedSource) {
            this.quotationForm.patchValue({ source: selectedSource });
          }
        }

        // BRANCHES
        this.branch = branches.map((value) => {
          let capitalizedDescription = value.name.charAt(0).toUpperCase() + value.name.slice(1).toLowerCase();
          return { ...value, name: capitalizedDescription };
        });

        log.debug(this.branch, 'this is a branch list');

        const userCode = sessionStorage.getItem("userCode");

        this.quotationService.getUserBranches(userCode).subscribe({
          next: (userBranches) => {
            if (!userBranches?.length) return;

            //Get the first user branchId
            const firstUserBranchId = userBranches[0].branchId;

            //Match it against the full branch list
            const matchedBranch = this.branch.find(b => b.id === firstUserBranchId);

            if (matchedBranch) {
              this.quotationForm.patchValue({
                branch: matchedBranch
              });

              // log.debug('User\'s matched branch preselected:', matchedBranch);
            } else {
              log.warn('No matching branch found for user branchId:', firstUserBranchId);
            }
          },
          error: (err) => {
            console.error('Error fetching user branches:', err);
          }
        });

        // INTRODUCERS
        this.introducers = introducers;
        log.debug('introducers:', this.introducers)
        if (this.storedQuotationFormDetails?.introducer) {
          const selectedIntroducer = this.introducers.find(introducer => introducer.code === this.storedQuotationFormDetails?.introducer);
          if (selectedIntroducer) {
            this.quotationForm.patchValue({ introducer: selectedIntroducer.code });
            sessionStorage.setItem('introducer', JSON.stringify({
              surName: selectedIntroducer.surName,
              otherNames: selectedIntroducer.otherNames
            }));
          }
        }

        // PRODUCTS
        this.products = products;

        const storedProducts = sessionStorage.getItem('availableProducts');
        log.debug("StoredProducts:", storedProducts);

        if (storedProducts) {
          // Use saved products if they exist
          this.ProductDescriptionArray = JSON.parse(storedProducts);
        } else {
          // Fallback to API products
          this.ProductDescriptionArray = this.products?.map(product => {
            const description = this.capitalizeWord(product.description);
            return {
              code: product.code.toString(),
              description,
              filterText: `${product.code} ${description}`.toLowerCase()
            };
          });

          // Save initial list to sessionStorage
          sessionStorage.setItem('availableProducts', JSON.stringify(this.ProductDescriptionArray));
        }
        this.updateProductsFromQuickQuote();
        this.checkProducts();

        log.debug("ProductDescriptionArray with filterText:", this.ProductDescriptionArray);


        if (this.storedQuotationFormDetails?.productCode) {
          const selectedProduct = this.ProductDescriptionArray?.find(product => product.code === this.storedQuotationFormDetails?.productCode);
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
      this.showCampaignField = false;

      if (selectedSource.description === 'Walk in') {
        this.quotationForm.get('quotationType').setValue('D'); // Set to Direct
        this.onQuotationTypeChange('D');
      }
      else if (
        selectedSource.description === 'Agent' ||
        selectedSource.description === 'Agent/b' ||
        selectedSource.description === 'Broker/agent'
      ) {
        this.quotationForm.get('quotationType').setValue('I'); // Set to Intermediary
        this.onQuotationTypeChange('I');
      }
      else if (selectedSource.description === 'Campaign') {
        this.showCampaignField = true;
      }
    }
  }


  shouldShowField(fieldName: string): boolean {
    if (fieldName === 'agent') {
      return this.quotationForm.get('quotationType')?.value === 'I';
    }
    if (fieldName === 'campaign') {
      return this.showCampaignField;
    }

    return true;
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

  // openAddProductModal(): void {
  //   const payloadString = sessionStorage.getItem('quickQuotePayload');
  //   const productsString = sessionStorage.getItem('availableProducts');

  //   const quickQuotePayload = JSON.parse(payloadString);
  //   this.ProductDescriptionArray = JSON.parse(productsString);

  //   const product = quickQuotePayload.products[0];

  //   const matchingProduct = this.ProductDescriptionArray.find(
  //     (p: any) => String(p.code) === String(product.code)
  //   );

  //   this.quotationProductForm.patchValue({
  //     productCodes: matchingProduct || null,
  //     wef: new Date(quickQuotePayload.effectiveDate),
  //     wet: new Date(product.effectiveTo)
  //   });

  // }

  updateProductsFromQuickQuote(): void {
    const payloadString = sessionStorage.getItem('quickQuotePayload');
    if (!payloadString) return;

    const quickQuotePayload = JSON.parse(payloadString);

    if (!quickQuotePayload?.products || !Array.isArray(quickQuotePayload.products)) {
      return;
    }

    // reset productDetails
    this.productDetails = [];

    quickQuotePayload.products.forEach((payloadProduct: any) => {
      const matchedDesc = this.ProductDescriptionArray.find((desc: any) =>
        desc.code?.toString() === payloadProduct.code?.toString()
      );

      if (matchedDesc) {
        this.productDetails.push({
          productCode: payloadProduct.code?.toString(),
          productName: payloadProduct.description || matchedDesc.description,
          coverFrom: quickQuotePayload.effectiveDate,
          coverTo: payloadProduct.effectiveTo || null
        });

        // this.ProductDescriptionArray = this.ProductDescriptionArray.filter(
        //   (p: any) => p.code?.toString() !== payloadProduct.code?.toString()
        // );
      }
    });

    // save updated values to sessionStorage
    // sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
    // log.debug("Saved Product Details to sessionStorage:", this.productDetails);
    // sessionStorage.setItem('availableProducts', JSON.stringify(this.ProductDescriptionArray));

    // reset form
    // this.quotationProductForm.reset({
    //   productCodes: [],
    //   wef: '',
    //   wet: ''
    // });

    // call getProductClause for all products in productDetails
    this.productDetails.forEach((prod: any) => {
      this.getProductClause({ code: prod.productCode });
    });


    log.debug("Final product details:", this.productDetails);

    if (this.productDetails.length > 0) {
      this.setColumnsFromProductDetails(this.productDetails[0]);
    }


    // this.productDetails = quickQuotePayload.products.map((p: any) => {
    //   return {
    //     productCode: { code: p.code, description: p.productName || p.description },
    //     productName: p.productName || p.description,
    //     coverFrom: new Date(quickQuotePayload.effectiveDate),
    //     coverTo: new Date(p.effectiveTo),
    //     ...p
    //   };
    // });

    // const usedCodes = quickQuotePayload.products.map((p: any) => String(p.code));

    // availableProducts = availableProducts.filter(
    //   (ap: any) => !usedCodes.includes(String(ap.code))
    // );

    // sessionStorage.setItem('availableProducts', JSON.stringify(availableProducts));
    // this.getProductClause({ code: selectedProductCode });
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
    // Validate form
    if (this.quotationProductForm.invalid) {
      this.quotationProductForm.markAllAsTouched();
      return;
    }

    // Get dates from form
    const coverFromDate = new Date(this.quotationProductForm.get('wef')?.value);
    const coverToDate = new Date(this.quotationProductForm.get('wet')?.value);

    // Get selected product
    const selectedProduct = this.quotationProductForm.get('productCodes')?.value;
    if (!selectedProduct) return;
    const selectedProductCode = selectedProduct.code;
    log.debug('Selected product CODE', selectedProductCode);

    // Initialize productDetails array if null
    if (!this.productDetails) {
      this.productDetails = [];
    }

    // Check if product already exists
    const alreadyExists = this.productDetails.some(
      p => p.productCode.code === selectedProductCode
    );
    if (alreadyExists) {
      this.globalMessagingService.displayErrorMessage('warning', 'This product has already been added');
      return;
    }

    // Add new product with a NEW array reference (triggers table update)
    this.productDetails = [
      ...this.productDetails,
      {
        productCode: selectedProduct,
        productName: selectedProduct.description,
        coverFrom: coverFromDate,
        coverTo: coverToDate
      }
    ];

    // Ensure productName exists and dates are correct
    this.productDetails = this.productDetails.filter(p => p?.productCode?.description);
    this.productDetails.forEach(product => {
      product.coverFrom = new Date(product.coverFrom);
      product.coverTo = new Date(product.coverTo);
      if (!product.productName && product.productCode?.description) {
        product.productName = product.productCode.description;
      }
    });

    // Remove the selected product from dropdown options
    this.ProductDescriptionArray = this.ProductDescriptionArray.filter(
      (p: any) => p.code !== selectedProductCode
    );

    // Save to sessionStorage
    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
    log.debug("Saved Product Details to sessionStorage:", this.productDetails);
    sessionStorage.setItem('availableProducts', JSON.stringify(this.ProductDescriptionArray));

    // Reset form
    this.quotationProductForm.reset({
      productCodes: [],
      wef: '',
      wet: ''
    });

    this.getProductClause({ code: selectedProductCode });
    this.setColumnsFromProductDetails(this.productDetails[0]);
    this.checkProducts();

    const closeBtn = document.querySelector('.btn-close') as HTMLElement;
    closeBtn?.click();
    this.cd.detectChanges();

    this.showProducts = true;
    this.isProductClauseOpen = true
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
    this.getProductClause(product.productCode);
  }

  onProductSelected(selectedProduct: any) {
    if (!selectedProduct) return;

    const today = new Date();
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);

    this.quotationProductForm.patchValue({
      wef: today,
      wet: nextYear
    });


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


    // Restore deleted product to dropdown
    this.ProductDescriptionArray.push({
      code: this.productToDelete.productCode.code,
      description: this.productToDelete.productCode.description
    });

    // Persist the updated dropdown list again
    sessionStorage.setItem('availableProducts', JSON.stringify(this.ProductDescriptionArray));


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
    if (!this.productDetails.length) {
      this.columns = [];
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


  // onRowEditInits(product: any, index: any) {
  //   this.clonedProducts[product.productCode.code] = { ...product };
  //   this.selectedEditRowIndex = index;

  //   log.debug('Editing row:', product);
  // }

  editIndex: number | null = null;
  openEditProductModal(product: any, index: any) {
    this.editIndex = index;

    const productFormDetails = JSON.parse(sessionStorage.getItem('productFormDetails') || '[]');
    const selectedProduct = productFormDetails.find(
      (p: any) => String(p.productCode.code) === String(product.productCode.code)
    )?.productCode;

    if (selectedProduct) {
      log.debug("selectedProduct", selectedProduct)
      const exists = this.ProductDescriptionArray.some(
        (p: any) => String(p.code) === String(selectedProduct.code)
      );
      if (!exists) {
        this.ProductDescriptionArray = [...this.ProductDescriptionArray, selectedProduct];
      }
    }

    this.quotationProductForm.patchValue({
      productCodes: selectedProduct,
      wef: new Date(product.coverFrom),
      wet: new Date(product.coverTo),
    });
  }

  editProduct() {
    const formValue = this.quotationProductForm.value;

    const updatedProduct = {
      ...this.productDetails[this.editIndex],
      productCode: formValue.productCodes,
      productName: formValue.productCodes?.description,
      coverFrom: new Date(formValue.wef),
      coverTo: new Date(formValue.wet),
    };

    log.debug("updatedProducts", updatedProduct)
    this.productDetails[this.editIndex] = updatedProduct;
    sessionStorage.setItem('productFormDetails', JSON.stringify(this.productDetails));
    this.closeEditProductModal();

  }

  closeEditProductModal() {
    const modalEl = document.getElementById('editProduct');
    if (modalEl) {
      const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
      modalInstance.hide();
    }
  }


  onProductChanges(event: any, rowIndex: number, product: any) {
    const selectedProduct = this.ProductDescriptionArray.find(p => p.code === event.code);
    if (selectedProduct) {
      product.productCode = selectedProduct;
      log.debug("Updated product after dropdown change:", product);
    }
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

    this.clientToReassignProduct = this.selectedUser.name;
    if (this.selectedUser.userType == "G") {
      this.departmentSelected = true
    }
    this.closeChooseClientReassignModal();
    this.openReassignProductModal(this.productToReassign);

  }


  reassignProduct() {
    if (!this.clientToReassignProduct) {
      this.noUserChosen = true;
      setTimeout(() => {
        this.noUserChosen = false

      }, 3000);
      return;
    }
    if (!this.reassignProductComment) {
      this.noCommentleft = true;
      setTimeout(() => {
        this.noCommentleft = false

      }, 3000);
      return;
    }

    this.closeReassignProductModal();
    this.clientToReassignProduct = null;
    this.productToReassign = null;
    this.globalMessagingService.displaySuccessMessage('Success', 'Product reassigned successfully');

  }

  openChooseClientReassignModal() {
    this.openModals('chooseClientReassign');
    this.closeReassignProductModal();
    this.getUsers();
  }

  closeChooseClientReassignModal() {
    this.closeModals('chooseClientReassign');
  }

  openReassignProductModal(product: any) {
    this.selectedProduct = this.productToReassign;
    this.openModals('reassignProduct');
  }

  closeReassignProductModal() {
    this.closeModals('reassignProduct');
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
        sessionStorage.setItem('quotationCode', this.quotationCode.toString());
        sessionStorage.setItem('quotationPayload', JSON.stringify(quotationPayload));
        sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
        this.router.navigate(['/home/gis/quotation/risk-center']);
      },
      (error: HttpErrorResponse) => {
        log.info(error);
        this.spinner.hide();
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    );

  }
  filterByName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectIntroducerTable.filter(input.value, 'surName', 'contains');
  }
  filterByStaffNo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectIntroducerTable.filter(input.value, 'staffNo', 'contains');
  }
  filterByCompany(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectIntroducerTable.filter(input.value, 'groupCompany', 'contains');
  }

  saveIntroducer(introducer: Introducer) {
    log.debug("Selected Introducer", introducer);
    this.quotationForm.controls['introducer'].setValue(introducer.code);
    this.selectedIntroducerName = introducer?.surName
    this.showIntroducerSearchModal = false
  }

  filterByAgentName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAgentTable.filter(input.value, 'name', 'contains');
  }
  filterById(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAgentTable.filter(input.value, 'id', 'contains');
  }
  filterByIntermediaryType(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectAgentTable.filter(input.value, 'accountType', 'contains');
  }

  saveAgent(agent: any) {
    log.debug("Selected Agent", agent);
    this.quotationForm.controls['agent'].setValue(agent);
    this.selectedAgent = agent
    this.selectedAgentName = agent.name
    this.showAgentSearchModal = false
  }

  filterByMarketerName(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectMarketerTable.filter(input.value, 'name', 'contains');
  }

  filterByMarketerId(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectMarketerTable.filter(input.value, 'id', 'contains');
  }

  saveMarketer(marketer: any) {
    log.debug("Selected Marketer", marketer);
    this.quotationForm.controls['marketer'].setValue(marketer);
    this.selectedMarketer = marketer
    this.selectedMarketerName = marketer.name
    this.showMarketerSearchModal = false
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


  setColumnsFromProductDetails(sample: ProductDetails) {
    const defaultVisibleFields = [
      'coverFrom',
      'coverTo',
      'productName'

    ];
    const excludedFields = [];

    this.columns = Object.keys(sample)
      .filter((key) => !excludedFields.includes(key))
      .map((key) => ({
        field: key,
        header: this.sentenceCase(key),
        visible: defaultVisibleFields.includes(key),
      }));

    // manually add actions column
    this.columns.push({ field: 'actions', header: 'Actions', visible: true, });
  }



  sentenceCase(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
  getCellValue(row: any, field: string): any {
    const value = row[field];

    // Explicitly handle productCode field
    if (field === 'productCode' && value) {
      return value.code ?? ''; // Access code from the value itself
    }

    // Handle dates automatically
    if (value instanceof Date) {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(value);
    }

    // Handle other objects dynamically (but prioritize code if available)
    if (value && typeof value === 'object') {
      return value.code ?? JSON.stringify(value);
    }

    return value ?? '';
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

}
