import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { ClientSearchComponent } from './client-search.component';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { ClientsDTO, AccountTypeDTO } from '../../data/receipting-dto';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
jest.mock('../../data/fms-step.json', () => ({
  __esModule: true,
  default: { receiptingSteps: [] },
}));

describe('ClientSearchComponent', () => {
  let component: ClientSearchComponent;
  let fixture: ComponentFixture<ClientSearchComponent>;
  let mockReceiptDataService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockRouter: any;
  let mockSessionStorageService: any;

  beforeEach(async () => {
    // --- COMPLETE MOCK DEFINITIONS ---
    mockReceiptDataService = {
      getReceiptData: jest.fn().mockReturnValue({}), // Return empty object for form data
      setReceiptData: jest.fn(),
      setTransactions: jest.fn(),
      setSelectedClient: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
    };
    mockReceiptService = {
      getAccountTypes: jest.fn().mockReturnValue(of({ data: [] })),
      getClients: jest.fn().mockReturnValue(of({ data: [] })),
      getTransactions: jest.fn().mockReturnValue(of({ data: [] })),
      getAllocations: jest.fn().mockReturnValue(of({ data: [] })),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockSessionStorageService = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
    };
    const mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };
    const mockTranslateService = {
      instant: jest.fn((key) => key),
      get: jest.fn((key) => of(key)),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };

    await TestBed.configureTestingModule({
      declarations: [ClientSearchComponent],
      imports: [ReactiveFormsModule, TranslateModule.forRoot(),HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ClientSearchComponent);
    component = fixture.componentInstance;
    mockReceiptService = TestBed.inject(ReceiptService);
    mockGlobalMessagingService = TestBed.inject(GlobalMessagingService);
  });

  it('should create and initialize correctly', () => {
    fixture.detectChanges(); 
    expect(component).toBeTruthy();
    expect(component.receiptingDetailsForm).toBeDefined();
    expect(mockReceiptService.getAccountTypes).toHaveBeenCalled();
    expect(mockReceiptService.getAllocations).toHaveBeenCalled();
  });

  describe('Client Search Logic', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
    });

    it('should display an error if search is clicked with empty fields', () => {
        component.onSearch();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
            'Error',
            'Please provide all the required fields'
        );
    });
it('should call fetchClients with correct parameters when form is valid', () => {
    const mockAccountTypes: AccountTypeDTO[] = [{ 
        name: 'Test Type', 
        systemCode: 1, 
        accCode: 2,
        actTypeShtDesc: 'TT' 
    }] as any;
    component.accountTypeArray = mockAccountTypes; 
    component.accountTypes = mockAccountTypes;
    component.receiptingDetailsForm.patchValue({ accountType: 'Test Type' });
    component.onAccountTypeChange();
    component.receiptingDetailsForm.patchValue({
        searchCriteria: 'clientName',
        searchQuery: 'John Doe',
    });
    jest.spyOn(component, 'fetchClients');
    component.onSearch();
    expect(component.fetchClients).toHaveBeenCalledWith('CLIENT_NAME', 'John Doe');
});
it('should fetch clients successfully and update the clients array', () => {
    const mockClients: ClientsDTO[] = [{ code: 1, name: 'John Doe' }] as any;
    mockReceiptService.getClients.mockReturnValue(of({ data: mockClients }));
    const mockAccountTypes: AccountTypeDTO[] = [{ name: 'Test Type', systemCode: 1, accCode: 2 }] as any;
    component.accountTypes = mockAccountTypes;
    component.receiptingDetailsForm.patchValue({ accountType: 'Test Type' });
    component.fetchClients('CLIENT_NAME', 'John Doe');
    expect(mockReceiptService.getClients).toHaveBeenCalled();
    expect(component.clients).toEqual(mockClients);
    expect(component.totalRecords).toBe(1);
});
  });
  describe('getAllocations', () => {
    beforeEach(() => {
        fixture.detectChanges();
    });

    it('should set canShowNextBtn to true if allocations with premium amounts exist', () => {
        const mockAllocations = [{
            receiptParticularDetails: [{ premiumAmount: 100 }]
        }];
        mockReceiptService.getAllocations.mockReturnValue(of({ data: mockAllocations }));
        component.getAllocations();
        expect(mockReceiptService.getAllocations).toHaveBeenCalled();
        expect(component.canShowNextBtn).toBe(true);
    });

    it('should set canShowNextBtn to false if allocations have no premium amounts', () => {
        const mockAllocations = [{
            receiptParticularDetails: [{ premiumAmount: 0 }]
        }];
        mockReceiptService.getAllocations.mockReturnValue(of({ data: mockAllocations }));
        component.getAllocations();
        expect(component.canShowNextBtn).toBe(false);
    });

    it('should set canShowNextBtn to false if no allocations are returned', () => {
        mockReceiptService.getAllocations.mockReturnValue(of({ data: [] }));
        component.getAllocations();
        expect(component.canShowNextBtn).toBe(false);
    });
});
describe('onAccountTypeChange', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
        const mockAccountTypes: AccountTypeDTO[] = [{ 
            name: 'Test Type', 
            actTypeShtDesc: 'TT' 
        }] as any;
        component.accountTypeArray = mockAccountTypes;
    });

    it('should disable search fields if no account type is selected', () => {
        component.receiptingDetailsForm.patchValue({ accountType: '' }); 
        component.onAccountTypeChange();
        expect(component.isAccountTypeSelected).toBe(false);
        expect(component.receiptingDetailsForm.get('searchCriteria')?.disabled).toBe(true);
        expect(component.receiptingDetailsForm.get('searchQuery')?.disabled).toBe(true);
    });
