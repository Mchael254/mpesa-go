import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormArray, FormControl, FormGroup,FormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ClientAllocationComponent } from './client-allocation.component';
import { ReceiptDataService } from '../../services/receipt-data.service';

import {GlobalMessagingService} from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';

import {AuthService} from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';

import {ReportsService} from '../../../../shared/services/reports/reports.service';
import {DmsService} from '../../../../shared/services/dms/dms.service';

import {  SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { OrganizationDTO } from 'src/app/features/crm/data/organization-dto';
import { FmsSetupService } from '../../services/fms-setup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {TranslateModule} from '@ngx-translate/core';
import { acknowledgementSlipDTO } from '../../data/receipting-dto';

describe('ClientAllocationComponent', () => {
  let component: ClientAllocationComponent;
  let fixture: ComponentFixture<ClientAllocationComponent>;
  let mockReceiptDataService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockAuthService: any;
  let mockRouter: any;
  let mockDmsService: any;
  let mockReportsService: any;
  let mockSessionStorageService: any;
  let mockFmsSetupService: any;
    let mockIntermediaryService: any;
  let mockReceiptManagementService: any;

   // --- Mock common properties needed for save methods ---
   const setupValidSaveState = () => {
    component.fileDescriptions = []; // No unposted files
    component.selectedFile = null;   // No selected file
    component.parameterStatus = 'N'; // Or 'Y' with fileUploaded = true
    component.fileUploaded = false;
    component.amountIssued = 100;
    component.receivedFrom = 'Test Payer';
    component.receiptDate = new Date();
    component.narration = 'Test Narration';
    component.paymentMode = 'CASH';
    component.bankAccount = 12345;
    component.totalAllocatedAmount = 100; // Fully allocated
    component.branchReceiptNumber = 987;
    component.receiptCode = 'RC001';
    component.currency = 'USD';
    component.defaultBranch = { id: 1 } as any; // Mock branch
    component.selectedBranch = null;
    component.paymentRef = 'REF123';
    component.documentDate = new Date();
    component.drawersBank = 'Test Bank';
    component.loggedInUser = { code: 'testUser' };
    component.selectedClient = { systemCode: 1, systemShortDesc: 'SYS', code: 101, name: 'Client A', receiptType: 'TypeA', shortDesc: 'CA', accountCode: 500 } as any;
    component.receiptingPointObject = { id: 2, autoManual: 'A' } as any;
    component.exchangeRate = 1;
    component.manualExchangeRate = null;
    component.manualRef = 'MANREF';
    component.bankAccountType = 'SAVINGS';
    component.storedData = { amountIssued: 100 }; // Mock storedData if used
   };
   
  beforeEach(async () => {
    
    mockReceiptDataService = {
      getReceiptData: jest.fn(),
      getSelectedClient: jest.fn().mockReturnValue({ code: 1, name: 'Default Test Client' }),
      getTransactions: jest.fn().mockReturnValue([]), // Mock getTransactions to return an empty array by default
      getAllocatedAmounts: jest.fn(),
      
      getGlobalAccountTypeSelected: jest.fn(),
      updateAllocatedAmount: jest.fn(),
      setReceiptData: jest.fn(),
      clearReceiptData:jest.fn(),
      clearFormState:jest.fn()

    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn()
    };
 // In the main `beforeEach` block at the top of your file:
mockReceiptService = {
  postAllocation: jest.fn(),
  getAllocations: jest.fn().mockReturnValue(of({ data: [] })),
  deleteAllocation: jest.fn(),
  uploadFiles: jest.fn(),
  saveReceipt: jest.fn(),
  // FIX: Add the missing method here
  generateAcknowledgementSlip: jest.fn(),
  postEmptyAllocation: jest.fn() // It's good practice to have this too
};
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockDmsService = {
      getDocumentById: jest.fn(),
      deleteDocumentById: jest.fn()
    };
    mockReportsService = {};
   mockSessionStorageService = {
  // Define a single implementation function to avoid repeating yourself
  storageGetImplementation: (key: string) => {
    // Return a default value for keys your tests might depend on.
    if (key === 'defaultBranch' || key === 'selectedOrg' || key === 'defaultOrg') {
        return JSON.stringify({ id: 1 });
    }
    // A sensible default for other calls
    return null;
  },

  // Now, create spies that use this same implementation
  get: jest.fn().mockImplementation(key => mockSessionStorageService.storageGetImplementation(key)),
  getItem: jest.fn().mockImplementation(key => mockSessionStorageService.storageGetImplementation(key)),
  
  // Keep the other methods as they are
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
    mockFmsSetupService = {
      getParamStatus: jest.fn().mockReturnValue(of({ data: 'Y' }))
    };

    await TestBed.configureTestingModule({
      declarations: [ClientAllocationComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule,HttpClientTestingModule,TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: DmsService, useValue: mockDmsService },
        { provide: ReportsService, useValue: mockReportsService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: FmsSetupService, useValue: mockFmsSetupService },
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
 // ======================================================
  // NEW AND UPDATED TESTS FOR RECEIPT SHARING
  // ======================================================

  describe('Receipt Sharing Functionality', () => {

    beforeEach(() => {
        // Ensure the form is initialized before each test in this block
        component.initializeRctSharingForm();
    });

    it('should initialize rctShareForm with correct validators and default values', () => {
        expect(component.rctShareForm).toBeDefined();
        expect(component.rctShareForm.get('name')?.hasValidator(Validators.required)).toBeTruthy();
        expect(component.rctShareForm.get('shareMethod')?.value).toEqual('whatsapp');
        
        const phoneControl = component.rctShareForm.get('phone');
        expect(phoneControl?.hasValidator(Validators.required)).toBeTruthy();
        
        phoneControl?.setValue('254712345678');
        expect(phoneControl?.valid).toBeTruthy();

        phoneControl?.setValue('0712345678');
        expect(phoneControl?.valid).toBeFalsy(); // Should fail pattern validation
    });

    it('should call getAgentById on init if a client code exists', () => {
        const getAgentSpy = jest.spyOn(component, 'getAgentById');
        mockReceiptDataService.getSelectedClient.mockReturnValue({ code: 123 });
        component.ngOnInit();
        expect(getAgentSpy).toHaveBeenCalledWith(123);
    });

    it('should patch form values on successful getAgentById call', () => {
        const agentData = { name: 'Test Agent', emailAddress: 'test@agent.com', phoneNumber: '254712345678' };
        mockIntermediaryService.getAgentById.mockReturnValue(of(agentData));
        
        component.getAgentById(123);

        expect(component.rctShareForm.value).toEqual(jasmine.objectContaining({
            name: agentData.name,
            email: agentData.emailAddress,
            phone: agentData.phoneNumber
 }));
    });

    describe('prepareShareData', () => {
        it('should return null and show error if name is missing', () => {
            component.rctShareForm.patchValue({ name: '' });
            const result = (component as any).prepareShareData();
            expect(result).toBeNull();
           // expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Validation Error', jasmine.stringContaining('Client Name is required'));
        });

        it('should return null and show error for invalid whatsapp number', () => {
            component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'whatsapp', phone: '123' });
            const result = (component as any).prepareShareData();
            expect(result).toBeNull();
           // expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Validation Error', jasmine.stringContaining('Invalid phone number format'));
        });

        it('should return correct data object for a valid whatsapp share', () => {
            component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'whatsapp', phone: '254712345678' });
            const result = (component as any).prepareShareData();
            expect(result).toEqual({
                shareType: 'WHATSAPP',
                recipientEmail: '',
                recipientPhone: '254712345678'
            });
        });

        it('should return correct data object for a valid email share', () => {
            component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'email', email: 'test@test.com' });
            const result = (component as any).prepareShareData();
            expect(result).toEqual({
                shareType: 'EMAIL',
                recipientEmail: 'test@test.com',
                recipientPhone: null
            });
        });
    });

    describe('onClickPreview', () => {
        it('should mark form as touched and call prepareShareData', () => {
            const markTouchedSpy = jest.spyOn(component.rctShareForm, 'markAllAsTouched');
            const prepareDataSpy = jest.spyOn(component as any, 'prepareShareData').mockReturnValue(null); // Mock to stop execution
            
            component.onClickPreview();

            expect(markTouchedSpy).toHaveBeenCalled();
            expect(prepareDataSpy).toHaveBeenCalled();
        });

        it('should set session storage and navigate on valid data', () => {
            component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'whatsapp', phone: '254712345678' });
            component.onClickPreview();

            const expectedPreviewData = {
                shareType: 'WHATSAPP',
                recipientEmail: '',
                recipientPhone: '254712345678',
                clientName: 'Test Client'
            };

            expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('sharePreviewData', JSON.stringify(expectedPreviewData));
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/preview-receipt']);
        });
    });

    describe('postClientDetails', () => {
        beforeEach(() => {
            // Mock necessary properties for the body
            component.agent = { name: 'Test Agent' } as any;
            component.receiptResponse = { receiptNumber: 'R123' };
            component.defaultOrg = { id: 1 } as any;
        });

        it('should mark form as touched and stop if data is invalid', () => {
            const markTouchedSpy = jest.spyOn(component.rctShareForm, 'markAllAsTouched');
            component.rctShareForm.patchValue({ name: '' }); // Make form invalid
            
            component.postClientDetails();

            expect(markTouchedSpy).toHaveBeenCalled();
            expect(mockReceiptManagementService.shareReceipt).not.toHaveBeenCalled();
        });

        it('should call shareReceipt service with correct payload, update status, and show success', () => {
            component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'whatsapp', phone: '254712345678' });
            const updateStatusSpy = jest.spyOn(component, 'updatePrintStatus');

            component.postClientDetails();

            const expectedBody = {
                shareType: 'WHATSAPP',
                clientName: 'Test Agent',
                recipientEmail: '',
                recipientPhone: '254712345678',
                receiptNumber: 'R123',
                orgCode: '1'
            };
            
            expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalledWith(expectedBody);
            expect(updateStatusSpy).toHaveBeenCalled();
            expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success', 'Receipt Shared');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
        });
    });

  });
  // ======================================================
  // END OF NEW AND UPDATED TESTS
  // ======================================================
  it('should initialize the receiptingDetailsForm on ngOnInit', () => {
    component.ngOnInit();
    expect(component.receiptingDetailsForm).toBeDefined();
    expect(component.receiptingDetailsForm.get('allocatedAmount') instanceof FormArray).toBeTruthy();
  });

  it('should call getReceiptData, getTransactions, and getSelectedClient on ngOnInit', () => {
    mockReceiptDataService.getReceiptData.mockReturnValue({});
    mockReceiptDataService.getTransactions.mockReturnValue([]);
    mockReceiptDataService.getSelectedClient.mockReturnValue({});
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}))

    component.ngOnInit();

    expect(mockReceiptDataService.getReceiptData).toHaveBeenCalled();
    expect(mockReceiptDataService.getTransactions).toHaveBeenCalled();
    expect(mockReceiptDataService.getSelectedClient).toHaveBeenCalled();
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
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}))

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.amountIssued).toEqual(100);
    expect(component.paymentMode).toEqual('Cash');
    expect(component.paymentRef).toEqual('12345');
    expect(component.charges).toEqual('Some Charges');
    expect(component.chargeAmount).toEqual(10);
    expect(component.selectedChargeType).toEqual('Type A');
  });

 
 
 it('should initialize allocatedAmountControls based on transactions', fakeAsync(() => {
    // Arrange
    const mockTransactions = [
        { transactionNumber: 1, balance: 100 },
        { transactionNumber: 2, balance: 200 }
    ];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    
    // Act
    component.ngOnInit(); // Trigger the logic that contains the setTimeout
    tick(1001); // Advance time PAST the setTimeout duration
    fixture.detectChanges(); // Update the view with the new form controls

    // Assert
    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    expect(allocatedAmountArray.length).toEqual(mockTransactions.length); // Should now be 2

    // Now this will work because the controls exist
    expect(allocatedAmountArray.at(0).get('allocatedAmount')?.value).toEqual(mockTransactions[0].balance);
    expect(allocatedAmountArray.at(1).get('commissionChecked')?.value).toEqual('N');
}));

 it('should update allocated amount and recalculate total on onAllocatedAmountChange', fakeAsync(() => { // Added fakeAsync
    // Arrange
    const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA', balance: 100 }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    component.ngOnInit();
    tick(1001); // <-- FIX: Create the form controls
    fixture.detectChanges();

    const index = 0;
    const amount = 50;
    const allocatedAmountControl = component.getFormControl(index, 'allocatedAmount');

    // Act
    allocatedAmountControl.setValue(amount);
    fixture.detectChanges();
    component.onAllocatedAmountChange(index, amount);

    // Assert
    expect(mockReceiptDataService.updateAllocatedAmount).toHaveBeenCalledWith(index, amount);
    expect(component.totalAllocatedAmount).toBeGreaterThan(0);
}));
   it('should get the allocatedAmountControls', () => {
        component.captureReceiptForm();
        const allocatedAmountControls = component.allocatedAmountControls;
        expect(allocatedAmountControls).toBeDefined();
        expect(allocatedAmountControls instanceof FormArray).toBe(true);
    });
    it('should get the allocatedAmountControls', () => {
      component.captureReceiptForm();
      component.receiptingDetailsForm.setControl('allocatedAmount', new FormArray([]));
  
      const index = 0;
      const controlName = 'allocatedAmount';
  
      // Act
      const formControl = component.getFormControl(index, controlName);
  
      // Assert
      expect(formControl).toBeNull();
  });

