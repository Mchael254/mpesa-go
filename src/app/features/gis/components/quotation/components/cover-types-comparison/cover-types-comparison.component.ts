import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import stepData from '../../data/steps.json'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../../../../shared/services/auth.service';
import {CurrencyService} from '../../../../../../shared/services/setups/currency/currency.service';
import {BinderService} from '../../../setups/services/binder/binder.service';
import {ProductsService} from '../../../setups/services/products/products.service';
import {SubclassesService} from '../../../setups/services/subclasses/subclasses.service';
import {QuotationsService} from '../../services/quotations/quotations.service';

import {Logger, untilDestroyed} from '../../../../../../shared/shared.module'


import {forkJoin, mergeMap} from 'rxjs';

import {
  Clause, Excesses, LimitsOfLiability, PremiumComputationRequest,
  premiumPayloadData, QuotationDetails, UserDetail
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
import {CoverTypeDetail, RiskLevelPremium} from '../../data/premium-computation';

const log = new Logger('CoverTypesComparisonComponent');
declare var bootstrap: any; // Ensure Bootstrap is available
declare var $: any;

@Component({
  selector: 'app-cover-types-comparison',
  templateUrl: './cover-types-comparison.component.html',
  styleUrls: ['./cover-types-comparison.component.css']
})
export class CoverTypesComparisonComponent implements OnInit, OnDestroy {
  activeRiskIndex: number | null = null;
  private _riskLevelPremium!: RiskLevelPremium;
  @Output() selectedCoverEvent: EventEmitter<RiskLevelPremium> = new EventEmitter<RiskLevelPremium>();
  @Output() additionalBenefitsEvent: EventEmitter<Premiums[]> = new EventEmitter<Premiums[]>();
  @Output() additionalBenefitsRemovedEvent: EventEmitter<Premiums> = new EventEmitter<Premiums>();
  @Input() isExpanded: boolean = false;

  @Input()
  set riskLevelPremium(value: RiskLevelPremium) {
    this._riskLevelPremium = value
    if (value.selectCoverType) {
      this.selectedCoverTypeCode = this.riskLevelPremium.selectCoverType.coverTypeCode
      const selectedCoverType = value.coverTypeDetails
        .find(coverType => coverType.coverTypeCode === this.selectedCoverTypeCode)
      log.debug("Selected coverType >>>>", selectedCoverType)
      this.onCoverTypeSelected(selectedCoverType)
    }
  }

  get riskLevelPremium() {
    return this._riskLevelPremium
  }


  selectedOption: string = 'email';
  clientName: string = '';
  steps = stepData;

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
  clientcode: any;
  selectedEmail: any;
  selectedPhoneNo: any;
  isChecked: boolean = false;
  premiumPayload: PremiumComputationRequest;
  additionalBenefits: any;

  user: any;
  userDetails: any
  userBranchId: any;

  quotationCode: number;
  quotationData: any;
  quotationNo: string;
  passedQuotationSource: any;


  currencyList: any;
  currencyCode: any;
  selectedCurrency: any;
  selectedCurrencyCode: any;

  passedClientDetails: any;
  passedNewClientDetails: any;

  passedClientCode: any;
  selectedSubclassCode: number | null = null;
  premiumList: Premiums[] = [];
  temporaryPremiumList: Premiums[] = [];

  passedNumber: string;
  passedQuotationCode: number;
  passedQuotationDetails: any;
  emailForm: FormGroup;
  smsForm: FormGroup;
  isTempPremiumListUpdated: boolean = false;
  lastUpdatedCoverTypeCode = null;
  selectedCoverTypeCode: number;
  @ViewChild('openModalButton', {static: false}) openModalButton!: ElementRef;
  @ViewChild('addMoreBenefits') addMoreBenefitsModal!: ElementRef;
  isModalOpen: boolean = false;

  clauseList: Clause[] = []
  selectedClause: any;
  modalHeight: number = 200;
  limitsOfLiabilityList: LimitsOfLiability[] = [];
  excessesList: Excesses[] = []
  premiums: any;
  updatePremiumPayload: premiumPayloadData;
  quoteProductCode: any;
  sectionDetails: any;
  isReturnToQuickQuote: boolean;
  userOrgDetails: UserDetail;
  userCode: number;
  organizationId: number;
  exchangeRate: number;
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
  selectedRisk: any = null

  public currencyObj: NgxCurrencyConfig;
  private typingTimer: any;// Timer reference
  sectionToBeRemoved: number[] = [];
  inputErrors: { [key: string]: boolean } = {};
  selectedBinderCode: number;
  currencySymbol: string;
  selectedCover: CoverTypeDetail;

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

  }

  public isClauseDetailsOpen = false;
  public isLimitsDetailsOpen = false;
  public isExcessDetailsOpen = false;
  public isBenefitsDetailsOpen = false;
  public isSelectCoverOpen = true;

  openPolicy: string | null = null;

  togglePolicy(panelName: string) {
    this.openPolicy = this.openPolicy === panelName ? null : panelName;
  }


  ngOnInit(): void {
    this.createEmailForm();
    this.createSmsForm();

    const currencyDelimiter = sessionStorage.getItem('currencyDelimiter');
    const currencySymbol = sessionStorage.getItem('currencySymbol');
    this.currencySymbol = currencySymbol

    this.currencyObj = {
      prefix: currencySymbol + ' ',
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

  fetchCoverTypeRelatedData(selectedCover: CoverTypeDetail) {
    log.debug("I selected this cover >>>", selectedCover)
    const coverTypeCode = selectedCover.coverTypeCode
    forkJoin(([
      this.quotationService.getClauses(coverTypeCode, this.selectedSubclassCode),
      this.quotationService.getExcesses(this.selectedSubclassCode),
      this.quotationService.getLimitsOfLiability(this.selectedSubclassCode),
      this.premiumRateService.getCoverTypePremiums(this.selectedSubclassCode, this.selectedBinderCode, coverTypeCode)
    ])).pipe(
      untilDestroyed(this)
    )
      .subscribe(([clauses, excesses, limitOfLiabilities, applicablePremiumRates]) => {
        this.clauseList = clauses._embedded ?? []
        this.excessesList = excesses._embedded ?? []
        this.limitsOfLiabilityList = limitOfLiabilities._embedded ?? []

        selectedCover.excesses = excesses._embedded ?? []
        selectedCover.limitOfLiabilities = limitOfLiabilities._embedded ?? []
        selectedCover.clauses = clauses._embedded ?? []
        this.riskLevelPremium.selectCoverType = selectedCover
        this.selectedCoverEvent.emit(this.riskLevelPremium)
        this.additionalBenefits = applicablePremiumRates
        this.temporaryPremiumList = applicablePremiumRates.filter(value => value.isMandatory !== 'Y')
      })
  }

  calculateTotalPayablePremium(quotationDetail: QuotationDetails): number {
    let totalPremium = quotationDetail.premium || 0;

    if (quotationDetail.quotationProducts[0].taxInformation && quotationDetail.quotationProducts[0].taxInformation.length > 0) {
      // Sum up the amounts of all taxes
      totalPremium += quotationDetail.quotationProducts[0].taxInformation.reduce((total, tax) => total + (tax.taxAmount || 0), 0);
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


  selectedRiskLevelPremium(data: any) {
    log.info("RiskLevelPremium::::::", data);
    const riskLevelPremiumString = JSON.stringify(data);
    sessionStorage.setItem('riskLevelPremium', riskLevelPremiumString);
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
    /*  let rowNumbers = newListToCompute.map(value => value.rowNumber);
      let maxValueAssigned = Math.max(...rowNumbers);*/
    let limitsToComputeOn = this.temporaryPremiumList.filter(value => value.isChecked && value.isMandatory !== 'Y')
    log.debug("Modified limitsToComputeOn", limitsToComputeOn);
    this.additionalBenefitsEvent.emit(limitsToComputeOn)

  }

  toggleSelectProduct() {
    this.isSelectCoverOpen = !this.isSelectCoverOpen;
  }

  toggleSelectRisk(index: number, risk: any) {
    log.debug("Selected risk>>>", risk)
    this.activeRiskIndex = this.activeRiskIndex === index ? null : index;

  }

  // toggleClauseDetails() {
  //   this.isClauseDetailsOpen = !this.isClauseDetailsOpen;
  // }

  // toggleLimitsDetails() {
  //   this.isLimitsDetailsOpen = !this.isLimitsDetailsOpen;
  // }

  // toggleExcessDetails() {
  //   this.isExcessDetailsOpen = !this.isExcessDetailsOpen;
  // }

  // toggleAdditionalBenefitsDetails() {
  //   this.isBenefitsDetailsOpen = !this.isBenefitsDetailsOpen;
  // }


  openHelperModal(selectedClause: any) {
    // Set the showHelperModal property of the selectedClause to true
    selectedClause.showHelperModal = true;
  }

  onResize(event: any) {
    this.modalHeight = event.height;
  }

  onCoverTypeSelected(selectedCover: CoverTypeDetail): void {
    log.debug('CoverType selected:', selectedCover, this.riskLevelPremium);
    this.riskLevelPremium.selectCoverType = selectedCover
    this.selectedCover = selectedCover;
    this.selectedCoverTypeCode = selectedCover.coverTypeCode;
    this.selectedSubclassCode = selectedCover.subclassCode;
    this.selectedBinderCode = this.riskLevelPremium.binderCode
    if (this.selectedCoverTypeCode && this.selectedSubclassCode) {
      this.fetchCoverTypeRelatedData(selectedCover);
    } else {
      log.error('Cannot fetch cover type data: selectedSubclassCode is undefined');
    }
    this.isClauseDetailsOpen = false;
    this.isLimitsDetailsOpen = false;
    this.isExcessDetailsOpen = false;
    this.isBenefitsDetailsOpen = false;
    this.selectedCoverEvent.emit(this.riskLevelPremium)

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

  saveAdditionalBenefitChanges() {
    this.additionalBenefitsEvent.emit(this.temporaryPremiumList);
    log.debug("Temporary Premium List after saving additional benefits", this.temporaryPremiumList);
  }

  fetchUserOrgId() {
    this.quotationService
      .getUserOrgId(this.userCode)
      .pipe(
        mergeMap((organization) => {
          this.userOrgDetails = organization
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

  openRiskDeleteModal(limitToDelete: any) {
    this.additionalBenefitsRemovedEvent.emit(limitToDelete)
  }
}

