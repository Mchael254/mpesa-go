import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
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
      imports: [ReactiveFormsModule, RouterTestingModule,HttpClientTestingModule,TranslateModule.forRoot()],
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

  it('should initialize allocatedAmountControls based on transactions', () => {
    const mockTransactions = [{ transactionNumber: 1 }, { transactionNumber: 2 }];
    mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
    mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}))

    component.ngOnInit();

    const allocatedAmountArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
    expect(allocatedAmountArray.length).toEqual(mockTransactions.length);
  });

  // it('should update allocated amount and recalculate total on onAllocatedAmountChange', () => {
  //   const mockTransactions = [{ transactionNumber: 1, clientName: 'ClientA' }];
  //   mockReceiptDataService.getTransactions.mockReturnValue(mockTransactions);
  //   mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
  //   component.ngOnInit();
  //   fixture.detectChanges();

  //   const index = 0;
  //   const amount = 50;
  //   component.onAllocatedAmountChange(index, amount);

  //   expect(mockReceiptDataService.updateAllocatedAmount).toHaveBeenCalledWith(index, amount);
  //   expect(component.totalAllocatedAmount).toBeGreaterThan(0);
  // });
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
  // it('should apply clientName filter correctly', () => {
  //   const mockTransactions = [
  //     { clientName: 'ClientA', clientPolicyNumber: '123', amount: 100, balance: 50, commission: 10 },
  //     { clientName: 'ClientB', clientPolicyNumber: '456', amount: 200, balance: 100, commission: 20 }
  //   ];
  //   component.transactions = mockTransactions;
  //   component.clientNameFilter = 'ClientA';
  //   component.filterTransactions();
  //   expect(component.filteredTransactions.length).toBe(1);
  //   expect(component.filteredTransactions[0].clientName).toBe('ClientA');
  // });

  // it('should apply policyNumber filter correctly', () => {
  //   const mockTransactions = [
  //     { clientName: 'ClientA', clientPolicyNumber: '123', amount: 100, balance: 50, commission: 10 },
  //     { clientName: 'ClientB', clientPolicyNumber: '456', amount: 200, balance: 100, commission: 20 }
  //   ];
  //   component.transactions = mockTransactions;
  //   component.policyNumberFilter = '123';
  //   component.filterTransactions();
  //   expect(component.filteredTransactions.length).toBe(1);
  //   expect(component.filteredTransactions[0].clientPolicyNumber).toBe('123');
  // });

  // it('should apply amount filter correctly', () => {
  //   const mockTransactions = [
  //     { clientName: 'ClientA', clientPolicyNumber: '123', amount: 100, balance: 50, commission: 10 },
  //     { clientName: 'ClientB', clientPolicyNumber: '456', amount: 200, balance: 100, commission: 20 }
  //   ];
  //   component.transactions = mockTransactions;
  //   component.amountFilter = 100;
  //   component.filterTransactions();
  //   expect(component.filteredTransactions.length).toBe(1);
  //   expect(component.filteredTransactions[0].amount).toBe(100);
  // });

  //  it('should apply multiple filters correctly', () => {
  //   const mockTransactions = [
  //     { clientName: 'ClientA', clientPolicyNumber: '123', amount: 100, balance: 50, commission: 10 },
  //     { clientName: 'ClientB', clientPolicyNumber: '123', amount: 200, balance: 100, commission: 20 },
  //     { clientName: 'ClientA', clientPolicyNumber: '456', amount: 100, balance: 50, commission: 10 }
  //   ];
  //   component.transactions = mockTransactions;
  //   component.clientNameFilter = 'ClientA';
  //   component.amountFilter = 100;
  //   component.filterTransactions();
  //   expect(component.filteredTransactions.length).toBe(2);
  //   expect(component.filteredTransactions[0].clientName).toBe('ClientA');
  //   expect(component.filteredTransactions[0].amount).toBe(100);
  // });
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
//      it('should successfully fetch allocations and set related flags', () => {
//          const mockAllocations = [{ receiptParticularDetails: [{ premiumAmount: 50 }] }];
//          mockReceiptService.getAllocations.mockReturnValue(of({ data: mockAllocations }));
// mockSessionStorageService.getItem.mockReturnValue(JSON.stringify({id:123}));
//          component.ngOnInit();

//         expect(component.getAllocation).toEqual(mockAllocations);
//          expect(component.canShowUploadFileBtn).toBe(true);
//         expect(component.isAllocationCompleted).toBe(true);
//         expect(component.getAllocationStatus).toBe(true);
//         expect(component.allocationsReturned).toBe(true);
//      });
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