import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadCrumbItem } from 'src/app/shared/data/common/BreadCrumbItem';
import {  
  ContactsDTO,
  
         ProviderTypeDto, 
         ServiceProviderDTO,
         ServiceProviderRequestDTO, 
        } from '../../../data/ServiceProviderDTO';
import { CountryDto, StateDto, TownDto } from 'src/app/shared/data/common/countryDto';
import { BankBranchDTO, BankDTO, CurrencyDTO } from 'src/app/shared/data/common/bank-dto';
import { DatePipe } from '@angular/common';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProviderService } from '../../../services/service-provider/service-provider.service';
import {takeUntil} from "rxjs/operators";
import { ReplaySubject } from 'rxjs';
import { untilDestroyed } from 'src/app/shared/shared.module';
import { UtilService } from 'src/app/shared/shared.module';
import { SectorDTO } from 'src/app/shared/data/common/sector-dto';
import { ClientTitlesDto } from '../../../data/ClientDTO';
import { EntityDto, IdentityModeDTO } from '../../../data/entityDto';
import { OccupationDTO } from 'src/app/shared/data/common/occupation-dto';
import { PaymentDetailsDTO, WealthAmlDTO } from '../../../data/accountDTO';
import { AddressDTO } from '../../../data/AgentDTO';
import { BankService } from 'src/app/shared/services/setups/bank.service';
import { CountryService } from 'src/app/shared/services/setups/country.service';
import {MandatoryFieldsService} from 'src/app/shared/services/mandatory-fields.service'
import { SectorService } from 'src/app/shared/services/setups/sector.service';
import { ClientService } from '../../../services/client/client.service';
import { OccupationService } from 'src/app/shared/services/setups/occupation.service';
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

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
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
    private occupationService:OccupationService
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

  selectUserType(e) {
    this.agentType = e.target.value;
    console.log(`userType >>>`, this.agentType, e.target.value)
  }

  get f() { 
    return this.newServiceProviderForm.controls; 
  }


  serviceProviderRegForm() {
    this.newServiceProviderForm = this.fb.group({
      account_type: [''],
      account_type_id: [''],
      providerType: [''],
      identityType: [''],
      citizenship: [''],
      firstName: [''],
      certRegNo: [''],
      regName: [''],
      tradeName: [''],
      regDate: [''],
      countryOfIncorporation: [''],
      parentCompany: [''],
      otherName: [''],
      dateOfBirth: [''],
      txtIdNo: [''],
      pinNumber: [''],
      gender: [''],

      contact_details: this.fb.group(
        {
          clientTitle: [''],
          smsNumber: [''],
          phone_number: [''],
          email: [''],
          channel: [''],
          eDocuments: ['']
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
    // this.entityDetails = JSON.parse(sessionStorage.getItem('entityDetails'));
    this.serviceProviderService
      .currentEntity$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        currentEntity => this.entityDetails = currentEntity
      );
    console.log('Entities data to service provider', this.entityDetails);
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
                this.newServiceProviderForm.get(`contact_details.${key}`).setValidators(Validators.required);
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

    this.newServiceProviderForm.patchValue({
      firstName: this.entityDetails?.name.substring(0, this.entityDetails?.name.indexOf(' ')),
      otherName: this.entityDetails?.name.substring(this.entityDetails?.name.indexOf(' ') + 1),
      pinNumber: this.entityDetails?.pinNumber,
      dateOfBirth: this.datePipe.transform(this.entityDetails?.dateOfBirth, 'dd-MM-yyy'),
      txtIdNo: this.entityDetails?.identityNumber,
      identityType: this.entityDetails?.modeOfIdentity?.name,
    });
  }
  getBanks(countryId: number) {
    this.bankService.getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data
      })
  }
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
  onCityChange() {
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
  }
  selectUtilityBill(e) {
    this.utilityBill = e.target.value;
  }
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
  onBankSelection() {
    /*const bankId = event.target.value; // Get the selected bank ID from the event
    this.getBankBranches(bankId);*/
    this.newServiceProviderForm.patchValue({
      branch: null
    });
    // Call getBanksbranches with the selected bank ID
    this.getBankBranches(this.selectedBank);
    this.cdr.detectChanges();
  }
  getBankBranches(bankId: number) {
    if (bankId) {
      this.bankService.getBankBranchesByBankId(bankId).subscribe((branches) => {
        this.bankBranchData = branches;
      });
    } else {
      this.bankBranchData = [];
    }
  }

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
        phoneNumber: serviceproviderFormValues.contact_details.phone_number,
        receivedDocuments: "N", /*Todo: provide field to capture*/
        smsNumber: serviceproviderFormValues.contact_details.smsNumber,
        titleShortDescription: "DR",
        preferredChannel: null
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
        accountType: serviceproviderFormValues.providerType,
        firstName: serviceproviderFormValues.firstName,
        lastName: serviceproviderFormValues.otherName,
        dateOfBirth: this.entityDetails?.dateOfBirth,
        name:null,
        partyId: this.entityDetails.id,
        partyTypeShortDesc: "SPR",
        modeOfIdentityid: this.entityDetails?.modeOfIdentity.id,
        paymentDetails: payment,
        serviceProviderRequest: servProvider,
        wealthAmlDetails: wealth


      }
      this.serviceProviderService.saveServiceProvider(saveServiceProvider)
        .pipe(
          takeUntil(this.destroyed$),
        )
        .subscribe(serviceProviderData => {
          this.globalMessagingService.clearMessages();
          this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created Service Provider');
          // this.serviceProviders = serviceProviderData;
          this.router.navigate(['home/service-providers']);
        });

    });
  }

  fetchCountries(){
    console.log('Fetching countries list');
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
  getSectors() {
    this.sectorService.getSectors(2)
      .pipe(
        untilDestroyed(this)
      )
      .subscribe(
        (data) => {
          console.log("Testing data->", data)
          this.sectorData = data;
        },
      );
  }
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
  getClientTitles() {
    this.serviceProviderService.getClientTitles()
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(
        (data) => {
          this.clientTitlesData = data;
        },
      );
  }
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
