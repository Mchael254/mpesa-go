import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';

import { ReceiptCaptureComponent } from './receipt-capture.component';

import {AuthService} from '../../../../shared/services/auth.service';

import {StaffService} from '../../../../features/entities/services/staff/staff.service';

import {OrganizationService} from '../../../../features/crm/services/organization.service';
import { ReceiptService } from '../../services/receipt.service';

import {CurrencyService} from '../../../../shared/services/setups/currency/currency.service';

import {BankService} from '../../../../shared/services/setups/bank/bank.service';

import {GlobalMessagingService} from '../../../../shared/services/messaging/global-messaging.service';
import { FmsService } from '../../services/fms.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { Router } from '@angular/router';
import { Modal } from 'bootstrap';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';
import { OrganizationDTO } from '../../../crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';






import {
  BanksDTO,
  BranchDTO,
  ReceiptingPointsDTO,
  ReceiptNumberDTO,
} from '../../data/receipting-dto';

import {TranslateModule} from '@ngx-translate/core';
import {LocalStorageService} from '../../../../shared/services/local-storage/local-storage.service';
import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';

describe('ReceiptCaptureComponent', () => {
  let component: ReceiptCaptureComponent;
  let fixture: ComponentFixture<ReceiptCaptureComponent>;
  let mockStaffService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockOrganizationService: any;
  let mockBankService: any;
  let mockCurrencyService: any;
  let mockAuthService: any;
  let mockFmsService: any;
  let mockReceiptDataService: any;
  let mockRouter: any;
  let mockLocalStorageService:any;
  let mockSessionStorageService:any;

  beforeEach(async () => {
    mockStaffService = {};
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
      displayWarningMessage:jest.fn()
    };
    mockReceiptService = {
      
      getReceiptNumber: jest.fn().mockReturnValue(of([])),
      getNarrations: jest.fn().mockReturnValue(of([])),
      getCharges: jest.fn().mockReturnValue(of([])),
      getExistingCharges: jest.fn().mockReturnValue(of([])),
      getReceiptingPoints: jest.fn().mockReturnValue(of([])),
      postChargeManagement: jest.fn(),
      postManualExchangeRate:jest.fn()
    };
    mockOrganizationService = {};
    mockBankService = {
      
      getBanks: jest.fn().mockReturnValue(of([]))
    
    };
    mockCurrencyService = {
      getCurrencies: jest.fn().mockReturnValue(of([])),
      getCurrenciesRate: jest.fn(),
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };
    mockFmsService = {
      
      getPaymentMethods: jest.fn().mockReturnValue(of([])),
    };
    mockReceiptDataService = {
      getReceiptData: jest.fn(),
      setSelectedCurrency: jest.fn(),
      getSelectedCurrency: jest.fn(),
      setDefaultCurrency:jest.fn(),
      getSelectedBank: jest.fn(),
      setSelectedBank: jest.fn(),
      setReceiptData: jest.fn(),
      getGlobalAccountTypeSelected: jest.fn()
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockLocalStorageService={
      
      getItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ code: 1, name: 'Test user' }); // Or return null/undefined for testing default value
        }
        // Add other key-value pairs as needed for your tests
        return null; // Default return value for other keys
      }),
      setItem: jest.fn()
    }
    mockSessionStorageService={
      getItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ code: 1, name: 'Test user' }); // Or return null/undefined for testing default value
        }
        // Add other key-value pairs as needed for your tests
          if (key === 'selectedOrg') {
            return JSON.stringify({id:1,country:{id:1}}); // Or return null/undefined for testing default value
          }

         if (key === 'defaultOrg') {
          return JSON.stringify({id:1,country:{id:1}}); // Or return null/undefined for testing default value
        }
        return null; // Default return value for other keys
      }),
     
      setItem: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [ReceiptCaptureComponent],
      imports: [ReactiveFormsModule, RouterTestingModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: StaffService, useValue: mockStaffService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: BankService, useValue: mockBankService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FmsService, useValue: mockFmsService },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: Router, useValue: mockRouter },
        {provide: LocalStorageService, useValue:mockLocalStorageService},
        {provide:SessionStorageService, useValue:mockSessionStorageService}
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
     // Provide mock implementation for localStorage methods
     const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };

    // Assign it to the window object
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the receiptingDetailsForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.receiptingDetailsForm).toBeDefined();
  });
  it('should call getCurrentUser on ngOnInit', () => {
      component.ngOnInit();
       expect(mockAuthService.getCurrentUser).toHaveBeenCalled()
  });
    it('should call sessionStorage methods on ngOnInit', () => {
      mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({ id: 1 }));
       component.ngOnInit();
        expect(mockSessionStorageService.getItem).toHaveBeenCalled()
     });
       it('should call fetchDrawersBanks, fetchCurrencies, fetchPayments, fetchReceiptNumber, and fetchNarrations on ngOnInit', () => {
          mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({ id: 1 ,country:{id:1}}));
        component.ngOnInit();
     });

      it('should patch values from receiptDataService.getReceiptData() into the form', () => {
         const mockReceiptData = {
           amountIssued: 100,
            paymentMode: 'Cash',
           paymentRef: '12345',
           documentDate: '2024-01-01',
           receiptDate: '2024-01-02',
           charges: 'Some Charges',
            chargeAmount: 10,
            selectedChargeType: 'Type A',
             chequeType: 'Type B',
            bankAccount: 123,
           exchangeRate:1.2,
            manualExchangeRate:1.2,
           otherRef: 'Other Ref',
           drawersBank: 'Bank ABC',
           narration: 'Some Narration',
          receivedFrom: 'John Doe',
          grossReceiptAmount: 110,
          receiptingPoint: 'Point X',
         };

        mockReceiptDataService.getReceiptData.mockReturnValue(mockReceiptData);
         mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({ id: 1 ,country:{id:1}}));

          component.ngOnInit();
         fixture.detectChanges();

       });
    it('should restore form data from ReceiptDataService if available', () => {
      const mockFormData = { amountIssued: 100, receivedFrom: 'John Doe' };
      mockReceiptDataService.getReceiptData.mockReturnValue(mockFormData);

      component.restoreFormData();

      expect(component.receiptingDetailsForm.patchValue).toHaveBeenCalled;
    });
      // it('should fetch payment methods on ngOnInit', () => {
      //   const orgCode = 123;
      //   const mockPaymentModes: PaymentModesDTO[] = [{ id: 1, name: 'Cash' }];
      //   mockFmsService.getPaymentMethods.mockReturnValue(of({ data: mockPaymentModes }));

      //   component.fetchPayments(orgCode);

      //   expect(mockFmsService.getPaymentMethods).toHaveBeenCalledWith(orgCode);
      //   //expect(component.paymentModes).toEqual(mockPaymentModes);
      //  });
        it('should display an error message if fetching payment modes fails', () => {
        const orgCode = 123;
        const errorMessage = 'Failed to fetch payment modes';
         mockFmsService.getPaymentMethods.mockReturnValue(throwError(() => ({ error: { msg: errorMessage } })));

         component.fetchPayments(orgCode);
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('error', 'error fetching payments modes');
      });

  // it('should fetch currencies and set default currency on ngOnInit', () => {
  //   const mockCurrencies: CurrencyDTO[] = [
  //     { id: 1, name: 'KES', symbol: 'KSh', currencyDefault: 'Y' },
  //     { id: 2, name: 'USD', symbol: '$', currencyDefault: 'N' },
  //   ];
  //   mockCurrencyService.getCurrencies.mockReturnValue(of(mockCurrencies));

  //   component.fetchCurrencies();

  //   expect(mockCurrencyService.getCurrencies).toHaveBeenCalled();
  // });
    // it('should handle currency change event', () => {
    //       const mockCurrencies: CurrencyDTO[] = [
    //        { id: 1, name: 'KES', symbol: 'KSh', currencyDefault: 'Y' },
    //        { id: 2, name: 'USD', symbol: '$', currencyDefault: 'N' },
    //    ];
    //       const event = { target: { value: '2' } } as any;
    //     const currency= { id: 2, name: 'USD', symbol: '$', currencyDefault: 'N' }
    //      mockCurrencyService.getCurrencies.mockReturnValue(of(mockCurrencies));
    //      component.currencies=mockCurrencies
    //      mockReceiptDataService.getSelectedCurrency.mockReturnValue(of(1));

    //       component.fetchCurrencies()
    //      component.onCurrencyChanged(event)
    //      expect(component.selectedCurrencyCode).toBe(2);

    //    });

      it('should fetch currency rate successfully', () => {
        const mockRates = [{ targetCurrencyId: 2, rate: 120, withEffectToDate: new Date() }];
         mockCurrencyService.getCurrenciesRate.mockReturnValue(of(mockRates));
           mockReceiptDataService.getDefaultCurrency.mockReturnValue(1);
          component.defaultCurrencyId = 1;
          component.selectedCurrencyCode = 2;

          component.fetchCurrencyRate();
         expect(component.exchangeRate).toBe(120);

       });
       it('should confirm exchange rate value successfully', () => {
       component.receiptingDetailsForm.get('manualExchangeRate')?.setValue(1.2);
       component.selectedCurrencyCode = 1;
       component.exchangeRate=1.2;

       const mockResponse = {};
       mockReceiptService.postManualExchangeRate.mockReturnValue(of(mockResponse));
        component.confirmExchangeRateValue();
       expect(mockReceiptService.postManualExchangeRate).toHaveBeenCalled();

       });
       it('should display error message on invalid exchange rate value', () => {
        component.receiptingDetailsForm.get('manualExchangeRate')?.setValue(0);

        component.confirmExchangeRateValue();

         expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
               'Validation Error',
               'Please enter a valid exchange rate value greater than 0'
          );
        });
       it('should close modal successfully', () => {
        const modalElement = document.createElement('div');
        modalElement.id = 'exchangeRateModal2';
       document.body.appendChild(modalElement);
        component.closeModal2();
       });

   it('should format date correctly', () => {
      const date = new Date(2024, 0, 20); // January is 0 in JavaScript
      const formattedDate = component['formatDate'](date); // Access private method using bracket notation

       expect(formattedDate).toBe('2024-01-20');
    });
      //  it('should fetch drawers banks successfully', () => {
      //  const mockBanks: BankDTO[] = [{ id: 1, name: 'Bank A', code: 123 }];
      //   mockBankService.getBanks.mockReturnValue(of(mockBanks));

      //    component.fetchDrawersBanks(1);

      //   expect(mockBankService.getBanks).toHaveBeenCalledWith(1);
      //    expect(component.drawersBanks).toEqual(mockBanks);
      // });

       it('should handle hovering over payment mode', () => {
           const event = { target: { value: 'Cheque' } } as any;
        component.onHoverPaymentMode(event);

        expect(component.showChequeOptions).toBe(true);
       });
        it('should handle leaving payment mode', () => {
           component.receiptingDetailsForm.get('chequeType')?.setValue(null);
           component.onLeavePaymentMode();
       expect(component.showChequeOptions).toBe(false);
        });
        it('should set cheque type and hide cheque options', () => {
           component.setChequeType('open_cheque');
        expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('open_cheque');
         expect(component.showChequeOptions).toBe(false);
       });
       it('should handle payment mode selection and update fields', () => {
           const event = { target: { value: 'CASH' } } as any;
         component.receiptingDetailsForm.get('paymentMode')?.setValue('CASH');
           component.onPaymentModeSelected(event);
           expect(component.selectedPaymentMode).toBe('CASH');
      });
       it('should update payment mode fields for CASH', () => {
       component.receiptingDetailsForm.get('paymentMode')?.setValue('CASH');
          component.updatePaymentModeFields('CASH');
         expect(component.receiptingDetailsForm.get('drawersBank')?.disabled).toBe(true);
        });
        //  it('should fetch banks successfully', () => {
        //    const mockBanks: BanksDTO[] = [{ code: 1, name: 'Bank A', type: 'TypeA' }];
        //    mockReceiptService.getBanks.mockReturnValue(of({ data: mockBanks }));

        // component.fetchBanks(123, 456);

        // expect(mockReceiptService.getBanks).toHaveBeenCalledWith(123, 456);
        //  });
      // it('should fetch receipting points on bank selection', () => {
      //      const mockEvent = { target: { value: '123' } } as any;
      //      const mockReceiptingPoints: ReceiptingPointsDTO[] = [{ id: 1, name: 'Point A', autoManual: 'Auto' }];

      //      mockReceiptService
      //        .getReceiptingPoints(1, 'testUser')
      //        .mockReturnValue(of({ data: mockReceiptingPoints }));
      //      mockSessionStorageService.setItem.mockImplementation(() => {});

      //  component.defaultBranch={id:1} as any;
      //  component.loggedInUser= {code:'testUser'}
      //    component.onBank(mockEvent);

      //    expect(mockReceiptService.getReceiptingPoints).toHaveBeenCalledWith(1, 'testUser');
      //   });
       it('should fetch receipt number on bank selection', () => {
            const mockEvent = { target: { value: '123' } } as any;

        component.defaultBranch={id:1} as any;
         component.onBank(mockEvent);
         expect(mockReceiptService.getReceiptNumber).toHaveBeenCalled();
      });
      // it('should fetch receipt number successfully', () => {
      //      const mockResponse: ReceiptNumberDTO = { receiptNumber: 'REC001', branchReceiptNumber: 123 };
      //     mockReceiptService.getReceiptNumber.mockReturnValue(of(mockResponse));
      //       mockSessionStorageService.setItem.mockImplementation(() => {});
      //    component.fetchReceiptNumber(1, 2);
      //   expect(mockReceiptService.getReceiptNumber).toHaveBeenCalledWith(1, 2);
      //    expect(component.globalReceiptNo).toBe('REC001');
      //  });
      //  it('should fetch narrations successfully', () => {
      //      const mockNarrations = [{ id: 1, narration: 'Narration 1' }, { id: 2, narration: 'Narration 2' }];
      //      mockReceiptService.getNarrations.mockReturnValue(of({ data: mockNarrations }));

      //  component.fetchNarrations();
      //    expect(mockReceiptService.getNarrations).toHaveBeenCalled();
      //     expect(component.narrations).toEqual(mockNarrations);
      //  });

  // it('should handle narration dropdown change', () => {
  //   const event = { target: { value: 'Narration 1' } } as any;
  //   component.narrations = [{ id: 1, narration: 'Narration 1' }, { id: 2, narration: 'Narration 2' }];
  //   component.onNarrationDropdownChange(event);

  //   expect(component.receiptingDetailsForm.get('narration')?.value).toBe('Narration 1');
  //   expect(component.filteredNarrations).toEqual([{ id: 2, narration: 'Narration 2' }]);
  //   expect(component.isNarrationFromLov).toBe(true);
  // });
  it('should clearForm values and patch few values after the reset is done', () => {

    const mockExistingValues=  {
                currency: 'test1',
                     organization:'test2',
                selectedBranch:'test3',
                documentDate:'test4',
              receiptDate:'test5'
  
           } // To simulate this default must load the data to  a Mock that expect that will loaded if the attribute loads as we specified
  
              component.receiptingDetailsForm.patchValue({  //  So then if this method calls a method that loads as Mock value (and loads those specific and exclusive " "this mock data  and only  - very important exclusive - loads "those mocks/specs if method are well structured )
                     currency: 'test1',
                          organization:'test2',
                     selectedBranch:'test3',
                     documentDate:'test4',
                   receiptDate:'test5'
  
             });  // To Expect on mock a Form That we use here - 0 import or what -
  
                component.clearForm();
  
             //  expect(mockValueExistingServiceCalledMethodsInsideThisIfIsThere):" .toHaveBeenCalled is used also with mocked to have it work the methods. If patchValue must is be an service and has also his mock also there then its a services.mocks().test if service called with this method! - to avoid repeat it
              expect(component.receiptingDetailsForm.get('currency')?.value).toEqual('test1'); // It values - you said so " a non empty value but all will return an empty expect thetes!" So u get 1 what that return MUST Have after u call  those methods: "cleaf or reset + with not empty only THESETE beacs they call here on mock after is reset + apply THese mock to a attribute/callFunctions () in Test () and
     });
    it('should display correct message and not navigate if form is invalid', () => {

      component.validateForm();

      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
           'Warning:',
           'Please fill all required Fields marked with asterisk'
       );
       expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
      it('should navigate to the home page on onBack', () => {
       component.onBack();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/']);
     });
      it('should set receipt data and navigate to client search on onNext', () => {
      component.receiptingDetailsForm.setValue({

           selectedBranch: 'test1',
           organization: 'test2',
           amountIssued: 'test3',
           receiptingPoint: 'test4',
           receiptNumber: 'test5',
           ipfFinancier: 'test6',
           grossReceiptAmount: 'test7',
           receivedFrom: 'test8',
           drawersBank: 'test9',
           
           receiptDate: 'test10',
           narration: 'test11',
           paymentRef: 'test12',
           otherRef: 'test13',
           documentDate: 'test14',
           manualRef: 'test15',
          currency: 'test16',
           paymentMode: 'test17',
           chequeType: 'test18',
           bankAccount: 'test19',
           exchangeRate: 'test20',
           exchangeRates: 'test21',
           manualExchangeRate: 'test22',

          charges: 'test23',
           chargeAmount: 'test24',
          selectedChargeType: 'test25',

       });
        component.onNext();
         expect(mockReceiptDataService.setReceiptData).toHaveBeenCalledWith(component.receiptingDetailsForm.value);
         expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-search']);
    });
     it('should call fetchCharges', () => {
         const mockCharges = [{ id: 1, name: 'Charge 1', type: 'Test' }];
           mockReceiptService.getCharges.mockReturnValue(of({ data: mockCharges }));

       component.fetchCharges();

           expect(mockReceiptService.getCharges).toHaveBeenCalled();
    });
      it('should set the cheque type', () => {

           component.setChequeType('test');
         expect(component.receiptingDetailsForm.get('chequeType')?.value).toBe('test');
       });
       it('should set the payment mode', () => {

        // Setup. You don't need events, payment Mode to patch form

        //1) Given = SET what to EXEPT on form:
         component.receiptingDetailsForm.patchValue({ paymentMode: 'CASH' });
         const mockEvent = { target: { value: 'CASH' } } as any;

         // 2) Do  = Execute the call
        component.onPaymentModeSelected(mockEvent);

       // Expect that. This assertion must pass if form state for form attribute are  "well formed and filled":
       expect(component.selectedPaymentMode).toBe('CASH');

});
});

