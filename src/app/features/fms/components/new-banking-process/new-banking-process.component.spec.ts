import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NewBankingProcessComponent } from './new-banking-process.component';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { BankingProcessService } from '../../services/banking-process.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ReceiptDTO } from '../../data/banking-process-dto';
import { StaffDto } from '../../../../features/entities/data/StaffDto';
import { StaffService } from '../../../../features/entities/services/staff/staff.service';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ReceiptManagementService } from '../../services/receipt-management.service';
import { ReceiptService } from '../../services/receipt.service';
import * as bootstrap from 'bootstrap';
const mockReceipts: ReceiptDTO[] = [
  { receiptNo: 101, receivedFrom: 'Customer A' } as ReceiptDTO,
];
const mockStaff: StaffDto[] = [
  { id: 1, username: 'user_one', name: 'User One' } as StaffDto,
];

jest.mock('../../data/fms-step.json', () => ({
  __esModule: true,
  default: { bankingSteps: [] },
}));

describe('NewBankingProcessComponent', () => {
  let component: NewBankingProcessComponent;
  let fixture: ComponentFixture<NewBankingProcessComponent>;

  let mockBankingService: any;
  let mockStaffService: any;
  let mockGlobalMessagingService: any;
  let mockReceiptManagementService: any;
  let mockReceiptService: any;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: jest.fn((key) => key),
      get: jest.fn((key) => of(key)),
      onLangChange: new EventEmitter(),
      onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };
    mockBankingService = {
      getPaymentMethods: jest
        .fn()
        .mockReturnValue(of({ data: [{ code: 'CASH' }] })),
      getReceipts: jest
        .fn()
        .mockReturnValue(
          of({ success: true, data: { content: mockReceipts } })
        ),
      assignUser: jest.fn().mockReturnValue(of({ msg: 'Assigned' })),
      deAssign: jest.fn().mockReturnValue(of({ msg: 'De-assigned' })),
      reAssignUser: jest.fn().mockReturnValue(of({ msg: 'Re-assigned' })),
    };
    mockStaffService = {
      getStaff: jest.fn().mockReturnValue(of({ content: mockStaff })),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };
    mockReceiptManagementService = {
      getGlAccounts: jest.fn().mockReturnValue(of({ data: { content: [] } })),
    };
    mockReceiptService = {
      uploadFiles: jest.fn().mockReturnValue(of({ uploadStatus: 'Success' })),
    };

    await TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslateModule.forRoot(),
        CheckboxModule,
        DialogModule,
        TableModule,
      ],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        {
          provide: GlobalMessagingService,
          useValue: mockGlobalMessagingService,
        },
        { provide: BankingProcessService, useValue: mockBankingService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: SessionStorageService, useValue: { getItem: jest.fn() } },
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: jest.fn().mockReturnValue({ code: 999 }),
          },
        },
        {
          provide: ReceiptManagementService,
          useValue: mockReceiptManagementService,
        },
        { provide: ReceiptService, useValue: mockReceiptService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize correctly', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.rctsRetrievalForm).toBeDefined();
    expect(component.usersForm).toBeDefined();
    expect(component.depositForm).toBeDefined();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should call all required setup methods', () => {
      fixture.detectChanges();
      expect(mockStaffService.getStaff).toHaveBeenCalled();
      expect(mockBankingService.getPaymentMethods).toHaveBeenCalled();
      expect(mockReceiptManagementService.getGlAccounts).toHaveBeenCalled();
    });
  });

  describe('Deposit Modal and File Upload', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should open the deposit modal and patch the amount', () => {
      jest
        .spyOn(bootstrap, 'Modal')
        .mockImplementation(() => ({ show: jest.fn() } as any));
      const testReceipt = { receiptAmount: 500 } as ReceiptDTO;
      component.openDepositModal(testReceipt);
      expect(component.depositForm.get('amount')?.value).toBe(500);
    });

    it('should reject a file larger than 5MB', () => {
      const largeFile = new File([''], 'large.pdf');
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 });

      component.onFileSelected({ target: { files: [largeFile] } });

      expect(component.uploadedFile).toBeNull();
      expect(
        mockGlobalMessagingService.displayErrorMessage
      ).toHaveBeenCalledWith(
        'File Too Large',
        (expect as any).stringContaining('exceeds the 5MB size limit')
      );
    });

    it('should accept a file via drop event', () => {
      const validFile = new File([''], 'valid.pdf');
      Object.defineProperty(validFile, 'size', { value: 4 * 1024 * 1024 });
      const mockDataTransfer = {
        files: [validFile],
        clearData: jest.fn(),
      };
      const mockDropEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
        dataTransfer: mockDataTransfer,
      };
      component.onDrop(mockDropEvent as any);
      expect(mockDropEvent.preventDefault).toHaveBeenCalled();
      expect(mockDropEvent.stopPropagation).toHaveBeenCalled();
      expect(component.uploadedFile).toEqual(validFile);
      expect(component.maximumFiles).toBe(true);
      expect(mockDataTransfer.clearData).toHaveBeenCalled();
    });
    it('should show an error if postFile is called without a slip number', () => {
      component.uploadedFile = new File([''], 'test.pdf');
      component.depositForm.patchValue({ slipNumber: '' });
      component.postFile();
      expect(
        mockGlobalMessagingService.displayErrorMessage
      ).toHaveBeenCalledWith('Error', 'please enter the slip Number first!');
      expect(mockReceiptService.uploadFiles).not.toHaveBeenCalled();
    });

    it('should read the file and call uploadFiles on postFile', fakeAsync(() => {
      const testFile = new File(['test'], 'test.pdf', {
        type: 'application/pdf',
      });
      const mockReader = {
        onloadend: () => {},
        readAsDataURL: jest.fn().mockImplementation(function () {
          this.onloadend();
        }),
        result: 'data:application/pdf;base64,dGVzdA==',
      };
      jest
        .spyOn(window, 'FileReader')
        .mockImplementation(() => mockReader as any);
      component.uploadedFile = testFile;
      component.depositForm.patchValue({ slipNumber: 'SLIP123', amount: 100 });
      component.postFile();
      tick();
      expect(mockReceiptService.uploadFiles).toHaveBeenCalled();
      expect(
        mockGlobalMessagingService.displaySuccessMessage
      ).toHaveBeenCalledWith('', 'Success');
    }));

    it('should handle API errors during file upload', fakeAsync(() => {
      const testFile = new File([''], 'test.pdf');
      mockReceiptService.uploadFiles.mockReturnValue(
        throwError(() => ({ error: { msg: 'Upload failed' } }))
      );
      jest.spyOn(window, 'FileReader').mockImplementation(
        () =>
          ({
            onloadend: () => {},
            readAsDataURL: jest.fn().mockImplementation(function () {
              this.onloadend();
            }),
            result: 'data:application/pdf;base64,dGVzdA==',
          } as any)
      );
      component.uploadedFile = testFile;
      component.depositForm.patchValue({ slipNumber: 'SLIP123' });
      component.postFile();
      tick();
      expect(
        mockGlobalMessagingService.displayErrorMessage
      ).toHaveBeenCalledWith('fms.errorMessage', 'Upload failed');
    }));
  });

  describe('Assignment and Re-assignment', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call bankingService.assignUser and refresh data on success', () => {
      component.selectedReceipts = [mockReceipts[0]];
      component.usersForm.patchValue({ user: mockStaff[0].id });
      jest.spyOn(component, 'fetchReceipts');
      component.onAssignSubmit();
      expect(mockBankingService.assignUser).toHaveBeenCalled();
      expect(component.fetchReceipts).toHaveBeenCalled();
    });

    it('should call bankingService.reAssignUser with the correct payload', () => {
      const receiptToReassign = {
        receiptNo: 101,
        batchAssignmentUserId: 99,
      } as ReceiptDTO;
      component.selectedRctObj = receiptToReassign;
      component.usersForm.patchValue({ user: mockStaff[0].id });
      component.reAssignUser();
      const expectedPayload = {
        fromUserId: 99,
        toUserId: mockStaff[0].id,
        receiptNumbers: [101],
      };
      expect(mockBankingService.reAssignUser).toHaveBeenCalledWith(
        expectedPayload
      );
    });
  });

  describe('deAssign', () => {
    beforeEach(() => {
      fixture.detectChanges();
      jest.spyOn(component, 'fetchReceipts');
    });

    it('should call bankingService.deAssign and refresh data on success', () => {
      component.deAssignRct({ receiptNumbers: [101] });
      expect(mockBankingService.deAssign).toHaveBeenCalledWith({
        receiptNumbers: [101],
      });
      expect(component.fetchReceipts).toHaveBeenCalled();
    });
  });
});
