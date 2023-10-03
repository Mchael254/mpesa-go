import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CountryComponent } from './country.component';
import { CountryService } from '../../../../shared/services/setups/country/country.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { MandatoryFieldsService } from '../../../../shared/services/mandatory-fields/mandatory-fields.service';
import { CountryDto } from '../../../../shared/data/common/countryDto';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { MandatoryFieldsDTO } from '../../../../shared/data/common/mandatory-fields-dto';

const mockCountryData: CountryDto[] = [{
  id: 0,
  short_description: '',
  name: ''
}]

const mockCurrencyData: CurrencyDTO[] =[{
  decimalWord: '',
  id: 0,
  name: '',
  numberWord: '',
  roundingOff: 0,
  symbol: ''
}]

const mockMandatoryData: MandatoryFieldsDTO[] = [{
  id: 0,
  fieldName: '',
  fieldLabel: '',
  mandatoryStatus: 'Y',
  visibleStatus: 'Y',
  disabledStatus: 'N',
  frontedId: 'country',
  screenName: '',
  groupId: '',
  module: ''
}]

export class MockCountryService {
  getCountries = jest.fn().mockReturnValue(of(mockCountryData));
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of(mockCurrencyData));
}

export class MockMandatoryService {
  getMandatoryFieldsByGroupId = jest.fn().mockReturnValue(of(mockMandatoryData));
}

export class MockGlobalMessageService {}

describe('CountryComponent', () => {
  let component: CountryComponent;
  let fixture: ComponentFixture<CountryComponent>;
  let countryServiceStub: CountryService;
  let bankServiceStub: BankService;
  let mandatoryFieldsServiceStub: MandatoryFieldsService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: CountryService, useClass: MockCountryService },
        { provide: BankService, useClass: MockBankService },
        { provide: MandatoryFieldsService, useClass: MockMandatoryService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService }
      ]
    });
    fixture = TestBed.createComponent(CountryComponent);
    component = fixture.componentInstance;
    countryServiceStub = TestBed.inject(CountryService);
    bankServiceStub = TestBed.inject(BankService);
    mandatoryFieldsServiceStub = TestBed.inject(MandatoryFieldsService);
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
    component.selectedMonth = '01';
    component.updateDays();
    expect(component.days.length).toBe(31);
  });

  it('should update form controls based on mandatory fields', fakeAsync(() => {
    const mandatoryFieldsResponse = [
      { frontedId: 'country', visibleStatus: 'Y', mandatoryStatus: 'Y' },
      { frontedId: 'name', visibleStatus: 'Y', mandatoryStatus: 'N' },
    ];

    jest.spyOn(mandatoryFieldsServiceStub, 'getMandatoryFieldsByGroupId');
    component.CountryCreateForm();

    // Simulate async behavior
    tick();
    expect(component.createCountryForm.controls['country'].validator).toBeTruthy();
    expect(component.createCountryForm.controls['name'].validator).toBeNull();
  }));
});
