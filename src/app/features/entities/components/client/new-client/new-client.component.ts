// import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EntityService } from '../../../services/entity/entity.service';
import { ClientService } from '../../../services/client/client.service';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { AccountService } from '../../../services/account/account.service';
import {Logger, UtilService} from "../../../../../shared/services";
import {CountryDto, StateDto, TownDto} from "../../../../../shared/data/common/countryDto";
import {SectorDTO} from "../../../../../shared/data/common/sector-dto";
import {BankBranchDTO, BankDTO, CurrencyDTO, FundSourceDTO} from "../../../../../shared/data/common/bank-dto";
import {OccupationDTO} from "../../../../../shared/data/common/occupation-dto";
import {ClientTitleDTO} from "../../../../../shared/data/common/client-title-dto";
import { ClientBranchesDto, ClientDTO, ClientTypeDTO } from '../../../data/ClientDTO';
import {BreadCrumbItem} from "../../../../../shared/data/common/BreadCrumbItem";
import {GlobalMessagingService} from "../../../../../shared/services/messaging/global-messaging.service";
import {CountryService} from "../../../../../shared/services/setups/country/country.service"
import {BankService} from "../../../../../shared/services/setups/bank/bank.service";
import {OccupationService} from "../../../../../shared/services/setups/occupation/occupation.service";
import {MandatoryFieldsService} from "../../../../../shared/services/mandatory-fields/mandatory-fields.service";
import {SectorService} from "../../../../../shared/services/setups/sector/sector.service";
import {untilDestroyed} from "../../../../../shared/services/until-destroyed";
import { DatePipe } from '@angular/common';
import {SetupsParametersService} from "../../../../../shared/services/setups-parameters.service";
const log =  new Logger("CreateClientComponent")

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.css']
})
/**
 * This Angular component handles the creation of a new client registration form.
 *  It includes form controls for various client details.The component also manages dynamic form field visibility
 * and validation based on user input and retrieves data from various services like country, bank,
 * sector, and occupation services. It allows users to upload documents and save the client's basic
 * information upon form submission. Additionally, it provides functionality for selecting countries,
 * cities, and bank branches based on user choices. Overall, it serves as the interface for creating and
 *  managing new client records within the application.
 */
export class NewClientComponent implements OnInit{

  public clientRegistrationForm: FormGroup;
  submitted = false;
  url = ""
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  countryData: CountryDto[] = [];
  citiesData: StateDto[] = [];
  townData: TownDto[] = [];
  countyData : StateDto[];
  sectorData: SectorDTO[];
  banksData: BankDTO[];
  bankBranchData: BankBranchDTO[];
  occupationData: OccupationDTO[];
  clientTitlesData: ClientTitleDTO[];
  fundSource: FundSourceDTO[];
  clients: ClientDTO[] = [];
  clientID: number;
  currenciesData : CurrencyDTO[];
  identityTypeData : IdentityModeDTO[];
  clientTypeData : ClientTypeDTO[];
  clientBranchData : ClientBranchesDto[];
  entityDetails: EntityDto;
  clientType: string = 'I';
  groupId: string = 'MainClientTab';
  selectedCountry: number;
  selectedCityState: number;
  selectedBank: number;
  utilityBill: string = 'N';
  // visibleStatus: ClientFormFieldsDTO = {};
  visibleStatus: any = {
    identity_type: 'Y',
    citizenship: 'Y',
    surname:'Y',
    certRegNo: 'Y',
    regName: 'Y',
    tradeName: 'Y',
    regDate: 'Y',
    countryOfIncorporation: 'Y',
    parentCompany: 'Y',
    otherName: 'Y',
    dateOfBirth: 'Y',
    idNumber: 'Y',
    pinNumber: 'Y',
    gender: 'Y',
    clientTypeId: 'Y',
    clientBranch: 'Y',
    clientTitle: 'Y',
    smsNumber: 'Y',
    phoneNumber: 'Y',
    email: 'Y',
    channel: 'Y',
    pinNo: 'Y',
    eDocuments: 'Y',
    box_number: 'Y',
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
  response: any;
  phoneNumberRegex:string;
  clientBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Home',
      url: '/home/dashboard'
    },
    {
      label: 'Account',
      url: '/home/dashboard',
    },
    {
      label: 'New Client',
      url: '/home/entity/client/new'
    }
  ];
  constructor(
    private clientService: ClientService,
    private globalMessagingService: GlobalMessagingService,
    private countryService: CountryService,
    private bankService: BankService,
    private sectorService: SectorService,
    private occupationService: OccupationService,
    private accountService: AccountService,
    private router: Router,
    private clientsService: ClientService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private entityService: EntityService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private utilService: UtilService,
    private setupsParameterService: SetupsParametersService
  ) { }
