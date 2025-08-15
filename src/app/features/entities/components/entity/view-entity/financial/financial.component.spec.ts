import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { FinancialComponent } from './financial.component';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {GlobalMessagingService} from "../../../../../../shared/services/messaging/global-messaging.service";
import {ClientService} from "../../../../services/client/client.service";
import {CountryService} from "../../../../../../shared/services/setups/country/country.service";
import {UtilService} from "../../../../../../shared/services";
import {of} from "rxjs";
import {CountryDto} from "../../../../../../shared/data/common/countryDto";
import {BankDTO} from "../../../../../../shared/data/common/bank-dto";
import {BankService} from "../../../../../../shared/services/setups/bank/bank.service";
import {CurrencyService} from "../../../../../../shared/services/setups/currency/currency.service";
import {PaymentModesService} from "../../../../../../shared/services/setups/payment-modes/payment-modes.service";
import {CurrencyDTO} from "../../../../../../shared/data/common/currency-dto";
import {PaymentModesDto} from "../../../../../../shared/data/common/payment-modes-dto";
import {ElementRef} from "@angular/core";


const banks: BankDTO[] = [
    {
    administrativeCharge: 0,
    allowPesalink: "",
    bankAccountNoCharacters: 0,
    bankLogo: "",
    bankSortCode: "",
    bankType: "",
    countryId: 0,
    countryName: "",
    ddiCharge: 0,
    directDebitFormat: "",
    directDebitReportCode: 0,
    forwardingBankId: 0,
    forwardingBankName: "",
    hasParentBank: "",
    id: 0,
    isDirectDebitSupported: "",
    isEftSupported: "",
    isForwardingBank: "",
    isNegotiatedBank: "",
    maximumAccountNoCharacters: "",
    minimumAccountNoCharacters: "",
    name: "",
    parentBankId: 0,
    parentBankName: "",
    physicalAddress: "",
    remarks: "",
    short_description: "",
    status: "",
    withEffectiveFrom: "",
    withEffectiveTo: ""
  }
]

const currencies: CurrencyDTO[] = [
  {decimalWord: "", id: 162, name: "", numberWord: "", roundingOff: 0, symbol: ""},
]

const paymentModes: PaymentModesDto[] = [
  {
    description: "",
    id: 0,
    isDefault: "",
    narration: "",
    organizationId: 0,
    shortDescription: ""
  }
]

const paymentDetails = {
  accountNumber: 12345,
  bankBranchId: 101,
  currencyId: 162,
  effectiveFromDate: '2015-03-25',
  effectiveToDate: '2015-03-25',
  iban: '456',
  preferredChannel: 5,
  swiftCode: '123',
  mpayno: '123'
}

