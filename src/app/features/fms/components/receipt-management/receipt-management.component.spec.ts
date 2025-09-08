import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ReceiptManagementComponent } from './receipt-management.component';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { IntermediaryService } from '../../../entities/services/intermediary/intermediary.service';
import { ClientService } from '../../../entities/services/client/client.service';
import { ReceiptService } from '../../services/receipt.service';
import { GenericResponse } from '../../data/receipting-dto';
import { ReceiptsToCancelContentDTO, unPrintedReceiptContentDTO } from '../../data/receipt-management-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';
import { YesNo } from '../shared/yes-no.component';
// --- Mock Pipe for the template ---
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// --- Mocks for Services and Data ---
const mockUser = { code: 'U001', name: 'Test User' };
const mockAgent = { name: 'Test Agent', emailAddress: 'agent@test.com', phoneNumber: '254712345678' };
const mockReceiptContent: unPrintedReceiptContentDTO[] = [
  { no: 1, branchReceiptCode: 'R001', receiptDate: '2023-10-26', receivedFrom: 'Customer A', amount: 100, paymentMode: 'CASH', printed: 'N' } as unPrintedReceiptContentDTO,
  { no: 2, branchReceiptCode: 'R002', receiptDate: '2023-10-27', receivedFrom: 'Customer B', amount: 250.50, paymentMode: 'CARD', printed: 'Y' } as unPrintedReceiptContentDTO,
];
const mockUnprintedReceiptsResponse: GenericResponse<Pagination<unPrintedReceiptContentDTO>> = {
  msg: 'Success',
  success: true,
  data: {
    content: mockReceiptContent,
    totalElements: 2,
  } as Pagination<unPrintedReceiptContentDTO>,
};