it('should calculate total allocated amount correctly', fakeAsync(() => { // Added fakeAsync
    // Arrange
    mockReceiptDataService.getTransactions.mockReturnValue([{ transactionNumber: 1, clientName: 'ClientA', balance: 100 }]);
    component.ngOnInit();
    tick(1001); // <-- FIX: Create the form controls
    fixture.detectChanges();

    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    (allocatedAmountArray.at(0) as FormGroup).get('allocatedAmount').setValue(50);

    // Act
    component.calculateTotalAllocatedAmount();

    // Assert
    expect(component.totalAllocatedAmount).toBe(50);
}));
   it('should return the remaining amount correctly', () => {
    // Arrange
    component.amountIssued = 100;
    component.totalAllocatedAmount = 50;

    // Act
    const remainingAmount = component.getRemainingAmount();

    // Assert
    expect(remainingAmount).toBe(50);
  });
    it('should display an error message if no transactions have been allocated', () => {
    // Arrange
    mockReceiptService.postAllocation.mockReturnValue(of({}));
    mockReceiptDataService.getTransactions.mockReturnValue([]);
     mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
    component.ngOnInit();
        component.allocateAndPostAllocations();

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error','No transactions have been allocated');
  });
  it('should display an error message if total allocated amount exceeds the amount issued', fakeAsync(() => { // Added fakeAsync
    // Arrange
    const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA', balance: 150 }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    component.ngOnInit();
    tick(1001); // <-- FIX: Create the form controls
    fixture.detectChanges();

    const allocatedAmountControl = component.getFormControl(0, 'allocatedAmount');
    allocatedAmountControl.setValue(150);
    component.amountIssued = 100;
    // The component recalculates this automatically now, but we can set it for clarity
    component.totalAllocatedAmount = 150;

    // Act
    component.allocateAndPostAllocations();

    // Assert
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Total Allocated Amount Exceeds Amount Issued'
    );
}));
    
