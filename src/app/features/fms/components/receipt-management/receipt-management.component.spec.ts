import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

import { BranchDTO, GenericResponse } from '../../data/receipting-dto';
import { ReceiptsToCancelContentDTO, unPrintedReceiptContentDTO } from '../../data/receipt-management-dto';
import { Pagination } from 'src/app/shared/data/common/pagination';

// --- Mock Pipe for the template ---
@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

// --- Mocks for Services and Data ---
const mockBranch: BranchDTO = { id: 1, name: 'Main Branch' } as BranchDTO;
const mockUser = { code: 'U001', name: 'Test User' };

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

// Jest Mocks for services
const mockSessionStorageService = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockGlobalMessagingService = {
  displayErrorMessage: jest.fn(),
  displaySuccessMessage: jest.fn(),
};

const mockReceiptManagementService = {
  getUnprintedReceipts: jest.fn().mockReturnValue(of(mockUnprintedReceiptsResponse)),
  getReceiptsToCancel: jest.fn().mockReturnValue(of({ data: { content: [] } })),
  getGlAccount: jest.fn().mockReturnValue(of({ data: { content: [] } })),
  cancelReceipt: jest.fn(),
  shareReceipt: jest.fn(),
};

const mockReceiptService = {
    updateReceiptStatus: jest.fn(),
};

const mockIntermediaryService = {
    getAgentById: jest.fn(),
};

const mockRouter = {
  navigate: jest.fn(),
};

const mockAuthService = {
  getCurrentUser: jest.fn().mockReturnValue(mockUser),
};

describe('ReceiptManagementComponent', () => {
  let component: ReceiptManagementComponent;
  let fixture: ComponentFixture<ReceiptManagementComponent>;

  beforeEach(async () => {
    // Reset all mocks before each test to ensure isolation
    jest.clearAllMocks();

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
        { provide: ClientService, useValue: {} }, // Mocked but not used in tests below
        { provide: ReceiptService, useValue: mockReceiptService },
        { provide: TranslateService, useValue: { instant: (key: string) => key, }, },
      ],
      // Use NO_ERRORS_SCHEMA to ignore unknown elements like <p-table>
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ReceiptManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges(); // This will run ngOnInit
    expect(component).toBeTruthy();
  });

  describe('ngOnInit and Tab State Handling', () => {
    it('should default to the "Cancellation" tab when no session flag is present', () => {
      mockSessionStorageService.getItem.mockReturnValue(null);
      const cancelClickedSpy = jest.spyOn(component, 'cancelClicked');

      fixture.detectChanges();

      expect(cancelClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isCancellation).toBe(true);
    });

    it('should switch to the "Printing" tab when the session flag is present', () => {
      mockSessionStorageService.getItem.mockImplementation((key: string) => (key === 'printTabStatus' ? 'true' : null));
      const isPrintingClickedSpy = jest.spyOn(component, 'isPrintingClicked');

      fixture.detectChanges();

      expect(isPrintingClickedSpy).toHaveBeenCalledTimes(1);
      expect(component.isPrinting).toBe(true);
    });

    it('should remove the "printTabStatus" flag from session storage after reading it', () => {
      mockSessionStorageService.getItem.mockReturnValue('true');
      fixture.detectChanges();
      expect(mockSessionStorageService.removeItem).toHaveBeenCalledWith('printTabStatus');
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
      expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNumber', JSON.stringify(123));
      expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('reprinted', 'no');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });

    it('rePrintReceipt should set session storage with "reprinted" flag and navigate', () => {
      component.rePrintReceipt(0, 456);
      expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('receiptNumber', JSON.stringify(456));
      expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('reprinted', 'yes');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/receipt-print-preview']);
    });

    it('onClickPreview should prepare share data and navigate', () => {
        component.cancelForm.patchValue({ shareMethod: 'EMAIL', email: 'test@test.com' });
        component.onClickPreview();
        expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('shareType', 'EMAIL');
        expect(mockSessionStorageService.setItem).toHaveBeenCalledWith('recipient', 'test@test.com');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/preview-receipt']);
    });
  });

  describe('Receipt Sharing Modal (`postClientDetails`)', () => {
    beforeEach(() => {
        component.receipt_no = 'R123';
        component.cancelForm.patchValue({ shareMethod: 'WHATSAPP', phone: '123456789' });
    });

    it('should share receipt and update print status when printStatus is "N"', () => {
        component.printStatus = 'N';
        mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));
        mockReceiptService.updateReceiptStatus.mockReturnValue(of({})); // Mock the inner call

        component.postClientDetails();

        expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalled();
        expect(mockReceiptService.updateReceiptStatus).toHaveBeenCalledWith([123]);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success', 'Success');
    });

    it('should share receipt but NOT update print status when printStatus is "Y"', () => {
        component.printStatus = 'Y';
        mockReceiptManagementService.shareReceipt.mockReturnValue(of({ msg: 'Success' }));

        component.postClientDetails();

        expect(mockReceiptManagementService.shareReceipt).toHaveBeenCalled();
        expect(mockReceiptService.updateReceiptStatus).not.toHaveBeenCalled();
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('success', 'Success');
    });

    it('should display an error if sharing fails', () => {
        mockReceiptManagementService.shareReceipt.mockReturnValue(throwError(() => ({ error: { msg: 'Failure' } })));
        component.postClientDetails();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
    });
  });

  describe('Receipt Cancellation Modal', () => {
    it('should display an error if form is invalid on validateFields', () => {
        component.initializeForm(); // Ensure form is created
        component.cancelForm.patchValue({ remarks: '' }); // Make it invalid
        
        component.validateFields();

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('Error', 'Please fill all the required fields');
        expect(mockReceiptManagementService.cancelReceipt).not.toHaveBeenCalled();
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