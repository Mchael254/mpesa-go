import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CountryService } from '../../../../shared/services/setups/country/country.service';
import {
  CountryDto,
  StateDto,
  TownDto,
} from '../../../../shared/data/common/countryDto';
import {
  BankBranchDTO,
  BankDTO,
  CurrencyDTO,
} from '../../../../shared/data/common/bank-dto';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { untilDestroyed } from '../../../../shared/services/until-destroyed';
import { BreadCrumbItem } from '../../../../shared/data/common/BreadCrumbItem';
import {
  OrganizationDTO,
  PostOrganizationDTO,
} from '../../data/organization-dto';
import { OrganizationService } from '../../services/organization.service';
import { Logger } from '../../../../shared/services/logger/logger.service';
import stepData from '../../data/steps.json';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StaffService } from '../../../entities/services/staff/staff.service';
import { StaffDto } from '../../../entities/data/StaffDto';
import { Router } from '@angular/router';
import { ReusableInputComponent } from '../../../../shared/components/reusable-input/reusable-input.component';

const log = new Logger('OrganizationComponent');

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
})
export class OrganizationComponent implements OnInit {
  @ViewChild('organizationConfirmationModal')
  organizationConfirmationModal!: ReusableInputComponent;

  @Output() organizationChange = new EventEmitter<any>();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public createOrganizationForm: FormGroup;
  public steps = stepData;