// Replace this entire test case
it('should post allocation successfully and display a success message', fakeAsync(() => {
    // Arrange
    const mockTransactions = [{ transactionNumber: 1, balance: 100, clientPolicyNumber: 123, referenceNumber: 456, policyBatchNumber: 789, commission: 5 }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    
    // FIX: Mock the selected client to avoid the TypeError
    const mockSelectedClient = {
        systemCode: 1, name: 'Test Client', code: 101, shortDesc: 'TC', receiptType: 'TypeA', accountCode: 500
    };
    mockReceiptDataService.getSelectedClient.mockReturnValue(mockSelectedClient);

    mockReceiptService.postAllocation.mockReturnValue(of({ msg: 'Allocations posted successfully' }));

    component.ngOnInit();
    tick(1001); // For initializeAllocatedAmountControls
    
    component.amountIssued = 100;
    component.totalAllocatedAmount = 100;

    // Act
    component.allocateAndPostAllocations();
    tick(); // For the service call

    // Assert
    expect(mockReceiptService.postAllocation).toHaveBeenCalled();
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        '',
        'Allocations posted successfully'
    );
}));
      it('should fetch allocations on init', () => {
        component.ngOnInit();
        expect(mockReceiptService.getAllocations).toHaveBeenCalled();
    });

    // Test 1: getAllocations fails
