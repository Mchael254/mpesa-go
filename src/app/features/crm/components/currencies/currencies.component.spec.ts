import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrenciesComponent } from './currencies.component';
import { CurrencyDTO } from '../../../../shared/data/common/bank-dto';
import { of } from 'rxjs';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CurrencyService } from '../../../../shared/services/setups/currency/currency.service';
import {
  CurrencyDenominationDTO,
  CurrencyRateDTO,
} from '../../../../shared/data/common/currency-dto';

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

const mockCurrencyRateData: CurrencyRateDTO[] = [
  {
    baseCurrencyId: 0,
    date: '',
    id: 0,
    organizationId: 0,
    rate: 0,
    targetCurrencyId: 0,
    withEffectFromDate: '',
    withEffectToDate: '',
  },
];

const mockCurrencyDenominationData: CurrencyDenominationDTO[] = [
  {
    currencyCode: 0,
    currencyName: '',
    id: 0,
    name: '',
    value: '',
    withEffectiveFrom: '',
  },
];

export class MockCurrencyService {
  getCurrenciesRate = jest.fn().mockReturnValue(of(mockCurrencyRateData));
  getCurrenciesDenomination = jest
    .fn()
    .mockReturnValue(of(mockCurrencyDenominationData));
  createCurrency = jest.fn().mockReturnValue(of());
  updateCurrency = jest.fn().mockReturnValue(of());
  deleteCurrency = jest.fn().mockReturnValue(of());
  createCurrencyRate = jest.fn().mockReturnValue(of());
  updateCurrencyRate = jest.fn().mockReturnValue(of());
  deleteCurrencyRate = jest.fn().mockReturnValue(of());
  createCurrencyDenomination = jest.fn().mockReturnValue(of());
  updateCurrencyDenomination = jest.fn().mockReturnValue(of());
  deleteCurrencyDenomination = jest.fn().mockReturnValue(of());
}

export class MockBankService {
  getCurrencies = jest.fn().mockReturnValue(of(mockCurrencyData));
}

export class MockGlobalMessageService {
  displayErrorMessage = jest.fn((summary, detail) => {
    return;
  });
  displaySuccessMessage = jest.fn((summary, detail) => {
    return;
  });
}

