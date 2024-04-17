import { ChangeDetectorRef, Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { BreadCrumbItem } from '../../../../../shared/data/common/BreadCrumbItem';
import { ContactsDTO, ProviderTypeDto, ServiceProviderDTO, ServiceProviderRequestDTO } from '../../../data/ServiceProviderDTO';
import { CountryDto, StateDto, TownDto } from '../../../../../shared/data/common/countryDto';
import { BankBranchDTO, BankDTO, CurrencyDTO } from '../../../../../shared/data/common/bank-dto';
import { DatePipe } from '@angular/common';
import { GlobalMessagingService } from '../../../../../shared/services/messaging/global-messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import {takeUntil} from "rxjs/operators";
import { ReplaySubject } from 'rxjs';
import {Logger, untilDestroyed, UtilService} from '../../../../../shared/shared.module';
import { SectorDTO } from '../../../../../shared/data/common/sector-dto';
import { ClientTitlesDto } from '../../../data/ClientDTO';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { OccupationDTO } from '../../../../../shared/data/common/occupation-dto';
import { PaymentDetailsDTO, WealthAmlDTO } from '../../../data/accountDTO';
import { AddressDTO } from '../../../data/AgentDTO';
import { BankService } from '../../../../../shared/services/setups/bank/bank.service';
import { CountryService } from '../../../../../shared/services/setups/country/country.service';
import {MandatoryFieldsService} from '../../../../../shared/services/mandatory-fields/mandatory-fields.service'
import { SectorService } from '../../../../../shared/services/setups/sector/sector.service';
import { ClientService } from '../../../services/client/client.service';
import { OccupationService } from '../../../../../shared/services/setups/occupation/occupation.service';
import {EntityService} from "../../../services/entity/entity.service";
import {AccountService} from "../../../services/account/account.service";
import {SetupsParametersService} from "../../../../../shared/services/setups-parameters.service";

const log = new Logger('NewServiceProviderComponent');

@Component({
  selector: 'app-new-service-provider',
  templateUrl: './new-service-provider.component.html',
  styleUrls: ['./new-service-provider.component.css']
})
export class NewServiceProviderComponent {
  serviceProviderBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'CRM',
      url: '/home/dashboard',
    },
    {
      label: 'Service Provider List',
      url: '/home/entity/service-provider/list'
    },
    {
      label: 'New',
      url: '/home/entity/service-provider/new'
    }
  ];

  public newServiceProviderForm: FormGroup;
  submitted = false;
  url = ""
  // toDisplay = true;
  countryData: CountryDto[] = [];
  citiesData: StateDto[] = [];
  townData: TownDto[] = [];
  sectorData : SectorDTO[];
  currenciesData :CurrencyDTO[];
  banksData: BankDTO[];
  bankBranchData: BankBranchDTO[];
  clientTitlesData : ClientTitlesDto[];
  countyData : CountryDto[];
  providerTypeData : ProviderTypeDto[];
  identityTypeData : IdentityModeDTO[];
  occupationData : OccupationDTO[];
  serviceProviders: ServiceProviderDTO[] = [];
  entityDetails: EntityDto;
  agentType: string = 'I';
  groupId: string = 'serviceProviderTab';
  selectedCountry: number;
  selectedCityState: number;
  selectedBank: number;
  utilityBill: string = 'N';
  response: any;
  phoneNumberRegex:string;
  // visibleStatus: ServiceProviderFormFieldsDTO = {}
  visibleStatus: any = {
    account_type: 'Y',
    account_type_id: 'Y',
    providerType: 'Y',
    identityType: 'Y',
    citizenship: 'Y',
    firstName: 'Y',
    certRegNo: 'Y',
    regName: 'Y',
    tradeName: 'Y',
    regDate: 'Y',
    countryOfIncorporation: 'Y',
    parentCompany: 'Y',
    otherName: 'Y',
    dateOfBirth: 'Y',
    txtIdNo: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    clientTitle: 'Y',
    smsNumber: 'Y',
    phone_number: 'Y',
    email: 'Y',
    channel: 'Y',
    eDocuments: 'Y',
    txtProviderPostalAddress: 'Y',
    country: 'Y',
    county: 'Y',
    town: 'Y',
    physical_address: 'Y',
    road: 'Y',
    house_number: 'Y',
    utility_address_proof: 'Y',
    is_utility_address: 'Y',
    bank: 'Y',
    branch: 'Y',
    account_number: 'Y',
    currency: 'Y',
    effective_to_date: 'Y',
    effective_from_date: 'Y',
    mpayNo: 'Y',
    Iban: 'Y',
    is_default_channel: 'Y',
    wealth_citizenship: 'Y',
    marital_status: 'Y',
    funds_source: 'Y',
    typeOfEmployment: 'Y',
    economic_sector: 'Y',
    occupation: 'Y',
    purposeinInsurance: 'Y',
    premiumFrequency: 'Y',
    distributeChannel: 'Y'
  };

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private partyId: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private globalMessagingService: GlobalMessagingService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private serviceProviderService:ServiceProviderService,
    private utilService:UtilService,
    private bankService:BankService,
    private countryService: CountryService,
    private mandatoryService:MandatoryFieldsService,
    private sectorService:SectorService,
    private clientService:ClientService,
    private occupationService:OccupationService,
    private entityService: EntityService,
    private accountService: AccountService,
    private setupsParameterService: SetupsParametersService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.serviceProviderRegForm()
    this.fetchCountries();
    this.getSectors();
    this.getCurrencies();
    this.getClientTitles();
    this.getIdentityType();
    this.getOccupation();
    this.getServiceProviderType();
  }

  /**
 * Handles the selection of a user type.
 *
 * @param {Event} e - The event triggered by the user's selection.
 * @remarks
 * This method is responsible for capturing the selected user type from an event and assigning it to the 'agentType' property.
 * The 'agentType' property represents the chosen user type.
 */
  selectUserType(e) {
    this.agentType = e.target.value;

  }
  /**
 * Getter function to access form controls within 'newServiceProviderForm'.
 * @returns {AbstractControl} The form controls within the 'newServiceProviderForm' form group.
 * @remarks
 * This getter allows convenient access to the form controls within the 'newServiceProviderForm' form group.
 */

  get f() {
    return this.newServiceProviderForm.controls;
  }

  /**
   * This method fetches the entity details using the party/entity id
   * @returns void
   */
  getEntityDetails() : void {
    this.partyId = +(this.activatedRoute.snapshot.queryParamMap.get('id'));
    this.entityService.getEntityById(this.partyId)
      .pipe()
      .subscribe({
        next: (entityDetails: EntityDto) => {
          log.info(`fetched service provider details`, entityDetails);
          this.patchServiceProviderFormValues(entityDetails);
        },
        error: (err) => {}
      });
  }

  /**
   * This method patches the service provider form with entity values
   * @param entityDetails<EntityDto>
   * @returns void
   */
  patchServiceProviderFormValues(entityDetails: EntityDto) {
    this.newServiceProviderForm.patchValue({
      firstName: entityDetails?.name.substring(0, entityDetails?.name.indexOf(' ')),
      otherName: entityDetails?.name.substring(entityDetails?.name.indexOf(' ') + 1),
      pinNumber: entityDetails?.pinNumber,
      dateOfBirth: this.datePipe.transform(entityDetails?.dateOfBirth, 'dd-MM-yyy'),
      txtIdNo: entityDetails?.identityNumber,
      identityType: entityDetails?.modeOfIdentity?.name,
    });
  }

