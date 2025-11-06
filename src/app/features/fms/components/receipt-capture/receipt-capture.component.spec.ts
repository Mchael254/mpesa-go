import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ReceiptCaptureComponent } from './receipt-capture.component';
import { AuthService } from '../../../../shared/services/auth.service';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { OrganizationService } from '../../../../features/crm/services/organization.service';
import { ReceiptService } from '../../services/receipt.service';
import { CurrencyService } from '../../../../shared/services/setups/currency/currency.service';
import { BankService } from '../../../../shared/services/setups/bank/bank.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { FmsService } from '../../services/fms.service';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { CurrencyDTO } from 'src/app/shared/data/common/currency-dto';

// --- Mocks ---
jest.mock('../../data/fms-step.json', () => ({
  __esModule: true,
  default: { receiptingSteps: [] },
}));

describe('ReceiptCaptureComponent', () => {
  let component: ReceiptCaptureComponent;
  let fixture: ComponentFixture<ReceiptCaptureComponent>;

  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockCurrencyService: any;
  let mockFmsService: any;
  let mockReceiptDataService: any;
  let mockRouter: any;
  let mockBankService: any;

  beforeEach(async () => {
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
      displayWarningMessage: jest.fn(),
    };
    mockReceiptService = {
      getReceiptNumber: jest
        .fn()
        .mockReturnValue(
          of({ receiptNumber: 'REC-001', branchReceiptNumber: 1 })
        ),
      getNarrations: jest.fn().mockReturnValue(of({ data: [] })),
      getCharges: jest.fn().mockReturnValue(of({ data: [] })),
      getExistingCharges: jest.fn().mockReturnValue(of({ data: [] })),
      getReceiptingPoints: jest
        .fn()
        .mockReturnValue(
          of({ data: [{ id: 1, name: 'Main Counter', autoManual: 'A' }] })
        ),
      postChargeManagement: jest.fn().mockReturnValue(of({})),
      postManualExchangeRate: jest.fn().mockReturnValue(of({})),
      getBanks: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockBankService = {
      getBanks: jest.fn().mockReturnValue(of([])),
    };
    mockCurrencyService = {
      getCurrencies: jest
        .fn()
        .mockReturnValue(
          of([{ id: 1, symbol: 'KES', currencyDefault: 'Y' } as CurrencyDTO])
        ),
      getCurrenciesRate: jest.fn().mockReturnValue(of([])),
    };
    mockFmsService = {
      getPaymentMethods: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockReceiptDataService = {
      getReceiptData: jest.fn().mockReturnValue(null),
      setSelectedCurrency: jest.fn(),
      getSelectedCurrency: jest.fn().mockReturnValue(null),
      setDefaultCurrency: jest.fn(),
      getDefaultCurrency: jest.fn().mockReturnValue(1),
      getSelectedBank: jest.fn().mockReturnValue(null),
      setSelectedBank: jest.fn(),
      setReceiptData: jest.fn(),
      getFormState: jest.fn().mockReturnValue(null),
      setFormState: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    const mockSessionStorageService = {
      getItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'user') {
          return JSON.stringify({ code: 1, name: 'Test user' });
        }
        if (key === 'selectedOrg' || key === 'defaultOrg') {
          return JSON.stringify({ id: 1, country: { id: 1 } });
        }
        if (key === 'defaultBranch') {
          return JSON.stringify({ id: 1 });
        }
        return null;
      }),
      setItem: jest.fn(),
    };
    const mockAuthService = {
      getCurrentUser: jest
        .fn()
        .mockReturnValue({ code: 'testUser', userName: 'FMSADMIN' }),
    };
    const mockTranslateService = {
      instant: jest.fn((key) => key),
      get: jest.fn((key) => of(key)),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };

    await TestBed.configureTestingModule({
      declarations: [ReceiptCaptureComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: StaffService, useValue: {} },
        {
          provide: GlobalMessagingService,
          useValue: mockGlobalMessagingService,
        },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: OrganizationService, useValue: {} },
        { provide: BankService, useValue: mockBankService },
        { provide: CurrencyService, useValue: mockCurrencyService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: FmsService, useValue: mockFmsService },
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptCaptureComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize correctly', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
    expect(component.receiptingDetailsForm).toBeDefined();
    expect(mockCurrencyService.getCurrencies).toHaveBeenCalled();
    expect(mockFmsService.getPaymentMethods).toHaveBeenCalled();
  });

  describe('Form Interaction and Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display an error if form is invalid onNextClick', () => {
      component.onNextClick();
      expect(
        mockGlobalMessagingService.displayErrorMessage
      ).toHaveBeenCalledWith(
        'Validation Error',
        'Please fill all required fields marked with an asterisk (*).'
      );
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should save state and navigate if form is valid onNextClick', () => {
      component.receiptingDetailsForm.patchValue({
        selectedBranch: 1,
        organization: 1,
        amountIssued: 100,
        receiptingPoint: 'Main',
        bankAccountType: 'Current',
        bankAccount: 123,
        receiptNumber: 'REC-001',
        receivedFrom: 'Test Customer',
        narration: 'Test payment',
        currency: 1,
        receiptDate: '2023-01-01',
        paymentMode: 'CASH',
      });

      component.onNextClick();
      expect(mockReceiptDataService.setFormState).toHaveBeenCalled();
      expect(mockReceiptDataService.setReceiptData).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith([
        '/home/fms/client-search',
      ]);
    });
  });

  describe('Payment Mode Logic', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should disable fields for CASH payment mode', () => {
      component.updatePaymentModeFields('CASH');
      expect(component.receiptingDetailsForm.get('drawersBank')?.disabled).toBe(
        true
      );
      expect(component.receiptingDetailsForm.get('paymentRef')?.disabled).toBe(
        true
      );
    });

    it('should enable fields for non-CASH payment modes', () => {
      component.updatePaymentModeFields('CHEQUE');
      expect(component.receiptingDetailsForm.get('drawersBank')?.enabled).toBe(
        true
      );
      expect(component.receiptingDetailsForm.get('paymentRef')?.enabled).toBe(
        true
      );
    });
  });

  describe('Currency and Exchange Rates', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should fetch currency rate when a non-default currency is selected', () => {
      const event = { target: { value: '2' } } as any;
      component.defaultCurrencyId = 1; // Assume default is 1
      component.currencies = [
        { id: 1, symbol: 'KES', currencyDefault: 'Y' },
        { id: 2, symbol: 'USD', currencyDefault: 'N' },
      ] as CurrencyDTO[];

      jest.spyOn(component, 'fetchCurrencyRate');
      component.onCurrencyChanged(event);

      expect(component.selectedCurrencyCode).toBe(2);
      expect(component.fetchCurrencyRate).toHaveBeenCalled();
    });
    it('should NOT fetch currency rate when the default currency is selected', () => {
      const event = { target: { value: '1' } } as any;
      component.defaultCurrencyId = 1;

      jest.spyOn(component, 'fetchCurrencyRate');
      component.onCurrencyChanged(event);

      expect(component.fetchCurrencyRate).not.toHaveBeenCalled();
    });
    it('should successfully post a manual exchange rate', () => {
      fixture.detectChanges();
      component.receiptingDetailsForm.patchValue({ manualExchangeRate: 120 });
      component.selectedCurrencyCode = 2;
      component.confirmExchangeRateValue();
      expect(mockReceiptService.postManualExchangeRate).toHaveBeenCalledWith(
        2,
        1,
        'FMSADMIN',
        120
      );
      expect(
        mockGlobalMessagingService.displaySuccessMessage
      ).toHaveBeenCalled();
    });
  });
  describe('Bank and Receipting Point Workflow', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.bankAccounts = [{ code: 123, type: 'SAVINGS' }] as any;
      component.loggedInUser = { code: 'testUser' };
      component.defaultBranch = { id: 1 } as any;
    });

    it('should do nothing if the "Select" option is chosen', () => {
      const event = { target: { value: '' } } as any; // Empty value for "Select"
      component.onBank(event);

      expect(component.selectedBankCode).toBeNull();
      expect(component.onBankSelected).toBe(false);
      // Ensure no further API calls were made
      expect(mockReceiptService.getReceiptingPoints).not.toHaveBeenCalled();
      expect(mockReceiptService.getReceiptNumber).not.toHaveBeenCalled();
    });

    it('should fetch receipting points and receipt number when a valid bank is selected', () => {
      const event = { target: { value: '123' } } as any; // Valid bank code
      component.onBank(event);

      expect(component.selectedBankCode).toBe(123);
      expect(component.onBankSelected).toBe(true);
      expect(
        component.receiptingDetailsForm.get('bankAccountType')?.value
      ).toBe('SAVINGS');

      // Verify that the chained API calls were triggered
      expect(mockReceiptService.getReceiptingPoints).toHaveBeenCalledWith(
        1,
        'testUser'
      );
      expect(mockReceiptService.getReceiptNumber).toHaveBeenCalledWith(
        1,
        'testUser'
      );
    });

    it('should patch the form with the fetched receipting point and receipt number', () => {
      const event = { target: { value: '123' } } as any;
      component.onBank(event);
      expect(
        component.receiptingDetailsForm.get('receiptingPoint')?.value
      ).toBe('Main Counter');
      expect(component.receiptingDetailsForm.get('receiptNumber')?.value).toBe(
        'REC-001'
      );
    });
  });

  describe('Narration Logic', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.narrations = [
        { narration: 'Narration A' },
        { narration: 'Narration B' },
      ] as any;
      component.filteredNarrations = [...component.narrations];
    });

    it('should populate the narration field and filter the list when a narration is selected from dropdown', () => {
      const event = { target: { value: 'Narration A' } } as any;
      component.onNarrationDropdownChange(event);
      expect(component.receiptingDetailsForm.get('narration')?.value).toBe(
        'Narration A'
      );
      expect(component.isNarrationFromLov).toBe(true);
      // Check that "Narration A" was removed from the filtered list
      expect(component.filteredNarrations.length).toBe(1);
      expect(component.filteredNarrations[0].narration).toBe('Narration B');
    });

    it('should restore the filtered list when narration text is cleared', () => {
      // First, select a narration to set the state
      component.originalNarration = 'Narration A';
      component.isNarrationFromLov = true;
      component.filteredNarrations = [{ narration: 'Narration B' }] as any;
      // Now, simulate the user clearing the text field
      component.receiptingDetailsForm.patchValue({ narration: '' });
      component.onNarrationTextChange();
      expect(component.filteredNarrations).toEqual(component.narrations);
      expect(component.originalNarration).toBeNull();
      expect(component.isNarrationFromLov).toBe(false);
    });
  });
  describe('Navigation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to the home page on onBack()', () => {
      component.onBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/']);
    });

    it('should clear the form when clearForm() is called', () => {
      component.receiptingDetailsForm.patchValue({
        amountIssued: 100,
        receivedFrom: 'Test Customer',
        // Preserve some fields
        currency: 'KES',
        organization: 'Org A',
      });
      jest.spyOn(component.receiptingDetailsForm, 'reset');
      component.clearForm();
      expect(component.receiptingDetailsForm.reset).toHaveBeenCalled();
      // Check that the preserved fields were patched back
      expect(component.receiptingDetailsForm.get('currency')?.value).toBe(
        'KES'
      );
      expect(component.receiptingDetailsForm.get('organization')?.value).toBe(
        'Org A'
      );
    });
  });
  describe('Charges Logic', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should fetch existing charges and show modal when charges are enabled', fakeAsync(() => {
      const modalEl = document.createElement('div');
      modalEl.id = 'chargesModal';
      document.body.appendChild(modalEl);
      component.onChargesChange('yes');
      tick(1000);
      expect(component.chargesEnabled).toBe(true);
      expect(mockReceiptService.getCharges).toHaveBeenCalled();
      expect(mockReceiptService.getExistingCharges).toHaveBeenCalled();
      document.body.removeChild(modalEl);
    }));
    it('should call postChargeManagement with "A" when saving a new charge', () => {
      component.receiptingDetailsForm.patchValue({
        selectedChargeType: 'Admin Fee',
        chargeAmount: 50,
      });
      component.charges = [{ id: 1, name: 'Admin Fee' }] as any;
      component.saveCharges();
      expect(mockReceiptService.postChargeManagement).toHaveBeenCalledWith(
        (expect as any).objectContaining({ addEdit: 'A' })
      );
    });

    it('should call postChargeManagement with "D" when deleting a charge', () => {
      component.chargeList = [{ id: 123, receiptChargeId: 1 }] as any;
      component.deleteCharge(0);
      expect(mockReceiptService.postChargeManagement).toHaveBeenCalledWith(
        (expect as any).objectContaining({
          addEdit: 'D',
          receiptExpenseId: 123,
        })
      );
    });
  });
  describe('API Error Handling', () => {
    it('should display an error if fetching currencies fails', () => {
      mockCurrencyService.getCurrencies.mockReturnValue(
        throwError(() => ({ error: { msg: 'Currency service down' } }))
      );
      fixture.detectChanges();
      expect(
        mockGlobalMessagingService.displayErrorMessage
      ).toHaveBeenCalledWith('fms.errorMessage', 'Currency service down');
    });
  });
});