describe('FinancialComponent', () => {
  let component: FinancialComponent;
  let fixture: ComponentFixture<FinancialComponent>;

  let mockMessagingService = {
    displaySuccessMessage: jest.fn(),
    displayErrorMessage: jest.fn()
  };

  const mockUtilService = {
    currentLanguage: of('en')
  }

  const mockBankService = {
    getBanks: jest.fn(),
    getBankBranchesByBankId: jest.fn(),

  }

  const mockCurrencyService = {
    getCurrencies: jest.fn(),

  }

  const mockPaymentModesService = {
    getPaymentModes: jest.fn(),

  }

  const mockClientService = {
    updateClientSection: jest.fn().mockReturnValue(of({}))
  }


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinancialComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: GlobalMessagingService, useValue: mockMessagingService },
        { provide: ClientService, useValue: mockClientService },
        { provide: BankService, useValue: mockBankService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: PaymentModesService, useValue: mockPaymentModesService },
      ]
    });
    fixture = TestBed.createComponent(FinancialComponent);
    component = fixture.componentInstance;

    component.formFieldsConfig =  {
      label: {
        en: "address",
        fr: "adresse",
        ke: "anwani"
      },
      fields: [
        {
          sectionId: "financial",
          fieldId: "accountNumber",
          type: "text",
          label: { en: "account number", ke: "", fr: "" },
          dynamicLabel: null,
          defaultValue: null,
          visible: true,
          disabled: false,
          validations: [],
          conditions: [],
          order: 4,
          tooltip: { en: "", fr: "", ke: "" },
          placeholder: { en: "", fr: "", ke: "" },
          isMandatory: true,
          options: []
        },
      ],
      buttons: {
        cancel: {
          label: { en: "Cancel" },
        },
        save: {
          label: { en: "save" },
        },
      }
    }

    component.accountCode = 222;

    component.financialDetails = paymentDetails
      /*{
      accountNumber: 12345,
      effectiveFromDate: '2015-03-25',
      effectiveToDate: '2015-03-25',
      iban: '345',
      preferredChannel: 'CASH',
      currencyId: 162
    }*/

    jest.spyOn(mockBankService, 'getBanks').mockReturnValue(of(banks));
    jest.spyOn(mockBankService, 'getBankBranchesByBankId').mockReturnValue(of(banks));
    jest.spyOn(mockCurrencyService, 'getCurrencies').mockReturnValue(of({}));
    jest.spyOn(mockPaymentModesService, 'getPaymentModes').mockReturnValue(of({}));
    jest.spyOn(mockClientService, 'updateClientSection').mockReturnValue(of(paymentDetails));

    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should patchForm values correctly', () => {
    component.editForm = new FormBuilder().group({
      accountNumber: [''],
      branchName: [''],
      currency: [''],
      wef: [''],
      wet: [''],
      iban: [''],
      preferredPaymentMethod: [''],
      swiftCode: [''],
      mpayno: [''],
    });

    component.patchFormValues();
    expect(component.editForm.value.accountNumber).toBe(12345);
    expect(component.editForm.value.iban).toBe('456');
  });


  test('should call editButton click, setSelectOptions, and patchFormValues', fakeAsync(() => {
    const setSelectOptionsSpy = jest.spyOn(component, 'setSelectOptions');
    const patchFormValuesSpy = jest.spyOn(component, 'patchFormValues');

    component.editButton = {
      nativeElement: {
        click: jest.fn()
      }
    } as any;

    component.openEditFinancialDialog();

    expect(component.editButton.nativeElement.click).toHaveBeenCalled();
    expect(setSelectOptionsSpy).toHaveBeenCalled();

    tick(500); // simulate the 500ms delay
    expect(patchFormValuesSpy).toHaveBeenCalled();
  }));


  test('should set options for bank, bankBranch, currency and preferredPayment fields', () => {
    component.banks = banks;
    component.bankBranches = banks;
    component.currencies = currencies;
    component.paymentModes = paymentModes;

    component.formFieldsConfig = {
      fields: [
        { fieldId: 'bankName', options: [] },
        { fieldId: 'branchName', options: [] },
        { fieldId: 'currency', options: [] },
        { fieldId: 'preferredPaymentMethod', options: [] },
      ]
    };

    component.setSelectOptions();

    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'bankName')?.options).toEqual(component.banks);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'branchName')?.options).toEqual(component.banks);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'currency')?.options).toEqual(component.currencies);
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'preferredPaymentMethod')?.options).toEqual(component.paymentModes);
  });

  test('should fetch and set bankBranches when a bank is selected', () => {
    // const mockStates = states;
    const mockEvent = { target: { value: '102' } };

    jest.spyOn(mockBankService, 'getBankBranchesByBankId').mockReturnValue(of(banks));

    component.formFieldsConfig = {
      fields: [
        { fieldId: 'bankName', options: [] },
        { fieldId: 'branchName', options: [] }
      ]
    };

    component.processSelectOption(mockEvent, 'bankName');

    expect(mockBankService.getBankBranchesByBankId).toHaveBeenCalledWith('102');
    expect(component.formFieldsConfig.fields.find(f => f.fieldId === 'branchName')?.options).toEqual(banks);
  });


  test('should call updateClient', () => {
    component.editForm = new FormBuilder().group({
      accountNumber: ['12345'],
      branchName: ['101'],
      currency: ['162'],
      wef: ['2015-03-25'],
      wet: ['2015-03-25'],
      iban: ['12345'],
      preferredPaymentMethod: ['12'],
      swiftCode: ['456'],
      mpayno: ['123'],
    });

    component.currencies = currencies;

    // component.accountCode = 222;

    component.closeButton = {
      nativeElement: {
        click: jest.fn()
      }
    } as unknown as ElementRef;

    component.editFinancialDetails();

    expect(mockClientService.updateClientSection).toHaveBeenCalled();
    expect(mockMessagingService.displaySuccessMessage).toHaveBeenCalled();
  });

});