/**
 * Initializes and configures the service provider registration form.
 * @remarks
 * This method sets up and configures the 'newServiceProviderForm' using Angular's FormBuilder (fb).
 * It defines the structure of the form, including form controls and nested form groups.
 * The method also subscribes to relevant observables and fetches data to populate the form.
 * Additionally, it handles form validation and displays asterisks for mandatory fields.
 */

  serviceProviderRegForm() {
    this.newServiceProviderForm = this.fb.group({
      account_type: [''],
      account_type_id: [''],
      providerType: [''],
      identityType: new FormControl({value: '', disabled: true}),
      citizenship: [''],
      firstName: new FormControl({value: '', disabled: true}),
      certRegNo: [''],
      regName: [''],
      tradeName: [''],
      regDate: [''],
      countryOfIncorporation: [''],
      parentCompany: [''],
      otherName: new FormControl({value: '', disabled: true}),
      dateOfBirth: new FormControl({value: '', disabled: true}),
      txtIdNo: new FormControl({value: '', disabled: true}),
      pinNumber: new FormControl({value: '', disabled: true}),
      gender: [''],

      contact_details: this.fb.group(
        {
          clientTitle: [''],
          smsNumber: [''],
          phone_number: [''],
          email: [''],
          channel: [''],
          eDocuments: [''],
          countryCodeSms: [''],
          countryCodeTel: ['']
        },
      ),

     address: this.fb.group(
        {
          txtProviderPostalAddress: [''],
          country: [''],
          county: [''],
          town: [''],
          physical_address: [''],
          road: [''],
          house_number: [''],
          utility_address_proof: [''],
          is_utility_address: [''],
        },
      ),

      payment_details: this.fb.group(
        {
          bank: [''],
          branch: [''],
          account_number: [''],
          currency: [''],
          effective_to_date: [''],
          effective_from_date: [''],
          mpayNo: [''],
          Iban: [''],
          is_default_channel: [''],
        },
      ),

      /*next_of_kin_details: this.fb.group(
        {
          mode_of_identity: ['', Validators.required],
          identity_number: ['', Validators.required],
          full_name: ['', Validators.required],
          relationship: ['', Validators.required],
          phone_number: ['', Validators.required],
          email_address: ['', Validators.required],
          dateofbirth: ['', Validators.required],
        },
      ),*/

      wealth_details: this.fb.group(
        {
          wealth_citizenship: [''],
          marital_status: [''],
          funds_source: [''],
          typeOfEmployment: [''],
          economic_sector: [''],
          occupation: [''],
          purposeinInsurance: [''],
          premiumFrequency: [''],
          distributeChannel: [''],
        },
      ),

    });

  this.getEntityDetails();

  let name = 'SMS_NO_FORMAT';
  this.setupsParameterService.getParameters(name)
    .subscribe((data) => {
      data.forEach((field) => {
        if (field.name === 'SMS_NO_FORMAT') {
          this.phoneNumberRegex = field.value;
          this.newServiceProviderForm.controls['contact_details'].get('smsNumber')?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.newServiceProviderForm.controls['contact_details'].get('smsNumber')?.updateValueAndValidity();

          this.newServiceProviderForm.controls['contact_details'].get('phone_number')?.addValidators([Validators.pattern(this.phoneNumberRegex)]);
          this.newServiceProviderForm.controls['contact_details'].get('phone_number')?.updateValueAndValidity();
        }
        log.info('parameters>>>', this.phoneNumberRegex)
      });
    });
    this.mandatoryService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe((response) =>{
        this.response = response; // Store the response in a class property
        response.forEach((field) =>{
          for (const key of Object.keys(this.newServiceProviderForm.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.newServiceProviderForm.controls[key].addValidators(Validators.required);
                this.newServiceProviderForm.controls[key].updateValueAndValidity();
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

         const addressControls = this.newServiceProviderForm.get('address') as FormGroup;
          for (const key of Object.keys(addressControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.newServiceProviderForm.get(`address.${key}`).setValidators(Validators.required);
                this.newServiceProviderForm.get(`address.${key}`).updateValueAndValidity();
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
          //touched and invalid
          const contactDetailsControls = this.newServiceProviderForm.get('contact_details') as FormGroup;
          for (const key of Object.keys(contactDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.newServiceProviderForm.get(`contact_details.${key}`).addValidators(Validators.required);
                this.newServiceProviderForm.get(`contact_details.${key}`).updateValueAndValidity();
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
          const paymentDetailsControls = this.newServiceProviderForm.get('payment_details') as FormGroup;
          for (const key of Object.keys(paymentDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.newServiceProviderForm.get(`payment_details.${key}`).setValidators(Validators.required);
                this.newServiceProviderForm.get(`payment_details.${key}`).updateValueAndValidity();
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
          const wealthDetailsControls = this.newServiceProviderForm.get('wealth_details') as FormGroup;
          for (const key of Object.keys(wealthDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.newServiceProviderForm.get(`wealth_details.${key}`).setValidators(Validators.required);
                this.newServiceProviderForm.get(`wealth_details.${key}`).updateValueAndValidity();
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
  }

  /**
 * Fetches a list of banks based on the selected country.
 *
 * @param {number} countryId - The ID of the selected country.
 * @remarks
 * This method makes an HTTP request to retrieve a list of banks associated with the specified country.
 * The fetched data is stored in the 'banksData' property for use in the form.
 */
  getBanks(countryId: number) {
    this.bankService.getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data
      })
  }
  /**
 * Handles changes when the selected country in the form changes.
 * @remarks
 * This method is triggered when the user selects a different country.
 * It performs tasks such as resetting certain form values, fetching banks for the selected country, and updating city data.
 */
  onCountryChange() {
    this.newServiceProviderForm.patchValue({
      county: null,
      town: null
    });
    // Call getBanks with the selected country ID
    this.getBanks(this.selectedCountry);
    this.countryService.getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.citiesData = data;
      });
    this.cdr.detectChanges();
  }
  /**
 * Handles changes when the selected city/state in the form changes.
 * @remarks
 * This method is triggered when the user selects a different city/state.
 * It fetches towns associated with the selected city/state and updates the town data accordingly.
 */
  onCityChange() {
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
  }
  /**
 * Handles the selection of a utility bill type.
 *
 * @param {Event} e - The event triggered by the user's selection.
 * @remarks
 * This method captures the selected utility bill type from an event and assigns it to the 'utilityBill' property.
 * The 'utilityBill' property represents the chosen utility bill type.
 */
  selectUtilityBill(e) {
    this.utilityBill = e.target.value;
  }
  /**
 * Handles file upload events.
 *
 * @param {Event} event - The file input change event.
 * @remarks
 * This method reads and processes a file selected by the user. It checks if files are present in the event,
 * reads the selected file as a data URL, and assigns the result to the 'url' property.
 * The 'url' property can be used to display or process the uploaded file.
 */
  onUpload(event)
  {
    if (event.target.files) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result
      }
    }
  }
  /**
 * Handles changes when a bank is selected in the form.
 * @remarks
 * This method is responsible for handling changes when a bank is selected in the form.
 * It sets the 'branch' form control to null, and then calls 'getBankBranches' to fetch and update bank branches based on the selected bank.
 * Additionally, it triggers change detection.
 */
  onBankSelection() {

    this.newServiceProviderForm.patchValue({
      branch: null
    });
    // Call getBanksbranches with the selected bank ID
    this.getBankBranches(this.selectedBank);
    this.cdr.detectChanges();
  }
  /**
 * Fetches and updates bank branches based on the selected bank.
 *
 * @param {number} bankId - The ID of the selected bank.
 * @remarks
 * This method makes an HTTP request to retrieve a list of bank branches associated with the specified bank.
 * The fetched branch data is stored in the 'bankBranchData' property for use in the form.
 * If 'bankId' is falsy, indicating no bank is selected, it clears the 'bankBranchData'.
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
 * Saves the service provider information submitted via the form.
 * @remarks
 * This method is responsible for saving the service provider information when the form is submitted.
 * It performs form validation, checks for required fields, and constructs DTOs for various parts of the service provider data.
 * After preparing the data, it makes an HTTP request to save the service provider.
 * If the form is invalid, it displays an error message and scrolls to the first invalid field.
 * If the form is valid and the service provider is saved successfully, it displays a success message and navigates to a new page.
 */
    saveServiceProvider() {
      this.submitted = true;
      this.newServiceProviderForm.markAllAsTouched(); // Mark all form controls as touched to show validation errors

      console.log('FORM,>>', this.newServiceProviderForm.controls)

      setTimeout( () => {
        if (this.newServiceProviderForm.invalid) {
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

        const serviceproviderFormValues = this.newServiceProviderForm.getRawValue();
        // Preparing address dto
        const address: AddressDTO ={
          /* Todo:
              fax- no field for it but its on endpoint
              postal_code - no field for it but its on endpoint
              zip - no field for it but its on endpoint
              residential_address - no field for it but its on endpoint*/
          box_number: serviceproviderFormValues.address.box_number,
          country_id: serviceproviderFormValues.address.country,
          estate: serviceproviderFormValues.address.country,
          fax: "try",
          house_number: serviceproviderFormValues.address.house_number,
          id: 0,
          is_utility_address: serviceproviderFormValues.address.is_utility_address ? serviceproviderFormValues.address.is_utility_address : null,
          physical_address: serviceproviderFormValues.address.physical_address,
          postal_code: "44",
          residential_address: "kibera",
          road: serviceproviderFormValues.address.road,
          state_id: 2,
          town_id: serviceproviderFormValues.address.town,
          // utility_address_proof:serviceproviderFormValues.address.utility_address_proof,
          zip: "1022",
          // phoneNumber: serviceproviderFormValues.address.phoneNumber
        }
        //preparing  contact dto

        const contact: ContactsDTO = {
          /*Todo: clientTitle - start end point,-philip/idah
              channel - SMS/Email- Drop down,-John
              pinNo - this is not necessary/ captured from  prime Identity,
              eDocuments - Which documement? to discuss this
              EmailFiled- to be provided,
              received Document- Field to be provided*/
          emailAddress: serviceproviderFormValues.contact_details.email, /*Todo: To add field for Email*/
          id: 0,
          // phoneNumber: serviceproviderFormValues.contact_details.phone_number,
          receivedDocuments: "N", /*Todo: provide field to capture*/
          // smsNumber: serviceproviderFormValues.contact_details.smsNumber,
          titleShortDescription: "DR",
          preferredChannel: null,
          phoneNumber: serviceproviderFormValues.contact_details.countryCodeTel + serviceproviderFormValues.contact_details.phone_number,
          smsNumber: serviceproviderFormValues.contact_details.countryCodeSms + serviceproviderFormValues.contact_details.smsNumber,
        }
        //preparing payment dto
        const payment: PaymentDetailsDTO = {
          /* Todo:
              bank: not captured in endpoint,
              mpayNo: not captured in endpoint,
              Iban: not captured in endpoint,*/
          account_number: serviceproviderFormValues.payment_details.account_number,
          bank_branch_id: serviceproviderFormValues.payment_details.branch,
          currency_id: serviceproviderFormValues.payment_details.currency,
          effective_from_date: serviceproviderFormValues.payment_details.effective_date_from,
          effective_to_date: serviceproviderFormValues.payment_details.effective_date_to,
          id: 0,
          is_default_channel: "N"
        }
        const wealth: WealthAmlDTO = {
          /* Todo:
              typeOfEmployment: is of type LOV on frontend,
              purposeinInsurance: not captured in endpoint,
              premiumFrequency: not captured in endpoint,
              distributeChannel: not captured in endpoint,
              cr_form_required: not on frontend,
              cr_form_year: not on frontend*/
          citizenship_country_id: serviceproviderFormValues.wealth_details.wealth_citizenship,
          cr_form_required: "N",
          cr_form_year: 0,
          funds_source: serviceproviderFormValues.wealth_details.funds_source,
          id: 0,
          is_employed: "N",
          is_self_employed: "N",
          marital_status: serviceproviderFormValues.wealth_details.marital_status ? serviceproviderFormValues.wealth_details.marital_status : null,
          nationality_country_id: serviceproviderFormValues.wealth_details.country,
          occupation_id: serviceproviderFormValues.wealth_details.occupation,
          sector_id: serviceproviderFormValues.wealth_details.economic_sector,
          certificate_registration_number: 0,
          certificate_year_of_registration: '',
          distributeChannel: '',
          insurancePurpose: '',
          operating_country_id: null,
          parent_country_id: 0,
          premiumFrequency: '',
          registeredName: '',
          source_of_wealth_id: 0,
          tradingName: ''
        }
        const servProvider: ServiceProviderRequestDTO = {
          // category: this.agentType,
          parentCompany: serviceproviderFormValues.parentCompany,
          systemId: 37,
          systemShtDesc: "GIS",
          tradeName: serviceproviderFormValues.tradeName,
          // yearOfRegistration: null,
          // citizenship_country_id: serviceproviderFormValues.citizenship,
          // dateCreated: serviceproviderFormValues.regDate,
          // effectiveDateFrom: null,
          // gender: serviceproviderFormValues.gender,
          id: 0,
          // idNumber: serviceproviderFormValues.txtIdNo,
          // modeOfIdentity: this.entityDetails.modeOfIdentity.name,
          // name: serviceproviderFormValues.firstName + ' ' + serviceproviderFormValues.otherName,
          // pinNumber: serviceproviderFormValues.pinNumber,
          providerLicenseNo: null,
          // providerStatus: "N",
          // providerTypeId: serviceproviderFormValues.providerType,
          // shortDescription: null,
          // status: "N",
          // type: null,
          vatNumber: null

        }
        //preparing Service provider DTO
        const saveServiceProvider = {
          address: address,
          contactDetails: contact,
          createdBy: null,
          effectiveDateFrom: null,
          effectiveDateTo: null,
          id: 0,
          organizationId: 2,
          category: this.agentType,
          countryId: serviceproviderFormValues.citizenship,
          gender: serviceproviderFormValues.gender ? serviceproviderFormValues.gender : null,
          status: "A",
          dateCreated: serviceproviderFormValues.regDate,
          pinNumber: serviceproviderFormValues.pinNumber,
          accountType: +serviceproviderFormValues.providerType,
          firstName: serviceproviderFormValues.firstName,
          lastName: serviceproviderFormValues.otherName,
          dateOfBirth: this.entityDetails?.dateOfBirth,
          name:null,
          partyId: this.partyId,
          partyTypeShortDesc: "SPR",
          modeOfIdentityid: this.entityDetails?.modeOfIdentity.id,
          paymentDetails: payment,
          serviceProviderRequest: servProvider,
          wealthAmlDetails: wealth
        }
        log.info(`service provider to save ==> `, saveServiceProvider);
        this.serviceProviderService.saveServiceProvider(saveServiceProvider)
          .pipe(
            takeUntil(this.destroyed$),
          )
          .subscribe(serviceProviderData => {
            this.globalMessagingService.clearMessages();
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Service Provider');
            // this.serviceProviders = serviceProviderData;
            this.router.navigate(['home/entity/service-provider/list']);
          });

      });
    }

    /**
     * Fetches a list of countries and populates the 'countryData' property.
     * @remarks
     * This method sends an HTTP request to retrieve a list of countries from the 'countryService'.
     * Upon receiving the data, it assigns the result to the 'countryData' property for use in the component.
     * Additionally, it logs a message indicating that the countries list is being fetched.
     */
  fetchCountries(){
    console.log('Fetching countries list');
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countryData = data;
      });
  }
  /**
 * Fetches a list of sectors and populates the 'sectorData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of sectors from the 'sectorService'.
 * It uses the 'untilDestroyed' pipe to automatically unsubscribe from the observable when the component is destroyed.
 * Upon receiving the data, it assigns the result to the 'sectorData' property for use in the component.
 */
  getSectors() {
    this.sectorService.getSectors(2)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(
        (data) => {
          this.sectorData = data;
        },
      );
  }
  /**
 * Fetches a list of currencies and populates the 'currenciesData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of currencies from the 'bankService'.
 * It uses the 'takeUntil' operator to unsubscribe from the observable when the 'destroyed$' subject emits.
 * Upon receiving the data, it assigns the result to the 'currenciesData' property for use in the component.
 */
  getCurrencies() {
    this.bankService.getCurrencies()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.currenciesData = data;
        },
      );
  }
  /**
 * Fetches a list of client titles and populates the 'clientTitlesData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of client titles from the 'serviceProviderService'.
 * It uses the 'takeUntil' operator to unsubscribe from the observable when the 'destroyed$' subject emits.
 * Upon receiving the data, it assigns the result to the 'clientTitlesData' property for use in the component.
 */
  getClientTitles() {
    this.accountService.getClientTitles(2)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.clientTitlesData = data;
        },
      );
  }

/**
 * Fetches a list of identity types and populates the 'identityTypeData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of identity types from the 'clientService'.
 * It uses the 'takeUntil' operator to unsubscribe from the observable when the 'destroyed$' subject emits.
 * Upon receiving the data, it assigns the result to the 'identityTypeData' property for use in the component.
 */
  getIdentityType() {
    this.clientService.getIdentityType()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.identityTypeData = data;
        },
      );
  }
  /**
 * Fetches a list of occupations and populates the 'occupationData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of occupations from the 'occupationService'.
 * It uses the 'takeUntil' operator to unsubscribe from the observable when the 'destroyed$' subject emits.
 * Upon receiving the data, it assigns the result to the 'occupationData' property for use in the component.
 */
  getOccupation() {
    this.occupationService.getOccupations(2)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.occupationData = data;
        },
      );
  }
  /**
 * Fetches a list of service provider types and populates the 'providerTypeData' property.
 * @remarks
 * This method sends an HTTP request to retrieve a list of service provider types from the 'serviceProviderService'.
 * It uses the 'takeUntil' operator to unsubscribe from the observable when the 'destroyed$' subject emits.
 * Upon receiving the data, it assigns the result to the 'providerTypeData' property for use in the component.
 * Additionally, it logs the provider type data for debugging purposes.
 */
  getServiceProviderType() {
    this.serviceProviderService.getServiceProviderType()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.providerTypeData = data;
          console.log('Provider Type' + this.providerTypeData)
        },
      );
  }
  ngOnDestroy() {
  }


}