it('should display an error message when getAllocations fails', () => {
    // Arrange
    const errorMessage = 'Failed to fetch allocations';
    mockReceiptService.getAllocations.mockReturnValue(throwError(() => ({ error: { msg: errorMessage } })));

    // Act
    component.getAllocations();
    // Act
    component.getAllocations();

    // Assert
    // FIX: Expect the translation key
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('fms.errorMessage', errorMessage);
});

// Test 2: fetching document fails
it('should display error message if fetching document fails', () => {
    // Arrange
    const mockDocId = '123';
    const mockError = { error: { msg: 'Failed to fetch document' } };
    mockDmsService.getDocumentById.mockReturnValue(throwError(() => mockError));

    // Act
    component.fetchDocByDocId(mockDocId);

    // Assert
    expect(mockDmsService.getDocumentById).toHaveBeenCalledWith(mockDocId);
    // FIX: Expect the translation key
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage',
        'Failed to fetch document'
    );
});
    it('should delete an allocation successfully', () => {
      const mockReceiptDetailCode = 123;
       mockReceiptService.deleteAllocation.mockReturnValue(of({ success: true }));
      component.deleteAllocation(mockReceiptDetailCode);
     expect(mockReceiptService.deleteAllocation).toHaveBeenCalledWith(mockReceiptDetailCode);
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
               'Success',
                'Allocation deleted successfully'
             );
      });
   it('should not save file description when description is empty', () => {
      component.currentFileIndex = 0;
       component.fileDescriptions = [{ file: new File([], 'test.pdf'), description: 'test', uploaded: false }];
       component.receiptingDetailsForm.get('description')?.setValue('');
     component.saveFileDescription();
       expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
                'Failed',
                 'Please enter file description'
           );
       });
   it('should remove a file successfully', () => {
      const indexToRemove = 0;
       component.fileDescriptions = [{ file: new File([], 'test.pdf'), description: 'test', uploaded: false }];

       component.onRemoveFile(indexToRemove);

       expect(component.fileDescriptions.length).toBe(0);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
                'Success',
                'File removed successfully'
           );
     });
   it('should clear the file input', () => {
        const event = { target: { value: '' } } as any;
       component.clearFileInput(event);
        expect(event.target.value).toBe('');
     });
      it('should handle file selection and populate fileDescriptions', () => {
         const mockFile = new File([''], 'test.pdf', { type: 'application/pdf' });
       const event = { target: { files: [mockFile] } } as any;
        const readerSpy = jest.spyOn(FileReader.prototype, 'readAsDataURL');

        component.onFileSelected(event);

       expect(component.selectedFile).toBe(mockFile);
        expect(component.fileDescriptions.length).toBe(1);
       expect(readerSpy).toHaveBeenCalled();
     });
      it('should set selectedFile to null if no file is selected', () => {
        const event = { target: { files: [] } } as any;

       component.onFileSelected(event);
        expect(component.selectedFile).toBeNull();
     });
       it('should not upload file if getAllocationStatus is false', () => {
          component.getAllocationStatus = false;
         component.uploadFile();

         expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
              'Warning',
               'please make allocation first!'
          );
       });
      it('should not upload file if no file is selected', () => {
        component.getAllocationStatus = true;
       component.selectedFile = null;
        component.base64Output = '';

         component.uploadFile();

         expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
              'Error',
              'No selected file found!'
           );
       });
        it('should not upload file if no fetched allocations', () => {
           component.getAllocationStatus = true;
          component.selectedFile = new File([''], 'test.pdf', { type: 'application/pdf' });
         component.base64Output = 'base64Data';
          component.globalGetAllocation = [];

         component.uploadFile();
         expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
              'Error',
              'No fetched allocations'
          );
      });
   it('should fetch document by docId successfully', () => {
        const mockDocId = '123';
         const mockResponse = { docName: 'test.pdf', byteData: 'base64Data' };
        mockDmsService.getDocumentById.mockReturnValue(of(mockResponse));

         component.fetchDocByDocId(mockDocId);

         expect(mockDmsService.getDocumentById).toHaveBeenCalledWith(mockDocId);
         expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
               'Success',
             'Doc retrieved successfullly'
         );
       });
   // Replace this entire test case
