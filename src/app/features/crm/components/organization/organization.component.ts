import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { CountryDto, StateDto, TownDto } from '../../../../shared/data/common/countryDto';
import { BankBranchDTO, BankDTO, CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import { OrganizationDTO, PostOrganizationDTO } from '../../data/organization-dto';
import { OrganizationService } from '../../services/organization.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import stepData from '../../data/steps.json'
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { StaffDto } from '../../../../features/entities/data/StaffDto';

const log = new Logger( 'OrganizationComponent');

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  // public managersData: Pagination<StaffDto> = <Pagination<StaffDto>>{};

  public createOrganizationForm: FormGroup;
  steps = stepData;

  public organizationsData: OrganizationDTO[];
  public savedOrganization: PostOrganizationDTO;
  public countriesData: CountryDto[];
  public stateData: StateDto[] = [];
  public townData: TownDto[] = [];
  public selectedCountry: number;
  public selectedCityState: number;
  public currenciesData: CurrencyDTO[];
  public banksData: BankDTO[];
  public bankBranchData: BankBranchDTO[];
  public managersData: StaffDto[] = [];
  public groupId: string = 'organizationTab';
  public response: any;
  public selectedBank: number;
  public selectedFile: File;
  public url = "";
  public filteredManager: any;
  public selectedManager = '';
  // public selectedCountryCode: string = '+254';
  // public phoneNumber: string = '';
  public selectedOrg: OrganizationDTO;
  public isOrganizationSelected: boolean = false;
  public selectedOrganizationId: number | null = null;
  public selectedStateName: string | null = null;
  public visibleStatus: any = {
    organization: 'Y',
    shortDescription: 'Y',
    name: 'Y',
    country: 'Y',
    stateName: 'Y',
    physicalAddress: 'Y',
    postalAddress: 'Y',
    postalCode: 'Y',
    town: 'Y',
    baseCurrency: 'Y',
    countryCode: 'Y',
    primaryTelephone: 'Y',
    countryCode2: 'Y',
    secondaryTelephone: 'Y',
    emailAddress: 'Y',
    webLink: 'Y',
    pinNumber: 'Y',
    manager: 'Y',
    organizationType: 'Y',
    motto: 'Y',
    logo: 'Y',
    groupLogo: 'Y',
    accountName: 'Y',
    accountNumber: 'Y',
    swiftCode: 'Y',
    bankName: 'Y',
    bankBranch: 'Y',
    paybill: 'Y',
    customerCareName: 'Y',
    customerCareEmail: 'Y',
    customerCarePriNumber: 'Y',
    customerCareSecNumber: 'Y'
  }

  public countriesCode = [
    { "code": "+254", "name": "Kenya" },
    { "code": "+213", "name": "Algeria" },
    { "code": "+244", "name": "Angola" },
    { "code": "+229", "name": "Benin" },
    { "code": "+267", "name": "Botswana" },
    { "code": "+226", "name": "Burkina Faso" },
    { "code": "+257", "name": "Burundi" },
    { "code": "+237", "name": "Cameroon" },
    { "code": "+238", "name": "Cape Verde" },
    { "code": "+236", "name": "Central African Republic" },
    { "code": "+235", "name": "Chad" },
    { "code": "+269", "name": "Comoros" },
    { "code": "+242", "name": "Congo" },
    { "code": "+243", "name": "Congo, Dem. Rep. of (Zaire)" },
    { "code": "+253", "name": "Djibouti" },
    { "code": "+20", "name": "Egypt" },
    { "code": "+240", "name": "Equatorial Guinea" },
    { "code": "+291", "name": "Eritrea" },
    { "code": "+251", "name": "Ethiopia" },
    { "code": "+241", "name": "Gabon" },
    { "code": "+220", "name": "Gambia" },
    { "code": "+233", "name": "Ghana" },
    { "code": "+224", "name": "Guinea" },
    { "code": "+245", "name": "Guinea-Bissau" },
    { "code": "+225", "name": "Ivory Coast" },
    { "code": "+266", "name": "Lesotho" },
    { "code": "+231", "name": "Liberia" },
    { "code": "+218", "name": "Libya" },
    { "code": "+261", "name": "Madagascar" },
    { "code": "+265", "name": "Malawi" },
    { "code": "+223", "name": "Mali" },
    { "code": "+222", "name": "Mauritania" },
    { "code": "+230", "name": "Mauritius" },
    { "code": "+212", "name": "Morocco" },
    { "code": "+264", "name": "Namibia" },
    { "code": "+227", "name": "Niger" },
    { "code": "+234", "name": "Nigeria" },
    { "code": "+250", "name": "Rwanda" },
    { "code": "+221", "name": "Senegal" },
    { "code": "+248", "name": "Seychelles" },
    { "code": "+232", "name": "Sierra Leone" },
    { "code": "+27", "name": "South Africa" },
    { "code": "+249", "name": "Sudan" },
    { "code": "+268", "name": "Swaziland" },
    { "code": "+41", "name": "Switzerland" },
    { "code": "+255", "name": "Tanzania" },
    { "code": "+228", "name": "Togo" },
    { "code": "+256", "name": "Uganda" },
    { "code": "+260", "name": "Zambia" },
    { "code": "+255", "name": "Zanzibar" },
    { "code": "+263", "name": "Zimbabwe" }
  ]

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard'
    },
    {
      label: 'CRM Setups',
      url: '/home/dashboard',
    },
    {
      label: 'Organization',
      url: 'home/crm/organization'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private countryService: CountryService,
    private bankService: BankService,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.organizationCreateForm();
    this.fetchOrganization();
    this.fetchCountries();
    // this.fetchMainCityStates(this.selectedOrg.country.id);
    // this.fetchTowns(this.selectedOrg.state.id);
    this.fetchCurrencies();
    this.fetchStaffData();
  }

  ngOnDestroy(): void {}

  organizationCreateForm() {
    this.createOrganizationForm = this.fb.group({
      organization: [''],
      shortDescription: [''],
      name: [''],
      country: [''],
      stateName: [''],
      physicalAddress: [''],
      postalAddress: [''],
      postalCode: [''],
      town: [''],
      baseCurrency: [''],
      countryCode: [''],
      primaryTelephone: [''],
      countryCode2: [''],
      secondaryTelephone: [''],
      emailAddress: [''],
      webLink: [''],
      pinNumber: [''],
      manager: [''],
      organizationType: [''],
      motto: [''],
      logo: [''],
      groupLogo: [''],
      accountName: [''],
      accountNumber: [''],
      swiftCode: [''],
      bankName: [''],
      bankBranch: [''],
      paybill: [''],
      customerCareName: [''],
      customerCareEmail: [''],
      customerCarePriNumber: [''],
      customerCareSecNumber: [''],
    });
    this.mandatoryFieldsService.getMandatoryFieldsByGroupId(this.groupId).pipe(
      takeUntil(this.destroyed$)
    )
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) =>{
          for (const key of Object.keys(this.createOrganizationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y'){
                this.createOrganizationForm.controls[key].addValidators(Validators.required);
                this.createOrganizationForm.controls[key].updateValueAndValidity();
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

  get f() { return this.createOrganizationForm.controls; }

  onOrganizationChange(event: Event) {
    const selectedOrgId = (event.target as HTMLSelectElement).value;
    const selectedOrgIdAsNumber = parseInt(selectedOrgId, 10);
    this.selectedOrg = this.organizationsData.find(organization => organization.id === selectedOrgIdAsNumber);
    
    if (this.selectedOrg) {
      this.isOrganizationSelected = true;
      this.selectedOrganizationId = this.selectedOrg.id;
      this.createOrganizationForm.patchValue({
        shortDescription: this.selectedOrg.short_description,
        name: this.selectedOrg.name,
        country: this.selectedOrg.country.id,
        stateName: this.selectedOrg.state.id,
        physicalAddress: this.selectedOrg.physicalAddress,
        postalAddress: this.selectedOrg.postalAddress,
        postalCode: this.selectedOrg.postalCode,
        town: this.selectedOrg.town.id,
        baseCurrency: this.selectedOrg.currency_id,
        emailAddress: this.selectedOrg.emailAddress,
        webLink: this.selectedOrg.webAddress,
        pinNumber: this.selectedOrg.pin_number,
        manager: this.selectedOrg.manager,
        organizationType: this.selectedOrg.organization_type,
        motto: this.selectedOrg.motto,
        accountName: this.selectedOrg.bank_account_name,
        accountNumber: this.selectedOrg.bank_account_number,
        swiftCode: this.selectedOrg.swiftCode,
        bankName: this.selectedOrg.bankId,
        bankBranch: this.selectedOrg.bankBranchId,
        paybill: this.selectedOrg.paybill,
        customerCareName: this.selectedOrg.customer_care_name,
        customerCareEmail: this.selectedOrg.customer_care_email,
        customerCarePriNumber: this.selectedOrg.customer_care_primary_phone_number,
        customerCareSecNumber: this.selectedOrg.customer_care_secondary_phone_number,
      });

      this.fetchMainCityStates(this.selectedOrg.country.id);
      this.fetchTowns(this.selectedOrg.state.id);
      this.getBanks(this.selectedOrg.country.id);
      this.getBankBranches(this.selectedOrg.bankId);
      
      this.patchPhoneNumber(this.selectedOrg.primarymobileNumber, 'countryCode', 'primaryTelephone');
      this.patchPhoneNumber(this.selectedOrg.primaryTelephoneNo, 'countryCode2', 'secondaryTelephone');
    }
    else {
      this.isOrganizationSelected = false;
    }
  }

  private patchPhoneNumber(phoneNumber: string, countryCodeControlName: string, phoneControlName: string) {
    if (phoneNumber) {
      const countryCode = phoneNumber.substring(0, 4);
      const number = phoneNumber.substring(4);
      this.createOrganizationForm.get(countryCodeControlName).setValue(countryCode);
      this.createOrganizationForm.get(phoneControlName).setValue(number);
    } else {
      this.createOrganizationForm.get(countryCodeControlName).setValue('');
      this.createOrganizationForm.get(phoneControlName).setValue('');
    }
  }
  
  private extractPhoneNumber(countryCode: string, phoneNumber: string): string {
    if (!countryCode.startsWith('+')) {
      countryCode = '+' + countryCode;
    }
    phoneNumber = phoneNumber.replace(/\D/g, '');
    return countryCode + phoneNumber;
  }

  fetchOrganization() {
    this.organizationService.getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => { 
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  fetchCountries(){
    this.countryService.getCountries()
      .subscribe( (data) => {
        this.countriesData = data;
      });
  }

  fetchMainCityStates(countryId: number){
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService.getMainCityStatesByCountry(countryId)
      .subscribe( (data) => {
        this.stateData  = data;
      })
  }

  fetchTowns(stateId:number){
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId)
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  fetchCurrencies() {
    this.bankService.getCurrencies()
      .subscribe((data) => {
        this.currenciesData = data;
      });
  }

  onCountryChange(event: Event) {
    this.createOrganizationForm.patchValue({
      county: null,
      town: null
    });
    const selectCountry = (event.target as HTMLSelectElement).value;
    this.selectedCountry = parseInt(selectCountry, 10);

    this.getBanks(this.selectedCountry);
    this.countryService.getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.stateData = data;

        if (data.length > 0) {
          this.selectedStateName = data[0].name;
        } else {
          this.selectedStateName = null;
        }
      });
    this.cdr.detectChanges();
  }

  onCityChange(event: Event) {
    const selectedState = (event.target as HTMLSelectElement).value;
    this.selectedCityState = parseInt(selectedState, 10);
    this.countryService.getTownsByMainCityState(this.selectedCityState)
      .pipe(untilDestroyed(this))
      .subscribe( (data) => {
        this.townData = data;
      })
  }

  getBanks(countryId: number) {
    this.bankService.getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data;
      })
  }

  onBankSelection(event: Event) {
    this.createOrganizationForm.patchValue({
      bankBranch: null
    });
    const selectBank = (event.target as HTMLSelectElement).value;
    this.selectedBank = parseInt(selectBank, 10);

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

  onFileChange(event) {
    if (event.target.files) {
      var reader = new FileReader()
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (event: any) => {
        this.url = event.target.result;
        this.cdr.detectChanges();
        log.info(this.url);
      }
    }
  }

  fetchStaffData() {
    this.staffService
      .getStaff(0, 10, 'U', 'dateCreated', 'desc', null)
      .subscribe(
        (data) => {
          this.managersData = data.content;
          console.log('Fetched staff data:', this.managersData);
        },
        (error) => {
          console.error('Error fetching staff data:', error);
        }
      );
  }

  filterManagers(event: any) {
    const searchValue = (event.target.value).toLowerCase();
    this.filteredManager = this.managersData.filter((el) => el.name.includes(searchValue));
    this.cdr.detectChanges();
  }

  deleteOrganization(organizationId: number | null): void { 
    if (organizationId !== null) { 
      this.organizationService.deleteOrganization(organizationId)
        .subscribe(() => {
          this.globalMessagingService.displaySuccessMessage('success', 'Successfully Deleted an Organization');
        });
    }
    else {
      log.info('No organization is selected.');
    }
    this.fetchOrganization();
    this.createOrganizationForm.reset();
  }

  onSave() {
    const organizationFormValues = this.createOrganizationForm.getRawValue();
    const organizationId = this.selectedOrg.id;

    const primaryCountryCode = organizationFormValues.countryCode;
    const primaryPhoneNumber = organizationFormValues.primaryTelephone;

    const secondaryCountryCode = organizationFormValues.countryCode2;
    const secondaryPhoneNumber = organizationFormValues.secondaryTelephone;

    const primaryCombinedPhoneNumber = this.extractPhoneNumber(primaryCountryCode, primaryPhoneNumber);
    const secondaryCombinedPhoneNumber = this.extractPhoneNumber(secondaryCountryCode, secondaryPhoneNumber);

    const saveOrganization: PostOrganizationDTO = {
      countryId: organizationFormValues.country,
      currency_id: organizationFormValues.baseCurrency,
      emailAddress: organizationFormValues.emailAddress,
      faxNumber: '',
      groupId: null,
      id: organizationId || null,
      license_number: '',
      manager: organizationFormValues.manager,
      motto: organizationFormValues.motto,
      name: organizationFormValues.name,
      organization_type: organizationFormValues.organizationType,
      physicalAddress: organizationFormValues.physicalAddress,
      pin_number: organizationFormValues.pinNumber,
      postalAddress: organizationFormValues.postalAddress,
      postalCode: organizationFormValues.postalCode,
      primaryTelephoneNo: primaryCombinedPhoneNumber,
      primarymobileNumber: secondaryCombinedPhoneNumber,
      registrationNo: '',
      secondaryMobileNumber: '',
      secondaryTelephoneNo: '',
      short_description: organizationFormValues.shortDescription,
      stateId: organizationFormValues.stateName,
      townId: organizationFormValues.town,
      vatNumber: organizationFormValues.vatNumber,
      webAddress: organizationFormValues.webLink,
      bank_account_name: organizationFormValues.accountName,
      bank_account_number: organizationFormValues.accountNumber,
      swiftCode: organizationFormValues.swiftCode,
      bankId: organizationFormValues.bankName,
      bankBranchId: organizationFormValues.bankBranch,
      paybill: organizationFormValues.paybill,
      customer_care_email: organizationFormValues.customerCareName,
      customer_care_name: organizationFormValues.customerCareEmail,
      customer_care_primary_phone_number: organizationFormValues.customerCarePriNumber,
      customer_care_secondary_phone_number: organizationFormValues.customerCareSecNumber
    }

    if (organizationId) {
      // Update an existing organization
      this.organizationService.updateOrganization(organizationId, saveOrganization)
        .subscribe(data => {
          // data.id = saveOrganization.id;
          // this.savedOrganization = data;
          // if (this.selectedFile) {
          //   this.uploadImage(this.savedOrganization.id);
          // } else {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Updated the Organization');
          // }
        });
    } else {
      // Create a new organization
      this.organizationService.createOrganization(saveOrganization)
        .subscribe(data => {
          // data.id = saveOrganization.id;
          // this.savedOrganization = data;
          // if (this.selectedFile) {
          //   this.uploadLogo(this.savedOrganization.id);
          // } else {
            this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created an Organization');
          // }
        });
    }

    this.fetchOrganization();
    this.createOrganizationForm.reset();
  }

  uploadLogo(organizationId: number){
    this.organizationService.uploadLogo(organizationId, this.selectedFile)
      .subscribe( res => {
        log.info(res);
        // this.savedOrganization.logo = res.file;
        // this.savedOrganization.groupLogo = res.file;
        this.globalMessagingService.displaySuccessMessage('Success', 'Successfully Created an Organization');
        this.fetchOrganization();
        this.createOrganizationForm.reset();
      });
  }

}