/**
 * Initializes the New Client Component.
 * - Retrieves entity details from session storage.
 * - Initializes the client registration form.
 * - Retrieves the client ID from route parameters.
 * - Fetches necessary data for populating form fields, including countries, sectors, currencies,
 *   client titles, identity types, occupations, client types, and client branches.
 */
  ngOnInit(): void {
    this.createClientRegistrationForm();
    const partyId = parseInt(this.activatedRoute.snapshot.queryParamMap.get('id'));
    this.getPartyDetails(partyId)

    this.fetchCountries();
    // this.getCountries();
    this.getSectors(2);
    this.getCurrencies();
    this.getClientTitles(2);
    this.getIdentityType();
    this.getOccupation(2);
    this.getClientType(2);
    this.getClientBranch();
  }

  /**
   * This method gets party from DB  to auto-populate Primary Identity
   * @param id 
   * @returns void
   */
  getPartyDetails(id: number): void {
    this.entityService.getEntityById(id)
    .subscribe({
      next: (party) => {
        this.entityDetails = {
          categoryName: party.categoryName,
          countryId: party.countryId,
          dateOfBirth: party.dateOfBirth,
          effectiveDateFrom: party.effectiveDateFrom,
          effectiveDateTo: party.effectiveDateTo,
          id: party.id,
          modeOfIdentity: party.modeOfIdentity,
          identityNumber: party.identityNumber,
          name: party.name,
          organizationId: party.organizationId,
          pinNumber: party.pinNumber,
          profilePicture: party.profilePicture,
          profileImage: party.profileImage
        };
        this.patchClientEntityFormValues()
      },
      error: (e) => {
        log.error(`error fetching parties >>>`, e)
      }
    })
  }

  /**
   * Creates client registration form with default values and validators.
   *  * This method sets up a complex nested form structure for capturing client information.   * @returns void
   */
  createClientRegistrationForm(): void {
    this.clientRegistrationForm = this.fb.group({
      partyTypeShtDesc: "CLIENT",
      partyId: 16673590,
      identity_type: new FormControl({value: '', disabled: true}),
      citizenship: [''],
      surname: new FormControl({value: '', disabled: true}),
      certRegNo: [''],
      regName: [''],
      tradeName: [''],
      regDate: [''],
      countryOfIncorporation: [''],
      parentCompany: [''],
      otherName: new FormControl({value: '', disabled: true}),
      dateOfBirth: new FormControl({value: '', disabled: true}),
      idNumber: new FormControl({value: '', disabled: true}),
      pinNumber: new FormControl({value: '', disabled: true}),
      gender: [''],
      clientTypeId: [''],

      contact_details: this.fb.group(
        {
          clientBranch: [''],
          clientTitle: [''],
          smsNumber: [''],
          phoneNumber: [''],
          email: [''],
          channel: [''],
          pinNo: [''],
          eDocuments: [''],
          countryCodeSms: [''],
          countryCodeTel: ['']
        },
      ),

      address: this.fb.group(
        {
          box_number: [''],
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

      next_of_kin_details: this.fb.group(
        {
          mode_of_identity: [''],
          identity_number: [''],
          full_name: [''],
          relationship: [''],
          phone_number: [''],
          email_address: [''],
          dateofbirth: [''],
        },
      ),

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
    this.defineSmsNumberFormat();
  }


  /**
   * Gets the SMS number regex format from DB and apply to phone number in client form
   * @returns void
   */
  defineSmsNumberFormat(): void {
    this.setupsParameterService.getParameters('SMS_NO_FORMAT')
    .subscribe({
      next: (param) => {
        const phoneNumberRegex = param[0].value;
        this.clientRegistrationForm.controls['contact_details'].get('smsNumber')?.addValidators([Validators.pattern(phoneNumberRegex)]);
        this.clientRegistrationForm.controls['contact_details'].get('smsNumber')?.updateValueAndValidity();
        this.clientRegistrationForm.controls['contact_details'].get('phoneNumber')?.addValidators([Validators.pattern(phoneNumberRegex)]);
        this.clientRegistrationForm.controls['contact_details'].get('phoneNumber')?.updateValueAndValidity();
        log.info(`from sms number format >>>`, param);
      },
      error: (e) => {
        log.error(`Error fetching SMS number format >>>`, e);
      }
    })
  }

  /**
   * Patch values to primary identity form details
   * @returns void
   */
  patchClientEntityFormValues(): void {
    this.clientRegistrationForm.patchValue({
      surname: this.entityDetails?.name.substring(0, this.entityDetails?.name.indexOf(' ')),
      otherName: this.entityDetails?.name.substring(this.entityDetails?.name.indexOf(' ') + 1),
      pinNumber: this.entityDetails?.pinNumber,
      dateOfBirth: this.datePipe.transform(this.entityDetails?.dateOfBirth, 'dd-MM-yyy'),
      idNumber: this.entityDetails?.identityNumber,
      identity_type: this.entityDetails?.modeOfIdentity?.name,
    });
  }
  

/**
 * After the view has been initialized, this method retrieves mandatory field data
 * and updates the visibility and validation of form fields based on the received data.
 */
  ngAfterViewInit() {
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe((response) =>{
        this.response = response; // Store the response in a class property
        response.forEach((field) =>{
          for (const key of Object.keys(this.clientRegistrationForm.controls)) {

            /*const value = (Object.keys(this.clientRegistrationForm.getRawValue()));
            const index = value.indexOf(field.frontedId);

            // log.info('name', field.frontedId)

            if (field.frontedId === value[index] ) {
              // log.info('values', value, value[index], index, field.visibleStatus)

              log.info('visible status', this.visibleStatus)
             }*/
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.clientRegistrationForm.controls[key].addValidators(Validators.required);
                this.clientRegistrationForm.controls[key].updateValueAndValidity();
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

          const addressControls = this.clientRegistrationForm.get('address') as FormGroup;
          for (const key of Object.keys(addressControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.clientRegistrationForm.get(`address.${key}`).setValidators(Validators.required);
                this.clientRegistrationForm.get(`address.${key}`).updateValueAndValidity();
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
          const contactDetailsControls = this.clientRegistrationForm.get('contact_details') as FormGroup;
          for (const key of Object.keys(contactDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;

            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.clientRegistrationForm.get(`contact_details.${key}`).addValidators(Validators.required);
                this.clientRegistrationForm.get(`contact_details.${key}`).updateValueAndValidity();
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
          const paymentDetailsControls = this.clientRegistrationForm.get('payment_details') as FormGroup;
          for (const key of Object.keys(paymentDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.clientRegistrationForm.get(`payment_details.${key}`).setValidators(Validators.required);
                this.clientRegistrationForm.get(`payment_details.${key}`).updateValueAndValidity();
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
          const wealthDetailsControls = this.clientRegistrationForm.get('wealth_details') as FormGroup;
          for (const key of Object.keys(wealthDetailsControls.controls)) {

            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.clientRegistrationForm.get(`wealth_details.${key}`).setValidators(Validators.required);
                this.clientRegistrationForm.get(`wealth_details.${key}`).updateValueAndValidity();
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


  /*options = [
    { value: 'Individual', label: 'Individual' },
    { value: 'Corporate', label: 'Corporate' },
  ];
  option= 'Individual';*/

/**
 * Handles the selection of a user type and updates the clientType property accordingly.
 * @param e - The event object containing information about the selected user type.
 */
  selectUserType(e) {
    this.clientType = e.target.value;
    console.log(`userType >>>`, this.clientType, e.target.value)
  }

  /**
 * Handles the selection of a utility bill type and updates the utilityBill property accordingly.
 * @param e - The event object containing information about the selected utility bill.
 */
  selectUtilityBill(e) {
    this.utilityBill = e.target.value;
    // log.info(`utilityBill >>>`, this.utilityBill, e.target.value)
  }
  get f() { return this.clientRegistrationForm.controls; }

  /**
 * Saves client basic information, including address, contact details, payment details,
 * and wealth details, by making an API call with the form values.
 */
  saveClientBasic() {
    this.submitted = true;
    this.clientRegistrationForm.markAllAsTouched(); // Mark all form controls as touched to show validation errors

    setTimeout( () => {
      if (this.clientRegistrationForm.invalid) {
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

      const clientFormValues = this.clientRegistrationForm.getRawValue();
      log.debug("Contact details->", clientFormValues)
      // Preparing address dto
      const address: any ={
        /* Todo:
            fax- no field for it but its on endpoint
            postal_code - no field for it but its on endpoint
            zip - no field for it but its on endpoint
            residential_address - no field for it but its on endpoint*/
        box_number: clientFormValues.address.box_number,
        country_id: clientFormValues.address.country,
        estate: clientFormValues.address.country,
        fax: null,
        house_number: clientFormValues.address.house_number,
        id: 0,
        is_utility_address: clientFormValues.address.is_utility_address ? clientFormValues.address.is_utility_address : null,
        physical_address: clientFormValues.address.physical_address,
        postal_code: null,
        residential_address: null,
        road: clientFormValues.address.road,
        state_id: 2,
        town_id: clientFormValues.address.town,
        utility_address_proof:clientFormValues.address.utility_address_proof,
        zip: "1022",
        phoneNumber: clientFormValues.address.phoneNumber
      }

      //preparing  contact dto
      const contact: any = {
        /*Todo: clientTitle - start end point,-philip/idah
            channel - SMS/Email- Drop down,-John
            pinNo - this is not necessary/ captured from  prime Identity,
            eDocuments - Which documement? to discuss this
            EmailFiled- to be provided,
            received Document- Field to be provided*/
        emailAddress: clientFormValues.contact_details.email, /*Todo: To add field for Email*/
        id: 0,
        // phoneNumber: clientFormValues.contact_details.phoneNumber,
        receivedDocuments: "N", /*Todo: provide field to capture*/
        // smsNumber: clientFormValues.contact_details.smsNumber,
        titleShortDescription: "DR",
        phoneNumber: clientFormValues.contact_details.countryCodeTel + clientFormValues.contact_details.phoneNumber,
        smsNumber: clientFormValues.contact_details.countryCodeSms + clientFormValues.contact_details.smsNumber,

      }

      //preparing next of kin dto
      /*const next_of_kins: NextKinsDTO = {
        /!* Todo:
            smsNumber- no field for it but its on endpoint
            relationship: Enums are (FATHER, MOTHER, SPOUSE),
            dateofbirth: not captured on endpoint*!/
        emailAddress: clientFormValues.next_of_kin_details.email_address,
        fullName: clientFormValues.next_of_kin_details.full_name,
        id: 0,
        identityNumber: clientFormValues.next_of_kin_details.identity_number,
        modeOfIdentityId: 1,
        phoneNumber: clientFormValues.next_of_kin_details.phone_number,
        relationship: "FATHER",
        smsNumber: ""
      }*/

      //preparing payment dto
      const payment: any = {
        /* Todo:
            bank: not captured in endpoint,
            mpayNo: not captured in endpoint,
            Iban: not captured in endpoint,*/
        account_number: clientFormValues.payment_details.account_number,
        bank_branch_id: clientFormValues.payment_details.branch,
        currency_id: clientFormValues.payment_details.currency,
        effective_from_date: clientFormValues.payment_details.effective_date_from,
        effective_to_date: clientFormValues.payment_details.effective_date_to,
        id: 0,
        is_default_channel: "N"
      }

      //preparing wealth dto
      const wealth: any = {
        /* Todo:
            typeOfEmployment: is of type LOV on frontend,
            purposeinInsurance: not captured in endpoint,
            premiumFrequency: not captured in endpoint,
            distributeChannel: not captured in endpoint,
            cr_form_required: not on frontend,
            cr_form_year: not on frontend*/
        citizenship_country_id: clientFormValues.wealth_details.wealth_citizenship,
        cr_form_required: "N",
        cr_form_year: 0,
        funds_source: clientFormValues.wealth_details.funds_source,
        id: 0,
        is_employed: "N",
        is_self_employed: "N",
        marital_status: clientFormValues.wealth_details.marital_status ? clientFormValues.wealth_details.marital_status : null,
        nationality_country_id: clientFormValues.wealth_details.country,
        occupation_id: clientFormValues.wealth_details.occupation,
        sector_id: clientFormValues.wealth_details.economic_sector,
        certificate_registration_number: null,
        certificate_year_of_registration: null,
        distributeChannel: null,
        insurancePurpose: null,
        operating_country_id: null,
        parent_country_id: null,
        premiumFrequency: null,
        registeredName: null,
        source_of_wealth_id: null,
        tradingName: null

      }

    const clientDetails: any = {
      clientBranchCode: clientFormValues.contact_details.clientBranch
    }
    //preparing Client Dto
    const saveClient: any = {
      address: address,
      contactDetails: contact,
      effectiveDateFrom: null,
      effectiveDateTo: null,
      id: 0,
      createdBy: null,
      partyId: this.entityDetails.id,
      partyTypeShortDesc: "CLIENT",
      paymentDetails: payment,
      clientDetails: clientDetails,
      firstName: clientFormValues.surname,
      gender: clientFormValues.gender ? clientFormValues.gender : null,
      lastName: clientFormValues.otherName,
      pinNumber: clientFormValues.pinNumber,
      category: this.clientType,
      status: "A",
      wealthAmlDetails:wealth,
      countryId: clientFormValues.citizenship,
      dateCreated: null,
      accountType: clientFormValues.clientTypeId,
      dateOfBirth: this.entityDetails?.dateOfBirth,
      organizationId: 2,
      modeOfIdentityid: this.entityDetails?.modeOfIdentity?.id,
      nextOfKinDetailsList: null,

      }
      this.clientsService.saveClientDetails(saveClient)
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(clientData => {
          this.globalMessagingService.clearMessages();
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Client');
          // this.clients = clientData;
          this.router.navigate(['home/entity/client/list']);
        });

    });
  }

/**
 * Handles file uploads and sets the URL of the uploaded file for display.
 * @param event - The file input change event containing uploaded files.
 */
  onUpload(event)
  {
    if (event.target.files) {
      var reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log('URL after upload:', this.url); // Add this line for debugging

      }
    }
  }



  uploadNextOfKins() {

  }

  /*toggleData() {
    this.toDisplay = !this.toDisplay;
  }*/

  // getCountries() {
  //   this.countryService.getCountries()
  //     .pipe(
  //       takeUntil(this.destroyed$),
  //     )
  //     .subscribe(
  //       (data) => {
  //         this.countryData = data.sort();
  //       },
  //     );
  // }

  /**
 * Fetches sectors data for the specified organization and updates the component's sectorData property.
 * @param organizationId - The ID of the organization for which sectors are being fetched.
 */
  getSectors(organizationId: number) {
    this.sectorService.getSectors(organizationId)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(
        (data) => {
          log.info("Testing data->", data)
          this.sectorData = data;
        },
      );
  }
  /**
 * Fetches currency data and updates the component's currenciesData property.
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
 * Fetches client titles based on the specified organization ID and updates the component's
 * clientTitlesData property.
 * @param organizationId The organization ID for which client titles are fetched.
 */
  getClientTitles(organizationId: number) {
    this.accountService.getClientTitles(organizationId)
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
 * Fetches identity types and updates the component's identityTypeData property.
 */
  getIdentityType() {
    this.clientsService.getIdentityType()
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
 * Fetches occupation data based on the provided organization ID and
 *  updates the component's occupationData property.
 * @param organizationId The organization ID used to retrieve occupation data.
 */
  getOccupation(organizationId: number) {
    this.occupationService.getOccupations(organizationId)
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
 * Fetches client types based on the provided organization ID and
 * updates the component's clientTypeData property.
 * @param organizationId The organization ID used to retrieve client types.
 */
  getClientType(organizationId: number) {
    this.clientService.getClientType(organizationId)
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.clientTypeData = data;
        },
      );
  }
  /**
 * Fetches client branches and updates the component's clientBranchData property.
 * This function is typically used to populate a dropdown or list of client branches.
 */
  getClientBranch() {
    this.clientsService.getCLientBranches()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.clientBranchData = data;
        },
      );
  }
  ngOnDestroy() {
  }
/**
 * Fetches a list of countries and updates the component's countryData property.
 * This function is typically used to populate a dropdown or list of countries.
 */
  fetchCountries(){
    log.info('Fetching countries list');
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countryData = data;
        // if(this.countryData){
        //   this.newServiceProviderForm.patchValue({
        //     country: this.entityDetails.countryId
        //   });
        // }
      });
  }
/**
 * Fetches a list of main city states for a specific country based on the given countryId
 * and updates the component's citiesData property.
 * This function is typically used to populate a dropdown or list of city states for a specific country.
 *
 * @param countryId - The unique identifier of the country for which city states are being fetched.
 */
  fetchMainCityStates(countryId: number){
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService.getMainCityStatesByCountry(countryId)
      .subscribe( (data) => {
        this.citiesData  = data;
      })
  }
/**
 * Fetches a list of towns for a specific city-state based on the given stateId
 * and updates the component's townData property.
 * This function is typically used to populate a dropdown or list of towns for a specific city-state.
 *
 * @param stateId - The unique identifier of the city-state for which towns are being fetched.
 */
  fetchTowns(stateId:number){
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }
/**
 * Handles the change event when a user selects a different country in a form.
 * This function resets the county and town fields in the form,
 * fetches the list of banks based on the selected country,
 * and fetches the main city-states for the selected country.
 * It also triggers change detection to update the view.
 */
  onCountryChange() {
    this.clientRegistrationForm.patchValue({
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
 * Handles the change event when a user selects a different city-state in a form.
 * This function fetches the list of towns associated with the selected city-state
 * and updates the townData property accordingly.
 */
  onCityChange() {
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
  }
/**
 * Fetches the list of banks based on the selected country ID and updates the banksData property.
 * It also logs the retrieved bank data for debugging purposes.
 * After receiving the bank data, you can call other functions to fetch bank branches or perform further actions.
 *
 * @param countryId - The ID of the selected country for which banks are being fetched.
 */
  getBanks(countryId: number) {
    this.bankService.getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data
        console.log('Bank DATA', this.banksData);
      })

      // Call getBankBranches after receiving banksData
  }
/**
 * Handles the selection of a bank by updating the selectedBank property and resetting the branch selection.
 * It triggers the retrieval of bank branches based on the selected bank ID.
 */
  onBankSelection() {
   /* const bankId = event.target.value; // Get the selected bank ID from the event
    this.getBankBranches(bankId);*/
    this.clientRegistrationForm.patchValue({
      branch: null
    });
    // Call getBanksbranches with the selected bank ID
    this.getBankBranches(this.selectedBank);
    this.cdr.detectChanges();
  }
/**
 * Retrieves bank branches based on the provided bank ID and updates the bankBranchData property.
 * @param bankId The ID of the selected bank to fetch branches for.
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

}
