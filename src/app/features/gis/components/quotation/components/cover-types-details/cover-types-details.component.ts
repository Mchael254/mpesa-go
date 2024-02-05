import { ChangeDetectorRef, Component } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/features/entities/services/client/client.service';
import { ProductService } from 'src/app/features/gis/services/product/product.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Logger } from '../../../../../../shared/shared.module'
import { forkJoin } from 'rxjs';
import { PremiumComputationRequest, QuotationDetails, QuotationProduct, RiskInformation, SectionDetail, TaxInformation, subclassCovertypeSection } from '../../data/quotationsDTO'
import { Premiums, subclassSection } from '../../../setups/data/gisDTO';
import { ClientDTO } from 'src/app/features/entities/data/ClientDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { Router } from '@angular/router';
const log = new Logger('CoverTypesDetailsComponent');

@Component({
  selector: 'app-cover-types-details',
  templateUrl: './cover-types-details.component.html',
  styleUrls: ['./cover-types-details.component.css']
})
export class CoverTypesDetailsComponent {

  isCollapsibleOpen = false;
  isModalOpen = false;
  selectedOption: string = 'email';
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;
  coverTypes: any[];

  quickQuotationNumbers: any;
  quotationDetails: QuotationDetails[];

  quickQuoteSectionList: any;
  selectedSections: any[] = [];
  sections: any[] = [];
  filteredSection: any;
  passedSections: any[] = [];
  sectionDetailsForm: FormGroup;
  checkedSectionCode: any;
  checkedSectionDesc: any;
  checkedSectionType: any;
  sectionArray: any;
  // checked:boolean=false;
  // limitAmount:number=0;

  taxInformation: any;
  riskInformation: any
  riskInfo: any;
  sumInsuredValue: any;

  riskCode: any;
  premium: any;
  index = 1;

  coverTypeShortDescription: any;
  passedCoverTypeShortDes: any;
  passedCovertypeDescription: any;
  passedCovertypeCode: any;

  clientDetails: ClientDTO;
  selectedClientName: any;
  clientcode: any;
  selectedEmail: any;
  selectedPhoneNo: any;
  selectedQuotationData: any;
  selectedQuotationNo: any;
  SelectedQuotationCode: any;
  formData: any;


  typedWord: number | null = null; // Initialize as null or a default value
  isChecked: boolean = false;

  emailData: any = {
    "address": [
      "kevine.oyanda@turnkeyafrica.com"
    ],
    "attachments": [],
    "fromName": "TQ Ticketing Service",
    "bcc": [],
    "cc": [],
    "data": {
      "html_content": "<p>Test</p>"
    },
    "subject": "Ticket Notification",
    "useLocalTemplate": true
  }

  premiumPayload: PremiumComputationRequest;
  premiumResponse: any;
  riskLevelPremiums: any;
  passedCovertypes: any;

  user: any;
  userDetails: any
  userBranchId: any;

  quotationCode: any;
  quotationData: any;
  quotationNo: any;
  passedQuotationSource: any;
  quotationForm: FormGroup;


  riskDetailsForm: FormGroup;
  quotationRiskData: any;


  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  passedClientDetails: any;
  passedClientCode: any;
  computationDetails: any;

  selectedSectionCode: any;
  selectedSubclassCode: any;
  allMatchingSubclasses = [];
  subclassSectionCoverList: any;
  covertypeSectionList: any;
  covertypeSpecificSection: any;
  sectionCodesArray: number[] = [];
  premiumList: Premiums[] = [];
  passedQuotationNumber: any;
  passedQuotationCode: any;

  emailForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public productService: ProductsService,
    public binderService: BinderService,
    public quotationService: QuotationsService,
    private subclassCoverTypesService: SubClassCoverTypesService,
    public subclassService: SubclassesService,
    public currencyService: CurrencyService,
    private gisService: ProductService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private clientService: ClientService,
    public sharedService: SharedQuotationsService,
    private router: Router,
    private ngxSpinner: NgxSpinnerService,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    private globalMessagingService: GlobalMessagingService,
    public premiumRateService: PremiumRateService,

  ) { }

  ngOnInit(): void {
    this.passedQuotationNumber = sessionStorage.getItem('passedQuotationNumber');
    log.debug("Passed Quotation Number:", this.passedQuotationNumber);
    this.passedQuotationCode = sessionStorage.getItem('passedQuotationCode');
    log.debug("Passed Quotation code:", this.passedQuotationCode);
    const premiumComputationRequestString = sessionStorage.getItem('premiumComputationRequest');
    this.premiumPayload = JSON.parse(premiumComputationRequestString);

    // const data = this.sharedService.getPremiumPayload();

    // log.debug("PREMIUM PAYLOAD", data);
    // this.premiumPayload = data.data;
    log.debug("PREMIUM PAYLOAD", this.premiumPayload);
    const hope = this.premiumPayload.risks
    this.extractSectionCodes(hope);

    const subclassCoverTypeString = sessionStorage.getItem('subclassCoverType');
    this.passedCovertypes = JSON.parse(subclassCoverTypeString);
    log.debug("SUBCLASS PAYLOAD", this.passedCovertypes);

    // this.passedCovertypes = data.covertypes;
    const premiumResponseString = sessionStorage.getItem('premiumResponse');
    this.premiumResponse = JSON.parse(premiumResponseString);

    // this.premiumResponse = this.sharedService.getPremiumResponse();
    log.debug("PREMIUM RESPONSE", this.premiumResponse);
    this.riskLevelPremiums = this.premiumResponse.riskLevelPremiums;
    this.sumInsuredValue = this.premiumPayload.risks[0].limits[0].limitAmount;
    log.debug("Quick Quote Quotation SI:", this.sumInsuredValue);
    this.selectedSectionCode = this.premiumPayload.risks[0].limits[0].section.code
    this.selectedSubclassCode = this.premiumPayload.risks[0].subclassSection.code

    const storedMandatorySectionsString = sessionStorage.getItem('mandatorySections');
    this.quickQuoteSectionList = JSON.parse(storedMandatorySectionsString);


    // this.quickQuoteSectionList = this.sharedService.getQuickSectionDetails();
    log.debug("Quick Quote Quotation Sections:", this.quickQuoteSectionList);
    const storedClientDetailsString = sessionStorage.getItem('clientDetails');
    this.passedClientDetails = JSON.parse(storedClientDetailsString);


    // this.passedClientDetails = this.sharedService.getClientDetails();
    log.debug("Client details", this.passedClientDetails);
    this.passedClientCode = this.passedClientDetails.id;
    this.clientcode = this.passedClientCode;
    log.debug("Client code", this.passedClientCode);

    this.selectedClientName = this.passedClientDetails.firstName + ' ' + this.passedClientDetails.lastName
    log.debug("Selected Client Name", this.selectedClientName);
    // this.passedQuotationSource = this.sharedService.getQuotationSource();
    this.passedQuotationSource = sessionStorage.getItem('quotationSource');
    log.debug("Source details", this.passedQuotationSource);
    this.selectedEmail = this.passedClientDetails.emailAddress;
    this.selectedPhoneNo = this.passedClientDetails.phoneNumber;


    this.createQuotationForm();
    this.getuser();
    this.createRiskDetailsForm();
    this.createEmailForm();


    this.formData = sessionStorage.getItem('quickQuoteFormDetails');
    log.debug("MY TRIAL", JSON.parse(this.formData))

    // this.quickQuotationNumbers = this.sharedService.getQuickQuotationDetails()
    // log.debug("Quick Quote Quotation Codes:", this.quickQuotationNumbers);
    // this.loadClientQuotations(this.quickQuotationNumbers);

    // if (Array.isArray(this.quickQuotationCodes) && this.quickQuotationCodes.length > 0) {
    //   this.loadClientQuotations(this.quickQuotationCodes);
    // } else {
    //   console.error('Invalid or empty quickQuotationCodes');

    // }    

    this.createSectionDetailsForm();

  }

  toggleCollapsible() {
    this.isCollapsibleOpen = !this.isCollapsibleOpen;
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }



  loadClientQuotations(quotationNumbers: string[]) {
    forkJoin(
      quotationNumbers.map(code =>
        this.quotationService.getClientQuotations(code)
      )
    ).subscribe(
      (data: QuotationDetails[]) => {
        this.quotationDetails = data;
        console.log('Quotation Details:', this.quotationDetails);
      },
      error => {
        console.error('Error fetching quotation details:', error);
      }
    );
  }
  passCovertypeDesc(data: any, code: any) {
    log.debug("data from passcovertpes", data);
    log.debug("data from passcovertpes", code);
    this.passedCovertypeDescription = data;
    this.passedCovertypeCode = code;
    this.passedCoverTypeShortDes = data;
    this.filteredSection = this.quickQuoteSectionList.filter(section =>

      this.passedCoverTypeShortDes == "COMP" ?
        section.coverTypeShortDescription == "COMPREHENSIVE" :
        section.coverTypeShortDescription == this.passedCoverTypeShortDes
    );
    log.debug("Filtered Section", this.filteredSection);
    this.passedSections = this.quickQuoteSectionList.filter(section => section.coverTypeCode == this.passedCovertypeCode);
    log.debug("Passed Section", this.passedSections);

    this.loadSubclassSectionCovertype();
    this.loadAllPremiums();
  }


  // passedRiskcode(data:any){
  //   log.debug("Risk Code;" ,data);
  //   this.riskCode=data;
  // }
  passedClient(data: any) {
    log.debug("client Code;", data);
    this.clientcode = data;
    this.getClient();
  }


  // loadClientQuotations(quotationCodes: string[]) {
  //   forkJoin(
  //     quotationCodes.map(code =>
  //       this.quotationService.getClientQuotations(code)
  //     )
  //   ).subscribe(
  //     (data: QuotationDetails[]) => {
  //       for (let i = 0; i < data.length; i++) {
  //         const quotationDetails = data[i];
  //         log.debug(`Quotation Details for Code ${quotationCodes[i]}:`, quotationDetails);

  //         const taxInformation = quotationDetails.taxInformation;
  //         log.debug(`Tax and Levies Details for Code ${quotationCodes[i]}:`, taxInformation);

  //         const premium = quotationDetails.premium;
  //         log.debug(`Premium for Code ${quotationCodes[i]}:`, premium);

  //         const riskInformation = quotationDetails.riskInformation;
  //         log.debug(`Risk Info for Code ${quotationCodes[i]}:`, riskInformation);

  //         const coverTypeShortDescription = riskInformation[0].covertypeShortDescription;
  //         log.debug(`Cover type Desc for Code ${quotationCodes[i]}:`, coverTypeShortDescription);

  //         // Handle other details as needed
  //       }
  //     },
  //     error => {
  //       console.error('Error fetching quotation details:', error);
  //     }
  //   );
  // }

  calculateTotalPayablePremium(quotationDetail: QuotationDetails): number {
    let totalPremium = quotationDetail.premium || 0;

    if (quotationDetail.taxInformation && quotationDetail.taxInformation.length > 0) {
      // Sum up the amounts of all taxes
      totalPremium += quotationDetail.taxInformation.reduce((total, tax) => total + (tax.amount || 0), 0);
    }

    return totalPremium;
  }
  /**
* Creates and initializes a section details form.
* Utilizes the 'FormBuilder'to create a form group ('sectionDetailsForm').
* Defines form controls for various section-related fields, setting initial values as needed.
*/
  createSectionDetailsForm() {
    this.sectionDetailsForm = this.fb.group({
      calcGroup: [''],
      code: [''],
      compute: [''],
      description: [''],
      freeLimit: [''],
      limitAmount: [''],
      multiplierDivisionFactor: [''],
      multiplierRate: [''],
      premiumAmount: [''],
      premiumRate: [''],
      quotRiskCode: [''],
      rateDivisionFactor: [''],
      rateType: [''],
      rowNumber: [''],
      sectionCode: [''],
      sectionShortDescription: [''],
      sectionType: [''],
      sumInsuredLimitType: [''],
      sumInsuredRate: ['']
    });
  }
  // onInputChange(section: any): void {
  //   log.debug("this method has been called")
  //   this.checked = this.limitAmount >0;
  // }

  onKeyUp(event: KeyboardEvent, section: any): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Assuming each row in the p-table has a 'code' property
    section.typedWord = parseInt(inputValue, 10);
    section.isChecked = !isNaN(section.typedWord);

    // Check if the section is checked and add it to the selectedSections array
    if (section.isChecked && !this.passedSections.includes(section)) {
      this.passedSections.push(section);
      console.log('Selected Sections:', this.passedSections);
      sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));

      this.loadAllPremiums();
    }
  }


  // Function to determine the checkbox state for each row
  isSectionChecked(section: any): boolean {
    return section.isChecked || false;

  }
  // onSelectionChange(event: any) {
  //   console.log('Selected Sections:', this.selectedSections);
  // }


  createRiskSection(payload: any) {
    // Your implementation for createRiskSection
    console.log('createRiskSection called with payload:', payload);
    sessionStorage.setItem("Added Benefit", JSON.stringify(payload));
  }
  loadAllPremiums() {
    const selectedBinder = this.premiumPayload.risks[0].binderDto.code;
    const selectedSubclassCode = this.premiumPayload.risks[0].subclassSection.code;
    const sections = this.passedSections;

    // Create an array to store observables returned by each service call
    const observables = sections.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, selectedBinder, selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe(data => {
      // data is an array containing the results of each service call
      this.premiumList = data.flat(); // Flatten the array if needed
      this.cdr.detectChanges();
      log.debug("Premium List", this.premiumList)
      // this.onCreateRiskSection();
    });
  }



  onCreateRiskSection() {
    console.log('Selected Sections:', this.passedSections);

    // Assuming this.premiumList is an array of premium rates retrieved from the service
    const premiumRates = this.premiumList;

    if (premiumRates.length !== this.passedSections.length) {
      // Handle the case where the number of premium rates doesn't match the number of sections
      console.error("Number of premium rates doesn't match the number of sections");
      return;
    }

    const payload = this.passedSections.map((section, index) => {
      const premiumRate = premiumRates[index]; // Get the corresponding premium rate for the current section

      return {
        calcGroup: 1,
        code: section.code,
        compute: "Y",
        description: premiumRate.sectionShortDescription,
        freeLimit: 0,
        multiplierDivisionFactor: premiumRate.multiplierDivisionFactor,
        multiplierRate: premiumRate.multiplierRate,
        premiumAmount: 0,
        premiumRate: premiumRate.rate,
        rateDivisionFactor: premiumRate.divisionFactor,
        rateType: premiumRate.rateType,
        rowNumber: 1,
        sumInsuredLimitType: null,
        sumInsuredRate: 0,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: this.sumInsuredValue,
      };
    });

    this.sectionArray = payload;

    this.quotationService.createRiskSection(this.riskCode, this.sectionArray).subscribe(data => {
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error try again later' });
        // this.sectionDetailsForm.reset();
      }
      this.computeQuotePremium();
      // this.sharedFunctionService.sendClickEvent(30);
      // log.debug("Function called on cover types")
    });
  }



  getClient() {
    this.clientService.getClientById(this.clientcode).subscribe(data => {
      this.clientDetails = data;
      log.debug("Selected Client Details", this.clientDetails);
      this.selectedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName
      log.debug("Selected Client Name", this.selectedClientName);
      this.selectedEmail = this.clientDetails.emailAddress;
      // remember to remove phonenumber
      this.selectedPhoneNo = +254789456123;
      // this.selectedPhoneNo=this.clientDetails.phoneNumber;

    })
  }
  selectedQuotationCover(data: any) {
    // this.ngxSpinner.show("coverComparisonScreen")

    this.selectedQuotationData = data;
    log.debug("Selected Quotation/cover:", this.selectedQuotationData);
    this.SelectedQuotationCode = this.selectedQuotationData.riskInformation[0].quotationCode;
    log.debug("Selected Quotation Code:", this.SelectedQuotationCode);

    this.selectedQuotationNo = this.selectedQuotationData.quotationProduct[0].quotationNo;
    log.debug("Selected Quotation/cover Number:", this.selectedQuotationNo);
    // this.sharedService.setSelectedCover(this.selectedQuotationNo);
    // this.router.navigate(['/home/gis/quotation/quote-summary']);

  }
  computePremium() {
    this.quotationService.computePremium(this.SelectedQuotationCode).subscribe(data => {
      try {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Premiums computed successfully' });
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
      }
    })
  }
  // passSelectedCover() {
  //   this.sharedService.setSelectedCover(this.selectedQuotationNo);
  //   //  this.ngxSpinner.show("coverComparisonScreenx")

  //   this.router.navigate(['/home/gis/quotation/quote-summary']);
  // }
  //  sendEmail(){
  //   this.notificationService.sendEmail(this.emailData).subscribe(data=>{
  //     try {
  //       log.debug("email:",data)
  //       this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Email sent' });
  //     } catch (error) {
  //       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, please try again later' });
  //     }
  //     })
  //  }


  /******************NEW PREMIUM COMPUTATION ENGINE **************/

  loadSubclassSectionCovertype() {
    this.subclassSectionCovertypeService.getSubclassCovertypeSections().subscribe(data => {
      this.subclassSectionCoverList = data;
      log.debug("Subclass Section Covertype:", this.subclassSectionCoverList);
      this.covertypeSectionList = this.subclassSectionCoverList.filter(section =>
        section.subClassCode == this.selectedSubclassCode &&
        section.isMandatory == null
      );
      log.debug("NOT MANDATORY", this.covertypeSectionList)
      this.covertypeSpecificSection = this.covertypeSectionList.filter(sec => sec.coverTypeCode == this.passedCovertypeCode)
      log.debug("COVER SPECIFIC SECTIONS", this.covertypeSpecificSection)
    })
  }

  createQuotationForm() {
    this.quotationForm = this.fb.group({
      actionType: [''],
      addEdit: [''],
      agentCode: [''],
      agentShortDescription: [''],
      bdivCode: [''],
      bindCode: [''],
      branchCode: [''],
      clientCode: [''],
      clientType: [''],
      coinLeaderCombined: [''],
      consCode: [''],
      currencyCode: [''],
      currencySymbol: [''],
      fequencyOfPayment: [''],
      isBinderPolicy: [''],
      paymentMode: [''],
      proInterfaceType: [''],
      productCode: [''],
      source: [''],
      withEffectiveFromDate: [''],
      withEffectiveToDate: [''],
      multiUser: [''],
      comments: [''],
      internalComments: [''],
      introducerCode: [''],
      dateRange: [''],
      RFQDate: [''],
      expiryDate: ['']
    })
  }

  /**
    * Creates and initializes the risk details form using Angular FormBuilder.
    * - Defines form controls with validators for various risk details.
    * @method createRiskDetailsForm
    * @return {void}
    */
  createRiskDetailsForm() {
    this.riskDetailsForm = this.fb.group({
      binderCode: ['', Validators.required],
      coverTypeCode: ['', Validators.required],
      coverTypeShortDescription: [''],
      dateWithEffectFrom: [''],
      dateWithEffectTo: [''],
      dateRange: [''],
      insuredCode: [''],
      isNoClaimDiscountApplicable: [''],
      itemDescription: ['', Validators.required],
      location: [''],
      noClaimDiscountLevel: [''],
      productCode: [''],
      propertyId: [''],
      riskPremAmount: [''],
      subClassCode: ['', Validators.required],
      town: [''],
    });
  }

  /**
  * Retrieves the current user and stores it in the 'user' property.
  * @method getUser
  * @return {void}
  */
  getuser() {
    this.user = this.authService.getCurrentUserName()
    this.userDetails = this.authService.getCurrentUser();
    log.info('Login UserDetails', this.userDetails);
    this.userBranchId = this.userDetails.branchId;
    log.debug("Branch Id", this.userBranchId);
  }
  loadAllCurrencies() {
    this.currencyService.getAllCurrencies().subscribe(data => {
      this.currencyList = data;
      log.info(this.currencyList, "this is a currency list");
      const curr = this.currencyList.filter(currency => currency.id == this.currencyCode);
      this.selectedCurrency = curr[0].name
      log.debug("Selected Currency:", this.selectedCurrency);
      this.selectedCurrencyCode = curr[0].id;
      log.debug("Selected Currency code:", this.selectedCurrencyCode);

      this.cdr.detectChanges()

    })
  }
  createQuotation() {
    const quoteForm = this.quotationForm.value;
    quoteForm.agentCode = 0;
    quoteForm.agentShortDescription = "DIRECT";
    quoteForm.branchCode = this.userBranchId;
    quoteForm.bindCode = this.premiumPayload.risks[0].binderDto.code;
    quoteForm.clientCode = this.passedClientDetails.id
    quoteForm.clientType = "I";
    quoteForm.currencyCode = this.premiumPayload.risks[0].binderDto.currencyCode;
    quoteForm.currencySymbol = this.selectedCurrency;
    quoteForm.productCode = this.premiumPayload.product.code;
    quoteForm.source = this.passedQuotationSource[0].code;
    quoteForm.withEffectiveFromDate = this.premiumPayload.risks[0].withEffectFrom;
    quoteForm.withEffectiveToDate = this.premiumPayload.risks[0].withEffectTo;

    this.quotationService.createQuotation(quoteForm, this.user).subscribe(data => {
      this.quotationData = data;
      this.quotationCode = this.quotationData._embedded[0].quotationCode;
      this.quotationNo = this.quotationData._embedded[0].quotationNumber;
      // this.quotationNo = data;
      console.log("Quotation results:", this.quotationData)
      log.debug("Quotation Number", this.quotationNo);
      log.debug("Quotation Code", this.quotationCode);
      this.createQuotationRisk()

    })
  }
  createQuotationRisk() {
    const risk = this.riskDetailsForm.value;
    risk.binderCode = this.premiumPayload.risks[0].binderDto.code;
    risk.coverTypeCode = this.passedCovertypeCode;
    risk.coverTypeShortDescription = this.passedCovertypeDescription;
    risk.insuredCode = this.passedClientDetails.id
    risk.productCode = this.premiumPayload.product.code;
    risk.dateWithEffectFrom = this.premiumPayload.risks[0].withEffectFrom;
    risk.dateWithEffectTo = this.premiumPayload.risks[0].withEffectTo;
    risk.subClassCode = this.premiumPayload.risks[0].subclassSection.code;
    risk.itemDescription = "volvo 4e";

    // FROM DYNAMIC FORM
    risk.propertyId = this.premiumPayload.risks[0].propertyId;
    console.log('Quick Form Risk', risk);
    const riskArray = [risk];

    return this.quotationService.createQuotationRisk(this.passedQuotationCode == null ? this.quotationCode : this.passedQuotationCode, riskArray).subscribe(data => {
      this.quotationRiskData = data;
      const quotationRiskCode = this.quotationRiskData._embedded[0];
      if (quotationRiskCode) {
        for (const key in quotationRiskCode) {
          if (quotationRiskCode.hasOwnProperty(key)) {
            const value = quotationRiskCode[key];
            console.log(`${value}`);
            this.riskCode = value;
          }
        }
      } else {
        console.log("The quotationRiskCode object is not defined.");
      }

      console.log(this.quotationRiskData, "Quotation Risk Code Data");
      console.log(this.riskCode, "Quotation Risk Code ");
      this.onCreateRiskSection()

    })
  }
  selectedRiskLevelPremium(data: any) {
    log.info("RiskLevelPremium::::::", data);
    // this.sharedService.setPremiumResponse(data);

    const riskLevelPremiumString = JSON.stringify(data);
    sessionStorage.setItem('riskLevelPremium', riskLevelPremiumString);

    this.selectedQuotationNo = this.quotationNo;
  }
  // SelectCover() {
  //   this.sharedService.setSelectedCover(this.selectedQuotationNo);
  //   sessionStorage.setItem('quickQuotationNum', this.selectedQuotationNo);
  //   sessionStorage.setItem('quickQuotationCode', this.quotationCode);

  //   this.router.navigate(['/home/gis/quotation/quote-summary']);

  // }
  SelectCover() {
    if (this.passedQuotationNumber == null) {
      if (this.quotationData != null && this.quotationData._embedded.length > 0) {
        // Quotation data is not empty
        console.log("QUOTATION DATA IS NOT EMPTY")
        // this.sharedService.setSelectedCover(this.quotationNo);
        const quotationNumberString = JSON.stringify(this.quotationNo);
        sessionStorage.setItem('quotationNumber', quotationNumberString);

        sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        sessionStorage.setItem('quickQuotationCode', this.quotationCode);

        this.router.navigate(['/home/gis/quotation/quote-summary']);
      } else {
        console.log("QUOTATION DATA IS  EMPTY")

        // Quotation data is empty, call createQuotation method
        this.createQuotation();
        this.getQuotationNumber();

      }

    } else {
      this.createQuotationRisk();
      // this.sharedService.setSelectedCover(this.passedQuotationNumber);
      const quotationNumberString = JSON.stringify(this.passedQuotationNumber);
        sessionStorage.setItem('quotationNumber', quotationNumberString);

      this.router.navigate(['/home/gis/quotation/quote-summary']);

    }

  }
  getQuotationNumber(): Promise<String> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.quotationNo)
        log.debug("Quotation Number has been generated", this.quotationNo)
        // this.sharedService.setSelectedCover(this.quotationNo);
        const quotationNumberString = JSON.stringify(this.quotationNo);
        sessionStorage.setItem('quotationNumber', quotationNumberString);

        sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        sessionStorage.setItem('quickQuotationCode', this.quotationCode);
        this.router.navigate(['/home/gis/quotation/quote-summary']);
      }, 2000)
    })
  }
  callQuotationUtilsService() {
    this.quotationService.quotationUtils(this.passedQuotationCode == null ? this.quotationCode : this.passedQuotationCode).subscribe({
      next: (res) => {
        this.computationDetails = res;

        // Update the underwritingYear to the current year
        this.computationDetails.underwritingYear = new Date().getFullYear();

        // Modify the prorata field for all risks
        this.computationDetails.risks.forEach((risk: any) => {
          risk.prorata = 'F';
          risk.limits.forEach((limit: any) => {
            limit.multiplierDivisionFactor = 1
          });
        });
        this.computePremiumQuickQuote();
        log.debug("Updated computational details", this.computationDetails); // Log the updated data

      },
      error: (error: HttpErrorResponse) => {
        log.info(error);
        this.globalMessagingService.displayErrorMessage('Error', 'Error, you cannot compute premium, check quotation details and try again.');
      }
    });
  }
  // Function to be called when you want to re-fetch the data
  //  reloadQuotationDetails() {
  //   // Call the quotationUtils service again
  //   this.callQuotationUtilsService();
  // }

  // Your existing computeQuotePremium function
  computeQuotePremium() {
    // Call the quotationUtils service for the first time
    this.callQuotationUtilsService();
  }
  extractSectionCodes(risks: any[]): void {
    risks.forEach((risk) => {
      if (risk.limits && Array.isArray(risk.limits)) {
        risk.limits.forEach((limit) => {
          const sectionCode = limit.section && limit.section.code;
          if (sectionCode !== undefined && !this.sectionCodesArray.includes(sectionCode)) {
            this.sectionCodesArray.push(sectionCode);
          }
        });
      }
    });

    console.log('Section Codes Array:', this.sectionCodesArray);
  }

  /**Compute premium adding additional benefit */
  computePremiumQuickQuote() {

    this.quotationService.premiumComputationEngine(this.computationDetails).subscribe(
      {
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed');
          const premiums = res;
          console.log(res)
          const newriskLevelPremiums = res.riskLevelPremiums;


          // Iterate through the cover types in the first payload
          for (let i = 0; i < this.riskLevelPremiums.length; i++) {
            const coverTypeFirstPayload = this.riskLevelPremiums[i].coverTypeDetails;

            // Find matching cover type code in the second payload
            const matchingCoverTypeSecondPayload = newriskLevelPremiums.find(
              (coverTypeSecondPayload) => coverTypeSecondPayload.coverTypeDetails.coverTypeCode === coverTypeFirstPayload.coverTypeCode
            );

            // If a match is found, replace the data in the first payload
            if (matchingCoverTypeSecondPayload) {
              this.riskLevelPremiums[i] = matchingCoverTypeSecondPayload;
            }
          }

          log.debug("Updated Risk Level Premium:", this.riskLevelPremiums)

          // Loop through each item in riskLevelPremiums and push it to riskpremiumsArray
          // newriskLevelPremiums.forEach(item => {
          //   this.riskLevelPremiums.push(item);
          // });
          // log.debug("Updated Risk Level Premium:", this.riskLevelPremiums)

          // Extract the cover types from the computationalDetails
          const coverTypesToReplace = this.computationDetails.risks.map((risk) => risk.subclassCoverTypeDto.coverTypeCode);
          log.debug("COVERTYPE TO REPLACE", coverTypesToReplace)

          // Loop through the risks in the premiumPayload
          for (let i = 0; i < this.premiumPayload.risks.length; i++) {
            const currentRisk = this.premiumPayload.risks[i];
            const currentCoverTypeCode = currentRisk.subclassCoverTypeDto.coverTypeCode;

            // Check if the cover type code is in the list of cover types to replace
            if (coverTypesToReplace.includes(currentCoverTypeCode)) {
              // Find the corresponding risk in the computationalDetails
              const correspondingRisk = this.computationDetails.risks.find(
                (risk) => risk.subclassCoverTypeDto.coverTypeCode === currentCoverTypeCode
              );

              // Replace the risk in the premiumPayload with the one from the computationalDetails
              this.premiumPayload.risks[i] = correspondingRisk;

            }
          }
          console.log(JSON.stringify(this.premiumPayload, null, 2));
          log.debug("UPDATED PREMIUM PAYLOAD", this.premiumPayload)


        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        }
      }
    )
  }
  // ComputePremiumFinal(){
  //   this.computeQuotePremium()
  //   log.debug("SEDRF",this.computationDetails)
  // }
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
      // cc: ['', Validators.required],
      // bcc: ['', Validators.required],
    });
  }
  emaildetails() {
    const currentDate = new Date();
    const current = currentDate.toISOString();
    const emailForm = this.emailForm.value;

    console.log(this.clientDetails)
    // console.log(this.emailForm.value)

    emailForm.address = [
      this.selectedEmail
    ],
      emailForm.clientCode = this.passedClientCode;
    emailForm.emailAggregator = "N";
    emailForm.from = this.userDetails.emailAddress;
    emailForm.fromName = "Turnkey Africa";
    emailForm.message = "Attached is your Quotation Details";
    emailForm.sendOn = current;
    emailForm.status = "D";
    emailForm.subject = "Quotation Details";
    emailForm.systemCode = "0";
    emailForm.systemModule = "NB";
    // emailForm.cc = this.selectedEmail;
    // emailForm.bcc = this.selectedEmail;

    this.quotationService.sendEmail(emailForm).subscribe(
      {
        next: (res) => {
          const response = res
          this.globalMessagingService.displaySuccessMessage('Success', 'Email sent successfully');
          console.log(res)
        }, error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        }
      })
    console.log('Submitted payload:', JSON.stringify(emailForm));
  }

}
