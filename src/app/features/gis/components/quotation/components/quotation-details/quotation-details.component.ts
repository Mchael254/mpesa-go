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
import { forkJoin, mergeMap } from 'rxjs';
import { QuotationSource, UserDetail } from '../../data/quotationsDTO';
import { Products } from '../../../setups/data/gisDTO';
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
  showProduct: boolean = false;
  quotationNum: string;
  introducers: introducersDTO[] = [];
  productSubclassList: any
  productDetails: any
  userDetails: any;
  selected: any;
  quotationSources: QuotationSource[] = [];
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
  quotationFormDetails: any = null
  motorClassAllowed: string;
  currencyDelimiter: any;


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
  }

  ngOnInit(): void {
    this.minDate = new Date();
    this.fetchQuotationRelatedData()

    this.getuser();
    // this.formData = this.sharedService.getFormData();
    this.createQuotationForm();
    // this.quickQuoteDetails()

    log.debug(this.quotationForm.value)

  }
  ngOnDestroy(): void { }

  quickQuoteDetails() {
    this.quickQuotationCode = sessionStorage.getItem('quickQuotationCode');
    if (this.quickQuotationCode) {
      sessionStorage.setItem('quotationNum', this.quickQuotationNum);
      sessionStorage.setItem('quotationCode', this.quickQuotationCode);
      this.quotationService.getQuotationDetails(this.quickQuotationNum).subscribe(res => {
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
          branchCode: this.quickQuotationDetails.branchCode,
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
        const productCode = this.quickQuotationDetails.quotationProducts[0].proCode;
        this.productService.getProductDetailsByCode(productCode).subscribe(res => {
          log.debug("response product", res);

          // Find the matching product object in ProductDescriptionArray
          const selectedProduct = this.ProductDescriptionArray.find((product: { code: number; }) => product.code === res?.code);

          // Set the entire product object as the form control value
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
            this.quotationForm.controls['branchCode'].setValue(el);
          }
        });

        // Set source if needed
        if (this.quickQuotationDetails.source) {
          this.quotationForm.controls['source'].setValue(this.quickQuotationDetails.source.code);
        }

        // Debugging
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
    this.updateQuotationExpiryDate(this.todaysDate)

    this.currencyDelimiter = this.userDetails?.currencyDelimiter;
    log.debug('Organization currency delimeter', this.currencyDelimiter);
    sessionStorage.setItem('currencyDelimiter', this.currencyDelimiter);
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
      wefDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.wefDate) : this.todaysDate, Validators.required],
      wetDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.wetDate) : this.coverToDate, Validators.required],
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
      RFQDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.RFQDate) : this.todaysDate],
      expiryDate: [this.quotationFormDetails ?
        new Date(this.quotationFormDetails?.expiryDate) : this.expiryDate],
      quotationType: [null]

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
    const quotationFormJson = this.quotationForm.value
    log.debug("Quotation form details", quotationFormJson)
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
          this.router.navigate(['/home/gis/quotation/import-risks']);
          this.spinner.hide();
          sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));
        } else {
          const fromDate = this.quotationForm.value.wefDate;
          const toDate = this.quotationForm.value.wetDate;
          const rfqDate = this.quotationForm.value.RFQDate; // Added RFQDate
          const expiryDate = this.quotationForm.value.expiryDate; // Added expiryDate
          const rawCoverTo = new Date(toDate);

          const coverFromDate = fromDate;
          const formattedCoverFromDate = this.formatDate(coverFromDate);
          log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

          const covertToDate = rawCoverTo;
          const formattedCoverToDate = this.formatDate(covertToDate);
          log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

          const covertRfqDate = rfqDate;
          const formattedRfqDate = this.formatDate(covertRfqDate); // Added RFQ date formatting
          log.debug('FORMATTED RFQ DATE:', formattedRfqDate);

          const covertExpiryDate = expiryDate;
          const formattedExpiryDate = this.formatDate(covertExpiryDate); // Added expiry date formatting
          log.debug('FORMATTED EXPIRY DATE:', formattedExpiryDate);

          const quotationForm = this.quotationForm.value;
          quotationForm.wefDate = formattedCoverFromDate;
          quotationForm.wetDate = formattedCoverToDate;
          quotationForm.RFQDate = formattedRfqDate; // Added RFQDate
          quotationForm.expiryDate = formattedExpiryDate; // Added expiryDate
          quotationForm.user = this.user;

          // Added missing fields
          log.debug("Currency code-quote creation", this.quotationForm.value.currencyCode.id);
          quotationForm.currencyCode = this.quotationForm.value.currencyCode.id || this.defaultCurrency.id;
          quotationForm.source = this.quotationForm.value.source.code;
          quotationForm.currencyRate = this.exchangeRate;
          quotationForm.clientCode = this.clientId;
          quotationForm.clientType = "I";

          log.debug("CREATE QUOTATION");
          this.quotationService.processQuotation(quotationForm).subscribe(
            (data) => {
              this.quotationNo = data;
              this.spinner.hide();
              log.debug(this.quotationForm.value);
              log.debug(this.quotationNo, 'quotation number output');
              this.quotationCode = this.quotationNo._embedded.quotationCode;
              this.quotationNum = this.quotationNo._embedded.quotationNumber
              sessionStorage.setItem('quotationNum', this.quotationNum);
              sessionStorage.setItem('quotationCode', this.quotationCode);
              sessionStorage.setItem('quotationFormDetails', JSON.stringify(quotationForm));
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
          const rfqDate = this.quotationForm.value.RFQDate
          const expiryDate = this.quotationForm.value.expiryDate
          const rawCoverTo = new Date(toDate)

          const coverFromDate = fromDate;
          const formattedCoverFromDate = this.formatDate(coverFromDate);
          log.debug('FORMATTED cover from DATE:', formattedCoverFromDate);

          const covertToDate = rawCoverTo;
          const formattedCoverToDate = this.formatDate(covertToDate);
          log.debug('FORMATTED cover to DATE:', formattedCoverToDate);

          const covertRfqDate = rfqDate;
          const formattedRfqDate = this.formatDate(covertRfqDate);
          log.debug('FORMATTED RFQ DATE:', formattedRfqDate);

          const covertExpiryDate = expiryDate;
          const formattedExpiryDate = this.formatDate(covertExpiryDate);
          log.debug('FORMATTED EXPIRY DATE:', formattedExpiryDate);

          const quotationForm = this.quotationForm.value;
          // quotationForm.RFQDate = formattedRfqDate
          quotationForm.wefDate = formattedCoverFromDate
          quotationForm.wetDate = formattedCoverToDate
          quotationForm.RFQDate = formattedRfqDate
          quotationForm.expiryDate = formattedExpiryDate
          quotationForm.user = this.user;
          log.debug("Currency code-quote creation", this.quotationForm.value.currencyCode.id)
          quotationForm.currencyCode = this.quotationForm.value.currencyCode.id || this.defaultCurrency.id;
          quotationForm.source = this.quotationForm.value.source.code;

          quotationForm.currencyRate = this.exchangeRate;
          quotationForm.clientCode = this.clientId
          quotationForm.clientType = "I"

          sessionStorage.setItem('quotationFormDetails', JSON.stringify(this.quotationForm.value));

          const quotationFormJson = this.quotationForm.value
          log.debug("Quotation form details", quotationFormJson)
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
    this.quotationService.getQuotations(this.clientId, formattedCoverFromDate, formattedCoverToDate).subscribe(data => {
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
          sessionStorage.setItem("selectedCoverToDate", this.formatDate(this.coverToDate))
          this.quotationForm.controls['wetDate'].setValue(this.coverToDate)
        },
        error: (error: HttpErrorResponse) => {
          log.debug("Error log", error.error.message);

          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error?.message
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
      // this.quotationForm.controls['expiryDate'].setValue(expiryDate);
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
  checkMotorClass() {
    const productCode = this.quotationForm.value.productCode.code
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
    this.productCode = this.quotationForm.value.productCode.code
    sessionStorage.setItem("selectedProductCode", this.productCode);
    this.quotationService.getProductClauses(this.quotationForm.value.productCode.code).subscribe(res => {
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
    this.getAgents()

    // if (!this.showFacultativeFields) {
    //   this.policyProductForm.get('agentCode').reset();

    // }
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

          // this.globalMessagingService.displayErrorMessage('Error', 'Failed to retrieve  campaign details.Try again later');
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
          this.userOrgDetails = organization
          log.debug("User Organization Details  ", this.userOrgDetails);
          this.organizationId = this.userOrgDetails.organizationId
          const currencyCode = this.quotationForm.value.currencyCode.id
          log.debug("Cuurency code", currencyCode)
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
        log.debug('DEFAULT CURRENCY Name', this.defaultCurrencyName);
        log.debug('DEFAULT CURRENCY Symbol', this.defaultCurrencySymbol);
        sessionStorage.setItem('currencySymbol', this.defaultCurrencySymbol);

        this.fetchUserOrgId()
      }
      if (this.quotationFormDetails) {
        const selectedBranch = this.currency.find(currency => currency.id === this.quotationFormDetails?.currencyCode);
        if (selectedBranch) {
          this.quotationForm.patchValue({ currencyCode: selectedBranch });
        }
      }else{
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

      if (this.quotationFormDetails) {
        const selectedBranch = this.branch.find(branch => branch.id === this.quotationFormDetails?.branchCode);
        if (selectedBranch) {
          this.quotationForm.patchValue({ branchCode: selectedBranch });
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

      if (this.quotationFormDetails) {
        const selectedProduct = this.ProductDescriptionArray.find(product => product.code === this.quotationFormDetails?.productCode);
        if (selectedProduct) {
          this.quotationForm.patchValue({ productCode: selectedProduct });
        }
      }

      log.info("Quotation form >>>", this.quotationForm);
      log.info('Modified product description', this.ProductDescriptionArray);

      this.quickQuotationNum = sessionStorage.getItem('quickQuotationNum');
      if (this.quickQuotationNum) {
        this.quickQuoteDetails();
      }
    });
  }

  onSourceChange(event) {
    const selectedSource = event.value;
    if (selectedSource && selectedSource.description === 'Walk in') {
      this.quotationForm.get('quotationType').setValue('D'); // Set to Direct
    }

    // Manually trigger the onQuotationTypeChange method
    this.onQuotationTypeChange('D');
  }

}
