import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import stepData from '../../data/steps.json';
import {Logger, untilDestroyed, UtilService} from '../../../../../../shared/shared.module';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../shared/services/auth.service';

import {ProductsService} from '../../../setups/services/products/products.service';
import {SubclassesService} from '../../../setups/services/subclasses/subclasses.service';
import {QuotationsService} from '../../services/quotations/quotations.service';
import {ClientDTO} from '../../../../../entities/data/ClientDTO';
import {Router} from '@angular/router';
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service'
import {Clause, Excesses, LimitsOfLiability, StatusEnum, QuickQuoteData} from '../../data/quotationsDTO';

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent implements OnInit, OnDestroy {
  selectedOption: string = 'email';
  clientName: string = '';
  steps = stepData;
  coverQuotationNo: any;
  quotationDetails: any;
  quotationNo: any;
  quotationCode: number;
  quoteDate: any;

  taxInformation: any;

  insuredCode: any;
  agentDesc: any;
  coverFrom: any;
  coverTo: any;
  expiryDate: any;

  clientDetails: ClientDTO;
  selectedClientName: any;

  isAddRisk: boolean = false;
  fieldDisableState: boolean = false;
  passedPremium: any;
  selectedEmail: any;
  selectedPhoneNo: any;
  selectedClient: ClientDTO = undefined;
  emailForm: FormGroup;
  smsForm: FormGroup;
  passedClientCode: any;
  user: any;
  userDetails: any
  userBranchId: any;
  selectedRisk: any;
  selectedProduct: any;
  clauseList: Clause[] = []
  selectedClause: any;
  modalHeight: number = 200; // Initial height
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  totalTaxes: number = 0;
  premiumAmount: number = 0;
  taxList: { description: string; amount: number; rate: number; rateType: string, productCode?: number }[] = [];
  selectedSubclassCode: any;
  excessesList: Excesses[] = []
  isEditRisk: boolean = false;
  reasonCancelled: string = '';
  cancelQuoteClicked: boolean = false;
  showQuoteActions: boolean = true;
  batchNo: number;
  quickQuoteData: QuickQuoteData;
  quoteAction: string = null
  showConverToPolicyButton: boolean = false;

  activeRiskInformation: any[] = []
  riskDetails: any;


  constructor(
    public fb: FormBuilder,
    public productService: ProductsService,
    public quotationService: QuotationsService,
    public subclassService: SubclassesService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    public globalMessagingService: GlobalMessagingService,
    public utilService: UtilService
  ) {
    this.coverQuotationNo = sessionStorage.getItem('quotationNumber');
    this.passedPremium = JSON.parse(sessionStorage.getItem('riskLevelPremium'));
    this.quickQuoteData = JSON.parse(sessionStorage.getItem('quickQuoteData'));
    this.selectedClient = this.quickQuoteData.selectedClient;
    this.selectedSubclassCode = this.quickQuoteData.subClass.code;
    if (this.selectedClient && this.quickQuoteData.selectedClient) {
      this.selectedClientName = this.selectedClient.firstName + ' ' + this.selectedClient.lastName
    } else {
      this.selectedClientName = this.quickQuoteData.clientName
    }
  }

  ngOnInit(): void {
    if (this.coverQuotationNo) {
      this.loadClientQuotation();
    }
    this.showConverToPolicyButton = this.quickQuoteData.existingClientSelected
    this.showQuoteActions = JSON.parse(sessionStorage.getItem("showQuoteActions"));
    if (this.quickQuoteData) {
      this.selectedClientName = this.quickQuoteData?.clientName;
      this.selectedEmail = this.quickQuoteData?.clientEmail;
      this.selectedPhoneNo = this.quickQuoteData?.clientPhoneNumber;
    }

    log.debug("Selected subclass code", this.selectedSubclassCode)

    this.isAddRisk = false;
    sessionStorage.setItem("isAddRisk", JSON.stringify(this.isAddRisk))
    log.debug("IS ADD RISK STATE:", this.isAddRisk)
    this.isEditRisk = false;
    sessionStorage.setItem("isEditRisk", JSON.stringify(this.isEditRisk))
    log.debug("IS EDIT RISK STATE:", this.isEditRisk)
    this.fieldDisableState = false;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);
    this.getuser();
    this.createEmailForm();
    this.createSmsForm();
  }

  ngOnDestroy(): void {
  }

  formatString(str: string): string {
    return str.replace(/\s+/g, '-');
  }

  loadClientQuotation() {
    this.quotationService.getClientQuotations(this.coverQuotationNo).pipe(
      untilDestroyed(this)
    ).subscribe((quotation) => {
      this.quotationDetails = quotation
      sessionStorage.setItem('passedQuotationDetails', JSON.stringify(quotation));
      this.coverFrom = quotation.coverFrom;
      this.coverTo = quotation.coverTo;
      this.expiryDate = quotation.expiryDate;
      const productInformation = this.quotationDetails.quotationProducts;
      this.quoteDate = productInformation[0].wef;
      this.agentDesc = productInformation[0].agentShortDescription;
      this.riskDetails = this.quotationDetails.quotationProducts[0]?.riskInformation;
      if (this.quotationDetails?.riskInformation?.length == 1) {
        this.selectedRisk = this.quotationDetails.riskInformation[0]
        this.activeRiskInformation = this.riskDetails
        log.debug("Active risks to display >>>", this.activeRiskInformation)
        this.onRiskSelect(this.selectedRisk)
      } else {
        this.selectedProduct = this.quotationDetails.quotationProducts[0];
        this.riskToDisplay(this.selectedProduct)
      }
    })
  }

  addAnotherRisk() {
    const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
    sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);
    this.isAddRisk = true;
    const passedIsAddRiskString = JSON.stringify(this.isAddRisk);
    sessionStorage.setItem('isAddRisk', passedIsAddRiskString);
    sessionStorage.setItem('quoteAction', 'A')


    // Set the fields disable state to true
    this.fieldDisableState = true;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);

    // Add a unique flag for add another risk navigation
    sessionStorage.setItem('navigationSource', 'addAnotherRisk');

    log.debug("isAddRisk:", this.isAddRisk)
    log.debug("quotation number:", this.coverQuotationNo)
    log.debug("Quotation Details:", this.quotationDetails)
    log.debug("Selected Client Details", this.clientDetails);
    this.router.navigate(['/home/gis/quotation/quick-quote'])
  }


  cancelQuote() {

    log.debug("Starting cancelQuote method");
    this.cancelQuoteClicked = true;
    const cancelQuoteClickedString = JSON.stringify(this.cancelQuoteClicked);
    sessionStorage.setItem("cancelQuoteClicked", cancelQuoteClickedString);

    // Remove specific items from session storage
    sessionStorage.removeItem('clientCode');
    sessionStorage.removeItem('mandatorySections');
    sessionStorage.removeItem('passedQuotationCode');
    sessionStorage.removeItem('passedQuotationNumber');
    sessionStorage.removeItem('premiumComputationRequest');
    sessionStorage.removeItem('premiumResponse');
    sessionStorage.removeItem('product');
    sessionStorage.removeItem('quickQuotationCode');
    sessionStorage.removeItem('quotationNumber');
    sessionStorage.removeItem('quotationSource');
    sessionStorage.removeItem('riskLevelPremium');
    sessionStorage.removeItem('subclassCoverType');
    sessionStorage.removeItem('sumInsuredValue');

    log.debug("Session storage items removed");

    if (this.reasonCancelled !== '') {
      this.updateQuoteStatus();
    } else {
      this.globalMessagingService.displayInfoMessage('Error', 'Provide a reason');
    }

  }

  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails?.branchId;
    log.debug("Branch Id", this.userBranchId);
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
    });
  }

  emaildetails() {
    const currentDate = new Date();
    const current = currentDate.toISOString();
    const emailForm = this.emailForm.value;

    log.debug(this.clientDetails)
    // log.debug(this.emailForm.value)

    emailForm.address = [
      this.selectedEmail
    ], emailForm.clientCode = this.passedClientCode;
    emailForm.emailAggregator = "N";
    emailForm.from = this.userDetails?.emailAddress;
    emailForm.fromName = "Turnkey Africa";
    emailForm.message = "Attached is your Quotation Details";
    emailForm.sendOn = current;
    emailForm.status = "D";
    emailForm.subject = "Quotation Details";
    emailForm.systemCode = "0";
    emailForm.systemModule = "NB";
    log.debug('Submitted payload:', JSON.stringify(emailForm));
  }

  createSmsForm() {

    this.smsForm = this.fb.group({
      message: ['', Validators.required],
      recipients: ['', Validators.required],
      sender: ['', Validators.required],
    });
  }

  sendSms() {
    const payload = {
      recipients: [
        this.selectedPhoneNo
      ],
      message: "Turnkey Africa",
      sender: this.userDetails?.emailAddress,


    };
  }

  handleShare() {
    if (this.selectedOption === 'email') {
      this.emaildetails();
    } else if (this.selectedOption === 'sms') {
      this.sendSms();
    }
  }

  openRiskDeleteModal() {
    log.debug("Selected Risk", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
    } else {
      // this.deleteRisk()
      document.getElementById("openRiskModalButtonDelete").click();
    }
  }

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  onResize(event: any) {
    this.modalHeight = event.height;
  }

  getSumInsuredForSection(sectionsDetails: any[], sectionDescription: string): number {
    if (!sectionsDetails) {
      return 0; // Fallback if sectionsDetails is null or undefined
    }
    const section = sectionsDetails.find(sec => sec.description === sectionDescription);
    return section?.limitAmount || 0;
  }

  productSelected(product: any) {
    log.debug("Selected >>>", product)
    this.riskToDisplay(product)
  }

  riskToDisplay(product: any) {
    this.activeRiskInformation = product.riskInformation
    this.selectedProduct = product
    if (this.activeRiskInformation?.length == 1) {
      this.onRiskSelect(this.activeRiskInformation[0])
    }

  }

  onRiskSelect(riskItem: any): void {
    this.selectedRisk = riskItem;
    this.selectedSubclassCode = riskItem?.subclass?.code
    log.debug('Selected Risk item:', riskItem);
    if (this.selectedRisk) {
      this.fetchClauses();
      this.fetchExcesses();
      this.fetchLimitsOfLiability()
    }
  }


  getTaxTooltip(product: any): string {
    return product.taxInformation
      .map(
        tax => `${tax.rateDescription}: ${tax.taxAmount}\nRate Type: ${tax.rateType}\n Rate: ${tax.quotationRate}`
      )
      .join('\n\n');
  }

  fetchClauses() {
    this.quotationService
      .getClauses(this.selectedRisk?.coverTypeCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.clauseList = response._embedded
          log.debug("Clause List ", this.clauseList);

        },
        error: (error) => {
          log.debug("eerror fetching clauses", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch clauses. Try again later');
        }
      });
  }

  fetchExcesses() {
    this.quotationService
      .getExcesses(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.excessesList = response._embedded
          log.debug("Excesses List ", this.excessesList);

        },
        error: (error) => {
          log.debug("eerror fetching excesses", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch excesses. Try again later');
        }
      });
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
          log.debug("eerror fetching limits of liability", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch limits of liabilty. Try again later');
        }
      });
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

          this.loadClientQuotation()
          this.selectedRisk = null;
        },
        error: (error) => {
          log.debug("eerror deleting risk", error);
          this.globalMessagingService.displayErrorMessage('Error', 'Failed to delete risk. Try again later');
        }
      });

  }

  openRiskEditModal() {
    log.debug("Selected Risk", this.selectedRisk)
    if (!this.selectedRisk) {
      this.globalMessagingService.displayInfoMessage('Error', 'Select Risk to continue');
    } else {
      this.editRisk()

    }
  }

  editRisk() {
    const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
    sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);
    sessionStorage.setItem('passedSelectedRiskDetails', JSON.stringify(this.selectedRisk));
    this.isEditRisk = true;
    const passedIsEditRiskString = JSON.stringify(this.isEditRisk);
    sessionStorage.setItem('isEditRisk', passedIsEditRiskString);

    // Set the fields disable state to true
    this.fieldDisableState = true;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);

    // Add a unique flag for edit risk navigation
    sessionStorage.setItem('navigationSource', 'editRisk');
    sessionStorage.setItem('quoteAction', 'E')


    log.debug("isEditRisk:", this.isEditRisk)
    log.debug("quotation number:", this.coverQuotationNo)
    log.debug("Quotation Details:", this.quotationDetails)
    this.router.navigate(['/home/gis/quotation/quick-quote']);
  }

  convertToPolicy() {

    const selectedClient = this.quickQuoteData?.selectedClient;

    if (selectedClient) {

      // NAVIGATE TO POLICY SCREEN
      log.debug("existing client convert to polict and navigate to policy summary screen")
      this.convertQuoteToPolicy()

    } else {
      log.debug("New client Proceed to client creation")

      const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
      sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);

      const convertToPolicyFlag = "convertToPolicy";
      sessionStorage.setItem('convertToPolicyFlag', convertToPolicyFlag);
      this.router.navigate(['/home/gis/quotation/create-client']);
    }
  }

  convertToNormalQuote() {
    const selectedClient = this.quickQuoteData?.selectedClient;
    if (selectedClient) {
      // NAVIGATE TO QUOTATION summary
      log.debug("existing client convert to normal quote and navigate to quotation summary screen");
      this.convertQuoteToNormalQuote();
    } else {
      const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
      sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);
      const convertToNormalQuoteFlag = "convertToNormalQuote";
      sessionStorage.setItem('convertToNormalQuoteFlag', convertToNormalQuoteFlag);
      this.router.navigate(['/home/gis/quotation/create-client']);
    }
  }

  updateQuoteStatus() {
    if (!this.reasonCancelled?.trim()) {
      this.globalMessagingService.displayErrorMessage('Error', 'Please provide a reason for cancellation');
      return;
    }

    this.quotationCode = this.quotationDetails?.quotationProducts[0]?.quotCode;

    this.quotationService
      .updateQuotationStatus(this.quotationCode, StatusEnum.Rejected, this.reasonCancelled)
      .pipe(untilDestroyed(this))
      .subscribe({
          next: (response: any) => {
            log.debug("Response after updating quotation status succesfully", response);
            this.showQuoteActions = false; // Hide the buttons after successful cancellation
            const showQuoteActionsString = JSON.stringify(this.showQuoteActions);
            sessionStorage.setItem("showQuoteActions", showQuoteActionsString)
            this.globalMessagingService.displaySuccessMessage('Success', 'Quote cancelled');

          },
          error: (error) => {
            log.debug("Could not update status", error);
            this.globalMessagingService.displayErrorMessage('Error', 'Failed to cancel quote. Try again later');
          }
        }
      );
  }

  convertQuoteToPolicy() {
    log.debug("Quotation Details", this.quotationDetails)
    const quotationCode = this.quotationDetails?.code;
    log.debug("Quotation Code", quotationCode);
    log.debug("Quotation Details", this.quotationDetails);
    const quoteProductCode = this.quotationDetails?.quotationProducts[0]?.code

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    this.quotationService.convertQuoteToPolicy(quotationCode, quoteProductCode).subscribe((data: any) => {
      log.debug("Response after converting quote to a policy:", data)
      this.batchNo = data._embedded.batchNo
      log.debug("Batch number", this.batchNo)
      const convertedQuoteBatchNo = JSON.stringify(this.batchNo);
      sessionStorage.setItem('convertedQuoteBatchNo', convertedQuoteBatchNo);
      this.router.navigate(['/home/gis/policy/policy-summary']);

    })

  }

  convertQuoteToNormalQuote() {
    log.debug("Quotation Details", this.quotationDetails);

    const quotationNumber = this.quotationDetails?.quotationNo;
    log.debug("Quotation Number", quotationNumber);
    sessionStorage.setItem("quotationNum", quotationNumber);

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    // Get the quotCode
    const quotationCode = this.quotationDetails?.code;
    log.debug("Quotation Code", this.quotationCode);

    // Call the API to convert quote to normal quote
    this.quotationService
      .convertToNormalQuote(quotationCode)
      .subscribe((data: any) => {
          log.debug("Response after converting quote to a normalQuote:", data)
          this.router.navigate(['/home/gis/quotation/quotation-summary']);

        }
      );
  }
}
