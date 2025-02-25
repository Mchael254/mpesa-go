import { Component, ViewChild } from '@angular/core';
import quoteStepsData from '../../data/normal-quote-steps.json';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuotationsService } from '../../services/quotations/quotations.service';
// import { Modal } from 'bootstrap';
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

import { AccountContact } from "../../../../../../shared/data/account-contact";
import { ClientAccountContact } from 'src/app/shared/data/client-account-contact';
import { WebAdmin } from 'src/app/shared/data/web-admin';
import { GlobalMessagingService } from "../../../../../../shared/services/messaging/global-messaging.service";
import { mergeMap } from 'rxjs';
import { UserDetail } from '../../data/quotationsDTO';
const log = new Logger('QuotationDetails');
@Component({
  selector: 'app-quotation-details',
  templateUrl: './quotation-details.component.html',
  styleUrls: ['./quotation-details.component.css']
})
export class QuotationDetailsComponent {
  @ViewChild(Table) private dataTable: Table;
  steps = quoteStepsData;
  branch: OrganizationBranchDto[];
  currency: CurrencyDTO[]
  clauses: any;
  products: any;
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
  showProduct: boolean = false;
  quotationNum: string;
  introducers: any;
  productSubclassList: any
  productDetails: any
  userDetails: any;
  selected: any;
  quotationSources: any
  midnightexpiry: any
  modalHeight: number = 200;
  quickQuotationDetails: any
  quickQuotationCode: any;
  quickQuotationNum: any
  selectedClause!: any;
  selectedAgent!: any
  productCode: any;
  @ViewChild('openModal') openModal;
  @ViewChild('dt1') dt1: Table | undefined;
  quotationType: any;
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
  editConvertedQuote: string;



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

  ) { }

  ngOnInit(): void {
    this.fetchCampaigns()
    this.getbranch();
    this.getCurrency();
    this.getProduct();
    this.getuser();
    // this.formData = this.sharedService.getFormData();
    this.createQuotationForm();
    this.getAgents()

    this.getIntroducers();
    this.getQuotationSources()
    this.quickQuoteDetails()


    const quotationFormDetails = sessionStorage.getItem('quotationFormDetails');
    const clientFormDetails = sessionStorage.getItem('clientPayload');
    log.debug("Client form details:", clientFormDetails)
    const clientCode = sessionStorage.getItem('clientCode');
    this.clientId = JSON.parse(clientCode)
    log.debug("Client Id:", this.clientId)

    log.debug(quotationFormDetails)

    this.editConvertedQuote = JSON.parse(sessionStorage.getItem("editFlag"));

    if(this.editConvertedQuote) {
      this.patchQuickQuoteData()
    };

    if (quotationFormDetails) {
      const parsedData = JSON.parse(quotationFormDetails);
      this.quotationForm.patchValue(parsedData);

      log.debug(parsedData)
    }
    if (clientFormDetails) {
      const clientData = JSON.parse(clientFormDetails)
      log.debug("Client form details:", clientData)

      this.quotationForm.controls['clientCode'].setValue(this.clientId);
      this.quotationForm.controls['branchCode'].setValue(clientData.branchCode);
      this.quotationForm.controls['clientType'].setValue(clientData.category);
    }

    log.debug(this.quotationForm.value)

  }
  ngOnDestroy(): void { }

  quickQuoteDetails() {
    this.quickQuotationNum = sessionStorage.getItem('quickQuotationNum');
    this.quickQuotationCode = sessionStorage.getItem('quickQuotationCode');
    if (this.quickQuotationCode) {
      sessionStorage.setItem('quotationNum', this.quickQuotationNum);
      sessionStorage.setItem('quotationCode', this.quickQuotationCode);
      this.quotationService.getQuotationDetails(this.quickQuotationNum).subscribe(res => {
        this.quickQuotationDetails = res
        log.debug("QUICK QUOTE DETAILS", this.quickQuotationDetails)
        this.quotationForm.controls['expiryDate'].setValue(this.quickQuotationDetails.expiryDate);
        this.quotationForm.controls['wefDate'].setValue(this.quickQuotationDetails.coverFrom);
        this.quotationForm.controls['wetDate'].setValue(this.quickQuotationDetails.coverTo);
        // this.quotationForm.controls['source'].setValue(this.quickQuotationDetails.source.code);
        log.debug(this.quickQuotationDetails.source)
        const productCode = this.quickQuotationDetails.quotationProducts[0].proCode
        this.productService.getProductByCode(productCode).subscribe(res => {
          this.quotationForm.controls['productCode'].setValue(res);
        })

        log.debug("Test currency", this.currency)
        this.currency.forEach(el => {

          if (el.symbol === this.quickQuotationDetails.currency) {
            log.debug("Test currency", el)
            this.quotationForm.controls['currencyCode'].setValue(el);
          }
        })
      })
    }
  }

  /**
 * Retrieves branch data from the branch service and assigns it to the 'branch' property.
 */
  getbranch() {
    this.branchService.getBranches(2).subscribe(data => {
      this.branch = data
    })
  }

  /**
   * Retrieves currency data from the bank service and assigns it to the 'currency' property.
   */
  getCurrency() {
    this.bankService.getCurrencies().subscribe(data => {
      // this.currency = data
      this.currency = data.map((value) => {
        let capitalizedDescription =
          value.name.charAt(0).toUpperCase() +
          value.name.slice(1).toLowerCase();
        return {
          ...value,
          name: capitalizedDescription,
        };
      });
      log.info(this.currency, 'this is a currency list');
      const defaultCurrency = this.currency.find(
        (currency) => currency.currencyDefault == 'Y'
      );
      if (defaultCurrency) {
        log.debug('DEFAULT CURRENCY', defaultCurrency);
        this.defaultCurrency = defaultCurrency
        this.defaultCurrencyName = defaultCurrency.name;
        log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
        this.defaultCurrencySymbol = defaultCurrency.symbol;
        log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
      }
    })
  }
  /**
 * Sets the 'currencyCode' control value in the quotation form based on the selected currency code.
 * Logs the current value of the quotation form.
 */
  // getCurrencyCode(){
  //   log.debug(this.quotationForm.value.currencyCode)
  //   this.quotationForm.controls['currencyCode'].setValue(this.quotationForm.value.currencyCode.id);
  // log.debug(this.quotationForm.value)
  // }
  capitalizeWord(value: String): string {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
  /**
   * Retrieves all products from the product service, processes the data, and assigns it to the 'products' property.
   */

  getProduct() {
    const productDescription = [];

    this.producSetupService.getAllProducts().subscribe(res => {
      const ProdList = res
      this.products = ProdList
      this.products.forEach((product) => {
        productDescription.push({
          code: product.code,
          description: this.capitalizeWord(product.description),
        });
      });
      this.ProductDescriptionArray.push(...productDescription);
      // Now 'combinedWords' contains the result with words instead of individual characters
      log.info('modified product description', this.ProductDescriptionArray);
    })

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
    if (this.userCode) {
      // this.fetchUserOrgId()
    }
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
  }
  getQuotationSources() {
    this.quotationService.getAllQuotationSources().subscribe(res => {
      const sources = res
      this.quotationSources = sources.content
      log.debug("SOURCES", this.quotationSources)
    })
  }
  /**
    * Creates a new quotation form using Angular Reactive Forms.
    * @method createQuotationForm
    * @return {void}
    */
  createQuotationForm() {
    this.quotationForm = this.fb.group({
      quotationCode: [''],
      quotationNo: [null],
      user: ['', Validators.required],
      action: [''],
      wefDate: ['', Validators.required],
      wetDate: ['', Validators.required],
      branchCode: [Validators.required],
      currencyCode: [Validators.required],
      agentCode: [null, Validators.required],
      agentShortDescription: [''],
      clientType: [''],
      source: [null, Validators.required],
      productCode: [null, Validators.required],
      bindCode: [null],
      binderPolicy: [null],
      currencyRate: [null],
      introducerCode: [null],
      internalComments: [null],
      clientCode: [null],
      polPropHoldingCoPrpCode: [null],
      chequeRequisition: [null],
      divisionCode: [null],
      subAgentCode: [null],
      prospectCode: [null],
      marketerAgentCode: [null],
      comments: [null],
      gisPolicyNumber: [null],
      polPipPfCode: [null],
      endorsementStatus: [null],
      polEnforceSfParam: [null],
      creditDateNotified: [null],
      multiUser: [null],
      unitCode: [null],
      locationCode: [null],
      RFQDate: [''],
      expiryDate: ['']
    });
  }


  /**
 * Saves quotation details, sets form details, and navigates based on user preferences.
 * @method saveQuotationDetails
 * @return {void}
 */
  saveQuotationDetails() {
    this.spinner.show()

    this.sharedService.setQuotationFormDetails(this.quotationForm.value);
    sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));

    if (this.quotationForm.value.multiUser == 'Y') {
      /**
   * Creates a new quotation with multi-user and navigates to quote assigning.
   * @param {Object} this.quotationForm.value - The form value representing quotation details.
   * @param {string} this.user - The user associated with the quotation.
   * @return {Observable<any>} - An observable of the response containing created quotation data.
   */
      if (this.quickQuotationDetails) {
        log.debug("Quick Quotation results")
        this.router.navigate(['/home/gis/quotation/quote-assigning'])
        this.spinner.hide()

      } else {
        const fromDate = this.quotationForm.value.wefDate
        const toDate = this.quotationForm.value.wetDate
        // const rfqDate = this.quotationForm.value.RFQDate
        const rawCoverTo = new Date(toDate)

        const coverFromDate = fromDate;
        const formattedCoverFromDate = this.formatDate(coverFromDate);
        log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

        const covertToDate = rawCoverTo;
        const formattedCoverToDate = this.formatDate(covertToDate);
        log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

        // const covertRfqDate = rfqDate;
        // const formattedRfqDate = this.formatDate(covertRfqDate);
        // log.debug('FORMATTED RFQ DATE:', formattedRfqDate);

        const quotationForm = this.quotationForm.value;
        // quotationForm.RFQDate = formattedRfqDate
        quotationForm.wefDate = formattedCoverFromDate
        quotationForm.wetDate = formattedCoverToDate
        quotationForm.user = this.user;

        log.debug("CREATE QUOTATION -Multi user entry is Yes")
        this.quotationService.processQuotation(quotationForm).subscribe(data => {
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
        /**
       * Creates a new quotation with import risks and navigates to import risks page.
       * @param {Object} this.quotationForm.value - The form value representing quotation details.
       * @param {string} this.user - The user associated with the quotation.
       * @return {Observable<any>} - An observable of the response containing created quotation data.
       */
        if (this.quickQuotationDetails) {
          this.router.navigate(['/home/gis/quotation/import-risks'])
          this.spinner.hide()
          sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
        } else {
          const fromDate = this.quotationForm.value.wefDate
          const toDate = this.quotationForm.value.wetDate
          // const rfqDate = this.quotationForm.value.RFQDate
          const rawCoverTo = new Date(toDate)

          const coverFromDate = fromDate;
          const formattedCoverFromDate = this.formatDate(coverFromDate);
          log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

          const covertToDate = rawCoverTo;
          const formattedCoverToDate = this.formatDate(covertToDate);
          log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

          // const covertRfqDate = rfqDate;
          // const formattedRfqDate = this.formatDate(covertRfqDate);
          // log.debug('FORMATTED RFQ DATE:', formattedRfqDate);

          const quotationForm = this.quotationForm.value;
          // quotationForm.RFQDate = formattedRfqDate
          quotationForm.wefDate = formattedCoverFromDate
          quotationForm.wetDate = formattedCoverToDate
          quotationForm.user = this.user;

          log.debug("CREATE QUOTATION")
          this.quotationService.processQuotation(this.quotationForm.value).subscribe(data => {
            this.quotationNo = data
            this.spinner.hide()
            log.debug(this.quotationForm.value)
            sessionStorage.setItem('quotationNum', this.quotationNum);
            sessionStorage.setItem('quotationCode', this.quotationCode);
            sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
            this.router.navigate(['/home/gis/quotation/import-risks'])
          }, (error: HttpErrorResponse) => {
            log.info(error);
            this.spinner.hide()
            this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

          })
        }


      } else {
        /**
        * Creates a new quotation and navigates to risk section details based on user preferences.
        * @param {Object} this.quotationForm.value - The form value representing quotation details.
        * @param {string} this.user - The user associated with the quotation.
        * @return {Observable<any>} - An observable of the response containing created quotation data.
        */

        if (this.quickQuotationDetails) {
          this.router.navigate(['/home/gis/quotation/risk-section-details']);
          this.spinner.hide()

        } else {
          const fromDate = this.quotationForm.value.wefDate
          const toDate = this.quotationForm.value.wetDate
          // const rfqDate = this.quotationForm.value.RFQDate
          const rawCoverTo = new Date(toDate)

          const coverFromDate = fromDate;
          const formattedCoverFromDate = this.formatDate(coverFromDate);
          log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

          const covertToDate = rawCoverTo;
          const formattedCoverToDate = this.formatDate(covertToDate);
          log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

          // const covertRfqDate = rfqDate;
          // const formattedRfqDate = this.formatDate(covertRfqDate);
          // log.debug('FORMATTED RFQ DATE:', formattedRfqDate);

          const quotationForm = this.quotationForm.value;
          // quotationForm.RFQDate = formattedRfqDate
          quotationForm.wefDate = formattedCoverFromDate
          quotationForm.wetDate = formattedCoverToDate
          quotationForm.user = this.user;
          log.debug("Currency code-quote creation",this.quotationForm.value.currencyCode.id)
          quotationForm.currencyCode = this.quotationForm.value.currencyCode.id || this.defaultCurrency.id;
          quotationForm.currencyRate = this.exchangeRate;

          log.debug("CREATE QUOTATION")
          this.quotationService.processQuotation(this.quotationForm.value).subscribe(data => {
            this.quotationNo = data;
            this.spinner.hide()
            log.debug(this.quotationNo, 'quotation number output');
            this.quotationCode = this.quotationNo._embedded.quotationCode;
            this.quotationNum = this.quotationNo._embedded.quotationNumber
            sessionStorage.setItem('quotationNum', this.quotationNum);
            sessionStorage.setItem('quotationCode', this.quotationCode);
            sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
            this.selectedProductClauses(this.quotationCode)
            this.sharedService.setQuotationDetails(this.quotationNum, this.quotationCode);

            this.router.navigate(['/home/gis/quotation/risk-section-details']);
          }, (error: HttpErrorResponse) => {
            log.info(error);
            this.spinner.hide()
            this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

          })
        }


      }
    }
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
    this.quotationService.getAgents().subscribe(data => {
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
    this.agentService.getAgentById(data).subscribe({
      next: (res) => {
        this.agentDetails = res

        this.quotationForm.controls['agentShortDescription'].setValue(this.agentDetails.shortDesc);
        this.quotationForm.controls['agentCode'].setValue(this.agentDetails.name);

      }
    })
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


    // Set currency code in the form
    if (this.quotationType === "D") {
      this.quotationForm.controls['agentCode'].setValue(0);
      this.quotationForm.controls['agentShortDescription'].setValue("DIRECT")

    } else if (this.quotationType === "I") {
      this.quotationForm.controls['agentCode'].setValue(this.agentDetails.id);
    }
    // this.quotationForm.controls['currencyCode'].setValue(this.quotationForm.value.currencyCode.id);
    this.quotationForm.controls['productCode'].setValue(this.quotationForm.value.productCode.code);
    this.quotationForm.controls['branchCode'].setValue(this.quotationForm.value.branchCode.id);
    // this.quotationForm.controls['agentCode'].setValue(this.agentDetails.id);
    sessionStorage.setItem('coverFrom', JSON.stringify(formattedCoverFromDate));
    sessionStorage.setItem('coverTo', JSON.stringify(formattedCoverToDate));
    this.quotationService.getQuotations(clientId, formattedCoverFromDate, formattedCoverToDate).subscribe(data => {
      this.quotationsList = data
      this.clientExistingQuotations = this.quotationsList.content

      if (this.clientExistingQuotations.length > 0) {
        this.openModal.nativeElement.click();

        // const element = document.getElementById('exampleModal') as HTMLElement;
        // const myModal = new Modal(element);
        // myModal.show();
      } else {

        this.saveQuotationDetails()
      }

    })


  }
  /**
 * Retrieves introducers and populates the 'introducers' property.
 * @method getIntroducers
 * @return {void}
 */
  getIntroducers() {
    this.quotationService.getIntroducers().subscribe(res => {
      this.introducers = res
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
    log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);
    // this.producSetupService.getProductByCode(this.quotationForm.value.productCode).subscribe(res=>{
    //   this.productDetails = res
    //   log.debug(this.productDetails)
    // if(this.productDetails.expires === 'Y'){
    this.producSetupService.getCoverToDate(formattedCoverFromDate, this.quotationForm.value.productCode.code)
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
          this.quotationForm.controls['wetDate'].setValue(this.coverToDate)
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        },

      })

    // }else {
    //   const selectedDate = new Date(coverFromDate);
    //   selectedDate.setFullYear(selectedDate.getFullYear() + 1);
    //   const coverToDate = selectedDate.toISOString().split('T')[0];
    //   this.quotationForm.controls['withEffectiveToDate'].setValue(coverToDate);


    // }
    // })

  }

  /**
   * Updates the quotation expiry date in the form based on the selected RFQ date.
   * @method updateQuotationExpiryDate
   * @param {Event} e - The event containing the target value representing the RFQ date.
   * @return {void}
   */
  updateQuotationExpiryDate(date) {
    const RFQDate = date;
    if (RFQDate) {
      const selectedDate = new Date(RFQDate);
      selectedDate.setMonth(selectedDate.getMonth() + 3);
      const expiryDate = selectedDate.toISOString().split('T')[0];
      this.quotationForm.controls['expiryDate'].setValue(expiryDate);
      log.debug("Quotation Expiry date", expiryDate)
      // Extract the day, month, and year
      const expiryDateRaw = new Date(expiryDate)
      const day = expiryDateRaw.getDate();
      const month = expiryDateRaw.toLocaleString('default', { month: 'long' }); // 'long' gives the full month name
      const year = expiryDateRaw.getFullYear();

      // Format the date in 'dd-Month-yyyy' format
      const formattedDate = `${day}-${month}-${year}`;

      this.expiryDate = formattedDate
      log.debug("expiry date formatted", this.expiryDate)
    }
  }
  /**
   * Retrieves product clauses based on the provided product code.
   * @method getProductClause
   * @param {Event} productCode - The event containing the target value representing the product code.
   * @return {void}
   */
  getProductClause() {
    this.productCode = this.quotationForm.value.productCode.code
    this.quotationService.getProductClauses(this.quotationForm.value.productCode.code).subscribe(res => {
      this.clauses = res
    })
  }
  selectedProductClauses(quotationCode) {

    if (this.selectedClause) {
      this.selectedClause.forEach(el => {
        this.quotationService.addProductClause(el.code, this.productCode, quotationCode).subscribe(res => {
          log.debug(res)
        })
        log.debug(el.code)
      })
    }

    // this.clauseService.getSingleClause(code).subscribe(
    //   {
    //     next:(res)=>{
    //       log.debug(res)
    //     }
    //   }
    // )
  }
  unselectClause(event) {
    log.debug(this.selectedClause)
  }
  onQuotationTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)
    this.quotationType = value;
    log.debug("Quotation  Type", this.quotationType)
    this.showIntermediaryField = value === 'I';


    if (!this.showIntermediaryField) {
      this.quotationForm.get('agentCode').reset();

    }

    // if (!this.showFacultativeFields) {
    //   this.policyProductForm.get('agentCode').reset();

    // }
  }
  onResultCampaignTypeChange(value: string): void {
    log.info('SELECTED VALUE:', value)
    this.resultFromCampaign = value;
    log.debug("Result from campaign  ", this.resultFromCampaign)
    this.showCampaignField = value === 'C';


    if (!this.showCampaignField) {
      this.quotationForm.get('agentCode').reset();

    }

    // if (!this.showFacultativeFields) {
    //   this.policyProductForm.get('agentCode').reset();

    // }
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

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  campaign details.Try again later');
        }
      })
  }

  toggleProduct() {
    this.showProduct = !this.showProduct;
  }

  toggleDetails() {
    this.show = !this.show;
  }

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(
        mergeMap((organization) => {
          this.userOrgDetails= organization
          log.debug("User Organization Details  ", this.userOrgDetails);
          this.organizationId = this.userOrgDetails.organizationId
          const currencyCode = this.quotationForm.value.currencyCode.id
          log.debug("Cuurency code",currencyCode)
          return this.quotationService.getExchangeRates(currencyCode, organization.organizationId)
        }),
        untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response
          log.debug("EXCHANGE RATE",this.exchangeRate)
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  patchQuickQuoteData() {
    const storedData = JSON.parse(sessionStorage.getItem('quickQuoteData'));

    this.quotationForm.patchValue({
      wefDate: this.formatDate(storedData.effectiveDateFrom), // effectiveDateFrom
      carRegNo: storedData.carRegNo, // carRegNo
      yearOfManufacture: storedData.yearOfManufacture, // yearOfManufacture
      clientName: storedData.clientName, // clientName
      clientEmail: storedData.clientEmail, // clientEmail
      productCode: storedData.product?.code, // product.code
      productDescription: storedData.product?.description, // product.description
      subclassCode: storedData.subClass?.code, // subClass.code
      subclassDescription: storedData.subClass?.description, // subClass.description
      currencyCode: storedData.currency?.id, // currency.id
      currencySymbol: storedData.currency?.symbol, // currency.symbol
      currencyName: storedData.currency?.name, // currency.name
      currencyRoundingOff: storedData.currency?.roundingOff, // currency.roundingOff
      selfDeclaredValue: storedData.selfDeclaredValue, // selfDeclaredValue
      clientPhoneNumber: storedData.clientPhoneNumber, // clientPhoneNumber
      existingClientSelected: storedData.existingClientSelected, // existingClientSelected
      bindCode: storedData.selectedBinderCode, // selectedBinderCode
      computationPayloadCode: storedData.computationPayloadCode // computationPayloadCode
    });

  }

}
