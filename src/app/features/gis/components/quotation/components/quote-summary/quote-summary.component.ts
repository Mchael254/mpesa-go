import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import stepData from '../../data/steps.json';
import { Logger, untilDestroyed, UtilService } from '../../../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../../../entities/services/client/client.service';
import { ProductService } from '../../../../services/product/product.service';
import { AuthService } from '../../../../../../shared/services/auth.service';

import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { QuickQuoteData } from '../../../setups/data/gisDTO';
import { Router } from '@angular/router';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service'
import { HttpErrorResponse } from '@angular/common/http';
import { Clause, Excesses, LimitsOfLiability, StatusEnum, Status } from '../../data/quotationsDTO';

const log = new Logger('QuoteSummaryComponent');

@Component({
  selector: 'app-quote-summary',
  templateUrl: './quote-summary.component.html',
  styleUrls: ['./quote-summary.component.css']
})
export class QuoteSummaryComponent {
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;

  quickQuotationCode: any;
  coverQuotationNo: any;
  quotationDetails: any;
  quotationNo: any;
  quotationCode: number;
  quoteDate: any;

  productInformation: any;
  taxInformation: any;

  insuredCode: any;
  agentDesc: any;
  coverFrom: any;
  coverTo: any;
  expiryDate: any;

  clientDetails: ClientDTO;
  selectedClientName: any;
  clientcode: any;
  passedNewClientDetails: any;

  productCode: any;
  quotationproduct: any;
  productDesc: any;

  formattedCoverFrom: string;
  formattedCoverTo: string;

  isAddRisk: boolean = false;
  fieldDisableState: boolean = false;
  passedPremium: any;
  selectedEmail: any;
  selectedPhoneNo: any;
  passedClientDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  passedClientCode: any;
  user: any;
  userDetails: any
  userBranchId: any;
  selectedRisk: any;
  clauseList: Clause[] = []
  selectedClause: any;
  modalHeight: number = 200; // Initial height
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  totalTaxes: number = 0;
  premiumAmount: number = 0;
  taxList: { description: string; amount: number; rate: number; rateType: string }[] = [];
  selectedSubclassCode: any;
  excessesList: Excesses[] = []
  selectedExcess: any;
  isEditRisk: boolean = false;
  reasonCancelled: string = '';
  cancelQuoteClicked: boolean = false;
  showQuoteActions: boolean = true;
  batchNo: number;
  quickQuoteData: QuickQuoteData;


  constructor(
    public fb: FormBuilder,
    public productService: ProductsService,
    public quotationService: QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassService: SubclassesService,
    private gisService: ProductService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private clientService: ClientService,
    public sharedService: SharedQuotationsService,
    public router: Router,
    private ngZone: NgZone,
    public globalMessagingService: GlobalMessagingService,
    public utilService:UtilService


  ) {

  }

