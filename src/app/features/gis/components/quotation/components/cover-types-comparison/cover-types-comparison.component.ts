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
import { Logger, untilDestroyed } from '../../../../../../shared/shared.module'

import { forkJoin } from 'rxjs';
import { Clause, Excesses, LimitsOfLiability, PremiumComputationRequest, premiumPayloadData, PremiumRate, QuotationDetails, QuotationProduct, RiskInformation, SectionDetail, TaxInformation, subclassCovertypeSection } from '../../data/quotationsDTO'
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
  selectedCoverType: any;


  // @ViewChild('openModalButton') openModalButton!: ElementRef;
  @ViewChild('openModalButton', { static: false }) openModalButton!: ElementRef;
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

  isAddededBenefitsCalled: boolean = false;
  premiumRates: PremiumRate[] = [];





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
    this.passedQuotationCode = Number(sessionStorage.getItem('passedQuotationCode'));

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

    // this.selectedCoverType = this.riskLevelPremiums[0].coverTypeDetails?.coverTypeCode;
    this.selectedCoverType = this.riskLevelPremiums?.[0]?.coverTypeDetails?.coverTypeCode;

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

  }
  ngOnDestroy(): void { }

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


      log.debug('Selected Sections loadSubclass Section:', this.passedMandatorySections);
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


  onKeyUp(event: KeyboardEvent, section: any): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    // Assuming each row in the p-table has a 'code' property
    section.typedWord = parseInt(inputValue, 10);
    section.isChecked = !isNaN(section.typedWord);

    // Check if the section is checked and add it to the selectedSections array
    if (section.isChecked && !this.passedSections.includes(section)) {
      this.passedSections.push(section);
      log.debug('Selected Sections:', this.passedSections);
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
    log.debug('createRiskSection called with payload:', payload);
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
    log.debug('Selected Sections:', this.passedSections);
    log.debug('Premium Rates:', this.premiumList);

    const interval = setInterval(() => {
      if (this.premiumList && this.premiumList.length > 0) {
        clearInterval(interval); // Stop the polling once data is available
    
        log.debug('Premium Rates:', this.premiumList);
         this.premiumRates= this.premiumList;
    
        if (this.premiumRates.length !== this.passedSections.length) {
          log.error("Number of premium rates doesn't match the number of sections");
          return;
        }
    
        // Proceed with further execution
        console.log('Premium list validation passed!');
      }
    }, 100); // Check every 100ms
    // const premiumRates: PremiumRate[] = this.premiumList;

    // if (premiumRates.length !== this.passedSections.length) {
    //   console.error("Number of premium rates doesn't match the number of sections");
    //   return;
    // }

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
      const premiumRate = this.premiumRates.find(rate => rate.sectionCode === section.sectionCode) || defaultPremiumRate;

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
      wef: ['', Validators.required],
      wet: ['', Validators.required],
      dateRange: [''],
      prpCode: ['', Validators.required],
      isNoClaimDiscountApplicable: [''],
      itemDescription: ['', Validators.required],
      location: [''],
      noClaimDiscountLevel: [''],
      quotProCode: ['', Validators.required],
      propertyId: ['', Validators.required],
      itemDesc: [''],
      riskPremAmount: [''],
      quotationCode: ['', Validators.required],
      sclCode: ['', Validators.required],
      town: [''],
      value: ['', [Validators.required, Validators.min(1)]],
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
      log.debug("Quotation results:", this.quotationData)
      log.debug("Quotation Number", this.quotationNo);
      log.debug("Quotation Code", this.quotationCode);
      if (this.quotationNo) {
        // this.loadClientQuotation()
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
      this.quotationNo = this.quotationDetails.quotOriginalQuotNo;
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


    const risk = this.riskDetailsForm.value;

    if (selectedRisk) {
      // Populate the risk object with details from the selected risk
      risk.itemDesc = selectedRisk.subclassCoverTypeDto.coverTypeShortDescription;
      risk.itemDescription = selectedRisk.subclassCoverTypeDto.coverTypeDescription;

      // From dynamic form
      risk.propertyId = selectedRisk.propertyId;
    }
    risk.binderCode = this.premiumPayload?.risks[0].binderDto.code;
    risk.coverTypeCode = this.passedCovertypeCode;
    risk.coverTypeShortDescription = this.passedCoverTypeShortDes;
    risk.prpCode = this.passedClientDetails?.id
    risk.quotProCode = this.premiumPayload?.product.code;
    risk.wef = this.premiumPayload?.risks[0].withEffectFrom;
    risk.wet = this.premiumPayload?.risks[0].withEffectTo;
    risk.sclCode = this.premiumPayload?.risks[0].subclassSection.code;
    // risk.itemDesc = this.premiumPayload?.risks[0].propertyId;
    // risk.itemDescription = this.premiumPayload?.risks[0].propertyId;
    risk.quotationCode = defaultCode;
    risk.value = this.sumInsuredValue;
    risk.coverTypeDescription = this.passedCovertypeDescription;

    // FROM DYNAMIC FORM
    // risk.propertyId = this.premiumPayload?.risks[0].propertyId;
    // log.debug("Property ID", this.premiumPayload?.risks[0].propertyId)
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
    // this.sharedService.setPremiumResponse(data);

    const riskLevelPremiumString = JSON.stringify(data);
    sessionStorage.setItem('riskLevelPremium', riskLevelPremiumString);

    // this.selectedQuotationNo = this.quotationNo;
    // log.debug("selectedQuotationNo", this.selectedQuotationNo)
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
          if (this.isEditRisk) {

            log.debug(" Updating QUOTATION RISK");
            this.UpdateQuotationRisk();
          } else if (this.isAddRisk) {

            log.debug(" Adding QUOTATION RISK");
            this.createQuotationRisk();

          }

          const quotationNumberString = JSON.stringify(this.passedNumber);
          sessionStorage.setItem('quotationNumber', quotationNumberString);

          // Navigate to policy summary after creating the quotation risk
          // this.router.navigate(['/home/gis/quotation/policy-summary']);
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
        log.debug("add risk value", this.isAddRisk)
        log.debug("Edit risk value", this.isEditRisk)

        if (this.isEditRisk) {

          log.debug(" Updating QUOTATION RISK");
          this.UpdateQuotationRisk();
          sessionStorage.removeItem('isEditRisk');
          // this.isEditRisk =false
          // log.debug("Edit risk value after removing from session storage",this.isEditRisk)

        } else if (this.isAddRisk) {

          log.debug(" Adding QUOTATION RISK");
          this.createQuotationRisk();
          sessionStorage.removeItem('isAddRisk');

        }
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
        log.debug("QUOTATION DATA IS NOT EMPTY");

        const quotationNumberString = JSON.stringify(this.quotationNo);
        sessionStorage.setItem('quotationNumber', quotationNumberString);
        sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        sessionStorage.setItem('quickQuotationCode', this.quotationCode.toString());


        this.router.navigate(['/home/gis/quotation/quote-summary']);
      } else {
        // Quotation data is empty, create a new quotation
        log.debug("QUOTATION DATA IS EMPTY");
        this.createQuotation();
        this.getQuotationNumber();
      }
    }
  }
  selectCoverNew() {
    log.debug("PASSED QUOTATION NUMBER WHEN ADDING OR EDITING ADDITIONAL RISK:", this.passedNumber);
    log.debug("TYPE OF PASSED QUOTATION NUMBER:", typeof this.passedNumber);
    log.debug("IS PASSED QUOTATION NUMBER TRUTHY:", Boolean(this.passedNumber));
    log.debug("IS PASSED QUOTATION NUMBER 'null':", this.passedNumber === "null");
    log.debug("Check whether addBenefit method has been called:", this.isAddededBenefitsCalled);

    // Check if passedNumber exists (not null, empty, or 'null')
    // if(this.isAddededBenefitsCalled = true){
    //   // Check if additonal benefit was added 
    //   if(this.passedNumber && this.passedNumber.trim() !== '' && this.passedNumber.toLowerCase() !== 'null' ){
    //      // Both passedNumber and additional benefit has been added 
    //      log.debug("BOTH PASSED QUOTATION NUMBER AND A BENEFIT HAS BEEN ADDED ");
    //      log.debug(" NAVIGATING TO POLICY SUMMARY");
    //      this.router.navigate(['/home/gis/quotation/policy-summary']);
    //   }else{
    //     log.debug("PASSED QUOTATION NUMBER EXISTS BUT NO EXTRA BENEFIT HAS BEEN ADDED:CALL EITHER ADD OR EDIT RISK METHOD ");
    //     log.debug("add risk value", this.isAddRisk);
    //     log.debug("Edit risk value", this.isEditRisk);
    //     if (this.isEditRisk) {

    //       log.debug(" UPDATING EXISTING QUOTATION RISK");
    //       this.UpdateQuotationRisk();
    //       sessionStorage.removeItem('isEditRisk');
        
    //     } else if (this.isAddRisk) {

    //       log.debug(" ADDING ANOTHER QUOTATION RISK");
    //       this.createQuotationRisk();
    //       sessionStorage.removeItem('isAddRisk');

    //     }
    //     const quotationNumberString = JSON.stringify(this.passedNumber);
    //     sessionStorage.setItem('quotationNumber', quotationNumberString);
    //   }
    // }else{
    //     // Quotation data is empty, create a new quotation
    //     log.debug("QUOTATION DATA IS EMPTY AND NO EXTRA BENEFIT HAS BEEN ADDED");
    //     this.createQuotation();
    //     this.getQuotationNumber();
    // }
    if (this.isAddededBenefitsCalled == true && this.passedNumber) {
      // Both passedNumber and additional benefit have been added
      log.debug("BOTH PASSED QUOTATION NUMBER AND A BENEFIT HAS BEEN ADDED");
      log.debug("NAVIGATING TO POLICY SUMMARY");
      this.router.navigate(['/home/gis/quotation/policy-summary']);
  } else if (!this.isAddededBenefitsCalled && this.passedNumber) {
      // PassedNumber exists, but no additional benefit has been added
      log.debug("PASSED QUOTATION NUMBER EXISTS BUT NO ADDITIONAL BENEFIT HAS BEEN ADDED.");
      log.debug("CALLING RISK HANDLING METHODS BASED ON SCENARIO.");
      
      if (this.isEditRisk) {
          log.debug("UPDATING EXISTING QUOTATION RISK");
          this.UpdateQuotationRisk();
          sessionStorage.removeItem('isEditRisk');
          
      const quotationNumberString = JSON.stringify(this.passedNumber);
      sessionStorage.setItem('quotationNumber', quotationNumberString);
      } else if (this.isAddRisk) {
          log.debug("ADDING ANOTHER QUOTATION RISK");
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

    log.debug('Section Codes Array:', this.sectionCodesArray);
  }

  computePremiumQuickQuote() {

    this.quotationService.premiumComputationEngine(this.computationDetails).subscribe(
      {
        next: (res) => {
          this.globalMessagingService.displaySuccessMessage('Success', 'Premium successfully computed');
          this.premiums = res.premiumAmount;
          log.debug('Premium computation response:', this.premiums)
          const newriskLevelPremiums = this.riskLevelPremiums;
          this.newRiskLevelPremiums = newriskLevelPremiums;
          log.debug('newRiskLevelPremiums:', this.newRiskLevelPremiums)

          if (this.newRiskLevelPremiums) {
            this.updateQuotationDetails()
          }

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
          log.debug(JSON.stringify(this.premiumPayload, null, 2));
          log.debug("UPDATED PREMIUM PAYLOAD", this.premiumPayload)
          if(this.premiumPayload){
            log.debug("if statement put on premium payload")
            this.loadClientQuotation();
            this.router.navigate(['/home/gis/quotation/quote-summary']);

          }
          if(this.premiums){
            log.debug("if statement put on premiums")

            this.loadClientQuotation();
            this.router.navigate(['/home/gis/quotation/quote-summary']);


          }

          log.debug("just CKECING IF IT EXISTS", this.quotationDetails)
          log.debug("just CKECING IF IT EXISTS", this.taxInformation)

          log.debug("NAVIGATING TO QUOTATION SUMMARY AFTER CREATING A QUOTE FROM SCRATCH, ADDING NEW RISK OR EDITING RISK,")
        //   const quotationNumberString = JSON.stringify(this.passedNumber);
        //   sessionStorage.setItem('quotationNumber', quotationNumberString);
        //   //   const quotationNumberString = JSON.stringify(this.quotationNo);
        // // sessionStorage.setItem('quotationNumber', quotationNumberString ||this.passedNumber.toString());
        // // sessionStorage.setItem('quickQuotationNum', this.quotationNo);
        // sessionStorage.setItem(
        //   'quickQuotationNum',
        //   (this.quotationNo || this.passedNumber.toString())
        // );
        // // sessionStorage.setItem('quickQuotationCode', this.quotationCode.toString()||this.passedQuotationCode);
        // sessionStorage.setItem(
        //   'quickQuotationCode',
        //   (this.quotationCode?.toString() || this.passedQuotationCode.toString())
        // );
        
        
          this.router.navigate(['/home/gis/quotation/quote-summary']);
          // this.loadClientQuotation();

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
    // emailForm.cc = this.selectedEmail;
    // emailForm.bcc = this.selectedEmail;

    // this.quotationService.sendEmail(emailForm).subscribe(
    //   {
    //     next: (res) => {
    //       const response = res
    //       this.globalMessagingService.displaySuccessMessage('Success', 'Email sent successfully');
    //       log.debug(res)
    //     }, error: (error: HttpErrorResponse) => {
    //       log.info(error);
    //       this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

    //     }
    //   })
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
    // this.quotationService.sendSms(payload).subscribe(
    //   {
    //     next: (res) => {
    //       this.globalMessagingService.displaySuccessMessage('Success', 'SMS sent successfully');
    //     }, error: (error: HttpErrorResponse) => {
    //       log.info(error);
    //       this.globalMessagingService.displayErrorMessage('Error', 'Error, try again later');

    //     }

    //   }
    // )
  }
  handleShare() {
    if (this.selectedOption === 'email') {
      this.emaildetails();
    } else if (this.selectedOption === 'sms') {
      this.sendSms();
    }
  }

  addBenefits() {

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
    this.isAddededBenefitsCalled = true;
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

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch clauses. Try again later');
        }
      });
  }
  onCoverTypeChange() {
    log.info("On cover type change called")
    // Collapse all expanded sections
    this.isClauseDetailsOpen = false;
    this.isLimitsDetailsOpen = false;
    this.isExcessDetailsOpen = false;
    this.isBenefitsDetailsOpen = false;
  }
  fetchLimitsOfLiability() {
    const productCode = this.premiumPayload?.product.code
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

          this.globalMessagingService.displayErrorMessage('Error', 'Failed to fetch limits of liabilty. Try again later');
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
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add limits of liability. Try again later');
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
        this.globalMessagingService.displayErrorMessage('Error', 'Failed to add excesses. Try again later');
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
            'Failed to add clauses. Try again later.'
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
  UpdateQuotationRisk() {
    const risk = this.editRiskDetailsForm.value;
    risk.code = this.passedSelectedRisk?.code;
    risk.covertypecode = this.passedCovertypeCode;
    risk.covertypeShortDescription = this.passedCovertypeDescription;
    risk.quotationCode = this.passedQuotationCode;
    risk.quotationRiskNo = this.passedSelectedRisk?.quotationRiskNo;
    risk.value = this.sumInsuredValue;
    // FROM DYNAMIC FORM
    risk.propertyId = this.premiumPayload?.risks[0].propertyId;
    log.debug("Property ID", this.premiumPayload?.risks[0].propertyId)
    log.debug("PREMIUM PAYLOAD WHEN EDITING A  RISK", this.premiumPayload)
    log.debug('EDIT Risk', risk);
    const riskArray = [risk];
    log.debug("quotation code:", this.quotationCode)
    log.debug("passed quotation code:", this.passedQuotationCode)
    // let defaultCode
    // if (this.quotationCode) {
    //   defaultCode = this.quotationCode;
    //   log.debug("IF STATEMENT QUOTE CODE", defaultCode)
    // } else {
    //   defaultCode = this.passedQuotationCode
    //   log.debug("IF STATEMENT PASSED QUOTE CODE", defaultCode)

    // }
    // log.debug("default code:", defaultCode)

    return this.quotationService.updateQuotationRisk(risk).subscribe(data => {

      log.debug("This is the quotation risk data", data)
      // const quotationRiskCode = this.quotationRiskData._embedded[0];
      // if (quotationRiskCode) {
      //   for (const key in quotationRiskCode) {
      //     if (quotationRiskCode.hasOwnProperty(key)) {
      //       const value = quotationRiskCode[key];
      //       log.debug(`${value}`);
      //       this.riskCode = value;
      //     }
      //   }
      // } else {
      //   log.debug("The quotationRiskCode object is not defined.");
      // }
      this.riskCode = this.passedSelectedRisk.code
      log.debug("quotation risk code:", this.riskCode)

      log.debug(this.quotationRiskData, "Quotation Risk Code Data");
      this.onCreateRiskSection()

    })
  }

  updateQuotationDetails() {
    log.debug('computation details-updateQuotationDetails', this.computationDetails);
    log.debug('Risk level premiums details-updateQuotationDetails', this.riskLevelPremiums);

    // Find the selected cover type from riskLevelPremiums based on the selectedCoverType value
    const selectedRiskLevelPremium = this.riskLevelPremiums.find(
      (premium) => premium.coverTypeDetails.coverTypeCode === this.selectedCoverType
    );
    log.debug('SELECTED Risk level premiums details-updateQuotationDetails', selectedRiskLevelPremium);

    const initialPremium = selectedRiskLevelPremium.premium;

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

    let quotationCode;
    if(this.quotationData) {
      this.quotationCode = this.quotationData._embedded[0].quotationCode;
      quotationCode = Number(this.quotationCode);
    } else {
      quotationCode = sessionStorage.getItem("passedQuotationCode");
    }



    // Fetch individual tax premiums
    const taxPremiums = selectedRiskLevelPremium.taxComputation.map((tax) => tax.premium);

    // Calculate the total tax premium
    const totalTaxPremium = taxPremiums.reduce((sum, taxPremium) => sum + taxPremium, 0);

    // Add the total tax premium to the selected premium
    const productPremium = selectedRiskLevelPremium.premium + totalTaxPremium;

    this.updatePremiumPayload = {
      productPremium: productPremium, // Sum of premium and tax premiums
      productCode: this.premiumPayload.product.code,
      quotProductCode: this.quoteProductCode,
      taxes: selectedRiskLevelPremium.taxComputation.map((tax) => ({
        code: tax.code,
        premium: tax.premium,
      })),
      riskLevelPremiums: [{
        code: this.riskCode,
        premium: selectedRiskLevelPremium.premium,
        limitPremiumDtos: selectedRiskLevelPremium.limitPremiumDtos.map((limit) => ({
          sectCode: limit.sectCode,
          premium: limit.premium,
        })),
      }],
    };

    log.debug("update premium payload", this.updatePremiumPayload);

    return this.quotationService
      .createQuotationDetails(quotationCode, this.updatePremiumPayload)
      .subscribe({
        next: (response: any) => {
          const result = response;
          log.debug("RESPONSE AFTER UPDATING QUOTATION DETAILS:", result);
        },
        error: (error) => {
          log.error("Failed to update details:", error);
          this.globalMessagingService.displayErrorMessage(
            'Error',
            'Failed to update details. Try again later.'
          );
        }
      }
      );
  }

}

