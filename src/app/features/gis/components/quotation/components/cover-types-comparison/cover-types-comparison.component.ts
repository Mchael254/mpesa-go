import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import stepData from '../../data/steps.json'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../../../shared/services/auth.service';
import { CurrencyService } from '../../../../../../shared/services/setups/currency/currency.service';
import { BinderService } from '../../../setups/services/binder/binder.service';
import { ProductsService } from '../../../setups/services/products/products.service';
import { SubclassesService } from '../../../setups/services/subclasses/subclasses.service';
import { QuotationsService } from '../../services/quotations/quotations.service';

import { SharedQuotationsService } from '../../services/shared-quotations.service';
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'

import { forkJoin, mergeMap } from 'rxjs';
import {
  Clause, Excesses, LimitsOfLiability, PremiumComputationRequest,
  premiumPayloadData, PremiumRate,
  QuotationDetails, UserDetail, QuickQuoteData
} from '../../data/quotationsDTO'
import { Premiums } from '../../../setups/data/gisDTO';
import { ClientDTO } from '../../../../../entities/data/ClientDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  SubClassCoverTypesSectionsService
} from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalMessagingService } from '../../../../../../shared/services/messaging/global-messaging.service'
import { PremiumRateService } from '../../../setups/services/premium-rate/premium-rate.service';
import { Router } from '@angular/router';
import { NgxCurrencyConfig } from "ngx-currency";

const log = new Logger('CoverTypesComparisonComponent');
declare var bootstrap: any; // Ensure Bootstrap is available
declare var $: any;

@Component({
  selector: 'app-cover-types-comparison',
  templateUrl: './cover-types-comparison.component.html',
  styleUrls: ['./cover-types-comparison.component.css']
})
export class CoverTypesComparisonComponent implements OnInit, OnDestroy {
  selectedOption: string = 'email';
  // checked: boolean = false;
  clientName: string = '';
  steps = stepData;
  coverTypes: any[];

  quotationDetails: any;

  quickQuoteSectionList: any;
  selectedSections: any[] = [];
  sections: any[] = [];
  filteredSection: any;
  passedSections: any[] = [];
  passedMandatorySections: any[] = [];

  sectionDetailsForm: FormGroup;
  sectionArray: any;
  taxInformation: any;
  riskInformation: any
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
  formData: any;
  isChecked: boolean = false;
  premiumPayload: PremiumComputationRequest;
  premiumResponse: any;
  riskLevelPremiums: any;
  passedCovertypes: any;

  user: any;
  userDetails: any
  userBranchId: any;

  quotationCode: number;
  quotationData: any;
  quotationNo: string;
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
  passedQuotationCode: number;
  passedQuotationDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  currentExpandedIndex: number = -1;
  isTempPremiumListUpdated: boolean = false;
  lastUpdatedCoverTypeCode = null; // Initially set to null
  isUpdateQuoteCalled: boolean = false;
  selectedCoverType: number;


  // @ViewChild('openModalButton') openModalButton!: ElementRef;
  @ViewChild('openModalButton', { static: false }) openModalButton!: ElementRef;
  @ViewChild('addMoreBenefits') addMoreBenefitsModal!: ElementRef;
  isModalOpen: boolean = false;

  clauseList: Clause[] = []
  selectedClause: any;
  modalHeight: number = 200; // Initial height
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  excessesList: Excesses[] = []
  selectedExcess: any;
  limitsOfLiabiltyDetailsForm: FormGroup;
  editRiskDetailsForm: FormGroup;
  passedSelectedRisk: any;
  quotationUpdatedRiskData: unknown;
  isEditRisk: boolean;
  isAddRisk: boolean;
  selectedRisk: any;
  premiums: any;
  updatePremiumPayload: premiumPayloadData;
  newRiskLevelPremiums: any;
  quoteProductCode: any;
  showQuoteActions: boolean;

  isAddededBenefitsCalled: boolean = false;
  premiumRates: PremiumRate[] = [];
  sectionDetails: any;
  existingRisk: any;
  isReturnToQuickQuote: boolean;
  userOrgDetails: UserDetail;
  userCode: number;
  organizationId: number;
  exchangeRate: number;
  passedQuotationData: any;
  isEditQuotationDetail: boolean = false;
  storedQuotationNo: string;
  storedQuotationCode: number;
  extraRiskCode: [] = [];
  component: {
    risks: {
      binderDto: {
        code: number; maxExposure: number;
        currencyCode: number; currencyRate: number;
      }; limits: any[];
      withEffectFrom: string; withEffectTo: string; prorata: string;
      subclassSection: any; noClaimDiscountLevel: number; subclassCoverTypeDto: any;
      enforceCovertypeMinimumPremium: string;
    }[];
  };
  quoteAction: string = null
  premiumComputationPayload: PremiumComputationRequest;
  storedData: QuickQuoteData = null;
  computationPayloadCode: number;

  public currencyObj: NgxCurrencyConfig;
  private typingTimer: any;// Timer reference
  sectionToBeRemoved: number[] = [];
  inputErrors: { [key: string]: boolean } = {};


  constructor(
    public fb: FormBuilder,
    public productService: ProductsService,
    public binderService: BinderService,
    public quotationService: QuotationsService,
    public subclassService: SubclassesService,
    public currencyService: CurrencyService,
    public authService: AuthService,
    public cdr: ChangeDetectorRef,
    private messageService: MessageService,
    public sharedService: SharedQuotationsService,
    private router: Router,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public globalMessagingService: GlobalMessagingService,
    public premiumRateService: PremiumRateService,
    public spinner: NgxSpinnerService,
  ) {
  }

  public isClauseDetailsOpen = false;
  public isLimitsDetailsOpen = false;
  public isExcessDetailsOpen = false;
  public isBenefitsDetailsOpen = false;


