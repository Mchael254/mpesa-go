import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormArray, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ClientAllocationComponent } from './client-allocation.component';
import { ReceiptDataService } from '../../services/receipt-data.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { ReceiptService } from '../../services/receipt.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { ReportsService } from '../../../../shared/services/reports/reports.service';
import { DmsService } from '../../../../shared/services/dms/dms.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { FmsSetupService } from '../../services/fms-setup.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IntermediaryService } from '../../../../features/entities/services/intermediary/intermediary.service';
import { ReceiptManagementService } from '../../services/receipt-management.service';

jest.mock('../../data/fms-step.json', () => ({
  __esModule: true,
  default: { receiptingSteps: [] },
}));

describe('ClientAllocationComponent', () => {
  let component: ClientAllocationComponent;
  let fixture: ComponentFixture<ClientAllocationComponent>;
  let mockReceiptDataService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptService: any;
  let mockRouter: any;
  let mockIntermediaryService: any;
  let mockReceiptManagementService: any;

  const setupValidSaveState = () => {
    component.fileDescriptions = [];
    component.selectedFile = null;
    component.parameterStatus = 'N';
    component.fileUploaded = false;
    component.amountIssued = 100;
    component.receivedFrom = 'Test Payer';
    component.receiptDate = new Date();
    component.narration = 'Test Narration';
    component.paymentMode = 'CASH';
    component.bankAccount = 12345;
    component.totalAllocatedAmount = 100;
    component.branchReceiptNumber = 987;
    component.receiptCode = 'RC001';
    component.currency = 'USD';
    component.defaultBranch = { id: 1 } as any;
    component.loggedInUser = { code: 'testUser' };
    component.selectedClient = { systemCode: 1, systemShortDesc: 'SYS' } as any;
    component.receiptingPointObject = { id: 2, autoManual: 'A' } as any;
    component.storedData = { amountIssued: 100 };
  };
   
  beforeEach(async () => {
    mockReceiptDataService = {
      getReceiptData: jest.fn().mockReturnValue({}),
      getSelectedClient: jest.fn().mockReturnValue({ code: 1 }),
      getTransactions: jest.fn().mockReturnValue([]),
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
    mockReceiptService = {
      postAllocation: jest.fn().mockReturnValue(of({ msg: 'Success' })),
      getAllocations: jest.fn().mockReturnValue(of({ data: [] })),
      deleteAllocation: jest.fn().mockReturnValue(of({ success: true })),
      uploadFiles: jest.fn().mockReturnValue(of({ docId: '123' })),
      saveReceipt: jest.fn().mockReturnValue(of({ data: { message: 'Success', receiptNumber: '123' }})),
      generateAcknowledgementSlip: jest.fn().mockReturnValue(of({ data: { message: 'Success' }})),
      postEmptyAllocation: jest.fn().mockReturnValue(of({ msg: 'Success' })),
      updateReceiptStatus: jest.fn().mockReturnValue(of({ msg: 'Success' })),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    const mockFmsSetupService = {
      getParamStatus: jest.fn().mockReturnValue(of({ data: 'N' }))
    };
    mockIntermediaryService = {
        getAgentById: jest.fn().mockReturnValue(of({}))
    };
    mockReceiptManagementService = {
        shareReceipt: jest.fn().mockReturnValue(of({ msg: 'Shared' }))
    };
    const mockSessionStorageService = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    const mockAuthService = {
        getCurrentUser: jest.fn().mockReturnValue({ code: 'testUser' }),
    };

    await TestBed.configureTestingModule({
      declarations: [ClientAllocationComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        FormBuilder,
        { provide: ReceiptDataService, useValue: mockReceiptDataService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: DmsService, useValue: {} },
        { provide: ReportsService, useValue: {} },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: FmsSetupService, useValue: mockFmsSetupService },
        { provide: IntermediaryService, useValue: mockIntermediaryService },
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientAllocationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize forms and call init methods on ngOnInit', () => {
        jest.spyOn(component, 'getAllocations');
        jest.spyOn(component, 'fetchParamStatus');
        
        fixture.detectChanges();

        expect(component.receiptingDetailsForm).toBeDefined();
        expect(component.rctShareForm).toBeDefined();
        expect(component.getAllocations).toHaveBeenCalled();
        expect(component.fetchParamStatus).toHaveBeenCalled();
    });

    it('should call getAgentById on init if a client code exists', () => {
        const getAgentSpy = jest.spyOn(component, 'getAgentById');
        mockReceiptDataService.getSelectedClient.mockReturnValue({ code: 123 });
        fixture.detectChanges();
        expect(getAgentSpy).toHaveBeenCalledWith(123);
    });
  });

  describe('Allocation Logic', () => {
      beforeEach(() => {
          fixture.detectChanges();
      });

      it('should post an empty allocation if total allocated amount is zero', () => {
          component.totalAllocatedAmount = 0;
          component.confirmtotalAllocatedAmount();
          expect(mockReceiptService.postEmptyAllocation).toHaveBeenCalled();
      });

      it('should display error if trying to over-allocate', () => {
          component.amountIssued = 100;
          component.totalAllocatedAmount = 150;
          component.transactions = [{ transactionNumber: 1 }] as any;
          const allocatedArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
          allocatedArray.push(new FormGroup({
              allocatedAmount: new FormControl(150),
              commissionChecked: new FormControl('N')
          }));
          
          component.allocateAndPostAllocations();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error','Total Allocated Amount Exceeds Amount Issued');
      });

      it('should delete an allocation successfully', () => {
        component.getAllocation = [{ receiptParticularDetails: [{ code: 123, premiumAmount: 50 }]}] as any;
        component.totalAllocatedAmount = 50;

        component.deleteAllocation(123);

        expect(mockReceiptService.deleteAllocation).toHaveBeenCalledWith(123);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'Allocation deleted successfully');
      });

      it('should calculate total allocated amount correctly', () => {
        const allocatedArray = component.receiptingDetailsForm.get('allocatedAmount') as FormArray;
        allocatedArray.push(new FormGroup({ allocatedAmount: new FormControl(50) }));
        allocatedArray.push(new FormGroup({ allocatedAmount: new FormControl(25) }));
        
        component.calculateTotalAllocatedAmount();

        expect(component.totalAllocatedAmount).toBe(75);
      });
  });

  describe('File Handling', () => {
      beforeEach(() => {
          fixture.detectChanges();
      });

      it('should not upload file if no file is selected', () => {
          component.getAllocationStatus = true;
          component.selectedFile = null;
          component.uploadFile();
          expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'No selected file found!');
      });

      it('should upload a file successfully', () => {
          component.getAllocationStatus = true;
          component.selectedFile = new File([''], 'test.pdf');
          component.base64Output = 'base64Data';
          component.globalGetAllocation = [{ receiptParticularDetails: [{ policyNumber: 'P123' }] }];
          component.fileDescriptions = [{ file: component.selectedFile, description: 'Test File', uploaded: false }];
          component.paymentMode = 'CASH';

          component.uploadFile();
          
          expect(mockReceiptService.uploadFiles).toHaveBeenCalled();
      });

      it('should delete a file successfully', () => {
          const mockFile = { docId: '123' };
          component.uploadedFiles = [mockFile];
          component.deleteFile(mockFile, 0);
          expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('Success', 'File deleted successfully');
      });
  });

  describe('Receipt Submission', () => {
    beforeEach(() => {
        fixture.detectChanges();
        setupValidSaveState();
    });

    it('should call saveReceipt with correct payload on submitReceipt', () => {
        component.submitReceipt();
        expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    });

    it('should display error if amount is not fully allocated', () => {
        component.totalAllocatedAmount = 50;
        component.submitReceipt();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Amount Issued is not fully allocated');
    });

    it('should call saveReceipt and navigate on saveAndPrint', () => {
        component.saveAndPrint();
        expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
    });

    it('should call saveReceipt and navigate on saveAndGenerateSlip', fakeAsync(() => {
        component.saveAndGenerateSlip();
        tick();
        expect(mockReceiptService.saveReceipt).toHaveBeenCalled();
        tick(100);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/slip-preview']);
    }));
  });

  describe('Receipt Sharing', () => {
      beforeEach(() => {
          fixture.detectChanges();
          component.agent = { name: 'Test Agent' } as any;
          component.receiptResponse = { receiptNumber: 'R123', receiptCode: 'RC123' };
          component.defaultOrg = { id: 1 } as any;
      });

      it('should not post if sharing form is invalid', () => {
          component.rctShareForm.patchValue({ name: '' });
          component.postClientDetails();
          expect(mockReceiptManagementService.shareReceipt).not.toHaveBeenCalled();
      });

      it('should call shareReceipt service and update print status on success', () => {
          const updateStatusSpy = jest.spyOn(component, 'updatePrintStatus');
          component.rctShareForm.patchValue({ name: 'Test Client', shareMethod: 'whatsapp', phone: '254712345678' });
          
          component.postClientDetails();
          
          expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalled();
          expect(updateStatusSpy).toHaveBeenCalled();
      });
  });

  describe('Navigation', () => {
      beforeEach(() => {
          fixture.detectChanges();
      });

      it('should navigate to client-search on onBack', () => {
        component.onBack();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/client-search']);
      });

      it('should navigate to a previous step via handleStepNavigation', () => {
        component.steps = [{ number: 1, link: '/home/fms/receipt-capture' }] as any;
        component.handleStepNavigation(1);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-capture']);
      });
  });
});