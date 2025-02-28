import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import stepData from '../../data/steps.json'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../shared/services/auth.service';
import {CurrencyService} from '../../../../../../shared/services/setups/currency/currency.service';
import {BinderService} from '../../../setups/services/binder/binder.service';
import {ProductsService} from '../../../setups/services/products/products.service';
import {SubclassesService} from '../../../setups/services/subclasses/subclasses.service';
import {QuotationsService} from '../../services/quotations/quotations.service';

import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'

import {forkJoin, mergeMap, of, switchMap} from 'rxjs';
import {
  Clause, Excesses, LimitsOfLiability, PremiumComputationRequest,
  premiumPayloadData, QuotationDetails, UserDetail, QuickQuoteData, Limit
} from '../../data/quotationsDTO'
import {Premiums} from '../../../setups/data/gisDTO';
import {ClientDTO} from '../../../../../entities/data/ClientDTO';
import {NgxSpinnerService} from 'ngx-spinner';
import {
  SubClassCoverTypesSectionsService
} from '../../../setups/services/sub-class-cover-types-sections/sub-class-cover-types-sections.service';
import {GlobalMessagingService} from '../../../../../../shared/services/messaging/global-messaging.service'
import {PremiumRateService} from '../../../setups/services/premium-rate/premium-rate.service';
import {Router} from '@angular/router';
import {NgxCurrencyConfig} from "ngx-currency";

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
  quotationRiskData: any;


  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  passedClientDetails: any;
  passedNewClientDetails: any;

  passedClientCode: any;
  computationDetails: any;

  selectedSubclassCode: any;
  allMatchingSubclasses = [];
  subclassSectionCoverList: any;
  covertypeSectionList: any;
  covertypeSpecificSection: any;
  sectionCodesArray: number[] = [];
  premiumList: Premiums[] = [];
  temporaryPremiumList: Premiums[] = [];
  coverTypePremiumItems: Premiums[] = [];

  passedNumber: string;
  passedQuotationCode: number;
  passedQuotationDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  isTempPremiumListUpdated: boolean = false;
  lastUpdatedCoverTypeCode = null;
  selectedCoverType: number;


  // @ViewChild('openModalButton') openModalButton!: ElementRef;
  @ViewChild('openModalButton', {static: false}) openModalButton!: ElementRef;
  @ViewChild('addMoreBenefits') addMoreBenefitsModal!: ElementRef;
  isModalOpen: boolean = false;

  clauseList: Clause[] = []
  selectedClause: any;
  modalHeight: number = 200; // Initial height
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  excessesList: Excesses[] = []
  passedSelectedRisk: any;
  isEditRisk: boolean;
  isAddRisk: boolean;
  selectedRisk: any;
  premiums: any;
  updatePremiumPayload: premiumPayloadData;
  quoteProductCode: any;
  showQuoteActions: boolean;
  sectionDetails: any;
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
    private router: Router,
    public subclassSectionCovertypeService: SubClassCoverTypesSectionsService,
    public globalMessagingService: GlobalMessagingService,
    public premiumRateService: PremiumRateService,
    public spinner: NgxSpinnerService,
  ) {
    this.storedData = JSON.parse(sessionStorage.getItem('quickQuoteData'));
    this.quoteAction = sessionStorage.getItem('quoteAction')
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

    log.info("selectedCovertype when the page loads:", this.selectedCoverType) //TODO check this out with HOPE
    if (this.selectedCoverType && this.selectedSubclassCode) {
      this.fetchCoverTypeRelatedData(this.selectedCoverType)
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

    this.getuser();
    this.createEmailForm();
    this.createSmsForm();


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
      this.storedQuotationCode = this.passedQuotationData.code
      this.storedQuotationNo = this.passedQuotationData?.quotationNo;


    }

    if (this.quoteAction === "A") {
      log.debug("ADDING A NEW RISK TO AN EXISTING QUOTATION", this.quoteAction)
    } else if (this.quoteAction === "E") {
      log.debug("EDITING AN EXISTING RISK TO AN EXISTING QUOTATION", this.quoteAction)

    }


    log.debug("Stored Data", this.storedData)
    // this.selectedClientCode= this.storedData.selectedClient.id
    this.computationPayloadCode = this.storedData.computationPayloadCode
    this.fetchPremiumComputationPyload(this.computationPayloadCode);
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

  fetchCoverTypeRelatedData(coverTypeCode: number) {
    forkJoin(([
      this.quotationService.getClauses(coverTypeCode, this.selectedSubclassCode),
      this.quotationService.getExcesses(this.selectedSubclassCode),
      this.quotationService.getLimitsOfLiability(this.selectedSubclassCode),
      this.premiumRateService.getCoverTypePremiums(this.selectedSubclassCode, this.storedData.selectedBinderCode, coverTypeCode)
    ])).pipe(
      untilDestroyed(this)
    )
      .subscribe(([clauses, excesses, limitOfLiabilities, applicablePremiumRates]) => {
        this.clauseList = clauses._embedded ?? []
        this.excessesList = excesses._embedded ?? []
        this.limitsOfLiabilityList = limitOfLiabilities._embedded ?? []
        const coverTypeSections = this.riskLevelPremiums
          .filter(value => value.coverTypeDetails.coverTypeCode === coverTypeCode)
          .map(section => section.limitPremiumDtos).flat()
        log.debug("Comparing against >>>", coverTypeSections)
        this.coverTypePremiumItems = applicablePremiumRates;
        this.temporaryPremiumList = applicablePremiumRates.filter(value => value.isMandatory !== 'Y')
          .map((value) => {
            let matchingSection = coverTypeSections.find(section => section.sectCode === value.sectionCode);
            log.debug("Found a matching >>>", matchingSection, value)
            return {
              ...value,
              isChecked: !!matchingSection,
              limitAmount: matchingSection?.limitAmount ?? null
            }
          })
        log.debug("Changed rates>>>>>>>", this.riskLevelPremiums)
      })
  }

  calculateTotalPayablePremium(quotationDetail: QuotationDetails): number {
    let totalPremium = quotationDetail.premium || 0;

    if (quotationDetail.taxInformation && quotationDetail.taxInformation.length > 0) {
      // Sum up the amounts of all taxes
      totalPremium += quotationDetail.taxInformation.reduce((total, tax) => total + (tax.amount || 0), 0);
    }

    return totalPremium;
  }


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

      // this.loadAllPremiums();
    }, 500); // Trigger after 500ms of no typing
  }


  // Function to determine the checkbox state for each row
  isSectionChecked(section: any): boolean {
    return section.isChecked || false;

  }


  riskLimitPayload() {
    let selectedLimits = this.premiumComputationPayload.risks
      .find(value => value.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType)?.limits;
    const coverTypeSections = this.riskLevelPremiums
      .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
      .map(section => section.limitPremiumDtos).flat()


    let assignedRows = selectedLimits.map(value => value.rowNumber);


    const maxAssignedValue = Math.max(...assignedRows)

    log.debug('Selected Sections:', selectedLimits);
    log.debug('Premium Rates:', coverTypeSections);

    let limitsToSave: any[] = [] //TODO check how to handle hardcoded values
    for (let premiumRate of selectedLimits) {
      const matchingSection = coverTypeSections.find(value => value.sectCode === premiumRate.section?.code);
      const databaseLimit = this.coverTypePremiumItems.find(value => value.sectionCode === premiumRate.section?.code)
      log.debug("Matching Database limit >>", databaseLimit)
      limitsToSave.push({
          calcGroup: 1,
          code: databaseLimit?.code,
          compute: "Y",
          description: matchingSection?.description,
          freeLimit: databaseLimit?.freeLimit || 0,
          multiplierDivisionFactor: databaseLimit?.multiplierDivisionFactor,
          multiplierRate: databaseLimit?.multiplierRate,
          premiumAmount: matchingSection?.premium,
          premiumRate: premiumRate?.premiumRate || 0,
          rateDivisionFactor: premiumRate?.rateDivisionFactor || 1,
          rateType: premiumRate?.rateType || "FXD",
          rowNumber: premiumRate?.rowNumber,
          sectionType: premiumRate?.sectionType,
          sumInsuredLimitType: premiumRate?.sectionType || null,
          sumInsuredRate: databaseLimit?.sumInsuredRate,
          sectionShortDescription: premiumRate.sectionType,
          sectionCode: databaseLimit?.sectionCode,
          limitAmount: matchingSection?.limitAmount,
        }
      )
    }
    return limitsToSave;
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

  getQuotationRiskPayload(): any[] {
    log.debug("quotation code:", this.quotationCode)
    log.debug("passed quotation code:", this.passedQuotationCode)
    log.debug("stored quote code when editing quote details or 2nd stepeer clicked", this.storedQuotationCode)
    let existingRisk = JSON.parse(sessionStorage.getItem('passedSelectedRiskDetails'));
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
    const selectedRisk = this.premiumPayload?.risks.find(
      (risk) => risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType
    );
    const selectedRiskPremiumResponse = this.premiumResponse?.riskLevelPremiums.find(
      (risk) => risk.coverTypeDetails.coverTypeCode === this.selectedCoverType
    );

    log.debug("Selected Risk premium", selectedRiskPremiumResponse)
    log.debug("Sum Insured>>>>", this.sumInsuredValue)
    log.debug("Selected Risk", selectedRisk)
    const coverTypeSections = this.riskLevelPremiums
      .filter(value => value.coverTypeDetails.coverTypeCode === this.selectedCoverType)
      .map(section => section.limitPremiumDtos).flat()
    let risk = {
      coverTypeCode: this.selectedCoverType,
      action: this.quoteAction ? this.quoteAction : "A",
      //quotationCode: defaultCode,
      code: existingRisk && this.quoteAction === "E" ? existingRisk.code : null,
      productCode: this.premiumPayload?.product.code,
      propertyId: selectedRisk?.propertyId || selectedRisk?.itemDescription,
      value: this.sumInsuredValue,
      coverTypeShortDescription: selectedRisk?.subclassCoverTypeDto?.coverTypeShortDescription,
      premium: coverTypeSections.reduce((sum, section) => sum + section.premium, 0),
      subclassCode: selectedRisk?.subclassSection.code,
      itemDesc: selectedRisk?.itemDescription,
      binderCode: selectedRisk?.binderDto?.code,
      wef: selectedRisk?.withEffectFrom,
      wet: selectedRisk?.withEffectTo,
      prpCode: this.passedClientCode,
      quotationProductCode: existingRisk && this.quoteAction === "E" ? existingRisk?.quotationProductCode : null,
      coverTypeDescription: selectedRisk?.subclassCoverTypeDto?.coverTypeDescription,
      taxComputation: selectedRiskPremiumResponse.taxComputation.map(tax => ({
        code: tax.code,
        premium: tax.premium
      }))
    }
    return [risk]
  }

  selectedRiskLevelPremium(data: any) {
    log.info("RiskLevelPremium::::::", data);
    const riskLevelPremiumString = JSON.stringify(data);
    sessionStorage.setItem('riskLevelPremium', riskLevelPremiumString);
  }

  selectCoverNew() {
    const quotation = this.getQuotationPayload();
    let riskPayload = this.getQuotationRiskPayload();
    let limitsToSave = this.riskLimitPayload();

    log.debug("Quotation payload>>>", quotation)
    log.debug("Risk payload", riskPayload);
    log.debug("About to save these limits", limitsToSave)
    log.debug("Limits of liabilities to save::", this.limitsOfLiabilityList)
    log.debug("Excesses to save >>>", this.excessesList)
    log.debug("Clauses to save>>>", this.clauseList)
    const processQuotation$ = this.storedQuotationCode && this.storedQuotationNo
      ? of({_embedded: {quotationCode: this.storedQuotationCode, quotationNumber: this.storedQuotationNo}})
      : this.quotationService.processQuotation(quotation);
    this.storedQuotationCode = this.passedQuotationData?._embedded?.[0]?.quotationCode;
    this.storedQuotationNo = this.passedQuotationData?._embedded?.[0]?.quotationNumber
    processQuotation$.pipe(
      switchMap((quotationResponse) => {
        this.quotationCode = quotationResponse._embedded.quotationCode;
        this.quotationNo = quotationResponse._embedded.quotationNumber;
        sessionStorage.setItem('quotationNumber', JSON.stringify(this.quotationNo));
        sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        sessionStorage.setItem('quickQuotationCode', this.quotationCode.toString());
        log.debug('Quotation saved successfully', quotationResponse);
        riskPayload = riskPayload.map((risk) => {
          return {
            ...risk,
            quotationCode: this.quotationCode
          }
        })
        return this.quotationService.createQuotationRisk(this.quotationCode, riskPayload)
      }),
      switchMap((riskResponse) => {
        log.debug('Risk saved successfully', riskResponse);
        // Add the risk ID to sectionData before saving section
        this.quotationRiskData = riskResponse;
        log.debug("This is the quotation risk data", riskResponse)
        const quotationRiskDetails = this.quotationRiskData._embedded[0];
        if (quotationRiskDetails) {
          this.riskCode = quotationRiskDetails.riskCode
          this.quoteProductCode = quotationRiskDetails.quotProductCode
        }
        const clauseCodes = this.clauseList.map((clause) => clause.code);
        const limitsOfLiability = this.limitsOfLiabilityList.map(item => ({
          code: item.code,
          scheduleValueCode: item.code,
          quotationProductCode: this.quoteProductCode,
          value: item.value,
          narration: item.narration,
          type: "L"
        }));
        const excesses = this.excessesList.map(item => ({
          code: item.code,
          scheduleValueCode: item.code,
          quotationProductCode: this.quoteProductCode,
          value: item.value,
          narration: item.narration,
          type: "E"
        }));
        const limitsPayLoad = {
          addOrEdit: 'A',
          quotationRiskCode: this.riskCode,
          riskSections:
            limitsToSave.map((value) => {
              return {
                ...value,
                quotationCode: this.quotationCode,
                quotRiskCode: this.riskCode
              }
            })
        }
        return forkJoin(([
          this.quotationService.addClauses(clauseCodes, this.premiumPayload?.product.code, this.quotationCode, this.riskCode),
          this.quotationService.createRiskLimits(limitsPayLoad),
          this.quotationService.addLimitsOfLiability(limitsOfLiability),
          this.quotationService.addLimitsOfLiability(excesses)
        ]))
      })
    ).subscribe({
      next: (([clauses, riskSections, limits, excesses]) => {
        log.debug(riskSections)
        this.router.navigate(['/home/gis/quotation/quote-summary']);
      }),
      error: ((error) => log.error("Error>>>", error))
    })
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

    let limitsToModify = this.premiumComputationPayload.risks
      .find(value => value.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType)?.limits;

    let newListToCompute: Limit[] = []
    for (let limit of limitsToModify) {
      if (limit.section.isMandatory === "Y") {
        newListToCompute.push(limit)
      }
    }
    let rowNumbers = newListToCompute.map(value => value.rowNumber);
    let maxValueAssigned = Math.max(...rowNumbers);
    for (let limit of this.temporaryPremiumList) {
      if (limit.isChecked && limit.limitAmount && limit.isMandatory !== 'Y') {
        maxValueAssigned += 1;
        newListToCompute.push({
          calculationGroup: 1,
          declarationSection: "N",
          rowNumber: maxValueAssigned,
          rateDivisionFactor: limit.divisionFactor,
          premiumRate: limit.rate,
          rateType: limit.rateType,
          minimumPremium: limit.premiumMinimumAmount,
          annualPremium: 0,
          multiplierDivisionFactor: limit.multiplierDivisionFactor,
          multiplierRate: limit.multiplierRate,
          freeLimit: limit?.freeLimit,
          description: limit.sectionShortDescription,
          section: {
            description: limit.sectionDescription,
            limitAmount: limit.limitAmount,
            code: limit.sectionCode,
            isMandatory: "N"
          },
          sectionType: limit.sectionType,
          riskCode: null,
          limitAmount: limit.limitAmount,
          limitPeriod: limit?.limitPeriod || 0,
          compute: "Y",
          dualBasis: "N"
        })
      }
    }
    this.premiumComputationPayload.risks.forEach((risk) => {
      if (risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType) {
        risk.limits = newListToCompute
      }
    });
    log.debug("Modified premium computation payload", this.premiumComputationPayload);
    this.performComputation()
  }

  performComputation() {
    forkJoin(([
      this.quotationService.updatePremiumComputationPayload(this.computationPayloadCode, this.premiumComputationPayload),
      this.quotationService.premiumComputationEngine(this.premiumComputationPayload)
    ])).pipe(
      untilDestroyed(this)
    ).subscribe({
      next: (([payloadUpdate, computationResponse]) => {
        this.premiumResponse = computationResponse
        this.premiumComputationPayload = payloadUpdate._embedded
        this.riskLevelPremiums = computationResponse.riskLevelPremiums
        sessionStorage.setItem('premiumResponse', JSON.stringify(computationResponse));
      }),
      error: (error) => {
        this.globalMessagingService.displayErrorMessage('Error', error.error.message);
      }
    })
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


  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  onResize(event: any) {
    this.modalHeight = event.height;
  }

  onCoverTypeChange(coverTypeCode: number) {
    this.selectedCoverType = coverTypeCode
    log.debug("Selected cover type code:", this.selectedCoverType)
    log.info("On cover type change called")
    if (this.selectedCoverType) {
      this.fetchCoverTypeRelatedData(coverTypeCode)
    }
    // Collapse all expanded sections
    this.isClauseDetailsOpen = false;
    this.isLimitsDetailsOpen = false;
    this.isExcessDetailsOpen = false;
    this.isBenefitsDetailsOpen = false;
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

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(
        mergeMap((organization) => {
          this.userOrgDetails =organization
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

  getQuotationPayload(): any {
    return {
      quotationCode: this.storedQuotationCode,
      quotationNumber: this.storedQuotationNo,
      source: 37,
      user: this.user,
      clientCode: this.storedData?.selectedClient?.id || null,
      productCode: this.premiumPayload?.product?.code,
      currencyCode: this.premiumPayload?.risks?.[0]?.binderDto?.currencyCode,
      currencyRate: this.exchangeRate || 1,
      agentCode: 0,
      premium: this.premiumResponse?.premiumAmount,
      agentShortDescription: "DIRECT",
      wefDate: this.premiumPayload?.dateWithEffectFrom,
      wetDate: this.premiumPayload?.dateWithEffectTo,
      bindCode: this.premiumPayload?.risks?.[0]?.binderDto?.code,
      clientType: "C",
      branchCode: this.userBranchId || 1
    }
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
        this.globalMessagingService.displayErrorMessage('Error', error?.error?.message);
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
          log.debug("Premium computation payload from the endpoint", this.premiumComputationPayload);
        },
        error: (error) => {
          this.globalMessagingService.displayErrorMessage('Error', error?.error?.message);
        }
      });
  }

  openRiskDeleteModal(limitToDelete: any) {
    for (let premiumRate of this.temporaryPremiumList) {
      if (premiumRate.sectionCode == limitToDelete.sectCode) {
        premiumRate.isChecked = false
        premiumRate.limitAmount = null
      }
    }
    let limitsToModify = this.premiumComputationPayload.risks
      .find(value => value.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType)?.limits;
    log.debug("Before Modification computation payload for deletion>>>", this.premiumComputationPayload, limitToDelete)
    let newLimits: Limit[] = []
    for (let limit of limitsToModify) {
      if ((limit.section.code !== limitToDelete.sectCode) || limit.section.isMandatory === "Y") {
        newLimits.push(limit);
      }
    }
    this.premiumComputationPayload.risks.forEach((risk) => {
      if (risk.subclassCoverTypeDto.coverTypeCode === this.selectedCoverType) {
        risk.limits = newLimits
      }
    });
    log.debug("Modified computation payload for deletion>>>", this.premiumComputationPayload)
    this.performComputation()
  }
}