  ngOnInit(): void {

    const quotationNumberString = sessionStorage.getItem('quotationNumber');
    this.coverQuotationNo = JSON.parse(quotationNumberString);


    const riskLevelPremiumString = sessionStorage.getItem('riskLevelPremium');
    this.passedPremium = JSON.parse(riskLevelPremiumString);
    log.debug("Selected Cover Quotation Number:", this.coverQuotationNo);
    log.debug("Passed Premium :", this.passedPremium);

    if (this.coverQuotationNo) {
      this.loadClientQuotation();

    }

    const storedClientDetailsString = sessionStorage.getItem('clientDetails');
    this.passedClientDetails = JSON.parse(storedClientDetailsString);
    log.debug("Client details", this.passedClientDetails);
    this.passedClientCode = this.passedClientDetails?.id;

    const newClientDetailsString = sessionStorage.getItem('newClientDetails');
    this.passedNewClientDetails = JSON.parse(newClientDetailsString);
    log.debug("New Client Details", this.passedNewClientDetails);

    const quickQuoteDataString = sessionStorage.getItem('quickQuoteData');
    this.quickQuoteData = JSON.parse(quickQuoteDataString);
    log.debug("quick quote data", this.quickQuoteData)

    const showQuoteActionsString = sessionStorage.getItem("showQuoteActions");
    this.showQuoteActions = JSON.parse(showQuoteActionsString);

    // if (this.passedClientDetails) {
    //   log.info("EXISTING CLIENT")
    //   this.selectedClientName = this.utilService.getFullName(this.passedClientDetails)
    //   this.selectedEmail = this.passedClientDetails?.emailAddress;
    //   this.selectedPhoneNo = this.passedClientDetails?.phoneNumber;
    // } else {
    //   log.info("NEW CLIENT")
    //   this.selectedClientName = this.passedNewClientDetails?.inputClientName;
    //   log.info("Selected Name:", this.selectedClientName)

    //   this.selectedEmail = this.passedNewClientDetails?.inputClientEmail;
    //   log.info("Selected Email:", this.selectedEmail)

    //   this.selectedPhoneNo = this.passedNewClientDetails?.inputClientPhone;
    //   log.info("Selected Phone:", this.selectedPhoneNo)

    // }

    if(this.quickQuoteData) {
      this.selectedClientName = this.quickQuoteData?.clientName;
      log.info("Selected Name:", this.selectedClientName)

      this.selectedEmail = this.quickQuoteData?.clientEmail;
      log.info("Selected Email:", this.selectedEmail)

      this.selectedPhoneNo = this.quickQuoteData?.clientPhoneNumber;
      log.info("Selected Phone:", this.selectedPhoneNo)
    }

    this.getuser();
    this.createEmailForm();
    this.createSmsForm();
    const selectedSubclassCodeString = sessionStorage.getItem('selectedSubclassCode');
    this.selectedSubclassCode = JSON.parse(selectedSubclassCodeString);
    log.debug("Selected subclass code", this.selectedSubclassCode)

    this.isAddRisk=false;
    sessionStorage.setItem("isAddRisk", JSON.stringify(this.isAddRisk))
    log.debug("IS ADD RISK STATE:",this.isAddRisk)
    this.isEditRisk=false;
    sessionStorage.setItem("isEditRisk", JSON.stringify(this.isEditRisk))
    log.debug("IS EDIT RISK STATE:",this.isEditRisk)
    this.fieldDisableState = false;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);
    // this.isAddRisk = false;
    // log.debug("IS ADD RISK STATE:", this.isAddRisk)
    // this.isEditRisk = false;
    // log.debug("IS EDIT RISK STATE:", this.isEditRisk)

  }
  ngOnDestroy(): void { }

  formatString(str: string): string {
    return str.replace(/\s+/g, '-');
  }

  loadClientQuotation() {
    log.debug("Load CLient quotation has been called")
    this.quotationService.getClientQuotations(this.coverQuotationNo).subscribe(data => {
      this.quotationDetails = data;
      log.debug("Quotation Details:", this.quotationDetails)
      this.quotationNo = this.quotationDetails.quotationNo;
      log.debug("Quotation Number:", this.quotationNo)
      if (this.quotationDetails) {
        log.info("CALCULATE TAXES XALLED")
        this.calculateTaxes()
        this.getPremiumAmount()
      }

      this.insuredCode = this.quotationDetails.clientCode;
      log.debug("Insured Code:", this.insuredCode)

      this.coverFrom = this.quotationDetails.coverFrom;
      log.debug("Cover From:", this.coverFrom)

      this.coverTo = this.quotationDetails.coverTo;
      log.debug("Cover To:", this.coverTo)

      this.expiryDate = this.quotationDetails.expiryDate;
      log.debug("Cover To:", this.expiryDate)


      this.productInformation = this.quotationDetails.quotationProducts;
      log.debug("Product Information:", this.productInformation);
      this.productCode = this.productInformation[0].proCode;
      log.debug("ProductCode:", this.productCode)

      this.quoteDate = this.productInformation[0].wef;


      this.agentDesc = this.productInformation[0].agentShortDescription;
      log.debug("Agent Description:", this.agentDesc)

      this.getClient();
      this.getQuotationProduct();

    })
  }



  // showOptions(item: any): void {
  //   item.showOptions = !item.showOptions;
  // }

  // editItem(item: any): void {
  //   log.debug('Edit item clicked', item);
  // }

  // deleteItem(item: any): void {
  //   log.debug('Delete item clicked', item);
  // }
  getClient() {
    if (this.passedNewClientDetails) {
      log.debug("new client")
      this.selectedClientName = this.passedNewClientDetails?.inputClientName;
      log.debug("Selected New Client Name", this.selectedClientName);
    } else {
      log.debug("existing client")

      this.clientService.getClientById(this.insuredCode).subscribe(data => {
        this.clientDetails = data;
        log.debug("Selected Client Details", this.clientDetails);
        this.selectedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName
        log.debug("Selected Client Name", this.selectedClientName);
      })
    }
    this.clientService.getClientById(this.insuredCode).subscribe(data => {
      this.clientDetails = data;
      log.debug("Selected Client Details", this.clientDetails);
      if (this.passedNewClientDetails) {
        this.selectedClientName = this.passedNewClientDetails?.inputClientName;
        log.debug("Selected New Client Name", this.selectedClientName);

      } else {
        this.selectedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName
        log.debug("Selected Client Name", this.selectedClientName);
      }

    })
  }
  getQuotationProduct() {
    this.productService.getProductByCode(this.productCode).subscribe(data => {
      this.quotationproduct = data;
      log.debug(this.quotationproduct, "this is a quotation product")
      this.productDesc = this.quotationproduct.description;
      log.debug("PRODUCT Desc:")
      this.cdr.detectChanges()
    })
  }
  addAnotherRisk() {
    const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
    sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);

    const passedClientDetailsString = JSON.stringify(this.passedClientDetails);
    sessionStorage.setItem('passedClientDetails', passedClientDetailsString);

    const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
    sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);
    this.isAddRisk = true;
    const passedIsAddRiskString = JSON.stringify(this.isAddRisk);
    sessionStorage.setItem('isAddRisk', passedIsAddRiskString);

    // Set the fields disable state to true
    this.fieldDisableState = true;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);

    // Add a unique flag for add another risk navigation
    sessionStorage.setItem('navigationSource', 'addAnotherRisk');

    log.debug("isAddRisk:", this.isAddRisk)
    log.debug("quotation number:", this.quotationNo)
    log.debug("Quotation Details:", this.quotationDetails)
    log.debug("Selected Client Details", this.clientDetails);
    log.debug("Selected New Client Details", this.passedNewClientDetails);

    // this.router.navigate(['/home/gis/quotation/quick-quote'])
    // Use NgZone.run to execute the navigation code inside the Angular zone
    this.ngZone.run(() => {
      this.router.navigate(['/home/gis/quotation/quick-quote']);
    });
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
    sessionStorage.removeItem('quickQuotationNum');
    sessionStorage.removeItem('quotationSource');
    sessionStorage.removeItem('riskLevelPremium');
    sessionStorage.removeItem('subclassCoverType');
    sessionStorage.removeItem('sumInsuredValue');

    log.debug("Session storage items removed");

    if(this.reasonCancelled !== '') {
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
    ],
      emailForm.clientCode = this.passedClientCode;
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
  onRiskSelect(riskItem: any): void {
    this.selectedRisk = riskItem;
    log.debug('Selected Risk item:', riskItem);
    if (this.selectedRisk) {
      this.fetchClauses();
      this.fetchExcesses();
      this.fetchLimitsOfLiability()
    }
  }

  getPremiumAmount() {
    this.totalTaxes = 0;
    this.premiumAmount = 0;
    const totalPremiumAmount = this.quotationDetails.quotationProducts[0].premium;

    //subtract the totalPremium and the taxes amount to get the premium
    if (this.quotationDetails.taxInformation) {
      this.quotationDetails.taxInformation.forEach((tax: any) => {
        if (tax.taxAmount) {
          this.totalTaxes += tax.taxAmount;
          log.debug("Total Taxes:", this.totalTaxes)

        }
      });
    }

    this.premiumAmount = totalPremiumAmount - this.totalTaxes;
    log.debug("premium amount:", this.premiumAmount)
  }

  calculateTaxes() {
    log.info("CALCULATE TAXES XALLED method starts")

    this.totalTaxes = 0;
    this.taxList = [];
    if (this.quotationDetails.taxInformation) {
      this.quotationDetails.taxInformation.forEach((tax: any) => {
        if (tax.taxAmount) {
          this.totalTaxes += tax.taxAmount;
          log.debug("Total Taxes:", this.totalTaxes)
          this.taxList.push({ description: tax.rateDescription, amount: tax.taxAmount, rate: tax.quotationRate, rateType: tax.rateType });
          log.debug("Total Taxes List:", this.taxList)

        }
      });
    }
  }
  getTaxTooltip(): string {
    return this.taxList
      .map(
        tax => `${tax.description}: ${tax.amount}\nRate Type: ${tax.rateType}\n Rate: ${tax.rate}`
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

          // Remove the deleted risk from the riskDetails array
          const index = this.quotationDetails?.riskInformation.findIndex(risk => risk.code === this.selectedRisk.code);
          if (index !== -1) {
            this.quotationDetails?.riskInformation.splice(index, 1);
          }
          // Clear the selected risk
          this.selectedRisk = null;

        },
        error: (error) => {

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

    const passedClientDetailsString = JSON.stringify(this.passedClientDetails);
    sessionStorage.setItem('passedClientDetails', passedClientDetailsString);

    const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
    sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);

    const passedSelectedRiskDetailsString = JSON.stringify(this.selectedRisk);
    sessionStorage.setItem('passedSelectedRiskDetails', passedSelectedRiskDetailsString);
    this.isEditRisk = true;
    const passedIsEditRiskString = JSON.stringify(this.isEditRisk);
    sessionStorage.setItem('isEditRisk', passedIsEditRiskString);

    // Set the fields disable state to true
    this.fieldDisableState = true;
    const passedFieldDisableStateString = JSON.stringify(this.fieldDisableState);
    sessionStorage.setItem('fieldsDisableState', passedFieldDisableStateString);

    // Add a unique flag for edit risk navigation
    sessionStorage.setItem('navigationSource', 'editRisk');

    log.debug("isEditRisk:", this.isEditRisk)
    log.debug("quotation number:", this.quotationNo)
    log.debug("Quotation Details:", this.quotationDetails)
    log.debug("Selected Client Details", this.passedClientDetails);
    log.debug("Selected New Client Details", this.passedNewClientDetails);

    // this.router.navigate(['/home/gis/quotation/quick-quote'])
    // Use NgZone.run to execute the navigation code inside the Angular zone
    this.ngZone.run(() => {
      this.router.navigate(['/home/gis/quotation/quick-quote']);
    });
  }
  convertToPolicy(){
    if(this.passedNewClientDetails){
    //NAVIGATE TO CREATE CLIENT SCREEN
    log.debug("Passed new client details:",this.passedNewClientDetails)

    const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
    sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);

    const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
    sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);

    const convertToPolicyFlag = "convertToPolicy";
    sessionStorage.setItem('convertToPolicyFlag', convertToPolicyFlag);

    this.router.navigate(['/home/gis/quotation/create-client']);



    }else{
      // NAVIGATE TO POLICY SCREEN
      log.debug("existing client convert to polict and navigate to policy summary screen")
      this.convertQuoteToPolicy()
    }
  }

  convertToNormalQuote() {
    if(this.passedNewClientDetails){
      //NAVIGATE TO CREATE CLIENT SCREEN
      log.debug("Passed new client details:",this.passedNewClientDetails)

      const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
      sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);

      const passedQuotationDetailsString = JSON.stringify(this.quotationDetails);
      sessionStorage.setItem('passedQuotationDetails', passedQuotationDetailsString);

      const convertToNormalQuoteFlag = "convertToNormalQuote";
      sessionStorage.setItem('convertToNormalQuoteFlag', convertToNormalQuoteFlag);

      this.router.navigate(['/home/gis/quotation/create-client']);

    } else {
      // NAVIGATE TO QUOTATION summary
      log.debug("existing client convert to normal quote and navigate to quotation summary screen");
      this.convertQuoteToNormalQuote();
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
  convertQuoteToPolicy(){
    log.debug("Quotation Details",this.quotationDetails)
    const quotationCode = this.quotationDetails?.quotationProducts[0]?.quotCode;
    log.debug("Quotation Code",quotationCode);
    log.debug("Quotation Details",this.quotationDetails);

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    this.quotationService.convertQuoteToPolicy(quotationCode).subscribe((data:any) => {
      log.debug("Response after converting quote to a policy:", data)
      this.batchNo = data._embedded.batchNo
      log.debug("Batch number",this.batchNo)
      const convertedQuoteBatchNo = JSON.stringify(this.batchNo);
      sessionStorage.setItem('convertedQuoteBatchNo', convertedQuoteBatchNo);
      this.router.navigate(['/home/gis/policy/policy-summary']);

    })

  }

  convertQuoteToNormalQuote() {
    log.debug("Quotation Details",this.quotationDetails);

    const quotationNumber = this.quotationDetails?.quotationNo;
    log.debug("Quotation Number",quotationNumber);
    sessionStorage.setItem("quotationNum", quotationNumber);

    const conversionFlag = true;
    sessionStorage.setItem("conversionFlag", JSON.stringify(conversionFlag));

    // Get the quotCode
    const quotationCode = this.quotationDetails?.quotationProducts[0]?.quotCode;
    log.debug("Quotation Code",this.quotationCode);

    // Call the API to convert quote to normal quote
    this.quotationService
      .convertToNormalQuote(quotationCode)
      .subscribe((data:any) => {
        log.debug("Response after converting quote to a normlaQuote:", data)

        this.router.navigate(['/home/gis/quotation/quotation-summary']);

      }
    );
  }
}