describe('CurrenciesComponent', () => {
  let component: CurrenciesComponent;
  let fixture: ComponentFixture<CurrenciesComponent>;
  let currencyServiceStub: CurrencyService;
  let bankServiceStub: BankService;
  let messageServiceStub: GlobalMessagingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrenciesComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        SharedModule,
      ],
      providers: [
        { provide: CurrencyService, useClass: MockCurrencyService },
        { provide: BankService, useClass: MockBankService },
        { provide: GlobalMessagingService, useClass: MockGlobalMessageService },
      ],
    });
    fixture = TestBed.createComponent(CurrenciesComponent);
    component = fixture.componentInstance;
    currencyServiceStub = TestBed.inject(CurrencyService);
    bankServiceStub = TestBed.inject(BankService);
    messageServiceStub = TestBed.inject(GlobalMessagingService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch currencies data', () => {
    jest.spyOn(bankServiceStub, 'getCurrencies');
    component.fetchCurrencies();
    expect(bankServiceStub.getCurrencies).toHaveBeenCalled();
    expect(component.currenciesData).toEqual(mockCurrencyData);
  });

  test('should fetch currencies rate data', () => {
    jest.spyOn(currencyServiceStub, 'getCurrenciesRate');
    jest.spyOn(bankServiceStub, 'getCurrencies');
    const baseCurrencyId = mockCurrencyData[0].id;
    component.fetchCurrencyRate(baseCurrencyId);
    expect(currencyServiceStub.getCurrenciesRate).toHaveBeenCalled();
    expect(component.currencyRatesData).toEqual(mockCurrencyRateData);
  });

  test('should fetch currencies rate data', () => {
    jest.spyOn(currencyServiceStub, 'getCurrenciesDenomination');
    jest.spyOn(bankServiceStub, 'getCurrencies');
    const currencyId = mockCurrencyData[0].id;
    component.fetchCurrencyDenomination(currencyId);
    expect(currencyServiceStub.getCurrenciesDenomination).toHaveBeenCalled();
    expect(component.currencyDenominationData).toEqual(
      mockCurrencyDenominationData
    );
  });

  test('should open currency Modal', () => {
    component.openCurrencyModal();

    const modal = document.getElementById('currencyModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close currency Modal', () => {
    const modal = document.getElementById('currencyModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeCurrencyModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open currency Denomination Modal', () => {
    component.openDenominationModal();

    const modal = document.getElementById('denominationModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close currency Denomination Modal', () => {
    const modal = document.getElementById('denominationModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeDenominationModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should open currency Rate Modal', () => {
    component.openCurrencyExchangeModal();

    const modal = document.getElementById('currencyRateModal');
    expect(modal.classList.contains('show')).toBe(true);
    expect(modal.style.display).toBe('block');
  });

  test('should close currency Rate Modal', () => {
    const modal = document.getElementById('currencyRateModal');
    modal.classList.add('show');
    modal.style.display = 'block';

    component.closeCurrencyExchangeModal();

    expect(modal.classList.contains('show')).toBe(false);
    expect(modal.style.display).toBe('none');
  });

  test('should filter currency on filterCurrencies', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(component.currencyTable, 'filterGlobal');

    component.filterCurrencies(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter currency rate on filterExchangeCurrency', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.currencyRateTable,
      'filterGlobal'
    );

    component.filterExchangeCurrency(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should filter currency denomination on filterCurrencyDenomination', () => {
    const mockEvent: Event = {
      target: { value: 'TestFilterValue' },
    } as unknown as Event;
    const filterGlobalSpy = jest.spyOn(
      component.currencyDenominationTable,
      'filterGlobal'
    );

    component.filterCurrencyDenomination(mockEvent);
    expect(filterGlobalSpy).toHaveBeenCalledWith('TestFilterValue', 'contains');
  });

  test('should select a currency on onCurrencyRowSelect', () => {
    const spyFetchBankCurrencyRate = jest.spyOn(component, 'fetchCurrencyRate');
    const spyFethCurrencyDenomination = jest.spyOn(
      component,
      'fetchCurrencyDenomination'
    );
    const selectedCurrency = mockCurrencyData[0];
    component.onCurrencyRowSelect(selectedCurrency);
    expect(component.selectedCurrency).toEqual(selectedCurrency);
    expect(spyFetchBankCurrencyRate).toHaveBeenCalledWith(selectedCurrency.id);
    expect(spyFethCurrencyDenomination).toHaveBeenCalledWith(
      selectedCurrency.id
    );
  });

  test('should select a currency exchange rate on onCurrencyRateRowSelect', () => {
    const selectedCurrencyRate = mockCurrencyRateData[0];
    component.onCurrencyRateRowSelect(selectedCurrencyRate);
    expect(component.selectedCurrencyRate).toEqual(selectedCurrencyRate);
  });

  test('should select a currency denomination on onCurrencyDenominationRowSelect', () => {
    const selectedCurrencyDenomination = mockCurrencyDenominationData[0];
    component.onCurrencyDenominationRowSelect(selectedCurrencyDenomination);
    expect(component.selectedCurrencyDenomination).toEqual(
      selectedCurrencyDenomination
    );
  });

  test('should open the currency modal and set form values when a currency is selected', () => {
    const mockselectedCurrency = mockCurrencyData[0];
    component.selectedCurrency = mockselectedCurrency;
    const spyOpenCurrencyModal = jest.spyOn(component, 'openCurrencyModal');
    const patchValueSpy = jest.spyOn(
      component.createCurrencyForm,
      'patchValue'
    );

    component.editCurrency();

    expect(spyOpenCurrencyModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      decimalRound: mockselectedCurrency.decimalWord,
      description: mockselectedCurrency.name,
      numberRound: mockselectedCurrency.numberWord,
      round: mockselectedCurrency.roundingOff,
      symbol: mockselectedCurrency.symbol,
    });
  });

  test('should display an error message when no currency is selected during edit', () => {
    component.selectedCurrency = null;

    component.editCurrency();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Currency is Selected!'
    );
  });

  test('should show the currency confirmation modal when deleteCurrency is called', () => {
    const spydeleteCurrency = jest.spyOn(component, 'deleteCurrency');
    component.deleteCurrency();

    expect(spydeleteCurrency).toHaveBeenCalled();
    expect(component.currencyConfirmationModal.show).toBeTruthy;
  });

  test('should confirm currency deletion when a currency is selected', () => {
    component.selectedCurrency = mockCurrencyData[0];
    const selectedCurrencyId = mockCurrencyData[0].id;

    const spydeleteCurrencyConfirmation = jest.spyOn(
      currencyServiceStub,
      'deleteCurrency'
    );

    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    const spydeleteCurrency = jest.spyOn(component, 'deleteCurrency');
    component.deleteCurrency();

    const button = fixture.debugElement.nativeElement.querySelector(
      '#currencyRateConfirmationModal'
    );
    button.click();

    component.confirmCurrencyDelete();

    expect(spydeleteCurrency).toHaveBeenCalled();
    expect(spydeleteCurrencyConfirmation).toHaveBeenCalledWith(
      selectedCurrencyId
    );
  });

  test('should open the currency exchange modal and set form values when a currency rate is selected', () => {
    const mockselectedCurrencyRate = mockCurrencyRateData[0];
    component.selectedCurrencyRate = mockselectedCurrencyRate;
    const spyOpenCurrencyExchangeModal = jest.spyOn(
      component,
      'openCurrencyExchangeModal'
    );
    const patchValueSpy = jest.spyOn(
      component.createCurrencyRateForm,
      'patchValue'
    );

    component.editCurrencyRate();

    expect(spyOpenCurrencyExchangeModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      exchangeCurrency: mockselectedCurrencyRate.targetCurrencyId,
      rate: mockselectedCurrencyRate.rate,
      date: mockselectedCurrencyRate.date,
      wef: mockselectedCurrencyRate.withEffectFromDate,
      wet: mockselectedCurrencyRate.withEffectToDate,
    });
  });

  test('should show the currency rate confirmation modal when deleteCurrencyRate is called', () => {
    const spydeleteCurrencyRate = jest.spyOn(component, 'deleteCurrencyRate');
    component.deleteCurrencyRate();

    expect(spydeleteCurrencyRate).toHaveBeenCalled();
    expect(component.currencyRateConfirmationModal.show).toBeTruthy;
  });

  test('should confirm currency rate deletion when a currency rate is selected', () => {
    component.selectedCurrencyRate = mockCurrencyRateData[0];
    const selectedCurrrencyId = mockCurrencyRateData[0].id;

    const spydeleteCurrencyRateConfirmation = jest.spyOn(
      currencyServiceStub,
      'deleteCurrencyRate'
    );

    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    const spydeleteCurrencyRate = jest.spyOn(component, 'deleteCurrencyRate');
    component.deleteCurrencyRate();

    const button = fixture.debugElement.nativeElement.querySelector(
      '#currencyRateConfirmationModal'
    );
    button.click();

    component.confirmCurrencyRateDelete();

    expect(spydeleteCurrencyRate).toHaveBeenCalled();
    expect(spydeleteCurrencyRateConfirmation).toHaveBeenCalledWith(
      selectedCurrrencyId
    );
  });

  test('should open the currency denomination modal and set form values when a currency denomination is selected', () => {
    const mockselectedCurrencyDenomination = mockCurrencyDenominationData[0];
    component.selectedCurrencyDenomination = mockselectedCurrencyDenomination;
    const spyOpenCurrencyDenominationModal = jest.spyOn(
      component,
      'openDenominationModal'
    );
    const patchValueSpy = jest.spyOn(
      component.createDenominationForm,
      'patchValue'
    );

    component.editCurrencyDenomination();

    expect(spyOpenCurrencyDenominationModal).toHaveBeenCalled();
    expect(patchValueSpy).toHaveBeenCalledWith({
      value: mockselectedCurrencyDenomination.value,
      name: mockselectedCurrencyDenomination.name,
      wef: mockselectedCurrencyDenomination.withEffectiveFrom,
    });
  });

  test('should display an error message when no currency denomination is selected during edit', () => {
    component.selectedCurrencyDenomination = null;

    component.editCurrencyDenomination();

    expect(messageServiceStub.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'No Currency Denomination is Selected!'
    );
  });

  test('should show the currency denomination confirmation modal when deleteCurrencyDenomination is called', () => {
    const spydeleteCurrencyDenomination = jest.spyOn(
      component,
      'deleteCurrencyDenomination'
    );
    component.deleteCurrencyDenomination();

    expect(spydeleteCurrencyDenomination).toHaveBeenCalled();
    expect(component.currencyDenominationConfirmationModal.show).toBeTruthy;
  });

  test('should confirm currency rate deletion when a currency rate is selected', () => {
    component.selectedCurrency = mockCurrencyData[0];
    const selectedCurrencyId = mockCurrencyData[0].id;
    component.selectedCurrencyDenomination = mockCurrencyDenominationData[0];
    const selectedCurrrencyDenominationId = mockCurrencyDenominationData[0].id;

    const spydeleteCurrencyDenominationConfirmation = jest.spyOn(
      currencyServiceStub,
      'deleteCurrencyDenomination'
    );

    const spydisplaySuccessMessage = jest.spyOn(
      messageServiceStub,
      'displaySuccessMessage'
    );

    const spydeleteCurrencyDenomination = jest.spyOn(
      component,
      'deleteCurrencyDenomination'
    );
    component.deleteCurrencyDenomination();

    const button = fixture.debugElement.nativeElement.querySelector(
      '#currencyDenominationConfirmationModal'
    );
    button.click();

    component.confirmCurrencyDenominationDelete();

    expect(spydeleteCurrencyDenomination).toHaveBeenCalled();
    expect(spydeleteCurrencyDenominationConfirmation).toHaveBeenCalledWith(
      selectedCurrrencyDenominationId
    );
  });
});