describe('ReceiptManagementComponent', () => {
  let component: ReceiptManagementComponent;
  let fixture: ComponentFixture<ReceiptManagementComponent>;

  // Define mocks with Jest spy types
  let mockSessionStorageService: { [key: string]: jest.Mock };
  let mockGlobalMessagingService: { [key: string]: jest.Mock };
  let mockReceiptManagementService: { [key: string]: jest.Mock };
  let mockReceiptService: { [key: string]: jest.Mock };
  let mockIntermediaryService: { [key: string]: jest.Mock };
  let mockRouter: { [key: string]: jest.Mock };
  let mockAuthService: { [key: string]: jest.Mock };

  beforeEach(async () => {
    // Define mocks with spies to allow for easy clearing and tracking
    mockSessionStorageService = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };
    mockReceiptManagementService = {
      getUnprintedReceipts: jest.fn().mockReturnValue(of(mockUnprintedReceiptsResponse)),
      getReceiptsToCancel: jest.fn().mockReturnValue(of({ data: { content: [] } })),
      getGlAccount: jest.fn().mockReturnValue(of({ data: { content: [] } })),
      cancelReceipt: jest.fn(),
      shareReceipt: jest.fn(),
    };
    mockReceiptService = {
      updateReceiptStatus: jest.fn(),
    };
    mockIntermediaryService = {
      getAgentById: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue(mockUser),
    };

    await TestBed.configureTestingModule({
      declarations: [ReceiptManagementComponent, MockTranslatePipe],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ReceiptManagementService, useValue: mockReceiptManagementService },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: IntermediaryService, useValue: mockIntermediaryService },
        { provide: ClientService, useValue: {} },
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: TranslateService, useValue: { instant: (key: string) => key } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptManagementComponent);
    component = fixture.componentInstance;
  });
  
  // Helper to centralize component initialization for tests that need ngOnInit to run
  const initializeComponent = () => {
    mockSessionStorageService['getItem'].mockImplementation((key: string) => {
        if (key === 'defaultBranch') return JSON.stringify({ id: 1 });
        return null;
    });
    fixture.detectChanges(); // This will trigger ngOnInit
  };


  it('should create', () => {
    initializeComponent();
    expect(component).toBeTruthy();
  });

  describe('OnInit and Tab State', () => {
    it('should default to the "Cancellation" tab', () => {
      mockSessionStorageService['getItem'].mockReturnValue(null);
      const cancelSpy = jest.spyOn(component, 'cancelClicked');
      initializeComponent();
      expect(cancelSpy).toHaveBeenCalled();
      expect(component.isCancellation).toBe(true);
    });

    it('should switch to the "Printing" tab if session flag is set', () => {
      mockSessionStorageService['getItem'].mockImplementation((key: string) => (key === 'printTabStatus' ? 'true' : null));
      const printingSpy = jest.spyOn(component, 'isPrintingClicked');
      initializeComponent();
      expect(printingSpy).toHaveBeenCalled();
      expect(component.isPrinting).toBe(true);
      expect(mockSessionStorageService['removeItem']).toHaveBeenCalledWith('printTabStatus');
    });
  });

  describe('Navigation', () => {
    beforeEach(() => initializeComponent());

    it('printReceipt should set session storage and navigate', () => {
      component.printReceipt(0, 123);
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('receiptNumber', JSON.stringify(123));
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('reprinted', 'no');
      expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });

    it('rePrintReceipt should set "reprinted" flag and navigate', () => {
      component.rePrintReceipt(0, 456);
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('receiptNumber', JSON.stringify(456));
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('reprinted', 'yes');
      expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });
  });

  // ===================================
  // UNIT TESTS FOR RECEIPT SHARING LOGIC
  // ===================================
  describe('Receipt Sharing Modal and Logic', () => {

    beforeEach(() => {
        // Run ngOnInit to ensure component state (like forms) is initialized
        initializeComponent();
        // Mock the agent service to return successful data by default for this block
        mockIntermediaryService['getAgentById'].mockReturnValue(of(mockAgent));
    });

    it('should initialize `rctShareForm` with correct validators and defaults', () => {
        const form = component.rctShareForm;
        expect(form).toBeDefined();
        expect(form.get('shareMethod')?.value).toEqual('whatsapp');
        expect(form.get('name')?.hasValidator(Validators.required)).toBe(true);
        
        const phoneControl = form.get('phone');
        expect(phoneControl?.hasValidator(Validators.required)).toBe(true);
        expect(phoneControl?.valid).toBe(false); // Initially empty, so invalid
        phoneControl?.setValue('254712345678');
        expect(phoneControl?.valid).toBe(true);
    });

    it('openReceiptShareModal should call getAgentById and populate the form', () => {
        const getAgentSpy = jest.spyOn(component, 'getAgentById');
        component.openReceiptShareModal(0, 'R123', 456, 0, 'N');
        
        expect(getAgentSpy).toHaveBeenCalledWith(456);
        expect(component.rctShareForm.get('name')?.value).toBe(mockAgent.name);
        expect(component.rctShareForm.get('phone')?.value).toBe(mockAgent.phoneNumber);
    });

    describe('prepareShareData helper function', () => {
        it('should return null if the `name` control is invalid', () => {
            component.rctShareForm.patchValue({ name: '' });
            const result = (component as any).prepareShareData();
            expect(result).toBeNull();
            //expect(mockGlobalMessagingService['displayErrorMessage']).toHaveBeenCalledWith('Validation Error', expect.stringContaining('Client Name is required'));
        });

        it('should return null if `phone` control is invalid for whatsapp method', () => {
            component.rctShareForm.patchValue({ name: 'Valid Name', shareMethod: 'whatsapp', phone: 'invalid-phone' });
            const result = (component as any).prepareShareData();
            expect(result).toBeNull();
           // expect(mockGlobalMessagingService['displayErrorMessage']).toHaveBeenCalledWith('Validation Error', expect.stringContaining('Invalid phone number format'));
        });

        it('should return the correct payload for a valid whatsapp selection', () => {
            component.rctShareForm.patchValue({ name: 'Valid Name', shareMethod: 'whatsapp', phone: '254712345678' });
            const result = (component as any).prepareShareData();
            expect(result).toEqual({
                shareType: 'WHATSAPP',
                recipientEmail: '',
                recipientPhone: '254712345678'
            });
        });
    });

    describe('onClickPreview button action', () => {
        it('should mark form as touched and stop if data is invalid', () => {
            const markAllAsTouchedSpy = jest.spyOn(component.rctShareForm, 'markAllAsTouched');
            component.rctShareForm.patchValue({ name: '' }); // Make form invalid
            
            component.onClickPreview();

            expect(markAllAsTouchedSpy).toHaveBeenCalled();
           // expect(mockSessionStorageService['setItem']).not.toHaveBeenCalledWith(expect.stringContaining('sharePreviewData'), expect.any(String));
            expect(mockRouter['navigate']).not.toHaveBeenCalled();
        });

        it('should store preview data in session storage and navigate on valid form', () => {
            component.rctShareForm.patchValue({ name: 'Client X', shareMethod: 'whatsapp', phone: '254712345678' });
            
            component.onClickPreview();

            const expectedData = JSON.stringify({
                shareType: 'WHATSAPP',
                recipientEmail: '',
                recipientPhone: '254712345678',
                clientName: 'Client X'
            });

            expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('sharePreviewData', expectedData);
            expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/preview-receipt']);
        });
    });

    describe('postClientDetails button action', () => {
        it('should share receipt and update print status when printStatus is "N"', () => {
            component.printStatus = YesNo.No;
            component.receipt_no = "123";
            component.agent = mockAgent;
            component.rctShareForm.patchValue({ name: 'Client X', shareMethod: 'whatsapp', phone: '254712345678' });
            mockReceiptManagementService['shareReceipt'].mockReturnValue(of({ msg: 'Shared' }));
            mockReceiptService['updateReceiptStatus'].mockReturnValue(of({}));

            component.postClientDetails();

            expect(mockReceiptManagementService['shareReceipt']).toHaveBeenCalled();
            expect(mockReceiptService['updateReceiptStatus']).toHaveBeenCalledWith([123]);
            expect(mockGlobalMessagingService['displaySuccessMessage']).toHaveBeenCalledWith('success', 'Shared');
        });

        it('should share receipt but NOT update status when printStatus is "Y"', () => {
            component.printStatus = YesNo.Yes;
            component.rctShareForm.patchValue({ name: 'Client X' });
            mockReceiptManagementService['shareReceipt'].mockReturnValue(of({ msg: 'Shared' }));

            component.postClientDetails();
            
            expect(mockReceiptManagementService['shareReceipt']).toHaveBeenCalled();
            expect(mockReceiptService['updateReceiptStatus']).not.toHaveBeenCalled();
        });
    });
  });

  // --- (Your other tests for cancellation, filtering etc. can go here) ---



  describe('ngOnInit and Tab State Handling', () => {
    it('should default to the "Cancellation" tab when no session flag is present', () => {
      mockSessionStorageService['getItem'].mockReturnValue(null);
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');

      fixture.detectChanges();

      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isCancellation).toBe(true);
    });

    it('should switch to the "Printing" tab when the session flag is present', () => {
      mockSessionStorageService['getItem'].mockImplementation((key: string) => (key === 'printTabStatus' ? 'true' : null));
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      fixture.detectChanges();

      expect(isPrintingClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isPrinting).toBe(true);
    });

    it('should remove the "printTabStatus" flag from session storage after reading it', () => {
      mockSessionStorageService['getItem'].mockReturnValue('true');
      fixture.detectChanges();
      expect(mockSessionStorageService['removeItem']).toHaveBeenCalledWith('printTabStatus');
    });
  });

  describe('UI State Toggles', () => {
    it('isPrintingClicked should set printing flags correctly', () => {
      component.isPrintingClicked();
      expect(component.printingEnabled).toBe(true);
      expect(component.isPrinting).toBe(true);
      expect(component.isCancellation).toBe(false);
    });

    it('cancelClicked should set cancellation flags correctly', () => {
      component.isPrintingClicked(); // Arrange: start in printing mode
      component.cancelClicked(); // Act
      expect(component.printingEnabled).toBe(false);
      expect(component.isPrinting).toBe(false);
      expect(component.isCancellation).toBe(true);
    });
  });

  describe('Filtering', () => {
    // Note: The component has two `applyFilter` methods. This tests the one for the printing tab.
    it('filterReceipts should filter data correctly based on receiptNumberFilter', () => {
      component.unPrintedReceiptContent = [...mockReceiptContent];
      component.receiptNumberFilter = 'R002'; // Set a filter
      
      component.filterReceipts();

      expect(component.filteredtabledata.length).toBe(1);
      expect(component.filteredtabledata[0].branchReceiptCode).toBe('R002');
    });
  });

  describe('Navigation', () => {
    it('printReceipt should set session storage and navigate', () => {
      component.printReceipt(0, 123);
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('receiptNumber', JSON.stringify(123));
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('reprinted', 'no');
      expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });

    it('rePrintReceipt should set session storage with "reprinted" flag and navigate', () => {
      component.rePrintReceipt(0, 456);
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('receiptNumber', JSON.stringify(456));
      expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('reprinted', 'yes');
      expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });

    it('onClickPreview should prepare share data and navigate', () => {
        component.cancelForm.patchValue({ shareMethod: 'EMAIL', email: 'test@test.com' });
        component.onClickPreview();
        expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('shareType', 'EMAIL');
        expect(mockSessionStorageService['setItem']).toHaveBeenCalledWith('recipient', 'test@test.com');
        expect(mockRouter['navigate']).toHaveBeenCalledWith(['/home/fms/preview-receipt']);
    });
  });

  describe('Receipt Sharing Modal (`postClientDetails`)', () => {
    beforeEach(() => {
        component.receipt_no = 'R123';
        component.cancelForm.patchValue({ shareMethod: 'WHATSAPP', phone: '123456789' });
    });

    it('should share receipt and update print status when printStatus is "N"', () => {
        component.printStatus = YesNo.No;
        mockReceiptManagementService['shareReceipt'].mockReturnValue(of({ msg: 'Success' }));
        mockReceiptService['updateReceiptStatus'].mockReturnValue(of({})); // Mock the inner call

        component.postClientDetails();

        expect(mockReceiptManagementService['shareReceipt']).toHaveBeenCalled();
        expect(mockReceiptService['updateReceiptStatus']).toHaveBeenCalledWith([123]);
        expect(mockGlobalMessagingService['displaySuccessMessage']).toHaveBeenCalledWith('success', 'Success');
    });

    it('should share receipt but NOT update print status when printStatus is "Y"', () => {
        component.printStatus = YesNo.Yes;
        mockReceiptManagementService['shareReceipt'].mockReturnValue(of({ msg: 'Success' }));

        component.postClientDetails();

        expect(mockReceiptManagementService['shareReceipt']).toHaveBeenCalled();
        expect(mockReceiptService['updateReceiptStatus']).not.toHaveBeenCalled();
        expect(mockGlobalMessagingService['displaySuccessMessage']).toHaveBeenCalledWith('success', 'Success');
    });

    it('should display an error if sharing fails', () => {
        mockReceiptManagementService['shareReceipt'].mockReturnValue(throwError(() => ({ error: { msg: 'Failure' } })));
        component.postClientDetails();
        expect(mockGlobalMessagingService['displayErrorMessage']).toHaveBeenCalled();
    });
  });

  describe('Receipt Cancellation Modal', () => {
    it('should display an error if form is invalid on validateFields', () => {
        component.initializeForm(); // Ensure form is created
        component.cancelForm.patchValue({ remarks: '' }); // Make it invalid
        
        component.validateFields();

        expect(mockGlobalMessagingService['displayErrorMessage']).toHaveBeenCalledWith('Error', 'Please fill all the required fields');
        expect(mockReceiptManagementService['cancelReceipt']).not.toHaveBeenCalled();
    });

    // it('should call cancelReceipt service if form is valid', () => {
    //     const mockReceiptToCancel: ReceiptsToCancelContentDTO = { no: 999 } as ReceiptsToCancelContentDTO;
    //     component.selectedReceipt = mockReceiptToCancel;
    //     component.loggedInUser = mockUser;
    //     mockReceiptManagementService.cancelReceipt.mockReturnValue(of({ msg: 'Cancelled' }));

    //     component.cancelForm.patchValue({
    //         remarks: 'Test remark',
    //         cancellationDate: '2023-01-01',
    //         raiseBankCharge: 'N',
    //     });
        
    //     component.cancelReceipt();

    //     expect(mockReceiptManagementService.cancelReceipt).toHaveBeenCalled();
    //     expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('', 'Cancelled');
    // });
  });
});