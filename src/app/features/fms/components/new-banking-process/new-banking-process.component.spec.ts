import { ComponentFixture, TestBed } from '@angular/core/testing';
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

// --- Mock Data ---
const mockReceipts: ReceiptDTO[] = [
  { receiptNo: 101, receivedFrom: 'Customer A' } as ReceiptDTO,
  { receiptNo: 102, receivedFrom: 'Customer B' } as ReceiptDTO,
];
const mockStaff: StaffDto[] = [
  { id: 1, username: 'user_one', name: 'User One' } as StaffDto,
  { id: 2, username: 'user_two', name: 'User Two' } as StaffDto,
];

// --- Jest Mocks ---
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
  let mockSessionStorageService: any;

  beforeEach(async () => {
    const mockTranslateService = {
      instant: jest.fn((key) => key), get: jest.fn((key) => of(key)),
      onLangChange: new EventEmitter(), onTranslationChange: new EventEmitter(),
      onDefaultLangChange: new EventEmitter(),
    };
    mockBankingService = {
      getPaymentMethods: jest.fn().mockReturnValue(of({ data: [{ code: 'CASH' }] })),
      getReceipts: jest.fn().mockReturnValue(of({ success: true, data: { content: mockReceipts } })),
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
    mockSessionStorageService = {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent],
      imports: [ReactiveFormsModule, FormsModule, TranslateModule.forRoot(), CheckboxModule, DialogModule, TableModule],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: BankingProcessService, useValue: mockBankingService },
        { provide: StaffService, useValue: mockStaffService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AuthService, useValue: { getCurrentUser: jest.fn().mockReturnValue({ code: 999 }) } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize correctly', () => {
    fixture.detectChanges(); // ngOnInit
    expect(component).toBeTruthy();
    expect(component.rctsRetrievalForm).toBeDefined();
    expect(component.usersForm).toBeDefined();
    expect(mockStaffService.getStaff).toHaveBeenCalledTimes(1);
  });

  describe('Initialization (ngOnInit)', () => {
    it('should call all required setup methods', () => {
        jest.spyOn(component, 'initiateRctsForm');
        jest.spyOn(component, 'fetchPaymentsModes');
        jest.spyOn(component, 'fetchActiveUsers');
        
        fixture.detectChanges(); // ngOnInit

        expect(component.initiateRctsForm).toHaveBeenCalled();
        expect(component.fetchPaymentsModes).toHaveBeenCalled();
        expect(component.fetchActiveUsers).toHaveBeenCalled();
        expect(mockSessionStorageService.getItem).toHaveBeenCalledWith('selectedOrg');
    });
  });

  describe('Receipt Retrieval (onClickRetrieveRcts)', () => {
    beforeEach(() => {
        fixture.detectChanges();
        jest.spyOn(component, 'fetchReceipts');
    });

    it('should show an error and NOT fetch receipts if the form is invalid', () => {
        component.rctsRetrievalForm.patchValue({ startDate: '' }); // Make form invalid
        component.onClickRetrieveRcts();
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('', 'Please fill the required fields');
        expect(component.fetchReceipts).not.toHaveBeenCalled();
    });

    it('should set isCashSelected to true and call fetchReceipts if payment method is CASH', () => {
        component.rctsRetrievalForm.patchValue({ startDate: '2023-01-01', endDate: '2023-01-31', paymentMethod: 'CASH' });
        component.onClickRetrieveRcts();
        expect(component.isCashSelected).toBe(true);
        expect(component.fetchReceipts).toHaveBeenCalled();
    });
  });

  describe('Assignment and Dialog Workflow', () => {
    beforeEach(() => {
        fixture.detectChanges();
        component.selectedReceipts = [mockReceipts[0]];
        component.usersForm.patchValue({ user: mockStaff[0].id });
    });

    it('should open the assign modal and reset reAssign flag', () => {
        component.reAssign = true; // Set a pre-existing state
        component.openAssignModal();
        expect(component.assignDialogVisible).toBe(true);
        expect(component.reAssign).toBe(false);
    });

    it('should confirm user selection, patch the form, and close the user select dialog', () => {
        component.tempSelectedUser = mockStaff[1];
        component.openUserSelectDialog(); // to make it visible
        
        component.confirmUserSelection();

        expect(component.selectedUserForAssignment).toEqual(mockStaff[1]);
        expect(component.usersForm.get('user')?.value).toBe(mockStaff[1].id);
        expect(component.userSelectDialogVisible).toBe(false);
    });

    it('should call bankingService.assignUser and refresh data on success', () => {
        jest.spyOn(component, 'fetchReceipts');
        component.onAssignSubmit();
        expect(mockBankingService.assignUser).toHaveBeenCalled();
        expect(component.fetchReceipts).toHaveBeenCalled();
    });
  });
  
  describe('reAssignUser Workflow', () => {
      beforeEach(() => {
          fixture.detectChanges();
          component.usersForm.patchValue({ user: mockStaff[1].id });
      });

      it('should open the modal in re-assign mode', () => {
          const receiptToReassign = { receiptNo: 101, batchAssignmentUserId: 99 } as ReceiptDTO;
          component.openReAssignModal(receiptToReassign);

          expect(component.assignDialogVisible).toBe(true);
          expect(component.reAssign).toBe(true);
          expect(component.selectedRctObj).toEqual(receiptToReassign);
      });

      it('should call bankingService.reAssignUser with the correct payload', () => {
          const receiptToReassign = { receiptNo: 101, batchAssignmentUserId: 99 } as ReceiptDTO;
          component.selectedRctObj = receiptToReassign; // Simulate opening the modal
          
          component.reAssignUser();
          
          const expectedPayload = { fromUserId: 99, toUserId: mockStaff[1].id, receiptNumbers: [101] };
          expect(mockBankingService.reAssignUser).toHaveBeenCalledWith(expectedPayload);
          expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalled();
      });
  });

  describe('deAssign', () => {
    beforeEach(() => {
        fixture.detectChanges();
        jest.spyOn(component, 'fetchReceipts');
    });

    it('should call bankingService.deAssign and refresh data on success', () => {
        component.deAssignRct({ receiptNumbers: [101] });
        expect(mockBankingService.deAssign).toHaveBeenCalledWith({ receiptNumbers: [101] });
        expect(component.fetchReceipts).toHaveBeenCalled();
    });

    it('should handle API errors during de-assignment', () => {
        mockBankingService.deAssign.mockReturnValue(throwError(() => ({})));
        component.deAssignRct({ receiptNumbers: [101] });
        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalled();
        expect(component.fetchReceipts).not.toHaveBeenCalled();
    });
  });

  describe('Filtering Logic', () => {
      beforeEach(() => {
          fixture.detectChanges();
          component.receiptData = [
              { receivedFrom: 'Apple Inc', receiptAmount: 1000 },
              { receivedFrom: 'Banana Co', receiptAmount: 200 },
          ] as ReceiptDTO[];
          component.users = [
              { username: 'jdoe', name: 'John Doe' },
              { username: 'asmith', name: 'Adam Smith' },
          ] as StaffDto[];
      });

      it('should filter receipts by string field', () => {
          const event = { target: { value: 'apple' } };
          component.filter(event, 'receivedFrom');
          expect(component.filteredReceipts.length).toBe(1);
          expect(component.filteredReceipts[0].receivedFrom).toBe('Apple Inc');
      });

      it('should filter users by username', () => {
          const event = { target: { value: 'jdo' } };
          component.filterUsers(event, 'username');
          expect(component.filteredUsers.length).toBe(1);
          expect(component.filteredUsers[0].username).toBe('jdoe');
      });
  });
});