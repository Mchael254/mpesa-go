import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {CountryService} from "../../../../../shared/services/setups/country/country.service";
import {IntermediaryService} from "../../../services/intermediary/intermediary.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {DatePipe} from "@angular/common";
import {BankService} from "../../../../../shared/services/setups/bank/bank.service";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {Logger, UtilService} from "../../../../../shared/services";
import {takeUntil} from "rxjs/operators";
import {SectorService} from "../../../../../shared/services/setups/sector/sector.service";
import {forkJoin, ReplaySubject} from "rxjs";
import {OccupationService} from "../../../../../shared/services/setups/occupation/occupation.service";
import {untilDestroyed} from "../../../../../shared/shared.module";
import {BankBranchDTO, BankDTO, CurrencyDTO} from "../../../../../shared/data/common/bank-dto";
import {AccountTypeDTO, AddressDTO, AgentPostDTO, AgentRequestDTO, ContactDetailsDTO} from "../../../data/AgentDTO";
import {CountryDto, StateDto, TownDto} from "../../../../../shared/data/common/countryDto";
import {SectorDTO} from "../../../../../shared/data/common/sector-dto";
import {OccupationDTO} from "../../../../../shared/data/common/occupation-dto";
import {EntityDto, IdentityModeDTO} from "../../../data/entityDto";
import {ClientTitleDTO} from "../../../data/accountDTO";
import {EntityService} from "../../../services/entity/entity.service";
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";

const log = new Logger( 'NewIntermediaryComponent');

@Component({
  selector: 'app-new-intermediary',
  templateUrl: './new-intermediary.component.html',
  styleUrls: ['./new-intermediary.component.css']
})
export class NewIntermediaryComponent implements OnInit{

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  createIntermediaryForm: FormGroup;
  submit = false;
  url = ""
  public showHideInputs: boolean;
  selectedOption: String = '';

  countryData: CountryDto[] = [];
  selectedCountry: number;
  selectedBank: number;
  citiesData: StateDto[] = [];
  selectedCityState: number;
  townData: TownDto[] = [];
  modeIdentityType: IdentityModeDTO[] = [];
  accountsType: AccountTypeDTO[] = [];
  // successMessages: Message[];
  sectorData: SectorDTO[];
  currenciesData: CurrencyDTO[];
  occupationData: OccupationDTO[];
  agentsTitlesData : ClientTitleDTO[];
  banksData: BankDTO[];
  bankBranchData: BankBranchDTO[];
  entityDetails: EntityDto;
  groupId: string = 'intermediaryTab';
  submitted = false;
  response: any;
  utilityBill: string = 'N';

  agentType: string = 'I';
  isCreditAllowed = [
    {name: "YES"},
    {name: "NO"}
  ]

  isWithHoldingTaxApplcable: string = 'Y';
  // visibleStatus: IntermediaryFormFieldsDTO = {};
  visibleStatus: any = {
    agentType: 'Y',
    accountType: 'Y',
    identityType: 'Y',
    citizenship: 'Y',
    surname: 'Y',
    otherName: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    agentTitle: 'Y',
    smsNumber: 'Y',
    telNumber: 'Y',
    emailAddress: 'Y',
    contactChannel: 'Y',
    eDocument: 'Y',
    boxNumber: 'Y',
    country: 'Y',
    county: 'Y',
    town: 'Y',
    physicalAddress: 'Y',
    town_residential: 'Y',
    road: 'Y',
    houseNumber: 'Y',
    utilityAddressProof: 'Y',
    utilityAddressUpload: 'Y',
    uploadUtilityBill: 'Y',
    bank: 'Y',
    branch: 'Y',
    accountNumber: 'Y',
    currency: 'Y',
    withEffectTo: 'Y',
    withEffectFrom: 'Y',
    mpayNumber: 'Y',
    iban: 'Y',
    prefferedChannel: 'Y',
    wealth_citizenship: 'Y',
    maritalStatus: 'Y',
    sourceOfFund: 'Y',
    employmentType: 'Y',
    economicSector: 'Y',
    occupation: 'Y',
    insurancePurpose: 'Y',
    premiumFrequency: 'Y',
    distributeChannel: 'Y',
    creditAllowed: 'Y',
    creditLimit: 'Y',
    vatApplicable: 'Y',
    withHoldingTaxApplicable: 'Y',
    withHoldingTax: 'Y'
  };

  agentBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Account',
      url: '/home/entity/intermediary',
    },
    {
      label: 'New Account',
      url: '/home/entity/intermediary/new'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private countryService: CountryService,
    private sectorService: SectorService,
    private occupationService: OccupationService,
    private intermediaryService: IntermediaryService,
    private entityService: EntityService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private bankService: BankService,
    private datePipe: DatePipe,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService
  ) { }

  /**
   * The `ngOnInit` function initializes various data by making multiple API calls and subscribing to the responses.
   */
  ngOnInit(): void {
    this.createIntermediaryRegForm();
    this.fetchCountries();
    forkJoin([
      this.intermediaryService.getIdentityType(),
      this.intermediaryService.getAccountType(),
      this.sectorService.getSectors(2),
      this.bankService.getCurrencies(),
      this.occupationService.getOccupations(2),
      this.entityService.getClientTitles(2),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([ identityType, accountType, sector, currency, occupation, agent, ]) => {
          this.modeIdentityType = identityType;
          this.accountsType = accountType;
          this.sectorData = sector;
          this.currenciesData = currency;
          this.occupationData = occupation;
          this.agentsTitlesData = agent;
        });
  }

  /**
   * The ngOnDestroy function is a lifecycle hook in Angular that is called when a component is about to be destroyed.
   */
  ngOnDestroy(): void {}

  /**
   * The function `onUpload` reads and converts the contents of a file into a data URL.
   * @param event - The event parameter is an object that represents the event that triggered the function. In this case,
   * it is the event object that is generated when a file is uploaded. It contains information about the uploaded file,
   * such as its name, size, and type.
   */
  onUpload(event) {
    if (event.target.files) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result
      }
    }
  }

  /**
   * The function `createIntermediaryRegForm()` creates a form using the FormBuilder module in Angular, sets up form
   * controls and validators based on the response from an API call, and populates some fields with data from the session
   * storage.
   */
  createIntermediaryRegForm() {
    this.createIntermediaryForm =  this.fb.group({
      agentType: [''],
      accountType: [''],
      identityType: [''],
      citizenship: [''],
      surname: new FormControl({value: '', disabled: true}),
      otherName: new FormControl({value: '', disabled: true}),
      dateOfBirth: new FormControl({value: '', disabled: true}),
      idNumber: new FormControl({value: '', disabled: true}),
      pinNumber: new FormControl({value: '', disabled: true}),
      gender: [''],

      contactDetails: this.fb.group(
        {
          agentTitle: [''],
          smsNumber: [''],
          telNumber: [''],
          emailAddress: [''],
          contactChannel: [''],
          eDocument: [''],
        },
      ),

      addressDetails: this.fb.group(
        {
          boxNumber: [''],
          country: [''],
          county: [''],
          town: [''],
          physicalAddress: [''],
          town_residential: [''],
          road: [''],
          houseNumber: [''],
          utilityAddressProof: [''],
          utilityAddressUpload: [''],
          uploadUtilityBill: [''],
        },
      ),

      paymentDetails: this.fb.group(
        {
          bank: [''],
          branch: [''],
          accountNumber: [''],
          currency: [''],
          withEffectTo: [''],
          withEffectFrom: [''],
          mpayNumber: [''],
          iban: [''],
          prefferedChannel: [''],
        },
      ),

      wealthDetails: this.fb.group(
        {
          wealth_citizenship: [''],
          maritalStatus: [''],
          sourceOfFund: [''],
          employmentType: [''],
          economicSector: [''],
          occupation: [''],
          insurancePurpose: [''],
          premiumFrequency: [''],
          distributeChannel: [''],
        },
      ),

      otherDetails: this.fb.group(
        {
          creditAllowed: [''],
          creditLimit: [''],
          vatApplicable: [''],
          withHoldingTaxApplicable: [''],
          withHoldingTax: ['']
        }
      )
    });
    this.entityDetails = JSON.parse(sessionStorage.getItem('entityDetails'));
    this.entityService
      .currentEntity$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        currentEntity => this.entityDetails = currentEntity
      );
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe((response) => {
        this.response = response; // Store the response in a class property
        response.forEach((field) =>{
          for (const key of Object.keys(this.createIntermediaryForm.controls)) {

            /*const value = (Object.keys(this.createIntermediaryForm.getRawValue()));
            const index = value.indexOf(field.frontedId);

            log.info('name', field.frontedId)

            if (field.frontedId === value[index] ) {
              log.info('values', value, value[index], index, field.visibleStatus)

              log.info('visible status', this.visibleStatus)
            }*/
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.controls[key].addValidators(Validators.required);
                this.createIntermediaryForm.controls[key].updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }

          const addressControls = this.createIntermediaryForm.get('addressDetails') as FormGroup;
          for (const key of Object.keys(addressControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.get(`addressDetails.${key}`).setValidators(Validators.required);
                this.createIntermediaryForm.get(`addressDetails.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }
          const contactDetailsControls = this.createIntermediaryForm.get('contactDetails') as FormGroup;
          for (const key of Object.keys(contactDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.get(`contactDetails.${key}`).setValidators(Validators.required);
                this.createIntermediaryForm.get(`contactDetails.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }
          const paymentDetailsControls = this.createIntermediaryForm.get('paymentDetails') as FormGroup;
          for (const key of Object.keys(paymentDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.get(`paymentDetails.${key}`).setValidators(Validators.required);
                this.createIntermediaryForm.get(`paymentDetails.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }
          const wealthDetailsControls = this.createIntermediaryForm.get('wealthDetails') as FormGroup;
          for (const key of Object.keys(wealthDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.get(`wealthDetails.${key}`).setValidators(Validators.required);
                this.createIntermediaryForm.get(`wealthDetails.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }
          const otherDetailsControls = this.createIntermediaryForm.get('otherDetails') as FormGroup;
          for (const key of Object.keys(otherDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createIntermediaryForm.get(`otherDetails.${key}`).setValidators(Validators.required);
                this.createIntermediaryForm.get(`otherDetails.${key}`).updateValueAndValidity();
                const label = document.querySelector(`label[for=${field.frontedId}]`);
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }

          }

        })
        this.cdr.detectChanges();
      });
    this.createIntermediaryForm.patchValue({
      identityType: this.entityDetails?.modeOfIdentity?.id,
      otherName: this.entityDetails?.name.substring(0, this.entityDetails.name.indexOf(' ')),
      surname: this.entityDetails?.name.substring(this.entityDetails.name.indexOf(' ') + 1),
      dateOfBirth: this.datePipe.transform(this.entityDetails?.dateOfBirth, 'dd-MM-yyy'),
      idNumber: this.entityDetails?.identityNumber,
      pinNumber: this.entityDetails?.pinNumber,
    });
  }

  /**
   * The function toggles the visibility of certain inputs based on the selected option in a form.
   */
  toggleCreditAllowed() {
    const formValue = this.createIntermediaryForm.getRawValue();
    const selectedOption = formValue.otherDetails.creditAllowed
    if (selectedOption === 'YES') {
      this.showHideInputs = true;
    }
    else {
      this.showHideInputs = false;
    }
  }

  /**
   * The function "selectUserType" sets the value of "agentType" based on the selected value from a target element and logs
   * the selected value.
   * @param e - The parameter "e" is an event object that is passed to the function when it is triggered by an event. It
   * contains information about the event that occurred, such as the target element that triggered the event. In this case,
   * it is used to get the value of the selected option from a dropdown
   */
  selectUserType(e) {
    this.agentType = e.target.value;
    console.log(`userType >>>`, this.agentType, e.target.value)
  }

  /**
   * The function `selectWithHoldingTax()` retrieves the value of a checkbox and assigns it to a variable, then logs the
   * value to the console.
   */
  selectWithHoldingTax() {
    const formValue = this.createIntermediaryForm.getRawValue();
    this.isWithHoldingTaxApplcable = formValue.otherDetails.withHoldingTaxApplicable ? formValue.otherDetails.withHoldingTaxApplicable : null
    console.log(`Selected Option >>>`, this.isWithHoldingTaxApplcable);
  }

  /**
   * The function fetches a list of countries and updates the countryData variable, then updates the value of the country
   * field in the intermediary form.
   */
  fetchCountries(){
    log.info('Fetching countries list');
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countryData = data;
        if(this.countryData){
          this.createIntermediaryForm.patchValue({
            country: this.entityDetails.countryId
          });
        }
      });
  }

  /**
   * The function fetches a list of city states for a given country ID.
   * @param {number} countryId - The countryId parameter is a number that represents the unique identifier of a country. It
   * is used to fetch the city states list for a specific country.
   */
  fetchMainCityStates(countryId: number){
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService.getMainCityStatesByCountry(countryId)
      .subscribe( (data) => {
        this.citiesData  = data;
      })
  }

  /**
   * The function fetches a list of towns for a given city-state ID.
   * @param {number} stateId - The stateId parameter is a number that represents the ID of a city-state.
   */
  fetchTowns(stateId:number){
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  /**
   * The function "onCountryChange" resets the values of "county" and "town" in a form, calls a function to get banks based
   * on the selected country, retrieves main city states data for the selected country, and triggers change detection.
   */
  onCountryChange() {
    this.createIntermediaryForm.patchValue({
      county: null,
      town: null
    });

    this.getBanks(this.selectedCountry);
    this.countryService.getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.citiesData = data;
      });
    this.cdr.detectChanges();
  }

  /**
   * The function `onCityChange()` retrieves towns based on the selected city state and assigns the data to the `townData`
   * variable.
   */
  onCityChange() {
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  /**
   * The function `getBanks` retrieves bank data based on a country ID and assigns it to the `banksData` variable.
   * @param {number} countryId - The `countryId` parameter is a number that represents the ID of a country. It is used as a
   * parameter to fetch banks data specific to that country.
   */
  getBanks(countryId: number) {
    this.bankService.getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data;
      })
  }

  /**
   * The function "onBankSelection" resets the branch value in the intermediary form, calls the "getBankBranches" function
   * with the selected bank ID, and triggers change detection.
   */
  onBankSelection() {
    this.createIntermediaryForm.patchValue({
      branch: null
    });

    this.getBankBranches(this.selectedBank);
    this.cdr.detectChanges();
  }

  /**
   * The function retrieves bank branches based on a given bank ID and assigns the result to the bankBranchData variable.
   * @param {number} bankId - The bankId parameter is a number that represents the unique identifier of a bank.
   */
  getBankBranches(bankId: number) {
    if (bankId) {
      this.bankService.getBankBranchesByBankId(bankId).subscribe((branches) => {
        this.bankBranchData = branches;
      });
    } else {
      this.bankBranchData = [];
    }
  }

  /**
   * The function returns the controls of the createIntermediaryForm.
   * @returns The function `f()` is returning the controls of the `createIntermediaryForm`.
   */
  get f() { return this.createIntermediaryForm.controls; }

  /**
   * The `saveIntermediary()` function is used to save intermediary details by validating the form inputs and making an API
   * call to save the data.
   */
  saveIntermediary() {
    this.submitted = true;
    this.createIntermediaryForm.markAllAsTouched(); // Mark all form controls as touched to show validation errors
    setTimeout(() => {
      if (this.createIntermediaryForm.invalid) {
        const invalidControls = Array.from(document.querySelectorAll('.is-invalid')) as Array<HTMLInputElement | HTMLSelectElement>;

        let firstInvalidUnfilledControl: HTMLInputElement | HTMLSelectElement | null = null;

        for (const control of invalidControls) {
          if (!control.value) {
            firstInvalidUnfilledControl = control;
            break;
          }
        }

        if (firstInvalidUnfilledControl) {
          firstInvalidUnfilledControl.focus(); // Set focus to the first invalid and unfilled field
          const scrollContainer = this.utilService.findScrollContainer(firstInvalidUnfilledControl);
          if (scrollContainer) {
            scrollContainer.scrollTop = firstInvalidUnfilledControl.offsetTop; // Scroll the scrollable container to the top of the first invalid and unfilled field
          }
        } else {
          const firstInvalidControl = invalidControls[0];
          if (firstInvalidControl) {
            firstInvalidControl.focus(); // Set focus to the first invalid field
            const scrollContainer = this.utilService.findScrollContainer(firstInvalidControl);
            if (scrollContainer) {
              scrollContainer.scrollTop = firstInvalidControl.offsetTop; // Scroll the scrollable container to the top of the first invalid field
            }
          }
        }

        this.globalMessagingService.displayErrorMessage('Failed', 'Form is Invalid, Fill all required fields');
        return; // Exit the method if the form is invalid
      }

      // if (this.createIntermediaryForm.valid) {
      const agentFormValues = this.createIntermediaryForm.getRawValue();

      //preparing AgentReqDTO
      const agentDetails: AgentRequestDTO = {
        // accountTypeId: this.entityDetails.partyTypeId,
        agentIdNo: agentFormValues.idNumber,
        agentLicenceNo: "546556",
        // agentStatus: "ACTIVE",
        // category: this.agentType,
        creditLimit: agentFormValues.otherDetails.creditLimit ? agentFormValues.otherDetails.creditLimit : null,
        // gender: agentFormValues.gender,
        is_credit_allowed: agentFormValues.otherDetails.creditAllowed ? agentFormValues.otherDetails.creditAllowed : null,
        // name: agentFormValues.otherName + ' ' + agentFormValues.surname,
        vatApplicable: agentFormValues.otherDetails.vatApplicable ? agentFormValues.otherDetails.vatApplicable : null,
        withHoldingTax: agentFormValues.otherDetails.withHoldingTax ? agentFormValues.otherDetails.withHoldingTax : null,
        // withHoldingTaxApplicable: agentFormValues.otherDetails.withHoldingTaxApplicable
        systemId: 37,
        branchId: null
      }

      //preparing AddressDTO
      const addressDetails: AddressDTO = {
        box_number: agentFormValues.addressDetails.boxNumber,
        country_id: agentFormValues.addressDetails.country,
        estate: agentFormValues.addressDetails.county,
        fax:  "try",
        house_number: agentFormValues.addressDetails.houseNumber,
        id:  0,
        is_utility_address: agentFormValues.addressDetails.utilityAddressUpload ? agentFormValues.addressDetails.utilityAddressUpload : null,
        physical_address: agentFormValues.addressDetails.physicalAddress,
        postal_code: "44",
        residential_address: agentFormValues.addressDetails.town_residential,
        road: agentFormValues.addressDetails.road,
        state_id: agentFormValues.addressDetails.county,
        town_id: agentFormValues.addressDetails.town,
        zip: "1022"
      }

      //preparing contactDetailsDTO
      const contactsDetails: ContactDetailsDTO = {
        emailAddress: agentFormValues.contactDetails.emailAddress,
        id: 0,
        phoneNumber: agentFormValues.contactDetails.telNumber,
        receivedDocuments: "N",
        smsNumber: agentFormValues.contactDetails.smsNumber,
        titleShortDescription: "DR"
      }

      //preparing agentPostDTO
      const saveAgent: AgentPostDTO = {
        address: addressDetails,
        agentRequestDto: agentDetails,
        contactDetails: contactsDetails,
        partyId: this.entityDetails.id,
        partyTypeShortDesc: 'AGENT',
        createdBy: null,
        effectiveDateFrom: null,
        effectiveDateTo: null,
        modeOfIdentityid: agentFormValues.identityType,
        category: this.agentType,
        countryId: agentFormValues.citizenship,
        gender: agentFormValues.gender ? agentFormValues.gender : null,
        status: 'A',
        dateCreated: null,
        pinNumber: agentFormValues.pinNumber,
        accountType: agentFormValues.accountType,
        firstName: agentFormValues.otherName,
        lastName: agentFormValues.surname,
        dateOfBirth: this.entityDetails?.dateOfBirth,
        organizationId: 2

      }

      this.intermediaryService.saveAgentDetails(saveAgent)
        .subscribe( data => {
          this.globalMessagingService.clearMessages();
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Agent');
          this.router.navigate(['/home/entity/intermediary/list']);

        });
      // } else {
      // }
    });
  }

  /**
   * The function `selectUtilityBill` assigns the value of the selected utility bill to the `utilityBill` variable.
   * @param e - The parameter "e" is an event object that is passed to the function when it is triggered.
   */
  selectUtilityBill(e) {
    this.utilityBill = e.target.value;
    // log.info(`utilityBill >>>`, this.utilityBill, e.target.value)
  }
}
