import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { NewBankingProcessComponent } from './new-banking-process.component';
import { GlobalMessagingService } from '../../../../shared/services/messaging/global-messaging.service';
import { BankingProcessService } from '../../services/banking-process.service';
import { SessionStorageService } from '../../../../shared/services/session-storage/session-storage.service';
import { AuthService } from '../../../../shared/services/auth.service';
import { ReceiptDTO } from '../../data/banking-process-dto';
import { UsersDTO } from '../../data/receipting-dto';
import { EventEmitter, NO_ERRORS_SCHEMA } from '@angular/core';

// --- Mock Data ---
const mockReceipts: ReceiptDTO[] = [
  { receiptNo: 101, receivedFrom: 'Customer A', receiptAmount: 100 } as ReceiptDTO,
  { receiptNo: 102, receivedFrom: 'Customer B', receiptAmount: 200 } as ReceiptDTO,
];

const mockUsers: UsersDTO[] = [
  { id: 1, username: 'user_one', name: 'User One' } as UsersDTO,
  { id: 2, username: 'user_two', name: 'User Two' } as UsersDTO,
];

// --- Jest Mocks ---

jest.mock('../../data/fms-step.json', () => ({
  __esModule: true, 
  default: {
    bankingSteps: [
      { number: 1, title: 'Mock Banking Step 1' },
      { number: 2, title: 'Mock Banking Step 2' },
    ],
    receiptingSteps: [] 
  }
}));
// --- Test Suite ---
describe('NewBankingProcessComponent', () => {
  let component: NewBankingProcessComponent;
  let fixture: ComponentFixture<NewBankingProcessComponent>;
  let mockBankingService: any;
  let mockGlobalMessagingService: any;
  let mockRouter: any;
  let mockTranslateService: any;
  let mockSessionStorageService: any;
  let mockAuthService: any;

  beforeEach(async () => {
    // --- Mock Definitions ---
   const mockTranslateService = {
  instant: jest.fn((key) => key),
  get: jest.fn((key) => of(key)),
  onLangChange: new EventEmitter(),
  onTranslationChange: new EventEmitter(),
  onDefaultLangChange: new EventEmitter()
};
    mockRouter = {
      navigate: jest.fn(),
    };
    mockGlobalMessagingService = {
      displayErrorMessage: jest.fn(),
      displaySuccessMessage: jest.fn(),
    };
   const mockBankingService = {
  getPaymentMethods: jest.fn().mockReturnValue(of({ data: [{ code: 'CASH' }] })),
  getReceipts: jest.fn().mockReturnValue(of({
    success: true,
    data: {
      content: mockReceipts 
    }
  })),

  getActiveUsers: jest.fn().mockReturnValue(of({ content: mockUsers })),
  assignUser: jest.fn().mockReturnValue(of({ msg: 'Assigned successfully' })),
};
    mockSessionStorageService = {
      getItem: jest.fn((key) => {
        if (key === 'defaultOrg') return JSON.stringify({ id: 1, name: 'Default Org' });
        return null;
      }),
    };
    mockAuthService = {
      getCurrentUser: jest.fn().mockReturnValue({ code: 999 }),
    };

    await TestBed.configureTestingModule({
      declarations: [NewBankingProcessComponent],
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: Router, useValue: mockRouter },
        { provide: GlobalMessagingService, useValue: mockGlobalMessagingService },
        { provide: BankingProcessService, useValue: mockBankingService },
        { provide: SessionStorageService, useValue: mockSessionStorageService },
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA], 
    }).compileComponents();

    fixture = TestBed.createComponent(NewBankingProcessComponent);
    component = fixture.componentInstance;
    jest.clearAllMocks();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization (ngOnInit)', () => {
    it('should initialize forms and fetch initial data', () => {
      expect(component.rctsRetrievalForm).toBeDefined();
      expect(component.usersForm).toBeDefined();
      expect(mockBankingService.getPaymentMethods).toHaveBeenCalledTimes(1);
      expect(mockBankingService.getActiveUsers).toHaveBeenCalledTimes(1);
    });

    it('should fetch active users and populate the users array', () => {
      expect(component.users).toEqual(mockUsers);
      expect(component.filteredUsers).toEqual(mockUsers);
    });
  });

  describe('Receipt Retrieval Logic', () => {
    beforeEach(() => {
        component.rctsRetrievalForm.setValue({
            startDate: '2023-01-01',
            endDate: '2023-01-31',
            paymentMethod: 'CASH',
        });
    });

    it('should filter out the "actions" column when payment mode is CASH', () => {
        component.onClickRetrieveRcts();
        expect(component.selectedColumns.find(c => c.field === 'actions')).toBeUndefined();
        expect(mockBankingService.getReceipts).toHaveBeenCalled();
    });

    it('should include the "actions" column for non-CASH payment modes', () => {
        component.rctsRetrievalForm.patchValue({ paymentMethod: 'CHEQUE' });
        component.onClickRetrieveRcts();
        expect(component.selectedColumns.find(c => c.field === 'actions')).toBeDefined();
        expect(mockBankingService.getReceipts).toHaveBeenCalled();
    });
  });

 
describe('onAssignSubmit', () => {
  beforeEach(() => {
    component.selectedReceipts = [mockReceipts[0], mockReceipts[1]];
    component.usersForm.patchValue({ 
      user: mockUsers[0].id, 
      comment: 'Assigning this' 
    });
component.assignDialogVisible = true;
    fixture.detectChanges(); 
  });
    it('should not submit if the form is invalid', () => {
        component.usersForm.get('user')?.setValue(''); 
        component.onAssignSubmit();
        expect(mockBankingService.assignUser).not.toHaveBeenCalled();
    });

    it('should call bankingService.assignUser with the correct payload', () => {
        component.onAssignSubmit();
        const expectedPayload = {
            userId: mockUsers[0].id,
            receiptNumbers: [101, 102],
        };
        expect(mockBankingService.assignUser).toHaveBeenCalledWith(expectedPayload);
    });

    it('should navigate, show success message, and close modal on successful assignment', () => {
        component.onAssignSubmit();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/fms/process-batch']);
        expect(mockGlobalMessagingService.displaySuccessMessage).toHaveBeenCalledWith('', 'Assigned successfully');
        expect(component.assignDialogVisible).toBe(false); // Modal closes on success
    });

    it('should handle API errors during assignment and keep the modal open', () => {
        const errorResponse = { error: { msg: 'Assignment failed' } };
        mockBankingService.assignUser.mockReturnValue(throwError(() => errorResponse));

        component.onAssignSubmit();

        expect(mockGlobalMessagingService.displayErrorMessage).toHaveBeenCalledWith('fms.errorMessage', 'Assignment failed');
        expect(component.assignDialogVisible).toBe(true); 
    });
  });

  describe('Dialog Workflow', () => {
      it('should open the user selection dialog', () => {
          component.openUserSelectDialog();
          expect(component.userSelectDialogVisible).toBe(true);
      });

      it('should confirm user selection and patch the form', () => {
        const selectedUser = mockUsers[1];
        component.tempSelectedUser = selectedUser;
        component.confirmUserSelection();
        expect(component.selectedUserForAssignment).toEqual(selectedUser);
        expect(component.usersForm.get('user')?.value).toBe(selectedUser.id);
        expect(component.userSelectDialogVisible).toBe(false);
      });
  });
});