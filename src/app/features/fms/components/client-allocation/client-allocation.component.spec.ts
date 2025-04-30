import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormArray, FormControl, FormGroup,FormsModule } from '@angular/forms';
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
import {SessionStorageService} from '../../../../shared/services/session-storage/session-storage.service';
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

      getTransactions: jest.fn().mockReturnValue([]), // Mock getTransactions to return an empty array by default
      getAllocatedAmounts: jest.fn(),
      getSelectedClient: jest.fn(),
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
    mockReceiptService = {
      postAllocation: jest.fn(),
      getAllocations: jest.fn().mockReturnValue(of({ data: [] })),

      deleteAllocation: jest.fn(),
      uploadFiles: jest.fn(),
      saveReceipt: jest.fn()
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
      getItem: jest.fn().mockImplementation((key: string) => {
        if (key === 'receiptingPoint') {
          return JSON.stringify({ id: 1, name: 'Test Point' }); // Or return null/undefined for testing default value
        }
        // Add other key-value pairs as needed for your tests
        return null; // Default return value for other keys
      }),
      // getItem: jest.fn(),
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

 
 
  it('should initialize allocatedAmountControls based on transactions', fakeAsync(() => { // <-- USE fakeAsync
     // Arrange
     const mockTransactions = [
       { transactionNumber: 1, balance: 100 }, // <-- Make sure mock has properties needed by initializeAllocatedAmountControls
       { transactionNumber: 2, balance: 200 }
     ];
     mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
     
     tick(1000); // <-- Advance time by the setTimeout duration (or slightly more)
 
     // Assert
     const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
     expect(allocatedAmountArray.length).toEqual(mockTransactions.length); // Should now be 2
 
     // Optional: Verify the content of the controls added
     expect(allocatedAmountArray.at(0).get('allocatedAmount')?.value).toEqual(mockTransactions[0].balance);
     expect(allocatedAmountArray.at(1).get('commissionChecked')?.value).toEqual('N');
  }));

  it('should update allocated amount and recalculate total on onAllocatedAmountChange', () => {
    const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA' }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
     mockReceiptService.getAllocations.mockReturnValue(of({ data: [] })); // Mock getAllocations to return an empty array

    component.ngOnInit();
    fixture.detectChanges();

    const index = 0;
    const amount = 50;

    // Get the form array and the specific control
    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    const formGroup = allocatedAmountArray.at(index) as FormGroup;
    const allocatedAmountControl = formGroup.get('allocatedAmount') as FormControl;

    // Set the value of the allocatedAmount control
    allocatedAmountControl.setValue(amount);
    fixture.detectChanges(); // Trigger change detection

    component.onAllocatedAmountChange(index, amount);

    expect(mockReceiptDataService.updateAllocatedAmount).toHaveBeenCalledWith(index, amount);
    expect(component.totalAllocatedAmount).toBeGreaterThan(0);
  });
 
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

  it('should calculate total allocated amount correctly', () => {
    // Arrange
    mockReceiptDataService.getTransactions.mockReturnValue([{ transactionNumber: 1, clientName: 'ClientA' }]);
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
        mockReceiptService.getAllocations.mockReturnValue(of({ data: [] })); // Mock getAllocations to return an empty array

    component.ngOnInit();
    fixture.detectChanges();

    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    //  Here are setting two values on the allocatedForm array
    (allocatedAmountArray.at(0) as FormGroup).setValue({ allocatedAmount: 50, commissionChecked: 'N' });

    // Act
    component.calculateTotalAllocatedAmount();

    // Assert
    expect(component.totalAllocatedAmount).toBeGreaterThan(0);
  });
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
  it('should display an error message if total allocated amount exceeds the amount issued', () => {
    const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA' }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
    component.ngOnInit();
    fixture.detectChanges();

      // Set allocated amount to a value
     const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    const formGroup = allocatedAmountArray.at(0) as FormGroup;
      const allocatedAmountControl = formGroup.get('allocatedAmount') as FormControl;
     allocatedAmountControl.setValue(150);

   component.amountIssued = 100;
    component.totalAllocatedAmount = 150;
    // Act
    component.allocateAndPostAllocations();
     expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
              'Error',
              'Total Allocated Amount Exceeds Amount Issued'
       );
  });
    
  it('should post allocation successfully and display a success message', fakeAsync(() => {
    const mockReceiptData = {
      amountIssued: 100,
      paymentMode: 'Cash',
      paymentRef: '12345',
      // ... other properties
    };
    mockReceiptDataService.getReceiptData.mockReturnValue(mockReceiptData);
  
    const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA', clientPolicyNumber: 123, referenceNumber: 456, policyBatchNumber: 789, commission: 5 }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
  
    // Mock selectedClient with a valid object
    const mockSelectedClient = {
      systemCode: 123, // Add a systemCode
      code: 456,        // Add a code
      shortDesc: "Test",
      accountCode:789,
      receiptType:"Type"
      // ... other properties
    };
    mockReceiptDataService.getSelectedClient.mockReturnValue(mockSelectedClient);
  
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
    component.ngOnInit();
    fixture.detectChanges();
  
    component.amountIssued = 100;
    component.totalAllocatedAmount = 100;
  
    // Set allocated amount to a value > 0
    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    const formGroup = allocatedAmountArray.at(0) as FormGroup;
    const allocatedAmountControl = formGroup.get('allocatedAmount') as FormControl;
    allocatedAmountControl.setValue(50); // Allocate some amount
    fixture.detectChanges();
  
    mockFmsSetupService.getParamStatus.mockReturnValue(of({data:'N'})); //mock ParamStatus
    component.fetchParamStatus()
    tick();
  
    const mockAllocationResponse = { success: true };
    mockReceiptService.postAllocation.mockReturnValue(of(mockAllocationResponse));
  
    component.allocateAndPostAllocations();
    tick(); // Resolve the postAllocation Observable
  
    expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
      'Success',
      'Allocations posted successfully'
    );
  }));
      it('should fetch allocations on init', () => {
        component.ngOnInit();
        expect(mockReceiptService.getAllocations).toHaveBeenCalled();
    });

     it('should display an error message when getAllocations fails', () => {
        const errorMessage = 'Failed to fetch allocations';
        mockReceiptService.getAllocations.mockReturnValue(throwError(() => ({ error: { msg: errorMessage } })));

        component.getAllocations();

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('error fetched', errorMessage);
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
    it('should display error message if fetching document fails', () => {
       const mockDocId = '123';
       const mockError = { error: { error: 'Failed to fetch document' } };
        mockDmsService.getDocumentById.mockReturnValue(throwError(() => mockError));

       component.fetchDocByDocId(mockDocId);
       expect(mockDmsService.getDocumentById).toHaveBeenCalledWith(mockDocId);
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
               'Error',
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
           const errorMessage = 'Failed to fetch param status';
        mockFmsSetupService.getParamStatus.mockReturnValue(throwError(() => ({ err: { error: errorMessage } })));

        component.fetchParamStatus();

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
               'Error:Failed to fetch Param Status',
                errorMessage
          );
       });

    it('should navigate to client-search on onBack', () => {
      component.onBack();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-search']);
    });

     it('should successfully save the receipt', fakeAsync(() => { // Wrap the test in fakeAsync
      const mockBranchReceiptNumber = 123;
      const mockReceiptCode = 'REC001';
      mockReceiptService.saveReceipt.mockReturnValue(of({ data: { receiptNumber: 'REC001', message: 'Receipt saved successfully' } }));
      component.branchReceiptNumber = mockBranchReceiptNumber;
      component.receiptCode = mockReceiptCode;
      component.paymentMode='CASH';
      component.selectedClient = {
        systemCode: 1,
        systemShortDesc: 'TEST',
        code: 123,
        accountCode: 456,
        receiptType: 'Test',
        shortDesc: "asd"
      } as any;
      component.defaultBranch = {id:1} as any;
      component.receiptingPointObject= {id:1} as any;
      component.amountIssued = 100;
      component.totalAllocatedAmount = 100;
      mockFmsSetupService.getParamStatus.mockReturnValue(of({data:'N'})); //mock ParamStatus
      component.fetchParamStatus()
      tick();
      component.submitReceipt();
      tick(); // Resolve any asynchronous operations within submitReceipt
      expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
      expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith(
        'success',
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
      }));
  
      it('should display error if required fields are missing', () => {
        component.amountIssued = null; // Make a required field null
        component.saveAndPrint();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Failed', 'please fill all fields marked with * in receipt capture!');
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
  
      it('should call saveReceipt and navigate to preview on success', fakeAsync(() => {
        const mockResponse = { data: { receiptNumber: 'R123', message: 'Saved' } };
        mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));
  
        component.saveAndPrint();
        tick(); 
  
      
  
        expect(component.receiptResponse).toEqual(mockResponse.data);
        expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNo', 'R123');
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Receipt saved successfully');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-preview']);
      }));
  
       it('should display error message if saveReceipt fails', fakeAsync(() => {
          const errorResponse = { error: { msg: 'API Error' } };
          mockReceiptService.saveReceipt.mockReturnValue(throwError(() => errorResponse));
  
          component.saveAndPrint();
          tick(); // Process the observable
  
          expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Failed to save receipt', 'API Error');
          expect(mockRouter.navigate).not.toHaveBeenCalled(); // Should not navigate on error
        }));
    }); // --- End describe('saveAndPrint') ---
  
  
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
          component.amountIssued = null; // Make a required field null
          component.saveAndGenerateSlip();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Failed', 'please fill all fields marked with * in receipt capture!');
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
        const mockResponse = { data: { receiptNumber: 'R456', message: 'Saved Slip' } };
        mockReceiptService.saveReceipt.mockReturnValue(of(mockResponse));
  
        component.saveAndGenerateSlip();
        tick(); // Process the observable from saveReceipt
  
        expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
        expect(component.receiptResponse).toEqual(mockResponse.data);
        expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNo', 'R456');
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Receipt saved successfully');
  
        // Fast-forward time for setTimeout
        tick(100); // Advance time by 100ms (or slightly more)
  
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/slip-preview']);
      }));
  
       it('should display error message if saveReceipt fails', fakeAsync(() => {
          const errorResponse = { error: { msg: 'API Error Slip' } };
          mockReceiptService.saveReceipt.mockReturnValue(throwError(() => errorResponse));
  
          component.saveAndGenerateSlip();
          tick(); // Process the observable
  
          expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Failed to save receipt', 'API Error Slip');
          expect(mockRouter.navigate).not.toHaveBeenCalled(); // Should not navigate on error
        }));
    }); // --- End describe('saveAndGenerateSlip') ---
  
  
     // ==================================
     // Tests for generateSlip
     // ==================================
    describe('generateSlip', () => {
      // Mock generateAcknowledgementSlip in ReceiptService
      let mockGenerateSlipService: jest.SpyInstance;
  
       beforeEach(() => {
         fixture.detectChanges(); // Ensure component exists
         // Mock the specific service method directly on the instance
         mockGenerateSlipService = jest.spyOn(mockReceiptService, 'generateAcknowledgementSlip');
  
         // Set necessary component state
         component.receiptResponse = { receiptNumber: 'R789', message: 'Saved' } as any; // Assume receipt was saved
         // Ensure loggedInUser is set
          if (!component.loggedInUser) {
               component.loggedInUser = { code: 940 };
           } else {
              component.loggedInUser.code = 'slipUser'; // Ensure the code is correct for the test
          }
       });
  
       it('should call generateAcknowledgementSlip with correct payload and show success', () => {
          const mockSlipResponse = { data: { slipContent: 'some data' } }; // Example slip data
          mockGenerateSlipService.mockReturnValue(of(mockSlipResponse));
  
          const expectedPayload: acknowledgementSlipDTO = {
            receiptNumbers: [789],
            userCode: 940,
          };
  
          component.generateSlip();
  
          expect(mockGenerateSlipService).toHaveBeenCalledWith(expectedPayload);
          expect(component.receiptSlipResponse).toEqual(mockSlipResponse.data);
          expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'slip generated successfully');
       });
  
       it('should display error message if generateAcknowledgementSlip fails', () => {
          const errorResponse = { error: { msg: 'Slip Generation Failed' } };
          mockGenerateSlipService.mockReturnValue(throwError(() => errorResponse));
  
          component.generateSlip();
  
          expect(mockGenerateSlipService).toHaveBeenCalled();
          // Check the error message key used in the component's generateSlip method
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(expect.toString(), 'Slip Generation Failed'); // Allow any title, check message
        });
  
        // Optional: Test case if receiptResponse is missing
         it('should handle error gracefully if receiptResponse is missing', () => {
           component.receiptResponse = null; // Simulate missing response
           // We expect generateSlip *not* to call the service and maybe log an error or do nothing gracefully
           // Depending on implementation, it might throw a TypeError accessing receiptNumber
  
           // Option 1: Expect it not to call the service
           // component.generateSlip(); // This might throw an error
           // expect(mockGenerateSlipService).not.toHaveBeenCalled();
  
           // Option 2: Expect it to throw (if that's the intended behavior)
           expect(() => component.generateSlip()).toThrow(); // Or specific error type if applicable
           expect(mockGenerateSlipService).not.toHaveBeenCalled();
         });
    }); // --- End describe('generateSlip') ---
  
    it('should display an error message if receipt saving fails', fakeAsync(() => {
      const mockError = { error: { msg: 'Failed to save receipt' } };
      mockReceiptService.saveReceipt.mockReturnValue(throwError(() => mockError));
      component.paymentMode='CASH';
      component.branchReceiptNumber = 123;
      component.selectedClient = {
        systemCode: 1,
        systemShortDesc: 'TEST',
        code: 123,
        accountCode: 456,
        receiptType: 'Test',
        shortDesc: "asd"
      } as any;
    
      component.defaultBranch = {id:1} as any;
      component.receiptingPointObject= {id:1} as any;
        component.amountIssued = 100;
      component.totalAllocatedAmount = 100;
        mockFmsSetupService.getParamStatus.mockReturnValue(of({data:'N'})); //mock ParamStatus
      component.fetchParamStatus()
      tick();
      component.submitReceipt();
      tick(); // Resolve the saveReceipt Observable
      expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
      expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith(
        'Failed to save receipt',
        'Failed to save receipt'
      );
    }));
});