it('should enable search fields and set short description when an account type is selected', () => {
        component.receiptingDetailsForm.patchValue({ accountType: 'Test Type' });
        component.onAccountTypeChange();
        expect(component.isAccountTypeSelected).toBe(true);
        expect(component.accountTypeShortDesc).toBe('TT');
        expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('accountTypeShortDesc', 'TT');
        expect(component.receiptingDetailsForm.get('searchCriteria')?.enabled).toBe(true);
        expect(component.receiptingDetailsForm.get('searchQuery')?.enabled).toBe(true);
    });
});
describe('onNextClick Async Validation', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
    });

    it('should display an error if no client is selected', fakeAsync(() => {
        component.selectedClient = null;
        component.onNextClick();
        tick(); 
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
            'Warning',
            'Please select a client before proceeding.'
        );
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
it('should fetch transactions and navigate if a client is selected and transactions are found', fakeAsync(() => {
    const mockClient = { systemShortDesc: 'SYS' } as any;
    const mockTransactions = [{ id: 1 }];
    component.selectedClient = mockClient;
    mockReceiptService.getTransactions.mockReturnValue(of({ data: mockTransactions }));
    jest.spyOn(component, 'onNext'); 
    component.onNextClick();
    tick(); 
    expect(mockReceiptDataService.setTransactions).toHaveBeenCalledWith(mockTransactions);
    expect(component.onNext).toHaveBeenCalled(); 
}));
it('should display an error and not navigate if no transactions are found', fakeAsync(() => {
    const mockClient = { systemShortDesc: 'SYS' } as any;
    component.selectedClient = mockClient;
    mockReceiptService.getTransactions.mockReturnValue(of({ data: [] })); 
    jest.spyOn(component, 'onNext');
    component.onNextClick();
    tick(); 
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'No Transactions',
        'No transactions were found for the selected client.'
    );
    expect(component.onNext).not.toHaveBeenCalled();
}));
it('should display an error and not navigate if a client is selected but no transactions are found', fakeAsync(() => {
        const mockClient = { systemShortDesc: 'SYS' } as any;
        component.selectedClient = mockClient;
        mockReceiptService.getTransactions.mockReturnValue(of({ data: [] })); 
        component.onNextClick();
        tick(); 
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
            'No Transactions',
            'No transactions were found for the selected client.'
        );
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
});
  describe('Client Selection and Transaction Fetching', () => {
    beforeEach(() => {
        fixture.detectChanges(); 
    });

    it('should set selectedClient and fetch transactions on onClickClient', () => {
        const mockClient: ClientsDTO = { systemShortDesc: 'SYS', code: 123 } as any;
        jest.spyOn(component, 'fetchTransactions'); 
component.onClickClient(mockClient);
 expect(component.isClientSelected).toBe(true);
        expect(component.selectedClient).toEqual(mockClient);
        expect(component.fetchTransactions).toHaveBeenCalledWith(
            mockClient.systemShortDesc,
            mockClient.code,
            mockClient.accountCode,
            mockClient.receiptType,
            mockClient.shortDesc
        );
    });

    it('should navigate to allocation screen if transactions are found', () => {
        const mockTransactions = [{ id: 1 }];
        mockReceiptService.getTransactions.mockReturnValue(of({ data: mockTransactions }));
component.fetchTransactions('SYS', 1, 1, 'T', 'D');
        expect(mockReceiptDataService.setTransactions).toHaveBeenCalledWith(mockTransactions);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-allocation']);
    });

    it('should display an error if no transactions are found', () => {
        mockReceiptService.getTransactions.mockReturnValue(of({ data: [] })); 
        component.fetchTransactions('SYS', 1, 1, 'T', 'D');

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
            'Error:',
            'No transactions found!'
        );
        expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate back to receipt-capture onBack', () => {
        fixture.detectChanges();
        component.onBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
    });
  });
});