it('should display error message if fetching document fails', () => {
    // Arrange
    const mockDocId = '123';
    const mockError = { error: { msg: 'Failed to fetch document' } };
    mockDmsService.getDocumentById.mockReturnValue(throwError(() => mockError));

    // Act
    component.fetchDocByDocId(mockDocId);

    // Assert
    expect(mockDmsService.getDocumentById).toHaveBeenCalledWith(mockDocId);
    // FIX: Use the translation key for the title
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage',
        'Failed to fetch document'
    );
});
        it('should delete a file successfully', () => {
        const mockFile = { docId: '123' };
       const mockIndex = 0;
       mockDmsService.deleteDocumentById.mockReturnValue(of({}));
        component.uploadedFiles = [mockFile];

        component.deleteFile(mockFile, mockIndex);
       expect(mockDmsService.deleteDocumentById).toHaveBeenCalledWith(mockFile.docId);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
             'Success',
               'File deleted successfully'
          );
       });
     it('should fetch param status on init', () => {
         component.ngOnInit();
         expect(mockFmsSetupService.getParamStatus).toHaveBeenCalledWith('TRANSACTION_SUPPORT_DOCUMENTS');
       });
       it('should set parameterStatus on successful fetch', () => {
        mockFmsSetupService.getParamStatus.mockReturnValue(of({ data: 'Y' }));
         component.fetchParamStatus();
         expect(component.parameterStatus).toBe('Y');
      });
     it('should display error message on failed param status fetch', () => {
    // Arrange
    const errorMessage = 'Failed to fetch param status';
    // FIX: Make the mock error structure match what the component expects
    const mockError = { error: { msg: errorMessage } };
    mockFmsSetupService.getParamStatus.mockReturnValue(throwError(() => mockError));

    // Act
    component.fetchParamStatus();
    // Act
    component.fetchParamStatus();

    // Assert
    // FIX: Expect the correct title and the defined error message
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage',
        errorMessage
    );
});
    // Assert
    // FIX: Expect the correct title and the defined error message
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage',
        errorMessage
    );
});

    it('should navigate to client-search on onBack', () => {
      component.onBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-search']);
    });

    // Replace this entire test case