  public organizationsData: OrganizationDTO[];
  public savedOrganization: PostOrganizationDTO;
  public countriesData: CountryDto[];
  public stateData: StateDto[] = [];
  public townData: TownDto[] = [];
  public currenciesData: CurrencyDTO[] = [];
  public banksData: BankDTO[] = [];
  public bankBranchData: BankBranchDTO[] = [];
  public managersData: StaffDto[] = [];
  public selectedOrg: OrganizationDTO;
  public countrySelected: CountryDto;
  public stateSelected: StateDto;
  public bankSelected: BankDTO;
  public selectOrganization: OrganizationDTO;
  public selectedOrganization: number;
  public selectedCountry: number;
  public selectedState: number;
  public selectedBank: number;
  public groupId: string = 'organizationTab';
  public response: any;
  public selectedFile: File;
  public url = '';
  public urlGrp = '';
  public filteredManager: any;
  public selectedManager = '';
  public selectedTown = '';
  public selectedCurrency = '';
  public selectedBankBranch = '';
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
    customerCareSecNumber: 'Y',
  };

  organizationBreadCrumbItems: BreadCrumbItem[] = [
    {
      label: 'Administration',
      url: '/home/dashboard',
    },
    {
      label: 'CRM Setups',
      url: '/home/crm',
    },
    {
      label: 'Organization',
      url: 'home/crm/organization',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private organizationService: OrganizationService,
    private mandatoryFieldsService: MandatoryFieldsService,
    private countryService: CountryService,
    private bankService: BankService,
    private staffService: StaffService,
    private globalMessagingService: GlobalMessagingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.organizationCreateForm();
    this.fetchOrganization();
    this.fetchCountries();
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
    this.mandatoryFieldsService
      .getMandatoryFieldsByGroupId(this.groupId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.response = response;
        response.forEach((field) => {
          for (const key of Object.keys(this.createOrganizationForm.controls)) {
            this.visibleStatus[field.frontedId] = field.visibleStatus;
            if (field.visibleStatus === 'Y') {
              if (key === field.frontedId && field.mandatoryStatus === 'Y') {
                this.createOrganizationForm.controls[key].addValidators(
                  Validators.required
                );
                this.createOrganizationForm.controls[
                  key
                ].updateValueAndValidity();
                const label = document.querySelector(
                  `label[for=${field.frontedId}]`
                );
                if (label) {
                  const asterisk = document.createElement('span');
                  asterisk.innerHTML = ' *';
                  asterisk.style.color = 'red';
                  label.appendChild(asterisk);
                }
              }
            }
          }
        });
        this.cdr.detectChanges();
      });
  }

  get f() {
    return this.createOrganizationForm.controls;
  }

  onOrganizationChange() {
    const selectedOrganizationId = this.selectedOrganization;
    this.selectedOrg = this.organizationsData.find(
      (organization) => organization.id === selectedOrganizationId
    );

    if (this.selectedOrg) {
      this.isOrganizationSelected = true;
      this.selectedOrganizationId = this.selectedOrg.id;
      this.createOrganizationForm.patchValue({
        shortDescription: this.selectedOrg?.short_description,
        name: this.selectedOrg?.name,
        country: this.selectedOrg?.country?.id,
        stateName: this.selectedOrg?.state?.id,
        physicalAddress: this.selectedOrg?.physicalAddress,
        postalAddress: this.selectedOrg?.postalAddress,
        postalCode: this.selectedOrg?.postalCode,
        town: this.selectedOrg?.town?.id,
        baseCurrency: this.selectedOrg?.currency_id,
        emailAddress: this.selectedOrg?.emailAddress,
        webLink: this.selectedOrg?.webAddress,
        pinNumber: this.selectedOrg?.pin_number,
        manager: this.selectedOrg?.manager,
        organizationType: this.selectedOrg?.organization_type,
        motto: this.selectedOrg?.motto,
        // logo: this.selectedOrg.organizationLogo,
        // groupLogo: this.selectedOrg.organizationGroupLogo,
        accountName: this.selectedOrg?.bank_account_name,
        accountNumber: this.selectedOrg?.bank_account_number,
        swiftCode: this.selectedOrg?.swiftCode,
        bankName: this.selectedOrg?.bankId,
        bankBranch: this.selectedOrg?.bankBranchId,
        paybill: this.selectedOrg?.paybill,
        customerCareName: this.selectedOrg?.customer_care_name,
        customerCareEmail: this.selectedOrg?.customer_care_email,
        customerCarePriNumber:
          this.selectedOrg?.customer_care_primary_phone_number,
        customerCareSecNumber:
          this.selectedOrg?.customer_care_secondary_phone_number,
      });
      this.url = this.selectedOrg?.organizationLogo
        ? 'data:image/jpeg;base64,' + this.selectedOrg?.organizationLogo
        : '';
      this.urlGrp = this.selectedOrg?.organizationGroupLogo
        ? 'data:image/jpeg;base64,' + this.selectedOrg?.organizationGroupLogo
        : '';

      this.fetchMainCityStates(this.selectedOrg?.country?.id);
      this.fetchTowns(this.selectedOrg?.state?.id);
      this.getBanks(this.selectedOrg?.country?.id);
      this.getBankBranches(this.selectedOrg?.bankId);

      this.patchPhoneNumber(
        this.selectedOrg?.primarymobileNumber,
        'countryCode',
        'primaryTelephone'
      );
      this.patchPhoneNumber(
        this.selectedOrg?.primaryTelephoneNo,
        'countryCode2',
        'secondaryTelephone'
      );

      // Set the selected organization ID in the service
      this.organizationService.setSelectedOrganizationId(
        this.selectedOrganizationId
      );
      log.info('Set organization', this.selectedOrganizationId);
    } else {
      this.isOrganizationSelected = false;
    }
  }
  private patchPhoneNumber(
    phoneNumber: string,
    countryCodeControlName: string,
    phoneControlName: string
  ) {
    if (phoneNumber) {
      // Check if the phone number starts with '+'
      const isInternational = phoneNumber.startsWith('+');

      let countryCode, number;

      if (isInternational) {
        // International format: +254 20 278 2000
        countryCode = phoneNumber.substring(0, 4);
        number = phoneNumber.substring(4).replace(/\D/g, ''); // Remove non-numeric characters
      } else {
        // Local format: 020 278 2000
        countryCode = ''; // Set an empty string for local format
        number = phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
      }

      this.createOrganizationForm
        .get(countryCodeControlName)
        .setValue(countryCode);
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

    // Add logic to check if the phone number is in international or local format
    const isInternational = phoneNumber.startsWith('+');

    if (isInternational) {
      // If it's already in international format, just return it
      return countryCode + phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    } else {
      // If it's in local format, assume a default country code or handle it as needed
      const defaultCountryCode = '+254'; // You may adjust this based on your requirements
      return defaultCountryCode + phoneNumber.replace(/\D/g, ''); // Remove non-numeric characters
    }
  }

  fetchOrganization() {
    this.organizationService
      .getOrganization()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.organizationsData = data;
        log.info('Organization Data', this.organizationsData);
      });
  }

  fetchCountries() {
    this.countryService.getCountries().subscribe((data) => {
      this.countriesData = data;
    });
  }

  fetchMainCityStates(countryId: number) {
    log.info(`Fetching city states list for country, ${countryId}`);
    this.countryService
      .getMainCityStatesByCountry(countryId)
      .subscribe((data) => {
        this.stateData = data;
      });
  }

  fetchTowns(stateId: number) {
    log.info(`Fetching towns list for city-state, ${stateId}`);
    this.countryService.getTownsByMainCityState(stateId).subscribe((data) => {
      this.townData = data;
    });
  }

  fetchCurrencies() {
    this.bankService.getCurrencies().subscribe((data) => {
      this.currenciesData = data;
    });
  }

  onCountryChange() {
    this.createOrganizationForm.patchValue({
      county: null,
      town: null,
    });
    const selectedCountryId = this.selectedCountry;
    this.countrySelected = this.countriesData.find(
      (country) => country.id === selectedCountryId
    );

    this.getBanks(this.selectedCountry);
    this.countryService
      .getMainCityStatesByCountry(this.selectedCountry)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.stateData = data;

        if (data.length > 0) {
          this.selectedStateName = data[0].name;
        } else {
          this.selectedStateName = null;
        }
      });
    this.cdr.detectChanges();
  }

  onCityChange() {
    const selectedStateId = this.selectedState;
    this.stateSelected = this.stateData.find(
      (state) => state.id === selectedStateId
    );
    this.countryService
      .getTownsByMainCityState(this.selectedState)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.townData = data;
      });
  }

  getBanks(countryId: number) {
    this.bankService
      .getBanks(countryId)
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.banksData = data;
      });
  }

  onBankSelection() {
    this.createOrganizationForm.patchValue({
      bankBranch: null,
    });

    const selectedBankId = this.selectedBank;
    this.bankSelected = this.banksData.find(
      (bank) => bank.id === selectedBankId
    );

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

  onLogoChange(event) {
    if (event.target.files) {
      const reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        // Set the 'logo' control value with the base64 string
        this.createOrganizationForm.get('logo').setValue(this.url);
        this.cdr.detectChanges();
      };
    }
  }

  onGroupLogoChange(event) {
    if (event.target.files) {
      var reader = new FileReader();
      this.selectedFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.urlGrp = event.target.result;
        this.createOrganizationForm.get('groupLogo').setValue(this.urlGrp);
        this.cdr.detectChanges();
      };
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
    const searchValue = event.target.value.toLowerCase();
    this.filteredManager = this.managersData.filter((el) =>
      el.name.includes(searchValue)
    );
    this.cdr.detectChanges();
  }

  createOrganization() {
    this.createOrganizationForm.reset();
    this.selectedOrg = null;
    this.url = '';
    this.urlGrp = '';
    this.isOrganizationSelected = false;
  }

  onSave() {
    if (!this.selectedOrg) {
      const organizationFormValues = this.createOrganizationForm.getRawValue();

      const primaryCountryCode = organizationFormValues.countryCode;
      const primaryPhoneNumber = organizationFormValues.primaryTelephone;

      const secondaryCountryCode = organizationFormValues.countryCode2;
      const secondaryPhoneNumber = organizationFormValues.secondaryTelephone;

      const primaryCombinedPhoneNumber = this.extractPhoneNumber(
        primaryCountryCode,
        primaryPhoneNumber
      );
      const secondaryCombinedPhoneNumber = this.extractPhoneNumber(
        secondaryCountryCode,
        secondaryPhoneNumber
      );

      const saveOrganization: PostOrganizationDTO = {
        countryId: organizationFormValues.country,
        currency_id: organizationFormValues.baseCurrency,
        emailAddress: organizationFormValues.emailAddress,
        faxNumber: null,
        groupId: null,
        id: null,
        license_number: null,
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
        registrationNo: null,
        secondaryMobileNumber: null,
        secondaryTelephoneNo: null,
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
        customer_care_primary_phone_number:
          organizationFormValues.customerCarePriNumber,
        customer_care_secondary_phone_number:
          organizationFormValues.customerCareSecNumber,
        organizationGroupLogo:
          this.createOrganizationForm.get('groupLogo').value,
        organizationLogo: this.createOrganizationForm.get('logo').value,
      };
      // Create a new organization
      this.organizationService
        .createOrganization(saveOrganization)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Created an Organization'
          );
          this.fetchOrganization();
          this.selectedOrganization = data.id;
          this.isOrganizationSelected = true;
        });
    } else {
      const organizationFormValues = this.createOrganizationForm.getRawValue();
      const organizationId = this.selectedOrg.id;

      const primaryCountryCode = organizationFormValues.countryCode;
      const primaryPhoneNumber = organizationFormValues.primaryTelephone;

      const secondaryCountryCode = organizationFormValues.countryCode2;
      const secondaryPhoneNumber = organizationFormValues.secondaryTelephone;

      const primaryCombinedPhoneNumber = this.extractPhoneNumber(
        primaryCountryCode,
        primaryPhoneNumber
      );
      const secondaryCombinedPhoneNumber = this.extractPhoneNumber(
        secondaryCountryCode,
        secondaryPhoneNumber
      );

      const saveOrganization: PostOrganizationDTO = {
        countryId: organizationFormValues.country,
        currency_id: organizationFormValues.baseCurrency,
        emailAddress: organizationFormValues.emailAddress,
        faxNumber: this.selectedOrg.faxNumber,
        groupId: this.selectedOrg.groupId,
        id: organizationId,
        license_number: this.selectedOrg.license_number,
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
        registrationNo: this.selectedOrg.registrationNo,
        secondaryMobileNumber: this.selectedOrg.secondaryMobileNumber,
        secondaryTelephoneNo: this.selectedOrg.secondaryTelephoneNo,
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
        customer_care_primary_phone_number:
          organizationFormValues.customerCarePriNumber,
        customer_care_secondary_phone_number:
          organizationFormValues.customerCareSecNumber,
        organizationGroupLogo:
          this.createOrganizationForm.get('groupLogo').value,
        organizationLogo: this.createOrganizationForm.get('logo').value,
      };
      // Update an existing organization
      this.organizationService
        .updateOrganization(organizationId, saveOrganization)
        .subscribe((data) => {
          this.globalMessagingService.displaySuccessMessage(
            'Success',
            'Successfully Updated the Organization'
          );
          this.fetchOrganization();
        });
    }
  }

  deleteOrganization(): void {
    this.organizationConfirmationModal.show();
  }

  confirmOrganizationDelete() {
    if (this.selectedOrg) {
      const organizationId = this.selectedOrg.id;
      this.organizationService
        .deleteOrganization(organizationId)
        .subscribe(() => {
          this.globalMessagingService.displaySuccessMessage(
            'success',
            'Successfully Deleted an Organization'
          );
          this.fetchOrganization();
          this.createOrganizationForm.reset();
          this.selectedOrg = null;
          this.isOrganizationSelected = false;
        });
    } else {
      this.globalMessagingService.displayErrorMessage(
        'Error',
        'No organization is selected.'
      );
    }
  }

  onReset() {
    this.createOrganizationForm.reset();
  }

  onNext() {
    this.router.navigate(['/home/crm/disivion']);
  }
}
