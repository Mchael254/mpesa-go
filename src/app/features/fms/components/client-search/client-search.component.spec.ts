import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ClientSearchComponent } from './client-search.component';
import { ReceiptDataService } from '../../services/receipt-data.service';

import {GlobalMessagingService} from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';

import {AuthService} from '../../../../shared/services/auth.service';
import {StaffService} from '../../../../features/entities/services/staff/staff.service';

import {OrganizationService } from '../../../../features/crm/services/organization.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AccountTypeDTO, BranchDTO, ClientsDTO, TransactionDTO } from '../../data/receipting-dto';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';

describe('ClientSearchComponent', () => {
  let component: ClientSearchComponent;
  let fixture: ComponentFixture<ClientSearchComponent>;
  let mockReceiptDataService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockStaffService: any;
  let mockOrganizationService: any;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockReceiptDataService = {
      getReceiptData: jest.fn(),
      setTransactions: jest.fn(),
      setSelectedClient: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
    };
    mockReceiptService = {
      getReceiptData: jest.fn(),
      setReceiptData: jest.fn(), // ✅ Add this function
      getAccountTypes: jest.fn().mockReturnValue(of({ data: [] })), // ✅ Returns an Observable
      getClients: jest.fn(),
      
      getTransactions: jest.fn().mockReturnValue(of({ data: [{ transactionId: 1 }] })), // ✅ Add this mock
     
    };
    mockStaffService = {
      getStaffById: jest.fn()
    };
    mockOrganizationService = {
      getOrganization: jest.fn()
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ClientSearchComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule,TranslateModule.forRoot() ],
      providers: [
        FormBuilder,
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: StaffService, useValue: mockStaffService },
       

        { provide: OrganizationService, useValue: mockOrganizationService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientSearchComponent);
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

  it('should call fetchAccountTypes on ngOnInit', () => {
    jest.spyOn(component, 'fetchAccountTypes');
    component.ngOnInit();
    expect(component.fetchAccountTypes).toHaveBeenCalled();
  });

  it('should get account types with orgId', () => {
      const mockAccountTypes = [{
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
    const localStorageMock = window.localStorage;
    localStorageMock.getItem = jest.fn().mockReturnValue(JSON.stringify({ id: 1 } )); // return mock receipting point string

      mockReceiptService.getAccountTypes.mockReturnValue(of({data:mockAccountTypes}))
       component.ngOnInit()
        component.fetchAccountTypes()
      expect(mockReceiptService.getAccountTypes).toHaveBeenCalled();
  });

  it('should display an error message if getting account types returns an error', () => {
    const errorResponse = { error: { msg: 'Test error' } }; // ✅ Matches API response
  
    mockReceiptService.getAccountTypes.mockReturnValue(throwError(() => errorResponse));
  
    component.fetchAccountTypes();
  
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Test error');
  });

  it('should enable search criteria and search query on onAccountTypeChange method called properly', () => {
    component.accountTypeArray = [{ name: 'AccountType1', systemCode: 20, accCode: 2,
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
         systemName: ''}] as AccountTypeDTO[];
    component.receiptingDetailsForm.patchValue({ accountType: 'AccountType1' });
    component.onAccountTypeChange();
    expect(component.receiptingDetailsForm.get('searchCriteria')?.enabled).toBe(true);
    expect(component.receiptingDetailsForm.get('searchQuery')?.enabled).toBe(true);
  });

  it('should display errror message if account type, search criteria and search query is empty', () => {
    component.receiptingDetailsForm.patchValue({ accountType: null, searchCriteria: null, searchQuery: null });
    component.onSearch();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Please provide all the required fields');
  });

  it('should display an error message if invalid search criteria is selected', () => {
    component.receiptingDetailsForm.patchValue({
      accountType: 'someAccountType', // ✅ Ensure this is set
      searchCriteria: 'invalid', // Invalid criteria
      searchQuery: 'someQuery' // ✅ Ensure this is set
    });
  
    component.onSearch();
  
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Invalid search criteria selected');
  });
  
  it('should  call  fetchClients with correct parameters if the form is valid', () => {
    // Set valid form values
    component.receiptingDetailsForm.setValue({
        allocationType: 'test1',
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
   it('should fetch Transactions is called with required values', () => {
    const mockselectedClient = { systemShortDesc: 'TEST', code: 123, accountCode: 456, receiptType: 'Test', shortDesc:"asd" } as any;
      component.selectedClient = mockselectedClient
      mockReceiptService.getTransactions.mockReturnValue(of({data:[]}))
    component.fetchTransactions('test', 123,456, 'abc', 'asd')
       expect(mockReceiptService.getTransactions).toHaveBeenCalled()
   });
    it('should call setTransactions, setReceiptData methods  and navigate to client-allocation if response is greater than 0 and valid', () => {
     const mockTransactions:any = [{
        amount: 1000,
        tran_No:123
     }]
      const mockselectedClient = { systemShortDesc: 'TEST', code: 123, accountCode: 456, receiptType: 'Test', shortDesc:"123" } as any;
      component.selectedClient = mockselectedClient
      component.receiptingDetailsForm.setValue({
         allocationType: 'test1',
        accountType: 'AccountType1',
          searchCriteria: 'clientName',
          searchQuery: 'John Doe',
      allocatedAmount: [],
      })
      mockReceiptService.getTransactions.mockReturnValue(of({data:mockTransactions}))
       component.fetchTransactions('test', 123,456, 'abc', 'asd')
         expect(mockReceiptDataService.setTransactions).toHaveBeenCalled()
  });
  it('should display a warning message if no transactions are retrieved', () => {
    mockReceiptService.getTransactions.mockReturnValue(of({ data: [] })); // ✅ Matches the API response for no transactions
  
    component.fetchTransactions('test', 123, 456, 'abc', 'asd');
  
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error:', 'No transactions found!');
  });
  
  it('should call  back method', () => {
        component.onBack();
         expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/screen1'])
  });
  it('should call next method', () => {
    component.onNext();
    
    // ✅ Check if setReceiptData was called
    expect(mockReceiptDataService.setReceiptData).toHaveBeenCalledWith(component.receiptingDetailsForm.value);
  
    // ✅ Check if navigation happened
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-allocation']);
  });
  
  
  it('should call clickClient method', () => {
    const mockClients: ClientsDTO = {
      tableUsed: 'ClientTable',
      code: 1,
      accountCode: 1,
      shortDesc: 'test',
      name: 'TEST',
      acctNo: '',
      systemCode: 1,
      systemShortDesc: '',
      receiptType: '',
    };
  
    // ✅ Spy on fetchTransactions (optional, but ensures it's called)
    jest.spyOn(component, 'fetchTransactions');
  
    component.onClickClient(mockClients);
  
    // ✅ Check that client is selected
    expect(component.isClientSelected).toBe(true);
  
    // ✅ Check that fetchTransactions was called with the correct arguments
    expect(component.fetchTransactions).toHaveBeenCalledWith(
      mockClients.systemShortDesc,
      mockClients.code,
      mockClients.accountCode,
      mockClients.receiptType,
      mockClients.shortDesc
    );
  });
  
});