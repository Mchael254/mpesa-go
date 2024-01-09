import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TableModule } from 'primeng/table';

import { CountryComponent } from './country.component';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import {
  AdminstrativeUnitDTO,
  CountryDto,
  SubadminstrativeUnitDTO,
} from '../../../../shared/data/common/countryDto';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';
import { SharedModule, UtilService } from '../../../../shared/shared.module';
import { StatusDTO } from '../../../../shared/data/common/systemsDto';
import { StatusService } from '../../../../shared/services/system-definitions/status.service';
import { DropdownModule } from 'primeng/dropdown';

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
    telephoneMaximumLength: 0,
    telephoneMinimumLength: 0,
    unSanctionWefDate: '',
    unSanctionWetDate: '',
    unSanctioned: '',
    zipCode: 0,
    subAdministrativeUnit: '',
    zipCodeString: '',
  },
];

const mockAdministrativeData: AdminstrativeUnitDTO[] = [
  {
    id: '',
    name: '',
  },
];

const mockSubadministrativeData: SubadminstrativeUnitDTO[] = [
  {
    id: '',
    name: '',
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

const mockStatusData: StatusDTO[] = [
  {
    name: '',
    value: '',
  },
];

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
  getMainCityStatesByCountry = jest.fn();
  getSubCountyByStateId = jest.fn();
  getTownsByMainCityState = jest.fn();
  getAdminstrativeUnit = jest.fn().mockReturnValue(of(mockAdministrativeData));
  getSubadminstrativeUnit = jest
    .fn()
    .mockReturnValue(of(mockSubadministrativeData));
  getCountryHoliday = jest.fn();
  createCountry = jest.fn();
  updateCountry = jest.fn();
  deleteCountry = jest.fn();
  createState = jest.fn();
  updateState = jest.fn();
  createDistrict = jest.fn();
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of(mockCurrencyData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest
    .fn()
    .mockReturnValue(of(mockMandatoryData));
}

export class MockStatusService {
  getStatus = jest.fn().mockReturnValue(of(mockStatusData));
}

export class mockUtilService {}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;
  let countryServiceStub: CountryService;
  let bankServiceStub: BankService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let statusServiceStub: StatusService;
  let utilServiceStub: UtilService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        DropdownModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: BankService, useClass: MockBankService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: StatusService, useClass: MockStatusService },
        { provide: UtilService, useClass: mockUtilService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ],
    });
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    bankServiceStub = TestBed.inject(BankService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
    statusServiceStub = TestBed.inject(StatusService);
    utilServiceStub = TestBed.inject(UtilService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
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

  test('should update days when selectedMonth changes', () => {
    const selectedMonth = '01';
    component.updateDays(selectedMonth);
    expect(component.days.length).toBe(31);
  });

  test('should update form controls based on mandatory fields', fakeAsync(() => {
    const mandatoryFieldsResponse = [
      { frontedId: 'country', visibleStatus: 'Y', mandatoryStatus: 'Y' },
      { frontedId: 'name', visibleStatus: 'Y', mandatoryStatus: 'N' },
    ];

    jest.spyOn(mandatoryFieldsServiceStub, 'getMandatoryFieldsByGroupId');
    component.CountryCreateForm();

    // Simulate async behavior
    tick();
    expect(
      component.createCountryForm.controls['country'].validator
    ).toBeTruthy();
    expect(component.createCountryForm.controls['name'].validator).toBeNull();
  }));
});
