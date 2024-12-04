import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { bootstrap } from 'bootstrap';  // Only if you actually import bootstrap
import {Modal} from 'bootstrap';
import { ReceiptComponent } from './receipt.component';
import { SessionStorageService } from "../../../../shared/services/session-storage/session-storage.service";
import { ReceiptService } from '../../services/receipt.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ClientsDTO, CurrencyDTO, ExistingChargesResponseDTO, ManualExchangeRateResponseDTO, ReceiptingPointsDTO, TransactionDTO } from '../../data/receipting-dto';

describe('ReceiptComponent', () => {
  let component: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;
  let mockReceiptService: jest.Mocked<ReceiptService>;
  let mockSessionStorageService: jest.Mocked<SessionStorageService>;
  let mockGlobalMessagingService: jest.Mocked<GlobalMessagingService>;
  let chequeTypeModalMock: { hide: jest.Mock; show: jest.Mock };
  let formBuilder: FormBuilder;

  beforeEach(async() => {
    mockReceiptService = {
      getDrawersBanks: jest.fn().mockReturnValue(of([])), // Return empty array
      getNarrations: jest.fn().mockReturnValue(of([])),  // Return empty array
     // getCurrencies: jest.fn().mockReturnValue(of([])), // Return empty array
      // getDrawersBanks: jest.fn().mockReturnValue(of({})),
      // getNarrations: jest.fn().mockReturnValue(of({})),
      getCurrencies: jest.fn().mockReturnValue(of({data:[]})),
      getReceiptNumber: jest.fn().mockReturnValue(of({})),
      // getReceiptingPoints: jest.fn().mockReturnValue(of({})),
      getPaymentModes: jest.fn().mockReturnValue(of({})),
      getReceiptingPoints: jest.fn(() => of({ data: [] as ReceiptingPointsDTO[] })), //Corrected Mock
      getBanks: jest.fn().mockReturnValue(of({})),
      getManualExchangeRateParameter: jest.fn().mockReturnValue(of({})),
      getExchangeRate: jest.fn().mockReturnValue(of({})),
      getExistingCharges: jest.fn().mockReturnValue(of({})),
      postChargeManagement: jest.fn().mockReturnValue(of({})),
      getCharges: jest.fn().mockReturnValue(of({})),
      postManualExchangeRate: jest.fn().mockReturnValue(of({})),
      getAccountTypes: jest.fn().mockReturnValue(of({})),
      getClients: jest.fn().mockReturnValue(of({})),
      getTransactions: jest.fn().mockReturnValue(of({})),
      postAllocation: jest.fn().mockReturnValue(of({}))
    } as unknown as jest.Mocked<ReceiptService>;

    chequeTypeModalMock = { hide: jest.fn(), show: jest.fn() };
    jest.spyOn(document, 'getElementById').mockReturnValue({
      id: 'chequeTypeModal',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    } as unknown as HTMLElement);

    jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(
      chequeTypeModalMock as unknown as Modal
    );

    
    
    
// Mock the entire bootstrap module
jest.mock('bootstrap', () => ({
  Modal: {
    getInstance: jest.fn(), // Mock getInstance
    show: jest.fn(),
    hide: jest.fn(), // Mock hide method
  },
}));

    mockSessionStorageService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      get: jest.fn(),
      set: jest.fn()
    } as unknown as jest.Mocked<SessionStorageService>;

    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      
    } as unknown as jest.Mocked<GlobalMessagingService>;

    TestBed.configureTestingModule({
      declarations: [ReceiptComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MultiSelectModule,
        TableModule,
        DropdownModule
      ],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReceiptComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    //component.currencies = []; // Initialize as an empty array
  });
  // console.log(fixture)
  // fixture.detectChanges();
  
   
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should hide the modal if chequeTypes is not null', () => {
    component.chequeTypes = ['Cheque 1', 'Cheque 2'];

    component.onCancelChequModal([]);
   
    
    expect(chequeTypeModalMock.hide).toHaveBeenCalled();
  });
 
  
  it('should initialize form on ngOnInit', () => {
    expect(component.receiptingDetailsForm).toBeDefined();
    expect(component.receiptingDetailsForm.get('amountIssued')).toBeDefined();
    expect(component.receiptingDetailsForm.get('receivedFrom')).toBeDefined();
    expect(component.receiptingDetailsForm.get('receiptDate')).toBeDefined();
  });

  // it('should fetch receipting points on ngOnInit', () => {
  //   expect(mockReceiptService.getReceiptingPoints).toHaveBeenCalled();
  // });

  it('should fetch currencies on ngOnInit', () => {
    expect(mockReceiptService.getCurrencies).toHaveBeenCalled();
  });

  it('should fetch payment modes on ngOnInit', () => {
    expect(mockReceiptService.getPaymentModes).toHaveBeenCalled();
  });

  it('should handle currency change', () => {
    const mockEvent = { target: { value: 'USD' } } as unknown as Event;
    component.onCurrencyChanged(mockEvent);
    expect(mockReceiptService.getManualExchangeRateParameter).toHaveBeenCalledWith('YES');
  });
  // it('should fetch currencies and set default currency', () => {
  //   const mockCurrency: CurrencyDTO = {
  //     code: 20, symbol: 'Ksh',
  //     desc: '',
  //     roundOff: 0
  //   }; //Create a CurrencyDTO object
  //   mockReceiptService.getCurrencies.mockReturnValueOnce(of({ data: [mockCurrency] })); 
  //   fixture.detectChanges();
  //   expect(component.currencies.length).toBe(1);
  //   expect(component.currencyGlobal).toBe(20); // Assuming 'code' is a number.
  //   expect(component.currencySymbolGlobal).toBe('Ksh');
  //   expect(component.receiptingDetailsForm.get('currency')?.value).toBe(20); //Changed to 20 because code is number
  // });
  // it('should handle error during currency fetching', () => {
  //   const errorMessage = 'Error fetching currencies';
  //   const error = new ErrorEvent('Error', { message: errorMessage });
  //   mockReceiptService.getCurrencies.mockReturnValueOnce(throwError(() => error));
  //   // component.ngOnInit();
  //   fixture.detectChanges(); // Added detectChanges here! Essential.
  //   expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', errorMessage);
  //   expect(component.currencies.length).toBe(0); // added to check the length of currencies
  // });
  // it('should call all fetch methods on ngOnInit', () => {
  //   const fetchReceiptingPointsSpy = spyOn(component, 'fetchReceiptingPoints');
  //   const fetchCurrenciesSpy = spyOn(component, 'fetchCurrencies');
  //   const captureReceiptFormSpy = spyOn(component, 'captureReceiptForm');
  //   const fetchPaymentModesSpy = spyOn(component, 'fetchPaymentModes');
  //   const fetchDefaultExchangeRateSpy = spyOn(component, 'fetchDefaultExchangeRate');
  //   const fetchNarrationsSpy = spyOn(component, 'fetchNarrations');
  //   const fetchExistingChargesSpy = spyOn(component, 'fetchExistingCharges');
  //   const fetchAccountTypesSpy = spyOn(component, 'fetchAccountTypes');
  //   const fetchBanksSpy = spyOn(component, 'fetchBanks');
  //   const fetchManualExchangeRateParameterSpy = spyOn(component, 'fetchManualExchangeRateParameter');
  //   const fetchDrawersBankSpy = spyOn(component, 'fetchDrawersBank');
  
  
  //   component.ngOnInit();
  
  //   expect(captureReceiptFormSpy).toHaveBeenCalled();
  //   expect(fetchCurrenciesSpy).toHaveBeenCalled();
  //   expect(fetchPaymentModesSpy).toHaveBeenCalled();
  //   expect(fetchReceiptingPointsSpy).toHaveBeenCalled();
  //   expect(fetchDefaultExchangeRateSpy).toHaveBeenCalled();
  //   expect(fetchExistingChargesSpy).toHaveBeenCalled();
  //   expect(fetchAccountTypesSpy).toHaveBeenCalled();
  //   expect(fetchBanksSpy).toHaveBeenCalled();
  //   expect(fetchDrawersBankSpy).toHaveBeenCalled();
  //   expect(fetchNarrationsSpy).toHaveBeenCalled();
  //   expect(fetchManualExchangeRateParameterSpy).toHaveBeenCalled();
  //   expect(component.orgCode).toBe(sessionStorage.getItem('SESSION_ORG_CODE'));
  // });
  it('should call all fetch methods on ngOnInit', () => {
    
    jest.spyOn(component, 'fetchCurrencies');
    jest.spyOn(component, 'captureReceiptForm');
    jest.spyOn(component, 'fetchPaymentModes');
    jest.spyOn(component, 'fetchDefaultExchangeRate');
    jest.spyOn(component, 'fetchNarrations');
    jest.spyOn(component, 'fetchExistingCharges');
    jest.spyOn(component, 'fetchAccountTypes');
    jest.spyOn(component, 'fetchBanks');
    jest.spyOn(component, 'fetchManualExchangeRateParameter');
    jest.spyOn(component, 'fetchDrawersBank');
  
  
    component.ngOnInit();
  
    expect(component.captureReceiptForm).toHaveBeenCalled();
    expect(component.fetchCurrencies).toHaveBeenCalled();
    expect(component.fetchPaymentModes).toHaveBeenCalled();
    
    expect(component.fetchDefaultExchangeRate).toHaveBeenCalled();
    expect(component.fetchExistingCharges).toHaveBeenCalled();
    expect(component.fetchAccountTypes).toHaveBeenCalled();
    expect(component.fetchBanks).toHaveBeenCalled();
    expect(component.fetchDrawersBank).toHaveBeenCalled();
    expect(component.fetchNarrations).toHaveBeenCalled();
    expect(component.fetchManualExchangeRateParameter).toHaveBeenCalled();
    
    
  });
 
  it('should handle charges change', () => {
    component.onChargesChange('yes');
    expect(component.chargesEnabled).toBe(true);
    expect(mockReceiptService.getCharges).toHaveBeenCalled();
  });

  it('should handle account type change', () => {
    component.onAccountTypeChange();
    expect(component.isAccountTypeSelected).toBe(false);
  });
  it('should handle account type change', () => {
    // Mock the form and set the value of accountType
    component.receiptingDetailsForm = new FormBuilder().group({
      accountType: ['someAccountType'], // Mock value
      searchCriteria: [{ value: '', disabled: true }],
      searchQuery: [{ value: '', disabled: true }],
    });
  
    // Call the method
    component.onAccountTypeChange();
  
    // Expect the property to be updated correctly
    expect(component.isAccountTypeSelected).toBe(true);
  
    // Verify form controls are enabled
    expect(component.receiptingDetailsForm.get('searchCriteria')?.enabled).toBe(true);
    expect(component.receiptingDetailsForm.get('searchQuery')?.enabled).toBe(true);
  });
  
  it('should fetch narrations and update narrations and filteredNarrations on success', () => {
    const mockResponse = {
      data: [
        { code: 1, narration: 'Narration 1' },
        { code: 2, narration: 'Narration 2' },
      ],
      msg: 'Success',
      success: true,
    };

    // Mock the service method to return the mock response
    mockReceiptService.getNarrations.mockReturnValue(of(mockResponse));

    // Call the fetchNarrations method
    component.fetchNarrations();

    // Assert that the narrations are updated with the mock data
    expect(component.narrations).toEqual(mockResponse.data);
    // Assert that filteredNarrations is also updated
    expect(component.filteredNarrations).toEqual(mockResponse.data);
  });

  it('should handle error when fetching narrations', () => {
    const mockError = { error: { error: 'Failed to fetch narrations' } };

    // Mock the service method to throw an error
    mockReceiptService.getNarrations.mockReturnValue(throwError(mockError));

    // Call the fetchNarrations method
    component.fetchNarrations();

    // Assert that the error handler was called
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      mockError.error.error
    );
  });

  it('should handle error when fetching exchange rate', () => {
    const mockError = { error: { error: 'Failed to fetch exchange rate' } };

    // Mock the service method to throw an error
    mockReceiptService.getExchangeRate.mockReturnValue(throwError(mockError));

    // Call the fetchDefaultExchangeRate method
    component.fetchDefaultExchangeRate();

    // Assert that the error handler was called
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      mockError.error.error
    );
  });
  it('should fetch transactions successfully', () => {
    const mockTransaction: TransactionDTO = {
      systemShortDescription: 'System Short Desc',
      transactionNumber: 12345,
      transactionDate: new Date(),
      referenceNumber: 'Ref123',
      transactionType: 'Payment',
      clientCode: 123,
      amount: 100.50,
      balance: 0,
      commission: 0,
      withholdingTax: 0,
      transactionLevy: 0,
      serviceDuty: 0,
      settlementAmount: 100.50,
      narrations: 'Test Narration',
      accountCode: 'ACC123',
      clientPolicyNumber: 'POL123',
      receiptType: 'Manual',
      extras: 0,
      policyHolderFund: 0,
      agentDiscount: 0,
      policyBatchNumber: 1,
      propertyCode: 1,
      clientName: 'Test Client',
      vat: 0,
      commissionPayable: 0,
      vatPayable: 0,
      healthFund: 0,
      roadSafetyFund: 0,
      clientVatAmount: 0,
      certificateCharge: 0,
      motorLevy: 0,
      originalInstallmentPremium: 0,
      outstandingPremiumBalance: 0,
      nextInstallmentNumber: 0,
      paidToDate: new Date(),
      transmissionReferenceNumber: 'TransRef123'
    };
    const mockTransactions = [mockTransaction];
  
    mockReceiptService.getTransactions.mockReturnValueOnce(of({ data: mockTransactions }));
  
    component.fetchTransactions('System Short Desc', 123, 123, 'Manual', 'Test Client');
  
    expect(mockReceiptService.getTransactions).toHaveBeenCalledWith(
      'System Short Desc', 123, 123, 'Manual', 'Test Client'
    );
    expect(component.transactions).toEqual(mockTransactions);
  });
  
  it('should handle errors during transaction fetching', async () => {
    const errorMessage = 'Error fetching transactions';
    const mockErrorResponse = { error: errorMessage }; //Correct mock object
    const mockError = new Error(); // Create a regular Error object
    mockError.message = errorMessage; // Set the standard message property for clarity
    mockReceiptService.getTransactions.mockReturnValueOnce(throwError(() => mockError)); // Use the regular error, message is more useful
  
    await component.fetchTransactions('System Short Desc', 123, 123, 'Manual', 'Test Client');
  
    expect(mockReceiptService.getTransactions).toHaveBeenCalledWith(
      'System Short Desc', 123, 123, 'Manual', 'Test Client'
    );
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', errorMessage);
  });


  it('should update selectedCurrencyCode and selectedCurrencySymbol', () => {
    component.currencies = [
      { code: 268, symbol: '$',desc:'SRR', roundOff:2 },
      { code: 313, symbol: '€',desc:'SRR', roundOff:1 },
    ];

    const mockEvent = { target: { value: 'EUR' } } as unknown as Event;
    component.onCurrencyChanged(mockEvent);

    expect(component.selectedCurrencyCode).toBe('EUR');
    expect(component.selectedCurrencySymbol).toBe('');
  });

  it('should show exchange rate modal if manual rate setup is not "N"', () => {
    jest.spyOn(component, 'showExchangeRateModal2');
    mockReceiptService.getManualExchangeRateParameter.mockReturnValue(
      of({ data: 'Y', msg: 'manual',
        success: true })
    );

    component.onCurrencyChanged({ target: { value: 'USD' } } as unknown as Event);

    expect(component.showExchangeRateModal2).toHaveBeenCalled();
  });
 
  it('should do nothing if the modal does not exist', () => {
    // Clear the document body
    document.body.innerHTML = '';
  
    // Mock the case where 'getInstance' returns null (modal does not exist)
    jest.spyOn(bootstrap.Modal, 'getInstance').mockReturnValue(null);
  
    // Call the method that should not call hide if the modal does not exist
    component.closeModal2();
  
    // Assert that hide was not called since the modal doesn't exist
    expect(bootstrap.Modal.getInstance).toHaveBeenCalledWith(document.getElementById('exchangeRateModal2'));
    // Since 'getInstance' returned null, 'hide' should not be called
    expect(bootstrap.Modal.hide).not.toHaveBeenCalled();
  });
  
  
  it('should display an error message if fetching manual rate parameter fails', () => {
    const error = { error: { error: 'Network Error' } };
    mockReceiptService.getManualExchangeRateParameter.mockReturnValue(throwError(error));

    component.onCurrencyChanged({ target: { value: 'USD' } } as unknown as Event);

    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Network Error'
    );
  });

  it('should fetch and assign exchange rates', () => {
    mockReceiptService.getExchangeRate.mockReturnValue(of({ data: '123.45' ,msg:'successfully..',success:true}));
    jest.spyOn(component, 'showExchangeRateModal');

    component.fetchDefaultExchangeRate();

    expect(component.exchangeRates).toBe('123.45');
    expect(component.showExchangeRateModal).toHaveBeenCalled();
  });

  it('should display an error message if posting manual exchange rate fails', () => {
    component.exchangeRate = 123.45;
    const error = { error: { error: 'Manual Rate Error' } };
    mockReceiptService.postManualExchangeRate.mockReturnValue(throwError(error));

    component.confirmExchangeRateValue();

    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      'Failed to save manual exchange rate. Please try again.'
    );
  });

  it('should alert user if exchangeRate is not valid', () => {
    jest.spyOn(window, 'alert').mockImplementation();
    component.exchangeRate = 0;

    component.confirmExchangeRateValue();

    expect(window.alert).toHaveBeenCalledWith('please enter a valid value!');
  });

  it('should close the exchange rate modal', () => {
    jest.spyOn(component, 'closeModal');

    component.confirmExchangeRate();

    expect(component.closeModal).toHaveBeenCalled();
  });


  it('should hide the exchange rate modal if it exists', () => {
    document.body.innerHTML = `<div id="exchangeRateModal2"></div>`;
    const modalElement = document.getElementById('exchangeRateModal2');
    const mockModalInstance = { hide: jest.fn() };
    jest.spyOn(bootstrap.Modal, 'getInstance').mockReturnValue(mockModalInstance as any);

    component.closeModal2();

    expect(mockModalInstance.hide).toHaveBeenCalled();
  });

  it('should do nothing if the modal does not exist', () => {
    document.body.innerHTML = '';
    const hideSpy = jest.fn();
    jest.spyOn(bootstrap.Modal, 'getInstance').mockReturnValue(null);

    component.closeModal2();

    expect(hideSpy).not.toHaveBeenCalled();
  });


  it('should post manual exchange rate if exchangeRate is valid', () => {
    component.exchangeRate = 123.45;
    jest.spyOn(component, 'closeModal2');
    
    // Mock the service to return a successful response
    mockReceiptService.postManualExchangeRate.mockReturnValue(
      of({ msg: 'Success', success: true, data: '' } as ManualExchangeRateResponseDTO)
    );
  
    // Call the method under test
    component.confirmExchangeRateValue();
  
    // Check that the service was called with the correct parameters
    expect(mockReceiptService.postManualExchangeRate).toHaveBeenCalledWith(
      component.selectedCurrencyCode,
      1,
      'FMSADMIN',
      123.45
    );
  
    // Check that closeModal2 was called after posting the exchange rate
    expect(component.closeModal2).toHaveBeenCalled();
  });
  
    
  it('should fetch default exchange rate if manual rate setup is "N"', () => {
    jest.spyOn(component, 'fetchDefaultExchangeRate'); // Spy on fetchDefaultExchangeRate
    mockReceiptService.getManualExchangeRateParameter.mockReturnValue(
      of({ data: 'N', msg: 'Manual rate setup', success: true }) // Mock API response
    );
  
    component.onCurrencyChanged({ target: { value: 'USD' } } as unknown as Event);
  
    expect(component.fetchDefaultExchangeRate).toHaveBeenCalled(); // Ensure method is called
  });
  it('should call alert with success message when allocation is posted successfully', () => {
    const mockPayload = {
      receiptParticulars: [
        { code: 1, description: 'Particular 1', amount: 100 },
        { code: 2, description: 'Particular 2', amount: 200 },
      ],
    };

    const mockResponse = {
      msg: 'Success',
      success: true,
      data: 'Allocation posted successfully',
    };

    // Mock the postAllocation method to return a successful response
    mockReceiptService.postAllocation.mockReturnValue(of(mockResponse));

    // Spy on the global alert function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Call the submitAllocation method
    component.submitAllocation(mockPayload);

    // Assert that the alert was called with the success message
    expect(alertSpy).toHaveBeenCalledWith('Allocation posted successfully!');

    // Clean up the spy
    alertSpy.mockRestore();
  });
  it('should call alert with error message when allocation posting fails', () => {
    const mockPayload = {
      receiptParticulars: [
        { code: 1, description: 'Particular 1', amount: 100 },
        { code: 2, description: 'Particular 2', amount: 200 },
      ],
    };

    const mockError = {
      error: { error: 'Failed to post allocation' },
    };

    // Mock the postAllocation method to return an error
    mockReceiptService.postAllocation.mockReturnValue(throwError(mockError));

    // Spy on the global alert function
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Call the submitAllocation method
    component.submitAllocation(mockPayload);

    // Assert that the alert was called with the error message
    expect(alertSpy).toHaveBeenCalledWith('Failed to post allocation. Please try again.');

    // Clean up the spy
    alertSpy.mockRestore();

    // Assert that the error handler was called
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
      'Error',
      mockError.error.error
    );
  });

  
  it('should fetch currencies and set the first one as default', () => {
    const mockCurrencies: CurrencyDTO[] = [
      { code: 1, symbol: '$', desc: 'USD', roundOff: 2 },
      { code: 2, symbol: '€', desc: 'EUR', roundOff: 2 },
    ];

    const mockResponse = {
      msg: 'Success',
      success: true,
      data: mockCurrencies,
    };

    // Mock the getCurrencies method to return the mock response
    mockReceiptService.getCurrencies.mockReturnValue(of(mockResponse));

    // Call fetchCurrencies method
    component.fetchCurrencies();

    // Assert that currencies were set
    expect(component.currencies).toEqual(mockCurrencies);
    
    // Assert that the first currency is set as the default
    expect(component.currencyGlobal).toBe(mockCurrencies[0].code);
    expect(component.currencySymbolGlobal).toBe(mockCurrencies[0].symbol);

    // Assert that the form control for currency is patched with the default currency
    expect(component.receiptingDetailsForm.get('currency')?.value).toBe(mockCurrencies[0].code);
  });

  it('should call fetchClients with correct parameters if the form is valid', () => {
    // Set valid form values
    component.receiptingDetailsForm.setValue({
      accountType: 'AccountType1',
      searchCriteria: 'clientName',
      searchQuery: 'John Doe',
    });

    // Spy on fetchClients method
    const fetchClientsSpy = jest.spyOn(component, 'fetchClients');

    // Mock account types
    component.accountTypes = [{
      name: 'AccountType1', systemCode: 20, accCode: 2,
      branchCode: 0,
      userCode: 0,
      code: 0,
      coaAccNumber: '',
      coaAccOrgCode: 0,
      coaBranchCode: 0,
      receiptBank: 0,
      chequeBank: 0,
      subClass: '',
      active: '',
      receiptAccount: '',
      restrictGrossDebitRcpt: '',
      vatApplicable: '',
      rateApplicable: 0,
      actTypeShtDesc: '',
      systemName: ''
    }];

    // Call onSearch method
    component.onSearch();

    // Expect fetchClients to be called with the correct arguments
    expect(fetchClientsSpy).toHaveBeenCalledWith('CLIENT_NAME', 'John Doe');
  });

  it('should update narration and reset dropdown on narration selection', () => {
    const mockNarrations = [
      { code: 1, narration: 'Narration 1' },
      { code: 2, narration: 'Narration 2' },
    ];
    component.narrations = mockNarrations;
    component.filteredNarrations = [...mockNarrations];
    component.originalNarration = null;
    component.isNarrationFromLov = false;

    // Simulate dropdown change event
    const mockEvent = { target: { value: 'Narration 1' } };
    
    // Call the method that handles dropdown change
    component.onNarrationDropdownChange(mockEvent);

    // Check that narration was updated in form control
    expect(component.receiptingDetailsForm.get('narration')?.value).toBe('Narration 1');
    
    // Check that the narration is removed from the dropdown
    expect(component.filteredNarrations.length).toBe(1);
    expect(component.filteredNarrations[0].narration).toBe('Narration 2');

    // Check the updated flags and value
    expect(component.originalNarration).toBe('Narration 1');
    expect(component.isNarrationFromLov).toBe(true);
  });

  
  it('should restore filtered narrations and reset narration on text change', () => {
    const mockNarrations = [
      { code: 1, narration: 'Narration 1' },
      { code: 2, narration: 'Narration 2' },
    ];
    component.narrations = mockNarrations;
    component.filteredNarrations = [...mockNarrations];
    component.originalNarration = 'Narration 1';
    component.isNarrationFromLov = true;

    // Set the narration field in the form to an empty string
    component.receiptingDetailsForm.get('narration')?.patchValue('');
    
    // Call the method that handles text change
    component.onNarrationTextChange();

    // Check that narrations were restored and original narration was reset
    expect(component.filteredNarrations.length).toBe(2); // All narrations should be visible again
    expect(component.originalNarration).toBeNull();
    expect(component.isNarrationFromLov).toBe(false);
  });
  it('should call updatePaymentModeFields with the selected payment mode', () => {
    const updatePaymentModeFieldsSpy = jest.spyOn(component, 'updatePaymentModeFields');
    component.onPaymentModeSelected();
    
    expect(updatePaymentModeFieldsSpy).toHaveBeenCalled();
  });

    // it('should update the form and hide/show modal based on CASH payment mode', () => {
    //   const chequeTypeModalMock = { hide: jest.fn(), show: jest.fn() };
    //   jest.spyOn(document, 'getElementById').mockReturnValue({ id: 'chequeTypeModal' });
    //   jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(chequeTypeModalMock);

    //   component.receiptingDetailsForm.patchValue({ paymentMode: 'CASH' });
    //   component.updatePaymentModeFields('CASH');

    //   expect(component.receiptingDetailsForm.get('drawersBank')?.value).toBe('N/A');
    //   expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('');
    //   expect(component.receiptingDetailsForm.get('drawersBank')?.disabled).toBeTruthy();
    //   expect(chequeTypeModalMock.hide).toHaveBeenCalled();
    // });
    it('should show alert if chequeTypes is null', () => {
      jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mocking alert
      component.chequeTypes = null;
      
      component.onCancelChequModal([]);

      expect(window.alert).toHaveBeenCalledWith('please select cheque type');
    });
    
    it('should hide the modal if chequeTypes is not null', () => {
      const ChequeTypeModalMock = { hide: jest.fn() };
      jest.spyOn(bootstrap, 'Modal').mockReturnValue(ChequeTypeModalMock);
      component.chequeTypes = ['Cheque 1', 'Cheque 2'];

      component.onCancelChequModal([]);

      expect(ChequeTypeModalMock.hide).toHaveBeenCalled();
    });
  
    it('should hide the cheque type modal when a cheque type is selected', () => {
      const chequeTypeModalMock = { hide: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue({
        id: 'chequeTypeModal',
        // Mock HTMLElement methods
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLElement);
  
      jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(chequeTypeModalMock as unknown as Modal);
  
      component.onChequeTypeSelected();
  
      expect(chequeTypeModalMock.hide).toHaveBeenCalled();
    });

    it('should reset fields for other payment modes', () => {
      const chequeTypeModalMock = { hide: jest.fn(), show: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue({
        id: 'chequeTypeModal',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLElement);
  
      jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(chequeTypeModalMock as unknown as Modal);
  
      component.receiptingDetailsForm.patchValue({ paymentMode: 'OTHER' });
      component.updatePaymentModeFields('OTHER');
  
      expect(component.receiptingDetailsForm.get('drawersBank')?.enabled).toBeTruthy();
      expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('');
      expect(chequeTypeModalMock.hide).toHaveBeenCalled();
    });

    it('should update the form and show modal based on CHEQUE payment mode', () => {
      const chequeTypeModalMock = { hide: jest.fn(), show: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue({
        id: 'chequeTypeModal',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLElement);
  
      jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(chequeTypeModalMock as unknown as Modal);
  
      component.receiptingDetailsForm.patchValue({ paymentMode: 'CHEQUE' });
      component.updatePaymentModeFields('CHEQUE');
  
      expect(component.receiptingDetailsForm.get('drawersBank')?.enabled).toBeTruthy();
      expect(component.receiptingDetailsForm.get('chequeType')?.enabled).toBeTruthy();
      expect(chequeTypeModalMock.show).toHaveBeenCalled();
    });

    it('should handle CASH payment mode correctly', () => {
      component.receiptingDetailsForm.patchValue({ paymentMode: 'CASH' });
      component.updatePaymentModeFields('CASH');
  
      expect(component.receiptingDetailsForm.get('drawersBank')?.value).toBe('N/A');
      expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('');
      expect(component.receiptingDetailsForm.get('drawersBank')?.enabled).toBeFalsy();
      expect(chequeTypeModalMock.hide).toHaveBeenCalled();
    });
    it('should handle onFileSelected with no files', () => {
      const event = { target: { files: null } } as any; //Simulate null files
      const openModalSpy = jest.spyOn(component, 'openModal'); //Spy on openModal
    
      component.onFileSelected(event);
    
      expect(component.fileDescriptions.length).toBe(0);
      expect(openModalSpy).not.toHaveBeenCalled(); // Assert that openModal wasn't called
    });
    
    
    it('should handle onFileSelected with valid files', async () => {
      // ... your file setup ...
      component.onFileSelected(event);
      fixture.detectChanges(); // Manually trigger change detection
  
      // Add a small delay (use only as a last resort!)
      await new Promise(resolve => setTimeout(resolve, 100)); 
  
      const modalElement = document.getElementById('fileDescriptionModal');
      expect(modalElement).toBeTruthy(); //Check if element exists. If not, the problem is elsewhere
  
      component.openModal(0);
  
      // ... your assertions ...
  });
  it('should update form value and log description', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    component.saveFileDescription();
    expect(component.receiptingDetailsForm.get('description')?.value).toBe('description');
    expect(consoleSpy).toHaveBeenCalledWith('description');
  });
  it('should not throw error if modal does not exist', () => {
    // Ensure no modal element exists
    const existingModal = document.getElementById('fileDescriptionModal');
    if (existingModal && existingModal.parentNode) {
      document.body.removeChild(existingModal);
    }
  
    expect(() => {
      component.closeFileModal();
    }).not.toThrow();
  });
  

    it('should handle onBank successfully', () => {
      const mockReceiptingPoints = [
        {
          id: 1,
          name: 'Point A', // Use `string`, not `String`
          autoManual: 'Auto',
          printerName: null,
          userRestricted: 'No',
        },
      ];
      
      mockReceiptService.getReceiptingPoints.mockReturnValueOnce(
        of({ data: mockReceiptingPoints }) // This will now align with `Observable<{ data: ReceiptingPointsDTO[] }>`
      );
      
    
      // Create a mock event with proper typing for compatibility
      const event = {
        target: { value: 'Bank Name' },
      } as unknown as Event;
    
      // Spy on methods
      jest.spyOn(component.receiptingDetailsForm.get('receiptingPoint')!, 'setValue');
      jest.spyOn(component, 'fetchReceiptNumber'); // Spy on fetchReceiptNumber
    
      // Call the method
      component.onBank(event);
    
      // Assertions
      expect(mockReceiptService.getReceiptingPoints).toHaveBeenCalledWith(1);
      expect(component.receiptingDetailsForm.get('receiptingPoint')?.setValue).toHaveBeenCalledWith('Point A');
      expect(component.currentReceiptingPoint).toEqual(mockReceiptingPoints[0]);
      expect(component.fetchReceiptNumber).toHaveBeenCalled();
    });
    it('should display error message when no receipting points are found', () => {
      // Arrange: mock the service return value and ensure the error messaging service is mocked
      mockReceiptService.getReceiptingPoints = jest.fn().mockReturnValue(of({ data: [] }));
      mockGlobalMessagingService.displayErrorMessage = jest.fn(); // Mock the displayErrorMessage function
      
      // Act: trigger the onBank method
      const event = { target: { value: 'TestBank' } } as unknown as Event;
      component.onBank(event);
      
      // Assert: check if the error message was displayed
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'No receipting point data found.');
    });

    it('should populate form with charge details and set flags when editCharge is called', () => {
      const mockCharge = {
        id: 1,
        receiptChargeId: 101,
        receiptNO:3,
        amount: 100,
        receiptChargeName: 'Charge 1',
      };
    
      // Mock the chargeList with the mockCharge at index 0
      component.chargeList = [mockCharge];
    
      // Call the editCharge method with index 0
      component.editCharge(0);
    
      // Assert that the editReceiptExpenseId and receiptChargeId are correctly set
      expect(component.editReceiptExpenseId).toBe(mockCharge.id);
      expect(component.receiptChargeId).toBe(mockCharge.receiptChargeId);
    
      // Assert that the form controls are populated with the charge details
      expect(component.receiptingDetailsForm.get('selectedChargeType')?.value).toBe(mockCharge.receiptChargeName);
      expect(component.receiptingDetailsForm.get('chargeAmount')?.value).toBe(mockCharge.amount);
    
      // Assert that the flags are correctly set
      expect(component.isSubmitButtonVisible).toBeTruthy();  // Use toBeTruthy() instead of toBeTrue()
      expect(component.isSaveBtnActive).toBeFalsy();        // Use toBeFalsy() instead of toBeFalse()
    });
    
    it('should fetch existing charges successfully', () => {
      const mockCharges: ExistingChargesResponseDTO[] = [
        { id: 1, receiptChargeId: 101, amount: 100, receiptNO: 1001, receiptChargeName: 'Charge 1' },
        { id: 2, receiptChargeId: 102, amount: 200, receiptNO: 1002, receiptChargeName: 'Charge 2' }
      ];
      const mockResponse = { data: mockCharges };
      
      // Mock the service call
      mockReceiptService.getExistingCharges = jest.fn().mockReturnValue(of(mockResponse));
      
      // Call the method
      component.fetchExistingCharges();
      
      // Verify the service call
      expect(mockReceiptService.getExistingCharges).toHaveBeenCalledWith(147);
      
      // Verify that the chargeList is updated correctly
      expect(component.chargeList).toEqual(mockCharges);
    });
    it('should handle error during fetchClients', () => {
      // Mock the `getClients` method to throw an error
      jest.spyOn(mockReceiptService, 'getClients').mockReturnValue(
        throwError(() => ({ error: { error: 'Fetch clients failed' } }))
      );
    
      // Correctly structure the account type object to match AccountTypeDTO
      component.accountTypes = [
        {
          branchCode: 1,
          userCode: 1,
          code: 1,
          systemCode: 1,
          accCode: 1,
          name: 'Account Type 1',
          coaAccNumber: '12345',
          coaAccOrgCode: 1,
          coaBranchCode: 1,
          receiptBank: 1,
          chequeBank: 1,
          subClass: 'SubClass',
          active: 'Y',
          receiptAccount: 'Receipt Account',
          restrictGrossDebitRcpt: 'N',
          vatApplicable: 'N',
          rateApplicable: 0,
          actTypeShtDesc: 'Short Description',
          systemName: 'System Name',
        },
      ];
    
      // Populate the form
      component.receiptingDetailsForm.patchValue({
        accountType: 'Account Type 1',
        searchCriteria: 'clientName',
        searchQuery: 'Client 1',
      });
    
      // Call the method being tested
      component.onSearch();
    
      // Verify that the error message is displayed
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Fetch clients failed');
    });
    
  });