  ngOnInit(): void {
    this.passedNumber = sessionStorage.getItem('passedQuotationNumber');
    log.debug("Passed Quotation Number:", this.passedNumber);
    this.passedQuotationCode = Number(sessionStorage.getItem('passedQuotationCode'));

    log.debug("Passed Quotation code:", this.passedQuotationCode);


    const premiumComputationRequestString = sessionStorage.getItem('premiumComputationRequest');
    this.premiumPayload = JSON.parse(premiumComputationRequestString);


    log.debug("PREMIUM PAYLOAD on ngonit", this.premiumPayload);
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
    this.selectedSubclassCode = this.riskLevelPremiums?.[0]?.coverTypeDetails?.subclassCode

    // this.selectedCoverType = this.riskLevelPremiums[0].coverTypeDetails?.coverTypeCode;
    this.selectedCoverType = this.riskLevelPremiums?.[0]?.coverTypeDetails?.coverTypeCode;

    log.info("selectedCovertype when the page loads:", this.selectedCoverType)
    if (this.selectedCoverType && this.selectedSubclassCode) {
      this.onCoverTypeChange(this.selectedCoverType)
    }

    const storedMandatorySectionsString = sessionStorage.getItem('mandatorySections');
    this.quickQuoteSectionList = JSON.parse(storedMandatorySectionsString);
    log.debug("Mandatory sections passed fROMm   QQ", this.quickQuoteSectionList)

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
    this.createLimitsOfLiabiltyForm();

    this.formData = sessionStorage.getItem('quickQuoteFormDetails');

    if (this.formData) {
      log.debug("MY TRIAL", JSON.parse(this.formData));
    } else {
      log.debug("MY TRIAL", "No data found");
    }

    this.createSectionDetailsForm();
    this.createEditRiskDetailsForm();

    const passedSelectedRiskDetailsString = sessionStorage.getItem('passedSelectedRiskDetails');
    this.passedSelectedRisk = JSON.parse(passedSelectedRiskDetailsString);

    const passedIsEditRiskString = sessionStorage.getItem('isEditRisk');
    this.isEditRisk = JSON.parse(passedIsEditRiskString);
    log.debug("isEditRisk Details:", this.isEditRisk);

    const passedIsAddRiskString = sessionStorage.getItem('isAddRisk');
    this.isAddRisk = JSON.parse(passedIsAddRiskString);
    log.debug("isAddRiskk Details:", this.isAddRisk);

    this.showQuoteActions = true;
    const showQuoteActionsString = JSON.stringify(this.showQuoteActions);
    sessionStorage.setItem('showQuoteActions', showQuoteActionsString);

    const passedQuotationDetailsString = sessionStorage.getItem(
      'passedQuotationDetails'
    );
    this.passedQuotationData = JSON.parse(passedQuotationDetailsString);
    log.debug("Passed Quotation Details", this.passedQuotationData)
    if (this.passedQuotationData) {
      this.isEditQuotationDetail = true
      this.storedQuotationCode = this.passedQuotationData?._embedded?.[0]?.quotationCode;
      this.storedQuotationNo = this.passedQuotationData?._embedded?.[0]?.quotationNumber;


    }
    this.quoteAction = sessionStorage.getItem('quoteAction')
    if (this.quoteAction === "A") {
      log.debug("ADDING A NEW RISK TO AN EXISTING QUOTATION", this.quoteAction)
    } else if (this.quoteAction === "E") {
      log.debug("EDITING AN EXISTING RISK TO AN EXISTING QUOTATION", this.quoteAction)

    }

    this.storedData = JSON.parse(sessionStorage.getItem('quickQuoteData'));
    log.debug("Stored Data", this.storedData)
    this.computationPayloadCode = this.storedData.computationPayloadCode
    this.computationPayloadCode && this.fetchPremiumComputationPyload(this.computationPayloadCode);
    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    this.currencyObj = {
      prefix: this.storedData.currency.symbol + ' ',
      allowNegative: false,
      allowZero: false,
      decimal: '.',
      precision: 0,
      thousands: currencyDelimiter,
      suffix: ' ',
      nullable: true,
      align: 'left',
    };


  }

