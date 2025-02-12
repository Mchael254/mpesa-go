import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';

import { ReceiptCaptureComponent } from './receipt-capture.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { StaffService } from 'src/app/features/entities/services/staff/staff.service';
import { OrganizationService } from 'src/app/features/crm/services/organization.service';
import { ReceiptService } from '../../services/receipt.service';
import { CurrencyService } from 'src/app/shared/services/setups/currency/currency.service';
import { BankService } from 'src/app/shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { FmsService } from '../../services/fms.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { OrganizationDTO } from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';
import { BanksDTO, BranchDTO, NarrationDTO, PaymentModesDTO, ReceiptingPointsDTO, ReceiptNumberDTO } from '../../data/receipting-dto';

describe('ReceiptCaptureComponent', () => {
  let component: ReceiptCaptureComponent;
  let fixture: ComponentFixture<ReceiptCaptureComponent>;
  let mockAuthService: { getCurrentUser: jest.Mock };
  let mockStaffService: { getStaffById: jest.Mock };
  let mockOrganizationService: { getOrganization: jest.Mock };
  let mockReceiptService: {
    getDrawersBanks: jest.Mock;
    getNarrations: jest.Mock;
    getCurrencies: jest.Mock;
    getReceiptNumber: jest.Mock;
    getPaymentModes: jest.Mock;
    getReceiptingPoints: jest.Mock;
    getBanks: jest.Mock;
    getManualExchangeRateParameter: jest.Mock;
    getExchangeRate: jest.Mock;
    postChargeManagement: jest.Mock;
    getCharges: jest.Mock;
    postManualExchangeRate: jest.Mock;
  };
  let mockCurrencyService: {
    getCurrencies: jest.Mock;
    getCurrenciesRate: jest.Mock;
  };
  let mockBankService: { getBanks: jest.Mock };
  let mockGlobalMessagingService: {
    displayErrorMessage: jest.Mock;
    displaySuccessMessage: jest.Mock;
  };
  let mockFmsService: { getPaymentMethods: jest.Mock };
  let mockReceiptDataService: {
    getReceiptData: jest.Mock;
    setReceiptData: jest.Mock;
  };
  let mockRouter: { navigate: jest.Mock };

  beforeEach(async () => {
    // mockAuthService = {
    //   getCurrentUser: jest.fn().mockReturnValue({ code: 123,username:'',userType:'',status:'' } as StaffDto),
    // };
    mockStaffService = {
      getStaffById: jest.fn().mockReturnValue(of({} as StaffDto)),
    };
    mockOrganizationService = {
      getOrganization: jest.fn().mockReturnValue(of([] as OrganizationDTO[])),
    };
    mockReceiptService = {
      getDrawersBanks: jest.fn().mockReturnValue(of([])),
      getNarrations: jest.fn().mockReturnValue(of({ data: [] as NarrationDTO[] })),
      getCurrencies: jest.fn().mockReturnValue(of({ data: [] as CurrencyDTO[] })),
      getReceiptNumber: jest.fn().mockReturnValue(of({ receiptNumber: '123', branchReceiptNumber: 123 } as ReceiptNumberDTO)),
      getPaymentModes: jest.fn().mockReturnValue(of({ data: [] as PaymentModesDTO[] })),
      getReceiptingPoints: jest.fn().mockReturnValue(of({ data: [] as ReceiptingPointsDTO[] })),
      getBanks: jest.fn().mockReturnValue(of({ data: [] as BankDTO[] })),
      getManualExchangeRateParameter: jest.fn().mockReturnValue(of({ data: 'N' })),
      getExchangeRate: jest.fn().mockReturnValue(of({ data: '1.2' })),
      postChargeManagement: jest.fn().mockReturnValue(of({})),
      getCharges: jest.fn().mockReturnValue(of({ data: [] as any[] })),
      postManualExchangeRate: jest.fn().mockReturnValue(of({})),
    };
    mockCurrencyService = {
      getCurrencies: jest.fn().mockReturnValue(of([])),
      getCurrenciesRate: jest.fn().mockReturnValue(of([])),
    };
    mockBankService = {
      getBanks: jest.fn().mockReturnValue(of([])),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };
    mockFmsService = {
      getPaymentMethods: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockReceiptDataService = {
      getReceiptData: jest.fn().mockReturnValue(null),
      setReceiptData: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ReceiptCaptureComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule, // Import RouterTestingModule
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: BankService, useValue: mockBankService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: FmsService, useValue: mockFmsService },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the receiptingDetailsForm on ngOnInit', () => {
    expect(component.receiptingDetailsForm).toBeDefined();
  });

  it('should call fetchNarrations, fetchCurrencies and fetchPayments on ngOnInit', () => {
    jest.spyOn(component, 'fetchNarrations');
    jest.spyOn(component, 'fetchCurrencies');
    jest.spyOn(component, 'fetchPayments');
    component.ngOnInit();
    expect(component.fetchNarrations).toHaveBeenCalled();
    expect(component.fetchCurrencies).toHaveBeenCalled();
    expect(component.fetchPayments).toHaveBeenCalled();
  });

  it('should restore form data from ReceiptDataService on ngOnInit', () => {
    const mockSavedData = { amountIssued: '100' };
    mockReceiptDataService.getReceiptData.mockReturnValue(mockSavedData);
    component.ngOnInit();
    expect(component.receiptingDetailsForm.value.amountIssued).toEqual('100');
  });

  // it('should fetch payments', () => {
  //   mockFmsService.getPaymentMethods.mockReturnValue(of({ data: [{ id: 1, name: 'Cash' } as PaymentModesDTO] }));
  //   component.fetchPayments(1);
  //   expect(component.paymentModes).toEqual([{ id: 1, name: 'Cash' }]);
  // });

  it('should display an error message if fetching payments fails', () => {
    mockFmsService.getPaymentMethods.mockReturnValue(throwError(() => new Error()));
    component.fetchPayments(1);
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('error', 'error fetching payments modes');
  });

  it('should fetch currencies and set default currency', () => {
    const mockCurrencies: CurrencyDTO[] = [
      { id: 1, name: 'USD', symbol: '$', currencyDefault: 'Y', decimalWord: '', nameAndSymbol: '', numberWord: '', roundingOff: 0.5 },
      { id: 2, name: 'EUR', symbol: '€', currencyDefault: 'N', decimalWord: '', nameAndSymbol: '', numberWord: '', roundingOff: 0.5 },
    ];
    mockCurrencyService.getCurrencies.mockReturnValue(of(mockCurrencies));
    component.fetchCurrencies();
    expect(component.currencies).toEqual(mockCurrencies);
    expect(component.defaultCurrencyId).toBe(1);
    expect(component.receiptingDetailsForm.get('currency')?.value).toBe(1);
  });

  it('should display an error message if fetching currencies fails', () => {
    mockCurrencyService.getCurrencies.mockReturnValue(throwError(() => new Error()));
    component.fetchCurrencies();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Failed to fetch currencies');
  });

  it('should fetchBanks method is called when onCurrencyChanged method is called successfully',()=>{
        jest.spyOn(component, 'fetchBanks');
        const event = { target: { value: '2' } } as any;
        component.onCurrencyChanged(event);
        expect(component.fetchBanks).toHaveBeenCalled();
  });
  // it('should call fetchCurrencyRate and selectedCurrencySymbol when currency is changed',()=>{
  //    jest.spyOn(component, 'fetchCurrencyRate');
  //    component.currencies = [{
  //       decimalWord: 'U',
  //       currencyDefault: 'Y' || 'N',

  //       id: 1,
  //       name: 'USD',
  //       nameAndSymbol: 'USD',
  //       numberWord: 'OU',
  //       roundingOff: 0.5,
  //       symbol: 'U'
  //   },

  //   ];

  //   const mockEvent = { target: { value: '1' } } as unknown as Event;
  //   component.onCurrencyChanged(mockEvent);
  //   expect(component.fetchCurrencyRate).toHaveBeenCalled();
  //   expect(component.selectedCurrencySymbol).toBe('U');

  // });
   it('should do navigate next screen successfully ', () => {
    // Arrange
    const mockreceiptData = {
      selectedBranch:1,
       organization:1,
      amountIssued: 100,
      openCheque: false,
      receiptNumber: '123',
      ipfFinancier: '',
      grossReceiptAmount: 100,
      receivedFrom: 'John Doe',
      drawersBank: 'Bank',
      receiptDate: '2024-07-25',
      narration: 'narration',
      paymentRef: 'paymentRef',
      otherRef: '',
      documentDate: '2024-07-25',
      manualRef: '',
      currency: 1,
      paymentMode: 'CASH',
      chequeType: '',
      bankAccount: 1,
      exchangeRate: 1,
      exchangeRates:'',
      manualExchangeRate: 1,
    capitalInjection: '',
    allocationType: '',
    accountType: 'AccountType1',
        searchCriteria: 'clientName',
        searchQuery: 'John Doe',
    allocatedAmount: [],

    }

    component.receiptingDetailsForm.setValue({
      selectedBranch:1,
       organization:1,
      amountIssued: 100,
      openCheque: false,
      receiptNumber: '123',
      ipfFinancier: '',
      grossReceiptAmount: 100,
      receivedFrom: 'John Doe',
      drawersBank: 'Bank',
      receiptDate: '2024-07-25',
      narration: 'narration',
      paymentRef: 'paymentRef',
      otherRef: '',
      documentDate: '2024-07-25',
      manualRef: '',
      currency: 1,
      paymentMode: 'CASH',
      chequeType: '',
      bankAccount: 1,
      exchangeRate: 1,
      exchangeRates:'',
      manualExchangeRate: 1,
    capitalInjection: '',
    allocationType: '',
    accountType: 'AccountType1',
        searchCriteria: 'clientName',
        searchQuery: 'John Doe',
    allocatedAmount: [],

    }); // Provide your form's values here
  
    //Act
    component.onNext();
    //Assert
        expect(mockReceiptDataService.setReceiptData).toHaveBeenCalledWith(mockreceiptData);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client']);
   
      });

    it('should do navigate back to previus screen successfully ', () => {
   
          //Act
          component.onBack();
          //Assert
      
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/']);
         
            });
});