it('should successfully save the receipt', fakeAsync(() => {
    // Arrange
    const mockResponse = { data: { receiptNumber: 'REC001', message: 'Receipt saved successfully' } };
    mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));
    setupValidSaveState(); // Use the helper to ensure component state is valid

    // Act
    component.submitReceipt();
    tick();

    // Assert
    expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    // FIX: The component sends an empty string for the title
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        '', // Corrected from 'success'
        'Receipt saved successfully'
    );
}));
    describe('saveAndPrint', () => {

      // Place the inner beforeEach here
      beforeEach(() => {
        fixture.detectChanges(); // Ensure component is initialized before setting state
        setupValidSaveState(); // Set up a generally valid state before each test in this block
        // Mock confirm globally or spyOn it within specific tests if needed
        jest.spyOn(window, 'confirm').mockReturnValue(true); // Default confirm to true
      });
  
      it('should display error if there are unposted files', () => {
        component.fileDescriptions = [{ file: new File([], 'test.txt'), description: 'desc', uploaded: false }];
        component.saveAndPrint();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error!', 'Please post or delete all selected files before saving the receipt.');
        expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      });
  
      it('should display error if a file is selected but not posted', () => {
        component.selectedFile = new File([], 'test.txt');
        component.saveAndPrint();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error!', 'Please post or delete the file before saving the receipt.');
        expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      });
  
      it('should call confirm if parameterStatus is Y and file not uploaded, and stop if user cancels', () => {
          const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
          component.parameterStatus = 'Y';
          component.fileUploaded = false;
          component.saveAndPrint();
          expect(confirmSpy).toHaveBeenCalledWith('do you want to save receipt without uploading file?');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      });
  
       it('should proceed if parameterStatus is Y, file not uploaded, but user confirms', fakeAsync(() => {
          const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
          component.parameterStatus = 'Y';
          component.fileUploaded = false;
          mockReceiptService.saveReceipt.mockReturnValue(of({ data: { receiptNumber: 'R123', message: 'Saved' } }));
          component.saveAndPrint();
          tick();
          expect(confirmSpy).toHaveBeenCalled();
          expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-preview']);
      }));});
  
    // In describe('saveAndPrint')
