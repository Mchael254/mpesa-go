


import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';
import { Modal } from 'bootstrap';

import { ReceiptComponent } from './receipt.component';
import { SessionStorageService } from "../../../../shared/services/session-storage/session-storage.service";
import { ReceiptService } from '../../services/receipt.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ClientsDTO, CurrencyDTO, ExistingChargesResponseDTO, ManualExchangeRateResponseDTO, ReceiptingPointsDTO, TransactionDTO, NarrationDTO, PaymentModesDTO, BranchDTO, AccountTypeDTO, ChargesDTO ,ReceiptNumberDTO} from '../../data/receipting-dto';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserStorage } from '../../../../shared/services/storage';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import {OrganizationDTO} from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';

import {CurrencyService} from '../../../../shared/services/setups/currency/currency.service';
//import { debug } from 'console';
import { CurrencyRateDTO } from 'src/app/shared/data/common/currency-dto';
import {OrganizationService } from '../../../crm/services/organization.service'
import {AuthService} from '../../../../shared/services/auth.service';
import {StaffService} from '../../../../features/entities/services/staff/staff.service';
import {BankService} from '../../../../shared/services/setups/bank/bank.service';




describe('ReceiptComponent', () => {
  let component: ReceiptComponent;
  let fixture: ComponentFixture<ReceiptComponent>;
  let mockReceiptService: jest.Mocked<ReceiptService>;
  let mockSessionStorageService: jest.Mocked<SessionStorageService>;
  let mockGlobalMessagingService: jest.Mocked<GlobalMessagingService>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockStaffService: jest.Mocked<StaffService>;
  let mockOrganizationService: jest.Mocked<OrganizationService>;
  let mockBankService: jest.Mocked<BankService>;
  let mockCurrencyService: jest.Mocked<CurrencyService>

  let chequeTypeModalMock: { hide: jest.Mock; show: jest.Mock };
  let formBuilder: FormBuilder;
  let mockBrowserStorage: BrowserStorage;
  
  beforeEach(async () => {

    mockReceiptService = {
      getDrawersBanks: jest.fn().mockReturnValue(of([])),
      getNarrations: jest.fn().mockReturnValue(of({ data: [] as NarrationDTO[] })),
      getCurrencies: jest.fn().mockReturnValue(of({ data: [] as CurrencyDTO[] })),
       getReceiptNumber: jest.fn().mockReturnValue(of({receiptNumber:'123',branchReceiptNumber:123} as ReceiptNumberDTO)),
       getPaymentModes: jest.fn().mockReturnValue(of({data:[] as PaymentModesDTO[]})),
      getReceiptingPoints: jest.fn(() => of({ data: [] as ReceiptingPointsDTO[] })),
      getBanks: jest.fn().mockReturnValue(of({data:[] as BankDTO[]})),
      getManualExchangeRateParameter: jest.fn().mockReturnValue(of({ data: 'N' })),
      getExchangeRate: jest.fn().mockReturnValue(of({ data: '1.2' })),
      getExistingCharges: jest.fn().mockReturnValue(of({ data: [] as ExistingChargesResponseDTO[] })),
      postChargeManagement: jest.fn().mockReturnValue(of({})),
      getCharges: jest.fn().mockReturnValue(of({data:[] as ChargesDTO[]})),
      postManualExchangeRate: jest.fn().mockReturnValue(of({})),
      getAccountTypes: jest.fn().mockReturnValue(of({data:[] as AccountTypeDTO[]})),
      getClients: jest.fn().mockReturnValue(of({ data: [] as ClientsDTO[] })),
      getTransactions: jest.fn().mockReturnValue(of({ data: [] as TransactionDTO[] })),
      postAllocation: jest.fn().mockReturnValue(of({})),
      getAllocations:jest.fn().mockReturnValue(of({data:[]})),
      deleteAllocation:jest.fn().mockReturnValue(of({success:true})),
      saveReceipt:jest.fn().mockReturnValue(of({})),
      getParamStatus:jest.fn().mockReturnValue(of({data:'Y'})),
      getBranches:jest.fn().mockReturnValue(of({data:[] as BranchDTO[]}))
    } as unknown as jest.Mocked<ReceiptService>;
    //  // Set up mock selected client
    //  component.selectedClient = {
    //   systemCode: 2,
    //   clientNo: 'CLIENT001',
    //   name: 'Test Client',
    //   // Add other required client properties
    // };
    
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 123 } as unknown as StaffDto),
    } as unknown as jest.Mocked<AuthService>;
    mockStaffService = {
        getStaffById: jest.fn().mockReturnValue(of({} as StaffDto))
    }as unknown as jest.Mocked<StaffService>;
      mockOrganizationService = {
        getOrganization: jest.fn().mockReturnValue(of([] as OrganizationDTO[])),
    } as unknown as jest.Mocked<OrganizationService>;
    mockBankService = {
      getBanks: jest.fn().mockReturnValue(of([] as BankDTO[])),
  }as unknown as jest.Mocked<BankService>;
  mockCurrencyService = {
    getCurrencies: jest.fn().mockReturnValue(of([] as CurrencyDTO[])),
    getCurrenciesRate:jest.fn().mockReturnValue(of([] as CurrencyRateDTO[]))
}as unknown as jest.Mocked<CurrencyService>;


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
      clear: jest.fn(),
      set: jest.fn()
    } as unknown as jest.Mocked<SessionStorageService>;

    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage:jest.fn()
    } as unknown as jest.Mocked<GlobalMessagingService>;



    TestBed.configureTestingModule({
      declarations: [ReceiptComponent],
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MultiSelectModule,
        TableModule,
        DropdownModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: BrowserStorage, useClass: mockBrowserStorage },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: StaffService, useValue: mockStaffService },
        {provide:OrganizationService, useValue:mockOrganizationService},
        { provide: BankService, useValue: mockBankService },
        {provide:CurrencyService, useValue:mockCurrencyService}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ReceiptComponent);
    component = fixture.componentInstance;
     // Manually trigger ngOnInit
    component.ngOnInit();
  });


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
    it('should call all fetch methods on ngOnInit', () => {
        
      jest.spyOn(component, 'fetchCurrencies');
      jest.spyOn(component, 'captureReceiptForm');
      
      
      jest.spyOn(component, 'fetchNarrations');
      jest.spyOn(component, 'fetchOrganization');
      jest.spyOn(component, 'fetchUserDetails');
    
    
      component.ngOnInit();
    
      expect(component.captureReceiptForm).toHaveBeenCalled();
      expect(component.fetchCurrencies).toHaveBeenCalled();
      expect(component.fetchOrganization).toHaveBeenCalled();
      
      expect(component.fetchUserDetails).toHaveBeenCalled();
      expect(component.fetchNarrations).toHaveBeenCalled();
      
    });
   it('should initialize component properties on ngOnInit', () => {
        expect(component.users).toBeDefined();
        expect(component.organization).toEqual([]);
        expect(component.selectedOrganization).toBeNull();
        expect(component.GlobalUser).toBeDefined();
        expect(component.organizationId).toBeUndefined();
        expect(component.branches).toEqual([]);
        expect(component.drawersBanks).toEqual([]);
       
        expect(component.chargeTypes).toEqual([]);
        expect(component.editingIndex).toBeNull();
        expect(component.searchClients).toEqual([]);
        expect(component.selectedClient).toBeUndefined();
        expect(component.allocatedClients).toEqual([]);
        expect(component.isAccountTypeSelected).toBe(false);
        expect(component.transactions).toEqual([]);
        expect(component.searchQuery).toBe('');
         expect(component.canAddAllocation).toBe(false);
        expect(component.paymentModes).toEqual([]);
        expect(component.bankAccounts).toEqual([]);
        expect(component.selectedBankCode).toBeUndefined();
        expect(component.narrations).toEqual([]);
        expect(component.filteredNarrations).toEqual([]);
        expect(component.loading).toBe(false);
        expect(component.selectedCurrencySymbol).toBeUndefined();
        expect(component.selectedCurrencyCode).toBe(0);
        expect(component.currencyGlobal).toBeNull();
        expect(component.currencies).toEqual([]);
        expect(component.currencyRates).toEqual([]);
         expect(component.defaultCurrencyId).toBeNull();
        expect(component.receiptingPoints).toEqual([]);
        expect(component.receiptingPointId).toBeUndefined();
         expect(component.receiptingPointName).toBeUndefined();
        expect(component.globalReceiptNumber).toBeUndefined();
        expect(component.charges).toEqual([]);
        expect(component.accountTypes).toEqual([]);
        expect(component.clients).toEqual([]);
        //expect(component.receiptNumber).toBe('');
         expect(component.branchNo).toBeUndefined();
        expect(component.receiptChargeId).toBeUndefined();
        expect(component.chargeList).toBeUndefined();
         expect(component.getAllocation).toEqual([]);
        expect(component.editReceiptExpenseId).toBeNull();
          expect(component.countryId).toBe(1100);
           expect(component.originalNarration).toBeNull();
         expect(component.isNarrationFromLov).toBe(false);
         expect(component.orgCode).toBeUndefined();
         expect(component.currencySymbolGlobal).toBeUndefined();
         expect(component.exchangeRates).toBeUndefined();
         expect(component.exchangeRate).toBe(0);
        expect(component.rate).toBeUndefined();
         expect(component.uploadedFiles).toEqual([]);
        expect(component.currentReceiptingPoint).toBeUndefined();
        expect(component.manualExchangeRate).toBeUndefined();
         expect(component.allocation).toBe(true);
         expect(component.allocationsReturned).toBeUndefined();
         expect(component.totalAllocatedAmounts).toBe(0);
         expect(component.isSubmitButtonVisible).toBe(false);
         expect(component.selectedFile).toBeNull();
           expect(component.description).toBe('');
        expect(component.fileDescriptions).toEqual([]);
        expect(component.currentFileIndex).toBe(-1);
           expect(component.referenceNo).toBe('');
       expect(component.amount).toBe(0);
        expect(component.paymentMethod).toBe('');
        expect(component.policyNumber).toBe('');
        expect(component.status).toBe('Pending');
         expect(component.isSaveBtnActive).toBe(true);
        expect(component.username).toBe('frank');
         expect(component.isAllocationCompleted).toBe(false);
          expect(component.totalAllocatedAmount).toBe(0);
        expect(component.amountIssued).toBe(0);
        expect(component.parameterStatus).toBeUndefined();
          expect(component.currentReceiptNo).toBeUndefined();
         expect(component.orgId).toBeUndefined();
          expect(component.defaultOrgId).toBeUndefined();
         expect(component.defaultCountryId).toBeUndefined();
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
        const mockErrorResponse = { error: errorMessage };
        const mockError = new Error();
        mockError.message = errorMessage;
        mockReceiptService.getTransactions.mockReturnValueOnce(throwError(() => mockError));

        await component.fetchTransactions('System Short Desc', 123, 123, 'Manual', 'Test Client');

        expect(mockReceiptService.getTransactions).toHaveBeenCalledWith(
            'System Short Desc', 123, 123, 'Manual', 'Test Client'
        );
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', errorMessage);
    });


    it('should update selectedCurrencyCode and selectedCurrencySymbol', () => {
        component.currencies = [
            {
                decimalWord: 'U',
                currencyDefault: 'Y' || 'N',

                id: 1,
                name: 'USD',
                nameAndSymbol: 'USD',
                numberWord: 'OU',
                roundingOff: 0.5,
                symbol: 'U'
            },

        ];

        const mockEvent = { target: { value: '1' } } as unknown as Event;
        component.onCurrencyChanged(mockEvent);
        expect(component.selectedCurrencyCode).toBe(1);
        expect(component.selectedCurrencySymbol).toBe('U');
    });
    it('should  fetch currency rate if  currency code is selected', () => {
      jest.spyOn(component, 'fetchCurrencyRate');
  
      const mockEvent = { target: { value: '1' } } as unknown as Event;
      component.onCurrencyChanged(mockEvent);
      expect(component.fetchCurrencyRate).toHaveBeenCalled();
  
    });
    it('should show exchange rate modal if manual rate setup is not "N"', () => {
      jest.spyOn(component, 'showExchangeRateModal2');
      mockReceiptService.getManualExchangeRateParameter.mockReturnValue(
        of({ data: 'Y', msg: 'manual',
          success: true })
      );

      component.onCurrencyChanged({ target: { value: '1' } } as unknown as Event);

      expect(component.showExchangeRateModal2).toHaveBeenCalled();
  });
    // it('should fetch the currency and set the default currency', () => {
    //   const mockCurrencies = [{
    //     decimalWord: 'U',
    //     currencyDefault: 'Y',
    //     id: 1,
    //     name: 'USD',
    //     nameAndSymbol: 'USD',
    //     numberWord: 'OU',
    //     roundingOff: 0.5,
    //     symbol: 'U'
    //   },
    //   {
    //     decimalWord: 'U',
    //     currencyDefault: 'N' ,
    //     id: 2,
    //     name: 'KES',
    //     nameAndSymbol: 'KES',
    //     numberWord: 'OU',
    //     roundingOff: 0.5,
    //     symbol: 'KSH'
    //   }];
    //   mockCurrencyService.getCurrencies.mockReturnValue(of(mockCurrencies));
    //   component.fetchCurrencies();

    //   expect(component.currencies).toEqual(mockCurrencies);
    //   expect(component.defaultCurrencyId).toBe(1);
    //   expect(component.receiptingDetailsForm.get('currency')?.value).toBe(1);
    // });
    it('should do nothing if the modal does not exist', () => {
        document.body.innerHTML = '';
        const hideSpy = jest.fn();
        jest.spyOn(bootstrap.Modal, 'getInstance').mockReturnValue(null);

        component.closeModal2();

        expect(hideSpy).not.toHaveBeenCalled();
    });
   it('should display an error message if fetching manual rate parameter fails', () => {
        const error = { error: { error: 'Network Error' } };
        mockReceiptService.getManualExchangeRateParameter.mockReturnValue(throwError(error));

        component.onCurrencyChanged({ target: { value: '1' } } as unknown as Event);

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
            'Error',
            'Network Error'
        );
    });

    it('should fetch and assign exchange rates', () => {
        mockReceiptService.getExchangeRate.mockReturnValue(of({ data: '123.45',msg:'sucesss',success:true }));
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
        jest.spyOn(mockGlobalMessagingService,'displayErrorMessage');
        component.exchangeRate = 0;

        component.confirmExchangeRateValue();

       expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Validation Error', 'Please enter a valid exchange rate value greater than 0');
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
    component.manualExchangeRate = 123.45;
     component.exchangeRate = 123.45;
     jest.spyOn(component, 'closeModal2');
    mockReceiptService.postManualExchangeRate.mockReturnValue(
        of({ msg: 'Success', success: true, data: '' } as ManualExchangeRateResponseDTO)
    );
  
      component.confirmExchangeRateValue();
  
        expect(mockReceiptService.postManualExchangeRate).toHaveBeenCalledWith(
        component.selectedCurrencyCode,
            1,
        'FMSADMIN',
           123.45
       );
        expect(component.closeModal2).toHaveBeenCalled();
    });
    it('should  fetch the currency rates', () => {
       component.selectedCurrencyCode=1;
      mockCurrencyService.getCurrenciesRate.mockReturnValue(of([]));
      component.fetchCurrencyRate();
      expect(mockCurrencyService.getCurrenciesRate).toHaveBeenCalled();
    });
    it('should fetch default exchange rate if manual rate setup is "N"', () => {
        jest.spyOn(component, 'fetchDefaultExchangeRate');
        mockReceiptService.getManualExchangeRateParameter.mockReturnValue(
            of({ data: 'N', msg: 'Manual rate setup', success: true })
        );

        component.onCurrencyChanged({ target: { value: '1' } } as unknown as Event);

        expect(component.fetchDefaultExchangeRate).toHaveBeenCalled();
    });
    it('should call  success message when allocation is posted successfully', () => {
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

        mockReceiptService.postAllocation.mockReturnValue(of(mockResponse));
         component.allocation = true;
        component.allocateAndPostAllocations();
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
          'Success',
          'Allocations posted successfully'
      );
    });
     it('should call error message when allocation posting fails', () => {
        const mockPayload = {
            receiptParticulars: [
                { code: 1, description: 'Particular 1', amount: 100 },
                { code: 2, description: 'Particular 2', amount: 200 },
            ],
        };
        const mockError = {
            error: { error: 'Failed to post allocation' },
        };

        mockReceiptService.postAllocation.mockReturnValue(throwError(mockError));
        component.allocation = true;
         component.allocateAndPostAllocations();
       expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Failed to post allocations');

    });

    it('should call fetchClients with correct parameters if the form is valid', () => {
        // Set valid form values
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
            receiptingPoint: '1',
            charges:'no',
             chargeAmount: 100,
             selectedChargeType:'charge',
             description: 'desc',
            deductions: '',
             exchangeRate: 1,
              exchangeRates:'',
            manualExchangeRate: 1,
          capitalInjection: '',
          allocationType: '',
            accountType: 'AccountType1',
              searchCriteria: 'clientName',
              searchQuery: 'John Doe',
          allocatedAmount: [],

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
        expect(component.receiptingDetailsForm.get('narration')?.value).toBe('Narration 1');
        expect(component.filteredNarrations.length).toBe(1);
        expect(component.filteredNarrations[0].narration).toBe('Narration 2');
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
     component.receiptingDetailsForm.get('narration')?.patchValue('');
        component.onNarrationTextChange();
        expect(component.filteredNarrations.length).toBe(2);
        expect(component.originalNarration).toBeNull();
         expect(component.isNarrationFromLov).toBe(false);
    });
    it('should call updatePaymentModeFields with the selected payment mode', () => {
        const updatePaymentModeFieldsSpy = jest.spyOn(component, 'updatePaymentModeFields');
        component.onPaymentModeSelected();
        expect(updatePaymentModeFieldsSpy).toHaveBeenCalled();
    });
    it('should update the form and hide/show modal based on CASH payment mode', () => {
      const chequeTypeModalMock = { hide: jest.fn(), show: jest.fn() };
      jest.spyOn(document, 'getElementById').mockReturnValue({
        id: 'chequeTypeModal',
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      } as unknown as HTMLElement);
        jest.spyOn(Modal, 'getOrCreateInstance').mockReturnValue(chequeTypeModalMock as unknown as Modal);

        component.receiptingDetailsForm.patchValue({ paymentMode: 'CASH' });
        component.updatePaymentModeFields('CASH');
        expect(component.receiptingDetailsForm.get('drawersBank')?.value).toBe('N/A');
        expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('');
        expect(component.receiptingDetailsForm.get('drawersBank')?.disabled).toBeTruthy();
        expect(chequeTypeModalMock.hide).toHaveBeenCalled();
    });
    // ... (existing imports and setup remain the same)


    // it('should successfully submit receipt when form is valid', () => {
    //   // Arrange
    //   const mockResponse = {
    //     success: true,
    //     message: 'Receipt saved successfully'
    //   };
    //   mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));

    //   // Act
    //   component.submitReceipt();

    //   // Assert
    //   expect(mockReceiptService.saveReceipt).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       amountIssued: 1000,
    //       receivedFrom: 'John Doe'
    //       // ... other form values
    //     })
    //   );
    //   expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
    //     'Success',
    //     'Receipt saved successfully'
    //   );
    // });

    it('should not submit when form is invalid', () => {
      // Arrange
      component.receiptingDetailsForm.setErrors({ invalid: true });

      // Act
      component.submitReceipt();

      // Assert
      expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Please fill in all required fields correctly'
      );
    });

    it('should handle API error when submitting receipt', () => {
      // Arrange
      const mockError = {
        error: { message: 'Failed to save receipt' }
      };
      mockReceiptService.saveReceipt.mockReturnValue(throwError(() => mockError));

      // Act
      component.submitReceipt();

      // Assert
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Failed to save receipt'
      );
    });

    it('should validate amount is greater than zero', () => {
      // Arrange
      component.receiptingDetailsForm.patchValue({
        amountIssued: -100
      });

      // Act
      component.submitReceipt();

      // Assert
      expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      expect(component.receiptingDetailsForm.get('amountIssued')?.hasError('min')).toBeTruthy();
    });

    // it('should handle cheque payment mode submission', () => {
    //   // Arrange
    //   component.receiptingDetailsForm.patchValue({
    //     paymentMode: 'CHEQUE',
    //     chequeType: 'REGULAR',
    //     drawersBank: 'BANK001'
    //   });

    //   const mockResponse = {
    //     success: true,
    //     message: 'Receipt saved successfully'
    //   };
    //   mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));

    //   // Act
    //   component.submitReceipt();

    //   // Assert
    //   expect(mockReceiptService.saveReceipt).toHaveBeenCalledWith(
    //     expect.objectContaining({
    //       paymentMode: 'CHEQUE',
    //       chequeType: 'REGULAR',
    //       drawersBank: 'BANK001'
    //     })
    //   );
    // });

    it('should validate required fields for cheque payment', () => {
      // Arrange
      component.receiptingDetailsForm.patchValue({
        paymentMode: 'CHEQUE',
        chequeType: '', // Required for cheque payment
        drawersBank: '' // Required for cheque payment
      });

      // Act
      component.submitReceipt();

      // Assert
      expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Please fill in all required fields correctly'
      );
    });

    it('should reset form after successful submission', () => {
      // Arrange
      const mockResponse = {
        success: true,
        message: 'Receipt saved successfully'
      };
      mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));

      // Act
      component.submitReceipt();

      // Assert
      expect(component.receiptingDetailsForm.pristine).toBeTruthy();
      expect(component.receiptingDetailsForm.untouched).toBeTruthy();
    });

    it('should handle exchange rate validation for foreign currency', () => {
      // Arrange
      component.receiptingDetailsForm.patchValue({
        currency: 2, // Assuming 2 is a foreign currency
        exchangeRate: 0 // Invalid exchange rate
      });

      // Act
      component.submitReceipt();

      // Assert
      expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Please enter a valid exchange rate'
      );
    });
  

  // ... (existing test cases remain the same)
     it('should handle onBank successfully', () => {
            const mockReceiptingPoints = [
                {
                    id: 1,
                    name: 'Point A',
                    autoManual: 'Auto',
                    printerName: null,
                    userRestricted: 'No',
                },
            ];

            mockReceiptService.getReceiptingPoints.mockReturnValueOnce(
                of({ data: mockReceiptingPoints })
            );

            const event = {
                target: { value: 'Bank Name' },
            } as unknown as Event;

            jest.spyOn(component.receiptingDetailsForm.get('receiptingPoint')!, 'setValue');
            jest.spyOn(component, 'fetchReceiptNumber');
    //         component.onBank(event)
     })
  })
    