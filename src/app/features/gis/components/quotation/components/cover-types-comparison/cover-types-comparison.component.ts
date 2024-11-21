import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../../../services/product/product.service';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { ClientService } from '../../../../../entities/services/client/client.service'; import { BinderService } from '../../../setups/services/binder/binder.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubClassCoverTypesService } from '../../../setups/services/sub-class-cover-types/sub-class-cover-types.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../../../services/quotations/quotations.service';
import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Logger } from '../../../../../../shared/shared.module'
import { forkJoin } from 'rxjs';
import { PremiumComputationRequest, PremiumRate, QuotationDetails, QuotationProduct, RiskInformation, SectionDetail, TaxInformation, subclassCovertypeSection } from '../../data/quotationsDTO'
import { Premiums, subclassSection } from '../../../setups/data/gisDTO';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { SubClassCoverTypesSectionsService } from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service'
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { Router } from '@angular/router';
const log = new Logger('CoverTypesComparisonComponent');

@Component({
  selector: 'app-cover-types-comparison',
  templateUrl: './cover-types-comparison.component.html',
  styleUrls: ['./cover-types-comparison.component.css']
})
export class CoverTypesComparisonComponent {
  isCollapsibleOpen = false;
  // isModalOpen = false;
  selectedOption: string = 'email';
  // checked: boolean = false;
  clientName: string = '';
  contactValue: string = '';
  steps = stepData;
  coverTypes: any[];

  quickQuotationNumbers: any;
  quotationDetails: any;

  quickQuoteSectionList: any;
  selectedSections: any[] = [];
  sections: any[] = [];
  filteredSection: any;
  passedSections: any[] = [];
  passedMandatorySections: any[] = [];

  sectionDetailsForm: FormGroup;
  checkedSectionCode: any;
  checkedSectionDesc: any;
  checkedSectionType: any;
  sectionArray: any;
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


  typedWord: number | null = null;
  isChecked: boolean = false;
  premiumPayload: PremiumComputationRequest;
  premiumResponse: any;
  riskLevelPremiums: any;
  passedCovertypes: any;

  user: any;
  userDetails: any
  userBranchId: any;

  quotationCode: string;
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
  passedNewClientDetails: any;

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
  temporaryPremiumList: Premiums[] = [];

  passedNumber: string;
  passedQuotationCode: string;
  passedQuotationDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  currentExpandedIndex: number = -1;
  isTempPremiumListUpdated: boolean = false;
  lastUpdatedCoverTypeCode = null; // Initially set to null
  isUpdateQuoteCalled: boolean = false;
  selectedCoverType: any;