  ngOnDestroy(): void {
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  passCovertypeDesc(selectedCoverCode: any) {
    log.debug("data from passcovertpes", selectedCoverCode);
    const passedCoverObject = this.riskLevelPremiums?.find(coverDesc => coverDesc.coverTypeDetails.coverTypeCode === selectedCoverCode);
    log.debug("passed covertype object:", passedCoverObject);

    this.passedCovertypeDescription = passedCoverObject?.coverTypeDetails.coverTypeDescription;
    this.passedCovertypeCode = selectedCoverCode;
    if (this.passedCovertypeCode) {
      log.debug("Fetch Clauses function")
      this.fetchClauses()
    }
    this.fetchExcesses()

    this.fetchLimitsOfLiability()
    this.passedCoverTypeShortDes = passedCoverObject?.coverTypeDetails.coverTypeShortDescription;
    log.debug("Passed covertype short desc:", this.passedCoverTypeShortDes)
    log.debug("Passed covertype desc:", this.passedCovertypeDescription)
    this.filteredSection = this.quickQuoteSectionList?.filter(section =>

      this.passedCoverTypeShortDes == "COMP" ?
        section.coverTypeDescription == "COMPREHENSIVE" :
        section.coverTypeShortDescription == this.passedCoverTypeShortDes
    );
    log.debug("Filtered Section", this.filteredSection);
    this.passedSections = this.quickQuoteSectionList?.filter(section => section.coverTypeCode == this.passedCovertypeCode);
    log.debug("Passed Section", this.passedSections);

    this.loadSubclassSectionCovertype();
    this.loadAllPremiums();
  }

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
      this.passedMandatorySections = this.covertypeSpecificSection;


      log.debug('Selected Sections loadSubclass Section:', this.passedMandatorySections);
      sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));

      this.findTemporaryPremium();
    })

  }

  findTemporaryPremium() {
    // Check if the temporary premium list has been updated for the same coverTypeCode
    log.debug("Last updated Covertype:", this.lastUpdatedCoverTypeCode)
    log.debug("New updated Covertype:", this.passedCovertypeCode)
    if (this.isTempPremiumListUpdated && this.lastUpdatedCoverTypeCode === this.passedCovertypeCode) {
      log.debug("Using existing temporaryPremiumList for coverTypeCode:", this.passedCovertypeCode);
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


  // onKeyUp(event: any, section: any): void {
  //   setTimeout(() => {
  //     const inputElement = event.target as HTMLInputElement;
  //     const inputValue = inputElement.value;
  //     const checkbox = document.getElementById('check_section_' + section.sectionCode) as HTMLInputElement;
  //     checkbox.checked = !!(checkbox && inputValue);
  //     section.typedWord = parseInt(inputValue, 10);
  //     section.isChecked = !!inputElement
  //     if (section.isChecked && !this.passedSections.includes(section)) {
  //       this.passedSections.push(section);
  //       log.debug('Selected Sections:', this.passedSections);
  //       sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));
  //       this.loadAllPremiums();
  //     }
  //   }, 0)
  // }
  // onKeyUp(event: any, section: any): void {
  //   clearTimeout(this.typingTimer); // Reset the timer

  //   this.typingTimer = setTimeout(() => {
  //     const inputElement = event.target as HTMLInputElement;
  //     const inputValue = inputElement.value.trim(); // Trim spaces
  //     const checkbox = document.getElementById('check_section_' + section.sectionCode) as HTMLInputElement;

  

  //     // Update checkbox state based on input value
  //     checkbox.checked = !!(checkbox && inputValue);
  //     section.typedWord = parseInt(inputValue, 10);
  //     section.isChecked = !!inputValue; // True only if input has a value

  //     if (section.isChecked) {
  //       if (!this.passedSections.includes(section)) {
  //         this.passedSections.push(section);
  //       }
  //     } else {
  //       // Remove section if input is empty
  //       this.passedSections = this.passedSections.filter(s => s !== section);
  //       const removedSectionCode = section.sectionCode;

  //       // Ensure sectionToBeRemoved is an array
  //       if (!Array.isArray(this.sectionToBeRemoved)) {
  //         this.sectionToBeRemoved = [];
  //       }

  //       // Store multiple removed sections
  //       this.sectionToBeRemoved.push(removedSectionCode);
  //       log.debug("Sections to be removed", this.sectionToBeRemoved);

  //     }

  //     // Log the selected sections
  //     console.debug('Selected Sections:', this.passedSections);

  //     // Update session storage
  //     sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));

  //     this.loadAllPremiums();
  //   }, 500); // Trigger after 500ms of no typing
  // }

  onKeyUp(event: any, section: any): void {
    clearTimeout(this.typingTimer); // Reset the timer

    this.typingTimer = setTimeout(() => {
      const inputElement = event.target as HTMLInputElement;
      const inputValue = inputElement.value.trim(); // Trim spaces
      const checkbox = document.getElementById('check_section_' + section.sectionCode) as HTMLInputElement;
      if (section.isChecked && !section.limitAmount) {
        document.getElementById(`section_${section.sectionCode}`)?.classList.add('error-border');
      } else {
        document.getElementById(`section_${section.sectionCode}`)?.classList.remove('error-border');
      }
      // Update checkbox state based on input value
      checkbox.checked = !!(checkbox && inputValue);
      section.typedWord = parseInt(inputValue, 10);
      section.isChecked = !!inputValue; // True only if input has a value
     

      if (section.isChecked) {
        this.passedSections.push(section);
        if (!this.passedSections.includes(section)) {
          this.passedSections.push(section);
        }

      } else {
        // Remove section if input is empty
        this.passedSections = this.passedSections.filter(s => s !== section);
        const removedSectionCode = section.sectionCode;

        // Ensure sectionToBeRemoved is an array
        if (!Array.isArray(this.sectionToBeRemoved)) {
          this.sectionToBeRemoved = [];
        }

        // Store multiple removed sections
        this.sectionToBeRemoved.push(removedSectionCode);
        console.debug("Sections to be removed", this.sectionToBeRemoved);
      }

      // Remove error if user types a valid value
      if (section.limitAmount) {
        this.inputErrors[section.sectionCode] = false;
      }

      console.debug('Selected Sections:', this.passedSections);
      sessionStorage.setItem("Added Benefit", JSON.stringify(this.passedSections));

      this.loadAllPremiums();
    }, 500); // Trigger after 500ms of no typing
  }



  // Function to determine the checkbox state for each row
  isSectionChecked(section: any): boolean {
    return section.isChecked || false;

  }


  createRiskSection(payload: any) {
    // Your implementation for createRiskSection
    log.debug('createRiskSection called with payload:', payload);
    sessionStorage.setItem("Added Benefit", JSON.stringify(payload));
  }

  loadAllPremiums() {
    const selectedBinder = this.premiumPayload?.risks?.[0]?.binderDto.code;
    const selectedSubclassCode = this.premiumPayload?.risks?.[0]?.subclassSection.code;
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
    log.debug('Selected Sections:', this.passedSections);
    log.debug('Premium Rates:', this.premiumList);

    const interval = setInterval(() => {
      if (this.premiumList && this.premiumList.length > 0) {
        clearInterval(interval); // Stop the polling once data is available

        log.debug('Premium Rates:', this.premiumList);
        this.premiumRates = this.premiumList;

        if (this.premiumRates.length !== this.passedSections.length) {
          log.error("Number of premium rates doesn't match the number of sections");
          return;
        }

        // Proceed with further execution
        console.log('Premium list validation passed!');
      }
    }, 100); // Check every 100ms

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
      this.premiumRates = this.premiumList
      log.debug("premium rates list", this.premiumRates)
      log.debug("premium  list", this.premiumList)
      log.debug("Current Section Code:", section.sectionCode);
      log.debug("Available Section Codes in Premium Rates:", this.premiumRates.map(rate => rate.sectionCode));

      // Ensure matching section code is found
      const premiumRate = this.premiumRates.find(rate => String(rate.sectionCode) === String(section.sectionCode)) || defaultPremiumRate;

      if (premiumRate === defaultPremiumRate) {
        log.error(`No matching premium rate found for section: ${section.sectionCode}`);
      }

      log.debug("premium rate for a specific section", premiumRate);
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

  createRiskDetailsForm() {
    this.riskDetailsForm = this.fb.group({
      insuredCode: [''],
      location: [''],
      town: ['',],
      ncdLevel: [''],
      schedules: [''],
      coverTypeCode: ['', Validators.required],
      addEdit: [''],
      quotationRevisionNumber: [''],
      code: ['',],
      quotationProductCode: ['',],
      quotationRiskNo: [''],
      quotationCode: ['', Validators.required],
      productCode: ['', Validators.required],
      propertyId: ['', Validators.required],
      value: ['', [Validators.required]],
      coverTypeShortDescription: [''],
      premium: ['', Validators.required],
      subclassCode: ['', Validators.required],
      itemDesc: ['', Validators.required],
      binderCode: ['', Validators.required],
      wef: ['', Validators.required],
      wet: ['', Validators.required],
      commissionRate: ['',],
      commissionAmount: ['',],
      prpCode: ['', Validators.required],
      clientShortDescription: [''],
      annualPremium: ['',],
      coverDays: ['',],
      clientType: ['',],
      prospectCode: ['',],
      coverTypeDescription: [''],
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
    this.userCode = this.userDetails.code
    log.debug('User Code ', this.userCode);
    if (this.userCode) {
      this.fetchUserOrgId()
    }
  }

  loadAllCurrencies() {
    this.currencyService.getAllCurrencies()
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(data => {
        this.currencyList = data;
        log.info(this.currencyList, "this is a currency list");
        const curr = this.currencyList.find(currency => currency.id == this.currencyCode);
        this.selectedCurrency = curr.name
        log.debug("Selected Currency:", this.selectedCurrency);
        this.selectedCurrencyCode = curr.id;
        log.debug("Selected Currency code:", this.selectedCurrencyCode);

        this.cdr.detectChanges()
      })
  }


  createQuotation() {
    log.debug("PREEEEMIUM PAYLOAD(CREATE QUOTATION)", this.premiumPayload)
    log.debug("User Branch", this.userBranchId)
    const quoteForm = this.quotationForm.value;
    quoteForm.quotationCode = null;
    quoteForm.quotationNumber = null;
    quoteForm.source = 37;
    quoteForm.user = this.user;
    quoteForm.clientCode = this.passedClientDetails?.id || null,
      quoteForm.productCode = this.premiumPayload?.product?.code;
    quoteForm.currencyCode = this.premiumPayload?.risks?.[0]?.binderDto?.currencyCode,
      quoteForm.currencyRate = this.exchangeRate || 1,
      quoteForm.agentCode = 0;
    quoteForm.agentShortDescription = "DIRECT";
    quoteForm.gisPolicyNumber = null;
    quoteForm.multiUser = null
    quoteForm.unitCode = null;
    quoteForm.locationCode = null;
    quoteForm.wefDate = this.premiumPayload?.dateWithEffectFrom;
    quoteForm.wetDate = this.premiumPayload?.dateWithEffectTo;
    quoteForm.bindCode = this.premiumPayload?.risks?.[0]?.binderDto?.code;
    quoteForm.binderPolicy = null;
    quoteForm.divisionCode = null;
    quoteForm.subAgentCode = null;
    quoteForm.clientType = "C";
    quoteForm.prospectCode = null;
    quoteForm.branchCode = this.userBranchId || 1,
      quoteForm.marketerAgentCode = null;
    quoteForm.comments = null;
    quoteForm.polPipPfCode = null;
    quoteForm.endorsementStatus = null;
    quoteForm.polEnforceSfParam = null;
    quoteForm.creditDateNotified = null;
    quoteForm.introducerCode = null;
    quoteForm.internalComments = null;
    quoteForm.polPropHoldingCoPrpCode = null;
    quoteForm.chequeRequisition = null;


    this.quotationService.processQuotation(quoteForm).subscribe(data => {
      this.quotationData = data;
      this.quotationCode = this.quotationData._embedded.quotationCode;
      this.quotationNo = this.quotationData._embedded.quotationNumber;
      log.debug("Quotation results:", this.quotationData)
      log.debug("Quotation Number(Process quotation)", this.quotationNo);
      log.debug("Quotation Code", this.quotationCode);
      if (this.quotationNo) {
        const quotationNumberString = JSON.stringify(this.quotationNo);
        sessionStorage.setItem('quotationNumber', quotationNumberString);
      }
      this.createQuotationRisk();
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
      log.debug("Quotation Details-covertype comparison:", this.quotationDetails)
      this.quotationNo = this.quotationDetails.quotationNo;
      log.debug("Quotation Number when quotation is loaded:", this.quotationNo)
      this.taxInformation = this.quotationDetails.taxInformation
      log.debug("Tax information", this.taxInformation)
      this.addLimitsOfLiability()
      this.selectedRisk = this.quotationDetails.riskInformation
      log.debug("Selected Risk", this.selectedRisk)
      if (this.selectedRisk) {
        this.addClauses()
      }
    })
  }

  createQuotationRisk() {

    log.debug("quotation code:", this.quotationCode)
    log.debug("passed quotation code:", this.passedQuotationCode)
    log.debug("stored quote code when editing quote details or 2nd stepeer clicked", this.storedQuotationCode)
    let defaultCode
    if (this.quotationCode) {
      defaultCode = this.quotationCode;
      log.debug("IF STATEMENT QUOTE CODE", defaultCode)

    } else if (this.passedQuotationCode) {
      defaultCode = this.passedQuotationCode
      log.debug("IF STATEMENT PASSED QUOTE CODE", defaultCode)

    } else if (this.storedQuotationCode) {
      defaultCode = this.storedQuotationCode
      log.debug("F STATEMENT stored QUOTE CODE(2nd stepper called):", defaultCode)

    }

    // Find the selected risk from premiumPayload.risks based on the selectedCoverType value
    const selectedRisk = this.premiumPayload?.risks.find(
      (risk) => risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType
    );

    log.debug("Selected Risk", selectedRisk)
    const risk = this.riskDetailsForm.value;
    // risk.quotationProductCode =

    risk.coverTypeCode = this.passedCovertypeCode;
    risk.quotationCode = defaultCode;
    risk.productCode = this.premiumPayload?.product.code;
    risk.propertyId = this.premiumPayload?.risks[0].propertyId;
    risk.value = this.sumInsuredValue;
    risk.coverTypeShortDescription = this.passedCoverTypeShortDes;
    risk.subclassCode = this.premiumPayload?.risks[0].subclassSection.code;
    if (selectedRisk) {
      // Populate the risk object with details from the selected risk
      risk.itemDesc = selectedRisk.subclassCoverTypeDto.coverTypeShortDescription;
      // risk.itemDescription = selectedRisk.subclassCoverTypeDto.coverTypeDescription;
      // risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    }
    risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    risk.wef = this.premiumPayload?.risks[0].withEffectFrom;
    risk.wet = this.premiumPayload?.risks[0].withEffectTo;
    risk.prpCode = this.passedClientDetails?.id
    risk.coverTypeDescription = this.passedCovertypeDescription;
    log.debug("PREMIUM PAYLOAD WHEN CREATING RISK", this.premiumPayload)
    log.debug('Quick Form Risk', risk);
    const riskArray = [risk];

    return this.quotationService.createQuotationRisk(defaultCode, riskArray).subscribe(data => {
      this.quotationRiskData = data;
      log.debug("This is the quotation risk data", data)
      const quotationRiskDetails = this.quotationRiskData._embedded[0];
      log.debug("quotationRiskData", quotationRiskDetails);
      if (quotationRiskDetails) {
        this.riskCode = quotationRiskDetails.riskCode
        this.quoteProductCode = quotationRiskDetails.quotProductCode

      } else {
        log.debug("The quotationRiskCode object is not defined.");
      }

      log.debug(this.quotationRiskData, "Quotation Risk Code Data");
      log.debug(this.riskCode, "Quotation Risk Code ");
      log.debug(this.quoteProductCode, "Quotation Product Code ");
      this.onCreateRiskSection()

    })
  }

  selectedRiskLevelPremium(data: any) {
    log.info("RiskLevelPremium::::::", data);
    const riskLevelPremiumString = JSON.stringify(data);
    sessionStorage.setItem('riskLevelPremium', riskLevelPremiumString);
  }
  selectCoverButton(){
    
  }
  selectCoverNew() {
    this.spinner.show()
    this.passedNumber = this.passedNumber === "null" ? null : this.passedNumber;
    log.debug("PASSED QUOTATION NUMBER WHEN ADDING OR EDITING ADDITIONAL RISK:", this.passedNumber);
    log.debug("TYPE OF PASSED QUOTATION NUMBER:", typeof this.passedNumber);
    log.debug("IS PASSED QUOTATION NUMBER TRUTHY:", Boolean(this.passedNumber));
    log.debug("IS PASSED QUOTATION NUMBER 'null':", this.passedNumber === "null");
    log.debug("Check whether addBenefit method has been called:", this.isAddededBenefitsCalled);


    if (this.isEditQuotationDetail == true) {
      log.debug("EDITING QUOTATION DETAILS: 2ND STEPPER WAS CLICKED")
      log.debug("EDITING QUOTATION DETAILS Method called")
      this.editQuotation();
      // this.router.navigate(['/home/gis/quotation/quote-summary']);


    } else {
      if (this.isAddededBenefitsCalled == true) {
        log.debug(" A BENEFIT HAS BEEN ADDED");
        log.debug("Quotation Number:", this.quotationNo)
        log.debug("Quotation Details(ADD BENEFITS):", this.quotationDetails)
        log.debug("Selected Covertype", this.selectedCoverType)
        const quotationNumber = this.quotationDetails?.quotationNo
        log.debug("Quotation Number const:", quotationNumber)


        // Filter risks where coverTypeCode does not match selectedCoverType
        const filteredRisks = this.quotationDetails.riskInformation.filter(
          (risk: any) => risk.coverTypeCode !== this.selectedCoverType
        );

        // Extract risk codes
        const riskCode = filteredRisks.map((risk: any) => risk.code);

        log.debug("Filtered Risk Codes:", riskCode);
        this.extraRiskCode = riskCode
        if (this.extraRiskCode.length > 0) {
          this.deleteRisk()
        } else {
          const quotationNumberString = JSON.stringify(quotationNumber || this.quotationNo);
          sessionStorage.setItem('quotationNumber', quotationNumberString);
          this.loadClientQuotation()
          log.debug("NAVIGATING TO POLICY SUMMARY");
          this.router.navigate(['/home/gis/quotation/quote-summary']);
        }


        if (this.passedNumber) {
          // Both passedNumber and additional benefit have been added
          log.debug("BOTH PASSED QUOTATION NUMBER AND A BENEFIT HAS BEEN ADDED");
          log.debug("NAVIGATING TO POLICY SUMMARY");
          // this.router.navigate(['/home/gis/quotation/quote-summary']);
        }
      } else if (!this.isAddededBenefitsCalled && this.passedNumber) {
        // PassedNumber exists, but no additional benefit has been added
        log.debug("PASSED QUOTATION NUMBER EXISTS BUT NO ADDITIONAL BENEFIT HAS BEEN ADDED.");
        log.debug("CALLING RISK HANDLING METHODS BASED ON SCENARIO.");

        if (this.quoteAction === "E") {
          log.debug("UPDATING EXISTING QUOTATION RISK", this.quoteAction);
          this.updateQuotationRisk();
          sessionStorage.removeItem('isEditRisk');

          const quotationNumberString = JSON.stringify(this.passedNumber);
          sessionStorage.setItem('quotationNumber', quotationNumberString);
        } else if (this.quoteAction === "A") {
          log.debug("ADDING ANOTHER QUOTATION RISK", this.quoteAction);
          this.createQuotationRisk();
          sessionStorage.removeItem('isAddRisk');

          const quotationNumberString = JSON.stringify(this.passedNumber);
          sessionStorage.setItem('quotationNumber', quotationNumberString);
        } else {
          log.error("NO RISK FLAG DETECTED. PLEASE REVIEW BUSINESS LOGIC.");
        }

        const quotationNumberString = JSON.stringify(this.passedNumber);
        sessionStorage.setItem('quotationNumber', quotationNumberString);
      } else {
        // Quotation data is empty, create a new quotation
        log.debug("QUOTATION DATA IS EMPTY AND NO EXTRA BENEFIT HAS BEEN ADDED");
        this.createQuotation();
        this.getQuotationNumber();
      }
      this.spinner.hide()
    }
  }

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
            sessionStorage.setItem('quickQuotationCode', this.quotationCode.toString());
            // this.router.navigate(['/home/gis/quotation/quote-summary']);
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
        log.info("Error from the DB", error.error.message);
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
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

    log.debug('Section Codes Array:', this.sectionCodesArray);
  }

  computePremiumQuickQuote() {

    this.quotationService.premiumComputationEngine(this.computationDetails).subscribe(
      {
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed');
          this.premiums = res.premiumAmount;
          log.debug('Premium computation response:', this.premiums)
          log.debug('Premium computation response:', res)
          const newriskLevelPremiums = res.riskLevelPremiums;
          this.newRiskLevelPremiums = newriskLevelPremiums;
          log.debug('newRiskLevelPremiums:', this.newRiskLevelPremiums)
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

          log.debug("Updated Risk Level Premium(COMPUTE PREMIUM QUICK QUOTE):", this.riskLevelPremiums)
          if (this.riskLevelPremiums) {
            this.updateQuotationDetails()
          }


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
          log.debug(JSON.stringify(this.premiumPayload, null, 2));
          log.debug("UPDATED PREMIUM PAYLOAD", this.premiumPayload)

          if (this.isAddededBenefitsCalled) {
            log.debug("Do not navigate to quote summary")
            this.loadClientQuotation();
            // this.router.navigate(['/home/gis/quotation/quote-summary']);

          } else {
            if (this.premiumPayload) {
              log.debug("if statement put on premium payload")
              this.loadClientQuotation();
              this.router.navigate(['/home/gis/quotation/quote-summary']);

            }
            if (this.premiums) {
              log.debug("if statement put on premiums")

              this.loadClientQuotation();
              this.router.navigate(['/home/gis/quotation/quote-summary']);


            }

            log.debug("just CKECING IF IT EXISTS", this.quotationDetails)
            log.debug("just CKECING IF IT EXISTS", this.taxInformation)

            log.debug("NAVIGATING TO QUOTATION SUMMARY AFTER CREATING A QUOTE FROM SCRATCH, ADDING NEW RISK OR EDITING RISK,")

            this.router.navigate(['/home/gis/quotation/quote-summary']);
            // this.loadClientQuotation();

          }

          log.debug("just CKECING IF IT EXISTS", this.quotationDetails)
          log.debug("just CKECING IF IT EXISTS", this.taxInformation)


          log.debug("NAVIGATING TO QUOTATION SUMMARY AFTER CREATING A QUOTE FROM SCRATCH, ADDING NEW RISK OR EDITING RISK,")
        },
        error: (error: HttpErrorResponse) => {
          log.info(error);
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);

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

  addBenefits() {
    let isValid = true;

    this.temporaryPremiumList.forEach(section => {
      if (section.isChecked && !section.limitAmount) {
        document.getElementById(`section_${section.sectionCode}`)?.classList.add('error-border');
        isValid = false;
      }
    });
  
    if (!isValid) {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'Please fill in all limit amounts before proceeding.'
      );
      return;
    }
    log.debug("PREMIUM COMPUTATION PAYLOAD", this.premiumComputationPayload)
    log.debug("Passed Section", this.passedSections);
    log.debug("Selected Cover type:", this.selectedCoverType)
    log.debug("Sections to be removed", this.sectionToBeRemoved)
    // for(let limit of this.temporaryPremiumList){
    //   if(limit.isChecked && !)
    // }
    // Iterate over sections and mark empty ones as invalid
  
    let limitsToModify = this.premiumComputationPayload.risks
      .find(value => value.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType)?.limits;

    log.debug("Limits to modify before update", limitsToModify);

    if (this.passedSections.length > 0) {
      // Ensure limitsToModify is initialized
      if (!limitsToModify) {
        limitsToModify = [];
      }

      this.passedSections.forEach((section) => {
        let existingLimit = limitsToModify.find(limit => limit.section.code === section.sectionCode);

        if (existingLimit) {
          // Update existing limit
          log.debug("Update existing limit")
          existingLimit.rateDivisionFactor = section.divisionFactor;
          existingLimit.premiumRate = section.rate;
          existingLimit.rateType = section.rateType;
          existingLimit.minimumPremium = section.minimumPremium;
          existingLimit.multiplierDivisionFactor = section.multiplierDivisionFactor;
          existingLimit.multiplierRate = section.multiplierRate;
          existingLimit.limitAmount = section.limitAmount;
          existingLimit.description = section.sectionShortDescription;
        } else {
          // Add new limit
          log.debug("Adding new limit")

          limitsToModify.push({
            calculationGroup: 1,
            declarationSection: "N",
            rowNumber: 1,
            rateDivisionFactor: section.divisionFactor,
            premiumRate: section.rate,
            rateType: section.rateType,
            minimumPremium: section.minimumPremium,
            annualPremium: 0,
            multiplierDivisionFactor: section.multiplierDivisionFactor,
            multiplierRate: section.multiplierRate,
            description: section.sectionShortDescription,
            section: {
              code: section.sectionCode
            },
            sectionType: section.sectionType,
            riskCode: null,
            limitAmount: section.limitAmount,
            compute: "Y",
            dualBasis: "N"
          });
        }
      });

      log.debug("modified limits: ", limitsToModify);
      log.debug("Updated premium computation payload", this.premiumComputationPayload);
    }

    if (this.sectionToBeRemoved.length > 0) {
      log.debug("removing existing limit(s)")

      this.premiumComputationPayload.risks.forEach((risk) => {
        if (risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType) {
          // Remove limits whose section code is in sectionToBeRemoved
          risk.limits = risk.limits.filter(limit =>
            !this.sectionToBeRemoved.includes(limit.section.code)
          );

        }
      });
      log.debug("Premium computation payload after removing sections ", this.premiumComputationPayload)

    }


    this.quotationService.premiumComputationEngine(this.premiumComputationPayload)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.premiumResponse = response
          // this.riskLevelPremiums = response.
          this.riskLevelPremiums = response.riskLevelPremiums
          // const premiumComputationResponse = response
          log.debug("Premium Computation Response ", response);
          this.cdr.detectChanges
        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
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
    log.debug("index from get limits", index)
    log.debug("index from get limits selected covertype", this.selectedCoverType)
    log.debug("Premium payload", this.premiumPayload.risks)
    return this.premiumPayload.risks.filter(value => value.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType)[index]?.limits || [];
  }

  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  onResize(event: any) {
    this.modalHeight = event.height;
  }

  fetchClauses() {
    this.quotationService
      .getClauses(this.passedCovertypeCode, this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.clauseList = response._embedded
          log.debug("Clause List ", this.clauseList);

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  onCoverTypeChange(coverTypeCode: number) {
    this.selectedCoverType = coverTypeCode
    log.debug("Selected cover type code:", this.selectedCoverType)
    log.info("On cover type change called")
    if (this.selectedCoverType) {
      this.passCovertypeDesc(this.selectedCoverType)
    }
    // Collapse all expanded sections
    this.isClauseDetailsOpen = false;
    this.isLimitsDetailsOpen = false;
    this.isExcessDetailsOpen = false;
    this.isBenefitsDetailsOpen = false;
  }

  fetchLimitsOfLiability() {
    const productCode = this.premiumPayload?.product?.code
    log.debug("Product Code:", productCode)
    this.quotationService
      .getLimitsOfLiability(this.selectedSubclassCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.limitsOfLiabilityList = response._embedded
          log.debug("Limits of Liability List ", this.limitsOfLiabilityList);

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
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

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  createLimitsOfLiabiltyForm() {
    this.limitsOfLiabiltyDetailsForm = this.fb.group({
      code: [''],
      scheduleValueCode: [''],
      quotationProductCode: [''],
      value: [''],
      narration: [''],
      type: ['']
    });
  }

  addLimitsOfLiability() {
    const productCode = this.quotationDetails?.quotationProducts[0].code
    log.debug("Product Code", productCode)
    // Transform the list to match the expected structure
    const transformedList = this.limitsOfLiabilityList.map(item => ({
      code: item.code,
      scheduleValueCode: item.quotationValueCode,
      quotationProductCode: productCode,
      value: item.value,
      narration: item.narration,
      type: "L"  // For Limit of Liability
    }));
    log.debug("Transformed limits liability list", transformedList)

    // Call the service to add the transformed limits of liability
    this.quotationService.addLimitsOfLiability(transformedList).pipe(untilDestroyed(this)).subscribe({
      next: (response: any) => {
        const result = response._embedded;
        log.debug("RESPONSE AFTER ADDING LIST ", result);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }

  addExcesses() {
    const productCode = this.quotationDetails?.quotationProducts[0].code
    log.debug("Product Code", productCode)
    // Transform the list to match the expected structure
    const transformedList = this.excessesList.map(item => ({
      code: item.code,
      scheduleValueCode: item.quotationValueCode,
      quotationProductCode: productCode,
      value: item.value,
      narration: item.narration,
      type: "E"  // For Limit of Liability
    }));
    log.debug("Transformed limits liability list", transformedList)

    // Call the service to add the transformed limits of liability
    this.quotationService.addLimitsOfLiability(transformedList).pipe(untilDestroyed(this)).subscribe({
      next: (response: any) => {
        const result = response._embedded;
        log.debug("RESPONSE AFTER ADDING LIST ", result);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }

  addClauses() {
    const productCode = this.quotationDetails?.quotationProducts[0].code;
    log.debug("Product Code", productCode);
    const riskCode = this.quotationDetails?.riskInformation[0].code;
    log.debug("Risk Code", riskCode);
    const quotCode = this.quotationDetails?.quotationProducts[0].quotCode;
    log.debug("Quote Code", quotCode);

    // Collect all clause codes into an array
    const clauseCodes = this.clauseList.map((clause) => clause.code); // Assuming clause.code contains the clause code
    log.debug("Clause Codes", clauseCodes);

    // Call the service to add all clauses at once
    this.quotationService.addClauses(clauseCodes, productCode, quotCode, riskCode)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          const result = response._embedded;
          log.debug("RESPONSE AFTER ADDING CLAUSES", result);
        },
        error: (error) => {
          log.error("Failed to add clauses:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        }
      });
  }


  createEditRiskDetailsForm() {
    this.editRiskDetailsForm = this.fb.group({
      code: [''],
      covertypeShortDescription: [''],
      covertypecode: [''],
      propertyId: [''],
      quotationCode: [''],
      quotationRiskNo: [''],
      value: [''],
    });
  }

  updateQuotationRisk() {
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

    // Find the selected risk from premiumPayload.risks based on the selectedCoverType value
    const selectedRisk = this.premiumPayload?.risks.find(
      (risk) => risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType
    );

    log.debug("Selected Risk", selectedRisk)
    log.debug("Passed Risk to be edited", this.passedSelectedRisk)

    const risk = this.riskDetailsForm.value;
    // risk.quotationProductCode =
    risk.code = this.passedSelectedRisk?.code;
    risk.coverTypeCode = this.passedCovertypeCode;
    risk.quotationCode = defaultCode;
    risk.productCode = this.premiumPayload?.product.code;
    risk.propertyId = this.premiumPayload?.risks[0].propertyId;
    risk.value = this.sumInsuredValue;
    risk.coverTypeShortDescription = this.passedCoverTypeShortDes;
    risk.subclassCode = this.premiumPayload?.risks[0].subclassSection.code;
    if (selectedRisk) {
      // Populate the risk object with details from the selected risk
      risk.itemDesc = selectedRisk.subclassCoverTypeDto.coverTypeShortDescription;
      // risk.itemDescription = selectedRisk.subclassCoverTypeDto.coverTypeDescription;
      // risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    }
    risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    risk.wef = this.premiumPayload?.risks[0].withEffectFrom;
    risk.wet = this.premiumPayload?.risks[0].withEffectTo;
    risk.prpCode = this.passedClientDetails?.id
    risk.coverTypeDescription = this.passedCovertypeDescription;
    log.debug("PREMIUM PAYLOAD WHEN CREATING RISK", this.premiumPayload)
    log.debug('Quick Form Risk', risk);
    const riskArray = [risk];

    return this.quotationService.createQuotationRisk(defaultCode, riskArray).subscribe(data => {
      this.quotationRiskData = data;
      log.debug("This is the quotation risk data", data)
      const quotationRiskDetails = this.quotationRiskData._embedded[0];
      log.debug("quotationRiskData", quotationRiskDetails);
      if (quotationRiskDetails) {
        this.riskCode = quotationRiskDetails.riskCode
        this.quoteProductCode = quotationRiskDetails.quotProductCode

      } else {
        log.debug("The quotationRiskCode object is not defined.");
      }

      log.debug(this.quotationRiskData, "Quotation Risk Code Data");
      log.debug(this.riskCode, "Quotation Risk Code ");
      log.debug(this.quoteProductCode, "Quotation Product Code ");
      this.onCreateRiskSection()

    })
  }

  updateQuotationDetails() {
    log.debug('computation detailss-updateQuotationDetails', this.computationDetails);
    log.debug('Risk level premiums details-updateQuotationDetails', this.riskLevelPremiums);
    log.debug('NEW Risk level premiums details-updateQuotationDetails', this.newRiskLevelPremiums);
    log.debug("Selected Cover type", this.selectedCoverType)
    let selectedRiskLevelPremium
    if (this.quoteAction === "A" || this.quoteAction === "E") {
      log.debug("WHEN A ADDINFG OR EDITING A RISK")
      selectedRiskLevelPremium = this.riskLevelPremiums;
      log.debug("selectedRiskLevelPremium", selectedRiskLevelPremium);


    } else {
      log.debug("WHEN A NEW BENEFIT WAS ADDED")
      // Find the selected cover type from riskLevelPremiums based on the selectedCoverType value
      selectedRiskLevelPremium = this.riskLevelPremiums?.find(
        premium => premium.coverTypeDetails.coverTypeCode === this.selectedCoverType
      );
      log.debug('SELECTED Risk level premiums details-updateQuotationDetails', selectedRiskLevelPremium);

      const initialPremium = selectedRiskLevelPremium?.premium;

      sessionStorage.setItem("initialPremium", JSON.stringify(initialPremium));

      log.debug("selectedRiskLevelPremium", selectedRiskLevelPremium);
      if (!selectedRiskLevelPremium) {
        log.error("No matching risk level premium found for selected cover type.");
        this.globalMessagingService.displayErrorMessage(
          'Error',
          'Failed to update details. Selected cover type not found.'
        );
        return;
      }
    }


    let quotationCode;
    if (this.quotationData) {
      this.quotationCode = this.quotationData?._embedded?.quotationCode;
      quotationCode = Number(this.quotationCode);
    } else {
      quotationCode = sessionStorage.getItem("passedQuotationCode");
    }


    // Fetch individual tax premiums
    const taxPremiums = selectedRiskLevelPremium?.taxComputation?.map((tax) => tax.premium);


    // Calculate the total tax premium
    const totalTaxPremium = taxPremiums?.reduce((sum, taxPremium) => sum + taxPremium, 0);

    // Add the total tax premium to the selected premium
    // const productPremium = selectedRiskLevelPremium?.premium + +Number(totalTaxPremium);
    let productPremium;

    if (Array.isArray(selectedRiskLevelPremium)) {
      productPremium = selectedRiskLevelPremium.reduce((acc, risk) => {
        // Get tax premiums for this risk object
        const taxPremiums = risk?.taxComputation?.map((tax) => tax.premium) || [];
        // Calculate total tax premium for this risk object
        const totalTaxPremium = taxPremiums.reduce((sum, tp) => sum + tp, 0);
        // Add the risk's premium and its total tax premium to the accumulator
        return acc + (risk.premium + totalTaxPremium);
      }, 0);
    } else {
      // If it's not an array, process it as a single object
      const taxPremiums = selectedRiskLevelPremium?.taxComputation?.map((tax) => tax.premium) || [];
      const totalTaxPremium = taxPremiums.reduce((sum, tp) => sum + tp, 0);
      productPremium = selectedRiskLevelPremium?.premium + totalTaxPremium;
    }

    console.log("Calculated product premium:", productPremium);

    log.debug("product premium when updating the premium details", productPremium);
    log.debug("Tax premium when updating the premium details", totalTaxPremium);
    this.updatePremiumPayload = {
      productPremium: productPremium, // Sum of premium and tax premiums
      productCode: this.premiumPayload?.product.code,
      quotProductCode: this.quoteProductCode,
      taxes: selectedRiskLevelPremium?.taxComputation?.map((tax) => ({
        code: tax.code,
        premium: tax.premium,
      })),
      riskLevelPremiums: Array.isArray(selectedRiskLevelPremium)
        ? selectedRiskLevelPremium.map((risk) => ({
          code: risk.code || this.riskCode, // use risk.code if available, else fallback to this.riskCode
          premium: risk.premium,
          limitPremiumDtos: risk.limitPremiumDtos?.map((limit) => ({
            sectCode: limit.sectCode,
            premium: limit.premium,
          })),
        }))
        : [
          {
            code: this.riskCode,
            premium: selectedRiskLevelPremium.premium,
            limitPremiumDtos: selectedRiskLevelPremium?.limitPremiumDtos?.map((limit) => ({
              sectCode: limit.sectCode,
              premium: limit.premium,
            })),
          },
        ],
    };


    log.debug("update premium payload", this.updatePremiumPayload);

    return this.quotationService
      .updatePremium(quotationCode, this.updatePremiumPayload)
      .subscribe({
        next: (response: any) => {
          const result = response;
          log.debug("RESPONSE AFTER UPDATING QUOTATION DETAILS:", result);
        },
        error: (error) => {
          log.error("Failed to update details:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            error.error.message
          );
        }
      }
      );
  }

  navigateToQuickQuote() {
    log.debug("Navigate to quick quote screen")
    this.isReturnToQuickQuote = true;
    sessionStorage.setItem('quoteAction', 'E')
    // Add a unique flag for add another risk navigation
    sessionStorage.setItem('navigationSource', 'isReturnToQuickQuote');

    const passedisReturnToQuickQuoteString = JSON.stringify(this.isReturnToQuickQuote);
    sessionStorage.setItem('isReturnToQuickQuote', passedisReturnToQuickQuoteString);

    const passedNewClientDetailsString = JSON.stringify(this.passedNewClientDetails);
    sessionStorage.setItem('passedNewClientDetails', passedNewClientDetailsString);
    log.debug("New client detail(covertype:", this.passedNewClientDetails)


    const passedClientDetailsString = JSON.stringify(this.passedClientDetails);
    sessionStorage.setItem('passedClientDetails', passedClientDetailsString);
    log.debug("Existing client detail(covertype:", this.passedClientDetails)

    this.router.navigate(['/home/gis/quotation/quick-quote']);

  }

  openAdditionalBenefitsModal() {
    if (!this.temporaryPremiumList) {
      this.globalMessagingService.displayInfoMessage('Error', 'Temporary list loading ');
    } else {
      document.getElementById("openAdditionalBenefitsModalButton").click();

    }
  }

  createQuotationForm(): void {
    this.quotationForm = this.fb.group({
      quotationCode: [null],
      quotationNo: [null],
      user: ['', Validators.required],
      policyData: this.fb.group({
        action: [''],
        wefDate: ['', Validators.required],
        wetDate: ['', Validators.required],
        branchCode: [, Validators.required],
        currencyCode: [, Validators.required],
        agentCode: [, Validators.required],
        agentShortDescription: [''],
        source: [, Validators.required],
        clientType: [''],
        productCode: [, Validators.required],
        bindCode: [],
        binderPolicy: [],
        currencyRate: [],
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
        locationCode: [null]
      })
    });
  }

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(
        mergeMap((organization) => {
          log.debug("User Organization Details  ", this.userOrgDetails);
          this.organizationId = this.userOrgDetails.organizationId
          const currencyCode = this.premiumPayload?.risks?.[0]?.binderDto?.currencyCode;
          return this.quotationService.getExchangeRates(currencyCode, organization.organizationId)
        }),
        untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  fetchExchangeRate() {
    const currencyCode = this.premiumPayload?.risks?.[0]?.binderDto?.currencyCode;
    this.quotationService
      .getExchangeRates(currencyCode, this.organizationId)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {
          this.exchangeRate = response
          log.debug("Exchange rate  ", this.exchangeRate);

        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  editQuotation() {
    const quoteForm = this.quotationForm.value;

    quoteForm.user = this.user;

    log.debug("PREEEEMIUM PAYLOAD(CREATE QUOTATION)", this.premiumPayload)
    log.debug("User Branch", this.userBranchId)
    quoteForm.quotationCode = this.storedQuotationCode;
    quoteForm.quotationNumber = this.storedQuotationNo;
    quoteForm.source = 37;
    quoteForm.user = this.user;
    quoteForm.clientCode = this.passedClientDetails?.id || null,
      quoteForm.productCode = this.premiumPayload?.product?.code;
    quoteForm.currencyCode = this.premiumPayload?.risks?.[0]?.binderDto?.currencyCode,
      quoteForm.currencyRate = this.exchangeRate || 1,
      quoteForm.agentCode = 0;
    quoteForm.agentShortDescription = "DIRECT";
    quoteForm.gisPolicyNumber = null;
    quoteForm.multiUser = null
    quoteForm.unitCode = null;
    quoteForm.locationCode = null;
    quoteForm.wefDate = this.premiumPayload?.dateWithEffectFrom;
    quoteForm.wetDate = this.premiumPayload?.dateWithEffectTo;
    quoteForm.bindCode = this.premiumPayload?.risks?.[0]?.binderDto?.code;
    quoteForm.binderPolicy = null;
    quoteForm.divisionCode = null;
    quoteForm.subAgentCode = null;
    quoteForm.clientType = "C";
    quoteForm.prospectCode = null;
    quoteForm.branchCode = this.userBranchId || 1,
      quoteForm.marketerAgentCode = null;
    quoteForm.comments = null;
    quoteForm.polPipPfCode = null;
    quoteForm.endorsementStatus = null;
    quoteForm.polEnforceSfParam = null;
    quoteForm.creditDateNotified = null;
    quoteForm.introducerCode = null;
    quoteForm.internalComments = null;
    quoteForm.polPropHoldingCoPrpCode = null;
    quoteForm.chequeRequisition = null;

    this.quotationService
      .processQuotation(quoteForm)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          const updatedQuotationResponse = response
          log.debug("Response after editing a quotation  ", updatedQuotationResponse);
          if (updatedQuotationResponse) {
            this.createQuotationRisk();
          }

        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }

  deleteRisk() {
    log.debug("Selected Risks to be deleted", this.extraRiskCode);

    if (!Array.isArray(this.extraRiskCode) || this.extraRiskCode.length === 0) {
      log.debug("No risks selected for deletion.");
      return;
    }

    const deleteObservables = this.extraRiskCode.map(riskCode =>
      this.quotationService.deleteRisk(riskCode).pipe(untilDestroyed(this))
    );

    forkJoin(deleteObservables).subscribe({
      next: (responses) => {
        log.debug("Responses after deleting risks", responses);

        // Remove deleted risks from the riskDetails array
        this.extraRiskCode.forEach((riskCode) => {
          const index = this.quotationDetails?.riskInformation.findIndex(risk => risk.code === riskCode);
          if (index !== -1) {
            this.quotationDetails?.riskInformation.splice(index, 1);
          }
        });

        // Clear the selected risks
        this.extraRiskCode = [];

        // Update session storage
        sessionStorage.setItem('quotationNumber', JSON.stringify(this.quotationNo));

        // Reload quotation details
        this.loadClientQuotation();

        log.debug("NAVIGATING TO POLICY SUMMARY");
        this.router.navigate(['/home/gis/quotation/quote-summary']);
      },
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    });
  }

  fetchPremiumComputationPyload(code: number) {
    log.debug("premiumComputationPayload", code)
    this.quotationService
      .getPremiumComputationPayload(code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (response: any) => {

          this.premiumComputationPayload = response._embedded
          log.debug("Premium computation paylod from the endpoint", this.premiumComputationPayload);


        },
        error: (error) => {

          this.globalMessagingService.displayErrorMessage('Error', error.error.message);
        }
      });
  }
  openRiskDeleteModal(){
    
  }
}