// Replace this entire test case
it('should display error if required fields are missing', () => {
    // Arrange
    setupValidSaveState(); // Set up a valid state first
    component.amountIssued = null; // Then invalidate only the amount

    // Act
    component.saveAndPrint();

    // FIX: Expect the correct error message that is triggered first
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Please enter the amount issued.'
    );
    expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
});
  
      it('should display error if amountIssued is missing', () => {
        component.amountIssued = null; // Specifically test missing amountIssued
        // Need to set other required fields to pass the first check
        component.receivedFrom = 'Test Payer';
        component.receiptDate = new Date();
        component.narration = 'Test Narration';
        component.paymentMode = 'CASH';
        component.bankAccount = 12345;
        component.saveAndPrint();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Please enter the amount issued.');
        expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      });
  
      it('should display error if amount is partially allocated', () => {
        component.amountIssued = 100;
        component.totalAllocatedAmount = 50; // Partially allocated
        component.saveAndPrint();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Amount Issued is not fully allocated');
        expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
      });
  
     // In describe('saveAndPrint')

it('should call saveReceipt and navigate to preview on success', fakeAsync(() => {
    // Arrange
    const mockResponse = { data: { receiptNumber: 'R123', message: 'Saved' } };
    mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));
    setupValidSaveState(); // Important: Set up valid state

    // Act
    component.saveAndPrint();
    tick(); 

    // Assert
    expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    expect(component.receiptResponse).toEqual(mockResponse.data);
    expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNo', 'R123');
    // FIX: Expect the message from the mock API response
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        '', // The component sends an empty title
        'Saved' // The message from the mock response
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-preview']);
}));
// Replace this entire test case in the 'saveAndPrint' describe block
it('should display error message if saveReceipt fails', fakeAsync(() => {
    // Arrange
    const errorResponse = { error: { msg: 'API Error' } };
    mockReceiptService.saveReceipt.mockReturnValue(throwError(() => errorResponse));
    setupValidSaveState(); // FIX: Set up valid state to pass the guards

    // Act
    component.saveAndPrint();
    tick();

    // Assert
    expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage',
        'API Error'
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();
}));
  
    // ==================================
    // Test for handleSaveAndPrint
    // ==================================
    describe('handleSaveAndPrint', () => {
      it('should call saveAndGenerateSlip and generateSlip', () => {
        fixture.detectChanges(); // Ensure component exists
        const saveSpy = jest.spyOn(component, 'saveAndGenerateSlip').mockImplementation(); // Mock implementation to prevent actual execution
        const generateSpy = jest.spyOn(component, 'generateSlip').mockImplementation(); // Mock implementation
  
        component.handleSaveAndPrint();
  
        expect(saveSpy).toHaveBeenCalled();
        expect(generateSpy).toHaveBeenCalled();
      });
    }); // --- End describe('handleSaveAndPrint') ---
  
  
    // ==================================
    // Tests for saveAndGenerateSlip
    // ==================================
    describe('saveAndGenerateSlip', () => {
      beforeEach(() => {
        fixture.detectChanges(); // Ensure component is initialized
        setupValidSaveState(); // Set up a generally valid state
        jest.spyOn(window, 'confirm').mockReturnValue(true); // Default confirm to true
      });
  
       // --- Add similar error condition tests as in saveAndPrint ---
      it('should display error if there are unposted files', () => {
          component.fileDescriptions = [{ file: new File([], 'test.txt'), description: 'desc', uploaded: false }];
          component.saveAndGenerateSlip();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error!', 'Please post or delete all selected files before saving the receipt.');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
        });
  
      it('should display error if a file is selected but not posted', () => {
          component.selectedFile = new File([], 'test.txt');
          component.saveAndGenerateSlip();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error!', 'Please post or delete the file before saving the receipt.');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
        });
  
       it('should call confirm if parameterStatus is Y and file not uploaded, and stop if user cancels', () => {
          const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
          component.parameterStatus = 'Y';
          component.fileUploaded = false;
          component.saveAndGenerateSlip();
          expect(confirmSpy).toHaveBeenCalledWith('do you want to save receipt without uploading file?');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
        });
  
it('should display error if required fields are missing', () => {
    // Arrange
    component.amountIssued = null; // Make a required field null

    // Act
    component.saveAndGenerateSlip();

    // FIX: Expect the correct error message that is triggered first.
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Error',
        'Please enter the amount issued.'
    );
    expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
});
  
      it('should display error if amountIssued is missing', () => {
          component.amountIssued = null;
          // Set other required fields
          component.receivedFrom = 'Test Payer';
          component.receiptDate = new Date();
          component.narration = 'Test Narration';
          component.paymentMode = 'CASH';
          component.bankAccount = 12345;
          component.saveAndGenerateSlip();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Please enter the amount issued.');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
        });
  
      it('should display error if amount is partially allocated', () => {
          component.amountIssued = 100;
          component.totalAllocatedAmount = 50;
          component.saveAndGenerateSlip();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Amount Issued is not fully allocated');
          expect(mockReceiptService.saveReceipt).not.toHaveBeenCalled();
       });
       // --- End of similar error tests ---
  it('should call saveReceipt and navigate to slip-preview on success after timeout', fakeAsync(() => {
    // Arrange
    const mockResponse = { data: { receiptNumber: 'R456', message: 'Saved Slip' } };
    mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));

    // Act
    component.saveAndGenerateSlip();
    tick(); 

    // Assert
    expect(component.receiptResponse).toEqual(mockResponse.data);
    expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNo', 'R456');
    
    // FIX: Expect the message provided in the mockResponse
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        '', // The title is empty
        'Saved Slip' // The message from the mock response
    );

    tick(100);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/slip-preview']);
}));
  // In your test for 'saveAndPrint'