  // @ViewChild('openModalButton') openModalButton!: ElementRef;
  @ViewChild('openModalButton', { static: false }) openModalButton!: ElementRef;
  isModalOpen: boolean = false;

  



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
    public globalMessagingService: GlobalMessagingService,
    public premiumRateService: PremiumRateService,

  ) { }
  public isClauseDetailsOpen = false;
  public isLimitsDetailsOpen = false;
  public isExcessDetailsOpen = false;
  public isBenefitsDetailsOpen = false;


  ngOnInit(): void {
    this.passedNumber = sessionStorage.getItem('passedQuotationNumber');
    log.debug("Passed Quotation Number:", this.passedNumber);
    this.passedQuotationCode = sessionStorage.getItem('passedQuotationCode');
    log.debug("Passed Quotation code:", this.passedQuotationCode);


    const premiumComputationRequestString = sessionStorage.getItem('premiumComputationRequest');
    this.premiumPayload = JSON.parse(premiumComputationRequestString);


    log.debug("PREMIUM PAYLOAD", this.premiumPayload);
    const limits = this.premiumPayload?.risks
    this.extractSectionCodes(limits);

    const subclassCoverTypeString = sessionStorage.getItem('subclassCoverType');
    this.passedCovertypes = JSON.parse(subclassCoverTypeString);
    log.debug("SUBCLASS PAYLOAD", this.passedCovertypes);

    const premiumResponseString = sessionStorage.getItem('premiumResponse');
    this.premiumResponse = JSON.parse(premiumResponseString);

    log.debug("PREMIUM RESPONSE", this.premiumResponse);
    this.riskLevelPremiums = this.premiumResponse?.riskLevelPremiums;
    // this.sumInsuredValue = this.premiumPayload?.risks[0].limits[0].limitAmount;
    this.sumInsuredValue = sessionStorage.getItem('sumInsuredValue');
   
    log.debug("Quick Quote Quotation SUM INSURED VALUE:", this.sumInsuredValue);
    // this.selectedSectionCode = this.premiumPayload?.risks[0].limits[0].section.code

    this.selectedCoverType = this.riskLevelPremiums[0].coverTypeDetails.coverTypeCode;
    log.info("selectedCovertype when the page loads:", this.selectedCoverType)
    this.selectedSubclassCode = this.premiumPayload?.risks[0].subclassSection.code

    const storedMandatorySectionsString = sessionStorage.getItem('mandatorySections');
    this.quickQuoteSectionList = JSON.parse(storedMandatorySectionsString);


    log.debug("Quick Quote Quotation Sections:", this.quickQuoteSectionList);
    const storedClientDetailsString = sessionStorage.getItem('clientDetails');
    this.passedClientDetails = JSON.parse(storedClientDetailsString);


    log.debug("Client details", this.passedClientDetails);
    this.passedClientCode = this.passedClientDetails?.id;
    this.clientcode = this.passedClientCode;
    log.debug("Client code", this.passedClientCode);

    log.debug("Selected Client Name", this.selectedClientName);
    this.passedQuotationSource = sessionStorage.getItem('quotationSource');
    log.debug("Source details", this.passedQuotationSource);
    // this.selectedEmail = this.passedClientDetails?.emailAddress;
    // this.selectedPhoneNo = this.passedClientDetails?.phoneNumber;

    const newClientDetailsString = sessionStorage.getItem('newClientDetails');
    this.passedNewClientDetails = JSON.parse(newClientDetailsString);
    log.debug("New Client Details", this.passedNewClientDetails);

    if (this.passedClientDetails) {
      log.info("EXISTING CLIENT")
      this.selectedClientName = this.passedClientDetails?.firstName + ' ' + this.passedClientDetails?.lastName
      this.selectedEmail = this.passedClientDetails?.emailAddress;
      this.selectedPhoneNo = this.passedClientDetails?.phoneNumber;
    } else {
      log.info("NEW CLIENT")
      this.selectedClientName = this.passedNewClientDetails?.inputClientName;
      log.info("Selected Name:", this.selectedClientName)

      this.selectedEmail = this.passedNewClientDetails?.inputClientEmail;
      log.info("Selected Email:", this.selectedEmail)

      this.selectedPhoneNo = this.passedNewClientDetails?.inputClientPhone;
      log.info("Selected Phone:", this.selectedPhoneNo)

    }


    this.createQuotationForm();
    this.getuser();
    this.createRiskDetailsForm();
    this.createEmailForm();
    this.createSmsForm();




    this.formData = sessionStorage.getItem('quickQuoteFormDetails');

    if (this.formData) {
      log.debug("MY TRIAL", JSON.parse(this.formData));
    } else {
      log.debug("MY TRIAL", "No data found");
    }



    this.createSectionDetailsForm();

  }

  toggleCollapsible(index: number) {
    if (this.currentExpandedIndex === index) {
      // If the clicked card is already expanded, collapse it
      this.currentExpandedIndex = -1;
      this.isCollapsibleOpen = false; // Close the collapsible section
    } else {
      // Expand the clicked card and collapse any other expanded card
      this.currentExpandedIndex = index;
      this.isCollapsibleOpen = true; // Open the collapsible section
    }
  }


  // Function to check if a card is expanded
  isCardExpanded(index: number): boolean {
    return this.currentExpandedIndex === index;
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
  passCovertypeDesc(selectedCoverCode:any) {
    log.debug("data from passcovertpes", selectedCoverCode);
    const passedCoverObject = this.riskLevelPremiums.find(coverDesc => coverDesc.coverTypeDetails.coverTypeCode === selectedCoverCode); 
    log.debug("passed covertype object:", passedCoverObject);
   
    this.passedCovertypeDescription = passedCoverObject.coverTypeDetails.coverTypeShortDescription;
    this.passedCovertypeCode = selectedCoverCode;
    this.passedCoverTypeShortDes = passedCoverObject.coverTypeDetails.coverTypeShortDescription;
    log.debug("Passed covertype desc:",this.passedCoverTypeShortDes)
    log.debug("Passed covertype desc:",this.passedCovertypeDescription)
    this.filteredSection = this.quickQuoteSectionList?.filter(section =>

      this.passedCoverTypeShortDes == "COMP" ?
        section.coverTypeShortDescription == "COMPREHENSIVE" :
        section.coverTypeShortDescription == this.passedCoverTypeShortDes
    );
    log.debug("Filtered Section", this.filteredSection);
    this.passedSections = this.quickQuoteSectionList?.filter(section => section.coverTypeCode == this.passedCovertypeCode);
    log.debug("Passed Section", this.passedSections);

    this.loadSubclassSectionCovertype();
    this.loadAllPremiums();
  }


  // passedClient(data: any) {
  //   log.debug("client Code;", data);
  //   this.clientcode = data;
  //   this.getClient();
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
      // Add all elements found in covertypeSpecificSections to passedSections
      this.passedMandatorySections = this.covertypeSpecificSection;


      console.log('Selected Sections loadSubclass Section:', this.passedMandatorySections);
      sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));

      this.findTemporaryPremium();
    })

  }
  // findTemporaryPremium(){
  //   const selectedBinder = this.premiumPayload?.risks[0].binderDto.code;
  //   const selectedSubclassCode = this.premiumPayload?.risks[0].subclassSection.code;
  //   const sections = this.passedMandatorySections;

  //   // Create an array to store observables returned by each service call
  //   const observables = sections?.map(section => {
  //     return this.premiumRateService.getAllPremiums(section.sectionCode, selectedBinder, selectedSubclassCode);
  //   });

  //   // Use forkJoin to wait for all observables to complete
  //   forkJoin(observables).subscribe(data => {
  //     // data is an array containing the results of each service call
  //     this.temporaryPremiumList = data.flat(); // Flatten the array if needed
  //     this.cdr.detectChanges();
  //     log.debug("Premium List", this.temporaryPremiumList)
  //   });
  // }
  findTemporaryPremium() {
    // Check if the temporary premium list has been updated for the same coverTypeCode
    log.debug("Last updated Covertype:", this.lastUpdatedCoverTypeCode)
    log.debug("New updated Covertype:", this.passedCovertypeCode)
    if (this.isTempPremiumListUpdated && this.lastUpdatedCoverTypeCode === this.passedCovertypeCode) {
      console.log("Using existing temporaryPremiumList for coverTypeCode:", this.passedCovertypeCode);
      // If the codes match, use the existing temporaryPremiumList
      this.cdr.detectChanges();
      log.debug("Premium List", this.temporaryPremiumList);
      return; // Exit the method, no need to call the service
    }

    const selectedBinder = this.premiumPayload?.risks[0].binderDto.code;
    const selectedSubclassCode = this.premiumPayload?.risks[0].subclassSection.code;
    const sections = this.passedMandatorySections;

    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, selectedBinder, selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe(data => {
      // data is an array containing the results of each service call
      this.temporaryPremiumList = data.flat(); // Flatten the array if needed
      this.cdr.detectChanges();
      log.debug("Premium List", this.temporaryPremiumList);
      // Reset the boolean since we've fetched new data
      this.isTempPremiumListUpdated = false;
    });
  }


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



  createRiskSection(payload: any) {
    // Your implementation for createRiskSection
    console.log('createRiskSection called with payload:', payload);
    sessionStorage.setItem("Added Benefit", JSON.stringify(payload));
  }
  loadAllPremiums() {
    const selectedBinder = this.premiumPayload?.risks[0].binderDto.code;
    const selectedSubclassCode = this.premiumPayload?.risks[0].subclassSection.code;
    const sections = this.passedSections;

    // Create an array to store observables returned by each service call
    const observables = sections?.map(section => {
      return this.premiumRateService.getAllPremiums(section.sectionCode, selectedBinder, selectedSubclassCode);
    });

    // Use forkJoin to wait for all observables to complete
    forkJoin(observables).subscribe(data => {
      // data is an array containing the results of each service call
      this.premiumList = data.flat(); // Flatten the array if needed
      this.cdr.detectChanges();
      log.debug("Premium List", this.premiumList)
    });
  }



  onCreateRiskSection() {
    console.log('Selected Sections:', this.passedSections);
    console.log('Premium Rates:', this.premiumList);

    const premiumRates: PremiumRate[] = this.premiumList;

    if (premiumRates.length !== this.passedSections.length) {
      console.error("Number of premium rates doesn't match the number of sections");
      return;
    }

    const payload = this.passedSections.map((section) => {
      // Provide a default structure for premiumRate
      const defaultPremiumRate: PremiumRate = {
        sectionCode: null,
        sectionShortDescription: null,
        multiplierDivisionFactor: null,
        multiplierRate: null,
        rate: null,
        divisionFactor: 1, // Default value if not provided
        rateType: "FXD",   // Default value if not provided
        sumInsuredLimitType: null,
        sumInsuredRate: null,
        limitAmount: null,
      };

      // Find corresponding premium rate for the section or use default values
      const premiumRate = premiumRates.find(rate => rate.sectionCode === section.sectionCode) || defaultPremiumRate;

      return {
        calcGroup: 1,
        code: section.code,
        compute: "Y",
        description: premiumRate.sectionShortDescription || section.sectionShortDescription,
        freeLimit: 0,
        multiplierDivisionFactor: premiumRate?.multiplierDivisionFactor,
        multiplierRate: premiumRate?.multiplierRate,
        premiumAmount: 0,
        premiumRate: premiumRate?.rate || 0,
        rateDivisionFactor: premiumRate?.divisionFactor || 1,
        rateType: premiumRate?.rateType || "FXD",
        rowNumber: 1,
        sumInsuredLimitType: premiumRate?.sumInsuredLimitType || null,
        sumInsuredRate: premiumRate?.sumInsuredRate || 0,
        sectionShortDescription: section.sectionShortDescription,
        sectionCode: section.sectionCode,
        limitAmount: premiumRate?.limitAmount != null ? premiumRate.limitAmount : section.limitAmount ? section.limitAmount : this.sumInsuredValue,
      };
    });

    this.sectionArray = payload;
    log.debug("THE SECTION ARRAY PASSED TO SERVICE", this.sectionArray);

    this.quotationService.createRiskSection(this.riskCode, this.sectionArray).subscribe(data => {
      try {
        this.temporaryPremiumList = this.temporaryPremiumList.filter(
          (premium) => !this.passedSections.some((section) => section.code === premium.code)
        );
        log.debug("THE UPDATED TEMP PREMIUM LIST:", this.temporaryPremiumList);
        this.isTempPremiumListUpdated = true;
        this.lastUpdatedCoverTypeCode = this.passedCovertypeCode;

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Section Created' });
        this.sectionDetailsForm.reset();
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error, try again later' });
      }
      this.computeQuotePremium();
    });
  }




  // getClient() {
  //   this.clientService.getClientById(this.clientcode).subscribe(data => {
  //     this.clientDetails = data;
  //     log.debug("Selected Client Details", this.clientDetails);
  //     this.selectedClientName = this.clientDetails.firstName + ' ' + this.clientDetails.lastName
  //     log.debug("Selected Client Name", this.selectedClientName);
  //     this.selectedEmail = this.clientDetails.emailAddress;

  //     this.selectedPhoneNo=this.clientDetails.phoneNumber;

  //   })
  // }

  /******************NEW PREMIUM COMPUTATION ENGINE **************/



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
    this.userBranchId = this.userDetails?.branchId;
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
    quoteForm.bindCode = this.premiumPayload?.risks[0].binderDto.code;
    quoteForm.clientCode = this.passedClientDetails?.id
    quoteForm.clientType = "I";
    quoteForm.currencyCode = this.premiumPayload?.risks[0].binderDto.currencyCode;
    quoteForm.currencySymbol = this.selectedCurrency;
    quoteForm.productCode = this.premiumPayload?.product.code;
    quoteForm.source = this.passedQuotationSource && this.passedQuotationSource[0]?.code || undefined;
    quoteForm.withEffectiveFromDate = this.premiumPayload?.risks[0].withEffectFrom;
    quoteForm.withEffectiveToDate = this.premiumPayload?.risks[0].withEffectTo;

    this.quotationService.createQuotation(quoteForm, this.user).subscribe(data => {
      this.quotationData = data;
      this.quotationCode = this.quotationData._embedded[0].quotationCode;
      this.quotationNo = this.quotationData._embedded[0].quotationNumber;
      console.log("Quotation results:", this.quotationData)
      log.debug("Quotation Number", this.quotationNo);
      log.debug("Quotation Code", this.quotationCode);
      if (this.quotationNo) {
        // this.loadClientQuotation()
      }
      this.createQuotationRisk()

    })
  }
  loadClientQuotation() {
    log.debug("quotation Number generated after adding a benefit:", this.quotationNo)
    log.debug("passed quotation Number:", this.passedNumber)
    let defaultCode
    if (this.quotationNo) {
      defaultCode = this.quotationNo;
      log.debug("QUOTE Number", defaultCode)
    } else {
      defaultCode = this.passedNumber
      log.debug(" PASSED QUOTE Number", defaultCode)

    }

    this.quotationService.getClientQuotations(defaultCode).subscribe(data => {
      this.quotationDetails = data;
      log.debug("Quotation Details:", this.quotationDetails)
      this.quotationNo = this.quotationDetails.no;
      log.debug("Quotation Number:", this.quotationNo)
      this.taxInformation = this.quotationDetails.taxInformation
      log.debug("Tax information", this.taxInformation)

    })
  }
  createQuotationRisk() {
    const risk = this.riskDetailsForm.value;
    risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    risk.coverTypeCode = this.passedCovertypeCode;
    risk.coverTypeShortDescription = this.passedCovertypeDescription;
    risk.insuredCode = this.passedClientDetails?.id
    risk.productCode = this.premiumPayload?.product.code;
    risk.dateWithEffectFrom = this.premiumPayload?.risks[0].withEffectFrom;
    risk.dateWithEffectTo = this.premiumPayload?.risks[0].withEffectTo;
    risk.subClassCode = this.premiumPayload?.risks[0].subclassSection.code;
    risk.itemDescription = "volvo 4e";

    // FROM DYNAMIC FORM
    risk.propertyId = this.premiumPayload?.risks[0].propertyId;
    console.log('Quick Form Risk', risk);
    const riskArray = [risk];
    log.debug("quotation code:", this.quotationCode)
    log.debug("passed quotation code:", this.passedQuotationCode)
    let defaultCode
    if (this.quotationCode) {
      defaultCode = this.quotationCode;
      log.debug("IF STATEMENT QUOTE CODE", defaultCode)
    } else {
      defaultCode = this.passedQuotationCode
      log.debug("IF STATEMENT PASSED QUOTE CODE", defaultCode)

    }
    log.debug("default code:", defaultCode)

    return this.quotationService.createQuotationRisk(defaultCode, riskArray).subscribe(data => {
      this.quotationRiskData = data;
      log.debug("This is the quotation risk data", data)
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

  selectCover() {
    log.debug("PASSED QUOTATION NUMBER:", this.passedNumber);
    log.debug("TYPE OF PASSED QUOTATION NUMBER:", typeof this.passedNumber);
    log.debug("IS PASSED QUOTATION NUMBER TRUTHY:", Boolean(this.passedNumber));
    log.debug("IS PASSED QUOTATION NUMBER 'null':", this.passedNumber === "null");
    log.debug("PASSED QUOTATION DATA:", this.quotationData);

    // Check if passedNumber exists (not null, empty, or 'null')
    if (this.passedNumber && this.passedNumber.trim() !== '' && this.passedNumber.toLowerCase() !== 'null') {

      // Check if quotation data exists
      if (this.quotationData != null && this.quotationData._embedded.length > 0) {
        // Both passedNumber and quotationData exist, execute desired action here
        log.debug("BOTH PASSED QUOTATION NUMBER AND QUOTATION DATA EXIST");

        // Check if updateQuote() has been called
        if (this.isUpdateQuoteCalled) {
          // If updateQuote() was called, navigate to policy summary
          log.debug("updateQuote() WAS CALLED, NAVIGATING TO POLICY SUMMARY");
          this.router.navigate(['/home/gis/quotation/policy-summary']);
        } else {
          // If updateQuote() was NOT called, call createQuotationRisk and then navigate
          log.debug("updateQuote() WAS NOT CALLED, CREATING QUOTATION RISK");
          this.createQuotationRisk();

          const quotationNumberString = JSON.stringify(this.passedNumber);
          sessionStorage.setItem('quotationNumber', quotationNumberString);

          // Navigate to policy summary after creating the quotation risk
          this.router.navigate(['/home/gis/quotation/policy-summary']);
        }

      }
      log.debug("PASSED QUOTATION NUMBER EXISTS, BUT QUOTATION DATA IS EMPTY");
      if (this.isUpdateQuoteCalled) {
        // If updateQuote() was called, navigate to policy summary
        log.debug("updateQuote() WAS CALLED, NAVIGATING TO POLICY SUMMARY");
        this.router.navigate(['/home/gis/quotation/quote-summary']);
      } else {
        // If updateQuote() was NOT called, call createQuotationRisk and then navigate
        log.debug("updateQuote() WAS NOT CALLED, CREATING QUOTATION RISK");
        this.createQuotationRisk();

        const quotationNumberString = JSON.stringify(this.passedNumber);
        sessionStorage.setItem('quotationNumber', quotationNumberString);

        // Navigate to policy summary after creating the quotation risk
        this.router.navigate(['/home/gis/quotation/quote-summary']);
      }
      // // Create a new quotation risk
      // this.createQuotationRisk();

      // const quotationNumberString = JSON.stringify(this.passedNumber);
      // sessionStorage.setItem('quotationNumber', quotationNumberString);

      // // Navigate to quotation summary
      // this.router.navigate(['/home/gis/quotation/quote-summary']);

    } else {
      // If passedNumber doesn't exist, check the quotation data and handle accordingly
      if (this.quotationData != null && this.quotationData._embedded.length > 0) {
        // Quotation data is not empty
        console.log("QUOTATION DATA IS NOT EMPTY");

        const quotationNumberString = JSON.stringify(this.quotationNo);
        sessionStorage.setItem('quotationNumber', quotationNumberString);
        sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        sessionStorage.setItem('quickQuotationCode', this.quotationCode);

        this.router.navigate(['/home/gis/quotation/quote-summary']);
      } else {
        // Quotation data is empty, create a new quotation
        console.log("QUOTATION DATA IS EMPTY");
        this.createQuotation();
        this.getQuotationNumber();
      }
    }
  }


  // selectQuote(){
  //   if(this.passedQuotationNumber == null){
  //         this.SelectCover();
  //   }else{
  //     this.createQuotationRisk();
  //     // this.sharedService.setSelectedCover(this.passedQuotationNumber);
  //     const quotationNumberString = JSON.stringify(this.passedQuotationNumber);
  //     sessionStorage.setItem('quotationNumber', quotationNumberString);

  //     this.router.navigate(['/home/gis/quotation/quote-summary']);

  //   }
  // }
  getQuotationNumber(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.quotationNo !== undefined) {
          resolve(this.quotationNo);
          log.debug("Quotation Number has been generated", this.quotationNo);

          // Check if this.quotationNo is not undefined before stringifying
          if (this.quotationNo !== undefined) {
            const quotationNumberString = JSON.stringify(this.quotationNo);
            sessionStorage.setItem('quotationNumber', quotationNumberString);

            sessionStorage.setItem('quickQuotationNum', this.quotationNo);
            sessionStorage.setItem('quickQuotationCode', this.quotationCode);
            this.router.navigate(['/home/gis/quotation/quote-summary']);
          }
        } else {
          // Handle the case when this.quotationNo is undefined
          // You might want to log an error or handle it appropriately
          log.error("Quotation Number is undefined");
        }
      }, 2000);
    });
  }

  callQuotationUtilsService() {
    let defaultCode
    if (this.quotationCode) {
      defaultCode = this.quotationCode;
      log.debug("IF STATEMENT QUOTE CODE", defaultCode)
    } else {
      defaultCode = this.passedQuotationCode
      log.debug("IF STATEMENT PASSED QUOTE CODE", defaultCode)

    }
    log.debug("default code:", defaultCode)
    this.quotationService.quotationUtils(defaultCode).subscribe({
      next: (res) => {
        this.computationDetails = res;

        // Update the underwritingYear to the current year
        this.computationDetails.underwritingYear = new Date().getFullYear();

        // Modify the prorata field for all risks
        this.computationDetails.risks.forEach((risk: any) => {
          risk.prorata = 'F';
          risk.limits.forEach((limit: any) => {
            limit.multiplierDivisionFactor = 1
            // limitAmount: premiumRate.LimitAmount ? premiumRate.LimitAmount : this.sumInsuredValue,
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

  computeQuotePremium() {
    // Call the quotationUtils service for the first time
    this.callQuotationUtilsService();
  }
  extractSectionCodes(risks: any[]): void {
    risks?.forEach((risk) => {
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
          this.loadClientQuotation()

          log.debug("just CKECING IF IT EXISTS", this.quotationDetails)
          log.debug("just CKECING IF IT EXISTS", this.taxInformation)

        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        }
      }
    )
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
    emailForm.from = this.userDetails?.emailAddress;
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
    this.quotationService.sendSms(payload).subscribe(
      {
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully');
        }, error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

        }

      }
    )
  }
  handleShare() {
    if (this.selectedOption === 'email') {
      this.emaildetails();
    } else if (this.selectedOption === 'sms') {
      this.sendSms();
    }
  }

  updateQuote() {
    log.debug("Passed quotation Number (raw value):", this.passedNumber);
    log.debug("Quotation Number (raw value):", this.quotationNo);

    // Convert string 'null' or 'undefined' to actual null
    if (this.passedNumber === 'null') {
      this.passedNumber = null;
    }

    if (this.quotationNo === 'null') {
      this.quotationNo = null;
    }

    // Check if either passedNumber or quotationNumber is present
    if ((this.passedNumber !== null && this.passedNumber !== undefined && this.passedNumber !== '') ||
      (this.quotationNo !== null && this.quotationNo !== undefined && this.quotationNo !== '')) {
      log.debug("CREATE RISK BECAUSE THERE IS A QUOTATION");
      this.createQuotationRisk();
    } else {
      log.debug("CREATE QUOTATION BECAUSE THERE IS NONE");
      this.createQuotation();
    }
  }

  toggleClauseDetails() {
    this.isClauseDetailsOpen = !this.isClauseDetailsOpen;
  }
  toggleLimitsDetails() {
    this.isLimitsDetailsOpen = !this.isLimitsDetailsOpen;
  }
  toggleExcessDetails() {
    this.isExcessDetailsOpen = !this.isExcessDetailsOpen;
  }
  toggleAdditionalBenefitsDetails() {
    this.isBenefitsDetailsOpen = !this.isBenefitsDetailsOpen;
  }
  getLimits(index: number) {
    return this.premiumPayload.risks[index]?.limits || [];
  }

}
