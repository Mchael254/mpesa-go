import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OrganizationComponent } from './organization.component';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { CountryDto } from '../../../../shared/data/common/countryDto';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { OrganizationService } from '../../services/organization.service';
import { OrganizationDTO } from '../../data/organization-dto';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { DropdownModule } from 'primeng/dropdown';

const mockOrganizationData: OrganizationDTO[] = [
  {
    address: {
      box_number: '',
      country_id: 0,
      estate: '',
      fax: '',
      house_number: '',
      id: 0,
      is_utility_address: '',
      phone_number: '',
      physical_address: '',
      postal_code: '',
      residential_address: '',
      road: '',
      state_id: 0,
      town_id: 0,
      utility_address_proof: '',
      zip: '',
    },
    country: {
      adminRegMandatory: '',
      adminRegType: '',
      currSerial: 0,
      currency: {
        createdBy: '',
        createdDate: '',
        decimalWord: '',
        id: 0,
        modifiedBy: '',
        modifiedDate: '',
        name: '',
        numberWord: '',
        roundingOff: 0,
        symbol: '',
      },
      drugTraffickingStatus: '',
      drugWefDate: '',
      drugWetDate: '',
      highRiskWefDate: '',
      highRiskWetDate: '',
      id: 0,
      isShengen: '',
      mobilePrefix: 0,
      name: '',
      nationality: '',
      risklevel: '',
      short_description: '',
      telephoneMaximumLength: 0,
      telephoneMinimumLength: 0,
      unSanctionWefDate: '',
      unSanctionWetDate: '',
      unSanctioned: '',
      zipCode: 0,
      subAdministrativeUnit: '',
      zipCodeString: '',
    },
    currency_id: 0,
    emailAddress: '',
    faxNumber: '',
    groupId: 0,
    id: 0,
    license_number: '',
    manager: 0,
    motto: '',
    name: '',
    organizationGroupLogo: '',
    organizationLogo: '',
    organization_type: '',
    paybill: 0,
    physicalAddress: '',
    pin_number: '',
    postalCode: '',
    postalAddress: 0,
    primaryTelephoneNo: '',
    primarymobileNumber: '',
    registrationNo: '',
    secondaryMobileNumber: '',
    secondaryTelephoneNo: '',
    short_description: '',
    state: {
      country: {
        adminRegMandatory: '',
        adminRegType: '',
        currSerial: 0,
        currency: {
          createdBy: '',
          createdDate: '',
          decimalWord: '',
          id: 0,
          modifiedBy: '',
          modifiedDate: '',
          name: '',
          numberWord: '',
          roundingOff: 0,
          symbol: '',
        },
        drugTraffickingStatus: '',
        drugWefDate: '',
        drugWetDate: '',
        highRiskWefDate: '',
        highRiskWetDate: '',
        id: 0,
        isShengen: '',
        mobilePrefix: 0,
        name: '',
        nationality: '',
        risklevel: '',
        short_description: '',
        telephoneMaximumLength: 0,
        telephoneMinimumLength: 0,
        unSanctionWefDate: '',
        unSanctionWetDate: '',
        unSanctioned: '',
        zipCode: 0,
        subAdministrativeUnit: '',
        zipCodeString: '',
      },
      id: 0,
      name: '',
      shortDescription: '',
    },
    town: {
      country: '',
      id: 0,
      name: '',
      shortDescription: '',
      state: '',
    },
    vatNumber: '',
    webAddress: '',
    bankBranchId: 0,
    bankId: 0,
    swiftCode: '',
    bank_account_name: '',
    bank_account_number: '',
    customer_care_email: '',
    customer_care_name: '',
    customer_care_primary_phone_number: 0,
    customer_care_secondary_phone_number: 0,
  },
];

const mockCountryData: CountryDto[] = [
  {
    adminRegMandatory: '',
    adminRegType: '',
    currSerial: 0,
    currency: {
      createdBy: '',
      createdDate: '',
      decimalWord: '',
      id: 0,
      modifiedBy: '',
      modifiedDate: '',
      name: '',
      numberWord: '',
      roundingOff: 0,
      symbol: '',
    },
    drugTraffickingStatus: '',
    drugWefDate: '',
    drugWetDate: '',
    highRiskWefDate: '',
    highRiskWetDate: '',
    id: 0,
    isShengen: '',
    mobilePrefix: 0,
    name: '',
    nationality: '',
    risklevel: '',
    short_description: '',
    subAdministrativeUnit: '',
    telephoneMaximumLength: 0,
    telephoneMinimumLength: 0,
    unSanctionWefDate: '',
    unSanctionWetDate: '',
    unSanctioned: '',
    zipCode: 0,
    zipCodeString: '',
  },
];

const mockCurrencyData: CurrencyDTO[] = [
  {
    decimalWord: '',
    id: 0,
    name: '',
    numberWord: '',
    roundingOff: 0,
    symbol: '',
  },
];

const mockMandatoryData: MandatoryFieldsDTO[] = [
  {
    id: 0,
    fieldName: '',
    fieldLabel: '',
    mandatoryStatus: 'Y',
    visibleStatus: 'Y',
    disabledStatus: 'N',
    frontedId: 'country',
    screenName: '',
    groupId: '',
    module: '',
  },
];

const mockStaffData: StaffDto[] = [
  {
    name: '',
    username: '',
    userType: '',
    status: '',
  },
];

export class MockOrganizationService {
  getOrganization = jest.fn().mockReturnValue(of(mockOrganizationData));
}

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of(mockCurrencyData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockStaffService {
  getStaff = jest.fn().mockReturnValue(of(mockStaffData));
}

export class MockGlobalMessageService {}

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;
  let organizationServiceStub: OrganizationService;
  let countryServiceStub: CountryService;
  let bankServiceStub: BankService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;
  let staffServiceStub: StaffService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrganizationComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
      ],
      providers: [
        { provide: OrganizationService, useClass: MockOrganizationService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: BankService, useClass: MockBankService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: StaffService, useClass: MockStaffService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ],
    });
    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    organizationServiceStub = TestBed.inject(OrganizationService);
    countryServiceStub = TestBed.inject(CountryService);
    bankServiceStub = TestBed.inject(BankService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    staffServiceStub = TestBed.inject(StaffService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch countries data', () => {
    jest.spyOn(countryServiceStub, 'getCountries');
    component.fetchCountries();
    expect(countryServiceStub.getCountries).toHaveBeenCalled();
    expect(component.countriesData).toEqual(mockCountryData);
  });

  test('should fetch currencies data', () => {
    jest.spyOn(bankServiceStub, 'getCurrencies');
    component.fetchCurrencies();
    expect(bankServiceStub.getCurrencies).toHaveBeenCalled();
    expect(component.currenciesData).toEqual(mockCurrencyData);
  });
});