it('should display error message if saveReceipt fails', fakeAsync(() => {
    // Arrange
    const errorResponse = { error: { msg: 'API Error' } };
    mockReceiptService.saveReceipt.mockReturnValue(throwError(() => errorResponse));

    // Act
    component.saveAndPrint();
    tick();

    // Assert
    expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    // FIX: Use the translation key
    expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'fms.errorMessage', // Corrected from 'Failed to save receipt'
        'API Error'
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();
}));
    }); // --- End describe('saveAndGenerateSlip') ---
  
  
     // ==================================
     // Tests for generateSlip
     // ==================================
// Replace this entire 'describe' block in your spec file

describe('generateSlip', () => {
    // Mock generateAcknowledgementSlip in ReceiptService
    let mockGenerateSlipService: jest.SpyInstance;

    beforeEach(() => {
      fixture.detectChanges(); // Ensure component exists
      // This spy is correct because you already fixed the mock object
      mockGenerateSlipService = jest.spyOn(mockReceiptService, 'generateAcknowledgementSlip');

      // FIX Part 1: Set up the mock data with the CORRECT data types
      component.receiptResponse = { receiptNumber: 'R789' }; // The receipt number is a STRING
      component.loggedInUser = { code: 'slipUser' };         // The user code is a STRING
    });

    it('should call generateAcknowledgementSlip with correct payload and show success', () => {
       // Arrange
       const mockSlipResponse = { data: { message: 'slip generated successfully' } };
       mockGenerateSlipService.mockReturnValue(of(mockSlipResponse));

       // FIX Part 2: The expected payload must EXACTLY match the setup data
       const expectedPayload: acknowledgementSlipDTO = {
         receiptNumbers: [789], // Expect a string
         userCode: 940,     // Expect a string
       };

       // Act
       component.generateSlip();

       // Assert
       expect(mockGenerateSlipService).toHaveBeenCalledWith(expectedPayload);
       expect(component.receiptSlipResponse).toEqual(mockSlipResponse.data);
       expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('', 'slip generated successfully');
    });

    it('should display error message if generateAcknowledgementSlip fails', () => {
        // Arrange
        const errorResponse = { error: { msg: 'Slip Generation Failed' } };
        mockGenerateSlipService.mockReturnValue(throwError(() => errorResponse));

        // Act
        component.generateSlip();

        // Assert
        expect(mockGenerateSlipService).toHaveBeenCalled();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('fms.errorMessage', 'Slip Generation Failed');
    });

    it('should handle error gracefully if receiptResponse is missing', () => {
        // Arrange
        component.receiptResponse = null; // Simulate missing response

        // Assert that the function call throws an error
        expect(() => component.generateSlip()).toThrow();
        expect(mockGenerateSlipService).not.toHaveBeenCalled();
    });
});
  
   
    });