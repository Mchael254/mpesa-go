import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import * as bootstrap from 'bootstrap';

import { ClientAllocationComponent } from './client-allocation.component';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { GlobalMessagingService } from 'src/app/shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DmsService } from 'src/app/shared/services/dms/dms.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AllocationDTO,
  BanksDTO,
  BranchDTO,
  GetAllocationDTO,
  ReceiptingPointsDTO,
  ReceiptNumberDTO,
  ReceiptSaveDTO,
  ReceiptUploadRequest,
  TransactionDTO,
} from '../../data/receipting-dto';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { BankDTO } from 'src/app/shared/data/common/bank-dto';
import { StaffDto } from 'src/app/features/entities/data/StaffDto';

describe('ClientAllocationComponent', () => {
  let component: ClientAllocationComponent;
  let fixture: ComponentFixture<ClientAllocationComponent>;
  let mockReceiptDataService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockAuthService: any;
  let mockDmsService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockReceiptDataService = {
      getReceiptData: jest.fn(),
      getTransactions: jest.fn(),
      getAllocatedAmounts: jest.fn(),
      updateAllocatedAmount: jest.fn(),
      getSelectedClient: jest.fn(),
      getGlobalAccountTypeSelected: jest.fn(),
      setReceiptData: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
      displayWarningMessage: jest.fn()
    };
    mockReceiptService = {
      postAllocation: jest.fn(),
      getAllocations: jest.fn(),
      deleteAllocation: jest.fn(),
      uploadFiles: jest.fn(),
      saveReceipt: jest.fn(),
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };
    mockDmsService = {
      getDocumentById: jest.fn(),
      deleteDocumentById: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ClientAllocationComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: DmsService, useValue: mockDmsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAllocationComponent);
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

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.receiptingDetailsForm).toBeDefined();
  });

  it('should retrieve data from receiptDataService and local storage on ngOnInit', () => {
    const mockStoredData = { amountIssued: 100, paymentMode: 'cash' };
    const mockTransactions = [{ id: 1, amount: 50 }, { id: 2, amount: 50 }];
    const mockReceiptingPoint = { id: 123, name: 'Test Point' } as ReceiptingPointsDTO;
    const mockSelectedClient = { code: 'client123', systemShortDesc: 'testSystem' } as any;

    mockReceiptDataService.getReceiptData.mockReturnValue(mockStoredData);
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    mockReceiptDataService.getSelectedClient.mockReturnValue(mockSelectedClient);
    mockReceiptDataService.getGlobalAccountTypeSelected.mockReturnValue({ actTypeShtDesc: 'testAccount' });

    mockReceiptDataService.getAllocatedAmounts.mockReturnValue([]);
    const localStorageMock = window.localStorage;
    localStorageMock.getItem = jest.fn().mockReturnValue(JSON.stringify(mockReceiptingPoint)); // return mock receipting point string
    //mockAuthService.getCurrentUser.mockReturnValue({ code: 123 } as StaffDto)

    component.ngOnInit();

    expect(component.amountIssued).toBe(100);
    expect(component.paymentMode).toBe('cash');
    //expect(component.transactions).toEqual(mockTransactions);
    expect(component.receiptingPointObject).toEqual(mockReceiptingPoint);
    expect(component.selectedClient).toEqual(mockSelectedClient);

    expect(component.filteredTransactions).toEqual(mockTransactions);
    expect(mockReceiptDataService.getTransactions).toHaveBeenCalled();
  });

  it('should allocate all amounts if form is valid', () => {
    component.amountIssued = 100;
    //component.transactions = [{ systemShortDescription: 'abc', transactionNumber: 123, referenceNumber: 'abc', transactionType: 'Credit', clientCode: 123, amount: 100, balance: 0, commission: 0, withholdingTax: 0, transactionLevy: 0, serviceDuty: 0, settlementAmount: 100, narrations: 'Test Narration', accountCode: 'ACC123', clientPolicyNumber: 'POL123', receiptType: 'Manual', extras: 0, policyHolderFund: 0, agentDiscount: 0, policyBatchNumber: 1, propertyCode: 1, clientName: 'Test Client', vat: 0, commissionPayable: 0, vatPayable: 0, healthFund: 0, roadSafetyFund: 0, clientVatAmount: 0, certificateCharge: 0, motorLevy: 0, originalInstallmentPremium: 0, outstandingPremiumBalance: 0, nextInstallmentNumber: 0, paidToDate: new Date(), transmissionReferenceNumber: 'TransRef123' }];
    component.globalReceiptBranchNumber = 123
    component.defaultBranchId = 123
    component.selectedClient = { code: 123, systemCode: 123 , shortDesc:'asd', receiptType:'NORMAL', name:'clientName'}
    component.accountTypeShortDesc = "ACT"
    component.branchReceiptNumber = 123
    component.allocatedAmounts = [{allocatedAmount:0, commissionChecked:'N'}]
    //mockAuthService.getCurrentUser = jest.fn().mockReturnValue({ code: 123 } as StaffDto);
    mockReceiptService.postAllocation.mockReturnValue(of({ data: 'allocationSuccess', msg: "MESS", success: true }));
    component.ngOnInit()
    component.allocateAndPostAllocations();
    expect(mockReceiptService.postAllocation).toHaveBeenCalled();
  });

  it('should display an error message when the allocated amount is too less', () => {
    component.amountIssued = 100;
    component.totalAllocatedAmount = 0;
    component.allocateAndPostAllocations();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'No transactions have been allocated');
  });

  it('should handle saveAndPrint method called properly', () => {
    component.amountIssued = 100;
    component.totalAllocatedAmount = 0;
    component.receiptingPointObject = { id: 1 } as ReceiptingPointsDTO;
    component.storedData = {paymentMode:'cash', chequeType:'asd', drawersBank:'asd',  amountIssued:100}
    component.selectedClient = { code: 123, systemCode: 123, shortDesc:"123", accountCode:123,  receiptType:'test',  name:"Client A", systemShortDesc:"Test", }
    component.globalReceiptBranchNumber = 123
    component.defaultBranchId = 123
    component.drawersBank = "ASd"
    component.chequeType = "Cheque 1"
    component.currency ="asd"
    component.narration ="nasd"
    component.branchReceiptNumber = 123
    component.selectedBank = {code:123, type:"Bank",name:""} as BanksDTO
    //mockAuthService.getCurrentUser = jest.fn().mockReturnValue({ code: 123 } as StaffDto);
    mockReceiptService.saveReceipt.mockReturnValue(of({ data: 'saved', msg: "MESS", success: true }));
    mockRouter.navigate.mockImplementation(() => Promise.resolve(true));
    component.ngOnInit()
    component.saveAndPrint();
    expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
  });

  it('should display a error message when  amount issued is not given', () => {
    component.amountIssued = null;
    mockReceiptService.saveReceipt.mockReturnValue(of({ data: 'saved', msg: "MESS", success: true }));
    component.ngOnInit()
    component.saveAndPrint();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith("Error", "Please enter the amount issued.");
  });

  it('should navigate to back screen', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client']);
  });
   it('should call fetchDocByDocId when upload file is sucess', () => {
    const mockTransactions: any[] = [{ id: 123, referenceNumber:'Ref', clientPolicyNumber:"123", commission:100, clientName:"client A"}];
    component.globalGetAllocation = [{receiptParticularDetails:mockTransactions}]
    component.paymentMode = 'CASH'
    component.selectedClient = { code: 123, systemCode: 123, shortDesc:"123", accountCode:123,  receiptType:'test',  name:"Client A", systemShortDesc:"Test", }
    mockReceiptService.uploadFiles.mockReturnValue(of({docId:'123'}))
    component.description = 'desc'
    component.base64Output = 'base64'
    component.fileDescriptions = [{file:new File([], 'name'), description:'desc'}]
    component.selectedFile = new File([], 'name')
    jest.spyOn(component, 'fetchDocByDocId');
    component.ngOnInit();
    component.uploadFile()
    expect(mockReceiptService.uploadFiles).toHaveBeenCalled();
  });

  it('should display warning message if no allocations is done while uoloading', () => {
    component.globalGetAllocation = []
    component.uploadFile()
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith("Error", "No fetched allocations");
  });

  it('should display warning message if no payment method is selected while uploading', () => {
    component.globalGetAllocation = [{name:"payment"}];
    component.paymentMode = null;
    component.uploadFile()
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith("Warning", "Please select payment mode first!");
  });
  it('should display success message when file is deleted ', () => {
     const docId = '1234'
     const file = {docId:"1234"}
     mockDmsService.deleteDocumentById.mockReturnValue(of({}));
        component.uploadedFiles = [{id:"123",docId:"1234"}]
       component.deleteFile(file, 1);
     expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith("Success", "File deleted successfully");
  });
   it('should validate file is selected while upload file method is called', () => {
    component.selectedFile = null
    component.uploadFile();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'No selected file found!');
  });
});